import { SubscriptionRulesService, DowngradeImpact } from './subscriptionRules'

export interface DowngradeOperation {
  userId: string
  currentTier: string
  newTier: string
  strategy: 'soft' | 'hard' | 'grace'
  personasToLock: string[]
  personasToKeep: string[]
  storageImpact: {
    currentUsage: number
    newLimit: number
    willExceed: boolean
  }
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
  errorMessage?: string
}

export interface PersonaAccessControl {
  id: string
  canEdit: boolean
  canUseInPlanning: boolean
  canShare: boolean
  accessStatus: 'active' | 'locked' | 'grace_period' | 'archived'
  lockedReason?: string
  lockedAt?: Date
}

export class DowngradeService {
  /**
   * Execute a downgrade operation based on the selected strategy
   */
  static async executeDowngrade(operation: DowngradeOperation): Promise<{
    success: boolean
    message: string
    affectedPersonas: number
    restoredPersonas?: number
  }> {
    try {
      // Validate the operation
      const validation = this.validateDowngradeOperation(operation)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      // Execute based on strategy
      switch (operation.strategy) {
        case 'soft':
          return await this.executeSoftDowngrade(operation)
        case 'hard':
          return await this.executeHardDowngrade(operation)
        case 'grace':
          return await this.executeGraceDowngrade(operation)
        default:
          throw new Error(`Unknown strategy: ${operation.strategy}`)
      }
    } catch (error) {
      console.error('Downgrade execution failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        affectedPersonas: 0
      }
    }
  }

  /**
   * Soft downgrade: Lock excess personas to read-only
   */
  private static async executeSoftDowngrade(operation: DowngradeOperation): Promise<{
    success: boolean
    message: string
    affectedPersonas: number
  }> {
    try {
      // Update personas to locked status
      const updatePromises = operation.personasToLock.map(personaId =>
        this.updatePersonaAccessStatus(personaId, {
          accessStatus: 'locked',
          lockedReason: 'downgrade',
          lockedAt: new Date()
        })
      )

      await Promise.all(updatePromises)

      return {
        success: true,
        message: `Successfully locked ${operation.personasToLock.length} persona(s) to read-only mode. They can be restored when you upgrade again.`,
        affectedPersonas: operation.personasToLock.length
      }
    } catch (error) {
      throw new Error(`Soft downgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Hard downgrade: Delete excess personas permanently
   */
  private static async executeHardDowngrade(operation: DowngradeOperation): Promise<{
    success: boolean
    message: string
    affectedPersonas: number
  }> {
    try {
      // Delete personas permanently
      const deletePromises = operation.personasToLock.map(personaId =>
        this.deletePersona(personaId)
      )

      await Promise.all(deletePromises)

      return {
        success: true,
        message: `Successfully deleted ${operation.personasToLock.length} persona(s) permanently. This action cannot be undone.`,
        affectedPersonas: operation.personasToLock.length
      }
    } catch (error) {
      throw new Error(`Hard downgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Grace period downgrade: Mark for future locking
   */
  private static async executeGraceDowngrade(operation: DowngradeOperation): Promise<{
    success: boolean
    message: string
    affectedPersonas: number
  }> {
    try {
      // Mark personas for future locking with grace period
      const gracePeriodDate = new Date()
      gracePeriodDate.setDate(gracePeriodDate.getDate() + 30) // 30 days from now

      const updatePromises = operation.personasToLock.map(personaId =>
        this.updatePersonaAccessStatus(personaId, {
          accessStatus: 'grace_period',
          lockedReason: 'downgrade_grace',
          lockedAt: gracePeriodDate
        })
      )

      await Promise.all(updatePromises)

      return {
        success: true,
        message: `Successfully marked ${operation.personasToLock.length} persona(s) for grace period. They will be locked in 30 days unless you upgrade.`,
        affectedPersonas: operation.personasToLock.length
      }
    } catch (error) {
      throw new Error(`Grace period downgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Restore personas after upgrade
   */
  static async restorePersonasAfterUpgrade(userId: string): Promise<{
    success: boolean
    message: string
    restoredCount: number
  }> {
    try {
      // Find all locked personas for this user
      const lockedPersonas = await this.getPersonasByAccessStatus(userId, ['locked', 'grace_period'])
      
      if (lockedPersonas.length === 0) {
        return {
          success: true,
          message: 'No locked personas found to restore.',
          restoredCount: 0
        }
      }

      // Restore all locked personas
      const restorePromises = lockedPersonas.map(persona =>
        this.updatePersonaAccessStatus(persona.id, {
          accessStatus: 'active',
          lockedReason: undefined,
          lockedAt: undefined
        })
      )

      await Promise.all(restorePromises)

      return {
        success: true,
        message: `Successfully restored ${lockedPersonas.length} persona(s) to full access.`,
        restoredCount: lockedPersonas.length
      }
    } catch (error) {
      throw new Error(`Restore operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get persona access control information
   */
  static async getPersonaAccessControl(
    personaId: string,
    userTier: string,
    isWithinLimit: boolean
  ): Promise<PersonaAccessControl> {
    try {
      const persona = await this.getPersonaById(personaId)
      if (!persona) {
        throw new Error('Persona not found')
      }

      const isActive = persona.accessStatus === 'active' && isWithinLimit
      const isLocked = persona.accessStatus === 'locked' || !isWithinLimit
      const isGracePeriod = persona.accessStatus === 'grace_period'

      return {
        id: personaId,
        accessStatus: isActive ? 'active' : isGracePeriod ? 'grace_period' : 'locked',
        lockedReason: persona.lockedReason,
        lockedAt: persona.lockedAt,
        canEdit: isActive,
        canUseInPlanning: isActive,
        canShare: isActive && userTier !== 'free'
      }
    } catch (error) {
      console.error('Error getting persona access control:', error)
      // Return restrictive access on error
      return {
        id: personaId,
        accessStatus: 'locked',
        canEdit: false,
        canUseInPlanning: false,
        canShare: false
      }
    }
  }

  /**
   * Validate a downgrade operation
   */
  private static validateDowngradeOperation(operation: DowngradeOperation): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic validation
    if (!operation.userId) {
      errors.push('User ID is required')
    }

    if (!operation.currentTier || !operation.newTier) {
      errors.push('Current and new tier are required')
    }

    if (operation.currentTier === operation.newTier) {
      errors.push('Cannot downgrade to the same tier')
    }

    if (!['soft', 'hard', 'grace'].includes(operation.strategy)) {
      errors.push('Invalid strategy specified')
    }

    // Business rule validation
    if (operation.strategy === 'hard' && operation.personasToLock.length > 0) {
      warnings.push('Hard downgrade will permanently delete personas - this cannot be undone')
    }

    if (operation.storageImpact.willExceed) {
      warnings.push('Storage usage exceeds new tier limit - some features may be restricted')
    }

    // Check if user has active memorial plans (would require additional data)
    // This is a placeholder for future business rule implementation

    const isValid = errors.length === 0

    return { isValid, errors, warnings }
  }

  /**
   * Update persona access status in database
   */
  private static async updatePersonaAccessStatus(
    personaId: string,
    updates: Partial<PersonaAccessControl>
  ): Promise<void> {
    // This would integrate with your database layer
    // For now, we'll simulate the operation
    console.log(`Updating persona ${personaId} with:`, updates)
    
    // TODO: Implement actual database update
    // Example:
    // await db.personas.update({
    //   where: { id: personaId },
    //   data: {
    //     access_status: updates.accessStatus,
    //     locked_reason: updates.lockedReason,
    //     locked_at: updates.lockedAt,
    //     updated_at: new Date()
    //   }
    // })
  }

  /**
   * Delete persona from database
   */
  private static async deletePersona(personaId: string): Promise<void> {
    // This would integrate with your database layer
    console.log(`Deleting persona ${personaId}`)
    
    // TODO: Implement actual database deletion
    // Example:
    // await db.personas.delete({
    //   where: { id: personaId }
    // })
  }

  /**
   * Get personas by access status
   */
  private static async getPersonasByAccessStatus(
    userId: string,
    statuses: string[]
  ): Promise<Array<{ id: string; accessStatus: string; lockedReason?: string; lockedAt?: Date }>> {
    // This would integrate with your database layer
    console.log(`Getting personas for user ${userId} with statuses:`, statuses)
    
    // TODO: Implement actual database query
    // Example:
    // return await db.personas.findMany({
    //   where: {
    //     user_id: userId,
    //     access_status: { in: statuses }
    //   }
    // })
    
    // Placeholder return
    return []
  }

  /**
   * Get persona by ID
   */
  private static async getPersonaById(personaId: string): Promise<{
    accessStatus: string
    lockedReason?: string
    lockedAt?: Date
  } | null> {
    // This would integrate with your database layer
    console.log(`Getting persona ${personaId}`)
    
    // TODO: Implement actual database query
    // Example:
    // return await db.personas.findUnique({
    //   where: { id: personaId },
    //   select: {
    //     access_status: true,
    //     locked_reason: true,
    //     locked_at: true
    //   }
    // })
    
    // Placeholder return
    return null
  }

  /**
   * Schedule grace period cleanup (run daily via cron job)
   */
  static async cleanupExpiredGracePeriods(): Promise<{
    success: boolean
    processedCount: number
    errors: string[]
  }> {
    try {
      const errors: string[] = []
      let processedCount = 0

      // Find personas with expired grace periods
      const expiredPersonas = await this.getExpiredGracePeriodPersonas()
      
      for (const persona of expiredPersonas) {
        try {
          await this.updatePersonaAccessStatus(persona.id, {
            accessStatus: 'locked',
            lockedReason: 'grace_period_expired',
            lockedAt: new Date()
          })
          processedCount++
        } catch (error) {
          errors.push(`Failed to process persona ${persona.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      return {
        success: errors.length === 0,
        processedCount,
        errors
      }
    } catch (error) {
      return {
        success: false,
        processedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      }
    }
  }

  /**
   * Get personas with expired grace periods
   */
  private static async getExpiredGracePeriodPersonas(): Promise<Array<{ id: string }>> {
    // This would integrate with your database layer
    console.log('Getting expired grace period personas')
    
    // TODO: Implement actual database query
    // Example:
    // return await db.personas.findMany({
    //   where: {
    //     access_status: 'grace_period',
    //     locked_at: { lte: new Date() }
    //   },
    //   select: { id: true }
    // })
    
    // Placeholder return
    return []
  }
}

export interface SubscriptionTier {
  name: string
  maxPersonas: number
  maxStorageMB: number
  aiFeatures: boolean
  familyCollaboration: boolean
  whiteLabel: boolean
  prioritySupport: boolean
  monthlyPrice: number
  yearlyPrice: number
}

export interface PersonaAccessStatus {
  id: string
  accessStatus: 'active' | 'locked' | 'grace_period' | 'archived'
  lockedReason?: string
  priorityOrder: number
  canEdit: boolean
  canUseInPlanning: boolean
  canShare: boolean
}

export interface DowngradeImpact {
  totalPersonas: number
  accessiblePersonas: number
  lockedPersonas: number
  personasToLock: Array<{
    id: string
    name: string
    reason: string
    priorityOrder: number
  }>
  personasToKeep: Array<{
    id: string
    name: string
    reason: string
  }>
  storageImpact: {
    currentUsage: number
    newLimit: number
    willExceed: boolean
  }
}

export class SubscriptionRulesService {
  private static readonly TIERS: Record<string, SubscriptionTier> = {
    free: {
      name: 'Free',
      maxPersonas: 1,
      maxStorageMB: 100,
      aiFeatures: false,
      familyCollaboration: false,
      whiteLabel: false,
      prioritySupport: false,
      monthlyPrice: 0,
      yearlyPrice: 0
    },
    premium: {
      name: 'Premium',
      maxPersonas: 5,
      maxStorageMB: 1000,
      aiFeatures: true,
      familyCollaboration: true,
      whiteLabel: false,
      prioritySupport: false,
      monthlyPrice: 19.99,
      yearlyPrice: 199.99
    },
    religious: {
      name: 'Religious & Cultural',
      maxPersonas: 25,
      maxStorageMB: 5000,
      aiFeatures: true,
      familyCollaboration: true,
      whiteLabel: false,
      prioritySupport: true,
      monthlyPrice: 49.99,
      yearlyPrice: 499.99
    },
    healthcare: {
      name: 'Healthcare & Enterprise',
      maxPersonas: 50,
      maxStorageMB: 10000,
      aiFeatures: true,
      familyCollaboration: true,
      whiteLabel: true,
      prioritySupport: true,
      monthlyPrice: 99.99,
      yearlyPrice: 999.99
    }
  }

  static getTier(tierName: string): SubscriptionTier | null {
    return this.TIERS[tierName] || null
  }

  static getAllTiers(): SubscriptionTier[] {
    return Object.values(this.TIERS)
  }

  static calculateDowngradeImpact(
    currentTier: string,
    newTier: string,
    personas: Array<{ id: string; name: string; priorityOrder: number; storageUsed: number }>,
    currentStorageUsage: number
  ): DowngradeImpact {
    const currentTierConfig = this.getTier(currentTier)
    const newTierConfig = this.getTier(newTier)

    if (!currentTierConfig || !newTierConfig) {
      throw new Error('Invalid tier configuration')
    }

    const totalPersonas = personas.length
    const accessiblePersonas = Math.min(totalPersonas, newTierConfig.maxPersonas)
    const lockedPersonas = Math.max(0, totalPersonas - newTierConfig.maxPersonas)

    // Sort personas by priority order (highest priority first)
    const sortedPersonas = [...personas].sort((a, b) => b.priorityOrder - a.priorityOrder)

    // Determine which personas to keep active
    const personasToKeep = sortedPersonas.slice(0, accessiblePersonas).map(persona => ({
      id: persona.id,
      name: persona.name,
      reason: 'Within new tier limit'
    }))

    // Determine which personas to lock
    const personasToLock = sortedPersonas.slice(accessiblePersonas).map(persona => ({
      id: persona.id,
      name: persona.name,
      reason: 'Exceeds new tier limit',
      priorityOrder: persona.priorityOrder
    }))

    // Calculate storage impact
    const storageImpact = {
      currentUsage: currentStorageUsage,
      newLimit: newTierConfig.maxStorageMB,
      willExceed: currentStorageUsage > newTierConfig.maxStorageMB
    }

    return {
      totalPersonas,
      accessiblePersonas,
      lockedPersonas,
      personasToLock,
      personasToKeep,
      storageImpact
    }
  }

  static getDowngradeStrategy(strategy: 'soft' | 'hard' | 'grace'): {
    name: string
    description: string
    action: string
    benefits: string[]
    drawbacks: string[]
  } {
    const strategies = {
      soft: {
        name: 'Soft Limit (Recommended)',
        description: 'Keep existing personas but prevent new creation',
        action: 'Lock excess personas to read-only mode',
        benefits: [
          'No data loss',
          'Users can still access memories',
          'Easy to restore with upgrade',
          'Better user experience'
        ],
        drawbacks: [
          'Storage costs continue',
          'May encourage upgrade avoidance'
        ]
      },
      hard: {
        name: 'Hard Limit',
        description: 'Force deletion of excess personas',
        action: 'Delete excess personas permanently',
        benefits: [
          'Immediate cost reduction',
          'Clear tier boundaries',
          'Forces upgrade decisions'
        ],
        drawbacks: [
          'Permanent data loss',
          'Poor user experience',
          'Potential legal issues',
          'Negative brand impact'
        ]
      },
      grace: {
        name: 'Grace Period',
        description: 'Allow temporary access with upgrade prompts',
        action: 'Provide 30-day grace period with warnings',
        benefits: [
          'User-friendly transition',
          'Time to make decisions',
          'Reduces churn risk'
        ],
        drawbacks: [
          'Extended storage costs',
          'Complex implementation',
          'May delay upgrade decisions'
        ]
      }
    }

    return strategies[strategy]
  }

  static generateDowngradeSQL(
    userId: string,
    personasToLock: Array<{ id: string; reason: string }>,
    strategy: 'soft' | 'hard' | 'grace' = 'soft'
  ): string[] {
    const sqlStatements: string[] = []

    if (strategy === 'soft') {
      // Lock excess personas
      personasToLock.forEach(persona => {
        sqlStatements.push(`
          UPDATE personas 
          SET 
            access_status = 'locked',
            locked_at = NOW(),
            locked_reason = 'downgrade',
            updated_at = NOW()
          WHERE id = '${persona.id}' AND user_id = '${userId}';
        `)
      })
    } else if (strategy === 'hard') {
      // Delete excess personas (with cascade to related data)
      personasToLock.forEach(persona => {
        sqlStatements.push(`
          DELETE FROM personas 
          WHERE id = '${persona.id}' AND user_id = '${userId}';
        `)
      })
    } else if (strategy === 'grace') {
      // Mark for future locking with grace period
      personasToLock.forEach(persona => {
        sqlStatements.push(`
          UPDATE personas 
          SET 
            access_status = 'grace_period',
            locked_at = NOW() + INTERVAL '30 days',
            locked_reason = 'downgrade_grace',
            updated_at = NOW()
          WHERE id = '${persona.id}' AND user_id = '${userId}';
        `)
      })
    }

    return sqlStatements
  }

  static getPersonaAccessStatus(
    persona: { id: string; accessStatus: string; lockedReason?: string },
    userTier: string,
    isWithinLimit: boolean
  ): PersonaAccessStatus {
    const isActive = persona.accessStatus === 'active' && isWithinLimit
    const isLocked = persona.accessStatus === 'locked' || !isWithinLimit
    const isGracePeriod = persona.accessStatus === 'grace_period'

    return {
      id: persona.id,
      accessStatus: isActive ? 'active' : isGracePeriod ? 'grace_period' : 'locked',
      lockedReason: persona.lockedReason,
      priorityOrder: 0, // This would come from the persona data
      canEdit: isActive,
      canUseInPlanning: isActive,
      canShare: isActive && userTier !== 'free'
    }
  }

  static validateDowngrade(
    currentTier: string,
    newTier: string,
    userPersonas: number,
    userStorage: number
  ): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate tier transition
    if (currentTier === newTier) {
      errors.push('Cannot downgrade to the same tier')
    }

    const currentTierConfig = this.getTier(currentTier)
    const newTierConfig = this.getTier(newTier)

    if (!currentTierConfig || !newTierConfig) {
      errors.push('Invalid tier configuration')
      return { isValid: false, errors, warnings }
    }

    // Check persona limits
    if (userPersonas > newTierConfig.maxPersonas) {
      warnings.push(`${userPersonas - newTierConfig.maxPersonas} persona(s) will be locked`)
    }

    // Check storage limits
    if (userStorage > newTierConfig.maxStorageMB) {
      warnings.push(`Storage usage (${userStorage}MB) exceeds new tier limit (${newTierConfig.maxStorageMB}MB)`)
    }

    // Business rule: Prevent downgrade if user has active memorial plans
    // This would require checking the planning_status table

    const isValid = errors.length === 0

    return { isValid, errors, warnings }
  }
}

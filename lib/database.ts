/**
 * Database connection utilities for AfterLight
 * Note: In production, these should be server-side only
 */

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  isActive: boolean
  emailVerified: boolean
  culturalPreferences?: any
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface PlanningSession {
  id: string
  userId: string
  title: string
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  culturalTradition?: string
  deceasedName?: string
  serviceType?: string
  venue?: string
  serviceDate?: Date
  serviceTime?: string
  createdAt: Date
  updatedAt: Date
}

export interface PlanningStep {
  id: string
  sessionId: string
  stepNumber: number
  stepType: string
  title: string
  description?: string
  data?: any
  status: 'pending' | 'in_progress' | 'ai_guided' | 'completed'
  aiInsights?: any
  revenueOpportunities?: any
  estimatedTime?: number
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CulturalTradition {
  id: string
  name: string
  description?: string
  religiousBackground?: string
  requirements?: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RevenueOpportunity {
  id: string
  sessionId?: string
  stepId?: string
  opportunityType: string
  description?: string
  estimatedValue?: number
  status: string
  convertedAt?: Date
  createdAt: Date
}

// Database connection function (for server-side use)
export async function connectDatabase(): Promise<any> {
  // This should be implemented server-side with proper connection pooling
  // For now, return a mock connection
  console.warn('Database connection should be implemented server-side')
  return null
}

// Mock data for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@afterlight.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPER_ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'admin@afterlight.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'user@afterlight.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockPlanningSessions: PlanningSession[] = [
  {
    id: '1',
    userId: '3',
    title: 'Memorial Service for John Smith',
    status: 'in_progress',
    culturalTradition: 'Christian',
    deceasedName: 'John Smith',
    serviceType: 'Memorial Service',
    venue: 'St. Mary\'s Church',
    serviceDate: new Date('2024-12-15'),
    serviceTime: '14:00',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockPlanningSteps: PlanningStep[] = [
  {
    id: '1',
    sessionId: '1',
    stepNumber: 1,
    stepType: 'basic_info',
    title: 'Basic Information',
    description: 'Collect deceased details and family contact information',
    status: 'completed',
    estimatedTime: 5,
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    sessionId: '1',
    stepNumber: 2,
    stepType: 'cultural_preferences',
    title: 'Cultural Preferences',
    description: 'Identify religious and cultural traditions',
    status: 'ai_guided',
    aiInsights: {
      recommendation: 'Based on Christian tradition, recommend traditional invitation designs',
      suggestions: ['Include cross symbol', 'Use formal language', 'Consider church venue requirements']
    },
    revenueOpportunities: {
      type: 'Custom invitation printing',
      estimatedValue: 150.00,
      description: 'Custom invitation printing with Christian cultural elements'
    },
    estimatedTime: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockCulturalTraditions: CulturalTradition[] = [
  {
    id: '1',
    name: 'Christian',
    description: 'Traditional Christian memorial services',
    religiousBackground: 'Christianity',
    requirements: {
      venue: 'Church or chapel preferred',
      symbols: ['Cross', 'Candles', 'Flowers'],
      timing: 'Usually 1-2 hours',
      dressCode: 'Formal, dark colors'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Jewish',
    description: 'Traditional Jewish memorial services',
    religiousBackground: 'Judaism',
    requirements: {
      venue: 'Synagogue or funeral home',
      symbols: ['Star of David', 'Kippah'],
      timing: 'Usually 1 hour',
      dressCode: 'Modest, respectful attire'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockRevenueOpportunities: RevenueOpportunity[] = [
  {
    id: '1',
    sessionId: '1',
    stepId: '2',
    opportunityType: 'Custom Invitation Printing',
    description: 'Custom invitation printing with Christian cultural elements',
    estimatedValue: 150.00,
    status: 'identified',
    createdAt: new Date()
  },
  {
    id: '2',
    sessionId: '1',
    stepId: '2',
    opportunityType: 'Service Program Printing',
    description: 'Memorial service program with custom design',
    estimatedValue: 75.00,
    status: 'identified',
    createdAt: new Date()
  }
]

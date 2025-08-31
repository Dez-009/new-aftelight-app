import { z, ZodError } from 'zod'

// Base schemas
export const baseIdSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// User schemas
export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  culturalPreferences: z.record(z.string(), z.any()).optional()
})

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  culturalPreferences: z.record(z.string(), z.any()).optional()
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Persona schemas
export const personaCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  relationshipToUser: z.string().min(1, 'Relationship is required').max(100),
  biography: z.string().min(10, 'Biography must be at least 10 characters').max(2000),
  culturalBackground: z.string().min(1, 'Cultural background is required').max(100),
  religiousPreferences: z.string().max(100).optional(),
  favoriteQuotes: z.array(z.string().max(500)).max(10).optional(),
  favoriteMusic: z.array(z.string().max(200)).max(20).optional(),
  hobbies: z.array(z.string().max(100)).max(15).optional(),
  achievements: z.array(z.string().max(200)).max(20).optional(),
  personalityTraits: z.array(z.string().max(100)).max(15).optional(),
  isPublic: z.boolean().default(false)
})

export const personaUpdateSchema = personaCreateSchema.partial()

export const personaSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500),
  culturalBackground: z.string().optional(),
  relationshipType: z.string().optional(),
  isPublic: z.boolean().optional(),
  ...paginationSchema.shape
})

// Avatar schemas
export const avatarUpdateSchema = z.object({
  avatarUrl: z.string().url('Invalid URL format').max(500).nullable()
})

export const avatarUploadSchema = z.object({
  file: z.any(), // Allow any file type for server-side validation
  personaId: z.string().uuid('Invalid persona ID')
})

// Memory schemas
export const memoryCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(10, 'Memory content must be at least 10 characters').max(5000),
  memoryType: z.string().min(1, 'Memory type is required').max(100),
  emotionalTone: z.string().min(1, 'Emotional tone is required').max(50),
  personaId: z.string().uuid('Invalid persona ID')
})

export const memoryUpdateSchema = memoryCreateSchema.partial().extend({
  id: z.string().uuid('Invalid memory ID')
})

// Media schemas
export const mediaCreateSchema = z.object({
  mediaType: z.enum(['photo', 'voice', 'document'], { message: 'Invalid media type' }),
  file: z.any(), // Allow any file type for server-side validation
  description: z.string().min(1, 'Description is required').max(500),
  personaId: z.string().uuid('Invalid persona ID')
})

export const mediaUpdateSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  aiDescription: z.string().max(1000).optional()
})

// Cultural schemas
export const culturalSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  category: z.enum(['traditions', 'ceremonies', 'symbols', 'music', 'colors']).optional()
})

export const culturalPresetSchema = z.object({
  cultureId: z.string().min(1, 'Culture ID is required'),
  eventType: z.enum(['funeral', 'memorial', 'celebration', 'anniversary']).optional(),
  tone: z.enum(['traditional', 'modern', 'reverent', 'celebratory']).optional(),
  language: z.string().max(50).optional()
})

// Planning schemas
export const planningSessionCreateSchema = z.object({
  personaId: z.string().uuid('Invalid persona ID'),
  eventType: z.enum(['funeral', 'memorial', 'celebration', 'scattering']),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  location: z.string().min(1, 'Location is required').max(500),
  culturalBackground: z.string().min(1, 'Cultural background is required'),
  estimatedAttendees: z.number().int().positive().max(1000).optional(),
  specialRequirements: z.string().max(1000).optional()
})

export const planningStepUpdateSchema = z.object({
  stepId: z.string().uuid('Invalid step ID'),
  status: z.enum(['pending', 'in_progress', 'ai_guided', 'completed']),
  notes: z.string().max(1000).optional(),
  completedAt: z.string().datetime().optional()
})

// Subscription schemas
export const subscriptionUpgradeSchema = z.object({
  tier: z.enum(['free', 'premium', 'religious', 'healthcare', 'other']),
  billingCycle: z.enum(['monthly', 'yearly']),
  paymentMethodId: z.string().min(1, 'Payment method is required')
})

export const subscriptionCancelSchema = z.object({
  reason: z.string().max(500).optional(),
  feedback: z.string().max(1000).optional()
})

// Admin schemas
export const adminUserUpdateSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  subscriptionTier: z.enum(['free', 'premium', 'religious', 'healthcare', 'other']).optional(),
  isActive: z.boolean().optional(),
  subscriptionExpiresAt: z.string().datetime().optional()
})

export const adminStatsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date'),
  metrics: z.array(z.enum(['users', 'personas', 'revenue', 'usage']))
})

// Error response schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string().datetime()
})

// Success response schema
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
  timestamp: z.string().datetime()
})

// API response schema
export const apiResponseSchema = z.union([errorResponseSchema, successResponseSchema])

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = (error as any).errors?.map((err: any) => `${err.path?.join('.') || 'unknown'}: ${err.message || 'validation error'}`) || ['Validation failed']
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}

export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = validateRequest(schema, data)
    if (!result.success) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`)
    }
    return result.data
  }
}

import { NextRequest, NextResponse } from 'next/server'

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Skip rate limiting for successful requests
  skipFailedRequests?: boolean // Skip rate limiting for failed requests
  handler?: (req: NextRequest, res: NextResponse) => NextResponse // Custom handler
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    const entries = Array.from(this.store.entries())
    for (const [key, entry] of entries) {
      if (entry.resetTime < now) {
        this.store.delete(key)
      }
    }
  }

  get(key: string): RateLimitEntry | undefined {
    return this.store.get(key)
  }

  set(key: string, entry: RateLimitEntry) {
    this.store.set(key, entry)
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore()

export function createRateLimit(config: RateLimitConfig) {
  return function rateLimit(req: NextRequest): NextResponse | null {
    const key = config.keyGenerator ? config.keyGenerator(req) : getClientKey(req)
    const now = Date.now()
    
    // Get current rate limit entry
    let entry = rateLimitStore.get(key)
    
    if (!entry || entry.resetTime < now) {
      // Create new entry or reset existing one
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      
      if (config.handler) {
        return config.handler(req, NextResponse.json(
          { 
            success: false, 
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter,
            limit: config.maxRequests,
            windowMs: config.windowMs
          },
          { 
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
            }
          }
        ))
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
          limit: config.maxRequests,
          windowMs: config.windowMs
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
          }
        }
      )
    }
    
    // Increment counter
    entry.count++
    rateLimitStore.set(key, entry)
    
    // Add rate limit headers to response
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', (config.maxRequests - entry.count).toString())
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString())
    
    return null // Continue to next middleware/handler
  }
}

function getClientKey(req: NextRequest): string {
  // Use IP address as default key
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  
  // Create a hash-like key from IP and user agent
  return `${ip}:${userAgent.substring(0, 50)}`
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
    keyGenerator: (req: NextRequest) => `auth:${getClientKey(req)}`
  },
  
  // Moderate rate limiting for API endpoints
  api: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    keyGenerator: (req: NextRequest) => `api:${getClientKey(req)}`
  },
  
  // Generous rate limiting for public endpoints
  public: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    keyGenerator: (req: NextRequest) => `public:${getClientKey(req)}`
  },
  
  // Strict rate limiting for file uploads
  upload: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    keyGenerator: (req: NextRequest) => `upload:${getClientKey(req)}`
  }
}

// Helper function to apply rate limiting
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimit = createRateLimit(config)
    const rateLimitResult = rateLimit(req)
    
    if (rateLimitResult) {
      return rateLimitResult
    }
    
    return handler(req)
  }
}

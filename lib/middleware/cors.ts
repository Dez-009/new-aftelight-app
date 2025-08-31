import { NextRequest, NextResponse } from 'next/server'

export interface CorsConfig {
  origin: string | string[] | boolean
  methods: string[]
  allowedHeaders: string[]
  exposedHeaders: string[]
  credentials: boolean
  maxAge: number
  preflightContinue: boolean
}

export const defaultCorsConfig: CorsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://afterlight.app', 'https://www.afterlight.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-API-Key',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  exposedHeaders: [
    'X-API-Version',
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false
}

export function createCorsMiddleware(config: CorsConfig = defaultCorsConfig) {
  return function cors(req: NextRequest): NextResponse | null {
    const origin = req.headers.get('origin')
    const method = req.method

    // Handle preflight requests
    if (method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      
      // Set CORS headers
      setCorsHeaders(response, config, origin)
      
      // Set preflight response headers
      response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
      
      return response
    }

    // For actual requests, add CORS headers to the response
    const response = NextResponse.next()
    setCorsHeaders(response, config, origin)
    
    return null // Continue to next middleware/handler
  }
}

function setCorsHeaders(response: NextResponse, config: CorsConfig, origin: string | null) {
  // Set origin header
  if (config.origin === true) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  } else if (Array.isArray(config.origin)) {
    if (origin && config.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
  } else if (typeof config.origin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', config.origin)
  }

  // Set other CORS headers
  response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
  response.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '))
  
  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // API version header
  response.headers.set('X-API-Version', '1.0.0')
  
  // Request ID for tracking
  response.headers.set('X-Request-ID', generateRequestId())
  
  return response
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Combined CORS and security middleware
export function withCorsAndSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  corsConfig: CorsConfig = defaultCorsConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Apply CORS
    const cors = createCorsMiddleware(corsConfig)
    const corsResult = cors(req)
    
    if (corsResult) {
      return addSecurityHeaders(corsResult)
    }
    
    // Execute handler
    const response = await handler(req)
    
    // Add security headers to response
    return addSecurityHeaders(response)
  }
}

// Environment-specific CORS configurations
export const corsConfigs = {
  development: {
    ...defaultCorsConfig,
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
  },
  
  staging: {
    ...defaultCorsConfig,
    origin: ['https://staging.afterlight.app', 'https://staging-www.afterlight.app']
  },
  
  production: {
    ...defaultCorsConfig,
    origin: ['https://afterlight.app', 'https://www.afterlight.app'],
    maxAge: 86400 // 24 hours
  }
}

// Get CORS config based on environment
export function getCorsConfig(): CorsConfig {
  const env = process.env.NODE_ENV || 'development'
  return corsConfigs[env as keyof typeof corsConfigs] || defaultCorsConfig
}

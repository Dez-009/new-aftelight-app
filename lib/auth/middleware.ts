import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export interface AuthenticatedUser {
  id: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  subscriptionTier: 'free' | 'premium' | 'religious' | 'healthcare' | 'other'
  subscriptionExpiresAt?: Date
  isActive: boolean
}

export interface AuthOptions {
  requireAuth?: boolean
  requiredRoles?: string[]
  requireSubscription?: boolean
  minTier?: string
}

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function authenticateRequest(
  request: NextRequest,
  options: AuthOptions = {}
): Promise<{ user?: AuthenticatedUser; error?: string; status: number }> {
  try {
    // Check if authentication is required
    if (options.requireAuth === false) {
      return { status: 200 }
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        error: 'Missing or invalid authorization header', 
        status: 401 
      }
    }

    // Extract and verify JWT token
    const token = authHeader.substring(7)
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    
    if (!payload) {
      return { 
        error: 'Invalid token', 
        status: 401 
      }
    }

    // Validate user data
    const user: AuthenticatedUser = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as AuthenticatedUser['role'],
      subscriptionTier: payload.subscriptionTier as AuthenticatedUser['subscriptionTier'],
      subscriptionExpiresAt: payload.subscriptionExpiresAt ? new Date(payload.subscriptionExpiresAt as string) : undefined,
      isActive: payload.isActive as boolean
    }

    // Check if user is active
    if (!user.isActive) {
      return { 
        error: 'User account is deactivated', 
        status: 403 
      }
    }

    // Check role requirements
    if (options.requiredRoles && !options.requiredRoles.includes(user.role)) {
      return { 
        error: 'Insufficient permissions', 
        status: 403 
      }
    }

    // Check subscription requirements
    if (options.requireSubscription) {
      if (!user.subscriptionExpiresAt || user.subscriptionExpiresAt < new Date()) {
        return { 
          error: 'Active subscription required', 
          status: 403 
        }
      }

      if (options.minTier) {
        const tierHierarchy = {
          'free': 0,
          'premium': 1,
          'religious': 2,
          'healthcare': 3,
          'other': 2
        }
        
        const userTierLevel = tierHierarchy[user.subscriptionTier] || 0
        const requiredTierLevel = tierHierarchy[options.minTier as keyof typeof tierHierarchy] || 0
        
        if (userTierLevel < requiredTierLevel) {
          return { 
            error: `Subscription tier ${options.minTier} or higher required`, 
            status: 403 
          }
        }
      }
    }

    return { user, status: 200 }
  } catch (error) {
    console.error('Authentication error:', error)
    return { 
      error: 'Authentication failed', 
      status: 401 
    }
  }
}

export function withAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  options: AuthOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = await authenticateRequest(request, options)
    
    if (auth.error || auth.status !== 200) {
      return NextResponse.json(
        { 
          success: false, 
          error: auth.error || 'Unauthorized',
          code: auth.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN'
        },
        { status: auth.status }
      )
    }

    if (!auth.user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    return handler(request, auth.user)
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) => {
    return withAuth(handler, { requiredRoles: roles })
  }
}

export function requireSubscription(minTier?: string) {
  return (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) => {
    return withAuth(handler, { requireSubscription: true, minTier })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export interface ApiVersion {
  version: string
  status: 'current' | 'deprecated' | 'sunset'
  deprecationDate?: string
  sunsetDate?: string
  migrationGuide?: string
  breakingChanges?: string[]
}

export interface VersionedEndpoint {
  path: string
  versions: string[]
  currentVersion: string
  deprecatedVersions: string[]
}

export const API_VERSIONS: Record<string, ApiVersion> = {
  '1.0': {
    version: '1.0',
    status: 'current',
    deprecationDate: undefined,
    sunsetDate: undefined
  },
  '1.1': {
    version: '1.1',
    status: 'current',
    deprecationDate: undefined,
    sunsetDate: undefined
  },
  '0.9': {
    version: '0.9',
    status: 'deprecated',
    deprecationDate: '2024-01-01',
    sunsetDate: '2024-12-31',
    migrationGuide: 'https://docs.afterlight.app/migration/v0.9-to-v1.0',
    breakingChanges: [
      'Authentication header format changed from "Token" to "Bearer"',
      'Response format standardized with success/error wrapper',
      'Pagination parameters renamed from page/size to page/limit'
    ]
  }
}

export const VERSIONED_ENDPOINTS: VersionedEndpoint[] = [
  {
    path: '/api/personas',
    versions: ['1.0', '1.1'],
    currentVersion: '1.1',
    deprecatedVersions: ['0.9']
  },
  {
    path: '/api/auth',
    versions: ['1.0', '1.1'],
    currentVersion: '1.1',
    deprecatedVersions: ['0.9']
  },
  {
    path: '/api/cultural',
    versions: ['1.0', '1.1'],
    currentVersion: '1.1',
    deprecatedVersions: []
  },
  {
    path: '/api/planning',
    versions: ['1.1'],
    currentVersion: '1.1',
    deprecatedVersions: []
  }
]

export function getApiVersion(request: NextRequest): string {
  // Check Accept header for version
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader) {
    const versionMatch = acceptHeader.match(/application\/vnd\.afterlight\.v(\d+\.\d+)/)
    if (versionMatch) {
      return versionMatch[1]
    }
  }
  
  // Check X-API-Version header
  const versionHeader = request.headers.get('x-api-version')
  if (versionHeader && API_VERSIONS[versionHeader]) {
    return versionHeader
  }
  
  // Check URL path for version
  const url = new URL(request.url)
  const pathParts = url.pathname.split('/')
  const versionIndex = pathParts.findIndex(part => part === 'v1' || part === 'v0')
  if (versionIndex !== -1) {
    const version = pathParts[versionIndex].substring(1)
    if (API_VERSIONS[version]) {
      return version
    }
  }
  
  // Default to latest stable version
  return '1.1'
}

export function validateApiVersion(version: string): { valid: boolean; error?: string } {
  if (!API_VERSIONS[version]) {
    return { 
      valid: false, 
      error: `Unsupported API version: ${version}. Supported versions: ${Object.keys(API_VERSIONS).join(', ')}` 
    }
  }
  
  const apiVersion = API_VERSIONS[version]
  
  if (apiVersion.status === 'sunset') {
    return { 
      valid: false, 
      error: `API version ${version} has been sunset. Please upgrade to a supported version.` 
    }
  }
  
  return { valid: true }
}

export function addVersionHeaders(response: NextResponse, version: string): NextResponse {
  const apiVersion = API_VERSIONS[version]
  
  // Add version headers
  response.headers.set('X-API-Version', version)
  response.headers.set('X-API-Status', apiVersion.status)
  
  if (apiVersion.status === 'deprecated') {
    response.headers.set('X-API-Deprecation-Date', apiVersion.deprecationDate!)
    response.headers.set('X-API-Sunset-Date', apiVersion.sunsetDate!)
    response.headers.set('X-API-Migration-Guide', apiVersion.migrationGuide!)
    
    // Add deprecation warning to response body for JSON responses
    try {
      // For now, skip body modification as it's complex with NextResponse
      // In production, you'd handle this differently
    } catch {
      // Not a JSON response, continue
    }
  }
  
  return response
}

export function withApiVersioning(
  handler: (req: NextRequest, version: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const version = getApiVersion(request)
    const validation = validateApiVersion(version)
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          code: 'UNSUPPORTED_API_VERSION',
          supportedVersions: Object.keys(API_VERSIONS).filter(v => API_VERSIONS[v].status !== 'sunset')
        },
        { status: 400 }
      )
    }
    
    // Execute handler with version
    const response = await handler(request, version)
    
    // Add version headers
    return addVersionHeaders(response, version)
  }
}

export function createVersionedEndpoint(
  path: string,
  versions: string[],
  handler: (req: NextRequest, version: string) => Promise<NextResponse>
) {
  return withApiVersioning(async (req: NextRequest, version: string) => {
    // Check if endpoint supports this version
    if (!versions.includes(version)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Endpoint ${path} does not support API version ${version}`,
          code: 'ENDPOINT_VERSION_NOT_SUPPORTED',
          supportedVersions: versions
        },
        { status: 400 }
      )
    }
    
    return handler(req, version)
  })
}

// Version compatibility utilities
export function isVersionCompatible(requiredVersion: string, clientVersion: string): boolean {
  const required = parseVersion(requiredVersion)
  const client = parseVersion(clientVersion)
  
  // Major version must match
  if (required.major !== client.major) {
    return false
  }
  
  // Client minor version must be >= required minor version
  return client.minor >= required.minor
}

function parseVersion(version: string): { major: number; minor: number } {
  const [major, minor] = version.split('.').map(Number)
  return { major: major || 0, minor: minor || 0 }
}

// Migration utilities
export function getMigrationGuide(fromVersion: string, toVersion: string): string | null {
  const from = API_VERSIONS[fromVersion]
  const to = API_VERSIONS[toVersion]
  
  if (!from || !to) {
    return null
  }
  
  if (from.status === 'deprecated' && from.migrationGuide) {
    return from.migrationGuide
  }
  
  // Generate generic migration guide
  return `https://docs.afterlight.app/migration/v${fromVersion}-to-v${toVersion}`
}

export function getBreakingChanges(fromVersion: string, toVersion: string): string[] {
  const from = API_VERSIONS[fromVersion]
  const to = API_VERSIONS[toVersion]
  
  if (!from || !to) {
    return []
  }
  
  if (from.status === 'deprecated' && from.breakingChanges) {
    return from.breakingChanges
  }
  
  return []
}

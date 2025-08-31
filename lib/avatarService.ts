export interface AvatarUploadResult {
  success: boolean
  avatarUrl?: string
  error?: string
}

export interface AvatarMetadata {
  id: string
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
}

export class AvatarService {
  private static instance: AvatarService
  private baseUrl: string

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }

  public static getInstance(): AvatarService {
    if (!AvatarService.instance) {
      AvatarService.instance = new AvatarService()
    }
    return AvatarService.instance
  }

  /**
   * Upload avatar image to storage and update database
   */
  async uploadAvatar(personaId: string, file: File): Promise<AvatarUploadResult> {
    try {
      // In a real app, this would upload to Supabase Storage, AWS S3, etc.
      // For now, we'll simulate the upload and return a mock URL
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a mock URL (in production, this would be the actual uploaded file URL)
      const mockUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=300&h=300&fit=crop&crop=face`
      
      // Update the persona's avatar in the database
      await this.updatePersonaAvatar(personaId, mockUrl)
      
      return {
        success: true,
        avatarUrl: mockUrl
      }
    } catch (error) {
      console.error('Avatar upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Remove avatar from persona
   */
  async removeAvatar(personaId: string): Promise<AvatarUploadResult> {
    try {
      // In a real app, this would delete from storage and update database
      await this.updatePersonaAvatar(personaId, null)
      
      return {
        success: true
      }
    } catch (error) {
      console.error('Avatar removal failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Removal failed'
      }
    }
  }

  /**
   * Update persona avatar in database
   */
  private async updatePersonaAvatar(personaId: string, avatarUrl: string | null): Promise<void> {
    try {
      // In a real app, this would call your API endpoint
      const response = await fetch(`${this.baseUrl}/personas/${personaId}/avatar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl })
      })

      if (!response.ok) {
        throw new Error(`Failed to update avatar: ${response.statusText}`)
      }
    } catch (error) {
      // For demo purposes, we'll simulate success
      console.log(`Avatar updated for persona ${personaId}:`, avatarUrl)
    }
  }

  /**
   * Get avatar metadata for a persona
   */
  async getAvatarMetadata(personaId: string): Promise<AvatarMetadata | null> {
    try {
      // In a real app, this would fetch from your API
      const response = await fetch(`${this.baseUrl}/personas/${personaId}/avatar`)
      
      if (!response.ok) {
        return null
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch avatar metadata:', error)
      return null
    }
  }

  /**
   * Validate image file
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 5MB' }
    }

    // Check dimensions (optional - could be done on the server)
    return { valid: true }
  }

  /**
   * Generate avatar placeholder URL
   */
  generatePlaceholderUrl(name: string): string {
    // Use Dicebear API for consistent placeholder avatars
    const encodedName = encodeURIComponent(name)
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=amber,orange&textColor=ffffff`
  }

  /**
   * Crop and resize image for avatar (client-side)
   */
  async processImageForAvatar(file: File, targetSize: number = 300): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate dimensions for square crop
        const size = Math.min(img.width, img.height)
        const startX = (img.width - size) / 2
        const startY = (img.height - size) / 2

        canvas.width = targetSize
        canvas.height = targetSize

        // Draw cropped and resized image
        ctx?.drawImage(
          img,
          startX, startY, size, size, // Source rectangle
          0, 0, targetSize, targetSize // Destination rectangle
        )

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to process image'))
            }
          },
          'image/jpeg',
          0.9
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
}

// Export singleton instance
export const avatarService = AvatarService.getInstance()

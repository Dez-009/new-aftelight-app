'use client'

import { useState, useRef } from 'react'
import { Camera, X, Upload, User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  editable?: boolean
  onAvatarChange?: (file: File) => void
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-32 h-32 text-3xl'
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  editable = false, 
  onAvatarChange,
  disabled = false,
  className = ''
}: AvatarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onAvatarChange) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      await onAvatarChange(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    if (onAvatarChange && !disabled) {
      // Pass null to indicate removal
      onAvatarChange(null as any)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderAvatarContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              const fallback = parent.querySelector('.avatar-fallback')
              if (fallback) {
                (fallback as HTMLElement).style.display = 'flex'
              }
            }
          }}
        />
      )
    }

    return (
      <div className="avatar-fallback w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-semibold">
        {getInitials(alt)}
      </div>
    )
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Container */}
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200 border-2 border-amber-200 hover:border-amber-300 transition-all duration-200 ${
          editable && !disabled ? 'cursor-pointer' : ''
        }`}
        onMouseEnter={() => editable && !disabled && setIsHovered(true)}
        onMouseLeave={() => editable && !disabled && setIsHovered(false)}
        onClick={() => editable && !disabled && fileInputRef.current?.click()}
      >
        {renderAvatarContent()}
        
        {/* Upload Overlay */}
        {editable && !disabled && isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Uploading Indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {editable && !disabled && (
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            title="Upload new avatar"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Remove Button (only show if avatar exists) */}
          {src && (
            <button
              onClick={handleRemoveAvatar}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              title="Remove avatar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

import React from 'react'

interface AfterLightIconProps {
  className?: string
  size?: number
}

export function AfterLightIcon({ className = '', size = 24 }: AfterLightIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Candle base */}
      <rect x="10" y="18" width="4" height="6" fill="currentColor" opacity="0.3" />
      
      {/* Candle body */}
      <rect x="9" y="8" width="6" height="10" fill="currentColor" opacity="0.6" />
      
      {/* Flame */}
      <path
        d="M12 4C12 4 11 6 12 8C13 6 12 4 12 4Z"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Light rays */}
      <path
        d="M12 2L13 4M12 2L11 4M12 2L12 3"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  )
}

import React from 'react'

interface EmblemProps {
  className?: string
  size?: number
  alt?: string
}

/**
 * Official Coat of Arms / Emblem Component for Angolela Tera Woreda
 * Renders the authentic institutional seal of Angolela Tera Woreda
 */
export function Emblem({
  className = '',
  size = 56,
  alt = 'Official Seal of Angolela Tera Woreda',
}: EmblemProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 object-contain drop-shadow-md select-none rounded-full ${className}`}
      loading="eager"
    />
  )
}

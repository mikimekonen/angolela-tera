import React from 'react'

interface EthiopianFlagProps {
  className?: string
  width?: number
  height?: number
}

/**
 * Official Flag of the Federal Democratic Republic of Ethiopia
 * Conforming to Proclamation No. 654/2009:
 * - Three equal horizontal bands: Green (#009A44), Yellow (#FED100), Red (#EF3340)
 * - Central Blue Disc (#0F47AF)
 * - Yellow Five-Pointed Star (Pentagram) with five radiant rays
 */
export function EthiopianFlag({
  className = '',
  width = 24,
  height = 12,
}: EthiopianFlagProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-[2px] shadow-xs ring-1 ring-white/20 overflow-hidden ${className}`}
      aria-label="Flag of Ethiopia"
      role="img"
    >
      {/* Top Stripe: Green */}
      <rect x="0" y="0" width="60" height="10" fill="#009A44" />

      {/* Middle Stripe: Yellow */}
      <rect x="0" y="10" width="60" height="10" fill="#FED100" />

      {/* Bottom Stripe: Red */}
      <rect x="0" y="20" width="60" height="10" fill="#EF3340" />

      {/* Central Blue Disc */}
      <circle cx="30" cy="15" r="8.5" fill="#0F47AF" />

      {/* 5 Radiant Rays emanating between the star points */}
      <g stroke="#FED100" strokeWidth="0.9" strokeLinecap="round">
        <line x1="31.29" y1="13.22" x2="34.82" y2="8.37" />
        <line x1="32.09" y1="15.68" x2="37.80" y2="17.53" />
        <line x1="30.00" y1="17.20" x2="30.00" y2="23.20" />
        <line x1="27.91" y1="15.68" x2="22.20" y2="17.53" />
        <line x1="28.71" y1="13.22" x2="25.18" y2="8.37" />
      </g>

      {/* Golden 5-Pointed Star (Pentagram) */}
      <polygon
        points="30,8.8 31.41,13.06 35.90,13.08 32.28,15.74 33.64,20.02 30,17.40 26.36,20.02 27.72,15.74 24.10,13.08 28.59,13.06"
        fill="#FED100"
      />
    </svg>
  )
}

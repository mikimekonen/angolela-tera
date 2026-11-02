'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  label?: string
}

export function AnimatedCounter({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  label,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number | null = null

          const step = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Ease-out expo curve for smooth civic presentation
            const easeOutProgress =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const currentVal = easeOutProgress * end

            setCount(currentVal)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(step)
        }
      },
      {
        threshold: 0.2,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [end, duration, hasAnimated])

  const formattedValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString()

  return (
    <span
      ref={elementRef}
      className={`inline-block tabular-nums ${className}`}
      aria-label={label || `${prefix}${end.toLocaleString()}${suffix}`}
    >
      {prefix}
      {hasAnimated ? formattedValue : '0'}
      {suffix}
    </span>
  )
}

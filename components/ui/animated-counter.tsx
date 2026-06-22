'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string
  className?: string
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState(value)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [started, value])

  useEffect(() => {
    if (!started) return

    const numMatch = value.match(/([\d.]+)/)
    if (!numMatch) {
      setDisplayed(value)
      return
    }

    const target = parseFloat(numMatch[1])
    const prefix = value.slice(0, numMatch.index)
    const suffix = value.slice((numMatch.index ?? 0) + numMatch[1].length)
    const hasDecimal = numMatch[1].includes('.')
    const duration = 1200
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased

      setDisplayed(
        prefix +
          (hasDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) +
          suffix,
      )

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [started, value])

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  )
}

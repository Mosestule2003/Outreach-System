'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'blur'

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: 'reveal',
  fade: 'reveal reveal-fade',
  scale: 'reveal reveal-scale',
  left: 'reveal reveal-left',
  right: 'reveal reveal-right',
  blur: 'reveal reveal-blur',
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
  as?: 'div' | 'section' | 'span' | 'li'
}

export function Reveal({ children, className, delay = 0, variant = 'up', as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    if (delay === 0) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(VARIANT_CLASS[variant], visible && 'is-visible', className)}
    >
      {children}
    </Tag>
  )
}

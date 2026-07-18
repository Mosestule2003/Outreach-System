import Image from 'next/image'
import { cn } from '@/lib/utils'

const SIZE_MAP = {
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
} as const

/** The real Rezlv mark (public/rezlv-logo.png). Sizing mirrors the old Logomark's `size-N` Tailwind scale. */
export function Logo({ size = 6, className }: { size?: keyof typeof SIZE_MAP; className?: string }) {
  const px = SIZE_MAP[size]
  return (
    <Image
      src="/rezlv-logo.png"
      alt="Rezlv"
      width={px}
      height={px}
      priority
      className={cn('shrink-0', className)}
    />
  )
}

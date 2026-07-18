import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-10 flex items-center gap-2 text-foreground">
        <Logo size={7} />
        <span className="text-[16px] font-bold tracking-tight">Rezlv</span>
      </Link>
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  )
}

export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="23" rx="4" fill="currentColor" />
      <path
        d="M7 15.5L7 10C7 8.5 8 7.5 9.5 7.5H14.5"
        stroke="var(--background)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 5L14.7 7.5L12 10"
        stroke="var(--background)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 13.5H17" stroke="var(--background)" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M14.5 11L17 13.5L14.5 16"
        stroke="var(--background)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

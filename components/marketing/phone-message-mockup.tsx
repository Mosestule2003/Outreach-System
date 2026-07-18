'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * A real iPhone-frame texting mockup on an animated neon mesh-gradient
 * background (matching the reference: full-bleed colorful blurred blobs
 * behind floating white message bubbles), with a typing indicator between
 * messages. Loops on an interval. Colors swapped to our own neon
 * green/blue/pink palette instead of the reference's orange/pink mix.
 */

type Message = { side: 'incoming' | 'outgoing'; text: string }

const THREAD: Message[] = [
  { side: 'incoming', text: '[Brand]: your delivery needs your help. Tap to fix in 60 seconds: rzlv.co/x9k2' },
  { side: 'outgoing', text: 'the gate code is 4471, driver missed it' },
  { side: 'incoming', text: 'Got it. Your [Brand] delivery is back on track.' },
]

function MeshBackground() {
  const blobs = [
    { color: 'var(--neon-green-glow)', top: '-10%', left: '-15%', size: 220 },
    { color: 'var(--neon-blue-glow)', top: '20%', left: '55%', size: 260 },
    { color: 'var(--neon-pink-glow)', top: '65%', left: '-10%', size: 240 },
    { color: 'var(--neon-blue)', top: '75%', left: '50%', size: 200 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-70 mix-blend-multiply blur-3xl"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size, backgroundColor: b.color }}
          animate={{ x: [0, 18, -12, 0], y: [0, -14, 10, 0] }}
          transition={{ duration: 9 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* fine noise/grain so the gradient doesn't band, matches the reference's textured feel */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-[18px] rounded-bl-[4px] bg-white/90 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-[#8e8e93]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function Bubble({ message }: { message: Message }) {
  const isOutgoing = message.side === 'outgoing'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-[78%] rounded-[18px] px-3.5 py-2 text-[13px] leading-snug shadow-sm ${
        isOutgoing
          ? 'ml-auto rounded-br-[4px] text-white'
          : 'mr-auto rounded-bl-[4px] bg-white/90 text-black backdrop-blur-sm'
      }`}
      style={isOutgoing ? { backgroundColor: 'var(--neon-blue)' } : undefined}
    >
      {message.text}
    </motion.div>
  )
}

export function PhoneMessageMockup() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setVisibleCount(0)
      setTyping(false)
      for (let i = 0; i < THREAD.length; i++) {
        await new Promise((r) => setTimeout(r, i === 0 ? 500 : 900))
        if (cancelled) return
        // Real iMessage only ever shows a typing indicator for the OTHER
        // person — never your own device typing its own outgoing message.
        if (THREAD[i].side === 'incoming') {
          setTyping(true)
          await new Promise((r) => setTimeout(r, 700))
          if (cancelled) return
          setTyping(false)
        }
        setVisibleCount(i + 1)
      }
      await new Promise((r) => setTimeout(r, 2200))
      if (!cancelled) run()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto w-[280px] sm:w-[320px]">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Soft back-glow */}
        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-[var(--accent-blue)]/20 to-[var(--accent-green)]/20 blur-2xl dark:opacity-30" />
        
        {/* iPhone frame */}
        <div className="relative rounded-[3rem] border-[8px] border-[#1c1c1e] bg-[#1c1c1e] shadow-[var(--shadow-xl)]">
          {/* Dynamic island / notch */}
          <div className="absolute left-1/2 top-3 z-10 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#1c1c1e]" />
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <MeshBackground />
            {/* Status bar */}
            <div className="relative z-10 flex items-center justify-between px-7 pb-1 pt-4 text-[12px] font-semibold text-black">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <svg width="16" height="11" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2.5" height="4" rx="0.5" /><rect x="4" y="4" width="2.5" height="6" rx="0.5" /><rect x="8" y="2" width="2.5" height="8" rx="0.5" /><rect x="11.5" y="0" width="2.5" height="10" rx="0.5" /></svg>
                <svg width="17" height="11" viewBox="0 0 15 10" fill="currentColor"><path d="M7.5 1.5a6 6 0 014.2 1.7l-1 1a4.5 4.5 0 00-6.4 0l-1-1A6 6 0 017.5 1.5zm0 2.4a3.5 3.5 0 012.5 1l-1 1a2 2 0 00-3 0l-1-1a3.5 3.5 0 012.5-1zm0 2.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                <svg width="24" height="12" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" /><rect x="2" y="2" width="15" height="7" rx="1.2" fill="currentColor" /><rect x="19.5" y="3" width="1.5" height="4" rx="0.75" fill="currentColor" /></svg>
              </div>
            </div>
            {/* Thread */}
            <div className="relative z-10 flex min-h-[520px] flex-col justify-end gap-2.5 px-4 pb-6 pt-4">
              <AnimatePresence>
                {THREAD.slice(0, visibleCount).map((m, i) => (
                  <Bubble key={i} message={m} />
                ))}
                {typing && (
                  <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TypingDots />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

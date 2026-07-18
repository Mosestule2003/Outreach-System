'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { AlertTriangle, Radar, MessageSquareText, Grid2x2 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

const SUB_ICONS = [
  { icon: Radar, label: 'NDR classify', colorClass: 'text-emerald-500' },
  { icon: MessageSquareText, label: 'SMS dispatch', colorClass: 'text-emerald-600' },
  { icon: Grid2x2, label: 'Dashboard', colorClass: 'text-blue-500' },
]

export function WorkflowDiagram() {
  return (
    <div className="relative aspect-[600/340] w-full overflow-hidden">
      
      {/* Scaling wrapper to make sure layout fits perfectly on mobile screens */}
      <div className="relative h-full w-full origin-center max-[420px]:scale-[0.7] max-[520px]:scale-[0.8] max-[600px]:scale-[0.9] transition-transform">
        
        {/* SVG Connector Lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 600 340" fill="none">
          {/* Active Flow: Canada Post (right) -> Address Issue (center) */}
          <line 
            x1="430" y1="170" x2="408" y2="170" 
            stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" 
          />
          <circle 
            cx="434" cy="170" r="3.5" 
            fill="white" className="dark:fill-zinc-950"
            stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" 
          />
          <path 
            d="M 408 166 L 400 170 L 408 174" 
            fill="none" stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
          />

          {/* Active Flow: Address Issue (center) -> Rezlv (left) */}
          <line 
            x1="196" y1="170" x2="182" y2="170" 
            stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" 
          />
          <circle 
            cx="200" cy="170" r="3.5" 
            fill="white" className="dark:fill-zinc-950"
            stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" 
          />
          <path 
            d="M 180 166 L 172 170 L 180 174" 
            fill="none" stroke="currentColor" className="text-blue-500/80 dark:text-blue-400/80" 
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
          />

          {/* Dashed Drop-lines to bottom utility action icons */}
          <line x1="250" y1="196" x2="250" y2="242" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="300" y1="196" x2="300" y2="242" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="350" y1="196" x2="350" y2="242" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* LEFT NODE: Rezlv platform card */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-[124px] h-[86px] rounded-[22px] bg-gradient-to-b from-zinc-700 to-zinc-950 p-[1.5px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer group"
          style={{ left: '8%' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full h-full rounded-[20px] bg-gradient-to-b from-zinc-800 to-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 select-none">
              <Logo size={8} className="brightness-150 transition-transform group-hover:scale-105 opacity-90" />
              <span className="text-[20px] font-bold tracking-tight text-white font-sans">rezlv</span>
            </div>
          </div>
        </motion.div>

        {/* CENTER NODE: New Exception pill + event card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[52px]">
          {/* "New Event" Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+12px)] flex items-center rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 backdrop-blur-sm shadow-sm select-none">
            New Event
          </div>
          
          {/* Card Frame (Pill) */}
          <motion.div 
            className="w-full h-full rounded-full border border-zinc-200/80 bg-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3 px-4 hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.08)] transition-all dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
            whileHover={{ scale: 1.01 }}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <AlertTriangle className="size-3.5" />
            </span>
            <div className="flex flex-col min-w-0 select-none">
              <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">Address issue</span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM NODES: 3 Action utility icons */}
        {SUB_ICONS.map(({ icon: Icon, label, colorClass }, i) => (
          <motion.div
            key={label}
            className="absolute bottom-[16%] -translate-x-1/2 size-11 rounded-[12px] border border-zinc-200/80 bg-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-center cursor-pointer hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            style={{ left: i === 0 ? 'calc(50% - 50px)' : i === 1 ? '50%' : 'calc(50% + 50px)' }}
            title={label}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Icon className={`size-5 ${colorClass}`} />
          </motion.div>
        ))}

        {/* RIGHT STACK: 3 Source integration cards */}
        
        {/* Shopify (Top right, inactive) */}
        <motion.div
          className="absolute right-[5%] top-[14%] w-[130px] h-[54px] rounded-[14px] border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center gap-3 px-4 transition-shadow hover:shadow-md cursor-pointer"
          whileHover={{ x: -2 }}
        >
          <Image src="/logos/shopify-color.svg" alt="" width={18} height={18} className="size-5 shrink-0 object-contain grayscale opacity-80" />
          <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 select-none">Shopify</span>
        </motion.div>

        {/* Canada Post (Middle right, active/highlighted) */}
        <motion.div
          className="absolute right-[5%] top-1/2 -translate-y-1/2 p-[3px] rounded-[16px] bg-white border border-zinc-200/50 shadow-[0_0_0_3px_rgba(244,244,245,1),0_8px_16px_-4px_rgba(0,0,0,0.1)] dark:border-zinc-800 dark:shadow-[0_0_0_3px_rgba(24,24,27,1),0_8px_16px_-4px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
          whileHover={{ scale: 1.02, x: -2 }}
        >
          <div className="w-[124px] h-[48px] rounded-[13px] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex items-center gap-3 px-3">
            <Image src="/logos/canadapost.jpg" alt="" width={18} height={18} className="size-5 shrink-0 object-contain" />
            <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 select-none">Canada Post</span>
          </div>
        </motion.div>

        {/* Twilio (Bottom right, inactive) */}
        <motion.div
          className="absolute right-[5%] bottom-[14%] w-[130px] h-[54px] rounded-[14px] border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center gap-3 px-4 transition-shadow hover:shadow-md cursor-pointer"
          whileHover={{ x: -2 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 grayscale opacity-80">
            <circle cx="12" cy="12" r="11" fill="#F22F46" />
            <circle cx="9" cy="9" r="2" fill="white" />
            <circle cx="15" cy="9" r="2" fill="white" />
            <circle cx="9" cy="15" r="2" fill="white" />
            <circle cx="15" cy="15" r="2" fill="white" />
          </svg>
          <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 select-none">Twilio</span>
        </motion.div>

      </div>
    </div>
  )
}


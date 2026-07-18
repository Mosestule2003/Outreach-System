'use client'

import { motion } from 'framer-motion'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { CarrierRow } from '@/components/onboarding/carrier-row'
import { Logo } from '@/components/ui/logo'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useToast } from '@/lib/toast/toast-store'

export default function SettingsPage() {
  const { state, dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()
  const { push } = useToast()

  async function handleValidate(id: (typeof state.carriers)[number]['id'], apiKey: string, accountNumber: string) {
    dispatch({ type: 'CARRIER_ROW_STATE', id, state: 'validating' })
    await new Promise((r) => setTimeout(r, 1200))
    const connected = Boolean(apiKey && accountNumber)
    dispatch({ type: 'CARRIER_ROW_STATE', id, state: connected ? 'connected' : 'error' })
    if (connected) {
      push({ tone: 'success', title: `${id.toUpperCase()} reconnected`, description: 'Credentials validated successfully.' })
    }
  }

  return (
    <>
      <DashboardTopbar title="Settings" subtitle="Store, carriers, and account" />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <motion.div
          variants={staggerContainer(reduceMotion, 0.08)}
          initial="initial"
          animate="animate"
          className="flex max-w-2xl flex-col gap-8"
        >
          <motion.section variants={staggerItem(reduceMotion)}>
            <h2 className="text-[14px] font-semibold text-foreground">Store</h2>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-3">
                <Logo size={7} />
                <div>
                  <p className="text-[14px] font-medium text-foreground">{state.storeDomain ?? 'Not connected'}</p>
                  <p className="text-[12px] text-muted-foreground">Shopify — read-only fulfillment access</p>
                </div>
              </div>
              <span className="rounded-full bg-[var(--accent-green-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-green-ink)]">
                Connected
              </span>
            </div>
          </motion.section>

          <motion.section id="carriers" variants={staggerItem(reduceMotion)}>
            <h2 className="text-[14px] font-semibold text-foreground">Carrier connections</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Rezlv submits address corrections directly to the carrier. Reconnect anytime credentials change.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {state.carriers.map((carrier) => (
                <CarrierRow
                  key={carrier.id}
                  carrier={carrier}
                  onOpenForm={() => dispatch({ type: 'CARRIER_ROW_STATE', id: carrier.id, state: 'form_open' })}
                  onValidate={(apiKey, accountNumber) => handleValidate(carrier.id, apiKey, accountNumber)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section variants={staggerItem(reduceMotion)}>
            <h2 className="text-[14px] font-semibold text-foreground">Billing</h2>
            <div className="mt-3 rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[13px] text-muted-foreground">
                Usage-based pricing — billed monthly for resolved cases. First 75 cases at $4.00, then graduated
                tiers down to $0.65 per case beyond 3,000/mo.
              </p>
              <p className="mt-3 text-[13px] font-medium text-foreground">This month: 0 resolved cases · $0.00</p>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </>
  )
}

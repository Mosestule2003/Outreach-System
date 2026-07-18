'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { OnboardingCard } from '@/components/onboarding/onboarding-card'
import { CarrierRow } from '@/components/onboarding/carrier-row'
import { OriginButton } from '@/components/ui/origin-button'
import { useOnboarding, hasAtLeastOneCarrierConnected } from '@/lib/onboarding/mock-store'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { CarrierId } from '@/lib/onboarding/types'

// Mock: the first validation attempt per carrier fails once, so the error/retry state is reachable.
const failedOnce = new Set<CarrierId>()

export default function CarrierConnectPage() {
  const router = useRouter()
  const { state, dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()

  async function handleValidate(id: CarrierId, apiKey: string, accountNumber: string) {
    dispatch({ type: 'CARRIER_ROW_STATE', id, state: 'validating' })
    await new Promise((r) => setTimeout(r, 1200))

    if (!failedOnce.has(id)) {
      failedOnce.add(id)
      dispatch({ type: 'CARRIER_ROW_STATE', id, state: 'error' })
      return
    }
    dispatch({ type: 'CARRIER_ROW_STATE', id, state: 'connected' })
  }

  const canContinue = hasAtLeastOneCarrierConnected(state)

  return (
    <OnboardingCard step={2} tone="blue">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-[26px] font-bold tracking-[-0.025em] text-foreground">Connect a carrier</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Rezlv submits address corrections directly to the carrier. Connect at least one to continue.
          </p>
        </div>

        <motion.div
          variants={staggerContainer(reduceMotion)}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2"
        >
          {state.carriers.map((carrier) => (
            <motion.div key={carrier.id} variants={staggerItem(reduceMotion)}>
              <CarrierRow
                carrier={carrier}
                onOpenForm={() => dispatch({ type: 'CARRIER_ROW_STATE', id: carrier.id, state: 'form_open' })}
                onValidate={(apiKey, accountNumber) => handleValidate(carrier.id, apiKey, accountNumber)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <OriginButton
            onClick={() => router.push('/onboarding/test')}
            disabled={!canContinue}
            className="w-full"
          >
            Continue
          </OriginButton>
          {!canContinue && (
            <p className="text-[12px] text-muted-foreground">Connect at least one carrier to continue.</p>
          )}
        </div>
      </div>
    </OnboardingCard>
  )
}

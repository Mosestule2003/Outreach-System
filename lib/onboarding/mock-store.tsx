'use client'

import * as React from 'react'
import type { CarrierId, CarrierRowState, OnboardingState, OnboardingStep } from './types'

/**
 * Phase 1 mock state layer. Every onboarding screen reads/writes through this
 * context's interface, never through mock data directly — swapping this for
 * real Supabase auth + persistence in the backend-wiring pass is a one-file change.
 */

const initialState: OnboardingState = {
  email: null,
  authProvider: null,
  emailVerified: false,
  storeConnection: 'idle',
  storeDomain: null,
  carriers: [
    { id: 'ups', name: 'UPS', available: true, state: 'disconnected' },
    { id: 'usps', name: 'USPS', available: true, state: 'disconnected' },
    { id: 'canada-post', name: 'Canada Post', available: false, state: 'disconnected' },
    { id: 'purolator', name: 'Purolator', available: false, state: 'disconnected' },
    { id: 'intelcom', name: 'Intelcom', available: false, state: 'disconnected' },
  ],
  testExceptionComplete: false,
  onboardingComplete: false,
  currentStep: 'signup',
}

type Action =
  | { type: 'SIGNUP_SUCCESS'; email: string; provider: 'password' | 'google' }
  | { type: 'EMAIL_VERIFIED' }
  | { type: 'STORE_OAUTH_START' }
  | { type: 'STORE_OAUTH_RESULT'; result: 'connected' | 'denied' | 'error'; domain?: string }
  | { type: 'CARRIER_ROW_STATE'; id: CarrierId; state: CarrierRowState; errorMessage?: string }
  | { type: 'TEST_EXCEPTION_COMPLETE' }
  | { type: 'ONBOARDING_COMPLETE' }
  | { type: 'SET_STEP'; step: OnboardingStep }

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        email: action.email,
        authProvider: action.provider,
        // Google's OAuth already verifies the email; password signups need the verify step.
        emailVerified: action.provider === 'google',
        currentStep: action.provider === 'google' ? 'store' : 'verify',
      }
    case 'EMAIL_VERIFIED':
      return { ...state, emailVerified: true, currentStep: 'store' }
    case 'STORE_OAUTH_START':
      return { ...state, storeConnection: 'pending' }
    case 'STORE_OAUTH_RESULT':
      return {
        ...state,
        storeConnection: action.result,
        storeDomain: action.result === 'connected' ? action.domain ?? null : state.storeDomain,
        currentStep: action.result === 'connected' ? 'carrier' : state.currentStep,
      }
    case 'CARRIER_ROW_STATE': {
      const carriers = state.carriers.map((c) =>
        c.id === action.id ? { ...c, state: action.state, errorMessage: action.errorMessage } : c,
      )
      // The first carrier to connect advances the step, same pattern as store OAuth.
      // Without this, currentStep sticks at 'carrier' and the route guard bounces
      // you back from /onboarding/test even after you've connected everything.
      const advancesStep = action.state === 'connected' && state.currentStep === 'carrier'
      return { ...state, carriers, currentStep: advancesStep ? 'test' : state.currentStep }
    }
    case 'TEST_EXCEPTION_COMPLETE':
      return { ...state, testExceptionComplete: true, currentStep: 'live' }
    case 'ONBOARDING_COMPLETE':
      return { ...state, onboardingComplete: true }
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    default:
      return state
  }
}

interface OnboardingContextValue {
  state: OnboardingState
  dispatch: React.Dispatch<Action>
}

const OnboardingContext = React.createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <OnboardingContext.Provider value={{ state, dispatch }}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = React.useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

export function hasAtLeastOneCarrierConnected(state: OnboardingState) {
  return state.carriers.some((c) => c.state === 'connected')
}

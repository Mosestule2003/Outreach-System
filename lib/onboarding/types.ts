export type AuthProvider = 'password' | 'google'

export type OAuthState = 'idle' | 'pending' | 'connected' | 'denied' | 'error'

export type CarrierId = 'ups' | 'usps' | 'canada-post' | 'purolator' | 'intelcom'

export type CarrierRowState = 'disconnected' | 'form_open' | 'validating' | 'connected' | 'error' | 'needs_reauth'

export interface CarrierState {
  id: CarrierId
  name: string
  available: boolean // false = "Coming soon" per MVP carrier scope (UPS/USPS only)
  state: CarrierRowState
  errorMessage?: string
}

export type OnboardingStep = 'signup' | 'verify' | 'store' | 'carrier' | 'test' | 'live'

export interface OnboardingState {
  email: string | null
  authProvider: AuthProvider | null
  emailVerified: boolean
  storeConnection: OAuthState
  storeDomain: string | null
  carriers: CarrierState[]
  testExceptionComplete: boolean
  onboardingComplete: boolean
  currentStep: OnboardingStep
}

export const STEP_ORDER: OnboardingStep[] = ['signup', 'verify', 'store', 'carrier', 'test', 'live']

export function stepIndex(step: OnboardingStep): number {
  return STEP_ORDER.indexOf(step)
}

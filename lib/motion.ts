import type { Transition, Variants } from 'framer-motion'

/**
 * Duration bands from the onboarding blueprint (Section 7 — Motion Rules).
 * Everything animated in the onboarding flow pulls from here — nothing
 * hand-rolls its own timing so the flow reads as one consistent system.
 */
export const DURATION = {
  /** Button press, chip state change, inline validation feedback. */
  micro: 0.18,
  /** Screen-to-screen step transitions. */
  step: 0.35,
  /** One-time celebratory moments (e.g. the live screen checkmark). Used sparingly. */
  celebratory: 0.6,
} as const

export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

/**
 * Step transition: the default motion for moving between onboarding screens.
 * Slides + fades under normal motion; collapses to an opacity-only fade
 * when the user has `prefers-reduced-motion` enabled.
 */
export function stepVariants(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: DURATION.step, ease: EASE_OUT } },
      exit: { opacity: 0, transition: { duration: DURATION.micro, ease: EASE_OUT } },
    }
  }
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: DURATION.step, ease: EASE_OUT } },
    exit: { opacity: 0, y: -8, transition: { duration: DURATION.micro, ease: EASE_OUT } },
  }
}

/** Inline row/chip state change (e.g. carrier row: validating -> connected). */
export function stateChangeVariants(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: DURATION.micro } },
      exit: { opacity: 0, transition: { duration: DURATION.micro } },
    }
  }
  return {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: DURATION.micro, ease: EASE_OUT } },
    exit: { opacity: 0, height: 0, transition: { duration: DURATION.micro, ease: EASE_OUT } },
  }
}

/** Confirmation chip slide-in (e.g. "Connected: store.myshopify.com"). */
export function confirmationVariants(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.4 } },
    }
  }
  return {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  }
}

/**
 * Stagger container: wraps a list (form fields, carrier rows, stat cards) so
 * children cascade in one after another instead of popping in as a flat block.
 * This is the single biggest lever against a screen "feeling static."
 */
export function staggerContainer(reduceMotion: boolean, staggerDelay = 0.06): Variants {
  return {
    initial: {},
    animate: {
      transition: reduceMotion ? {} : { staggerChildren: staggerDelay, delayChildren: 0.05 },
    },
  }
}

export function staggerItem(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.25 } },
    }
  }
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  }
}

/** Per-step ambient tone, reusing the marketing site's 3-stage resolution-loop palette. */
export const STEP_TONE = {
  store: 'amber', // Detection
  carrier: 'blue', // Orchestration
  test: 'green', // Execution
  live: 'green',
} as const

export type StepTone = (typeof STEP_TONE)[keyof typeof STEP_TONE]

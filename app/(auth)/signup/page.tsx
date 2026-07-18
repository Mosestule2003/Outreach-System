'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { OriginButton } from '@/components/ui/origin-button'
import { TextField } from '@/components/ui/text-field'
import { GoogleIcon } from '@/components/ui/google-icon'
import { OAuthButton } from '@/components/onboarding/oauth-button'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { stepVariants, staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mock: pretend this address is already registered, to demonstrate the error state.
const TAKEN_EMAIL = 'taken@rezlv.com'

export default function SignupPage() {
  const router = useRouter()
  const { dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailError, setEmailError] = React.useState<string>()
  const [passwordError, setPasswordError] = React.useState<string>()
  const [submitting, setSubmitting] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  function validateEmail() {
    if (!email) return
    if (!EMAIL_RE.test(email)) {
      setEmailError('Enter a valid email address.')
    } else {
      setEmailError(undefined)
    }
  }

  function validatePassword() {
    if (!password) return
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
    } else {
      setPasswordError(undefined)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) return setEmailError('Enter a valid email address.')
    if (password.length < 8) return setPasswordError('Password must be at least 8 characters.')

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))

    if (email.toLowerCase() === TAKEN_EMAIL) {
      setEmailError("That email's already registered.")
      setSubmitting(false)
      return
    }

    dispatch({ type: 'SIGNUP_SUCCESS', email, provider: 'password' })
    router.push('/signup/verify')
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    dispatch({ type: 'SIGNUP_SUCCESS', email: 'you@example.com', provider: 'google' })
    router.push('/onboarding/store')
  }

  return (
    <motion.div
      variants={stepVariants(reduceMotion)}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-8"
    >
      <motion.div variants={staggerItem(reduceMotion)} initial="initial" animate="animate" className="text-center">
        <h1 className="text-[34px] font-bold tracking-[-0.03em] text-foreground">Create your account</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">10 minutes and delivery exceptions are off your plate.</p>
      </motion.div>

      <motion.div
        variants={staggerContainer(reduceMotion)}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-8"
      >
        <motion.div variants={staggerItem(reduceMotion)}>
          <OAuthButton icon={<GoogleIcon className="size-4" />} loading={googleLoading} onClick={handleGoogle}>
            Continue with Google
          </OAuthButton>
        </motion.div>

        <motion.div variants={staggerItem(reduceMotion)} className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[12px] text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </motion.div>

        <motion.form
          variants={staggerItem(reduceMotion)}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(undefined)
          }}
          onBlur={validateEmail}
          placeholder="you@company.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          error={passwordError}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(undefined)
          }}
          onBlur={validatePassword}
          placeholder="At least 8 characters"
        />

        {emailError === "That email's already registered." && (
          <p className="-mt-2 text-[13px] text-muted-foreground">
            <Link href="#" className="interactive-link text-foreground">
              Log in instead
            </Link>
          </p>
        )}

        <OriginButton type="submit" loading={submitting} className="mt-2 w-full">
          {submitting ? 'Creating account' : 'Create account'}
        </OriginButton>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}

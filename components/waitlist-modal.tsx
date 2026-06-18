'use client'

import { FormEvent, useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useWaitlist } from './waitlist-context'
import { supabase } from '@/lib/supabase'

const CHALLENGES = [
  { value: 'consistency', label: 'Inconsistent CX / refund decisions across agents' },
  { value: 'ownership', label: 'No one owns the exception when things go wrong' },
  { value: 'founder-bottleneck', label: 'Everything still routes back through me (founder)' },
  { value: 'onboarding', label: 'New hires take too long to make correct calls' },
  { value: 'off-policy-ai', label: 'AI agent making off-policy promises' },
  { value: 'visibility', label: 'No visibility into how decisions are being made' },
  { value: 'other', label: 'Other' },
]

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-gray-400 focus:outline-none transition-colors'

const selectClass =
  'w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-900 focus:border-gray-400 focus:outline-none transition-colors'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-gray-800">
      {children}
    </label>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

export function WaitlistModal() {
  const { isOpen, closeWaitlist } = useWaitlist()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [role, setRole] = useState('')
  const [roleOther, setRoleOther] = useState('')
  const [challenge, setChallenge] = useState('')
  const [challengeOther, setChallengeOther] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWaitlist()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeWaitlist])

  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
      setRole('')
      setRoleOther('')
      setChallenge('')
      setChallengeOther('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('loading')

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      const payload = {
        name: formData.get('name'),
        company: formData.get('company'),
        work_email: formData.get('work_email'),
        role,
        role_other: role === 'other' ? roleOther : null,
        annual_revenue: formData.get('annual_revenue'),
        challenge,
        challenge_other: challenge === 'other' ? challengeOther : null,
        hope_to_solve: formData.get('hope_to_solve'),
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([payload])

      if (error) throw error

      setStatus('done')
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err)
      console.error('Waitlist submit error:', msg)
      alert("Something went wrong. Please try again.")
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeWaitlist}
        aria-hidden="true"
      />

      <div className="relative z-50 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="overflow-y-auto px-10 pb-10 pt-9 sm:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Close */}
          <button
            onClick={closeWaitlist}
            className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Get early access
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            Apply for early access
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">
            We&apos;re onboarding a limited first cohort of ecommerce &amp; DTC brands.
            Fill this in and we&apos;ll review your fit within 48 hours.
          </p>

          {status === 'done' ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-black text-white">
                <Check className="size-5" />
              </span>
              <p className="mt-1 font-medium text-gray-900">Application received.</p>
              <p className="text-sm text-gray-500">
                We&apos;ll review your fit and be in touch within 48 hours.
              </p>
              <button
                onClick={closeWaitlist}
                className="mt-3 w-full rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col gap-5">

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <Label>Full name</Label>
                  <input required name="name" type="text" placeholder="Jane Smith" className={inputClass} />
                </Field>
                <Field>
                  <Label>Company name</Label>
                  <input required name="company" type="text" placeholder="Acme Store" className={inputClass} />
                </Field>
              </div>

              {/* Email */}
              <Field>
                <Label>Work email</Label>
                <input required name="work_email" type="email" placeholder="jane@acmestore.com" className={inputClass} />
              </Field>

              {/* Role */}
              <Field>
                <Label>Your role</Label>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>Select...</option>
                  <option value="founder">Founder / CEO</option>
                  <option value="coo">COO</option>
                  <option value="ecom">Head of Ecommerce</option>
                  <option value="ops">Operations Lead</option>
                  <option value="cx">CX Lead / Manager</option>
                  <option value="other">Other</option>
                </select>
                {role === 'other' && (
                  <input
                    required
                    type="text"
                    placeholder="Tell us your role"
                    value={roleOther}
                    onChange={(e) => setRoleOther(e.target.value)}
                    className={`mt-2 ${inputClass}`}
                  />
                )}
              </Field>

              {/* Annual Revenue */}
              <Field>
                <Label>Annual revenue</Label>
                <select required name="annual_revenue" defaultValue="" className={selectClass}>
                  <option value="" disabled>Select...</option>
                  <option value="under-250k">Under $250K</option>
                  <option value="250k-500k">$250K – $500K</option>
                  <option value="500k-1m">$500K – $1M</option>
                  <option value="1m-2m">$1M – $2M</option>
                  <option value="2m-5m">$2M – $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </Field>

              {/* Biggest challenge */}
              <Field>
                <Label>Biggest challenge right now</Label>
                <select
                  required
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>Select...</option>
                  {CHALLENGES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {challenge === 'other' && (
                  <input
                    required
                    type="text"
                    placeholder="Describe your challenge"
                    value={challengeOther}
                    onChange={(e) => setChallengeOther(e.target.value)}
                    className={`mt-2 ${inputClass}`}
                  />
                )}
              </Field>

              {/* Open question */}
              <Field>
                <Label>What are you hoping rezlv can solve?</Label>
                <textarea
                  required
                  name="hope_to_solve"
                  rows={3}
                  placeholder="What's the biggest problem you're hoping rezlv can help solve?"
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-gray-400 focus:outline-none transition-colors"
                />
              </Field>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-black px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting…' : 'Apply for early access'}
              </button>

              <p className="text-center text-sm font-medium text-gray-400">
                No spam. We review every application personally.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

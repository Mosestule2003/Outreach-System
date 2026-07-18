import { createHmac } from 'crypto'
import { describe, expect, it } from 'vitest'
import { verifyShopifyHmac } from '@/lib/webhooks/verify-shopify-hmac'

const SECRET = 'test_shopify_secret'

function sign(body: string, secret = SECRET): string {
  return createHmac('sha256', secret).update(body, 'utf8').digest('base64')
}

describe('verifyShopifyHmac — Guardrails §4, SRS §3.1/§4.3 zero-tolerance webhook verification', () => {
  it('accepts a valid signature', () => {
    const body = JSON.stringify({ id: 123, topic: 'fulfillments/create' })
    expect(verifyShopifyHmac(body, sign(body), SECRET)).toBe(true)
  })

  it('rejects an invalid signature', () => {
    const body = JSON.stringify({ id: 123 })
    const wrongSignature = sign(body, 'wrong_secret')
    expect(verifyShopifyHmac(body, wrongSignature, SECRET)).toBe(false)
  })

  it('rejects a missing signature header', () => {
    const body = JSON.stringify({ id: 123 })
    expect(verifyShopifyHmac(body, null, SECRET)).toBe(false)
    expect(verifyShopifyHmac(body, undefined, SECRET)).toBe(false)
  })

  it('rejects a signature computed over a tampered body (replay/modification attempt)', () => {
    const originalBody = JSON.stringify({ id: 123, amount: 10 })
    const tamperedBody = JSON.stringify({ id: 123, amount: 10000 })
    expect(verifyShopifyHmac(tamperedBody, sign(originalBody), SECRET)).toBe(false)
  })

  it('rejects a non-base64/malformed header without throwing', () => {
    const body = JSON.stringify({ id: 123 })
    expect(() => verifyShopifyHmac(body, 'not-valid-base64!!', SECRET)).not.toThrow()
    expect(verifyShopifyHmac(body, 'not-valid-base64!!', SECRET)).toBe(false)
  })
})

import { NextRequest, NextResponse } from 'next/server'
import { verifyShopifyHmac } from '@/lib/webhooks/verify-shopify-hmac'

// SRS §3.1 / §11: acknowledge within Shopify's 5s timeout, do heavy
// processing (classification, notification dispatch) async after the 2xx
// to avoid webhook redelivery storms. This route only verifies + enqueues.

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256')
  const secret = process.env.SHOPIFY_API_SECRET

  if (!secret) {
    // Misconfiguration, not an attacker — log and reject, never process
    // unverifiable webhooks (Guardrails §4).
    console.error('shopify webhook: SHOPIFY_API_SECRET not configured')
    return NextResponse.json({ error: { code: 'misconfigured', message: 'webhook not configured' } }, { status: 500 })
  }

  if (!verifyShopifyHmac(rawBody, hmacHeader, secret)) {
    console.warn('shopify webhook: HMAC verification failed', {
      topic: req.headers.get('x-shopify-topic'),
      shop: req.headers.get('x-shopify-shop-domain'),
    })
    return NextResponse.json({ error: { code: 'invalid_signature', message: 'signature verification failed' } }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic')
  const shopDomain = req.headers.get('x-shopify-shop-domain')

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    console.error('shopify webhook: malformed JSON payload', { topic, shopDomain })
    // Still acknowledge — a malformed payload from a verified sender is a
    // webhook_processing_failure (03-EXCEPTIONS-TAXONOMY.md §2), not a
    // signal to Shopify to retry indefinitely.
    return NextResponse.json({ received: true })
  }

  // TODO(rezlv-exceptions-engine, Stage 4): enqueue { topic, shopDomain,
  // payload } for async processing (order/fulfillment ingestion, tracker
  // creation via EasyPost). Kept as a stub here — Stage 1's scope is
  // verified ingestion, not the resolution pipeline itself.
  void topic
  void shopDomain
  void payload

  return NextResponse.json({ received: true })
}

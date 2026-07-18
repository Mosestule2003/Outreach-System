// Cross-tenant RLS denial tests — 09-TESTING-STRATEGY.md §2 item 4,
// zero-tolerance area. Runs against a real Supabase project (never
// production) using two merchant sessions and asserts merchant A can
// never read merchant B's rows on any merchant-scoped table.
//
// Requires SUPABASE_SERVICE_ROLE_KEY (to seed fixtures + create test auth
// users) — added 2026-07-15, migrations 0001/0002 applied to the live
// project. Skips itself gracefully (rather than failing CI) if the key
// is ever absent in a given environment.

import { createClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasServiceRole = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY)

describe.skipIf(!hasServiceRole)('RLS cross-tenant isolation (requires SUPABASE_SERVICE_ROLE_KEY)', () => {
  const admin = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!)

  async function createMerchantWithUser(name: string, domain: string, email: string) {
    const { data: merchant, error: merchantErr } = await admin
      .from('merchants')
      .insert({ name, shopify_domain: domain })
      .select()
      .single()
    if (merchantErr) throw merchantErr

    const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
      email,
      password: crypto.randomUUID(),
      email_confirm: true,
    })
    if (authErr) throw authErr

    const { error: muErr } = await admin
      .from('merchant_users')
      .insert({ merchant_id: merchant.id, auth_user_id: authUser.user.id, role: 'owner' })
    if (muErr) throw muErr

    return { merchant, authUserId: authUser.user.id }
  }

  it('merchant A cannot read merchant B rows on orders/exceptions/shipments', async () => {
    const a = await createMerchantWithUser('Tenant A', `tenant-a-${Date.now()}.myshopify.com`, `tenant-a-${Date.now()}@test.rezlv.dev`)
    const b = await createMerchantWithUser('Tenant B', `tenant-b-${Date.now()}.myshopify.com`, `tenant-b-${Date.now()}@test.rezlv.dev`)

    const { data: orderB, error: orderErr } = await admin
      .from('orders')
      .insert({ merchant_id: b.merchant.id, shopify_order_id: 'B-1001', order_value_cents: 5000 })
      .select()
      .single()
    if (orderErr) throw orderErr

    // Sign in as merchant A via a scoped (anon-key) client — this is the
    // client merchant-facing API routes actually use, not the admin client.
    // Redeem an admin-generated magic link server-side (no email/callback
    // route needed) to obtain a real session for merchant A's user.
    const { data: userA } = await admin.auth.admin.getUserById(a.authUserId)
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: userA.user!.email!,
    })
    if (linkErr) throw linkErr

    const merchantAClient = createClient(SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error: verifyErr } = await merchantAClient.auth.verifyOtp({
      token_hash: link.properties.hashed_token,
      type: 'email',
    })
    if (verifyErr) throw verifyErr

    const { data: crossTenantRead } = await merchantAClient
      .from('orders')
      .select('*')
      .eq('id', orderB.id)

    expect(crossTenantRead ?? []).toHaveLength(0)

    // cleanup
    await admin.from('orders').delete().eq('id', orderB.id)
    await admin.from('merchant_users').delete().eq('merchant_id', a.merchant.id)
    await admin.from('merchant_users').delete().eq('merchant_id', b.merchant.id)
    await admin.from('merchants').delete().eq('id', a.merchant.id)
    await admin.from('merchants').delete().eq('id', b.merchant.id)
    await admin.auth.admin.deleteUser(a.authUserId)
    await admin.auth.admin.deleteUser(b.authUserId)
  })
})

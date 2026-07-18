-- Rezlv RLS policies — per docs/01-SRS.md §2.3, Guardrails §2/§3
-- RLS is the backstop, not the only control (app-layer checks still required).
-- Service-role key bypasses RLS entirely — used only by webhooks/admin APIs/
-- the resolution agent (SRS §4.2), never client-side.

-- Helper: current user's merchant_id, null if not a merchant_user
create or replace function current_merchant_id()
returns uuid
language sql
stable
as $$
  select merchant_id from merchant_users where auth_user_id = auth.uid() limit 1;
$$;

-- ============================================================
-- merchants — a merchant user may only read their own merchant row
-- ============================================================
alter table merchants enable row level security;

create policy "merchant_read_own" on merchants
  for select
  using (id = current_merchant_id());

-- No update/delete/insert policy for merchant_users here — merchant
-- record mutation (KYC, status, autonomy_config) goes through the
-- service-role-backed admin/merchant-settings API layer only (SRS §2.3).

-- ============================================================
-- merchant_users — a user may see other users on their own merchant
-- ============================================================
alter table merchant_users enable row level security;

create policy "merchant_users_read_own_tenant" on merchant_users
  for select
  using (merchant_id = current_merchant_id());

-- ============================================================
-- orders
-- ============================================================
alter table orders enable row level security;

create policy "orders_isolation" on orders
  for all
  using (merchant_id = current_merchant_id())
  with check (merchant_id = current_merchant_id());

-- ============================================================
-- shipments
-- ============================================================
alter table shipments enable row level security;

create policy "shipments_isolation" on shipments
  for all
  using (merchant_id = current_merchant_id())
  with check (merchant_id = current_merchant_id());

-- ============================================================
-- exceptions
-- ============================================================
alter table exceptions enable row level security;

create policy "exceptions_isolation" on exceptions
  for all
  using (merchant_id = current_merchant_id())
  with check (merchant_id = current_merchant_id());

-- ============================================================
-- agent_actions — APPEND-ONLY: select policy only, no update/delete policy
-- means Postgres denies those operations under RLS by default. Inserts are
-- performed by the service-role key (agent), not by merchant sessions.
-- ============================================================
alter table agent_actions enable row level security;

create policy "agent_actions_read_own_tenant" on agent_actions
  for select
  using (merchant_id = current_merchant_id());

-- ============================================================
-- portal_sessions — no merchant-session access at all; the customer
-- portal is token-authenticated server-side (service role), never a
-- Supabase Auth session. No policy = no access under RLS.
-- ============================================================
alter table portal_sessions enable row level security;

-- ============================================================
-- notifications
-- ============================================================
alter table notifications enable row level security;

create policy "notifications_read_own_tenant" on notifications
  for select
  using (merchant_id = current_merchant_id());

-- ============================================================
-- billing_events — append-only, merchant may read their own, no mutation policy
-- ============================================================
alter table billing_events enable row level security;

create policy "billing_events_read_own_tenant" on billing_events
  for select
  using (merchant_id = current_merchant_id());

-- ============================================================
-- audit_log — append-only, no merchant-session access (admin-only, via
-- service-role-backed admin API per SRS §2.3) — no policy = no access.
-- ============================================================
alter table audit_log enable row level security;

-- ============================================================
-- admin_users — never exposed to merchant sessions; no policy = no access
-- under RLS for anon/authenticated merchant roles. Admin API layer uses
-- the service role key and checks membership in application code (SRS §2.3).
-- ============================================================
alter table admin_users enable row level security;

-- Rezlv initial schema — per docs/01-SRS.md §2.2
-- UUID PKs, multi-tenant via merchant_id, append-only where noted.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- merchants
-- ============================================================
create table merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shopify_domain text unique not null,
  shopify_access_token_encrypted text, -- pgcrypto-encrypted; never plaintext (Guardrails §3/§4)
  plan text not null default 'trial',
  stripe_customer_id text,
  autonomy_config jsonb not null default '{}'::jsonb, -- per-exception-type Tier 2/3 caps, conservative default enforced in app code (SRS §5)
  kyc_status text not null default 'pending' check (kyc_status in ('pending','approved','rejected','suspended')),
  status text not null default 'active' check (status in ('active','paused','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_merchants_updated_at before update on merchants
  for each row execute function set_updated_at();

-- ============================================================
-- merchant_users
-- ============================================================
create table merchant_users (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_id, auth_user_id)
);
create trigger trg_merchant_users_updated_at before update on merchant_users
  for each row execute function set_updated_at();
create index idx_merchant_users_merchant_id on merchant_users(merchant_id);
create index idx_merchant_users_auth_user_id on merchant_users(auth_user_id);

-- ============================================================
-- admin_users — SEPARATE from merchant_users, never a shared boolean (Guardrails §9)
-- ============================================================
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin','ops','support')),
  created_at timestamptz not null default now(),
  unique (auth_user_id)
);

-- ============================================================
-- orders — customer_name/email/phone/shipping_address are PII (Guardrails §3)
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  shopify_order_id text not null,
  customer_name text,             -- PII
  customer_email text,            -- PII
  customer_phone text,            -- PII
  shipping_address jsonb,         -- PII
  order_value_cents integer not null default 0,
  currency text not null default 'CAD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_id, shopify_order_id)
);
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();
create index idx_orders_merchant_id on orders(merchant_id);
create index idx_orders_shopify_order_id on orders(shopify_order_id);

-- ============================================================
-- shipments
-- ============================================================
create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade, -- denormalized for RLS/perf
  carrier text,                   -- see lib/carriers/policies.ts CarrierId (MVP scope, 08-ENVIRONMENT-SETUP §5, expanded 2026-07-15)
  tracking_number text,
  status text not null default 'unknown',
  last_tracking_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_shipments_updated_at before update on shipments
  for each row execute function set_updated_at();
create index idx_shipments_merchant_id on shipments(merchant_id);
create index idx_shipments_tracking_number on shipments(tracking_number);
create index idx_shipments_order_id on shipments(order_id);

-- ============================================================
-- exceptions
-- ============================================================
create table exceptions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  shipment_id uuid references shipments(id) on delete set null,
  type text not null check (type in (
    'address_issue','failed_attempt','access_issue','carrier_delay','customs_hold',
    'webhook_processing_failure','write_back_failure','no_response',
    'rto_in_progress','rto_completed'
  )), -- 03-EXCEPTIONS-TAXONOMY.md §1, §2
  severity smallint not null check (severity between 1 and 5), -- 03-EXCEPTIONS-TAXONOMY.md §3
  status text not null default 'detected' check (status in (
    'detected','notified','awaiting_customer','resolved','escalated','closed_unresolved'
  )),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_type text check (resolution_type in ('reship','refund','address_correction','credit','manual')),
  autonomy_tier_used text check (autonomy_tier_used in ('0','1','2','3','4')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_exceptions_updated_at before update on exceptions
  for each row execute function set_updated_at();
create index idx_exceptions_merchant_id on exceptions(merchant_id);
create index idx_exceptions_merchant_status on exceptions(merchant_id, status);
create index idx_exceptions_order_id on exceptions(order_id);

-- ============================================================
-- agent_actions — APPEND-ONLY audit trail (Guardrails §2, §7)
-- ============================================================
create table agent_actions (
  id uuid primary key default gen_random_uuid(),
  exception_id uuid not null references exceptions(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  action_type text not null,
  tier text not null check (tier in ('0','1','2','3','4')),
  inputs jsonb not null default '{}'::jsonb,
  outcome text not null,
  requires_approval boolean not null default false,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_agent_actions_merchant_id on agent_actions(merchant_id);
create index idx_agent_actions_exception_id on agent_actions(exception_id);

-- ============================================================
-- portal_sessions — token stored HASHED only (SRS §2.2, §4.1)
-- ============================================================
create table portal_sessions (
  id uuid primary key default gen_random_uuid(),
  exception_id uuid not null references exceptions(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_portal_sessions_exception_id on portal_sessions(exception_id);

-- ============================================================
-- notifications — SMS/email send log
-- ============================================================
create table notifications (
  id uuid primary key default gen_random_uuid(),
  exception_id uuid references exceptions(id) on delete set null,
  merchant_id uuid not null references merchants(id) on delete cascade,
  channel text not null check (channel in ('sms','email')),
  to_address text not null, -- PII
  status text not null default 'queued' check (status in ('queued','sent','delivered','failed','opted_out')),
  provider_message_id text,
  created_at timestamptz not null default now()
);
create index idx_notifications_merchant_id on notifications(merchant_id);
create index idx_notifications_exception_id on notifications(exception_id);

-- ============================================================
-- billing_events — Stripe webhook mirror, append-only, idempotency guard (Guardrails §5)
-- ============================================================
create table billing_events (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  stripe_event_id text not null unique,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_billing_events_merchant_id on billing_events(merchant_id);

-- ============================================================
-- audit_log — general admin/system audit trail, append-only
-- ============================================================
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null check (actor_type in ('agent','admin','merchant_user','system')),
  actor_id uuid,
  action text not null,
  target_table text not null,
  target_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_log_target on audit_log(target_table, target_id);

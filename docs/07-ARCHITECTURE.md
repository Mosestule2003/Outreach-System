# Rezlv — Architecture & Diagram Index

Indexes existing Lucid diagrams and the system shape — doesn't duplicate
`01-SRS.md`'s prose spec. If a diagram and the SRS ever disagree, the SRS
plus the source-of-truth sheets (Content Tracker, Product Control Center)
win — update the diagram, not the other way around.

## 1. System Shape (summary — full detail in `01-SRS.md`)

**Corrected 2026-07-15** — this diagram had gone stale on 3 points now
fixed below: (1) carrier scope was 3, now 7 (`16-CARRIER-POLICIES.md`);
(2) Intelcom is NOT on EasyPost's carrier list at all (confirmed against
EasyPost's full 72-carrier guide index) — it needs its own direct
integration, parallel to the EasyPost gateway, not inside it; (3) "carrier
write-back via EasyPost" doesn't exist for any carrier — no carrier
exposes a redirect/correction API, so the real flow is merchant-assisted
submission, not automated write-back.

```
Shopify (merchant store)
   │  webhook: fulfillment_updated
   ▼
Rezlv webhook ingestion (Next.js route handler)
   │
   ├─► EasyPost API gateway ── normalizes tracking for 6 carriers:
   │       Canada Post, UPS Canada, Purolator, Canpar, Loomis Express,
   │       FedEx Canada
   │
   └─► Direct Intelcom API integration ── separate from EasyPost (Intelcom
           is not an EasyPost-supported carrier at all — confirmed against
           EasyPost's full carrier list); uses Intelcom's own Tracking API
   │
   ▼  (both paths normalize into the same internal tracking-event shape)
NDR Classifier ── categorizes into 8 primary types: address_issue /
                   failed_attempt / access_issue / carrier_delay /
                   customs_hold / damaged_in_transit / lost_or_stolen /
                   delivery_refused   (03-EXCEPTIONS-TAXONOMY.md)
   │
   ▼
exceptions row created (Supabase/Postgres, RLS-scoped per merchant)
   │
   ▼
Resolution Agent ── autonomy-tier-gated (02-GUARDRAILS.md §2)
   │
   ├─► SMS (Twilio) ──► JWT portal link (24hr, single-use, HS256)
   │        │  no reply
   │        ▼
   ├─► Email (Resend) ──► same portal link
   │        │  no reply
   │        ▼
   └─► AI Voice Agent call ──► drives back to portal, never commits
            │                   a Tier 2+ action from voice input alone
            │  no response through full ladder
            ▼
       no_response → merchant dashboard exception queue (manual fallback)

   Customer submits correction via Portal
   │
   ▼
   Google Maps address validation
   │
   ▼
   Agent assembles a ready-to-submit correction packet ── NOT an automated
   carrier write-back (no MVP carrier exposes that capability, confirmed
   16-CARRIER-POLICIES.md §5) ── merchant reviews + submits via their own
   carrier portal login (one-click confirm from the merchant dashboard)
   │
   ▼
   Shopify Fulfillment Notes updated
   │
   ▼
   exception marked resolved_success ──► Stripe Billing Meter event (04-PAYMENT-LOGIC.md)
```

Admin dashboard (`app/admin/*`) and merchant dashboard (`app/dashboard/*`)
both read from the same Supabase backend but are structurally separate
surfaces with separate auth (`01-SRS.md` §4.1, §6) — not shown as a single
box above because they must never share a layout/nav component.

## 2. Existing Lucid Diagrams (generated already — link, don't regenerate)

From the "Rezlv — Product Diagrams" Lucid folder (source: Content Tracker
UX Screen Inventory tab, `15-FRONTEND-SPEC.md` §6):

| Diagram | Covers | Link |
|---|---|---|
| Sitemap & Screen Relationship Map | All 39 frontend screens and their navigation relationships | [Lucid](https://lucid.app/lucidchart/ab52a114-cf5c-4127-8a0f-8e9c2e7bbbc5/view) |
| Permission Matrix | Merchant roles (Owner/Admin/Viewer) × Admin roles × screen/action access | [Lucid](https://lucid.app/lucidchart/90827b18-d18e-4af2-9300-595d71546a65/view) |
| Authentication + Onboarding Flow | Screens 001-006, 040 sequence | [Lucid](https://lucid.app/lucidchart/b55a0956-f4c6-4ce9-a1d6-f8e3e353c87a/view) |
| Backend Integration + Notification Flow | Webhook → classifier → escalation ladder → write-back | [Lucid](https://lucid.app/lucidchart/6373c97e-71b5-45b1-b7e1-6f2a881b03a9/view) |

## 3. Diagram Gaps (not yet generated — build these when the relevant stage starts, not preemptively)

- **Database ERD** — `01-SRS.md` §2.2's tables visualized (merchants,
  orders, shipments, exceptions, agent_actions, portal_sessions,
  notifications, billing_events, audit_log, merchant_users, admin_users)
  with foreign keys and RLS boundary annotated. Generate via the Lucid
  connector (`lucid_create_erd`) when Stage 1 (schema) actually starts —
  building it now, before the schema is final, risks it going stale
  immediately.
- **Agent autonomy-tier decision tree** — visualizing
  `02-GUARDRAILS.md` §2's Tier 0-4 classification and the
  `checkAutonomyTier()` decision path (`01-SRS.md` §5). Useful once that
  function's actual logic exists, not before.
- **Sequence diagram: a single exception's full lifecycle** — detect →
  classify → notify (ladder) → customer action → write-back → billing
  event, as an actual sequence diagram (not just the ASCII flow in §1
  above) — nice-to-have for onboarding a new contributor, not build-
  blocking.

## 4. Deployment Topology

Single Next.js app (App Router), deployed on Vercel — no separate backend
service. Supabase is the only external stateful dependency Rezlv operates
directly; everything else (Stripe, Twilio, EasyPost, Resend, Google Maps,
Sentry, the eventual voice provider) is a managed third-party API, not
infrastructure Rezlv runs. This keeps the MVP's operational surface area
deliberately small — see `10-DEPLOYMENT-RUNBOOK.md` §1 for environment
detail.

## 5. Data Boundary Between Merchant, Admin, and Customer Portal Surfaces

Three distinct frontend surfaces (`15-FRONTEND-SPEC.md` §4), one backend:

- **Merchant dashboard:** RLS-scoped to the logged-in merchant's own
  `merchant_id` (`01-SRS.md` §2.3).
- **Admin dashboard:** server-side elevated access via a separate
  `admin_users`-gated API layer, never client-side Supabase calls with
  elevated privileges (`01-SRS.md` §2.3, §4.1).
- **Customer portal:** no account at all — access is solely via the
  JWT-tokenized single-use link, scoped to exactly one `exceptions` row
  (`01-SRS.md` §4.1, §2.2 `portal_sessions`).

This three-way boundary is the single most important thing for any new
frontend code to respect — a bug that blurs it (e.g. a portal page that
can see other exceptions, or an admin layout accidentally reachable by a
merchant session) is a Tier-4-severity-equivalent bug even though it's a
frontend routing mistake, not an agent action.

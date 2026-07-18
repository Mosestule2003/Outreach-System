# Rezlv Glossary

Shared vocabulary — use these terms consistently across code, docs, and
communication between Claude and Gemini. If you need a new term, add it
here in the same PR/session that introduces it.

## Product/domain terms

- **Exception** — the canonical term for anything that goes wrong in the
  delivery lifecycle of an order (delay, damage, loss, refusal, etc.). Do
  not use "incident," "case," or "issue" interchangeably — always
  "exception" in code, schema, and UI.
- **Resolution** — the outcome/action that closes an exception (reship,
  refund, address correction, etc.).
- **Merchant** — a Shopify brand that pays for Rezlv (Rezlv's actual
  customer).
- **Customer** (or **end customer**) — the merchant's customer, the person
  who placed the order and receives the SMS/portal experience. Never call
  this person "user" in domain code — reserve "user" for Rezlv's own
  authenticated accounts (merchant staff, admins).
- **Agent** — the Rezlv AI system component that detects/classifies/
  resolves exceptions autonomously (see `02-GUARDRAILS.md` §2 for autonomy
  tiers). Not to be confused with "Claude" or "Gemini" (the *build* agents
  writing Rezlv's code) — when ambiguous, say "resolution agent" for the
  product and "build agent" for Claude/Gemini.
- **Portal** — the self-serve web experience an end customer lands on via
  the SMS link to resolve their own exception.
- **Carrier write-back** — Rezlv updating a carrier's system (e.g.
  corrected delivery address) via API, as opposed to just reading tracking
  data.
- **RTO (Return to Origin)** — a shipment that gets sent back to the
  merchant instead of reaching the customer (often due to a failed
  delivery attempt or refusal). One of the OKR metrics ("RTOs prevented").
- **NDR (Non-Delivery Report/Reason)** — the carrier's stated reason a
  delivery attempt failed. Common in international/COD-heavy markets;
  relevant even for domestic exception handling.
- **Automated resolution rate** — % of exceptions resolved without any
  human CS agent involvement (merchant OKR metric, target >60% for MVP
  PMF validation, 100% is the "auto-resolved end-to-end" MVP OKR).
- **Autonomy tier** — the Tier 0-4 classification from
  `02-GUARDRAILS.md` §2 describing how much an agent action can happen
  without human approval.

## Business/legal terms

- **PII** — personally identifiable information (see `02-GUARDRAILS.md`
  §3 for classification).
- **Sub-processor** — a third-party service (Stripe, Twilio, Supabase,
  etc.) that processes merchant/customer data on Rezlv's behalf; must be
  disclosed in the Privacy Policy.
- **MRR** — Monthly Recurring Revenue (OKR metric).
- **PMF** — Product-Market Fit.

## Technical/architecture terms

- **Webhook (inbound)** — an event Rezlv receives from an external system
  (Shopify order/fulfillment events, Stripe billing events, carrier
  tracking updates). Always signature-verified before processing
  (`02-GUARDRAILS.md` §4).
- **Idempotency key** — a unique key used to make a retried operation
  (payment, webhook handling) safe to process more than once without
  duplicate side effects.
- **Service role key** — Supabase's server-only, full-access DB credential;
  never exposed client-side (contrast with the public anon key).
- **RLS (Row-Level Security)** — Postgres/Supabase policy mechanism used to
  scope merchant data access at the database layer — a required control,
  not optional, given multi-tenant data (see `01-SRS.md` §Database).
- **Admin dashboard** — the internal, Rezlv-staff-only surface for KYC,
  audits, agent-action oversight, and kill-switch control. Distinct from
  the merchant dashboard (`app/dashboard/*`) and the customer portal.

## Logistics/e-commerce exception terms (see `03-EXCEPTIONS-TAXONOMY.md` for full detail)

- **POD** — Proof of Delivery.
- **OS&D** — Over, Short & Damage (carrier report type for count/damage
  discrepancies).
- **Concealed damage** — damage discovered after delivery, not noted at
  time of delivery — harder to claim, shifts burden of proof.
- **Chargeback** — a payment dispute initiated by the end customer through
  their card issuer/bank, distinct from a merchant-issued refund.

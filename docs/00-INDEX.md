# Rezlv Build Documentation — Index

Rezlv is an **agentic system** that resolves e-commerce delivery exceptions
for Shopify brands: an AI agent detects a shipping exception (delay, damage,
lost, refused, etc.), texts the end customer, resolves it through a
self-serve portal, and writes the resolution back to the carrier — with
minimal or zero human CS involvement. MVP target: 2026-08-01, first 10
paying customers, $5k MRR (source: Rezlv Company OKRs Q3 2026 sheet).

This `docs/` folder is the single source of truth for how Rezlv gets built.
**Every document here is a living document** — update it in place as
decisions change, don't fork copies.

## Reading order for a new contributor (human or AI agent)

1. **[02-GUARDRAILS.md](02-GUARDRAILS.md)** — read this FIRST, always. Nothing
   gets built without checking this doc. Legal/security/privacy guardrails,
   go/no-go gates.
2. **[06-AGENT-COLLABORATION-PROTOCOL.md](06-AGENT-COLLABORATION-PROTOCOL.md)**
   — how Claude and Gemini coordinate on this build, shared state, credential
   locations.
3. **[08-ENVIRONMENT-SETUP.md](08-ENVIRONMENT-SETUP.md)** — every account,
   API key, and free-tier service needed, and where secrets live.
4. **[01-SRS.md](01-SRS.md)** — the exhaustive System Requirements
   Specification. The main build reference.
5. **[07-ARCHITECTURE.md](07-ARCHITECTURE.md)** — diagrams index (Lucid).
6. **[14-CONTENT-TEMPLATES.md](14-CONTENT-TEMPLATES.md)** — SMS/email/portal
   copy library, read before the taxonomy doc since it references this copy.
7. **[03-EXCEPTIONS-TAXONOMY.md](03-EXCEPTIONS-TAXONOMY.md)** — every
   e-commerce delivery exception type, how it's detected, resolved,
   automated vs. human-gated.
8. **[04-PAYMENT-LOGIC.md](04-PAYMENT-LOGIC.md)** — Rezlv's own SaaS billing
   (Stripe) AND merchant-side refund/credit logic the agent can trigger.
9. **[12-MERCHANT-ONBOARDING.md](12-MERCHANT-ONBOARDING.md)** — the actual
   merchant signup → Shopify connect → carrier connect → go-live flow.
10. **[13-SUBPROCESSORS-AND-DPA.md](13-SUBPROCESSORS-AND-DPA.md)** — every
    third party touching merchant/customer data, feeds the Privacy Policy.
11. **[09-TESTING-STRATEGY.md](09-TESTING-STRATEGY.md)**
12. **[10-DEPLOYMENT-RUNBOOK.md](10-DEPLOYMENT-RUNBOOK.md)**
13. **[11-GLOSSARY.md](11-GLOSSARY.md)** — shared vocabulary.
14. **[05-LIVE-BUILD-LOG.md](05-LIVE-BUILD-LOG.md)** — append-only log of
    what's been built/changed. Update every session.
15. **[16-CARRIER-POLICIES.md](16-CARRIER-POLICIES.md)** — per-carrier
    delivery-attempt/RTO/claims/PO-Box policy reference (Canada Post,
    Intelcom, UPS Canada + non-MVP Canadian carriers for context). Read
    alongside `03-EXCEPTIONS-TAXONOMY.md` §1, not standalone.

## Status

17 docs complete as of 2026-07-15 (16 original + `16-CARRIER-POLICIES.md`
added same day). Next: `rezlv-build` skill files.

| Doc | Status |
|---|---|
| 00-INDEX.md | Done |
| 01-SRS.md | Done |
| 02-GUARDRAILS.md | Done |
| 03-EXCEPTIONS-TAXONOMY.md | Done |
| 04-PAYMENT-LOGIC.md | Done |
| 05-LIVE-BUILD-LOG.md | Done (living — update every session) |
| 06-AGENT-COLLABORATION-PROTOCOL.md | Done |
| 07-ARCHITECTURE.md | Done |
| 08-ENVIRONMENT-SETUP.md | Done |
| 09-TESTING-STRATEGY.md | Done |
| 10-DEPLOYMENT-RUNBOOK.md | Done |
| 11-GLOSSARY.md | Done |
| 12-MERCHANT-ONBOARDING.md | Done |
| 13-SUBPROCESSORS-AND-DPA.md | Done |
| 14-CONTENT-TEMPLATES.md | Done |
| 15-FRONTEND-SPEC.md | Done |
| 16-CARRIER-POLICIES.md | Done (added 2026-07-15, per-carrier operational reference) |

### Known corrections pending (from Content Tracker audit, see 06-AGENT-COLLABORATION-PROTOCOL.md)

- ~~Content Tracker naming error~~ **FIXED** — found Rezlv's own dedicated
  service account (`content-strategy@life-project-500503...`, key at
  `Rezlv Product/GTM Info/Content Tracker.json`) and corrected all 7
  "Resolve"→"Rezlv" occurrences directly in the sheet (header, one-liner,
  CVP, category-position line, etc.) via a new write script at
  `Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs`. Everything in `docs/`
  uses "Rezlv," now consistent with the source of truth.
- `01-SRS.md` §5/§8 (notifications/orchestration) currently describes
  SMS+email as parallel channels — actual Confirmed architecture (Jul 13
  SOP decision) is a **3-step escalation ladder**: SMS → email (if no
  reply) → AI voice agent call (before carrier RTO deadline). Needs a
  correction pass.
- `01-SRS.md` §4.3/§2.2 should specify the portal token as **JWT (HS256),
  24hr expiry, single-use** rather than generic "signed token."
- `01-SRS.md`/`08-ENVIRONMENT-SETUP.md` should state carrier execution is
  explicitly **EasyPost + BYOD/BYOCA** (merchant's own UPS/USPS account
  connected through EasyPost) — direct per-carrier API integration is an
  explicit MVP scope exclusion, not a "defer if needed."
- `08-ENVIRONMENT-SETUP.md` needs: EasyPost BYOCA cost ($20/mo +
  $0.08/label), Google Maps API (address validation, has a free tier/$200
  monthly credit) — both currently missing.
- ~~MVP carriers UPS+USPS~~ **CORRECTED 2026-07-15** — Moses confirmed
  Rezlv is **Canadian carriers only for MVP, via BYOD/BYOCA**: Canada Post
  (priority 1), Intelcom (priority 2), UPS Canada (priority 3). No USPS,
  no US-domestic write-back. This was already correct in Content
  Tracker's GTM Strategy tab (Canada-only, BC pilot region) — only the
  older Company Overview tab and derived build docs (`01-SRS.md` was
  already carrier-agnostic and needed no fix; `03-EXCEPTIONS-TAXONOMY.md`,
  `08-ENVIRONMENT-SETUP.md` corrected). Full detail in
  `15-FRONTEND-SPEC.md` §3. Decision logged in Product Control Center's
  Decision Log (2026-07-15).

### Pricing model — RESOLVED 2026-07-15

Previously three conflicting sources (flat $299/$599/$999 tiers in
Product Control Center's roadmap, a 4-tier graduated rate in Content
Tracker's Business Model tab, and a different 4-tier graduated rate in
Content Tracker's ROI & Pricing Calculator tab). **Unified into one 3-tier
graduated rate card** — $8.00/case (1-100/mo), $5.00/case (101-500),
$3.00/case (501+), billed only on `resolved_success` via Stripe Billing
Meters. All three source docs updated to match (via
`Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs`), decision logged in
Product Control Center's Decision Log tab (2026-07-15 entry). Full detail
in `04-PAYMENT-LOGIC.md` §1.

## Existing codebase (as of audit)

- Repo: `Rezlv Product/rezlv-product/` — Next.js 16 (App Router), React 19,
  TypeScript, Tailwind 4, shadcn/ui, Supabase JS client, deployed via Vercel
  (`@vercel/analytics` present).
- Routes already scaffolded (UI shells, not yet wired to real logic —
  verify against code before trusting): `app/(auth)/signup`,
  `app/(auth)/signup/verify`, `app/dashboard`, `app/dashboard/exceptions`,
  `app/dashboard/exceptions/[id]`, `app/dashboard/settings`,
  `app/onboarding/store`, `app/onboarding/carrier`,
  `app/onboarding/live`, `app/onboarding/test`.
- `.env.local` currently only has `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` — no Stripe, Twilio/SMS, carrier API, or
  Shopify keys yet. See 08-ENVIRONMENT-SETUP.md for the full list to add.
- **No admin dashboard exists yet** — required per Moses (KYC, audits, agent
  action oversight, kill-switch). Scoped in 01-SRS.md as its own module.
- **No Rezlv-specific Google service account exists.** All Google service-
  account JSON files found on this machine belong to unrelated personal
  projects (`life-project-500503`, `outreach-engine-495718`) — do not reuse
  them for Rezlv. See 06-AGENT-COLLABORATION-PROTOCOL.md credential audit.

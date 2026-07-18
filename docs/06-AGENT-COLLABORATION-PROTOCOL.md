# Agent Collaboration Protocol — Claude ⇄ Gemini

Both Claude and Gemini are building Rezlv together with **equal authority**.
Neither is "lead" — either may write code, edit docs, or create new `.md`
files if the work requires it, but **both must follow the same shared
process** below so neither works from stale or conflicting assumptions.

## 0. Non-negotiables (read this before anything else)

1. **`docs/02-GUARDRAILS.md` gates every action.** Read it before writing
   code. If a task conflicts with it, stop and flag it in
   `05-LIVE-BUILD-LOG.md` rather than proceeding.
2. **The filesystem is the shared brain.** Neither agent has a live channel
   to the other — coordination happens entirely through files in `docs/`
   and the codebase itself. Read before you write. Write clearly enough
   that the other agent (or Moses) can understand your reasoning without
   you being present.
3. **`docs/05-LIVE-BUILD-LOG.md` is the shared handoff log.** Before
   starting work, read the last ~20 entries. After finishing a unit of
   work, append an entry (format below) — this is how the other agent
   knows what changed and why.
4. **Never silently overwrite the other agent's in-progress work.** If a
   file was modified more recently than your last read of it, re-read it
   before editing — don't blind-write.

## 1. Credential & Account Map (read before touching integrations)

Audited on this machine as of this build phase — **do not reuse any of
these for Rezlv**, they belong to unrelated personal automation projects:

| File | `client_email` / owner | `project_id` | Belongs to |
|---|---|---|---|
| `life-project-500503-986717dc5a5a.json` (root + `Personal/`, duplicate) | `career-learning@life-project-500503.iam.gserviceaccount.com` | `life-project-500503` | Moses's personal Career Learning Doc automation — unrelated |
| `Projects/budgeting-cfo/config/google_credentials.json`, `life_credentials.json`, `life-project-500503-9dd204512461.json`, `life-project-500503-b4eddaacb92d.json` | `life-project@life-project-500503.iam.gserviceaccount.com` | `life-project-500503` | Moses's personal Life Plan / Budget Sheets — unrelated |
| `Projects/outreach-sheet-link/outreach-engine-495718-86dbfb6b6a2d.json` | `sheets-bot@outreach-engine-495718.iam.gserviceaccount.com` | `outreach-engine-495718` | A separate outreach-automation project — unrelated |
| `Projects/outreach-sheet-link/client_secret_...apps.googleusercontent.com.json` | OAuth client (not service account) | — | Same unrelated outreach project |
| `Projects/outreach-sheet-link/gmail-compose-token.json` | OAuth token | — | Same unrelated outreach project |

**Correction (superseded the "zero credentials" claim below this table
originally had):** Rezlv DOES have dedicated Google service accounts —
they just live inside the same `life-project-500503` GCP project as
Moses's personal automation, under Rezlv-specific service account names.
Found in `Rezlv Product/GTM Info/`:

| File | `client_email` | Sheet/Doc it authenticates |
|---|---|---|
| `rezlv_product.json` | `rezlv-product@life-project-500503.iam.gserviceaccount.com` | Rezlv — Product Control Center (Sheet `1ykGJLpRmqg7YIplZGTuTD-og-YworUEiOXwkCMIOoVg`) |
| `Content Tracker.json` | `content-strategy@life-project-500503.iam.gserviceaccount.com` | Content Tracker (Sheet `1qjzK9UzdRvtComNZ5cfb7USX6PDLcyy8aOKYGXV5110`) |
| `Product Log.json` | `rezlv-product-stage-log@life-project-500503.iam.gserviceaccount.com` | Rezlv Product Stage Log (Doc `1OcvUb4E7TLmu-owL20m64U2z1stpHHWVniedLxoFtEY`) |

A read/write script for the two Sheets lives at
`Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs` (same pattern as
`life-os`'s `sheet.js`, reuses its `node_modules` via `NODE_PATH`). It
takes `control` or `content` as the sheet name and maps to the correct key
automatically. **Do not add a Docs-API script for `Product Log.json`
without checking with Moses first** — it hasn't been used yet and Docs API
writes (tab-based) are riskier to get right blind.

**Still true:** none of these are Rezlv's *application* runtime
credentials (Stripe, Twilio, EasyPost, Shopify, etc.) — those still need
creating fresh per `08-ENVIRONMENT-SETUP.md`. These three are specifically
scoped to Rezlv's own planning docs (Sheets/Docs), not product
infrastructure. Do not reuse `career-learning@` or `life-project@`
(Moses's personal automation) for anything Rezlv-related — those remain
out of scope.

**Rezlv's own repo location:** `Rezlv Product/rezlv-product/` (Next.js 16 /
React 19 / TypeScript / Tailwind 4 / shadcn / Supabase JS client, deployed
on Vercel). `.env.local` currently has only Supabase public URL + anon key.
All new secrets get added here (values only in the actual `.env.local` /
Vercel env — never in a doc, chat, or commit).

## 2. Shared State — where each kind of information lives

| Information | Lives in | Who updates it |
|---|---|---|
| Requirements / feature spec | `docs/01-SRS.md` | Either agent, on scope changes confirmed by Moses |
| What's allowed / forbidden | `docs/02-GUARDRAILS.md` | Either agent may propose; Moses must confirm any loosening (see Guardrails §10) |
| Architecture + diagrams | `docs/07-ARCHITECTURE.md` (+ Lucid docs it links) | Either agent |
| Exception type behavior | `docs/03-EXCEPTIONS-TAXONOMY.md` | Either agent |
| Payment/refund logic | `docs/04-PAYMENT-LOGIC.md` | Either agent — payment changes should be flagged loudly in the build log given Guardrails §5 |
| What accounts/keys exist and where | `docs/08-ENVIRONMENT-SETUP.md` | Whoever sets up a new service, immediately |
| What's actually been done | `docs/05-LIVE-BUILD-LOG.md` | **Both, every session, append-only** |
| Terminology | `docs/11-GLOSSARY.md` | Either agent, when introducing a new term |
| Actual code | the repo | Either agent, following `09-TESTING-STRATEGY.md` and guardrails |

## 3. Live Build Log — entry format

Every session, before stopping, append to `docs/05-LIVE-BUILD-LOG.md`:

```
## YYYY-MM-DD HH:MM (agent: claude|gemini)
**Did:** <what was built/changed/deleted, with file paths>
**Why:** <reasoning, or link to the SRS/decision it implements>
**Docs touched:** <list>
**Blocked on:** <anything needing Moses — e.g. "need Stripe account created", "need legal review of ToS clause X">
**Next:** <what the next session — you or the other agent — should pick up>
```

Never delete a past entry. If something is wrong, add a correction entry
referencing the original.

## 4. What requires stopping and asking Moses

Per `02-GUARDRAILS.md`, and restated here since it's the most common
handoff point between agents:

- Any external account that needs to be created (Stripe, Twilio, a specific
  business email like `support@rezlv.com`, a carrier developer account,
  Shopify Partner account) — **agents cannot self-serve sign-ups that
  require Moses's identity, business info, or payment method.** Stop, list
  exactly what's needed and why, append to the build log under "Blocked
  on," and surface it to Moses directly.
- Any guardrail change (Guardrails §10).
- Any Tier 3/4 agent-autonomy classification decision that isn't already
  covered in `02-GUARDRAILS.md` §2.
- Legal-adjacent copy (ToS, Privacy Policy language) — draft it, but flag
  clearly that it needs real legal review before going live (Guardrails
  §6).

## 5. Parent Skill / Sub-Skill Orchestration (Claude side)

This project uses **Claude Code skills**, not standalone spawned agents, to
structure the build — skills are the right tool here because this is a
long-running, resumable, file-grounded build process (not a one-shot
parallel research task), and skills let a human (Moses) or Claude itself
re-enter the workflow at any point by reading the same docs.

**Parent skill:** `rezlv-build` (`.claude/skills/rezlv-build/SKILL.md`,
project-scoped to `Rezlv Product/rezlv-product/`). When invoked, it:

1. Reads `docs/05-LIVE-BUILD-LOG.md` to see what's already done.
2. Reads `docs/00-INDEX.md`'s status table to see which docs still need
   work.
3. Reads `docs/02-GUARDRAILS.md` (always, every invocation).
4. Determines which phase of the build is next (docs → schema → API →
   integrations → admin dashboard → testing → deployment) and either
   continues doc-writing or invokes the relevant sub-skill for that phase.
5. Stops and surfaces to Moses whenever it hits a "requires Moses" item
   (§4 above), rather than guessing.

**Sub-skills** (each `.claude/skills/rezlv-<name>/SKILL.md`, invoked by the
parent or directly by Moses). This is a full-stack build — frontend and
backend sub-skills are both first-class, not an afterthought:

- `rezlv-schema` — Supabase/Postgres schema, RLS policies, Shopify webhook
  ingestion, NDR classifier. Informed by `01-SRS.md` §2, §3.1,
  `03-EXCEPTIONS-TAXONOMY.md`.
- `rezlv-frontend` — merchant-facing app: auth, onboarding (screens
  001-006, 040), Case Queue/Detail, Settings, system states. Informed by
  `15-FRONTEND-SPEC.md`, `12-MERCHANT-ONBOARDING.md`. Reuses the existing
  `base-nova` shadcn design system and logo components — never starts a
  parallel design system.
- `rezlv-portal` — the customer-facing resolution portal, built as its own
  isolated surface (no shared chrome with the merchant dashboard, no
  Rezlv branding). Informed by `15-FRONTEND-SPEC.md` §4 (screens 016-019),
  `01-SRS.md` §4.1 (JWT token model), `14-CONTENT-TEMPLATES.md` §4.
- `rezlv-exceptions-engine` — the core agent logic that detects/classifies/
  resolves exceptions and drives the SMS→email→voice escalation ladder,
  including Canadian carrier (Canada Post/Intelcom/UPS Canada) write-back
  via EasyPost BYOD. Informed by `03-EXCEPTIONS-TAXONOMY.md`,
  `14-CONTENT-TEMPLATES.md`, Guardrails §2 (autonomy tiers).
- `rezlv-admin-dashboard` — the internal KYC/audit/agent-oversight/kill-
  switch dashboard (both backend API and its structurally-separate
  frontend shell). Informed by `01-SRS.md` §6, `15-FRONTEND-SPEC.md`
  (screens 020-023, 034-035).
- `rezlv-payments` — Stripe Billing Meters ($8/$5/$3 graduated model) +
  merchant-side refund/credit integration. Informed by
  `04-PAYMENT-LOGIC.md` and Guardrails §5.
- `rezlv-testing` — writes/maintains the test suite per
  `09-TESTING-STRATEGY.md`; also invoked incrementally by every other
  sub-skill at its "mark this done" checkpoint, not just as a final pass.

Each sub-skill's `SKILL.md` starts with the same line:
`Before doing anything, read docs/02-GUARDRAILS.md and docs/05-LIVE-BUILD-LOG.md.`

## 6. Gemini Equivalent — copy/paste this to Gemini

Gemini doesn't have Claude Code's skill-file mechanism, so give it the
following as a standing system/project instruction (e.g. in a Gemini Gem,
project instructions, or pasted at the start of every Gemini session
working on this repo). **Everything below this line is meant to be copied
verbatim to Gemini:**

---

> You are working as a co-builder on Rezlv, an agentic system that resolves
> e-commerce delivery exceptions for Shopify brands (detect exception → SMS
> customer → self-serve resolution portal → carrier write-back), alongside
> Claude, who has equal authority to you on this build. Neither of you is
> "lead" — you coordinate entirely through files, not live chat with each
> other.
>
> **Repo:** `Rezlv Product/rezlv-product/` — Next.js 16 (App Router), React
> 19, TypeScript, Tailwind 4, shadcn/ui, Supabase (Postgres) as the backend,
> deployed on Vercel.
>
> **Before you do anything else, every session:**
> 1. Read `docs/02-GUARDRAILS.md` in full. This gates everything — agent
>    autonomy tiers, PII handling, secrets handling, payment rules, legal
>    guardrails, testing requirements. If what you're about to do conflicts
>    with it, stop and flag it instead of proceeding.
> 2. Read `docs/05-LIVE-BUILD-LOG.md`, at least the most recent ~20 entries,
>    to see what Claude (or you, in a prior session) already did and what's
>    still open/blocked.
> 3. Read `docs/00-INDEX.md` for the current status of every doc in
>    `docs/`.
> 4. Read `docs/01-SRS.md` for the actual requirements before implementing
>    anything.
>
> **Credential reality check:** Rezlv has **no dedicated cloud credentials
> yet**. Any Google/Stripe/Twilio/Shopify/carrier-API JSON key or service
> account file you find elsewhere on this machine (anything referencing
> `life-project-500503` or `outreach-engine-495718`) belongs to Moses's
> unrelated personal projects — **never use them for Rezlv.** Every service
> Rezlv needs must be set up fresh; see `docs/08-ENVIRONMENT-SETUP.md` for
> the full list and check with Moses before assuming an account exists.
>
> **When you finish a unit of work**, append an entry to
> `docs/05-LIVE-BUILD-LOG.md` in this format:
> ```
> ## YYYY-MM-DD HH:MM (agent: gemini)
> **Did:** ...
> **Why:** ...
> **Docs touched:** ...
> **Blocked on:** ...
> **Next:** ...
> ```
> Never delete a prior entry, including Claude's. If you disagree with a
> prior decision, add a new entry explaining why and what you're changing —
> don't silently overwrite.
>
> **You may create new `.md` files** in `docs/` if a piece of required
> knowledge doesn't fit an existing doc — but add it to the table in
> `docs/00-INDEX.md` immediately so Claude and Moses know it exists, and
> follow the same "living document, update in place" rule as every other
> doc here.
>
> **Stop and ask Moses directly** (don't guess, don't ask Claude — Claude
> won't see it live) whenever you hit: a new external account/sign-up that
> needs Moses's identity or payment method, a guardrail change, an
> unclassified Tier 3/4 autonomous-agent-action decision, or legal-adjacent
> copy (Terms of Service, Privacy Policy) that needs real legal review.
>
> **Money/PII/agent-autonomy code always needs a test** before you consider
> it done — see `docs/09-TESTING-STRATEGY.md`. This is not optional per
> `docs/02-GUARDRAILS.md` §8.
>
> Budget consciousness: this is a bootstrapped MVP. Prefer free-tier
> services wherever `docs/08-ENVIRONMENT-SETUP.md` notes one exists, and
> flag any service that requires payment before assuming it's fine to sign
> up for.

---

**End of Gemini copy-paste block.**

## 7. Avoiding Duplicate/Conflicting Work

- Before starting a sub-skill's scope of work (schema, API, payments,
  etc.), check `05-LIVE-BUILD-LOG.md` for recent entries touching the same
  area — if the other agent is mid-way through it, don't start a
  conflicting parallel implementation. Either pick different scope or
  extend what's there.
- If both agents genuinely need to touch the same file in the same
  session, smaller/more frequent build-log entries are better than one
  giant one at the end — it reduces the chance of a silent overwrite.
- Class naming/schema naming conventions are defined once in
  `01-SRS.md`/`11-GLOSSARY.md` — don't introduce a second name for the same
  concept (e.g. "exception" vs "incident" vs "case") without updating the
  glossary and both docs.

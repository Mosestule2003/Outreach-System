---
name: rezlv-frontend
description: Builds Rezlv's merchant-facing frontend — auth, onboarding, Case Queue/Detail, Settings, system states. Stage 2 of rezlv-build. Use when merchant dashboard screens don't exist yet or need updating.
---

# rezlv-frontend

Before anything else: read `docs/02-GUARDRAILS.md` and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/15-FRONTEND-SPEC.md` in full
and `docs/12-MERCHANT-ONBOARDING.md`.

## Scope

All merchant-facing screens from `15-FRONTEND-SPEC.md` §4 except the
customer portal (`rezlv-portal`) and admin screens (`rezlv-admin-dashboard`):
Auth (001-002), Onboarding (003-006, 040), Dashboard (007-013),
Analytics (014-015, P1/deferred), Settings (024-027), System (028-033).

## Hard constraints — do not deviate

- **Reuse the existing `base-nova` shadcn design system.** `components.json`
  is already configured. Do not introduce a parallel design-token system
  or different shadcn style.
- **Reuse existing brand components**: `components/ui/logo.tsx`,
  `components/ui/logomark.tsx`, `components/marketing/logo-strip.tsx`.
  Don't recreate logo rendering.
- Build the component inventory in `15-FRONTEND-SPEC.md` §5 as shared,
  reusable components — not one-off per-screen implementations. In
  particular: `FamilyBadge` must carry a text label (not color alone —
  accessibility requirement), `AddressCorrectionForm` is ≤3 fields max,
  `CarrierCredentialForm` needs both an OAuth-button variant and an
  API-key-input variant (not one generic form), admin `Table` and
  merchant `Table` are two distinct variants.
- Case Detail — **Family 1 (correctable info) and Family 2/3/5 must be
  visually distinct screens/timeline shapes**, not one generic template
  reused with different data (explicit design requirement, screens
  009 vs. 010).
- Merchant sidebar must never be visually confusable with the admin
  sidebar `rezlv-admin-dashboard` builds — check this cross-skill
  constraint even though you're not building the admin shell yourself.

## When unclear

The "Family 4" naming gap flagged in `15-FRONTEND-SPEC.md` §7 — screens/
components reference Family 1/2/3/5 with no Family 4 anywhere found. Check
whether `03-EXCEPTIONS-TAXONOMY.md`'s 5 NDR categories map cleanly to
these "family" numbers before building `FamilyBadge`'s 5 variants or the
Case Detail split — if the mapping isn't obvious from the docs, **stop and
ask Moses** rather than guessing which NDR category is "Family 4" or
inventing a mapping.

## Done when

Each screen's states (per the "States" column in `15-FRONTEND-SPEC.md` §4)
are implemented, not just the default state — empty/loading/error states
are explicit requirements, not polish. Component-level tests exist for
the accessibility/branding-constrained components per
`09-TESTING-STRATEGY.md` §3. `05-LIVE-BUILD-LOG.md` updated.

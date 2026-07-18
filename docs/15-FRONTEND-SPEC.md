# Rezlv — Frontend Specification

Source: Content Tracker's "UX Screen Inventory" and "UX Component
Inventory" tabs (Phase 4, dated 2026-07-07/08 — the most current UX
authority, supersedes Product Control Center's earlier 2026-07-02 30-screen
inventory). Pulled directly from the sheet via
`Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs`, not guessed.

## 1. Design System (already configured — reuse, don't rebuild)

- **shadcn/ui style: `base-nova`**, already set in
  `Rezlv Product/rezlv-product/components.json`.
- Tailwind config lives in `app/globals.css` (CSS-variable-based, neutral
  base color, no separate `tailwind.config` file — Tailwind 4 pattern).
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`,
  `@/lib/utils`.
- Icon library: `lucide` (already a dependency).
- **Explicit instruction from Content Tracker:** "Reuse existing codebase
  tokens rather than starting a parallel system" — do not introduce a
  second design-token system or a different shadcn style for the app
  vs. the existing marketing site.

## 2. Brand Assets (already in the repo)

- Logo source: `Rezlv Product/Logos/Rezlv Logo.png` (master asset, outside
  the repo).
- In-repo components: `components/ui/logo.tsx`, `components/ui/logomark.tsx`,
  `components/marketing/logo-strip.tsx` — use these existing components,
  don't create new ones for the app/dashboard/portal surfaces.
- Integration/carrier logos already present at `public/logos/`: Canada
  Post (+ color variant), EasyPost, Google Maps (+ color), Intelcom,
  Shopify (+ color), Twilio, UPS (+ color), USPS (+ color). These cover
  onboarding's carrier-connect step and any "powered by" attribution UI.

## 3. Carrier scope — RESOLVED 2026-07-15, EXPANDED 2026-07-15: any feasible Canadian carrier, BYOD

Moses confirmed directly: **Rezlv is strictly Canadian-domestic carriers
for MVP, via BYOD/BYOA** — no USPS, no US-domestic-only carrier work. USPS
logo asset in `public/logos/` predates this decision, unused/legacy.

**Expanded same day:** originally scoped to 3 carriers (Canada Post,
Intelcom, UPS Canada); Moses then directed "any carrier that is feasible
for us, add them — restricted to Canada." After confirming EasyPost BYOCA
support and genuine Canadian-domestic delivery capability per carrier
(`16-CARRIER-POLICIES.md` §1), the confirmed carrier set is now:

**Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis
Express, FedEx Canada** — all confirmed to have an EasyPost carrier guide
and genuine Canadian-domestic last-mile service. **Excluded:** DHL
Express Canada (EasyPost's own guide confirms DHL Express does not offer
domestic service within Canada — international-only, not useful for a
domestic exception-resolution product) and Amazon Logistics (closed
network, not accessible to an arbitrary Shopify merchant via BYOA).
GLS Canada is unconfirmed on EasyPost (only GLS US is documented) — do
not add to the onboarding carrier-connect wizard until verified directly.

Onboarding wizard priority order (by ecommerce DTC relevance, not raw
parcel volume): **Canada Post, UPS Canada, Intelcom, Purolator, Canpar
Express, Loomis Express, FedEx Canada.** New carrier logo assets needed
for Purolator/Canpar/Loomis Express in `public/logos/` (Canada
Post/Intelcom/UPS/FedEx already present) — flag for the design pass.

**Downstream implication:** Content Tracker's GTM Strategy tab records a
70% US / 30% Canada outreach geography split, justified specifically by
"UPS Intercept API US-only for MVP." That justification no longer holds
under a Canada-only carrier scope — the geography split itself needs
re-examination (not this doc's call to make; flag to Moses/GTM planning,
not silently reversed here).

## 4. Screen Inventory Summary (39 screens, ID 001–040 with one gap)

Full detail lives in the sheet (Content Tracker → UX Screen Inventory) —
this is the structural summary for planning. Screens are gated P0
(MVP-blocking) or P1 (deferred).

| Group | Screens (P0 unless noted) |
|---|---|
| **Auth** | Login (Google OAuth via Supabase), Auth Callback/Loading |
| **Onboarding** | Shopify OAuth Install, BYOA Carrier Connect Wizard (per-carrier states), Resume Prompt (partial onboarding), Complete, **First-Time Guided Tour (coachmark overlay, founder-requested)** |
| **Merchant Dashboard** | Case Queue (+ empty state), Case Detail — Family 1 (correctable info) vs. **Case Detail — Family 2/3/5 (visually distinct timeline shape — explicit design requirement, do not reuse one generic template)**, Case Detail — Manual Fallback, Carrier Connection Status Panel, Metrics Strip (inline, not a separate screen at P0) |
| **Analytics** (P1, deferred wk 2-3) | Analytics Dashboard, Analytics Empty State |
| **Customer Portal** (no Rezlv branding — merchant-branded only, ties to `14-CONTENT-TEMPLATES.md` §7 tone guide) | Active (≤3 fields, mobile-first, Family 1 only), Expired (>24hr JWT), Already Submitted, Confirmed |
| **Internal Admin** (visually distinct shell from merchant nav — Spec D requirement, ties to `01-SRS.md` §6) | Cross-Merchant Case Search/List, Case Detail (raw carrier-adapter payloads for debugging), Carrier Health (aggregate), Billing/Usage Overview, **Audit Log Viewer (P1)**, **Permission Denied/403 (fail-closed, not redirect-and-reveal, for a merchant-scoped token hitting an admin route)** |
| **Settings** | Carrier Connections, Team Members (Owner/Admin/Viewer roles), Profile & Billing (Stripe Customer Portal embed), Contact-Sequence Preferences (P1 placeholder — "light tuning" identity decision) |
| **System** | 404, 500, Loading, Maintenance, **Session Expired (merchant JWT is 30-day — needs its own screened state)** |
| **Modals** | Confirm Manual Resolve, Confirm Carrier Reconnect, Confirm Remove Team Member, Admin Override Confirmation (P1 — reason-field required/optional is an open question) |

**Removed from the earlier 2026-07-02 inventory** (didn't map to the
current 5-family exception taxonomy — see `03-EXCEPTIONS-TAXONOMY.md`,
which should be cross-checked against "5-family" framing, not just the 5
NDR categories, before Sprint 1/2 build — possible terminology drift worth
resolving): failed-attempt delivery-window picker, pickup point selector,
carrier intercept fee disclosure, portal "write-back failed" state
(superseded by merchant-facing Manual Fallback — customer never sees a
raw failure, only an eventual outcome notification).

## 5. Component Inventory Summary

| Category | Components | Key constraint |
|---|---|---|
| Navigation | Sidebar (merchant), Sidebar (admin), BottomNav (mobile), TopBar, Breadcrumbs | Admin sidebar must be **visually distinct** from merchant sidebar — never confusable (Spec D) |
| Actions | Button, IconButton, LinkButton, **ManualResolveButton** | ManualResolveButton needs a distinct style signaling human override, not a normal action |
| Data Display | CaseCard/CaseRow, CarrierStatusBadge, **FamilyBadge** (5 variants), StatCard, Avatar, Tag, RTOCounter | FamilyBadge must carry a text label, not color alone — accessibility requirement |
| Forms | Input, Select, **AddressCorrectionForm** (≤3 fields max), **CarrierCredentialForm** (OAuth-button variant AND API-key-input variant — not one generic form), Toggle | |
| Feedback | Toast, Alert, Skeleton, Spinner, EmptyState, ErrorState, **ExpiredLinkState** | ExpiredLinkState carries NO Rezlv branding — merchant brand only |
| Layout | Card, Section, Divider, Modal, Sheet, Drawer | |
| Data | Table (dense/admin variant + friendlier/merchant variant — two variants, not one), FilterBar, Timeline | |
| Specialized | FamilyBadge, CarrierBadge, CaseStatusBadge, PortalExpiredState, AdminOverrideDialog, OnboardingCarrierStep, **Coachmark/Tour Tooltip** | |

## 6. Existing Lucid Diagrams (already generated — link, don't regenerate)

From the "Rezlv — Product Diagrams" Lucid folder, referenced in the UX
Screen Inventory tab:

- [Sitemap & Screen Relationship Map](https://lucid.app/lucidchart/ab52a114-cf5c-4127-8a0f-8e9c2e7bbbc5/view)
- [Permission Matrix](https://lucid.app/lucidchart/90827b18-d18e-4af2-9300-595d71546a65/view)
- [Authentication + Onboarding Flow](https://lucid.app/lucidchart/b55a0956-f4c6-4ce9-a1d6-f8e3e353c87a/view)
- [Backend Integration + Notification Flow](https://lucid.app/lucidchart/6373c97e-71b5-45b1-b7e1-6f2a881b03a9/view)

`07-ARCHITECTURE.md` should index these directly rather than regenerating
duplicate diagrams — only generate new Lucid diagrams for gaps these four
don't cover (e.g. a dedicated data-model/ERD diagram, which doesn't appear
in this list yet).

## 7. Open Questions Flagged in the Source Data (carry into `00-INDEX.md`)

1. Carrier scope conflict (§3 above) — needs Moses's confirmation.
2. `AdminOverrideDialog`'s reason field — required or optional? Explicitly
   flagged as unresolved in the source, blocks Sprint 2 admin override
   tooling.
3. "5-family" exception taxonomy framing (screens/components reference
   Family 1/2/3/5 — note: no Family 4 mentioned anywhere found, verify
   whether that's intentional or a naming gap) vs. `03-EXCEPTIONS-TAXONOMY.md`'s
   5 NDR-category framing (`address_issue/failed_attempt/access_issue/
   carrier_delay/customs_hold`) — confirm these map 1:1 or reconcile
   before frontend components are built against exception state, since
   `FamilyBadge` (5 variants) and the case-detail screen split (009 vs 010)
   are built directly against whichever taxonomy is authoritative.

// Inline illustration components — polished SaaS dashboard aesthetic

// ── Shared primitives ──────────────────────────────────────────────────────

function BrowserChrome({ children, url = "app.rezlv.io" }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* Chrome bar */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400/70" />
          <div className="size-3 rounded-full bg-amber-400/70" />
          <div className="size-3 rounded-full bg-emerald-400/70" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/80 px-3 py-1 text-[11px] text-gray-400 shadow-sm ring-1 ring-gray-200">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="shrink-0">
            <path d="M4.5 1a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="#9ca3af" strokeWidth="1"/>
            <path d="M4.5 2.5V4.5l1 1" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}

function FloatingCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute rounded-xl border border-gray-100 bg-white p-3 shadow-lg ${className}`}>
      {children}
    </div>
  )
}

// ── Hero Dashboard Illustration ────────────────────────────────────────────

export function HeroDashboardIllustration() {
  return (
    <div className="relative w-full font-sans">
      <BrowserChrome url="app.rezlv.io/decisions">
        <div className="bg-[#f8f8f8] p-5">
          {/* Top nav */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-lg bg-black">
                <div className="size-2.5 rounded-full bg-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">rezlv</span>
            </div>
            {/* Human agent avatar row */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Active agents</span>
              <div className="flex -space-x-2">
                {/* Stylised human avatars */}
                <div className="size-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center overflow-hidden">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.5" fill="#818cf8"/>
                    <path d="M2.5 13.5C2.5 10.74 5.01 8.5 8 8.5s5.5 2.24 5.5 5" stroke="#818cf8" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="size-7 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center overflow-hidden">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.5" fill="#34d399"/>
                    <path d="M2.5 13.5C2.5 10.74 5.01 8.5 8 8.5s5.5 2.24 5.5 5" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="size-7 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center overflow-hidden">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.5" fill="#fbbf24"/>
                    <path d="M2.5 13.5C2.5 10.74 5.01 8.5 8 8.5s5.5 2.24 5.5 5" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">3 online</span>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">

            {/* Left column */}
            <div className="flex flex-col gap-3">
              {/* Active ticket */}
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Incoming ticket</span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">Needs decision</span>
                </div>
                <p className="text-sm font-bold text-gray-900">Customer #4821 — Return request</p>
                <p className="mt-0.5 text-[11px] text-gray-400">Order $312 · 38 days since purchase · VIP</p>
                <div className="mt-3 h-px bg-gray-100" />
                <div className="mt-3 flex items-start gap-2">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Policy match: Approve refund</p>
                    <p className="text-[10px] text-gray-400">Within 45-day window · under $400 threshold</p>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <div className="size-1.5 rounded-full bg-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">Draft reply generated · awaiting agent approval</p>
                </div>
              </div>

              {/* Exception card */}
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exception flagged</span>
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500">Owner assigned</span>
                </div>
                <p className="text-sm font-bold text-gray-900">VIP customer — refund outside policy</p>
                <p className="mt-0.5 text-[11px] text-gray-400">$890 order · 61 days · 12 prior orders</p>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2">
                  {/* Human agent avatar */}
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-200">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="4.5" r="2" fill="#6366f1"/>
                      <path d="M2 11c0-2.21 2.01-4 4.5-4s4.5 1.79 4.5 4" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-indigo-900">Assigned to Sarah L.</p>
                    <p className="text-[10px] text-indigo-400">CX Lead · 2hr SLA · logged</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black p-4 text-white">
                  <p className="text-xl font-bold">97%</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">On-policy decisions</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xl font-bold text-gray-900">0</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">Unowned exceptions</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent decisions</p>
                {[
                  { id: "#4819", label: "Approved", cls: "text-emerald-600 bg-emerald-50" },
                  { id: "#4820", label: "Escalated", cls: "text-amber-600 bg-amber-50" },
                  { id: "#4821", label: "Pending", cls: "text-gray-500 bg-gray-100" },
                ].map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-1.5">
                    <span className="text-[11px] text-gray-500">{r.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.cls}`}>{r.label}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CX escalations</p>
                <div className="mt-2 flex h-8 items-end gap-0.5">
                  {[40, 65, 30, 20, 15, 10, 8].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${i === 6 ? "bg-black" : "bg-gray-100"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-gray-400">-80% since policy embedded</p>
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>

      {/* Floating annotation — founder relief */}
      <div className="absolute -right-3 top-16 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xl lg:block">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="4.5" r="2.5" fill="#34d399"/>
              <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-900">Founder not pinged</p>
            <p className="text-[10px] text-gray-400">3 exceptions resolved today</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Decision Delegation Illustration ──────────────────────────────────────

export function DecisionDelegationIllustration() {
  return (
    <div className="relative w-full font-sans">
      <BrowserChrome url="app.rezlv.io/exceptions">
        <div className="bg-[#f8f8f8] p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Exception routing</p>

          <div className="flex flex-col gap-3">
            {/* Step 1 */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">01</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Exception detected</p>
                  <p className="text-xs text-gray-400">Refund request outside standard policy window</p>
                </div>
                <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 whitespace-nowrap">No match</span>
              </div>
            </div>

            <div className="flex justify-center">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M10 0v12M10 12l-4-4M10 12l4-4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">02</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Owner auto-assigned</p>
                  <p className="text-xs text-gray-400">Based on exception type and escalation rules</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2">
                {/* Human figure avatar */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-200">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="2.5" fill="#6366f1"/>
                    <path d="M2.5 14c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="#6366f1" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900">Sarah L. · CX Lead</p>
                  <p className="text-[10px] text-indigo-400">Nudge sent · 2hr SLA</p>
                </div>
                <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">Notified</span>
              </div>
            </div>

            <div className="flex justify-center">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M10 0v12M10 12l-4-4M10 12l4-4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">03</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Deviation logged with reason</p>
                  <p className="text-xs text-gray-400">VIP exception approved · rationale recorded</p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Resolved</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { v: "2 hrs", l: "Avg resolution" },
              { v: "100%", l: "Exceptions owned" },
              { v: "0", l: "Lost in Slack" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white p-3 text-center shadow-sm">
                <p className="text-base font-bold text-gray-900">{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </BrowserChrome>

      {/* Floating annotation */}
      <div className="absolute -left-3 bottom-16 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xl lg:block">
        <p className="text-[11px] font-bold text-gray-900">Founder not involved</p>
        <p className="text-[10px] text-gray-400">Exception handled by team</p>
      </div>
    </div>
  )
}

// ── Customer Context Illustration ─────────────────────────────────────────

export function CustomerContextIllustration() {
  return (
    <div className="relative w-full font-sans">
      <BrowserChrome url="app.rezlv.io/tickets/4821">
        <div className="bg-[#f8f8f8] p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer decision view</p>

          <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
            {/* Left — customer profile */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Human avatar */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-900">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3.5" fill="white"/>
                      <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Maya K.</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">VIP</span>
                      <span className="text-[10px] text-gray-400">12 orders</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { l: "LTV", v: "$2,140" },
                    { l: "Avg order", v: "$178" },
                    { l: "Returns", v: "1" },
                    { l: "CSAT", v: "4.9 ★" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg bg-gray-50 px-2.5 py-2">
                      <p className="text-[10px] text-gray-400">{m.l}</p>
                      <p className="text-sm font-bold text-gray-900">{m.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tickets</p>
                {[
                  { t: "Return #4821", s: "Pending", c: "text-amber-600 bg-amber-50" },
                  { t: "Query #4788", s: "Resolved", c: "text-emerald-600 bg-emerald-50" },
                ].map((tk) => (
                  <div key={tk.t} className="flex items-center justify-between py-1.5">
                    <span className="text-[11px] text-gray-600">{tk.t}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tk.c}`}>{tk.s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — policy check + draft */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Policy check</p>
                {[
                  "Within return window",
                  "Amount under threshold",
                  "No prior abuse flags",
                  "VIP override eligible",
                ].map((check) => (
                  <div key={check} className="flex items-center gap-2 py-1">
                    <div className="flex size-4 items-center justify-center rounded-full bg-emerald-100">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-gray-700">{check}</span>
                  </div>
                ))}
                <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-bold text-emerald-800">Recommendation: Approve refund</p>
                </div>
              </div>

              <div className="rounded-xl bg-black p-4 text-white">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Draft reply</p>
                <p className="text-xs leading-relaxed text-gray-300">
                  &ldquo;Hi Maya, thanks for reaching out. We&apos;ve reviewed your return and are happy to process a full refund...&rdquo;
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-white py-1.5 text-[11px] font-bold text-black">Approve &amp; Send</button>
                  <button className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>

      {/* Floating annotation */}
      <div className="absolute -right-3 top-20 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xl lg:block">
        <p className="text-[11px] font-bold text-emerald-700">All checks passed</p>
        <p className="text-[10px] text-gray-400">Policy auto-checked</p>
      </div>
    </div>
  )
}

// ── Integration Illustration ───────────────────────────────────────────────

export function IntegrationIllustration() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-[#f2f2f0] p-7 font-sans">
      <p className="mb-7 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">How rezlv connects to your stack</p>

      {/* Three-node row */}
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-0">
        {/* Store node */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-gray-900">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14L14.5 13H3.5L2 4z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
              <circle cx="6" cy="16" r="1.2" fill="white"/>
              <circle cx="12" cy="16" r="1.2" fill="white"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900">Your store</p>
          <p className="mt-1 text-[10px] text-gray-400">Ecommerce platform</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 px-3">
          <div className="relative h-px w-10 bg-gray-300">
            <div className="absolute -right-1 -top-[3px] h-[7px] w-[7px] rotate-45 border-r-[1.5px] border-t-[1.5px] border-gray-400" />
          </div>
          <span className="whitespace-nowrap text-[9px] text-gray-400">orders · LTV</span>
        </div>

        {/* rezlv center node */}
        <div className="rounded-2xl bg-black p-5 text-center shadow-lg">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-white/10">
            <div className="size-4 rounded-full bg-white" />
          </div>
          <p className="text-sm font-bold text-white">rezlv</p>
          <p className="mt-1 text-[10px] text-gray-500">Decision layer</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 px-3">
          <div className="relative h-px w-10 bg-gray-300">
            <div className="absolute -right-1 -top-[3px] h-[7px] w-[7px] rotate-45 border-r-[1.5px] border-t-[1.5px] border-gray-400" />
          </div>
          <span className="whitespace-nowrap text-[9px] text-gray-400">tickets · context</span>
        </div>

        {/* Helpdesk node */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-gray-900">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="10" rx="2" stroke="white" strokeWidth="1.2"/>
              <path d="M6 13v2.5l3-2.5h3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900">Your helpdesk</p>
          <p className="mt-1 text-[10px] text-gray-400">Support platform</p>
        </div>
      </div>

      {/* Data columns */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">From your store</p>
          {["Order history", "Customer LTV", "Purchase dates", "Return history"].map((d) => (
            <div key={d} className="flex items-center gap-1.5 py-0.5">
              <div className="size-1.5 shrink-0 rounded-full bg-gray-300" />
              <span className="text-[10px] text-gray-500">{d}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-black p-3 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">rezlv processes</p>
          {["Check against policy", "Assign exception owner", "Draft on-policy reply", "Log deviation + reason"].map((d) => (
            <div key={d} className="flex items-center gap-1.5 py-0.5">
              <div className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-gray-400">{d}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">From your helpdesk</p>
          {["Ticket history", "Agent assignments", "CSAT scores", "VIP tags"].map((d) => (
            <div key={d} className="flex items-center gap-1.5 py-0.5">
              <div className="size-1.5 shrink-0 rounded-full bg-gray-300" />
              <span className="text-[10px] text-gray-500">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["REST API", "Webhook sync", "Real-time", "Human-in-loop", "Shopify · Gorgias · Zendesk"].map((b) => (
          <div key={b} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-600 shadow-sm">
            {b}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Testimonials Illustration ──────────────────────────────────────────────

export function TestimonialsIllustration() {
  const quotes = [
    {
      name: "Jamie R.",
      role: "Founder, DTC Apparel",
      revenue: "$1.2M",
      quote: "Before rezlv, every edge case ended up in my DMs. Now exceptions get handled without me — and I can see exactly what was decided and why.",
      metric: "90% fewer founder escalations",
      dark: true,
    },
    {
      name: "Anika T.",
      role: "CX Lead, Beauty Brand",
      revenue: "$800K",
      quote: "My team used to give three different answers to the same question. That stopped. The policy is just there, every time, in the tool they already use.",
      metric: "74% fewer inconsistent replies",
      dark: false,
    },
    {
      name: "Diego M.",
      role: "Ops Manager, Home Goods",
      revenue: "$1.8M",
      quote: "Setup took one working session. Two weeks in, our CX lead stopped being the final word on everything. That alone saved us hours every week.",
      metric: "2 weeks to full rollout",
      dark: false,
    },
  ]

  return (
    <div className="w-full font-sans">
      <div className="grid gap-4 sm:grid-cols-3">
        {quotes.map((q) => (
          <div key={q.name} className={`rounded-2xl p-5 ${q.dark ? "bg-gray-900" : "bg-white border border-gray-100"} shadow-sm`}>
            {/* Human avatar + name */}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${q.dark ? "bg-white/10" : "bg-gray-100"}`}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="3" fill={q.dark ? "rgba(255,255,255,0.6)" : "#9ca3af"}/>
                  <path d="M2.5 16.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke={q.dark ? "rgba(255,255,255,0.6)" : "#9ca3af"} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className={`text-sm font-bold ${q.dark ? "text-white" : "text-gray-900"}`}>{q.name}</p>
                <p className={`text-[11px] ${q.dark ? "text-gray-400" : "text-gray-400"}`}>{q.role}</p>
              </div>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${q.dark ? "bg-white/10 text-gray-300" : "bg-gray-50 text-gray-500"}`}>{q.revenue}</span>
            </div>

            <p className={`text-xs leading-relaxed ${q.dark ? "text-gray-400" : "text-gray-500"} mb-4`}>
              &ldquo;{q.quote}&rdquo;
            </p>

            <div className={`rounded-lg px-3 py-2 text-[11px] font-bold ${q.dark ? "bg-white/10 text-white" : "bg-gray-50 text-gray-700"}`}>
              {q.metric}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { TESTIMONIALS, FAQ_LIST } from "@/lib/mockData";

/* Brand palette (from logo.jpg)
   Navy  #203060  — duct pipe, primary dark
   Royal #0050a0  — swirl, primary mid
   Sky   #60a0d0  — arrows, accent light
*/

// ── Small primitives ──────────────────────────────────────────────

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0050a0] dark:text-[#60a0d0] bg-[#e6f0f9] dark:bg-[#0050a0]/10 border border-[#c0d9f0] dark:border-[#0050a0]/20 rounded-md">
      {children}
    </span>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < n ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Trust strip ───────────────────────────────────────────────────

function TrustBar() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1225]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center divide-x divide-slate-200 dark:divide-slate-800">
          {[
            "4.9 / 5.0 from 600+ verified homeowners",
            "NADCA Certified · Member #78294",
            "Guaranteed 2-Hour Arrival Windows",
            "100% Flat-Rate · Zero Hidden Fees",
          ].map((text) => (
            <div
              key={text}
              className="flex items-center gap-2 px-6 py-3.5 text-[12.5px] font-medium text-slate-600 dark:text-slate-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#60a0d0] flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1e]">
      <NavBar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative bg-white dark:bg-[#0a0f1e] pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Very subtle dot grid */}
        <div className="absolute inset-0 bg-dots pointer-events-none opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag>NADCA Certified · Chicago Metro</SectionTag>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[72px] font-black text-[#203060] dark:text-white tracking-tight leading-[1.02]">
              Breathe cleaner air,
              <br />
              <span className="text-[#0050a0] dark:text-[#60a0d0]">starting today.</span>
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              We remove years of dust, dander, and allergens from your HVAC system — and show you the proof on camera. Flat-rate pricing, no surprises.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors shadow-sm"
              >
                Request a Free Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-[#203060] dark:text-slate-300 bg-white dark:bg-white/5 border border-[#203060]/20 dark:border-slate-700 hover:border-[#203060]/40 rounded-md transition-colors"
              >
                Calculate Exact Price
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              No credit card required · Free cancellation up to 4 hours before service
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-x divide-y sm:divide-y-0 divide-slate-200 dark:divide-slate-800">
            {[
              { value: "600+",  label: "Homes Serviced" },
              { value: "4.9 ★", label: "Google Rating" },
              { value: "100%",  label: "Flat-Rate Guarantee" },
              { value: "2-hr",  label: "Arrival Window" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-[#0d1225] px-6 py-5">
                <div className="text-2xl font-black text-[#203060] dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────── */}
      <TrustBar />

      {/* ── How It Works ───────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <SectionTag>Transparent Process</SectionTag>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
            From quote to clean in 4 steps.
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            No endless sales calls. No upselling at the door. Just clean air, documented and certified.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              n: "01",
              title: "Instant Flat-Rate Quote",
              body: "Select your property type and service. The price you see is the price you pay — zero per-vent surcharges.",
            },
            {
              n: "02",
              title: "Pick a 2-Hour Slot",
              body: "Choose a guaranteed 2-hour arrival window. We're on time or you receive a $50 credit.",
            },
            {
              n: "03",
              title: "Clean & Decontaminate",
              body: "NADCA-certified techs use HEPA-filtered negative-pressure vacuums and EPA-registered sanitizers.",
            },
            {
              n: "04",
              title: "Before & After Report",
              body: "Receive borescope footage, CFM airflow readings, and a shareable digital compliance certificate.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="bg-white dark:bg-[#0d1225] border border-slate-200 dark:border-slate-800 rounded-lg p-6 card-hover shadow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-md bg-[#e6f0f9] dark:bg-[#0050a0]/15 flex items-center justify-center">
                  <span className="text-[#0050a0] dark:text-[#60a0d0] text-xs font-black">{step.n}</span>
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-[#203060] dark:text-white mb-2">{step.title}</h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────── */}
      <section id="services" className="bg-slate-50 dark:bg-[#0d1225] border-y border-slate-200 dark:border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <SectionTag>Our Services</SectionTag>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
                Air ducts, dryer vents & chimneys.
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm lg:text-right leading-relaxed">
              Transparent flat-rate pricing for residential and commercial clients throughout Chicago Metro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Residential Air Ducts",
                badge: "Most Popular",
                body: "Complete removal of dust, debris, and allergens from your home's ductwork. HEPA-filtered equipment, guaranteed.",
              },
              {
                title: "Dryer Vent Cleaning",
                body: "Clear dangerous lint blockages to prevent fire hazards and improve appliance efficiency.",
              },
              {
                title: "Commercial HVAC",
                body: "Large-scale vent and HVAC cleaning for multi-zone facilities, restaurants, offices, and rental properties.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white dark:bg-[#0a0f1e] border border-slate-200 dark:border-slate-800 rounded-lg p-6 card-hover shadow-card flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-[#e6f0f9] dark:bg-[#0050a0]/15 flex items-center justify-center">
                    <span className="text-[#0050a0] dark:text-[#60a0d0] text-base">◎</span>
                  </div>
                  {s.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-[#203060] text-white rounded-full">
                      {s.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#203060] dark:text-white mb-1.5">{s.title}</h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.body}</p>
                </div>
                <Link
                  to="/pricing"
                  className="mt-auto text-[12.5px] font-medium text-[#0050a0] dark:text-[#60a0d0] hover:underline underline-offset-2"
                >
                  View pricing →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button href="/pricing" variant="secondary" size="md">
              View All 20+ Services & Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* ── Proof / Certificate ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left copy */}
          <div>
            <SectionTag>Digital Documentation</SectionTag>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
              Proof you can see, share, and keep.
            </h2>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Every appointment generates an unalterable digital audit report with real borescope camera footage and lab particulate analysis. Not promises — documentation.
            </p>

            <ul className="mt-8 space-y-5">
              {[
                {
                  title: "High-Resolution Borescope Inspection",
                  body: "Camera footage through supply, return, and furnace plenum before and after cleaning.",
                },
                {
                  title: "Certified Airflow Readings",
                  body: "Precise CFM velocity metrics proving your HVAC system's restored efficiency.",
                },
                {
                  title: "Permanent Shareable Certificate",
                  body: "A permanent web URL you can provide to buyers, tenants, or insurance inspectors.",
                },
              ].map((f) => (
                <li key={f.title} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 border-[#60a0d0] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0050a0]" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#203060] dark:text-white">{f.title}</p>
                    <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors shadow-sm"
              >
                Request a Quote
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-[#203060] dark:text-slate-300 border border-[#203060]/20 dark:border-slate-700 rounded-md hover:border-[#203060]/40 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Right — certificate card */}
          <div className="bg-[#203060] rounded-xl overflow-hidden border border-[#0050a0]/40 shadow-navy">
            {/* Terminal-style top bar */}
            <div className="flex items-center gap-1.5 px-5 py-3.5 bg-[#162448] border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              <span className="ml-3 text-[10.5px] font-mono text-[#60a0d0]/60">
                AeroDuct · Digital Certificate #PASS-2026-0842
              </span>
            </div>

            <div className="p-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#60a0d0]">
                    Verified Compliance Report
                  </p>
                  <h3 className="text-lg font-bold text-white mt-1">Airflow & Hygiene Certified</h3>
                </div>
                <img src="/logo.jpg" alt="" className="w-10 h-10 object-contain brightness-0 invert opacity-60" />
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Property",            value: "2847 N. Lincoln Ave, Chicago, IL", color: "text-white" },
                  { label: "Sanitization",         value: "Hospital-Grade Sporicidin (EPA Reg)", color: "text-emerald-400" },
                  { label: "Airflow Restoration",  value: "96 / 100 — Optimal",               color: "text-[#60a0d0]" },
                  { label: "NADCA Certification",  value: "Verified Tech #78294",              color: "text-white" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2.5 border-b border-white/[0.07] last:border-0"
                  >
                    <span className="text-[12px] text-[#60a0d0]/70">{row.label}</span>
                    <span className={`text-[12.5px] font-semibold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10.5px] text-[#60a0d0]/50 font-mono">Permanent Record · 2026</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                  STATUS: PASSED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section id="reviews" className="bg-slate-50 dark:bg-[#0d1225] border-y border-slate-200 dark:border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">Google Reviews · 4.9 / 5.0</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
              Trusted by 600+ homes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a0f1e] border border-slate-200 dark:border-slate-800 rounded-lg p-6 card-hover shadow-card flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <Stars n={t.rating} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-[#203060] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <SectionTag>FAQ</SectionTag>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
            Frequently asked questions.
          </h2>
        </div>

        <div className="space-y-2">
          {FAQ_LIST.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div
                key={i}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  open
                    ? "border-[#203060]/30 dark:border-[#60a0d0]/20"
                    : "border-slate-200 dark:border-slate-800"
                } bg-white dark:bg-[#0d1225]`}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(open ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  aria-expanded={open}
                >
                  <span className={`text-[14px] font-semibold ${open ? "text-[#203060] dark:text-[#60a0d0]" : "text-slate-800 dark:text-slate-200"}`}>
                    {item.question}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open && (
                  <div className="px-5 pb-4 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section id="contact" className="bg-[#203060] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#60a0d0] text-xs font-semibold uppercase tracking-widest mb-4">
            Next 2-Hour Slot Available Today
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to breathe cleaner, healthier air?
          </h2>
          <p className="text-[#a8d6eb] text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Reserve your appointment in 90 seconds. Licensed technicians, exact flat-rate pricing, and a guaranteed 2-hour arrival window.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-[#203060] bg-white hover:bg-slate-50 rounded-md transition-colors shadow-md"
            >
              Request a Free Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-7 py-3 text-sm font-medium text-white border border-white/25 hover:border-white/50 hover:bg-white/5 rounded-md transition-colors"
            >
              View All Pricing Tiers
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[11.5px] text-[#60a0d0]">
            <span>✓ Zero per-vent surcharges</span>
            <span>✓ Pay after service is done</span>
            <span>✓ NADCA Certified Technicians</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

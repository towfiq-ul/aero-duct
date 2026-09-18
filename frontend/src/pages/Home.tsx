
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";
import { TierCard } from "@/components/TierCard";
import { MarketSelector } from "@/components/MarketSelector";
import { SERVICE_TIERS, TESTIMONIALS, FAQ } from "@/lib/mockData";
import { getMarket } from "@/lib/api";

// ── Sub-components ───────────────────────────────────────────────

function TrustBar() {
  return (
    <div className="border-y border-slate-200/80 bg-slate-50/90 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
              ✓
            </span>
            <span>
              <strong>4.9 / 5.0</strong> from 600+ verified homeowners
            </span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
              ★
            </span>
            <span>NADCA Certified Member #78294</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
              ⏱
            </span>
            <span>Guaranteed 2-Hour Arrival Windows</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
              📱
            </span>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm card-hover-lift">
      <div className="flex items-center justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-blue-50 text-2xl flex items-center justify-center border border-blue-100 shadow-2xs">
          {icon}
        </span>
        <span className="text-3xl font-extrabold text-slate-200 font-mono">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [activeMarket, setActiveMarket] = useState("chicago");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const market = getMarket(activeMarket);
  const currentTiers = SERVICE_TIERS[activeMarket] ?? [];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-xs mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 tracking-wide">
                Guaranteed 2-Hour Arrival Windows · Transparent Flat-Rate
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Duct Cleaning Done Right.{" "}
              <span className="text-gradient-brand">Every Single Time.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Upfront flat-rate pricing with zero hidden per-vent fees. Our NADCA-certified technicians arrive in a 2-hour window.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} variant="gradient" size="xl">
                Call Service Now →
              </Button>
              <Button href="/pricing" variant="secondary" size="xl">
                Calculate Exact Price
              </Button>
            </div>

            {/* Trust disclaimer */}
            <p className="mt-4 text-xs text-slate-400">
              No credit card required to check open slots · Free cancellation up to 4 hours before service
            </p>
          </div>

          {/* ── Hero Interactive Dashboard Preview ── */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 shadow-2xl">
              <div className="rounded-[14px] bg-white border border-slate-200/80 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        Before & After Documentation
                      </span>
                      <span className="text-xs text-slate-400">Live Telemetry &amp; Inspection</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      2847 N. Lincoln Ave, Chicago, IL · Single-Family Residential
                    </h3>
                  </div>
                  <Link
                    to={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    Call Service Now ↗
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Airflow Velocity
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">720</span>
                      <span className="text-xs text-slate-500">CFM</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        +48% boost
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Air resistance eliminated from main trunk</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Particulate PM2.5
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-600">12</span>
                      <span className="text-xs text-slate-500">µg/m³</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        -98.5%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Hospital-grade clean (down from 840 µg/m³)</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Overall Health Score
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-blue-600">96</span>
                      <span className="text-xs text-slate-500">/ 100</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Certified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">NADCA ACR Standard 2021 fully met</p>
                  </div>
                </div>

                <div className="mt-5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">✓ Borescope Inspection Complete:</span>
                    <span>HD video and photos recorded to your permanent blockchain-secured record</span>
                  </div>
                  <span className="font-semibold text-blue-700">Verified by Lead Tech Dave M.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            From Quote to Clean in 4 Simple Steps
          </h2>
          <p className="mt-3 text-base text-slate-500">
            No endless sales phone calls, no aggressive upselling at the door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            number="01"
            icon="⚡"
            title="Instant Flat-Rate Quote"
            description="Select your property type and service tier. The price you see online is exactly what you pay."
          />
          <StepCard
            number="02"
            icon="📅"
            title="Pick a 2-Hour Slot"
            description="Choose a guaranteed 2-hour arrival window. "
          />
          <StepCard
            number="03"
            icon="🌀"
            title="Clean & Decontaminate"
            description="Our certified technicians use HEPA-filtered負pressure vacuums and hospital-grade sanitizers."
          />
          <StepCard
            number="04"
            icon="📱"
            title="Before & After Documentation"
            description="Receive your before/after video report, airflow CFM stats, and official compliance certificate."
          />
        </div>
      </section>

      {/* ── Pricing Preview Section ── */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Flat-Rate Guarantee
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Clear, Predictable Pricing
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Select your market below to view transparent residential or commercial rates.
            </p>
            <div className="mt-6 flex justify-center">
              <MarketSelector value={activeMarket} onChange={setActiveMarket} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                currencySymbol={market.currencySymbol}
                locale={market.locale}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/pricing" variant="secondary" size="lg">
              Explore Full Pricing &amp; Commercial Multi-Site Calculator →
            </Button>
          </div>
        </div>
      </section>

      {/* ── Digital Health Passport Feature Spotlight ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Proprietary Feature
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              The Before & After Documentation
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Don't take anyone's word for it. Every AeroDuct appointment generates an unalterable digital audit report of your ductwork with real borescope camera footage and laboratory particulate analysis.
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  title: "High-Resolution Borescope Inspection",
                  desc: "Camera footage through supply, return, and furnace plenum before and after cleaning.",
                },
                {
                  title: "Certified Anemometer Airflow Readings",
                  desc: "Precise CFM airflow velocity metrics proving enhanced HVAC system efficiency.",
                },
                {
                  title: "Real Estate & Home Sale Advantage",
                  desc: "A shareable permanent web URL you can provide to buyers, tenants, or insurance inspectors.",
                },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} variant="gradient" size="lg">
                Call To Schedule →
              </Button>
              <Button href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} variant="secondary" size="lg">
                Schedule Service
              </Button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 text-white shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-black">
              PASS
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    Digital Certificate #PASS-2026-0842
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Airflow &amp; Hygiene Verified</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-xl">
                  🛡️
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Property</span>
                  <span className="font-medium text-white">2847 N. Lincoln Ave, Chicago, IL</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Microbial Sanitization</span>
                  <span className="font-semibold text-emerald-400">Hospital-Grade Sporicidin (EPA Reg)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Airflow Restoration</span>
                  <span className="font-semibold text-blue-400">96 / 100 (Optimal)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">NADCA Certification</span>
                  <span className="font-medium text-white">Verified Tech #78294</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Permanent Record · Verified 2026</span>
                <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded text-emerald-400">
                  STATUS: PASSED ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Real Homeowner Reviews
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Trusted by 600+ Homes &amp; Commercial Facilities
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Read how homeowners in Chicago experienced AeroDuct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 flex flex-col justify-between shadow-sm card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={t.rating} />
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified Service
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Interactive Accordion) ── */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Everything you need to know about our flat-rate pricing and cleaning methodology.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ.map((item, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900">{item.question}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 py-20 text-white">
        <div className="absolute inset-0 bg-grid-slate opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
            ⚡ Next 2-Hour Slot Available Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Breathe Cleaner, Healthier Air?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve your appointment in 90 seconds. Licensed technicians, exact flat-rate pricing, and guaranteed 2-hour arrival windows.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`} variant="secondary" size="xl" className="shadow-lg">
              Call To Schedule →
            </Button>
            <Button href="/pricing" variant="outline" size="xl" className="text-white border-white/40 hover:bg-white/10 hover:border-white">
              View All Pricing Tiers
            </Button>
          </div>
          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-blue-200">
            <span>✓ Zero per-vent surcharges</span>
            <span>·</span>
            <span>✓ Pay after service is done</span>
            <span>·</span>
            <span>✓ NADCA Certified</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

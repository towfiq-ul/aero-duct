
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

import { TESTIMONIALS, FAQ_LIST } from "@/lib/mockData";

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

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* ── Hero Section (Apple-style minimalist) ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-20 pb-24 sm:pt-32 sm:pb-32 transition-colors duration-200">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
                Guaranteed 2-Hour Arrival Windows · Transparent Flat-Rate
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.05] mb-6">
              Breathe easier with <br className="hidden sm:block" />
              <span className="text-gradient-brand">professionally cleaned air ducts.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              We remove years of dust, dander and allergens from your entire HVAC system — and show you the proof on camera.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button href="/quote" variant="gradient" size="xl">
                Request a Quote →
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
      <section id="services" className="bg-slate-50/80 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80 py-32 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Comprehensive Services
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Air Ducts, Dryer Vents, and Chimneys
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              We offer a wide range of residential and commercial cleaning services. Transparent flat-rate pricing based on your service area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-start text-left card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-blue-800">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Residential Air Ducts</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Complete removal of dust, debris, and allergens from your home's ductwork system.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-start text-left card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-blue-800">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Dryer Vents</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Clear dangerous lint blockages to prevent fire hazards and improve appliance efficiency.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl flex flex-col items-start text-left card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-blue-800">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Commercial Properties</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Large-scale vent and HVAC cleaning for multi-zone facilities, restaurants, and offices.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button href="/pricing" variant="secondary" size="lg">
              View All 20+ Services &amp; Pricing Calculator →
            </Button>
          </div>
        </div>
      </section>

      {/* ── Digital Health Passport Feature Spotlight ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Proprietary Feature
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              The Before &amp; After Documentation
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
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
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Button href="/quote" variant="gradient" size="lg">
                Request a Quote →
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                View Pricing
              </Button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 p-8 text-white shadow-xl dark:shadow-slate-900/60 overflow-hidden border border-transparent dark:border-slate-700/60">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-black">
              PASS
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 dark:border-slate-600 pb-4">
                <div>
                  <span className="text-xs text-blue-400 dark:text-blue-300 font-bold uppercase tracking-wider">
                    Digital Certificate #PASS-2026-0842
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Airflow &amp; Hygiene Verified</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 dark:bg-blue-500/20 border border-blue-400/30 dark:border-blue-400/20 flex items-center justify-center text-xl">
                  🛡️
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-800 dark:border-slate-600">
                  <span className="text-slate-400 dark:text-slate-300">Property</span>
                  <span className="font-medium text-white">2847 N. Lincoln Ave, Chicago, IL</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 dark:border-slate-600">
                  <span className="text-slate-400 dark:text-slate-300">Microbial Sanitization</span>
                  <span className="font-semibold text-emerald-400">Hospital-Grade Sporicidin (EPA Reg)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 dark:border-slate-600">
                  <span className="text-slate-400 dark:text-slate-300">Airflow Restoration</span>
                  <span className="font-semibold text-blue-400">96 / 100 (Optimal)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 dark:border-slate-600">
                  <span className="text-slate-400 dark:text-slate-300">NADCA Certification</span>
                  <span className="font-medium text-white">Verified Tech #78294</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-300">Permanent Record · Verified 2026</span>
                <span className="text-xs font-mono bg-slate-800 dark:bg-slate-900 px-2.5 py-1 rounded text-emerald-400">
                  STATUS: PASSED ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="reviews" className="bg-slate-50/80 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80 py-32 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full shadow-sm">
              <svg className="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google Reviews
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Trusted by 600+ Homes &amp; Commercial Facilities
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              See what our customers in Chicago and beyond are saying on Google.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="glass-panel p-8 rounded-3xl flex flex-col justify-between card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={t.rating} />
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                      Verified Service
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6 font-medium">
                    "{t.text}"
                  </p>
                </div>
                <div className="pt-5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Interactive Accordion) ── */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-colors duration-200">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Everything you need to know about our flat-rate pricing and cleaning methodology.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_LIST.map((item, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="border border-slate-200/90 dark:border-slate-800 rounded-3xl glass-panel overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full text-left px-7 py-6 flex items-center justify-between gap-4 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{item.question}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-7 pb-7 pt-1 text-base text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-medium">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section id="contact" className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 py-20 text-white">
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
            <Button href="/quote" variant="secondary" size="xl" className="shadow-lg text-blue-900 bg-white hover:bg-slate-50">
              Request a Quote →
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

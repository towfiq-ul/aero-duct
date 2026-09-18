
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { TierCard } from "@/components/TierCard";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { Button } from "@/components/Button";
import { SERVICE_TIERS, FAQ } from "@/lib/mockData";
import { getMarket, calculatePrice } from "@/lib/api";

export default function PricingPage() {
  const marketId = "chicago";
  const [selectedTierId, setSelectedTierId] = useState("premium");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const market = getMarket(marketId);
  const tiers = SERVICE_TIERS[marketId] ?? [];
  const selectedTier = tiers.find((t) => t.id === selectedTierId) ?? tiers[1] ?? tiers[0];
  const breakdown = selectedTier ? calculatePrice(marketId, selectedTier.id) : null;

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* ── Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white pt-16 pb-12 text-center">
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-4">
            Zero Hidden Fees · Upfront Guarantee
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Flat-Rate Pricing
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every home and facility gets the exact price quoted. No per-vent bait-and-switch, no trip surcharges, and no surprise add-ons.
          </p>

          <div className="mt-8 flex justify-center">
          </div>
        </div>
      </section>

      {/* ── Tier cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              currencySymbol={market.currencySymbol}
              locale={market.locale}
              selected={tier.id === selectedTierId}
              onSelect={() => setSelectedTierId(tier.id)}
            />
          ))}
        </div>

        {/* Selected Tier Action Box */}
        {breakdown && selectedTier && (
          <div className="mt-14 max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/80 shadow-lg shadow-blue-500/5">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Selected Option</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedTier.name} Plan</h3>
            </div>

            <PriceBreakdown
              subtotal={breakdown.subtotal}
              tax={breakdown.tax}
              total={breakdown.total}
              taxLabel={breakdown.taxLabel}
              currency={market.currency}
              locale={market.locale}
            />

            <div className="mt-5 text-center">
              <Button
                href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
                variant="gradient"
                size="xl"
                className="w-full justify-center shadow-md"
              >
                Proceed with {selectedTier.name} Plan →
              </Button>
              <p className="text-xs text-slate-400 mt-2">
                Pick your date and 2-hour arrival window on the next step
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Feature Comparison Matrix ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Detailed Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Plan Feature Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Service Element</th>
                <th className="p-4 text-center">Standard</th>
                <th className="p-4 text-center bg-blue-50/50 text-blue-950">Premium (Recommended)</th>
                <th className="p-4 text-center">Complete Deep Clean</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">All Supply &amp; Return Vents Cleaned</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center bg-blue-50/30 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">Main Duct Trunk Agitation &amp; Vacuum</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center bg-blue-50/30 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">Hospital-Grade Antimicrobial Sanitizer</td>
                <td className="p-4 text-center text-slate-300">—</td>
                <td className="p-4 text-center bg-blue-50/30 text-emerald-600 font-bold">✓ Botanical EPA-Reg</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Hospital Grade</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">Borescope Video &amp; Digital Passport™</td>
                <td className="p-4 text-center text-slate-400">Basic Summary</td>
                <td className="p-4 text-center bg-blue-50/30 text-blue-700 font-bold">✓ Full HD Video Link</td>
                <td className="p-4 text-center text-blue-700 font-bold">✓ Full HD + Lab Report</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">Dryer Vent Cleaning</td>
                <td className="p-4 text-center text-slate-300">—</td>
                <td className="p-4 text-center bg-blue-50/30 text-slate-300">—</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Full Run &amp; Exterior Cap</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">Furnace Blower Wheel &amp; AC Coil Cleaning</td>
                <td className="p-4 text-center text-slate-300">—</td>
                <td className="p-4 text-center bg-blue-50/30 text-slate-300">—</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Deep Sanitized</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Standard Inclusions Callout ── */}
      <section className="bg-slate-50/90 border-y border-slate-200/80 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Every AeroDuct Service Includes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🛡️",
                label: "Certified NADCA Crew",
                sub: "Trained to ACR 2021 standards, background checked, and fully insured in Illinois.",
              },
              {
                icon: "⏱️",
                label: "2-Hour Arrival Guarantee",
                sub: "Live GPS dispatch tracking sent straight to your phone 30 minutes before arrival.",
              },
              {
                icon: "📱",
                label: "Digital Health Passport™",
                sub: "Permanent digital link with borescope photos, airflow velocity, and hygiene sign-off.",
              },
            ].map((item) => (
              <div key={item.label} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.label}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
          Pricing &amp; Service FAQ
        </h2>
        <div className="space-y-3.5">
          {FAQ.map((item, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={item.question} className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">{item.question}</span>
                  <span className={`w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform ${isOpen ? "rotate-180 bg-blue-100 text-blue-600" : ""}`}>
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

      <Footer />
    </div>
  );
}

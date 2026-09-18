"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { TierCard } from "@/components/TierCard";
import { MarketSelector } from "@/components/MarketSelector";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { Button } from "@/components/Button";
import { SERVICE_TIERS, FAQ } from "@/lib/mockData";
import { getMarket, calculatePrice } from "@/lib/api";

export default function PricingPage() {
  const [marketId, setMarketId] = useState("chicago");
  const [selectedTierId, setSelectedTierId] = useState("premium");

  const market = getMarket(marketId);
  const tiers = SERVICE_TIERS[marketId] ?? [];
  const selectedTier = tiers.find((t) => t.id === selectedTierId) ?? tiers[1] ?? tiers[0];
  const breakdown = selectedTier ? calculatePrice(marketId, selectedTier.id) : null;

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Transparent Pricing</h1>
        <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
          One flat price per service. No per-vent charges, no fuel surcharges, no surprises at the door.
        </p>
        <div className="mt-6">
          <MarketSelector value={marketId} onChange={(id) => { setMarketId(id); setSelectedTierId("premium"); }} />
        </div>
      </section>

      {/* Tier cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

        {/* Price breakdown */}
        {breakdown && selectedTier && (
          <div className="mt-8 max-w-sm mx-auto">
            <p className="text-xs text-gray-400 text-center mb-2">Price breakdown for {selectedTier.name}</p>
            <PriceBreakdown
              subtotal={breakdown.subtotal}
              tax={breakdown.tax}
              total={breakdown.total}
              taxLabel={breakdown.taxLabel}
              currency={market.currency}
              locale={market.locale}
            />
            <div className="mt-4 text-center">
              <Button href={`/book?tier=${selectedTierId}&market=${marketId}`} size="lg" className="w-full justify-center">
                Book {selectedTier.name} Plan
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* What's included callout */}
      <section className="bg-blue-50 border-y border-blue-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Every plan includes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            {[
              { icon: "🛡", label: "Certified NADCA Technicians", sub: "Trained, insured, background-checked" },
              { icon: "⏰", label: "Guaranteed Arrival Window", sub: "We text you 30 min before arrival" },
              { icon: "📋", label: "Written Service Report", sub: "Emailed within 1 hour of completion" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 items-start p-4 bg-white rounded-lg border border-blue-100">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.question} className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

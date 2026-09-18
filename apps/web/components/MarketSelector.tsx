"use client";

import { MARKETS } from "@/lib/mockData";

type MarketSelectorProps = {
  value: string;
  onChange: (marketId: string) => void;
};

export function MarketSelector({ value, onChange }: MarketSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50 gap-1">
      {MARKETS.map((market) => {
        const active = value === market.id;
        return (
          <button
            key={market.id}
            onClick={() => onChange(market.id)}
            className={[
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              active
                ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900",
            ].join(" ")}
            aria-pressed={active}
          >
            {market.tagline}
          </button>
        );
      })}
    </div>
  );
}

export default MarketSelector;

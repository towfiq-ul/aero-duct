
import { MARKETS } from "@/lib/mockData";

type MarketSelectorProps = {
  value: string;
  onChange: (marketId: string) => void;
};

export function MarketSelector({ value, onChange }: MarketSelectorProps) {
  return (
    <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner gap-1">
      {MARKETS.map((market) => {
        const active = value === market.id;
        const isChicago = market.id === "chicago";
        return (
          <button
            key={market.id}
            onClick={() => onChange(market.id)}
            type="button"
            className={[
              "flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
              active
                ? "bg-white text-slate-900 shadow-md shadow-slate-900/5 border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
            ].join(" ")}
            aria-pressed={active}
          >
            <span className="text-base" role="img" aria-label={isChicago ? "USA Flag" : "India Flag"}>
              {isChicago ? "🇺🇸" : "🇮🇳"}
            </span>
            <span className="flex flex-col text-left">
              <span className="leading-tight">{isChicago ? "Chicago & Suburbs" : "India Commercial"}</span>
              <span className="text-[10px] font-medium text-slate-400">
                {isChicago ? "Residential (USD $)" : "HVAC & Kitchen (INR ₹)"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default MarketSelector;

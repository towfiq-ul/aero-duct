import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { Tier } from "@/lib/mockData";

type TierCardProps = {
  tier: Tier;
  currencySymbol: string;
  locale: string;
  selected?: boolean;
  onSelect?: () => void;
};

function CheckIcon({ popular }: { popular?: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        popular ? "bg-blue-600 text-white shadow-2xs" : "bg-blue-100 text-blue-700"
      }`}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export function TierCard({ tier, currencySymbol, locale, selected = false, onSelect }: TierCardProps) {
  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tier.price);

  const isHighlighted = tier.popular || selected;

  return (
    <div
      className={[
        "relative flex flex-col p-7 rounded-2xl transition-all duration-300 card-hover-lift",
        isHighlighted
          ? "bg-gradient-to-b from-blue-50/50 via-white to-white border-2 border-blue-600 shadow-xl shadow-blue-500/10"
          : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm",
        onSelect ? "cursor-pointer" : "",
      ].join(" ")}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => e.key === "Enter" && onSelect() : undefined}
      aria-pressed={onSelect ? selected : undefined}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30">
            ★ Most Popular Plan
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
          {selected && <Badge variant="info" dot>Selected</Badge>}
        </div>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed min-h-[40px]">{tier.description}</p>
      </div>

      {/* Price section */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100/80 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Flat-Rate Guarantee
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {currencySymbol}
              {formattedPrice}
            </span>
            <span className="text-sm font-medium text-slate-500">/ job</span>
          </div>
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
          Zero hidden fees
        </span>
      </div>

      {/* Features list */}
      <div className="mb-8 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">What's Included</p>
        <ul className="space-y-3">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
              <CheckIcon popular={tier.popular} />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {!onSelect && (
        <Button
          href={`/book?tier=${tier.id}`}
          variant={tier.popular ? "gradient" : "secondary"}
          size="lg"
          className="w-full justify-center"
        >
          Book {tier.name} Plan →
        </Button>
      )}

      {onSelect && (
        <button
          type="button"
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            selected
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {selected ? "Selected Plan ✓" : `Select ${tier.name}`}
        </button>
      )}
    </div>
  );
}

export default TierCard;

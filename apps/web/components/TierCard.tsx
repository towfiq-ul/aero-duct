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

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function TierCard({ tier, currencySymbol, locale, selected = false, onSelect }: TierCardProps) {
  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tier.price);

  const cardClasses = [
    "relative flex flex-col p-6 rounded-xl border-2 transition-all",
    selected
      ? "border-blue-600 bg-blue-50/40 shadow-md"
      : "border-gray-200 bg-white hover:border-gray-300",
    onSelect ? "cursor-pointer" : "",
  ].join(" ");

  return (
    <div
      className={cardClasses}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => e.key === "Enter" && onSelect() : undefined}
      aria-pressed={onSelect ? selected : undefined}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="info">Most Popular</Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
        <p className="mt-1 text-sm text-gray-500 leading-snug">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900">
          {currencySymbol}
          {formattedPrice}
        </span>
        <span className="ml-1 text-sm text-gray-500">flat rate</span>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {!onSelect && (
        <Button
          href={`/book?tier=${tier.id}`}
          variant={tier.popular ? "primary" : "secondary"}
          className="w-full justify-center"
        >
          Book {tier.name}
        </Button>
      )}

      {onSelect && selected && (
        <p className="text-xs text-center text-blue-600 font-medium mt-2">Selected</p>
      )}
    </div>
  );
}

export default TierCard;

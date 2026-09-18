type PriceBreakdownProps = {
  subtotal: number;
  tax: number;
  total: number;
  taxLabel: string;
  currency: string;
  locale: string;
};

function fmt(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function PriceBreakdown({ subtotal, tax, total, taxLabel, currency, locale }: PriceBreakdownProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>{fmt(subtotal, locale, currency)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{taxLabel}</span>
        <span>{fmt(tax, locale, currency)}</span>
      </div>
      <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-semibold text-gray-900">
        <span>Total</span>
        <span>{fmt(total, locale, currency)}</span>
      </div>
    </div>
  );
}

export default PriceBreakdown;

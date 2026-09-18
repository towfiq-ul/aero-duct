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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transparent Total</span>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Guaranteed Price
        </span>
      </div>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Base Service Flat-Rate</span>
        <span className="font-medium text-slate-900">{fmt(subtotal, locale, currency)}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-600">
        <span>{taxLabel}</span>
        <span className="font-medium text-slate-900">{fmt(tax, locale, currency)}</span>
      </div>
      <div className="border-t border-slate-200/80 pt-3 flex justify-between items-baseline">
        <div>
          <span className="text-base font-bold text-slate-900 block">Total Due</span>
          <span className="text-xs text-slate-500 font-normal">Collected upon completion</span>
        </div>
        <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
          {fmt(total, locale, currency)}
        </span>
      </div>
    </div>
  );
}

export default PriceBreakdown;

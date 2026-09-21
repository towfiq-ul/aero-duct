type PriceBreakdownProps = {
  subtotal: number;
  tax: number;
  total: number;
  taxLabel: string;
  currency?: string;
  locale?: string;
};

function fmt(value: number, locale = "en-US", currency = "USD"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function PriceBreakdown({
  subtotal,
  tax,
  total,
  taxLabel,
  currency = "USD",
  locale = "en-US",
}: PriceBreakdownProps) {
  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0d1225] p-5 shadow-card space-y-3 transition-colors">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Transparent Total
        </span>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
          Guaranteed Flat-Rate
        </span>
      </div>
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
        <span>Base Service Flat-Rate</span>
        <span className="font-medium text-slate-900 dark:text-white">{fmt(subtotal, locale, currency)}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
        <span>{taxLabel}</span>
        <span className="font-medium text-slate-900 dark:text-white">{fmt(tax, locale, currency)}</span>
      </div>
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-3 flex justify-between items-baseline">
        <div>
          <span className="text-base font-bold text-slate-900 dark:text-white block">Total Due</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Collected upon completion</span>
        </div>
        <span className="text-2xl font-black text-[#203060] dark:text-[#60a0d0] tracking-tight">
          {fmt(total, locale, currency)}
        </span>
      </div>
    </div>
  );
}

export default PriceBreakdown;

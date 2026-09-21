import React from "react";

export interface TierCardProps {
  id?: string;
  name: string;
  price: string;
  description: string;
  features?: string[];
  isPopular?: boolean;
  isSelected?: boolean;
  category?: string;
  onSelect?: () => void;
  ctaText?: string;
}

export const TierCard: React.FC<TierCardProps> = ({
  name,
  price,
  description,
  features = [],
  isPopular = false,
  isSelected = false,
  category,
  onSelect,
  ctaText = "Select Package",
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col justify-between rounded-xl p-6 sm:p-7 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-[#203060] dark:border-[#60a0d0] bg-[#e6f0f9]/30 dark:bg-[#0050a0]/15 shadow-md ring-2 ring-[#203060] dark:ring-[#60a0d0]"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1225] hover:border-slate-300 dark:hover:border-slate-700 shadow-card card-hover"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#203060] dark:bg-[#0050a0] rounded-full shadow-sm">
          Most Popular
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0050a0] dark:text-[#60a0d0] bg-[#e6f0f9] dark:bg-[#0050a0]/15 px-2 py-0.5 rounded">
              {category}
            </span>
          )}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
              isSelected
                ? "border-[#203060] bg-[#203060] text-white"
                : "border-slate-300 dark:border-slate-700"
            }`}
          >
            {isSelected && "✓"}
          </div>
        </div>

        <h3 className="text-lg font-black text-[#203060] dark:text-white tracking-tight">{name}</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white my-2 tracking-tight">{price}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

        {features.length > 0 && (
          <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 mb-6 text-xs">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">✓</span>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        className={`w-full py-2.5 px-4 text-xs font-semibold rounded-md transition-colors text-center ${
          isSelected
            ? "bg-[#203060] text-white hover:bg-[#0050a0]"
            : "border border-[#203060]/30 dark:border-slate-700 text-[#203060] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
        }`}
      >
        {isSelected ? "Selected ✓" : ctaText}
      </button>
    </div>
  );
};

export default TierCard;

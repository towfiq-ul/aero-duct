import React from "react";

type Variant = "default" | "success" | "warning" | "info" | "destructive" | "purple" | "amber";

const variantClasses: Record<Variant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200/80",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  destructive: "bg-rose-50 text-rose-700 border-rose-200",
  purple: "bg-indigo-50 text-indigo-700 border-indigo-200",
  amber: "bg-orange-50 text-orange-700 border-orange-200",
};

export type BadgeProps = {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
};

export function Badge({ children, variant = "default", dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${variantClasses[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success"
              ? "bg-emerald-500"
              : variant === "warning" || variant === "amber"
              ? "bg-amber-500"
              : variant === "destructive"
              ? "bg-rose-500"
              : "bg-blue-500"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;

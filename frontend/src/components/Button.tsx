import { Link } from "react-router-dom";
import React from "react";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

type AsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsLink   = BaseProps & { href: string; target?: string; rel?: string };

export type ButtonProps = AsButton | AsLink;

/* All variants mapped to brand palette:
   Navy  #203060 | Royal #0050a0 | Sky #60a0d0 */
const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-[#203060] text-white hover:bg-[#0050a0] border border-[#203060] focus-visible:ring-[#203060]/50 shadow-sm",
  // gradient alias → same as primary (no real gradient needed)
  gradient:
    "bg-[#203060] text-white hover:bg-[#0050a0] border border-[#203060] focus-visible:ring-[#203060]/50 shadow-sm",
  secondary:
    "bg-white dark:bg-transparent text-[#203060] dark:text-slate-200 border border-[#203060]/25 dark:border-slate-700 hover:border-[#203060]/50 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 focus-visible:ring-[#203060]/30",
  outline:
    "bg-transparent text-[#0050a0] dark:text-[#60a0d0] border border-[#0050a0]/40 dark:border-[#60a0d0]/30 hover:bg-[#0050a0]/5 dark:hover:bg-[#60a0d0]/5 hover:border-[#0050a0]/70 focus-visible:ring-[#0050a0]/30",
  ghost:
    "bg-transparent text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-300",
};

const sizeClasses: Record<NonNullable<BaseProps["size"]>, string> = {
  sm:  "px-3 py-1.5 text-xs font-semibold rounded-md gap-1.5",
  md:  "px-4 py-2 text-sm font-semibold rounded-md gap-2",
  lg:  "px-5 py-2.5 text-sm font-semibold rounded-md gap-2",
  xl:  "px-6 py-3 text-sm font-semibold rounded-md gap-2.5",
};

const base =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

export function Button({ children, variant = "primary", size = "md", className = "", ...rest }: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, target, rel } = rest as AsLink;
    return (
      <Link to={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = rest as AsButton;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}

export default Button;

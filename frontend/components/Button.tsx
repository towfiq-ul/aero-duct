import Link from "next/link";
import React from "react";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

type AsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsLink = BaseProps & { href: string; target?: string; rel?: string };

export type ButtonProps = AsButton | AsLink;

const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-glow-blue border border-blue-600 focus-visible:ring-blue-500",
  gradient:
    "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md hover:shadow-glow-blue hover:from-blue-700 hover:to-indigo-800 border-0 focus-visible:ring-blue-500",
  secondary:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs focus-visible:ring-slate-400",
  outline:
    "bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 focus-visible:ring-blue-400",
  ghost:
    "bg-transparent text-slate-700 border border-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300",
};

const sizeClasses: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-4.5 py-2.5 text-sm font-semibold rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5 shadow-sm",
  xl: "px-8 py-4 text-lg font-bold rounded-2xl gap-3 shadow-md",
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

export function Button({ children, variant = "primary", size = "md", className = "", ...rest }: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, target, rel } = rest as AsLink;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
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

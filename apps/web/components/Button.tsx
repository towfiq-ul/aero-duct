import Link from "next/link";
import React from "react";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

type AsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsLink = BaseProps & { href: string; target?: string; rel?: string };

export type ButtonProps = AsButton | AsLink;

const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus-visible:ring-blue-500",
  secondary:
    "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400",
  ghost:
    "bg-transparent text-blue-600 border border-transparent hover:bg-blue-50 focus-visible:ring-blue-500",
};

const sizeClasses: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm rounded",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
};

const base =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

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

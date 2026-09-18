import React from "react";

type Variant = "default" | "success" | "warning" | "info" | "destructive";

const variantClasses: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  info: "bg-blue-50 text-blue-700",
  destructive: "bg-red-50 text-red-700",
};

export type BadgeProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;

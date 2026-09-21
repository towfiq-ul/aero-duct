import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}) => {
  const baseClasses =
    "animate-pulse bg-slate-200 dark:bg-slate-800 transition-colors duration-200";

  let variantClasses = "rounded-lg";
  if (variant === "circular") variantClasses = "rounded-full";
  if (variant === "text") variantClasses = "rounded h-4 my-1";

  if (variant === "card") {
    return (
      <div
        className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}
        {...props}
      >
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  const customStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
};

export default LoadingSkeleton;

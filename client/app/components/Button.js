"use client";

import { Loader } from "./Loader";

/**
 * variant: "gold" | "danger" | "success" | "ghost" | "warning"
 * size:    "sm" | "md" | "lg"
 */
const SIZE = {
  sm: "px-2.5 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-xl",
};

export function Button({ variant = "ghost", size = "md", loading = false, disabled = false, className = "", children, ...props }) {
  const variantClass = variant === "gold" ? "gold-btn" : `btn btn-${variant}`;
  return (
    <button
      disabled={disabled || loading}
      className={`${variantClass} ${SIZE[size]} inline-flex items-center justify-center gap-2 font-semibold transition-all ${className}`}
      {...props}
    >
      {loading && <Loader size={13} />}
      {children}
    </button>
  );
}

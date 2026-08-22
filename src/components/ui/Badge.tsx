"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export type BadgeVariant = "emerald" | "amber" | "sky" | "stone" | "pixel" | "danger";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "stone",
  size = "md",
  icon: Icon,
  dot = false,
  children,
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-xs sm:text-[13px] gap-2",
  }[size];

  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-800 border border-emerald-200/90",
    amber: "bg-amber-50 text-amber-900 border border-amber-200/90",
    sky: "bg-sky-50 text-sky-900 border border-sky-200/90",
    stone: "bg-white text-stone-700 border border-stone-300/80 shadow-xs",
    pixel: "bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-mono font-bold",
    danger: "bg-red-50 text-red-800 border border-red-200/90",
  }[variant];

  const dotColor = {
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
    stone: "bg-emerald-600",
    pixel: "bg-emerald-600 animate-pulse",
    danger: "bg-red-500",
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full font-sans font-semibold tracking-tight ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

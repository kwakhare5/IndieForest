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
    emerald:
      "bg-gradient-to-b from-emerald-50 to-emerald-100/70 text-emerald-800 border border-emerald-300/80 shadow-[0_1px_2px_rgba(5,150,105,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
    amber:
      "bg-gradient-to-b from-amber-50 to-amber-100/70 text-amber-900 border border-amber-300/80 shadow-[0_1px_2px_rgba(217,119,6,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
    sky:
      "bg-gradient-to-b from-sky-50 to-sky-100/70 text-sky-900 border border-sky-300/80 shadow-[0_1px_2px_rgba(14,165,233,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
    stone:
      "bg-gradient-to-b from-white to-stone-50 text-stone-700 border border-stone-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0.5px_rgba(255,255,255,1)]",
    pixel:
      "bg-gradient-to-b from-emerald-50 to-emerald-100/70 text-emerald-800 border border-emerald-300/80 shadow-[0_1px_2px_rgba(5,150,105,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.8)] font-pixel font-normal",
    danger:
      "bg-gradient-to-b from-red-50 to-red-100/70 text-red-800 border border-red-300/80 shadow-[0_1px_2px_rgba(220,38,38,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
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
      className={`inline-flex items-center rounded-full font-sans font-medium tracking-tight ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} shadow-inner ring-1 ring-white/60`} />}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

"use client";

import React from "react";

export type CardVariant = "porcelain" | "glass" | "subtle-inset" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = "porcelain",
  padding = "none",
  children,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    // Standard double-bezel white porcelain card
    porcelain:
      "bg-white border border-stone-200/90 shadow-sm hover:border-stone-300 transition-colors",
    // Translucent frosted glass card
    glass:
      "glass-dock shadow-xl",
    // Recessed background container for inputs / nested content
    "subtle-inset":
      "bg-stone-50/90 border border-stone-200/80 shadow-inner",
    // Elevated feature card
    elevated:
      "bg-white border border-stone-200/90 shadow-md hover:shadow-lg hover:border-stone-300 transition-all duration-200",
  }[variant];

  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-5 sm:p-6",
    lg: "p-7 sm:p-8",
  }[padding];

  return (
    <div
      className={`rounded-[2rem] font-satoshi text-stone-900 ${variantStyles} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}


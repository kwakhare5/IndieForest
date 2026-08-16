"use client";

import React from "react";

export type CardVariant = "porcelain" | "glass" | "subtle-inset" | "elevated";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = "porcelain",
  children,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    // Standard double-bezel white porcelain card
    porcelain:
      "bg-white border border-stone-200 shadow-sm hover:border-stone-300 transition-colors",
    // Translucent frosted glass card
    glass:
      "glass-dock shadow-xl",
    // Recessed background container for inputs / nested content
    "subtle-inset":
      "bg-stone-50/90 border border-stone-200/80 shadow-inner",
    // Elevated feature card
    elevated:
      "bg-white border border-stone-200 shadow-md hover:shadow-lg hover:border-stone-300 transition-all duration-200",
  }[variant];

  return (
    <div
      className={`rounded-[2rem] font-satoshi text-stone-900 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

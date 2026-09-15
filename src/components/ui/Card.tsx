"use client";

import React from "react";

export type CardVariant = "porcelain" | "double-bezel" | "glass" | "subtle-inset" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  doubleBezel?: boolean;
  rounded?: "xl" | "2xl" | "3xl" | "full";
  innerClassName?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = "porcelain",
  padding = "none",
  doubleBezel = false,
  rounded = "2xl",
  innerClassName = "",
  children,
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-5 sm:p-6",
    lg: "p-7 sm:p-8",
  }[padding];

  const roundedOuter = {
    xl: "rounded-2xl",
    "2xl": "rounded-[2rem]",
    "3xl": "rounded-[2.5rem]",
    full: "rounded-full",
  }[rounded];

  const roundedInner = {
    xl: "rounded-[calc(1rem-0.125rem)]",
    "2xl": "rounded-[calc(2rem-0.1875rem)]",
    "3xl": "rounded-[calc(2.5rem-0.1875rem)]",
    full: "rounded-full",
  }[rounded];

  // If doubleBezel is requested, wrap in outer chassis enclosure
  if (doubleBezel || variant === "double-bezel") {
    return (
      <div
        className={`p-[2.5px] sm:p-[3px] ${roundedOuter} chassis-enclosure font-sans text-stone-900 ${className}`}
        {...props}
      >
        <div
          className={`w-full h-full ${roundedInner} porcelain-slab ${paddingStyles} ${innerClassName}`}
        >
          {children}
        </div>
      </div>
    );
  }

  const variantStyles = {
    // Subtle white porcelain slab with refined light-catching lip
    porcelain:
      "bg-white/98 border border-[#e5dfd5] shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_4px_12px_-2px_rgba(44,40,35,0.06),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-0.5 transition-all duration-150",
    // Translucent frosted glass card
    glass:
      "glass-dock",
    // Debossed milled groove for nested containers and inputs
    "subtle-inset":
      "bg-stone-50/90 border border-stone-200/80 shadow-[inset_0_1px_2px_rgba(28,25,23,0.03),inset_0_-1px_0_rgba(255,255,255,0.85)]",
    // Elevated feature card with subtle float
    elevated:
      "bg-white/98 border border-[#e5dfd5] shadow-[0_6px_16px_-4px_rgba(44,40,35,0.06),0_1px_3px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_8px_24px_-4px_rgba(44,40,35,0.09),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-0.5 transition-all duration-150",
    "double-bezel": "",
  }[variant];

  return (
    <div
      className={`rounded-[2rem] font-sans text-stone-900 ${variantStyles} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DoubleBezelProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "full" | "xl" | "2xl" | "3xl";
  innerClassName?: string;
  children: React.ReactNode;
  className?: string;
}

export function DoubleBezel({
  rounded = "full",
  innerClassName = "",
  children,
  className = "",
  ...props
}: DoubleBezelProps) {
  const roundedOuter = {
    full: "rounded-full",
    xl: "rounded-2xl",
    "2xl": "rounded-[2rem]",
    "3xl": "rounded-[2.5rem]",
  }[rounded];

  const roundedInner = {
    full: "rounded-full",
    xl: "rounded-[calc(1rem-0.125rem)]",
    "2xl": "rounded-[calc(2rem-0.1875rem)]",
    "3xl": "rounded-[calc(2.5rem-0.1875rem)]",
  }[rounded];

  return (
    <div className={`p-[2px] sm:p-[2.5px] ${roundedOuter} chassis-enclosure ${className}`} {...props}>
      <div className={`w-full h-full ${roundedInner} porcelain-surface ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}


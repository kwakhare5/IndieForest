"use client";

import React from "react";
import { ArrowRight, ArrowUpRight, ArrowDown, ArrowLeft, LucideIcon } from "lucide-react";

export type ButtonVariant = "emerald" | "amber" | "dark" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  showArrow?: boolean;
  arrowType?: "right" | "up-right" | "down" | "left";
  discIcon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "emerald",
  size = "md",
  icon: Icon,
  showArrow = false,
  arrowType = "right",
  discIcon: DiscIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Height & padding normalization
  const sizeStyles = showArrow
    ? {
        sm: "h-9 pl-3.5 pr-2 py-1.5 text-[11px] gap-2",
        md: "h-11 pl-4.5 pr-2 py-2 text-xs gap-2.5",
        lg: "h-12 pl-6 pr-2.5 py-2.5 text-xs tracking-wider gap-3.5",
      }[size]
    : {
        sm: "h-9 px-3.5 py-1.5 text-[11px] gap-1.5",
        md: "h-11 px-4.5 py-2 text-xs gap-2",
        lg: "h-12 px-6 py-2.5 text-xs tracking-wider gap-2.5",
      }[size];

  const tokenSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  // Tactile Specular Variant Styling
  const variantStyles = {
    emerald: "btn-specular-emerald text-white font-bold",
    amber: "bg-amber-600 hover:bg-amber-700 text-white font-bold border border-amber-700/80 shadow-[0_4px_14px_-2px_rgba(217,119,6,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)]",
    dark: "btn-specular-dark text-white font-bold",
    outline: "btn-specular-porcelain font-semibold text-stone-800",
    ghost: "bg-transparent hover:bg-stone-100/80 text-stone-700 font-medium",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold shadow-xs",
  }[variant];

  // Recessed Action Disc Backgrounds
  const tokenBg = {
    emerald: "bg-white/20 text-white shadow-inner",
    amber: "bg-white/20 text-white shadow-inner",
    dark: "bg-white/20 text-white shadow-inner",
    outline: "bg-stone-100/90 text-stone-700 shadow-inner border border-stone-200/80",
    ghost: "bg-stone-100 text-stone-700",
    danger: "bg-red-200/60 text-red-700",
  }[variant];


  const renderDiscIcon = () => {
    if (DiscIcon) {
      return <DiscIcon className={iconSizes} strokeWidth={2} />;
    }
    if (arrowType === "up-right") {
      return <ArrowUpRight className={iconSizes} strokeWidth={2.2} />;
    }
    if (arrowType === "down") {
      return <ArrowDown className={iconSizes} strokeWidth={2.2} />;
    }
    if (arrowType === "left") {
      return <ArrowLeft className={iconSizes} strokeWidth={2.2} />;
    }
    return <ArrowRight className={iconSizes} strokeWidth={2.2} />;
  };

  return (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center ${showArrow ? "justify-between" : "justify-center"} rounded-full font-sans transition-all duration-150 active:scale-[0.97] active:shadow-inner disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center gap-1.5">
        {Icon && <Icon className={iconSizes} strokeWidth={1.75} />}
        <span>{children}</span>
      </span>

      {showArrow && (
        <div
          className={`${tokenSizes} rounded-full ${tokenBg} flex items-center justify-center transition-transform duration-150 group-hover:translate-x-0.5 ${arrowType === "up-right" ? "group-hover:rotate-45" : arrowType === "down" ? "group-hover:translate-y-0.5" : ""}`}
        >
          {renderDiscIcon()}
        </div>
      )}
    </button>
  );
}

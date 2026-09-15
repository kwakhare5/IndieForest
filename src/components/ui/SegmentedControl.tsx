"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  size = "md",
  className = "",
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: "h-7.5 px-2.5 text-[11px] gap-1.5",
    md: "h-9 px-3.5 text-xs gap-2",
  }[size];

  return (
    <div
      className={`p-1 rounded-full bg-stone-200/90 border border-stone-300/80 shadow-[inset_0_2px_4px_rgba(28,25,23,0.06),inset_0_-1px_0_rgba(255,255,255,0.8)] flex items-center justify-between gap-1 font-sans ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const Icon = opt.icon;

        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-full font-medium transition-all duration-150 flex items-center justify-center cursor-pointer select-none whitespace-nowrap overflow-hidden active:scale-[0.98] ${sizeStyles} ${
              isSelected
                ? "bg-white text-stone-950 shadow-[0_2px_6px_-1px_rgba(44,40,35,0.1),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] border border-stone-200/90 font-medium"
                : "text-stone-600 hover:text-stone-950 font-medium hover:bg-stone-200/50"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />}
            <span className="truncate">{opt.label}</span>
            {opt.badge && (
              <span className="ml-1 font-sans text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200/90 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.8)] shrink-0">
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

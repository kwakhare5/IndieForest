"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badgeText?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  badgeText,
  icon: Icon,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/35 backdrop-blur-md animate-in fade-in duration-150 font-satoshi">
      {/* Outer Tactile Chamfered Glass Bezel (Exact Navbar Match) */}
      <div
        className={`w-full ${maxWidthClass} p-1.5 rounded-[2rem] glass-dock shadow-2xl relative animate-in zoom-in-95 duration-150`}
      >
        {/* Inner Porcelain Chamber */}
        <div className="rounded-[calc(2rem-0.375rem)] porcelain-surface bg-white p-6 sm:p-7 text-stone-900 relative">
          
          {/* Tactile Close Button-in-Button Pod */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full btn-specular-porcelain text-stone-400 hover:text-stone-800 transition active:scale-[0.95] cursor-pointer"
            title="Close Modal"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5 pr-8">
            {Icon && (
              <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <Icon className="w-5 h-5 stroke-[1.75]" />
              </div>
            )}
            <div>
              {badgeText && (
                <span className="font-pixel text-xs uppercase tracking-wider font-bold text-emerald-800 block mb-0.5">
                  {badgeText}
                </span>
              )}
              <h2 className="text-base sm:text-lg font-bold text-stone-950 tracking-tight font-satoshi">
                {title}
              </h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

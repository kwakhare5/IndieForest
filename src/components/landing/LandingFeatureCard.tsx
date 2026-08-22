"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface LandingFeatureCardProps {
  stepTag?: string;
  stepTagColor?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description: string;
  previewWidget?: React.ReactNode;
  footerIcon?: LucideIcon;
  footerText?: string;
  footerColor?: string;
  footerBadge?: React.ReactNode;
  className?: string;
}

export function LandingFeatureCard({
  stepTag,
  stepTagColor = "text-emerald-700",
  icon: Icon,
  iconBg = "bg-emerald-50 border-emerald-200",
  iconColor = "text-emerald-700",
  title,
  description,
  previewWidget,
  footerIcon: FooterIcon,
  footerText,
  footerColor = "text-stone-500",
  footerBadge,
  className = "",
}: LandingFeatureCardProps) {
  return (
    <Card
      variant="porcelain"
      className={`p-7 sm:p-8 flex flex-col justify-between rounded-[2.5rem] ${className}`}
    >
      <div>
        {stepTag && (
          <span
            className={`font-pixel text-xs font-bold block mb-2 ${stepTagColor}`}
          >
            {stepTag}
          </span>
        )}

        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center mb-3 shadow-xs ${iconBg} ${iconColor}`}
          >
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}

        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-satoshi">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 font-satoshi">
          {description}
        </p>

        {previewWidget && <div className="mb-2">{previewWidget}</div>}
      </div>

      {(footerText || FooterIcon || footerBadge) && (
        <div
          className={`mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-satoshi ${footerColor}`}
        >
          <div className="flex items-center gap-2">
            {FooterIcon && <FooterIcon className="w-3.5 h-3.5" />}
            {footerText && <span>{footerText}</span>}
          </div>

          {footerBadge && <div>{footerBadge}</div>}
        </div>
      )}
    </Card>
  );
}

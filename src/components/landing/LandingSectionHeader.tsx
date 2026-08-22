"use client";

import React from "react";
import { Badge, BadgeVariant } from "@/components/ui/Badge";

interface LandingSectionHeaderProps {
  badge: string;
  badgeVariant?: BadgeVariant;
  badgeDot?: boolean;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  centered?: boolean;
  className?: string;
}

export function LandingSectionHeader({
  badge,
  badgeVariant = "stone",
  badgeDot = false,
  title,
  description,
  centered = true,
  className = "",
}: LandingSectionHeaderProps) {
  return (
    <div
      className={`space-y-3 ${
        centered ? "text-center mx-auto max-w-2xl" : "text-left"
      } ${className}`}
    >
      <div>
        <Badge variant={badgeVariant} dot={badgeDot} size="sm">
          {badge}
        </Badge>
      </div>

      <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 font-editorial leading-tight">
        {title}
      </h2>

      {description && (
        <p className="text-sm sm:text-base text-stone-600 font-satoshi leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Flame, Shield, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

interface DashboardBuilderCapsuleProps {
  username: string;
  avatarUrl?: string;
  rankBadge: string;
  rankTitle: string;
  level: number;
  xp: number;
  streakDays: number;
  streakShields: number;
  forestHealthPercent: number;
  forestHealthLabel: string;
}

export function DashboardBuilderCapsule({
  username,
  avatarUrl,
  rankBadge,
  rankTitle,
  level,
  xp,
  streakDays,
  streakShields,
  forestHealthPercent,
  forestHealthLabel,
}: DashboardBuilderCapsuleProps) {
  // XP to next level (each level is 100 XP)
  const currentLevelXp = xp % 100;
  const xpPercent = Math.min(100, Math.max(0, currentLevelXp));

  return (
    <div className="fixed top-5 left-5 z-40 flex items-center gap-3 font-satoshi pointer-events-auto select-none">
      {/* Brand Capsule & Level Pod */}
      <div className="p-1.5 rounded-full bg-white border border-stone-300 shadow-xl shadow-stone-900/10 flex items-center gap-3 pr-4">
        {/* Logo / Avatar Link */}
        <Link
          href="/"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2 group"
          title="Return to Home"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 shadow-xs bg-stone-100 flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xs text-stone-700">{username[0]?.toUpperCase()}</span>
            )}
          </div>
        </Link>

        {/* Builder Name & Rank */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-stone-950 truncate max-w-[110px]">
              @{username}
            </span>
            <Badge variant="pixel" size="sm">
              {rankBadge}
            </Badge>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">
            Lvl {level} · {rankTitle}
          </span>
        </div>

        {/* Mini XP Progress Bar */}
        <div className="hidden sm:flex flex-col gap-1 w-20 pl-2 border-l border-stone-200">
          <div className="flex items-center justify-between text-[9px] font-pixel text-stone-500">
            <span>XP</span>
            <span className="text-emerald-700 font-bold">{currentLevelXp}/100</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Consistency & Health Badges */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold font-pixel shadow-xs"
            title={`${streakDays} Day Shipping Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{streakDays}D</span>
          </div>

          {/* Streak Shield Vault */}
          <div
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-[11px] font-bold font-pixel shadow-xs"
            title={`${streakShields} Active Streak Shields`}
          >
            <Shield className="w-3 h-3 text-sky-600" />
            <span>{streakShields}</span>
          </div>

          {/* 30-Day Forest Health */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold font-pixel shadow-xs"
            title={`30-Day Forest Health: ${forestHealthPercent}% (${forestHealthLabel})`}
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{forestHealthPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

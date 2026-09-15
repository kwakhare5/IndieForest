"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DoubleBezel } from "@/components/ui/Card";
import {
  Share2,
  Flame,
  Trees,
  TrendingUp,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface DashboardDockProps {
  level: number;
  streakDays: number;
  totalMrr: number;
  activeTreesCount: number;
  onOpenShare?: () => void;
}

export function DashboardDock({
  level,
  streakDays,
  totalMrr,
  activeTreesCount,
  onOpenShare,
}: DashboardDockProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex flex-col items-center px-4 pointer-events-none font-sans select-none">
      <DoubleBezel
        rounded="full"
        className="pointer-events-auto shadow-xl"
        innerClassName="px-3 py-1.5 flex items-center gap-2 sm:gap-3"
      >
          
          {/* 1. Amber Streak Pill */}
          <div
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gradient-to-b from-amber-50 to-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-normal font-pixel shadow-[0_1px_2px_rgba(217,119,6,0.12),inset_0_1px_0.5px_rgba(255,255,255,0.85)]"
            title={`${streakDays} Consecutive Shipping Days`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-200/70 shadow-inner flex items-center justify-center shrink-0">
              <Flame className="w-3 h-3 text-amber-700 fill-amber-500" />
            </span>
            <span>{streakDays}D STREAK</span>
          </div>

          <div className="w-[1px] h-4 bg-stone-200 my-auto" />

          {/* 2. Connected Repositories */}
          <div
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-stone-200/90 text-xs text-stone-700 font-sans shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]"
            title={`${activeTreesCount} Active Connected Projects`}
          >
            <span className="w-5 h-5 rounded-full bg-stone-100 shadow-inner flex items-center justify-center shrink-0 border border-stone-200/60">
              <Trees className="w-3 h-3 text-emerald-600" />
            </span>
            <span className="font-medium text-stone-900">{activeTreesCount}</span>
            <span className="text-[10px] text-stone-400 font-medium">REPOS</span>
          </div>

          {/* 3. Verified Revenue / MRR Pill */}
          <div
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-stone-200/90 text-xs text-stone-700 font-sans shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]"
            title={`$${totalMrr.toLocaleString()} Monthly Recurring Revenue`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-50 shadow-inner flex items-center justify-center shrink-0 border border-amber-200/60">
              <TrendingUp className="w-3 h-3 text-amber-600" />
            </span>
            <span className="font-medium text-amber-900 font-mono">${totalMrr.toLocaleString()}</span>
            <span className="text-[10px] text-stone-400 font-medium">MRR</span>
          </div>

          {/* 4. Island Progression Level */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/80 text-xs text-stone-600 font-pixel shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_-1px_0_rgba(255,255,255,0.8)]"
            title={`Builder Level ${level}`}
          >
            <span>LVL</span>
            <span className="font-normal text-stone-900">{level}</span>
          </div>

          <div className="w-[1px] h-4 bg-stone-200 my-auto" />

          {/* 5. 1-Click Share Action */}
          <Button
            variant="emerald"
            size="sm"
            onClick={() => {
              sound.playClick();
              onOpenShare?.();
            }}
            icon={Share2}
            className="shadow-xs active:scale-95 transition-transform text-xs"
            title="Export 3D Share Card & Proof (Press S)"
          >
            Share Proof
          </Button>
      </DoubleBezel>
    </div>
  );
}

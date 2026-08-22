"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
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
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-xl transition-all duration-200">
        <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-2 sm:gap-3">
          
          {/* 1. Amber Streak Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold font-pixel shadow-xs"
            title={`${streakDays} Consecutive Shipping Days`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{streakDays}D STREAK</span>
          </div>

          <div className="w-[1px] h-4 bg-stone-200 my-auto" />

          {/* 2. Connected Repositories */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-xs text-stone-700 font-sans"
            title={`${activeTreesCount} Active Connected Projects`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-stone-900">{activeTreesCount}</span>
            <span className="text-[10px] text-stone-400 font-medium">REPOS</span>
          </div>

          {/* 3. Verified Revenue / MRR Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-xs text-stone-700 font-sans"
            title={`$${totalMrr.toLocaleString()} Monthly Recurring Revenue`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-amber-900 font-mono">${totalMrr.toLocaleString()}</span>
            <span className="text-[10px] text-stone-400 font-medium">MRR</span>
          </div>

          {/* 4. Island Progression Level */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-xs text-stone-600 font-sans font-pixel"
            title={`Builder Level ${level}`}
          >
            <span>LVL</span>
            <span className="font-bold text-stone-900">{level}</span>
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
            className="font-bold shadow-xs active:scale-95 transition-transform text-xs"
            title="Export 3D Share Card & Proof (Press S)"
          >
            Share Proof
          </Button>

        </div>
      </div>
    </div>
  );
}

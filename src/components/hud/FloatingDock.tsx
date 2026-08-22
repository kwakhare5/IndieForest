"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Share2,
  CheckCircle2,
  Sparkles,
  Flame,
  TreePine,
  Plus,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface FloatingDockProps {
  // Progression & Stats Props
  level: number;
  xp?: number;
  streakDays: number;
  totalCommits?: number;
  totalMrr: number;
  activeTreesCount: number;

  // Actions
  onOpenShip?: () => void;
  onOpenShare?: () => void;
  onOpenAddTree?: () => void;
  hasShippedToday?: boolean;
}

/**
 * FloatingDock — The Command Center Front Resting Dock.
 * Monolithic double-bezel porcelain bar with 1-click access to all primary builder workflows.
 */
export function FloatingDock({
  level,
  streakDays,
  totalMrr,
  activeTreesCount,
  onOpenShip,
  onOpenShare,
  onOpenAddTree,
  hasShippedToday = false,
}: FloatingDockProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex flex-col items-center px-4 pointer-events-none font-satoshi select-none">
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-xl transition-all duration-200">
        <div className="px-2.5 py-1.5 rounded-full porcelain-surface flex items-center gap-1.5 sm:gap-2">
          
          {/* 1. Burnished Amber Streak Pill */}
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-pixel shadow-xs"
            title={`${streakDays} Consecutive Shipping Days`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{streakDays}D</span>
          </div>

          <div className="w-[1px] h-4 bg-stone-200 my-auto mx-0.5" />

          {/* 2. Primary Momentum Action: Highland Emerald Ship */}
          <Button
            variant={hasShippedToday ? "outline" : "emerald"}
            size="sm"
            onClick={() => {
              sound.playClick();
              onOpenShip?.();
            }}
            icon={hasShippedToday ? CheckCircle2 : Sparkles}
            className="font-bold shadow-xs active:scale-95 transition-transform text-xs"
          >
            {hasShippedToday ? "Shipped" : "Ship Daily"}
          </Button>

          {/* 3. Plant New Project Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sound.playClick();
              onOpenAddTree?.();
            }}
            icon={Plus}
            className="shadow-xs active:scale-95 transition-transform text-xs"
          >
            Plant
          </Button>

          {/* 4. Share Proof-of-Work Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sound.playClick();
              onOpenShare?.();
            }}
            icon={Share2}
            className="shadow-xs active:scale-95 transition-transform text-xs"
          >
            Share
          </Button>

          <div className="w-[1px] h-4 bg-stone-200 my-auto mx-0.5" />

          {/* 5. Live Glanceable Island Summary Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1 font-bold text-stone-900" title="Active Island Trees">
              <TreePine className="w-3.5 h-3.5 text-emerald-600" />
              {activeTreesCount}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="flex items-center gap-0.5 font-bold text-amber-900 font-mono" title="Monthly Recurring Revenue">
              ${totalMrr.toLocaleString()}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="font-pixel text-xs text-stone-500 font-bold" title={`Builder Level ${level}`}>
              LVL {level}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

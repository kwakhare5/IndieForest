"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Flame,
  Plus,
  Share2,
  History,
  Video,
  Tent,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface FloatingDockProps {
  streakDays: number;
  onOpenShip?: () => void;
  onOpenAddTree?: () => void;
  onOpenShare?: () => void;
  onOpenTimeline?: () => void;
  onOpenVideo?: () => void;
  onOpenTent?: () => void;
  isTimelineActive?: boolean;
  hasShippedToday?: boolean;
}

export function FloatingDock({
  streakDays,
  onOpenShip,
  onOpenAddTree,
  onOpenShare,
  onOpenTimeline,
  onOpenVideo,
  onOpenTent,
  isTimelineActive = false,
  hasShippedToday = false,
}: FloatingDockProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      {/* Universal Double-Bezel Floating Porcelain Dock (Solid White) */}
      <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-full bg-white border border-stone-300 shadow-xl shadow-stone-900/10">
        {/* Streak Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs text-xs font-bold font-pixel text-amber-800">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>{streakDays}D STREAK</span>
        </div>

        {/* 1-Click Ship CTA */}
        <Button
          variant={hasShippedToday ? "outline" : "emerald"}
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenShip?.();
          }}
          icon={hasShippedToday ? CheckCircle2 : Sparkles}
        >
          {hasShippedToday ? "Shipped Today" : "Ship Daily"}
        </Button>

        <div className="w-[1px] h-5 bg-stone-300/80 my-auto mx-0.5" />

        {/* Plant Tree Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenAddTree?.();
          }}
          icon={Plus}
        >
          Plant
        </Button>

        {/* Rest Vault / Tent Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenTent?.();
          }}
          icon={Tent}
        >
          Vault
        </Button>

        {/* Timeline Scrubber Button */}
        <Button
          variant={isTimelineActive ? "dark" : "outline"}
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenTimeline?.();
          }}
          icon={History}
        >
          History
        </Button>

        {/* 10s 3D Turntable Video Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenVideo?.();
          }}
          icon={Video}
        >
          Orbit
        </Button>

        {/* Share 3D Card */}
        <Button
          variant="emerald"
          size="sm"
          onClick={() => {
            sound.playClick();
            onOpenShare?.();
          }}
          icon={Share2}
        >
          Share
        </Button>
      </div>
    </div>
  );
}

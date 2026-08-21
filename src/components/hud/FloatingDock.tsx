"use client";

import React from "react";
import { Share2, Tent, Plus, Flame, Shield, ArrowUpRight, History } from "lucide-react";
import { sound } from "@/lib/sound";
import { useForestStore } from "@/store/useForestStore";

interface FloatingDockProps {
  onOpenShipModal: () => void;
  onOpenShareModal: () => void;
  onOpenAddTreeModal: () => void;
  onOpenShopModal: () => void;
  isTimelineOpen?: boolean;
  onToggleTimeline?: () => void;
}

export function FloatingDock({
  onOpenShipModal,
  onOpenShareModal,
  onOpenAddTreeModal,
  onOpenShopModal,
  isTimelineOpen = false,
  onToggleTimeline,
}: FloatingDockProps) {
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center justify-center font-satoshi select-none">
      <div className="p-1 rounded-full glass-dock shadow-2xl transition-all duration-200">
        <div className="h-11 px-3 rounded-full porcelain-surface bg-white flex items-center gap-1.5 sm:gap-2.5 font-satoshi">
          
          {/* 1. Daily Streak & Burnout Shield Momentum Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 border border-amber-200/90 text-amber-900 font-semibold cursor-default shrink-0 shadow-2xs"
            title={`${streakDays}-day shipping streak • ${streakShields} Streak Shield(s) protecting rest days`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-600 shrink-0 animate-pulse" />
            <span className="font-pixel text-sm font-normal text-amber-950 leading-none">{streakDays}d</span>
            <div className="w-[1px] h-3.5 bg-amber-300/80 mx-0.5" />
            <div className="flex items-center gap-0.5 text-emerald-800 font-pixel text-sm font-normal leading-none">
              <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>x{streakShields}</span>
            </div>
          </div>

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 2. On-Demand 3D Timeline Toggle */}
          {onToggleTimeline && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleTimeline();
              }}
              className={`h-8 px-2.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                isTimelineOpen
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "hover:bg-stone-100/90 text-stone-700 hover:text-stone-950"
              }`}
              title="Toggle 3D Growth Timeline & 10s Replay"
            >
              <History className={`w-3.5 h-3.5 ${isTimelineOpen ? "text-emerald-800" : "text-stone-600"}`} />
              <span className="hidden sm:inline font-satoshi font-bold">Timeline</span>
            </button>
          )}

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 3. Primary Hero Action: LOG DAILY SHIP */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenShipModal();
            }}
            className="h-8 px-4 rounded-full btn-specular-emerald text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 tracking-wide font-satoshi"
            title="Log Today's Ship & Grow Island"
          >
            <span>LOG DAILY SHIP</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 4. Add Tree */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAddTreeModal();
            }}
            className="h-8 px-2.5 rounded-full hover:bg-stone-100/90 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Plant Customer Revenue Tree or Milestone Sprout"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
            <span className="hidden sm:inline font-satoshi font-bold">Tree</span>
          </button>

          {/* 5. Camp Shop */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenShopModal();
            }}
            className="h-8 px-2.5 rounded-full hover:bg-stone-100/90 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Open Pinecone Camp Shop"
          >
            <Tent className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline font-satoshi font-bold">Shop</span>
          </button>

          {/* 6. Share Card Exporter */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenShareModal();
            }}
            className="w-8 h-8 rounded-full hover:bg-stone-100/90 flex items-center justify-center text-stone-600 hover:text-stone-950 transition active:scale-95 cursor-pointer"
            title="Share Daily Progress to X / Twitter"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Share2, Tent, Trees, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sound } from "@/lib/sound";

interface FloatingDockProps {
  onOpenShipModal: () => void;
  onOpenShareModal: () => void;
  onOpenAddTreeModal: () => void;
  onOpenShopModal: () => void;
}

export function FloatingDock({
  onOpenShipModal,
  onOpenShareModal,
  onOpenAddTreeModal,
  onOpenShopModal,
}: FloatingDockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center justify-center font-satoshi select-none">
      <div className="p-1.5 rounded-[2.25rem] glass-dock shadow-2xl transition-all duration-200">
        <div className="px-3 py-1.5 rounded-[calc(2.25rem-0.375rem)] porcelain-surface flex items-center gap-2 sm:gap-3 font-satoshi">
          
          {/* 1. Add Customer / Shipping Tree */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAddTreeModal();
            }}
            className="px-3 py-2 rounded-full hover:bg-stone-100/90 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Plant Customer Revenue Tree or Milestone Sprout"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
            <span className="hidden sm:inline font-satoshi">Tree</span>
          </button>

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 2. Primary Action: LOG DAILY SHIP (Glowing Emerald Pill) */}
          <Button
            onClick={() => {
              sound.playClick();
              onOpenShipModal();
            }}
            variant="emerald"
            size="md"
            showArrow
            arrowType="up-right"
            className="px-5 shadow-xs font-bold"
          >
            LOG DAILY SHIP
          </Button>

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 3. Camp Shop */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenShopModal();
            }}
            className="px-3 py-2 rounded-full hover:bg-stone-100/90 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Open Pinecone Camp Shop"
          >
            <Tent className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline font-satoshi">Shop</span>
          </button>

          {/* 4. Share Card Exporter */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenShareModal();
            }}
            className="p-2 rounded-full hover:bg-stone-100/90 text-stone-600 hover:text-stone-950 transition active:scale-95 cursor-pointer"
            title="Share Daily Progress to X / Twitter"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
}

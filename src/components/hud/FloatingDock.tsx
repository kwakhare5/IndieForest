"use client";

import React from "react";
import { useForestStore } from "@/store/useForestStore";
import { Plus, Share2, Tent, Send, Trees } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  const pinecones = useForestStore((s) => s.pinecones);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center justify-center font-satoshi">
      <div className="p-1.5 rounded-[2.25rem] glass-dock shadow-2xl transition-all duration-200">
        <div className="px-3 py-1.5 rounded-[calc(2.25rem-0.375rem)] porcelain-surface flex items-center gap-2 sm:gap-3 font-satoshi">
          
          {/* 1. Primary Action: LOG DAILY SHIP (Big Emerald Pill) */}
          <Button
            onClick={onOpenShipModal}
            variant="emerald"
            size="md"
            showArrow
            arrowType="up-right"
            className="px-5 shadow-xs"
          >
            LOG DAILY SHIP
          </Button>

          <div className="w-[1px] h-4 bg-stone-200" />

          {/* 2. Add Customer / Shipping Tree */}
          <button
            type="button"
            onClick={onOpenAddTreeModal}
            className="px-3 py-2 rounded-full hover:bg-stone-100/80 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
            title="Plant Customer Tree or Milestone Sprout"
          >
            <Trees className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Add Tree</span>
          </button>

          {/* 3. Pinecone Camp Shop */}
          <button
            type="button"
            onClick={onOpenShopModal}
            className="px-3 py-2 rounded-full hover:bg-stone-100/80 text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
            title="Open Pinecone Camp Shop"
          >
            <Tent className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[10px] font-pixel font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <Trees className="w-2.5 h-2.5 text-amber-700" />
              <span>{pinecones}</span>
            </span>
          </button>

          {/* 4. Share Card Exporter */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="p-2 rounded-full hover:bg-stone-100/80 text-stone-600 hover:text-stone-950 transition active:scale-[0.97] cursor-pointer"
            title="Share Daily Progress to X / Twitter"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
}

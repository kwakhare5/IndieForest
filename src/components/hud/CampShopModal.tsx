"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { DEFAULT_CAMP_DECOR_CATALOG } from "@/lib/gamification";
import type { CampDecorItem } from "@/types/game";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Tent, Check, Flame, Lamp, Anchor } from "lucide-react";
import confetti from "canvas-confetti";

interface CampShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getDecorIcon(iconType: string) {
  switch (iconType) {
    case "flame":
      return <Flame className="w-4 h-4 text-amber-700" />;
    case "lamp":
      return <Lamp className="w-4 h-4 text-amber-600" />;
    case "pier":
      return <Anchor className="w-4 h-4 text-emerald-700" />;
    case "tent":
    default:
      return <Tent className="w-4 h-4 text-indigo-700" />;
  }
}

export function CampShopModal({ isOpen, onClose }: CampShopModalProps) {
  const pinecones = useForestStore((s) => s.pinecones);
  const unlockedDecor = useForestStore((s) => s.unlockedDecor);
  const buyDecor = useForestStore((s) => s.buyDecor);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuy = (item: CampDecorItem) => {
    const success = buyDecor(item.id);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b"],
      });
      setFeedback(`Unlocked ${item.name}! Added to your island.`);
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback("Not enough Pinecones yet. Keep shipping to earn more.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pinecone Camp Shop"
      badgeText={`${pinecones} Pinecones Available`}
      icon={Tent}
      maxWidth="lg"
    >
      <div className="space-y-4 font-satoshi text-xs text-stone-700">
        <p className="text-xs text-stone-600 leading-relaxed font-satoshi">
          Spend Pinecones earned from daily streaks and milestone ships to unlock architectural decor for your island.
        </p>

        {feedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium animate-in fade-in">
            {feedback}
          </div>
        )}

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEFAULT_CAMP_DECOR_CATALOG.map((item) => {
            const isUnlocked = unlockedDecor.includes(item.id);
            const canAfford = pinecones >= item.cost;

            return (
              <Card
                key={item.id}
                variant={isUnlocked ? "porcelain" : "subtle-inset"}
                className={`p-4 flex flex-col justify-between space-y-3 rounded-2xl ${
                  isUnlocked ? "border-emerald-300/80 bg-emerald-50/20" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shadow-inner">
                      {getDecorIcon(item.icon)}
                    </div>
                    {isUnlocked ? (
                      <Badge variant="emerald" size="sm" icon={Check}>
                        Unlocked
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-pixel font-bold text-stone-900">
                        <span className="text-amber-800">🌰 {item.cost}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-stone-900 text-xs font-satoshi">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5 font-satoshi">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    {isUnlocked ? "Active on Island" : `Requires ${item.cost} 🌰`}
                  </span>

                  {isUnlocked ? (
                    <Button variant="outline" size="sm" disabled className="opacity-60">
                      Owned
                    </Button>
                  ) : (
                    <Button
                      variant={canAfford ? "emerald" : "outline"}
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                    >
                      {canAfford ? "Unlock" : "Need 🌰"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="pt-2 border-t border-stone-100 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

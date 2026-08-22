"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, X, CheckCircle2, Zap, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useForestStore } from "@/store/useForestStore";
import { sound } from "@/lib/sound";
import type { QuestId } from "@/types/game";

interface DashboardTopLeftNavProps {
  unclaimedQuestsCount?: number;
  completedQuestsCount?: number;
  totalQuestsCount?: number;
  backHref?: string;
  backLabel?: string;
}

export function DashboardTopLeftNav({
  unclaimedQuestsCount = 0,
  completedQuestsCount = 0,
  totalQuestsCount = 4,
  backHref = "/",
  backLabel = "Home",
}: DashboardTopLeftNavProps) {
  const [isQuestsPopoverOpen, setIsQuestsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quests" | "shop">("quests");

  const pinecones = useForestStore((s) => s.pinecones);
  const dailyQuests = useForestStore((s) => s.dailyQuests);
  const shopItems = useForestStore((s) => s.shopItems);
  const claimQuestReward = useForestStore((s) => s.claimQuestReward);
  const buyShopItem = useForestStore((s) => s.buyShopItem);
  const streakShields = useForestStore((s) => s.streakShields);

  const handleClaim = (questId: QuestId) => {
    sound.playCoin();
    claimQuestReward(questId);
  };

  const handleBuy = (itemId: string) => {
    const success = buyShopItem(itemId);
    if (!success) {
      sound.playClick();
    }
  };

  return (
    <div className="fixed top-4 left-5 z-40 flex flex-col font-satoshi pointer-events-auto select-none">
      {/* 1. Universal Double-Bezel Landing Page Capsule */}
      <div className="p-1 rounded-full glass-dock shadow-lg transition-all duration-200">
        <div className="px-2.5 py-1 rounded-full porcelain-surface flex items-center gap-1.5 sm:gap-2">
          
          {/* Subtle Clean Text Link (No heavy button) */}
          <Link
            href={backHref}
            onClick={() => sound.playClick()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition"
            title={`Return to ${backLabel}`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
            <span>{backLabel}</span>
          </Link>

          <div className="w-[1px] h-4 bg-stone-200 my-auto mx-0.5" />

          {/* Subtle Porcelain Quests Trigger Button */}
          <Button
            variant={unclaimedQuestsCount > 0 ? "emerald" : isQuestsPopoverOpen ? "dark" : "outline"}
            size="sm"
            onClick={() => {
              sound.playClick();
              setIsQuestsPopoverOpen((prev) => !prev);
            }}
            icon={Target}
            className="relative shadow-xs active:scale-95 transition-transform text-xs"
            title="Daily Builder Quests & Perk Store (Press Q)"
          >
            <span>Quests</span>
            <span className="text-xs font-pixel ml-1 px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
              {completedQuestsCount}/{totalQuestsCount}
            </span>
            {unclaimedQuestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
            {unclaimedQuestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
            )}
          </Button>
        </div>
      </div>

      {/* 2. Floating Tactile Porcelain Quests Popover (Spring Animated) */}
      {isQuestsPopoverOpen && (
        <div className="mt-3 w-84 sm:w-96 p-1 rounded-3xl glass-dock shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50">
          <div className="p-4 rounded-[22px] porcelain-surface flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
                  <Target className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-950">Daily Quests & Perks</h3>
                  <span className="text-[10px] text-stone-500 font-mono">Proof-of-Work Economy</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-pixel">
                  🌰 {pinecones}
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsQuestsPopoverOpen(false);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl my-3 border border-stone-200/80 text-xs font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("quests");
                }}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                  activeTab === "quests" ? "bg-white text-stone-950 shadow-xs font-bold" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Daily Quests {completedQuestsCount > 0 ? `(${completedQuestsCount}/${totalQuestsCount})` : ""}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("shop");
                }}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                  activeTab === "shop" ? "bg-white text-stone-950 shadow-xs font-bold" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Perk Shop
              </button>
            </div>

            {/* Popover Scrollable Body */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {activeTab === "quests" ? (
                dailyQuests.map((quest) => (
                  <Card key={quest.id} variant="subtle-inset" className="p-3 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 text-xs">{quest.title}</span>
                          <Badge variant={quest.category === "shipping" ? "emerald" : quest.category === "revenue" ? "amber" : "stone"} size="sm">
                            {quest.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{quest.description}</p>
                      </div>
                      <span className="shrink-0 text-xs font-pixel font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        +{quest.xpReward} XP
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <div className="flex-1 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className={`h-full ${quest.isCompleted ? "bg-emerald-600" : "bg-stone-400"}`}
                            style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-stone-500">{quest.progress}/{quest.target}</span>
                      </div>

                      {quest.isClaimed ? (
                        <span className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Claimed
                        </span>
                      ) : quest.isCompleted ? (
                        <Button variant="emerald" size="sm" onClick={() => handleClaim(quest.id)} icon={Zap} className="text-[10px] py-0.5 px-2">
                          Claim
                        </Button>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-medium">In Progress</span>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                shopItems.map((item) => {
                  const canAfford = pinecones >= item.price;
                  const isMaxShields = item.id === "emergency-shield" && streakShields >= 2;
                  return (
                    <Card key={item.id} variant="subtle-inset" className="p-3 rounded-2xl flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-stone-900">{item.name}</span>
                          <Badge variant="stone" size="sm">{item.category}</Badge>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-bold font-pixel text-amber-900">{item.price} 🌰</span>
                        {item.isUnlocked && item.id !== "emergency-shield" ? (
                          <Badge variant="emerald" size="sm">Unlocked</Badge>
                        ) : (
                          <Button
                            variant={canAfford && !isMaxShields ? "emerald" : "outline"}
                            size="sm"
                            disabled={!canAfford || isMaxShields}
                            onClick={() => handleBuy(item.id)}
                            icon={canAfford ? Sparkles : Lock}
                            className="text-[10px] py-0.5 px-2"
                          >
                            {isMaxShields ? "Max (2)" : "Unlock"}
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

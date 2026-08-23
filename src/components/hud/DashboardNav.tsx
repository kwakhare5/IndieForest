"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  X,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { sound } from "@/lib/sound";
import { useForestStore } from "@/store/useForestStore";
import type { QuestId, DailyQuest } from "@/types/game";

interface DashboardNavProps {
  backHref?: string;
  backLabel?: string;
  unclaimedQuestsCount?: number;
  completedQuestsCount?: number;
  totalQuestsCount?: number;
}

export function DashboardNav({
  backHref = "/",
  backLabel = "Home",
  unclaimedQuestsCount = 0,
  completedQuestsCount = 0,
  totalQuestsCount = 4,
}: DashboardNavProps) {
  const [isQuestsPopoverOpen, setIsQuestsPopoverOpen] = useState(false);

  const dailyQuests = useForestStore((s) => s.dailyQuests);
  const claimQuestReward = useForestStore((s) => s.claimQuestReward);

  const handleClaim = (questId: QuestId) => {
    sound.playLevelUp();
    claimQuestReward(questId);
  };

  return (
    <div className="fixed top-4 left-5 z-40 flex flex-col font-sans pointer-events-auto select-none">
      {/* 1. Universal Double-Bezel Capsule */}
      <div className="p-1 rounded-full glass-dock shadow-lg transition-all duration-200">
        <div className="px-2.5 py-1 rounded-full porcelain-surface flex items-center gap-1.5 sm:gap-2">
          
          {/* Subtle Clean Text Link */}
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

          {/* Quests Trigger Button */}
          <Button
            variant={unclaimedQuestsCount > 0 ? "emerald" : isQuestsPopoverOpen ? "dark" : "outline"}
            size="sm"
            onClick={() => {
              sound.playClick();
              setIsQuestsPopoverOpen((prev) => !prev);
            }}
            icon={Target}
            className="relative shadow-xs active:scale-95 transition-transform text-xs"
            title="Daily Proof-of-Work Quests (Press Q)"
          >
            <span>Quests</span>
            <span className={`text-xs font-pixel ml-1 px-1.5 py-0.2 rounded-full ${isQuestsPopoverOpen || unclaimedQuestsCount > 0 ? "bg-white/20 text-white" : "bg-stone-100 text-stone-700"}`}>
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

      {/* 2. Floating Tactile Porcelain Quests Popover */}
      {isQuestsPopoverOpen && (
        <div className="mt-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm p-1.5 rounded-[2rem] glass-dock shadow-2xl origin-top-left animate-in fade-in zoom-in-95 duration-150 z-50">
          <div className="p-4 sm:p-5 rounded-[calc(2rem-0.375rem)] porcelain-surface flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-950 font-sans">Daily Builder Quests</h3>
                  <span className="text-[10px] text-stone-500 font-sans block">Proof-of-Work Milestones</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="emerald" size="sm">
                  {completedQuestsCount}/{totalQuestsCount} Completed
                </Badge>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsQuestsPopoverOpen(false);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                  title="Close Quests"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Flat Scrollable List Rows (Stable Fixed Height) */}
            <div className="h-64 min-h-[16rem] overflow-y-auto space-y-3 pt-3 pr-1 custom-scrollbar">
              {dailyQuests.map((quest: DailyQuest) => (
                <div key={quest.id} className="pb-3 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-xs font-sans">{quest.title}</span>
                        <Badge variant={quest.category === "shipping" ? "emerald" : quest.category === "revenue" ? "amber" : "stone"} size="sm">
                          {quest.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5 font-sans">{quest.description}</p>
                    </div>
                    <span className="shrink-0 text-xs font-pixel font-bold text-emerald-800">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-3">
                      <div className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full ${quest.isCompleted ? "bg-emerald-600" : "bg-stone-300"}`}
                          style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">{quest.progress}/{quest.target}</span>
                    </div>

                    {quest.isClaimed ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Claimed
                      </span>
                    ) : quest.isCompleted ? (
                      <Button variant="emerald" size="sm" onClick={() => handleClaim(quest.id)} icon={Zap} className="text-[10px] py-0.5 px-2">
                        Claim +{quest.xpReward} XP
                      </Button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-medium font-sans">In Progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

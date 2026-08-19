"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Badge } from "@/components/ui/Badge";
import { Target, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { sound } from "@/lib/sound";

interface DailyQuestPanelProps {
  onOpenShipModal: () => void;
  onOpenShareModal: () => void;
}

export function DailyQuestPanel({ onOpenShipModal, onOpenShareModal }: DailyQuestPanelProps) {
  const quests = useForestStore((s) => s.quests);
  const checkOffQuest = useForestStore((s) => s.checkOffQuest);
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = quests.filter((q) => q.completed).length;
  const isAllComplete = completedCount === quests.length && quests.length > 0;

  const handleQuestClick = (questId: string) => {
    sound.playClick();
    if (questId === "focus_ship") {
      onOpenShipModal();
    } else if (questId === "share_x") {
      onOpenShareModal();
    } else {
      checkOffQuest(questId);
    }
  };

  const toggleOpen = () => {
    sound.playClick();
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-18 left-4 z-30 pointer-events-auto font-satoshi select-none">
      <div className="relative">
        {/* Floating Capsule Badge */}
        <button
          type="button"
          onClick={toggleOpen}
          className="p-1 rounded-full glass-dock shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-98"
          title={isOpen ? "Collapse Today's Quests" : "View Today's Quests"}
        >
          <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-2 text-stone-900">
            {isAllComplete ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            ) : (
              <Target className="w-3.5 h-3.5 text-emerald-700" />
            )}

            <span className="text-xs font-bold text-stone-950 font-satoshi">
              Quests
            </span>

            <Badge variant={isAllComplete ? "emerald" : "pixel"} size="sm">
              {completedCount}/{quests.length}
            </Badge>

            <div className="text-stone-400 pl-0.5">
              {isOpen ? (
                <ChevronUp className="w-3 h-3 text-stone-600" />
              ) : (
                <ChevronDown className="w-3 h-3 text-stone-600" />
              )}
            </div>
          </div>
        </button>

        {/* Dropdown Card */}
        {isOpen && (
          <div className="absolute top-12 left-0 w-72 p-1 rounded-[1.75rem] glass-dock shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3.5 rounded-[calc(1.75rem-0.25rem)] porcelain-surface text-stone-900 space-y-2.5">
              
              {/* Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-pixel">
                  Today&apos;s Focus
                </span>
                <span className="text-[10px] font-pixel text-emerald-800 font-bold">
                  {completedCount}/{quests.length} Completed
                </span>
              </div>

              {/* Quest Items */}
              <div className="space-y-1.5 pt-1 border-t border-stone-200/60">
                {quests.map((quest) => (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => handleQuestClick(quest.id)}
                    className={`w-full p-2 rounded-xl border text-left flex items-start gap-2.5 transition-all duration-150 cursor-pointer ${
                      quest.completed
                        ? "bg-emerald-50/80 border-emerald-200/90 text-emerald-950"
                        : "bg-stone-50/90 hover:bg-stone-100/90 border-stone-200 text-stone-800 hover:border-stone-300"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {quest.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold leading-tight truncate">
                        {quest.title}
                      </div>
                      <div className="text-[10px] font-pixel text-emerald-800 font-bold mt-0.5">
                        +{quest.xpReward} XP
                      </div>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

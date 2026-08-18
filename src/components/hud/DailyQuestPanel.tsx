"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Badge } from "@/components/ui/Badge";
import { Target, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";

interface DailyQuestPanelProps {
  onOpenShipModal: () => void;
  onOpenShareModal: () => void;
}

export function DailyQuestPanel({ onOpenShipModal, onOpenShareModal }: DailyQuestPanelProps) {
  const quests = useForestStore((s) => s.quests);
  const checkOffQuest = useForestStore((s) => s.checkOffQuest);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const completedCount = quests.filter((q) => q.completed).length;

  const handleQuestClick = (questId: string) => {
    if (questId === "focus_ship") {
      onOpenShipModal();
    } else if (questId === "share_x") {
      onOpenShareModal();
    } else {
      checkOffQuest(questId);
    }
  };

  return (
    <div className="fixed top-20 left-4 z-30 pointer-events-auto w-72 font-satoshi transition-all duration-200">
      <div className="p-1 rounded-[2rem] glass-dock shadow-xl">
        <div className="p-4 rounded-[calc(2rem-0.25rem)] porcelain-surface text-stone-900 space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-bold text-stone-950 font-satoshi">Today's Quests</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="pixel" size="sm">
                {completedCount}/{quests.length} Done
              </Badge>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                title={isCollapsed ? "Expand Quests" : "Collapse Quests"}
              >
                {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quest Items */}
          {!isCollapsed && (
            <div className="space-y-2 pt-1 border-t border-stone-100">
              {quests.map((quest) => (
                <button
                  key={quest.id}
                  type="button"
                  onClick={() => handleQuestClick(quest.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all duration-150 cursor-pointer ${
                    quest.completed
                      ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
                      : "bg-stone-50/80 hover:bg-stone-100 border-stone-200 text-stone-800"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {quest.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium leading-tight truncate">
                      {quest.title}
                    </div>
                    <div className="text-[10px] font-pixel text-emerald-800 font-semibold mt-0.5">
                      +{quest.xpReward} XP
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

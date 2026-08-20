"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { CheckCircle2, Circle, Target, Edit3, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function DailyQuestBar() {
  const todayQuest = useForestStore((s) => s.todayQuest);
  const setTodayQuest = useForestStore((s) => s.setTodayQuest);
  const completeTodayQuest = useForestStore((s) => s.completeTodayQuest);

  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(todayQuest.text);

  const handleCheck = () => {
    if (!todayQuest.completed) {
      completeTodayQuest();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.15 },
        colors: ["#10b981", "#34d399", "#f59e0b"],
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      setTodayQuest(inputText);
      setIsEditing(false);
    }
  };

  return (
    <div className="absolute top-24 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-lg px-4">
      {/* Outer Shell (Double-Bezel) */}
      <div className="pointer-events-auto p-1 rounded-[1.5rem] bg-emerald-950/40 ring-1 ring-emerald-500/20 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:ring-emerald-500/40">
        {/* Inner Core */}
        <div className="px-4 py-2.5 rounded-[calc(1.5rem-0.25rem)] bg-[#0d1c16]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Action Checkbox */}
            <button
              onClick={handleCheck}
              className="text-emerald-400 hover:text-emerald-300 transition-transform duration-200 active:scale-90 shrink-0"
              title={todayQuest.completed ? "Goal completed!" : "Mark #1 Goal as Shipped"}
            >
              {todayQuest.completed ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-emerald-400/80 hover:text-emerald-300 hover:scale-110 transition" />
              )}
            </button>

            {/* Quest Text or Edit Form */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Target className="w-4 h-4 text-amber-400 shrink-0" />
              {isEditing ? (
                <form onSubmit={handleSave} className="flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onBlur={handleSave}
                    autoFocus
                    placeholder="What is your #1 Priority today?"
                    className="w-full bg-black/60 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-xs text-emerald-100 outline-none focus:ring-1 focus:ring-emerald-400 font-sans"
                  />
                </form>
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  className={`text-xs font-medium truncate cursor-pointer transition ${
                    todayQuest.completed
                      ? "line-through text-emerald-400/60"
                      : "text-emerald-100 hover:text-emerald-300"
                  }`}
                  title="Click to edit today's focus"
                >
                  {todayQuest.text || "Set today's #1 Focus Goal..."}
                </span>
              )}
            </div>
          </div>

          {/* Reward Pill Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> +50 XP
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-slate-400 hover:text-emerald-300 transition p-1"
              title="Edit focus goal"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

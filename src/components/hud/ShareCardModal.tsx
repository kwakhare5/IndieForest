"use client";

import React, { useState } from "react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { X, Share2, Copy, Check, Flame, Twitter, ArrowUpRight } from "lucide-react";
import { sound } from "@/lib/sound";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCardModal({ isOpen, onClose }: ShareCardModalProps) {
  const level = useForestStore((s) => s.level);
  const streakDays = useForestStore((s) => s.streakDays);
  const trees = useForestStore((s) => s.trees);
  const shipHistory = useForestStore((s) => s.shipHistory);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { title, badge } = getRankTitle(level);
  const latestShip = shipHistory[0]?.message || "Built & shipped 3D isometric island updates!";

  const tweetText = `🌲 Day ${streakDays} of shipping daily on #IndieForest!

🏆 Rank: ${badge} ${title} (Lvl ${level})
🌳 Active Trees: ${trees.length}
⚡ Today's Ship: "${latestShip}"

Building in public. Keep shipping! 🚀`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    sound.playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Shell (Double-Bezel) */}
      <div className="w-full max-w-md p-1.5 rounded-[2rem] bg-sky-950/40 ring-1 ring-sky-500/30 shadow-2xl relative">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#09151c] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500/20 to-teal-500/10 ring-1 ring-sky-500/40 flex items-center justify-center text-sky-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-sky-400 block mb-0.5">
                Build in Public
              </span>
              <h2 className="text-base font-bold text-sky-100 tracking-tight">Share Progress to X</h2>
            </div>
          </div>

          {/* Visual Share Card (Double-Bezel Inset) */}
          <div className="p-1 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/30 mb-5">
            <div className="p-4 rounded-[calc(1rem-0.125rem)] bg-gradient-to-br from-[#0c1c15] to-[#07130e] text-left relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{badge}</span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-200">{title}</h4>
                    <span className="text-[10px] text-emerald-400 font-mono">LEVEL {level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 ring-1 ring-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
                  <Flame className="w-3 h-3 fill-amber-400" /> {streakDays}d Streak
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 ring-1 ring-emerald-900/50 text-xs text-slate-300 my-2.5">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block mb-1">
                  ⚡ Today's Ship:
                </span>
                <p className="line-clamp-2 text-[11px] italic text-slate-200">
                  "{latestShip}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>🌲 {trees.length} Active Trees</span>
                <span className="text-emerald-400">indieforest.dev</span>
              </div>
            </div>
          </div>

          {/* Action Buttons with Button-in-Button */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-full ring-1 ring-slate-700 hover:ring-emerald-500/50 bg-black/40 hover:bg-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-mono">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Tweet</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenTwitter}
              className="group pl-4 pr-1.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/25 transition-all duration-300 flex items-center justify-between active:scale-[0.98]"
            >
              <span className="font-mono font-extrabold flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 fill-slate-950" /> POST TO X
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-950/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

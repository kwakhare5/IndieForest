"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { X, Sparkles, Github, Link, Flame, Check, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ShipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShipModal({ isOpen, onClose }: ShipModalProps) {
  const shipToday = useForestStore((s) => s.shipToday);
  const streakDays = useForestStore((s) => s.streakDays);

  const [message, setMessage] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [source, setSource] = useState<"manual" | "github">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    shipToday(
      message || "Shipped new code updates and features!",
      source,
      proofUrl
    );

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#f59e0b", "#38bdf8"],
    });

    setIsSubmitting(false);
    setMessage("");
    setProofUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Shell (Double-Bezel) */}
      <div className="w-full max-w-md p-1.5 rounded-[2rem] bg-emerald-950/40 ring-1 ring-emerald-500/30 shadow-2xl relative">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c1813] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 block mb-0.5">
                Daily Verification
              </span>
              <h2 className="text-base font-bold text-emerald-50 tracking-tight">
                Log Daily Ship
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Source Segmented Control */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/50 rounded-2xl ring-1 ring-emerald-900/50 text-xs">
              <button
                type="button"
                onClick={() => setSource("manual")}
                className={`py-2 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 ${
                  source === "manual"
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "text-slate-400 hover:text-emerald-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Ship
              </button>
              <button
                type="button"
                onClick={() => setSource("github")}
                className={`py-2 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 ${
                  source === "github"
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "text-slate-400 hover:text-emerald-300"
                }`}
              >
                <Github className="w-3.5 h-3.5" /> GitHub Commit
              </button>
            </div>

            {/* Ship Summary */}
            <div>
              <label className="text-xs font-semibold text-emerald-300 mb-1.5 block">
                What did you ship today?
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Built 3D low-poly tree shader & optimized state loop..."
                className="w-full bg-black/60 border border-emerald-500/25 rounded-2xl p-3 text-xs text-emerald-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-400 resize-none font-sans"
              />
            </div>

            {/* Proof URL */}
            <div>
              <label className="text-xs font-semibold text-emerald-300 mb-1.5 flex items-center justify-between">
                <span>Proof of Work Link (Optional)</span>
                <span className="text-[10px] text-amber-400 font-mono">+25 XP</span>
              </label>
              <div className="relative">
                <Link className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/... or live demo URL"
                  className="w-full bg-black/60 border border-emerald-500/25 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-emerald-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-400 font-sans"
                />
              </div>
            </div>

            {/* Rewards Summary Pill */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 ring-1 ring-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Rewards:</span>
              <div className="flex items-center gap-2 font-mono font-bold">
                <span className="text-emerald-300">+{100 + Math.min((streakDays + 1) * 10, 150) + (proofUrl ? 25 : 0)} XP</span>
                <span className="text-amber-300">+10 🌰</span>
                <span className="text-sky-300">🌧️ Rain</span>
              </div>
            </div>

            {/* Submit Button (Button-in-Button Architecture) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full pl-5 pr-2 py-2 rounded-full font-bold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center justify-between text-xs tracking-wider active:scale-[0.98]"
            >
              <span className="font-mono font-extrabold">CONFIRM & SHIP IT</span>
              <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

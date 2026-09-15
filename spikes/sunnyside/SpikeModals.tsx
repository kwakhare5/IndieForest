"use client";

import React from "react";
import { CropProject, RevenueTree, CampfireState, ActiveModalType } from "./types";

interface SpikeModalsProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  selectedProject?: CropProject | null;
  revenue: RevenueTree;
  campfire: CampfireState;
  onAddCommit: (projectId: string) => void;
  onToggleFocus: () => void;
}

export function SpikeModals({
  activeModal,
  onClose,
  selectedProject,
  revenue,
  campfire,
  onAddCommit,
  onToggleFocus,
}: SpikeModalsProps) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-stone-900 border border-stone-700/80 shadow-2xl font-sans text-stone-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* 1. Project Crop Modal */}
        {activeModal === "project" && selectedProject && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥕</span>
              <div>
                <h3 className="text-lg font-bold text-white capitalize">
                  {selectedProject.name}
                </h3>
                <p className="text-xs font-mono text-amber-400 capitalize">
                  {selectedProject.cropType} Crop Bed • Branch: {selectedProject.branch || "main"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800 font-mono">
              <div>
                <div className="text-[11px] text-stone-400 uppercase">Commits</div>
                <div className="text-xl font-bold text-white">{selectedProject.commits}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase">Active Streak</div>
                <div className="text-xl font-bold text-emerald-400">
                  {selectedProject.activeStreak} Days
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onAddCommit(selectedProject.id)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>💧</span>
                <span>Water & Ship (+1 Commit)</span>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 font-semibold text-xs text-stone-300 transition-colors"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        )}

        {/* 2. Focus Timer Modal */}
        {activeModal === "focus" && (
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-3xl">
              🔥
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Campsite Focus Timer</h3>
              <p className="text-xs text-stone-400">
                25-minute Pomodoro coding session with crackling fire ambience.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
              <div className="text-4xl font-mono font-bold tracking-wider text-amber-400">
                25:00
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Streak: <span className="text-emerald-400 font-bold">{campfire.streakDays} Days Burning</span>
              </div>
            </div>

            <button
              onClick={onToggleFocus}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>{campfire.isFocusActive ? "⏸ Pause Session" : "▶ Start Focus Session"}</span>
            </button>
          </div>
        )}

        {/* 3. Revenue Modal */}
        {activeModal === "revenue" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <h3 className="text-lg font-bold text-white">Money Orchard</h3>
                <p className="text-xs font-mono text-emerald-400">
                  Stripe Revenue Tree • Tier: {revenue.tier.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800 font-mono">
              <div>
                <div className="text-[11px] text-stone-400 uppercase">Monthly MRR</div>
                <div className="text-2xl font-bold text-emerald-400">${revenue.mrr}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase">Active Customers</div>
                <div className="text-2xl font-bold text-white">{revenue.customerCount}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/80 text-xs text-stone-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Stripe Webhook Listener
              </span>
              <span className="text-emerald-400 font-mono">HEALTHY</span>
            </div>
          </div>
        )}

        {/* 4. Guestbook Dock Modal */}
        {activeModal === "guestbook" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎣</span>
              <div>
                <h3 className="text-lg font-bold text-white">Coastal Pier & Guestbook</h3>
                <p className="text-xs text-stone-400 font-mono">
                  Cheers & messages caught floating in the river.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-1">
                <div className="font-semibold text-amber-400">@alex_builds</div>
                <p className="text-stone-300">&ldquo;Awesome living farmstead! Keep the daily shipping streak going!&rdquo;</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-1">
                <div className="font-semibold text-emerald-400">@sara_hacks</div>
                <p className="text-stone-300">&ldquo;Loving the carrot crop progression. Great inspiration for my SaaS.&rdquo;</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. Workshop Cabin Modal */}
        {activeModal === "workshop" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏡</span>
              <div>
                <h3 className="text-lg font-bold text-white">Builder's Workshop & HQ</h3>
                <p className="text-xs text-stone-400 font-mono">
                  Island Basecamp • All Systems Operational
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800 font-mono text-xs">
              <div className="space-y-1">
                <div className="text-stone-400 uppercase text-[10px]">Active Repos</div>
                <div className="text-base font-bold text-white">4 Connected</div>
              </div>
              <div className="space-y-1">
                <div className="text-stone-400 uppercase text-[10px]">Engine Mode</div>
                <div className="text-base font-bold text-emerald-400">2D Sunnyside</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/80 text-xs text-stone-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  GitHub Sync
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">LIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Stripe Revenue Webhook
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Daily Ship Streak
                </span>
                <span className="text-amber-400 font-mono text-[11px]">7 DAYS</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeaderHUD } from "@/components/hud/HeaderHUD";
import { DailyQuestBar } from "@/components/hud/DailyQuestBar";
import { ShipModal } from "@/components/hud/ShipModal";
import { CampShopModal } from "@/components/hud/CampShopModal";
import { ShareCardModal } from "@/components/hud/ShareCardModal";
import { AddTreeModal } from "@/components/hud/AddTreeModal";
import { useForestStore } from "@/store/useForestStore";
import {
  History,
  Trees,
  TrendingUp,
  CloudRain,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

// Dynamic import for Three.js Canvas to prevent SSR hydration mismatch
const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#07110d] text-emerald-400">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-[0.2em] uppercase font-mono animate-pulse">
          Generating 3D Voxel Forest...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const checkStreakExpiry = useForestStore((s) => s.checkStreakExpiry);
  const triggerRain = useForestStore((s) => s.triggerRain);
  const resetDemoData = useForestStore((s) => s.resetDemoData);
  const trees = useForestStore((s) => s.trees);
  const shipHistory = useForestStore((s) => s.shipHistory);

  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Total MRR calculation
  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  useEffect(() => {
    setMounted(true);
    checkStreakExpiry();
  }, [checkStreakExpiry]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#07110d] text-emerald-400">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-[0.2em] uppercase font-mono animate-pulse">
          Loading IndieForest...
        </span>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden font-sans bg-[#07110d]">
      {/* 3D Isometric Forest Canvas */}
      <ForestCanvas />

      {/* Top Header Status & HUD */}
      <HeaderHUD
        onOpenShipModal={() => setIsShipModalOpen(true)}
        onOpenShopModal={() => setIsShopModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAddTreeModal={() => setIsAddTreeModalOpen(true)}
      />

      {/* Daily #1 Focus Quest Bar */}
      <DailyQuestBar />

      {/* Bottom Left: Island Overview Drawer & Quick Stats (Double-Bezel) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Quick Stats Pill */}
        <div className="pointer-events-auto p-1 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 backdrop-blur-xl shadow-2xl">
          <div className="px-4 py-2 rounded-[calc(1rem-0.125rem)] bg-[#0d1c16]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>{trees.length} Trees</span>
            </div>
            <div className="w-[1px] h-3.5 bg-emerald-800" />
            <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>${totalMrr}/mo MRR</span>
            </div>
            <div className="w-[1px] h-3.5 bg-emerald-800" />
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition font-medium"
            >
              <History className="w-3.5 h-3.5" />
              <span>{shipHistory.length} Ships</span>
            </button>
          </div>
        </div>

        {/* Shipping History Drawer */}
        {isHistoryOpen && (
          <div className="pointer-events-auto w-80 p-1.5 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="p-4 rounded-[calc(1rem-0.125rem)] bg-[#0d1c16]/90 max-h-60 overflow-y-auto text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60 font-bold text-emerald-100">
                <span>Shipping Log History</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {shipHistory.length} total
                </span>
              </div>
              {shipHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center italic text-xs">
                  No ships logged yet. Click "SHIP IT" above!
                </p>
              ) : (
                shipHistory.map((ship) => (
                  <div
                    key={ship.id}
                    className="p-2 rounded-xl bg-black/50 ring-1 ring-emerald-950 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-emerald-400 font-semibold">
                        +{ship.xpGained} XP
                      </span>
                      <span className="text-slate-500 font-mono text-[9px]">
                        {new Date(ship.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-emerald-100 font-medium leading-tight">
                      {ship.message}
                    </p>
                    {ship.proofUrl && (
                      <a
                        href={ship.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-sky-400 hover:underline truncate"
                      >
                        🔗 {ship.proofUrl}
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Right: Interactive Debug / Quick Utility Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => triggerRain(4000)}
          className="p-2.5 rounded-2xl bg-sky-950/40 ring-1 ring-sky-500/20 hover:ring-sky-500/40 text-sky-400 hover:text-sky-200 backdrop-blur-xl transition active:scale-[0.97] shadow"
          title="Trigger Rain Shower Animation"
        >
          <CloudRain className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          className="p-2.5 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 hover:ring-emerald-500/40 text-emerald-400 hover:text-emerald-200 backdrop-blur-xl transition active:scale-[0.97] shadow"
          title="How IndieForest Works"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (confirm("Reset island to starter demo state?")) {
              resetDemoData();
            }
          }}
          className="p-2.5 rounded-2xl bg-red-950/40 ring-1 ring-red-500/20 hover:ring-red-500/40 text-slate-400 hover:text-red-300 backdrop-blur-xl transition active:scale-[0.97] shadow"
          title="Reset Island Demo State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Help Modal (Double-Bezel) */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-1.5 rounded-[2rem] bg-emerald-950/40 ring-1 ring-emerald-500/30 shadow-2xl relative">
            <div className="p-6 rounded-[calc(2rem-0.375rem)] bg-[#0c1813] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white">
              <h3 className="text-base font-bold text-emerald-100 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Welcome to IndieForest!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                IndieForest turns your daily coding habit into a living 3D world:
              </p>
              <ul className="text-xs text-slate-300 space-y-2.5 mb-5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold font-mono">1.</span>
                  <span>
                    <strong>Daily Shipping = Rain & XP:</strong> Every commit or manual checkoff pours rain and levels up your developer rank.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold font-mono">2.</span>
                  <span>
                    <strong>Streaks & Shields:</strong> Maintain daily shipping to unlock camp structures (Campfire at 3d, Tent at 7d, Cabin at 14d). Shields protect rest days.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold font-mono">3.</span>
                  <span>
                    <strong>Trees = Customers:</strong> Click any tree to inspect subscriber MRR or change its growth stage.
                  </span>
                </li>
              </ul>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-full transition active:scale-[0.98] font-mono uppercase tracking-wider"
              >
                GOT IT, LET'S SHIP!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <ShipModal
        isOpen={isShipModalOpen}
        onClose={() => setIsShipModalOpen(false)}
      />
      <CampShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={() => setIsAddTreeModalOpen(false)}
      />
    </main>
  );
}

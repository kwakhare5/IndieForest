"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sun,
  Sunset,
  Moon,
  ArrowLeft,
  Home,
  Grid,
  Sliders,
  RotateCcw,
  Trees,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DashboardDock } from "@/components/hud/DashboardDock";
import { TreeCard } from "@/components/hud/TreeCard";
import { FocusModal } from "@/components/hud/modals/FocusModal";
import { RestShieldModal } from "@/components/hud/modals/RestShieldModal";
import { OverviewModal } from "@/components/hud/modals/OverviewModal";
import { ShareModal } from "@/components/hud/modals/ShareModal";
import { SettingsModal } from "@/components/hud/modals/SettingsModal";
import { AddProjectModal } from "@/components/hud/modals/AddProjectModal";
import { IslandCanvas } from "@/components/canvas/IslandCanvas";
import { GridView } from "./components/GridView";
import { Workshop3D } from "./components/Workshop3D";
import { sound } from "@/lib/sound";
import type { TimeOfDay, TreeData } from "@/types/game";
import { getTreeSlotCoordinate } from "@/lib/gamification";

// Dynamic 24-Tree Symmetrical Bilateral Titan Farmstead (Scaled to active level)
function getTitanDemoTrees(level: number): TreeData[] {
  return [
    // West Half: GitHub Shipping Conifers (Ascending order: Small to Large, Front to Back)
    { id: "t2-c12", name: "ZenStump Legacy", type: "shipping", tier: "stump", commits: 1, ...getTreeSlotCoordinate(0, "shipping", level, "ZenStump Legacy"), plantedAt: "2026-07-01" },
    { id: "t2-c11", name: "Seedling Alpha", type: "shipping", tier: "sapling", commits: 6, ...getTreeSlotCoordinate(1, "shipping", level, "Seedling Alpha"), plantedAt: "2026-08-11" },
    { id: "t2-c8", name: "DocsBot Vector", type: "shipping", tier: "sapling", commits: 12, ...getTreeSlotCoordinate(2, "shipping", level, "DocsBot Vector"), plantedAt: "2026-08-08" },
    { id: "t2-c6", name: "MicroSaaS Starter", type: "shipping", tier: "young", commits: 38, ...getTreeSlotCoordinate(3, "shipping", level, "MicroSaaS Starter"), plantedAt: "2026-08-06" },
    { id: "t2-c5", name: "VibeCLI Toolkit", type: "shipping", tier: "young", commits: 45, ...getTreeSlotCoordinate(4, "shipping", level, "VibeCLI Toolkit"), plantedAt: "2026-08-05" },
    { id: "t2-c9", name: "DesignSystem UI", type: "shipping", tier: "young", commits: 52, ...getTreeSlotCoordinate(5, "shipping", level, "DesignSystem UI"), plantedAt: "2026-08-09" },
    { id: "t2-c7", name: "AuthModule Clerk", type: "shipping", tier: "mature", commits: 88, ...getTreeSlotCoordinate(6, "shipping", level, "AuthModule Clerk"), plantedAt: "2026-08-07" },
    { id: "t2-c10", name: "Graphify AST", type: "shipping", tier: "mature", commits: 95, ...getTreeSlotCoordinate(7, "shipping", level, "Graphify AST"), plantedAt: "2026-08-10" },
    { id: "t2-c4", name: "TurboSync DB", type: "shipping", tier: "mature", commits: 112, ...getTreeSlotCoordinate(8, "shipping", level, "TurboSync DB"), plantedAt: "2026-08-04" },
    { id: "t2-c3", name: "AgentSDK Brain", type: "shipping", tier: "mature", commits: 154, ...getTreeSlotCoordinate(9, "shipping", level, "AgentSDK Brain"), plantedAt: "2026-08-03" },
    { id: "t2-c2", name: "NextEngine v16", type: "shipping", tier: "majestic", commits: 268, ...getTreeSlotCoordinate(10, "shipping", level, "NextEngine v16"), plantedAt: "2026-08-02" },
    { id: "t2-c1", name: "IndieForest Core", type: "shipping", tier: "elder", commits: 342, ...getTreeSlotCoordinate(11, "shipping", level, "IndieForest Core"), plantedAt: "2026-08-01" },

    // East Half: Stripe Revenue Oaks (Ascending order: Small to Large, Front to Back)
    { id: "t2-r12", name: "Refunded Stump", type: "revenue", tier: "stump", mrr: 0, ...getTreeSlotCoordinate(0, "revenue", level, "Refunded Stump"), plantedAt: "2026-07-15" },
    { id: "t2-r11", name: "Affiliate Seed", type: "revenue", tier: "sapling", mrr: 45, ...getTreeSlotCoordinate(1, "revenue", level, "Affiliate Seed"), plantedAt: "2026-08-11" },
    { id: "t2-r10", name: "Merch Store", type: "revenue", tier: "sapling", mrr: 89, ...getTreeSlotCoordinate(2, "revenue", level, "Merch Store"), plantedAt: "2026-08-10" },
    { id: "t2-r8", name: "API Usage Meter", type: "revenue", tier: "young", mrr: 320, ...getTreeSlotCoordinate(3, "revenue", level, "API Usage Meter"), plantedAt: "2026-08-08" },
    { id: "t2-r7", name: "Addon Packs API", type: "revenue", tier: "young", mrr: 450, ...getTreeSlotCoordinate(4, "revenue", level, "Addon Packs API"), plantedAt: "2026-08-07" },
    { id: "t2-r6", name: "Starter Tier Sub", type: "revenue", tier: "young", mrr: 750, ...getTreeSlotCoordinate(5, "revenue", level, "Starter Tier Sub"), plantedAt: "2026-08-06" },
    { id: "t2-r9", name: "Consulting Hour", type: "revenue", tier: "mature", mrr: 1200, ...getTreeSlotCoordinate(6, "revenue", level, "Consulting Hour"), plantedAt: "2026-08-09" },
    { id: "t2-r5", name: "Lifetime Pass", type: "revenue", tier: "mature", mrr: 1600, ...getTreeSlotCoordinate(7, "revenue", level, "Lifetime Pass"), plantedAt: "2026-08-05" },
    { id: "t2-r4", name: "Developer Seat", type: "revenue", tier: "mature", mrr: 1900, ...getTreeSlotCoordinate(8, "revenue", level, "Developer Seat"), plantedAt: "2026-08-04" },
    { id: "t2-r3", name: "Team Workspace", type: "revenue", tier: "mature", mrr: 2400, ...getTreeSlotCoordinate(9, "revenue", level, "Team Workspace"), plantedAt: "2026-08-03" },
    { id: "t2-r2", name: "Pro Monthly Plan", type: "revenue", tier: "majestic", mrr: 5200, ...getTreeSlotCoordinate(10, "revenue", level, "Pro Monthly Plan"), plantedAt: "2026-08-02" },
    { id: "t2-r1", name: "Enterprise Annual", type: "revenue", tier: "elder", mrr: 8400, ...getTreeSlotCoordinate(11, "revenue", level, "Enterprise Annual"), plantedAt: "2026-08-01" },
  ];
}

export default function DemoPage() {
  const [viewMode, setViewMode] = useState<"forest-grid" | "showroom" | "diorama">("diorama");
  const [displayLevel, setDisplayLevel] = useState<number>(25);
  const [streakDays, setStreakDays] = useState<number>(42);
  const [streakShields, setStreakShields] = useState<number>(2);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [drought, setDrought] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(false);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [deletedTreeIds, setDeletedTreeIds] = useState<string[]>([]);

  // Dynamic tree computation synced with level slider and pruned trees
  const rawDemoTrees = useMemo(() => getTitanDemoTrees(displayLevel), [displayLevel]);
  const demoTrees = useMemo(
    () => rawDemoTrees.filter((t) => !deletedTreeIds.includes(t.id)),
    [rawDemoTrees, deletedTreeIds]
  );

  // Modals
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const totalMrr = demoTrees.reduce((acc, t) => acc + (t.mrr || 0), 0);
  const activeTreesCount = demoTrees.filter((t) => t.tier !== "stump").length;

  const toggleSound = () => {
    sound.playClick();
    const isPlaying = sound.toggleCampfireAmbiance();
    setIsAudioMuted(!isPlaying);
  };

  const handleDeleteTree = (id: string) => {
    sound.playClick();
    setDeletedTreeIds((prev) => [...prev, id]);
    setSelectedTree(null);
  };

  const handleResetDefaults = () => {
    sound.playClick();
    setDisplayLevel(25);
    setStreakDays(42);
    setStreakShields(2);
    setTimeOfDay("day");
    setIsRaining(false);
    setDrought(false);
    setShowGrid(false);
    setShowBoundaries(false);
    setSelectedTree(null);
    setDeletedTreeIds([]);
  };

  const handleOpenModal = (name: "focus" | "shield" | "cabin" | "share" | "settings" | "addProject") => {
    sound.playClick();
    switch (name) {
      case "focus":
        setIsFocusOpen(true);
        break;
      case "shield":
        setIsShieldOpen(true);
        break;
      case "cabin":
        setIsOverviewOpen(true);
        break;
      case "share":
        setIsShareOpen(true);
        break;
      case "settings":
        setIsSettingsOpen(true);
        break;
      case "addProject":
        setIsAddProjectOpen(true);
        break;
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#ece7de] select-none font-sans flex flex-col">
      
      {/* 1. Universal Top Navigation Header (Synchronized Double-Bezel) */}
      <header className="fixed top-4 inset-x-5 z-40 flex items-center justify-between pointer-events-none">
        
        {/* Left: Navigation & Mode Switcher */}
        <div className="p-1 rounded-full glass-dock shadow-lg pointer-events-auto flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="w-[1px] h-4 bg-stone-200 my-auto" />

            {/* Unified Tabs */}
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-full">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode("diorama");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  viewMode === "diorama"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Living Island</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode("forest-grid");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  viewMode === "forest-grid"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-stone-600" />
                <span>Grid Mode</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode("showroom");
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  viewMode === "showroom"
                    ? "bg-white text-stone-950 shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <Trees className="w-3.5 h-3.5 text-amber-600" />
                <span>3D Workshop</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right: Lighting, Simulation Controls & Toggles */}
        <div className="p-1 rounded-full glass-dock shadow-lg pointer-events-auto flex items-center gap-2">
          <div className="px-2 py-1 rounded-full porcelain-surface flex items-center gap-1.5">
            {/* Simulation Controls Toggle */}
            {viewMode === "diorama" && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsControlsOpen(!isControlsOpen);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  isControlsOpen ? "bg-emerald-600 text-white shadow-xs" : "text-stone-600 hover:bg-stone-100"
                }`}
                title="Toggle Level Simulation Controls"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Controls</span>
              </button>
            )}

            <div className="w-[1px] h-3.5 bg-stone-200 my-auto" />

            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("day");
              }}
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "day" ? "bg-amber-100 text-amber-900 font-medium" : "text-stone-500 hover:bg-stone-100"
              }`}
              title="Day Sunlight"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("sunset");
              }}
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "sunset" ? "bg-orange-100 text-orange-900 font-medium" : "text-stone-500 hover:bg-stone-100"
              }`}
              title="Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("night");
              }}
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "night" ? "bg-indigo-100 text-indigo-900 font-medium" : "text-stone-500 hover:bg-stone-100"
              }`}
              title="Night Moonlit"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-stone-200 my-auto" />

            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                !isAudioMuted ? "bg-amber-100 text-amber-900 font-medium" : "text-stone-500 hover:bg-stone-100"
              }`}
              title={isAudioMuted ? "Unmute Campfire Ambiance" : "Mute Campfire Ambiance"}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODE 0: GRID VIEW (INSPIRATION IMAGE RECREATION)                          */}
      {/* ========================================================================= */}
      {viewMode === "forest-grid" && (
        <div className="w-full h-full relative animate-in fade-in duration-200">
          <GridView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: 3D WORKSHOP (INDIVIDUAL ASSET INSPECTOR & TURNTABLE)              */}
      {/* ========================================================================= */}
      {viewMode === "showroom" && (
        <div className="w-full h-full relative animate-in fade-in duration-200">
          <Workshop3D />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: LIVING 3D DIORAMA (CANONICAL ORTHOGRAPHIC ISOMETRIC WORLD)        */}
      {/* ========================================================================= */}
      {viewMode === "diorama" && (
        <div className="w-full h-full relative animate-in fade-in duration-200">
          
          <IslandCanvas
            trees={demoTrees}
            level={displayLevel}
            streakDays={streakDays}
            streakShields={streakShields}
            drought={drought}
            isRaining={isRaining}
            timeOfDay={timeOfDay}
            selectedTreeId={selectedTree?.id}
            onSelectTree={(tree) => {
              sound.playClick();
              setSelectedTree(tree);
            }}
            onClickCampfire={() => handleOpenModal("focus")}
            onClickTent={() => handleOpenModal("shield")}
            onClickCabin={() => handleOpenModal("cabin")}
            interactive={true}
            showGrid={showGrid}
            showBoundaries={showBoundaries}
          />

          {/* Left Simulation Controller (Collapsible on Demand) */}
          {isControlsOpen && (
            <div className="fixed top-20 left-5 z-40 pointer-events-auto max-w-xs w-72">
              <div className="p-1.5 rounded-2xl glass-dock shadow-xl">
                <div className="p-4 rounded-xl porcelain-surface space-y-4">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-700" />
                      <span className="font-medium text-xs text-stone-950 font-sans">Island Controls</span>
                    </div>
                    <button
                      onClick={handleResetDefaults}
                      className="text-[10px] font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                      title="Reset Defaults"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  {/* Level Scrubber */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Island Level:</span>
                      <span className="font-medium font-mono text-emerald-800">Lvl {displayLevel} {displayLevel >= 20 ? "(Highland Estate)" : "(Starter)"}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={displayLevel}
                      onChange={(e) => setDisplayLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>1 (Small)</span>
                      <span>10 (Mid)</span>
                      <span>20+ (North Bluff)</span>
                    </div>
                  </div>

                  {/* Streak Scrubber */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Streak Milestone:</span>
                      <span className="font-medium font-mono text-amber-800">{streakDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={streakDays}
                      onChange={(e) => setStreakDays(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>D1 (Campfire)</span>
                      <span>D7 (Tent)</span>
                      <span>D14+ (Cabin)</span>
                    </div>
                  </div>

                  {/* Active Rest Shields */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Streak Shields:</span>
                      <span className="font-medium font-mono text-stone-800">{streakShields} / 2 Banked</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map((count) => (
                        <button
                          key={count}
                          onClick={() => {
                            sound.playClick();
                            setStreakShields(count);
                          }}
                          className={`py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${streakShields === count ? "bg-emerald-600 text-white border-emerald-700 shadow-xs" : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"}`}
                        >
                          {count} {count === 1 ? "Shield" : "Shields"}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Universal Bottom Stats Dock */}
          <DashboardDock
            level={displayLevel}
            streakDays={streakDays}
            totalMrr={totalMrr}
            activeTreesCount={activeTreesCount}
            onOpenShare={() => handleOpenModal("share")}
          />

          {/* Tree Card Inspector */}
          {selectedTree && (
            <TreeCard
              tree={selectedTree}
              onClose={() => setSelectedTree(null)}
              onDelete={handleDeleteTree}
            />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ATTACHED LIVE MODALS (SYNCHRONIZED REAL TIME)                             */}
      {/* ========================================================================= */}
      <FocusModal
        isOpen={isFocusOpen}
        onClose={() => setIsFocusOpen(false)}
      />

      <RestShieldModal
        isOpen={isShieldOpen}
        onClose={() => setIsShieldOpen(false)}
      />

      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />

    </main>
  );
}

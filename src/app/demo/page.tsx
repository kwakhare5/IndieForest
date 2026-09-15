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
  Palette,
} from "lucide-react";
import { DashboardDock } from "@/components/hud/DashboardDock";
import { TreeCard } from "@/components/hud/TreeCard";
import { FocusModal } from "@/components/hud/modals/FocusModal";
import { RestShieldModal } from "@/components/hud/modals/RestShieldModal";
import { OverviewModal } from "@/components/hud/modals/OverviewModal";
import { ShareModal } from "@/components/hud/modals/ShareModal";
import { SettingsModal } from "@/components/hud/modals/SettingsModal";
import { AddProjectModal } from "@/components/hud/modals/AddProjectModal";
import { DoubleBezel } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { IslandCanvas } from "@/components/canvas/IslandCanvas";
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
  const [viewMode, setViewMode] = useState<"showroom" | "diorama">("diorama");
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
  const [islandShape, setIslandShape] = useState<"diamond" | "crag" | "octagon">("diamond");
  const [colorPalette, setColorPalette] = useState<"canonical" | "sunnyside" | "tabletop">("tabletop");

  // Read URL query parameters for direct deep-linking (e.g., ?mode=palette)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode") || params.get("tab");
      if (mode === "showroom" || mode === "workshop") {
        setViewMode("showroom");
      }
    }
  }, []);

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
    setColorPalette("sunnyside");
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

  const bgClass = colorPalette === "tabletop"
    ? "bg-gradient-to-b from-[#e3c7db] via-[#f1d0d9] to-[#c6daef]"
    : "bg-[#ece7de]";

  return (
    <main className={`relative w-screen h-screen overflow-hidden ${bgClass} select-none font-sans flex flex-col`}>
      
      {/* 1. Universal Top Navigation Header (Synchronized Double-Bezel) */}
      <header className="fixed top-4 inset-x-5 z-40 flex items-center justify-between pointer-events-none">
        
        {/* Left: Navigation & Mode Switcher */}
        <DoubleBezel
          rounded="full"
          className="shadow-lg pointer-events-auto flex items-center gap-2"
          innerClassName="px-3 py-1.5 flex items-center gap-2 sm:gap-3"
        >
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
        </DoubleBezel>

        {/* Right: Lighting, Simulation Controls & Toggles */}
        <DoubleBezel
          rounded="full"
          className="shadow-lg pointer-events-auto flex items-center gap-2"
          innerClassName="px-2 py-1 flex items-center gap-1.5"
        >
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
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "day"
                  ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-[inset_0_1.5px_2px_rgba(217,119,6,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
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
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "sunset"
                  ? "bg-orange-50 text-orange-900 border border-orange-200/90 shadow-[inset_0_1.5px_2px_rgba(234,88,12,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
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
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "night"
                  ? "bg-indigo-50 text-indigo-900 border border-indigo-200/90 shadow-[inset_0_1.5px_2px_rgba(79,70,229,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title="Night Moonlit"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-stone-200 my-auto" />

            <button
              onClick={toggleSound}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                !isAudioMuted
                  ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-[inset_0_1.5px_2px_rgba(217,119,6,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title={isAudioMuted ? "Unmute Campfire Ambiance" : "Mute Campfire Ambiance"}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
        </DoubleBezel>
      </header>

      {/* ========================================================================= */}
      {/* MODE 1: 3D WORKSHOP (INDIVIDUAL ASSET INSPECTOR & TURNTABLE)              */}
      {/* ========================================================================= */}
      {viewMode === "showroom" && (
        <div className="w-full h-full relative animate-in fade-in duration-200">
          <Workshop3D />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: LIVING 3D DIORAMA (CANONICAL ORTHOGRAPHIC ISOMETRIC WORLD)        */}
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
            islandShape={islandShape}
            palette={colorPalette}
          />

          {/* Left Simulation Controller (Collapsible on Demand) */}
          {isControlsOpen && (
            <div className="fixed top-20 left-5 z-40 pointer-events-auto max-w-xs w-72">
              <DoubleBezel rounded="2xl" className="shadow-xl" innerClassName="p-4 space-y-4">
                  
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
                    <SegmentedControl
                      value={String(streakShields)}
                      onChange={(val) => {
                        sound.playClick();
                        setStreakShields(Number(val));
                      }}
                      options={[
                        { value: "0", label: "0 Shields" },
                        { value: "1", label: "1 Shield" },
                        { value: "2", label: "2 Shields" },
                      ]}
                    />
                  </div>

                  {/* Island Shape Prototypes */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Island Shape:</span>
                      <span className="font-medium font-mono text-emerald-800 capitalize">{islandShape}</span>
                    </div>
                    <SegmentedControl
                      value={islandShape}
                      onChange={(val) => {
                        sound.playClick();
                        setIslandShape(val as "diamond" | "crag" | "octagon");
                      }}
                      options={[
                        { value: "diamond", label: "Diamond" },
                        { value: "crag", label: "Crag" },
                        { value: "octagon", label: "Octagon" },
                      ]}
                    />
                  </div>

                  {/* Color Palette (Tabletop vs Sunnyside vs Canonical) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Color Palette:</span>
                      <span className="font-medium font-mono text-emerald-800 capitalize">{colorPalette}</span>
                    </div>
                    <SegmentedControl
                      value={colorPalette}
                      onChange={(val) => {
                        sound.playClick();
                        setColorPalette(val as "canonical" | "sunnyside" | "tabletop");
                      }}
                      options={[
                        { value: "tabletop", label: "Tabletop" },
                        { value: "sunnyside", label: "Sunnyside" },
                        { value: "canonical", label: "Canonical" },
                      ]}
                    />
                  </div>
              </DoubleBezel>
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

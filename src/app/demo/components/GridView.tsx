"use client";

import React, { useState, useMemo } from "react";
import { sound } from "@/lib/sound";
import { IslandCanvas } from "@/components/canvas/IslandCanvas";
import { getTreeSlotCoordinate } from "@/lib/gamification";
import { TreeCard } from "@/components/hud/TreeCard";
import type { TreeData } from "@/types/game";
import {
  Grid,
  GitCommit,
  DollarSign,
} from "lucide-react";

// Canonical Symmetrical Bilateral Titan Dataset for Grid Inspection (Ascending: Small to Large)
function getDemoGridTrees(): TreeData[] {
  return [
    // West Wing: GitHub Shipping Pines (Ascending: Small to Large, Front to Back)
    { id: "grid-ship-12", name: "Legacy Stump", type: "shipping", tier: "stump", commits: 1, ...getTreeSlotCoordinate(0, "shipping", 25), plantedAt: "2026-07-01" },
    { id: "grid-ship-11", name: "Seedling Alpha", type: "shipping", tier: "sapling", commits: 6, ...getTreeSlotCoordinate(1, "shipping", 25), plantedAt: "2026-08-11" },
    { id: "grid-ship-8", name: "DocsBot Vector", type: "shipping", tier: "sapling", commits: 12, ...getTreeSlotCoordinate(2, "shipping", 25), plantedAt: "2026-08-08" },
    { id: "grid-ship-6", name: "MicroSaaS Starter", type: "shipping", tier: "young", commits: 38, ...getTreeSlotCoordinate(3, "shipping", 25), plantedAt: "2026-08-06" },
    { id: "grid-ship-5", name: "VibeCLI Toolkit", type: "shipping", tier: "young", commits: 45, ...getTreeSlotCoordinate(4, "shipping", 25), plantedAt: "2026-08-05" },
    { id: "grid-ship-9", name: "DesignSystem UI", type: "shipping", tier: "young", commits: 52, ...getTreeSlotCoordinate(5, "shipping", 25), plantedAt: "2026-08-09" },
    { id: "grid-ship-7", name: "AuthModule Clerk", type: "shipping", tier: "mature", commits: 88, ...getTreeSlotCoordinate(6, "shipping", 25), plantedAt: "2026-08-07" },
    { id: "grid-ship-10", name: "Graphify AST", type: "shipping", tier: "mature", commits: 95, ...getTreeSlotCoordinate(7, "shipping", 25), plantedAt: "2026-08-10" },
    { id: "grid-ship-4", name: "TurboSync DB", type: "shipping", tier: "mature", commits: 112, ...getTreeSlotCoordinate(8, "shipping", 25), plantedAt: "2026-08-04" },
    { id: "grid-ship-3", name: "AgentSDK Brain", type: "shipping", tier: "mature", commits: 154, ...getTreeSlotCoordinate(9, "shipping", 25), plantedAt: "2026-08-03" },
    { id: "grid-ship-2", name: "NextEngine v16", type: "shipping", tier: "majestic", commits: 268, ...getTreeSlotCoordinate(10, "shipping", 25), plantedAt: "2026-08-02" },
    { id: "grid-ship-1", name: "IndieForest Core", type: "shipping", tier: "elder", commits: 342, ...getTreeSlotCoordinate(11, "shipping", 25), plantedAt: "2026-08-01" },

    // East Wing: Stripe Revenue Pines (Ascending: Small to Large, Front to Back)
    { id: "grid-rev-12", name: "Refunded Stump", type: "revenue", tier: "stump", mrr: 0, ...getTreeSlotCoordinate(0, "revenue", 25), plantedAt: "2026-07-15" },
    { id: "grid-rev-11", name: "Affiliate Seed", type: "revenue", tier: "sapling", mrr: 45, ...getTreeSlotCoordinate(1, "revenue", 25), plantedAt: "2026-08-11" },
    { id: "grid-rev-10", name: "Merch Store", type: "revenue", tier: "sapling", mrr: 89, ...getTreeSlotCoordinate(2, "revenue", 25), plantedAt: "2026-08-10" },
    { id: "grid-rev-8", name: "API Usage Meter", type: "revenue", tier: "young", mrr: 320, ...getTreeSlotCoordinate(3, "revenue", 25), plantedAt: "2026-08-08" },
    { id: "grid-rev-7", name: "Addon Packs API", type: "revenue", tier: "young", mrr: 450, ...getTreeSlotCoordinate(4, "revenue", 25), plantedAt: "2026-08-07" },
    { id: "grid-rev-6", name: "Starter Tier Sub", type: "revenue", tier: "young", mrr: 750, ...getTreeSlotCoordinate(5, "revenue", 25), plantedAt: "2026-08-06" },
    { id: "grid-rev-9", name: "Consulting Hour", type: "revenue", tier: "mature", mrr: 1200, ...getTreeSlotCoordinate(6, "revenue", 25), plantedAt: "2026-08-09" },
    { id: "grid-rev-5", name: "Lifetime Pass", type: "revenue", tier: "mature", mrr: 1600, ...getTreeSlotCoordinate(7, "revenue", 25), plantedAt: "2026-08-05" },
    { id: "grid-rev-4", name: "Developer Seat", type: "revenue", tier: "mature", mrr: 1900, ...getTreeSlotCoordinate(8, "revenue", 25), plantedAt: "2026-08-04" },
    { id: "grid-rev-3", name: "Team Workspace", type: "revenue", tier: "mature", mrr: 2400, ...getTreeSlotCoordinate(9, "revenue", 25), plantedAt: "2026-08-03" },
    { id: "grid-rev-2", name: "Pro Monthly Plan", type: "revenue", tier: "majestic", mrr: 5200, ...getTreeSlotCoordinate(10, "revenue", 25), plantedAt: "2026-08-02" },
    { id: "grid-rev-1", name: "Enterprise Annual", type: "revenue", tier: "elder", mrr: 8400, ...getTreeSlotCoordinate(11, "revenue", 25), plantedAt: "2026-08-01" },
  ];
}

interface GridViewProps {
  trees?: TreeData[];
  level?: number;
  streakDays?: number;
  streakShields?: number;
  drought?: boolean;
}

export function GridView({
  trees: propTrees,
  level = 25,
  streakDays = 42,
  streakShields = 2,
  drought = false,
}: GridViewProps = {}) {
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [showCoordinateGrid, setShowCoordinateGrid] = useState<boolean>(true);
  const [showBoundingWireframe, setShowBoundingWireframe] = useState<boolean>(false);

  const trees = useMemo(() => propTrees || getDemoGridTrees(), [propTrees]);

  return (
    <div className="relative w-full h-full bg-[#ece7de] overflow-hidden select-none">
      {/* Canonical Island Canvas with Grid Mode Active */}
      <IslandCanvas
        trees={trees}
        level={level}
        streakDays={streakDays}
        streakShields={streakShields}
        drought={drought}
        isRaining={false}
        timeOfDay="day"
        selectedTreeId={selectedTree?.id}
        onSelectTree={(tree) => {
          sound.playClick();
          setSelectedTree(tree);
        }}
        interactive={true}
        showGrid={showCoordinateGrid}
        showBoundaries={showBoundingWireframe}
      />

      {/* Floating Grid Inspection HUD Overlay */}
      <div className="absolute top-20 right-6 z-40 max-w-xs pointer-events-auto">
        <div className="p-1.5 rounded-2xl glass-dock shadow-xl">
          <div className="p-4 rounded-xl porcelain-surface space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs text-stone-900">Discrete Grid System</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                1.65m Tiles
              </span>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              Unified diorama plinth with <strong>Code Grove</strong> on the west and <strong>Cash Grove</strong> on the east on a continuous natural lawn.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <div className="text-[9px] font-bold text-stone-400 uppercase">Code Pines</div>
                  <div className="text-xs font-black text-stone-800">12 Repos</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <div>
                  <div className="text-[9px] font-bold text-stone-400 uppercase">Cash Pines</div>
                  <div className="text-xs font-black text-stone-800">12 Streams</div>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">3D Coordinate Grid</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowCoordinateGrid((prev) => !prev);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    showCoordinateGrid ? "bg-emerald-600 text-white shadow-xs" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                  }`}
                >
                  {showCoordinateGrid ? "Active" : "Off"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Perimeter Wireframe</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowBoundingWireframe((prev) => !prev);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    showBoundingWireframe ? "bg-indigo-600 text-white shadow-xs" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                  }`}
                >
                  {showBoundingWireframe ? "Active" : "Off"}
                </button>
              </div>
            </div>

            {/* Active Selection Inspector */}
            {selectedTree && (
              <div className="pt-2 border-t border-stone-100 space-y-1">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Inspected Cell</span>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 font-mono">{selectedTree.name}</span>
                    <div className="text-[9px] text-stone-500 font-mono">
                      X: {selectedTree.gridX}m · Z: {selectedTree.gridZ}m
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                    {selectedTree.tier}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2D Project Inspection Card */}
      <TreeCard tree={selectedTree} onClose={() => setSelectedTree(null)} />
    </div>
  );
}

export { GridView as ForestMRRGridShowcase };

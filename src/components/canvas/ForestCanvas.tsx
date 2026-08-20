"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { TerrainIsland } from "./TerrainIsland";
import { BlockTree } from "./BlockTree";
import { CampProps } from "./CampProps";
import { WeatherSystem } from "./WeatherSystem";
import { useForestStore, TreeData, GrowthTier } from "@/store/useForestStore";
import { X, Sparkles, TrendingUp, Calendar, Trash2 } from "lucide-react";

export function ForestCanvas() {
  const trees = useForestStore((s) => s.trees);
  const removeTree = useForestStore((s) => s.removeTree);
  const updateTreeTier = useForestStore((s) => s.updateTreeTier);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);

  return (
    <div className="absolute inset-0 w-full h-full min-h-[100dvh] bg-[#07110d] overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        orthographic
        camera={{
          position: [18, 18, 18],
          zoom: 44,
          near: 0.1,
          far: 1000,
        }}
        shadows
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      >
        <Suspense fallback={null}>
          {/* Dynamic Sun, Moon, Rain & Fireflies */}
          <WeatherSystem />

          {/* Main Floating Voxel Island */}
          <TerrainIsland />

          {/* Unlocked & Equipped Camp Structures (Campfire, Tent, Cabin, etc) */}
          <CampProps />

          {/* Render All Trees / Customers */}
          {trees.map((tree) => (
            <BlockTree
              key={tree.id}
              tree={tree}
              onSelect={(t) => setSelectedTree(t)}
            />
          ))}

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -2.85, 0]}
            opacity={0.65}
            scale={16}
            blur={1.8}
            far={10}
            color="#02140d"
          />

          {/* Smooth Isometric Orbit Controls */}
          <OrbitControls
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            minZoom={25}
            maxZoom={90}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Selected Tree Detail Modal (Double-Bezel Architecture) */}
      {selectedTree && (
        <div className="absolute top-24 right-6 z-30 w-80 p-1.5 rounded-[2rem] bg-emerald-950/40 ring-1 ring-emerald-500/30 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-right duration-200">
          <div className="p-5 rounded-[calc(2rem-0.375rem)] bg-[#0c1813]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white">
            <div className="flex items-start justify-between pb-3 border-b border-emerald-900/50">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-emerald-400 block mb-0.5">
                  {selectedTree.isDemo ? "Demo Customer" : "Active Subscriber"}
                </span>
                <h3 className="text-sm font-bold text-emerald-100">{selectedTree.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTree(null)}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3.5 space-y-2.5 text-xs text-slate-300">
              {selectedTree.mrr !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> MRR Value:
                  </span>
                  <span className="font-semibold text-emerald-300 font-mono">
                    ${selectedTree.mrr}/mo
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tree Stage:
                </span>
                <span className="capitalize font-medium text-amber-300 font-mono">
                  {selectedTree.tier}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" /> Planted On:
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  {new Date(selectedTree.plantedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Quick Tier Switcher */}
            <div className="pt-3 border-t border-emerald-900/50">
              <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-2 block">
                Change Tree Stage:
              </label>
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                {(["sapling", "young", "mature", "majestic", "stump"] as GrowthTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      updateTreeTier(selectedTree.id, tier);
                      setSelectedTree({ ...selectedTree, tier });
                    }}
                    className={`py-1 rounded-lg text-center capitalize transition font-medium ${
                      selectedTree.tier === tier
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        : "bg-black/40 hover:bg-emerald-950/60 ring-1 ring-emerald-900/50 text-emerald-300"
                    }`}
                  >
                    {tier.slice(0, 4)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  removeTree(selectedTree.id);
                  setSelectedTree(null);
                }}
                className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { TerrainIsland } from "./TerrainIsland";
import { BlockTree } from "./BlockTree";
import { CampProps } from "./CampProps";
import { WeatherSystem } from "./WeatherSystem";
import { TreeData } from "@/types/game";
import { useForestStore } from "@/store/useForestStore";
import { calculateTreeTier } from "@/lib/gamification";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  TrendingUp,
  Layers,
  Calendar,
  Trash2,
  X,
  GitCommit,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface ForestCanvasProps {
  mode?: "full" | "preview" | "profile";
  customTrees?: TreeData[];
}

export function ForestCanvas({ mode = "full", customTrees }: ForestCanvasProps) {
  const storeTrees = useForestStore((s) => s.trees);
  const removeTree = useForestStore((s) => s.removeTree);

  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);

  const activeTrees = customTrees || storeTrees;
  const isPreview = mode === "preview";

  // Calculate live progress for selected tree
  const treeProgress = selectedTree
    ? calculateTreeTier(
        selectedTree.type || "shipping",
        selectedTree.commits || 0,
        selectedTree.mrr || 0,
        selectedTree.activeDays || 1
      )
    : null;

  return (
    <div
      className={`relative w-full overflow-hidden ${
        isPreview
          ? "h-[460px] sm:h-[520px] rounded-[2.5rem] bg-gradient-to-b from-[#f4f0e8] to-[#ece7de] border border-[#d6cfc5] shadow-xl"
          : "h-screen min-h-[100dvh] bg-[#ece7de]"
      }`}
    >
      <Canvas
        orthographic
        camera={{
          position: [18, 18, 18],
          zoom: isPreview ? 36 : mode === "profile" ? 42 : 44,
          near: -100,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        id="forest-3d-canvas"
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <WeatherSystem />
          <TerrainIsland />
          <CampProps />

          {activeTrees.map((tree) => (
            <BlockTree
              key={tree.id}
              tree={tree}
              onSelect={(t) => setSelectedTree(t)}
            />
          ))}

          <ContactShadows
            position={[0, -2.85, 0]}
            opacity={0.38}
            scale={16}
            blur={2.2}
            far={10}
            color="#78716c"
          />

          <OrbitControls
            enableRotate={true}
            enablePan={false}
            enableZoom={true}
            minZoom={25}
            maxZoom={75}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.25}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Floating Badge in Preview Mode */}
      {isPreview && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="pixel" dot size="sm">
            Live 3D Diorama Preview
          </Badge>
        </div>
      )}

      {/* 1. Preview Mode Compact Drawer */}
      {isPreview && selectedTree && (
        <div className="absolute bottom-4 left-4 right-4 z-20 p-1 rounded-2xl glass-dock shadow-xl font-satoshi animate-in slide-in-from-bottom-2 duration-150">
          <div className="p-3.5 rounded-[calc(1rem-0.125rem)] porcelain-surface bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">{selectedTree.name}</span>
              <button
                onClick={() => setSelectedTree(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              {selectedTree.type === "revenue" ? (
                <span className="flex items-center gap-1 text-amber-800 font-pixel text-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> ${selectedTree.mrr || 0}/mo MRR
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-800 font-pixel text-sm">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-600" /> {selectedTree.commits || 1} Commits
                </span>
              )}
              <Badge variant={selectedTree.type === "revenue" ? "amber" : "emerald"} size="sm">
                {selectedTree.tier}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Mode: Double-Bezel Pure Progression Tree Inspector Modal */}
      {!isPreview && selectedTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/35 backdrop-blur-md animate-in fade-in duration-150 font-satoshi">
          <div className="w-full max-w-sm p-1.5 rounded-[2.25rem] glass-dock shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="rounded-[calc(2.25rem-0.375rem)] porcelain-surface p-6 text-stone-900 relative space-y-4">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedTree(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full btn-specular-porcelain text-stone-400 hover:text-stone-800 transition active:scale-95 cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="pr-8">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`font-pixel text-xs uppercase tracking-wider font-normal ${
                    selectedTree.type === "revenue" ? "text-amber-800" : "text-emerald-800"
                  }`}>
                    {selectedTree.type === "revenue" ? "Golden Revenue Pine" : "Emerald Shipping Pine"}
                  </span>
                  <Badge variant={selectedTree.type === "revenue" ? "amber" : "emerald"} size="sm">
                    {selectedTree.tier.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-stone-950 tracking-tight font-satoshi">
                  {selectedTree.name}
                </h3>
              </div>

              {/* Verifiable Proof Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  {selectedTree.type === "revenue" ? "Verified Stripe Payment" : "Verified GitHub Commits"}
                </span>
                <span className="font-pixel text-[11px] text-emerald-800">AUTHENTIC</span>
              </div>

              {/* Growth Metrics */}
              <Card variant="subtle-inset" className="p-3.5 rounded-xl space-y-2.5 text-xs text-stone-600 font-satoshi">
                {selectedTree.type === "revenue" ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-700 stroke-[1.75]" /> Monthly Volume:
                    </span>
                    <span className="text-stone-900 font-pixel text-sm font-normal">
                      ${selectedTree.mrr || 0}/mo MRR
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <GitCommit className="w-3.5 h-3.5 text-emerald-700 stroke-[1.75]" /> Code Commits:
                    </span>
                    <span className="text-stone-900 font-pixel text-sm font-normal">
                      {selectedTree.commits || 1} Ships ({selectedTree.activeDays || 1} Active Days)
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Layers className="w-3.5 h-3.5 text-stone-600 stroke-[1.75]" /> Growth Stage:
                  </span>
                  <span className="text-stone-800 font-semibold capitalize font-satoshi">
                    {selectedTree.tier}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-600 stroke-[1.75]" /> Sprouted Date:
                  </span>
                  <span className="font-pixel text-xs text-stone-700">
                    {new Date(selectedTree.plantedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>

              {/* Automatic Growth Progress towards Next Tier */}
              {treeProgress && (
                <div className="p-3 rounded-xl bg-stone-100/90 border border-stone-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Next Evolution</span>
                    </span>
                    <span className="font-pixel text-xs text-stone-600">
                      {treeProgress.nextTierLabel}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedTree.type === "revenue" ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${treeProgress.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {selectedTree.type === "revenue"
                      ? "Tree expands automatically as customer subscriptions increase."
                      : "Push commits to GitHub to water and grow this pine."}
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                {mode === "full" ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      removeTree(selectedTree.id);
                      setSelectedTree(null);
                    }}
                    icon={Trash2}
                  >
                    Uproot
                  </Button>
                ) : (
                  <span className="text-xs text-stone-500 font-satoshi">Verified Diorama</span>
                )}

                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => setSelectedTree(null)}
                >
                  Done
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

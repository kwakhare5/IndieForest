"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { TerrainIsland } from "./TerrainIsland";
import { BlockTree } from "./BlockTree";
import { CampProps } from "./CampProps";
import { WeatherSystem } from "./WeatherSystem";
import { TreeData, GrowthTier } from "@/types/game";
import { useForestStore } from "@/store/useForestStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import { TrendingUp, Layers, Calendar, Trash2, X } from "lucide-react";

interface ForestCanvasProps {
  mode?: "full" | "preview" | "profile";
  customTrees?: TreeData[];
}

const TIER_OPTIONS: SegmentedOption<GrowthTier>[] = [
  { value: "sapling", label: "Sapling" },
  { value: "young", label: "Young" },
  { value: "mature", label: "Mature" },
  { value: "majestic", label: "Majestic" },
  { value: "stump", label: "Stump" },
];

/**
 * CameraRig provides smooth mouse cursor parallax tilt.
 */
function CameraRig({ isInteractive = true }: { isInteractive?: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isInteractive) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteractive]);

  useFrame((state) => {
    if (!isInteractive) return;
    const targetX = 18 + mouse.current.x * 1.5;
    const targetY = 18 + mouse.current.y * 1.5;
    const targetZ = 18;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.04);
    state.camera.lookAt(0, 0.2, 0);
  });

  return null;
}

export function ForestCanvas({ mode = "full", customTrees }: ForestCanvasProps) {
  const storeTrees = useForestStore((s) => s.trees);
  const updateTreeTier = useForestStore((s) => s.updateTreeTier);
  const removeTree = useForestStore((s) => s.removeTree);

  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);

  const activeTrees = customTrees || storeTrees;
  const isPreview = mode === "preview";
  const isFull = mode === "full";

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
          zoom: isPreview ? 40 : 46,
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
          <CameraRig isInteractive={true} />
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
            enableRotate={false}
            enablePan={false}
            enableZoom={isFull}
            minZoom={30}
            maxZoom={65}
            dampingFactor={0.08}
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

      {/* 1. Preview Mode: Double-Bezel Selected Tree Inspector Pod */}
      {isPreview && selectedTree && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-10 pointer-events-auto p-1 rounded-2xl glass-dock shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-4 py-3 rounded-xl porcelain-surface space-y-2">
            <div className="flex items-center justify-between text-xs font-satoshi">
              <span className="font-bold text-stone-950 tracking-tight">{selectedTree.name}</span>
              <button
                onClick={() => setSelectedTree(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-800 font-bold font-pixel">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> ${selectedTree.mrr}/mo MRR
              </span>
              <Badge variant="emerald" size="sm">
                {selectedTree.tier}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Mode: Double-Bezel Tree Inspector Modal */}
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
                <span className="text-[10px] font-pixel uppercase tracking-[0.2em] font-semibold text-emerald-800 block mb-0.5">
                  {selectedTree.isDemo ? "Demo Subscriber Tree" : "Active Customer Tree"}
                </span>
                <h3 className="text-base font-bold text-stone-950 tracking-tight font-satoshi">
                  {selectedTree.name}
                </h3>
              </div>

              {/* Tree Metrics */}
              <Card variant="subtle-inset" className="p-3.5 rounded-xl space-y-2.5 text-xs text-stone-600 font-satoshi">
                {selectedTree.mrr !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-700 stroke-[1.75]" /> Monthly Value:
                    </span>
                    <span className="font-bold text-stone-900 font-pixel text-xs">
                      ${selectedTree.mrr}/mo MRR
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Layers className="w-3.5 h-3.5 text-stone-600 stroke-[1.75]" /> Current Stage:
                  </span>
                  <Badge variant="emerald" size="sm">
                    {selectedTree.tier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-600 stroke-[1.75]" /> Planted Date:
                  </span>
                  <span className="font-pixel text-[11px] text-stone-600">
                    {new Date(selectedTree.plantedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>

              {/* Stage Selector with Canonical SegmentedControl */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-pixel font-semibold text-stone-500 block">
                  Adjust Growth Stage:
                </label>
                <SegmentedControl
                  options={TIER_OPTIONS}
                  value={selectedTree.tier}
                  onChange={(val) => {
                    updateTreeTier(selectedTree.id, val);
                    setSelectedTree({ ...selectedTree, tier: val });
                  }}
                  size="sm"
                />
              </div>

              {/* Delete / Remove Action */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    removeTree(selectedTree.id);
                    setSelectedTree(null);
                  }}
                  icon={Trash2}
                >
                  Remove Tree
                </Button>

                <Button
                  variant="outline"
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

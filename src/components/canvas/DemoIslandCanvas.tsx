"use client";

import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Island } from "./Island";
import { IslandTree } from "./IslandTree";
import { Campsite } from "./Campsite";
import { Weather } from "./Weather";
import {
  calculateIslandSize,
  getTreeSlotCoordinate,
  sortTreesByGrowthTier,
} from "@/lib/gamification";
import type { TreeData, TimeOfDay } from "@/types/game";

interface DemoIslandCanvasProps {
  trees: TreeData[];
  level?: number;
  timeOfDay?: TimeOfDay;
  className?: string;
  palette?: "canonical" | "sunnyside";
}

// -----------------------------------------------------------------------------
// Card Enclosure Responsive Camera Adapter (Guarantees zero side clipping)
// -----------------------------------------------------------------------------
function DemoCameraRig({ islandSize }: { islandSize: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera && size.width > 0 && size.height > 0) {
      // Balanced world span: large, immersive island presence with comfortable margins
      const targetWorldSpan = islandSize * 1.72;
      const minDimension = Math.min(size.width, size.height);
      const fitZoom = minDimension / targetWorldSpan;

      camera.zoom = fitZoom;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height, islandSize]);

  return null;
}

const ISOMETRIC_POLAR_ANGLE = Math.atan2(Math.SQRT2 * 18, 14); // ~61.2° tilt

export function DemoIslandCanvas({
  trees = [],
  level = 2,
  timeOfDay = "day",
  className = "w-full h-full",
  palette = "sunnyside",
}: DemoIslandCanvasProps) {
  const [selectedTree, setSelectedTree] = React.useState<TreeData | null>(null);

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";
  const isSunnyside = palette === "sunnyside";

  const visibleTrees = useMemo(() => (trees || []).slice(0, 16), [trees]);
  const hasRevenue = visibleTrees.some((t) => t.type === "revenue" || (t.mrr && t.mrr > 0));

  const ambientColor = isNight
    ? "#3730a3"
    : isSunset
    ? "#ffedd5"
    : isSunnyside
    ? "#ecfdf5"
    : "#e0f2fe";
  const ambientIntensity = isNight ? 0.70 : isSunset ? 1.15 : 1.20;

  const sunColor = isNight ? "#38bdf8" : isSunset ? "#f59e0b" : "#fffdf7";
  const sunIntensity = isNight ? 0.90 : isSunset ? 1.45 : 1.35;

  const rimColor = isNight ? "#67e8f9" : isSunset ? "#f472b6" : "#93c5fd";
  const rimIntensity = isNight ? 0.45 : isSunset ? 0.40 : 0.35;

  const islandSize = calculateIslandSize(level, visibleTrees.length);
  const halfSize = islandSize / 2;
  const shadowScale = islandSize * 1.35;
  const shadowFrustum = halfSize + 3.0;

  const { safeTrees, treeCoords } = useMemo(() => {
    const isRev = (t: TreeData) => t.type === "revenue" || Boolean(t.mrr && t.mrr > 0);
    const rawShip = visibleTrees.filter((t) => !isRev(t));
    const rawRev = visibleTrees.filter((t) => isRev(t));

    const sortedShip = sortTreesByGrowthTier(rawShip);
    const sortedRev = sortTreesByGrowthTier(rawRev);

    const placedTrees: TreeData[] = [];
    const coords: Array<{ gridX: number; gridZ: number }> = [];

    sortedShip.forEach((tree, idx) => {
      const coord = getTreeSlotCoordinate(idx, "shipping", level);
      placedTrees.push({ ...tree, gridX: coord.gridX, gridZ: coord.gridZ });
      coords.push(coord);
    });

    sortedRev.forEach((tree, idx) => {
      const coord = getTreeSlotCoordinate(idx, "revenue", level);
      placedTrees.push({ ...tree, gridX: coord.gridX, gridZ: coord.gridZ });
      coords.push(coord);
    });

    return { safeTrees: placedTrees, treeCoords: coords };
  }, [visibleTrees, level]);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        orthographic
        camera={{
          position: [18, 14, 18],
          zoom: 20,
          near: -100,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <DemoCameraRig islandSize={islandSize} />
          
          <OrbitControls
            enableRotate={true}
            enablePan={false}
            enableZoom={false}
            enableDamping={true}
            dampingFactor={0.08}
            rotateSpeed={0.5}
            target={
              selectedTree
                ? [selectedTree.gridX * 0.45, 0.25, selectedTree.gridZ * 0.45]
                : [0, 0, 0]
            }
            minPolarAngle={ISOMETRIC_POLAR_ANGLE}
            maxPolarAngle={ISOMETRIC_POLAR_ANGLE}
          />

          <ambientLight intensity={ambientIntensity} color={ambientColor} />

          <directionalLight
            position={[14, 22, 10]}
            intensity={sunIntensity}
            color={sunColor}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={45}
            shadow-camera-left={-shadowFrustum}
            shadow-camera-right={shadowFrustum}
            shadow-camera-top={shadowFrustum}
            shadow-camera-bottom={-shadowFrustum}
            shadow-bias={-0.0005}
          />

          <directionalLight
            position={[-12, 12, -10]}
            intensity={rimIntensity}
            color={rimColor}
          />

          {/* 2. Soft Studio Contact Shadows */}
          <ContactShadows
            frames={1}
            position={[0, -0.48, 0]}
            opacity={0.35}
            scale={shadowScale}
            blur={2.2}
            far={6}
          />

          {/* 3. 1:1 Symmetrical Square Island Base */}
          <Island
            level={level}
            treeCount={visibleTrees.length}
            treeCoords={treeCoords}
            drought={false}
            timeOfDay={timeOfDay}
            palette={palette}
          />

          {/* 4. 3D Trees with Tactile Selection */}
          {safeTrees.map((tree) => (
            <IslandTree
              key={tree.id}
              tree={tree}
              isSelected={selectedTree?.id === tree.id}
              onSelect={(t) =>
                setSelectedTree((prev) => (prev?.id === t.id ? null : t))
              }
              timeOfDay={timeOfDay}
              drought={false}
              palette={palette}
            />
          ))}

          {/* 5. Living Campsite & Milestones */}
          <Campsite
            level={level}
            treeCount={visibleTrees.length}
            timeOfDay={timeOfDay}
            streakDays={7}
            drought={false}
            palette={palette}
          />

          {/* 6. Dynamic Atmospheric Weather Systems */}
          <Weather
            drought={false}
            isRaining={false}
            hasRevenue={hasRevenue}
          />
        </Suspense>
      </Canvas>

      {/* Floating Selected Tree Inspection Badge */}
      {selectedTree && (
        <div className="absolute top-4 left-4 z-20 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,1)] flex items-center gap-2.5 font-sans">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                selectedTree.type === "revenue" ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-stone-900 leading-tight">
                {selectedTree.name}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {selectedTree.type === "revenue"
                  ? `$${selectedTree.mrr || 0}/mo`
                  : `${selectedTree.commits || 0} commits`}{" "}
                · <span className="uppercase">{selectedTree.tier}</span>
              </span>
            </div>
            <button
              onClick={() => setSelectedTree(null)}
              className="ml-1 text-stone-400 hover:text-stone-700 text-xs px-1 cursor-pointer font-bold"
              title="Close Preview"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

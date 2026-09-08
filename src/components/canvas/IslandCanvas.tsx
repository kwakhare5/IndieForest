"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
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

interface IslandCanvasProps {
  trees: TreeData[];
  level?: number;
  streakDays?: number;
  streakShields?: number;
  drought?: boolean;
  isRaining?: boolean;
  timeOfDay?: TimeOfDay;
  selectedTreeId?: string | null;
  onSelectTree?: (tree: TreeData) => void;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  onPlantNewTree?: () => void;
  interactive?: boolean;
  className?: string;
  showGrid?: boolean;
  showBoundaries?: boolean;
}

// -----------------------------------------------------------------------------
// Low-Pitch Isometric Parallax Rig & Smooth Lerp Zoom Engine
// -----------------------------------------------------------------------------
export function IslandCanvas({
  trees = [],
  level = 1,
  streakDays = 0,
  streakShields: _streakShields = 0,
  drought = false,
  isRaining = false,
  timeOfDay = "day",
  showGrid = false,
  showBoundaries = false,
  interactive = true,
  selectedTreeId = null,
  className = "w-full h-full min-h-[480px]",
  onSelectTree,
  onClickCampfire,
  onClickCabin,
  onClickTent,
  onPlantNewTree: _onPlantNewTree,
}: IslandCanvasProps) {

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  // 3D Performance & Clarity Cap (Top 24 active repositories / MRR streams in full 3D)
  const visibleTrees = useMemo(() => (trees || []).slice(0, 24), [trees]);
  const hasRevenue = visibleTrees.some((t) => t.type === "revenue" || (t.mrr && t.mrr > 0));

  // Fresh, lively studio lighting palette across Day, Sunset, and Night (zero washed/muddy/yellow tones)
  const ambientColor = isNight
    ? "#3730a3" // Electric deep indigo ambient fill
    : isSunset
    ? "#ffedd5" // Warm peach nectar bounce
    : "#e0f2fe"; // Fresh sky blue ambient bounce
  const ambientIntensity = isNight ? 0.70 : isSunset ? 1.15 : 1.20;

  const sunColor = isNight
    ? "#38bdf8" // Crisp cyan moonbeam (high clarity, zero dark swamp)
    : isSunset
    ? "#f59e0b" // Warm honey amber sunlight
    : "#fffdf7"; // Crisp warm sunlight
  const sunIntensity = isNight ? 0.90 : isSunset ? 1.45 : 1.35;

  const rimColor = isNight ? "#67e8f9" : isSunset ? "#f472b6" : "#93c5fd";
  const rimIntensity = isNight ? 0.45 : isSunset ? 0.40 : 0.35;

  // Adaptive Dimensions across 5 tiers: 12x12, 15x15, 18.5x18.5, 21.5x21.5, 25x25
  const islandSize = calculateIslandSize(level, visibleTrees.length);
  const halfSize = islandSize / 2;

  // Calibrated Discrete Zoom Levels scaled with adaptive island size
  const baseZoom = islandSize >= 25 ? 26 : islandSize >= 21.5 ? 29 : islandSize >= 18.5 ? 32 : islandSize >= 15 ? 36 : 40;
  const targetZoom = baseZoom;

  const shadowScale = islandSize * 1.35;
  const shadowFrustum = halfSize + 3.0;

  // Exact polar angle of camera position [18, 14, 18] (~61.2° isometric tilt)
  const isometricPolarAngle = Math.atan2(Math.SQRT2 * 18, 14);

  // Discrete 1-to-1 Grid Mapping with Camera-Z Depth Sorting (Amphitheater Alignment)
  const { safeTrees, treeCoords } = useMemo(() => {
    const isRev = (t: TreeData) => t.type === "revenue" || Boolean(t.mrr && t.mrr > 0);
    const rawShip = visibleTrees.filter((t) => !isRev(t));
    const rawRev = visibleTrees.filter((t) => isRev(t));

    // Discrete 1-to-1 Grid Mapping: Ascending Order (Small to Large, Front to Back)
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
          zoom: targetZoom,
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
          <OrbitControls
            enableRotate={interactive}
            enablePan={false}
            enableZoom={false}
            enableDamping={true}
            dampingFactor={0.08}
            rotateSpeed={0.5}
            minPolarAngle={isometricPolarAngle}
            maxPolarAngle={isometricPolarAngle}
          />

          {/* 1. Dynamic Natural Lighting (Matched to Grid View & TimeOfDay) */}
          <ambientLight intensity={ambientIntensity} color={ambientColor} />

          {/* Directional Sunlight with Soft Shadows */}
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

          {/* Soft Secondary Mint / Rim Fill Light */}
          <directionalLight
            position={[-12, 12, -10]}
            intensity={rimIntensity}
            color={rimColor}
          />

          {/* 2. Soft Studio Contact Shadows (Zero Jitter, Baked frames={1}) */}
          <ContactShadows
            frames={1}
            position={[0, -0.48, 0]}
            opacity={0.35}
            scale={shadowScale}
            blur={2.2}
            far={6}
          />

          {/* 3. 1:1 Symmetrical Square Island Base (With Aligned Grid Lines) */}
          <Island
            level={level}
            treeCount={visibleTrees.length}
            treeCoords={treeCoords}
            drought={drought}
            timeOfDay={timeOfDay}
            showGrid={showGrid}
            showBoundaries={showBoundaries}
          />

          {/* 4. 3D Trees (Shipping & Revenue with Camera-Z Depth Sorting) */}
          {safeTrees.map((tree) => (
            <IslandTree
              key={tree.id}
              tree={tree}
              isSelected={selectedTreeId === tree.id}
              drought={drought}
              timeOfDay={timeOfDay}
              onSelect={onSelectTree}
            />
          ))}

          {/* 5. Living Campsite & Milestones */}
          <Campsite
            level={level}
            treeCount={visibleTrees.length}
            streakDays={streakDays}
            timeOfDay={timeOfDay}
            drought={drought}
            onClickCampfire={onClickCampfire}
            onClickCabin={onClickCabin}
            onClickTent={onClickTent}
          />

          {/* 6. Dynamic Atmospheric Weather Systems */}
          <Weather
            drought={drought}
            isRaining={isRaining}
            hasRevenue={hasRevenue}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

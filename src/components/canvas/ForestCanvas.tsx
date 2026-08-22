"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ModularIsland } from "./ModularIsland";
import { BlockTree } from "./BlockTree";
import { CampProps } from "./CampProps";
import { WeatherSystem } from "./WeatherSystem";
import type { TreeData, TimeOfDay } from "@/types/game";

interface ForestCanvasProps {
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
  interactive?: boolean;
  className?: string;
  zoomLevel?: 1 | 2;
}

// -----------------------------------------------------------------------------
// Flattering Low-Pitch Isometric Parallax Rig & Smooth Lerp Zoom Engine
// -----------------------------------------------------------------------------
function IsometricCameraRig({
  enabled = true,
  targetZoom = 38,
}: {
  enabled?: boolean;
  targetZoom?: number;
}) {
  useFrame((state) => {
    const { pointer, camera } = state;

    // Smoothly interpolate orthographic zoom
    if (Math.abs(camera.zoom - targetZoom) > 0.01) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.12);
      camera.updateProjectionMatrix();
    }

    if (!enabled) return;

    // Subtle, gentle isometric tilt without displacing the diorama from under the pointer
    const targetX = 14.5 + pointer.x * 0.15;
    const targetZ = 14.5 - pointer.y * 0.15;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0.35, 0);
  });

  return null;
}

export function ForestCanvas({
  trees = [],
  level = 1,
  streakDays = 1,
  streakShields = 0,
  drought = false,
  isRaining = false,
  timeOfDay = "day",
  selectedTreeId,
  onSelectTree,
  onClickCampfire,
  onClickTent,
  onClickCabin,
  interactive = true,
  className = "w-full h-full min-h-[420px]",
  zoomLevel = 1,
}: ForestCanvasProps) {
  const hasRevenueTrees = trees.some((t) => t.type === "revenue" || (t.mrr && t.mrr > 0));

  // Dynamic Lighting Palette based on Time of Day
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  const ambientColor = drought
    ? "#a8a29e"
    : isNight
    ? "#312e81"
    : isSunset
    ? "#fed7aa"
    : "#fffbeb";
  const ambientIntensity = drought ? 0.45 : isNight ? 0.38 : isSunset ? 0.85 : 0.75;

  const sunColor = drought
    ? "#d6d3d1"
    : isNight
    ? "#818cf8"
    : isSunset
    ? "#f97316"
    : "#ffffff";
  const sunIntensity = drought ? 0.7 : isNight ? 0.45 : isSunset ? 1.4 : 1.3;

  const rimColor = isNight ? "#38bdf8" : isSunset ? "#e879f9" : "#93c5fd";
  const rimIntensity = isNight ? 0.25 : 0.35;

  // Calibrated Discrete Zoom Levels scaled with pure 1:1 square island dimensions
  const baseZoom = level >= 50 ? 28 : level >= 20 ? 34 : level >= 10 ? 38 : 42;
  const targetZoom = zoomLevel === 2 ? baseZoom * 1.45 : baseZoom;

  // Calibrated Contact Shadow Scale for 1:1 square foundations
  const shadowScale = level >= 20 ? 34 : level >= 10 ? 28 : level >= 5 ? 22 : 18;

  return (
    <div className={`relative ${className} select-none overflow-hidden transition-colors duration-700`}>
      <Canvas
        orthographic
        camera={{ position: [14.5, 9.0, 14.5], zoom: targetZoom, near: -100, far: 200 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <IsometricCameraRig enabled={interactive} targetZoom={targetZoom} />

          {/* 1. Studio Lighting Environment with Organic Day/Night Cycle */}
          <ambientLight intensity={ambientIntensity} color={ambientColor} />

          {/* Directional Key Sun Light */}
          <directionalLight
            position={[10, 16, 8]}
            intensity={sunIntensity}
            color={sunColor}
            castShadow
          />

          {/* Soft Sky Blue/Rose Rim Light */}
          <directionalLight
            position={[-10, 10, -10]}
            intensity={rimIntensity}
            color={rimColor}
          />

          {/* 2. Soft Studio Contact Shadows (Positioned below the floating island keel) */}
          <ContactShadows
            position={[0, -0.48, 0]}
            opacity={drought ? 0.25 : isNight ? 0.6 : 0.45}
            scale={shadowScale}
            blur={2.4}
            far={6}
          />

          {/* 3. Progressive 1:1 Symmetrical Square Modular Island */}
          <ModularIsland level={level} drought={drought} />

          {/* 4. 3D Trees (Dual-Grove Emerald Shipping & Golden Revenue) */}
          {trees.map((tree) => (
            <BlockTree
              key={tree.id}
              tree={tree}
              isSelected={selectedTreeId === tree.id}
              onSelect={onSelectTree}
              drought={drought}
            />
          ))}

          {/* 5. Milestone Campsite Props & Living Wildlife */}
          <CampProps
            streakDays={streakDays}
            level={level}
            streakShields={streakShields}
            timeOfDay={timeOfDay}
            onClickCampfire={onClickCampfire}
            onClickTent={onClickTent}
            onClickCabin={onClickCabin}
            drought={drought}
          />

          {/* 6. Dynamic Weather & Particle FX */}
          <WeatherSystem
            drought={drought}
            isRaining={isRaining}
            hasRevenue={hasRevenueTrees}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { TerrainIsland } from "./TerrainIsland";
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

// Flattering Low-Pitch Isometric Parallax Rig & Smooth Zoom Animator
function IsometricCameraRig({
  enabled = true,
  targetZoom = 42,
}: {
  enabled?: boolean;
  targetZoom?: number;
}) {
  useFrame((state) => {
    const { pointer, camera } = state;

    // Smoothly interpolate zoom between the 2 discrete levels (Level 1: 42, Level 2: 56)
    if (camera.zoom !== targetZoom) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.1);
      camera.updateProjectionMatrix();
    }

    if (!enabled) return;

    // Subtle elastic tilt on the flattering low-pitch isometric angle
    const targetX = 14.5 + pointer.x * 1.0;
    const targetZ = 14.5 - pointer.y * 1.0;
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

  // 2 Discrete Zoom Levels (Level 1: 42 Overview, Level 2: 56 Inspect)
  const targetZoom = zoomLevel === 2 ? 56 : 42;

  return (
    <div className={`relative ${className} select-none overflow-hidden transition-colors duration-700`}>
      <Canvas
        orthographic
        camera={{ position: [14.5, 9.0, 14.5], zoom: 42, near: -100, far: 200 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {interactive && (
            <OrbitControls
              target={[0, 0.35, 0]}
              enablePan={false}
              enableRotate={false} /* 🔒 Locked to flattering low-pitch isometric farm angle */
              enableZoom={true}
              minZoom={38} /* 🔒 Tightly clamped zoom floor */
              maxZoom={58} /* 🔒 Tightly clamped zoom ceiling */
            />
          )}

          <IsometricCameraRig enabled={interactive} targetZoom={targetZoom} />

          {/* 2. Studio Lighting Environment with Organic Day/Night Cycle */}
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

          {/* 3. Soft Studio Contact Shadows (Positioned below the floating island keel) */}
          <ContactShadows
            position={[0, -0.48, 0]}
            opacity={drought ? 0.25 : isNight ? 0.6 : 0.45}
            scale={16}
            blur={2.4}
            far={4}
          />

          {/* 4. Unified Seamless Island Meadow Slab */}
          <TerrainIsland level={level} drought={drought} />

          {/* 5. 3D Trees (Dual-Grove Emerald Shipping & Golden Revenue) */}
          {trees.map((tree) => (
            <BlockTree
              key={tree.id}
              tree={tree}
              isSelected={selectedTreeId === tree.id}
              onSelect={onSelectTree}
              drought={drought}
            />
          ))}

          {/* 6. Milestone Campsite Props & Living Wildlife */}
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

          {/* 7. Dynamic Weather & Particle FX */}
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

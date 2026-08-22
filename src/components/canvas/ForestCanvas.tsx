"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TerrainIsland } from "./TerrainIsland";
import { BlockTree } from "./BlockTree";
import { CampProps } from "./CampProps";
import { WeatherSystem } from "./WeatherSystem";
import type { TreeData } from "@/types/game";

interface ForestCanvasProps {
  trees: TreeData[];
  level?: number;
  streakDays?: number;
  streakShields?: number;
  drought?: boolean;
  isRaining?: boolean;
  selectedTreeId?: string | null;
  onSelectTree?: (tree: TreeData) => void;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  interactive?: boolean;
  className?: string;
  autoRotate?: boolean;
  orbitRef?: React.RefObject<any>;
}

// Hologram Mouse Parallax Rig
function ParallaxRig({ enabled = true }: { enabled?: boolean }) {
  useFrame((state) => {
    if (!enabled) return;
    const { pointer, camera } = state;
    // Subtle elastic tilt based on mouse pointer coordinates
    const targetX = 12 + pointer.x * 1.5;
    const targetZ = 12 - pointer.y * 1.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0.4, 0);
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
  selectedTreeId,
  onSelectTree,
  onClickCampfire,
  onClickTent,
  onClickCabin,
  interactive = true,
  className = "w-full h-full min-h-[420px]",
  autoRotate = false,
}: ForestCanvasProps) {
  const hasRevenueTrees = trees.some((t) => t.type === "revenue" || (t.mrr && t.mrr > 0));

  return (
    <div className={`relative ${className} select-none overflow-hidden`}>
      <Canvas
        gl={{
          antialias: true,
          preserveDrawingBuffer: true, // Required for instant 1200x675 card snapshot and video capture
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* 1. True Orthographic Isometric Camera Setup */}
          <OrthographicCamera
            makeDefault
            position={[12, 14, 12]}
            zoom={42}
            near={0.1}
            far={100}
          />

          {interactive && (
            <OrbitControls
              enablePan={false}
              enableRotate={interactive}
              enableZoom={interactive}
              minZoom={28}
              maxZoom={75}
              minPolarAngle={Math.PI / 4.5}
              maxPolarAngle={Math.PI / 2.3}
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
            />
          )}

          {!autoRotate && <ParallaxRig enabled={interactive} />}

          {/* 2. Studio Lighting Environment */}
          <ambientLight intensity={drought ? 0.45 : 0.75} color={drought ? "#a8a29e" : "#fffbeb"} />

          {/* Directional Key Sun Light */}
          <directionalLight
            position={[10, 16, 8]}
            intensity={drought ? 0.7 : 1.3}
            color={drought ? "#d6d3d1" : "#ffffff"}
            castShadow
          />

          {/* Soft Sky Blue Rim Light */}
          <directionalLight
            position={[-10, 10, -10]}
            intensity={0.35}
            color="#93c5fd"
          />

          {/* 3. Soft Studio Contact Shadows */}
          <ContactShadows
            position={[0, -0.24, 0]}
            opacity={drought ? 0.25 : 0.45}
            scale={16}
            blur={2.4}
            far={4}
          />

          {/* 4. Procedural 2-Layer Chamfered Terrain Slab */}
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

          {/* 6. Milestone Campsite Props (Campfire, Tent, Cabin, Pier) */}
          <CampProps
            streakDays={streakDays}
            level={level}
            streakShields={streakShields}
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

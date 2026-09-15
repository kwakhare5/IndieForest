"use client";

import React from "react";
import type { TimeOfDay } from "@/types/game";
import { calculateIslandSize } from "@/lib/gamification";
import { Campfire } from "./models/Campfire";
import { CanvasTent } from "./models/CanvasTent";
import { Cabin } from "./models/Cabin";
import { Dog } from "./models/Dog";

interface CampsiteProps {
  streakDays?: number;
  level?: number;
  treeCount?: number;
  timeOfDay?: TimeOfDay;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  drought?: boolean;
}

export function Campsite({
  streakDays = 1,
  level = 1,
  treeCount = 0,
  timeOfDay = "day",
  onClickCampfire,
  onClickTent,
  onClickCabin,
  drought = false,
}: CampsiteProps) {
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  // Milestone Unlocks based on streak & level
  const hasCampfire = true; // Always present at heart of campsite
  const hasCabin = level >= 10 || streakDays >= 14;
  const hasTent = !hasCabin; // Tent is starter shelter, replaced by Cabin at Level 10+
  const hasCampDog = streakDays >= 5 || level >= 5;

  // Adaptive Dimensions across 5 tiers: 12x12, 15x15, 18.5x18.5, 21.5x21.5, 25x25
  const islandSize = calculateIslandSize(level, treeCount);

  const isTier5 = islandSize >= 25.0;
  const isTier4 = islandSize >= 21.5;
  const isTier3 = islandSize >= 18.5;
  const isTier2 = islandSize >= 15.0;

  const cabinPos: [number, number, number] = isTier5
    ? [-2.2, 0.28, 2.3]
    : isTier4
    ? [-1.8, 0.28, 2.1]
    : [-1.4, 0.28, 1.9];

  const tentPos: [number, number, number] = isTier2
    ? [-1.6, 0.28, 2.0]
    : [-1.4, 0.28, 1.9];

  const campfirePos: [number, number, number] = isTier5
    ? [2.2, 0.28, 2.3]
    : isTier4
    ? [1.8, 0.28, 2.1]
    : isTier3
    ? [1.6, 0.28, 2.0]
    : isTier2
    ? [1.5, 0.28, 1.95]
    : [1.4, 0.28, 1.9];

  const dogPos: [number, number, number] = isTier5
    ? [1.3, 0.28, 3.1]
    : isTier4
    ? [1.2, 0.28, 2.9]
    : isTier3
    ? [1.1, 0.28, 2.7]
    : [1.0, 0.28, 2.6];

  return (
    <group>
      {/* 0. Campsite Hearth Patio Slab (Solid Stone Hearth Pad - Zero Floating) */}
      <mesh position={[0, 0.285, 2.2]} receiveShadow>
        <boxGeometry args={[isTier4 ? 5.6 : 4.6, 0.035, 2.4]} />
        <meshStandardMaterial color={drought ? "#a88c74" : "#7d6653"} roughness={0.88} flatShading />
      </mesh>

      {/* 1. Milestone Campfire (Daily Focus Station - INTERACTIVE) */}
      {hasCampfire && (
        <group position={campfirePos}>
          {/* True Transparent Stationary Hitbox */}
          <mesh
            position={[0, 0.45, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onClickCampfire?.();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <cylinderGeometry args={[1.0, 1.0, 0.9, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Campfire isNight={isNight} isSunset={isSunset} drought={drought} />
        </group>
      )}

      {/* 2. Starter Canvas Tent (INTERACTIVE - Harmoniously angled toward campfire) */}
      {hasTent && (
        <group position={tentPos} rotation={[0, 0.35, 0]}>
          <mesh
            position={[0, 0.5, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onClickTent?.();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <boxGeometry args={[1.6, 1.1, 1.6]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <CanvasTent drought={drought} />
        </group>
      )}

      {/* 3. Log Cabin HQ (INTERACTIVE - Harmoniously angled toward campfire) */}
      {hasCabin && (
        <group position={cabinPos} rotation={[0, 0.35, 0]}>
          <mesh
            position={[0, 0.8, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onClickCabin?.();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <boxGeometry args={[2.2, 1.6, 2.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Cabin isNight={isNight} drought={drought} />
        </group>
      )}

      {/* 4. Living Companion Dog (INTERACTIVE - Harmoniously aligned on Hearth Patio) */}
      {hasCampDog && (
        <group position={dogPos} rotation={[0, 0.35, 0]}>
          <Dog interactive />
        </group>
      )}
    </group>
  );
}


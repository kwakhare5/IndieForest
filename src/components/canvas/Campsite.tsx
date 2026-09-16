"use client";

import React from "react";
import type { TimeOfDay } from "@/types/game";
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
  palette?: "canonical" | "sunnyside" | "tabletop";
}

// Low-Poly Woodland Campsite — De-clustered with Generous Breathing Room
export function Campsite({
  streakDays = 1,
  level = 1,
  treeCount: _treeCount = 0,
  timeOfDay = "day",
  onClickCampfire,
  onClickTent,
  onClickCabin,
  drought = false,
  palette = "canonical",
}: CampsiteProps) {
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  const hasCampfire = true;
  const hasCabin = true;
  const hasTent = true;
  const hasCampDog = streakDays >= 3 || level >= 2;

  // De-clustered positions: 3.5m–6m clearance between every structure
  const tentPos: [number, number, number] = [-3.4, 0.28, 1.15];
  const cabinPos: [number, number, number] = [2.75, 0.28, -0.45];
  const campfirePos: [number, number, number] = [1.75, 0.28, 2.85];
  const dogPos: [number, number, number] = [-1.15, 0.28, 2.45];

  return (
    <group>
      {/* 1. Milestone Campfire (Daily Focus Station - INTERACTIVE) */}
      {hasCampfire && (
        <group position={campfirePos}>
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
            <cylinderGeometry args={[1.1, 1.1, 0.9, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Campfire isNight={isNight} isSunset={isSunset} drought={drought} palette={palette} />
        </group>
      )}

      {/* 2. Canvas A-Frame Tent (INTERACTIVE - Resting & Streak Shields) */}
      {hasTent && (
        <group position={tentPos} rotation={[0, 0.45, 0]}>
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
            <boxGeometry args={[1.7, 1.2, 1.7]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <CanvasTent drought={drought} />
        </group>
      )}

      {/* 3. Log Cabin HQ (INTERACTIVE - Island Stats & Overview) */}
      {hasCabin && (
        <group position={cabinPos} rotation={[0, 0.45, 0]}>
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
            <boxGeometry args={[2.2, 1.8, 2.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Cabin isNight={isNight} drought={drought} palette={palette} />
        </group>
      )}

      {/* 4. Living Companion Dog (Spaced naturally in the clearing) */}
      {hasCampDog && (
        <group position={dogPos} rotation={[0, 0.5, 0]}>
          <Dog interactive />
        </group>
      )}
    </group>
  );
}

"use client";

import React from "react";
import type { TimeOfDay } from "@/types/game";
import { Campfire } from "./models/Campfire";
import { CanvasTent } from "./models/CanvasTent";
import { LogCabin } from "./models/LogCabin";
import { CampDog } from "./models/CampDog";
import { RobinBird } from "./models/RobinBird";
import { Flagpole } from "./models/Flagpole";
import { LanternPost } from "./models/LanternPost";
import { Windmill } from "./models/Windmill";
import { HarborPier } from "./models/HarborPier";
import { Lighthouse } from "./models/Lighthouse";

interface CampPropsComponentProps {
  streakDays?: number;
  level?: number;
  streakShields?: number;
  timeOfDay?: TimeOfDay;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  drought?: boolean;
}

export function CampProps({
  streakDays = 1,
  level = 1,
  timeOfDay = "day",
  onClickCampfire,
  onClickTent,
  onClickCabin,
  drought = false,
}: CampPropsComponentProps) {
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  // Milestone Unlocks based on streak & level
  const hasCampfire = streakDays >= 1 || level >= 1;
  const hasTent = streakDays >= 3 || level >= 3;
  const hasCabin = streakDays >= 7 || level >= 5;

  // Wildlife Unlocks
  const hasRobin = streakDays >= 5 || level >= 4;
  const hasCampDog = streakDays >= 10 || level >= 7;

  // Canonical Coordinates on Symmetrical Square
  const cabinPos: [number, number, number] = [-0.6, 0.25, 1.8];
  const tentPos: [number, number, number] = [-3.8, 0.25, 2.8];
  const campfirePos: [number, number, number] = [1.8, 0.25, 2.8];
  const dogPos: [number, number, number] = [-1.8, 0.25, 3.0];
  const flagPos: [number, number, number] = [-0.6, 0.25, 3.8];
  const lanternPos: [number, number, number] = [2.8, 0.25, 3.4];
  const robinPos: [number, number, number] = [-1.0, 0.25, 1.0];
  const windmillPos: [number, number, number] = [4.6, 0.25, 2.8];
  const pierPos: [number, number, number] = [0.0, 0.25, 4.8];
  const lighthousePos: [number, number, number] = [-6.2, 0.45, -6.0];

  return (
    <group>
      {/* 1. Milestone Campfire (Daily Focus Station) */}
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
            <cylinderGeometry args={[0.75, 0.75, 0.9, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Campfire isNight={isNight} isSunset={isSunset} drought={drought} />
        </group>
      )}

      {/* 2. Sabbatical Canvas Tent (Rest & Streak Freeze Vault) */}
      {hasTent && (
        <group position={tentPos} rotation={[0, 0.2, 0]}>
          {/* True Transparent Stationary Hitbox */}
          <mesh
            position={[0, 0.65, 0]}
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
            <boxGeometry args={[1.7, 1.4, 1.7]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <CanvasTent drought={drought} />
        </group>
      )}

      {/* 3. Founder's War Room HQ Cabin (Commanding Center-South Ranch) */}
      {hasCabin && (
        <group position={cabinPos} rotation={[0, 0.45, 0]}>
          {/* True Transparent Stationary Hitbox */}
          <mesh
            position={[0, 0.85, 0]}
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
            <boxGeometry args={[2.1, 1.8, 2.1]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <LogCabin isNight={isNight} drought={drought} />
        </group>
      )}

      {/* 4. Living Wildlife: Standing Golden Companion */}
      {hasCampDog && (
        <group position={dogPos} rotation={[0, -0.5, 0]}>
          <CampDog interactive />
        </group>
      )}

      {/* 5. Living Wildlife: Robin Bird */}
      {hasRobin && (
        <group position={robinPos} rotation={[0, 0.3, 0]}>
          <RobinBird />
        </group>
      )}

      {/* 6. Streak Milestone Flagpole */}
      {level >= 2 && (
        <group position={flagPos} rotation={[0, 0.0, 0]}>
          <Flagpole />
        </group>
      )}

      {/* 7. Lantern Post Gate */}
      {level >= 3 && (
        <group position={lanternPos}>
          <LanternPost isNight={isNight} />
        </group>
      )}

      {/* 8. Elite Monument: Alpine Windmill (Unlocks at Level 15) */}
      {level >= 15 && (
        <group position={windmillPos} rotation={[0, -0.2, 0]}>
          <mesh
            position={[0, 1.3, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <cylinderGeometry args={[1.0, 1.2, 2.6, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Windmill isNight={isNight} drought={drought} />
        </group>
      )}

      {/* 9. Elite Monument: Harbor Pier & Cargo Boat (Unlocks at Level 25) */}
      {level >= 25 && (
        <group position={pierPos}>
          <mesh
            position={[0, 0.35, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <boxGeometry args={[1.7, 0.7, 1.7]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <HarborPier isNight={isNight} drought={drought} />
        </group>
      )}

      {/* 10. Elite Monument: Coast Lighthouse (Unlocks at Level 35) */}
      {level >= 35 && (
        <group position={lighthousePos}>
          <mesh
            position={[0, 1.9, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <cylinderGeometry args={[0.8, 1.1, 4.0, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          <Lighthouse isNight={isNight} drought={drought} />
        </group>
      )}
    </group>
  );
}

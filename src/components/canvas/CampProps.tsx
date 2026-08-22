"use client";

import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Flame, Tent, Home, Shield } from "lucide-react";
import type { TimeOfDay } from "@/types/game";
import { Campfire } from "./models/Campfire";
import { CanvasTent } from "./models/CanvasTent";
import { LogCabin } from "./models/LogCabin";
import { CampDog } from "./models/CampDog";
import { RobinBird } from "./models/RobinBird";
import { Flagpole } from "./models/Flagpole";
import { LanternPost } from "./models/LanternPost";

interface CampPropsComponentProps {
  streakDays?: number;
  level?: number;
  streakShields?: number;
  timeOfDay?: TimeOfDay;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  drought?: boolean;
  showBadges?: boolean;
}

export function CampProps({
  streakDays = 1,
  level = 1,
  streakShields = 0,
  timeOfDay = "day",
  onClickCampfire,
  onClickTent,
  onClickCabin,
  drought = false,
  showBadges = false,
}: CampPropsComponentProps) {
  const [hoveredProp, setHoveredProp] = useState<"campfire" | "tent" | "cabin" | null>(null);

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  // Milestone Unlocks based on streak & level
  const hasCampfire = streakDays >= 1 || level >= 1;
  const hasTent = streakDays >= 3 || level >= 3;
  const hasCabin = streakDays >= 7 || level >= 5;

  // Wildlife Unlocks
  const hasRobin = streakDays >= 5 || level >= 4;
  const hasCampDog = streakDays >= 10 || level >= 7;

  // Spacious South-West Homestead Staging (All facing camera)
  const cabinPos: [number, number, number] = [-3.4, 0.25, 2.0];
  const tentPos: [number, number, number] = [-1.8, 0.25, 2.8];
  const campfirePos: [number, number, number] = [-1.0, 0.25, 1.8];
  const dogPos: [number, number, number] = [-0.5, 0.25, 2.1];
  const flagPos: [number, number, number] = [-4.4, 0.25, 2.6];
  const lanternPos: [number, number, number] = [-2.5, 0.25, 3.2];
  const robinPos: [number, number, number] = [-3.5, 0.25, 3.2];

  return (
    <group>
      {/* 1. Milestone Campfire (Daily Focus Station) */}
      {hasCampfire && (
        <group
          position={campfirePos}
          onClick={(e) => {
            e.stopPropagation();
            onClickCampfire?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("campfire");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          <Campfire isNight={isNight} isSunset={isSunset} drought={drought} />

          {/* Clickable Tooltip Badge (Visible on hover or when showBadges is true) */}
          {(showBadges || hoveredProp === "campfire") && (
            <Html
              position={[0, 0.85, 0]}
              center
              distanceFactor={13}
              className="pointer-events-none select-none transition-transform duration-200"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-stone-900 border border-stone-300 shadow-md text-xs font-bold whitespace-nowrap">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Campfire Focus</span>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 2. Sabbatical Canvas Tent (Rest & Streak Freeze Vault) */}
      {hasTent && (
        <group
          position={tentPos}
          rotation={[0, -0.3, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickTent?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("tent");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          <CanvasTent drought={drought} />

          {/* Clickable Tooltip Badge with Shields */}
          {(showBadges || hoveredProp === "tent") && (
            <Html
              position={[0, 1.25, 0]}
              center
              distanceFactor={13}
              className="pointer-events-none select-none transition-transform duration-200"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-stone-900 border border-stone-300 shadow-md text-xs font-bold whitespace-nowrap">
                <Tent className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rest Vault</span>
                {streakShields > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono">
                    <Shield className="w-2.5 h-2.5" />
                    {streakShields}
                  </span>
                )}
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 3. Founder's War Room HQ Cabin (Facing camera at 35deg) */}
      {hasCabin && (
        <group
          position={cabinPos}
          rotation={[0, 0.55, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickCabin?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("cabin");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          <LogCabin isNight={isNight} drought={drought} />

          {/* Clickable Tooltip Badge */}
          {(showBadges || hoveredProp === "cabin") && (
            <Html
              position={[0, 1.6, 0]}
              center
              distanceFactor={13}
              className="pointer-events-none select-none transition-transform duration-200"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-stone-900 border border-stone-300 shadow-md text-xs font-bold whitespace-nowrap">
                <Home className="w-3.5 h-3.5 text-amber-700" />
                <span>War Room</span>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 4. Living Wildlife: Camp Shiba Dog */}
      {hasCampDog && (
        <group position={dogPos} rotation={[0, -0.6, 0]}>
          <CampDog />
        </group>
      )}

      {/* 5. Living Wildlife: Robin Bird */}
      {hasRobin && (
        <group position={robinPos} rotation={[0, 0.4, 0]}>
          <RobinBird />
        </group>
      )}

      {/* 6. Streak Milestone Flagpole */}
      {level >= 2 && (
        <group position={flagPos} rotation={[0, 0.2, 0]}>
          <Flagpole />
        </group>
      )}

      {/* 7. Lantern Post Gate */}
      {level >= 3 && (
        <group position={lanternPos}>
          <LanternPost isNight={isNight} />
        </group>
      )}
    </group>
  );
}

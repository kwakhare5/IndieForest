"use client";

import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TreeData, TimeOfDay } from "@/types/game";
import { getTreeYawRotation } from "@/lib/gamification";
import { PineTree } from "./models/PineTree";
import { DeciduousTree } from "./models/DeciduousTree";

interface TreeGrassPatchProps {
  isRevenue: boolean;
  drought: boolean;
  timeOfDay?: TimeOfDay;
  hovered: boolean;
  isSelected: boolean;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

// Subtle Flush Grass Tile Patch (1.55m x 1.55m) — Seamlessly merged into the diorama turf
function TreeGrassPatch({
  isRevenue,
  drought = false,
  timeOfDay = "day",
  hovered,
  isSelected,
  palette = "canonical",
}: TreeGrassPatchProps) {
  const isSunnyside = palette === "sunnyside";
  const isTabletop = palette === "tabletop";
  const patchColor = drought
    ? "#a8a29e"
    : isTabletop
    ? timeOfDay === "night"
      ? "#1e3a1e"
      : timeOfDay === "sunset"
      ? "#84cc16"
      : "#95C558" // Seamlessly blends with Tabletop Terrain Grass
    : isSunnyside
    ? timeOfDay === "night"
      ? isRevenue
        ? "#1b4d3e"
        : "#143a2f"
      : timeOfDay === "sunset"
      ? isRevenue
        ? "#a3e635"
        : "#84cc16"
      : isRevenue
      ? "#72d35e"
      : "#5fc14c" // Seamlessly blends with Sunnyside turf (Tiles 65, 66)
    : timeOfDay === "night"
    ? isRevenue
      ? "#0d9488"
      : "#115e59"
    : timeOfDay === "sunset"
    ? isRevenue
      ? "#84cc16"
      : "#65a30d"
    : isRevenue
    ? "#5a9e32"
    : "#448824";

  const isGlowing = hovered || isSelected;
  const glowColor = isSelected
    ? isRevenue
      ? "#f59e0b"
      : "#10b981"
    : isRevenue
    ? "#fbbf24"
    : "#34d399";

  return (
    <group position={[0, 0.003, 0]} raycast={() => null}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.55, 1.55]} />
        <meshStandardMaterial
          color={patchColor}
          roughness={0.82}
          metalness={0.02}
          flatShading
        />
      </mesh>
      {isGlowing && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[1.55, 1.55]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={isSelected ? 0.35 : 0.18}
          />
        </mesh>
      )}
    </group>
  );
}

interface IslandTreeProps {
  tree: TreeData;
  isSelected?: boolean;
  onSelect?: (tree: TreeData) => void;
  drought?: boolean;
  timeOfDay?: TimeOfDay;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

export function IslandTree({
  tree,
  isSelected = false,
  onSelect,
  drought = false,
  timeOfDay = "day",
  palette = "canonical",
}: IslandTreeProps) {
  const [hovered, setHovered] = useState(false);
  const visualGroupRef = useRef<THREE.Group>(null);

  const tier = tree.tier;
  const isRevenue = tree.type === "revenue";
  const yaw = useMemo(() => getTreeYawRotation(tree.id || tree.name), [tree.id, tree.name]);

  // Discrete ring radius calibrated to fit strictly inside the 1.55m patch
  const ringRadius = useMemo(() => {
    switch (tier) {
      case "stump":
        return 0.35;
      case "sapling":
        return 0.45;
      case "young":
        return 0.52;
      case "mature":
        return 0.58;
      case "majestic":
      case "elder":
      default:
        return 0.65;
    }
  }, [tier]);

  const hitboxHeight = useMemo(() => {
    switch (tier) {
      case "stump":
        return 0.45;
      case "sapling":
        return 0.85;
      case "young":
        return 1.35;
      case "mature":
        return 1.95;
      case "majestic":
      case "elder":
      default:
        return 2.65;
    }
  }, [tier]);

  // Tactile tree hop & spring scale physics on hover / selection
  useFrame(() => {
    if (visualGroupRef.current) {
      const targetY = isSelected ? 0.14 : hovered ? 0.08 : 0;
      const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1.0;
      visualGroupRef.current.position.y = THREE.MathUtils.lerp(
        visualGroupRef.current.position.y,
        targetY,
        0.25
      );
      const currentScale = visualGroupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.25);
      visualGroupRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  return (
    <group position={[tree.gridX, 0.28, tree.gridZ]}>
      {/* 1. Flat Subtle Grass Patch Merged into Lawn */}
      <TreeGrassPatch
        isRevenue={isRevenue}
        drought={drought}
        timeOfDay={timeOfDay}
        hovered={hovered}
        isSelected={isSelected}
        palette={palette}
      />

      {/* 2. Discrete Circular Ground Target Ring */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ringRadius * 0.82, ringRadius, 32]} />
          <meshBasicMaterial
            color={isSelected ? (isRevenue ? "#f59e0b" : "#10b981") : "#ffffff"}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 3. Precision Raycast Hitbox */}
      <mesh
        position={[0, hitboxHeight / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(tree);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          setHovered(false);
        }}
      >
        <cylinderGeometry args={[0.78, 0.78, hitboxHeight, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 4. Visual Low-Poly Tree (Pine for shipping, Deciduous Oak for revenue in tabletop) */}
      <group ref={visualGroupRef} rotation={[0, yaw, 0]} raycast={() => null}>
        {palette === "tabletop" && isRevenue ? (
          <DeciduousTree
            tier={tree.tier}
            drought={drought}
            palette="tabletop"
          />
        ) : (
          <PineTree
            tier={tree.tier}
            colorType={isRevenue ? "orange" : "green"}
            drought={drought}
            palette={palette}
          />
        )}
      </group>
    </group>
  );
}

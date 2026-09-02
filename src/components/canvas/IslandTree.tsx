"use client";

import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TreeData } from "@/types/game";
import { getTreeYawRotation } from "@/lib/gamification";
import { PineTree } from "./models/PineTree";

interface TreeGrassPatchProps {
  isRevenue: boolean;
  drought: boolean;
  hovered: boolean;
  isSelected: boolean;
}

// =============================================================================
// Subtle Flush Grass Tile Patch (1.55m x 1.55m - Zero Curbs, Zero Pegs)
// Merges seamlessly into the island lawn with a gentle 10-15% tone shift
// =============================================================================
function TreeGrassPatch({
  isRevenue,
  drought,
  hovered,
  isSelected,
}: TreeGrassPatchProps) {
  // Island grass is #5ea774
  // Code: Subtle deeper sage-emerald (#529968)
  // Cash: Subtle warmer sunlit olive-emerald (#689e57)
  // Drought: Weathered dry sage (#6e6a62)
  const patchColor = drought
    ? "#6e6a62"
    : isRevenue
    ? "#689e57"
    : "#529968";

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
      {/* Flat Flush Grass Patch lying directly on the turf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.55, 1.55]} />
        <meshStandardMaterial
          color={patchColor}
          roughness={0.82}
          emissive={isGlowing ? glowColor : "#000000"}
          emissiveIntensity={isGlowing ? (isSelected ? 0.28 : 0.15) : 0}
        />
      </mesh>
    </group>
  );
}

interface IslandTreeProps {
  tree: TreeData;
  isSelected?: boolean;
  onSelect?: (tree: TreeData) => void;
  drought?: boolean;
}

export function IslandTree({
  tree,
  isSelected = false,
  onSelect,
  drought = false,
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

  // Subtle tree hop physics on hover / selection
  useFrame(() => {
    if (visualGroupRef.current) {
      const targetY = hovered || isSelected ? 0.12 : 0;
      visualGroupRef.current.position.y = THREE.MathUtils.lerp(
        visualGroupRef.current.position.y,
        targetY,
        0.2
      );
    }
  });

  return (
    <group position={[tree.gridX, 0.28, tree.gridZ]}>
      {/* 1. Flat Subtle Grass Patch (Zero Curbs, Zero Pegs, Merged into Lawn) */}
      <TreeGrassPatch
        isRevenue={isRevenue}
        drought={drought}
        hovered={hovered}
        isSelected={isSelected}
      />

      {/* 2. Discrete Circular Ground Target Ring (Grounded Flush over Grass) */}
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

      {/* 3. Precision Raycast Hitbox (Spanning Tile Width & Tree Height) */}
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
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          setHovered(false);
        }}
      >
        <cylinderGeometry args={[0.78, 0.78, hitboxHeight, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 4. Visual Animated 3D Pine Mesh (Raycast Disabled to Prevent Jitter) */}
      <group ref={visualGroupRef} rotation={[0, yaw, 0]} raycast={() => null}>
        <PineTree
          tier={tree.tier}
          colorType={isRevenue ? "orange" : "green"}
          drought={drought}
        />
      </group>
    </group>
  );
}

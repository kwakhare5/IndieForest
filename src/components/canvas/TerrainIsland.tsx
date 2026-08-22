"use client";

import React, { useMemo } from "react";

interface TerrainIslandProps {
  level?: number;
  drought?: boolean;
}

export function TerrainIsland({ level = 1, drought = false }: TerrainIslandProps) {
  // Island dimensions based on progression level
  const { width, depth, baseThickness, topThickness } = useMemo(() => {
    let w = 8.5;
    let d = 8.0;
    if (level >= 20) {
      w = 13.0;
      d = 12.5;
    } else if (level >= 10) {
      w = 10.5;
      d = 10.0;
    } else if (level < 5) {
      w = 7.8;
      d = 7.4;
    }
    return {
      width: w,
      depth: d,
      baseThickness: 0.45,
      topThickness: 0.25,
    };
  }, [level]);

  // Materials & Colors (Clean, vibrant emerald meadow & warm earthen foundation)
  const grassColor = drought ? "#78716c" : "#10b981";
  const baseFoundationColor = drought ? "#57534e" : "#78350f";
  const stoneColor = drought ? "#78716c" : "#94a3b8";

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Terracotta Foundation Keel (Solid bottom block with weight) */}
      <mesh position={[0, -baseThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, baseThickness, depth - 0.1]} />
        <meshStandardMaterial
          color={baseFoundationColor}
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* 2. Unified Seamless Pristine Meadow Grass Slab (100% Clean & Glitch-Free) */}
      <mesh position={[0, topThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[width, topThickness, depth]} />
        <meshStandardMaterial
          color={grassColor}
          roughness={0.65}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* 3. Subtle Shoreline Perimeter Riverstones */}
      <group position={[0, topThickness + 0.02, 0]}>
        <mesh position={[-width / 2 + 0.35, 0, -depth / 2 + 0.45]} rotation={[0, 0.8, 0]} castShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[width / 2 - 0.45, 0, -depth / 2 + 0.55]} rotation={[0, 1.4, 0]} castShadow>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-width / 2 + 0.55, 0, depth / 2 - 0.55]} rotation={[0, 2.1, 0]} castShadow>
          <dodecahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[width / 2 - 0.35, 0, depth / 2 - 0.45]} rotation={[0, 0.5, 0]} castShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  );
}

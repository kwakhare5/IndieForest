"use client";

import React, { useMemo } from "react";

interface ModularIslandProps {
  level?: number;
  drought?: boolean;
}

export function ModularIsland({ level = 1, drought = false }: ModularIslandProps) {
  const grassColor = drought ? "#78716c" : "#10b981";
  const mountainGrassColor = drought ? "#6b645c" : "#059669";
  const baseColor = drought ? "#57534e" : "#78350f";

  // Pure 1:1 Symmetrical Square Dimensions based on Level
  const { size, hasNorthBluff } = useMemo(() => {
    if (level >= 20) {
      return { size: 18.0, hasNorthBluff: true };
    }
    if (level >= 10) {
      return { size: 15.0, hasNorthBluff: false };
    }
    if (level >= 5) {
      return { size: 12.0, hasNorthBluff: false };
    }
    return { size: 9.0, hasNorthBluff: false };
  }, [level]);

  const baseThickness = 0.45;
  const topThickness = 0.25;

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 1. Symmetrical 1:1 Square Island Foundation Keel (Terracotta Cliff)       */}
      {/* ========================================================================= */}
      <mesh position={[0, -baseThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[size - 0.1, baseThickness, size - 0.1]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. Symmetrical 1:1 Square Top Emerald Turf Slab (Clean, Balanced & Flat)  */}
      {/* ========================================================================= */}
      <mesh position={[0, topThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[size, topThickness, size]} />
        <meshStandardMaterial
          color={grassColor}
          roughness={0.65}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 3. High North Mountain Plateau Terrace (Level 20+ Back Ridge)             */}
      {/* ========================================================================= */}
      {hasNorthBluff && (
        <group position={[0, topThickness + 0.1, -size / 2 + 2.0]}>
          {/* Raised Highland Turf */}
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[size - 0.4, 0.2, 3.8]} />
            <meshStandardMaterial
              color={mountainGrassColor}
              roughness={0.7}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 4. Subtle Perimeter Riverstones (Corner Accents)                          */}
      {/* ========================================================================= */}
      <mesh position={[-size / 2 + 0.5, topThickness / 2 + 0.04, -size / 2 + 0.5]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[size / 2 - 0.5, topThickness / 2 + 0.04, size / 2 - 0.5]}>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

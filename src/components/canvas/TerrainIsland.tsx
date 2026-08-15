"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useForestStore } from "@/store/useForestStore";

export function TerrainIsland() {
  const drought = useForestStore((s) => s.drought);

  // Grass colors (vibrant green vs drought pale)
  const grassColor = useMemo(() => (drought ? "#8a9a6c" : "#48bb78"), [drought]);
  const grassDarkColor = useMemo(() => (drought ? "#687a50" : "#38a169"), [drought]);
  const dirtTopColor = useMemo(() => "#8b5a2b", []);
  const dirtBaseColor = useMemo(() => "#5c3a21", []);
  const waterColor = useMemo(() => (drought ? "#64748b" : "#38bdf8"), [drought]);

  return (
    <group position={[0, 0, 0]}>
      {/* --- Main Ground Base (Earth Block) --- */}
      {/* Top Grass Plate (8x8 grid, 0.5 height) */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 0.5, 8]} />
        <meshStandardMaterial color={grassColor} roughness={0.7} flatShading />
      </mesh>

      {/* Layered Earth Strata 1 */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <boxGeometry args={[8, 1.0, 8]} />
        <meshStandardMaterial color={dirtTopColor} roughness={0.9} flatShading />
      </mesh>

      {/* Layered Earth Strata 2 (Dark Subsoil) */}
      <mesh position={[0, -2.0, 0]} receiveShadow>
        <boxGeometry args={[7.8, 1.0, 7.8]} />
        <meshStandardMaterial color={dirtBaseColor} roughness={0.95} flatShading />
      </mesh>

      {/* Bottom Bedrock Peak */}
      <mesh position={[0, -2.8, 0]}>
        <boxGeometry args={[6.5, 0.6, 6.5]} />
        <meshStandardMaterial color="#382415" roughness={1.0} flatShading />
      </mesh>

      {/* --- Corner Grass Patches & Micro Terrain Elevations --- */}
      {/* North-West Raised Grass Plateau */}
      <mesh position={[-2.8, 0.15, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color={grassDarkColor} roughness={0.7} flatShading />
      </mesh>

      {/* South-East Small Grass Step */}
      <mesh position={[2.6, 0.1, 2.6]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.2, 2.4]} />
        <meshStandardMaterial color={grassDarkColor} roughness={0.7} flatShading />
      </mesh>

      {/* --- Central Pond (Sunken Oasis matching Reference Photo) --- */}
      {/* Stone Pool Rim Blocks */}
      <group position={[0, 0, 0]}>
        {/* Sunken Basin Floor */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[2.6, 0.2, 2.6]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} flatShading />
        </mesh>

        {/* Shimmering Water Mesh */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2.4, 0.1, 2.4]} />
          <meshStandardMaterial
            color={waterColor}
            roughness={0.1}
            metalness={0.1}
            transparent
            opacity={0.85}
            flatShading
          />
        </mesh>

        {/* Water Surface Sparkle Pads */}
        <mesh position={[-0.4, 0.01, -0.3]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.5, 0.01, 0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 6]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* --- Decorative Stone Rocks Around Pond --- */}
      <mesh position={[-1.6, 0.15, 0.5]} castShadow receiveShadow rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[1.5, 0.12, -0.6]} castShadow receiveShadow rotation={[-0.1, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.45]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.8, 0.1, 1.6]} castShadow receiveShadow rotation={[0.3, 0.1, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

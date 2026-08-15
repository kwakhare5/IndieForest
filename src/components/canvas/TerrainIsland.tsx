"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useForestStore } from "@/store/useForestStore";

export function TerrainIsland() {
  const drought = useForestStore((s) => s.drought);
  const waterRef = useRef<THREE.Mesh>(null);

  // Vibrant Ghibli / Animal Crossing Colors
  const grassColor = useMemo(() => (drought ? "#a3a886" : "#22c55e"), [drought]);
  const grassDarkColor = useMemo(() => (drought ? "#7e8563" : "#16a34a"), [drought]);
  const dirtTopColor = useMemo(() => "#b45309", []);
  const dirtBaseColor = useMemo(() => "#78350f", []);
  const waterColor = useMemo(() => (drought ? "#64748b" : "#06b6d4"), [drought]);

  // Water gentle breathing animation
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const t = clock.getElapsedTime();
      waterRef.current.scale.y = 1 + Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- Main Ground Base (Floating Earth Voxel Block) --- */}
      {/* Top Grass Surface Plate (8x8 grid, 0.5 height) */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 0.5, 8]} />
        <meshStandardMaterial color={grassColor} roughness={0.6} flatShading />
      </mesh>

      {/* Layered Rich Earth Strata 1 */}
      <mesh position={[0, -1.0, 0]} receiveShadow>
        <boxGeometry args={[8, 1.0, 8]} />
        <meshStandardMaterial color={dirtTopColor} roughness={0.85} flatShading />
      </mesh>

      {/* Layered Earth Strata 2 (Deep Terracotta Clay) */}
      <mesh position={[0, -2.0, 0]} receiveShadow>
        <boxGeometry args={[7.8, 1.0, 7.8]} />
        <meshStandardMaterial color={dirtBaseColor} roughness={0.9} flatShading />
      </mesh>

      {/* Bottom Bedrock Keel */}
      <mesh position={[0, -2.8, 0]}>
        <boxGeometry args={[6.5, 0.6, 6.5]} />
        <meshStandardMaterial color="#451a03" roughness={1.0} flatShading />
      </mesh>

      {/* --- Raised Grass Plateaus (Matching Reference Photo 2) --- */}
      {/* North-West Elevation */}
      <mesh position={[-2.8, 0.15, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color={grassDarkColor} roughness={0.6} flatShading />
      </mesh>

      {/* South-East Elevation */}
      <mesh position={[2.6, 0.1, 2.6]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.2, 2.4]} />
        <meshStandardMaterial color={grassDarkColor} roughness={0.6} flatShading />
      </mesh>

      {/* --- Central Sunken Pond Oasis --- */}
      <group position={[0, 0, 0]}>
        {/* Sunken Stone Basin */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[2.7, 0.2, 2.7]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} flatShading />
        </mesh>

        {/* Shimmering Turquoise Water Mesh */}
        <mesh ref={waterRef} position={[0, -0.05, 0]}>
          <boxGeometry args={[2.4, 0.12, 2.4]} />
          <meshStandardMaterial
            color={waterColor}
            roughness={0.05}
            metalness={0.15}
            transparent
            opacity={0.9}
            flatShading
          />
        </mesh>

        {/* Floating Lily Pads & Sparkle Circles */}
        <mesh position={[-0.4, 0.02, -0.3]}>
          <cylinderGeometry args={[0.26, 0.26, 0.02, 6]} />
          <meshStandardMaterial color="#86efac" roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.5, 0.02, 0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 6]} />
          <meshStandardMaterial color="#4ade80" roughness={0.3} flatShading />
        </mesh>
      </group>

      {/* --- Stylized Low-Poly Boulders --- */}
      <mesh position={[-1.6, 0.15, 0.5]} castShadow receiveShadow rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.55, 0.45, 0.65]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[1.5, 0.12, -0.6]} castShadow receiveShadow rotation={[-0.1, 0.8, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0.8, 0.1, 1.6]} castShadow receiveShadow rotation={[0.3, 0.1, 0]}>
        <boxGeometry args={[0.38, 0.28, 0.38]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} flatShading />
      </mesh>
    </group>
  );
}

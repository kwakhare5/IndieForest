"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TreeData, GrowthTier, useForestStore } from "@/store/useForestStore";
import { sound } from "@/lib/sound";

interface BlockTreeProps {
  tree: TreeData;
  onSelect?: (tree: TreeData) => void;
}

export function BlockTree({ tree, onSelect }: BlockTreeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const drought = useForestStore((s) => s.drought);

  const isRevenue = tree.type === "revenue" || (tree.mrr && tree.mrr > 0);

  // Gentle wind swaying animation
  useFrame(({ clock }) => {
    if (meshRef.current && tree.tier !== "stump") {
      const t = clock.getElapsedTime() + (tree.gridX + tree.gridZ) * 0.4;
      meshRef.current.rotation.z = Math.sin(t * 1.8) * 0.025;
      meshRef.current.rotation.x = Math.cos(t * 1.4) * 0.02;
    }
  });

  // Dual-Grove Palette: Golden Amber for Revenue vs Emerald Green for Shipping
  const foliageBase = drought
    ? "#947f52"
    : isRevenue
    ? "#b45309"
    : "#15803d";

  const foliageHighlight = drought
    ? "#b39b67"
    : isRevenue
    ? "#d97706"
    : "#22c55e";

  const foliageBright = drought
    ? "#d97706"
    : isRevenue
    ? "#fbbf24"
    : "#4ade80";

  const trunkColor = isRevenue ? "#78350f" : "#854d0e";

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    sound.playClick();
    if (onSelect) onSelect(tree);
  };

  return (
    <group
      ref={meshRef}
      position={[tree.gridX, 0, tree.gridZ]}
      scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* 1. STUMP */}
      {tree.tier === "stump" && (
        <group position={[0, 0.15, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.3, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* 2. SAPLING */}
      {tree.tier === "sapling" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.5, 5]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={hovered ? "#fef08a" : foliageBright}
              roughness={0.5}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 3. YOUNG PINE (2 Tiers) */}
      {tree.tier === "young" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.9, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.75, 0.65, 5]} />
            <meshStandardMaterial color={foliageBase} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.52, 0.6, 5]} />
            <meshStandardMaterial
              color={hovered ? "#fde047" : foliageHighlight}
              roughness={0.5}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 4. MATURE PINE (3 Stepped Tiers) */}
      {tree.tier === "mature" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.28, 1.2, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.95, 0.7, 6]} />
            <meshStandardMaterial color={foliageBase} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.72, 0.65, 6]} />
            <meshStandardMaterial color={foliageHighlight} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.48, 0.6, 6]} />
            <meshStandardMaterial
              color={hovered ? "#fde047" : foliageBright}
              roughness={0.5}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 5. MAJESTIC ANCIENT PINE (4 Tiers + Golden Rune Halo) */}
      {tree.tier === "majestic" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.38, 1.5, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 1.2, 0.75, 6]} />
            <meshStandardMaterial color={foliageBase} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.95, 0.7, 6]} />
            <meshStandardMaterial color={foliageHighlight} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 2.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.7, 0.65, 6]} />
            <meshStandardMaterial color={foliageHighlight} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.42, 0.55, 6]} />
            <meshStandardMaterial
              color={hovered ? "#fde047" : foliageBright}
              roughness={0.3}
              flatShading
            />
          </mesh>
          {/* Golden Floating Halo */}
          <mesh position={[0, 3.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.045, 8, 16]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#eab308"
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

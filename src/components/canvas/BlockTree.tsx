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

  // Gentle idle swaying animation
  useFrame(({ clock }) => {
    if (meshRef.current && tree.tier !== "stump") {
      const t = clock.getElapsedTime() + (tree.gridX + tree.gridZ) * 0.5;
      meshRef.current.rotation.z = Math.sin(t * 1.5) * 0.02;
      meshRef.current.rotation.x = Math.cos(t * 1.2) * 0.015;
    }
  });

  // Foliage and trunk palette
  const foliageBase = drought ? "#947f52" : "#2f855a";
  const foliageHighlight = drought ? "#b39b67" : "#48bb78";
  const foliageMajestic = drought ? "#d97706" : "#10b981";
  const trunkColor = "#78350f";

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
      scale={hovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* 1. STUMP */}
      {tree.tier === "stump" && (
        <group position={[0, 0.15, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.3, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} flatShading />
          </mesh>
          {/* Tree Rings Top */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 6]} />
            <meshStandardMaterial color="#d97706" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 2. SAPLING */}
      {tree.tier === "sapling" && (
        <group position={[0, 0, 0]}>
          {/* Stem */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.5, 5]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} flatShading />
          </mesh>
          {/* Foliage Cube */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={hovered ? "#34d399" : foliageHighlight}
              roughness={0.6}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 3. YOUNG PINE (2 Tiers) */}
      {tree.tier === "young" && (
        <group position={[0, 0, 0]}>
          {/* Trunk */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.9, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} flatShading />
          </mesh>
          {/* Lower Foliage Tier */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.7, 0.65, 5]} />
            <meshStandardMaterial color={foliageBase} roughness={0.6} flatShading />
          </mesh>
          {/* Upper Foliage Cone */}
          <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.5, 0.6, 5]} />
            <meshStandardMaterial
              color={hovered ? "#34d399" : foliageHighlight}
              roughness={0.6}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 4. MATURE PINE (3 Tiers matching Reference Photo 2) */}
      {tree.tier === "mature" && (
        <group position={[0, 0, 0]}>
          {/* Trunk with Flared Roots */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.28, 1.2, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} flatShading />
          </mesh>
          {/* Bottom Foliage Tier */}
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.9, 0.7, 6]} />
            <meshStandardMaterial color={foliageBase} roughness={0.6} flatShading />
          </mesh>
          {/* Middle Foliage Tier */}
          <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.7, 0.65, 6]} />
            <meshStandardMaterial color={foliageHighlight} roughness={0.6} flatShading />
          </mesh>
          {/* Top Foliage Peak */}
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.45, 0.6, 6]} />
            <meshStandardMaterial
              color={hovered ? "#6ee7b7" : foliageHighlight}
              roughness={0.6}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* 5. MAJESTIC ANCIENT PINE (4 Tiers + Gold Crown / Glow) */}
      {tree.tier === "majestic" && (
        <group position={[0, 0, 0]}>
          {/* Mighty Trunk */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.38, 1.5, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} flatShading />
          </mesh>
          {/* Tier 1 */}
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 1.15, 0.75, 6]} />
            <meshStandardMaterial color="#065f46" roughness={0.5} flatShading />
          </mesh>
          {/* Tier 2 */}
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.9, 0.7, 6]} />
            <meshStandardMaterial color="#047857" roughness={0.5} flatShading />
          </mesh>
          {/* Tier 3 */}
          <mesh position={[0, 2.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.65, 0.65, 6]} />
            <meshStandardMaterial color={foliageMajestic} roughness={0.5} flatShading />
          </mesh>
          {/* Tier 4 (Crown Peak) */}
          <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.4, 0.55, 6]} />
            <meshStandardMaterial
              color={hovered ? "#fbbf24" : "#34d399"}
              roughness={0.4}
              flatShading
            />
          </mesh>
          {/* Golden Floating Halo / Rune on top */}
          <mesh position={[0, 3.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.04, 8, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

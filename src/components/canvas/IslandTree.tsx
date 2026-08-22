"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TreeData } from "@/types/game";
import { ConiferTree } from "./models/ConiferTree";
import { DeciduousTree } from "./models/DeciduousTree";
import { ZenStump } from "./models/ZenStump";

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
  const visualGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isRevenue = tree.type === "revenue";
  const tier = tree.tier || "sapling";

  // Smooth spring lerp on the visual mesh only (Hitbox remains rock-solid stationary)
  useFrame((state) => {
    if (visualGroupRef.current) {
      const targetY = hovered
        ? 0.12 + Math.sin(state.clock.elapsedTime * 4) * 0.02
        : 0;
      visualGroupRef.current.position.y = THREE.MathUtils.lerp(
        visualGroupRef.current.position.y,
        targetY,
        0.15
      );

      const targetScale = hovered ? 1.05 : 1.0;
      visualGroupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });

  return (
    <group position={[tree.gridX, 0.25, tree.gridZ]}>
      {/* 1. True Transparent Stationary Collision Hitbox (100% Solid to Three.js Raycaster) */}
      <mesh
        position={[0, 0.9, 0]}
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
        <cylinderGeometry args={[0.7, 0.7, 2.2, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 2. Visual Animated Mesh Group */}
      <group ref={visualGroupRef}>
        {/* Selection Glow Ring */}
        {isSelected && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.82, 24]} />
            <meshBasicMaterial
              color={isRevenue ? "#f59e0b" : "#10b981"}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}

        {/* Modular 3D Tree Renderer */}
        {tier === "stump" ? (
          <ZenStump drought={drought} />
        ) : isRevenue ? (
          <DeciduousTree tier={tier} drought={drought} />
        ) : (
          <ConiferTree tier={tier} drought={drought} />
        )}
      </group>
    </group>
  );
}

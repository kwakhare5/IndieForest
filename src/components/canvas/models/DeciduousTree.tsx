"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GrowthTier } from "@/types/game";
import type { PlainEnglishTier, DioramaTier } from "./PineTree";

export interface DeciduousTreeProps {
  tier?: GrowthTier | DioramaTier | PlainEnglishTier;
  drought?: boolean;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

// Low-Poly Deciduous / Oak Tree — Faceted Icosphere Canopy on Crooked Cylindrical Trunk
export function DeciduousTree({
  tier = "sprout",
  drought = false,
  palette = "tabletop",
}: DeciduousTreeProps) {
  const isTabletop = palette === "tabletop";

  // Palette selection
  const trunkColor = drought
    ? "#44403c"
    : isTabletop
    ? "#8B5A2B" // Medium warm brown
    : "#6b3e26";

  const canopyColor = drought
    ? "#a8a29e"
    : isTabletop
    ? "#6DBE45" // Bright lime green
    : "#5fc14c";

  const swayRef = useRef<THREE.Group>(null);

  // Gentle natural breeze sway
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime;
      swayRef.current.rotation.z = Math.sin(t * 1.5) * 0.015;
      swayRef.current.rotation.x = Math.cos(t * 1.2) * 0.012;
    }
  });

  // 0. Stump
  if (tier === "stump") {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.18, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
        </mesh>
        <mesh position={[0, 0.181, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 8]} />
          <meshStandardMaterial color={isTabletop ? "#D4A86A" : "#b08968"} roughness={1.0} flatShading />
        </mesh>
      </group>
    );
  }

  // Active Tree Progression across 4 stages (Sprout, Young, Mature, Mighty)
  const isMighty =
    tier === "mighty" ||
    tier === "enterprise" ||
    tier === "majestic" ||
    tier === "elder";

  const isMature = tier === "tall" || tier === "scale" || tier === "mature";
  const isYoung = tier === "small" || tier === "pro" || tier === "young";

  const treeScale = isMighty
    ? 1.25
    : isMature
    ? 1.05
    : isYoung
    ? 0.85
    : 0.65;

  const trunkRadius = 0.07;
  const trunkHeight = isMighty ? 1.4 : isMature ? 1.15 : isYoung ? 0.95 : 0.75;

  return (
    <group position={[0, 0, 0]} scale={[treeScale, treeScale, treeScale]}>
      {/* 1. Root flare */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[trunkRadius * 1.2, trunkRadius * 1.8, 0.10, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
      </mesh>

      {/* 2. Crooked Cylindrical Trunk (Slight tilt for organic feel) */}
      <mesh
        position={[0.04, trunkHeight / 2, -0.03]}
        rotation={[0.06, 0.2, -0.08]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[trunkRadius * 0.9, trunkRadius * 1.2, trunkHeight, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
      </mesh>

      {/* 3. Faceted Icosphere Canopy (Low-Poly Triangle Mesh) */}
      <group ref={swayRef} position={[0.06, trunkHeight, -0.04]}>
        {isMighty ? (
          // Mighty / Elder: Grand Multi-Lobed Icosphere Canopy
          <group>
            {/* Primary Apex Canopy */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.78, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            {/* Left Cluster Lobe */}
            <mesh position={[-0.45, 0.2, 0.25]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.55, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            {/* Right Cluster Lobe */}
            <mesh position={[0.48, 0.15, -0.2]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.52, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            {/* Rear Cluster Lobe */}
            <mesh position={[0.05, 0.25, -0.45]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.48, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
          </group>
        ) : isMature ? (
          // Mature / Tall: Classic 3-Lobe Faceted Canopy
          <group>
            {/* Main Central Icosphere */}
            <mesh position={[0, 0.40, 0]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.68, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            {/* Offset Lobe 1 */}
            <mesh position={[-0.38, 0.15, 0.2]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.46, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            {/* Offset Lobe 2 */}
            <mesh position={[0.36, 0.18, -0.22]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.42, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
          </group>
        ) : isYoung ? (
          // Young: Single Medium Faceted Icosphere with slight secondary swell
          <group>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.54, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
            <mesh position={[-0.22, 0.12, 0.15]} castShadow receiveShadow>
              <icosahedronGeometry args={[0.34, 1]} />
              <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
            </mesh>
          </group>
        ) : (
          // Sprout: Single Small Faceted Icosphere
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <icosahedronGeometry args={[0.38, 1]} />
            <meshStandardMaterial color={canopyColor} roughness={1.0} metalness={0.0} flatShading={true} />
          </mesh>
        )}
      </group>
    </group>
  );
}

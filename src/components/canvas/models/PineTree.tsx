"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GrowthTier } from "@/types/game";

export type PlainEnglishTier = "sprout" | "small" | "tall" | "mighty";
export type DioramaTier = "starter" | "pro" | "scale" | "enterprise";

export interface PineTreeProps {
  tier?: GrowthTier | DioramaTier | PlainEnglishTier;
  colorType?: "green" | "orange";
  drought?: boolean;
  hasMetricBorder?: boolean;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

// Low-Poly Tabletop & Alpine Conifer Pine — Stacked Octagonal Cones on Brown Cylinder Trunk
export function PineTree({
  tier = "sprout",
  colorType = "green",
  drought = false,
  palette = "tabletop",
}: PineTreeProps) {
  const isCash = colorType === "orange";
  const isTabletop = palette === "tabletop";
  const isSunnyside = palette === "sunnyside";

  // Palette selection
  const trunkColor = drought
    ? "#44403c"
    : isTabletop
    ? "#8B5A2B" // Medium warm brown
    : isCash
    ? isSunnyside ? "#8b4513" : "#78350f"
    : isSunnyside ? "#6b3e26" : "#5c3a21";

  // Foliage skirts
  const foliageBase = drought
    ? "#78716c"
    : isTabletop
    ? isCash ? "#D97706" : "#24491E" // Deep shadow forest green
    : isCash
    ? isSunnyside ? "#be4a2f" : "#b45309"
    : isSunnyside ? "#2e6635" : "#2d4a1d";

  const foliageMid = drought
    ? "#a8a29e"
    : isTabletop
    ? isCash ? "#F59E0B" : "#2F5A28" // Reference dark forest green
    : isCash
    ? isSunnyside ? "#e48325" : "#d97706"
    : isSunnyside ? "#3e8948" : "#365314";

  const foliageTop = drought
    ? "#d6d3d1"
    : isTabletop
    ? isCash ? "#FBBF24" : "#3A6E32" // Light-accent apex
    : isCash
    ? isSunnyside ? "#feae34" : "#f59e0b"
    : isSunnyside ? "#53a641" : "#4d7c0f";

  const swayRef = useRef<THREE.Group>(null);

  // Subtle natural breeze sway
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime;
      swayRef.current.rotation.z = Math.sin(t * 1.8) * 0.012;
      swayRef.current.rotation.x = Math.cos(t * 1.4) * 0.010;
    }
  });

  // 0. Stump (Cut cylindrical log trunk)
  if (tier === "stump") {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.18, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
        </mesh>
        <mesh position={[0, 0.181, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.115, 8]} />
          <meshStandardMaterial color={isTabletop ? "#D4A86A" : "#b08968"} roughness={1.0} flatShading />
        </mesh>
      </group>
    );
  }

  // Active Tree Progression across 4 active stages (Sprout, Young, Mature, Mighty)
  const isMighty =
    tier === "mighty" ||
    tier === "enterprise" ||
    tier === "majestic" ||
    tier === "elder";

  const isMature = tier === "tall" || tier === "scale" || tier === "mature";
  const isYoung = tier === "small" || tier === "pro" || tier === "young";

  // Scale factor
  const treeScale = isMighty
    ? 1.25
    : isMature
    ? 1.05
    : isYoung
    ? 0.85
    : 0.65;

  const trunkRadius = 0.058;
  const trunkHeight = isMighty ? 1.75 : isMature ? 1.45 : isYoung ? 1.15 : 0.95;

  // Distinct Octagonal Cones (8 segments) stacked and scaling down as they ascend
  const skirts = isMighty
    ? [
        { y: 0.70, radius: 0.54, height: 0.62, color: foliageBase },
        { y: 1.05, radius: 0.42, height: 0.56, color: foliageMid },
        { y: 1.38, radius: 0.30, height: 0.50, color: foliageMid },
        { y: 1.70, radius: 0.18, height: 0.44, color: foliageTop },
      ]
    : isMature
    ? [
        // Classic 3-cone stacked evergreen pine from blueprint
        { y: 0.68, radius: 0.48, height: 0.58, color: foliageBase },
        { y: 1.02, radius: 0.35, height: 0.52, color: foliageMid },
        { y: 1.34, radius: 0.22, height: 0.46, color: foliageTop },
      ]
    : isYoung
    ? [
        // 2-cone youthful pine
        { y: 0.58, radius: 0.40, height: 0.52, color: foliageBase },
        { y: 0.90, radius: 0.26, height: 0.46, color: foliageTop },
      ]
    : [
        // Sprout / seedling: single octagonal cone
        { y: 0.52, radius: 0.32, height: 0.46, color: foliageTop },
      ];

  return (
    <group position={[0, 0, 0]} scale={[treeScale, treeScale, treeScale]}>
      {/* 1. Root flare cylinder */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[trunkRadius * 1.3, trunkRadius * 1.7, 0.10, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
      </mesh>

      {/* 2. Slender Brown Cylinder Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[trunkRadius, trunkRadius * 1.25, trunkHeight, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={1.0} flatShading />
      </mesh>

      {/* 3. Stacked Octagonal Cones (Crisp Flat Shading) */}
      <group ref={swayRef} position={[0, 0, 0]}>
        {skirts.map((s, idx) => (
          <mesh
            key={`skirt-${idx}`}
            position={[0, s.y, 0]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[s.radius, s.height, 8]} />
            <meshStandardMaterial
              color={s.color}
              roughness={1.0}
              metalness={0.0}
              flatShading={true}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

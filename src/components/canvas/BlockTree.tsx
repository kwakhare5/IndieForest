"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Trees, TrendingUp } from "lucide-react";
import type { TreeData } from "@/types/game";
import { ConiferTree } from "./models/ConiferTree";
import { DeciduousTree } from "./models/DeciduousTree";
import { ZenStump } from "./models/ZenStump";

interface BlockTreeProps {
  tree: TreeData;
  isSelected?: boolean;
  onSelect?: (tree: TreeData) => void;
  drought?: boolean;
  showBadge?: boolean;
}

const TIER_NUMERALS = {
  sapling: "I",
  young: "II",
  mature: "III",
  majestic: "IV",
  stump: "—",
};

export function BlockTree({
  tree,
  isSelected = false,
  onSelect,
  drought = false,
  showBadge = true,
}: BlockTreeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isRevenue = tree.type === "revenue";
  const tier = tree.tier || "sapling";

  // Smooth spring lerp on hover
  useFrame((state) => {
    if (groupRef.current) {
      const targetY = hovered
        ? 0.25 + 0.12 + Math.sin(state.clock.elapsedTime * 4) * 0.02
        : 0.25;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.12
      );

      const targetScale = hovered ? 1.06 : 1.0;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
    }
  });

  const badgeY =
    tier === "majestic"
      ? 2.55
      : tier === "mature"
      ? 2.15
      : tier === "young"
      ? 1.15
      : tier === "sapling"
      ? 0.58
      : 0.85;

  const shouldRenderBadge = showBadge ? true : hovered || isSelected;

  return (
    <group
      ref={groupRef}
      position={[tree.gridX, 0.25, tree.gridZ]}
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
      {/* Selection Glow Cylinder */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 24]} />
          <meshBasicMaterial
            color={isRevenue ? "#f59e0b" : "#10b981"}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Modular 3D Tree Renderer: Dedicated species for Shipping vs Revenue */}
      {tier === "stump" ? (
        <ZenStump drought={drought} />
      ) : isRevenue ? (
        <DeciduousTree tier={tier} drought={drought} />
      ) : (
        <ConiferTree tier={tier} drought={drought} />
      )}

      {/* Floating 3D Porcelain Double-Bezel Billboard Badge */}
      {shouldRenderBadge && (
        <Html
          position={[0, badgeY, 0]}
          center
          distanceFactor={13}
          className="pointer-events-none select-none transition-transform duration-200"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border ${
              isRevenue
                ? "bg-amber-50 text-amber-900 border-amber-300 shadow-amber-500/10"
                : "bg-white text-stone-900 border-stone-200/90 shadow-stone-900/10"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                isRevenue ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {isRevenue ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <Trees className="w-3 h-3" />
              )}
            </div>
            <span className="font-satoshi tracking-tight max-w-[90px] truncate">
              {tree.name}
            </span>
            <span className="font-pixel text-[11px] opacity-85 font-mono">
              {TIER_NUMERALS[tier]}
            </span>
            <span
              className={`text-[10px] font-mono px-1 py-0.5 rounded font-semibold ${
                isRevenue
                  ? "bg-amber-200/60 text-amber-800"
                  : "bg-emerald-100/70 text-emerald-800"
              }`}
            >
              {isRevenue
                ? `$${tree.mrr || 0}`
                : `${tree.commits || 1}c`}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

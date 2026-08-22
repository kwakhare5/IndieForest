"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TreeData, GrowthTier } from "@/types/game";
import { Trees, TrendingUp } from "lucide-react";

interface BlockTreeProps {
  tree: TreeData;
  isSelected?: boolean;
  onSelect?: (tree: TreeData) => void;
  drought?: boolean;
}

const TIER_NUMERALS: Record<GrowthTier, string> = {
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
}: BlockTreeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isRevenue = tree.type === "revenue";
  const tier = tree.tier || "sapling";

  // Gentle floating hover & scale bounce
  useFrame((state) => {
    if (groupRef.current) {
      if (hovered) {
        groupRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 4) * 0.04;
      } else {
        groupRef.current.position.y = 0;
      }
    }
  });

  // Calculate tree tiers geometry parameters
  const { tiers, trunkHeight, totalHeight } = React.useMemo(() => {
    switch (tier) {
      case "stump":
        return {
          tiers: [],
          trunkHeight: 0.25,
          totalHeight: 0.3,
        };
      case "sapling":
        return {
          tiers: [{ radius: 0.45, height: 0.6, y: 0.5 }],
          trunkHeight: 0.35,
          totalHeight: 0.9,
        };
      case "young":
        return {
          tiers: [
            { radius: 0.6, height: 0.65, y: 0.45 },
            { radius: 0.42, height: 0.55, y: 0.8 },
          ],
          trunkHeight: 0.4,
          totalHeight: 1.25,
        };
      case "mature":
        return {
          tiers: [
            { radius: 0.75, height: 0.7, y: 0.45 },
            { radius: 0.55, height: 0.6, y: 0.85 },
            { radius: 0.38, height: 0.5, y: 1.2 },
          ],
          trunkHeight: 0.45,
          totalHeight: 1.6,
        };
      case "majestic":
      default:
        return {
          tiers: [
            { radius: 0.9, height: 0.75, y: 0.45 },
            { radius: 0.7, height: 0.65, y: 0.9 },
            { radius: 0.5, height: 0.55, y: 1.3 },
            { radius: 0.32, height: 0.45, y: 1.65 },
          ],
          trunkHeight: 0.5,
          totalHeight: 2.0,
        };
    }
  }, [tier]);

  // Tree Foliage Colors
  const getTierColor = (index: number, total: number) => {
    if (drought) return index % 2 === 0 ? "#78716c" : "#57534e";

    if (isRevenue) {
      // Golden shimmering gradient
      if (index === total - 1) return "#fef08a"; // Top brightest gold
      if (index === total - 2) return "#facc15";
      return "#eab308";
    }

    // Emerald shipping pine gradient
    if (index === total - 1) return "#10b981"; // Light spring leaf top
    if (index === total - 2) return "#059669"; // Deep forest emerald
    return "#047857"; // Dark bottom pine
  };

  const trunkColor = drought ? "#57534e" : "#78350f";

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
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
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

      {/* Hexagonal Cedar Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.14, trunkHeight, 6]} />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.85}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* Faceted Pyramid Conifer Foliage Tiers */}
      {tiers.map((t, idx) => (
        <mesh
          key={idx}
          position={[0, t.y, 0]}
          rotation={[0, idx * 0.45, 0]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[t.radius, t.height, 4]} />
          <meshStandardMaterial
            color={getTierColor(idx, tiers.length)}
            roughness={isRevenue ? 0.4 : 0.6}
            metalness={isRevenue ? 0.2 : 0.05}
            flatShading
          />
        </mesh>
      ))}

      {/* Majestic Torus Golden Halo Apex */}
      {tier === "majestic" && !drought && (
        <group position={[0, totalHeight + 0.08, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.035, 8, 20]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* Floating 3D Porcelain Double-Bezel Billboard Badge */}
      <Html
        position={[0, totalHeight + (tier === "majestic" ? 0.45 : 0.3), 0]}
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
          <span className="font-pixel text-[9px] opacity-75 font-mono">
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
    </group>
  );
}

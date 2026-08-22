"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { TreeData } from "@/types/game";
import { useForestStore } from "@/store/useForestStore";
import { sound } from "@/lib/sound";
import { GitBranch, DollarSign, Sparkles } from "lucide-react";

interface BlockTreeProps {
  tree: TreeData;
  onSelect?: (tree: TreeData) => void;
}

export function BlockTree({ tree, onSelect }: BlockTreeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const drought = useForestStore((s) => s.drought);

  const isRevenue = tree.type === "revenue" || (tree.mrr && tree.mrr > 0);

  // Gentle wind swaying & buttery scale lerp animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    if (tree.tier !== "stump") {
      const t = clock.getElapsedTime() + (tree.gridX + tree.gridZ) * 0.4;
      meshRef.current.rotation.z = Math.sin(t * 1.8) * 0.025;
      meshRef.current.rotation.x = Math.cos(t * 1.4) * 0.02;
    }

    const targetScale = hovered ? 1.08 : 1.0;
    const targetY = hovered ? 0.22 : 0.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.18);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.18);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.18);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.18);
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

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sound.playClick();
    if (onSelect) onSelect(tree);
  };

  return (
    <group
      ref={meshRef}
      position={[tree.gridX, 0, tree.gridZ]}
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

      {/* Floating 3D Porcelain Billboard Badge */}
      <Html
        position={[
          0,
          tree.tier === "majestic"
            ? 3.8
            : tree.tier === "mature"
            ? 2.85
            : tree.tier === "young"
            ? 2.05
            : tree.tier === "sapling"
            ? 1.2
            : 0.65,
          0,
        ]}
        center
        className="select-none font-satoshi transition-transform duration-150"
      >
        <div
          onMouseEnter={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            if (onSelect) onSelect(tree);
          }}
          className={`pointer-events-auto cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight whitespace-nowrap flex items-center gap-1.5 shadow-md border backdrop-blur-md transition-all duration-200 ${
            hovered
              ? "scale-115 bg-white/95 border-emerald-500 text-stone-950 shadow-lg ring-2 ring-emerald-400/50"
              : isRevenue
              ? "bg-[#fef9c3]/90 border-amber-300 text-amber-950 shadow-xs"
              : "bg-white/85 border-stone-200 text-stone-800 shadow-xs"
          }`}
        >
          {isRevenue ? (
            <DollarSign size={11} className="text-amber-700 shrink-0" strokeWidth={2.5} />
          ) : (
            <GitBranch size={11} className="text-emerald-700 shrink-0" strokeWidth={2.5} />
          )}
          <span className="max-w-[110px] truncate">{tree.name}</span>
          <span className="opacity-60 text-[9px] font-mono">
            {isRevenue
              ? `$${tree.mrr || 0}`
              : tree.tier === "majestic"
              ? "IV"
              : tree.tier === "mature"
              ? "III"
              : tree.tier === "young"
              ? "II"
              : "I"}
          </span>
        </div>
      </Html>
    </group>
  );
}

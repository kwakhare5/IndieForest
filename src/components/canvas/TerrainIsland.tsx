"use client";

import React, { useMemo } from "react";

interface TerrainIslandProps {
  level?: number;
  drought?: boolean;
}

export function TerrainIsland({ level = 1, drought = false }: TerrainIslandProps) {
  // Island dimensions based on progression level
  const { width, depth, baseThickness, topThickness } = useMemo(() => {
    let w = 8.5;
    let d = 8.0;
    if (level >= 20) {
      w = 13.0;
      d = 12.5;
    } else if (level >= 10) {
      w = 10.5;
      d = 10.0;
    } else if (level < 5) {
      w = 7.5;
      d = 7.0;
    }
    return {
      width: w,
      depth: d,
      baseThickness: 0.45,
      topThickness: 0.25,
    };
  }, [level]);

  // Materials & Colors (Tactile matte porcelain/clay aesthetic)
  const grassEmeraldColor = drought ? "#78716c" : "#22c55e";
  const grassRevenueColor = drought ? "#a8a29e" : "#16a34a";
  const baseFoundationColor = drought ? "#57534e" : "#854d0e";
  const waterColor = drought ? "#64748b" : "#06b6d4";
  const stoneColor = drought ? "#78716c" : "#94a3b8";
  const woodColor = "#78350f";

  // Central riverstone stepping stones
  const steppingStones = useMemo(() => {
    const count = 7;
    const stones = [];
    const startZ = -depth / 2 + 1.2;
    const endZ = depth / 2 - 1.2;
    const step = (endZ - startZ) / (count - 1);

    for (let i = 0; i < count; i++) {
      stones.push({
        x: Math.sin(i * 1.5) * 0.1,
        z: startZ + i * step,
        radius: 0.22 + (i % 3) * 0.04,
        rotY: i * 0.4,
      });
    }
    return stones;
  }, [depth]);

  // Lily pads on the turquoise pond
  const lilyPads = useMemo(
    () => [
      { x: width * 0.28, z: depth * 0.28, rot: 0.5, scale: 0.28 },
      { x: width * 0.35, z: depth * 0.33, rot: 1.8, scale: 0.22 },
      { x: width * 0.24, z: depth * 0.36, rot: 3.2, scale: 0.18 },
    ],
    [width, depth]
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Terracotta Foundation Keel (Solid bottom block with weight) */}
      <mesh position={[0, -baseThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[width, baseThickness, depth]} />
        <meshStandardMaterial
          color={baseFoundationColor}
          roughness={0.8}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* 2. Dual-Grove Top Meadow Slab */}
      {/* West Pasture: Emerald Shipping Pasture (Commits & Code) */}
      <mesh position={[-width / 4, topThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[width / 2 - 0.05, topThickness, depth]} />
        <meshStandardMaterial
          color={grassEmeraldColor}
          roughness={0.6}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* East Pasture: Golden-Loam Revenue Pasture (MRR & Customers) */}
      <mesh position={[width / 4, topThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[width / 2 - 0.05, topThickness, depth]} />
        <meshStandardMaterial
          color={grassRevenueColor}
          roughness={0.55}
          metalness={0.08}
          flatShading
        />
      </mesh>

      {/* 3. Central Riverstone Spine (X = 0 Walkway) */}
      <group position={[0, topThickness + 0.02, 0]}>
        {steppingStones.map((s, idx) => (
          <mesh
            key={idx}
            position={[s.x, 0, s.z]}
            rotation={[-Math.PI / 2, 0, s.rotY]}
            receiveShadow
          >
            <cylinderGeometry args={[s.radius, s.radius * 1.1, 0.04, 7]} />
            <meshStandardMaterial
              color={stoneColor}
              roughness={0.9}
              metalness={0.02}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* 4. South-East Oasis Turquoise Pond Basin */}
      <group position={[width * 0.28, topThickness + 0.01, depth * 0.28]}>
        {/* Recessed Basin Shoreline Border */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.3, 1.4, 0.03, 16]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.8}
            metalness={0.05}
            flatShading
          />
        </mesh>

        {/* Crystal Turquoise Water Plane */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.15, 16]} />
          <meshStandardMaterial
            color={waterColor}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Stepped Wooden Pier Deck */}
        <group position={[-0.85, 0.08, -0.2]} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.9, 0.06, 0.45]} />
            <meshStandardMaterial
              color={woodColor}
              roughness={0.7}
              metalness={0.05}
              flatShading
            />
          </mesh>
          {/* Pier Support Stilts */}
          <mesh position={[0.3, -0.1, 0.15]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
            <meshStandardMaterial color={woodColor} roughness={0.9} />
          </mesh>
          <mesh position={[0.3, -0.1, -0.15]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
            <meshStandardMaterial color={woodColor} roughness={0.9} />
          </mesh>
        </group>

        {/* Floating Lily Pads */}
        {lilyPads.map((pad, idx) => (
          <mesh
            key={idx}
            position={[pad.x - width * 0.28, 0.03, pad.z - depth * 0.28]}
            rotation={[-Math.PI / 2, 0, pad.rot]}
          >
            <circleGeometry args={[pad.scale, 7]} />
            <meshStandardMaterial
              color={drought ? "#78716c" : "#10b981"}
              roughness={0.7}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* 5. Natural Shoreline Border Stones */}
      <group position={[0, topThickness + 0.02, 0]}>
        <mesh position={[-width / 2 + 0.3, 0, -depth / 2 + 0.4]} rotation={[0, 0.8, 0]} castShadow>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[width / 2 - 0.4, 0, -depth / 2 + 0.5]} rotation={[0, 1.4, 0]} castShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-width / 2 + 0.5, 0, depth / 2 - 0.5]} rotation={[0, 2.1, 0]} castShadow>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  );
}

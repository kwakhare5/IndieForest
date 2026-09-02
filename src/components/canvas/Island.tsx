"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { calculateIslandSize, getTreeCellBoundingBox, CELL_SIZE } from "@/lib/gamification";

interface IslandProps {
  level?: number;
  treeCount?: number;
  treeCoords?: Array<{ gridX: number; gridZ: number }>;
  drought?: boolean;
  showGrid?: boolean;
  showBoundaries?: boolean;
}

export function Island({
  level = 1,
  treeCount = 0,
  treeCoords = [],
  drought = false,
  showGrid = false,
  showBoundaries = false,
}: IslandProps) {
  // Rich Sage-Emerald Turf (#5ea774, drought: #8c8479)
  const grassColor = drought ? "#8c8479" : "#5ea774";
  const baseColor = drought ? "#57534e" : "#422517";
  const stoneColor = drought ? "#78716c" : "#64748b";

  // 5-Tier Adaptive 1:1 Symmetrical Square Dimensions
  const size = useMemo(() => {
    return calculateIslandSize(level, treeCount);
  }, [level, treeCount]);

  const baseThickness = 0.5;
  const topThickness = 0.28;

  // Mathematically Aligned Grid Lines strictly matching active tree coordinates
  const alignedGridGeometry = useMemo(() => {
    if (!showGrid || treeCoords.length === 0) return null;

    const points: THREE.Vector3[] = [];
    const y = topThickness + 0.005;

    // Build deduplicated perimeter segments for every active tree tile
    treeCoords.forEach((coord) => {
      const segments = getTreeCellBoundingBox(coord.gridX, coord.gridZ, CELL_SIZE);
      segments.forEach((seg) => {
        points.push(new THREE.Vector3(seg.x1, y, seg.z1));
        points.push(new THREE.Vector3(seg.x2, y, seg.z2));
      });
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [showGrid, treeCoords, topThickness]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Terracotta Earth Foundation Keel (Solid Low-Poly Bedrock) */}
      <mesh position={[0, -baseThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[size - 0.15, baseThickness, size - 0.15]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.9}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* 2. Pure Continuous Sage-Emerald Turf Lawn (Zero Canals, Zero Stone Dividers) */}
      <mesh position={[0, topThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[size, topThickness, size]} />
        <meshStandardMaterial
          color={grassColor}
          roughness={0.7}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* 3. 100% Mathematically Aligned Tile Seams (Only in Grid/Inspect Mode) */}
      {alignedGridGeometry && (
        <lineSegments geometry={alignedGridGeometry}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.65} linewidth={1.5} />
        </lineSegments>
      )}

      {/* 4. Natural Perimeter Corner Riverstones for Organic Diorama Framing */}
      <mesh position={[-size / 2 + 0.55, topThickness + 0.04, -size / 2 + 0.55]}>
        <dodecahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[size / 2 - 0.55, topThickness + 0.04, -size / 2 + 0.55]}>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-size / 2 + 0.55, topThickness + 0.04, size / 2 - 0.55]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[size / 2 - 0.55, topThickness + 0.04, size / 2 - 0.55]}>
        <dodecahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} flatShading />
      </mesh>

      {/* 5. Optional Coordinate Grid (Sandbox Mode) */}
      {showGrid && (
        <group position={[0, topThickness + 0.02, 0]}>
          <gridHelper args={[size, Math.round(size), "#3b82f6", "#93c5fd"]} />
        </group>
      )}

      {/* 6. Optional Boundary Walls (Sandbox Mode) */}
      {showBoundaries && (
        <group position={[0, topThickness + 0.4, 0]}>
          <mesh position={[0, 0, -size / 2]}>
            <boxGeometry args={[size, 0.8, 0.05]} />
            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, size / 2]}>
            <boxGeometry args={[size, 0.8, 0.05]} />
            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}



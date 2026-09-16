"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { calculateIslandSize, getTreeCellBoundingBox, CELL_SIZE } from "@/lib/gamification";
import type { TimeOfDay } from "@/types/game";
import { MountainBackdrop } from "./models/MountainBackdrop";
import { GrassTuft, WildflowerCluster, DecimatedRock } from "./models/VegetationClutter";
import { TabletopTerrain } from "./TabletopTerrain";

export type IslandShape = "diamond" | "crag" | "octagon";
export type IslandPalette = "canonical" | "sunnyside" | "tabletop";

interface IslandProps {
  level?: number;
  treeCount?: number;
  treeCoords?: Array<{ gridX: number; gridZ: number }>;
  drought?: boolean;
  timeOfDay?: TimeOfDay;
  showGrid?: boolean;
  showBoundaries?: boolean;
  islandShape?: IslandShape;
  palette?: IslandPalette;
}

// Minimalist Floating Diorama Island with Stratified Underbelly & Stone Stepping Path
export function Island({
  level = 1,
  treeCount = 0,
  treeCoords = [],
  drought = false,
  timeOfDay = "day",
  showGrid = false,
  showBoundaries: _showBoundaries = false,
  islandShape = "diamond",
  palette = "canonical",
}: IslandProps) {
  const isSunnyside = palette === "sunnyside";
  const isTabletop = palette === "tabletop";

  // Stratified Geological Palette directly calibrated to Reference Image & Specifications
  const grassColor = drought
    ? "#a8a29e"
    : isTabletop
    ? timeOfDay === "night"
      ? "#1e3a1e"
      : timeOfDay === "sunset"
      ? "#84cc16"
      : "#95C558" // Tabletop Vibrant Yellow-Green Terrain Grass
    : isSunnyside
    ? timeOfDay === "night"
      ? "#1b4d3e"
      : timeOfDay === "sunset"
      ? "#84cc16"
      : "#5fc14c" // Vibrant Sunnyside Apple Green (Tiles 65, 66)
    : timeOfDay === "night"
    ? "#0d9488"
    : timeOfDay === "sunset"
    ? "#65a30d"
    : "#4c8c2b"; // Lush Spring Emerald

  const soilColor = drought
    ? "#78716c"
    : isTabletop
    ? timeOfDay === "night"
      ? "#2e1b12"
      : timeOfDay === "sunset"
      ? "#783d1b"
      : "#604030" // Tabletop Underground Earth
    : isSunnyside
    ? timeOfDay === "night"
      ? "#4a3020"
      : timeOfDay === "sunset"
      ? "#c27a4e"
      : "#e4a672" // Warm Sunnyside Apricot Topsoil (Autotile 2246)
    : timeOfDay === "night"
    ? "#261a12"
    : timeOfDay === "sunset"
    ? "#783d1b"
    : "#8a522a"; // Warm Caramel Topsoil Band

  const sedimentColor = drought
    ? "#57534e"
    : isTabletop
    ? timeOfDay === "night"
      ? "#22160e"
      : timeOfDay === "sunset"
      ? "#5c301a"
      : "#4d3222" // Deep Earth Stratum
    : isSunnyside
    ? timeOfDay === "night"
      ? "#38231a"
      : timeOfDay === "sunset"
      ? "#965942"
      : "#c28569" // Warm Terracotta Cliff Stratum (Tile 468)
    : timeOfDay === "night"
    ? "#18130f"
    : timeOfDay === "sunset"
    ? "#2b221a"
    : "#3d3228"; // Dark Geological Rock Stratum

  const bedrockColor = drought
    ? "#44403c"
    : isTabletop
    ? timeOfDay === "night"
      ? "#262f48"
      : timeOfDay === "sunset"
      ? "#434f6b"
      : "#5A6988" // Tabletop Keel Bedrock Slate
    : isSunnyside
    ? timeOfDay === "night"
      ? "#262f48"
      : timeOfDay === "sunset"
      ? "#434f6b"
      : "#5a6988" // Sunnyside Chiseled Slate Keel (Tile 287)
    : timeOfDay === "night"
    ? "#1e293b"
    : timeOfDay === "sunset"
    ? "#3f3f46"
    : "#52525b"; // Chiseled Grey Slate Keel

  const stoneColor = drought
    ? "#78716c"
    : isTabletop
    ? timeOfDay === "night"
      ? "#475569"
      : timeOfDay === "sunset"
      ? "#b08968"
      : "#A0A09B" // Tabletop Warm Light Grey Stone
    : isSunnyside
    ? timeOfDay === "night"
      ? "#3e4b60"
      : timeOfDay === "sunset"
      ? "#6c7a94"
      : "#8b9bb4" // Sunnyside Riverstone Slate Highlight
    : timeOfDay === "night"
    ? "#334155"
    : timeOfDay === "sunset"
    ? "#57534e"
    : "#64748b"; // Clean Slate Riverstone

  const pathColor = isTabletop ? "#D4A86A" : stoneColor; // Tabletop Dirt Path Ribbon (#D4A86A)
  const rootColor = isSunnyside ? "#3a4466" : isTabletop ? "#4a2d18" : "#2d1810";

  const size = useMemo(() => {
    return calculateIslandSize(level, treeCount);
  }, [level, treeCount]);

  // Radius for the perimeter footprint
  const radius = size * 0.62;

  // Geometry configuration based on selected shape prototype (Diamond is canonical default)
  const shapeConfig = useMemo(() => {
    if (islandShape === "diamond") {
      return { segments: 8, rotationY: Math.PI / 8, scaleX: 1.05, scaleZ: 1.05 };
    }
    if (islandShape === "crag") {
      return { segments: 7, rotationY: 0.35, scaleX: 1.15, scaleZ: 0.95 };
    }
    return { segments: 8, rotationY: 0, scaleX: 1.0, scaleZ: 1.0 };
  }, [islandShape]);

  // Mathematically Aligned Grid Lines for inspect mode
  const alignedGridGeometry = useMemo(() => {
    if (!showGrid || treeCoords.length === 0) return null;

    const points: THREE.Vector3[] = [];
    const y = 0.285;

    treeCoords.forEach((coord) => {
      const segments = getTreeCellBoundingBox(coord.gridX, coord.gridZ, CELL_SIZE);
      segments.forEach((seg) => {
        points.push(new THREE.Vector3(seg.x1, y, seg.z1));
        points.push(new THREE.Vector3(seg.x2, y, seg.z2));
      });
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [showGrid, treeCoords]);

  // Dangling tree roots emerging from rock keel into empty space
  const roots = useMemo(() => {
    return [
      { x: -radius * 0.32, z: -radius * 0.22, y: -1.2, length: 1.45, rx: 0.18, rz: -0.22 },
      { x: -radius * 0.18, z: radius * 0.30, y: -1.1, length: 1.65, rx: -0.25, rz: 0.2 },
      { x: radius * 0.26, z: -radius * 0.16, y: -1.15, length: 1.35, rx: 0.2, rz: 0.25 },
      { x: radius * 0.20, z: radius * 0.26, y: -1.25, length: 1.75, rx: -0.18, rz: -0.25 },
      { x: 0, z: -radius * 0.36, y: -1.1, length: 1.25, rx: 0.3, rz: 0.05 },
      { x: -radius * 0.34, z: 0.05, y: -1.15, length: 1.5, rx: 0.1, rz: -0.3 },
      { x: radius * 0.32, z: 0.08, y: -1.2, length: 1.4, rx: -0.12, rz: 0.28 },
      { x: 0.05, z: radius * 0.34, y: -1.3, length: 1.85, rx: -0.28, rz: 0.1 },
    ];
  }, [radius]);

  // Natural Riverstone Stepping-Stone Pathway (Clean, Zen, Connecting Campsite Structures)
  const trailStones = useMemo(() => {
    return [
      // From Tent (West Wing)
      { x: -3.0, z: 1.15, r: 0.26 },
      { x: -2.4, z: 1.05, r: 0.28 },
      { x: -1.8, z: 0.95, r: 0.24 },
      { x: -1.2, z: 0.85, r: 0.27 },
      // Central Meadow Crossing
      { x: -0.6, z: 0.75, r: 0.25 },
      { x: 0.0, z: 0.65, r: 0.29 },
      { x: 0.6, z: 0.50, r: 0.24 },
      // Towards Log Cabin (East Wing)
      { x: 1.3, z: 0.30, r: 0.27 },
      { x: 2.0, z: 0.05, r: 0.25 },
      { x: 2.5, z: -0.25, r: 0.26 },
      // Branch south towards Campfire
      { x: 0.6, z: 1.25, r: 0.25 },
      { x: 1.0, z: 1.80, r: 0.26 },
      { x: 1.4, z: 2.35, r: 0.28 },
      // Leading to Front Clearing Edge
      { x: -0.1, z: 1.4, r: 0.24 },
      { x: -0.05, z: 2.1, r: 0.27 },
      { x: 0.0, z: 2.8, r: 0.25 },
      { x: 0.0, z: 3.5, r: 0.26 },
    ];
  }, []);

  // Natural Perimeter Mountain Rock Outcrops (Corner Boulders Only — Clean & Zen)
  const perimeterBoulders = useMemo(() => {
    return [
      { x: -radius * 0.52, z: -radius * 0.42, s: 0.40, ry: 0.7 },
      { x: radius * 0.52, z: -radius * 0.42, s: 0.42, ry: -0.6 },
      { x: -radius * 0.58, z: radius * 0.20, s: 0.36, ry: 0.3 },
      { x: radius * 0.58, z: radius * 0.22, s: 0.38, ry: -0.4 },
    ];
  }, [radius]);

  if (isTabletop) {
    return (
      <group position={[0, 0, 0]}>
        <TabletopTerrain radius={radius} />
        {alignedGridGeometry && (
          <lineSegments geometry={alignedGridGeometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.65} linewidth={1.5} />
          </lineSegments>
        )}
      </group>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 1. SCULPTED STRATIFIED UNDERBELLY (Isometric Diamond Silhouette)          */}
      {/* ========================================================================= */}
      <group
        scale={[shapeConfig.scaleX, 1.0, shapeConfig.scaleZ]}
        rotation={[0, shapeConfig.rotationY, 0]}
      >
        {/* Layer 1: Top Spring Emerald Turf Plateau with Beveled Drop Rim */}
        <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
          <cylinderGeometry
            args={[radius, radius * 0.98, 0.28, shapeConfig.segments]}
          />
          <meshStandardMaterial
            color={grassColor}
            roughness={isTabletop ? 1.0 : 0.72}
            metalness={isTabletop ? 0.0 : 0.02}
            flatShading
          />
        </mesh>

        {/* Layer 2: Warm Caramel/Terracotta Topsoil Strata Band */}
        <mesh position={[0, -0.14, 0]} receiveShadow castShadow>
          <cylinderGeometry
            args={[radius * 0.98, radius * 0.91, 0.28, shapeConfig.segments]}
          />
          <meshStandardMaterial
            color={soilColor}
            roughness={isTabletop ? 1.0 : 0.92}
            metalness={isTabletop ? 0.0 : 0.02}
            flatShading
          />
        </mesh>

        {/* Layer 3: Dark Umber/Charcoal Rock Sediment Stratum */}
        <mesh position={[0, -0.42, 0]} receiveShadow castShadow>
          <cylinderGeometry
            args={[radius * 0.91, radius * 0.82, 0.28, shapeConfig.segments]}
          />
          <meshStandardMaterial
            color={sedimentColor}
            roughness={isTabletop ? 1.0 : 0.95}
            metalness={isTabletop ? 0.0 : 0.05}
            flatShading
          />
        </mesh>

        {/* Layer 4: Chiseled Multi-Faceted Bedrock Keel (Tapering to Sharp Points) */}
        <group position={[0, -0.98, 0]}>
          <mesh receiveShadow castShadow>
            <cylinderGeometry
              args={[radius * 0.82, radius * 0.42, 0.85, shapeConfig.segments]}
            />
            <meshStandardMaterial
              color={bedrockColor}
              roughness={isTabletop ? 1.0 : 0.92}
              metalness={isTabletop ? 0.0 : 0.08}
              flatShading
            />
          </mesh>

          {/* Primary central crag tip */}
          <mesh position={[0, -0.85, 0]} castShadow>
            <coneGeometry args={[radius * 0.44, 1.15, shapeConfig.segments]} />
            <meshStandardMaterial
              color={bedrockColor}
              roughness={isTabletop ? 1.0 : 0.95}
              metalness={isTabletop ? 0.0 : 0.05}
              flatShading
            />
          </mesh>

          {/* Secondary asymmetric angular crag facets */}
          <mesh position={[radius * 0.12, -0.7, radius * 0.1]} rotation={[-0.15, 0.4, 0.2]} castShadow>
            <coneGeometry args={[radius * 0.22, 0.95, 6]} />
            <meshStandardMaterial color={bedrockColor} roughness={1.0} flatShading />
          </mesh>
          <mesh position={[-radius * 0.1, -0.75, -radius * 0.12]} rotation={[0.2, -0.3, -0.15]} castShadow>
            <coneGeometry args={[radius * 0.26, 1.0, 6]} />
            <meshStandardMaterial color={bedrockColor} roughness={1.0} flatShading />
          </mesh>
        </group>
      </group>

      {/* Layer 5: Gnarled Ancient Tree Roots dangling into open air */}
      {roots.map((root, i) => (
        <group
          key={`root-${i}`}
          position={[root.x, root.y, root.z]}
          rotation={[root.rx, 0, root.rz]}
        >
          <mesh position={[0, -root.length / 2, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.014, root.length, 5]} />
            <meshStandardMaterial color={rootColor} roughness={1.0} flatShading />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 2. GROUND DRESSING: NATURAL RIVERSTONE / DIRT STEPPING PATHWAY             */}
      {/* ========================================================================= */}
      <group position={[0, 0.284, 0]}>
        {trailStones.map((st, idx) => (
          <mesh
            key={`trail-${idx}`}
            position={[st.x, 0, st.z]}
            rotation={[-Math.PI / 2, 0, idx * 0.45]}
            receiveShadow
          >
            <circleGeometry args={[st.r, 7]} />
            <meshStandardMaterial color={pathColor} roughness={1.0} flatShading />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. TABLETOP TERRAIN ELEVATION: RAISED CLEARING PLATEAU                    */}
      {/* ========================================================================= */}
      {isTabletop && (
        <group position={[0.4, 0.28, 0.4]}>
          {/* Terrace Turf */}
          <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[2.8, 2.95, 0.16, 10]} />
            <meshStandardMaterial color={grassColor} roughness={1.0} metalness={0.0} flatShading />
          </mesh>
          {/* Terrace Soil Cliff */}
          <mesh position={[0, -0.04, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[2.95, 3.1, 0.12, 10]} />
            <meshStandardMaterial color={soilColor} roughness={1.0} metalness={0.0} flatShading />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 4. NORTHERN MOUNTAIN BACKDROP RANGE                                       */}
      {/* ========================================================================= */}
      {isTabletop && (
        <MountainBackdrop scale={radius > 5 ? 1.0 : 0.85} />
      )}

      {/* ========================================================================= */}
      {/* 5. FLORA & CLUTTER: GRASS TUFTS, WILDFLOWERS, DECIMATED BOULDERS          */}
      {/* ========================================================================= */}
      {isTabletop ? (
        <group position={[0, 0.28, 0]}>
          {/* Scattered 3-Blade Grass Tufts */}
          <GrassTuft position={[-2.2, 0, -1.8]} scale={0.9} />
          <GrassTuft position={[-3.8, 0, 0.2]} scale={0.8} />
          <GrassTuft position={[3.6, 0, 1.2]} scale={0.9} />
          <GrassTuft position={[1.8, 0, 3.4]} scale={0.85} />
          <GrassTuft position={[-1.6, 0, 2.8]} scale={0.8} />
          <GrassTuft position={[0.2, 0, -3.2]} scale={0.9} />

          {/* Wildflowers */}
          <WildflowerCluster position={[-2.8, 0, -1.2]} />
          <WildflowerCluster position={[3.2, 0, 0.8]} />
          <WildflowerCluster position={[-0.8, 0, 3.2]} />

          {/* Low-Poly Decimated Boulders */}
          <DecimatedRock position={[-4.5, 0, -2.5]} scale={0.9} />
          <DecimatedRock position={[4.2, 0, -2.2]} scale={0.85} />
          <DecimatedRock position={[3.8, 0, 2.6]} scale={0.75} />
          <DecimatedRock position={[-3.6, 0, 2.4]} scale={0.7} />
        </group>
      ) : (
        /* Canonical Corner Boulders */
        perimeterBoulders.map((b, i) => (
          <mesh
            key={`boulder-${i}`}
            position={[b.x, 0.28 + b.s * 0.35, b.z]}
            rotation={[b.s * 2, b.ry, b.s]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[b.s, 0]} />
            <meshStandardMaterial color={stoneColor} roughness={0.92} flatShading />
          </mesh>
        ))
      )}

      {/* ========================================================================= */}
      {/* 6. MATHEMATICALLY ALIGNED GRID SEAMS (Inspect Mode Only)                  */}
      {/* ========================================================================= */}
      {alignedGridGeometry && (
        <lineSegments geometry={alignedGridGeometry}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.65} linewidth={1.5} />
        </lineSegments>
      )}
    </group>
  );
}

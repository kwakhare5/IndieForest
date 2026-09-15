import React, { useMemo } from "react";
import * as THREE from "three";
import {
  TColors,
  PineTree,
  DeciduousTree,
  Rock,
  Mountain,
  Cabin,
  Campfire,
  RiverBridge,
  Farmstead,
  MineComplex,
  PierAndBoat,
} from "./models/TabletopAssets";

export function TabletopTerrain({ radius }: { radius: number }) {
  // We construct the island by layering geometries.
  
  // 1. The Underbelly (Inverted Rock Cone + Dirt Band)
  const segments = 12; // Low poly octagon/dodecagon look

  // 2. The River (A winding path)
  const riverCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-radius * 0.4, 0, -radius * 0.8),
      new THREE.Vector3(0, 0, -radius * 0.2),
      new THREE.Vector3(radius * 0.3, 0, radius * 0.2),
      new THREE.Vector3(radius * 0.7, 0, radius * 0.4),
      new THREE.Vector3(radius * 0.9, 0, radius * 0.7),
    ]);
    return curve;
  }, [radius]);

  return (
    <group>
      {/* --- TERRAIN BASE --- */}
      {/* Bottom Rock Cone */}
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.9, 0.1, 4, segments]} />
        <meshStandardMaterial color={TColors.underbellyRock} flatShading />
      </mesh>
      
      {/* Middle Dirt Band */}
      <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.9, 0.5, segments]} />
        <meshStandardMaterial color={TColors.underbellyDirt} flatShading />
      </mesh>

      {/* Top Dirt Base (The riverbed level) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.1, segments]} />
        <meshStandardMaterial color={TColors.path} flatShading />
      </mesh>

      {/* --- WATER --- */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <tubeGeometry args={[riverCurve, 20, radius * 0.15, 8, false]} />
        <meshStandardMaterial color={TColors.water} flatShading />
      </mesh>
      {/* Lake expansion on the East */}
      <mesh position={[radius * 0.5, 0.06, radius * 0.3]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.35, 12]} />
        <meshStandardMaterial color={TColors.water} flatShading />
      </mesh>

      {/* --- GREEN PLATEAUS --- */}
      {/* Left/North-West Plateau (Forest, Mine, Cabin) */}
      <mesh position={[-radius * 0.25, 0.2, -radius * 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.65, radius * 0.68, 0.3, 10]} />
        <meshStandardMaterial color={TColors.grass} flatShading />
      </mesh>
      
      {/* Right/East Plateau (Farmstead) */}
      <mesh position={[radius * 0.5, 0.2, -radius * 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.4, radius * 0.42, 0.3, 8]} />
        <meshStandardMaterial color={TColors.grass} flatShading />
      </mesh>

      {/* South Plateau (Forest Edge) */}
      <mesh position={[-radius * 0.1, 0.2, radius * 0.6]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.5, radius * 0.52, 0.3, 8]} />
        <meshStandardMaterial color={TColors.grass} flatShading />
      </mesh>


      {/* --- HANGING ROOTS --- */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = radius * 0.8;
        return (
          <group key={`root-${i}`} position={[Math.cos(angle) * r, -0.5, Math.sin(angle) * r]} rotation={[0.2, angle, 0.1]}>
            <mesh position={[0, -1.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.01, 3, 4]} />
              <meshStandardMaterial color={TColors.woodDark} flatShading />
            </mesh>
          </group>
        );
      })}

      {/* --- LANDMARKS --- */}
      
      {/* Central Cabin */}
      <Cabin position={[-radius * 0.1, 0.35, -radius * 0.1]} scale={1.2} rotation={[0, Math.PI / 6, 0]} />
      <Campfire position={[-radius * 0.05, 0.35, radius * 0.05]} scale={1.2} />

      {/* Mine Complex */}
      <MineComplex position={[-radius * 0.5, 0.35, -radius * 0.5]} scale={1.5} rotation={[0, Math.PI / 4, 0]} />
      
      {/* Mountains behind the Mine */}
      <Mountain position={[-radius * 0.6, 0.35, -radius * 0.8]} scale={1.5} />
      <Mountain position={[-radius * 0.3, 0.35, -radius * 0.9]} scale={1.8} />
      <Mountain position={[0, 0.35, -radius * 0.9]} scale={1.4} />

      {/* Farmstead */}
      <Farmstead position={[radius * 0.6, 0.35, -radius * 0.5]} scale={1.2} rotation={[0, -Math.PI / 6, 0]} />

      {/* Bridge over River */}
      <RiverBridge position={[radius * 0.15, 0.05, -radius * 0.1]} rotation={[0, -Math.PI / 4, 0]} scale={1.2} />

      {/* Pier & Boat in Lake */}
      <PierAndBoat position={[radius * 0.6, 0.05, radius * 0.1]} rotation={[0, Math.PI / 2, 0]} scale={1.2} />
      
      {/* Decorative Rocks */}
      <Rock position={[-radius * 0.7, 0.4, -radius * 0.3]} scale={1.5} />
      <Rock position={[-radius * 0.4, 0.4, -radius * 0.7]} scale={2.0} />
      <Rock position={[radius * 0.3, 0.4, -radius * 0.8]} scale={1.2} />
      <Rock position={[radius * 0.4, 0.1, radius * 0.6]} scale={1.0} />
      <Rock position={[-radius * 0.2, 0.1, radius * 0.8]} scale={0.8} />

    </group>
  );
}

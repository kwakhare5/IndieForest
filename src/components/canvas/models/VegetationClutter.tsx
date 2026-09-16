"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

// 1. Single Low-Poly Grass Tuft (3-4 Scaled Triangle Blades)
export function GrassTuft({
  position = [0, 0, 0],
  scale = 1.0,
  rotationY = 0,
}: {
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
}) {
  const bladeGeometry = useMemo(() => {
    // Slender triangular blade
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.03, 0, 0,
      0.03, 0, 0,
      0, 0.28, 0,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* Blade 1 */}
      <mesh geometry={bladeGeometry} rotation={[0.15, 0, 0.12]}>
        <meshStandardMaterial color="#95C558" roughness={1.0} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* Blade 2 */}
      <mesh geometry={bladeGeometry} rotation={[-0.18, 1.2, -0.15]}>
        <meshStandardMaterial color="#7DAE40" roughness={1.0} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* Blade 3 */}
      <mesh geometry={bladeGeometry} rotation={[0.1, -1.4, 0.2]}>
        <meshStandardMaterial color="#A3D464" roughness={1.0} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* Blade 4 */}
      <mesh geometry={bladeGeometry} rotation={[-0.12, 2.4, 0.08]}>
        <meshStandardMaterial color="#95C558" roughness={1.0} side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  );
}

// 2. Wildflower Cluster (Tiny Icospheres on Stems)
export function WildflowerCluster({
  position = [0, 0, 0],
  scale = 1.0,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const flowers = [
    { x: -0.06, z: 0.04, y: 0.18, color: "#F87171" }, // Red/Coral
    { x: 0.08, z: -0.05, y: 0.22, color: "#FACC15" }, // Yellow
    { x: 0.02, z: 0.08, y: 0.16, color: "#FFFFFF" }, // White Daisy
    { x: -0.09, z: -0.06, y: 0.14, color: "#818CF8" }, // Lavender
  ];

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {flowers.map((fl, idx) => (
        <group key={`flower-${idx}`} position={[fl.x, 0, fl.z]}>
          {/* Green Stem */}
          <mesh position={[0, fl.y / 2, 0]}>
            <cylinderGeometry args={[0.008, 0.012, fl.y, 4]} />
            <meshStandardMaterial color="#7DAE40" roughness={1.0} flatShading />
          </mesh>
          {/* Petal Icosphere */}
          <mesh position={[0, fl.y, 0]}>
            <icosahedronGeometry args={[0.038, 0]} />
            <meshStandardMaterial color={fl.color} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3. Decimated Sunken Boulder (Irregular Low-Poly Icosphere)
export function DecimatedRock({
  position = [0, 0, 0],
  scale = 1.0,
  rotation = [0, 0, 0],
  color = "#A0A09B",
}: {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={[scale, scale * 0.75, scale]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={1.0} metalness={0.0} flatShading={true} />
    </mesh>
  );
}

"use client";

import React from "react";
import * as THREE from "three";

interface ZenStumpProps {
  drought?: boolean;
  wireframe?: boolean;
}

export function ZenStump({ drought = false, wireframe = false }: ZenStumpProps) {
  const trunkColor = drought ? "#57534e" : "#78350f";

  return (
    <group>
      {/* 1. Weathered Cedar Trunk with Root Flare */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.32, 7]} />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.9}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Sliced Face Annual Growth Rings */}
      <mesh position={[0, 0.321, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.21, 16]} />
        <meshStandardMaterial
          color="#d6d3d1"
          roughness={0.7}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.322, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.11, 0.14, 16]} />
        <meshBasicMaterial color="#a8a29e" />
      </mesh>

      {/* 3. Fresh Bright Green Clover Sprout */}
      <group position={[0.05, 0.33, 0.04]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.008, 0.01, 0.08, 4]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh position={[-0.025, 0.08, 0]} rotation={[0, 0, 0.5]}>
          <circleGeometry args={[0.03, 5]} />
          <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.025, 0.08, 0]} rotation={[0, 0, -0.5]}>
          <circleGeometry args={[0.03, 5]} />
          <meshStandardMaterial color="#4ade80" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 4. Balanced 3-Stone Zen Cairn */}
      <group position={[-0.36, 0, 0.12]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <dodecahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.9}
            flatShading
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <dodecahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.9}
            flatShading
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.155, 0]} castShadow>
          <dodecahedronGeometry args={[0.038, 0]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.8}
            flatShading
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

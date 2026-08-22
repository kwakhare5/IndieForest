"use client";

import React from "react";
import * as THREE from "three";

interface FlagpoleProps {
  drought?: boolean;
  wireframe?: boolean;
}

export function Flagpole({ drought = false, wireframe = false }: FlagpoleProps) {
  return (
    <group>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.16, 8]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.9}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* Metal Mast Pole */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 1.8, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.8}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Emerald Startup Flag */}
      <mesh position={[0.22, 1.55, 0]}>
        <planeGeometry args={[0.42, 0.26]} />
        <meshStandardMaterial
          color={drought ? "#78716c" : "#10b981"}
          side={THREE.DoubleSide}
          roughness={0.5}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HarborPierProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function HarborPier({
  isNight = false,
  drought = false,
  wireframe = false,
}: HarborPierProps) {
  const boatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boatRef.current) {
      boatRef.current.position.y = 0.08 + Math.sin(state.clock.elapsedTime * 2.5) * 0.02;
      boatRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.0) * 0.03;
    }
  });

  const plankColor = drought ? "#57534e" : "#854d0e";
  const postColor = drought ? "#44403c" : "#713f12";
  const boatHullColor = drought ? "#78716c" : isNight ? "#0369a1" : "#0284c7";
  const boatTrimColor = drought ? "#57534e" : "#f8fafc";

  return (
    <group>
      {/* 1. Wooden Dock Decking */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 0.08, 2.2]} />
        <meshStandardMaterial
          color={plankColor}
          roughness={0.85}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Dock Piling Posts */}
      {[-0.55, 0.55].map((x, i) =>
        [-0.9, 0, 0.9].map((z, j) => (
          <mesh key={`post-${i}-${j}`} position={[x, -0.15, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
            <meshStandardMaterial color={postColor} roughness={0.9} flatShading />
          </mesh>
        ))
      )}

      {/* 3. Mooring Bollards */}
      <mesh position={[-0.45, 0.22, 0.85]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.6} />
      </mesh>
      <mesh position={[0.45, 0.22, 0.85]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.6} />
      </mesh>

      {/* 4. Moored Wooden Cargo Dinghy Boat */}
      <group ref={boatRef} position={[1.1, 0.08, 0.4]} rotation={[0, -0.15, 0]}>
        {/* Hull */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.24, 1.4]} />
          <meshStandardMaterial color={boatHullColor} roughness={0.7} flatShading />
        </mesh>
        {/* Bow Wedge */}
        <mesh position={[0, 0.02, 0.85]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.35, 0.45, 4]} />
          <meshStandardMaterial color={boatTrimColor} roughness={0.7} flatShading />
        </mesh>
        {/* Interior Bench */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.62, 0.04, 0.2]} />
          <meshStandardMaterial color={plankColor} roughness={0.8} />
        </mesh>
        {/* Cargo Crate */}
        <mesh position={[0, 0.16, -0.3]}>
          <boxGeometry args={[0.28, 0.22, 0.28]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

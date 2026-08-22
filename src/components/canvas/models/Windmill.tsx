"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WindmillProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function Windmill({
  isNight = false,
  drought = false,
  wireframe = false,
}: WindmillProps) {
  const sailsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (sailsRef.current && !drought) {
      sailsRef.current.rotation.z += delta * 0.85;
    }
  });

  const stoneColor = drought ? "#6b645c" : "#78716c";
  const woodColor = drought ? "#57534e" : "#854d0e";
  const sailColor = drought ? "#a8a29e" : "#f5f5f4";
  const roofColor = drought ? "#44403c" : "#991b1b";

  return (
    <group>
      {/* 1. Octagonal Tapered Stone Base Tower */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.85, 2.0, 8]} />
        <meshStandardMaterial
          color={stoneColor}
          roughness={0.85}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Timber Trim Band & Balcony */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.08, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} flatShading />
      </mesh>

      {/* 3. Conical Thatched Timber Roof */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <coneGeometry args={[0.68, 0.75, 8]} />
        <meshStandardMaterial
          color={roofColor}
          roughness={0.7}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 4. Little Glowing Attic Window */}
      <mesh position={[0, 1.35, 0.58]}>
        <boxGeometry args={[0.22, 0.28, 0.06]} />
        <meshStandardMaterial
          color={isNight ? "#fbbf24" : "#451a03"}
          emissive={isNight ? "#f59e0b" : "#000000"}
          emissiveIntensity={isNight ? 0.8 : 0}
        />
      </mesh>

      {/* 5. Rotor Hub & 4 Rotating Timber Canvas Sails */}
      <group position={[0, 1.95, 0.62]}>
        {/* Axle Pin */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.22, 8]} />
          <meshStandardMaterial color={woodColor} roughness={0.6} />
        </mesh>

        {/* 4 Spinning Sails */}
        <group ref={sailsRef}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <group key={`sail-${idx}`} rotation={[0, 0, angle]}>
              {/* Spar Arm */}
              <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[0.04, 1.7, 0.03]} />
                <meshStandardMaterial color={woodColor} roughness={0.7} />
              </mesh>
              {/* Canvas Cloth Blade */}
              <mesh position={[0.16, 0.95, 0.01]}>
                <boxGeometry args={[0.28, 1.2, 0.01]} />
                <meshStandardMaterial
                  color={sailColor}
                  roughness={0.9}
                  side={THREE.DoubleSide}
                  flatShading
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LighthouseProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function Lighthouse({
  isNight = false,
  drought = false,
  wireframe = false,
}: LighthouseProps) {
  const lightBeamRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (lightBeamRef.current && isNight) {
      lightBeamRef.current.rotation.y += delta * 1.2;
    }
  });

  const towerWhite = drought ? "#78716c" : "#f8fafc";
  const towerRed = drought ? "#57534e" : "#b91c1c";
  const lanternMetal = drought ? "#44403c" : "#1e293b";

  return (
    <group>
      {/* 1. Stone Foundation Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.95, 0.5, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>

      {/* 2. Striped Conical Lighthouse Tower */}
      {/* Lower White Section */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.78, 0.8, 8]} />
        <meshStandardMaterial
          color={towerWhite}
          roughness={0.8}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
      {/* Middle Crimson Stripe */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.6, 8]} />
        <meshStandardMaterial
          color={towerRed}
          roughness={0.8}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
      {/* Upper White Section */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.55, 0.5, 8]} />
        <meshStandardMaterial
          color={towerWhite}
          roughness={0.8}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Observation Gallery Balcony */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 8]} />
        <meshStandardMaterial color={lanternMetal} roughness={0.7} flatShading />
      </mesh>

      {/* 4. Lantern Room Glass Enclosure */}
      <mesh position={[0, 2.75, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.52, 8]} />
        <meshStandardMaterial
          color={isNight ? "#fef08a" : "#93c5fd"}
          transparent
          opacity={isNight ? 0.9 : 0.6}
          emissive={isNight ? "#f59e0b" : "#000000"}
          emissiveIntensity={isNight ? 1.0 : 0}
        />
      </mesh>

      {/* 5. Copper Dome Roof & Spire */}
      <mesh position={[0, 3.15, 0]} castShadow>
        <coneGeometry args={[0.48, 0.45, 8]} />
        <meshStandardMaterial color="#0f766e" roughness={0.6} flatShading />
      </mesh>

      {/* 6. Rotating Light Beam (Active at Night) */}
      {isNight && (
        <group ref={lightBeamRef} position={[0, 2.75, 0]}>
          <mesh position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.9, 4.2, 8, 1, true]} />
            <meshBasicMaterial
              color="#fef08a"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

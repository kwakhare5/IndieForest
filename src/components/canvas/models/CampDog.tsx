"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sound } from "@/lib/sound";

interface CampDogProps {
  wireframe?: boolean;
  interactive?: boolean;
}

export function CampDog({
  wireframe = false,
  interactive = true,
}: CampDogProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const [isExcited, setIsExcited] = useState(false);

  const handleClick = (e: { stopPropagation: () => void }) => {
    if (!interactive) return;
    e.stopPropagation();
    sound.playClick();
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 900);
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Tail wagging animation (Faster and wider when excited)
    if (tailRef.current) {
      const wagSpeed = isExcited ? 16 : 5.5;
      const wagAmp = isExcited ? 0.5 : 0.28;
      tailRef.current.rotation.y = Math.sin(t * wagSpeed) * wagAmp;
      tailRef.current.rotation.z = Math.cos(t * wagSpeed) * 0.1;
    }

    // Curious head motion
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.6) * 0.1;
      headRef.current.rotation.x = isExcited ? -0.18 : Math.sin(t * 1.0) * 0.05;
      headRef.current.rotation.z = Math.cos(t * 1.2) * 0.04;
    }

    // Subtle breathing weight shift on the torso
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.24 + Math.sin(t * 2.4) * 0.01;
    }

    // Playful jump on click
    if (groupRef.current) {
      if (isExcited) {
        groupRef.current.position.y = Math.abs(Math.sin(t * 12)) * 0.18;
      } else {
        groupRef.current.position.y = 0;
      }
    }
  });

  const coatColor = "#f59e0b"; // Warm golden amber coat
  const creamColor = "#fef3c7"; // Warm cream muzzle, belly & paws
  const darkColor = "#1c1917"; // Espresso nose & eyes
  const collarColor = "#dc2626"; // Crimson leather collar
  const medalColor = "#fbbf24"; // Golden medal

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* 1. Torso Body with Breathing Motion */}
      <group ref={bodyRef}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.22, 0.46]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>

        {/* Cream Belly Undercoat */}
        <mesh position={[0, -0.06, 0.02]}>
          <boxGeometry args={[0.2, 0.12, 0.38]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Fluffy Front Chest Bib */}
        <mesh position={[0, 0.02, 0.24]}>
          <boxGeometry args={[0.18, 0.18, 0.04]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Crimson Leather Collar & Gold Tag */}
        <mesh position={[0, 0.1, 0.22]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.06]} />
          <meshStandardMaterial color={collarColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.07, 0.26]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 6]} />
          <meshStandardMaterial color={medalColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* 2. Four Geometric Standing Legs & Paws */}
      {/* Front Left */}
      <mesh position={[-0.09, 0.1, 0.15]} castShadow>
        <boxGeometry args={[0.065, 0.2, 0.07]} />
        <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
      </mesh>
      {/* Front Right */}
      <mesh position={[0.09, 0.1, 0.15]} castShadow>
        <boxGeometry args={[0.065, 0.2, 0.07]} />
        <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
      </mesh>
      {/* Rear Left */}
      <mesh position={[-0.09, 0.1, -0.15]} castShadow>
        <boxGeometry args={[0.07, 0.2, 0.075]} />
        <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
      </mesh>
      {/* Rear Right */}
      <mesh position={[0.09, 0.1, -0.15]} castShadow>
        <boxGeometry args={[0.07, 0.2, 0.075]} />
        <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
      </mesh>

      {/* 3. Expressive Head with Ears & Snout */}
      <group ref={headRef} position={[0, 0.42, 0.24]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.2, 0.22]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>

        {/* Cream Muzzle */}
        <mesh position={[0, -0.03, 0.13]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={creamColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>

        {/* Dark Nose */}
        <mesh position={[0, 0.01, 0.2]}>
          <boxGeometry args={[0.04, 0.035, 0.03]} />
          <meshStandardMaterial color={darkColor} roughness={0.4} />
        </mesh>

        {/* Dark Eyes */}
        <mesh position={[-0.065, 0.03, 0.115]}>
          <boxGeometry args={[0.025, 0.03, 0.02]} />
          <meshBasicMaterial color={darkColor} />
        </mesh>
        <mesh position={[0.065, 0.03, 0.115]}>
          <boxGeometry args={[0.025, 0.03, 0.02]} />
          <meshBasicMaterial color={darkColor} />
        </mesh>

        {/* Triangular Golden Ears */}
        <mesh position={[-0.09, 0.13, -0.02]} rotation={[0.2, -0.2, 0.3]} castShadow>
          <coneGeometry args={[0.055, 0.11, 4]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0.09, 0.13, -0.02]} rotation={[0.2, 0.2, -0.3]} castShadow>
          <coneGeometry args={[0.055, 0.11, 4]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. Playful Arched Wagging Tail */}
      <group ref={tailRef} position={[0, 0.32, -0.22]}>
        <mesh position={[0, 0.11, -0.08]} rotation={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.065, 0.18, 0.065]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.18, -0.04]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.055, 0.08, 0.055]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

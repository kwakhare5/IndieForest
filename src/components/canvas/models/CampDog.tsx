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
  const jumpGroupRef = useRef<THREE.Group>(null);
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

    // Playful jump on click (moves internal jumpGroup, not the collision hitbox)
    if (jumpGroupRef.current) {
      if (isExcited) {
        jumpGroupRef.current.position.y = Math.abs(Math.sin(t * 12)) * 0.18;
      } else {
        jumpGroupRef.current.position.y = 0;
      }
    }
  });

  const coatColor = "#f59e0b"; // Warm golden amber coat
  const creamColor = "#fef3c7"; // Warm cream muzzle, belly & paws
  const darkColor = "#1c1917"; // Espresso nose & eyes
  const collarColor = "#dc2626"; // Crimson leather collar
  const medalColor = "#fbbf24"; // Golden medal

  return (
    <group>
      {/* 1. True Transparent Stationary Collision Hitbox */}
      {interactive && (
        <mesh
          position={[0, 0.26, 0]}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[0.5, 0.6, 0.75]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* 2. Visual Animated Mesh Group */}
      <group ref={jumpGroupRef}>
        {/* Torso Body with Breathing Motion */}
        <group ref={bodyRef}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.22, 0.46]} />
            <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>

          {/* Cream Belly Undercoat */}
          <mesh position={[0, -0.06, 0.02]}>
            <boxGeometry args={[0.2, 0.1, 0.36]} />
            <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>
        </group>

        {/* 4 Standing Legs with Cream Paws */}
        {/* Front Left */}
        <mesh position={[-0.1, 0.08, 0.16]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.1, 0.015, 0.17]}>
          <boxGeometry args={[0.082, 0.03, 0.09]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Front Right */}
        <mesh position={[0.1, 0.08, 0.16]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0.1, 0.015, 0.17]}>
          <boxGeometry args={[0.082, 0.03, 0.09]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Back Left */}
        <mesh position={[-0.1, 0.08, -0.16]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.1, 0.015, -0.15]}>
          <boxGeometry args={[0.082, 0.03, 0.09]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Back Right */}
        <mesh position={[0.1, 0.08, -0.16]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0.1, 0.015, -0.15]}>
          <boxGeometry args={[0.082, 0.03, 0.09]} />
          <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
        </mesh>

        {/* Head & Neck Assembly */}
        <group position={[0, 0.36, 0.24]} ref={headRef}>
          {/* Head Skull */}
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.2, 0.22]} />
            <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>

          {/* Cream Snout / Muzzle */}
          <mesh position={[0, -0.04, 0.13]}>
            <boxGeometry args={[0.14, 0.1, 0.12]} />
            <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>

          {/* Espresso Nose */}
          <mesh position={[0, 0.0, 0.195]}>
            <boxGeometry args={[0.06, 0.04, 0.03]} />
            <meshStandardMaterial color={darkColor} roughness={0.5} flatShading />
          </mesh>

          {/* Left Eye */}
          <mesh position={[-0.07, 0.03, 0.115]}>
            <boxGeometry args={[0.03, 0.03, 0.02]} />
            <meshStandardMaterial color={darkColor} roughness={0.2} />
          </mesh>

          {/* Right Eye */}
          <mesh position={[0.07, 0.03, 0.115]}>
            <boxGeometry args={[0.03, 0.03, 0.02]} />
            <meshStandardMaterial color={darkColor} roughness={0.2} />
          </mesh>

          {/* Perky Shiba Ears */}
          {/* Left Ear */}
          <mesh position={[-0.08, 0.13, -0.02]} rotation={[-0.1, 0, 0.2]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[-0.08, 0.12, -0.01]} rotation={[-0.1, 0, 0.2]}>
            <coneGeometry args={[0.03, 0.07, 4]} />
            <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>

          {/* Right Ear */}
          <mesh position={[0.08, 0.13, -0.02]} rotation={[-0.1, 0, -0.2]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.08, 0.12, -0.01]} rotation={[-0.1, 0, -0.2]}>
            <coneGeometry args={[0.03, 0.07, 4]} />
            <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>

          {/* Crimson Leather Collar */}
          <mesh position={[0, -0.11, -0.04]}>
            <boxGeometry args={[0.225, 0.04, 0.225]} />
            <meshStandardMaterial color={collarColor} roughness={0.5} />
          </mesh>

          {/* Gold Founder Medal */}
          <mesh position={[0, -0.14, 0.08]}>
            <cylinderGeometry args={[0.03, 0.03, 0.01, 8]} />
            <meshStandardMaterial color={medalColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Dynamic Arched Bushy Tail */}
        <group position={[0, 0.3, -0.24]} ref={tailRef}>
          {/* Base */}
          <mesh position={[0, 0.06, -0.05]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.08, 0.14, 0.08]} />
            <meshStandardMaterial color={coatColor} roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>
          {/* Arched Tip */}
          <mesh position={[0, 0.16, -0.02]} rotation={[1.1, 0, 0]}>
            <boxGeometry args={[0.07, 0.1, 0.07]} />
            <meshStandardMaterial color={creamColor} roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

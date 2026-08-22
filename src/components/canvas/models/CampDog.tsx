"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CampDogProps {
  wireframe?: boolean;
}

export function CampDog({ wireframe = false }: CampDogProps) {
  const breathRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (breathRef.current) {
      breathRef.current.scale.y = 1 + Math.sin(t * 2.2) * 0.07;
      breathRef.current.scale.x = 1 + Math.cos(t * 2.2) * 0.03;
    }
  });

  return (
    <group>
      {/* 1. Woven Red & Cream Camp Blanket */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.55, 16]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.44, 16]} />
        <meshBasicMaterial color="#fef3c7" />
      </mesh>

      {/* 2. Curled Sleeping Shiba Inu Puppy with Breathing Physics */}
      <group position={[0, 0.04, 0]} scale={1.1}>
        <group ref={breathRef}>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.14, 8]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.02, 0.1, 0.08]} rotation={[0, 0.2, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.16, 0.12, 0.1]} rotation={[0.2, 0.4, 0.1]} castShadow>
            <boxGeometry args={[0.15, 0.13, 0.15]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.24, 0.09, 0.13]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.7} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.28, 0.11, 0.14]}>
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshBasicMaterial color="#1c1917" />
          </mesh>
          <mesh position={[0.14, 0.2, 0.06]} rotation={[-0.3, 0.2, 0]}>
            <coneGeometry args={[0.035, 0.07, 3]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} wireframe={wireframe} />
          </mesh>
          <mesh position={[0.18, 0.2, 0.16]} rotation={[0.3, 0.2, 0]}>
            <coneGeometry args={[0.035, 0.07, 3]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} wireframe={wireframe} />
          </mesh>
          <mesh position={[-0.14, 0.12, -0.05]} rotation={[0.6, 0.8, 0.4]}>
            <cylinderGeometry args={[0.04, 0.055, 0.22, 6]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.8} flatShading wireframe={wireframe} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

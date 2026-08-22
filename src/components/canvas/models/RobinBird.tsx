"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RobinBirdProps {
  wireframe?: boolean;
}

export function RobinBird({ wireframe = false }: RobinBirdProps) {
  const birdRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (headRef.current) {
      const step = Math.floor(t * 0.8) % 4;
      const targetYaw = step === 0 ? 0 : step === 1 ? 0.45 : step === 2 ? -0.35 : 0.15;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetYaw, 0.2);
    }
    if (birdRef.current) {
      birdRef.current.position.y = 0.28 + (Math.sin(t * 3) > 0.85 ? 0.04 : 0);
    }
  });

  return (
    <group>
      {/* Wooden Perch Post */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.24, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} wireframe={wireframe} />
      </mesh>

      {/* European Robin Bird */}
      <group ref={birdRef} position={[0, 0.28, 0]} scale={1.4}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.1, 7, 7]} />
          <meshStandardMaterial color="#475569" roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.045, 0.075, 0]} castShadow>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.02, 0.08, 0.09]} rotation={[0.2, 0.1, -0.2]}>
          <boxGeometry args={[0.12, 0.06, 0.03]} />
          <meshStandardMaterial color="#334155" roughness={0.8} wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.02, 0.08, -0.09]} rotation={[-0.2, -0.1, -0.2]}>
          <boxGeometry args={[0.12, 0.06, 0.03]} />
          <meshStandardMaterial color="#334155" roughness={0.8} wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.12, 0.13, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.12, 0.025, 0.06]} />
          <meshStandardMaterial color="#334155" roughness={0.8} wireframe={wireframe} />
        </mesh>

        <group ref={headRef} position={[0.07, 0.15, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.065, 6, 6]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.04, 0.02, 0.04]}>
            <sphereGeometry args={[0.012, 4, 4]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.04, 0.02, -0.04]}>
            <sphereGeometry args={[0.012, 4, 4]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.075, 0.005, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.02, 0.05, 4]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} wireframe={wireframe} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

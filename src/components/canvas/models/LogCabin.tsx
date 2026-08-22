"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LogCabinProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function LogCabin({
  isNight = false,
  drought = false,
  wireframe = false,
}: LogCabinProps) {
  const smokeRef = useRef<THREE.Group>(null);
  const cabinWood = drought ? "#57534e" : "#78350f";
  const trimWood = drought ? "#44403c" : "#92400e";

  useFrame((state) => {
    if (smokeRef.current && !drought) {
      smokeRef.current.position.y = 1.6 + (state.clock.elapsedTime * 0.2) % 0.3;
      smokeRef.current.scale.setScalar(1 + ((state.clock.elapsedTime * 0.3) % 0.4));
    }
  });

  return (
    <group>
      {/* 1. Interlocking Notched Round Cedar Wall Logs */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.95, 1.15]} />
        <meshStandardMaterial
          color={cabinWood}
          roughness={0.85}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Front Porch Timber Columns & Overhang */}
      <mesh position={[-0.45, 0.35, 0.68]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
        <meshStandardMaterial color={trimWood} roughness={0.8} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.45, 0.35, 0.68]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
        <meshStandardMaterial color={trimWood} roughness={0.8} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.74, 0.68]} castShadow>
        <boxGeometry args={[1.05, 0.05, 0.25]} />
        <meshStandardMaterial color={cabinWood} roughness={0.8} wireframe={wireframe} />
      </mesh>

      {/* 3. Pitched Cedar Shake Roof */}
      <mesh position={[0, 1.18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.2, 0.68, 4]} />
        <meshStandardMaterial
          color={trimWood}
          roughness={0.7}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 4. Twin Multipane Glowing Amber Windows with Wooden Shutters */}
      <group position={[0.35, 0.55, 0.59]}>
        <mesh>
          <planeGeometry args={[0.28, 0.28]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={drought ? "#000000" : "#facc15"}
            emissiveIntensity={drought ? 0 : isNight ? 2.4 : 0.9}
            wireframe={wireframe}
          />
        </mesh>
        {/* Window Cross Grids */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.02, 0.28]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.28, 0.02]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>
        {/* Shutters */}
        <mesh position={[-0.17, 0, 0.005]}>
          <boxGeometry args={[0.06, 0.28, 0.02]} />
          <meshStandardMaterial color="#451a03" wireframe={wireframe} />
        </mesh>
        <mesh position={[0.17, 0, 0.005]}>
          <boxGeometry args={[0.06, 0.28, 0.02]} />
          <meshStandardMaterial color="#451a03" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. Rustic Plank Door with Iron Handle */}
      <mesh position={[-0.25, 0.38, 0.59]}>
        <planeGeometry args={[0.3, 0.68]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} wireframe={wireframe} />
      </mesh>

      {/* 6. Fieldstone Chimney Masonry & Smoke Wisps */}
      <mesh position={[0.38, 1.28, -0.22]} castShadow>
        <boxGeometry args={[0.22, 0.5, 0.22]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.95}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
      {!drought && (
        <group ref={smokeRef} position={[0.38, 1.6, -0.22]}>
          <mesh>
            <sphereGeometry args={[0.05, 5, 5]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.02, 0.08, 0]}>
            <sphereGeometry args={[0.065, 5, 5]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

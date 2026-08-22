"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CampfireProps {
  isNight?: boolean;
  isSunset?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function Campfire({
  isNight = false,
  isSunset = false,
  drought = false,
  wireframe = false,
}: CampfireProps) {
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameCoreRef = useRef<THREE.Mesh>(null);
  const emberRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fireLightRef.current && !drought) {
      const baseIntensity = isNight ? 2.6 : isSunset ? 1.9 : 1.3;
      fireLightRef.current.intensity =
        baseIntensity + Math.sin(t * 12) * 0.4 + Math.cos(t * 19) * 0.2;
    }
    if (flameCoreRef.current && !drought) {
      flameCoreRef.current.scale.y = 1 + Math.sin(t * 14) * 0.15;
      flameCoreRef.current.rotation.y = t * 2;
    }
    if (emberRef.current && !drought) {
      emberRef.current.emissiveIntensity = 1.3 + Math.sin(t * 6) * 0.3;
    }
  });

  return (
    <group>
      {/* 1. Surrounding 8-Stone Fieldstone Ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.46, 0.06, Math.sin(angle) * 0.46]}
            castShadow
          >
            <dodecahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={0.9}
              flatShading
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 2. Glowing Red/Amber Charcoal Ember Bed */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.38, 0.4, 0.04, 12]} />
        <meshStandardMaterial
          ref={emberRef}
          color={drought ? "#292524" : "#451a03"}
          emissive={drought ? "#000000" : "#dc2626"}
          emissiveIntensity={drought ? 0 : 1.3}
          roughness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. 4 Crossed Charred Cedar Fire Logs */}
      {[0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.09, 0.08, Math.sin(angle) * 0.09]}
          rotation={[0.25, angle, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.055, 0.52, 6]} />
          <meshStandardMaterial
            color={drought ? "#44403c" : "#78350f"}
            roughness={0.9}
            flatShading
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 4. Multi-Facet Pulsing Flame Core */}
      {!drought && (
        <>
          <mesh ref={flameCoreRef} position={[0, 0.24, 0]}>
            <coneGeometry args={[0.18, 0.45, 6]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={isNight ? 2.5 : 1.5}
              roughness={0.2}
              flatShading
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.1, 0.3, 5]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#facc15"
              emissiveIntensity={2.8}
              wireframe={wireframe}
            />
          </mesh>

          <pointLight
            ref={fireLightRef}
            position={[0, 0.38, 0]}
            color="#f97316"
            intensity={isNight ? 2.6 : 1.3}
            distance={4.5}
            decay={2}
          />
        </>
      )}
    </group>
  );
}

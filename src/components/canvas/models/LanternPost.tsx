"use client";

import React from "react";

interface LanternPostProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function LanternPost({
  isNight = false,
  drought = false,
  wireframe = false,
}: LanternPostProps) {
  return (
    <group>
      {/* Cedar Wood Post */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.9, 6]} />
        <meshStandardMaterial
          color={drought ? "#57534e" : "#78350f"}
          roughness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* Amber Glowing Crystal Lantern Core */}
      <mesh position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive={drought ? "#000000" : isNight ? "#facc15" : "#ca8a04"}
          emissiveIntensity={drought ? 0 : isNight ? 2.2 : 0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Dynamic Night Illumination */}
      {isNight && !drought && (
        <pointLight
          position={[0, 0.9, 0]}
          color="#fde047"
          intensity={1.5}
          distance={3.5}
          decay={2}
        />
      )}
    </group>
  );
}

"use client";

import React from "react";

interface CanvasTentProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

// Low-Poly A-Frame Canvas Tent — Directly Matching Reference Image
export function CanvasTent({
  isNight: _isNight = false,
  drought = false,
  wireframe = false,
}: CanvasTentProps) {
  const canvasColor = drought ? "#d6d3d1" : "#dfcfb5"; // Warm sandy khaki canvas
  const canvasShadow = drought ? "#a8a29e" : "#bfa98b";
  const woodColor = drought ? "#57534e" : "#6e472a";

  return (
    <group>
      {/* 1. Ground Footprint Timber Skids */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1.05, 0.03, 1.25]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} flatShading wireframe={wireframe} />
      </mesh>

      {/* 2. Horizontal Ridge Pole extending past tent ends */}
      <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.45, 6]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
      </mesh>

      {/* 3. Front and Back Crossed Support Shears (Wood Poles) */}
      {[-0.6, 0.6].map((z, idx) => (
        <group key={`shear-${idx}`} position={[0, 0.44, z]}>
          <mesh position={[-0.24, 0, 0]} rotation={[0, 0, -0.48]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.05, 6]} />
            <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
          </mesh>
          <mesh position={[0.24, 0, 0]} rotation={[0, 0, 0.48]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.05, 6]} />
            <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
          </mesh>
        </group>
      ))}

      {/* 4. Left Canvas Sloped Roof */}
      <mesh position={[-0.27, 0.45, 0]} rotation={[0, 0, -0.52]} castShadow receiveShadow>
        <boxGeometry args={[0.03, 0.98, 1.28]} />
        <meshStandardMaterial
          color={canvasColor}
          roughness={0.75}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 5. Right Canvas Sloped Roof */}
      <mesh position={[0.27, 0.45, 0]} rotation={[0, 0, 0.52]} castShadow receiveShadow>
        <boxGeometry args={[0.03, 0.98, 1.28]} />
        <meshStandardMaterial
          color={canvasColor}
          roughness={0.75}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 6. Back Triangular Canvas Wall */}
      <mesh position={[0, 0.42, -0.61]} rotation={[0, Math.PI, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.52, 0.82, 3]} />
        <meshStandardMaterial
          color={canvasShadow}
          roughness={0.8}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 7. Front Doorway — Open Canvas Triangular Flaps */}
      <group position={[0, 0, 0.62]}>
        {/* Dark Interior Recess */}
        <mesh position={[0, 0.38, -0.02]}>
          <planeGeometry args={[0.42, 0.72]} />
          <meshBasicMaterial color="#211812" />
        </mesh>

        {/* Left Flap (Folded outwards) */}
        <mesh position={[-0.22, 0.38, 0.04]} rotation={[0.2, 0.45, -0.3]} castShadow>
          <cylinderGeometry args={[0.01, 0.22, 0.72, 3]} />
          <meshStandardMaterial color={canvasColor} roughness={0.75} flatShading wireframe={wireframe} />
        </mesh>

        {/* Right Flap (Folded outwards) */}
        <mesh position={[0.22, 0.38, 0.04]} rotation={[0.2, -0.45, 0.3]} castShadow>
          <cylinderGeometry args={[0.01, 0.22, 0.72, 3]} />
          <meshStandardMaterial color={canvasColor} roughness={0.75} flatShading wireframe={wireframe} />
        </mesh>
      </group>

      {/* 8. Corner Ground Stakes */}
      {[
        [-0.55, 0.05, 0.65],
        [0.55, 0.05, 0.65],
        [-0.55, 0.05, -0.65],
        [0.55, 0.05, -0.65],
      ].map((pos, i) => (
        <mesh key={`stake-${i}`} position={pos as [number, number, number]} rotation={[0, 0, pos[0] > 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 5]} />
          <meshStandardMaterial color={woodColor} roughness={0.9} flatShading wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

"use client";

import React from "react";

interface CanvasTentProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
}

export function CanvasTent({
  isNight = false,
  drought = false,
  wireframe = false,
}: CanvasTentProps) {
  const canvasColor = drought ? "#d6d3d1" : "#fef3c7";
  const timberColor = drought ? "#57534e" : "#78350f";

  return (
    <group>
      {/* 1. Ground Wooden Footprint Deck */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.92, 0.03, 1.15]} />
        <meshStandardMaterial
          color={timberColor}
          roughness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Rolled Plaid Wool Sleeping Bedroll Inside */}
      <mesh position={[0, 0.06, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.48, 8]} />
        <meshStandardMaterial
          color={drought ? "#57534e" : "#991b1b"}
          roughness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Front Crossed Timber X-Poles (Shears) */}
      <mesh position={[-0.24, 0.38, 0.54]} rotation={[0, 0, -0.52]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 1.05, 6]} />
        <meshStandardMaterial color={timberColor} roughness={0.85} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.24, 0.38, 0.54]} rotation={[0, 0, 0.52]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 1.05, 6]} />
        <meshStandardMaterial color={timberColor} roughness={0.85} wireframe={wireframe} />
      </mesh>

      {/* 4. Back Crossed Timber X-Poles (Shears) */}
      <mesh position={[-0.24, 0.38, -0.54]} rotation={[0, 0, -0.52]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 1.05, 6]} />
        <meshStandardMaterial color={timberColor} roughness={0.85} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.24, 0.38, -0.54]} rotation={[0, 0, 0.52]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 1.05, 6]} />
        <meshStandardMaterial color={timberColor} roughness={0.85} wireframe={wireframe} />
      </mesh>

      {/* 5. Horizontal Cedar Ridge Pole */}
      <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 1.22, 6]} />
        <meshStandardMaterial color={timberColor} roughness={0.8} wireframe={wireframe} />
      </mesh>

      {/* 6. Left Taut Canvas Sloped Roof */}
      <mesh position={[-0.25, 0.38, 0]} rotation={[0, 0, -0.56]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.88, 1.08]} />
        <meshStandardMaterial
          color={canvasColor}
          roughness={0.7}
          metalness={0.05}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 7. Right Taut Canvas Sloped Roof */}
      <mesh position={[0.25, 0.38, 0]} rotation={[0, 0, 0.56]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.88, 1.08]} />
        <meshStandardMaterial
          color={canvasColor}
          roughness={0.7}
          metalness={0.05}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 8. Back Triangular Canvas Gable Wall */}
      <mesh position={[0, 0.34, -0.53]} rotation={[0, Math.PI, 0]} castShadow>
        <coneGeometry args={[0.44, 0.72, 3]} />
        <meshStandardMaterial
          color={canvasColor}
          roughness={0.75}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 9. Rolled Cream Canvas Door Flaps at Entrance */}
      <mesh position={[-0.32, 0.22, 0.55]} rotation={[0.2, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.42, 6]} />
        <meshStandardMaterial color={canvasColor} roughness={0.8} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.32, 0.22, 0.55]} rotation={[0.2, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.42, 6]} />
        <meshStandardMaterial color={canvasColor} roughness={0.8} wireframe={wireframe} />
      </mesh>

      {/* 10. Hanging Copper Storm Lantern at Front Peak */}
      <group position={[0, 0.62, 0.56]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.08, 3]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.042, 0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={drought ? "#000000" : "#facc15"}
            emissiveIntensity={drought ? 0 : isNight ? 2.4 : 1.0}
            wireframe={wireframe}
          />
        </mesh>
        {isNight && !drought && (
          <pointLight position={[0, 0, 0]} color="#fde047" intensity={1.5} distance={2.5} decay={2} />
        )}
      </group>

      {/* 11. 4 Corner Cord Guy Lines & Wooden Ground Stakes */}
      {[
        [-0.45, 0.1, 0.52, -0.72, 0.03, 0.72],
        [0.45, 0.1, 0.52, 0.72, 0.03, 0.72],
        [-0.45, 0.1, -0.52, -0.72, 0.03, -0.72],
        [0.45, 0.1, -0.52, 0.72, 0.03, -0.72],
      ].map((c, i) => (
        <group key={i}>
          <mesh position={[(c[0] + c[3]) / 2, 0.07, (c[2] + c[5]) / 2]}>
            <cylinderGeometry args={[0.003, 0.003, 0.38, 3]} />
            <meshStandardMaterial color="#a8a29e" />
          </mesh>
          <mesh position={[c[3], c[4], c[5]]} rotation={[0.3, 0, 0.3]}>
            <cylinderGeometry args={[0.012, 0.015, 0.1, 4]} />
            <meshStandardMaterial color={timberColor} roughness={0.8} wireframe={wireframe} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface CabinProps {
  isNight?: boolean;
  drought?: boolean;
  wireframe?: boolean;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

// Low-Poly Tabletop Log Cabin — Stacked Cylindrical Timber Logs, Front Porch with Posts, Pitch Slate Roof
export function Cabin({
  isNight = false,
  drought = false,
  wireframe = false,
  palette = "tabletop",
}: CabinProps) {
  const smokeRef = useRef<THREE.Group>(null);
  const isTabletop = palette === "tabletop";
  const isSunnyside = palette === "sunnyside";

  // Calibrated colors from reference specification
  const logColor = drought
    ? "#57534e"
    : isTabletop
    ? "#8B5A2B" // Medium warm brown
    : isSunnyside
    ? "#c58a63"
    : "#8b522a";

  const trimColor = drought
    ? "#44403c"
    : isTabletop
    ? "#6E4420" // Darker timber accent
    : isSunnyside
    ? "#b27760"
    : "#6c3f1e";

  const roofColor = drought
    ? "#44403c"
    : isTabletop
    ? "#555E6B" // Slate grey shingles
    : isSunnyside
    ? "#ef9734"
    : "#543e2e";

  const chimneyColor = drought
    ? "#57534e"
    : isTabletop
    ? "#A0A09B" // Warm light grey stone
    : isSunnyside
    ? "#5a6988"
    : "#64748b";

  const foundationColor = isTabletop ? "#6E6E6E" : isSunnyside ? "#5a6988" : "#57534e";

  useFrame((state) => {
    if (smokeRef.current && !drought) {
      smokeRef.current.position.y = 1.45 + (state.clock.elapsedTime * 0.14) % 0.35;
      smokeRef.current.scale.setScalar(0.85 + ((state.clock.elapsedTime * 0.2) % 0.35));
    }
  });

  // Stacked horizontal logs count (6 courses high)
  const logRadius = 0.07;
  const numLogs = 6;
  const cabinWidth = 1.45;
  const cabinDepth = 1.25;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Low-Poly Stone Foundation Footing */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[cabinWidth + 0.15, 0.08, cabinDepth + 0.65]} />
        <meshStandardMaterial color={foundationColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
      </mesh>

      {/* 2. Stacked Horizontal Timber Cylinders (Log Cabin Walls) */}
      <group position={[0, 0.08, 0]}>
        {Array.from({ length: numLogs }).map((_, i) => {
          const y = (i + 0.5) * (logRadius * 1.85);
          return (
            <group key={`log-tier-${i}`}>
              {/* Front Wall Log (split around door on lower 4 tiers) */}
              {i >= 4 ? (
                <mesh position={[0, y, cabinDepth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[logRadius, logRadius, cabinWidth + 0.12, 7]} />
                  <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
                </mesh>
              ) : (
                <>
                  <mesh position={[-0.48, y, cabinDepth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                    <cylinderGeometry args={[logRadius, logRadius, 0.48, 7]} />
                    <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
                  </mesh>
                  <mesh position={[0.48, y, cabinDepth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                    <cylinderGeometry args={[logRadius, logRadius, 0.48, 7]} />
                    <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
                  </mesh>
                </>
              )}

              {/* Back Wall Log */}
              <mesh position={[0, y, -cabinDepth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                <cylinderGeometry args={[logRadius, logRadius, cabinWidth + 0.12, 7]} />
                <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
              </mesh>

              {/* Left Wall Log */}
              <mesh position={[-cabinWidth / 2, y + logRadius * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[logRadius, logRadius, cabinDepth + 0.12, 7]} />
                <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
              </mesh>

              {/* Right Wall Log */}
              <mesh position={[cabinWidth / 2, y + logRadius * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[logRadius, logRadius, cabinDepth + 0.12, 7]} />
                <meshStandardMaterial color={logColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}

        {/* Interior Core Block (prevents light leaks through log gaps) */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[cabinWidth - 0.05, 0.82, cabinDepth - 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. Front Porch Deck & Steps */}
      <group position={[0, 0.08, cabinDepth / 2 + 0.28]}>
        {/* Wooden Porch Floor Deck */}
        <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
          <boxGeometry args={[cabinWidth + 0.08, 0.04, 0.54]} />
          <meshStandardMaterial color={trimColor} roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>

        {/* Porch Step Leading Down */}
        <mesh position={[0, -0.02, 0.32]} receiveShadow castShadow>
          <boxGeometry args={[0.7, 0.04, 0.18]} />
          <meshStandardMaterial color={trimColor} roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>

        {/* Vertical Porch Timber Posts supporting roof overhang */}
        {[-cabinWidth / 2 + 0.05, cabinWidth / 2 - 0.05].map((px, pidx) => (
          <mesh key={`post-${pidx}`} position={[px, 0.46, 0.22]} castShadow receiveShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.88, 6]} />
            <meshStandardMaterial color={logColor} roughness={1.0} flatShading wireframe={wireframe} />
          </mesh>
        ))}

        {/* Porch Handrails */}
        <mesh position={[-cabinWidth / 2 + 0.05, 0.32, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 6]} />
          <meshStandardMaterial color={trimColor} roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[cabinWidth / 2 - 0.05, 0.32, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 6]} />
          <meshStandardMaterial color={trimColor} roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. Pitched Slate Tile Roof (Extended Over Porch) */}
      <group position={[0, 0.90, 0.12]}>
        {/* Left Roof Slope (~22° pitch) */}
        <group position={[-0.48, 0.12, 0]} rotation={[0, 0, 0.38]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.05, cabinDepth + 0.95]} />
            <meshStandardMaterial color={roofColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
          </mesh>
          {/* Shingle Ridge Lines */}
          {[-0.8, -0.4, 0.0, 0.4, 0.8].map((rz, ri) => (
            <mesh key={`shingle-l-${ri}`} position={[0, 0.028, rz]} receiveShadow>
              <boxGeometry args={[1.24, 0.015, 0.04]} />
              <meshStandardMaterial color="#3E444F" roughness={1.0} flatShading />
            </mesh>
          ))}
        </group>

        {/* Right Roof Slope (~22° pitch) */}
        <group position={[0.48, 0.12, 0]} rotation={[0, 0, -0.38]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.05, cabinDepth + 0.95]} />
            <meshStandardMaterial color={roofColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
          </mesh>
          {/* Shingle Ridge Lines */}
          {[-0.8, -0.4, 0.0, 0.4, 0.8].map((rz, ri) => (
            <mesh key={`shingle-r-${ri}`} position={[0, 0.028, rz]} receiveShadow>
              <boxGeometry args={[1.24, 0.015, 0.04]} />
              <meshStandardMaterial color="#3E444F" roughness={1.0} flatShading />
            </mesh>
          ))}
        </group>

        {/* Peak Ridge Cap Beam */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, cabinDepth + 0.98]} />
          <meshStandardMaterial color="#2E333B" roughness={1.0} flatShading wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. Door & Glowing Cabin Window */}
      <group position={[0, 0.44, cabinDepth / 2 + 0.01]}>
        {/* Recessed Door */}
        <mesh position={[-0.18, -0.04, 0]}>
          <boxGeometry args={[0.36, 0.62, 0.03]} />
          <meshStandardMaterial color="#4A2810" roughness={1.0} flatShading />
        </mesh>
        {/* Small Cozy Window with Warm Light */}
        <mesh position={[0.35, 0.05, 0]}>
          <boxGeometry args={[0.26, 0.26, 0.03]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#EAB308"
            emissiveIntensity={isNight ? 1.8 : 0.6}
            roughness={0.6}
            flatShading
          />
        </mesh>
        {/* Window Cross Grids */}
        <mesh position={[0.35, 0.05, 0.018]}>
          <boxGeometry args={[0.27, 0.03, 0.01]} />
          <meshStandardMaterial color="#4A2810" roughness={1.0} flatShading />
        </mesh>
        <mesh position={[0.35, 0.05, 0.018]}>
          <boxGeometry args={[0.03, 0.27, 0.01]} />
          <meshStandardMaterial color="#4A2810" roughness={1.0} flatShading />
        </mesh>
      </group>

      {/* 6. Stone Chimney with Smoke Puffs */}
      <group position={[-0.45, 1.05, -0.22]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.62, 0.24]} />
          <meshStandardMaterial color={chimneyColor} roughness={1.0} metalness={0.0} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[0.28, 0.04, 0.28]} />
          <meshStandardMaterial color="#6E6E6E" roughness={1.0} flatShading />
        </mesh>

        {!drought && (
          <group ref={smokeRef} position={[0, 0.80, 0]}>
            <mesh position={[0, 0, 0]}>
              <icosahedronGeometry args={[0.065, 0]} />
              <meshStandardMaterial color="#E2E8F0" transparent opacity={0.65} flatShading />
            </mesh>
            <mesh position={[0.03, 0.10, 0.02]}>
              <icosahedronGeometry args={[0.085, 0]} />
              <meshStandardMaterial color="#F1F5F9" transparent opacity={0.45} flatShading />
            </mesh>
          </group>
        )}
      </group>

      {/* 7. Props: Water Barrel & Harvest Crates */}
      <group position={[cabinWidth / 2 + 0.16, 0.16, 0.25]}>
        {/* Barrel */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.10, 0.26, 8]} />
          <meshStandardMaterial color="#6E4420" roughness={1.0} flatShading />
        </mesh>
      </group>
      <group position={[cabinWidth / 2 + 0.16, 0.14, -0.15]}>
        {/* Crate */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.20, 0.22]} />
          <meshStandardMaterial color="#8B5A2B" roughness={1.0} flatShading />
        </mesh>
      </group>
    </group>
  );
}

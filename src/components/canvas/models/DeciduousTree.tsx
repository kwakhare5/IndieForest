"use client";

import React from "react";
import type { GrowthTier } from "@/types/game";

interface DeciduousTreeProps {
  tier?: GrowthTier;
  drought?: boolean;
  wireframe?: boolean;
}

/**
 * DeciduousTree — Dedicated Golden Broadleaf / Ginkgo Money Tree for Stripe MRR Modules.
 * Distinct from GitHub evergreen conifers with rounded cloud canopies and warm honey-wood.
 */
export function DeciduousTree({
  tier = "sapling",
  drought = false,
  wireframe = false,
}: DeciduousTreeProps) {
  const woodColor = drought ? "#57534e" : "#92400e";
  const leafBaseColor = drought ? "#78716c" : "#eab308";
  const leafHighlightColor = drought ? "#a8a29e" : "#fef08a";
  const leafAccentColor = drought ? "#57534e" : "#f59e0b";

  // Tier 1: Slender Golden Seedling Sprout
  if (tier === "sapling") {
    return (
      <group>
        <mesh position={[0, 0.012, 0]} receiveShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.025, 6]} />
          <meshStandardMaterial color={drought ? "#78716c" : "#451a03"} roughness={0.9} wireframe={wireframe} />
        </mesh>

        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.014, 0.022, 0.32, 6]} />
          <meshStandardMaterial color={drought ? "#78716c" : "#eab308"} roughness={0.7} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.045, 0.28, 0.01]} rotation={[0.1, 0.2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 0.012, 0.045]} />
          <meshStandardMaterial color={leafHighlightColor} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.04, 0.24, -0.01]} rotation={[-0.1, -0.3, 0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.012, 0.04]} />
          <meshStandardMaterial color={leafBaseColor} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0, 0.32, 0]} castShadow>
          <sphereGeometry args={[0.024, 6, 6]} />
          <meshStandardMaterial color={leafHighlightColor} emissive="#ca8a04" emissiveIntensity={0.4} roughness={0.4} wireframe={wireframe} />
        </mesh>
      </group>
    );
  }

  // Tier 2: Young Branching Golden Ginkgo (Non-conical branching sapling)
  if (tier === "young") {
    return (
      <group>
        {/* Slender Honey Stem */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.36, 6]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* Left Branch */}
        <mesh position={[-0.08, 0.34, 0.02]} rotation={[0, 0, 0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.18, 5]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* Right Branch */}
        <mesh position={[0.08, 0.36, -0.02]} rotation={[0, 0, -0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.18, 5]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* 3 Rounded Canopy Leaf Clusters */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={leafBaseColor} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.15, 0.44, 0.05]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={leafHighlightColor} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.16, 0.46, -0.04]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.17, 0]} />
          <meshStandardMaterial color={leafAccentColor} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>
      </group>
    );
  }

  // Tier 3: Mature Golden Broadleaf Oak (Lush interlocking rounded canopies)
  if (tier === "mature") {
    return (
      <group>
        {/* Sturdy Trunk with Root Flare */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.16, 0.7, 6]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* Major Branches */}
        <mesh position={[-0.14, 0.65, 0.05]} rotation={[0.2, 0.3, 0.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.35, 5]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>
        <mesh position={[0.15, 0.68, -0.06]} rotation={[-0.2, -0.3, -0.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.35, 5]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* 5 Interlocking Rounded Golden Canopies */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color={leafBaseColor} roughness={0.4} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.28, 0.82, 0.12]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color={leafHighlightColor} roughness={0.4} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.3, 0.86, -0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color={leafAccentColor} roughness={0.4} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.08, 0.78, 0.28]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={leafBaseColor} roughness={0.4} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.1, 0.8, -0.26]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.27, 0]} />
          <meshStandardMaterial color={leafHighlightColor} roughness={0.4} flatShading wireframe={wireframe} />
        </mesh>

        {/* Golden Buttercup Dots at Base */}
        {!drought && (
          <group position={[0, 0.01, 0]}>
            <mesh position={[0.26, 0.01, 0.2]}>
              <sphereGeometry args={[0.022, 4, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.5} wireframe={wireframe} />
            </mesh>
            <mesh position={[-0.22, 0.01, 0.25]}>
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshStandardMaterial color="#fde047" roughness={0.5} wireframe={wireframe} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // Tier 4: Majestic Solar Money Oak (Grand golden canopy with crown aura)
  return (
    <group>
      {/* Massive Ancient Oak Trunk */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.22, 0.9, 6]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
      </mesh>

      {/* Massive Branches */}
      <mesh position={[-0.2, 0.85, 0.08]} rotation={[0.2, 0.3, 0.55]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.45, 5]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
      </mesh>
      <mesh position={[0.22, 0.9, -0.09]} rotation={[-0.2, -0.3, -0.55]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.45, 5]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} flatShading wireframe={wireframe} />
      </mesh>

      {/* Grand Interlocking Golden Canopy */}
      <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={leafBaseColor} roughness={0.35} flatShading wireframe={wireframe} />
      </mesh>

      <mesh position={[-0.42, 1.15, 0.16]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={leafHighlightColor} roughness={0.35} flatShading wireframe={wireframe} />
      </mesh>

      <mesh position={[0.45, 1.2, -0.15]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color={leafAccentColor} roughness={0.35} flatShading wireframe={wireframe} />
      </mesh>

      <mesh position={[0.12, 1.08, 0.4]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color={leafBaseColor} roughness={0.35} flatShading wireframe={wireframe} />
      </mesh>

      <mesh position={[-0.15, 1.1, -0.38]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color={leafHighlightColor} roughness={0.35} flatShading wireframe={wireframe} />
      </mesh>

      {/* Floating Golden Torus Halo with Glistening Gold Pollen */}
      {!drought && (
        <group position={[0, 2.05, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.035, 8, 20]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#eab308"
              emissiveIntensity={0.9}
              roughness={0.2}
              metalness={0.5}
              wireframe={wireframe}
            />
          </mesh>
          {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.38, Math.sin(i) * 0.06, Math.sin(angle) * 0.38]}
            >
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

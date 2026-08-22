"use client";

import React from "react";
import type { GrowthTier } from "@/types/game";

interface ConiferTreeProps {
  tier?: GrowthTier;
  drought?: boolean;
  wireframe?: boolean;
}

/**
 * ConiferTree — Dedicated Alpine Mountain Pine for GitHub Shipping Modules.
 * Features hexagonal cedar trunks, needle foliage tiers, and mountain clover.
 */
export function ConiferTree({
  tier = "sapling",
  drought = false,
  wireframe = false,
}: ConiferTreeProps) {
  const trunkColor = drought ? "#57534e" : "#78350f";

  // Tier 1: Slender Single-Stick Crop Sprout
  if (tier === "sapling") {
    const shootColor = drought ? "#78716c" : "#10b981";
    const leafColor = drought ? "#57534e" : "#34d399";
    const budColor = drought ? "#a8a29e" : "#6ee7b7";

    return (
      <group>
        {/* Tiny Fertile Soil Mound at Base */}
        <mesh position={[0, 0.012, 0]} receiveShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.025, 6]} />
          <meshStandardMaterial
            color={drought ? "#78716c" : "#3f2b1d"}
            roughness={0.9}
            wireframe={wireframe}
          />
        </mesh>

        {/* Slender Crop Stick / Tender Green Stalk */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.014, 0.022, 0.32, 6]} />
          <meshStandardMaterial
            color={shootColor}
            roughness={0.7}
            flatShading
            wireframe={wireframe}
          />
        </mesh>

        {/* Baby Sprout Leaflet 1 (Right Wing) */}
        <mesh
          position={[0.045, 0.28, 0.01]}
          rotation={[0.1, 0.2, -0.45]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.09, 0.012, 0.045]} />
          <meshStandardMaterial
            color={leafColor}
            roughness={0.5}
            flatShading
            wireframe={wireframe}
          />
        </mesh>

        {/* Baby Sprout Leaflet 2 (Left Wing) */}
        <mesh
          position={[-0.04, 0.24, -0.01]}
          rotation={[-0.1, -0.3, 0.45]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.08, 0.012, 0.04]} />
          <meshStandardMaterial
            color={leafColor}
            roughness={0.5}
            flatShading
            wireframe={wireframe}
          />
        </mesh>

        {/* Tender Top Shoot Bud */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <sphereGeometry args={[0.024, 6, 6]} />
          <meshStandardMaterial
            color={budColor}
            emissive="#059669"
            emissiveIntensity={drought ? 0 : 0.25}
            roughness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    );
  }

  // Tier 2: Young Branching Pine Sapling (Non-conical branching sapling)
  if (tier === "young") {
    const leafColor1 = drought ? "#78716c" : "#059669";
    const leafColor2 = drought ? "#57534e" : "#10b981";
    const leafColor3 = drought ? "#a8a29e" : "#34d399";

    return (
      <group>
        {/* Slender Young Cedar Stem */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.36, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* Left Branch */}
        <mesh position={[-0.08, 0.34, 0.02]} rotation={[0, 0, 0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.18, 5]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* Right Branch */}
        <mesh position={[0.08, 0.36, -0.02]} rotation={[0, 0, -0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.18, 5]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading wireframe={wireframe} />
        </mesh>

        {/* 3 Faceted Pinelet Leaf Clusters */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={leafColor1} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[-0.15, 0.44, 0.05]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={leafColor2} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>

        <mesh position={[0.16, 0.46, -0.04]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.17, 0]} />
          <meshStandardMaterial color={leafColor3} roughness={0.5} flatShading wireframe={wireframe} />
        </mesh>
      </group>
    );
  }

  // Tiers 3 & 4: Multi-tier Alpine Conifer Pines
  const config = React.useMemo(() => {
    switch (tier) {
      case "mature":
        return {
          trunkHeight: 0.65,
          trunkRadiusTop: 0.08,
          trunkRadiusBottom: 0.15,
          totalHeight: 1.75,
          foliage: [
            { y: 0.48, radius: 0.65, height: 0.58, color: "#047857" },
            { y: 0.82, radius: 0.48, height: 0.52, color: "#10b981" },
            { y: 1.15, radius: 0.32, height: 0.48, color: "#34d399" },
          ],
        };
      case "majestic":
      default:
        return {
          trunkHeight: 0.75,
          trunkRadiusTop: 0.09,
          trunkRadiusBottom: 0.18,
          totalHeight: 2.15,
          foliage: [
            { y: 0.48, radius: 0.78, height: 0.6, color: "#047857" },
            { y: 0.85, radius: 0.6, height: 0.55, color: "#059669" },
            { y: 1.2, radius: 0.42, height: 0.5, color: "#10b981" },
            { y: 1.55, radius: 0.26, height: 0.45, color: "#6ee7b7" },
          ],
        };
    }
  }, [tier]);

  return (
    <group>
      {/* 1. Visible Hexagonal Cedar Trunk with Root Flare at Base */}
      <mesh position={[0, config.trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[config.trunkRadiusTop, config.trunkRadiusBottom, config.trunkHeight, 6]}
        />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.85}
          metalness={0.02}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. 6-Sided Faceted Hexagonal Conifer Foliage Tiers */}
      {config.foliage.map((f, idx) => (
        <mesh
          key={idx}
          position={[0, f.y + 0.1, 0]}
          rotation={[0, idx * 0.5, 0]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[f.radius, f.height, 6]} />
          <meshStandardMaterial
            color={drought ? (idx % 2 === 0 ? "#78716c" : "#57534e") : f.color}
            roughness={0.6}
            metalness={0.05}
            flatShading
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 3. Majestic Golden Torus Halo with Pollen Sparkles */}
      {tier === "majestic" && !drought && (
        <group position={[0, config.totalHeight + 0.05, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.028, 8, 20]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#ca8a04"
              emissiveIntensity={0.8}
              roughness={0.3}
              metalness={0.4}
              wireframe={wireframe}
            />
          </mesh>
          {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.3, Math.sin(i) * 0.05, Math.sin(angle) * 0.3]}
            >
              <sphereGeometry args={[0.015, 4, 4]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))}
        </group>
      )}

      {/* 4. Alpine Clover Specks at Base */}
      {!drought && (
        <group position={[0, 0.01, 0]}>
          <mesh position={[0.22, 0.01, 0.2]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.7} wireframe={wireframe} />
          </mesh>
          <mesh position={[-0.18, 0.01, -0.22]}>
            <sphereGeometry args={[0.018, 4, 4]} />
            <meshStandardMaterial color="#93c5fd" roughness={0.7} wireframe={wireframe} />
          </mesh>
        </group>
      )}
    </group>
  );
}

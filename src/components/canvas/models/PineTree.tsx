"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GrowthTier } from "@/types/game";

export type PlainEnglishTier = "sprout" | "small" | "tall" | "mighty";
export type DioramaTier = "starter" | "pro" | "scale" | "enterprise";

export interface PineTreeProps {
  tier?: GrowthTier | DioramaTier | PlainEnglishTier;
  colorType?: "green" | "orange";
  drought?: boolean;
  hasMetricBorder?: boolean;
}

interface PineVariantProps {
  isCash?: boolean;
  drought?: boolean;
  hasMetricBorder?: boolean;
}

// =============================================================================
// 1. Stage 1: Pine Seedling / Sprout (Pine Needle Rosette Whorl)
// Natural conifer seedling with radiating needle sprigs & terminal bud (zero traffic cone)
// =============================================================================
function PineSprout({
  isCash = false,
  drought: _drought = false,
  hasMetricBorder = false,
}: PineVariantProps) {
  const swayRef = useRef<THREE.Group>(null);

  const trunkColor = isCash ? "#78350f" : "#523219";
  const pineGreenA = isCash ? "#d97706" : "#1e5e3a";
  const pineGreenB = isCash ? "#b45309" : "#287a4d";
  const sparkleColor = isCash ? "#fef08a" : "#ffffff";

  // Gentle organic breeze idle sway
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime;
      swayRef.current.rotation.z = Math.sin(t * 2.2) * 0.04;
      swayRef.current.rotation.x = Math.cos(t * 1.7) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Earthy Pine Needle Soil Mound */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.20, 0.26, 0.06, 7]} />
        <meshStandardMaterial color="#452817" roughness={0.9} flatShading />
      </mesh>

      {/* Ground Pinecone Hull / Seed Pebble */}
      <mesh position={[0.13, 0.025, 0.09]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.035, 0]} />
        <meshStandardMaterial color="#382013" roughness={0.85} flatShading />
      </mesh>

      {/* Central Pine Shoot (Swaying in Breeze) */}
      <group ref={swayRef} position={[0, 0.05, 0]}>
        {/* Slender Woody Shoot */}
        <mesh position={[0, 0.10, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.028, 0.038, 0.20, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
        </mesh>

        {/* Radiating Pine Needle Whorl (5 Faceted Needle Sprigs around Crown) */}
        <group position={[0, 0.20, 0]}>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2;
            const sprigColor = i % 2 === 0 ? pineGreenA : pineGreenB;
            return (
              <group key={i} rotation={[0.42, angle, 0]}>
                {/* Slender faceted needle sprig pointing upward/outward */}
                <mesh position={[0, 0.08, 0.04]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
                  <coneGeometry args={[0.048, 0.16, 5]} />
                  <meshStandardMaterial color={sprigColor} roughness={0.65} flatShading />
                </mesh>
                {/* Signature pine sparkle dot on sprig tips */}
                {i % 2 === 0 && (
                  <mesh position={[0, 0.16, 0.05]}>
                    <sphereGeometry args={[0.018, 4, 4]} />
                    <meshBasicMaterial color={sparkleColor} />
                  </mesh>
                )}
              </group>
            );
          })}

          {/* Central Upright Pine Terminal Bud */}
          <mesh position={[0, 0.10, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.055, 0.14, 6]} />
            <meshStandardMaterial color={pineGreenA} roughness={0.65} flatShading />
          </mesh>

          {/* Cash Grove Golden Resin Dewdrop */}
          {(isCash || hasMetricBorder) && (
            <mesh position={[0, 0.20, 0]} castShadow>
              <octahedronGeometry args={[0.042, 0]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={0.85}
                roughness={0.25}
                metalness={0.6}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

// =============================================================================
// 2. Stage 2: Young Pine / Small Tree (Visible Timber Trunk + Branching Boughs)
// Adolescent conifer with open branch whorls & tiered foliage (zero cone-stacking)
// =============================================================================
function YoungPine({
  isCash = false,
  drought: _drought = false,
  hasMetricBorder = false,
}: PineVariantProps) {
  const swayRef = useRef<THREE.Group>(null);

  const trunkColor = isCash ? "#78350f" : "#523219";
  const pineGreenA = isCash ? "#d97706" : "#1e5e3a";
  const pineGreenB = isCash ? "#b45309" : "#287a4d";
  const sparkleColor = isCash ? "#fef08a" : "#ffffff";

  // Subtle natural breeze sway on upper boughs
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime;
      swayRef.current.rotation.z = Math.sin(t * 1.8) * 0.025;
      swayRef.current.rotation.x = Math.cos(t * 1.5) * 0.020;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Root Flare */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.065, 0.11, 0.08, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
      </mesh>

      {/* Main Slender Timber Trunk */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.68, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
      </mesh>

      {/* Animated Pine Canopy with Boughs */}
      <group ref={swayRef} position={[0, 0, 0]}>
        {/* Tier 1: Lower Boughs (3 Distinct Horizontal Pine Boughs extending from trunk) */}
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2 + 0.3;
          return (
            <group key={`bough-${i}`} position={[0, 0.44, 0]} rotation={[0.22, angle, 0]}>
              {/* Short wooden branch branchlet */}
              <mesh position={[0, 0.06, 0.12]} rotation={[0.45, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.02, 0.028, 0.18, 5]} />
                <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
              </mesh>
              {/* Faceted Pine Foliage Pad */}
              <mesh position={[0, 0.10, 0.22]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.16, 0.22, 6]} />
                <meshStandardMaterial color={i % 2 === 0 ? pineGreenA : pineGreenB} roughness={0.65} flatShading />
              </mesh>
              {/* Sparkle Dot */}
              <mesh position={[0.08, 0.08, 0.24]}>
                <sphereGeometry args={[0.022, 4, 4]} />
                <meshBasicMaterial color={sparkleColor} />
              </mesh>
            </group>
          );
        })}

        {/* Tier 2: Mid-Upper Compact Pine Skirt */}
        <group position={[0, 0.62, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.38, 0.34, 7]} />
            <meshStandardMaterial color={pineGreenB} roughness={0.65} flatShading />
          </mesh>
          <mesh position={[0.22, 0.07, 0.12]}>
            <sphereGeometry args={[0.024, 4, 4]} />
            <meshBasicMaterial color={sparkleColor} />
          </mesh>
          <mesh position={[-0.20, 0.08, 0.10]}>
            <sphereGeometry args={[0.022, 4, 4]} />
            <meshBasicMaterial color={sparkleColor} />
          </mesh>
        </group>

        {/* Tier 3: Slender Top Crown & Leader */}
        <group position={[0, 0.82, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.24, 0.30, 7]} />
            <meshStandardMaterial color={pineGreenA} roughness={0.65} flatShading />
          </mesh>
          <mesh position={[0, 0.08, 0.16]}>
            <sphereGeometry args={[0.022, 4, 4]} />
            <meshBasicMaterial color={sparkleColor} />
          </mesh>

          {/* Cash Grove Golden Dewdrop Accent */}
          {(isCash || hasMetricBorder) && (
            <mesh position={[0, 0.32, 0]} castShadow>
              <octahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={0.85}
                roughness={0.25}
                metalness={0.6}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

// =============================================================================
// Sovereign Golden Halo Ring (Gentle Floating Dynamics for Final Tree Stage)
// =============================================================================
function HaloRing({ scale }: { scale: number }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.elapsedTime;
      ringRef.current.position.y = 0.08 * scale + Math.sin(t * 2.4) * 0.015 * scale;
      ringRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={ringRef} position={[0, 0.08 * scale, 0]} rotation={[Math.PI / 10, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.22 * scale, 0.02 * scale, 8, 28]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

// =============================================================================
// 3. Stage 3 & 4: Mature & Majestic/Elder Pines
// Classic low-poly multi-tier evergreen pines with faceted origami skirts
// =============================================================================
export function PineTree({
  tier = "sprout",
  colorType = "green",
  drought: _drought = false,
  hasMetricBorder = false,
}: PineTreeProps) {
  const isCash = colorType === "orange";
  const trunkColor = isCash ? "#78350f" : "#523219";
  const skirtGreenA = isCash ? "#d97706" : "#1e5e3a";
  const skirtGreenB = isCash ? "#b45309" : "#287a4d";
  const sparkleColor = isCash ? "#fef08a" : "#ffffff";

  // 1. Stump stage
  if (tier === "stump") {
    const trunkHeight = 0.18;
    const trunkRadius = 0.08;
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[trunkRadius, trunkRadius * 1.15, trunkHeight, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, trunkHeight + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[trunkRadius * 0.92, 8]} />
          <meshBasicMaterial color="#b08968" />
        </mesh>
      </group>
    );
  }

  // 2. Stage 1: Sprout / Sapling / Starter -> Baby Pine Rosette Whorl
  if (tier === "sprout" || tier === "starter" || tier === "sapling") {
    return (
      <PineSprout
        isCash={isCash}
        drought={_drought}
        hasMetricBorder={hasMetricBorder}
      />
    );
  }

  // 3. Stage 2: Small / Pro / Young -> Young Pine with Reaching Boughs
  if (tier === "small" || tier === "pro" || tier === "young") {
    return (
      <YoungPine
        isCash={isCash}
        drought={_drought}
        hasMetricBorder={hasMetricBorder}
      />
    );
  }

  // 4. Stage 3 (Tall / Mature) & Stage 4 (Mighty / Majestic / Elder) -> Classic Evergreen Pines
  const isMighty =
    tier === "mighty" ||
    tier === "enterprise" ||
    tier === "majestic" ||
    tier === "elder";

  const config = isMighty
    ? { trunkHeight: 1.05, trunkRadius: 0.095, scale: 1.3, skirts: 4 }
    : { trunkHeight: 0.7, trunkRadius: 0.075, scale: 1.0, skirts: 3 };

  return (
    <group position={[0, 0, 0]}>
      {/* Timber Trunk */}
      <mesh position={[0, config.trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[config.trunkRadius, config.trunkRadius * 1.25, config.trunkHeight, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
      </mesh>

      {/* Overlapping Faceted Origami Cone Skirts (Classic Christmas Pine) */}
      {Array.from({ length: config.skirts }).map((_, idx) => {
        const skirtBottomY = config.trunkHeight + idx * 0.32 * config.scale;
        const skirtRadius = (0.78 - idx * 0.13) * config.scale;
        const skirtHeight = 0.58 * config.scale;
        const skirtColor = idx % 2 === 0 ? skirtGreenA : skirtGreenB;

        return (
          <group key={idx} position={[0, skirtBottomY, 0]}>
            {/* 7-Sided Faceted Cone Skirt */}
            <mesh position={[0, skirtHeight / 2, 0]} castShadow receiveShadow>
              <coneGeometry args={[skirtRadius, skirtHeight, 7]} />
              <meshStandardMaterial color={skirtColor} roughness={0.65} flatShading />
            </mesh>

            {/* Cute White Star / Snow Sparkle Dots along Skirt Branches */}
            <mesh position={[skirtRadius * 0.65, 0.08, skirtRadius * 0.35]}>
              <sphereGeometry args={[0.032 * config.scale, 5, 5]} />
              <meshBasicMaterial color={sparkleColor} />
            </mesh>
            <mesh position={[-skirtRadius * 0.65, 0.09, skirtRadius * 0.2]}>
              <sphereGeometry args={[0.03 * config.scale, 5, 5]} />
              <meshBasicMaterial color={sparkleColor} />
            </mesh>
            <mesh position={[0, 0.1, skirtRadius * 0.72]}>
              <sphereGeometry args={[0.034 * config.scale, 5, 5]} />
              <meshBasicMaterial color={sparkleColor} />
            </mesh>
          </group>
        );
      })}

      {/* Golden Peak Star & Sovereign Halo Ring (Unlocked on Mighty Final Stage) */}
      {(config.skirts >= 4 || hasMetricBorder) && (
        <group position={[0, config.trunkHeight + config.skirts * 0.35 * config.scale + 0.12, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.09 * config.scale, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Floating Radiant Halo Ring */}
          <HaloRing scale={config.scale} />
        </group>
      )}
    </group>
  );
}


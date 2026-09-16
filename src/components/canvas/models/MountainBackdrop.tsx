"use client";

import React from "react";
import * as THREE from "three";

export interface MountainPeakProps {
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
  snowRatio?: number; // default 0.22 (top 22%)
}

// Single Low-Poly Steep Hexagonal Pyramid Mountain with Crisp White Snow Cap
export function MountainPeak({
  position = [0, 0, 0],
  scale = 1.0,
  rotationY = 0,
  snowRatio = 0.22,
}: MountainPeakProps) {
  const baseHeight = 3.6 * scale;
  const baseRadius = 1.85 * scale;
  const segments = 6; // Hexagonal pyramid as specified in blueprint

  const snowHeight = baseHeight * snowRatio;
  const snowRadius = baseRadius * snowRatio;
  const stoneHeight = baseHeight - snowHeight;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Mountain Base: Pale lavender/grey stone body */}
      <mesh position={[0, stoneHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[snowRadius, baseRadius, stoneHeight, segments]}
        />
        <meshStandardMaterial
          color="#B5B5C0"
          roughness={1.0}
          metalness={0.0}
          flatShading={true}
        />
      </mesh>

      {/* 2. Snow Cap: Pure white top pyramid */}
      <mesh position={[0, stoneHeight + snowHeight / 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[snowRadius, snowHeight, segments]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={1.0}
          metalness={0.0}
          flatShading={true}
        />
      </mesh>
    </group>
  );
}

// Low-Poly Mountain Range Backdrop for the North Edge of the Island
export function MountainBackdrop({
  scale = 1.0,
}: {
  scale?: number;
}) {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Western Peaks */}
      <MountainPeak position={[-5.8, 0, -5.2]} scale={1.4} rotationY={0.4} />
      <MountainPeak position={[-4.2, 0, -6.0]} scale={1.8} rotationY={0.8} />
      <MountainPeak position={[-2.4, 0, -6.4]} scale={1.5} rotationY={-0.2} />

      {/* Central High Spine */}
      <MountainPeak position={[0.2, 0, -6.8]} scale={2.0} rotationY={0.6} />
      <MountainPeak position={[2.6, 0, -6.2]} scale={1.7} rotationY={-0.5} />

      {/* Eastern Peaks */}
      <MountainPeak position={[4.8, 0, -5.5]} scale={1.5} rotationY={0.3} />
      <MountainPeak position={[6.2, 0, -4.6]} scale={1.3} rotationY={-0.7} />
    </group>
  );
}

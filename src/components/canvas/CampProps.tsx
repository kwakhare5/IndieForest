"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useForestStore } from "@/store/useForestStore";

export function CampProps() {
  const shopItems = useForestStore((s) => s.shopItems);
  const streakDays = useForestStore((s) => s.streakDays);

  const fireRef = useRef<THREE.Group>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Equipped check helper
  const isEquipped = (id: string) => shopItems.find((i) => i.id === id)?.isEquipped;

  // Animate flame flickers
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 8;
    if (flameMeshRef.current) {
      const scale = 1 + Math.sin(t) * 0.12 + Math.cos(t * 1.7) * 0.08;
      flameMeshRef.current.scale.set(scale, scale * 1.2, scale);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 1.3) * 0.6;
    }
  });

  return (
    <group>
      {/* 1. CAMPFIRE (Visible if equipped or streak >= 3) */}
      {(isEquipped("campfire") || streakDays >= 3) && (
        <group ref={fireRef} position={[1.8, 0, 1.8]}>
          {/* Wood Foundation Box (matching Reference Photo 2) */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.2, 0.9]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} flatShading />
          </mesh>

          {/* Upright Leaning Firewood Logs */}
          <mesh position={[-0.15, 0.35, -0.1]} rotation={[0.2, 0.3, 0.35]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.7, 5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.15, 0.35, 0.1]} rotation={[-0.2, -0.4, -0.3]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.7, 5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, 0.38, 0]} rotation={[0.4, 0.1, -0.2]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.75, 5]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
          </mesh>

          {/* Central Burning Embers */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#ea580c"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Glowing Animated Flame */}
          <mesh ref={flameMeshRef} position={[0, 0.45, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
              roughness={0.2}
            />
          </mesh>

          {/* Warm Point Light */}
          <pointLight
            ref={lightRef}
            position={[0, 0.6, 0]}
            color="#f59e0b"
            intensity={2.8}
            distance={5.5}
            decay={2}
            castShadow
          />
        </group>
      )}

      {/* 2. CAMPING TENT (Equipped or streak >= 7) */}
      {(isEquipped("tent") || streakDays >= 7) && (
        <group position={[-2.4, 0, 1.6]} rotation={[0, Math.PI / 4, 0]}>
          {/* Triangular Tent Canvas */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 1.0, 3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.7} flatShading />
          </mesh>
          {/* Tent Doorway Flap */}
          <mesh position={[0, 0.35, 0.4]}>
            <planeGeometry args={[0.45, 0.65]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Wooden Ridge Pole */}
          <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.1, 4]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 3. LOG CABIN (Equipped or streak >= 14) */}
      {(isEquipped("cabin") || streakDays >= 14) && (
        <group position={[-2.2, 0, -1.8]} rotation={[0, -Math.PI / 6, 0]}>
          {/* Timber Walls */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.9, 1.2]} />
            <meshStandardMaterial color="#854d0e" roughness={0.8} flatShading />
          </mesh>
          {/* Peaked A-Frame Roof */}
          <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.1, 0.7, 4]} />
            <meshStandardMaterial color="#451a03" roughness={0.7} flatShading />
          </mesh>
          {/* Stone Chimney */}
          <mesh position={[0.4, 1.25, -0.3]} castShadow>
            <boxGeometry args={[0.22, 0.65, 0.22]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
          </mesh>
          {/* Warm Window Glow */}
          <mesh position={[-0.3, 0.55, 0.61]}>
            <planeGeometry args={[0.25, 0.3]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#facc15"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* 4. SOLAR LANTERN POST (Equipped) */}
      {isEquipped("lantern") && (
        <group position={[1.2, 0, -1.8]}>
          {/* Wooden Post */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.2, 4]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Lantern Head */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.2, 0.25, 0.2]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              roughness={0.3}
            />
          </mesh>
          <pointLight position={[0, 1.2, 0]} color="#f59e0b" intensity={1.5} distance={3.5} />
        </group>
      )}

      {/* 5. COBBLESTONE PATH (Equipped) */}
      {isEquipped("stone_path") && (
        <group position={[0, 0.02, 0]}>
          <mesh position={[0.8, 0, 0.8]} receiveShadow>
            <boxGeometry args={[0.4, 0.04, 0.35]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[1.2, 0, 1.1]} receiveShadow>
            <boxGeometry args={[0.35, 0.04, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[1.5, 0, 1.4]} receiveShadow>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
          </mesh>
        </group>
      )}

      {/* 6. PET FOREST FOX (Equipped) */}
      {isEquipped("pet_fox") && (
        <group position={[1.2, 0, 0.6]} rotation={[0, -Math.PI / 3, 0]}>
          {/* Orange Body */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.35, 0.22, 0.22]} />
            <meshStandardMaterial color="#ea580c" roughness={0.8} flatShading />
          </mesh>
          {/* Head */}
          <mesh position={[0.2, 0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial color="#ea580c" roughness={0.8} flatShading />
          </mesh>
          {/* White Snout */}
          <mesh position={[0.3, 0.22, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.1]} />
            <meshStandardMaterial color="#fff" roughness={0.8} />
          </mesh>
          {/* Ears */}
          <mesh position={[0.2, 0.36, 0.06]}>
            <coneGeometry args={[0.04, 0.09, 3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.36, -0.06]}>
            <coneGeometry args={[0.04, 0.09, 3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* White-tipped Tail */}
          <mesh position={[-0.22, 0.18, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.04, 0.07, 0.28, 4]} />
            <meshStandardMaterial color="#ea580c" roughness={0.8} flatShading />
          </mesh>
        </group>
      )}

      {/* 7. RAINBOW ARC (Equipped or streak >= 14) */}
      {(isEquipped("rainbow") || streakDays >= 14) && (
        <group position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
          <mesh>
            <torusGeometry args={[3.2, 0.08, 8, 32, Math.PI]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#a855f7"
              emissiveIntensity={0.5}
              transparent
              opacity={0.65}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

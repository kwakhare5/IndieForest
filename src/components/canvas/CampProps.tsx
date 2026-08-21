"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useForestStore } from "@/store/useForestStore";

export function CampProps() {
  const streakDays = useForestStore((s) => s.streakDays);
  const unlockedDecor = useForestStore((s) => s.unlockedDecor);
  const timeOfDay = useForestStore((s) => s.timeOfDay);

  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const smokeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  const isNightOrSunset = timeOfDay === "night" || timeOfDay === "sunset";

  // Cloud initial offsets
  const clouds = useMemo(
    () => [
      { x: -5, y: 5.5, z: -3, scale: 1.2, speed: 0.2 },
      { x: 2, y: 6.2, z: 4, scale: 0.9, speed: 0.15 },
      { x: 6, y: 5.0, z: -2, scale: 1.1, speed: 0.18 },
    ],
    []
  );

  // Animate flame, rising smoke, and drifting clouds
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Flame flicker
    if (flameRef.current) {
      const scale = 1 + Math.sin(t * 10) * 0.15;
      flameRef.current.scale.set(scale, scale * 1.3, scale);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 3.0 + Math.sin(t * 8) * 0.8;
    }

    // Campfire Smoke rising puffs
    if (smokeRef.current && streakDays >= 3) {
      smokeRef.current.children.forEach((puff, idx) => {
        const offset = (t * 0.8 + idx * 0.4) % 2.0;
        puff.position.y = 0.5 + offset * 0.7;
        const s = 0.08 + offset * 0.08;
        puff.scale.set(s, s, s);
        puff.position.x = Math.sin(t + idx) * 0.06;
      });
    }

    // Drifting clouds
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += 0.003 * (i + 1);
        if (cloud.position.x > 9) {
          cloud.position.x = -9;
        }
      });
    }
  });

  return (
    <group>
      {/* --- Floating Low-Poly White Clouds Drifting in Sky --- */}
      <group ref={cloudsRef}>
        {clouds.map((c, i) => (
          <group key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
            {/* Center Cloud Puffs */}
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.5, 0.9]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} flatShading />
            </mesh>
            <mesh position={[0.4, 0.3, 0]} castShadow>
              <boxGeometry args={[0.9, 0.5, 0.7]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} flatShading />
            </mesh>
            <mesh position={[-0.4, 0.2, 0.1]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.7]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* 1. CAMPFIRE (Unlocked at streak >= 3) */}
      {streakDays >= 3 && (
        <group position={[1.8, 0, 1.8]}>
          {/* Wood Foundation Box */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.2, 0.9]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} flatShading />
          </mesh>

          {/* Upright Leaning Firewood Logs */}
          <mesh position={[-0.15, 0.35, -0.1]} rotation={[0.2, 0.3, 0.35]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.7, 5]} />
            <meshStandardMaterial color="#854d0e" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.15, 0.35, 0.1]} rotation={[-0.2, -0.4, -0.3]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.7, 5]} />
            <meshStandardMaterial color="#854d0e" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.38, 0]} rotation={[0.4, 0.1, -0.2]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.75, 5]} />
            <meshStandardMaterial color="#854d0e" roughness={0.85} flatShading />
          </mesh>

          {/* Optional Unlocked Stone Firepit Decor */}
          {unlockedDecor.includes("firepit_stone") && (
            <group position={[0, 0.15, 0]}>
              {[-0.6, 0.6].map((x, i) => (
                <mesh key={`stone-x-${i}`} position={[x, 0, 0]} castShadow>
                  <dodecahedronGeometry args={[0.16, 0]} />
                  <meshStandardMaterial color="#78716c" roughness={0.9} flatShading />
                </mesh>
              ))}
              {[-0.5, 0.5].map((z, i) => (
                <mesh key={`stone-z-${i}`} position={[0, 0, z]} castShadow>
                  <dodecahedronGeometry args={[0.16, 0]} />
                  <meshStandardMaterial color="#78716c" roughness={0.9} flatShading />
                </mesh>
              ))}
            </group>
          )}

          {/* Burning Embers */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#ea580c"
              emissiveIntensity={1.0}
            />
          </mesh>

          {/* Glowing Animated Flame */}
          <mesh ref={flameRef} position={[0, 0.45, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>

          {/* Rising Smoke Particles */}
          <group ref={smokeRef}>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[1, 5, 5]} />
              <meshStandardMaterial color="#e2e8f0" transparent opacity={0.35} flatShading />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[1, 5, 5]} />
              <meshStandardMaterial color="#cbd5e1" transparent opacity={0.25} flatShading />
            </mesh>
          </group>

          {/* Warm Point Light */}
          <pointLight
            ref={lightRef}
            position={[0, 0.6, 0]}
            color="#f59e0b"
            intensity={3.2}
            distance={6.0}
            decay={2}
            castShadow
          />
        </group>
      )}

      {/* 2. CAMPING TENT (Unlocked at streak >= 7) */}
      {streakDays >= 7 && (
        <group position={[-2.4, 0, 1.6]} rotation={[0, Math.PI / 4, 0]}>
          {/* Blue/Teal Canvas Tent */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 1.0, 3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} flatShading />
          </mesh>
          {/* Door Flap */}
          <mesh position={[0, 0.35, 0.4]}>
            <planeGeometry args={[0.45, 0.65]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 3. LOG CABIN (Unlocked at streak >= 14) */}
      {streakDays >= 14 && (
        <group position={[-2.2, 0, -1.8]} rotation={[0, -Math.PI / 6, 0]}>
          {/* Timber Walls */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.9, 1.2]} />
            <meshStandardMaterial color="#854d0e" roughness={0.7} flatShading />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.1, 0.7, 4]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} flatShading />
          </mesh>
          {/* Window Glow */}
          <mesh position={[-0.3, 0.55, 0.61]}>
            <planeGeometry args={[0.25, 0.3]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#facc15"
              emissiveIntensity={1.0}
            />
          </mesh>
        </group>
      )}

      {/* 4. PINECONE SHOP DECOR: Night Lantern Posts */}
      {unlockedDecor.includes("night_lanterns") && (
        <group position={[0.8, 0, -1.8]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.2, 4]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.18, 0.22, 0.18]} />
            <meshStandardMaterial
              color={isNightOrSunset ? "#facc15" : "#fed7aa"}
              emissive={isNightOrSunset ? "#eab308" : "#000000"}
              emissiveIntensity={isNightOrSunset ? 1.5 : 0}
              roughness={0.2}
            />
          </mesh>
          {isNightOrSunset && (
            <pointLight position={[0, 1.2, 0]} color="#facc15" intensity={1.8} distance={3.5} />
          )}
        </group>
      )}

      {/* 5. PINECONE SHOP DECOR: Wooden Pond Pier */}
      {unlockedDecor.includes("pond_pier") && (
        <group position={[0, -0.05, 0.9]} rotation={[0, 0.1, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.08, 1.2]} />
            <meshStandardMaterial color="#854d0e" roughness={0.8} flatShading />
          </mesh>
          {/* Support Pilings */}
          <mesh position={[-0.25, -0.2, 0.4]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
            <meshStandardMaterial color="#5c3810" roughness={0.9} />
          </mesh>
          <mesh position={[0.25, -0.2, 0.4]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 4]} />
            <meshStandardMaterial color="#5c3810" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 6. PINECONE SHOP DECOR: Cozy Hammock */}
      {unlockedDecor.includes("hammock") && (
        <group position={[1.5, 0.35, -1.8]} rotation={[0, -0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.06, 0.45]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

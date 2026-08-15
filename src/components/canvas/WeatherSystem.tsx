"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useForestStore } from "@/store/useForestStore";

export function WeatherSystem() {
  const isRaining = useForestStore((s) => s.isRaining);
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const streakDays = useForestStore((s) => s.streakDays);

  const rainCount = 120;
  const fireflyCount = 25;

  const rainRef = useRef<THREE.InstancedMesh>(null);
  const firefliesRef = useRef<THREE.InstancedMesh>(null);

  // Generate initial random rain drop positions
  const rainData = useMemo(() => {
    return Array.from({ length: rainCount }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 8 + 2,
      z: (Math.random() - 0.5) * 8,
      speed: 0.15 + Math.random() * 0.1,
    }));
  }, [rainCount]);

  // Generate firefly initial positions
  const fireflyData = useMemo(() => {
    return Array.from({ length: fireflyCount }, () => ({
      x: (Math.random() - 0.5) * 7,
      y: Math.random() * 2.5 + 0.3,
      z: (Math.random() - 0.5) * 7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, [fireflyCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update rain & fireflies positions
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Rain drop animation
    if (rainRef.current && isRaining) {
      rainData.forEach((drop, i) => {
        drop.y -= drop.speed;
        if (drop.y < 0) {
          drop.y = 8 + Math.random() * 2;
          drop.x = (Math.random() - 0.5) * 8;
          drop.z = (Math.random() - 0.5) * 8;
        }
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.rotation.x = 0.1;
        dummy.rotation.z = -0.1;
        dummy.scale.set(0.04, 0.45, 0.04);
        dummy.updateMatrix();
        rainRef.current!.setMatrixAt(i, dummy.matrix);
      });
      rainRef.current.instanceMatrix.needsUpdate = true;
    }

    // Fireflies floating animation
    if (firefliesRef.current && (timeOfDay === "night" || streakDays >= 7)) {
      fireflyData.forEach((fly, i) => {
        const y = fly.y + Math.sin(time * fly.speed + fly.phase) * 0.3;
        const x = fly.x + Math.cos(time * 0.5 + fly.phase) * 0.2;
        const z = fly.z + Math.sin(time * 0.5 + fly.phase) * 0.2;
        const scale = 0.05 + Math.sin(time * 3 + fly.phase) * 0.02;

        dummy.position.set(x, y, z);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        firefliesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      firefliesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Dynamic Lighting parameters based on timeOfDay
  const lighting = useMemo(() => {
    switch (timeOfDay) {
      case "sunset":
        return {
          sunColor: "#f59e0b",
          sunIntensity: 2.2,
          ambientColor: "#fbbf24",
          ambientIntensity: 0.7,
          sunPosition: [12, 8, 12] as [number, number, number],
        };
      case "night":
        return {
          sunColor: "#38bdf8",
          sunIntensity: 0.6,
          ambientColor: "#1e293b",
          ambientIntensity: 0.35,
          sunPosition: [8, 12, 8] as [number, number, number],
        };
      default: // day
        return {
          sunColor: "#fffbeb",
          sunIntensity: 2.6,
          ambientColor: "#e2e8f0",
          ambientIntensity: 0.85,
          sunPosition: [15, 20, 15] as [number, number, number],
        };
    }
  }, [timeOfDay]);

  return (
    <group>
      {/* Sun / Moon Directional Light */}
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.sunIntensity}
        color={lighting.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* Ambient Fill Light */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* Rain Particle Mesh */}
      {isRaining && (
        <instancedMesh ref={rainRef} args={[undefined, undefined, rainCount]}>
          <cylinderGeometry args={[1, 1, 1, 4]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </instancedMesh>
      )}

      {/* Fireflies Mesh (Visible at Night or 7+ Streak) */}
      {(timeOfDay === "night" || streakDays >= 7) && (
        <instancedMesh ref={firefliesRef} args={[undefined, undefined, fireflyCount]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#fef08a" />
        </instancedMesh>
      )}
    </group>
  );
}

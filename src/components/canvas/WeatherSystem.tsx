"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useForestStore } from "@/store/useForestStore";
import { WeatherType } from "@/types/game";

export function WeatherSystem() {
  const isRaining = useForestStore((s) => s.isRaining);
  const weatherType = useForestStore((s) => (s as { weatherType?: WeatherType }).weatherType || (isRaining ? "rain_emerald" : "clear"));
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const streakDays = useForestStore((s) => s.streakDays);

  const rainCount = 160;
  const fireflyCount = 30;
  const goldCount = 80;

  const rainRef = useRef<THREE.InstancedMesh>(null);
  const firefliesRef = useRef<THREE.InstancedMesh>(null);
  const goldShowerRef = useRef<THREE.InstancedMesh>(null);
  const sunrayRef = useRef<THREE.Group>(null);
  const lightningLightRef = useRef<THREE.PointLight>(null);

  // Rain drop positions
  const rainData = useMemo(() => {
    return Array.from({ length: rainCount }, () => ({
      x: (Math.random() - 0.5) * 8.5,
      y: Math.random() * 8 + 2,
      z: (Math.random() - 0.5) * 8.5,
      speed: 0.18 + Math.random() * 0.12,
    }));
  }, [rainCount]);

  // Gold particle shower positions
  const goldData = useMemo(() => {
    return Array.from({ length: goldCount }, () => ({
      x: (Math.random() - 0.5) * 6.5,
      y: Math.random() * 7 + 1,
      z: (Math.random() - 0.5) * 6.5,
      speed: 0.08 + Math.random() * 0.08,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [goldCount]);

  // Firefly positions
  const fireflyData = useMemo(() => {
    return Array.from({ length: fireflyCount }, () => ({
      x: (Math.random() - 0.5) * 7.5,
      y: Math.random() * 2.5 + 0.3,
      z: (Math.random() - 0.5) * 7.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.6,
    }));
  }, [fireflyCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // 1. Rain / Mist Particle Animation
    if (rainRef.current && (isRaining || weatherType === "rain_emerald" || weatherType === "thunder_milestone")) {
      rainData.forEach((drop, i) => {
        drop.y -= drop.speed * (weatherType === "thunder_milestone" ? 1.5 : 1.0);
        if (drop.y < 0) {
          drop.y = 8 + Math.random() * 2;
          drop.x = (Math.random() - 0.5) * 8.5;
          drop.z = (Math.random() - 0.5) * 8.5;
        }
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.rotation.x = 0.1;
        dummy.rotation.z = -0.1;
        dummy.scale.set(0.035, 0.45, 0.035);
        dummy.updateMatrix();
        rainRef.current!.setMatrixAt(i, dummy.matrix);
      });
      rainRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Radiant Golden Particle Shower (Stripe Payments)
    if (goldShowerRef.current && weatherType === "gold_shower") {
      goldData.forEach((particle, i) => {
        particle.y -= particle.speed;
        particle.rotation += 0.05;
        if (particle.y < 0) {
          particle.y = 7 + Math.random() * 2;
          particle.x = (Math.random() - 0.5) * 6.5;
          particle.z = (Math.random() - 0.5) * 6.5;
        }
        dummy.position.set(particle.x, particle.y, particle.z);
        dummy.rotation.set(particle.rotation, particle.rotation, 0);
        dummy.scale.set(0.08, 0.08, 0.08);
        dummy.updateMatrix();
        goldShowerRef.current!.setMatrixAt(i, dummy.matrix);
      });
      goldShowerRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Lightning Flash (Thunder Milestone)
    if (lightningLightRef.current && weatherType === "thunder_milestone") {
      const flash = Math.sin(time * 15) > 0.95 ? 4.5 : 0;
      lightningLightRef.current.intensity = flash;
    }

    // 4. Fireflies floating animation
    if (firefliesRef.current && (timeOfDay === "night" || streakDays >= 7)) {
      fireflyData.forEach((fly, i) => {
        const y = fly.y + Math.sin(time * fly.speed + fly.phase) * 0.35;
        const x = fly.x + Math.cos(time * 0.5 + fly.phase) * 0.25;
        const z = fly.z + Math.sin(time * 0.5 + fly.phase) * 0.25;
        const scale = 0.06 + Math.sin(time * 3.5 + fly.phase) * 0.025;

        dummy.position.set(x, y, z);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        firefliesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      firefliesRef.current.instanceMatrix.needsUpdate = true;
    }

    // 5. Rotating Golden Sunray Beams
    if (sunrayRef.current) {
      sunrayRef.current.rotation.y = time * 0.04;
    }
  });

  // Dynamic warm daylight parameters
  const lighting = useMemo(() => {
    switch (timeOfDay) {
      case "sunset":
        return {
          sunColor: "#f59e0b",
          sunIntensity: 2.8,
          ambientColor: "#fbbf24",
          ambientIntensity: 0.8,
          sunPosition: [12, 10, 12] as [number, number, number],
        };
      case "night":
        return {
          sunColor: "#38bdf8",
          sunIntensity: 0.9,
          ambientColor: "#0f172a",
          ambientIntensity: 0.45,
          sunPosition: [8, 14, 8] as [number, number, number],
        };
      default: // vibrant daylight
        return {
          sunColor: "#fffbeb",
          sunIntensity: 3.2,
          ambientColor: "#f0fdf4",
          ambientIntensity: 1.1,
          sunPosition: [16, 22, 16] as [number, number, number],
        };
    }
  }, [timeOfDay]);

  return (
    <group>
      {/* Sun Directional Light */}
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.sunIntensity}
        color={lighting.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
      />

      {/* Ambient Fill Light */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* Lightning Flash Point Light for Milestones */}
      <pointLight ref={lightningLightRef} position={[0, 8, 0]} color="#e0f2fe" intensity={0} distance={20} />

      {/* 1. Rain / Mist Particle Mesh */}
      {(isRaining || weatherType === "rain_emerald" || weatherType === "thunder_milestone") && (
        <instancedMesh ref={rainRef} args={[undefined, undefined, rainCount]}>
          <cylinderGeometry args={[1, 1, 1, 4]} />
          <meshBasicMaterial color={weatherType === "thunder_milestone" ? "#bae6fd" : "#38bdf8"} transparent opacity={0.75} />
        </instancedMesh>
      )}

      {/* 2. Golden Particle Shower (Stripe Sales) */}
      {weatherType === "gold_shower" && (
        <instancedMesh ref={goldShowerRef} args={[undefined, undefined, goldCount]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} roughness={0.1} />
        </instancedMesh>
      )}

      {/* 3. Golden Sunray Beams */}
      {weatherType === "thunder_milestone" && (
        <group ref={sunrayRef} position={[0, 4, 0]}>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, idx) => (
            <mesh key={idx} rotation={[0.4, rot, 0]}>
              <cylinderGeometry args={[0.05, 0.8, 12, 4]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.12} />
            </mesh>
          ))}
        </group>
      )}

      {/* 4. Fireflies Mesh */}
      {(timeOfDay === "night" || streakDays >= 7) && (
        <instancedMesh ref={firefliesRef} args={[undefined, undefined, fireflyCount]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#fef08a" />
        </instancedMesh>
      )}
    </group>
  );
}

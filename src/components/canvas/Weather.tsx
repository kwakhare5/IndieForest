"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WeatherProps {
  drought?: boolean;
  isRaining?: boolean;
  hasRevenue?: boolean;
}

export function Weather({
  drought = false,
  isRaining = false,
  hasRevenue = false,
}: WeatherProps) {
  const rainRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const fogRef = useRef<THREE.Points>(null);

  // Rain Drops Geometry spanning full 1:1 square island boundaries (±9.5 units)
  const { rainPositions, rainCount } = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 19;
      positions[i * 3 + 1] = Math.random() * 8 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 19;
    }
    return { rainPositions: positions, rainCount: count };
  }, []);

  // Golden Sparkles for East Revenue Grove
  const { sparklePositions, sparkleCount } = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = Math.random() * 7 + 1.0; // East side
      positions[i * 3 + 1] = Math.random() * 3.5 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return { sparklePositions: positions, sparkleCount: count };
  }, []);

  // Drought Fog Geometry
  const { fogPositions } = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 0.6 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return { fogPositions: positions };
  }, []);

  useFrame((_, delta) => {
    if (!isRaining && !hasRevenue && !drought) return;

    // Rain Animation
    if (rainRef.current && isRaining) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= delta * 9;
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 8 + Math.random() * 2;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Sparkles Floating Animation
    if (sparklesRef.current && hasRevenue) {
      const positions = sparklesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(Date.now() * 0.002 + i) * 0.005;
      }
      sparklesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Fog Animation
    if (fogRef.current && drought) {
      fogRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* 1. Welcome-Back Soothing Rain Shower */}
      {isRaining && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[rainPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#38bdf8"
            transparent
            opacity={0.7}
          />
        </points>
      )}

      {/* 2. Golden Sales Revenue Sparkles */}
      {hasRevenue && (
        <points ref={sparklesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparklePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#fbbf24"
            transparent
            opacity={0.85}
          />
        </points>
      )}

      {/* 3. Drought Fog Atmosphere */}
      {drought && (
        <points ref={fogRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[fogPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            color="#78716c"
            transparent
            opacity={0.3}
          />
        </points>
      )}
    </group>
  );
}

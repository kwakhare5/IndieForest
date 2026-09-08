"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WeatherProps {
  drought?: boolean;
  isRaining?: boolean;
  hasRevenue?: boolean;
  isNight?: boolean;
  isSunset?: boolean;
}

export function Weather({
  drought: _drought = false,
  isRaining = false,
  hasRevenue = false,
  isNight: _isNight = false,
  isSunset: _isSunset = false,
}: WeatherProps) {
  const rainRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);

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

  // Revenue Sparkles Geometry (Golden Coins Hovering Over Active Revenue Oaks)
  const { sparklePositions, sparkleCount } = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 2.5 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return { sparklePositions: positions, sparkleCount: count };
  }, []);

  useFrame((_) => {
    if (!isRaining && !hasRevenue) return;

    // Rain Animation
    if (rainRef.current && isRaining) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.28;
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 14;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Revenue Sparkles Animation
    if (sparklesRef.current && hasRevenue) {
      const positions = sparklesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(Date.now() * 0.002 + i) * 0.005;
      }
      sparklesRef.current.geometry.attributes.position.needsUpdate = true;
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

    </group>
  );
}

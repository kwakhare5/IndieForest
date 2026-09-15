"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CampfireProps {
  isNight?: boolean;
  isSunset?: boolean;
  drought?: boolean;
  wireframe?: boolean;
  palette?: "canonical" | "sunnyside" | "tabletop";
}

function CampfireEmbers() {
  const embersRef = useRef<THREE.Group>(null);
  const emberPositions = React.useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      seed: i * 0.73,
      speed: 0.32 + (i % 5) * 0.08,
      radius: 0.06 + (i % 4) * 0.05,
      angle: (i / 14) * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!embersRef.current) return;
    const t = clock.elapsedTime;
    embersRef.current.children.forEach((child, i) => {
      const p = emberPositions[i];
      const cycle = (t * p.speed + p.seed) % 1;
      child.position.y = 0.2 + cycle * 0.85;
      const sway = Math.sin(t * 2.5 + p.seed) * 0.03;
      child.position.x = Math.cos(p.angle) * p.radius * (1 + cycle * 1.4) + sway;
      child.position.z = Math.sin(p.angle) * p.radius * (1 + cycle * 1.4) + sway;
      const s = Math.sin(cycle * Math.PI) * 0.032;
      child.scale.set(s, s, s);
    });
  });

  return (
    <group ref={embersRef}>
      {emberPositions.map((_, i) => (
        <mesh key={i}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#f59e0b" : "#fef08a"} />
        </mesh>
      ))}
    </group>
  );
}

// Low-Poly Tabletop Campfire — 10-Rock Hearth, Triangular Log Benches, Jagged Tetrahedron Flame Cluster
export function Campfire({
  isNight = false,
  isSunset = false,
  drought = false,
  wireframe = false,
  palette = "tabletop",
}: CampfireProps) {
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameGroupRef = useRef<THREE.Group>(null);
  const isTabletop = palette === "tabletop";

  const rockColor = isTabletop ? "#A0A09B" : "#94a3b8";
  const logColor = isTabletop ? "#8B5A2B" : "#6e3f1e";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fireLightRef.current) {
      const baseIntensity = drought ? 0.6 : isNight ? 2.8 : isSunset ? 1.9 : 1.4;
      fireLightRef.current.intensity =
        baseIntensity + Math.sin(t * 12) * 0.3 + Math.cos(t * 19) * 0.15;
    }
    if (flameGroupRef.current && !drought) {
      flameGroupRef.current.scale.y = 1 + Math.sin(t * 14) * 0.12;
      flameGroupRef.current.rotation.y = Math.sin(t * 3) * 0.08;
    }
  });

  // 3 Triangular Log Bench Positions (Equilateral triangle around hearth)
  const triangleBenches = [
    { x: 0, z: -0.82, rotY: 0, length: 0.95 },
    { x: -0.72, z: 0.42, rotY: (2 * Math.PI) / 3, length: 0.95 },
    { x: 0.72, z: 0.42, rotY: -(2 * Math.PI) / 3, length: 0.95 },
  ];

  return (
    <group>
      {/* 1. Hearth: Ring of 10 Decimated Low-Poly Stones */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const dist = 0.42 + (i % 3) * 0.03;
        return (
          <mesh
            key={`stone-${i}`}
            position={[Math.cos(angle) * dist, 0.055, Math.sin(angle) * dist]}
            rotation={[i * 0.35, i * 0.55, i * 0.25]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial
              color={rockColor}
              roughness={1.0}
              metalness={0.0}
              flatShading={true}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 2. Inner Charcoal Ash & Ember Bed */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.04, 8]} />
        <meshStandardMaterial
          color="#3A1D13"
          emissive="#DC2626"
          emissiveIntensity={drought ? 0.4 : 1.2}
          roughness={1.0}
          flatShading
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Crossed Kindling Logs */}
      {[0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4].map((angle, i) => (
        <mesh
          key={`wood-${i}`}
          position={[Math.cos(angle) * 0.06, 0.07, Math.sin(angle) * 0.06]}
          rotation={[0.2, angle, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.035, 0.045, 0.44, 6]} />
          <meshStandardMaterial color="#5C341B" roughness={1.0} flatShading />
        </mesh>
      ))}

      {/* 4. Jagged Low-Poly Tetrahedron Flame Cluster */}
      {!drought && (
        <group ref={flameGroupRef} position={[0, 0.16, 0]}>
          {/* Primary Central Orange Tetrahedron */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0.2, 0]}>
            <tetrahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#F97316"
              emissive="#EA580C"
              emissiveIntensity={isNight ? 2.6 : 1.6}
              roughness={0.4}
              flatShading={true}
              wireframe={wireframe}
            />
          </mesh>

          {/* Secondary Yellow Spire Tetrahedron */}
          <mesh position={[0.02, 0.16, -0.02]} rotation={[0.4, 0.8, -0.2]}>
            <tetrahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#EAB308"
              emissiveIntensity={isNight ? 3.0 : 2.0}
              roughness={0.3}
              flatShading={true}
              wireframe={wireframe}
            />
          </mesh>

          {/* Side Outer Ember Flakes */}
          <mesh position={[-0.08, 0.08, 0.06]} rotation={[-0.2, 0.5, 0.4]}>
            <tetrahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#FB923C"
              emissive="#EA580C"
              emissiveIntensity={1.8}
              roughness={0.4}
              flatShading={true}
            />
          </mesh>
          <mesh position={[0.08, 0.08, -0.05]} rotation={[0.3, -0.6, 0.2]}>
            <tetrahedronGeometry args={[0.11, 0]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#F59E0B"
              emissiveIntensity={2.0}
              roughness={0.4}
              flatShading={true}
            />
          </mesh>
        </group>
      )}

      {/* 5. Glowing Campfire Point Light */}
      <pointLight
        ref={fireLightRef}
        position={[0, 0.38, 0]}
        color={drought ? "#F59E0B" : "#F97316"}
        intensity={drought ? 0.6 : isNight ? 2.8 : 1.4}
        distance={drought ? 2.5 : 4.8}
        decay={2}
      />

      {/* 6. Rising Embers */}
      {!drought && <CampfireEmbers />}

      {/* 7. Three Triangular Log Benches (Surrounding Triangle) */}
      {triangleBenches.map((bench, idx) => (
        <group key={`triangle-bench-${idx}`} position={[bench.x, 0.08, bench.z]} rotation={[0, bench.rotY, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.095, bench.length, 7]} />
            <meshStandardMaterial color={logColor} roughness={1.0} flatShading={true} />
          </mesh>
          {/* Flat Growth Ring Caps */}
          <mesh position={[-bench.length / 2 - 0.002, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.078, 7]} />
            <meshStandardMaterial color="#D4A86A" roughness={1.0} flatShading={true} />
          </mesh>
          <mesh position={[bench.length / 2 + 0.002, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.078, 7]} />
            <meshStandardMaterial color="#D4A86A" roughness={1.0} flatShading={true} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

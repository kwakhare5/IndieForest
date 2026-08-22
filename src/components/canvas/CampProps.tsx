"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Flame, Tent, Home, Shield } from "lucide-react";

interface CampPropsComponentProps {
  streakDays?: number;
  level?: number;
  streakShields?: number;
  onClickCampfire?: () => void;
  onClickTent?: () => void;
  onClickCabin?: () => void;
  drought?: boolean;
}

export function CampProps({
  streakDays = 1,
  level = 1,
  streakShields = 0,
  onClickCampfire,
  onClickTent,
  onClickCabin,
  drought = false,
}: CampPropsComponentProps) {
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);

  const [hoveredProp, setHoveredProp] = useState<"campfire" | "tent" | "cabin" | null>(null);

  // Campfire flame flicker animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fireLightRef.current && !drought) {
      fireLightRef.current.intensity = 1.2 + Math.sin(t * 12) * 0.4 + Math.cos(t * 19) * 0.2;
    }
    if (flameMeshRef.current && !drought) {
      flameMeshRef.current.scale.y = 1 + Math.sin(t * 15) * 0.15;
      flameMeshRef.current.rotation.y = t * 2;
    }
  });

  // Milestone Unlocks based on streak & level
  const hasCampfire = streakDays >= 1 || level >= 1;
  const hasTent = streakDays >= 3 || level >= 3;
  const hasCabin = streakDays >= 7 || level >= 5;

  // Campsite Location: South-West pasture quadrant
  // Coordinates around [-2.2, 0.25, 2.2]
  const campfirePos: [number, number, number] = [-2.2, 0.25, 2.2];
  const tentPos: [number, number, number] = [-3.0, 0.25, 1.2];
  const cabinPos: [number, number, number] = [-2.8, 0.25, -1.8];
  const flagPos: [number, number, number] = [-3.4, 0.25, -3.2];

  return (
    <group>
      {/* 1. Milestone Campfire (Daily Focus Station) */}
      {hasCampfire && (
        <group
          position={campfirePos}
          onClick={(e) => {
            e.stopPropagation();
            onClickCampfire?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("campfire");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          {/* Stone Ring */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const angle = (i / 7) * Math.PI * 2;
            const r = 0.38;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
                rotation={[0, angle, 0]}
                castShadow
              >
                <dodecahedronGeometry args={[0.07, 0]} />
                <meshStandardMaterial color={drought ? "#78716c" : "#94a3b8"} roughness={0.9} flatShading />
              </mesh>
            );
          })}

          {/* Wooden Logs in Triangle */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.12, 0.06, Math.sin(angle) * 0.12]}
              rotation={[0.3, angle, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.05, 0.45, 6]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
            </mesh>
          ))}

          {/* Glowing Flame Core */}
          {!drought ? (
            <>
              <mesh ref={flameMeshRef} position={[0, 0.18, 0]}>
                <coneGeometry args={[0.16, 0.35, 5]} />
                <meshStandardMaterial
                  color="#f97316"
                  emissive="#ea580c"
                  emissiveIntensity={1.4}
                  roughness={0.2}
                  flatShading
                />
              </mesh>
              <pointLight
                ref={fireLightRef}
                position={[0, 0.3, 0]}
                color="#f97316"
                intensity={1.2}
                distance={3.5}
                decay={2}
              />
            </>
          ) : (
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshStandardMaterial color="#44403c" roughness={1} flatShading />
            </mesh>
          )}

          {/* Clickable Tooltip Badge */}
          <Html
            position={[0, 0.75, 0]}
            center
            distanceFactor={13}
            className="pointer-events-none select-none transition-transform duration-200"
            style={{ transform: hoveredProp === "campfire" ? "scale(1.1)" : "scale(0.95)" }}
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-stone-900 border border-stone-200/90 shadow-md text-[10px] font-bold">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span>Campfire Focus</span>
            </div>
          </Html>
        </group>
      )}

      {/* 2. Canvas Tent (Day 7+ Streak Shield Vault & Rest Mode) */}
      {hasTent && (
        <group
          position={tentPos}
          rotation={[0, 0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickTent?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("tent");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          {/* A-Frame Tent Body */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.65, 0.85, 4]} />
            <meshStandardMaterial
              color={drought ? "#a8a29e" : "#fef3c7"}
              roughness={0.7}
              metalness={0.05}
              flatShading
            />
          </mesh>

          {/* Tent Ridge Pole */}
          <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>

          {/* Triangular Front Flap */}
          <mesh position={[0, 0.25, 0.42]} rotation={[0.1, 0, 0]}>
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>

          {/* Tooltip Badge */}
          <Html
            position={[0, 1.15, 0]}
            center
            distanceFactor={13}
            className="pointer-events-none select-none transition-transform duration-200"
            style={{ transform: hoveredProp === "tent" ? "scale(1.1)" : "scale(0.95)" }}
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-stone-900 border border-stone-200/90 shadow-md text-[10px] font-bold">
              <Tent className="w-3 h-3 text-amber-600" />
              <span>Rest Vault</span>
              {streakShields > 0 && (
                <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-100 px-1 rounded text-[9px]">
                  <Shield className="w-2.5 h-2.5 fill-emerald-600" />
                  {streakShields}
                </span>
              )}
            </div>
          </Html>
        </group>
      )}

      {/* 3. Timber Log Cabin (Day 14+ War Room Command HQ) */}
      {hasCabin && (
        <group
          position={cabinPos}
          rotation={[0, -0.3, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickCabin?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredProp("cabin");
          }}
          onPointerOut={() => setHoveredProp(null)}
        >
          {/* Main Cabin Body */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.9, 1.0]} />
            <meshStandardMaterial
              color={drought ? "#57534e" : "#78350f"}
              roughness={0.8}
              metalness={0.05}
              flatShading
            />
          </mesh>

          {/* Pitched Cedar Roof */}
          <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.05, 0.6, 4]} />
            <meshStandardMaterial
              color={drought ? "#44403c" : "#92400e"}
              roughness={0.7}
              flatShading
            />
          </mesh>

          {/* Glowing Amber Window */}
          <mesh position={[0.3, 0.5, 0.51]}>
            <planeGeometry args={[0.28, 0.28]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive={drought ? "#000000" : "#facc15"}
              emissiveIntensity={0.9}
            />
          </mesh>

          {/* Wooden Door */}
          <mesh position={[-0.25, 0.35, 0.51]}>
            <planeGeometry args={[0.3, 0.65]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>

          {/* Chimney */}
          <mesh position={[0.35, 1.15, -0.2]} castShadow>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
          </mesh>

          {/* Tooltip Badge */}
          <Html
            position={[0, 1.65, 0]}
            center
            distanceFactor={13}
            className="pointer-events-none select-none transition-transform duration-200"
            style={{ transform: hoveredProp === "cabin" ? "scale(1.1)" : "scale(0.95)" }}
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-stone-900 border border-stone-200/90 shadow-md text-[10px] font-bold">
              <Home className="w-3 h-3 text-amber-800" />
              <span>War Room</span>
            </div>
          </Html>
        </group>
      )}

      {/* 4. Startup Flagpole (North-West Bluff) */}
      <group position={flagPos}>
        {/* Stone Base */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.16, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
        </mesh>
        {/* Silver Mast */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 2.0, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Waving Emerald Flag */}
        <mesh position={[0.22, 1.75, 0]}>
          <planeGeometry args={[0.42, 0.26]} />
          <meshStandardMaterial
            color={drought ? "#78716c" : "#10b981"}
            side={THREE.DoubleSide}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* 5. Night Lantern Posts */}
      <group position={[0.45, 0.25, -1.8]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={drought ? "#000000" : "#facc15"}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

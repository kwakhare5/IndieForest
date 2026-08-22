"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Text, Billboard } from "@react-three/drei";
import {
  Sun,
  Sunset,
  Moon,
  RotateCw,
  Layers,
  ArrowLeft,
  Eye,
  Trees,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { sound } from "@/lib/sound";
import type { TimeOfDay, TreeData } from "@/types/game";

// Dedicated Modular 3D Components
import { ConiferTree } from "@/components/canvas/models/ConiferTree";
import { DeciduousTree } from "@/components/canvas/models/DeciduousTree";
import { ZenStump } from "@/components/canvas/models/ZenStump";
import { Campfire } from "@/components/canvas/models/Campfire";
import { CanvasTent } from "@/components/canvas/models/CanvasTent";
import { LogCabin } from "@/components/canvas/models/LogCabin";
import { Flagpole } from "@/components/canvas/models/Flagpole";
import { LanternPost } from "@/components/canvas/models/LanternPost";
import { RobinBird } from "@/components/canvas/models/RobinBird";
import { CampDog } from "@/components/canvas/models/CampDog";
import { TerrainIsland } from "@/components/canvas/TerrainIsland";
import { BlockTree } from "@/components/canvas/BlockTree";
import { CampProps } from "@/components/canvas/CampProps";

// Native WebGL Billboard 3D Label (Zero DOM / Zero Glitching)
function SubtleLabel({
  text,
  y = 1.6,
  isNight = false,
}: {
  text: string;
  y?: number;
  isNight?: boolean;
}) {
  return (
    <Billboard position={[0, y, 0]} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        fontSize={0.22}
        color={isNight ? "#f5f5f4" : "#1c1917"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isNight ? "#000000" : "#ffffff"}
      >
        {text}
      </Text>
    </Billboard>
  );
}

// Low-Poly Island Showroom Pedestal
function Pedestal({
  position,
  children,
  radius = 0.95,
  label,
  labelY,
  isNight = false,
  wireframe = false,
}: {
  position: [number, number, number];
  children: React.ReactNode;
  radius?: number;
  label?: string;
  labelY?: number;
  isNight?: boolean;
  wireframe?: boolean;
}) {
  return (
    <group position={position}>
      {/* 8-Sided Tactile Pedestal Block */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.08, 0.16, 8]} />
        <meshStandardMaterial
          color={isNight ? "#1e293b" : "#f5f5f4"}
          roughness={0.8}
          metalness={0.05}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
      {/* Top Porcelain Rim Ring */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.85, radius * 0.98, 8]} />
        <meshBasicMaterial
          color={isNight ? "#334155" : "#e7e5e4"}
          transparent
          opacity={0.8}
          wireframe={wireframe}
        />
      </mesh>
      {/* Mounted 3D Asset */}
      <group position={[0, 0.16, 0]}>{children}</group>
      {/* Hover Floating Billboard Label */}
      {label && <SubtleLabel text={label} y={labelY || 1.6} isNight={isNight} />}
    </group>
  );
}

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"catalog" | "diorama">("diorama");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  // Lighting parameters calibrated to Studio Linen and Night Glow
  const ambientIntensity = isNight ? 0.35 : isSunset ? 0.85 : 0.95;
  const ambientColor = isNight ? "#38bdf8" : isSunset ? "#fdba74" : "#ffffff";
  const sunIntensity = isNight ? 0.15 : isSunset ? 1.5 : 1.25;
  const sunColor = isNight ? "#60a5fa" : isSunset ? "#fb923c" : "#fffbeb";
  const rimIntensity = isNight ? 0.8 : isSunset ? 0.6 : 0.45;
  const rimColor = isNight ? "#818cf8" : isSunset ? "#f43f5e" : "#e0e7ff";

  // Full-Capacity Sample Island Data (16 trees generously spaced across 13x12.5 island)
  const fullIslandTrees: TreeData[] = useMemo(() => {
    return [
      // --- WEST / NORTH-WEST: GITHUB SHIPPING CONIFER GROVE ---
      { id: "tree-c1", name: "IndieForest", type: "shipping", tier: "majestic", commits: 142, gridX: -3.8, gridZ: -3.2, plantedAt: "2026-08-01" },
      { id: "tree-c2", name: "NextEngine", type: "shipping", tier: "mature", commits: 68, gridX: -2.0, gridZ: -3.6, plantedAt: "2026-08-03" },
      { id: "tree-c3", name: "VibeCLI", type: "shipping", tier: "young", commits: 24, gridX: -4.0, gridZ: -1.2, plantedAt: "2026-08-08" },
      { id: "tree-c4", name: "AgentSDK", type: "shipping", tier: "sapling", commits: 8, gridX: -2.4, gridZ: -1.0, plantedAt: "2026-08-15" },
      { id: "tree-c5", name: "TurboSync", type: "shipping", tier: "mature", commits: 54, gridX: -0.6, gridZ: -3.0, plantedAt: "2026-08-05" },
      { id: "tree-c6", name: "MicroSaaS", type: "shipping", tier: "young", commits: 19, gridX: -3.6, gridZ: 0.6, plantedAt: "2026-08-10" },
      { id: "tree-c7", name: "DocsBot", type: "shipping", tier: "sapling", commits: 4, gridX: -2.0, gridZ: 0.8, plantedAt: "2026-08-18" },
      { id: "tree-c8", name: "LegacyApp", type: "shipping", tier: "stump", commits: 1, gridX: -0.8, gridZ: -1.4, plantedAt: "2026-07-20" },

      // --- EAST / NORTH-EAST: STRIPE REVENUE MONEY OAK ORCHARD ---
      { id: "tree-r1", name: "SaaS Core", type: "revenue", tier: "majestic", mrr: 3200, gridX: 3.8, gridZ: -3.2, plantedAt: "2026-08-01" },
      { id: "tree-r2", name: "Pro Plan", type: "revenue", tier: "mature", mrr: 1450, gridX: 2.0, gridZ: -3.6, plantedAt: "2026-08-04" },
      { id: "tree-r3", name: "Team Tier", type: "revenue", tier: "young", mrr: 590, gridX: 4.0, gridZ: -1.2, plantedAt: "2026-08-09" },
      { id: "tree-r4", name: "Starter Tier", type: "revenue", tier: "sapling", mrr: 99, gridX: 2.4, gridZ: -1.0, plantedAt: "2026-08-14" },
      { id: "tree-r5", name: "Lifetime Pass", type: "revenue", tier: "mature", mrr: 1200, gridX: 0.6, gridZ: -3.0, plantedAt: "2026-08-06" },
      { id: "tree-r6", name: "Addon Packs", type: "revenue", tier: "young", mrr: 340, gridX: 3.6, gridZ: 0.6, plantedAt: "2026-08-11" },
      { id: "tree-r7", name: "New Sprout", type: "revenue", tier: "sapling", mrr: 29, gridX: 2.0, gridZ: 0.8, plantedAt: "2026-08-19" },
      { id: "tree-r8", name: "Churned Tier", type: "revenue", tier: "stump", mrr: 0, gridX: 0.8, gridZ: -1.4, plantedAt: "2026-07-15" },
    ];
  }, []);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none transition-colors duration-500 ${
        isNight
          ? "bg-[#090d16] text-stone-100"
          : isSunset
          ? "bg-[#ecdcd3] text-stone-900"
          : "bg-[#ece7de] text-stone-900"
      }`}
    >
      {/* 1. 3D WebGL Canvas Viewport */}
      <Canvas
        camera={{ position: viewMode === "diorama" ? [14.5, 9.0, 14.5] : [14, 12, 14], fov: 32 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={4}
            maxDistance={35}
            target={viewMode === "diorama" ? [0, 0.35, 0] : [0, 0.5, 0]}
          />

          {/* Lighting Environment */}
          <ambientLight intensity={ambientIntensity} color={ambientColor} />
          <directionalLight
            position={[12, 18, 10]}
            intensity={sunIntensity}
            color={sunColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={14}
            shadow-camera-bottom={-14}
          />
          <directionalLight
            position={[-12, 10, -12]}
            intensity={rimIntensity}
            color={rimColor}
          />

          {/* Soft Ground Contact Shadows */}
          <ContactShadows
            position={[0, viewMode === "diorama" ? -0.48 : 0, 0]}
            opacity={isNight ? 0.65 : 0.45}
            scale={28}
            blur={2.4}
            far={10}
          />

          {/* ========================================================================= */}
          {/* MODE A: FULL LIVING ISLAND DIORAMA PREVIEW (Hay Day Inspired Farm)       */}
          {/* ========================================================================= */}
          {viewMode === "diorama" && (
            <group position={[0, 0, 0]}>
              {/* Living Island Ground Terrain Slab */}
              <TerrainIsland level={20} drought={false} />

              {/* 16 Shipping & Revenue Trees (North Ridge & East Orchard, uncluttered with hover badges) */}
              {fullIslandTrees.map((tree) => (
                <BlockTree key={tree.id} tree={tree} showBadge={false} />
              ))}

              {/* Full Campsite Homestead Hub (South-West / South Facing Camera) */}
              <CampProps
                streakDays={14}
                level={20}
                streakShields={2}
                timeOfDay={timeOfDay}
                showBadges={false}
              />
            </group>
          )}

          {/* ========================================================================= */}
          {/* MODE B: INDIVIDUAL ASSET SHOWROOM CATALOG (Pedestal Sets in 4 Rows)      */}
          {/* ========================================================================= */}
          {viewMode === "catalog" && (
            <group position={[0, 0, 0]}>
              {/* ROW 1: GITHUB ALPINE CONIFER LINEAGE */}
              <group position={[0, 0, -4.5]}>
                <Pedestal position={[-4.5, 0, 0]} label="Stage 1: Crop Sprout" labelY={1.1} isNight={isNight} wireframe={wireframe}>
                  <ConiferTree tier="sapling" />
                </Pedestal>
                <Pedestal position={[-1.5, 0, 0]} label="Stage 2: Young Pine" labelY={1.5} isNight={isNight} wireframe={wireframe}>
                  <ConiferTree tier="young" />
                </Pedestal>
                <Pedestal position={[1.5, 0, 0]} label="Stage 3: Mountain Cedar" labelY={2.1} isNight={isNight} wireframe={wireframe}>
                  <ConiferTree tier="mature" />
                </Pedestal>
                <Pedestal position={[4.5, 0, 0]} label="Stage 4: Majestic Pine" labelY={2.7} isNight={isNight} wireframe={wireframe}>
                  <ConiferTree tier="majestic" />
                </Pedestal>
              </group>

              {/* ROW 2: STRIPE REVENUE GOLDEN MONEY OAK LINEAGE */}
              <group position={[0, 0, -1.5]}>
                <Pedestal position={[-4.5, 0, 0]} label="Stage 1: Gold Sprout" labelY={1.1} isNight={isNight} wireframe={wireframe}>
                  <DeciduousTree tier="sapling" />
                </Pedestal>
                <Pedestal position={[-1.5, 0, 0]} label="Stage 2: Golden Ginkgo" labelY={1.5} isNight={isNight} wireframe={wireframe}>
                  <DeciduousTree tier="young" />
                </Pedestal>
                <Pedestal position={[1.5, 0, 0]} label="Stage 3: Golden Oak" labelY={2.1} isNight={isNight} wireframe={wireframe}>
                  <DeciduousTree tier="mature" />
                </Pedestal>
                <Pedestal position={[4.5, 0, 0]} label="Stage 4: Solar Money Oak" labelY={2.7} isNight={isNight} wireframe={wireframe}>
                  <DeciduousTree tier="majestic" />
                </Pedestal>
              </group>

              {/* ROW 3: CAMPSITE STRUCTURES & ZEN STUMP */}
              <group position={[0, 0, 1.5]}>
                <Pedestal position={[-4.5, 0, 0]} label="Focus Campfire" labelY={1.4} isNight={isNight} wireframe={wireframe}>
                  <Campfire isNight={isNight} />
                </Pedestal>
                <Pedestal position={[-1.5, 0, 0]} label="Sabbatical Tent" labelY={1.6} isNight={isNight} wireframe={wireframe}>
                  <CanvasTent />
                </Pedestal>
                <Pedestal position={[1.5, 0, 0]} label="War Room Cabin" labelY={1.8} isNight={isNight} wireframe={wireframe}>
                  <LogCabin isNight={isNight} />
                </Pedestal>
                <Pedestal position={[4.5, 0, 0]} label="Zen Sabbatical Stump" labelY={1.2} isNight={isNight} wireframe={wireframe}>
                  <ZenStump />
                </Pedestal>
              </group>

              {/* ROW 4: LIVING WILDLIFE & PROPS */}
              <group position={[0, 0, 4.5]}>
                <Pedestal position={[-4.5, 0, 0]} label="Streak Flagpole" labelY={2.6} isNight={isNight} wireframe={wireframe}>
                  <Flagpole />
                </Pedestal>
                <Pedestal position={[-1.5, 0, 0]} label="Camp Lantern" labelY={2.1} isNight={isNight} wireframe={wireframe}>
                  <LanternPost isNight={isNight} />
                </Pedestal>
                <Pedestal position={[1.5, 0, 0]} label="Robin Bird" labelY={1.2} isNight={isNight} wireframe={wireframe}>
                  <RobinBird />
                </Pedestal>
                <Pedestal position={[4.5, 0, 0]} label="Camp Shiba Dog" labelY={1.2} isNight={isNight} wireframe={wireframe}>
                  <CampDog />
                </Pedestal>
              </group>
            </group>
          )}
        </Suspense>
      </Canvas>

      {/* 2. Top Navigation Bar & View Controls */}
      <div className="fixed top-5 inset-x-5 z-40 flex items-center justify-between pointer-events-none font-satoshi">
        {/* Left: Return to Dashboard & Title */}
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={() => sound.playClick()}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md text-stone-700 hover:text-stone-950 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md flex items-center gap-2">
            <span className="font-bold text-xs text-stone-900">3D Showroom</span>
            <Badge variant="stone" size="sm">
              {viewMode === "diorama" ? "Living Farm Island" : "Asset Catalog"}
            </Badge>
          </div>
        </div>

        {/* Center: View Mode Segmented Switcher */}
        <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-xl flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-stone-300">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode("diorama");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "diorama"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-950"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Full Living Island</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode("catalog");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "catalog"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-950"
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Asset Catalog</span>
          </button>
        </div>

        {/* Right: Lighting, Wireframe & Turntable Controls */}
        <div className="pointer-events-auto flex items-center gap-2 p-1 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md">
          {/* Lighting Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setTimeOfDay(
                timeOfDay === "day"
                  ? "sunset"
                  : timeOfDay === "sunset"
                  ? "night"
                  : "day"
              );
            }}
            className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            title={`Lighting: ${timeOfDay.toUpperCase()}`}
          >
            {timeOfDay === "sunset" ? (
              <Sunset className="w-4 h-4 text-amber-600" />
            ) : timeOfDay === "night" ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Wireframe Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setWireframe(!wireframe);
            }}
            className={`p-2 rounded-full transition cursor-pointer ${
              wireframe
                ? "bg-emerald-100 text-emerald-800"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
            title="Toggle Wireframe Mesh"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Auto-Rotate Turntable Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`p-2 rounded-full transition cursor-pointer ${
              autoRotate
                ? "bg-emerald-100 text-emerald-800"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
            title="Toggle 360° Turntable Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Guide Legend */}
      <div className="fixed bottom-6 inset-x-4 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto p-2.5 px-4 rounded-full bg-white/95 backdrop-blur-xs border border-stone-300 shadow-2xl shadow-stone-900/15 flex items-center flex-wrap justify-center gap-2 sm:gap-4 text-xs font-mono text-stone-700">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>{viewMode === "diorama" ? "Hay Day Composition:" : "Showroom Lineages:"}</span>
          </div>

          {viewMode === "diorama" ? (
            <>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                West Ridge: 8 GitHub Shipping Pines
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                East Orchard: 8 Stripe Revenue Oaks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                South Homestead: Cabin HQ · Tent · Campfire · Dog · Robin
              </span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                Row 1: Conifers
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Row 2: Revenue Oaks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
                Row 3: Campsite
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-200">
                Row 4: Living Wildlife & Props
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

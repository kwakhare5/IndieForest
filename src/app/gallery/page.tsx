"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
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
  Crown,
} from "lucide-react";
import { sound } from "@/lib/sound";
import type { TimeOfDay, TreeData } from "@/types/game";

// Dedicated Modular 3D Components
import { Campfire } from "@/components/canvas/models/Campfire";
import { CanvasTent } from "@/components/canvas/models/CanvasTent";
import { LogCabin } from "@/components/canvas/models/LogCabin";
import { Flagpole } from "@/components/canvas/models/Flagpole";
import { LanternPost } from "@/components/canvas/models/LanternPost";
import { RobinBird } from "@/components/canvas/models/RobinBird";
import { CampDog } from "@/components/canvas/models/CampDog";
import { Windmill } from "@/components/canvas/models/Windmill";
import { HarborPier } from "@/components/canvas/models/HarborPier";
import { Lighthouse } from "@/components/canvas/models/Lighthouse";
import { ModularIsland } from "@/components/canvas/ModularIsland";
import { BlockTree } from "@/components/canvas/BlockTree";

import { ShowroomCatalog } from "@/components/gallery/ShowroomCatalog";

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"diorama" | "catalog">("diorama");
  const [displayLevel, setDisplayLevel] = useState<number>(50);
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

  // =========================================================================
  // CANONICAL BILATERAL TITAN FARMSTEAD (HAY DAY EMPIRE LAYOUT)
  // =========================================================================
  const bilateralTrees: TreeData[] = useMemo(() => {
    return [
      // West Half: 14 GitHub Shipping Conifers
      { id: "t2-c1", name: "IndieForest", type: "shipping", tier: "majestic", commits: 342, gridX: -6.5, gridZ: -5.5, plantedAt: "2026-08-01" },
      { id: "t2-c2", name: "NextEngine", type: "shipping", tier: "majestic", commits: 268, gridX: -4.2, gridZ: -5.5, plantedAt: "2026-08-02" },
      { id: "t2-c3", name: "AgentSDK", type: "shipping", tier: "mature", commits: 154, gridX: -2.0, gridZ: -5.5, plantedAt: "2026-08-03" },
      { id: "t2-c4", name: "TurboSync", type: "shipping", tier: "mature", commits: 112, gridX: -6.8, gridZ: -3.5, plantedAt: "2026-08-04" },
      { id: "t2-c5", name: "VibeCLI", type: "shipping", tier: "young", commits: 45, gridX: -4.6, gridZ: -3.5, plantedAt: "2026-08-05" },
      { id: "t2-c6", name: "MicroSaaS", type: "shipping", tier: "young", commits: 38, gridX: -2.4, gridZ: -3.5, plantedAt: "2026-08-06" },
      { id: "t2-c7", name: "AuthModule", type: "shipping", tier: "mature", commits: 88, gridX: -6.2, gridZ: -1.5, plantedAt: "2026-08-07" },
      { id: "t2-c8", name: "DocsBot", type: "shipping", tier: "sapling", commits: 12, gridX: -4.0, gridZ: -1.5, plantedAt: "2026-08-08" },
      { id: "t2-c9", name: "DesignSystem", type: "shipping", tier: "young", commits: 52, gridX: -1.8, gridZ: -1.5, plantedAt: "2026-08-09" },
      { id: "t2-c10", name: "Graphify", type: "shipping", tier: "mature", commits: 95, gridX: -5.8, gridZ: 0.5, plantedAt: "2026-08-10" },
      { id: "t2-c11", name: "SeedlingA", type: "shipping", tier: "sapling", commits: 6, gridX: -3.6, gridZ: 0.5, plantedAt: "2026-08-11" },
      { id: "t2-c12", name: "SeedlingB", type: "shipping", tier: "sapling", commits: 4, gridX: -1.4, gridZ: 0.5, plantedAt: "2026-08-12" },
      { id: "t2-c13", name: "ZenStump1", type: "shipping", tier: "stump", commits: 1, gridX: -6.4, gridZ: 2.2, plantedAt: "2026-07-01" },
      { id: "t2-c14", name: "ZenStump2", type: "shipping", tier: "stump", commits: 1, gridX: -3.8, gridZ: 2.2, plantedAt: "2026-07-15" },

      // East Half: 14 Stripe Revenue Oaks
      { id: "t2-r1", name: "SaaS Core", type: "revenue", tier: "majestic", mrr: 8400, gridX: 6.5, gridZ: -5.5, plantedAt: "2026-08-01" },
      { id: "t2-r2", name: "Pro Plan", type: "revenue", tier: "majestic", mrr: 5200, gridX: 4.2, gridZ: -5.5, plantedAt: "2026-08-02" },
      { id: "t2-r3", name: "Team Tier", type: "revenue", tier: "mature", mrr: 2400, gridX: 2.0, gridZ: -5.5, plantedAt: "2026-08-03" },
      { id: "t2-r4", name: "Enterprise", type: "revenue", tier: "mature", mrr: 1900, gridX: 6.8, gridZ: -3.5, plantedAt: "2026-08-04" },
      { id: "t2-r5", name: "Lifetime Pass", type: "revenue", tier: "mature", mrr: 1600, gridX: 4.6, gridZ: -3.5, plantedAt: "2026-08-05" },
      { id: "t2-r6", name: "Starter Tier", type: "revenue", tier: "young", mrr: 750, gridX: 2.4, gridZ: -3.5, plantedAt: "2026-08-06" },
      { id: "t2-r7", name: "Addon Packs", type: "revenue", tier: "young", mrr: 450, gridX: 6.2, gridZ: -1.5, plantedAt: "2026-08-07" },
      { id: "t2-r8", name: "API Usage", type: "revenue", tier: "young", mrr: 320, gridX: 4.0, gridZ: -1.5, plantedAt: "2026-08-08" },
      { id: "t2-r9", name: "Consulting", type: "revenue", tier: "mature", mrr: 1200, gridX: 1.8, gridZ: -1.5, plantedAt: "2026-08-09" },
      { id: "t2-r10", name: "Merch Shop", type: "revenue", tier: "sapling", mrr: 89, gridX: 5.8, gridZ: 0.5, plantedAt: "2026-08-10" },
      { id: "t2-r11", name: "Affiliates", type: "revenue", tier: "sapling", mrr: 45, gridX: 3.6, gridZ: 0.5, plantedAt: "2026-08-11" },
      { id: "t2-r12", name: "Beta Plan", type: "revenue", tier: "sapling", mrr: 29, gridX: 1.4, gridZ: 0.5, plantedAt: "2026-08-12" },
      { id: "t2-r13", name: "OldSaaStump", type: "revenue", tier: "stump", mrr: 0, gridX: 6.4, gridZ: 2.2, plantedAt: "2026-07-01" },
      { id: "t2-r14", name: "RefundStump", type: "revenue", tier: "stump", mrr: 0, gridX: 3.8, gridZ: 2.2, plantedAt: "2026-07-15" },
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
      {/* 1. 3D WebGL Canvas Viewport (Calibrated to Match Dashboard Orthographic Rig at Titan Scale) */}
      <Canvas
        key={viewMode}
        orthographic={viewMode === "diorama"}
        camera={
          viewMode === "diorama"
            ? { position: [18.5, 12.0, 18.5], zoom: 28, near: -150, far: 300 }
            : { position: [14, 12, 14], fov: 32 }
        }
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            enablePan={false}
            enableRotate={viewMode === "catalog" || autoRotate}
            maxPolarAngle={Math.PI / 2.1}
            minZoom={viewMode === "diorama" ? 20 : undefined}
            maxZoom={viewMode === "diorama" ? 50 : undefined}
            minDistance={viewMode === "catalog" ? 4 : undefined}
            maxDistance={viewMode === "catalog" ? 35 : undefined}
            target={viewMode === "diorama" ? [0, 0.35, 0] : [0, 0.5, 0]}
          />

          {/* Lighting Environment */}
          <ambientLight intensity={ambientIntensity} color={ambientColor} />
          <directionalLight
            position={[16, 24, 14]}
            intensity={sunIntensity}
            color={sunColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight
            position={[-16, 14, -16]}
            intensity={rimIntensity}
            color={rimColor}
          />

          {/* Soft Ground Contact Shadows */}
          <ContactShadows
            position={[0, viewMode === "diorama" ? -0.48 : 0, 0]}
            opacity={isNight ? 0.65 : 0.45}
            scale={38}
            blur={2.4}
            far={12}
          />

          {/* ========================================================================= */}
          {/* MODE A: FULL LIVING ISLAND DIORAMA (BILATERAL TITAN FARMSTEAD)            */}
          {/* ========================================================================= */}
          {viewMode === "diorama" && (
            <group position={[0, 0, 0]}>
              {/* Option A: Dynamic Modular Land Slabs */}
              <ModularIsland level={displayLevel} drought={false} />

              {/* 28 Shipping & Revenue Trees (Filtered by unlocked slab boundaries) */}
              {bilateralTrees
                .filter((tree) => {
                  if (displayLevel >= 50) return true;
                  if (tree.gridZ < -4.0 && displayLevel < 20) return false;
                  if (tree.gridX < -3.6 && displayLevel < 5) return false;
                  if (tree.gridX > 3.6 && displayLevel < 10) return false;
                  return true;
                })
                .map((tree) => (
                  <BlockTree key={tree.id} tree={tree} />
                ))}

              {/* 1. Founder's Log Cabin HQ (Commanding Center-South Ranch) */}
              <group position={[-0.6, 0.25, 1.8]} rotation={[0, 0.45, 0]}>
                <LogCabin isNight={isNight} />
              </group>

              {/* 2. Sabbatical Canvas Tent (Unlocks at Level 5 with West Forestry) */}
              {displayLevel >= 5 && (
                <group position={[-3.8, 0.25, 2.8]} rotation={[0, 0.2, 0]}>
                  <CanvasTent />
                </group>
              )}

              {/* 3. Daily Focus Campfire (Front Porch Lawn) */}
              <group position={[1.8, 0.25, 2.8]}>
                <Campfire isNight={isNight} isSunset={isSunset} />
              </group>

              {/* 4. Living Wildlife: Camp Shiba Dog */}
              <group position={[-1.8, 0.25, 3.0]} rotation={[0, -0.5, 0]}>
                <CampDog />
              </group>

              {/* 5. Living Wildlife: Robin Bird */}
              <group position={[-1.0, 0.25, 1.0]} rotation={[0, 0.3, 0]}>
                <RobinBird />
              </group>

              {/* 6. Streak Milestone Flagpole */}
              <group position={[-0.6, 0.25, 3.8]} rotation={[0, 0.0, 0]}>
                <Flagpole />
              </group>

              {/* 7. Lantern Post Gate */}
              <group position={[2.8, 0.25, 3.4]}>
                <LanternPost isNight={isNight} />
              </group>

              {/* 8. ELITE MONUMENT: Alpine Windmill (Unlocks at Level 15) */}
              {displayLevel >= 15 && (
                <group position={[4.6, 0.25, 2.8]} rotation={[0, -0.2, 0]}>
                  <Windmill isNight={isNight} />
                </group>
              )}

              {/* 9. ELITE MONUMENT: Harbor Cargo Pier & Boat (Unlocks at Level 25) */}
              {displayLevel >= 25 && (
                <group position={[0.0, 0.25, 4.8]}>
                  <HarborPier isNight={isNight} />
                </group>
              )}

              {/* 10. ELITE MONUMENT: Coast Lighthouse (Unlocks at Level 35) */}
              {displayLevel >= 35 && (
                <group position={[-6.2, 0.45, -6.0]}>
                  <Lighthouse isNight={isNight} />
                </group>
              )}
            </group>
          )}

          {/* ========================================================================= */}
          {/* MODE B: INDIVIDUAL ASSET SHOWROOM CATALOG (Pedestal Sets in 5 Rows)      */}
          {/* ========================================================================= */}
          {viewMode === "catalog" && (
            <ShowroomCatalog isNight={isNight} wireframe={wireframe} />
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
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
              <Crown className="w-3 h-3 text-emerald-600 fill-emerald-500" />
              <span>Bilateral Titan Farmstead</span>
            </span>
          </div>
        </div>

        {/* Center: View Mode Switcher */}
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
            <span>Living Diorama</span>
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

      {/* Option A Modular Slabs Live Progression Selector (Visible in Diorama Mode) */}
      {viewMode === "diorama" && (
        <div className="fixed top-20 inset-x-5 z-40 flex justify-center pointer-events-none font-satoshi">
          <div className="pointer-events-auto p-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-300 shadow-xl flex items-center gap-1.5">
            <div className="px-2.5 py-1 text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <span>Modular Level:</span>
            </div>

            {[
              { lvl: 1, label: "LVL 1 (Starter Plot)" },
              { lvl: 5, label: "LVL 5 (+West Pines)" },
              { lvl: 10, label: "LVL 10 (+East Orchard)" },
              { lvl: 20, label: "LVL 20 (+Mountains)" },
              { lvl: 50, label: "LVL 50 (Full Empire)" },
            ].map((item) => (
              <button
                key={item.lvl}
                onClick={() => {
                  sound.playClick();
                  setDisplayLevel(item.lvl);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  displayLevel === item.lvl
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Bottom Guide Legend */}
      <div className="fixed bottom-6 inset-x-4 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto p-2.5 px-4 rounded-full bg-white/95 backdrop-blur-xs border border-stone-300 shadow-2xl shadow-stone-900/15 flex items-center flex-wrap justify-center gap-2 sm:gap-4 text-xs font-mono text-stone-700">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>{viewMode === "diorama" ? "Bilateral Farmstead Architecture:" : "Asset Showroom Lineages:"}</span>
          </div>

          {viewMode === "diorama" ? (
            <>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                West Forestry: 14 GitHub Shipping Pines
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                East Orchard: 14 Stripe Revenue Oaks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-900 text-stone-100 border border-stone-800">
                South Coastal Ranch: Cabin Manor HQ · Windmill · Harbor Pier · Lighthouse
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
              <span className="px-2 py-0.5 rounded-full bg-stone-900 text-stone-100 border border-stone-800">
                Row 3: Monuments (Windmill · Harbor Pier · Lighthouse)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300">
                Row 4: Campsite
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-200">
                Row 5: Living Wildlife
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

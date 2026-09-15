"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { sound } from "@/lib/sound";
import { PineTree } from "@/components/canvas/models/PineTree";
import { DeciduousTree } from "@/components/canvas/models/DeciduousTree";
import { Cabin } from "@/components/canvas/models/Cabin";
import { CanvasTent } from "@/components/canvas/models/CanvasTent";
import { Campfire } from "@/components/canvas/models/Campfire";
import { Dog as CompanionDog } from "@/components/canvas/models/Dog";
import { MountainPeak } from "@/components/canvas/models/MountainBackdrop";
import { DecimatedRock, GrassTuft, WildflowerCluster } from "@/components/canvas/models/VegetationClutter";
import { DoubleBezel } from "@/components/ui/Card";
import {
  Trees,
  Home,
  Tent,
  Flame,
  Dog,
  Sun,
  Sunset,
  Moon,
  RotateCw,
  Sparkles,
  Droplets,
  Mountain,
} from "lucide-react";

export type ShowroomAsset =
  | "green-tree"
  | "orange-tree"
  | "canvas-tent"
  | "log-cabin"
  | "campfire"
  | "mountain-peak"
  | "companion-dog";

export type TreeStage = "stump" | "sprout" | "small" | "tall" | "mighty";

interface StageInfo {
  id: TreeStage;
  roman: string;
  label: string;
  badge: string;
  requirement: string;
  desc: string;
}

const TREE_STAGES: StageInfo[] = [
  {
    id: "stump",
    roman: "0",
    label: "Stump",
    badge: "Tier 0",
    requirement: "Inactive / Seedbed",
    desc: "Dormant timber trunk disc. Marks cleared plots ready for active repository or revenue linkage.",
  },
  {
    id: "sprout",
    roman: "I",
    label: "Sprout",
    badge: "Tier I",
    requirement: "1–19 Commits · <$100 MRR",
    desc: "Woody conifer seedling shoot rising from needle bed with 5 radiating needle sprigs and terminal bud.",
  },
  {
    id: "small",
    roman: "II",
    label: "Young",
    badge: "Tier II",
    requirement: "20–49 Commits · $100–$499 MRR",
    desc: "Adolescent conifer pine featuring 3 reaching horizontal branch boughs, foliage pads, and top leader.",
  },
  {
    id: "tall",
    roman: "III",
    label: "Mature",
    badge: "Tier III",
    requirement: "50–99 Commits · $500–$999 MRR",
    desc: "Classic 3-skirt low-poly evergreen pine with faceted cone tiers and branch sparkle snow dots.",
  },
  {
    id: "mighty",
    roman: "IV",
    label: "Mighty",
    badge: "Tier IV",
    requirement: "100+ Commits · $1k+ MRR",
    desc: "Majestic 4-skirt sovereign evergreen pine adorned with branch sparkles and a radiant golden peak star.",
  },
];

export function Workshop3D() {
  const [activeAsset, setActiveAsset] = useState<ShowroomAsset>("green-tree");
  const [treeStage, setTreeStage] = useState<TreeStage>("mighty");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [drought, setDrought] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const asset = params.get("asset") as ShowroomAsset;
      if (asset) setActiveAsset(asset);
      const stage = params.get("stage") as TreeStage;
      if (stage) setTreeStage(stage);
    }
  }, []);

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  const ambientColor = drought
    ? "#a8a29e"
    : isNight
    ? "#3730a3"
    : isSunset
    ? "#ffedd5"
    : "#e0f2fe";
  const ambientIntensity = drought ? 0.85 : isNight ? 0.70 : isSunset ? 1.15 : 1.20;
  const sunColor = drought
    ? "#d6d3d1"
    : isNight
    ? "#38bdf8"
    : isSunset
    ? "#f59e0b"
    : "#fffdf7";
  const sunIntensity = drought ? 0.8 : isNight ? 0.90 : isSunset ? 1.45 : 1.35;

  // Calibrated Pedestal Foundation Palette (Tabletop Reference)
  const pedestalBaseColor = drought
    ? "#57534e"
    : isNight
    ? "#1e293b"
    : isSunset
    ? "#7c2d12"
    : "#604030"; // Underground Earth

  const pedestalGrassColor = drought
    ? "#8c8479"
    : isNight
    ? "#0f766e"
    : isSunset
    ? "#84cc16"
    : "#95C558"; // Vibrant Yellow-Green Terrain Grass

  const pedestalRingColor = drought
    ? "#a8a29e"
    : isNight
    ? "#38bdf8"
    : isSunset
    ? "#f59e0b"
    : "#D4A86A"; // Dirt Path Trim

  const currentStage = TREE_STAGES.find((s) => s.id === treeStage) || TREE_STAGES[4];

  return (
    <div className="relative w-full h-full bg-[#ece7de] select-none overflow-hidden flex flex-col items-center">
      {/* 3D Viewport */}
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [6, 4.5, 6], fov: 38 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          dpr={[1, 2]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              autoRotate={autoRotate}
              autoRotateSpeed={1.0}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={14}
            />

            {/* Natural Dynamic Lighting */}
            <ambientLight intensity={ambientIntensity} color={ambientColor} />
            <directionalLight
              position={[8, 14, 6]}
              intensity={sunIntensity}
              color={sunColor}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-6, 6, -6]} intensity={0.3} color="#93c5fd" />

            {/* ============================================================= */}
            {/* FLOATING DIORAMA PEDESTAL                                     */}
            {/* ============================================================= */}
            <group position={[0, -0.25, 0]}>
              <ContactShadows frames={1} position={[0, -0.45, 0]} opacity={0.4} scale={10} blur={2.4} far={4} />

              {/* Stone Pedestal Cylinder */}
              <mesh position={[0, 0, 0]} receiveShadow>
                <cylinderGeometry args={[2.5, 2.7, 0.42, 36]} />
                <meshStandardMaterial color={pedestalBaseColor} roughness={1.0} metalness={0.0} flatShading />
              </mesh>

              {/* Top Fresh Turf Cap */}
              <mesh position={[0, 0.215, 0]} receiveShadow>
                <cylinderGeometry args={[2.5, 2.5, 0.02, 36]} />
                <meshStandardMaterial color={pedestalGrassColor} roughness={1.0} metalness={0.0} flatShading />
              </mesh>

              {/* Pedestal Border Seam Ring */}
              <mesh position={[0, 0.226, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.42, 2.48, 36]} />
                <meshBasicMaterial color={pedestalRingColor} transparent opacity={0.85} side={THREE.DoubleSide} />
              </mesh>
            </group>

            {/* ============================================================= */}
            {/* ACTIVE 3D ASSET ON PEDESTAL                                   */}
            {/* ============================================================= */}
            <group position={[0, 0, 0]}>
              {activeAsset === "green-tree" && (
                <PineTree
                  tier={treeStage}
                  colorType="green"
                  drought={drought}
                  hasMetricBorder={treeStage === "mighty"}
                  palette="tabletop"
                />
              )}

              {activeAsset === "orange-tree" && (
                <DeciduousTree
                  tier={treeStage}
                  drought={drought}
                  palette="tabletop"
                />
              )}

              {activeAsset === "canvas-tent" && (
                <group position={[0, 0, 0]} scale={[1.4, 1.4, 1.4]}>
                  <CanvasTent isNight={isNight} drought={drought} />
                </group>
              )}

              {activeAsset === "log-cabin" && (
                <group position={[0, 0, 0]} scale={[1.35, 1.35, 1.35]}>
                  <Cabin isNight={isNight} drought={drought} palette="tabletop" />
                </group>
              )}

              {activeAsset === "campfire" && (
                <group position={[0, 0, 0]} scale={[1.6, 1.6, 1.6]}>
                  <Campfire isNight={isNight} isSunset={isSunset} drought={drought} palette="tabletop" />
                </group>
              )}

              {activeAsset === "mountain-peak" && (
                <group position={[0, 0, 0]}>
                  <MountainPeak position={[0, 0, 0]} scale={0.7} />
                  <DecimatedRock position={[-1.3, 0, 0.8]} scale={0.8} />
                  <DecimatedRock position={[1.2, 0, 0.6]} scale={0.6} />
                  <GrassTuft position={[-0.8, 0, -0.6]} scale={1.0} />
                  <WildflowerCluster position={[0.7, 0, -0.8]} />
                </group>
              )}

              {activeAsset === "companion-dog" && (
                <group position={[0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
                  <CompanionDog interactive={true} />
                </group>
              )}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* =================================================================== */}
      {/* TOP-RIGHT CONTROLS (LIGHTING, SEASON, TURNTABLE)                    */}
      {/* =================================================================== */}
      <div className="absolute top-20 right-6 z-40 flex items-center gap-2 pointer-events-auto">
        <DoubleBezel
          rounded="full"
          className="shadow-lg flex items-center gap-1.5"
          innerClassName="px-2 py-1 flex items-center gap-1.5"
        >
            {/* Day Sunlight */}
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("day");
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "day"
                  ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-[inset_0_1.5px_2px_rgba(217,119,6,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title="Day Sunlight"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            {/* Sunset Golden Hour */}
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("sunset");
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "sunset"
                  ? "bg-orange-50 text-orange-900 border border-orange-200/90 shadow-[inset_0_1.5px_2px_rgba(234,88,12,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title="Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>

            {/* Night Moonlit */}
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("night");
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                timeOfDay === "night"
                  ? "bg-indigo-50 text-indigo-900 border border-indigo-200/90 shadow-[inset_0_1.5px_2px_rgba(79,70,229,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title="Night Moonlit"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-stone-200 my-auto" />

            {/* Drought Soil Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setDrought(!drought);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                drought
                  ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-[inset_0_1.5px_2px_rgba(217,119,6,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title={drought ? "Drought Mode Active" : "Lush Season"}
            >
              <Droplets className="w-3.5 h-3.5" />
            </button>

            {/* 360 Turntable Auto-Rotate Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setAutoRotate(!autoRotate);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                autoRotate
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200/90 shadow-[inset_0_1.5px_2px_rgba(5,150,105,0.12),inset_0_-1px_0_rgba(255,255,255,0.85)] font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95"
              }`}
              title="Toggle 360° Turntable Rotation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
        </DoubleBezel>
      </div>

      {/* =================================================================== */}
      {/* TOP-LEFT ASSET SPEC INSPECTOR CARD                                  */}
      {/* =================================================================== */}
      <div className="absolute top-20 left-6 z-40 max-w-sm pointer-events-auto">
        <DoubleBezel rounded="2xl" className="shadow-xl" innerClassName="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-xs text-stone-900">3D Workshop Spec</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-full uppercase">
                {activeAsset === "green-tree"
                  ? "Conifer Pine"
                  : activeAsset === "orange-tree"
                  ? "Deciduous Oak"
                  : activeAsset === "mountain-peak"
                  ? "Alpine Mountain"
                  : activeAsset.replace("-", " ")}
              </span>
            </div>

            {/* Tree Growth Stage Selector (ALL 5 STAGES) */}
            {(activeAsset === "green-tree" || activeAsset === "orange-tree") ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">
                    {activeAsset === "orange-tree" ? "Oak Canopy Lineage:" : "5-Stage Growth Lineage:"}
                  </span>
                  <span className="font-medium font-mono text-emerald-800">{currentStage.badge}</span>
                </div>

                {/* 5 Stage Buttons Grid */}
                <div className="grid grid-cols-5 gap-1.5">
                  {TREE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        sound.playClick();
                        setTreeStage(s.id);
                      }}
                      className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center active:scale-95 ${
                        treeStage === s.id
                          ? activeAsset === "orange-tree"
                            ? "btn-specular-lime text-white"
                            : "btn-specular-emerald text-white"
                          : "btn-specular-porcelain text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-80">{s.roman}</span>
                      <span className="text-[10px] font-medium tracking-tight">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Live Spec Callout Box */}
                <div className="p-3 rounded-2xl bg-stone-50/90 border border-stone-200/90 shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.04),inset_0_-1px_0_rgba(255,255,255,0.85)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">
                      {activeAsset === "orange-tree" ? `Deciduous Oak · ${currentStage.label}` : `Conifer Pine · ${currentStage.label}`}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-stone-600 bg-stone-200/80 shadow-xs px-1.5 py-0.5 rounded-full border border-stone-300/70">
                      {currentStage.requirement}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {activeAsset === "orange-tree"
                      ? currentStage.id === "stump"
                        ? "Dormant timber trunk disc. Cleared foundation ready for revenue or MRR metric linkage."
                        : currentStage.id === "sprout"
                        ? "Single low-poly icosphere canopy (#6DBE45) atop a slender crooked brown trunk (#8B5A2B)."
                        : currentStage.id === "small"
                        ? "Dual faceted icosphere canopy lobes with natural organic tilt and root flare footing."
                        : currentStage.id === "tall"
                        ? "3-lobed low-poly icosphere canopy with faceted triangle geometry catching sunlight independently."
                        : "Grand 4-lobed sovereign oak diorama centerpiece with sprawling shade and root base."
                      : currentStage.desc}
                  </p>
                </div>
              </div>
            ) : (
              /* Non-Tree Asset Spec Info */
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-stone-50/90 border border-stone-200/90 shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.04),inset_0_-1px_0_rgba(255,255,255,0.85)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">
                      {activeAsset === "canvas-tent"
                        ? "Canvas Tent"
                        : activeAsset === "log-cabin"
                        ? "Tabletop Log Cabin"
                        : activeAsset === "campfire"
                        ? "Tabletop Campfire"
                        : activeAsset === "mountain-peak"
                        ? "Alpine Mountain & Rocks"
                        : "Companion Dog"}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      {activeAsset === "canvas-tent"
                        ? "Starter Shelter (Days 1–13)"
                        : activeAsset === "log-cabin"
                        ? "Unlocked Level 10+ / Day 14+"
                        : activeAsset === "campfire"
                        ? "Daily Focus Station"
                        : activeAsset === "mountain-peak"
                        ? "Northern Horizon Clutter"
                        : "Faithful Island Friend (Day 5+)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {activeAsset === "canvas-tent"
                      ? "Canvas A-frame shelter with wooden foundation deck and rolled plaid wool sleeping bedroll."
                      : activeAsset === "log-cabin"
                      ? "Stacked horizontal timber cylinders (#8B5A2B), front porch with vertical posts, pitched slate-grey roof (#555E6B), stone chimney, and harvest barrel."
                      : activeAsset === "campfire"
                      ? "Hearth ring of 10 low-poly stones (#A0A09B), 3 triangular horizontal log benches (#8B5A2B), and jagged tetrahedron flame cluster (#F97316)."
                      : activeAsset === "mountain-peak"
                      ? "Steep hexagonal pyramids (#B5B5C0) with 20% snow cap (#FFFFFF), accompanied by sunken riverstone boulders and wild grass tufts."
                      : "Handcrafted golden companion dog. Click on the diorama to hear it bark and wag its tail!"}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-medium">
              <span>Drag to rotate 360°</span>
              <span>Scroll to zoom</span>
            </div>
        </DoubleBezel>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM ASSET SELECTOR DOCK (ALL 7 ASSETS)                           */}
      {/* =================================================================== */}
      <div className="fixed bottom-6 inset-x-4 z-40 flex justify-center pointer-events-none">
        <DoubleBezel
          rounded="full"
          className="pointer-events-auto shadow-2xl"
          innerClassName="px-3 py-1.5 flex items-center gap-1 sm:gap-2 flex-wrap justify-center"
        >
            {/* 1. Green Code Pine */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("green-tree");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "green-tree"
                  ? "btn-specular-emerald text-white scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-emerald-300" />
              <span>Conifer Pine</span>
            </button>

            {/* 2. Deciduous Oak */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("orange-tree");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "orange-tree"
                  ? "bg-lime-600 text-white shadow-[0_2px_8px_-2px_rgba(101,163,13,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-lime-700 scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-lime-200" />
              <span>Deciduous Oak</span>
            </button>

            {/* 3. Starter Canvas Tent */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("canvas-tent");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "canvas-tent"
                  ? "bg-amber-800 text-white shadow-[0_2px_8px_-2px_rgba(146,64,14,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-amber-900 scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Tent className="w-3.5 h-3.5 text-amber-200" />
              <span>Canvas Tent</span>
            </button>

            {/* 4. Log Cabin HQ */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("log-cabin");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "log-cabin"
                  ? "bg-stone-900 text-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-stone-950 scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-300" />
              <span>Log Cabin</span>
            </button>

            {/* 5. Campfire */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("campfire");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "campfire"
                  ? "bg-orange-600 text-white shadow-[0_2px_8px_-2px_rgba(234,88,12,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-orange-700 scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-200" />
              <span>Campfire</span>
            </button>

            {/* 6. Mountain Peak & Boulders */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("mountain-peak");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "mountain-peak"
                  ? "bg-slate-700 text-white shadow-[0_2px_8px_-2px_rgba(51,65,85,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-slate-800 scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-slate-200" />
              <span>Mountain</span>
            </button>

            {/* 7. Companion Dog */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("companion-dog");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                activeAsset === "companion-dog"
                  ? "btn-specular-amber text-white scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
              }`}
            >
              <Dog className="w-3.5 h-3.5 text-amber-200" />
              <span>Dog</span>
            </button>
        </DoubleBezel>
      </div>
    </div>
  );
}


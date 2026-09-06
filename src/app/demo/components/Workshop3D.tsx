"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { sound } from "@/lib/sound";
import { PineTree } from "@/components/canvas/models/PineTree";
import { Cabin } from "@/components/canvas/models/Cabin";
import { CanvasTent } from "@/components/canvas/models/CanvasTent";
import { Campfire } from "@/components/canvas/models/Campfire";
import { Dog as CompanionDog } from "@/components/canvas/models/Dog";
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
} from "lucide-react";

export type ShowroomAsset =
  | "green-tree"
  | "orange-tree"
  | "canvas-tent"
  | "log-cabin"
  | "campfire"
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

  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  const ambientColor = isNight ? "#312e81" : isSunset ? "#fed7aa" : "#ffffff";
  const ambientIntensity = drought ? 0.85 : isNight ? 0.45 : isSunset ? 0.9 : 1.15;
  const sunColor = isNight ? "#818cf8" : isSunset ? "#f97316" : "#ffffff";
  const sunIntensity = drought ? 0.8 : isNight ? 0.4 : isSunset ? 1.4 : 1.35;

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
                <meshStandardMaterial color={drought ? "#57534e" : "#422517"} roughness={0.9} flatShading />
              </mesh>

              {/* Top Sage-Emerald Turf Cap */}
              <mesh position={[0, 0.215, 0]} receiveShadow>
                <cylinderGeometry args={[2.5, 2.5, 0.02, 36]} />
                <meshStandardMaterial color={drought ? "#8c8479" : "#5ea774"} roughness={0.7} flatShading />
              </mesh>

              {/* Pedestal Border Seam Ring */}
              <mesh position={[0, 0.226, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.42, 2.48, 36]} />
                <meshBasicMaterial color={drought ? "#a8a29e" : "#88cca0"} transparent opacity={0.8} side={THREE.DoubleSide} />
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
                />
              )}

              {activeAsset === "orange-tree" && (
                <PineTree
                  tier={treeStage}
                  colorType="orange"
                  drought={drought}
                  hasMetricBorder={treeStage === "mighty"}
                />
              )}

              {activeAsset === "canvas-tent" && (
                <group position={[0, 0, 0]} scale={[1.4, 1.4, 1.4]}>
                  <CanvasTent isNight={isNight} drought={drought} />
                </group>
              )}

              {activeAsset === "log-cabin" && (
                <group position={[0, 0, 0]} scale={[1.35, 1.35, 1.35]}>
                  <Cabin isNight={isNight} drought={drought} />
                </group>
              )}

              {activeAsset === "campfire" && (
                <group position={[0, 0, 0]} scale={[1.6, 1.6, 1.6]}>
                  <Campfire isNight={isNight} isSunset={isSunset} drought={drought} />
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
        <div className="p-1 rounded-full glass-dock shadow-lg flex items-center gap-1.5">
          <div className="px-2 py-1 rounded-full porcelain-surface flex items-center gap-1.5">
            {/* Day Sunlight */}
            <button
              onClick={() => {
                sound.playClick();
                setTimeOfDay("day");
              }}
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "day" ? "bg-amber-100 text-amber-900 font-medium" : "text-stone-500 hover:bg-stone-100"
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
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "sunset" ? "bg-orange-100 text-orange-900 font-medium" : "text-stone-500 hover:bg-stone-100"
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
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                timeOfDay === "night" ? "bg-indigo-100 text-indigo-900 font-medium" : "text-stone-500 hover:bg-stone-100"
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
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                drought ? "bg-amber-100 text-amber-900 font-medium" : "text-stone-500 hover:bg-stone-100"
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
              className={`p-1.5 rounded-full text-xs transition cursor-pointer ${
                autoRotate ? "bg-emerald-100 text-emerald-900 font-medium" : "text-stone-500 hover:bg-stone-100"
              }`}
              title="Toggle 360° Turntable Rotation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TOP-LEFT ASSET SPEC INSPECTOR CARD                                  */}
      {/* =================================================================== */}
      <div className="absolute top-20 left-6 z-40 max-w-sm pointer-events-auto">
        <div className="p-1.5 rounded-2xl glass-dock shadow-xl">
          <div className="p-4 rounded-xl porcelain-surface space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-xs text-stone-900">3D Workshop Spec</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-full uppercase">
                {activeAsset.replace("-", " ")}
              </span>
            </div>

            {/* Tree Growth Stage Selector (ALL 5 STAGES) */}
            {(activeAsset === "green-tree" || activeAsset === "orange-tree") ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">5-Stage Growth Lineage:</span>
                  <span className="font-medium font-mono text-emerald-800">{currentStage.badge}</span>
                </div>

                {/* 5 Stage Buttons Grid */}
                <div className="grid grid-cols-5 gap-1">
                  {TREE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        sound.playClick();
                        setTreeStage(s.id);
                      }}
                      className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer flex flex-col items-center ${
                        treeStage === s.id
                          ? activeAsset === "orange-tree"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-emerald-600 text-white shadow-xs"
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/80"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-80">{s.roman}</span>
                      <span className="text-[10px] font-medium tracking-tight">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Live Spec Callout Box */}
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">{currentStage.label}</span>
                    <span className="text-[9px] font-mono font-medium text-stone-500 bg-stone-200/80 px-1.5 py-0.5 rounded">
                      {currentStage.requirement}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {currentStage.desc}
                  </p>
                </div>
              </div>
            ) : (
              /* Non-Tree Asset Spec Info */
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">
                      {activeAsset === "canvas-tent"
                        ? "Canvas Tent"
                        : activeAsset === "log-cabin"
                        ? "Log Cabin HQ"
                        : activeAsset === "campfire"
                        ? "Milestone Campfire"
                        : "Companion Dog"}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {activeAsset === "canvas-tent"
                        ? "Starter Shelter (Days 1–13)"
                        : activeAsset === "log-cabin"
                        ? "Unlocked Level 10+ / Day 14+"
                        : activeAsset === "campfire"
                        ? "Daily Focus Station"
                        : "Faithful Island Friend (Day 5+)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {activeAsset === "canvas-tent"
                      ? "Canvas A-frame shelter with wooden foundation deck and rolled plaid wool sleeping bedroll."
                      : activeAsset === "log-cabin"
                      ? "Timber beam builder headquarters with chimney stack and glowing warm windows."
                      : activeAsset === "campfire"
                      ? "Interactive stone ring campfire hearth with animated flickering flames and smoke embers."
                      : "Handcrafted golden companion dog. Click on the diorama to hear it bark and wag its tail!"}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-medium">
              <span>Drag to rotate 360°</span>
              <span>Scroll to zoom</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM ASSET SELECTOR DOCK (ALL 6 CANONICAL ASSETS)                 */}
      {/* =================================================================== */}
      <div className="fixed bottom-6 inset-x-4 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto p-1.5 rounded-full glass-dock shadow-2xl">
          <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {/* 1. Green Code Pine */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("green-tree");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "green-tree"
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>Code Pine</span>
            </button>

            {/* 2. Orange Cash Pine */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("orange-tree");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "orange-tree"
                  ? "bg-amber-600 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-amber-300" />
              <span>Cash Pine</span>
            </button>

            {/* 3. Starter Canvas Tent */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("canvas-tent");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "canvas-tent"
                  ? "bg-amber-700 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Tent className="w-3.5 h-3.5 text-amber-300" />
              <span>Canvas Tent</span>
            </button>

            {/* 4. Log Cabin HQ */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("log-cabin");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "log-cabin"
                  ? "bg-stone-800 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Cabin</span>
            </button>

            {/* 5. Campfire */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("campfire");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "campfire"
                  ? "bg-orange-600 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Campfire</span>
            </button>

            {/* 6. Companion Dog */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveAsset("companion-dog");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeAsset === "companion-dog"
                  ? "bg-amber-600 text-white shadow-xs scale-105"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Dog className="w-3.5 h-3.5 text-amber-200" />
              <span>Companion Dog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Workshop3D as StudioAssetShowroom };

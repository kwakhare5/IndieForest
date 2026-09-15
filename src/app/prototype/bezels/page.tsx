"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Search,
  ArrowRight,
  Columns3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type VariantKey = "A" | "B" | "C" | "shootout";

interface VariantMeta {
  key: VariantKey;
  name: string;
  subtitle: string;
  description: string;
  tag: string;
  specs: {
    gap: string;
    lip: string;
    chassis: string;
    innerSlab: string;
  };
}

const VARIANTS: Record<"A" | "B" | "C", VariantMeta> = {
  A: {
    key: "A",
    name: "Hairline Precision",
    subtitle: "Braun / Dieter Rams Architectural Micro-Bezel",
    description:
      "Tightly calibrated 1px–2px perimeter rim. Eradicates bulk with a crisp 1px hairline border, whisper-soft stone frame, and a razor-sharp 1.5px micro-extrusion lip.",
    tag: "Ultra-Crisp · 1.5px Micro-Lip",
    specs: {
      gap: "1.5px–2px gap (p-0.5 sm:p-1)",
      lip: "0 1.5px 0 #ded7ca (subtle grounding)",
      chassis: "bg-[#e8e3d8]/90 border border-[#d8d1c4]",
      innerSlab: "bg-white border border-[#ded8cd]/90 inset-0 1px 0 #fff",
    },
  },
  B: {
    key: "B",
    name: "Air & Glass Chamfer",
    subtitle: "Apple Vision / Frosted Crystal Bezel",
    description:
      "Subtle translucent frosted casing with zero opaque borders. The card floats inside a hairline glass bezel with light-catching specular reflections.",
    tag: "Translucent · Zero-Weight",
    specs: {
      gap: "2px gap (p-[2px] sm:p-1)",
      lip: "0 1px 2px rgba(0,0,0,0.04) (flat flush lip)",
      chassis: "bg-white/50 backdrop-blur-md border border-white/90",
      innerSlab: "bg-white/95 border border-stone-200/80 inset-0 1px 0 #fff",
    },
  },
  C: {
    key: "C",
    name: "Milled Debossed Well",
    subtitle: "Machined Instrument Enclosure",
    description:
      "Inverts the outer bezel into an architectural countersunk groove bed (`shadow-inner`), seating the porcelain slab flush inside like high-end audio hardware.",
    tag: "Countersunk · Flush Bed",
    specs: {
      gap: "2.5px milled recess groove (p-1)",
      lip: "Flush seated with inner ambient groove shadow",
      chassis: "bg-[#ded8cd] shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.08)]",
      innerSlab: "bg-white border border-stone-200/90 shadow-xs",
    },
  },
};

export default function BezelPrototypePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ece7de] flex items-center justify-center font-sans text-stone-500">
          Loading Bezel Prototype...
        </div>
      }
    >
      <BezelPrototypeContent />
    </Suspense>
  );
}

function BezelPrototypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantParam = (searchParams.get("variant") as VariantKey) || "A";
  const [currentVariant, setCurrentVariant] = useState<VariantKey>(
    variantParam in VARIANTS || variantParam === "shootout" ? variantParam : "A"
  );

  const [inputVal, setInputVal] = useState("kwakhare5");

  // Keep state in sync with URL
  useEffect(() => {
    const v = searchParams.get("variant") as VariantKey;
    if (v && (v in VARIANTS || v === "shootout")) {
      setCurrentVariant(v);
    }
  }, [searchParams]);

  const setVariant = (v: VariantKey) => {
    setCurrentVariant(v);
    router.replace(`/prototype/bezels?variant=${v}`, { scroll: false });
  };

  const cycleVariant = (direction: "next" | "prev") => {
    const keys: VariantKey[] = ["A", "B", "C", "shootout"];
    const currentIndex = keys.indexOf(currentVariant);
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % keys.length
        : (currentIndex - 1 + keys.length) % keys.length;
    setVariant(keys[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "ArrowRight") cycleVariant("next");
      if (e.key === "ArrowLeft") cycleVariant("prev");
      if (e.key === "1") setVariant("A");
      if (e.key === "2") setVariant("B");
      if (e.key === "3") setVariant("C");
      if (e.key === "s" || e.key === "S") setVariant("shootout");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVariant]);

  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-sans selection:bg-emerald-600 selection:text-white pb-36">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#ece7de]/90 border-b border-stone-300/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-stone-600 hover:text-stone-950 transition px-2.5 py-1 rounded-full border border-stone-300 bg-white/70 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-stone-300" />
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl text-stone-900 tracking-tight font-medium">
              IndieForest
            </span>
            <span className="font-mono text-[10px] tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase font-medium">
              Minimal Bezel Prototype
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVariant("A")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              currentVariant === "A"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            A: Hairline
          </button>
          <button
            onClick={() => setVariant("B")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              currentVariant === "B"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            B: Air Glass
          </button>
          <button
            onClick={() => setVariant("C")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              currentVariant === "C"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            C: Milled Well
          </button>
          <div className="h-4 w-px bg-stone-300 mx-0.5" />
          <button
            onClick={() => setVariant("shootout")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              currentVariant === "shootout"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-emerald-800 hover:bg-emerald-100/60"
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Shootout (3-Up)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {currentVariant === "shootout" ? (
          /* 3-COLUMN SIDE-BY-SIDE SHOOTOUT */
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 font-medium">
                Side-by-Side Comparison
              </span>
              <h1 className="text-2xl sm:text-3xl font-medium text-stone-950 mt-1 font-sans">
                Which double bezel feels right?
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                Inspect the tactile edge, frame margin, and drop shadow across all three minimal calibrations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <BezelSpecimen variant="A" inputVal={inputVal} setInputVal={setInputVal} onSelect={() => setVariant("A")} />
              <BezelSpecimen variant="B" inputVal={inputVal} setInputVal={setInputVal} onSelect={() => setVariant("B")} />
              <BezelSpecimen variant="C" inputVal={inputVal} setInputVal={setInputVal} onSelect={() => setVariant("C")} />
            </div>
          </div>
        ) : (
          /* SINGLE FOCUSED VARIANT VIEW */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="emerald" size="sm" className="mb-2">
                {VARIANTS[currentVariant].tag}
              </Badge>
              <h1 className="text-3xl font-medium text-stone-950 font-sans tracking-tight">
                Variant {currentVariant}: {VARIANTS[currentVariant].name}
              </h1>
              <p className="text-sm text-stone-600 max-w-xl mx-auto mt-2 font-sans leading-relaxed">
                {VARIANTS[currentVariant].description}
              </p>
            </div>

            {/* Spec breakdown pill */}
            <div className="mb-8 p-3 rounded-2xl bg-stone-200/50 border border-stone-300/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-700">
              <div><span className="text-stone-400">Gap:</span> {VARIANTS[currentVariant].specs.gap}</div>
              <div><span className="text-stone-400">Lip:</span> {VARIANTS[currentVariant].specs.lip}</div>
              <div><span className="text-stone-400">Chassis:</span> {VARIANTS[currentVariant].specs.chassis}</div>
            </div>

            <div className="space-y-10">
              <BezelSpecimen
                variant={currentVariant}
                inputVal={inputVal}
                setInputVal={setInputVal}
                featured
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Interactive Prototype Switcher Bar */}
      <footer className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-stone-900 text-stone-100 rounded-full p-1.5 shadow-2xl border border-stone-800 flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => cycleVariant("prev")}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer active:scale-95"
            title="Previous Variant (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-3 py-1 flex items-center gap-2 border-x border-stone-800">
            <span className="text-xs font-mono font-medium text-emerald-400">
              {currentVariant === "shootout" ? "3-UP" : `VAR ${currentVariant}`}
            </span>
            <span className="text-xs font-medium text-stone-200 hidden sm:inline">
              {currentVariant === "shootout"
                ? "Side-by-Side Shootout"
                : VARIANTS[currentVariant].name}
            </span>
          </div>

          <button
            onClick={() => cycleVariant("next")}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer active:scale-95"
            title="Next Variant (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-stone-800 my-auto" />

          {/* Direct Variant Jump Pills */}
          <div className="flex items-center gap-1 pr-1">
            {(["A", "B", "C"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setVariant(key)}
                className={`w-6 h-6 rounded-full text-[11px] font-mono font-medium transition cursor-pointer ${
                  currentVariant === key
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-stone-800"
                }`}
                title={`Jump to Variant ${key}`}
              >
                {key}
              </button>
            ))}

            <button
              onClick={() => setVariant("shootout")}
              className={`px-2 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                currentVariant === "shootout"
                  ? "bg-emerald-600 text-white"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
              title="Compare all 3 side-by-side"
            >
              All
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SPECIMEN COMPONENT: Renders UI components in the specified bezel variant
// ---------------------------------------------------------------------------

interface BezelSpecimenProps {
  variant: "A" | "B" | "C";
  inputVal: string;
  setInputVal: (val: string) => void;
  featured?: boolean;
  onSelect?: () => void;
}

function BezelSpecimen({
  variant,
  inputVal,
  setInputVal,
  featured = false,
  onSelect,
}: BezelSpecimenProps) {
  const meta = VARIANTS[variant];

  // Specific CSS definitions per variant
  const getStyles = () => {
    switch (variant) {
      case "A": // Hairline Precision
        return {
          cardChassis:
            "p-[3px] sm:p-1 rounded-[2rem] bg-[#e8e3d8]/90 border border-[#d8d1c4] shadow-[0_6px_16px_-4px_rgba(44,40,35,0.06),0_1px_3px_rgba(0,0,0,0.03)]",
          cardSlab:
            "rounded-[calc(2rem-0.25rem)] bg-white border border-[#ded8cd]/80 shadow-[0_1.5px_0_#ded7ca,0_4px_12px_-2px_rgba(44,40,35,0.05),inset_0_1px_0_#ffffff]",
          capsuleChassis:
            "p-[2px] rounded-full bg-[#e8e3d8]/90 border border-[#d8d1c4] shadow-xs",
          capsuleInner:
            "px-2.5 py-1 rounded-full bg-white border border-[#ded8cd]/80 shadow-[0_1px_0_#ded7ca,inset_0_1px_0_#fff]",
          groove:
            "bg-[#f5f2eb] border border-[#dcd5c7] shadow-[inset_0_1.5px_2.5px_rgba(28,25,23,0.04),inset_0_-1px_0_rgba(255,255,255,0.9)]",
        };
      case "B": // Air & Glass Chamfer
        return {
          cardChassis:
            "p-[2.5px] sm:p-[3px] rounded-[2rem] bg-white/45 backdrop-blur-md border border-white/90 shadow-[0_8px_20px_-4px_rgba(44,40,35,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
          cardSlab:
            "rounded-[calc(2rem-0.25rem)] bg-white/95 border border-stone-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_#ffffff]",
          capsuleChassis:
            "p-[2px] rounded-full bg-white/50 backdrop-blur-md border border-white/90 shadow-2xs",
          capsuleInner:
            "px-2.5 py-1 rounded-full bg-white/90 border border-stone-200/80 shadow-[0_1px_1px_rgba(0,0,0,0.02),inset_0_1px_0_#fff]",
          groove:
            "bg-stone-50/90 border border-stone-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03),inset_0_-1px_0_rgba(255,255,255,0.8)]",
        };
      case "C": // Milled Debossed Well
        return {
          cardChassis:
            "p-1 rounded-[2rem] bg-[#dfd9ce] border border-[#cfc8bc] shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.08),inset_0_-1px_0_rgba(255,255,255,0.8)]",
          cardSlab:
            "rounded-[calc(2rem-0.3125rem)] bg-white border border-[#ded8cd] shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff]",
          capsuleChassis:
            "p-[2.5px] rounded-full bg-[#dfd9ce] border border-[#cfc8bc] shadow-[inset_0_1.5px_2px_rgba(28,25,23,0.08)]",
          capsuleInner:
            "px-2.5 py-1 rounded-full bg-white border border-[#ded8cd] shadow-2xs",
          groove:
            "bg-[#f3efe8] border border-[#d6cfc1] shadow-[inset_0_1px_2px_rgba(28,25,23,0.05),inset_0_-1px_0_rgba(255,255,255,0.85)]",
        };
    }
  };

  const s = getStyles();

  return (
    <div className={`flex flex-col gap-5 font-sans ${featured ? "max-w-xl mx-auto" : ""}`}>
      {/* Variant Header Card */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-mono font-medium flex items-center justify-center">
              {variant}
            </span>
            <h2 className="text-base font-medium text-stone-950 font-sans">
              {meta.name}
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 font-sans block mt-0.5">
            {meta.subtitle}
          </span>
        </div>

        {onSelect && (
          <button
            onClick={onSelect}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect Solo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 1. HUD CAPSULE SPECIMEN */}
      <div>
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
          HUD Capsule / Navigation Pill
        </span>
        <div className="flex items-center gap-3">
          <div className={s.capsuleChassis}>
            <div className={s.capsuleInner}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-stone-800">
                  Living Island
                </span>
                <div className="w-[1px] h-3 bg-stone-200 my-auto" />
                <span className="text-[11px] font-pixel text-stone-500">
                  Lvl 12
                </span>
              </div>
            </div>
          </div>

          <div className={s.capsuleChassis}>
            <div className={s.capsuleInner}>
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3 h-3 text-stone-500" />
                <span className="text-xs font-medium text-stone-700">4 Repos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BENTO / FEATURE CARD SPECIMEN */}
      <div>
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
          Bento Feature Card
        </span>
        <div className={s.cardChassis}>
          <div className={`${s.cardSlab} p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-900 font-sans">
                    Rolling 30-Day Health
                  </h3>
                  <span className="text-[10px] text-stone-500 font-sans">
                    Zero-guilt momentum
                  </span>
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                85% Active
              </Badge>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Missed a shipping day? Your past work is protected. The subtle double bezel encloses the content with zero visual noise.
            </p>

            {/* Debossed Milled Stat Well */}
            <div className={`p-3 rounded-xl ${s.groove} flex items-center justify-between text-xs`}>
              <span className="text-stone-600 font-medium">Auto-Protected Streak:</span>
              <span className="font-pixel text-emerald-800 text-sm">14 Days Clean</span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <Button variant="emerald" size="sm" showArrow>
                Launch Dashboard
              </Button>
              <span className="text-[11px] font-mono text-stone-400">
                12 Repos Synced
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INPUT / FORM SEARCH SPECIMEN */}
      <div>
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
          Search Channel / Input Enclosure
        </span>
        <div className={s.cardChassis}>
          <div className={`${s.cardSlab} p-1.5 flex items-center gap-2`}>
            <div className="pl-2.5 text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter GitHub handle"
              className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden font-sans"
            />
            <Button variant="emerald" size="sm" className="shrink-0 text-xs">
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

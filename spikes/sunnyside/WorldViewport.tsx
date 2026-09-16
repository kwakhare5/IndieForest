"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  REFINED_COLS,
  REFINED_ROWS,
  REFINED_PIXEL_WIDTH,
  REFINED_PIXEL_HEIGHT,
  TILE_SIZE,
  RIVER_COLS_MAX,
  TERRAIN_CLUTTER,
  OAK_TREES,
  PINE_TREES,
  BERRY_BUSHES,
  FARM_CROP_ROWS,
  INTERACTIVE_ZONES,
  InteractiveClickZone,
  generateRefinedWorld,
} from "./refinedIsland";
import {
  INITIAL_PROJECTS,
  INITIAL_REVENUE,
  INITIAL_CAMPFIRE,
  getCropStage,
} from "./farmsteadConfig";
import { CropProject, RevenueTree, CampfireState, ActiveModalType } from "./types";
import { SpikeModals } from "./SpikeModals";

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

interface LoadedAssets {
  tileset: HTMLImageElement;
  soil: HTMLImageElement;
  carrots: Record<string, HTMLImageElement>;
  campfireRing: HTMLImageElement;
  fire: HTMLImageElement;
  oakTree: HTMLImageElement;
  pineTree: HTMLImageElement;
  chimneySmoke: HTMLImageElement;
  farmerBase: HTMLImageElement;
  farmerHair: HTMLImageElement;
  farmerTool: HTMLImageElement;
  fisherBase: HTMLImageElement;
  fisherHair: HTMLImageElement;
  fisherTool: HTMLImageElement;
}

export function WorldViewport() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const assetsRef = useRef<LoadedAssets | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hoverCoord, setHoverCoord] = useState<{ col: number; row: number; x: number; y: number } | null>(null);
  const [hoveredZone, setHoveredZone] = useState<InteractiveClickZone | null>(null);

  // Application State
  const [projects, setProjects] = useState<CropProject[]>(INITIAL_PROJECTS);
  const [revenue, setRevenue] = useState<RevenueTree>(INITIAL_REVENUE);
  const [campfire, setCampfire] = useState<CampfireState>(INITIAL_CAMPFIRE);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("p1");

  // Camera state: centered on the 512x352 island at 2.4x zoom
  const cameraRef = useRef<CameraState>({
    x: 0,
    y: 0,
    zoom: 2.4,
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  // 1. Preload all authentic Sunnyside assets and bake static layers
  useEffect(() => {
    let active = true;

    async function loadAllAssets() {
      const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        });

      const [
        tileset,
        soil,
        c00, c01, c02, c03, c04, c05,
        campfireRing,
        fire,
        oakTree,
        pineTree,
        chimneySmoke,
        farmerBase, farmerHair, farmerTool,
        fisherBase, fisherHair, fisherTool,
      ] = await Promise.all([
        loadImage("/sunnyside-spike/tileset.png"),
        loadImage("/sunnyside-spike/crops/soil_00.png"),
        loadImage("/sunnyside-spike/crops/carrot_00.png"),
        loadImage("/sunnyside-spike/crops/carrot_01.png"),
        loadImage("/sunnyside-spike/crops/carrot_02.png"),
        loadImage("/sunnyside-spike/crops/carrot_03.png"),
        loadImage("/sunnyside-spike/crops/carrot_04.png"),
        loadImage("/sunnyside-spike/crops/carrot_05.png"),
        loadImage("/sunnyside-spike/vfx/campfire_ring.png"),
        loadImage("/sunnyside-spike/vfx/spr_deco_fire_01_strip4.png"),
        loadImage("/sunnyside-spike/vfx/spr_deco_tree_01_strip4.png"),
        loadImage("/sunnyside-spike/vfx/spr_deco_tree_02_strip4.png"),
        loadImage("/sunnyside-spike/vfx/chimneysmoke_01_strip30.png"),
        loadImage("/sunnyside-spike/characters/base_watering_strip5.png"),
        loadImage("/sunnyside-spike/characters/spikeyhair_watering_strip5.png"),
        loadImage("/sunnyside-spike/characters/tools_watering_strip5.png"),
        loadImage("/sunnyside-spike/characters/base_casting_strip15.png"),
        loadImage("/sunnyside-spike/characters/longhair_casting_strip15.png"),
        loadImage("/sunnyside-spike/characters/tools_casting_strip15.png"),
      ]);

      if (!active) return;

      const loadedAssets: LoadedAssets = {
        tileset,
        soil,
        carrots: { "00": c00, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05 },
        campfireRing,
        fire,
        oakTree,
        pineTree,
        chimneySmoke,
        farmerBase,
        farmerHair,
        farmerTool,
        fisherBase,
        fisherHair,
        fisherTool,
      };
      assetsRef.current = loadedAssets;

      // Bake all static structures into offscreen canvas buffer (512x352 px)
      const offscreen = document.createElement("canvas");
      offscreen.width = REFINED_PIXEL_WIDTH;
      offscreen.height = REFINED_PIXEL_HEIGHT;
      const ctxOff = offscreen.getContext("2d");

      if (ctxOff) {
        ctxOff.imageSmoothingEnabled = false;
        const terrain = generateRefinedWorld();

        const stampTile = (tileId: number, px: number, py: number) => {
          if (tileId <= 0) return;
          const sx = (tileId % 64) * 16;
          const sy = Math.floor(tileId / 64) * 16;
          ctxOff.drawImage(tileset, sx, sy, 16, 16, px, py, 16, 16);
        };

        // 1. Checkerboard Grass (Tiles 65, 66 - leaves river transparent!)
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.ground[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 2. Dirt Roads & Yard Clearing (Tiles 2181..2311)
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.paths[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 3. River Cliff Bank (Row 16: Tile 468, Col 19: Tile 2245)
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.riverCliff[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 4. Wooden Fishing Pier (Deck: Tile 358, Pilings: Tile 290)
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.pier[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 5. Background Trees Behind Workshop Cabin
        ctxOff.drawImage(oakTree, 0, 0, 32, 34, 5 * 16 + 8, 2 * 16, 32, 34);
        ctxOff.drawImage(pineTree, 0, 0, 28, 43, 11 * 16 + 4, 1 * 16 + 8, 28, 43);
        ctxOff.drawImage(pineTree, 0, 0, 28, 43, 8 * 16 + 4, 1 * 16, 28, 43);

        // 6. Farm Boundary Fences (North/South Rail: Tile 103, East Posts: Tile 167)
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.fence[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 7. Farm Tilled Soil Patches (soil_00.png: 16x12 px)
        FARM_CROP_ROWS.forEach((cropRow) => {
          for (let c = cropRow.startCol; c <= cropRow.endCol; c++) {
            ctxOff.drawImage(soil, c * 16, cropRow.row * 16 + 4);
          }
        });

        // 8. Workshop Cabin Structures & Blacksmith Forge
        for (let r = 0; r < REFINED_ROWS; r++) {
          for (let c = 0; c < REFINED_COLS; c++) {
            stampTile(terrain.structures[r * REFINED_COLS + c], c * 16, r * 16);
          }
        }

        // 9. Campsite Stone Campfire Ring (23x20 px with drop shadow)
        ctxOff.drawImage(campfireRing, 24 * 16 - 3, 7 * 16 - 2, 23, 20);

        // 10. Campsite Stump Seats (Tile 351) around fire
        const stumpSeats = [
          { x: 22 * 16 + 8, y: 7 * 16 },
          { x: 26 * 16,     y: 7 * 16 },
          { x: 24 * 16 + 4, y: 9 * 16 },
        ];
        stumpSeats.forEach((stump) => {
          ctxOff.fillStyle = "rgba(10, 30, 15, 0.35)";
          ctxOff.beginPath();
          ctxOff.ellipse(stump.x + 8, stump.y + 12, 6, 3, 0, 0, Math.PI * 2);
          ctxOff.fill();
          stampTile(351, stump.x, stump.y);
        });

        // 11. Authentic Standalone Oak Trees (spr_deco_tree_01_strip4: 32x34 px)
        OAK_TREES.forEach((tree) => {
          ctxOff.drawImage(oakTree, 0, 0, 32, 34, tree.x, tree.y, 32, 34);
        });

        // 12. Authentic Standalone Pine Trees (spr_deco_tree_02_strip4: 28x43 px)
        PINE_TREES.forEach((tree) => {
          ctxOff.drawImage(pineTree, 0, 0, 28, 43, tree.x, tree.y, 28, 43);
        });

        // 13. Berry Bushes (Tile 158 with red fruit)
        BERRY_BUSHES.forEach((bush) => {
          ctxOff.fillStyle = "rgba(10, 30, 15, 0.32)";
          ctxOff.beginPath();
          ctxOff.ellipse(bush.x + 8, bush.y + 13, 7, 3, 0, 0, Math.PI * 2);
          ctxOff.fill();
          stampTile(158, bush.x, bush.y);
        });

        // 14. Natural Clutter (White Daisies 223, River Pebbles 287, Weathered Stumps 351)
        TERRAIN_CLUTTER.forEach((clutter) => {
          ctxOff.fillStyle = "rgba(10, 30, 15, 0.28)";
          ctxOff.beginPath();
          ctxOff.ellipse(clutter.x + 8, clutter.y + 12, 5, 2.5, 0, 0, Math.PI * 2);
          ctxOff.fill();
          stampTile(clutter.tileId, clutter.x, clutter.y);
        });
      }

      offscreenCanvasRef.current = offscreen;
      setIsReady(true);
    }

    loadAllAssets();
    return () => {
      active = false;
    };
  }, []);

  // Center camera onto the 512x352 island on load/resize
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const zoom = Math.min(Math.max(Math.floor((ch / 360) * 10) / 10, 2.0), 3.2);

    cameraRef.current = {
      x: Math.round((cw - REFINED_PIXEL_WIDTH * zoom) / 2),
      y: Math.round((ch - REFINED_PIXEL_HEIGHT * zoom) / 2),
      zoom,
    };
  }, [isReady]);

  // Handle adding commits & watering
  const handleAddCommit = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newCommits = p.commits + 1;
        return {
          ...p,
          commits: newCommits,
          activeStreak: p.activeStreak + 1,
          isWatered: true,
          lastShipped: "Just now",
        };
      })
    );
  }, []);

  // Handle focus pomodoro toggle
  const handleToggleFocus = useCallback(() => {
    setCampfire((prev) => ({
      ...prev,
      isFocusActive: !prev.isFocusActive,
    }));
  }, []);

  // 60 FPS Render Loop: Animated River Water + Baked Static Terrain + Dynamic Crops + VFX + Living Characters
  useEffect(() => {
    let animId: number;

    function render(time: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false;

      // Deep void studio background
      ctx.fillStyle = "#0c1017";
      ctx.fillRect(0, 0, displayW, displayH);

      const { x: camX, y: camY, zoom } = cameraRef.current;
      ctx.translate(camX, camY);
      ctx.scale(zoom, zoom);

      const assets = assetsRef.current;

      // 1. Layer 0: Animated River Water Caustics (beneath terrain & pier)
      if (assets) {
        const frameIdx = Math.floor(time / 220) % 4;
        const waterTileId = 1163 + frameIdx;
        const waterSx = (waterTileId % 64) * 16;
        const waterSy = Math.floor(waterTileId / 64) * 16;
        for (let r = 16; r < REFINED_ROWS; r++) {
          for (let c = 0; c <= RIVER_COLS_MAX; c++) {
            ctx.drawImage(assets.tileset, waterSx, waterSy, 16, 16, c * 16, r * 16, 16, 16);
          }
        }

        // White foam waves along cliff edge in water
        const foamSx = (1153 % 64) * 16;
        const foamSy = Math.floor(1153 / 64) * 16;
        for (let c = 0; c <= RIVER_COLS_MAX; c++) {
          if (c >= 9 && c <= 10) continue; // pier attachment
          ctx.drawImage(assets.tileset, foamSx, foamSy, 16, 16, c * 16, 16 * 16, 16, 16);
        }
      }

      // 2. Layer 1: Baked Static Terrain (Grass, Paths, Cliff Bank, Fishing Pier, Cabin, Trees, Stumps, Soil)
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      }

      // 3. Layer 2: Dynamic Growing Crops on Tilled Soil Beds
      if (assets) {
        FARM_CROP_ROWS.forEach((cropRow) => {
          const project = projects.find((p) => p.id === cropRow.projectId);
          const stage = project ? getCropStage(project.commits) : "00";
          const carrotImg = assets.carrots[stage];

          if (carrotImg) {
            for (let c = cropRow.startCol; c <= cropRow.endCol; c++) {
              ctx.drawImage(carrotImg, c * 16 + 3, cropRow.row * 16);
            }
          }
        });
      }

      // 4. Animated VFX: Chimney Smoke & Campfire Flame
      if (assets) {
        // A. Chimney Smoke rising from North Workshop cabin (30 frames loop, 70ms/frame)
        const smokeFrame = Math.floor(time / 70) % 30;
        const smokeSx = smokeFrame * 15;
        ctx.drawImage(
          assets.chimneySmoke,
          smokeSx, 0, 15, 37,
          8 * 16 + 3, 5 * 16 - 32, 15, 37
        );

        // B. Campfire Flame flickering in stone circle (4 frames loop, 120ms/frame)
        const fireFrame = Math.floor(time / 120) % 4;
        const fireSx = fireFrame * 5;
        ctx.drawImage(
          assets.fire,
          fireSx, 0, 5, 10,
          24 * 16 + 6, 7 * 16 + 2, 5, 10
        );
      }

      // 5. Animated Living Characters: Farmer & Coastal Fisher
      if (assets) {
        // A. Working Farmer: Layered (Base + Hair + Tool) watering Row 1 (IndieForest App)
        // 5 frames loop (200ms/frame), 96x64 px layered sprite
        // Flipped horizontally to face LEFT towards the crops!
        const isWateringCycle = Math.floor(time / 3000) % 2 === 0;
        const farmerFrame = isWateringCycle ? Math.floor(time / 200) % 5 : 0;
        const farmerSx = farmerFrame * 96;
        const farmerX = 3 * 16 + 6;
        const farmerY = 6 * 16 + 8;

        ctx.save();
        ctx.scale(-1, 1);
        const drawX = -(farmerX + 96);
        ctx.drawImage(assets.farmerBase, farmerSx, 0, 96, 64, drawX, farmerY, 96, 64);
        ctx.drawImage(assets.farmerHair, farmerSx, 0, 96, 64, drawX, farmerY, 96, 64);
        ctx.drawImage(assets.farmerTool, farmerSx, 0, 96, 64, drawX, farmerY, 96, 64);
        ctx.restore();

        // Blue droplet spray particle physics when actively pouring water
        if (isWateringCycle && farmerFrame >= 1 && farmerFrame <= 3) {
          ctx.fillStyle = "#38bdf8";
          const dropProgress = ((time % 600) / 600);
          ctx.beginPath();
          ctx.arc(farmerX + 24 - dropProgress * 18, farmerY + 36 + dropProgress * 8, 1.2, 0, Math.PI * 2);
          ctx.arc(farmerX + 20 - dropProgress * 14, farmerY + 38 + dropProgress * 6, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }

        // B. Coastal Fisher at Wooden Pier Deck
        // Layered (Base + Hair + Tool) overlooking river
        const fishX = 9 * 16 - 36;
        const fishY = 16 * 16 - 16;

        ctx.drawImage(assets.fisherBase, 0, 0, 96, 64, fishX, fishY, 96, 64);
        ctx.drawImage(assets.fisherHair, 0, 0, 96, 64, fishX, fishY, 96, 64);
        ctx.drawImage(assets.fisherTool, 0, 0, 96, 64, fishX, fishY, 96, 64);

        // Fine fishing line dipping into water with rhythmic bobber ripple
        const rodTipX = fishX + 66;
        const rodTipY = fishY + 32;
        const bobberX = fishX + 78;
        const bobberY = fishY + 68;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.quadraticCurveTo(rodTipX + 8, rodTipY + 18, bobberX, bobberY);
        ctx.stroke();

        // Red/white bobber bead
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(bobberX - 1, bobberY - 1, 2, 2);

        // Expanding gentle water ripple
        const ripplePhase = (time % 1600) / 1600;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * (1 - ripplePhase)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(bobberX, bobberY + 1, 3 + ripplePhase * 5, 1.5 + ripplePhase * 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 6. Hover Highlight & Tooltip on Interactive Zones
      if (hoveredZone) {
        const b = hoveredZone.bounds;
        ctx.strokeStyle = "rgba(52, 211, 153, 0.85)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
        ctx.setLineDash([]);

        // Semi-transparent highlight tint
        ctx.fillStyle = "rgba(52, 211, 153, 0.12)";
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      // 7. Island Outer Border Outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, REFINED_PIXEL_WIDTH, REFINED_PIXEL_HEIGHT);

      ctx.restore();
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [projects, hoveredZone]);

  // Mouse pan & zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const totalDist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);

      if (totalDist > 4) {
        didDragRef.current = true;
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
    }

    // Inspect hovered tile coordinates & detect interactive zone
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = e.clientX - rect.left;
    const mouseCanvasY = e.clientY - rect.top;

    const { x: camX, y: camY, zoom } = cameraRef.current;
    const worldX = Math.floor((mouseCanvasX - camX) / zoom);
    const worldY = Math.floor((mouseCanvasY - camY) / zoom);

    if (worldX >= 0 && worldX < REFINED_PIXEL_WIDTH && worldY >= 0 && worldY < REFINED_PIXEL_HEIGHT) {
      setHoverCoord({
        col: Math.floor(worldX / TILE_SIZE),
        row: Math.floor(worldY / TILE_SIZE),
        x: worldX,
        y: worldY,
      });

      // Find matching interactive zone
      const found = INTERACTIVE_ZONES.find(
        (z) =>
          worldX >= z.bounds.x &&
          worldX <= z.bounds.x + z.bounds.w &&
          worldY >= z.bounds.y &&
          worldY <= z.bounds.y + z.bounds.h
      );
      setHoveredZone(found || null);
    } else {
      setHoverCoord(null);
      setHoveredZone(null);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;

    // Handle click interaction if mouse was not dragged
    if (!didDragRef.current && hoveredZone) {
      if (hoveredZone.type === "project" && hoveredZone.projectId) {
        setSelectedProjectId(hoveredZone.projectId);
        setActiveModal("project");
      } else {
        setActiveModal(hoveredZone.type);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.min(Math.max(cameraRef.current.zoom * zoomFactor, 1.2), 4.5);

    const worldX = (mouseX - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - cameraRef.current.y) / cameraRef.current.zoom;

    cameraRef.current.zoom = newZoom;
    cameraRef.current.x = mouseX - worldX * newZoom;
    cameraRef.current.y = mouseY - worldY * newZoom;
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-slate-950">
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${hoveredZone ? "cursor-pointer" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Floating Interactive Zone Inspector Pill */}
      {hoveredZone && (
        <div className="fixed top-20 left-4 z-40 px-3.5 py-2 rounded-xl bg-stone-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {hoveredZone.title}
          </div>
          <div className="text-[11px] text-stone-400 font-mono">{hoveredZone.subtitle}</div>
        </div>
      )}

      {/* Tile & Pixel Coordinate Pill */}
      {hoverCoord && (
        <div className="fixed bottom-4 right-4 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-stone-900/90 border border-stone-700 shadow-xl backdrop-blur-md text-[11px] font-mono text-stone-300 flex items-center gap-3">
          <span className="text-emerald-400">
            Tile: [{hoverCoord.col}, {hoverCoord.row}]
          </span>
          <span className="text-stone-400">
            Pixel: ({hoverCoord.x}, {hoverCoord.y})
          </span>
        </div>
      )}

      {/* Modals & Detail Drawers */}
      <SpikeModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedProject={selectedProject}
        revenue={revenue}
        campfire={campfire}
        onAddCommit={handleAddCommit}
        onToggleFocus={handleToggleFocus}
      />
    </div>
  );
}


# ARCHITECTURE.md — Technical Blueprint

---

## System Overview

```
[Next.js 16 App Router (Turbopack)]
   ├── Pages: /, /dashboard, /logos, /u/[username], /sign-in, /sign-up
   ├── API Routes: /api/github, /api/webhooks/revenue, /api/og
   └── UI System: Double-Bezel Porcelain Components (Modal, Button, Badge, FloatingDock, TopStatusBar)
        │
   [React Three Fiber v9 Canvas]
   ├── CameraRig (Isometric Parallax Tilt)
   ├── TerrainIsland (Stepped Voxel Strata, Oasis Pond)
   ├── BlockTree (5-Tier Low-Poly Meshes, Dual Emerald/Golden Groves)
   ├── CampProps (Milestone Campfire, Tent, Cabin, Clouds, Lanterns, Pier)
   └── WeatherSystem (Dynamic Sun, Instanced Rain Particles, Night Fireflies)
        │
   [Domain Core (Pure TypeScript / Vitest)]
   ├── gamification.ts (XP curves, streak decay, shield rules, automatic tier progression)
   └── revenueWebhook.ts (Stripe, Lemon Squeezy, Polar webhook normalizer)
```

---

## Services & Responsibilities

| Service | Where it runs | What it owns |
|---|---|---|
| **Next.js App Router** | Vercel (Edge / Node) | UI layout, SSR hydration guards, static landing page, dashboard, public profile |
| **React Three Fiber Canvas** | Client Browser (WebGL) | 3D voxel terrain, stepped pine trees, particle weather, cursor parallax (`zoom: 29` default) |
| **Clerk Authentication** | Cloud / Client | 1-click Google OAuth with zero dev friction |
| **`/api/github` Route** | Vercel Serverless Function | Public GitHub repo commit polling |
| **`/api/webhooks/revenue` Route** | Vercel Serverless Function | Ingestion for Stripe, Lemon Squeezy, and Polar |
| **Zustand Gamification Store** | Client Browser (LocalStorage) | XP progression, streak states, tree entities, quest checkoffs |
| **Web Audio API Synth Engine** | Client Browser (Web Audio) | Synthesized retro chimes, coin sounds, level fanfare |

---

## File Tree

```
D:\IndieForest\
├── public/
│   ├── logos/
│   │   ├── indieforest_logo.svg       — Official Master Squircle Logo
│   │   └── indieforest_logo_mark.svg  — Transparent Official Logo Mark
│   └── icon.svg                       — Browser Favicon asset
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── github/route.ts        — GitHub commit sync endpoint
│   │   │   ├── og/route.tsx           — OpenGraph social preview generator
│   │   │   └── webhooks/revenue/      — Universal Stripe/LemonSqueezy/Polar webhook
│   │   ├── dashboard/page.tsx         — Fullscreen 3D diorama app with top & bottom HUD
│   │   ├── logos/page.tsx             — Official Brand Identity showcase
│   │   ├── u/[username]/page.tsx      — Public shareable 3D diorama profile
│   │   ├── layout.tsx                 — Root layout & ClerkProvider
│   │   └── globals.css                — Tailwind CSS v4 & Double-Bezel tokens
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── BlockTree.tsx          — Dual-grove stepped pine tree mesh
│   │   │   ├── CampProps.tsx          — Campfire, tent, cabin, pier, lanterns
│   │   │   ├── ForestCanvas.tsx       — Fixed orthographic canvas with CameraRig
│   │   │   ├── TerrainIsland.tsx      — Stepped voxel earth strata and pond
│   │   │   └── WeatherSystem.tsx      — Day/Night lighting and particle rain
│   │   ├── hud/
│   │   │   ├── AddTreeModal.tsx       — Dual-grove planter & live webhook endpoint
│   │   │   ├── CampShopModal.tsx      — In-game pinecone decor store
│   │   │   ├── FloatingDock.tsx       — Bottom action dock (Streak, Ship, Tree, Shop, Share)
│   │   │   ├── SettingsModal.tsx      — Settings and webhook copy console
│   │   │   ├── ShareCardModal.tsx     — 3D snapshot generator with clipboard copy
│   │   │   ├── ShipModal.tsx          — Daily ship logger (Manual / GitHub)
│   │   │   ├── SproutGuide.tsx        — Virgin island floating onboarding pointer
│   │   │   └── TopStatusBar.tsx       — Top navigation, Quests popover, and Quick Controls
│   │   └── ui/
│   │       ├── Badge.tsx              — Ergonomic status chips & pill badges
│   │       ├── Button.tsx             — Tactile specular porcelain buttons
│   │       ├── Card.tsx               — Inset porcelain containers
│   │       ├── Modal.tsx              — Double-bezel modal wrapper
│   │       └── SegmentedControl.tsx   — Pill tab switcher
│   ├── lib/
│   │   ├── gamification.ts            — Pure domain gamification math
│   │   ├── revenueWebhook.ts          — Universal payment webhook normalizer
│   │   ├── sound.ts                   — Synthesized Web Audio engine
│   │   └── supabase/client.ts         — Supabase client
│   ├── store/
│   │   └── useForestStore.ts          — Zustand state store with persistence
│   └── types/
│       └── game.ts                    — Canonical domain entities
```

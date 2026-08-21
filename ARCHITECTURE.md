# ARCHITECTURE.md — Technical Blueprint
#
# LOAD ON-DEMAND ONLY — not every session.
# How to load: "Read ARCHITECTURE.md before we continue."
# When to load: major structural changes, new dev onboarding.

---

## System Overview

```
[Next.js 16 App Router (Turbopack)]
   ├── Pages: /, /dashboard, /logos, /u/[username]
   ├── API Routes: /api/github, /api/webhooks/revenue
   └── UI System: Double-Bezel Porcelain Components (Modal, Button, Badge, FloatingDock)
        │
   [React Three Fiber v9 Canvas]
   ├── CameraRig (Isometric Parallax Tilt)
   ├── TerrainIsland (Stepped Voxel Strata, Oasis Pond)
   ├── BlockTree (5-Tier Low-Poly Meshes, Click Raycasting)
   ├── CampProps (Milestone Campfire, Tent, Cabin, Clouds)
   └── WeatherSystem (Dynamic Sun, Instanced Rain Particles, Fireflies)
        │
   [Domain Core (Pure TypeScript / Vitest)]
   ├── gamification.ts (XP curves, streak decay, shield rules, rank titles)
   └── revenueWebhook.ts (Stripe, Lemon Squeezy, Polar webhook normalizer)
```

---

## Services & Responsibilities

| Service | Where it runs | What it owns |
|---------|--------------|--------------|
| Next.js App Router | Vercel (Edge / Node) | UI layout, SSR hydration guards, static landing page, dashboard, public profile |
| React Three Fiber Canvas | Client Browser (WebGL) | 3D voxel terrain, stepped pine trees, particle weather, cursor parallax |
| `/api/github` Route | Vercel Serverless Function | Public GitHub repo commit polling and rate-limit handling |
| `/api/webhooks/revenue` Route | Vercel Serverless Function | Universal webhook ingestion for Stripe, Lemon Squeezy, and Polar |
| Zustand Gamification Store | Client Browser (LocalStorage) | XP curve progression, daily streak states, tree entities, quest checkoffs |
| Web Audio API Synth Engine | Client Browser (Web Audio) | Zero-latency synthesized retro chimes, coin sounds, level fanfare |

---

## File Tree

```
D:\IndieForest\
├── public/
│   ├── logos/
│   │   ├── indieforest_logo.svg       — Official 512x512 Master Squircle Logo
│   │   └── indieforest_logo_mark.svg  — Transparent Official Logo Mark
│   └── icon.svg                       — Browser Favicon asset
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── github/route.ts        — GitHub commit sync endpoint
│   │   │   └── webhooks/revenue/      — Universal Stripe/LemonSqueezy/Polar webhook
│   │   ├── dashboard/page.tsx         — Fullscreen 3D diorama app with top & bottom HUD
│   │   ├── logos/page.tsx             — Official Brand Identity showcase & scale inspector
│   │   ├── u/[username]/page.tsx      — Public shareable 3D diorama profile
│   │   ├── globals.css                — Tailwind v4 design tokens, scrollbar hide, porcelain tokens
│   │   ├── layout.tsx                 — Typography loader & app metadata
│   │   ├── not-found.tsx              — 404 fallback page
│   │   └── page.tsx                   — Main landing page with 3D diorama hero & bento grid
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── BlockTree.tsx          — 5-tier stepped low-poly pine trees with hover bounce
│   │   │   ├── CampProps.tsx          — Campfire, smoke puffs, tent, cabin, drifting clouds
│   │   │   ├── ForestCanvas.tsx       — Locked isometric canvas with <CameraRig /> parallax
│   │   │   ├── TerrainIsland.tsx      — Stepped voxel earth, terracotta clay strata, oasis pond
│   │   │   └── WeatherSystem.tsx      — Sunlight directional shadows, rain particles, fireflies
│   │   ├── hud/
│   │   │   ├── AddTreeModal.tsx       — Subscriber customer tree adder modal
│   │   │   ├── FloatingDock.tsx       — Unified bottom Double-Bezel control dock
│   │   │   ├── SettingsModal.tsx      — Backend cloud sync & Universal Webhook configuration
│   │   │   ├── ShareCardModal.tsx     — 1-click build-in-public social card exporter
│   │   │   └── ShipModal.tsx          — 1-click manual & GitHub commit verification modal
│   │   └── ui/
│   │       ├── Badge.tsx              — Standardized geometric badges
│   │       ├── Button.tsx             — Tactile Button-in-Button components with specular glints
│   │       └── Modal.tsx              — Canonical porcelain double-bezel modal wrapper
│   ├── lib/
│   │   ├── gamification.ts            — Clean Code pure domain calculations (XP, streaks, ranks)
│   │   ├── gamification.test.ts       — Vitest unit test suite (13 domain tests)
│   │   ├── revenueWebhook.ts          — Universal Revenue Webhook parser
│   │   ├── revenueWebhook.test.ts     — Vitest unit test suite (6 webhook tests)
│   │   └── sound.ts                   — Web Audio synthesized retro sound generator
│   ├── store/
│   │   └── useForestStore.ts          — Zustand store with localStorage persistence
│   └── types/
│       └── r3f.d.ts                   — JSX intrinsic elements for React 19 + R3F
├── supabase/
│   └── migrations/                    — PostgreSQL schema & RLS policies
├── docs/adr/ (0001 through 0005)
├── .agents/AGENTS.md                  — Project rules & session resume
├── ARCHITECTURE.md                    — Master technical blueprint
├── CONTEXT.md                         — Domain language & business rules
├── JOURNAL.md                         — Product diary & engineering log
├── README.md                          — Developer & public overview
├── package.json
└── tsconfig.json
```

---

## API Contracts

| Method | Route | Auth required | What it does |
|--------|-------|--------------|--------------|
| GET | `/api/github?username=X&repo=Y` | ❌ (Public) | Fetches latest 10 commits from public GitHub repository for 1-click daily shipping |
| POST | `/api/webhooks/revenue` | ❌ (Token URL) | Ingests Stripe, Lemon Squeezy, and Polar webhook events to plant Customer Trees |

---

## Key Data Flows

### Daily Shipping Flow
```
Developer clicks "SHIP IT" (or syncs GitHub repo)
→ Form submits payload (message, source, proofUrl)
→ Pure domain calculateShipRewards() computes XP (+100 base, +streak bonus, +proof bonus)
→ evaluateLevelProgress() calculates excess XP remainder rollover
→ Web Audio engine triggers level fanfare or rain sound
→ 3D Canvas instanced rain particles fall for 4.5s
→ Floating Dock updates Level, XP bar, and Streak Flame
→ LocalStorage persists updated state
```

### Revenue Webhook Flow
```
Customer purchases product via Stripe / Lemon Squeezy / Polar
→ Platform emits webhook POST to /api/webhooks/revenue?token=sample_webhook_token
→ Pure domain parseRevenueWebhook() identifies event, customer name, and MRR contribution
→ Returns verified customer tree payload
→ Zustand store plants customer tree on 3D island terrain
```

---

## Historical Decisions

| Date | Decision | Why |
|------|---------|-----|
| 2026-08-20 | React Three Fiber v9 + Three.js 0.170 | Procedural 3D depth, real-time shadows, and zero sprite generation latency |
| 2026-08-20 | Next.js 16.3.1 (Turbopack) + React 19 | Sub-second compilation and native client component type validation |
| 2026-08-20 | Locked Isometric Camera with Cursor Parallax | Fixed diorama framing eliminates disorientation while retaining tactile depth |
| 2026-08-20 | Warm Studio Linen Palette (`#ece7de`) | Eliminates stark pure white glare and gives a warm papercraft diorama aesthetic |
| 2026-08-20 | Pure Domain Logic in `gamification.ts` & `revenueWebhook.ts` | Complete separation of concerns with 100% test coverage via Vitest (19/19 passing) |
| 2026-08-20 | Canonical Double-Bezel Modal Architecture | Unifies all modals and floating docks with `glass-dock` outer + `porcelain-surface` inner chamber |
| 2026-08-20 | Global Scrollbar Suppression | Eliminates ugly browser scrollbars while keeping fluid wheel and touch scrolling active |
| 2026-08-20 | Universal Host Binding `0.0.0.0:3000` | Enables seamless Antigravity IDE and internal Chromium webview routing |

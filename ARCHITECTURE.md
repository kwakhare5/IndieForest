# ARCHITECTURE.md — Technical Blueprint

---

## System Overview

```
[Next.js 16 App Router (Turbopack)]
   ├── Pages: /, /dashboard (Full-screen Game), /logos, /u/[username], /sign-in, /sign-up
   ├── API Routes: /api/github, /api/github/preview, /api/badge/[username], /api/webhooks/revenue, /api/og
   └── UI System: Solid Porcelain Double-Bezel Components & Floating Game HUD
        │
   [React Three Fiber v9 Canvas Engine]
   ├── ForestCanvas (Fixed Orthographic Camera, Elastic Mouse Parallax Tilt)
   ├── TerrainIsland (2-Layer Chamfered Slab, Central Riverstone Path, Oasis Pond)
   ├── BlockTree (5-Tier Pyramid Conifers, Torus Halos, 3D Floating Billboard Badges)
   ├── CampProps (Milestone Campfire, Day 7 Tent, Day 14 Cabin, Shoreline Pier, Lanterns)
   └── WeatherSystem (Instanced Rain Showers, Golden Sparkles, Dormancy Fog)
        │
   [Domain Core (Pure TypeScript / Vitest)]
   ├── gamification.ts (XP curves, streak evaluation, shield rules, tier progression)
   ├── revenueWebhook.ts (Universal Stripe, Lemon Squeezy, Polar normalizer)
   ├── sound.ts (Procedural Web Audio lo-fi campfire synthesizer & chimes)
   └── videoExport.ts (Client-side 60fps MediaRecorder orbit video generator)
```

---

## Services & Responsibilities

| Service | Where it runs | What it owns |
|---|---|---|
| **Next.js App Router** | Vercel (Edge / Node) | Full-screen game layout, SSR hydration guards, static landing page, public profile |
| **React Three Fiber Canvas** | Client Browser (WebGL) | 3D living diorama, conifer meshes, particle weather, cursor parallax (`zoom: 29` default) |
| **Clerk Authentication** | Cloud / Client | 1-click Google OAuth with zero dev friction |
| **`/api/github` & `/api/github/preview`** | Vercel Serverless Function | Public GitHub event stream ingestion & 60s commit polling |
| **`/api/webhooks/revenue`** | Vercel Serverless Function | Ingestion and normalization for Stripe, Lemon Squeezy, and Polar |
| **`/api/badge/[username]`** | Vercel Edge Function | Real-time vector SVG diorama and pill badges for GitHub READMEs |
| **Zustand Gamification Store** | Client Browser (LocalStorage) | XP progression, streak states, tree entities, offline persistence |
| **Web Audio API Synth Engine** | Client Browser (Web Audio) | Procedural lo-fi campfire crackle ambiance, retro click sounds, fanfare |
| **MediaRecorder Video Capture** | Client Browser (MediaStream) | 60fps $360^\circ$ orbit video capture with instant download |

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
│   │   │   ├── badge/[username]/      — Dynamic SVG README Badge Endpoint
│   │   │   ├── github/                — GitHub commit check endpoint
│   │   │   ├── github/preview/        — Live GitHub profile island preview
│   │   │   ├── og/                    — OpenGraph social preview generator
│   │   │   └── webhooks/revenue/      — Universal Stripe/LemonSqueezy/Polar webhook
│   │   ├── dashboard/page.tsx         — Full-screen 3D game island with overlay HUD
│   │   ├── logos/page.tsx             — Official Brand Identity showcase
│   │   ├── u/[username]/page.tsx      — Public shareable 3D diorama profile
│   │   ├── layout.tsx                 — Root layout & ClerkProvider
│   │   └── globals.css                — Tailwind CSS v4 & Porcelain tokens
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── BlockTree.tsx          — 5-tier conifer mesh & 3D billboard tags
│   │   │   ├── CampProps.tsx          — Campfire, tent, cabin, pier, lanterns
│   │   │   ├── ForestCanvas.tsx       — Fixed orthographic canvas with parallax rig
│   │   │   ├── TerrainIsland.tsx      — 2-layer chamfered meadow slab & pond
│   │   │   └── WeatherSystem.tsx      — Particle rain, gold bursts, and fog
│   │   ├── hud/
│   │   │   ├── DashboardBuilderCapsule.tsx — Top-left status capsule
│   │   │   ├── DashboardGameControls.tsx   — Top-right game controls pod
│   │   │   ├── FloatingDock.tsx            — Bottom porcelain action dock
│   │   │   ├── TreeInspectorCard.tsx       — In-world 3D tree inspector card
│   │   │   ├── ModuleInventoryDrawer.tsx   — Right slide-over module inventory
│   │   │   ├── TimelineScrubber.tsx        — 30-day time-travel growth scrubber
│   │   │   ├── TurntableExportModal.tsx    — 10s 60fps turntable video exporter
│   │   │   ├── CampfireFocusModal.tsx      — Milestone Campfire daily focus modal
│   │   │   ├── TentSabbaticalModal.tsx     — Streak Shield Vault & rest planner
│   │   │   ├── CabinWarRoomModal.tsx       — Multi-repo command HQ modal
│   │   │   ├── ShareCardModal.tsx          — 1200×675 3D card compositor
│   │   │   ├── AddTreeModal.tsx            — Project tree planter & webhook simulator
│   │   │   ├── SettingsModal.tsx           — Settings & webhook copy console
│   │   │   └── GuestbookModal.tsx          — Campsite visitor guestbook
│   │   ├── landing/
│   │   │   ├── LandingNavbar.tsx           — Floating porcelain navbar
│   │   │   ├── LandingHero.tsx             — Live 3D interactive hero diorama
│   │   │   ├── LandingSectionHeader.tsx    — Standardized section header
│   │   │   ├── LandingFeatureCard.tsx      — Standardized porcelain feature card
│   │   │   ├── LandingRitual.tsx           — 3-step zero-touch loop
│   │   │   ├── LandingShowcase.tsx         — Dual-grove breakdown
│   │   │   ├── LandingBento.tsx            — Anti-burnout & distribution bento
│   │   │   ├── LandingFaq.tsx              — Transparent FAQ
│   │   │   └── LandingFooter.tsx           — Final CTA card & links
│   │   └── ui/
│   │       ├── Badge.tsx              — Ergonomic status chips & pill badges
│   │       ├── Button.tsx             — Tactile specular porcelain buttons
│   │       ├── Card.tsx               — Solid porcelain double-bezel containers
│   │       ├── Modal.tsx              — Universal double-bezel modal wrapper
│   │       └── SegmentedControl.tsx   — Tactile sliding pill tab switcher
│   ├── lib/
│   │   ├── gamification.ts            — Pure domain gamification math
│   │   ├── github.ts                  — Edge-cached GitHub Events API parser
│   │   ├── revenueWebhook.ts          — Universal payment webhook normalizer
│   │   ├── badge.ts                   — Dynamic SVG README badge renderer
│   │   ├── sound.ts                   — Procedural Web Audio synthesizer
│   │   └── videoExport.ts             — Client-side 60fps MediaRecorder video generator
│   ├── store/
│   │   └── useForestStore.ts          — Zustand state store with persistence
│   └── types/
│       └── game.ts                    — Canonical domain entities
```

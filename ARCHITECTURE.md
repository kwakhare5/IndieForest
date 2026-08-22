# ARCHITECTURE.md — Technical Architecture & Blueprint

---

## 1. System Overview

IndieForest is engineered as a high-performance Next.js 16 web application with clear separation between marketing landing surfaces, authenticated builder dashboards, public diorama profiles, domain logic, and serverless webhook pipelines.

```
[ Next.js 16 App Router (Turbopack) ]
   ├── Pages:
   │    ├── / (Landing Page: 7 Modular Surfaces in src/components/landing/)
   │    ├── /dashboard (Edge-to-Edge 3D Living Diorama + 3-Zone Tactical HUD)
   │    ├── /gallery (3D Component Showroom: Conifers, Oaks, Campsite, Fauna)
   │    ├── /u/[username] (Public Builder Showcase & Guestbook)
   │    └── /sign-in, /sign-up (Clerk Managed Authentication)
   │
   ├── API Routes (Vercel Serverless):
   │    ├── /api/github (Zero-Touch GitHub Event Polling & Streak Calculation)
   │    ├── /api/github/preview (Zero-Latency Famous Builder Previews)
   │    ├── /api/webhooks/revenue (Stripe, Lemon Squeezy, Polar Webhook Normalizer)
   │    ├── /api/badge/[username] (Dynamic SVG Vector README Badges)
   │    └── /api/og (Dynamic OpenGraph Social Image Generator)
   │
   ├── Universal UI System (src/components/ui/):
   │    └── Double-Bezel Porcelain Primitives (Card, Button, Badge, Modal, SegmentedControl)
   │
   ├── 3D Canvas Engine (src/components/canvas/):
   │    ├── ForestCanvas.tsx (Isometric orthographic camera rig & lighting)
   │    ├── TerrainIsland.tsx (Chamfered procedural diorama island slab)
   │    ├── BlockTree.tsx (Interactive tree with spring hover lerp & billboard)
   │    └── models/
   │         ├── ConiferTree.tsx (Alpine Evergreen Pine lineage for GitHub Shipping)
   │         ├── DeciduousTree.tsx (Golden Broadleaf Money Oak lineage for Stripe MRR)
   │         ├── Campfire.tsx, CanvasTent.tsx, LogCabin.tsx (Campsite Hubs)
   │         └── RobinBird.tsx, CampDog.tsx, LanternPost.tsx, Flagpole.tsx (Fauna/Props)
   │
   ├── Domain Core (src/lib/):
   │    ├── gamification.ts (Side-effect free XP, Streak, Shield, and Tier algorithms)
   │    ├── github.ts (GitHub push parsing, RFC username validation, streak calculation)
   │    ├── revenueWebhook.ts (Multi-gateway payload normalization)
   │    ├── badge.ts (Server-side SVG card & pill generator)
   │    └── sound.ts (Synthesized Web Audio API lo-fi ambiance & tactile chimes)
   │
   └── State Management (src/store/):
        └── useForestStore.ts (Zustand 5.0 store with SSR-safe LocalStorage persistence)
```

---

## 2. Services & Responsibilities

| Service / Layer | Runtime / Location | Core Responsibility |
| :--- | :--- | :--- |
| **Landing Surface** | Client / Server (Next.js SSR) | Modular landing sections, feature bento, interactive hero preview, FAQ |
| **Builder Dashboard** | Client (Authenticated) | Edge-to-edge 3D living diorama with 3-Zone Tactical Porcelain HUD |
| **Showroom Catalog** | Client (`/gallery`) | Interactive 3D asset showroom for conifer & deciduous lineages |
| **Public Showcase** | Client / Server (Next.js SSR) | Shareable builder profile (`/u/[username]`), guestbook, verified badges |
| **Domain Logic** | Pure TypeScript (`src/lib/`) | 100% deterministic algorithms for XP, streaks, levels, and tier scaling |
| **Authentication** | Clerk (`@clerk/nextjs`) | Fast Google OAuth & session management |
| **Universal Webhooks** | Serverless Edge / Node.js | Multi-provider event parsing for Stripe, Lemon Squeezy, and Polar |
| **State Store** | Client (Zustand) | Reactive local state, streak expiry checks, zero-touch sync coordination |

---

## 3. Directory Layout

```
src/
├── app/
│   ├── api/
│   │   ├── badge/[username]/route.ts  — Dynamic SVG README generator
│   │   ├── github/route.ts            — GitHub push sync endpoint
│   │   ├── github/preview/route.ts    — Curated famous builders preview
│   │   ├── og/route.tsx               — Social card OpenGraph generator
│   │   └── webhooks/revenue/route.ts  — Universal revenue webhook handler
│   ├── dashboard/page.tsx             — Edge-to-edge 3D island dashboard
│   ├── gallery/page.tsx               — 3D asset showroom catalog
│   ├── u/[username]/page.tsx          — Public builder diorama & guestbook
│   ├── layout.tsx                     — Root layout with ClerkProvider
│   └── page.tsx                       — Composed modular landing page
├── components/
│   ├── canvas/                        — 3D diorama canvas & procedural models
│   │   ├── ForestCanvas.tsx
│   │   ├── TerrainIsland.tsx
│   │   ├── BlockTree.tsx
│   │   └── models/
│   │       ├── ConiferTree.tsx        — GitHub Evergreen Pine lineage
│   │       ├── DeciduousTree.tsx      — Stripe Golden Money Oak lineage
│   │       ├── ZenStump.tsx           — Sabbatical Rest Stump
│   │       ├── Campfire.tsx           — Daily Focus station
│   │       ├── CanvasTent.tsx         — Sabbatical Rest vault
│   │       ├── LogCabin.tsx           — Founder War Room HQ
│   │       └── CampDog.tsx, RobinBird.tsx, Flagpole.tsx, LanternPost.tsx
│   ├── hud/                           — 3-Zone Tactical Porcelain HUD & Overlays
│   │   ├── DashboardTopLeftNav.tsx    — [← Home] link + Quests & Perk Shop popover
│   │   ├── DashboardGameControls.tsx  — Lighting, Audio & Modules Inventory popover
│   │   ├── FloatingDock.tsx           — Streak, Ship Daily, Share & Stats popover tray
│   │   ├── TreeInspectorCard.tsx      — In-world 3D tree click inspector
│   │   └── modals/                    — CampfireFocus, TentSabbatical, CabinWarRoom, ShareCard, AddTree, Settings
│   ├── landing/                       — Modular landing page sections
│   └── ui/                            — Atomic double-bezel porcelain design system
├── lib/                               — Pure domain math, webhook parsers, and Web Audio API
├── store/                             — Zustand 5.0 store with local persistence
└── types/                             — Strict TypeScript domain types
```

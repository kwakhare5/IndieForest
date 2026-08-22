# ARCHITECTURE.md — Technical Architecture & Blueprint

---

## 1. System Overview

IndieForest is engineered as a high-performance Next.js 16 web application with clear separation between marketing landing surfaces, authenticated builder dashboards, public diorama profiles, domain logic, and Supabase PostgreSQL persistence.

```
[ Next.js 16 App Router (Turbopack) ]
   ├── Pages:
   │    ├── / (Landing Page: 7 Modular Surfaces in src/components/landing/)
   │    ├── /dashboard (Edge-to-Edge 3D Living Diorama + 3-Zone Tactical HUD)
   │    ├── /gallery (3D Component Showroom: Conifers, Oaks, Campsite, Monuments, Fauna)
   │    ├── /u/[username] (Public Builder Showcase & Persistent Guestbook)
   │    ├── /logos (Official Brand Logo Showcase)
   │    └── /sign-in, /sign-up (Clerk Managed Authentication)
   │
   ├── API Routes (Vercel Serverless + Edge):
   │    ├── /api/github (Zero-Touch GitHub Event Polling & Streak Calculation)
   │    ├── /api/github/preview (Zero-Latency Famous Builder & Public Previews)
   │    ├── /api/webhooks/revenue (Stripe, Lemon Squeezy, Polar Webhook Normalizer + Supabase Direct Insert)
   │    ├── /api/badge/[username] (Dynamic SVG Vector README Badges)
   │    └── /api/og (Dynamic OpenGraph Social Image Generator)
   │
   ├── Universal UI System (src/components/ui/):
   │    └── Double-Bezel Porcelain Primitives (Card, Button, Badge, Modal, SegmentedControl)
   │
   ├── 3D Canvas Engine (src/components/canvas/):
   │    ├── ForestCanvas.tsx (Isometric orthographic camera rig, lighting & dynamic zoom)
   │    ├── ModularIsland.tsx (Pure 1:1 symmetrical square modular terrain expansion)
   │    ├── BlockTree.tsx (Interactive tree with spring hover lerp & billboard)
   │    ├── WeatherSystem.tsx (Atmospheric particle & weather simulation)
   │    └── models/
   │         ├── ConiferTree.tsx (Alpine Evergreen Pine lineage for GitHub Shipping)
   │         ├── DeciduousTree.tsx (Golden Broadleaf Money Oak lineage for Stripe MRR)
   │         ├── Campfire.tsx, CanvasTent.tsx, LogCabin.tsx (Campsite Hubs)
   │         ├── Windmill.tsx, HarborPier.tsx, Lighthouse.tsx (Elite High-Level Monuments)
   │         └── CampDog.tsx (Standing Golden Companion), RobinBird.tsx, LanternPost.tsx, Flagpole.tsx
   │
   ├── Database & Cloud Persistence (src/lib/supabase.ts):
   │    └── Supabase PostgreSQL Client (profiles, trees, ship_logs, guestbook_entries)
   │
   ├── Domain Core (src/lib/):
   │    ├── gamification.ts (Side-effect free XP, Streak, Shield, and Tier algorithms)
   │    ├── github.ts (GitHub push parsing, RFC username validation, streak calculation)
   │    ├── revenueWebhook.ts (Multi-gateway payload normalization)
   │    ├── badge.ts (Server-side SVG card & pill generator)
   │    └── sound.ts (Synthesized Web Audio API lo-fi ambiance & tactile chimes)
   │
   └── State Management (src/store/):
        └── useForestStore.ts (Zustand 5.0 store with LocalStorage persistence + Supabase auto-sync)
```

---

## 2. Services & Responsibilities

| Service / Layer | Runtime / Location | Core Responsibility |
| :--- | :--- | :--- |
| **Landing Surface** | Client / Server (Next.js SSR) | Modular landing sections, feature bento, interactive hero preview, FAQ |
| **Builder Dashboard** | Client (Authenticated) | Edge-to-edge 3D living diorama with 3-Zone Tactical Porcelain HUD & cloud sync |
| **Showroom Catalog** | Client (`/gallery`) | Interactive 3D asset showroom for 1:1 square terrain, trees, campsite & fauna |
| **Public Showcase** | Client / Server (Next.js SSR) | Shareable builder profile (`/u/[username]`), Supabase guestbook, verified badges |
| **Database Cloud Layer**| Supabase PostgreSQL | Permanent storage for user profiles, bilateral trees, ship history & cheers |
| **Domain Logic** | Pure TypeScript (`src/lib/`) | 100% deterministic algorithms for XP, streaks, levels, and tier scaling |
| **Authentication** | Clerk (`@clerk/nextjs`) | Instant Google/GitHub OAuth & session management |

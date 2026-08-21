<div align="center">

# 🌲 IndieForest

### Gamified 3D Low-Poly Island & Daily Shipping Momentum Engine for Indie Hackers

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react&style=flat-square)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170.0-black?logo=three.js&style=flat-square)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-38bdf8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-55%2F55%20Passed-emerald?logo=vitest&style=flat-square)](https://vitest.dev/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&style=flat-square)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

*IndieForest turns your daily coding accountability into a living, breathing 3D low-poly diorama. Ship code daily to water your island with real-time particle rain, level up your developer rank, sprout customer pine trees, and unlock camp structures.*

[Live Demo](https://indieforest.dev) · [Report Bug](https://github.com/kwakhare5/IndieForest/issues) · [Brand Assets](https://indieforest.dev/logos)

---

</div>

## 📑 Table of Contents

- [Overview & Vision](#-overview--vision)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
- [Gamification Engine & Progression Math](#-gamification-engine--progression-math)
  - [Level & XP Curve](#level--xp-curve)
  - [Tree Growth Tiers & Coordinates](#tree-growth-tiers--coordinates)
  - [Streak Shields & Burnout Protection](#streak-shields--burnout-protection)
- [API Reference & Webhook Integration](#-api-reference--webhook-integration)
  - [GitHub Zero-Touch Ingestion](#github-zero-touch-ingestion)
  - [Universal Revenue Webhook (Stripe / Lemon Squeezy / Polar)](#universal-revenue-webhook)
  - [Dynamic SVG README Badges](#dynamic-svg-readme-badges)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Performance & Vercel Optimization](#-performance--vercel-optimization)
- [Security & Trust Boundaries](#-security--trust-boundaries)
- [Deployment Guide](#-deployment-guide)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview & Vision

Indie hacking and building software in public can be an isolating grind. Existing productivity tools are dry spreadsheets or rigid kanban boards. **IndieForest** gamifies the developer journey:

1. **Zero-Touch Automated Ingestion:** Connect your GitHub username or Stripe webhook. Every commit push and revenue transaction waters and grows your island automatically.
2. **Visual Proof-of-Work:** Instead of vanity numbers, your momentum is rendered as an isometric 3D voxel diorama in Warm Studio Linen (`#ece7de`) with tactile porcelain double-bezel HUD cards.
3. **Sovereign Dual-Groves:** Pre-revenue builders grow lush emerald forests from pure commit grit; monetized builders grow golden revenue groves with floating MRR badges.

---

## 🚀 Key Features

* **🏝️ Living 3D Procedural Island (React Three Fiber v9 + Three.js 0.170):**
  - Stepped voxel cliffs, turquoise pond ripples, low-poly rocks, clouds, and smooth orthographic cursor parallax.
* **⚡ Dual-Grove Independent Progression:**
  - **Emerald Shipping Grove:** Grown via GitHub commits from Saplings to 4-tier Majestic Pines.
  - **Golden Revenue Grove:** Sprouted automatically when payments arrive from Stripe, Lemon Squeezy, or Polar.
* **🛡️ Burnout Shield Protection:**
  - 7-day shipping milestones grant **Streak Shields** that defend streaks during rest days.
* **🏕️ Dynamic Milestone Camp Unlocks:**
  - Campfire with rising smoke (Day 3), Camping Tent (Day 7), and Log Cabin (Day 14).
* **⏳ 3D Timeline Scrubber & 10s Time-Lapse Player:**
  - Turntable animation player designed for recording high-signal Twitter/X shipping clips.
* **🖼️ Dynamic SVG README Badges (`/api/badge/[username]`):**
  - Server-rendered vector cards and shields.io pills for GitHub README profiles with 0 dependencies.
* **🤝 Public Portfolio & Visitor Interactions (`/u/[username]`):**
  - 1-click **"💧 Water Tree"** visitor cheers (+5 XP) and campsite guestbook notes.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.1 (App Router + Turbopack) | Server Components, dynamic API routes, edge rendering |
| **UI Engine** | React 19 + TypeScript 5.7+ | Component model with strict zero-`any` type safety |
| **3D Graphics** | React Three Fiber v9, Three.js 0.170, Drei v10 | Orthographic isometric low-poly diorama canvas |
| **Auth** | Clerk (`@clerk/nextjs` v7.8+) | Google OAuth, email sign-in, session tokens |
| **Styling** | Tailwind CSS v4 + Satoshi + Jersey 10 | CSS-first configuration and porcelain double-bezel styling |
| **State** | Zustand 5.0.3 + LocalStorage Persistence | SSR-safe store with `indieforest_storage_v4` migration |
| **Testing** | Vitest 4.1.11 | Test-Driven domain core (55/55 unit tests passing) |
| **Audio** | Web Audio API | Synthesized 8-bit retro sound chimes |

---

## 📁 Directory Structure

```
IndieForest/
├── public/
│   ├── logos/
│   │   ├── indieforest_logo.svg       # Official 512x512 Master Squircle Logo
│   │   └── indieforest_logo_mark.svg  # Transparent Official Logo Mark
│   └── icon.svg                       # Browser Favicon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── badge/[username]/      # Dynamic SVG README Badge Endpoint
│   │   │   ├── github/preview/        # Live Zero-Touch GitHub Ingestion API
│   │   │   ├── og/                    # Dynamic Social Share OpenGraph Image
│   │   │   └── webhooks/revenue/      # Universal Stripe / Lemon Squeezy / Polar Webhook
│   │   ├── dashboard/page.tsx         # Fullscreen 3D diorama app & HUD
│   │   ├── logos/page.tsx             # Official brand identity & vector showcase
│   │   ├── u/[username]/page.tsx      # Public shareable 3D diorama portfolio
│   │   ├── layout.tsx                 # Root layout & ClerkProvider
│   │   └── globals.css                # Tailwind CSS v4 & Double-Bezel tokens
│   ├── components/
│   │   ├── canvas/                    # Three.js / React Three Fiber components
│   │   │   ├── ForestCanvas.tsx       # Orthographic canvas & tree inspector
│   │   │   ├── TerrainIsland.tsx      # Stepped voxel earth & turquoise pond
│   │   │   ├── BlockTree.tsx          # 5-tier stepped emerald & golden pine trees
│   │   │   ├── CampProps.tsx          # Milestone campfire, tent, cabin, lantern posts
│   │   │   └── WeatherSystem.tsx      # Multi-tiered particle system (mist, rain, thunder)
│   │   ├── hud/                       # Double-bezel HUD capsules & interactive modals
│   │   │   ├── TopStatusBar.tsx       # Zone 1: Profile, rank badge, XP bar, streaks
│   │   │   ├── FloatingDock.tsx       # Zone 3: Bottom Action Dock
│   │   │   ├── TimelineScrubber.tsx   # 3D interactive growth timeline & time-lapse
│   │   │   ├── ShipModal.tsx          # Manual proof-of-ship logger
│   │   │   ├── AddTreeModal.tsx       # Dual-grove tree planter & webhook simulator
│   │   │   ├── CampShopModal.tsx      # Pinecone decor store
│   │   │   ├── SettingsModal.tsx      # Webhook console & GitHub sync
│   │   │   ├── GuestbookModal.tsx     # Campsite visitor bulletin board
│   │   │   └── SproutGuide.tsx        # Virgin island interactive onboarding
│   │   └── ui/                        # Atomic design system primitives
│   │       ├── Button.tsx             # Tactile specular button with token disc icon
│   │       ├── Card.tsx               # Porcelain double-bezel container
│   │       ├── Badge.tsx              # Status pill with pulsing indicator dot
│   │       ├── Modal.tsx              # Universal double-bezel modal enclosure
│   │       └── SegmentedControl.tsx   # Spring pill switcher
│   ├── lib/
│   │   ├── gamification.ts            # Canonical progression math, ranks, coordinates
│   │   ├── github.ts                  # Pure GitHub events parser & streak calculator
│   │   ├── revenueWebhook.ts          # Universal payment webhook normalizer
│   │   ├── badge.ts                   # Dynamic SVG README badge renderer
│   │   └── sound.ts                   # Synthesized Web Audio engine
│   ├── store/
│   │   └── useForestStore.ts          # Zustand state store with v4 migration
│   └── types/
│       └── game.ts                    # Canonical game domain types
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js:** `v20.0.0` or higher
- **npm:** `v10.0.0` or higher (or pnpm/yarn)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kwakhare5/IndieForest.git
   cd IndieForest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Public App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Gamification Engine & Progression Math

All gamification logic is encapsulated in pure, deterministic functions in [`src/lib/gamification.ts`](file:///d:/IndieForest/src/lib/gamification.ts).

### Level & XP Curve
$$XP(Level) = \lfloor 200 \times Level^{1.35} \rfloor$$

| Level Range | Rank Title | Badge Tier | Unlocks |
| :--- | :--- | :--- | :--- |
| **1 – 4** | Seedling Scout | `Tier I` | Basic Emerald Grove & Pinecone Store |
| **5 – 9** | Grove Tender | `Tier II` | Weather Atmosphere Controls & Tent |
| **10 – 14** | Forest Architect | `Tier III` | Golden Revenue Grove & Campfire |
| **15 – 24** | Timber Warden | `Tier IV` | Wooden Pier, Lanterns & Cabin |
| **25+** | Forest Monarch | `Tier V` | High-Roller Gold particle rain |

### Tree Growth Tiers & Coordinates
Trees are placed into 16 non-overlapping radial sectors (`WEST_EMERALD_SLOTS` for code, `EAST_GOLDEN_SLOTS` for MRR):

- **Stump (`stump`):** Churned customer ($0 MRR) or neglected project.
- **Sapling (`sapling`):** 1–4 commits or $1–$19/mo MRR.
- **Young Pine (`young`):** 5–14 commits or $20–$49/mo MRR.
- **Mature Pine (`mature`):** 15–29 commits or $50–$99/mo MRR.
- **Majestic Pine (`majestic`):** 30+ commits or $100+/mo MRR.

---

## 🌐 API Reference & Webhook Integration

### 1. Dynamic SVG README Badges
- **Endpoint:** `GET /api/badge/[username]`
- **Query Params:**
  - `style=card` (default): 600×200px porcelain diorama card with live streak, trees, and commits.
  - `style=pill`: 340×32px compact badge for GitHub header badges.
- **Markdown Usage:**
  ```markdown
  [![IndieForest](https://indieforest.dev/api/badge/kwakhare5)](https://indieforest.dev/u/kwakhare5)
  ```

### 2. Universal Revenue Webhook
- **Endpoint:** `POST /api/webhooks/revenue?token={USER_TOKEN}`
- **Supported Providers:** Stripe (`customer.subscription.created`, `invoice.payment_succeeded`), Lemon Squeezy (`subscription_created`), Polar (`order.created`).
- **Payload Normalization:** Automatically converts zero-decimal currencies (`jpy`, `krw`), annual-to-monthly pricing, and churn events into 3D golden tree state.

---

## 🧪 Testing & Quality Assurance

IndieForest uses **Vitest 4** with 100% test-driven coverage across all domain algorithms:

```bash
# Run unit test suite
npm test

# Run tests with watch mode
npm run test:watch

# Run ESLint + TypeScript typecheck
npm run lint

# Run production build verification with Turbopack
npm run build
```

---

## 🚀 Performance & Vercel Optimization

- **Zero-Hydration Canvas Loading:** The Three.js WebGL canvas is dynamically imported with `ssr: false` to eliminate hydration mismatch and reduce initial bundle size by 180KB.
- **Selective Frameloop:** Canvas executes requestAnimationFrame only when animating or receiving cursor parallax events, keeping idle CPU usage at 0%.
- **Turbopack Build Optimization:** 100% compliant with Next.js 16 App Router static prerendering.

---

## 🔒 Security & Trust Boundaries

1. **SVG XSS Sanitization:** All user-supplied strings in the dynamic SVG badge renderer are escaped against XML injection (`<>&"'`).
2. **Deterministic Token Isolation:** Webhook ingestion tokens authenticate tenant write operations.
3. **Clerk Trust Boundaries:** Protected routes and dashboard states verify authenticated session claims before accepting state mutations.

---

## 📜 License

MIT © [Karan Wakhare](https://github.com/kwakhare5)


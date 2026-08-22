<div align="center">

# 🌲 IndieForest

### Gamified 3D Low-Poly Island & Daily Shipping Momentum Engine for Indie Hackers

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react&style=flat-square)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170.0-black?logo=three.js&style=flat-square)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-38bdf8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-48%2F48%20Passed-emerald?logo=vitest&style=flat-square)](https://vitest.dev/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&style=flat-square)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

*IndieForest turns your daily coding momentum into a living, physical 3D low-poly diorama. Ship code daily to water your island with real-time particle rain, level up your developer rank, sprout customer pine trees, and unlock milestone campsite structures.*

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
  - [Universal Revenue Webhook](#universal-revenue-webhook)
  - [Dynamic SVG README Badges](#dynamic-svg-readme-badges)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Performance & Optimization](#-performance--optimization)
- [Security & Trust Boundaries](#-security--trust-boundaries)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview & Vision

Indie hacking and building software in public can be an isolating grind. Existing productivity tools are dry spreadsheets or rigid kanban boards. **IndieForest** gamifies the developer journey:

1. **Zero-Touch Automated Ingestion:** Connect your GitHub username or Stripe webhook. Every commit push and revenue transaction waters and grows your island automatically.
2. **Full-Screen 3D Game World:** `/dashboard` is an edge-to-edge `100vw × 100vh` game environment with solid porcelain white tactical HUD chrome.
3. **Sovereign Dual-Groves:** Pre-revenue builders grow lush emerald forests from pure commit grit; monetized builders grow golden revenue groves with floating MRR badges.

---

## 🚀 Key Features

* **🏝️ Living 3D Procedural Island (React Three Fiber v9 + Three.js 0.170):**
  - Stepped 2-layer chamfered terrain slab, turquoise pond with wooden pier and lily pads, low-poly conifer pines, and smooth orthographic cursor parallax.
* **🎮 Full-Screen Tactical Game HUD:**
  - **Top-Left Status Capsule:** Avatar, Roman numeral rank tier, level, XP progress bar, active streak flame, streak shields, and 30-day health ratio.
  - **Top-Right Controls:** 60s auto-sync toggle, procedural lo-fi campfire audio switch, and slide-over inventory drawer.
  - **In-World Inspector:** Click any 3D tree to inspect its commits, MRR, canopy stage, and plot coordinates.
  - **Slide-Over Inventory Drawer:** Bulk search, filter by grove (Shipping vs. Revenue), and delete/archive modules.
* **⚡ Dual-Grove Independent Progression:**
  - **Emerald Shipping Grove (West):** Grown via GitHub commits from Saplings to 5-tier Majestic Pines with golden halos.
  - **Golden Revenue Grove (East):** Sprouted automatically when payments arrive from Stripe, Lemon Squeezy, or Polar.
* **🛡️ Burnout Shield Protection & Rest Mode:**
  - Earn 1 Streak Shield every 7 days (max 2) to protect streaks during rest days or sabbaticals.
* **🏕️ Milestone Campsite Modals & Procedural Audio:**
  - Campfire Focus Modal with Pomodoro timer and lo-fi audio (Day 3), Rest Vault Modal (Day 7), and Founder's War Room HQ (Day 14).
* **⏳ 3D Timeline Scrubber & 10s Turntable Exporter:**
  - Historical 30-day growth time-travel slider and 60fps MediaRecorder orbit video capture.
* **🖼️ Dynamic SVG README Badges (`/api/badge/[username]`):**
  - Server-rendered vector cards and shields.io pills for GitHub README profiles with 0 dependencies.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.1 (App Router + Turbopack) | Server Components, dynamic API routes, static prerendering |
| **UI Engine** | React 19 + TypeScript 5.7+ | Strict strict-mode TypeScript with zero-`any` types |
| **3D Graphics** | React Three Fiber v9, Three.js 0.170, Drei v10 | Orthographic isometric low-poly diorama canvas |
| **Auth** | Clerk (`@clerk/nextjs` v7.8+) | Google OAuth, email sign-in, session tokens |
| **Styling** | Tailwind CSS v4 + Satoshi + Jersey 10 | CSS-first configuration and porcelain double-bezel styling |
| **State** | Zustand 5.0.3 + LocalStorage Persistence | SSR-safe store with `indieforest-storage-v2` |
| **Testing** | Vitest 4.1.11 | Test-Driven domain core (48/48 unit tests passing) |
| **Audio** | Web Audio API | Procedural lo-fi campfire crackle synthesizer & retro chimes |

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
│   │   ├── dashboard/page.tsx         # Full-screen 3D Game Island & HUD
│   │   ├── logos/page.tsx             # Official brand identity & vector showcase
│   │   ├── u/[username]/page.tsx      # Public shareable 3D diorama portfolio
│   │   ├── layout.tsx                 # Root layout & ClerkProvider
│   │   └── globals.css                # Tailwind CSS v4 & Porcelain tokens
│   ├── components/
│   │   ├── canvas/                    # Three.js / React Three Fiber components
│   │   │   ├── ForestCanvas.tsx       # Orthographic canvas & parallax rig
│   │   │   ├── TerrainIsland.tsx      # Chamfered meadow slab & turquoise pond
│   │   │   ├── BlockTree.tsx          # 5-tier pyramid conifers with 3D billboard tags
│   │   │   ├── CampProps.tsx          # Milestone campfire, tent, cabin, pier, lanterns
│   │   │   └── WeatherSystem.tsx      # Particle engines (Rain, gold bursts, fog)
│   │   ├── hud/                       # Tactical porcelain game HUD overlays
│   │   │   ├── DashboardBuilderCapsule.tsx # Top-left status capsule
│   │   │   ├── DashboardGameControls.tsx   # Top-right controls & audio switch
│   │   │   ├── FloatingDock.tsx            # Bottom porcelain action dock
│   │   │   ├── TreeInspectorCard.tsx       # In-world tree click inspector card
│   │   │   ├── ModuleInventoryDrawer.tsx   # Right slide-over module inventory
│   │   │   ├── TimelineScrubber.tsx        # 30-day growth time-travel slider
│   │   │   ├── TurntableExportModal.tsx    # 10s 60fps turntable video exporter
│   │   │   ├── CampfireFocusModal.tsx      # Daily atomic focus & lo-fi station
│   │   │   ├── TentSabbaticalModal.tsx     # Streak shield vault & sabbatical mode
│   │   │   ├── CabinWarRoomModal.tsx       # Multi-repo command HQ
│   │   │   ├── ShareCardModal.tsx          # 1200×675 3D card compositor
│   │   │   ├── AddTreeModal.tsx            # Project tree planter & webhook simulator
│   │   │   ├── SettingsModal.tsx           # Settings & webhook copy console
│   │   │   └── GuestbookModal.tsx          # Campsite visitor guestbook
│   │   ├── landing/                   # Modular landing page sub-components
│   │   │   ├── LandingNavbar.tsx           # Floating porcelain navbar
│   │   │   ├── LandingHero.tsx             # Live 3D interactive hero diorama
│   │   │   ├── LandingSectionHeader.tsx    # Standardized section header
│   │   │   ├── LandingFeatureCard.tsx      # Standardized porcelain feature card
│   │   │   ├── LandingRitual.tsx           # 3-step zero-touch loop
│   │   │   ├── LandingShowcase.tsx         # Dual-grove breakdown
│   │   │   ├── LandingBento.tsx            # Anti-burnout & distribution bento
│   │   │   ├── LandingFaq.tsx              # Transparent FAQ
│   │   │   └── LandingFooter.tsx           # Final CTA card & links
│   │   └── ui/                        # Atomic design system primitives
│   │       ├── Button.tsx             # Tactile specular porcelain buttons
│   │       ├── Card.tsx               # Porcelain double-bezel containers
│   │       ├── Badge.tsx              # Status pill with live pulse dots
│   │       ├── Modal.tsx              # Double-bezel modal enclosure
│   │       └── SegmentedControl.tsx   # Tactile sliding pill toggle
│   ├── lib/
│   │   ├── gamification.ts            # Canonical progression math, ranks, coordinates
│   │   ├── github.ts                  # Pure GitHub events parser & streak calculator
│   │   ├── revenueWebhook.ts          # Universal payment webhook normalizer
│   │   ├── badge.ts                   # Dynamic SVG README badge renderer
│   │   ├── sound.ts                   # Procedural Web Audio synthesizer
│   │   └── videoExport.ts             # 60fps MediaRecorder canvas video capture
│   ├── store/
│   │   └── useForestStore.ts          # Zustand state store with persistence
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

| Level Range | Rank Title | Badge Tier | Unlocks |
| :--- | :--- | :--- | :--- |
| **1 – 3** | Sprout Planter | `Tier I` | Basic Emerald Shipping Grove |
| **4 – 7** | Grove Cultivator | `Tier II` | Milestone Campfire & Daily Focus Station |
| **8 – 12** | Timber Craftsman | `Tier III` | Canvas Tent & Streak Shield Vault |
| **13 – 19** | Island Architect | `Tier IV` | Timber Log Cabin & War Room HQ |
| **20+** | Forest Sovereign | `Tier V` | Golden Torus Halos & High-Roller Sparkles |

### Tree Growth Tiers & Coordinates
Trees are placed into non-overlapping radial sectors (`West Pasture` for code, `East Pasture` for MRR):

- **Stump (`stump`):** Churned customer ($0 MRR) or archived project.
- **Sapling (`sapling`):** 1–7 commits or $1–$49/mo MRR.
- **Young Pine (`young`):** 8–24 commits or $50–$499/mo MRR.
- **Mature Pine (`mature`):** 25–59 commits or $500–$1,999/mo MRR.
- **Majestic Pine (`majestic`):** 60+ commits or $2,000+/mo MRR (crowned with Torus halo).

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
- **Payload Normalization:** Automatically converts currencies, annual-to-monthly MRR, and churn events into 3D golden tree state.

---

## 🧪 Testing & Quality Assurance

IndieForest uses **Vitest 4** with 100% test-driven coverage across all domain algorithms:

```bash
# Run unit test suite
npm test

# Run ESLint + TypeScript typecheck
npm run lint

# Run production build verification with Turbopack
npm run build
```

---

## 🔒 Security & Trust Boundaries

1. **SVG XSS Sanitization:** All user-supplied strings in the dynamic SVG badge renderer are escaped against XML injection (`<>&"'`).
2. **Deterministic Token Isolation:** Webhook ingestion tokens authenticate tenant write operations.
3. **Clerk Trust Boundaries:** Protected routes and dashboard states verify authenticated session claims before accepting state mutations.

---

## 📜 License

MIT © [Karan Wakhare](https://github.com/kwakhare5)

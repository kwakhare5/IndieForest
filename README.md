<div align="center">

# 🌲 IndieForest

### Gamified 3D Low-Poly Island & Daily Shipping Habit Tracker for Indie Hackers

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react&style=flat-square)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170.0-black?logo=three.js&style=flat-square)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-38bdf8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-19%2F19%20Passed-emerald?logo=vitest&style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

*IndieForest turns your daily coding accountability into a living, breathing 3D low-poly diorama. Ship code daily to water your island with real-time particle rain, level up your developer rank, sprout customer pine trees, and unlock camp structures.*

---

</div>

## 🚀 Key Features

* **🏝️ Living 3D Procedural Island (React Three Fiber v9 + Three.js 0.170):**
  - Terraced voxel dirt cliffs, crystal turquoise pond, breathing water ripples, low-poly rocks, and drifting clouds.
  - Locked isometric camera with smooth cursor parallax tilt and clamped zoom.
* **🪵 Official Master Brand Identity:**
  - The **Tree Stump on Radiant Apple Green** (`/logos/indieforest_logo.svg`) featuring 4 concentric golden annual growth rings and a green sprout on Apple squircle geometry.
* **⚡ Frictionless Daily Shipping Loop:**
  - **1-Click Manual Ship:** Log progress with instant confetti, synthesized retro audio chimes, and XP boosts.
  - **GitHub Real-Time Commit Sync:** Automatically fetch the latest public commits and attach proof URLs.
* **🎮 Addictive Gamification & Economy:**
  - **XP & Leveling:** Exponential progression curve (`200 * Level^1.35`) unlocking ranks from *Seedling Scout* (Tier I) to *Forest Monarch* (Tier VI).
  - **Streak Shield Protection (🛡️):** Burnout protection system where 7-day milestones award shields that automatically protect rest days.
  - **Dynamic Camp Unlocks:** Campfire with rising smoke (3-day streak), Camping Tent (7-day streak), and Log Cabin (14-day streak).
* **🌲 Customer Trees & MRR Milestones:**
  - Map active paying subscribers and SaaS customers directly to named 3D pine trees with live MRR values and 5 growth stages (*Sapling* → *Young* → *Mature* → *Majestic* → *Stump*).
  - Built-in **Universal Revenue Webhook** supporting Stripe, Lemon Squeezy, and Polar.
* **💎 Universal Porcelain Double-Bezel System:**
  - Unified tactile skeuomorphic enclosures (`glass-dock` outer + `porcelain-surface` inner) applied across all modals, cards, and floating docks.
* **🐦 1-Click Build-in-Public Exporter:**
  - High-aesthetic progress card preview and copyable 1-click Twitter/X intent generator.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.3.1](https://nextjs.org/) (App Router + Turbopack)
- **UI Engine:** [React 19](https://react.dev/) + [Framer Motion 12](https://www.framer.com/motion/)
- **3D Graphics:** [Three.js 0.170](https://threejs.org/) + [@react-three/fiber v9](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei v10](https://github.com/pmndrs/drei)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Instrument Serif + Plus Jakarta Sans + Pixelify Sans
- **State Management:** [Zustand 5](https://zustand-demo.pmnd.rs/) with local persistence
- **Testing:** [Vitest 4](https://vitest.dev/) (19/19 domain and webhook tests passing)
- **Audio:** Synthesized Web Audio API retro chimes

---

## ⚡ Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Build Verification

Run the Vitest unit test suite:
```bash
npm test
```

Build for production with Turbopack:
```bash
npm run build
```

---

## 🗺️ Project Architecture

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
│   │   │   ├── github/route.ts        # GitHub public commit sync API
│   │   │   └── webhooks/revenue/      # Universal Stripe/LemonSqueezy/Polar webhook
│   │   ├── dashboard/page.tsx         # Fullscreen 3D diorama app & HUD
│   │   ├── logos/page.tsx             # Official brand identity showcase
│   │   ├── u/[username]/page.tsx      # Public shareable 3D profile
│   │   ├── globals.css                # Tailwind v4 theme & glass tokens
│   │   ├── layout.tsx                 # Font configuration & metadata
│   │   └── page.tsx                   # Main landing page with 3D diorama hero
│   ├── components/
│   │   ├── canvas/                    # 3D R3F components
│   │   │   ├── BlockTree.tsx          # 5-tier procedural low-poly pine trees
│   │   │   ├── CampProps.tsx          # Campfire, tent, cabin & drifting clouds
│   │   │   ├── ForestCanvas.tsx       # Isometric orthographic canvas
│   │   │   ├── TerrainIsland.tsx      # Stepped voxel earth & turquoise pond
│   │   │   └── WeatherSystem.tsx      # Dynamic sunlight, rain & fireflies
│   │   ├── hud/                       # Agency-grade Double-Bezel UI
│   │   │   ├── AddTreeModal.tsx       # Subscriber customer tree adder
│   │   │   ├── FloatingDock.tsx       # Unified bottom action dock
│   │   │   ├── SettingsModal.tsx      # Backend & universal webhook settings
│   │   │   ├── ShareCardModal.tsx     # Build in public X exporter
│   │   │   └── ShipModal.tsx          # 1-click & GitHub commit logger
│   │   └── ui/                        # Reusable UI primitives
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       └── Modal.tsx              # Canonical porcelain double-bezel modal
│   ├── lib/
│   │   ├── gamification.ts            # Pure Clean Code domain logic
│   │   ├── gamification.test.ts       # Gamification unit test suite
│   │   ├── revenueWebhook.ts          # Universal webhook normalizer
│   │   ├── revenueWebhook.test.ts     # Webhook unit test suite
│   │   └── sound.ts                   # Synthesized Web Audio engine
│   └── store/
│       └── useForestStore.ts          # Zustand store with LocalStorage sync
├── ARCHITECTURE.md                    # Master technical blueprint
├── CONTEXT.md                         # Ubiquitous language & ADRs
└── JOURNAL.md                         # Engineering changelog
```

---

## 📜 License

MIT License © 2026 Karan Wakhare. Built with ❤️ for indie hackers and developers.

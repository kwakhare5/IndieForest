<div align="center">

# 🌲 IndieForest

### Gamified 3D Low-Poly Island & Daily Shipping Habit Tracker for Indie Hackers

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react&style=flat-square)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170.0-black?logo=three.js&style=flat-square)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0.0-38bdf8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-37%2F37%20Passed-emerald?logo=vitest&style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

*IndieForest turns your daily coding accountability into a living, breathing 3D low-poly diorama. Ship code daily to water your island with real-time particle rain, level up your developer rank, sprout customer pine trees, and unlock camp structures.*

---

</div>

## 🚀 Key Features

* **🏝️ Living 3D Procedural Island (React Three Fiber v9 + Three.js 0.170):**
  - Terraced voxel dirt cliffs, crystal turquoise pond, breathing water ripples, low-poly rocks, and drifting clouds.
  - Locked isometric camera (`zoom: 29` default) with smooth cursor parallax tilt.
* **🪵 Official Master Brand Identity:**
  - The **Tree Stump on Radiant Apple Green** (`/logos/indieforest_logo.svg`) featuring 4 concentric golden annual growth rings and a green sprout on Apple squircle geometry.
* **⚡ Dual-Grove Independent Progression (Sovereign Tracks):**
  - **Emerald Shipping Grove (Pre-Revenue Friendly):** Push code to GitHub to grow emerald pine trees from Saplings into Majestic Pines. Zero revenue required.
  - **Golden Revenue Grove (Monetization Track):** Connect Stripe / Polar / LemonSqueezy to sprout golden revenue pines as paying customers subscribe.
* **🎮 Addictive Gamification & Economy:**
  - **XP & Leveling:** Exponential progression curve (`200 * Level^1.35`) unlocking ranks from *Seedling Scout* (Tier I) to *Forest Monarch* (Tier VI).
  - **Streak Shield Protection (🛡️):** Burnout protection system where 7-day milestones award shields that automatically protect rest days.
  - **Dynamic Camp Unlocks:** Campfire with rising smoke (3-day streak), Camping Tent (7-day streak), and Log Cabin (14-day streak).
  - **Pinecone Camp Shop:** In-game currency store to purchase cosmetic camp items using earned pinecones.
* **💎 Universal Porcelain Double-Bezel System:**
  - Unified tactile skeuomorphic enclosures (`glass-dock` outer + `porcelain-surface` inner) applied across all modals, cards, and floating docks.
* **🐦 1-Click Build-in-Public Exporter:**
  - Generates a high-resolution 3D composite snapshot and copies it directly to your clipboard for Twitter/X.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.3.1](https://nextjs.org/) (App Router + Turbopack)
- **UI Engine:** [React 19](https://react.dev/)
- **3D Graphics:** [Three.js 0.170](https://threejs.org/) + [@react-three/fiber v9](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei v10](https://github.com/pmndrs/drei)
- **Auth:** [Clerk](https://clerk.com/) (`@clerk/nextjs`) with 1-click Google OAuth
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + PP Editorial New + Satoshi + Jersey 10
- **State Management:** [Zustand 5](https://zustand-demo.pmnd.rs/) with local persistence
- **Testing:** [Vitest 4](https://vitest.dev/) (37/37 domain, store, and webhook tests passing)
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
│   │   ├── logos/page.tsx             # Brand Identity showcase
│   │   ├── u/[username]/page.tsx      # Public shareable 3D diorama profile
│   │   ├── layout.tsx                 # Root layout & ClerkProvider
│   │   └── globals.css                # Tailwind CSS v4 & Double-Bezel tokens
│   ├── components/
│   │   ├── canvas/                    # Three.js / React Three Fiber components
│   │   ├── hud/                       # Porcelain HUD capsules & modals
│   │   └── ui/                        # Clean design system primitives
│   ├── lib/
│   │   ├── gamification.ts            # Pure domain gamification math
│   │   ├── revenueWebhook.ts          # Universal payment webhook parser
│   │   └── sound.ts                   # Synthesized Web Audio engine
│   ├── store/
│   │   └── useForestStore.ts          # Zustand state store
│   └── types/
│       └── game.ts                    # Canonical game domain types
```

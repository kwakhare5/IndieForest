# IndieForest — Agent Instructions & Project Context

## 1. PROJECT OVERVIEW
IndieForest is a gamified 3D low-poly isometric island dashboard for indie hackers and developers. It combines daily shipping accountability, habit tracking, personal dev focus, and startup growth into a playable, living 3D world.

## 2. TECH STACK (LATEST 2026+ STANDARDS)
- **Framework:** Next.js 16.3.1 (Turbopack + App Router) + TypeScript 5.7+
- **Typography & Aesthetics:** Geist Sans & Geist Mono + High-End Double-Bezel Component Architecture
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss` 4.0.0) + Framer Motion 12.4.2
- **3D Engine:** React Three Fiber (`@react-three/fiber`), Three.js (`three@0.170.0`), `@react-three/drei`
- **State Management:** Zustand 5.0.3 with local persistence
- **Audio / FX:** Canvas Confetti, Web Audio synthesized retro sound effects
- **Backend / Database:** Next.js API routes + Supabase (Phase 2) + LocalStorage / Mock Engine (Phase 1)
- **Deployment:** Vercel

## 3. CORE COMMANDS
- `npm run dev` — Start local Next.js 16 development server
- `npm run build` — Production build check with Next.js Turbopack
- `npm run lint` — Lint and typecheck codebase

## 4. LOCAL RULES & DESIGN INVARIANTS
1. **Low-Poly 3D Aesthetic:** Maintain the flat-shaded, isometric low-poly block aesthetic (orthographic camera, soft directional shadows, warm cozy lighting).
2. **Double-Bezel & Button-in-Button Architecture:** All cards, docks, and interactive modals adhere to nested concentric enclosures (`ring-1`, inset specular highlights, trailing icon enclosures).
3. **Frictionless Daily Shipping:** Zero barriers to log a ship — supports both automatic GitHub commit sync and instant 1-click manual ship checkoff.
4. **Gamification Balance:** Maintain the XP economy, level progression, Pinecones currency, and Streak Shield system without turning the app into an overwhelming chore.
5. **No AI API Dependency for Rendering:** All 3D rendering is pure Three.js procedural shaders/geometries and CC0 GLTF assets. AI (Gemini) is reserved for daily quest synthesis and morning briefs.

## 5. REVENUE & SHIPPING PARADIGM
- **Daily Shipping (Primary):** Powers island vitality, rain events, streak levels, camp structures, and atmospheric buffs.
- **Revenue / Customers (Optional Layer):** Paying customers sprout as dedicated named pine trees with MRR value tooltips.

## 6. DOMAIN CONTEXT & ADRS
- See [`CONTEXT.md`](file:///d:/IndieForest/CONTEXT.md) for ubiquitous terms and Architecture Decision Records (ADR 001–003).

## 7. SESSION RESUME
- **Current State:** Fully upgraded to Next.js 16.3.1 (Turbopack) + React 19 + Tailwind v4 + Double-Bezel high-end design architecture. All static routes and 3D scenes compile with 0 errors. `CONTEXT.md` and `JOURNAL.md` initialized.
- **Next Task:** Start local dev server and test interactive gameplay and shipping actions in the browser.

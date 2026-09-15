# ADR 0001: Architectural Decoupling of Marketing Demo Island from Real Game Dashboard

## Status
Accepted (2026-09-08)

## Context
IndieForest features two distinct island diorama use-cases:
1. **Landing Page Hero Showcase (`Hero.tsx`):** A visual marketing preview inside a compact, double-bezel card enclosure ($W \le 512\text{px}$) designed to showcase a thriving island and allow prospective builders to preview public GitHub repositories before signing up.
2. **Main Game Dashboard (`/dashboard`):** The authentic, full-screen player island diorama driven by live PostgreSQL Supabase hydration, real GitHub commit webhooks, Stripe revenue events, and persistent Zustand state (`useForestStore`).

Previously, both environments shared the same `IslandCanvas.tsx` component and camera calculations. Furthermore, `Hero.tsx` was directly importing `useForestStore` and calling `mergeCloudData()`, which caused previewed third-party repositories to contaminate the local player's game state. Adjusting camera zoom for the landing card also threatened regressions in the full-screen game view.

## Decision
1. **Component Separation:**
   - Created [`DemoIslandCanvas.tsx`](../../src/components/canvas/DemoIslandCanvas.tsx) dedicated exclusively to the marketing showcase and preview cards. It includes its own `DemoCameraRig` tailored to card containers ($W \le 512\text{px}$) with automatic world span fitting ($\text{targetWorldSpan} = \text{islandSize} \times 1.72$) to guarantee zero isometric diamond edge clipping.
   - Retained [`IslandCanvas.tsx`](../../src/components/canvas/IslandCanvas.tsx) strictly for the main game dashboard (`/dashboard`), with fixed calibrated orthographic scale (`baseZoom = 36`) and locked center positioning.
2. **Zero Store Pollution:**
   - Purged all `useForestStore` and `mergeCloudData` imports from [`Hero.tsx`](../../src/components/landing/Hero.tsx).
   - Previewing a GitHub handle runs 100% ephemerally in local component state (`activeProfile`).
   - The "Claim This Island" action on the hero links directly to Clerk Sign-Up (`<SignUpButton mode="modal">`) rather than injecting previewed trees into the local store.
3. **Curated Showcase Default:**
   - The landing page displays a thriving 8-tree demo grove (`CURATED_DEMO_GROVE`: 5 shipping conifers, 3 revenue oaks, campfire, level 2) so visitors immediately witness a rich diorama on first visit.

## Consequences
- **Positive:**
  - Zero risk of marketing changes or responsive card framing tweaks impacting the authenticated game dashboard.
  - Zero risk of a visitor's previewed trees leaking into their personal game account upon sign-in.
  - Landing page visitors experience an immediately impressive, complete 3D island diorama on load.
- **Negative:**
  - Two canvas wrappers to maintain; mitigated by both sharing the exact same underlying 3D models (`Island`, `IslandTree`, `Campsite`, `Weather`).

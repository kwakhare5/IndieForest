# AGENTS.md - IndieForest

> **MANDATORY INSTRUCTION:** Read and obey the global master rules at C:\Users\kwakh\.agents\AGENTS.md. Treat this file as project-specific facts and invariants that override or extend global rules.


## What this is
GitHub README SVG widget and botanical field guide for indie hackers that turns daily shipping momentum into a living forest. Shelved project.

## Stack
- Frontend: Next.js 16 (Turbopack + App Router) + React 19 + TypeScript + Tailwind CSS v4
- Graphics: Pure deterministic TypeScript SVG renderer (`src/lib/forest-svg.ts`)
- Auth & Database: Clerk (`@clerk/nextjs`) GitHub OAuth + Supabase PostgreSQL
- Testing: Vitest

## Commands (how to run/build/test)
- Install: `npm install`
- Dev server: `npm run dev`
- Test: `npm test`
- E2E: `npm test`
- Lint: `npm run lint`
- Done check = Test + Lint both exit 0.

## Issue tracker
Shelved project. No active tracker.

## Design source of truth
Shelved project. No UI skill loaded.

## Gotchas (project decisions)
- Shelved project.
- Pure SVG renderer in `src/lib/forest-svg.ts` is the single source of truth for all graphics; zero framework imports, zero clock calls.
- The widget endpoint `/u/[username].svg` reads Supabase with Camo-safe cache headers; never calls GitHub directly (only `/api/sync`).

Global rules: read C:\Users\kwakh\.agents\AGENTS.md

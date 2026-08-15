# IndieForest — Domain Context & ADRs

## 1. Domain Terminology & Ubiquitous Language

| Term | Definition |
|---|---|
| **Island** | The floating 3D low-poly voxel terrain block representing a developer's startup and shipping momentum. |
| **Customer Tree** | An individual 3D pine tree placed on the island, mapped directly to an active customer or subscriber. |
| **Growth Tiers** | The 5 visual stages of a tree: `sapling`, `young`, `mature`, `majestic`, and `stump` (churned). |
| **Daily Ship** | A verified unit of coding progress logged via GitHub commit sync or 1-click manual checkoff. |
| **Vitality / Drought** | The environmental health of the island. Daily shipping triggers rain and lush green grass; missed days trigger drought and fog. |
| **Streak Shield (🛡️)** | Burnout protection inventory item (max 2). Automatically consumed to preserve streaks on rest days. |
| **Pinecones (🌰)** | In-game spendable currency earned through consistency, used to unlock cosmetic 3D camp upgrades in the Camp Shop. |
| **#1 Priority Quest** | The single high-leverage focus goal set each morning to drive daily deep work. |
| **Double-Bezel** | Nested UI container architecture (`outer shell ring-1` + `inner core inset shadow`) creating machined physical depth. |

---

## 2. Architecture Decision Records (ADRs)

### ADR 001: 3D Low-Poly Engine via React Three Fiber (Three.js)
- **Status:** Accepted
- **Context:** Visual brief requires true 3D isometric block depth, dynamic camera orbit, real-time lighting, and scalable tree meshes.
- **Decision:** Use `@react-three/fiber` + `three@0.170.0` + `@react-three/drei` with `OrthographicCamera`.
- **Consequences:** True 3D depth and real-time shadow casting without the perspective mismatches of 2D AI sprite generators.

### ADR 002: Next.js 16.3.1 (Turbopack) & React 19 Foundation
- **Status:** Accepted
- **Context:** Project requires cutting-edge performance, modern App Router, and clean TypeScript compilation.
- **Decision:** Standardize on Next.js 16.3.1 with Turbopack and React 19.
- **Consequences:** 4.6s production compilation time with zero vulnerabilities.

### ADR 003: Phased Backend (LocalStorage -> Supabase Postgres)
- **Status:** Accepted
- **Context:** Fast dogfooding on Day 1 without database configuration overhead.
- **Decision:** Phase 1 uses Zustand with LocalStorage persistence. Phase 2 introduces Supabase Auth and Postgres sync.

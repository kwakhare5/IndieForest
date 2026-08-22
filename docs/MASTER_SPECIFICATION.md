# 🌲 IndieForest — The Definitive Master Specification & Architecture

> **The Living 3D Proof-of-Work & Revenue Diorama for Indie Hackers**  
> *Transforming automated GitHub commits & Stripe revenue into an interactive, shareable 3D world with zero manual labor.*  
> **Version:** 1.0 (Canonical Single Source of Truth)  
> **Repository:** `https://github.com/kwakhare5/IndieForest`

---

## 1. VISION, PHILOSOPHY & CORE PROBLEM

```
   TRADITIONAL METRIC TRACKERS                INDIEFOREST LIVING DIORAMA
   ┌─────────────────────────────┐           ┌─────────────────────────────┐
   │ • Cold 2D Charts (Stripe)   │           │ • Living 3D Floating Island │
   │ • 85% Drop-off in 7 Days    │           │ • 100% Zero-Touch Sync      │
   │ • Useless for $0 MRR        │   VS      │ • Dual-Grove (Commits + MRR)│
   │ • Streak Burnout & Anxiety  │           │ • 30-Day Forest Health %    │
   │ • Cringe AI Tweet Brags     │           │ • 1-Click Anti-Slop Tweets  │
   └─────────────────────────────┘           └─────────────────────────────┘
```

### The 5 Core Indie Hacker Pain Points:
1. **Chore Fatigue from Manual Trackers:** Apps requiring founders to open a dashboard daily and manually type check-ins suffer an 85%+ drop-off within 3–7 days. IndieForest eliminates manual logging completely.
2. **The \$0 MRR Pre-Revenue Void:** 95% of builders spend months building with \$0 MRR. Revenue-only visualizers (like ForestMRR) are useless to them until they make their first dollar. IndieForest’s **Emerald Pines** give emotional progress from day one through code commits.
3. **Streak Anxiety & Burnout:** Strict single-day streak counters cause demoralization and app abandonment after a single missed day (travel, illness, rest). IndieForest pairs an active streak with a rolling **30-Day Forest Health %** and **Burnout Shields**.
4. **Spreadsheet Boredom:** GitHub green squares and Stripe charts lack delight. IndieForest turns momentum into a tactile, low-poly 3D world with weather, ambient sound, and campfire milestones.
5. **The "Proof-of-Execution" Gap on X/Twitter:** Founders building in public need compelling, authentic visual assets. IndieForest generates verified 1200×675 3D captures, dynamic README badges, and anti-slop copy in <10 seconds.

---

## 2. COMPLETE SYSTEM ARCHITECTURE & DATA FLOW

```
                                  INDIEFOREST DATA PIPELINE
                                  
    EXTERNAL SOURCES                     INGESTION & CACHE                 3D DIORAMA & SOCIAL
  ┌──────────────────┐                 ┌────────────────────┐            ┌──────────────────────┐
  │ GitHub Public API│ ──(On Load)───▶ │ Next.js Edge Cache │ ─────────▶ │ Three.js / R3F v9    │
  │ (Commits/Events) │                 │ (s-maxage=120)     │            │ 16 Radial Tree Slots │
  └──────────────────┘                 └────────────────────┘            └──────────────────────┘
  ┌──────────────────┐                 ┌────────────────────┐            ┌──────────────────────┐
  │ Stripe / Polar / │ ──(Webhooks)──▶ │ /api/webhooks/     │ ─────────▶ │ Multi-Tiered Weather │
  │ Lemon Squeezy    │                 │ revenue Handler    │            │ (Rain / Gold Shower) │
  └──────────────────┘                 └────────────────────┘            └──────────────────────┘
  ┌──────────────────┐                 ┌────────────────────┐            ┌──────────────────────┐
  │ Clerk OAuth      │ ──(Session)───▶ │ Zustand 5 Store    │ ─────────▶ │ /api/badge/[username]│
  │ (User Identity)  │                 │ (Local + Supabase) │            │ Dynamic SVG Badges   │
  └──────────────────┘                 └────────────────────┘            └──────────────────────┘
```

### Technical Stack:
* **Framework:** Next.js 16.3.1 (Turbopack + App Router, React 19)
* **3D Graphics Engine:** React Three Fiber v9 (`@react-three/fiber`), Three.js (`three@0.170.0`), `@react-three/drei` v10
* **State & Persistence:** Zustand 5.0.3 with SSR-safe `localStorage` + Supabase PostgreSQL cloud sync
* **Auth & Identity:** Clerk (`@clerk/nextjs`) + GitHub OAuth
* **Audio Engine:** Web Audio API zero-dependency real-time synthesizer
* **Styling & UI:** Tailwind CSS v4, Lucide Icons, Double-Bezel Architecture
* **Testing Suite:** Vitest 4 with 100% test-driven coverage (56/56 passing unit tests)

---

## 3. ZERO-TOUCH INGESTION & AUTO-WATERING ENGINE

### 1. The Instant Hero Hook (No Sign-Up Required):
* **Live Username Lookup:** Typing a GitHub username (or clicking a curated chip: `@levelsio`, `@shadcn`, `@antfu`, `@marclou`) fetches public events via `src/lib/github.ts`.
* **Zero API Latency for Famous Builders:** Pre-warmed static JSON snapshots in `src/lib/curatedBuilders.ts` load in **<50ms** with zero risk of GitHub 429 rate-limits.

### 2. Auto-Sync on Dashboard Mount & Window Tab-Focus:
* When a user opens `/dashboard` or switches back from their IDE/terminal (`window.onfocus`), the app checks for new GitHub commits in the background.
* **Auto-Watering Action:**
  1. Detects new commit SHA.
  2. Spawns an **Emerald Rain Shower** (4.5s particle FX).
  3. Plays a **Synthesized Retro Audio Chime**.
  4. Awards **+100 XP** and updates developer Level.
  5. Increments **Streak 🔥** and deposits **+10 Pinecones 🌰**.
  6. Automatically expands the repository tree's growth tier in real-time.

---

## 4. PROGRESSION MATH & GAME ECONOMY

### 1. Dual-Gated Growth Tiers (Anti-Gaming Invariant):
Trees level up purely based on verified work over calendar time. No user can spawn a Majestic tree in 1 day by spamming 100 commits.

$$\text{Tier} = f(\text{Commits or MRR}, \text{Distinct Calendar Days})$$

| Tier | Visual Stage | Emerald Shipping Gate | Golden Revenue Gate |
|---|---|---|---|
| **Tier I** | `Sapling` | 1+ Commits & 1 Active Day | \$0 – \$49 MRR |
| **Tier II** | `Young` | 8+ Commits & 3+ Active Days | \$50 – \$499 MRR |
| **Tier III** | `Mature` | 25+ Commits & 10+ Active Days | \$500 – \$1,999 MRR |
| **Tier IV** | `Majestic` | 60+ Commits & 25+ Active Days | \$2,000+ MRR |
| **Tier 0** | `Stump` | Cancelled / Churned Customer | Churned Subscription |

### 2. Rolling 30-Day Forest Health % (Consistency Metric):
Replaces rigid streak obsession with a sustainable momentum gauge:

$$\text{Forest Health} = \left(\frac{\text{Active Shipping Days in Past 30 Days}}{30}\right) \times 100$$

* **🌿 Pristine (90–100%):** Radiant emerald canopy glow, floating pollen particles.
* **🍃 Lush (75–89%):** Vibrant green foliage and crystal clear oasis water.
* **🍂 Dormant (50–74%):** Soft autumn mist (peaceful rest mode).
* **🪵 Drought (< 50%):** Gentle fog overlay; immediately revives with "Wake-Up Rain" on the next ship.

### 3. Logarithmic Daily XP Scaling:
* **1st Push of the Day:** **+100 XP** (Full reward + Streak increment + Rain shower)
* **2nd Push of the Day:** **+25 XP**
* **3rd Push of the Day:** **+15 XP**
* **Daily Cap:** +160 XP/day from code pushes alone.

### 4. 6 Roman Numeral Developer Ranks:
* **Lv 1–4:** Seedling Scout (`I`)
* **Lv 5–9:** Code Forager (`II`)
* **Lv 10–19:** Shipwright (`III`)
* **Lv 20–34:** Island Architect (`IV`)
* **Lv 35–49:** Mountain Warden (`V`)
* **Lv 50+:** Forest Monarch (`VI`)

### 5. Burnout Shields (🛡️):
* 1 Burnout Shield earned every 7 consecutive days of shipping (maximum 2 held).
* Automatically consumed on a rest day to preserve active streak.
* If a day is missed with 0 shields, the island enters **Dormant Mode** (trees remain 100% safe; streaks restart gracefully).

---

## 5. 3D SPATIAL DIORAMA & RADIAL SECTOR ARCHITECTURE

```
                                [ NORTH ]
                    Tech Stack Totems & Shrine
          (Stone pedestals with glowing TypeScript / Next.js runes)
                                    │
    [ WEST GROVE ]                  │               [ EAST GROVE ]
  Emerald Shipping Grove            │             Golden Revenue Grove
  (GitHub Repos & Commits)          │            (Paying Customers & MRR)
    🌲 Repo 1 (Mature Emerald)      │              🪙 Customer 1 ($199/mo)
    🌲 Repo 2 (Young Emerald)       │              🪙 Customer 2 ($79/mo)
    🏷️ Floating 3D Repo Badges      │              🏷️ Floating 3D MRR Badges
                                    │
                                    ▼
                         [ CENTER CAMPSITE OASIS ]
              • 🔥 Milestone Campfire (Streak >= 3d · Warm Light)
              • ⛺ Canvas Tent (Streak >= 7d · Cream Canvas)
              • 🏡 Log Cabin (Streak >= 14d · Glowing Windows)
              • 🌊 Turquoise Alpine Pond & Wooden Deck Pier
              • 🛋️ Cozy Hammock strung between pines
```

### 1. 16 Non-Overlapping Radial Coordinate Slots:
* **Emerald Grove (West Slots):** `[-1.2, -0.8]`, `[-1.8, 0.4]`, `[-0.6, -1.8]`, `[-1.5, 1.5]`, `[-0.3, 1.8]`, `[-2.1, -1.5]`, `[-2.4, -0.2]`, `[-1.0, 2.2]`
* **Golden Grove (East Slots):** `[1.2, -0.8]`, `[1.8, 0.4]`, `[0.6, -1.8]`, `[1.5, 1.5]`, `[0.3, 1.8]`, `[2.1, -1.5]`, `[2.4, -0.2]`, `[1.0, 2.2]`

### 2. Micro-Anatomy & Physical Shaders of 3D Meshes:

| Element | Geometry / Mesh Composition | Colors & Materials | Interactive FX |
|---|---|---|---|
| **Tier I Sapling** | 2 stacked 4-sided pyramid cones ($r_1=0.38, r_2=0.26$) on thin trunk ($r=0.06, h=0.4$) | Trunk: `#78350f`<br>Leaves: `#10b981` / `#f59e0b` | Gentle wind breathing |
| **Tier II Young Pine** | 3 stacked faceted conifer tiers ($r_1=0.65, r_2=0.50, r_3=0.35$) on trunk ($r=0.09, h=0.7$) | Top: `#10b981`<br>Mid: `#059669`<br>Shadow: `#047857` | Spring scale on hover ($1.08\times$) |
| **Tier III Mature Pine** | 4 stacked conifer tiers ($r_1=0.95, r_2=0.75, r_3=0.55, r_4=0.38$) with decorative pinecones | Matte porcelain flat-shading (`roughness: 0.5`) | Emissive highlight jump ($+0.25$) |
| **Tier IV Majestic** | 5 grand conifer tiers ($r_1=1.25 \dots r_5=0.35$) with glowing Torus Halo at $Y=3.8$ | Gold: `#f59e0b` metallic `0.15`<br>Halo: `#facc15` emissive `0.8` | Halo rotation + sparkle particles |
| **Tier 0 Churned Stump** | Truncated sawed cylinder ($h=0.35, r=0.42$) with 3 concentric annual rings | Wood: `#92400e`<br>Face: `#fef3c7`<br>Rings: `#b45309` | Hover reveals original customer history |
| **Stepped Earth Strata** | 4-layer stepped voxel block (Grass plate $8\times0.5\times8 \rightarrow$ Clay $\rightarrow$ Terracotta $\rightarrow$ Keel) | Turf: `#22c55e`<br>Topsoil: `#b45309`<br>Clay: `#78350f`<br>Keel: `#451a03` | Drought desaturates turf to `#a3a886` |
| **Sunken Oasis Pond** | $2.4\times0.12\times2.4$ translucent water basin with 2 hexagonal lily pads | Water: `#06b6d4` (`opacity: 0.9`, `metalness: 0.15`) | Breathing vertical ripple scale loop |
| **Campfire & Props** | 8-stone river rock ring surrounding low-poly flame cone and smoke puffs | Stones: `#cbd5e1` / `#64748b`<br>Flame: `#f97316` / `#facc15` | Flame flicker point light ($I=2.5$) |

### 3. Floating 3D Billboard Badges:
* Rendered at 1:1 pixel scale above each tree canopy using `@react-three/drei`'s `<Html center>` (distanceFactor purged for crisp orthographic rendering).
* Double-bezel porcelain design with Lucide icon, repository name, and live stats (`🌲 IndieForest · IV (42c)` or `🪙 Pro Plan · $199/mo`).
* Auto-rotates smoothly with camera so text is always 100% legible.

### 4. Milestone Campsite Spawns:
* **Day 3 Streak:** 🔥 Milestone Campfire with procedural flame, smoke puffs, and warm flickering point light.
* **Day 7 Streak:** ⛺ Canvas Camping Tent with wooden support stakes and cozy lantern.
* **Day 14 Streak:** 🏡 Handcrafted Log Cabin with glowing amber windows.
* **Day 30+ Streak:** 🗼 Stone Lighthouse Watchtower & Wooden Pier with dusk lantern illumination.

### 5. Semantic-Only Visuals (Purged Clutter):
* Zero non-semantic scatter rocks or random clutter. Every single polygon represents a commit, customer, or streak milestone.

---

## 6. THE 3D TIMELINE TIME-LAPSE SCRUBBER

* **Event-Sourced Growth:** Every commit, payment, and milestone is stored with an ISO timestamp in `shipHistory`.
* **Interactive Day Scrubber:** Floating bottom slider `[ Day 1 ───────●──────── Day 90 ]` with quick-jumps (`[ 7d | 30d | 90d | All ]`).
* **Playable Time-Lapse Mode:** 1-click `[ Play Time-Lapse ▶ ]` animates a 10-second $360^\circ$ camera turntable and sequential tree growth sequence optimized for 1080p Twitter/X video captures.

---

## 7. VIRAL DISTRIBUTION & ANTI-SLOP SOCIAL PROOF

```
                       VIRAL DISTRIBUTION ENGINE
                       
  1. Dynamic README Badges        2. Anti-Slop Share Engine      3. Living Public Profile
  ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
  │ https://indieforest.   │     │ 1200×675 Porcelain 3D  │     │ indieforest.app/@user  │
  │ app/api/badge/[user]   │     │ Capture + 3 Number-Led │     │ "Water Tree" Cheers +  │
  │ (Card & Pill SVGs)     │     │ Tweet Copy Templates   │     │ Campsite Guestbook     │
  └────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

### 1. Dynamic SVG README Badges (`/api/badge/[username]`):
* **Card Format (600×200px):** Porcelain diorama card with 3D island thumbnail, streak flame, rank badge, and level.
* **Pill Format:** Shields.io compatible badge: `[ 🌲 IndieForest | Lv 12 | 🔥 14d | 93% Health | $237 MRR ]`.

### 2. 1-Click Anti-Slop Social Card Exporter:
* Generates a 1200×675 high-res 16:9 canvas capture with metrics overlay.
* 3 Curated tweet templates in Pieter Levels / Marc Lou style:
  1. *Numbers-Led:* `Day 18 building my SaaS. 42 commits this month, 1st Stripe customer landed. Island status: Lush (86% consistency). https://indieforest.app/@kwakhare5`
  2. *Minimal:* `Consistency over motivation. 3 weeks of daily shipping captured on my 3D diorama: https://indieforest.app/@kwakhare5`
  3. *Milestone:* `Just unlocked the Log Cabin on @IndieForest (14-day ship streak 🔥). Zero zero-days.`

### 3. Living Public Profile & Visitor Social Loop:
* Public URL: `indieforest.app/u/[username]`.
* **Visitor "Water Tree" Cheer:** 1-click action showers cheer particles and gives +5 XP.
* **Campsite Guestbook:** 1-line encouraging notes left on the campsite bulletin board.

---

## 8. SAAS BUSINESS & MONETIZATION MODEL

| Tier | Price | Features Included |
|---|---|---|
| **Hobby Scout (Free)** | **\$0 / forever** | 2 GitHub repos auto-sync, 1 Stripe/Polar stream, full Dual-Grove 3D diorama, 30d Timeline Scrubber, public 3D profile, dynamic README badges, milestone campsite. |
| **Pro Builder** | **\$12/mo** or **\$79 lifetime** | Unlimited GitHub repos, multiple payment processors, full 90d/All Timeline Scrubber, 1080p MP4 time-lapse video exporter, Custom 3D Biomes (*Sakura Blossom, Dark Cyberpunk, Desert Oasis*), custom domain (`forest.yourdomain.com`). |
| **Team / Studio** | **\$29/mo** | Multiplayer team island (entire engineering team commits to one shared mega-diorama). |

---

## 9. VERIFICATION & QUALITY ASSURANCE

* **Unit Tests:** 56/56 passing Vitest unit tests in `src/lib/*.test.ts`.
* **Zero-`any` Type Safety:** Strict TypeScript models in `src/types/game.ts`.
* **Rate-Limit Resilience:** Edge caching (`s-maxage=120`) and pre-warmed static snapshots.


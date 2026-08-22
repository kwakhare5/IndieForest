# 🌲 IndieForest — Master Product Specification, Architecture & Design Blueprint

> **The Living 3D Proof-of-Work & Revenue Diorama for Indie Hackers**  
> *Turning daily shipping momentum into a living, physical 3D world with zero manual labor.*  
> **Status:** Canonical Single Source of Truth

---

## 1. Vision & Core Philosophy

### The Real Problem Solved
1. **The \$0 MRR Pre-Revenue Void:** 95% of builders spend months building with \$0 MRR. Revenue-only visualizers (like ForestMRR) show flat zeros and cause founder burnout. IndieForest's **Emerald Pines** give emotional progress from Day 1 purely through code commits.
2. **Chore Fatigue from Manual Trackers:** Apps requiring founders to open a dashboard and manually type daily check-ins suffer an 85%+ drop-off within 7 days. IndieForest is **100% zero-touch** (automatic GitHub commit sync & Stripe webhooks).
3. **The Distribution Bottleneck:** Indie hackers know they need to "build in public," but creating graphics takes 30+ minutes. IndieForest renders **1200×675 verified 3D cards and human tweet text in <10 seconds**.
4. **Streak Anxiety & Guilt:** Traditional streaks punish missed days and make users feel like failures. IndieForest uses a **Rolling 30-Day Forest Health %**, **Streak Shields**, and a **"Welcome-Back Rain"** mechanic that never destroys past work.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               INDIEFOREST CORE LOOP                                    │
│                                                                                        │
│   INPUT (Automated)                 LIVING DIORAMA                 UTILITY & GROWTH    │
│   ─────────────────                 ──────────────                 ────────────────    │
│   • GitHub Commits (Zero-Touch) ──▶ • Emerald Pines (Shipping) ──▶ • 1-Click X Cards   │
│   • Stripe/Polar Webhooks       ──▶ • Golden Pines (Revenue)   ──▶ • README Live Badge │
│   • Rest Mode / Sabbaticals     ──▶ • Milestone Campsite       ──▶ • 10s MP4 Turntable │
│   • Visitor Cheers (1x/day)     ──▶ • Dynamic Weather/Pond     ──▶ • Public URL (/u/)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 3D Art Direction, Farm Layout & Geometry

### A. The 3D Art Style: Tactile Low-Poly Porcelain (Monument Valley × Hay Day)
* **Geometry:** Clean, faceted low-poly conifers (stacked 4-sided pyramid tiers with chamfered silhouettes), solid carved hexagonal cedar wood trunks, and smooth geometric props.
* **Materials:** Matte ceramic/clay finish (`roughness: 0.55`, `metalness: 0.05`, soft flat-shading).
* **Fidelity:** Lightning-fast load times (<1s), 60fps on every mobile browser, zero texture bloat, and looks like an expensive architectural wooden diorama on a designer's desk.

### B. Farm Base & Ground Architecture: 2-Layer Chamfered Meadow Slab
* **Top Surface:** Flat spring meadow plate with softly rounded 45° chamfered corners and a slight bevel edge.
* **Base Keel:** Solid, warm terracotta/clay foundation block ($0.45\text{m}$ thick) with clean cut sides—giving it the physical weight of a collectible diorama.
* **Dynamic Farm Scaling:**
  * **Level 1–4 (Virgin Islet):** $6.0\text{m} \times 5.8\text{m}$ (2 slots, raw meadow).
  * **Level 5–9 (Growing Grove):** $8.5\text{m} \times 8.0\text{m}$ (6 slots + south basin).
  * **Level 10–19 (Thriving Island):** $11.0\text{m} \times 10.5\text{m}$ (12 slots + shrines).
  * **Level 20+ (Majestic Archipelago):** $13.5\text{m} \times 13.0\text{m}$ (16 radial slots + full estate).

### C. The Dual-Grove Partition (Code vs. Revenue)
Instead of artificial walls or fences, the pastures are partitioned naturally:

```
                       [ NORTH HORIZON ]
               Startup Flagpole & Horizon Skyline
                               │
   [ WEST PASTURE ]            │            [ EAST PASTURE ]
   🌲 EMERALD SHIPPING         │            🪙 GOLDEN REVENUE
   • 8 Farm Plot Slots         │            • 8 Farm Plot Slots
   • Fresh Meadow Grass        │            • Golden-Loam Grass
   • GitHub Repos & Commits    │            • Paying Customers & MRR
                               │
               ════════════════╪════════════════
                     CENTRAL STONE WALKWAY
               (Stepping river stones down X = 0)
               ════════════════╪════════════════
                               │
   [ SOUTH-WEST CAMPSITE ]     │     [ SOUTH-EAST OASIS POND ]
   • 🪵 Milestone Campfire     │     • 🌊 Crystal Turquoise Basin
   • ⛺ Day 7+ Canvas Tent     │     • 🪵 Wooden Pier Deck
   • 🏡 Day 14+ Log Cabin      │     • 🪷 Floating Lily Pads
```

1. **Central Riverstone Walkway ($X = 0$):** Clean stepping cobblestones running down the center spine.
2. **Subtle Pasture Hue Differentiation:**
   * **West (Shipping):** Crisp spring emerald turf (`#22c55e`) with subtle mowed $1.6\text{m}$ farm plot lines.
   * **East (Revenue):** Warmer golden-tinted loam (`#16a34a` with soft amber flower sprouts).
3. **South Basin Oasis & Campsite:**
   * South-East: Recessed crystal turquoise water pond (`#06b6d4`) with stepped wooden pier deck and floating lily pads.
   * South-West: Dedicated milestone campsite (Campfire, Tent, Cabin) keeping all 16 tree slots 100% unblocked.

---

## 3. Tree Micro-Anatomy & Floating 3D Billboards

```
TIER I: SAPLING           TIER II: YOUNG PINE       TIER III: MATURE PINE      TIER IV: MAJESTIC PINE
(1+ Commits / $10 MRR)    (8+ Commits / $50 MRR)    (25+ Commits / $500 MRR)   (60+ Commits / $2,000+ MRR)

       /\                         /\                         /\                          /\
      /  \                       /  \                       /  \                        /  \ (Torus Halo)
      \__/                       \__/                       \__/                        \__/
       ||                        /    \                     /    \                      /    \
                                 \____/                     \____/                      \____/
                                   ||                       /      \                    /      \
                                                            \______/                    \______/
                                                               ||                       /        \
                                                                                        \________/
                                                                                            ||
```

### A. Emerald Shipping Pines (West Grove):
* **Foliage:** Stacked 4-sided pyramid tiers with alternating emerald shades:
  * Top tier: Light Spring Leaf (`#10b981`)
  * Mid tiers: Deep Forest Emerald (`#059669`)
  * Bottom tier & shadow: Dark Pine (`#047857`)
* **Tier IV Majestic:** 5 grand conifer tiers crowned with a soft golden Torus halo and particle pollen floating at the apex.

### B. Golden Revenue Pines (East Grove):
* **Foliage:** Shimmering warm honey gold (`#f59e0b` $\rightarrow$ `#facc15`) with subtle metallic gloss (`metalness: 0.15`, `roughness: 0.45`).
* **Interaction:** Hovering triggers golden coin sparkle particles.

### C. Floating 3D Porcelain Billboard Badges:
* Anchored at 1:1 scale directly above each tree canopy using `@react-three/drei` `<Html center>`.
* Double-bezel porcelain pill tag displaying the repo name, Roman numeral tier, and live commits or MRR:
  * `🌲 IndieForest · IV (42c)`
  * `🪙 Pro Plan · $199/mo`

---

## 4. Camera Angle, Projection & Lighting Engine

### A. Camera Setup: True Orthographic Isometric + Parallax
* **Projection:** Locked Orthographic Camera (classic $35.264^\circ$ pitch, $45^\circ$ yaw). Zero lens distortion.
* **Elastic Hologram Parallax:** Subtle interactive tilt ($\pm 8^\circ$) responding to mouse movement or mobile gyro tilt.
* **Bounded Zoom:** Smooth pinch-to-zoom / scroll-to-zoom ($0.6\times \dots 1.5\times$) preventing disorientation.
* **Benefit:** Guarantees every user screenshot is framed at the perfect, iconic architectural angle.

### B. Dynamic Natural Organic Lighting Cycle:
* **☀️ Day Mode:** Warm Studio Linen light (`#fffbeb`) with soft directional shadows.
* **🌅 Sunset (Golden Hour):** Warm peach/rose ambient light (`#fb7185`) casting long cinematic shadows.
* **🌙 Night Mode:** Deep indigo moonlit sky (`#0f172a`), glowing amber cabin windows (`#facc15`), and flickering orange campfire point light.

---

## 5. Milestone Campsite & Non-Clutter Decor

| Structure | Milestone | Interactive Function (When Clicked) | Psychological Benefit |
|---|---|---|---|
| **🪵 Milestone Campfire** | Day 3 Streak | **Daily Focus & Audio Station:**<br>• Toggles Web Audio procedural crackling fire & lo-fi coding ambiance.<br>• Minimalist input: *"What is the ONE atomic thing you are shipping today?"* | Eliminates morning decision paralysis; starts deep work sprint. |
| **⛺ Canvas Tent** | Day 7 Streak | **Streak Shield Vault & Rest Planner:**<br>• Displays active Streak Shields (earned every 7 days, max 2).<br>• 1-Click "Sabbatical / Touch Grass Mode" to schedule offline days without streak anxiety. | Prevents toxic burnout and guilt-driven app abandonment. |
| **🏡 Timber Log Cabin** | Day 14 Streak | **Founder's War Room & Multi-Repo HQ:**<br>• Consolidated dashboard of multi-repo health, active trees, and milestone receipts.<br>• Glowing window lighting reacts to sunset/night. | Provides a high-status command center as habits solidify. |
| **🎣 Wooden Pier & Pond** | Day 30+ Streak | **3D Time Capsule & Turntable Exporter:**<br>• Launches the 10-second automated time-lapse playback.<br>• 1-Click export to 60fps MP4/GIF for social proof. | Celebrates long-term discipline and creates viral video hooks. |

### Small Non-Clutter Decorative Elements:
1. **Natural Terrain Accents (Auto-spawns with Level):**
   * Low-poly river stones lining the pond shoreline.
   * Floating hexagonal lily pads on the turquoise oasis.
   * Minimalist wooden boundary fence posts.
2. **Camp Shop Items (Placed in designated non-clipping slots):**
   * **Night Lantern Posts (100 🌰):** Light up the central walkway at dusk/night.
   * **Custom Startup Flagpole (150 🌰):** Hoists startup logo on the North-West bluff.
   * **Procedural Lo-Fi Synthesizer (200 🌰):** Unlocks ambient soundscapes for deep work.
   * **Seasonal Biomes (250 🌰):** Autumn Amber, Midnight Cyberpunk, Nordic Frost, Sakura Blossom.
   * **Project Graveyard Composting:** Archiving a dead project turns the tree into a mossy rune stone and refunds 100 🌰 for the next startup.

---

## 6. Daily Quests & Pinecone Economy Specification

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE PINECONE ECONOMY                            │
│                                                                        │
│   EARN PINECONES (Zero-Spam Quests)      SPEND IN CAMP SHOP            │
│   ├── Daily Atomic Ship (+10 🌰)          ├── Biome Shaders (Autumn,    │
│   ├── 7-Day Streak Milestone (+25 🌰)    │   Cyberpunk, Nordic, Zen)   │
│   ├── Customer Touchpoint (+20 🌰)       ├── Custom SVG Flagpole       │
│   └── Public Visitor Cheer (+5 🌰)        ├── Procedural Lo-Fi Synthesizer│
│                                          └── Emergency Streak Shields  │
└────────────────────────────────────────────────────────────────────────┘
```

### A. The 4 High-Signal Daily Quests (Tailored to Builders):
1. **"The Atomic Commit" (Daily Core):** Push $\ge 1$ verified git commit to `main`/`master` ($+100\text{ XP}$, $+10\text{ 🌰}$).
2. **"The Build-in-Public Slice" (Distribution):** Export and share 3D card or ship link to X/LinkedIn ($+50\text{ XP}$, $+15\text{ 🌰}$).
3. **"Customer Touchpoint" (Revenue/Feedback):** Log user feedback response, bug fix verification, or Stripe subscriber event ($+75\text{ XP}$, $+20\text{ 🌰}$).
4. **"Grove Stewardship" (Social):** Visit a peer founder's island and send a Visitor Cheer ($+30\text{ XP}$, $+5\text{ 🌰}$).

### B. Camp Shop Catalog (100% Aesthetic & Anti-Slop):
* **Night Lantern Posts (100 🌰):** Place low-poly ambient lantern posts along the central walkway.
* **Custom SVG Startup Flagpole (150 🌰):** Hoists custom project icon on the North-West bluff.
* **Procedural Lo-Fi Synthesizer (200 🌰):** Unlocks deep-work generative audio modes (Campfire, Rain, Lo-Fi chimes).
* **Seasonal Biome Shaders (250 🌰):** Autumn Amber, Midnight Cyberpunk Neon, Nordic Frost, Sakura Blossom.
* **Emergency Streak Shield (300 🌰):** Purchase a backup shield if cap (<2) is not met.
* **Project Graveyard Composting:** Archiving a dead repo turns its tree into a mossy rune stone and refunds $100\text{ 🌰}$ toward the next project.

---

## 7. Developer Utility & Daily Workflow Hooks

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE DEVELOPER WORKFLOW                          │
│                                                                        │
│  [ CLI / Git Hook ] ──▶ [ VS Code / Cursor ] ──▶ [ Zen Focus Timer ]   │
│  git commit -m "..."    Mini status bar tree    25-min Pomodoro session│
│         │                       │                       │              │
│         └───────────────────────┼───────────────────────┘              │
│                                 ▼                                      │
│                      [ 3D Living Island Sync ]                         │
└────────────────────────────────────────────────────────────────────────┘
```

1. **CLI & Git Post-Commit Hook (`npx indieforest init-hook`):**
   * Automatically executes on `git commit`, playing a subtle retro terminal chime and syncing the 3D diorama in the cloud without opening a browser.
2. **VS Code & Cursor Status Bar Extension:**
   * Displays micro status item: `🌲 IndieForest: 14d Streak | Health: 98%`.
   * 1-click opens an interactive Webview popup of the 3D diorama directly inside the editor.
3. **Zen Focus & Pomodoro Station (Web Audio API):**
   * 25m / 50m deep work sprints. Lighting dims to midnight, procedural fire/rain ambiance fades in, and a special Bonsai Sapling grows in real-time during the sprint.
4. **Founder Voice Memos & Milestone Capsules:**
   * Attach a 10-second audio note or markdown log to a tree's growth tier (e.g. *"Day we launched v1 and auth broke at 3 AM"*). Anyone clicking the tree in 2 years can replay the time capsule.

---

## 8. In-World Diorama Delights, Wildlife & Milestone Relics

### A. Living Wildlife (Spawned by Consistency):
* **Day 5+ Streak:** Low-poly robin nests in the tallest Emerald Pine.
* **Day 10+ Streak:** Campsite dog/cat sleeps by the campfire and follows camera orbit.
* **High Activity / MRR:** Golden koi fish jump in the turquoise oasis pond with water ripple shaders.

### B. Milestone Achievement Totems:
* **Product Hunt Launch Day:** Miniature rocket totem on the North shore.
* **Hacker News #1 / Viral Launch:** Glowing beacon lighthouse shooting a soft volumetric beam into the sky.
* **First \$100 MRR:** Solid golden river boulder engraved with the milestone date.
* **1,000 GitHub Stars:** Glowing star relic suspended above the central grove.
* **Night Sky Commit Constellations:** During night mode, stars in the 3D sky align into geometric constellations mapped to active repo names.

---

## 9. Multiplayer, Guilds & Social Distribution (V2)

1. **Archipelago Bridges (Co-Founder & Small Team Mode):**
   * When 2 founders co-build a startup, a wooden suspension rope bridge joins their two islands over the water, showing both members' trees side-by-side.
2. **Hacker Houses / Squad Guilds (Up to 5 Friends):**
   * An archipelago cluster of 5 friend islands arranged around a shared central community bonfire. Accountability without toxic meetings: friend islands dim if no commits occur for 3+ days.
3. **Live Visitor Ghost Shadows:**
   * When visitors explore `/u/[username]`, their cursor renders as a subtle glowing firefly or wanderer exploring the campsite.
4. **Auto-Generated Friday Recap Cards:**
   * 4-panel visual comparison comparing Monday morning vs Friday evening island growth (+3 branches, +28 commits, +$120 MRR).
5. **Interactive Embed iFrames:**
   ```html
   <iframe src="https://indieforest.vercel.app/embed/kwakhare5" width="400" height="400"></iframe>
   ```

---

## 10. Frontend Component Hierarchy & Stack

```
src/
├── components/
│   ├── canvas/                          # 3D React Three Fiber Layer
│   │   ├── ForestCanvas.tsx             # Canvas wrapper, Orthographic Camera, Parallax Rig
│   │   ├── TerrainIsland.tsx            # Chamfered 2-layer meadow slab, central path, turquoise pond
│   │   ├── BlockTree.tsx                # 5-tier faceted conifer tree meshes + 3D billboard tags
│   │   ├── CampProps.tsx                # Milestone campfire, tent, cabin, pier, lanterns
│   │   └── WeatherSystem.tsx            # Particle engines (Emerald rain, gold showers, dormancy fog)
│   │
│   ├── hud/                             # Full-Screen Tactical Game HUD
│   │   ├── DashboardBuilderCapsule.tsx  # Top-left builder status capsule (Avatar, Rank, XP, Streak, Health %)
│   │   ├── DashboardGameControls.tsx    # Top-right game controls (Sync, Lo-Fi Audio, Drawer, Settings)
│   │   ├── FloatingDock.tsx             # Bottom Action Bar (Campfire, Tree, Timeline, Video, Share)
│   │   ├── TreeInspectorCard.tsx        # In-world 3D tree click inspector card
│   │   ├── ModuleInventoryDrawer.tsx    # Right slide-over module search & grove filtering drawer
│   │   ├── TimelineScrubber.tsx         # Interactive historical slider + 10s turntable player
│   │   ├── TurntableExportModal.tsx     # 10s 60fps turntable video exporter
│   │   ├── CampfireFocusModal.tsx       # Daily atomic checkoff & lo-fi station
│   │   ├── TentSabbaticalModal.tsx      # Streak shield vault & sabbatical mode
│   │   ├── CabinWarRoomModal.tsx        # Multi-repo command HQ
│   │   ├── ShareCardModal.tsx           # 1200×675 High-Res 3D Card Generator + Tweet Drafter
│   │   ├── AddTreeModal.tsx             # Manual planter & webhook simulator
│   │   ├── SettingsModal.tsx            # Webhook console & GitHub sync
│   │   └── GuestbookModal.tsx           # Campsite visitor bulletin board
│   │
│   └── landing/                         # Modular Landing Page
│       ├── LandingNavbar.tsx            # Floating porcelain navbar
│       ├── LandingHero.tsx              # Live 3D interactive hero diorama
│       ├── LandingSectionHeader.tsx     # Standardized section header
│       ├── LandingFeatureCard.tsx       # Standardized porcelain feature card
│       ├── LandingRitual.tsx            # 3-step zero-touch loop
│       ├── LandingShowcase.tsx          # Dual-grove breakdown
│       ├── LandingBento.tsx             # Anti-burnout & distribution bento
│       ├── LandingFaq.tsx               # Transparent FAQ
│       └── LandingFooter.tsx            # Final CTA card & links
│
├── lib/
│   ├── gamification.ts                  # Pure domain math (Tiers, XP, 30-Day Forest Health, Shields)
│   ├── github.ts                        # Edge-cached GitHub Events API ingestion
│   ├── revenueWebhook.ts                # Stripe/Polar/Lemon Squeezy payload parsers
│   ├── badge.ts                         # Dynamic SVG README badge renderer
│   ├── sound.ts                         # Procedural Web Audio synthesizer (Lo-Fi campfire ambiance)
│   ├── videoExport.ts                   # 60fps MediaRecorder canvas video capture
│   └── curatedBuilders.ts               # Pre-warmed instant hero profiles (@levelsio, @shadcn, etc.)
│
└── store/
    └── useForestStore.ts                # Local-first Zustand 5 state with tab-focus auto-sync
```

---

## 11. SaaS Monetization Model

| Tier | Price | Inclusions |
|---|---|---|
| **Hobby Scout (Free)** | **\$0 / forever** | Unlimited GitHub repos auto-sync, full Emerald Shipping Grove, 30d Timeline Scrubber, public 3D profile, dynamic README SVG badge, 1200×675 share cards. |
| **Pro Builder** | **\$7/mo** or **\$49/yr** | Unlocks Golden Revenue Grove (Stripe/Polar/Lemon Squeezy), 4K 60fps video turntable export, premium biomes, custom domain (`forest.yourbrand.com`), co-founder bridge. |
| **Lifetime Supporter** | **\$99 one-time** | Handcrafted 3D Founder Obelisk + all Pro features forever. |
| **Team / Studio** | **\$29/mo** | Shared 5-builder island archipelago. |

---

## 12. Phased Implementation Roadmap & Live Status

```
✅ PHASE 1: Core Sharing Engine & Dynamic SVG Badge (COMPLETED)
├── Dynamic GitHub README SVG endpoint (/api/badge/[username])
├── 1200×675 High-Res 3D Social Card Exporter + 3 Human Tweet Templates
├── 1-Click Repo Archiving / Hide Tree toggle
└── "Welcome-Back Rain" shower mechanic for returning builders

✅ PHASE 2: Revenue Webhook Pipeline (COMPLETED)
├── Universal webhook route (/api/webhooks/revenue) with HMAC validation
├── Golden Shimmer Tree physical mesh & level-up animations
└── Stripe, Lemon Squeezy, and Polar payload normalizers

✅ PHASE 3: Interactive Milestone Campsite & Full-Screen HUD (COMPLETED)
├── Full-screen edge-to-edge 3D game island (/dashboard) with 0 document scrolling
├── Tactical HUD: DashboardBuilderCapsule, DashboardGameControls, ModuleInventoryDrawer
├── Click handlers on Campfire (Procedural Lo-Fi Audio + Atomic Goal Checkoff)
├── Click handlers on Tent (Streak Shield Bank + Sabbatical Rest Mode)
└── Click handlers on Cabin (Multi-Repo War Room Modal)

✅ PHASE 4: 10-Second 3D Turntable Video Exporter (COMPLETED)
├── Canvas stream MediaRecorder capture loop at 60fps
├── 360° camera orbit synchronized to Timeline Scrubber playback
└── Instant MP4/WebM download with founder watermark & stats

🚀 PHASE 5: Live Production Vercel Launch (COMPLETED)
├── Promoted to https://indieforest.vercel.app
├── Resolved Edge Middleware invocation crash
└── 48/48 Vitest domain tests passing + 0 ESLint warnings

🔮 PHASE 6: Multiplayer Archipelagos & CLI Tooling (NEXT UP)
├── npx indieforest init-hook git post-commit CLI
├── VS Code / Cursor status bar extension
├── Co-founder twin island suspension bridge
└── Squad Guild bonfires for 5-person hacker circles
```

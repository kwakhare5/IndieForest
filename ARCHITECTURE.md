# IndieForest — Master Architecture & Game Design Document

## 1. Vision & Core Philosophy

**IndieForest** is a playable, living 3D low-poly isometric island dashboard for indie hackers, solo founders, and developers. It turns daily coding consistency and project milestones into a delightful game:

- 🪵 **Daily Shipping is Vitality:** Pushing commits or logging daily progress triggers rain showers, grows your forest, levels up your developer rank, and unlocks cozy island upgrades.
- 🌲 **Customers = Trees (Optional Layer):** Paying customers sprout as dedicated named 3D pine trees.
- 🎯 **Daily Focus Ritual:** Pick your **#1 Priority Quest** each morning; check it off by night to keep your island thriving.
- 🛡️ **Burnout-Proof:** Earn **Streak Shields** so well-deserved rest days never wipe your hard-earned progress.

---

## 2. Visual Style & 3D Rendering Pipeline

- **Renderer:** Three.js via **React Three Fiber (`@react-three/fiber`)** + **`@react-three/drei`**.
- **Camera:** `OrthographicCamera` set at an isometric angle (`position={[20, 20, 20]}`, `zoom={42}`), with smooth orbit rotation, pan, and zoom clamping.
- **Lighting & Shadows:**
  - Soft directional sunlight casting real-time low-poly shadows (`castShadow={true}`, shadow map size 2048).
  - Ambient fill light + warm point light on the campfire and lanterns.
- **Aesthetic Inspiration:** Flat-shaded, stylized low-poly voxel terrain block with terraced cliff strata, crystal blue central pond, campfire, and geometric pine trees.
- **Zero AI-Runtime Dependency:** All models are constructed via procedural Three.js geometries (box/cylinder/cone instances) and CC0 low-poly GLTFs. Programmatic material shaders handle color transitions and seasonal palettes.

```
                    ┌─────────────────────────┐
                    │      Sun / Sunlight     │
                    └───────────┬─────────────┘
                                │
             ┌──────────────────▼──────────────────┐
             │       3D Isometric Forest Island    │
             │  ┌───────────────┐ ┌──────────────┐ │
             │  │ Terrain Block │ │ Central Pond │ │ │
             │  └───────┬───────┘ └──────┬───────┘ │
             │          │                │         │
             │  ┌───────▼────────────────▼───────┐ │
             │  │   Instanced Pine Trees / Props │ │
             │  └────────────────────────────────┘ │
             └──────────────────┬──────────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Weather / FX Particles │
                    │ (Rain / Coins / Glows)  │
                    └─────────────────────────┘
```

---

## 3. The Gamification & Economy Engine

### 3.1 XP & Level Progression
Experience points (XP) are earned through daily developer actions:

| Action | XP Reward | Purpose |
|---|---|---|
| **Daily Ship (GitHub or Manual)** | `+100 XP` | Primary habit anchor |
| **Complete Daily #1 Focus Quest** | `+50 XP` | Priority discipline |
| **Streak Multiplier** | `+10 XP × streak_days` | Consistency compounding |
| **Proof-of-Work Link (URL / PR / Tweet)** | `+25 XP` | Public accountability |
| **New Customer / Revenue Event** | `+200 XP` | Business growth milestone |

```
Level Formula: XP_required = 200 * (Level ^ 1.4)
```

### 3.2 Developer Ranks & Titles
- **Lvl 1–4:** Seedling Scout 🌲 *(Starter 6x6 Island, Dirt Camp)*
- **Lvl 5–9:** Code Forager 🏕️ *(Unlocked Campfire 🔥, Wooden Logs)*
- **Lvl 10–19:** Shipwright 🛶 *(Unlocked Fishing Pier, Camping Tent ⛺, 8x8 Island)*
- **Lvl 20–34:** Island Architect 🏡 *(Unlocked Cozy Wood Cabin, Stone Pathways)*
- **Lvl 35–49:** Mountain Warden 🏮 *(Unlocked Stone Watchtower, Lantern Posts)*
- **Lvl 50+:** Forest Monarch 👑 *(Unlocked Northern Lights 🌌, Golden Shrine)*

### 3.3 Economy: Pinecones (🌰) & The Camp Shop
- **Earning Pinecones:** Earn **10 🌰** per daily ship, **25 🌰** on 7-day streak milestones, and **50 🌰** on level-ups.
- **Cosmetic Camp Shop:** Spend Pinecones to unlock and place custom props:
  - *Stone Cobblestone Pathway* (20 🌰)
  - *Cozy Wood Bench & Mug* (35 🌰)
  - *Forest Fox / Pet Companion* 🦊 (75 🌰)
  - *Solar Lantern Post* 🏮 (50 🌰)
  - *Cherry Blossom Sakura Biome Skin* (150 🌰)
  - *Snowy Winter Island Theme* (150 🌰)

### 3.4 Burnout Prevention: Streak Shield System 🛡️
- Earn **1 Streak Shield** for every 7 consecutive days of shipping (holds a maximum of **2 Shields** in inventory).
- If a developer misses a day (vacation, weekend, rest), 1 shield is consumed automatically, protecting the streak counter and preventing forest drought.

### 3.5 Dynamic Atmosphere & Weather Buffs ✨
- **3+ Day Streak:** Campfire sparks with warm light and rising smoke particles.
- **7+ Day Streak:** "Golden Hour" lighting mode + glowing fireflies at night.
- **14+ Day Streak:** Rainbow arc over the central pond after rain events.
- **30+ Day Streak:** Aurora Borealis (Northern Lights) shader across the night sky.
- **Drought Mode (Missed Ship without Shield):** Subtle mist/fog rolls in, foliage desaturates slightly until the next ship.

---

## 4. Daily Shipping Ritual & UX Flow

1. **Morning (30 Seconds):**
   - Open IndieForest dashboard.
   - Enter **"Today's #1 Focus Quest"** (e.g., *"Finish Stripe Checkout webhook"*).
2. **Throughout the Day:**
   - Code freely. GitHub pushes are automatically polled and queued.
3. **Evening / Wrap-up (10 Seconds):**
   - Click **"⚡ Ship It"** (or auto-completed via commit).
   - Dynamic 3D rain shower pours over the island.
   - Gold coin particles and XP banner trigger level progress.
   - Optional: Click **"Share to X"** to generate a 1-click branded 3D snapshot card.

---

## 5. Technical System Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Next.js 15 App Router (TypeScript + Tailwind v4)"]
        UI[HUD: Quest Bar, Streak Badge, XP Progress]
        R3F[React Three Fiber Canvas]
        ThreeScene[3D Island: Procedural Terrain, Pond, Trees, Weather]
        CardGen[1-Click Social Snapshot Generator]
    end

    subgraph State ["Client & Store Layer"]
        ZustandStore[useForestStore (Zustand + LocalStorage Sync)]
        AudioSynthesizer[WebAudio Sound Effects]
    end

    subgraph Integrations ["Data Connectors"]
        GitHubAPI[/api/github/activity (Commits & PRs)]
        StripeWebhook[/api/stripe/webhook (Customers -> Trees)]
    end

    UI --> ZustandStore
    GitHubAPI --> ZustandStore
    StripeWebhook --> ZustandStore
    ZustandStore --> ThreeScene
    ZustandStore --> AudioSynthesizer
    ThreeScene --> CardGen
```

---

## 6. Phased Implementation Roadmap

### **Phase 1: The Playable 3D Forest & Gamification Loop (Current)**
- [x] Full Master Architecture & Game Design locked.
- [ ] Next.js 15 + R3F + Tailwind project initialization.
- [ ] 3D Procedural Island Canvas (isometric terrain, lake, campfire, rocks).
- [ ] Dynamic Tree System (Saplings, Young Pines, Mature Trees, Stumps).
- [ ] Weather & Particle System (Shipping rain, coin sparks, fireflies).
- [ ] Gamification Engine: XP leveling, Streak Shields, Pinecone currency, Daily Quest Bar.
- [ ] GitHub Activity Integration + 1-Click Manual Ship Modal.
- [ ] 1-Click Social Snapshot Card Export for Twitter/X.

### **Phase 2: Accounts, Social & Supabase Sync**
- [ ] Supabase Auth (Sign in with GitHub).
- [ ] Cloud sync for island data and persistent streaks across devices.
- [ ] Public Shareable 3D Island link (`indieforest.dev/@username`).
- [ ] Stripe customer webhook integration (revenue-to-tree mapper).
- [ ] AI Daily Quest Suggestion (Gemini Flash analyzes commit messages).

### **Phase 3: Multiplayer & Biomes**
- [ ] Multiple product biomes (expand island into archipelago).
- [ ] Indie Hacker Guilds / Team forests.
- [ ] Time-travel scrubber (view 3D island state 30 days ago).

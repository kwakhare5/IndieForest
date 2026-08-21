# 🌲 IndieForest — Canonical Master Specification & Architecture

> **The Living 3D Proof-of-Work & Revenue Diorama for Indie Hackers**  
> *Transforming automated GitHub commits & Stripe revenue into an interactive, shareable 3D world with zero manual labor.*

---

## 1. VISION & CORE VALUE PROPOSITION

### The Problem
1. **Chore Fatigue from Manual Trackers:** Apps requiring founders to open a dashboard daily and manually type a check-in suffer an 85%+ drop-off within 3–7 days.
2. **Spreadsheet Boredom:** Traditional metrics (Stripe, GitHub green squares, ChartMogul) are cold 2D charts lacking emotional resonance and delight.
3. **The \$0 MRR Pre-Revenue Void:** 95% of builders spend months building with \$0 MRR. Revenue-only visualizers (like ForestMRR) are useless to them until they make their first dollar.
4. **The "Proof-of-Execution" Gap on X/Twitter:** Founders building in public need compelling, authentic visual assets to showcase ongoing momentum without writing repetitive brag posts.

### The Solution
**IndieForest** is an automated, living 3D diorama SaaS:
* **Zero Manual Effort:** Connect GitHub once (or type a public username). Every code push automatically waters your island and grows **Emerald Pines**.
* **Dual-Grove Architecture:** When payments arrive via Stripe, Polar, or Lemon Squeezy, **Golden Pines** sprout automatically.
* **Built-in Viral Distribution:** 3D Timeline Scrubber, Live GitHub Profile README SVG badges, and 1-click #buildinpublic share cards give founders organic social proof.

---

## 2. 100% ZERO-TOUCH INGESTION & SMART PROOF-OF-SHIP

```
                       THE ZERO-FRICTION ONBOARDING FUNNEL
                       
  Step 1: The Instant Hook (No Sign-Up Required)
  ┌────────────────────────────────────────────────────────────────────────┐
  │  Landing Hero: Type your GitHub username: [ kwakhare5 ] [ 🌲 Sprout ]  │
  └────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ (1.5 seconds via GitHub Public API)
  ┌────────────────────────────────────────────────────────────────────────┐
  │  🎉 Instant Wow: Your actual GitHub commit history renders a living    │
  │  3D Island in real-time. (Real repos, real streaks, real pine trees).  │
  └────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  Step 2: 1-Click Claim & Auto-Sync
  ┌────────────────────────────────────────────────────────────────────────┐
  │  Click [ 🐙 Claim Island ] -> Clerk / GitHub OAuth authorizes in 1 click│
  │  Background sync automatically updates island on every push.           │
  └────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  Step 3: Connect Revenue (When Ready)
  ┌────────────────────────────────────────────────────────────────────────┐
  │  Connect Stripe / Polar / LemonSqueezy -> Golden trees sprout live.    │
  └────────────────────────────────────────────────────────────────────────┘
```

### The Smart Proof-of-Ship Anti-Gaming Algorithm:
1. **Dual-Gated Growth Tiers (Commits + Calendar Days):**
   * **Sapling:** 1+ commits AND 1 active day (\$0–\$49 MRR)
   * **Young:** 8+ commits AND 3+ distinct active days (\$50–\$499 MRR)
   * **Mature:** 25+ commits AND 10+ distinct active days (\$500–\$1,999 MRR)
   * **Majestic:** 60+ commits AND 25+ distinct active days (\$2,000+ MRR)
   * *Invariant:* No user can spawn a Majestic tree in 1 day by spamming commits. Consistency over time is mathematically required.
2. **Logarithmic Daily XP Scaling:**
   * 1st Push of the day: **+100 XP** (Full reward + Streak increment + Rain shower)
   * 2nd Push of the day: **+25 XP**
   * 3rd Push of the day: **+15 XP**
   * Daily Cap: Maximum +160 XP/day from code pushes alone.
3. **Bot & Empty Commit Filtering:**
   * Auto-ignores automated bot commits (Dependabot, Renovate, GitHub Actions bots).
   * Auto-filters empty `--allow-empty` commits.
4. **Edge Caching & Rate-Limit Shielding:**
   * `Cache-Control: public, s-maxage=120, stale-while-revalidate=300` ensures zero GitHub API rate-limit throttling.

---

## 3. 3D SPATIAL DIORAMA & RADIAL SECTOR ARCHITECTURE

```
                            [ NORTH ]
                      Tech Stack Totems / Shrine
                 (Next.js, TypeScript, Tailwind)
                                │
   [ WEST ]                     │                    [ EAST ]
Emerald Shipping Grove          │              Golden Revenue Grove
(Commits & Repositories)        │              (Customers & Subscriptions)
  🌲 Repo A (Mature, 30c)       │                🪙 Customer A ($199/mo, Majestic)
  🌲 Repo B (Young, 12c)        │                🪙 Customer B ($79/mo, Mature)
  🌲 Repo C (Sapling, 3c)       │                🪙 Customer C ($29/mo, Young)
                                │
                                ▼
                       [ CENTER OASIS ]
              • Milestone Campfire (Streak >= 3d)
              • Canvas Tent (Streak >= 7d)
              • Wooden Log Cabin (Streak >= 14d)
              • Turquoise Oasis Pond & Wooden Pier
              • Cozy Hammock between Pines
```

### 16 Non-Overlapping Radial Coordinate Slots:
* **Emerald Grove (West Slots):** `[-1.2, -0.8]`, `[-1.8, 0.4]`, `[-0.6, -1.8]`, `[-1.5, 1.5]`, `[-0.3, 1.8]`, `[-2.1, -1.5]`, `[-2.4, -0.2]`, `[-1.0, 2.2]`
* **Golden Grove (East Slots):** `[1.2, -0.8]`, `[1.8, 0.4]`, `[0.6, -1.8]`, `[1.5, 1.5]`, `[0.3, 1.8]`, `[2.1, -1.5]`, `[2.4, -0.2]`, `[1.0, 2.2]`

### Milestone Campsite (Sprouts for Free):
* **🔥 Day 3 Streak:** Milestone Campfire ignites with procedural animated flame, smoke puffs, and localized point light.
* **⛺ Day 7 Streak:** Canvas Camping Tent pitched on campsite.
* **🏡 Day 14 Streak:** Handcrafted Log Cabin with glowing windows.

### Multi-Tiered Weather Reactions:
* **Code Commit:** Gentle Emerald Mist & Particle Rain 🌧️.
* **Milestone Streak (Day 7, 14, 30):** Dramatic Thunderstorm & Golden Sunrays ⚡🌤️.
* **Stripe Customer Payment:** Radiant Golden Particle Shower & Water Ripples ✨🪙 with retro cash chime.

---

## 4. THE 3D TIMELINE TIME-LAPSE SCRUBBER

* **Event-Sourced Architecture:** Every commit push, customer payment, and streak milestone is recorded with an ISO timestamp.
* **Interactive Day Scrubber:** Floating bottom slider `[ Day 1 ───────●──────── Day 90 ]` with quick-jump tabs (`[ 7d | 30d | 90d | All ]`).
* **Playable Time-Lapse Mode:** 1-click `[ Play Time-Lapse ▶ ]` animates a 10-second camera turntable and sequential tree growth sequence optimized for 1080p Twitter/X video captures.

---

## 5. VIRAL DISTRIBUTION & SOCIAL PROOF ENGINE

1. **The Living 3D Developer Portfolio (`indieforest.app/@username`):**
   * Read-only interactive 3D diorama for Twitter bio, GitHub bio, and portfolio links.
   * **Verifiable Proof Popovers:**
     * Emerald Trees: Click to view verified GitHub commit SHA (`063ffe8`), commit message, and direct clickable diff link.
     * Golden Trees: Click to view verified Stripe/Polar webhook confirmation badge with amount (customer names redacted for privacy).
2. **Dual-Format Dynamic GitHub README Badges:**
   * **Endpoint:** `https://indieforest.app/api/badge/[username]`
   * **Card Format:** 600×200px porcelain double-bezel SVG displaying 3D island thumbnail, streak flame, rank badge, and level.
   * **Pill Format:** Compact shields.io-style badge (`[ 🌲 IndieForest | Lv 12 | 🔥 14d | $237 MRR ]`).
3. **1-Click #buildinpublic Social Exporter:**
   * 1200×675px (16:9) high-resolution 3D diorama capture with metrics overlay badge.
   * 1-click copy pre-formatted, anti-slop 280-char tweet text.
4. **Visitor Cheers & Campsite Guestbook:**
   * Public visitors click **"💧 Water Tree"** to shower cheer particles (+5 XP / +1 Pinecone).
   * 1-line encouraging note pinned to the campsite bulletin board (owner-moderated, max 1 note/day per visitor).

---

## 6. PROGRESSION, ECONOMY & ANTI-BURNOUT PROTECTION

### 6 Roman Numeral Developer Ranks:
* **Lv 1–4:** Seedling Scout (`I`)
* **Lv 5–9:** Code Forager (`II`)
* **Lv 10–19:** Shipwright (`III`)
* **Lv 20–34:** Island Architect (`IV`)
* **Lv 35–49:** Mountain Warden (`V`)
* **Lv 50+:** Forest Monarch (`VI`)

### Pinecone Economy (🌰):
* Earned passively through daily shipping (+10 🌰 per ship, +25 🌰 per milestone).
* Spendable in the Camp Shop for 3D cosmetics (*Stone Firepit, Night Lanterns, Wooden Pier, Cozy Hammock*).

### Anti-Burnout Protection (🛡️):
* 1 Burnout Shield earned every 7 consecutive days of shipping (max 2 held).
* Automatically protects streaks on rest days.
* Inactivity without shields triggers **Merciful Seasonality (Drought Fog & Foliage Sleep)** rather than destroying historical trees.
* Streaks evaluated strictly in developer's **local browser timezone**.

---

## 7. SAAS BUSINESS & MONETIZATION MODEL

| Tier | Price | Included Features |
|---|---|---|
| **Hobby Scout (Free)** | **\$0 / forever** | 1 GitHub account auto-sync, public 3D profile, live README badges, emerald grove, milestone campsite. |
| **Pro Builder** | **\$12/mo** or **\$79 lifetime** | Unlimited GitHub repos, Stripe / Polar live sync, 3D Timeline Scrubber, 1080p MP4 video exporter, Custom 3D Biomes (*Sakura Blossom, Dark Cyberpunk, Desert Oasis*), custom domain (`forest.yourdomain.com`). |
| **Team / Studio** | **\$29/mo** | Multiplayer team island (entire engineering team commits to one shared mega-forest). |

---

## 8. TECHNICAL ARCHITECTURE

```
Frontend:          Next.js 16.3.1 (Turbopack + App Router)
UI & Styling:      React 19, Tailwind CSS v4, Lucide Icons, Double-Bezel Architecture
3D Graphics:       React Three Fiber v9, Three.js (0.170.0), @react-three/drei v10
State Management:  Zustand 5 with local persistence + Supabase cloud sync
Auth & Identity:   Clerk (@clerk/nextjs) + GitHub OAuth
Database:          Supabase PostgreSQL (Profiles, Projects, Events, Trees)
Audio Engine:      Web Audio API real-time synthesizer
Edge Services:     Next.js Edge Runtime for dynamic /api/og and /api/badge SVG generation
Testing Suite:     Vitest 4 with 100% test-driven coverage (41/41 passing tests)
```

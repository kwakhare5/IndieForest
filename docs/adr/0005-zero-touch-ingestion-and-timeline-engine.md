# 5. Architecture Decision Record: Zero-Touch Ingestion & 3D Timeline Engine

Date: 2026-08-22

## Context
IndieForest was previously reliant on manual ship checkoffs and static preview trees. Indie hackers and developers experience immediate chore fatigue with manual logging. ForestMRR demonstrated the virality of zero-touch automated data ingestion, but was limited to post-revenue founders ($$$ only), excluding the 95% of builders who are pre-revenue.

## Decision
1. **Dual-Grove Zero-Touch Ingestion:**
   - **Emerald Grove (Pre-Revenue / GitHub):** Automatically populated by public commit activity and repository pushes with 0-auth instant preview on landing page.
   - **Golden Grove (Post-Revenue / Stripe & Polar):** Sprouted via universal webhooks for paying customers.
2. **3D Timeline Scrubber:**
   - Event-sourced historical state replay with a 10-second automated time-lapse playback mode for video export on X/Twitter.
3. **Dual-Format Dynamic README Badges:**
   - Server-rendered dynamic SVG endpoint (`/api/badge/[username]`) offering both a rich 600x200px porcelain diorama card and a compact pill badge for GitHub profiles.
4. **Visitor Social Interaction:**
   - Public diorama pages (`/@username`) support 1-click water cheers (+5 XP/ship) and a low-poly campsite bulletin board for 1-line encouraging founder notes.
5. **Freemium Strategy:**
   - Core auto-sync, public diorama, and README badges are 100% free forever to maximize viral distribution; Pro tier monetizes custom 3D biomes, 1080p MP4 exports, and custom domains.

## Consequences
- Zero manual daily logging required from developers.
- Built-in viral marketing loop embedded directly in GitHub READMEs and Twitter/X timelines.

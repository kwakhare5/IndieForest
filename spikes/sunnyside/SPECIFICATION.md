# SPIKE SPECIFICATION — Sunnyside World 2D Farmstead
> **Status:** TEMPORARY EXPERIMENT / SPIKE  
> **Location:** `spikes/sunnyside/`  
> **Isolation Guarantee:** Zero modifications to existing 3D diorama or core product files. Can be wiped cleanly at any time.

---

## 1. The Core Metaphor (3 Elements Only)

Everything in this world is simplified down to 3 intuitive elements:

```
┌─────────────────────────────────────────────────────────────┐
│                    THE FOUNDER'S FARMSTEAD                  │
│                                                             │
│   [ 1. MY CROPS ]         [ 2. MY CABIN ]   [ 3. MY TREE ]  │
│   (GitHub Code)           (My Streak)       (My Revenue)    │
│                                                             │
│   Sprout -> Harvest       Fire lit / Camp   Sapling -> Gold │
│   Watered by commits      Dries if inactive Bears fruit     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Breakthrough: Clean Map Extraction (Zero Marketing Poster Artifacts)

### Problem Solved
The file `Sunnyside_World_ExampleScene.png` (4434×2470 px) is Daniel Diggle's marketing showcase poster with pre-drawn static characters, pre-grown carrots, and marketing text permanently baked into the pixels. Using it would have created visual slop.

### The Real Source of Truth
We extracted and decoded the true layered source from `Room1.yy` and `spr_tileset_sunnysideworld_16px.png`:
* **Dimensions:** 86 tiles wide × 48 tiles high = **1376 × 768 native pixels**.
* **12 Clean Layers:**
  1. `sea` (Depth 1600): Pure water base grid.
  2. `clouds_02` (Depth 1400): Sub-surface water reflections.
  3. `land` (Depth 1300): Green grass island terrain (2,985 active tiles).
  4. `paths` (Depth 1200): Autotiled dirt roads.
  5. `shadows` (Depth 1100): Building and tree drop shadows.
  6. `decoration_01` (Depth 1000): Ground flowers and details.
  7. `forest` (Depth 800): Natural perimeter foliage.
  8. `building` (Depth 700): Clean timber houses, forge, and barn (empty of characters).
  9. `walls` (Depth 600): Stone walls and wooden fences.
  10. `decoration_02` (Depth 500): Chimneys, roof trims.
  11. `cloud_shadow` (Depth 100): Overhead cloud shadows.
  12. `clouds_01` (Depth 0): Drifting sky clouds.

* **Result:** A 100% pristine world canvas with **zero ghost characters, zero fake carrots, and zero marketing text**.

---

## 3. Element & Asset Mapping

### Element 1: My Crops (GitHub Repositories & Commits)
* **Visual Representation:** Garden beds in the farm plot (`x: 168, y: 120`).
* **Asset Location:** `Elements/Crops/`
* **Progression Tiers:**
  * **Tier 1 (Sprout / 1–5 commits):** Seedling in moist soil (`carrot_00.png` / `carrot_01.png`).
  * **Tier 2 (Small / 6–20 commits):** Leafy green shoot (`carrot_02.png` / `carrot_03.png`).
  * **Tier 3 (Tall / 21–50 commits):** Mature vegetable ready for harvest (`carrot_04.png`).
  * **Tier 4 (Mighty / 50+ commits):** Harvest packed into a wooden shipping crate (`crate_base.png` + `carrot_05.png`).
* **Active Status:**
  * **Committed Today:** Soil is dark, rich, and watered (`soil_01.png`).
  * **Inactive Today:** Soil is pale and dry (`soil_00.png`).
* **Hover Hitbox:** Hovering over a crop bed displays an anchored pixel badge with repo name, commit count, and active streak.

---

### Element 2: My Fruit Tree (Stripe / Customer Revenue)
* **Visual Representation:** A broadleaf orchard tree beside the cabin (`x: 568, y: 287`).
* **Asset Location:** `Elements/Plants/spr_deco_tree_01_strip4.png`
* **Progression Tiers:**
  * **$0 MRR (Pre-Revenue):** Young green sapling.
  * **$1 – $500 MRR:** Leafy broadleaf tree with green apples.
  * **$500+ MRR (Healthy MRR):** Golden tree bearing golden fruit with subtle glint particles (`VFX/Glint/`).

---

### Element 3: My Cabin & Campfire (Focus & Consistency Streak)
* **Visual Representation:** Timber cabin with a stone campfire pit in the center (`x: 481, y: 283`).
* **Asset Location:** `Elements/VFX/Fire/spr_deco_fire_02.png` (4-frame flame animation loop).
* **Progression States:**
  * **Streak Active:** Campfire burning with gentle smoke from the cabin chimney.
  * **Focus Timer Running:** Roaring animated flame with crackling embers and ambient audio.
  * **Drought (Streak Lost):** Cold stone pit with unlit embers and dry surroundings.

---

## 4. Technical Engine Guardrails

1. **Retina & Pixel-Crisp Display:**
   * Enforce `ctx.imageSmoothingEnabled = false` across all canvas render calls.
   * Integer scale factors: default 2× (2752×1536 viewport) or 3× for razor-sharp 16×16 pixel art.
2. **Animation Loop:**
   * 60 FPS `requestAnimationFrame` loop driving sprite frame tickers:
     * Campfire flame: 4 frames at 8 FPS.
     * Chimney smoke: looping puff cycle.
3. **Camera Physics:**
   * Mouse drag to pan; mouse wheel to zoom (clamped between 1× and 4×).
   * Touch drag (1 finger) to pan; touch pinch (2 fingers) to zoom on mobile.
4. **Performance Optimization:**
   * Static layers (sea, land, paths, buildings) are baked once into an offscreen canvas buffer.
   * Only dynamic elements (crops, fire, smoke, hover badges) are redrawn each frame.

---

## 5. Clean Deletion Procedure

If we decide to scrap this experiment and keep the 3D diorama:
```powershell
Remove-Item -Recurse -Force "spikes/sunnyside", "src/app/sunnyside-spike", "public/Sunnyside"
```
Zero residue left in the codebase.

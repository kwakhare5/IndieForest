export const REFINED_COLS = 32;
export const REFINED_ROWS = 22;
export const TILE_SIZE = 16;

export const REFINED_PIXEL_WIDTH = REFINED_COLS * TILE_SIZE;  // 512 px
export const REFINED_PIXEL_HEIGHT = REFINED_ROWS * TILE_SIZE; // 352 px

// River inlet bounds: Cols 0 to 18, Rows 16 to 21
export const RIVER_COLS_MAX = 18;
export const RIVER_ROW_START = 16;

export interface TerrainClutter {
  type: "daisy" | "pebble" | "stump";
  tileId: number;
  x: number; // Sub-tile native pixel x
  y: number; // Sub-tile native pixel y
}

// Handcrafted organic clutter with verified Sunnyside tile IDs (placed naturally outside farm plots):
export const TERRAIN_CLUTTER: TerrainClutter[] = [
  // White Daisies (Tile 223)
  { type: "daisy", tileId: 223, x: 28,  y: 52 },
  { type: "daisy", tileId: 223, x: 230, y: 72 },
  { type: "daisy", tileId: 223, x: 418, y: 104 },
  { type: "daisy", tileId: 223, x: 334, y: 218 },
  { type: "daisy", tileId: 223, x: 468, y: 232 },
  { type: "daisy", tileId: 223, x: 132, y: 108 },
  { type: "daisy", tileId: 223, x: 370, y: 74 },
  { type: "daisy", tileId: 223, x: 194, y: 228 },

  // Smooth Grey River Pebbles (Tile 287)
  { type: "pebble", tileId: 287, x: 98,  y: 72 }, // Beside house
  { type: "pebble", tileId: 287, x: 368, y: 114 },
  { type: "pebble", tileId: 287, x: 436, y: 212 },
  { type: "pebble", tileId: 287, x: 226, y: 230 },
  { type: "pebble", tileId: 287, x: 320, y: 60 },

  // Weathered Tree Stumps (Tile 351) - Placed naturally, NONE on the farm crops!
  { type: "stump", tileId: 351, x: 196, y: 112 }, // Right of house
  { type: "stump", tileId: 351, x: 390, y: 68 },
];

export interface HouseTile {
  r: number;
  c: number;
  id: number;
}

// Canonical Sunnyside Builder's Workshop Cabin (Cols 7 to 11, Rows 4 to 8)
// Connecting directly to yard clearing at Row 8
export const HOUSE_TILES: HouseTile[] = [
  // Row 4: Roof Peak & Ridge
  { r: 4, c: 7, id: 1616 }, { r: 4, c: 8, id: 1616 }, { r: 4, c: 9, id: 1616 }, { r: 4, c: 10, id: 1616 }, { r: 4, c: 11, id: 1617 },
  // Row 5: Roof Shingles & Chimney
  { r: 5, c: 7, id: 1681 }, { r: 5, c: 8, id: 1682 }, { r: 5, c: 9, id: 1682 }, { r: 5, c: 10, id: 1682 }, { r: 5, c: 11, id: 1681 },
  // Row 6: Roof Lower Slope
  { r: 6, c: 7, id: 1807 }, { r: 6, c: 8, id: 1808 }, { r: 6, c: 9, id: 1808 }, { r: 6, c: 10, id: 1808 }, { r: 6, c: 11, id: 1809 },
  // Row 7: Timber Wall & Windows
  { r: 7, c: 7, id: 1871 }, { r: 7, c: 8, id: 2000 }, { r: 7, c: 9, id: 1936 }, { r: 7, c: 10, id: 2000 }, { r: 7, c: 11, id: 1873 },
  // Row 8: Base & Timber Door (meets dirt clearing directly!)
  { r: 8, c: 7, id: 1377 }, { r: 8, c: 8, id: 1377 }, { r: 8, c: 9, id: 1764 }, { r: 8, c: 10, id: 1377 }, { r: 8, c: 11, id: 1377 },
];

export interface TreePos {
  x: number;
  y: number;
}

// Oak Trees (spr_deco_tree_01_strip4: 32x34 px canonical standalone sprite)
export const OAK_TREES: TreePos[] = [
  { x: 18 * 16, y: 1 * 16 },
  { x: 27 * 16, y: 1 * 16 },
  { x: 29 * 16, y: 5 * 16 },
  { x: 2 * 16,  y: 1 * 16 },
  { x: 5 * 16 + 8, y: 2 * 16 }, // behind workshop left
];

// Pine Trees (spr_deco_tree_02_strip4: 28x43 px canonical standalone sprite)
export const PINE_TREES: TreePos[] = [
  { x: 22 * 16, y: 1 * 16 - 6 },
  { x: 25 * 16, y: 1 * 16 - 6 },
  { x: 28 * 16, y: 12 * 16 },
  { x: 14 * 16, y: 3 * 16 - 6 },
  { x: 11 * 16 + 4, y: 1 * 16 + 8 }, // behind workshop right
  { x: 8 * 16 + 4,  y: 1 * 16 },     // behind workshop center
];

// Berry Bushes with red fruit (Tile 158)
export const BERRY_BUSHES: TreePos[] = [
  { x: 20 * 16, y: 8 * 16 },
  { x: 27 * 16, y: 4 * 16 },
  { x: 21 * 16, y: 13 * 16 },
  { x: 6 * 16,  y: 6 * 16 },
];

export interface CropRowConfig {
  projectId: string;
  projectName: string;
  cropType: "carrot";
  row: number; // Grid row (8, 10, 12, 14)
  startCol: number; // Col 0
  endCol: number;   // Col 4 (5 plants per row)
}

export const FARM_CROP_ROWS: CropRowConfig[] = [
  { projectId: "p1", projectName: "IndieForest App", cropType: "carrot", row: 8,  startCol: 0, endCol: 4 },
  { projectId: "p2", projectName: "Docs Engine",    cropType: "carrot", row: 10, startCol: 0, endCol: 4 },
  { projectId: "p3", projectName: "CLI Tool",       cropType: "carrot", row: 12, startCol: 0, endCol: 4 },
  { projectId: "p4", projectName: "Auth Microservice", cropType: "carrot", row: 14, startCol: 0, endCol: 4 },
];

export interface InteractiveClickZone {
  id: string;
  type: "project" | "focus" | "revenue" | "guestbook" | "workshop";
  projectId?: string;
  bounds: { x: number; y: number; w: number; h: number };
  title: string;
  subtitle: string;
}

export const INTERACTIVE_ZONES: InteractiveClickZone[] = [
  // West Farm Rows (Individual Crop Beds)
  {
    id: "farm-p1",
    type: "project",
    projectId: "p1",
    bounds: { x: 0, y: 8 * 16 - 4, w: 5 * 16, h: 20 },
    title: "IndieForest App (Row 1)",
    subtitle: "Click to inspect commits & water crop",
  },
  {
    id: "farm-p2",
    type: "project",
    projectId: "p2",
    bounds: { x: 0, y: 10 * 16 - 4, w: 5 * 16, h: 20 },
    title: "Docs Engine (Row 2)",
    subtitle: "Click to inspect commits & water crop",
  },
  {
    id: "farm-p3",
    type: "project",
    projectId: "p3",
    bounds: { x: 0, y: 12 * 16 - 4, w: 5 * 16, h: 20 },
    title: "CLI Tool (Row 3)",
    subtitle: "Click to inspect commits & water crop",
  },
  {
    id: "farm-p4",
    type: "project",
    projectId: "p4",
    bounds: { x: 0, y: 14 * 16 - 4, w: 5 * 16, h: 20 },
    title: "Auth Microservice (Row 4)",
    subtitle: "Click to inspect commits & water crop",
  },
  // North Workshop Cabin
  {
    id: "workshop-hq",
    type: "workshop",
    bounds: { x: 7 * 16, y: 4 * 16, w: 5 * 16, h: 5 * 16 },
    title: "Builder's Workshop & HQ",
    subtitle: "Basecamp, repo status & system metrics",
  },
  // East Campsite Fire
  {
    id: "campsite-focus",
    type: "focus",
    bounds: { x: 22 * 16, y: 6 * 16, w: 5 * 16, h: 4 * 16 },
    title: "Campsite Focus Timer",
    subtitle: "25-minute Pomodoro coding session",
  },
  // East Money Orchard (Revenue Tree)
  {
    id: "money-orchard",
    type: "revenue",
    bounds: { x: 25 * 16, y: 1 * 16, w: 5 * 16, h: 5 * 16 },
    title: "Money Orchard",
    subtitle: "Stripe MRR & active customer metrics",
  },
  // South Fishing Pier & Coastal Fisher
  {
    id: "coastal-pier",
    type: "guestbook",
    bounds: { x: 9 * 16, y: 16 * 16, w: 3 * 16, h: 4 * 16 },
    title: "Coastal Pier & Guestbook",
    subtitle: "Indie hacker visitor logs & guestbook messages",
  },
];

export interface BaseTerrainLayers {
  ground: number[];      // Base checkerboard grass (65, 66)
  paths: number[];       // Dirt paths & yard clearing (2181..2311)
  riverCliff: number[];  // Earthen cliff bank overlooking river (468, 2245)
  pier: number[];        // Wooden fishing pier deck & posts (358, 290)
  water: number[];       // River caustics water base tile (1163)
  fence: number[];       // Farm fence rails & boundary posts (103, 167)
  structures: number[];  // Cabin tiles, storage crates, forge
}

export function generateRefinedWorld(): BaseTerrainLayers {
  const total = REFINED_COLS * REFINED_ROWS;
  const ground = new Array(total).fill(0); // 0 = empty/transparent so water shows cleanly!
  const paths = new Array(total).fill(0);
  const riverCliff = new Array(total).fill(0);
  const pier = new Array(total).fill(0);
  const water = new Array(total).fill(0);
  const fence = new Array(total).fill(0);
  const structures = new Array(total).fill(0);

  // 1. Base Subtle Checkerboard Grass (Tiles 65 & 66)
  // Transparent (0) for south-west river water area (r >= 16 && c <= RIVER_COLS_MAX)
  for (let r = 0; r < REFINED_ROWS; r++) {
    for (let c = 0; c < REFINED_COLS; c++) {
      if (r >= 16 && c <= RIVER_COLS_MAX) continue; // Pure river water area
      ground[r * REFINED_COLS + c] = (r + c) % 2 === 1 ? 66 : 65;
    }
  }

  // 2. Dirt Road & Village Clearing (Autotile set: 2181..2311)
  // Horizontal main road (Cols 12 to 31, Rows 10 to 11)
  for (let c = 12; c < REFINED_COLS; c++) {
    paths[10 * REFINED_COLS + c] = 2182; // Top edge with grass teeth
    paths[11 * REFINED_COLS + c] = 2310; // Bottom edge with grass teeth
  }

  // West yard clearing (Cols 6 to 12, Rows 8 to 12)
  paths[8 * REFINED_COLS + 6] = 2181; // Top-left corner
  for (let c = 7; c <= 11; c++) paths[8 * REFINED_COLS + c] = 2182;
  paths[8 * REFINED_COLS + 12] = 2183; // Top-right corner

  // Row 9 (Upper yard interior)
  paths[9 * REFINED_COLS + 6] = 2245; // Left edge
  for (let c = 7; c <= 11; c++) paths[9 * REFINED_COLS + c] = 2246; // Center dirt
  paths[9 * REFINED_COLS + 12] = 2247; // Right edge

  // Rows 10 & 11 (Yard joins horizontal road)
  for (let r = 10; r <= 11; r++) {
    paths[r * REFINED_COLS + 6] = 2245; // Left edge
    for (let c = 7; c <= 12; c++) paths[r * REFINED_COLS + c] = 2246; // Center dirt
  }

  // Row 12 (Bottom of yard)
  paths[12 * REFINED_COLS + 6] = 2309; // Bottom-left corner
  for (let c = 7; c <= 8; c++) paths[12 * REFINED_COLS + c] = 2310;
  paths[12 * REFINED_COLS + 9] = 2246; // South path
  paths[12 * REFINED_COLS + 10] = 2246; // South path
  paths[12 * REFINED_COLS + 11] = 2310;
  paths[12 * REFINED_COLS + 12] = 2311; // Bottom-right corner

  // Path leading south to fishing pier (Cols 9 to 10, Rows 13 to 15)
  for (let r = 13; r <= 15; r++) {
    paths[r * REFINED_COLS + 9] = 2245;  // Left edge
    paths[r * REFINED_COLS + 10] = 2247; // Right edge
  }

  // 3. South-West River Inlet (Cols 0 to 18, Rows 16 to 21)
  for (let r = 16; r < REFINED_ROWS; r++) {
    for (let c = 0; c <= RIVER_COLS_MAX; c++) {
      water[r * REFINED_COLS + c] = 1163;
    }
  }

  // Earthen river cliff bank (Row 16)
  for (let c = 0; c <= RIVER_COLS_MAX; c++) {
    if (c >= 9 && c <= 10) continue; // Pier attachment
    riverCliff[16 * REFINED_COLS + c] = 468;
  }

  // Right cliff wall of the inlet (Col 19, Rows 16 to 21)
  for (let r = 16; r < REFINED_ROWS; r++) {
    riverCliff[r * REFINED_COLS + 19] = 2245;
  }

  // 4. Wooden Fishing Pier (Cols 9-10, Rows 16 to 19)
  for (let r = 16; r <= 18; r++) {
    pier[r * REFINED_COLS + 9] = 358;  // Wooden plank deck
    pier[r * REFINED_COLS + 10] = 358;
  }
  pier[19 * REFINED_COLS + 9] = 290;  // Wooden pilings in water with splash
  pier[19 * REFINED_COLS + 10] = 290;

  // 5. Farm Boundaries & Fences:
  // North fence rail: Tile 103 (Cols 0 to 4, Row 7)
  for (let c = 0; c <= 4; c++) fence[7 * REFINED_COLS + c] = 103;
  // South fence rail: Tile 103 (Cols 0 to 4, Row 15)
  for (let c = 0; c <= 4; c++) fence[15 * REFINED_COLS + c] = 103;
  // East boundary fence posts: Tile 167 (Col 5, Rows 8..10 and 13..14)
  fence[8 * REFINED_COLS + 5] = 167;
  fence[9 * REFINED_COLS + 5] = 167;
  fence[10 * REFINED_COLS + 5] = 167;
  fence[13 * REFINED_COLS + 5] = 167;
  fence[14 * REFINED_COLS + 5] = 167;

  // Farm harvest crates (Tile 880) at east farm entrance (Col 5, Rows 11 & 12)
  structures[11 * REFINED_COLS + 5] = 880;
  structures[12 * REFINED_COLS + 5] = 880;

  // 6. Workshop Timber Cabin (Cols 7 to 11, Rows 4 to 8)
  for (const h of HOUSE_TILES) {
    structures[h.r * REFINED_COLS + h.c] = h.id;
  }
  // Chimney on roof (Tile 349)
  structures[5 * REFINED_COLS + 8] = 349;

  // Blacksmith forge & water trough beside workshop
  structures[7 * REFINED_COLS + 12] = 2230;
  structures[8 * REFINED_COLS + 12] = 880;
  structures[8 * REFINED_COLS + 13] = 880;

  return { ground, paths, riverCliff, pier, water, fence, structures };
}



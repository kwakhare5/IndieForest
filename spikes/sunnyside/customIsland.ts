export const ISLAND_COLS = 24;
export const ISLAND_ROWS = 18;
export const TILE_SIZE = 16;

export const ISLAND_PIXEL_WIDTH = ISLAND_COLS * TILE_SIZE; // 384 px
export const ISLAND_PIXEL_HEIGHT = ISLAND_ROWS * TILE_SIZE; // 288 px

// 1. Cabin Anchor (3x4 tiles at Col 10-12, Row 3-6)
export const CABIN_ANCHOR = { col: 10, row: 3, x: 10 * 16, y: 3 * 16 };

// 2. Campfire Anchor (Col 11, Row 10)
export const CAMPFIRE_ANCHOR = { col: 11, row: 10, x: 11 * 16 + 8, y: 10 * 16 + 8 };

// 3. Revenue Tree Anchor (Col 16, Row 6)
export const REVENUE_TREE_ANCHOR = { col: 16, row: 6, x: 16 * 16 + 8, y: 6 * 16 + 8 };

// 4. Farm Plot: 6 dedicated crop beds (West wing, Col 5-7, Row 6-12)
export const CROP_BEDS = [
  { id: "bed_0", col: 5, row: 6,  x: 5 * 16 + 8, y: 6 * 16 + 8 },
  { id: "bed_1", col: 7, row: 6,  x: 7 * 16 + 8, y: 6 * 16 + 8 },
  { id: "bed_2", col: 5, row: 9,  x: 5 * 16 + 8, y: 9 * 16 + 8 },
  { id: "bed_3", col: 7, row: 9,  x: 7 * 16 + 8, y: 9 * 16 + 8 },
  { id: "bed_4", col: 5, row: 12, x: 5 * 16 + 8, y: 12 * 16 + 8 },
  { id: "bed_5", col: 7, row: 12, x: 7 * 16 + 8, y: 12 * 16 + 8 },
];

export interface IslandLayer {
  name: string;
  tiles: number[]; // Flat array of tile indices (ISLAND_COLS * ISLAND_ROWS)
}

export function generateCustomIsland(): IslandLayer[] {
  const total = ISLAND_COLS * ISLAND_ROWS;
  const ground = new Array(total).fill(1291); // Ocean water base
  const paths = new Array(total).fill(0);
  const buildings = new Array(total).fill(0);
  const fences = new Array(total).fill(0);

  // --- Layer 1: Ground (Ocean + Island Slab from Col 3 to 20, Row 2 to 15) ---
  for (let r = 2; r <= 15; r++) {
    for (let c = 3; c <= 20; c++) {
      const isTop = r === 2;
      const isBottom = r === 15;
      const isLeft = c === 3;
      const isRight = c === 20;

      let t = 193; // Center grass
      if (isTop && isLeft) t = 200;       // Shoreline Top-Left
      else if (isTop && isRight) t = 260;  // Shoreline Top-Right
      else if (isBottom && isLeft) t = 262;// Shoreline Bottom-Left
      else if (isBottom && isRight) t = 263;// Shoreline Bottom-Right
      else if (isTop) t = 196;            // Shoreline Top
      else if (isBottom) t = 261;         // Shoreline Bottom
      else if (isLeft) t = 194;           // Shoreline Left
      else if (isRight) t = 195;          // Shoreline Right
      else {
        // Natural checker grass pattern
        t = (c + r) % 2 === 0 ? 193 : 194;
      }
      ground[r * ISLAND_COLS + c] = t;
    }
  }

  // --- Layer 2: Paths (Dirt trails connecting Cabin -> Campfire -> Farm) ---
  // Vertical trail from cabin door (Col 11, Row 7) down to Campfire (Row 10)
  for (let r = 7; r <= 10; r++) {
    paths[r * ISLAND_COLS + 11] = 485; // Vertical dirt road
  }
  // Horizontal path from Campfire (Col 11) left to Farm Plot (Col 8)
  for (let c = 8; c <= 11; c++) {
    paths[9 * ISLAND_COLS + c] = 549; // Horizontal dirt road
  }
  // Soft path toward Revenue Tree (Col 12 to 15, Row 7)
  for (let c = 12; c <= 15; c++) {
    paths[7 * ISLAND_COLS + c] = 549;
  }

  // --- Layer 3: The Founder Cabin (3x4 tiles at Col 10-12, Row 3-6) ---
  // Row 3: Roof Gable
  buildings[3 * ISLAND_COLS + 10] = 672;
  buildings[3 * ISLAND_COLS + 11] = 673;
  buildings[3 * ISLAND_COLS + 12] = 674;
  // Row 4: Roof Eaves
  buildings[4 * ISLAND_COLS + 10] = 800;
  buildings[4 * ISLAND_COLS + 11] = 801;
  buildings[4 * ISLAND_COLS + 12] = 802;
  // Row 5: Upper Wall
  buildings[5 * ISLAND_COLS + 10] = 864;
  buildings[5 * ISLAND_COLS + 11] = 865;
  buildings[5 * ISLAND_COLS + 12] = 866;
  // Row 6: Lower Wall with Front Door
  buildings[6 * ISLAND_COLS + 10] = 924;
  buildings[6 * ISLAND_COLS + 11] = 985; // Timber front door
  buildings[6 * ISLAND_COLS + 12] = 924;

  // --- Layer 4: Wooden Fences enclosing the Farm Plot (Col 4 to 8, Row 5 to 14) ---
  // Top fence: Col 4 to 8, Row 5
  fences[5 * ISLAND_COLS + 4] = 2283;
  fences[5 * ISLAND_COLS + 5] = 2284;
  fences[5 * ISLAND_COLS + 6] = 2284;
  fences[5 * ISLAND_COLS + 7] = 2284;
  fences[5 * ISLAND_COLS + 8] = 2285;

  // Bottom fence: Col 4 to 8, Row 14
  fences[14 * ISLAND_COLS + 4] = 2283;
  fences[14 * ISLAND_COLS + 5] = 2284;
  fences[14 * ISLAND_COLS + 6] = 2284;
  fences[14 * ISLAND_COLS + 7] = 2284;
  fences[14 * ISLAND_COLS + 8] = 2285;

  // Left vertical posts: Col 4, Row 6 to 13
  for (let r = 6; r <= 13; r++) {
    fences[r * ISLAND_COLS + 4] = 2222;
  }
  // Right vertical posts: Col 8, Row 6, 7, 8, 10, 11, 12, 13 (leave Row 9 open for the path entrance!)
  for (let r = 6; r <= 13; r++) {
    if (r === 9) continue; // Gate opening
    fences[r * ISLAND_COLS + 8] = 2222;
  }

  // Stone campfire ring base
  buildings[10 * ISLAND_COLS + 11] = 240; // Campfire stone ring
  // Wooden stump seats on left and right
  buildings[10 * ISLAND_COLS + 10] = 650; // Left stump
  buildings[10 * ISLAND_COLS + 12] = 650; // Right stump

  return [
    { name: "ground", tiles: ground },
    { name: "paths", tiles: paths },
    { name: "buildings", tiles: buildings },
    { name: "fences", tiles: fences },
  ];
}

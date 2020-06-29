// Defines the dimensions of the grid.
export const NUM_ROWS = 18;
export const NUM_COLS = 15;

/**
 * Represents a coordinate pair.
 */
export interface Coords {
  x: number;
  y: number;
}

/**
 * Convert a coordinate pair to an index.
 * This function is the inverse of indexToCoords.
 */
export const coordsToIndex = ({ x, y }: Coords): number => y * NUM_COLS + x;

/**
 * Convert an index to a coordinate pair.
 * This function is the inverse of coordsToIndex.
 */
export const indexToCoords = (index: number): Coords => ({
  x: index % NUM_COLS,
  y: Math.floor(index / NUM_COLS),
});

/**
 * Represents the bounds of a rectangular region.
 * topLeft is inside the bounds and bottomRight is outside the bounds.
 */
interface Bounds {
  topLeft: Coords;
  bottomRight: Coords;
}

/**
 * Defines the bounds of the grid.
 */
const GRID_BOUNDS = {
  topLeft: { x: 0, y: 0 },
  bottomRight: { x: NUM_COLS, y: NUM_ROWS },
};

/**
 * Check if a coordinate pair is inside some bounds.
 */
const inBounds = (
  { x, y }: Coords,
  { topLeft, bottomRight }: Bounds
): boolean =>
  x >= topLeft.x && x < bottomRight.x && y >= topLeft.y && y < bottomRight.y;

// Defines the offset and dimensions of the home regions.
const HOME_OFFSET = 2;
const HOME_WIDTH = 3;
const HOME_HEIGHT = 4;

/**
 * Check if an index is inside the red home region.
 */
export const isRedHome = (index: number): boolean =>
  inBounds(indexToCoords(index), {
    topLeft: { x: HOME_OFFSET, y: HOME_OFFSET },
    bottomRight: {
      x: HOME_OFFSET + HOME_WIDTH,
      y: HOME_OFFSET + HOME_HEIGHT,
    },
  });

/**
 * Check if an index is inside the blue home region.
 */
export const isBlueHome = (index: number): boolean =>
  inBounds(indexToCoords(index), {
    topLeft: {
      x: NUM_COLS - HOME_OFFSET - HOME_WIDTH,
      y: NUM_ROWS - HOME_OFFSET - HOME_HEIGHT,
    },
    bottomRight: {
      x: NUM_COLS - HOME_OFFSET,
      y: NUM_ROWS - HOME_OFFSET,
    },
  });

// Defines the offset and dimensions of the spawn regions.
// Each spawn surrounds a home, but does not include it.
const SPAWN_OFFSET = HOME_OFFSET - 1;
const SPAWN_WIDTH = HOME_WIDTH + 2;
const SPAWN_HEIGHT = HOME_HEIGHT + 2;

/**
 * Check if an index is inside the red spawn region.
 */
export const isRedSpawn = (index: number): boolean =>
  inBounds(indexToCoords(index), {
    topLeft: { x: SPAWN_OFFSET, y: SPAWN_OFFSET },
    bottomRight: {
      x: SPAWN_OFFSET + SPAWN_WIDTH,
      y: SPAWN_OFFSET + SPAWN_HEIGHT,
    },
  }) && !isRedHome(index);

/**
 * Check if an index is inside the blue spawn region.
 */
export const isBlueSpawn = (index: number): boolean =>
  inBounds(indexToCoords(index), {
    topLeft: {
      x: NUM_COLS - SPAWN_OFFSET - SPAWN_WIDTH,
      y: NUM_ROWS - SPAWN_OFFSET - SPAWN_HEIGHT,
    },
    bottomRight: {
      x: NUM_COLS - SPAWN_OFFSET,
      y: NUM_ROWS - SPAWN_OFFSET,
    },
  }) && !isBlueHome(index);

// Defines the center offset of the home regions.
const HOME_CENTER_OFFSET = 3;

/**
 * Defines the center of the red home region.
 */
export const RED_HOME_CENTER = coordsToIndex({
  x: HOME_CENTER_OFFSET,
  y: HOME_CENTER_OFFSET,
});

/**
 * Defines the center of the blue home region.
 */
export const BLUE_HOME_CENTER = coordsToIndex({
  x: NUM_COLS - HOME_CENTER_OFFSET - 1,
  y: NUM_ROWS - HOME_CENTER_OFFSET - 1,
});

/**
 * Apply coordinate offsets to an index.
 * Results outside of the grid are discarded.
 */
const withOffsets = (
  index: number,
  offsets: Array<[number, number]>
): Set<number> => {
  const before = indexToCoords(index);
  const indices = new Set<number>();
  for (const [dx, dy] of offsets) {
    const after = { x: before.x + dx, y: before.y + dy };
    if (inBounds(after, GRID_BOUNDS)) {
      indices.add(coordsToIndex(after));
    }
  }
  return indices;
};

/**
 * Find indices orthogonally adjacent to an index.
 */
export const orthogonallyAdjacentTo = (index: number): Set<number> =>
  withOffsets(index, [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ]);

/**
 * Find indices diagonally adjacent to an index.
 */
export const diagonallyAdjacentTo = (index: number): Set<number> =>
  withOffsets(index, [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]);

/**
 * Find indices adjacent to an index.
 */
export const adjacentTo = (index: number): Set<number> =>
  new Set([...orthogonallyAdjacentTo(index), ...diagonallyAdjacentTo(index)]);

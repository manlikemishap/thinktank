import {
  NUM_COLS,
  NUM_ROWS,
  coordsToIndex,
  isBlueSpawn,
  isRedSpawn,
} from "./grid";
import { Piece, Player, Token } from ".";

export const canPlace = (
  pieces: Array<Piece>,
  player: Player,
  token: Token,
  index: number
): boolean => {
  if (pieces[index]) {
    // Cannot place a piece on top of another piece.
    return false;
  } else if (player === Player.Red && !isRedSpawn(index)) {
    // Red cannot place a piece outside of red spawn.
    return false;
  } else if (player === Player.Blue && !isBlueSpawn(index)) {
    // Blue cannot place a piece outside of blue spawn.
    return false;
  } else {
    return true;
  }
};

export const validPlacements = (
  pieces: Array<Piece>,
  player: Player,
  token: Token
): Set<number> => {
  let placements = new Set<number>();
  for (let y = 0; y < NUM_ROWS; y++) {
    for (let x = 0; x < NUM_COLS; x++) {
      const index = coordsToIndex({ x, y });
      if (canPlace(pieces, player, token, index)) {
        placements.add(index);
      }
    }
  }
  return placements;
};
import { state } from "../_state.ts";
/**
 * Format the position for the command
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @param offsetX - Offset X coordinate
 * @param offsetY - Offset Y coordinate
 * @param offsetZ - Offset Z coordinate
 * @returns Absolute or relative position
 */
export const formatPosition = (
  x: number,
  y: number,
  z: number,
  offsetX?: number,
  offsetY?: number,
  offsetZ?: number,
) => {
  const { offset, useAbsolutePosition } = state;
  let [ox, oy, oz] = offset || [0, 0, 0];

  if (offsetX) {
    ox += offsetX;
  }

  if (offsetY) {
    oy += offsetY;
  }

  if (offsetZ) {
    oz += offsetZ;
  }

  const [nx, ny, nz] = [x - ox, y - oy, z - oz];

  return useAbsolutePosition ? `${nx} ${ny} ${nz}` : `~${nx} ~${ny} ~${nz}`;
};

import type { PackSizes } from "/typings/types.ts";
import { MAX_PACK_SIZE, MIN_PACK_SIZE } from "/typings/constants.ts";

const PACK_SIZES: number[] = ((itr: number) => {
  const sizes: number[] = [itr];
  while (itr <= MAX_PACK_SIZE) {
    sizes.push(
      itr **= 2,
    );
  }

  return sizes;
})(Math.round(MIN_PACK_SIZE));

export function isPackSize(value: number): value is PackSizes {
  return PACK_SIZES.includes(value);
}

export function getNearestPackSize(value: number): PackSizes {
  value = Math.min(
    MAX_PACK_SIZE,
    Math.max(MIN_PACK_SIZE, value),
  );

  if (isPackSize(value)) {
    return value;
  }

  // Validate size. A valid size will have no remainder
  if (value % MIN_PACK_SIZE) {
    value = PACK_SIZES.reduce((carry, currentValue) =>
      Math.abs(currentValue - value) < Math.abs(carry - currentValue)
        ? currentValue
        : carry
    );
  }

  return getNearestPackSize(value);
}

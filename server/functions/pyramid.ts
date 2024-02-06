import type { WssParams } from "../../types/index.ts";
export default function pyramid(
  { parameters, queueCommandRequest, formatPosition }: WssParams,
) {
  // Construct a pyramid based on parameters
  const length = Math.max(
    1,
    Math.min(120, parseInt(parameters.get("length") ?? "0", 10)),
  );
  const borderSize = Math.max(
    1,
    Math.min(120, parseInt(parameters.get("b") ?? "0", 10)),
  );
  const blockName = parameters.get("block") ?? "gold_block";
  const positions: number[][] = [];

  // FIXME: Pyramid prints upside down

  // Increment until pyramid matches length parameter
  for (let y = 1; y < length; y++) {
    for (let x = -y; x <= y; x++) {
      for (let z = -y; z <= y; z++) {
        // Create hollow pyramyd
        const distance = Math.sqrt(x * x + z * z);
        if (distance > y - borderSize && distance < y + borderSize) {
          positions.push([x, Math.abs(y - length), z]);
        }
      }
    }
  }

  for (const position of positions) {
    console.log("Plotting %s at %o", blockName, position);

    queueCommandRequest(
      `setblock ${
        formatPosition(position[0], position[1], position[2])
      } ${blockName}`,
    );
  }
}

import type { WssParams } from "../../types/index.ts";
export default function sphere(
  { parameters, queueCommandRequest, formatPosition }: WssParams,
) {
  const radius = Math.max(
    1,
    Math.min(120, parseInt(parameters.get("r") ?? "0", 10)),
  );

  const borderSize = Math.max(
    1,
    Math.min(120, parseInt(parameters.get("b") ?? "0", 10)),
  );

  const blockName = parameters.get("block") ?? "glass";

  const positions: number[][] = [];
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      for (let z = -radius; z <= radius; z++) {
        // Create hollow sphere
        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance > radius - borderSize && distance < radius + borderSize) {
          positions.push([x, y, z]);
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

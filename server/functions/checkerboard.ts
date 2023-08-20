import type { WssParams } from "../../types/index.ts";
export default function checkerboard(
  { parameters, queueCommandRequest, formatPosition }: WssParams,
) {
  const axis = parameters.get("axis") ?? "y";
  const [evenBlock, oddBlock] = (parameters.get("block") ?? "stone,cobblestone")
    .split(",");
  const [xOffset, zOffset] = (parameters.get("offset") ?? "0,0").split(",").map(
    (v) => parseInt(v, 10),
  );
  const [xStart, zStart] = (parameters.get("start") ?? "0,0").split(",").map((
    v,
  ) => parseInt(v, 10));
  const [xEnd, zEnd] = (parameters.get("end") ?? "0,0").split(",").map((v) =>
    parseInt(v, 10)
  );

  const positions: number[][] = [];
  for (let x = xStart; x <= xEnd; x++) {
    for (let z = zStart; z <= zEnd; z++) {
      positions.push([x, 0, z]);
    }
  }
  let itr = 0;
  for (const position of positions) {
    const block = itr % 2 === 0 ? evenBlock : oddBlock;
    let [x, y, z] = position;

    if (axis === "x") {
      [x, y, z] = [y, z, x];
    } else if (axis === "z") {
      [x, y, z] = [z, x, y];
    }

    // Reposition over axis

    console.log("Plotting %s at %o", block, position);

    queueCommandRequest(
      `setblock ${formatPosition(x, y, z, xOffset, 0, zOffset)} ${block}`,
    );

    itr++;
  }
}

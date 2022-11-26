export default function checkerboard(
  { parameters, queueCommandRequest, state }: {
    parameters: URLSearchParams;
    queueCommandRequest: (commandLine: string) => void;
    state: Record<string, any>;
  },
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

  const formatPosition = state.useAbsolutePosition
    ? (pos: number) => pos
    : (pos: number) => `~${pos}`;

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

    if (state.useAbsolutePosition) {
      x += xOffset ?? state.offset[0];
      y += state.offset[1];
      z += zOffset ?? state.offset[2];
    }

    if (axis === "x") {
      [x, y, z] = [y, z, x];
    } else if (axis === "z") {
      [x, y, z] = [z, x, y];
    }

    const alignedPosition = [x, y, z].map((p) => formatPosition(p)).join(" ");

    // Reposition over axis

    console.log("Plotting %s at %o", block, position);

    queueCommandRequest(
      `setblock ${alignedPosition} ${block}`,
    );

    itr++;
  }
}

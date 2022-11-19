function positionAbsolute(p: number) {
  return;
}

export default function circle({ parameters, queueCommandRequest, state }: {
  parameters: URLSearchParams;
  queueCommandRequest: (commandLine: string) => void;
  state: Record<string, any>;
}) {
  const radius = Math.max(
    1,
    Math.min(99, parseInt(parameters.get("r") ?? "0", 10)),
  );

  const borderSize = Math.max(
    1,
    Math.min(99, parseInt(parameters.get("b") ?? "0", 10)),
  );

  const blockName = parameters.get("block") ?? "stone";

  const positions: number[][] = [];
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      // Create hollow circle
      const distance = Math.sqrt(x * x + z * z);
      if (distance > radius - borderSize && distance < radius + borderSize) {
        positions.push([x, 0, z]);
      }
    }
  }
  for (const position of positions) {
    if (state.useAbsolutePosition) {
      position[0] += state.offset[0];
      position[1] += state.offset[1];
      position[2] += state.offset[2];
    }

    console.log("Plotting %s at %o", blockName, position);

    queueCommandRequest(
      `setblock ${
        position.map((p) => state.useAbsolutePosition ? p : `~${p}`)
          .join(" ")
      } ${blockName}`,
    );
  }
}

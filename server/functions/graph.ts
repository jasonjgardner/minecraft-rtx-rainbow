import type { WssParams } from "../../types/index.ts";
export default function graphingCalculator(
  { parameters, queueCommandRequest, formatPosition }: WssParams,
) {
  const chunks = Math.min(
    10,
    Math.max(parseInt(parameters.get("chunks") ?? "1", 10), 2),
  );

  const graphWidth = 16 * chunks;
  const graphHeight = 16 * chunks;

  const block = parameters.get("block") ?? "minecraft:stone";
  const fn = parameters.get("fn") ?? "cos";

  if (!(fn in Math)) {
    throw new Error(`Unknown function ${fn}`);
  }

  const mathFn = Math[
    fn as
      | "cos"
      | "sin"
      | "tan"
      | "acos"
      | "asin"
      | "atan"
      | "asinh"
      | "log"
      | "log10"
      | "log2"
      | "sqrt"
      | "cbrt"
      | "exp"
      | "sign"
      | "abs"
  ];

  for (let x = -graphWidth / 2; x < graphWidth / 2; x++) {
    const y = mathFn(x);
    queueCommandRequest(
      `setblock ${formatPosition(x, y, 0)} ${block}`,
    );
  }
}

import * as Bun from "bun";
import { join } from "node:path";

await Bun.build({
  entrypoints: [join(process.cwd(), "src/main.ts")],
  outdir: join(process.cwd(), "bedrock/BP/rainbow-addon/scripts"),
  external: ["@minecraft/server", "@minecraft/server-ui"],
  sourcemap: "external",
  minify: false,
  target: "node",
});

// Move .map into adjacent directory "debug"

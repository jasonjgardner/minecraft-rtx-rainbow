import * as Bun from "bun";
import { join } from "node:path";

await Bun.build({
  entrypoints: [join(process.cwd(), "src/main.ts")],
  outdir: join(process.cwd(), "addon/scripts"),
  external: ["@minecraft/server"],
  sourcemap: "external",
});

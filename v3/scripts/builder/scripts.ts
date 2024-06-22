import * as Bun from "bun";
import { join } from "node:path";

await Bun.build({
  entrypoints: [join(process.cwd(), "v3/addon/scripts/main.ts")],
  outdir: join(process.cwd(), "v3/bedrock/BP/scripts"),
});

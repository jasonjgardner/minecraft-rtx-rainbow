import { serve } from "http/server.ts";
import { join } from "path/mod.ts";
import { NAMESPACE } from "/src/store/_config.ts";
import { getConfig } from "/src/_utils.ts";
import createAddon, { languages } from "./mod.ts";

const mcaddon = await createAddon();
const filename = `${NAMESPACE}.mcaddon`;
const destination = Deno.args.includes("--save")
  ? `${getConfig("DEST", Deno.cwd())}`
  : null;

if (
  destination &&
  Deno.permissions.query({
    name: "write",
    path: destination,
  })
) {
  console.log("Saving .mcaddon locally");
  await Deno.writeFile(
    join(destination, filename),
    new Uint8Array(await mcaddon.arrayBuffer()),
  );

  Deno.exit();
}

console.log("Listening on http://localhost:8000");

serve(() =>
  new Response(mcaddon, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${filename}"`,
      "content-language": Object.keys(languages).map((langId) =>
        langId.replace("_", "-")
      ).join(", "),
      "content-length": `${mcaddon.size}`,
    },
  })
);

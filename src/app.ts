import type { PackSizes } from "/typings/types.ts";
import { serve } from "http/server.ts";
import { join } from "path/mod.ts";
import { NAMESPACE } from "/src/store/_config.ts";
import { getArg } from "/src/_utils.ts";
import createAddon, { languages } from "./mod.ts";

const destination = Deno.args.includes("--save")
  ? `${getArg("save", Deno.cwd())}`
  : null;

if (
  destination &&
  Deno.permissions.query({
    name: "write",
    path: destination,
  })
) {
  console.log("Saving .mcaddon locally");
  const packName = getArg("namespace", NAMESPACE);
  const filename = `${packName}.mcaddon`;

  const mcaddon = await createAddon({
    size: <PackSizes> parseInt(getArg("size", 64), 10),
  });
  await Deno.writeFile(
    join(destination, filename),
    new Uint8Array(await mcaddon.arrayBuffer()),
  );

  Deno.exit();
}

async function handleRequest(request: Request): Promise<Response> {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname.startsWith("/download")) {
    const filename = `${searchParams.get("namespace") ?? NAMESPACE}.mcaddon`;

    const mcaddon = await createAddon({
      size: <PackSizes> parseInt(searchParams.get("size") || "64", 10),
    });
    return new Response(mcaddon, {
      status: 200,
      headers: {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${filename}"`,
        "content-language": Object.keys(languages).map((langId) =>
          langId.replace("_", "-")
        ).join(", "),
        "content-length": `${mcaddon.size}`,
      },
    });
  }

  return new Response(
    `<html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
      <link rel="stylesheet" href="https://newcss.net/theme/night.css">
      </head>
      <body>
        <h1>RAINBOW!!</h1>
        <a href="/download">Download</a>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

console.log("Listening on http://localhost:8000");
serve(handleRequest);

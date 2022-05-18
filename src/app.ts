import { serve } from "http/server.ts";
import { sanitizeNamespace } from "/src/_utils.ts";
import { getFormPackSize } from "/src/components/_resize.ts";
import getPalette from "/src/components/palettes/fromImage.ts";
import getDefaultPalette from "/src/components/palettes/default.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import createAddon, { languages } from "./mod.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname, searchParams } = new URL(request.url);
  const isPost = request.method === "POST";

  const data: FormData | URLSearchParams = isPost
    ? await request.formData()
    : searchParams;

  try {
    if (data && pathname.startsWith("/download")) {
      const paletteSource = (data && isPost) ? data.get("paletteSource") : null;
      let ns = sanitizeNamespace(
        data.get("namespace") ?? paletteSource ?? DEFAULT_NAMESPACE,
      );

      if (ns.length < 1) {
        ns = DEFAULT_NAMESPACE;
      }

      const uuids: [string, string, string, string] = [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ];

      const mcaddon = await createAddon(uuids, {
        size: getFormPackSize(data),
        blockColors: await (paletteSource === null
          ? getDefaultPalette()
          : getPalette(paletteSource)),
        pixelArtSource: paletteSource,
        namespace: ns,
      });
      return new Response(mcaddon, {
        status: 200,
        headers: {
          "content-type": "application/zip",
          "content-disposition": `attachment; filename="${ns}.mcaddon"`,
          "content-language": Object.keys(languages).map((langId) =>
            langId.replace("_", "-")
          ).join(", "),
          "content-length": `${mcaddon.size}`,
        },
      });
    }
  } catch (err) {
    return new Response(
      `<html>
      <head>
      <meta charset="UTF-8">
      <title>OH CRAP</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
      </head>
      <body>
        <h1>RAINBOW!!</h1>
        <p>${err}</p>
      </body>
    </html>`,
      {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  }

  return new Response(
    `<html>
      <head>
      <meta charset="UTF-8">
      <title>RAINBOW!! Pack Generator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
      <link rel="stylesheet" href="https://newcss.net/theme/night.css">
      </head>
      <body>
        <h1>RAINBOW!!</h1>

        <form method="post" action="/download" enctype="multipart/form-data">
          <label for="paletteSource">Submit color palette source image</label>
          <input id="paletteSource" name="paletteSource" type="file" accept="image/*">

          <label for="namepsace">Pack Namespace</label>
          <input id="namespace" name="namespace" type="text" pattern="^[a-z]+[a-z0-9]*">

          <button type="submit">Upload Palette</button>
        </form>

        <a href="/download">Download</a>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

console.log("Listening on http://localhost:8000");
serve(handleRequest);

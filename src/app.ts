import { serve } from "http/server.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import { sanitizeNamespace } from "/src/_utils.ts";
import { getFormPackSize } from "/src/components/_resize.ts";
import getPalette from "/src/components/palettes/fromImage.ts";
import getDefaultPalette from "/src/components/palettes/default.ts";
import { languages } from "/src/components/_state.ts";
import createAddon from "./mod.ts";

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

      let palette = null;

      if (paletteSource) {
        palette = await getPalette(paletteSource);
      }

      const mcaddon = await createAddon(uuids, {
        size: getFormPackSize(data),
        blockColors: palette && palette.length ? palette : getDefaultPalette(),
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
      <title>Convert Pixel Art to Minecraft Add-on | Error!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
      </head>
      <body>
        <h1>Something has gone awry</h1>
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
      <title>Convert Pixel Art to Minecraft Add-on</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
      <link rel="stylesheet" href="https://newcss.net/theme/night.css">
      </head>
      <body>
      <header>
        <h1>Minecraft Pixel Art Generator</h1>
        <p>Convert image colors to custom blocks.</p>
        </header>

        <form method="post" action="/download" enctype="multipart/form-data">   
          <fieldset>
            <legend>Pixel Art Source</legend>
            <label for="paletteSource">Submit image</label>
            <input id="paletteSource" name="paletteSource" type="file" accept="image/*">
          </fieldset>

          <fieldset>
            <legend>Pack Details</legend>
            <label for="namespace">Namespace</label>
            <input id="namespace" name="namespace" type="text" pattern="^[a-z]+[a-z0-9]*" autocomplete="off">
          </fieldset>
          <button type="submit">Create .mcaddon</button>
        </form>

        <footer>
          <p>by <a href="https://jasongardner.dev">Jason</a>
        </footer>
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

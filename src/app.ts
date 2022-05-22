import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v10.4.0/mod.ts";
import download from "./application/routes/download.ts";

const router = new Router();
router
  .get("/", async (context) => {
    try {
      const view = await Deno.readFile(
        `${Deno.cwd()}/src/application/views/index.html`,
      );

      const decoder = new TextDecoder("utf-8");
      context.response.status = 200;
      context.response.type = "text/html";
      context.response.body = decoder.decode(view);
    } catch (err) {
      context.response.status = 500;
      console.log(err);
    }
  })
  .get("/download", async (context) => {
    const blob = await download();

    context.response.headers.set(
      "content-disposition",
      'attachment; filename="generated.mcaddon"',
    );
    context.response.type = "application/zip";
    context.response.body = new Uint8Array(await blob.arrayBuffer());
  })
  .post("/download", async (context) => {
    const body = context.request.body({ type: "form-data" });
    const data = await body.value.read();

    if (data.files && data.files.length) {
      const blob = await download(
        data.files[0].filename,
        data.fields.namespace,
        32,
      );

      context.response.headers.set(
        "content-disposition",
        'attachment; filename="generated.mcaddon"',
      );
      context.response.type = "application/zip";
      context.response.body = new Uint8Array(await blob.arrayBuffer());
      return;
    }

    context.response.status = 500;
  });

const app = new Application();

app.addEventListener("listen", () => {
  console.log("Server is online, 8000 is the magic port");
});

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const staticMap: Record<string, string> = {
    "script.js": `${Deno.cwd()}/src/assets/scripts/index.js`,
  };

  if (filePath in staticMap) {
    await send(ctx, staticMap[filePath]);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

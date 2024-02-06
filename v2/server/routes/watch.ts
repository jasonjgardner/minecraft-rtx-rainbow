import { queueFunctionFile } from "./functions.ts";
export async function watch(fnNameInput: string) {
  const [fnName, _params] = fnNameInput.split("?", 2);

  // TODO: Add params for `watch` command, and remove them before passing to `queueFunctionFile`

  const filepath = `./src/functions/${fnName}.mcfunction`;

  console.log("Watching function file %s", filepath);

  const watcher = Deno.watchFs(filepath);
  const ignoreEvents = ["any", "access"];

  for await (const event of watcher) {
    if (ignoreEvents.includes(event.kind)) {
      continue;
    }

    console.log("File %s changed, reloading", filepath);

    await queueFunctionFile(fnNameInput);
  }
}

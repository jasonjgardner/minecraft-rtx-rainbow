import type { WssParams } from "../../types/index.ts";
import { join, toFileUrl } from "path/mod.ts";
import { queueCommandRequest } from "../_io.ts";
import { state } from "../_state.ts";
import { formatPosition } from "../utils/formatPosition.ts";

const fnsPath = join(Deno.cwd(), "server", "functions");

/**
 * Load special functions found in `./src/functions/`
 * @param fnNameInput Script source
 */
export async function loadFunctionScript(fnNameInput: string) {
  const [scriptFile, params] = fnNameInput.split("?", 2);
  try {
    // TODO: Add cache busting to import statement
    const { default: mod } = await import(
      toFileUrl(`${fnsPath}/${scriptFile}.ts`).href
    );
    const wssParams: WssParams = {
      queueCommandRequest,
      parameters: new URLSearchParams(params),
      state,
      formatPosition,
    };

    await mod(wssParams);
  } catch (err) {
    console.error("Failed loading/executing function script: %s", err);
  }
}

/**
 * Parse a .mcfunction file and queue it for execution
 * @param fnNameInput .mcfunction file name
 */
export async function queueFunctionFile(fnNameInput: string) {
  const [fnName, fnParams] = fnNameInput.split("?", 2);

  const filepath = `${fnsPath}/${fnName}.mcfunction`;

  console.log("Loading function file %s", filepath);

  const file = await Deno.readTextFile(filepath);
  const params = fnParams ? fnParams.split("&") : [];
  const lines = file.split("\n").map((l) => {
    if (l.startsWith("#")) {
      return;
    }

    params.forEach((p) => {
      const [key, value] = p.split("=", 2);
      l = l.replace("$" + key, value);
    });

    return l.trim();
  }).filter((l) => l && l.length > 0);

  console.log("Queueing %d lines", lines.length);

  lines.map((c) => c && queueCommandRequest(c));
}

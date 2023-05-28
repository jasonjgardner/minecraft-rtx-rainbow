import { ensureDir } from "https://deno.land/std@0.147.0/fs/mod.ts";
import { queueCommandRequest } from "./_io.ts";
import { logFunction } from "./routes/log.ts";
import { watch } from "./routes/watch.ts";
import { loadFunctionScript, queueFunctionFile } from "./routes/functions.ts";
import { requests, state } from "./_state.ts";
export async function processMessage(
  { message, sender }: { message: string; sender: string },
) {
  const contents = message.replace(`[${sender}] `, "").trim();

  // TODO: Add index help function

  if (contents.startsWith("history/")) {
    const steps = parseInt(contents.replace("history/", ""), 10);

    state.blockHistory = [];
    state.enableBlockHistory = steps > 0;
    state.blockHistoryMaxLength = steps;
    return;
  }

  // Live reload
  if (contents.startsWith("lr/")) {
    await watch(contents.replace("lr/", "").trim());
    return;
  }

  if (contents.startsWith("read/")) {
    try {
      const fn = contents.replace("read/", "").trim();
      await queueFunctionFile(fn);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  if (contents.startsWith("script/")) {
    try {
      const fn = contents.replace("script/", "").trim();
      await loadFunctionScript(fn);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  if (contents.startsWith("log/") && state.functionLog) {
    const fn = contents.replace("log/", "").trim();

    await ensureDir(state.functionLog);

    const [fnName, fnContent] = fn.split("?", 2);
    logFunction(fnName, fnContent);
    console.info('Logged function "%s" to %s', fnName, state.functionLog);
    return;
  }

  if (contents.startsWith("help/")) {
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7Available commands:"`);
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §fhelp§7: Show this message"`,
    );
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §fread§7: Read a function file"`,
    );
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §flr§7: Live reload a function file"`,
    );
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §fscript§7: Run a script"`,
    );
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §flog§7: Log a function to a file"`,
    );
    queueCommandRequest(
      `tell ${sender} §c[§fWSS§c] §7- §fhistory§7: Enable/disable block history"`,
    );
    return;
  }

  // Check if command is a queued message sent from the server. Do nothing if it's detected in the queue.
  if (requests.find((r) => r && r.content === contents)) {
    return;
  }

  console.warn("Unknown: %s", contents);
}

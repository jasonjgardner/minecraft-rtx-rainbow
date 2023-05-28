import { join } from "https://deno.land/std@0.149.0/path/mod.ts";
import { queueCommandRequest } from "../_io.ts";
import { state } from "../_state.ts";

/**
 * Generate function on-the-fly from a string of commands, and queue it for execution
 */
export function logFunction(fnName: string, content: string) {
  if (!state.functionLog) {
    return;
  }

  const logPath = join(state.functionLog, `${fnName}.mcfunction`);

  Deno.writeTextFileSync(logPath, content, { append: true });

  queueCommandRequest(content);
}

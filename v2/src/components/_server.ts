import type BlockEntry from "./BlockEntry.ts";
import { camelCase } from "https://deno.land/x/case@2.2.0/mod.ts";

export async function writeServerVariables(res: BlockEntry[]) {
  const vars: Record<
    string,
    Record<string, string | string[] | number | number[]>
  > = {
    colors: {},
  };
  const secrets = {};

  res.forEach((block) => {
    const blockId = camelCase(block.id);
    vars.colors[blockId] = block.color;
  });

  await Deno.writeTextFile(
    "./server/variables.json",
    JSON.stringify(vars, null, 2),
  );

  await Deno.writeTextFile(
    "./server/secrets.json",
    JSON.stringify(secrets, null, 2),
  );
}

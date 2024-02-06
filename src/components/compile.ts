import * as esbuild from "https://deno.land/x/esbuild@v0.15.16/wasm.js";
import { basename, extname, join } from "path/mod.ts";
import { DIR_BP, DIR_SRC } from "../store/_config.ts";
import BlockEntry from "./BlockEntry.ts";

export default async function compile(src: string, {
  dir = "client",
  dest,
  res,
}: {
  dir?: "client" | "server" | "gametests";
  dest?: string;
  res?: BlockEntry[];
}) {
  const contents = await Deno.readTextFile(join(DIR_SRC, "scripts", src));

  const name = basename(src, extname(src));

  const transformed = await esbuild.transform(
    contents.replace(
      /\$BLOCKS\s*=\s*\[\]/g,
      `$BLOCKS = ${JSON.stringify((res ?? []).map((b) => b.serialize()))}`,
    ),
    {
      loader: "ts",
      sourcemap: true,
      sourcefile: src.toString(),
      sourcesContent: true,
      tsconfigRaw: `{ 
    "compilerOptions":{ 
       "target":"es6",
       "moduleResolution":"node",
       "module":"es2020",
       "declaration":false,
       "noLib":false,
       "emitDecoratorMetadata":true,
       "experimentalDecorators":true,
       "sourceMap":true,
       "pretty":true,
       "forceConsistentCasingInFileNames": true,
       "strict": true,
       "allowUnreachableCode":true,
       "allowUnusedLabels":true,
       "noImplicitAny":true,
       "noImplicitReturns":false,
       "noImplicitUseStrict":false,
       "outDir":"build/",
       "rootDir": ".",
       "baseUrl":"development_behavior_packs/",
       "listFiles":false,
       "noEmitHelpers":true
    },
    "exclude":[ 
       "node_modules"
    ],
    "compileOnSave":false
 }`,
    },
  );

  await Deno.writeTextFile(
    join(dest ?? DIR_BP, "scripts", dir, `${name}.js`),
    transformed.code.replace(/npm:@/g, "@"),
  );
  await Deno.writeTextFile(
    join(dest ?? DIR_BP, "scripts", dir, `${name}.js.map`),
    transformed.map,
  );

  esbuild.stop();

  return `scripts/${dir}/${name}.js`;
}

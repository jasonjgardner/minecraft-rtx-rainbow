// import type { ReleaseType } from "https://deno.land/x/semver/mod.ts";
// import { inc } from "https://deno.land/x/semver/mod.ts";
// import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import type { OutputMap } from "./types.ts";
import {
  BP_MODULE_UUID,
  BP_PACK_UUID,
  DIR_BP,
  DIR_RP,
  PACK_DESCRIPTION,
  PACK_NAME,
  RP_MODULE_UUID,
  RP_PACK_UUID,
  TARGET_VERSION,
} from "./_config.ts";

// export async function getBuildVersion(releaseType = "patch") {
//   const DEFAULT_VERSION = "1.0.0";
//   const { RP, BP } = JSON.parse(
//     await Deno.readTextFile(join(DIR_ROOT, "versions.json")),
//   );

//   return {
//     RP:
//       (inc(RP || DEFAULT_VERSION, <ReleaseType> releaseType) ?? DEFAULT_VERSION)
//         .split("."),
//     BP:
//       (inc(BP || DEFAULT_VERSION, <ReleaseType> releaseType) ?? DEFAULT_VERSION)
//         .split("."),
//   };
// }

// const { RP: rpVersion, BP: bpVersion } = await getBuildVersion();

const rpVersion = [1, 0, 0];
const bpVersion = [1, 0, 0];
const output: OutputMap = [];

output.push(
  [
    `${DIR_RP}/manifest.json`,
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: PACK_NAME,
          description: PACK_DESCRIPTION,
          uuid: RP_PACK_UUID,
          version: rpVersion,
          min_engine_version: TARGET_VERSION,
        },
        modules: [
          {
            description: `${PACK_NAME} generated textures`,
            type: "resources",
            uuid: RP_MODULE_UUID,
            version: rpVersion,
          },
        ],
        dependencies: [
          {
            uuid: BP_PACK_UUID,
            version: bpVersion,
          },
        ],
        capabilities: ["raytraced"],
      },
      null,
      2,
    ),
  ],
  [
    `${DIR_BP}/manifest.json`,
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: `${PACK_NAME} Behavior Pack`,
          description: `${PACK_NAME} data dependency`,
          uuid: BP_PACK_UUID,
          version: bpVersion,
          min_engine_version: TARGET_VERSION,
        },
        modules: [
          {
            description: `${PACK_NAME} generated block data`,
            type: "data",
            uuid: BP_MODULE_UUID,
            version: bpVersion,
          },
        ],
        dependencies: [
          {
            uuid: RP_PACK_UUID,
            version: rpVersion,
          },
          {
            uuid: RP_MODULE_UUID,
            version: rpVersion,
          },
        ],
      },
      null,
      2,
    ),
  ],
);

export default output;

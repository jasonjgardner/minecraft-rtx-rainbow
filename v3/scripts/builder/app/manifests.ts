import { sizes, TARGET_VERSION } from "../_constants.ts";

const RP_UUID = "cc095f90-d2c1-474a-a03f-df0c53f3ca44";
const BP_UUID = "5bd99162-b504-4904-a9af-66ba27c96f19";

const bpManifest = {
  format_version: 2,
  header: {
    name: "RAINBOW III!!!",
    description: "RAINBOW behavior pack for Minecraft Bedrock Edition",
    version: [3, 0, 0],
    min_engine_version: TARGET_VERSION,
    uuid: BP_UUID,
  },
  modules: [
    {
      type: "data",
      uuid: "82eeba3f-0b56-49fc-9409-8bdbcccabd29",
      version: [3, 0, 0],
    },
  ],
  dependencies: [
    {
      uuid: RP_UUID,
      version: [3, 0, 0],
    },
  ],
};

const rpManifest = {
  format_version: 2,
  header: {
    name: "RAINBOW III!!!",
    description: "RAINBOW resource pack for Minecraft Bedrock Edition",
    version: [3, 0, 0],
    min_engine_version: TARGET_VERSION,
    uuid: RP_UUID,
  },
  modules: [
    {
      type: "resources",
      uuid: "194c593a-8702-425c-9fd7-7b852ae23c67",
      version: [3, 0, 0],
    },
  ],
  dependencies: [
    {
      uuid: BP_UUID,
      version: bpManifest.header.version,
    },
  ],
  capabilities: [
    "raytraced",
    "pbr",
  ],
  subpacks: sizes.map((size, idx) => ({
    folder_name: `${size}x`,
    name: `${size}x`,
    memory_tier: idx,
  })),
};

await Deno.writeTextFile(
  "pack/BP/manifest.json",
  JSON.stringify(bpManifest, null, 2),
);

await Deno.writeTextFile(
  "pack/RP/manifest.json",
  JSON.stringify(rpManifest, null, 2),
);

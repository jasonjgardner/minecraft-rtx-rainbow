import { BP_DIR, NAMESPACE, RP_DIR, ADDON_DIR } from "./_constants.ts";
import { emptyDir, copy, ensureDir } from "fs-extra";
import { join, dirname } from "node:path";
import { platform } from "node:os";
import { $ } from "bun";

// New path: %appdata%\Minecraft Bedrock Preview\Users\Shared\games\com.mojang\

const appData = process.env["APPDATA"] || "%AppData%";
export async function deployToDev(preview = false) {
  if (platform() !== "win32") {
    throw Error(
      "Can not deploy to development directory in current environment.",
    );
  }

  // As of 1.21.120, regular Bedrock uses %APPDATA%\Minecraft Bedrock
  // Preview uses %APPDATA%\Minecraft Bedrock Preview
  const minecraftFolder = preview
    ? "Minecraft Bedrock Preview"
    : "Minecraft Bedrock";
  const comMojang = join(
    appData,
    minecraftFolder,
    "Users",
    "Shared",
    "games",
    "com.mojang",
  );

  const devBehaviorPacks = join(
    comMojang,
    "development_behavior_packs",
    `${NAMESPACE}iii BP`,
  );
  const devResourcePacks = join(
    comMojang,
    "development_resource_packs",
    `${NAMESPACE}iii RP`,
  );

  const addonPack = join(
    comMojang,
    "development_behavior_packs",
    `${NAMESPACE}iii Addon`,
  );

  await Promise.all(
    [devBehaviorPacks, devResourcePacks, addonPack].map(async (dir) => {
      await emptyDir(dir);
    }),
  );

  await Promise.all([
    copy(BP_DIR, dirname(devBehaviorPacks), {
      overwrite: true,
      filter: (src) => !src.includes("rainbow-addon"),
    }),
    copy(RP_DIR, devResourcePacks, { overwrite: true }),
    copy(ADDON_DIR, addonPack, { overwrite: true }),
  ]);
}

if (import.meta.main) {
  // Deploy to both regular and preview
  await Promise.all([deployToDev(false), deployToDev(true)]);
  console.log("Deployed to development directories.");
  process.exit(0);
}

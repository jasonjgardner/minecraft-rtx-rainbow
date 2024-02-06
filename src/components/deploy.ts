import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { join } from "path/mod.ts";
import { copy, emptyDir } from "fs/mod.ts";
import { DIR_DIST, NAMESPACE } from "/src/store/_config.ts";
import { getConfig } from "../_utils.ts";
const env = await load();
const bdsPath = env.BDS_PATH ?? (Deno.env.get("BDS_PATH") ||
  getConfig("BDS", ""));
const appData = Deno.env.get("LOCALAPPDATA") || "%LocalAppData%";

export async function deployToDev(preview = false) {
  if (
    Deno.build.os !== "windows" || Deno.env.get("GITHUB_ACTIONS") !== undefined
  ) {
    throw Error(
      "Can not deploy to development directory in current environment.",
    );
  }

  const comMojang = join(
    appData,
    "Packages",
    preview
      ? "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe"
      : "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
    "LocalState",
    "games",
    "com.mojang",
  );

  const buildBehaviorPacks = join(DIR_DIST, `${NAMESPACE} BP`);
  const buildResourcePacks = join(DIR_DIST, `${NAMESPACE} RP`);

  const devBehaviorPacks = join(
    comMojang,
    "development_behavior_packs",
    `${NAMESPACE} BP`,
  );
  const devResourcePacks = join(
    comMojang,
    "development_resource_packs",
    `${NAMESPACE} RP`,
  );

  await resetDev([
    devBehaviorPacks,
    devResourcePacks,
  ]);
  return Promise.all([
    copy(buildBehaviorPacks, devBehaviorPacks, { overwrite: true }),
    copy(buildResourcePacks, devResourcePacks, { overwrite: true }),
  ]);
}

export async function resetDev(paths: string[] = []) {
  await Promise.all(paths.map((dir) => emptyDir(dir)));
  //await Promise.all(paths.map((dir) => ensureDir(dir)));
}

export async function deployToDedicatedServer() {
  if (!bdsPath) {
    throw Error(
      "Can not deploy to dedicated server without BDS_PATH environment variable.",
    );
  }

  const bp = join(
    bdsPath.toString(),
    "development_behavior_packs",
    `${NAMESPACE} BP`,
  );
  const buildBehaviorPacks = join(DIR_DIST, `${NAMESPACE} BP`);
  const buildResourcePacks = join(DIR_DIST, `${NAMESPACE} RP`);
  const rp = join(
    bdsPath.toString(),
    "development_resource_packs",
    `${NAMESPACE} RP`,
  );
  await resetDev([
    bp,
    rp,
  ]);
  return await Promise.all([
    copy(buildBehaviorPacks, bp, { overwrite: true }),
    copy(buildResourcePacks, rp, { overwrite: true }),
  ]);
}

import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.125.0/fs/copy.ts";
import { emptyDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import { DIR_DIST, NAMESPACE } from "../store/_config.ts";

const appData = Deno.env.get("LOCALAPPDATA") || "%LocalAppData%";

const comMojang = join(
  appData,
  "Packages",
  "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
  "LocalState",
  "games",
  "com.mojang",
);

const buildBehaviorPacks = join(DIR_DIST, `${NAMESPACE} BP`);
const buildResourcePacks = join(DIR_DIST, `${NAMESPACE} RP`);

const devBehaviorPacks = join(
  comMojang,
  "development_behavior_packs",
  NAMESPACE,
  `${NAMESPACE} BP`,
);
const devResourcePacks = join(
  comMojang,
  "development_resource_packs",
  NAMESPACE,
  `${NAMESPACE} RP`,
);

export async function deployToDev() {
  await resetDev();
  return await Promise.all([
    copy(buildBehaviorPacks, devBehaviorPacks, { overwrite: true }),
    copy(buildResourcePacks, devResourcePacks, { overwrite: true }),
  ]);
}

export async function resetDev() {
  const paths = [
    devBehaviorPacks,
    devResourcePacks,
  ];
  await Promise.all(paths.map((dir) => emptyDir(dir)));
  //await Promise.all(paths.map((dir) => ensureDir(dir)));
}

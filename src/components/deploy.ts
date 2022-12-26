import { join } from "path/mod.ts";
import { copy, emptyDir } from "fs/mod.ts";
import { DIR_DIST, NAMESPACE } from "/src/store/_config.ts";

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
  `${NAMESPACE} BP`,
);
const devResourcePacks = join(
  comMojang,
  "development_resource_packs",
  `${NAMESPACE} RP`,
);

export async function deployToDev() {
  if (
    Deno.build.os !== "windows" || Deno.env.get("GITHUB_ACTIONS") !== undefined
  ) {
    throw Error(
      "Can not deploy to development directory in current environment.",
    );
  }

  await resetDev();
  return Promise.all([
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

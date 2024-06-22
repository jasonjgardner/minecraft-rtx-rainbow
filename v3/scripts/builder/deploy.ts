import { BP_DIR, NAMESPACE, RP_DIR } from "./_constants.ts";
import { emptyDir, copy } from "fs-extra";
import { join } from "node:path";
import { platform } from "node:os";

const appData = process.env["LOCALAPPDATA"] || "%LocalAppData%";
export async function deployToDev(preview = false) {
  if (platform() !== "win32") {
    throw Error(
      "Can not deploy to development directory in current environment."
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
    "com.mojang"
  );

  const devBehaviorPacks = join(
    comMojang,
    "development_behavior_packs",
    `${NAMESPACE}iii BP`
  );
  const devResourcePacks = join(
    comMojang,
    "development_resource_packs",
    `${NAMESPACE}iii RP`
  );

  await Promise.all(
    [devBehaviorPacks, devResourcePacks].map((dir) => emptyDir(dir))
  );

  return Promise.all([
    copy(BP_DIR, devBehaviorPacks, { overwrite: true }),
    copy(RP_DIR, devResourcePacks, { overwrite: true }),
  ]);
}

if (import.meta.main) {
  await deployToDev();
}

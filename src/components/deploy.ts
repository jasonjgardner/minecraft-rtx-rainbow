import { join } from "path/mod.ts";

export function getMojangPath(preview?: boolean) {
  if (
    Deno.build.os !== "windows" || Deno.env.get("GITHUB_ACTIONS") !== undefined
  ) {
    throw Error(
      "Can not lookup com.mojang path",
    );
  }

  const appData = Deno.env.get("LOCALAPPDATA") || "%LocalAppData%";

  const uwpPath = preview === true
    ? "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe"
    : "Microsoft.MinecraftUWP_8wekyb3d8bbwe";

  return join(
    appData,
    "Packages",
    uwpPath,
    "LocalState",
    "games",
    "com.mojang",
  );
}

export function getDevelopmentPath(
  target: "RP" | "BP",
  packName: string,
  preview?: boolean,
) {
  return join(
    getMojangPath(preview === true),
    target === "RP"
      ? "development_resource_packs"
      : "development_behavior_packs",
    packName,
    `${packName} ${target}`,
  );
}

// TODO: Unzip to development paths

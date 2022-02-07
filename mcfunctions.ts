import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";

// TODO: Use iterateWithColors to create pixel art
// https://imagescript.dreadful.tech/Image#iterateWithColors

interface IFormatTrail {
  replaceWhat?: string;
  replaceWith: string;
  who?: string;
  where?: Array<string | number>;
}

function formatTrail(params: IFormatTrail) {
  return `execute ${params.who || "@p"} ~ ~ ~ fill ${
    params.where === undefined ? "~ ~-1 ~ ~ ~-1 ~" : params.where.join(" ")
  } ${params.replaceWith} 0 replace ${params.replaceWhat || ""}`.trimEnd();
}

export function entityTrailFunction() {
  return [{
    replaceWith: "rainbow:pink_800_metallic_75",
    who: "@e[type=pig]",
  }, {
    replaceWith: "rainbow:brown_600_metallic_75",
    who: "@e[type=cow]",
  }, {
    replaceWith: "rainbow:brown_600_metallic_75",
    who: "@e[type=cow]",
  }, {
    replaceWith: "rainbow:grey_600_plastic_50",
    who: "@e[type=donkey]",
  }, {
    replaceWith: "rainbow:brown_400_plastic_75",
    who: "@e[type=horse]",
  }, {
    replaceWith: "rainbow:grey_200_metallic_50",
    who: "@e[type=sheep]",
  }, {
    replaceWith: "rainbow:grey_900_metallic_75",
    who: "@e[type=wolf]",
  }, {
    replaceWith: "rainbow:deep_orange_900_metallic_75",
    who: "@e[type=fox]",
  }, {
    replaceWith: "rainbow:amber_300_metallic_75",
    who: "@e[type=chicken]",
  }, {
    replaceWith: "rainbow:amber_100_plastic_75",
    who: "@e[type=llama]",
  }, {
    replaceWith: "rainbow:grey_50_plastic_75",
    who: "@e[type=panda]",
  }, {
    replaceWith: "rainbow:red_900_glowing_50",
    who: "@e[type=cave_spider]",
  }, {
    replaceWith: "rainbow:deep_purple_800_glowing_75",
    who: "@e[type=bat]",
  }, {
    replaceWith: "rainbow:amber_100_glowing_50",
    who: "@e[type=bee]",
  }, {
    replaceWith: "rainbow:deep_orange_500_glowing_50",
    replaceWhat: "minecraft:water",
    who: "@e[type=salmon]",
    where: ["~", "~-2", "~", "~", "~-2", "~"],
  }, {
    replaceWith: "rainbow:red_800_glowing_100",
    replaceWhat: "minecraft:dirt",
    who: "@e[type=salmon]",
  }, {
    replaceWith: "rainbow:brown_700_glowing_50",
    replaceWhat: "minecraft:water",
    who: "@e[type=cod]",
    where: ["~", "~-2", "~", "~", "~-2", "~"],
  }, {
    replaceWith: "rainbow:red_800_glowing_100",
    replaceWhat: "minecraft:dirt",
    who: "@e[type=cod]",
  }, {
    replaceWith: "rainbow:indigo_600_glowing_75",
    replaceWhat: "minecraft:water",
    who: "@e[type=squid]",
    where: ["~", "~-2", "~", "~", "~-2", "~"],
  }, {
    replaceWith: "rainbow:red_800_glowing_100",
    replaceWhat: "minecraft:dirt",
    who: "@e[type=squid]",
  }, {
    replaceWith: "rainbow:teal_600_glowing_75",
    replaceWhat: "minecraft:water",
    who: "@e[type=glow_squid]",
    where: ["~", "~-2", "~", "~", "~-2", "~"],
  }, {
    replaceWith: "rainbow:red_800_glowing_100",
    replaceWhat: "minecraft:dirt",
    who: "@e[type=glow_squid]",
  }, {
    replaceWith: "rainbow:light_blue_500_glowing_50",
    replaceWhat: "minecraft:water",
    who: "@e[type=dolphin]",
    where: ["~", "~-2", "~", "~", "~-2", "~"],
  }, {
    replaceWith: "rainbow:red_800_glowing_100",
    replaceWhat: "minecraft:dirt",
    who: "@e[type=dolphin]",
  }, {
    replaceWith: "rainbow:green_700_glowing_75",
    replaceWhat: "minecraft:air",
    who: "@e[type=arrow]",
    where: ["~", "~-2", "~", "~", "~-1", "~"], // Start lower, only go 1 block high to avoid getting snagged
  }, {
    replaceWith: "rainbow:teal_400_glowing_75",
    replaceWhat: "minecraft:air",
    who: "@e[type=thrown_trident]",
    where: ["~", "~-2", "~", "~", "~-1", "~"],
  }, {
    replaceWith: "rainbow:light_blue_100_plastic_100",
    replaceWhat: "minecraft:air",
    who: "@e[type=snowball]",
    where: ["~", "~-2", "~", "~", "~-1", "~"],
  }].map((fmt: IFormatTrail) => formatTrail(fmt)).join(EOL.CRLF);
}

export function rainbowTrailFunction() {
  return [
    {
      replaceWhat: "minecraft:grass",
      replaceWith: "rainbow:green_500_glowing_75",
    },
    {
      replaceWhat: "minecraft:water",
      replaceWith: "rainbow:blue_200_glowing_50",
    },
    {
      replaceWhat: "minecraft:sand",
      replaceWith: "rainbow:amber_500_glowing_75",
    },
    {
      replaceWhat: "minecraft:dirt",
      replaceWith: "rainbow:brown_700_glowing_50",
    },
    {
      replaceWhat: "minecraft:snow",
      replaceWith: "rainbow:grey_200_glowing_75",
    },
    {
      replaceWhat: "minecraft:stone",
      replaceWith: "rainbow:grey_400_glowing_50",
    },
    {
      replaceWhat: "minecraft:leaves",
      replaceWith: "rainbow:pink_600_glowing_100",
      where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
    },
    {
      replaceWhat: "minecraft:leaves2",
      replaceWith: "rainbow:pink_600_glowing_100",
      where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
    },
    {
      replaceWhat: "minecraft:log",
      replaceWith: "rainbow:red_400_metallic_75",
      where: "~-2 ~-2 ~-2 ~2 ~-1 ~2".split(" "),
    },
    {
      replaceWhat: "minecraft:log2",
      replaceWith: "rainbow:red_400_metallic_75",
      where: "~-2 ~-2 ~-2 ~2 ~-1 ~2".split(" "),
    },
  ].map((fmt: IFormatTrail) => formatTrail(fmt)).join(EOL.CRLF);
}

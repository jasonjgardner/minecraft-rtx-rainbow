import { EOL } from "fs/mod.ts";

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

export function entityTrailFunction(): [string, string] {
  return [
    "entity_trail",
    [{
      replaceWith: "rainbow:pink_800_metallic_75",
      who: "@e[type=pig]",
    }, {
      replaceWith: "rainbow:pink_200_metallic_75",
      who: "@e[type=rabbit]",
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
      replaceWith: "rainbow:lime_400_metallic_75",
      who: "@e[type=ocelot]",
    }, {
      replaceWith: "rainbow:teal_500_metallic_75",
      who: "@e[type=turtle]",
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
      replaceWith: "rainbow:orange_800_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=salmon]",
    }, {
      replaceWith: "rainbow:blue_400_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=pufferfish]",
    }, {
      replaceWith: "rainbow:green_400_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=cod]",
    }, {
      replaceWith: "rainbow:teal_600_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=tropicalfish]",
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
      replaceWith: "rainbow:orange_800_glowing_50",
      who: "@e[family=villager]",
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
      replaceWith: "rainbow:light_blue_100_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=snowball]",
      where: ["~", "~-2", "~", "~", "~-1", "~"],
    }, {
      replaceWith: "rainbow:red_800_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=falling_block]",
      where: ["~", "~2", "~", "~", "~2", "~"],
    }, {
      replaceWith: "rainbow:green_600_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=falling_block]",
      where: ["~1", "~2", "~", "~1", "~2", "~"],
    }, {
      replaceWith: "rainbow:blue_600_glowing_50",
      replaceWhat: "minecraft:air",
      who: "@e[type=falling_block]",
      where: ["~", "~2", "~1", "~", "~2", "~1"],
    }].map((fmt: IFormatTrail) => formatTrail(fmt)).join(EOL.CRLF),
  ];
}

export function rainbowTrailFunction(): [string, string] {
  return [
    "rainbow_trail",
    [
      {
        replaceWhat: "minecraft:grass",
        replaceWith: "rainbow:green_500_glowing_75",
      },
      {
        replaceWhat: "minecraft:water",
        replaceWith: "rainbow:blue_200_glowing_50",
      },
      {
        replaceWhat: "minecraft:lava",
        replaceWith: "rainbow:deep_orange_800_glowing_50",
      },
      {
        replaceWhat: "minecraft:magma",
        replaceWith: "rainbow:orange_700_glowing_50",
      },
      {
        replaceWhat: "minecraft:sand",
        replaceWith: "rainbow:amber_500_glowing_75",
      },
      {
        replaceWhat: "minecraft:sandstone",
        replaceWith: "rainbow:amber_600_glowing_50",
      },
      {
        replaceWhat: "minecraft:red_sandstone",
        replaceWith: "rainbow:red_700_glowing_50",
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
        replaceWhat: "minecraft:ice",
        replaceWith: "rainbow:blue_700_glowing_50",
      },
      {
        replaceWhat: "minecraft:packed_ice",
        replaceWith: "rainbow:indigo_700_glowing_50",
      },
      {
        replaceWhat: "minecraft:stone",
        replaceWith: "rainbow:grey_400_glowing_50",
      },
      {
        replaceWhat: "minecraft:gravel",
        replaceWith: "rainbow:grey_500_glowing_50",
      },
      {
        replaceWhat: "minecraft:blackstone",
        replaceWith: "rainbow:grey_700_glowing_50",
      },
      {
        replaceWhat: "minecraft:cobblestone",
        replaceWith: "rainbow:grey_400_glowing_50",
      },
      {
        replaceWhat: "minecraft:brown_mushroom_block",
        replaceWith: "rainbow:brown_400_glowing_50",
      },
      {
        replaceWhat: "minecraft:brown_mushroom_block",
        replaceWith: "rainbow:brown_100_metallic_75",
      },
      {
        replaceWhat: "minecraft:crimson_hyphae",
        replaceWith: "rainbow:red_700_glowing_75",
      },
      {
        replaceWhat: "minecraft:nether_wart_block",
        replaceWith: "rainbow:red_900_glowing_50",
      },
      {
        replaceWhat: "minecraft:netherrack",
        replaceWith: "rainbow:red_400_glowing_75",
      },
      {
        replaceWhat: "minecraft:warped_hyphae",
        replaceWith: "rainbow:red_700_glowing_75",
      },
      {
        replaceWhat: "minecraft:end_stone",
        replaceWith: "rainbow:amber_100_glowing_50",
      },
      {
        replaceWhat: "minecraft:mycelium",
        replaceWith: "rainbow:purple_300_glowing_50",
      },
      {
        replaceWhat: "minecraft:podzol",
        replaceWith: "rainbow:brown_600_glowing_50",
      },
      {
        replaceWhat: "minecraft:leaves",
        replaceWith: "rainbow:green_600_glowing_50",
        where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
      },
      {
        replaceWhat: "minecraft:leaves2",
        replaceWith: "rainbow:green_600_glowing_50",
        where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
      },
      {
        replaceWhat: "minecraft:log",
        replaceWith: "rainbow:brown_400_metallic_75",
        where: "^-2 ^-2 ^-2 ^2 ^-1 ^2".split(" "),
      },
      {
        replaceWhat: "minecraft:log2",
        replaceWith: "rainbow:brown_400_metallic_75",
        where: "^-2 ^-2 ^-2 ^2 ^-1 ^2".split(" "),
      },
    ].map((fmt: IFormatTrail) => formatTrail(fmt)).join(EOL.CRLF),
  ];
}

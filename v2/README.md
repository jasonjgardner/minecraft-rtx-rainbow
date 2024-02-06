> #### (Monorepo maintenance)
> Check out the [**deploy** branch](https://github.com/jasonjgardner/minecraft-rtx-rainbow/tree/deploy) for the pixel art generator source and README file.

---

# 🌈 RAINBOW!
**VERSION 2**

[![Magic Workflow](https://github.com/jasonjgardner/minecraft-rtx-rainbow/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/jasonjgardner/minecraft-rtx-rainbow/actions/workflows/build.yml)

- Adds over **2500** uniform-color blocks to _Bedrock Minecraft_.
- Each color comes in glowing, glass, metallic and plastic varieties.
- Intended to be played with __RTX ON__, but still functions without raytracing effects.
- Adds uniform-color blocks to the __Concretes__ and __Glass__ creative category.
- Color palette based on [2014 Material Design colors](https://material.io/design/color/the-color-system.html).
- Includes nifty `/function` commands.

## 🪄 Made with Magic
_RAINBOW!_ v2 is compiled through [one amazing build script](/src/mod.ts).

- Generates `.texture_set.json` files from colors data source
- Compiles texture sets into a resource pack
- Simutaneously compiles custom block behaviors
- Creates flipbook textures from color palettes
- Converts pixel art into a `.mcfunction` file full of `/fill` commands
  - **_Bonus:_** Converts [this repository's Stargazers' avatars](https://github.com/jasonjgardner/minecraft-rtx-rainbow/stargazers) into fill commands. Enter `/function printer/stargazers/` for auto-complete options in command.
- Automatically copies build to `development_resource_packs` when running locally
- Creates distributable [.mcaddon through GitHub Actions](https://github.com/jasonjgardner/minecraft-rtx-rainbow/actions/workflows/build.yml)

## 🦕 Run with [Deno](https://deno.land/)
You _can_ clone the repository to control its output. You do not need to build from source to use the add-on. A .mcaddon file is available if you do not wish to customize the pack.

### Customization

- Place your own pixel art into the [`src/assets/pixel_art`](/src/assets/pixel_art) directory.
- Modify [`src/store/_blocks.ts`](/src/store/_blocks.ts) to enable/disable or add color options.
- Modify [`src/store/_materials.ts`](/src/store/_materials.ts) to adjust block parameters:
  - Block behavior components can be changed
  - Material options can be increased/reduced

## Screenshots
![RAINBOW screenshot](https://user-images.githubusercontent.com/1903667/153769488-95da1fba-a51c-4399-9ee8-63f7b0af5338.png)

> ![RAINBOW screenshot](https://user-images.githubusercontent.com/1903667/153769512-5fe0cd77-d929-4458-8982-44475ac0fdd4.png)
> Entities leave light trails! These yellow lines were left by salmon flopping to death.

> ![RAINBOW screenshot](https://user-images.githubusercontent.com/1903667/153769607-6b26c959-7bbe-41d1-b7a3-9016a634bf4f.png)
> ![RAINBOW screenshot](https://user-images.githubusercontent.com/1903667/153769616-ab9dbdd7-b107-4dd5-84f1-d935b8f68e52.png)
> My RAINBOW! test world
  
## License
CC-BY-NC-SA

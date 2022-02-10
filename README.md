# 🌈 RAINBOW!
**VERSION 2**

- Adds over **2500** uniform-color blocks to _Bedrock Minecraft_.
- Each color comes in glowing, glass, metallic and plastic varieties.
- Intended to be played with __RTX ON__, but still functions without raytracing effects.
- Works with RTX packs _up to_ 256px resolution.
- Adds uniform-color blocks to the __Concretes__ creative category.
- Color palette based on [2014 Material Design colors](https://material.io/design/color/the-color-system.html).
- Players leave a trail of glowing blocks in their wake.
- Entities, mobs, and projectiles leave trails as well.
- Walk over blocks to cycle through block colors.
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
- Creates distributable .mcaddon through GitHub Actions

## 🦕 Run with [Deno](https://deno.land/)
You _can_ clone the repository to control its output. You do not need to build from source to use the add-on. A .mcaddon file is available if you do not wish to customize the pack.

### Customization

- Place your own pixel art into the [`/src/assets/pixel_art`](/src/assets/pixel_art) directory.
- Modify [`src/store/_blocks.ts`](/src/store/_blocks.ts) to enable/disable or add color options.
- Modify [`src/store/_materials.ts`](/src/store/_materials.ts) to adjust block parameters:
  - Block behavior components can be changed
  - Material options can be increased/reduced
  
## License
CC-BY-NC-SA

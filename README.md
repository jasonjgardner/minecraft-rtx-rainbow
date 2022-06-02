# [Minecraft Full-Color Pixel Art Generator](https://minecraft-pixel-art.deno.dev/)
__Convert an image into an add-on containing custom blocks and mosaic functions__

[![Deno Deploy](https://github.com/jasonjgardner/minecraft-rtx-rainbow/actions/workflows/deploy.yml/badge.svg?branch=deploy&event=deployment)](https://github.com/jasonjgardner/minecraft-rtx-rainbow/actions/workflows/deploy.yml)

![Full-color Minecraft pixel art generator](https://user-images.githubusercontent.com/1903667/170851289-6afae198-c816-44f6-8e3d-d36bba10d391.png)

## Behold the Power of TEXTURE SETS
[Texture sets](https://bedrock.dev/docs/stable/Texture%20Sets) were introduced in Bedrock Minecraft v1.16.200 alongside its RTX features. The `color` layer in a texture set can render any RGBA value. When your artwork is submitted, the Pixel Art Generator will create a `.mcaddon` containing every color in the image as a custom block and `fill` functions to reproduce the art in Minecraft. This ability sets it aside from its predecessors, which had to clamp pixel artwork colors to the Vanilla block palette (for better or worse).

### Similar Tools
- [Minecraft Mural Generator](https://bimbimma.com/minecraftmurals/)
- [Minecraft Artifier](https://github.com/Explodey54/minecraft-artifier-js)

## Minimal Requirements:
- __Bedrock Minecraft__ v1.16.2 or later
- Holiday Creator Features enabled
- Ability to run functions or use command blocks

---

# GIF Support
Convert frames from a GIF into a "layers" of a build. Each frame is offset over the axis named in the function. This PB&J build demonstrates its _GIF_ support. 😉

__Source Image__

![Input GIF example of Peanut Butter and Jelly sandwich](https://user-images.githubusercontent.com/1903667/171332773-0e0986f1-4892-4bd3-8215-9f4745420d83.gif)

__Result__

![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/171332574-c0070f0f-3339-4bc6-bbf8-5075338e16a5.png)

## Alignment Options

### End-to-end Alignment
Generates a `/fill` command which places GIF frames side-by-side over the same axis.

__Source Image__

![KCMO skyline build GIF source](https://user-images.githubusercontent.com/1903667/171439534-231ee05e-31a6-4aef-8d97-224d93f11587.gif)

__Result__

![KCMO skyline silhouette in Minecraft](https://user-images.githubusercontent.com/1903667/171439069-ed73398b-a3a8-4bac-b795-9c832f7d7ed7.png)

### Back-to-back Alignment
Generates a `/fill` command which places GIF frames in a stack over a perpendicular axis. ([See the PB&J sandwich above for an example.](#source-image))

### Back-to-back Alignment Offsets
- __No offset__ will place frames directly next to each other in the stack.
- __Alternate even/odd frames__ will place frames with a space between them. The space is placed every even or odd step over the perpendicular axis.

# Alpha Transparency Support
Semi-opaque pixels [above a certain opacity level](https://github.com/jasonjgardner/minecraft-rtx-rainbow/blob/7afbf9568ee7a0ec4789e2d16eb237008f2ec88e/typings/constants.ts#L67) (50%) will be given an alpha channel value.

__Source Images__

![Art source](https://user-images.githubusercontent.com/1903667/170851706-58b953d4-b0d4-485d-9219-c8f897027ecd.png)
![Art source](https://user-images.githubusercontent.com/1903667/170851725-54bf5252-5ed7-4df2-87aa-46ad4a49688f.png)

__Results__

![Minecraft Screenshot example](https://user-images.githubusercontent.com/1903667/170851651-44160561-b046-45b7-b5d5-b645041c89cc.png)
![Minecraft Screenshot example](https://user-images.githubusercontent.com/1903667/170851656-1fd061a1-dfe6-4b3c-9cdf-0a5a5a646e0f.png)

# Raytracing-enabled

## Material Options
![Pixel art generator screenshot](https://user-images.githubusercontent.com/1903667/171331434-164a49f7-ea4a-4869-b2c0-a2b017768a86.jpeg)
![Minecraft functions screenshot](https://user-images.githubusercontent.com/1903667/171331729-d174d369-72c1-4ab3-9bff-a19975f35dc2.png)
![Minecraft RTX screenshot](https://user-images.githubusercontent.com/1903667/171331082-3d5faf63-2d1b-41d9-8e02-7607dbe39bf0.png)

## Examples

![Example source GIF](https://user-images.githubusercontent.com/1903667/170851426-2d67ca95-c4d9-4a5d-84c0-8675b80ea190.gif)

![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/170851454-6e00be30-6a75-4379-b20c-7b94d323d9b5.png)
![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/170851455-8931032e-cb49-4a1b-985b-da75081e7762.png)
![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/170851456-8c1e5db9-c07e-47c7-b619-df2deda88577.png)
![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/170851458-aa2ea953-07d1-48f2-ab46-857d19cf0774.png)
![Minecraft Screenshot](https://user-images.githubusercontent.com/1903667/170851459-129510cf-699b-4f25-aa8b-ff10e90414b1.png)

#### RTX Requirements
- [RTX effects require a compatible PC and GPU](https://help.minecraft.net/hc/en-us/articles/4408865164173-Minecraft-with-Ray-Tracing-and-Advanced-Graphics-FAQ)

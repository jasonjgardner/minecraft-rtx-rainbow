import type { PackSizes } from "/typings/types.ts"
import { Image } from "imagescript/mod.ts";

export async function renderBlock(color: number[], size: PackSizes) {
    const [r,g,b,a] = color.slice(0, 4)

    const imgOutput = new Image(size, size);
    imgOutput.fill(Image.rgbaToColor(r, g, b, a))
    
    
    return await imgOutput.encode(0);
}

export async function renderDot(color: number[], size: PackSizes) {
    const [r,g,b,a] = color.slice(0, 4)

    const imgOutput = new Image(size, size);
    imgOutput.fill(Image.rgbaToColor(0, 0, 0, 1))
    imgOutput.drawCircle(0, 0, size, Image.rgbaToColor(r, g, b, a))
    
    return await imgOutput.encode(0);
}
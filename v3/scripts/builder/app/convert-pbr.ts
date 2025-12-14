/**
 * PBR Texture Converter for Java Edition
 *
 * Converts Bedrock RTX PBR textures to LabPBR format for Java Edition shaders.
 *
 * Conversions:
 * 1. MER (Metalness/Emissive/Roughness) → LabPBR _s (Specular)
 *    - MER.R (Metalness) → _s.G (F0/Metalness): 0-229 dielectric, 255 full metal
 *    - MER.G (Emissive)  → _s.A (Emission): 0-254 linear
 *    - MER.B (Roughness) → _s.R (Smoothness): perceptualSmoothness = 1 - sqrt(roughness)
 *    - _s.B (Porosity/SSS): Set to 0 (unused)
 *
 * 2. DirectX Normal → OpenGL Normal (_n)
 *    - Invert Green channel: Y = 255 - Y
 *
 * References:
 * - LabPBR: https://shaderlabs.org/wiki/LabPBR_Material_Standard
 */

import sharp from 'sharp';
import * as fs from 'fs-extra';
import * as path from 'path';

const SUBPACK_SIZES = [32, 64, 128, 256];
const BEDROCK_SUBPACKS = path.resolve(import.meta.dir, '../../../bedrock/RP/subpacks');
const JAVA_OUTPUT = path.resolve(import.meta.dir, '../../../java/fabric-1.21.10/build/pbr-converted');

/**
 * Convert MER texture to LabPBR specular format
 */
async function convertMerToLabPBR(inputPath: string, outputPath: string): Promise<void> {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
        throw new Error(`Invalid image dimensions for ${inputPath}`);
    }

    // Extract raw RGBA pixel data
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const output = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0; i < data.length; i += 4) {
        const metalness = data[i];     // MER Red channel
        const emissive = data[i + 1];  // MER Green channel
        const roughness = data[i + 2]; // MER Blue channel

        // Convert roughness to perceptual smoothness
        // LabPBR: roughness = pow(1.0 - perceptualSmoothness, 2.0)
        // So: perceptualSmoothness = 1 - sqrt(roughness)
        const roughnessNorm = roughness / 255;
        const perceptualSmoothness = 1.0 - Math.sqrt(roughnessNorm);
        const smoothnessValue = Math.round(perceptualSmoothness * 255);

        // Convert metalness to LabPBR F0/metalness encoding
        // 0-229: F0 for dielectrics (linear)
        // 230-254: Hardcoded metals
        // 255: Full metal using albedo as F0
        let f0Value: number;
        if (metalness > 230) {
            // High metalness maps to 255 (full metal)
            f0Value = 255;
        } else if (metalness > 128) {
            // Partial metal - scale to upper range
            f0Value = Math.round(230 + ((metalness - 128) / 127) * 25);
        } else {
            // Dielectric - use as F0 (0-229 range)
            f0Value = Math.round((metalness / 128) * 229);
        }

        // Emissive: LabPBR uses 0-254 (255 is ignored)
        const emissiveValue = Math.min(254, emissive);

        // LabPBR _s format:
        // R: Perceptual Smoothness
        // G: F0/Metalness
        // B: Porosity/SSS (set to 0)
        // A: Emission
        output[i] = smoothnessValue;     // R: Smoothness
        output[i + 1] = f0Value;         // G: F0/Metalness
        output[i + 2] = 0;               // B: Porosity (unused)
        output[i + 3] = emissiveValue;   // A: Emission
    }

    await sharp(output, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
    .png()
    .toFile(outputPath);
}

/**
 * Convert DirectX normal map to OpenGL format
 * DirectX uses Y-down, OpenGL uses Y-up
 */
async function convertNormalDXtoGL(inputPath: string, outputPath: string): Promise<void> {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Extract raw RGBA pixel data
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const output = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0; i < data.length; i += 4) {
        output[i] = data[i];           // R: X (unchanged)
        output[i + 1] = 255 - data[i + 1]; // G: Y (inverted for OpenGL)
        output[i + 2] = data[i + 2];   // B: Z (unchanged)
        output[i + 3] = data[i + 3];   // A: (unchanged)
    }

    await sharp(output, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
    .png()
    .toFile(outputPath);
}

/**
 * Process all textures in a subpack
 */
async function processSubpack(size: number): Promise<void> {
    const inputDir = path.join(BEDROCK_SUBPACKS, `${size}x`, 'textures', 'blocks');
    const outputDir = path.join(JAVA_OUTPUT, `${size}x`, 'assets', 'rainbow', 'textures', 'block');

    await fs.ensureDir(outputDir);

    const files = await fs.readdir(inputDir);

    // Process MER files
    const merFiles = files.filter(f => f.endsWith('_mer.png'));
    console.log(`[${size}x] Converting ${merFiles.length} MER textures to LabPBR _s...`);

    for (const file of merFiles) {
        const inputPath = path.join(inputDir, file);
        const outputName = file.replace('_mer.png', '_s.png');
        const outputPath = path.join(outputDir, outputName);

        try {
            await convertMerToLabPBR(inputPath, outputPath);
        } catch (err) {
            console.error(`  Error converting ${file}:`, err);
        }
    }

    // Process normal maps
    const normalFiles = files.filter(f => f.endsWith('_normal.png'));
    console.log(`[${size}x] Converting ${normalFiles.length} normal maps DX→GL...`);

    for (const file of normalFiles) {
        const inputPath = path.join(inputDir, file);
        const outputName = file.replace('_normal.png', '_n.png');
        const outputPath = path.join(outputDir, outputName);

        try {
            await convertNormalDXtoGL(inputPath, outputPath);
        } catch (err) {
            console.error(`  Error converting ${file}:`, err);
        }
    }

    // Copy basecolor textures (no conversion needed)
    const basecolorFiles = files.filter(f => f.endsWith('_basecolor.png'));
    console.log(`[${size}x] Copying ${basecolorFiles.length} basecolor textures...`);

    for (const file of basecolorFiles) {
        const inputPath = path.join(inputDir, file);
        const outputName = file.replace('_basecolor.png', '.png');
        const outputPath = path.join(outputDir, outputName);

        await fs.copy(inputPath, outputPath);
    }

    console.log(`[${size}x] Complete!`);
}

/**
 * Create pack.mcmeta for resource pack
 */
async function createPackMcmeta(size: number): Promise<void> {
    const packMeta = {
        pack: {
            pack_format: 34,
            description: `Rainbow III ${size}x HD Textures with LabPBR`
        }
    };

    const outputPath = path.join(JAVA_OUTPUT, `${size}x`, 'pack.mcmeta');
    await fs.writeJson(outputPath, packMeta, { spaces: 4 });
}

/**
 * Create ZIP resource pack
 */
async function createZip(size: number): Promise<void> {
    const inputDir = path.join(JAVA_OUTPUT, `${size}x`);
    const outputZip = path.join(JAVA_OUTPUT, `rainbow-${size}x-labpbr.zip`);

    // Use Bun's native zip if available, otherwise use archiver
    const { execSync } = await import('child_process');

    // Use PowerShell to create zip
    const command = `powershell -Command "Compress-Archive -Path '${inputDir}\\*' -DestinationPath '${outputZip}' -Force"`;
    execSync(command);

    console.log(`Created: ${outputZip}`);
}

async function main(): Promise<void> {
    console.log('=== Rainbow III PBR Converter ===');
    console.log('Converting Bedrock RTX → Java LabPBR format\n');

    // Clean output directory
    await fs.remove(JAVA_OUTPUT);
    await fs.ensureDir(JAVA_OUTPUT);

    for (const size of SUBPACK_SIZES) {
        console.log(`\nProcessing ${size}x subpack...`);
        await processSubpack(size);
        await createPackMcmeta(size);
        await createZip(size);
    }

    console.log('\n=== Conversion Complete ===');
    console.log(`Output: ${JAVA_OUTPUT}`);
}

main().catch(console.error);

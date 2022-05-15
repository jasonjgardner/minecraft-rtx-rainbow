import { JSZip } from "jszip/mod.ts";
import { encode } from "encoding/base64.ts";
import { extname } from "path/mod.ts";

const zip = new JSZip();

const contentsFile: Array<{ path: string }> = [];

function sanitizeFilename(filepath: string) {
  return filepath.trim().toLowerCase().replaceAll(/\s+/g, "_");
}

function addToPack(filepath: string, contents: string | Uint8Array) {
  const ext = extname(filepath).toLowerCase();
  const isImage = contents instanceof Uint8Array &&
    [".gif", ".jpeg", ".jpg", ".png"].includes(ext);

  const data = isImage ? encode(contents) : contents;
  const filename = sanitizeFilename(filepath);

  zip.addFile(
    filename,
    data,
    { base64: isImage, createFolders: true },
  );

  contentsFile.push({
    path: filename,
  });
}

export function addToBehaviorPack(
  key: string,
  contents: string | Uint8Array,
) {
  try {
    addToPack(`BP/${key}`, contents);
  } catch (err) {
    console.error('Failed adding %s to behavior pack! "%s"', key, err);
  }
}

export function addToResourcePack(
  key: string,
  contents: string | Uint8Array,
) {
  try {
    addToPack(`RP/${key}`, contents);
  } catch (err) {
    console.error('Failed adding %s to behavior pack! "%s"', key, err);
  }
}

export function createArchive() {
  // Generate contents.json on finish
  // https://wiki.bedrock.dev/concepts/contents.html#contents-json
  zip.addFile(
    sanitizeFilename("RP/contents.json"),
    JSON.stringify({
      content: contentsFile,
      version: 1,
    }),
  );

  return zip.generateAsync({
    mimeType: "application/zip", // TODO: Does .mcaddon have a mimetype?
    platform: "DOS",
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 1,
    },
  });
}

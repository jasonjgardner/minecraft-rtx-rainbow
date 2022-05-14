import { JSZip } from "jszip/mod.ts";
import { Image } from "imagescript/mod.ts";
import { encode } from "https://deno.land/std@0.139.0/encoding/base64.ts";
import { extname } from "path/mod.ts";

interface PackState {
  [k: string]: string;
}

const zip = new JSZip();

const state: PackState = {};

function addToPack(filepath: string, contents: string | Uint8Array) {
  const ext = extname(filepath).toLowerCase();
  const isImage = contents instanceof Uint8Array &&
    [".gif", ".jpeg", ".jpg", ".png"].includes(ext);

  const data = isImage ? encode(contents) : contents;

  zip.addFile(
    filepath.trim().toLowerCase().replaceAll(/\s+/g, "_"),
    data,
    { base64: isImage },
  );
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

export function getState() {
  return {
    ...state,
  };
}

export async function createArchive() {
  await zip.writeZip("./rainbow.mcaddon");
}

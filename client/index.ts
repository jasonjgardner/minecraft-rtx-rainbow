/// <reference lib="dom" />
/// <reference lib="esnext" />
import { RGBA } from "/typings/types.ts";
//import { rgbaMatch } from "../src/_utils.ts";

const ALLOWED_TYPES = ["image/jpeg", "image/gif", "image/png"];
const MAX_SIZE = 64;

function collectColors(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors: RGBA[] = [];

  const imageData = ctx?.getImageData(0, 0, x, y);

  const data = imageData ? imageData.data : null;
  const len = Math.min(MAX_SIZE * MAX_SIZE * 4, data?.length || 0);

  if (!data || !len) {
    throw Error("Invalid image data");
  }

  for (let itr = 0; itr < len; itr += 4) {
    const alpha = data[itr + 3] / 255;

    if (alpha < 0.5) {
      continue;
    }

    const rgba: RGBA = [data[itr], data[itr + 1], data[itr + 2], alpha];

    colors.push(rgba);
  }

  return colors;
}

function resizeImageInput(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
): RGBA[] {
  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;

  const aspectRatio = originalWidth / originalHeight;

  let newWidth = Math.min(MAX_SIZE, originalWidth);
  let newHeight = newWidth / aspectRatio;

  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d", {
    alpha: true,
  });

  ctx?.drawImage(img, 0, 0, newWidth, newHeight);

  const colors = [];

  if (ctx) {
    colors.push(...collectColors(ctx, newWidth, newHeight));
  }

  return colors;
}

function processImageInput(
  file: File,
): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();

      // @ts-ignore Source is read as data URL
      img.src = reader.result ?? "https://placekitten.com/64/64";

      img.onload = () => {
        res(img);
      };
    };

    reader.onerror = () => rej(new Error("Failed reading file"));
  });
}

globalThis.addEventListener("DOMContentLoaded", () => {
  const imageInput: HTMLInputElement = document.getElementById(
    "palette-source",
  ) as HTMLInputElement;

  const previewContainer: HTMLElement = document.getElementById(
    "preview-container",
  ) as HTMLElement;
  const previewCanvas = document.getElementById(
    "preview",
  ) as HTMLCanvasElement;
  const form: HTMLFormElement = document.forms.namedItem(
    "config",
  ) as HTMLFormElement;
  const downloadLink = document.getElementById(
    "downloadLink",
  ) as HTMLAnchorElement;
  const generateBtn = document.getElementById("generate") as HTMLButtonElement;
  const imgValue: HTMLInputElement = document.getElementById(
    "img_value",
  ) as HTMLInputElement;

  downloadLink.hidden = true;

  async function onInput() {
    if (!imageInput || !imageInput.files?.length) {
      throw Error("Failed retrieving image preview");
    }

    downloadLink.href = "#";
    downloadLink.classList.remove("flex");
    downloadLink.classList.add("hidden");

    const img = await processImageInput(
      imageInput.files[0],
    );

    img.classList.add("image-preview");

    for (const k in previewContainer.children) {
      const child = previewContainer.children[k];

      if (
        child instanceof HTMLImageElement &&
        child.classList.contains("image-preview")
      ) {
        previewContainer.removeChild(child);
      }
    }

    if (imageInput.files[0].name.endsWith(".gif")) {
      previewContainer.appendChild(img);
      previewCanvas.classList.add("hidden");
      imgValue.value = img.src;
      return;
    }

    previewCanvas.classList.remove("hidden");
    resizeImageInput(img, previewCanvas);
    imgValue.value = previewCanvas.toDataURL();
  }

  if (form && imageInput) {
    form.addEventListener(
      "submit",
      async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        generateBtn.disabled = true;

        const data = new FormData(form);

        data.set(
          "materials",
          [...form.materials.options].filter((o) => o.selected).map((
            { value },
          ) => value).join(","),
        );

        data.set("size", form.pack_size.value || 16);
        data.delete("pack_size");
        data.set("img_name", form.img_name.value || "input");

        data.set("img", form.img_value.value);

        data.delete("img_value");
        data.delete(imageInput.name);

        const ns = data.get("namespace") ?? "generated";

        try {
          const res = await fetch(form.action, {
            method: "post",
            body: data,
          });
          const blob = await res.blob();

          downloadLink.href = URL.createObjectURL(
            blob,
          );
          downloadLink.classList.add("flex");
          downloadLink.hidden = false;
          downloadLink.classList.remove("hidden");
          downloadLink.download = `${ns ? ns : "generated"}.mcaddon`;
        } catch (err) {
          console.error(err);
        }

        generateBtn.disabled = false;
      },
    );
  }

  if (imageInput) {
    try {
      imageInput.addEventListener(
        "input",
        onInput,
      );
    } catch (err) {
      console.log(err);
    }
  }

  downloadLink.addEventListener("click", function initiateDownload() {
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 500);
  });
});

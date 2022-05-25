/// <reference lib="dom" />
/// <reference lib="esnext" />
const ALLOWED_TYPES = ["image/jpeg", "image/gif", "image/png"];
function processImageInput(file: File): Promise<HTMLImageElement> {
  const fileName = file.name.substring(0, file.name.indexOf(".")).trim();

  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();

      // @ts-ignore Source is read as data URL
      img.src = reader.result ?? "https://placekitten.com/64/64";
      img.alt = fileName;
      img.className = "image-preview";

      img.onload = () => {
        img.width = Math.min(64, img.naturalWidth);

        res(img);
      };
    };

    reader.onerror = () => rej(new Error("Failed reading file"));
  });
}

globalThis.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById(
    "palette-source",
  ) as HTMLInputElement;

  const previewContainer = document.getElementById("preview");
  const form = document.forms.namedItem("config");
  const downloadLink = document.getElementById(
    "downloadLink",
  ) as HTMLAnchorElement;

  downloadLink.hidden = true;

  if (form && imageInput) {
    form.addEventListener(
      "submit",
      async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const data = new FormData(form);
        const paletteFile = imageInput.files?.length
          ? imageInput.files[0]
          : null;

        if (paletteFile !== null) {
          const b64: string = await (new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(paletteFile);
            reader.onload = () => {
              if (reader.result && typeof reader.result === "string") {
                // @ts-ignore result will be base64 string
                return res(reader.result.toString().split(",").pop());
              }
              rej("Invalid file contents");
            };

            reader.onerror = () =>
              rej(new Error("Failed loading palette image as data URL"));
          }));

          data.set(
            "img",
            b64,
          );

          data.delete(imageInput.name);
        }

        data.set(
          "materials",
          [...form.materials.options].filter((o) => o.selected).map((
            { value },
          ) => value).join(","),
        );

        try {
          const res = await fetch(form.action, {
            method: "post",
            body: data,
          });
          const blob = await res.blob();

          downloadLink.href = URL.createObjectURL(
            blob,
          );
          downloadLink.hidden = false;
        } catch (err) {
          console.error(err);
        }
      },
    );
  }

  async function onInput() {
    if (!imageInput || !imageInput.files?.length) {
      throw Error("Failed retrieving image preview");
    }

    let itr = Math.min(10, imageInput.files.length);
    const previews: Promise<HTMLImageElement>[] = [];

    while (itr--) {
      const file = imageInput.files[itr];

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw Error("Unsupported file type");
      }

      previews.push(processImageInput(file));
    }

    if (previewContainer) {
      (await Promise.all(previews)).forEach((imgElement) => {
        previewContainer.appendChild(imgElement);
      });
    }
  }

  if (imageInput && previewContainer) {
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

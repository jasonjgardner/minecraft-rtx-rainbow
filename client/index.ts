/// <reference lib="dom" />
/// <reference lib="esnext" />
const ALLOWED_TYPES = ["image/jpeg", "image/gif", "image/png"];
const MAX_SIZE = 64;
function processImageInput(file: File, canvas: HTMLCanvasElement): Promise<string> {
  const fileName = file.name.substring(0, file.name.indexOf(".")).trim();

  const ctx = canvas.getContext('2d', {
    alpha: true
  });

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
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
 
        const aspectRatio = originalWidth / originalHeight;
 
        let newWidth = Math.min(MAX_SIZE, originalWidth);
        let newHeight = newWidth / aspectRatio;
 
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        res(canvas.toDataURL());
      };
    };

    reader.onerror = () => rej(new Error("Failed reading file"));
  });
}

globalThis.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById(
    "palette-source",
  ) as HTMLInputElement;

  const previewContainer = document.getElementById("preview") as HTMLCanvasElement;
  const form = document.forms.namedItem("config");
  const downloadLink = document.getElementById(
    "downloadLink",
  ) as HTMLAnchorElement;
  const generateBtn = document.getElementById('generate') as HTMLButtonElement;

  downloadLink.hidden = true;

  if (form && imageInput) {
    form.addEventListener(
      "submit",
      async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        generateBtn.disabled = true;

        const data = new FormData(form);


        data.set("img", previewContainer.toDataURL());

        data.delete(imageInput.name);

        data.set(
          "materials",
          [...form.materials.options].filter((o) => o.selected).map((
            { value },
          ) => value).join(","),
        );

        data.set('size', form.pack_size.value || 16);
        data.delete('pack_size');
        data.set('img_name', form.img_name.value || 'input');

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
          downloadLink.download = `${
           ns ? ns : "generated"
          }.mcaddon`;
        } catch (err) {
          console.error(err);
        }

        generateBtn.disabled = false;
      },
    );
  }

  async function onInput() {
    if (!imageInput || !imageInput.files?.length) {
      throw Error("Failed retrieving image preview");
    }

    downloadLink.href = '#';
    downloadLink.classList.remove('flex');
    downloadLink.classList.add('hidden');

    processImageInput(imageInput.files[0], previewContainer);
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

import { launch } from "https://deno.land/x/astral@0.3.0/mod.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
export default async function run(url: string) {
  // Launch the browser
  const browser = await launch({
    headless: false,
  });
  const page = await browser.newPage(url);
  console.log("opened %s", url);
  // Take a screenshot of the page and save that to disk
  const screenshot = await page.screenshot();
  console.log("took screenshot!");

  const decoded = await Image.decode(screenshot);

  Deno.writeFileSync("./screenshot.png", screenshot);
  console.log("wrote screenshot!");

  // Close the browser
  await browser.close();
  console.log("closed browser");

  return decoded;
}

if (import.meta.main) {
    const url = Deno.args[0] ?? "https://deno.land";
    const decoded = await run(url);
    const resized = decoded.resize(256, Image.RESIZE_AUTO);
    await Deno.writeFile("./resized.png", await resized.encode());
    console.log("wrote resized image!");
}
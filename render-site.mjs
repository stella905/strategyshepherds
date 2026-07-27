import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "qa");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const checks = [
  ["index.html", 1440, 1000, "home-desktop.png"],
  ["sovereign-story-intensive.html", 1440, 1000, "intensive-desktop.png"],
  ["index.html", 390, 844, "home-mobile.png"],
  ["creator-day-africa.html", 390, 844, "creator-mobile.png"],
  ["visible-expert-masterclass.html", 1440, 1000, "visible-expert-desktop.png"],
  ["visibility-quiz.html", 390, 844, "visibility-quiz-mobile.png"],
];

for (const [file, width, height, screenshot] of checks) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto(pathToFileURL(join(root, file)).href, { waitUntil: "load" });
  await page.screenshot({ path: join(output, screenshot), fullPage: true });
  if (consoleErrors.length) {
    throw new Error(`${file} console errors: ${consoleErrors.join(" | ")}`);
  }
  await page.close();
}

await browser.close();
console.log(`Rendered ${checks.length} desktop and mobile QA screenshots.`);

import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const htmlFiles = (await readdir(root)).filter((name) => name.endsWith(".html"));
const errors = [];
const warnings = [];
const allowUnconfiguredForms = process.env.ALLOW_UNCONFIGURED_FORMS === "1";

const localTarget = (href, currentFile) => {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("{{")
  ) {
    return null;
  }

  const [path] = href.split("#");
  const resolved = resolve(root, dirname(currentFile), path || currentFile);
  return basename(resolved);
};

for (const file of htmlFiles) {
  const html = await readFile(join(root, file), "utf8");
  const isRedirect = html.includes('http-equiv="refresh"');

  if (!html.startsWith("<!doctype html>")) errors.push(`${file}: missing lowercase HTML doctype`);
  if (!/<html lang="en-GB">/.test(html)) errors.push(`${file}: missing en-GB language`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${file}: missing title`);
  if (!isRedirect && !/<meta name="description" content="[^"]+">/.test(html)) {
    errors.push(`${file}: missing meta description`);
  }
  if (!/<link rel="canonical" href="[^"]+">/.test(html)) errors.push(`${file}: missing canonical URL`);

  const h1Count = (html.match(/<h1(?:\s[^>]*)?>/g) || []).length;
  if (!isRedirect && h1Count !== 1) errors.push(`${file}: expected one h1, found ${h1Count}`);

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${file}: image missing alt attribute`);
    if (!/\bwidth="\d+"/.test(match[0]) || !/\bheight="\d+"/.test(match[0])) {
      warnings.push(`${file}: image should declare width and height`);
    }
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of html.matchAll(/\bhref="([^"]*)"/g)) {
    const href = match[1];
    if (!href) errors.push(`${file}: empty href`);
    const target = localTarget(href, file);
    if (target && !htmlFiles.includes(target) && !["styles.css", "script.js"].includes(target)) {
      errors.push(`${file}: broken local link ${href}`);
    }

    const [, fragment] = href.split("#");
    if (target && fragment) {
      const targetHtml = await readFile(join(root, target), "utf8");
      if (!targetHtml.includes(`id="${fragment}"`)) {
        errors.push(`${file}: missing fragment #${fragment} in ${target}`);
      }
    }
  }

  for (const match of html.matchAll(/\bsrc="([^"]*)"/g)) {
    const src = match[1];
    if (src.startsWith("http://") || src.startsWith("https://")) continue;
    const [path] = src.split("?");
    const resolved = basename(resolve(root, dirname(file), path));
    if (!["script.js", "form-config.js"].includes(resolved)) {
      errors.push(`${file}: missing local script ${src}`);
    }
  }

  for (const formMatch of html.matchAll(/<form\b[\s\S]*?<\/form>/g)) {
    const form = formMatch[0];
    if (!/data-website-form/.test(form)) errors.push(`${file}: form missing website-form hook`);
    if (!/name="form_id"\s+value="[^"]+"/.test(form)) errors.push(`${file}: form missing form ID`);
    if (!/<button\b[^>]*type="submit"/.test(form)) errors.push(`${file}: form missing submit button`);
  }
}

const placeholderHits = [];
for (const file of [...htmlFiles, "build-site.mjs"]) {
  const content = await readFile(join(root, file), "utf8");
  if (content.includes("{{FORM_")) placeholderHits.push(file);
}

if (placeholderHits.length) {
  errors.push(`Legacy Google Forms placeholders remain in: ${placeholderHits.join(", ")}`);
}

const formConfig = await readFile(join(root, "form-config.js"), "utf8");
if (formConfig.includes("REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL")) {
  const message = "Form receiver URL is not configured in form-config.js";
  if (allowUnconfiguredForms) warnings.push(message);
  else errors.push(message);
}

if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files with no structural or internal-link errors.`);

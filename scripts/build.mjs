// Erzeugt tokens.css aus tokens.json. `--check` schlägt fehl, wenn tokens.css veraltet ist.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const tokens = JSON.parse(readFileSync(new URL("tokens.json", root), "utf8"));

const vars = (set, indent) =>
  Object.entries(set).map(([k, v]) => `${indent}--${k}: ${v};`).join("\n");

export function css(t = tokens) {
  const base = [
    `  --font-sans: ${t.font.stack};`,
    `  --font-weight-text: ${t.font.weight.text};`,
    `  --font-weight-headline: ${t.font.weight.headline};`,
    `  --radius: ${t.radius};`,
  ].join("\n");
  return `/* RJ. Design System – generiert aus tokens.json, nicht von Hand ändern. */

/* Dunkel (Standard) */
:root {
${base}
${vars(t.color.dark, "  ")}
  color-scheme: dark;
}

/* Hell */
:root[data-theme="light"] {
${vars(t.color.light, "  ")}
  color-scheme: light;
}

/* System: folgt dem Gerät */
@media (prefers-color-scheme: light) {
  :root[data-theme="system"] {
${vars(t.color.light, "    ")}
    color-scheme: light;
  }
}
`;
}

const target = new URL("tokens.css", root);
if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== css()) {
    console.error("tokens.css ist veraltet: npm run build ausführen.");
    process.exit(1);
  }
} else if (process.argv[1] === new URL(import.meta.url).pathname) {
  writeFileSync(target, css());
}

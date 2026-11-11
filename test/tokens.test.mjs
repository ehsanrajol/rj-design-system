import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const tokens = JSON.parse(read("tokens.json"));
const pkg = JSON.parse(read("package.json"));

test("Hell und Dunkel haben dieselben Tokens", () => {
  assert.deepEqual(Object.keys(tokens.color.light), Object.keys(tokens.color.dark));
});

test("Markenblau, Jost und keine Radien", () => {
  assert.equal(tokens.color.dark.accent, "#192bc2");
  assert.equal(tokens.color.light.accent, "#192bc2");
  assert.equal(tokens.font.family, "Jost");
  assert.deepEqual(tokens.font.weight, { text: 400, headline: 500 });
  assert.equal(tokens.radius, 0);
});

// WCAG-Kontrast für deckende Hex-Farben.
const lum = (hex) => {
  const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

test("Text und blaue Schrift erreichen 4,5:1 auf dem Grund", () => {
  for (const mode of ["dark", "light"]) {
    const c = tokens.color[mode];
    assert.ok(contrast(c.text, c.bg) >= 4.5, `${mode}: text`);
    assert.ok(contrast(c["accent-ink"], c.bg) >= 4.5, `${mode}: accent-ink`);
    assert.ok(contrast(c["accent-contrast"], c.accent) >= 4.5, `${mode}: accent-contrast`);
  }
});

test("Jeder Export zeigt auf eine vorhandene Datei", () => {
  for (const [key, target] of Object.entries(pkg.exports)) {
    const file = key.endsWith("*") ? "fonts/jost-latin-variable.woff2" : target;
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), key);
  }
});

test("Regression: tokens.css enthält jedes Token in beiden Themen", () => {
  const css = read("tokens.css");
  for (const k of Object.keys(tokens.color.dark))
    assert.equal(css.split(`--${k}:`).length - 1, 3, k);
});

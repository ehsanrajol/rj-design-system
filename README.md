# RJ. Design System

Markentokens und Schrift für EOS, ehsanrajol.com, Content Studio und Style.
Eine Quelle (`tokens.json`), daraus wird `tokens.css` erzeugt.

## Installation

```bash
npm install @ehsanrajol/rj-design-system
```

## Nutzung

CSS (ohne React, ohne Build-Werkzeug):

```css
@import "@ehsanrajol/rj-design-system/fonts.css";
@import "@ehsanrajol/rj-design-system/tokens.css";

body { background: var(--bg); color: var(--text); font-family: var(--font-sans); }
```

JSON (z. B. für Diagramme oder Tests):

```js
import tokens from "@ehsanrajol/rj-design-system/tokens.json" with { type: "json" };
```

| Export | Inhalt |
|---|---|
| `./tokens.css` | Variablen. Dunkel ist Standard, `data-theme="light"` schaltet auf Hell, `data-theme="system"` folgt dem Gerät. |
| `./tokens.json` | Dieselben Werte als JSON |
| `./fonts.css` | `@font-face` für Jost (400 Text, 500 Headlines) |
| `./fonts/*` | Jost als WOFF2 mit Lizenz (SIL OFL 1.1) |

Regeln: Markenblau `#192BC2` für Flächen (`--accent`), blaue Schrift und Rahmen
über `--accent-ink`. Keine Radien (`--radius: 0`), keine Verläufe, Schatten nur
bei Dialogen.

## Wartung

1. Werte nur in `tokens.json` ändern, dann `npm run build` und `npm test`.
2. Version in `package.json` nach SemVer erhöhen (neues Token: Minor, geänderter
   Wert: Patch, entferntes oder umbenanntes Token: Major).
3. Nach dem Merge auf `main` bereitet der Workflow `Release` die neue
   Version mit `npm stage publish` vor und setzt das Tag `vX.Y.Z`.
4. Der Owner gibt sie auf npmjs.com (oder mit `npm stage approve <id>`) mit 2FA
   frei. Erst dann ist sie installierbar.

Rollback: in der App die Vorversion festlegen (`npm install @ehsanrajol/rj-design-system@<vorher>`).
Das Secret `NPM_TOKEN` ist ein npm-Token mit „Read and write (stage only)“.

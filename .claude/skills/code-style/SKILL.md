---
name: code-style
description: Use when writing, editing, or reviewing any JS, HTML, CSS, or JSON in this project. Enforces the ASCII-only rule (non-ASCII as \uXXXX) and documents naming, formatting, and structure so new code matches the codebase.
---

# Code style

Browser extension (Manifest V3/V2) for lichess.org. All source (`.js`, `.html`, `.css`, `.json`) must match the existing codebase.

## ASCII only (mandatory)

- Only ASCII characters in source — no accents, arrows, emoji, curly quotes, or non-breaking spaces.
- Encode non-ASCII as JavaScript escapes:
  - BMP `\uXXXX`: `ă`=`\u0103`, `â`=`\u00e2`, `î`=`\u00ee`, `ș`=`\u015f`, `ț`=`\u0163`, `→`=`\u2192`, `←`=`\u2190`.
  - Astral/emoji = UTF-16 surrogate pairs: 💾=`\uD83D\uDCBE`, 🪞=`\uD83E\uDE9E`.
  - Custom icon font = Private Use Area `\uE000`+ (see `icon` map in `scripts/lichessTools.js`).
- Escapes live in JS string literals (`intl`, `icon`). CSS/HTML stay ASCII; if unavoidable use `\XXXX ` (CSS) or `&#xXXXX;` (HTML).
- Newlines in strings are `\r\n` (repo uses CRLF), e.g. `'undo last move\r\nAvoid abusing it'`.

## Files & naming

- `scripts/lichessTools-*.js` (kebab-case); tools in `tools/<camelCaseName>/tool.js` (+ optional `tool.css`, `context.md`); `styles/` + root pages (`popup.html`, `background.html`); `manifest.json` (+ `.chrome`/`.edge`/`.ff`). Add new files to `manifest.json` in dependency order.
- Same code runs on Chromium, Firefox, and Edge — only the manifests differ. Each browser flavor is a `manifest.json.<browser>` (`manifest.json.chrome`, `.edge`, `.ff`) that must stay synchronized with the main `manifest.json`.
- Classes PascalCase; tools are `<Feature>Tool extends LiChessTools.Tools.ToolBase`, registered as `LiChessTools.Tools.<Feature>`.
- Methods/vars/properties/preference keys camelCase; dependencies as PascalCase strings.
- CSS classes/ids prefixed `lichessTools-` (root `lichessTools-<camelCaseName>`, children hyphenated: `.dialog-content`, `.showSettings`).
- Translation keys dot-separated camelCase (`options.analysis`); plurals `:one`/`:other`; languages `'en-US'`, `'ro-RO'`, `<lang>-crowdin`.

## JavaScript

- 2-space indent; IIFE `(() => { ... })();`; single quotes; semicolons; `const`/`let` (never `var`); arrow functions; `?.` used freely.
- When writing code: prefer arrow functions for inner callbacks; use concise modern syntax; declare variables close to first use; no explanatory comments inside functions unless very short and truly necessary (or asked); keep code compact and flat (no extra blank lines inside functions); don't wrap functions in extra explanatory text unless asked; always expand an acronym or domain-specific term before using it.
- Class fields on the body (constructor reserved for injecting `lichessTools`):

```js
(() => {
  class MyFeatureTool extends LiChessTools.Tools.ToolBase {
    dependencies = ['Stockfish', 'Dialog'];
    preferences = [{ name: 'myFeature', category: 'analysis', type: 'single', possibleValues: [false, true], defaultValue: true, advanced: true }];
    intl = { 'en-US': { 'options.myFeature': 'My feature', 'myFeatureLabel': 'Label: %s' }, 'ro-RO': { 'options.myFeature': 'Func\u0163ia mea' } }
    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('myFeature');
      this.logOption('My feature', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      // bind/unbind handlers, modify DOM, wrap functions
    }
  }
  LiChessTools.Tools.MyFeature = MyFeatureTool;
})();
```

- Patterns: start with `const lt = this.lichessTools; const $ = lt.$;`; DOM via Cash `$('<a>').addClass(...).text(...).attr(...).on(...)`; i18n `trans.noarg('k')` / `trans.plural('k', n, ...args)` with `%s`/`%1$s`; events `lt.pubsub.on/off` (matching `off` in `start()`); wrapping `lt.wrapFunction(t, { id, before, after })` / `lt.unwrapFunction(t, id)`; prefs `lt.currentOptions.getValue(name)` + `lt.isOptionSet(value, 'flag')`; state `lt.storage.set/get('LiChessTools.<tool>', ...)`.

## CSS

2-space; one declaration per line; trailing `;`; scope every rule under `body.lichessTools` (`body.lichessTools dialog.lichessTools-myFeature .dialog-content { ... }`); prefer lichess vars (`var(--accuracy-color)`); colors hex (3/6/8) or named, alpha via 8-digit (`#00000020`); avoid `!important`.

## HTML

2-space; double-quoted attributes; `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8" />`; self-closing voids `<meta ... />`/`<img ... />`; relative paths `./scripts|styles|images/...`; keep minimal (UI built in JS).

## JSON

2-space; double-quoted keys; alphabetize long lists (e.g. `manifest.json`) or keep grouping.

## Checklist

ASCII-only `\uXXXX`/`\r\n` · 2-space + single quotes + semicolons + `const`/`let` + arrows · IIFE + `<Feature>Tool extends ToolBase` · camelCase + `lichessTools-` + dotted keys · `const lt=...; const $=lt.$;` · `start()` reads pref, logs, cleans `off` · manifest order.

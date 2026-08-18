# DetectThirdParties Tool

## Purpose

Detects whether third-party modifications are present on the Lichess page, specifically:
- **Prettier** — a board styling modification (detected via CSS custom property `--boardLightRGB`)
- **LichessHelper** — another extension/tool (detected by searching style elements for "LichessHelper" text)

## How It Works

### Detection Methods

1. **Prettier detection**: Checks if `$('html').css('--boardLightRGB')` exists. If undefined, auto-detects on start; otherwise uses stored value.
2. **LichessHelper detection**: Searches all `<style>` elements in the document for text containing "LichessHelper".

### Body Class Toggle

Sets body classes based on detection results:
- `lichessTools-prettier` — when Prettier detected
- `lichessTools-lichessHelper` — when LichessHelper detected

These classes are used by other tools (like themes) to adjust behavior for third-party modifications.

## Dependencies

None explicitly listed.

## Preferences

- `fixAbortController` — single type, default true, advanced/hidden (Note: this preference name appears in the file but belongs to FixAbortController tool; this is likely a copy-paste artifact)

## Key Methods

- `foundStyleContaining(str)` — searches style elements for text
- `async start()` — performs detection and sets body classes

# Font Icons Tool — Context

## Overview

The **FontIconsTool** restores Lichess font-based icons by loading a custom icon font (`lichessTools.woff2`) bundled with the extension and registering it as a `FontFace`. This is used as a fallback so tools can keep using the legacy font icon classes (e.g. `icon-DiscBig`) after Lichess moved to SVG icons.

## Preferences

- **name**: `fontIcons`
- **category**: `general`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)
- **hidden**: `true` (not shown in the preferences UI)

## Behavior

### Load Font (`loadLtFont`)

- Gets the font URL via `lt.comm.getChromeUrl("tools/fontIcons/lichessTools.woff2")`.
- Creates a `FontFace` named `"lichessTools"` with `display: 'block'`.
- Loads it, and on success adds it to `document.fonts` and toggles the `lichessTools-fontIcons` class on `<body>`.

### Start

- Toggles `lichessTools-fontIcons` off on `<body>`.
- When enabled, checks `document.fonts` for an existing `lichess` or `lichessTools` font; if none is found, loads the custom font via `loadLtFont()`.

## Internationalization (intl)

Translations provided for en-US and ro-RO: "Restore font icons" option label.

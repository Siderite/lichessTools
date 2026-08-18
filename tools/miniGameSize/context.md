# Mini Game Size Tool

## Purpose

Allows the user to set a custom size for mini-game board displays via a CSS variable.

## Preference

- **name**: `miniGameSize`
- **category**: `general`
- **type**: `number` (numeric input)
- **advanced**: true (only visible in Advanced Preferences)
- **defaultValue**: undefined (not set by default)

## Behavior

When the preference value is set (a positive number):
1. Adds class `lichessTools-miniGameSize` to `<body>`
2. Sets CSS variable `--lichessToolsMiniGameSize` on `<body>` to the value in `rem` units

When unset: removes the class and clears the CSS variable.

## Effect

The CSS variable `--lichessToolsMiniGameSize` controls the size of mini-game board elements throughout lichess.org pages. The actual CSS styling is defined elsewhere (likely in tool.css or injected stylesheets).
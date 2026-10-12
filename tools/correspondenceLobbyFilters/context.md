# Correspondence Lobby Filters Tool — Context

## Overview

The **CorrespondenceLobbyFiltersTool** adds a filter panel to the correspondence seeks in the Lichess lobby (`/lobby`, `main.lobby`). It lets the user filter seek rows by variant, days-per-turn, mode (casual/rated), and rating range. Filtered-out rows are hidden, and the user's own seeks are always kept visible.

## Preferences

- **name**: `correspondenceLobbyFilters`
- **category**: `appearance`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)
- **author**: `Mitchellpkt`

## Behavior

### Configuration Constants

- **variants**: `['standard', 'crazyhouse', 'chess960', 'kingOfTheHill', 'threeCheck', 'antichess', 'atomic', 'horde', 'racingKings']` (same list and order as the main lobby filter, lila `SetupUi.selectableVariants`).
- **dayStops**: `[1, 2, 3, 5, 7, 10, 14, Infinity]` (correspondence seeks only allow these days-per-turn, plus unlimited).
- **ratingRange**: `{ min: 400, max: 2900, step: 50, gap: 150 }` — the `gap` is the minimum distance between min and max so the knobs stay separated.
- **iconVariants**: maps lila perf icon names to variant keys (`PaperAirplane→standard`, `Crazyhouse→crazyhouse`, `DieSix→chess960`, `FlagKingHill→kingOfTheHill`, `ThreeCheckStack→threeCheck`, `Antichess→antichess`, `Atom→atomic`, `Keypad→horde`, `FlagRacingKings→racingKings`).
- **storageKey**: `LiChessTools.correspondenceLobbyFilters.filter`.

### Default Filter

`getDefaultFilter()` returns `{ variant: all variants, days: [0, dayStops.length - 1], mode: ['casual', 'rated'], rating: [min, max] }`. `isDefaultFilter()` compares variant/mode lengths and days/rating joined values. `getFilter()` reads the stored filter from `lt.storage` (validating lists against allowed values and clamping/re-gapping ranges), falling back to defaults.

### Parse Seek (`parseSeek`)

For each seek row (`tr.seek`), reads its `<td>` cells:
- **rating**: from cell index 1 (non-digits stripped).
- **days**: from cell index 2 (first number, or `Infinity` when unlimited).
- **variant**: from cell index 3's icon (`data-icon` attribute or `icon-*` class), looked up in `variantByIcon`.
- **rated**: `true`/`false`/`undefined` from cell index 3's text ("rated"/"casual").

### Match Filter (`matchesFilter`)

A seek matches when its variant is in the selected list, its day index (via `dayStops`) is within the selected days range, its mode is included, and its rating is within the rating range.

### Apply Filter (`applyFilter`)

- Iterates `tr.seek` rows; always shows the user's own seeks (`.cancel`) and rows matching the filter (or all rows when the filter is default).
- Toggles `lichessTools-seekShown` / `lichessTools-filteredOut` on each row.
- Toggles `lichessTools-filterActive` on `.lseeks` while a filter is active (CSS hides not-yet-checked rows to avoid flicker).
- Toggles `gamesFiltered` on the toggle button when any rows are hidden.

### Filter Panel (`buildPanel`)

Builds a `div.hook__filters.lichessTools-corrFilters` containing a `form` with a table of rows:
- **Variant row** (`filter-variant`): one checkbox per variant (via `checkable`), checked by default.
- **Days-per-turn row**: a stacked min/max slider pair over the `dayStops` range (see `rangePair`).
- **Mode row** (`inline`): `casual`/`rated` checkboxes.
- **Rating row**: a dual single-track min/max slider pair (range `400–2900`, step `50`, gap `150`).

`rangePair` builds a min/max slider pair in two layouts:
- **dual** (rating): both knobs on a single shared track with a `lichessTools-rangeTrack` background.
- **stacked** (days): min slider above, max slider below, each track graying out the span the other knob makes impossible, with the selected span highlighted. The label shows the selected value(s), collapsing to a single centered value when min == max.

The form's `change`/`input` handlers call `saveForm` (read form → `setFilter` → `applyFilter`). The reset button resets to the default filter and rebuilds the panel; submit closes the panel.

### Toggle & Refresh (`refresh`)

- Ensures a toggle button (`button.toggle.lichessTools-filterToggle`, gear/X icon) is prepended to `.lobby__app-seeks .lseeks`.
- When open, inserts the filter panel after the toggle; when closed, removes it and toggles `lichessTools-filterOpen` on the content.
- Calls `applyFilter()`.

### Start

- Requires `main.lobby` to be present; otherwise returns.
- Builds `variantByIcon` from `iconVariants` (both `lt.icon[name]` and lowercase name keys).
- Observes `.lobby__app` and `.hooks__list tbody` via `body.observer()` with `executeDirect: true` (runs inside the mutation callback before the next paint so re-rendered rows don't flash unfiltered), calling `refresh()`.

## Cleanup on Disable

When the preference is off: removes `.lichessTools-filterToggle` / `.lichessTools-corrFilters`, removes `lichessTools-filterOpen` / `lichessTools-filterActive` from `.lseeks`, and removes `lichessTools-filteredOut` / `lichessTools-seekShown` from seek rows.

## CSS (`tool.css`)

- Hides `tr.lichessTools-filteredOut` and (while a filter is active) unchecked seek rows.
- Hides the seek list and "create" area while the filter panel is open.
- Styles the min/max range slider pairs (stacked and dual layouts), the shared rating track, knob positions via `--lt-lo-pos` / `--lt-hi-pos`, and the tick labels.

## Internationalization (intl)

Translations provided for en-US and ro-RO: filter toggle title, "min"/"max" captions, and reuse of lila's "variant"/"daysPerTurn"/"mode"/"ratingFilter"/"rated"/"casual"/"reset"/"apply" labels.

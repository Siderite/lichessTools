# Sticky Preview Tool

## Purpose

Keeps the study board in "Preview" (play) mode when switching chapters. Lichess native behavior resets the gamebook override to "analyse" on chapter change; this tool prevents that, keeping the board in play/preview mode persistently.

## Preference

- **name**: `stickyPreview`
- **category**: `study`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: true
- **advanced**: true

## Dependencies

Requires `EmitChapterChange` tool.

## Behavior

Only works when a study is present (`lichess.analysis?.study`).

When enabled:
1. Wraps `study.setGamebookOverride` with an `after` function that records the current override value into `previousOverride` (stored in localStorage as `LichessTools.previousOverride`)
2. Subscribes to `lichessTools.chapterChange` pubsub event — when a chapter changes, `keepPreviewOn()` checks if previous override was 'play' and if current override differs, then restores it to 'play' via setTimeout (100ms delay) + analysis redraw

The `previewHandler`:
- Bound to `button.preview` and `.feedback button.analyse` — captures the gamebookOverride when these buttons are clicked

When disabled: unwraps `setGamebookOverride`, unsubscribes from chapterChange event.

## Effect

Switching study chapters no longer resets the board to analysis mode; it stays in preview/play mode if that was the previous state.
# Analysis Read Comments Tool — Context

## Overview

The **AnalysisReadCommentsTool** reads aloud move comments during analysis/study mode using the browser's speech synthesis (text-to-speech). It is primarily designed for Interactive Lesson (gamebook) mode but also works in general analysis.

## Preferences

- **name**: `analysisReadComments`
- **category**: `analysis2` ("Analysis - minor")
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[enabled, stripEmoji, readAnnotations]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Reading Comments (`readComments`)

When triggered (on ply event):
1. Checks if `LiChessTools.dontReadComments` storage flag is set — if yes, stops reading.
2. Stops any current speech via `lt.stopSpeaking()`.
3. Gets the current analysis node and extracts its comments text via `lt.getNodeCommentsText(node)`.
4. Filters/comments into speakable text via `lt.getSpeakableText()` with options:
   - **stripEmoji**: removes emoji characters if enabled
   - **isCheck**: detects if SAN ends with "+" (check)
   - **isMate**: detects if SAN ends with "#" (mate)
   - **readAnnotations**: includes annotation text if enabled
   - **glyphs**: node glyph list
5. Compares speakable text against previous state: only speaks if the speakable content changed AND either FEN changed OR more than 2000ms elapsed since last speech.
6. If shouldSpeak and speakable has trimmed content: calls `lt.speak(speakable, { rate: 1.25 })` (speech at 1.25x speed).

### Toggle Button (`showInteractiveButton`)

- In Interactive Lesson (gamebook) mode, adds a toggle button in the comment container `.gamebook .comment`:
  - Icon: `lt.icon.Voice`
  - Title: "LiChess Tools - toggle comment reading"
  - Click toggles the `LiChessTools.dontReadComments` storage flag.
  - Button class `dontReadComments` reflects current state (when flag is set = don't read).
- Only shown once per container (tracked via `_analysisContextMenuActions` equivalent marker).

### Toggle Reading (`toggleReadingComments`)

- Flips the `LiChessTools.dontReadComments` storage value.
- When setting to true (don't read): stops current speech.
- When setting to false (read): triggers immediate `readComments()`.

## Event Handling

When enabled:
- Listens to `lichessTools.uiApi.events.ply` → triggers `readComments()` on each half-move.
- Immediately calls `readComments()` at start.
- Adds `beforeunload` event listener → calls `lt.stopSpeaking()` when page is about to unload (prevents speech continuing during navigation).

### Interactive Lesson Button

- Uses `$('main').observer()` to watch for `.gamebook` and `.gamebook .comment` elements appearing.
- When detected, calls `showInteractiveButton()`.

## Relay Exclusion

- Does not activate in relay studies (`lichess.analysis.study.relay`) — skipped entirely.

## Cleanup on Disable

When preference is off:
- Removes `ply` event listener.
- Removes `beforeunload` listener.
- Removes all `.lichessTools-readComments` buttons.
- Off observer for gamebook elements.
# Mobile Experience Tool - Context for LLM

## Purpose

The `mobileExperience` tool (folder `tools/mobileExperience/`) groups mobile/touch-specific UI and behavior for Lichess: evaluation gauge visibility, interactive-lesson layout, shape drawing (arrows/circles) on analysis and in-game boards, random-variation navigation, screen scroll lock, wake lock, clock/user swap, and horizontal scrub navigation. It is aimed at extension-capable mobile browsers (Kiwi, Firefox Android, etc.) and touch devices.

Category in preferences: `mobile` (shown as "Mobile devices").

## Files

| File | Role |
|------|------|
| `tool.js` | Class `MobileExperienceTool`: preferences, touch drawing, overlay Chessground, controls injection, screen/wake lock |
| `tool.css` | Mobile layout (gauge, two-row controls, shape button colors, overlay, lock icon, invert clocks, interactive extra buttons, color tooltip) |

## Dependencies

- `EmitRedraw` / `EmitChapterChange` - re-run `handleRedraw` when the board UI rebuilds
- `RandomVariation` - `lt.getRandomVariation` / `lt.getNextMoves` for the random-move button
- `DetectThirdParties` - environment checks
- `InterceptEventHandlers` - preserve original analysis-controls pointer handlers while adding custom taps

Also uses `lt.isMobile()`, `lt.isTouchDevice()`, `lt.getChessground()`, key handler `f` (flip), and optional legacy values from `puzzleOptions` / `tvOptions` wakeLock flags.

## Preferences

### `mobileExperience` (Mobile device features)

| Value | Default | Meaning |
|-------|---------|---------|
| `showGauge` | yes | Force eval gauge visible on narrow mobile analysis |
| `hideOctopus` | no | Hide interactive-lesson octopus mascot |
| `shapeDrawing` | no | Analysis/study shape-drawing button + touch handlers |
| `randomNextMove` | yes | Random next variation button in analysis jumps |
| `selectiveRandom` | yes | Hide random button unless current node has >1 next moves |
| `inInteractive` | no | Extra buttons (flip, shapes) during interactive lesson play |
| `hideStartEnd` | no | Hide first/last jump buttons |
| `hscrub` | no | Horizontal slide on controls to scrub moves (WIP) |

Default string: `showGauge,randomNextMove,selectiveRandom`  
Obsolete upgrade: former `lockBoard` value moved to `screenLock` in v2.4.0.

Commented-out options: `tapDrag` / `tapDragRound` (two-finger hold-and-draw) remain in code paths but are not offered in preferences.

### `mobileExperienceRound` (Mobile device game features, advanced)

| Value | Default | Meaning |
|-------|---------|---------|
| `shapeDrawingRound` | no | In-game/puzzle shape drawing via transparent board overlay |
| `standardButtons` | no | Restore full rcontrols button row on small screens |
| `invert` | no | Swap user/clock columns (skipped if Lichess `.swap-clock` already active) |
| `flipBoard` | no | Tap bottom clock to flip board (uses key handler `f`) |

Default: empty (none).

### `colorCount` (Colors for shapes on mobile, advanced)

Single value `1` | `2` | `3` | `4` (default `1`, offValue `1`). Number of brushes available when shape drawing is on. Brushes order: green, red, blue, yellow.

### `screenLock` (Screen lock, advanced)

| Value | Default | Meaning |
|-------|---------|---------|
| `play` | no | Lock page scroll/zoom during `main.round` play mode |
| `puzzle` | no | Same during `main.puzzle` |

Default: false/none. Lock state persisted in `LiChessTools.boardLocked`. Padlock button in top site-buttons toggles it.

### `wakeLock` (Keep screen active, advanced)

| Value | Default | Meaning |
|-------|---------|---------|
| `puzzle` | yes | Request Screen Wake Lock API while on puzzle/training pages |
| `tv` | yes | Same on `/tv` pages |

Chromium only; Firefox does not support the API. Retries on failure every 1 s while active.

## Shape Drawing

### Analysis / study (`shapeDrawing`)

- Uses the real board Chessground from `lt.getChessground()`.
- Adds `button.lichessTools-shapeDrawing` in `div.analyse__controls` (and in interactive extra bar when `inInteractive`).
- Touch/mouse/pointer handlers on `div.cg-wrap`:
  - With an active brush: drag creates `drawable.current` (orig -> dest).
  - On end: `handleGesture` toggles shape (same orig/dest/brush removes; otherwise replaces same-endpoint shapes and pushes new one), calls `drawable.onChange`, emits `lichessTools.shapeRank`.
- Active brush disables normal piece drag / dest highlights / selection on that ground.
- `colorCount == 1`: single tap toggles green on/off.
- `colorCount > 1`: first tap opens tooltip of color buttons + empty (clear brush); selecting a color sets brush class on the main button.

### In-game / puzzle (`shapeDrawingRound`)

- Creates overlay `div.cg-wrap.lichessTools-boardOverlay` with a second Chessground (empty FEN, drawing disabled by default, draggable off).
- Overlay starts with class `lichessTools-passthrough` (`pointer-events: none`) so play is unaffected.
- When a brush is active, passthrough is removed so touches hit the overlay.
- Button lives in `div.rcontrols div.ricons` before the board menu toggle.
- Shapes cleared on each ply and when clicking the real board (not the overlay).
- Snap-to-valid-move follows Lichess storage key `arrow.snap`.

### Optional two-finger path (`tapDrag`, not in current prefs)

If enabled in options object: hold one finger stationary, second finger draws with first brush; visual class `lichessTools-mobileExperience-tapDrag` on the shape button.

## Random Move Button

- Inserted in analysis `div.jumps` before `button[data-act="next"]`.
- Calls `lt.getRandomVariation(analysis.node)` then `userJump` + `analysisRedraw` (same family as desktop Ctrl-right).
- With `selectiveRandom`, hidden when `lt.getNextMoves(node).length <= 1`.
- Dimmed when next is disabled.

## Interactive Lesson Extras (`inInteractive`)

When `analysis.gamebookPlay()` is active and option on:

- Injects `div.lichessTools-inInteractive` before `.gamebook` with flip board button (invokes key handler `f`) and optional shape-drawing button + tooltip.

## Layout / CSS Behavior

- Body class `lichessTools-mobileExperience` when any of shapeDrawing, shapeDrawingRound, randomNextMove, hideStartEnd, hscrub is on.
- On narrow mobile with that class, analysis controls become a two-row CSS grid (utilities + menu on row 1, jumps on row 2) so extra buttons fit.
- `lichessTools-gaugeOnMobile` + wrapped `analysis.showEvalGauge` force gauge visibility when settings allow eval and node is not terminal.
- `lichessTools-hideOctopus` hides mascot image and adjusts gamebook speech-bubble CSS.
- `lichessTools-standardButtons` restores full control chrome on round/puzzle.
- `lichessTools-invert` swaps user/clock/material justify on portrait mobile unless Lichess native swap-clock is present.
- Lock: body `lichessTools-lockBoard` + `playing` -> fixed position, hidden vertical overflow.

## Horizontal Scrub (`hscrub`)

Pointer handlers on `.analyse__controls`:

- Hold ~500 ms on prev/next repeats click.
- Horizontal drag (dx dominant) steps `analysis.navigate.prev/next` at most every 100 ms.
- On pointerup, average of last few dx values: large positive -> `navigate.last()`, large negative -> `navigate.first()`.
- Marked work-in-progress in the user manual.

## Screen Lock Flow

Only on mobile + (`main.round` or `main.puzzle`) + matching play/puzzle option while body is in playing mode:

1. Read/write `LiChessTools.boardLocked` (default locked true if unset).
2. Prepend padlock control in `#top div.site-buttons`.
3. Toggle body class; unlocked icon is rotated/faded via CSS.

"Playing mode" includes pre-start, post-game, and puzzle sessions as Lichess defines `body.playing`.

## Wake Lock Flow

- Puzzles/training: subscribe redraw + `lichessTools.puzzleStart`; request when `isPlaying()`, release otherwise.
- TV: request while pathname matches `/tv`.
- Uses `navigator.wakeLock.request('screen')`; logs debug on refusal; retries after 1 s.
- Released on disable or leaving context.

## Redraw Pipeline (`handleRedraw`)

Runs only if `lt.isMobile() || lt.isTouchDevice()`.

1. Detect analysis vs round/puzzle.
2. Apply gauge/octopus/invert/standardButtons classes.
3. Attach or detach board touch handlers and overlay.
4. Inject or remove shape / random / interactive / flip controls.
5. Wire hscrub listeners.
6. For round flipBoard, bind/unbind click on `.rclock-bottom` to flip key handler.

Called from `start()` and on redraw/chapterChange when relevant options are enabled.

## Design Notes for Future Changes

- Analysis drawing mutates the live Chessground drawable state; game drawing uses a separate overlay so legal moves are not blocked until a brush is chosen.
- Shape toggles remove all shapes with the same endpoints before adding, so re-drawing the same arrow/circle clears it (any brush).
- `colorCount` only limits how many of the four fixed brushes appear; order is always green-red-blue-yellow.
- Invert is a no-op when Lichess already applies `.swap-clock` (native preference from late 2025).
- Wake lock and haptic feedback (separate Feedback tool) are Chromium-oriented; Firefox mobile lacks both APIs.
- Legacy `lockBoard` inside `mobileExperience` still maps into screen-lock options for upgrades.
- Random move depends on RandomVariation configuration (probability depth, `prc:` comments, transposition prefs).
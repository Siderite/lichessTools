# LiChess Tools — Project Context Summary

## Overview

**LiChess Tools** is a browser extension (Manifest V3 for Chrome/Edge and V2 for Firefox) developed by Siderite that adds dozens of functionalities to [lichess.org](https://lichess.org). It works on Chrome, Firefox, Edge, and Brave browsers. Version 2.5.9 as of the codebase.

The extension injects content scripts into `*://lichess.org/*`, `*://lichess.dev/*`, and `*://testy.lichess.dev/*` at `document_start` and `document_end`. It also has a service worker background for handling requests that require browser-level access (image uploads, window creation, file fetching).

## Architecture

### Infrastructure (`scripts/`)

The extension is built around a single global `LiChessTools` object (`scripts/lichessTools.js`) that orchestrates everything:

- Holds references to all sub-systems (Api, Comm, Cache, Storage, Chessground, Analysis, Lichess UI API)
- Manages current options/preferences via `lt.currentOptions`
- Provides utility functions: debounce, timeout, traverse tree, emit events, wrap/unwrap functions
- Has a pubsub system for event broadcasting (`lichessTools.redraw`, `lichessTools.chapterChange`, etc.)

Per-file details live in the sub-summaries, not in this document:

- [`scripts/context.md`](./scripts/context.md) — every file in `scripts/`: the Cash library, `ToolBase`/`PageToolBase`, the sub-systems (`Api`, `Comm`, `Cache`, `Storage`, `Network`, ...), the 13-file chess-metrics library, the loaders and the service worker.
- [`data/context.md`](./data/context.md) — every dataset in `data/`, how it is shaped and which tools consume it.
- `tools/<tool-key>/context.md` — notes for individual tools (currently `crowdin`, `showKmaps`, `wikiFen`).

## Preferences System

Each tool defines `preferences` as an array of objects:
- **name**: preference key name
- **category**: grouping (languages, community, general, appearance, analysis, analysis2, study, friends, play, puzzles, TV, mobile, comm, command, integration)
- **type**: single (radio), multiple (checkboxes), number, select, text, folder, file
- **possibleValues**: allowed values
- **defaultValue**: default value
- **advanced**: whether shown only when "Advanced Preferences" toggle is on
- **hidden**: hidden from debug mode
- **needsLogin**: requires logged-in user
- **offValue**: explicit off value (for single-type prefs)

The **PreferencesTool** renders all preferences into a page at `/team/all#lichessTools`, with collapsible categories, filter input, backup/restore buttons, reset/minimal-all-off buttons.

## Event System (Pubsub)

Key events broadcast by the extension:
- `lichessTools.redraw` — Board redraw needed
- `lichessTools.chapterChange` — Study chapter changed
- `lichessTools.commentChange` — Comment changed
- `lichessTools.contentLoaded` — Page content loaded
- `lichessTools.emitEsmLoaded` — ES modules loaded
- `lichessTools.emitPuzzleChange` — Puzzle changed
- `lichessTools.mutePlayer` — Player muted for alerts

## Function Wrapping (`wrapFunction` / `unwrapFunction`)

LiChessTools can wrap/unwrap existing Lichess functions to inject behavior before/after the original call. This is used extensively to modify Lichess native behaviors (e.g., study chapter sorting, explorer toggle open, user jump).
wrapFunction receives an object as parameter that contains the id of the wrapping plus before and after functions. The before function can alter entry parameters and if it returns false, the original function is not executed. The after function also receives the result of the execution so far and whatever it returns is the result of the wrapped function.

## CLI Commands System

The `CliCommandsTool` registers commands via `lt.registerCommand(key, command)` and handles them when `/command` is typed in the CLI input (`#clinput`). Each command has a `handle(val)` method and optional `getHelp()` text. Commands include: /hideboard, /trapvalue, /piecevalue, /copyPgn, /readGame, /readPosition, /skipMove, /searchMoves, /genline (and a bare `/stop` that several commands claim without returning truthy, so the chain keeps iterating).

`handle` must answer synchronously: `cliCommands/tool.js:86` awaits `handle` and only then blurs the input and calls `stopPropagation()`, so while that await is suspended the page's own Enter handler has already answered the input with "unknown command". Long work is therefore deferred (`lt.global.setTimeout(() => this.run(...), 100)` in `readGameCommand/tool.js:158`, delay 0 in `genLineCommand/tool.js:1250`) and `handle` returns truthy on the same tick. A `handle` that returns falsy leaves the chain iterating to the other commands, which is how the bare `/stop` aliases coexist.

## URL-based Features

- `/page/...` — tool pages that own the whole page: `/page/lichessLadders`, `/page/ltPreferences`, `/page/pgnEditor`, `/page/calculationTrainer`. Old links still work: `PageToolBase.pageAliases` redirects them (`/team/all#lichessTools`, `/account/preferences/display#lichessTools`, `#pgnEditor`).
- `#readgame` — Read games in analysis/study mode
- Hash-based navigation for followers page (`#followers`)

## Mobile Support

Mobile-specific tools: `mobileExperience`, `fixWakeLock`, `themes` (with the Mobile theme) shape drawing on mobile, scroll lock, wake lock management.

## CSS Themes

The `themes/tool.js` loads user-supplied custom CSS themes from `tools/themes/*.css`. There are many pre-built themes: adamisko, arcade, experimental, fatGauge, fatMove, gridBoard, justExplorer, lessIcons, performance, mobile, slimArrows, flairX, squares, firstInteraction, noVariants, noBullet, timeControls, gameMoveList, nonStickyHeader, pieceDrag, toggleStudyChat, fixThirdParties, etc.

## Third-Party Integrations

- **ChessDB** (chessdb.cn) — Opening database for explorer eval
- **Chessagine** — Neural network analysis API
- **Lichess Ladders** (lichessladders.com) — Challenge ladder integration
- **OBS WebSocket** — Broadcast OBS support
- **Imgur / ImgBB** — Image hosting for chat paste

## Key Shortcuts

`keyShortcuts/tool.js` defines keyboard shortcuts: Ctrl-Space (best computer move), Ctrl-RightArrow (random variation), i/m/b/Alt-i/Alt-m/Alt-b (inaccuracy/mistake/blunder glyphs), Ctrl-. / Shift-. (select from variations/computer/explorer), dot + digit, Ctrl-C (copy FEN), Ctrl-F (search move list), etc.

## Friends System

- `friendsList` — Online friends display in menu/button/friends box
- `friendsPlaying` — Sound alerts when friends start playing (configurable by time control)
- Alerts state default for new friends (`muteFriendsNotifications`, default `muted`): friends with no recorded state follow it; per-player muted/unmuted overrides live in local storage `LiChessTools.friendsAlertStatus`; no extra filter or button is added to the friends page
- Followers page (`#followers`) with new follower notifications
- Crosstable scores on opponents pages
- Mute/unmute per-player alert toggles

## Quiet Mode

`quietModeAllTabs` — When a game is playing on any tab, silence all notifications/sound alerts on other tabs. Manual toggle button available.

## Global Switch

`enableLichessTools` preference — Global enable/disable of the entire extension. Can also disable for "today" with auto-re-enable tomorrow.

---

# Tool Directory Structure

Each tool lives in `tools/<name>/tool.js` (and optionally `tool.css`). Every tool:
1. Extends `LiChessTools.Tools.ToolBase`
2. Defines `dependencies` array (other tools it depends on)
3. Defines `preferences` array
4. Defines `intl` for translations
5. Has `init()` and `async start()` methods
6. In `start()`, reads the preference value, binds/unbinds event handlers, modifies DOM, wraps/unwrap Lichess functions

Tools are loaded in `lichessTools-init.js` following dependency order; the full load sequence (including the infrastructure-first, commands-last order and the four content-script blocks) is in [`scripts/context.md`](./scripts/context.md).

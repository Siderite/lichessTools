# LiChess Tools — Project Context Summary

## Overview

**LiChess Tools** is a browser extension (Manifest V3 for Chrome/Edge and V2 for Firefox) developed by Siderite that adds dozens of functionalities to [lichess.org](https://lichess.org). It works on Chrome, Firefox, Edge, and Brave browsers. Version 2.4.226 as of the codebase.

The extension injects content scripts into `*://lichess.org/*`, `*://lichess.dev/*`, and `*://testy.lichess.dev/*` at `document_start` and `document_end`. It also has a service worker background for handling requests that require browser-level access (image uploads, window creation, file fetching).

## Architecture

### Core Infrastructure (`scripts/`)

The extension uses a layered architecture:

1. **Cash** — A custom jQuery-like DOM manipulation library (`cash.min.js`, `cash.extra.js`). All tools use `$` for DOM queries, element creation, event binding, etc.
2. **LiChessTools** — The main singleton object (`lichessTools.js`) that orchestrates everything:
   - Holds references to all sub-systems (Api, Comm, Cache, Storage, Chessground, Analysis, Lichess UI API)
   - Manages current options/preferences via `lt.currentOptions`
   - Provides utility functions: debounce, timeout, traverse tree, emit events, wrap/unwrap functions
   - Has a pubsub system for event broadcasting (`lichessTools.redraw`, `lichessTools.chapterChange`, etc.)
3. **ToolBase** — Every tool extends this class with `init()` and `start()` methods. Each tool defines its own `preferences` array (name, category, type, possibleValues, defaultValue).

### Sub-systems

| System | File | Purpose |
|--------|------|---------|
| **Api** | `lichessTools-api.js` | Lichess API wrappers: blog, study, puzzle, user, game, team, streamer, evaluation (cloud-eval + chessdb), notification, flair, timeline, relation (friends/followers), tournament, chessagine, lichessladders. All functions are memoized with caching. |
| **Comm** | `lichessTools-comm.js` | Tab-to-service-worker communication via CustomEvents (`LichessTools.send` → service worker handler → `LichessTools.receive`). Handles: getFile, fetchText, getDataUrl, getChromeUrl, deleteImage (imgur/imgbb), getHeadData, openWindow. |
| **Comm Proxy** | `lichessTools-comm-proxy.js` | Content script listener that receives `LichessTools.send` events and forwards them to the service worker via `chrome.runtime.sendMessage`, then dispatches `LichessTools.receive`. |
| **Cache** | `lichessTools-cache.js` | General caching system with session/local persistence, expiry tracking, semaphore for API rate limiting. `memoizeAsyncFunction()` wraps async functions with cache lookup + lock/release. |
| **Storage** | `lichessTools-storage.js` | localStorage/sessionStorage wrapper with optional indexedDB support, JSON compression (zip/unzip), storage event listening, fire events with sri nonce. |
| **Network** | `lichessTools-network.js` | HTTP fetch wrappers with URL templating, credential handling, status ignoring. |
| **IndexedDbStorage** | `lichessTools-indexedDbStorage.js` | IndexedDB fallback for folder/file picker storage. |
| **APISemaphore** | `lichessTools-apiSemaphore.js` | API rate limiting semaphore to prevent flooding lichess APIs. |
| **MaxSizedMap** | `lichessTools-maxSizedMap.js` | Map with size limit enforcement. |
| **Translator** | `lichessTools-translator.js` | Internationalization (en-US, ro-RO primary; Dutch, Arabic, Chinese Simplified added later). |
| **Location** | `lichessTools-location.js` | Location (page URL) services. |
| **Service Worker** | `service_worker.js` | Handles service-worker-level operations: OBS WebSocket integration, image upload to imgur/imgbb, file fetching from extension assets, window creation, data URL conversion. |

### Tool Loading Order (`lichessTools-init.js`)

Tools are loaded in a specific order that reflects dependencies. Infrastructure tools (EmitCeval, EmitRedraw, InterceptEventHandlers, FixAbortController, etc.) load first, then feature tools, then command tools, finally Preferences and KeyShortcuts.

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

The `CliCommandsTool` registers commands via `lt.registerCommand(key, command)` and handles them when `/command` is typed in the CLI input (`#clinput`). Each command has a `handle(val)` method and optional `getHelp()` text. Commands include: /hideboard, /trapvalue, /piecevalue, /copyPgn, /readGame, /readPosition, /skipMove, /searchMoves.

## URL-based Features

- `#readgame` — Read games in analysis/study mode
- `/team/all#lichessTools` — Preferences page
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

Tools are loaded in `lichessTools-init.js` following dependency order.

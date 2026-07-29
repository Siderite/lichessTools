# MoveListOptionsTool — Context Summary

## Overview

**MoveListOptionsTool** is a browser extension tool for [lichess.org](https://lichess.org) that provides configurable options for the move list display during analysis/study mode. It extends `LiChessTools.Tools.ToolBase` and lives in `tools/moveListOptions/tool.js`.

## Dependencies

The tool depends on:
- **EmitRedraw** — Board redraw events
- **EmitChapterChange** — Study chapter change events
- **EmitCommentChange** — Comment change events
- **DetectThirdParties** — Third-party detection
- **GamebookPlayClass** — Gamebook play class
- **ExportPGN** — PGN export functionality

## Preference System

The tool has a single preference: `moveListOptions` (category: "analysis", type: "multiple" — checkboxes). Six possible values:

| Value | Description |
|-------|-------------|
| **indentedVariations** | Indents variations in the tree view of moves |
| **bookmarks** | Adds bookmark functionality to moves (label, collapse/expand, chapter splitting) |
| **fullWidthAnalysis** | Expands the move list panel to full width |
| **hideLeftSide** | Hides the left side of the analysis panel |
| **analysisPopup** | Opens the move list in a separate popup window |
| **fixCevalToggle** | Moves the evaluation button to the right side |

The preference value is stored as a comma-separated string (e.g., `"bookmarks,indentedVariations"`). Each option is parsed via `lt.isOptionSet(value, name)`.

## Key Functions

### Bookmark System (when `bookmarks` enabled)

- **`collapseMove(elem, collapse)`** — Collapses/expands a bookmarked move node and all its child elements. Uses the path attribute to find the tree node, toggles CSS classes (`lichessTools-collapsed`, `lichessTools-childCollapsed`). Persist state in localStorage via `LichessTools.bookmarks` Map keyed by `${studyId}/${label}`.

- **`setBookmark(elem, node, bookmark)`** — Adds or removes a bookmark UI element on a move DOM element. Creates `<bookmark><button></button><label></label>` structure: button triggers collapse/expand, label displays the bookmark name (converted from underscore-separated to space-separated). CSS class `lichessTools-bookmark` added when bookmark exists.

- **`setBookmarks(forced)`** — Traverses all tree nodes looking for comments containing `bkm:([^\s]+)` regex pattern. Auto-creates bookmarks on nodes found with such comment text. Updates node.bookmark.label, sets collapsed state from stored preferences. Calls `setBookmark` on DOM elements when changes occur.

- **`addCommentBookmarks()`** — Processes all comment text nodes containing `bkm:label` patterns:
  - In regular `<comment>` elements: removes the `bkm:` text from the comment, marks empty comments with `lichessTools-empty` class
  - In `<div.comment>` elements: replaces `bkm:` text with interactive label "Bookmark: [name]"
  - Also expands all collapsed bookmarks at end of mainline

- **`debouncedAddCommentBookmarks()`** — Debounced version (200ms) bound to `lichessTools.redraw`, `lichessTools.chapterChange`, `lichessTools.commentChange` events.

### Bookmark Label Conversion

- **`toBookmarkName(text)`** — Converts user input to bookmark label: trim, replace spaces with underscores, prepend underscore if pure digits (`_123`).
- **`fromBookmarkName(text)`** — Converts label back to display text: replace underscores with spaces, trim.

### Bookmark Navigation & URL

- **`hashChange()`** — When browser hash changes, traverses tree nodes looking for bookmark whose label matches the decoded hash (lowercase). If found, jumps analysis to that node path and redraws board. Warns if multiple bookmarks share same label. Bound to `hashchange` event on global document.

- **`getBookmarkUrl(bookmark)`** — Generates URL: `{origin}/study/{studyId}/{chapterId}#{encodedLabel}`. Writes to clipboard with notification text.

### Bookmark Operations (Context Menu)

- **`addOrRemoveBookmark()`** — User adds/removes bookmarks via context menu. Prompts dialog for bookmark name (default is existing label or SAN). Creates/sets node.bookmark, saves comment with `bkm:` prefix if adding. Deletes other-user comments on same node path when removing. Updates `#comment-text` field if current node.

- **`collapseExpandAll()`** — Collapses all bookmarks if any are collapsed; expands all if none are collapsed. Triggers bookmark buttons on DOM elements.

- **`bookmarkSplit(ev)`** — Creates a new chapter from a bookmark position via context menu:
  - Extracts PGN from nodePath (with clock, eval, tags) via ExportPGN tool
  - Requires confirmation dialog (Shift key adds "delete following moves" warning)
  - Creates new study chapter with name = fromBookmarkName(label), PGN content, variant/orientation from setup
  - Waits for new chapter to become current, then switches back to parent chapter
  - Adds comment linking to new chapter URL: "Continue here: [url]"
  - If Shift pressed: deletes all child nodes from parent chapter
  - Jumps analysis back to split point if needed

- **`analysisContextMenu()`** — Adds context menu items (`#analyse-cm`) when `bookmarks` enabled and writable study:
  - `data-role="bookmark"` — Add/Remove bookmark (Tag icon)
  - `data-role="bookmarkUrl"` — Get bookmark link (Link icon, only if node has bookmark label)
  - `data-role="collapseAll"` — Collapse/Expand all bookmarks (PlusButton or MinusButton depending on state)
  - `data-role="bookmarkSplit"` — Create chapter from here (WhiteScissors icon, only if writable + node has children)

- **`alterModifierText(ev)`** — When Shift key pressed/up/down, changes bookmarkSplit menu text suffix (`_f` for "Split off" vs normal "Create"). Bound to body `keydown keyup`.

### UI Controls & Display Options

- **`analysisControls()`** — Creates toggle buttons in `div.analyse__tools div.action-menu .inner`:
  - Separator `<h2 class="lichessTools-separator">` with "LiChess Tools" text
  - Toggle for `indentedVariations` (insertAfter separator)
  - Toggle for `fullWidthAnalysis` (insertAfter indented toggle)
  - Toggle for `hideLeftSide` (insertAfter fullWidth toggle)
  - Each toggle binds to change event: updates option, applies options via lt, fires reload.
  - Removes all lichessTools-separator and abset toggles when global enable is false.

- **`setupAnalysisPopup()`** — When `analysisPopup` enabled + study exists:
  - Creates/removes `div.analyse__tools a.lichessTools-analysisPopup` button (ExternalArrow icon)
  - Button opens popup window with fullscreen params, title "lichessTools-moves"
  - Popup body gets `lichessTools-analysisPopup` class on DOMContentLoaded
  - Main window unload event closes popup
  - Creates/removes `div.lichessTools-moveListOptions-header` container

- **`setupCevalToggle()`** — When `fixCevalToggle` enabled: toggles CSS class `lichessTools-fixCevalToggle` on `main.puzzle, main.analyse`. Bound to redraw event.

### Indented Variations (when `indentedVariations` enabled)

- **`addMissingIndexes()`** — Adds continuation index elements ("..") to indented variations:
  - Cached query `.tview2.lichessTools-indentedVariations inline+move` (2000 limit)
  - For each move without index child, clones index from previous move's previous move with index
  - Adds `lichessTools-index` class, text = original + ".."
  - Prepend to the variation move

### DOM Class Toggles

- **`fullWidthAnalysis`** — Body gets `lichessTools-fullWidthAnalysis` class.
- **`hideLeftSide`** — Body gets `lichessTools-hideLeftSide` class.

## Event Binding (in `start()`)

The `async start()` method binds/unbinds pubsub and DOM events based on active preferences:

| Preference | Events Bound |
|------------|-------------|
| **bookmarks** | `lichessTools.redraw`, `lichessTools.chapterChange`, `lichessTools.commentChange` → debouncedAddCommentBookmarks; `hashchange` → hashChange; body `keydown keyup` → alterModifierText; `.tview2 contextmenu` → analysisContextMenu |
| **indentedVariations** | `lichessTools.redraw` → addMissingIndexes |
| **analysisPopup** (with study) | `lichessTools.redraw` → setupAnalysisPopup |
| **fixCevalToggle** | `lichessTools.redraw` → setupCevalToggle |

All preferences always bind: `lichessTools.redraw` → analysisControls.

The tool also wraps/unwrap Lichess native function `analysis.actionMenu.toggle`: unwrap first, then wrap with an after-function that calls `this.analysisControls` (setTimeout 100ms) and `lt.emitRedraw`.

## Internationalization

Translations for **en-US** and **ro-RO**. Key translations include preference names, bookmark UI text, confirmation dialogs, clipboard notifications, chapter link text, popup button title.

## Regex Pattern

The tool uses regex `/bkm:([^\s]+)\s*/s` to detect bookmark markers in comment text. `bkm:` prefix followed by a label name (non-whitespace characters).
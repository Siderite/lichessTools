# Dialog Tool

## Purpose

Provides the one dialog factory (`lt.dialog`) that every LiChess Tools dialog goes through. There is a single code path: Lichess's own `lt.uiApi.dialog.domDialog(options)` builds the `<dialog>` — including its `.scrollable`/`.not-scrollable` wrapper, its `.dialog-content` and its `button.close-button` — and the factory layers LiChess Tools extras (header, drag, resize, placement event, help link, Escape suppression, `closedBy`) on top of it, so all dialogs on the page are the same element with the same base styling.

## How It Works

### Single Mode

`await lt.uiApi.dialog.domDialog(options)` returns the Lichess-owned `<dialog>` wrapper; the factory re-wraps it in Cash (`lt.$`), always adds the `lichessTools-dialog` class, and returns `dialog[0]` — a **DOM node**, not a Cash selection. Callers that want Cash must re-wrap it: `$(dialog)`.

### Factory Extras

- `closedBy` → sets the `closedby` attribute on the `<dialog>` (e.g. `'none'` for tools that own closing).
- `noCloseButton` → `dialog.find('button.close-button').remove()`: the factory only ever *takes away* Lichess's own close button, it never builds one.
- `help` (URL) → `<a class="help-button" aria-label="Help" target="_blank">` with `href` and `data-icon` `lt.icon.InfoCircle`, `appendTo(dialog.find('.close-button-anchor'))` — i.e. it joins Lichess's own close-button anchor, so the link adds no extra in-flow box under full-viewport content.
- `noEscClose: true` → while this dialog is open, Escape events are swallowed: a capture-phase `keydown`/`keyup` listener on `document` calls `preventDefault` + `stopImmediatePropagation`, so Lichess's own Esc-to-close handler (and any LiChess Tools one) never sees the key. Attached on the `toggle` open event, detached on close, and it self-detaches if the dialog is no longer `open`.

### Shared Dialog Features

- **Header**: added only when `options.header !== undefined`; inserted before Lichess's `.scrollable,.not-scrollable` wrapper
- **Draggable header**: unless `noDrag`, pointer-down/move/up drag with shift tracking; the dialog gets a `dragged` class while moving and `dragstart` is suppressed
- **Resizable**: `resizable=true` adds the `dialog-resize` handle, which sizes `.dialog-content` from pointer coordinates and marks the dialog `resizing`
- **Scrollable wrapper**: emitted by Lichess's `domDialog` - the factory only inserts around it (the `noScrollable` option reaches `domDialog`)
- **Close button**: `button.close-button` is Lichess's own element (its `domDialog` emits it by default); the factory can only remove it via `noCloseButton`. Tools that own their close semantics rebind it after re-wrapping: `$dialog.find('button.close-button').on('click', ...)`

### Placement Event

Debounced (50ms) emit of `lichessTools.setDialogPlacement` with:
- height, width of content
- left/right/bottom/top distances from window center

### Firefox Fix

Interval (100ms) on dialog toggle open event adjusts view height to scrollHeight if diff > 5px (fixes Firefox fit-content issue).

### Close Behavior

On dialog close event, removes dialog after 100ms delay.

## Dependencies

This tool declares none — it *is* the `Dialog` dependency, declared by the 15 tools that call `lt.dialog`. Internally it uses `lt.uiApi.dialog.domDialog`, `lt.debounce`, and the `lichessTools.setDialogPlacement` pubsub event.

## Key Methods

- `async createDialog(options)` — creates dialog with all features
- `async init()` — binds `lt.dialog = this.createDialog.bind(this)`

### Options Parameters

Everything below is passed to `lt.uiApi.dialog.domDialog(options)`; the factory additionally reads `closedBy`, `help`, `noCloseButton`, `header`, `noDrag`, `resizable` and `noEscClose`.

- `header` — header text or DOM element; adding one creates `div.dialog-header` (draggable unless `noDrag`)
- `noDrag` — keep the header non-draggable
- `resizable` — add the `div.dialog-resize` handle
- `class` — Lichess option: classes for the **content div**, not the `<dialog>`; migrated tools style the element itself with `$(dialog).addClass(...)`
- `htmlText` — Lichess option: HTML text for the content
- `parent` — Lichess option: parent element to append to
- `noScrollable` — Lichess option: no scroll wrapper around the content
- `closedBy` — sets the `closedby` attribute on the `<dialog>` (replaced the hand-rolled `closedby="none"`)
- `help` — URL for the `a.help-button` help link
- `closeButton` — no longer read by the factory and no longer passed by the migrated tools; Lichess's `domDialog` emits its own `button.close-button` without it
- `noEscClose` — keeps Escape from closing the dialog; opt-in, because the Esc close is Lichess's page-level behaviour, not the factory's (used by `pgnEditor`)
- `useLT` — not read by the factory (the second mode was removed); still forwarded to `domDialog`
- `noCloseButton` — factory opt-out: removes Lichess's `button.close-button` from the finished dialog; no current caller uses it

## CSS

Dialog styling lives in `tools/dialog/tool.css`: base `dialog.lichessTools-dialog` rules (the invalid `-transform: none;` declaration was dropped), `:backdrop` transition/animation resets, `html:has(body.lichessTools > dialog.lichessTools-dialog) { overflow: hidden }` and the `:has(...dragged)`/`:has(...resizing)` `user-select: none` pair, `.dialog-header` (`min-height: 2em`, `background: #80808080`, flex-centred, `color: var(--c-font)`), the 16px `dialog-resize` handle bottom-right with its hover, the `dragged`/`resizing` cursors plus the `.dialog-content` `pointer-events: none` + `opacity: 0.25` pair, and `option:checked` on `var(--c-bg-zebra2)`. `button.close-button` is Lichess's element restyled to a 32px circle (`transform: none; border-radius: 50%; border: none; width/height: 32px`); `a.help-button` is the absolute 40px box at `top: 4px; right: 2em; z-index: 111` (`#ccc` → `#1b78d0` on hover). The base sheet caps `.dialog-content` at `90vw/90vh`, so per-tool sheets that want a full-viewport dialog reset that box (`padding: 0; min-width/min-height: auto; max-width/max-height: none`).

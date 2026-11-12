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
- **Draggable header**: unless `noDrag`, pointer-down/move/up drag with shift tracking; the dialog
  gets a `dragged` class while moving, `dragstart` is suppressed, and the move keeps the size the press
  found - a drag moves a dialog, it never resizes it, and the box is written through `placeDialog` like
  any other write
- **Resizable**: `resizable` appends the five `dialog-resize` edge strips and puts the `DialogResize` machine on the dialog; a grab moves the edge it took, marks the dialog `resizing` once it moves, and closes with the placement event and a swallowed click (see the machine below)
- **Placement is re-applied by other tools**: `studyLinks` (`setDialogPlacement`, blob `LichessTools.dialogPlacement`) and `calculationTrainer` (`updatePlacement`, in its own options) keep the event data and write `left`/`right`/`top`/`bottom`/`width`/`height` back onto the dialog and `contentWidth`/`contentHeight` onto its `.dialog-content` when they reopen it, using `unset` for the side they do not have. That is why every box write here stays plain inline and clears the opposite edge - see the machine below.
- **Scrollable wrapper**: emitted by Lichess's `domDialog` - the factory only inserts around it (the `noScrollable` option reaches `domDialog`)
- **Close button**: `button.close-button` is Lichess's own element (its `domDialog` emits it by default); the factory can only remove it via `noCloseButton`. Tools that own their close semantics rebind it after re-wrapping: `$dialog.find('button.close-button').on('click', ...)`

### Resize Machine

`DialogResize` is a file-level class (not a tool) that `createDialog` wires to any dialog made with
`resizable`. It owns the five edge strips `e se s sw w` - the top and left edges stay with whatever
placement the page chose - and the gesture on them: one primary press opens it (a touch contact
reports `-1`, so a finger counts like a left press, a right or middle one does not), six pixels of
travel start the move, and pointer capture keeps the same finger tracked while the pointer is down.
The box it lands is written by `placeDialog`: a centre plus a size - a `<dialog>` is centred by
`transform: translate(-50%,-50%)`, so a `left`/`top` number names the centre and a `right`/`bottom`
number names the same centre from the other edge (the placement event below uses that pair). The write
stays a plain inline one, and the *opposite* edge of each axis is written `unset` rather than left
alone: `studyLinks` and `calculationTrainer` re-apply a placement they stored onto the dialog, writing
`left`/`right`/`top`/`bottom` the same way with `unset` for the side they do not have. A priority write
(or a lone edge that never gets cleared) holds against their `unset`, and the dialog ends up with both
a `left` and a `right` inline - over constrained, where the browser ignores the `right` - so a corner
the user left comes back as a centre. The page's min/max are reset to their initial values so a page
rule cannot clamp a size the tool asked for. `DialogResize.apply` then gives `.dialog-content` the room
left inside that box: a dialog box alone leaves the content at its own size, and a content sized as a
percentage of its parent (a video iframe at 100%, a trainer board) keeps that size, so the box grows
around it and the content reads as cropped rather than resized. A tool that has opinions about the size
passes them as the `resizable` object: `begin()` runs when a gesture opens, and `resize(proposed, edge,
dx, dy, base)` answers with the box that goes on the page - that is where a tool clamps to its viewport,
keeps a minimum, or remembers the size the user left. Escape is not the machine's business: an Escape
press closes the dialog (or the tool's window) and `noEscClose` is what keeps it from doing so.

The signals the machine sends are the ones every dialog has always sent: the `resizing` class while
a gesture moves (the Firefox fit-content interval skips while it is set), the debounced
`lichessTools.setDialogPlacement` emit on release, and the click the browser fires under the
pointer when a press ends, which is swallowed so the strip does not press what it sits over.

A grab never takes the box under its content. The width floor is the width the content cannot be
made narrower than - asked for at zero width, `.dialog-content` reports its own scroll extent, which
is the widest line, image or control that will not break - and a dialog the page cannot scroll
(`noScrollable`, the `.not-scrollable` wrapper) keeps the content's full height as well. The probe is
a synchronous read inside the gesture, so nothing paints at the probe width. A box that comes back
under either floor is grown back along the edge the grab moves, so the edge the user let go of still
holds where it was; the floored box is what the policy hook receives, so a tool that remembers a size
remembers the size that lands on the page.

### Placement Event

Debounced (50ms) emit of `lichessTools.setDialogPlacement` with the box the machine left on the
page - every value is a px string, ready to hand back to `.css()`:
- width, height - the dialog's own border box
- contentWidth, contentHeight - the room the content was given inside it (`.dialog-content`'s own box):
  the machine sizes both, and a content sized as a percentage of its parent (a video iframe at 100%, a
  trainer board) only follows a content that has a size of its own, so a re-opener needs both
- left, top - the centre the dialog sits at, when that centre is left of / above the viewport centre
- right, bottom - the distance that centre sits in from the right / bottom edge, used when it is not
One key per axis. A dialog is centred by a -50% transform, so both sides name a centre and a
consumer restores the box with the same write the machine makes (see `DialogResize.apply`). The
transform compensates for a `left`/`top` number, not for a `right`/`bottom` one: writing a
right-of-centre datum straight into `right` counts the pull inward twice, and the box lands a whole
box width off toward the centre. A consumer converts it back - `left = innerWidth - right` - and
always writes a centre.

### Firefox Fix

Interval (100ms) on dialog toggle open event adjusts view height to scrollHeight if diff > 5px (fixes Firefox fit-content issue).

### Close Behavior

On dialog close event, removes dialog after 100ms delay.

## Dependencies

This tool declares none — it *is* the `Dialog` dependency, declared by the 15 tools that call `lt.dialog`. Internally it uses `lt.uiApi.dialog.domDialog`, `lt.debounce`, and the `lichessTools.setDialogPlacement` pubsub event.

## Key Methods

- `async createDialog(options)` — creates dialog with all features
- `async init()` — binds `lt.dialog = this.createDialog.bind(this)`
- `class DialogResize` (file-level) — the resize machine a resizable dialog carries: the strips, the gesture gate, the box apply, and the tool's policy hooks

### Options Parameters

Everything below is passed to `lt.uiApi.dialog.domDialog(options)`; the factory additionally reads `closedBy`, `help`, `noCloseButton`, `header`, `noDrag`, `resizable` and `noEscClose`.

- `header` — header text or DOM element; adding one creates `div.dialog-header` (draggable unless `noDrag`)
- `noDrag` — keep the header non-draggable
- `resizable` — `true`, or a policy object `{begin, resize}`: the five edge strips and the `DialogResize` machine are added either way, and the policy is where a tool adds its own viewport clamp, its minimum, and its memory of the size the user left (used by `recordsDbUi`; `calculationTrainer` and `studyLinks` take the plain `true`)
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

Dialog styling lives in `tools/dialog/tool.css`: base `dialog.lichessTools-dialog` rules (the invalid `-transform: none;` declaration was dropped, and `box-sizing: border-box` is there so the border box the machine measures is the box its `width`/`height` write - a measured px handed back as a content-box width would grow the dialog on every gesture), `:backdrop` transition/animation resets, `html:has(body.lichessTools > dialog.lichessTools-dialog) { overflow: hidden }` and the `:has(...dragged)`/`:has(...resizing)` `user-select: none` pair, `.dialog-header` (`min-height: 2em`, `background: #80808080`, flex-centred, `color: var(--c-font)`), the five invisible `dialog-resize` bands (`dialog-resize-e/w/s/se/sw` in the dialog's own border box, each carrying the cursor of the edge it moves, widened into tap bands under `body.lichessTools.mobile`), the `dragged`/`resizing` cursors (`grabbing` for a grab), the `.dialog-content` `pointer-events: none` + `opacity: 0.25` pair that only a header drag puts up - an edge grab leaves the content live because the strips ride above it, and `option:checked` on `var(--c-bg-zebra2)`. `button.close-button` is Lichess's element restyled to a 32px circle (`transform: none; border-radius: 50%; border: none; width/height: 32px`); `a.help-button` is the absolute 40px box at `top: 4px; right: 2em; z-index: 111` (`#ccc` → `#1b78d0` on hover). The base sheet caps `.dialog-content` at `90vw/90vh`, so per-tool sheets that want a full-viewport dialog reset that box (`padding: 0; min-width/min-height: auto; max-width/max-height: none`).

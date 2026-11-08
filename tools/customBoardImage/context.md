# CustomBoardImage Tool

## Purpose

Allows users to set a custom board background image via URL, or upload one from
a local file. Creates a button in the dasher app board selection area, opens a
dialog prompt for URL input with combo filtering from boards.json data, and
injects CSS style to apply the custom image as cg-board::before background.

## How It Works

### Board Image CSS Injection

When customBoardUrl is set:
- Creates `<style id="lichessTools-customBoardImage">` in head with
  `body.lichessTools .is2d cg-board::before { background-image: url("${url}") }`.
- Stores an `initStyleStr` (same rule with `!important`) in localStorage under
  `customBoardImage-lastStyle` for the recovery observer.
- `updateBoardImage` always runs `lt.tools.ThemesTool?.setBoardVariables(true)`
  in a `finally` so theme/board CSS variables stay in sync.

### Live Preview Inside The Prompt

While the prompt dialog is open, the board behind it already shows the candidate
URL through `--board-background`, and each combo item shows its own option
through `--background`:
- tool.css defines a preview rule that keys off `:has(dialog[open].lichessTools-customBoard)`
  and sets `.is2d cg-board::before` background to `var(--board-background)`, gated to
  `body.lichessTools.lichessTools-hasBoardBackground` and excluding the grid-board theme,
  so the real style is untouched.
- Combo items (`.combo-list .combo-item`) layer a translucent overlay over
  `var(--background)` so each option previews its own board image, and hover/highlight
  lift them via `filter: drop-shadow(...)`.
- Mobile (`body.lichessTools.mobile:has(dialog[open]...)`) dims `#dasher_app`
  to 0.2 opacity while the prompt is up.
- On combo select the body gets `--board-background: url("${url}")` for preview.
- On input `change`/`paste` the value is validated with `URL.canParse(val)`
  before `--board-background` is updated.
- A `focus input` observer refreshes each `<option class="combo-item">`'s
  `--background` while the input is focused.

### Board Selection Button

On `#dasher_app .sub.board.d2 .list`:
- Creates `<button class="lichessTools-customBoardImage">` when a custom board
  is set or the list is collapsed; the button click routes to
  `chooseCustomBoardImageUrl()`.
- Clicking any other board button clears `customBoardUrl`/`currentOptions.customBoardImage`
  before activating that board.
- `chooseCustomBoardImageUrl()` calls `lt.uiApi.dialog.prompt` with `dialogActions`
  combo (select to set body `--board-background`), a `change/paste` input listener
  that validates `URL.canParse(val)`, and a `focus input` observer that sets
  `--background` per combo item for preview.
- Boards.json data is fetched via `lt.comm.getData('boards.json')` asynchronously;
  a small retry loop (up to 100 iterations) locates the freshly rendered prompt
  in the DOM before the combo list and Upload button are injected.

### Upload Button

Inside the open prompt the action buttons sit in a `<span>`; tool.css turns that
span into `display: flex` with `justify-content: space-between`, and cash's
`.insertBefore('button.ok')` (single reference, so no clone) moves the button
between Cancel and OK. It carries Lichess' `button button-empty` classes for
look, plus `lichessTools-customBoardUploadButton` as the idempotency anchor and
label text from `trans.noarg('uploadBoardButtonText')`.
Clicking it:
- Verifies the dialog is still open via `openDialog.prop('open')`.
- Awaits `pickBoardImageFile()`, which uses the File System Access picker
  (`id: 'lt-customBoardImage-upload'`, `multiple: false`, `startIn: 'pictures'`,
  description `trans.noarg('imageFiles')`, extensions `.png .jpg .jpeg .gif .webp .tif
  .tiff .apng .svg .jpgx .avif`) when available, otherwise the browse dialog a
  clicked detached `<input type="file" accept="image/*"/>` opens on mobile.
- On non-image result it announces `trans.noarg('notAnImageError')` and leaves
  the dialog open so the user can retry or hit Cancel/OK.
- On image it awaits `fileToDataUrl(file)`, previews the picked image via
  `$('body').css('--board-background', url("${dataUrl}"))`, and sets
  `input.val(dataUrl)`; Lichess's own input change listener then closes with
  'ok', so no manual `dialog.close('ok')` is called.
- Accepted mime types in `isImageFile`: `image/jpeg`, `image/jpg`, `image/gif`,
  `image/png`, `image/apng`, `image/tiff`, `image/webp`, `image/svg+xml`,
  `image/jpgx`, `image/avif`.

### More Button Toggle

On `button.more` in board list parent:
- Click - toggles collapsed state, manages customBoardImage button visibility

### Existing Board Buttons Customization

Each existing board button gets a click handler that clears customBoardUrl
before activating the selected board.

### Recovery Observer

MutationObserver on html link[rel="stylesheet"][href*="/site."] and cg-board:
- If style#lichessTools-customBoardImage not present, restores from localStorage stored initStyleStr

## Dependencies

`lt.uiApi.dialog.prompt`, `lt.comm.getData('boards.json')`,
`lt.global.showOpenFilePicker`, `FileReader`, `URL.canParse`, `lt.storage`,
`lt.tools.ThemesTool?.setBoardVariables(true)`.

## Preferences

- `customBoardImage` - text type, default `''`, offValue `''`, advanced true,
  category `appearance`.

## Intl Keys

en-US / ro-RO: `options.appearance`, `options.customBoardImage`,
`customBoardUrlPrompt`, `invalidUrl`, `customBoardImageUrlText`,
`customBoardImageUrlTitle`, `uploadBoardButtonText` (en "Upload", ro
"Lencarca" with diacritics in source), `notAnImageError` ("Not an image!" /
"Nu e imagine!"), and `imageFiles` ("Image files" / "Imagini") as the
picker's type description.

## Key Methods

- `updateBoardImage(forced)` - injects the `<style id="lichessTools-customBoardImage">`
  rule and stores the `!important` init variant in `lt.storage`.
- `chooseCustomBoardImageUrl()` - async; opens `lt.uiApi.dialog.prompt` (the
  show promise is captured first and awaited after the DOM is patched), fetches
  boards.json via `lt.comm.getData`, injects the combo `<option>`s and the
  Upload button into the freshly rendered prompt, and returns the input's value
  which is validated by `URL.canParse` before being stored as the new custom
  URL. A combo select sets body `--board-background`; a `change`/`paste` on the
  input re-validates and re-previews; a `focus input` observer sets
  `--background` per combo item so each option previews its own board image.
- `addCustomBoard()` - manages dasher board list buttons and the
  `button.lichessTools-customBoardImage` entry.
- `async init()` - observers that restore the style from
  `lt.storage.customBoardImage-lastStyle` when a Lichess stylesheet or `cg-board`
  is added.
- `pickBoardImageFile()` - returns the picked `File`/`Blob` or null; uses
  `lt.global.showOpenFilePicker` (id `lt-customBoardImage-upload`,
  single-pick, startIn `pictures`, image extensions `.png .jpg .jpeg .gif .webp
  .tif .tiff .apng .svg .jpgx .avif`), otherwise the browse dialog opened by
  clicking a detached `<input type="file" accept="image/*"/>`; AbortError maps
  to null.
- `fileToDataUrl(file)` - Promise wrapper around `FileReader.readAsDataURL`.
- `isImageFile(file)` - accepts `image/jpeg`, `image/jpg`, `image/gif`,
  `image/png`, `image/apng`, `image/tiff`, `image/webp`, `image/svg+xml`,
  `image/jpgx`, `image/avif`.

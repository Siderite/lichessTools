# CustomBoardImage Tool

## Purpose

Allows users to set a custom board background image via URL, or upload one from
a local file. Creates a button in the dasher app board selection area, opens a
dialog prompt for URL input with combo filtering from boards.json data, and
injects CSS style to apply the custom image as cg-board::before background.

## How It Works

### Board Image CSS Injection

`this.options.customBoardUrl` holds either a plain URL/data URL or the sentinel
string `uploadedImagePlaceholder` when the blob lives in IndexedDB. All render
paths go through `resolveBoardUrlSync(url)` which maps the sentinel to
`this.uploadedImage` (the in-memory blob) and returns null when the blob is
missing, so the caller treats the situation like "no image set".

- `updateBoardImage(forced)` reads `resolveBoardUrlSync(this.options.customBoardUrl)`
  and injects `<style id="lichessTools-customBoardImage">` with
  `body.lichessTools .is2d cg-board::before { background-image: url("${resolved}") }`.
- The old `customBoardImage-lastStyle` localStorage entry is gone; the recovery
  observer now regenerates that style from `currentOptions.customBoardImage` plus
  the IndexedDB cache, so a reload with a huge image never re-enters localStorage.
- `updateBoardImage` always runs `lt.tools.ThemesTool?.setBoardVariables(true)` in
  a `finally` so theme/board CSS variables stay in sync.

### Storage Budget

Base64 data URLs of uploaded images can be several hundred KB. They are never
written to localStorage (the currentOptions blob has a 5MB-per-origin budget and
is shared with every other option). Class fields:
- `idbOptions = { db: true, raw: true }` -> routes lt.storage to IndexedDbStorage
  (returns a Promise, every call site awaits).
- `uploadedImageKey = 'lichessTools/LT/customBoardImage-upload'` - matches
  IndexedDbStorage's `dbName/storeName/itemName` regex.
- `uploadedImageThreshold = 50000` bytes; anything at or under this length is
  kept as a plain data URL inside `currentOptions.customBoardImage`.
- `uploadedImagePlaceholder = 'uploadedImage'` - the raw intl key stored as the
  option value when the image is over threshold.
- `uploadedImage` - runtime cache of the IndexedDB blob, populated by
  `loadUploadedImage()` at `init()`/`start()` and by `saveUploadedImage()` on
  upload. Set to null by `clearUploadedImage()`.

Helpers:
- `isValidImageDataUrl(url)` - true when `url.startsWith('data:image/')`. Used
  on load so a corrupt blob (undefined, empty, non-image text) leaves
  `this.uploadedImage` at null and the render path skips the style injection.
- `resolveBoardUrlSync(url)` - returns `this.uploadedImage` when url is the
  sentinel, else the url as-is. Used in every synchronous render/preview path.
- `resolveBoardUrl(url)` - async cross-tool entry point; awaits
  `loadUploadedImage()` if the cache is unset. ThemesTool's `getBoardBackground`
  awaits `lt.tools.CustomBoardImage.resolveBoardUrl(boardImage)` so the
  `--board-background` CSS var never carries the sentinel.
- `previewCssValue(url)` - wraps the resolved URL in `url("...")`, or returns
  `'none'` when resolution yields null so the CSS `background-image: var(--background)`
  rule stays valid.
- `loadUploadedImage()` / `saveUploadedImage(dataUrl)` / `clearUploadedImage()` -
  wrap the async lt.storage.get/set/remove calls; save returns true on success.

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
- On combo select the body gets `--board-background: previewCssValue(o.value)`
  so the uploaded-image entry still previews via the IndexedDB cache.
- On input `change`/`paste` the value is validated with `URL.canParse(val)` unless
  it equals the sentinel; then `--board-background` gets `previewCssValue(val)`.
- A `focus input` observer refreshes each `<option class="combo-item">`'s
  `--background` via `previewCssValue(o?.value ?? o)` while the input is focused,
  so the uploaded-image entry previews the same blob the board would render.

### Board Selection Button

On `#dasher_app .sub.board.d2 .list`:
- Creates `<button class="lichessTools-customBoardImage">` when a custom board
  is set or the list is collapsed; the button click routes to
  `chooseCustomBoardImageUrl()`.
- Clicking any other board button clears `customBoardUrl`/`currentOptions.customBoardImage`
  and awaits `clearUploadedImage()` so the IndexedDB blob is dropped along with
  the option; then `updateBoardImage(true)` reruns with no URL.
- The active class on the custom button is toggled by
  `resolveBoardUrlSync(this.options.customBoardUrl)` truthy, so a sentinel
  whose blob is missing keeps the button inactive (behaves like no image set).
- `chooseCustomBoardImageUrl()` calls `lt.uiApi.dialog.prompt` with `dialogActions`
  combo (select to set body `--board-background`), a `change/paste` input listener
  that validates `URL.canParse(val)`, and a `focus input` observer that sets
  `--background` per combo item for preview.
- Boards.json data is fetched via `lt.comm.getData('boards.json')` asynchronously;
  a small retry loop (up to 100 iterations, 50ms backoff) locates the freshly
  rendered prompt in the DOM before the combo list and Upload button are injected.
- The combo entry list is `data.data` plus one synthetic entry
  `{ text: trans.noarg('uploadedImage'), value: uploadedImagePlaceholder }` so
  the uploaded-image option is navigable by typing, arrow-key, or click; every
  path resolves through `previewCssValue` which substitutes the IndexedDB blob.

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
  `$('body').css('--board-background', url("${dataUrl}"))`, and picks the
  persisted representation by size:
    - `dataUrl.length > uploadedImageThreshold` (50000 bytes): stash `dataUrl`
      in the `pendingUploadedImage` closure variable and set `input.val(placeholder)`
      so the option value Lichess persists is the short sentinel string. The base64
      blob is written to IndexedDB after the prompt closes via
      `saveUploadedImage(pendingUploadedImage)`.
    - Otherwise: `input.val(dataUrl)` directly and `pendingUploadedImage = null`.
- Lichess's own input change listener then closes the dialog with 'ok'; the click
  handler does NOT call `dialog.close('ok')` manually.
- After close, `chooseCustomBoardImageUrl` branches on the returned url:
    - Sentinel + pendingUploadedImage -> write IndexedDB, keep sentinel in
      `currentOptions.customBoardImage`, refresh the cache, and update the style.
    - Sentinel with no pending upload but a blob already in cache -> keep existing.
    - Sentinel with no pending upload and no blob -> behave like Cancel (early return
      so `currentOptions` stays untouched).
    - Any other url -> `clearUploadedImage()` to drop the old IndexedDB entry, then
      the existing `URL.canParse(url)` validation and normal storage path.
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
- Regenerates the `<style id="lichessTools-customBoardImage">` from
  `currentOptions.getValue('customBoardImage')` resolved through
  `resolveBoardUrlSync`. No `customBoardImage-lastStyle` is stored; if
  resolution yields null (no option set, or sentinel with a missing/corrupt
  blob) the observer returns without injecting anything.
- When the persisted value is the sentinel, `init()` awaits
  `loadUploadedImage()` before setting up the observers so
  `resolveBoardUrlSync` can read the IndexedDB blob synchronously from
  `this.uploadedImage`.

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
"Nu e imagine!"), `imageFiles` ("Image files" / "Imagini") as the picker's
type description, and `uploadedImage` ("Uploaded image" / "Uploadat image")
both for the combo entry label and as the sentinel value persisted in
`currentOptions.customBoardImage` for over-threshold uploads.

## Key Methods

- `updateBoardImage(forced)` - reads
  `resolveBoardUrlSync(this.options.customBoardUrl)` and, if truthy, injects the
  non-important `<style id="lichessTools-customBoardImage">` rule; if null,
  removes any existing style. Runs `ThemesTool?.setBoardVariables(true)` in a
  `finally` so theme/board CSS variables stay in sync.
- `chooseCustomBoardImageUrl()` - async; opens `lt.uiApi.dialog.prompt` (the
  show promise is captured first and awaited after the DOM is patched), fetches
  boards.json via `lt.comm.getData`, augments the combo with a synthetic
  uploaded-image entry, injects the Upload button, and returns the input's
  value. On sentinel return, uses `pendingUploadedImage` to write IndexedDB
  (via `saveUploadedImage`) and keeps the sentinel in options; on any other
  value, awaits `clearUploadedImage()` before validating `URL.canParse`. A combo
  select, `change`, and `paste` all go through `previewCssValue` so the
  uploaded-image entry previews via the IndexedDB blob.
- `addCustomBoard()` - manages dasher board list buttons; guards the custom
  button's active class with `resolveBoardUrlSync` and awaits
  `clearUploadedImage()` when a non-custom board takes over.
- `async init()` - awaits `loadUploadedImage()` when the persisted value is the
  sentinel, then sets up observers that regenerate the `!important` style
  variant from `resolveBoardUrlSync(currentValue)` on Lichess stylesheet or
  `cg-board` addition.
- `async start()` - awaits `loadUploadedImage()` when the option is the sentinel
  so `updateBoardImage()` sees the in-memory cache synchronously; otherwise
  resets `this.uploadedImage` to null.
- Storage helpers - `loadUploadedImage` populates `this.uploadedImage` from
  IndexedDB when `isValidImageDataUrl` accepts the blob; `saveUploadedImage(dataUrl)`
  writes IndexedDB and returns true; `clearUploadedImage` drops the blob and
  nulls the cache. `isValidImageDataUrl(url)` gates the sentinel mapping
  (`resolveBoardUrlSync`) and the preview path (`previewCssValue`).
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

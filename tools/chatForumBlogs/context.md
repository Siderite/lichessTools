# ChatForumBlogs Tool

## Purpose

Enhances inbox chat, forum posts, and profile pages with: image paste support (upload to imgur/imgbb), an explicit "Upload image" button in the textareas where Lichess has no upload button (inbox chat, biography — the button opens a file picker, which is what mobile needs, and is complementary to the paste), big emoji display for single-emoji messages, auto-refresh on new message in inbox, reactions tooltip showing all reaction titles on mobile, and Ctrl+B/Ctrl+I keyboard shortcuts for bold/italic in the forum markdown editor. Also provides delete button for pasted images.

## How It Works

### Image Paste Support

On textarea/msg-app content elements (`textarea.msg-app__convo__post__text`, `.msg-app__convo__msgs__content`):
- paste/drop event → captures clipboard file, converts to base64 buffer
- Sends via comm `pasteBuffer` type to service worker for image hosting (imgur/imgbb)
- Returns link URL → inserts as markdown `![url](url)` or plain URL into textarea
- Error handling: announces "There was an error generating the image URL"

### Upload Image Button

Mobile browsers never fire the paste event with an image, so an explicit button is added next to the textareas; it opens a file picker instead of waiting for a clipboard paste. It is complementary to the paste: the paste handlers are untouched and keep working on desktop.
- For every text input returned by `getImagePastingElements()` (inbox chat `textarea.msg-app__convo__post__text`, biography `#form3-bio`), a Lichess-styled button is inserted after it:
  `<button class="button-empty lichessTools-uploadImageButton" type="button"><span class="upload-image"></span></button>`, with a translateable `title` (`uploadImageButtonTitle`). One per container, and none where Lichess already has an `.upload-image` button.
- Click → `pickImageFile()` opens a picker and returns the picked file:
  - `lt.global.showOpenFilePicker` (Chrome/Edge, HTTPS): its own `id` (`lt-chatForumBlogs-uploadImage`, so the browser remembers the grant), one file, `startIn: 'pictures'`, `types: [{ accept: { 'image/*': ['.png', ...] } }]` — the extensions go in an **array**, one entry each, every one starting with a dot; a single comma-joined string is rejected by Chrome ("Extension ... contains invalid characters"). `handle.getFile()` gives a `File`.
  - otherwise `$('<input type="file" accept="image/*"/>')` stays detached from the page, is bound to `change cancel` and is `.trigger('click')`ed, which is what opens the browser's browse dialog (the same idiom as the file buttons of the preferences tool); the choice comes back on the event as `e.target.files` (the folder entry the dialog reports first is skipped), and dismissing the dialog fires `cancel` instead.
  - A picker that errors for any reason other than `AbortError` (disabled, blocked, unsupported browser) is logged and then falls through to the browse dialog; the user pressed Escape only when the reason is `AbortError`, and that stops the pick there.
- The picked `File` is fed to `uploadImageFile()`, which builds the same fake paste event (`clipboardData.files[0]`) and calls `pasteImage()`, so the upload, loader, markdown/plain url and announcements are identical to a desktop paste.
- If nothing was picked, or the picked file is not an image (`isImage` list), announces `uploadImageMissingText`; a closed picker is only logged (`DOMException` `AbortError`), and a dismissed browse dialog resolves the pick through its `cancel` event.
- Forum posts, forum edits and team descriptions are not covered: Lichess has a native upload button for those.

### Image Click Dialog

On pasted images (`group a img`, `.forum-post__message img`):
- Click → opens dialog showing enlarged cloned image with lichessTools-imagePasting class

### Image Delete Button

On imgur/ibb.co URLs in images or links:
- Creates `<button class="lichessTools-deleteImage">` after element
- Click → confirms via dialog, sends `deleteImage` comm request to service worker
- Success → removes button, deletes from imageData storage, announces "Image deleted"

### Big Emoji Display

On `.msg-app__convo group t`:
- Toggles `lichessTools-bigEmoji` class if text is ≤ 5 characters and matches Extended_Pictographic Unicode regex (single emoji)

### Refresh On Message

MutationObserver on `.msg-app.pane-convo their,mine`:
- When scroll position is near the bottom (`scrollQ >= 0.9`, not scrolled away), triggers mousedown handler on active contact element to refresh chat content.

### Reactions Tooltip

On `div.reactions`:
- Creates `<div class="lichessTools-reactionsTooltip">` with all yes button titles joined by newline

### Markdown Keyboard Shortcuts

On `textarea.markdown-content-textarea` (the forum editor):
- Ctrl+B (or Cmd+B) toggles bold (`**`) and Ctrl+I (or Cmd+I) toggles italic (`_`) on the selected text.
- Only acts when there is a non-empty selection; otherwise the key event is left untouched.
- Detects whether the selection is already wrapped in the target marker (directly, or with the other marker nested inside/outside) and unwraps instead of wrapping, so bold/italic combinations stay valid.

## Dependencies

- Dialog, InterceptEventHandlers

## Preferences

- `chatForumBlogs` — multiple type: ['pasteImages', 'bigEmoji', 'refreshOnMessage', 'reactionsTooltip', 'markdownShortcuts'], default: 'pasteImages,bigEmoji,refreshOnMessage,reactionsTooltip,markdownShortcuts', needsLogin: true

## Key Methods

- `getImageUrl(ev)` → captures image from clipboard, sends to hosting service
- `pasteImage(ev)` → inserts URL into textarea after fetching image URL
- `pickImageFile()` → opens the file picker (`lt.global.showOpenFilePicker`, otherwise the browse dialog of a clicked detached `<input type=file>`) and returns the picked `File`
- `uploadImageFile(el, file)` → validates the pick with `isImage()` and builds a fake paste event, calling `pasteImage()` so the upload is identical
- `addUploadImageButton(el)` → inserts Lichess' `<button class="button-empty" ...><span class="upload-image"></span></button>` after a textarea target
- `initControls()` → sets up paste/drop handlers, the upload button, big emoji detection, refresh on message
- `refreshChatDirect()` → triggers chat refresh if scroll not near bottom
- `handleMarkdownShortcuts(ev)` → intercepts Ctrl+B/Ctrl+I on the forum editor textarea
- `toggleMarkdown(textarea, marker)` → toggles `**` or `_` around the selection, unwrapping when already styled

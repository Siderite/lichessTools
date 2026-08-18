# ChatForumBlogs Tool

## Purpose

Enhances inbox chat, forum posts, and profile pages with: image paste support (upload to imgur/imgbb), big emoji display for single-emoji messages, auto-refresh on new message in inbox, reactions tooltip showing all reaction titles on mobile. Also provides delete button for pasted images.

## How It Works

### Image Paste Support

On textarea/msg-app content elements (`textarea.msg-app__convo__post__text`, `.msg-app__convo__msgs__content`):
- paste/drop event → captures clipboard file, converts to base64 buffer
- Sends via comm `pasteBuffer` type to service worker for image hosting (imgur/imgbb)
- Returns link URL → inserts as markdown `![url](url)` or plain URL into textarea
- Error handling: announces "There was an error generating the image URL"

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
- When scroll position < 0.9 (not near bottom), triggers mousedown handler on active contact element to refresh chat content

### Reactions Tooltip

On `div.reactions`:
- Creates `<div class="lichessTools-reactionsTooltip">` with all yes button titles joined by newline

## Dependencies

- Dialog, InterceptEventHandlers

## Preferences

- `chatForumBlogs` — multiple type: ['pasteImages', 'bigEmoji', 'refreshOnMessage', 'reactionsTooltip'], default: 'pasteImages,bigEmoji,refreshOnMessage,reactionsTooltip', needsLogin: true

## Key Methods

- `getImageUrl(ev)` → captures image from clipboard, sends to hosting service
- `pasteImage(ev)` → inserts URL into textarea after fetching image URL
- `initControls()` → sets up paste/drop handlers, big emoji detection, refresh on message
- `refreshChatDirect()` → triggers chat refresh if scroll not near bottom

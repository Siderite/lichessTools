# MchatOptionsTool — Context Summary

## Overview

**MchatOptionsTool** is a LiChess browser extension tool that enhances team/study chat functionality on lichess.org. It provides multiple configurable options for chat messages, notifications, and move-related automation.

## Architecture

### Base Class
- Extends `LiChessTools.Tools.ToolBase` (standard tool pattern: `init()` + `async start()`)
- Dependencies: `['AddNotifications', 'EmitContentLoaded', 'InterceptEventHandlers']`

### Preferences
Single **multiple-type** preference (`mchatOptions`) with 7 toggleable options:
| Option | Description | Default | Advanced | Needs Login |
|--------|-------------|---------|----------|-------------|
| `urlify` | Highlight URLs in chat messages as clickable links | ✓ | Yes | Yes |
| `unlimited` | Remove message length limit (138 chars), split long messages into whispers | ✓ | Yes | Yes |
| `images` | Support image paste from clipboard — uploads to imgur/imgbb via service worker | ✓ | Yes | Yes |
| `teamChatNotifications` | WebSocket-based team chat notifications with bell buttons on teams list page | ✓ | Yes | Yes |
| `autoWhisper` | Auto whisper button (`/w`) that prefixes all chat input with `/w` | ✗ | Yes | Yes |
| `prependMove` | Auto prepend move button (`M`) that adds last game move to chat input | ✗ | Yes | Yes |
| `insertSelectedMove` | Insert selected move button (`+`) that inserts current move into chat input | ✗ | Yes | Yes |

## Features Detail

### 1. URL Highlighting (urlify)
- Regex: `/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig`
- Processes chat messages in `section.mchat` container every 1 second (via interval)
- For each visible `<li>` message element, splits text nodes into: plain text segments + clickable `<a class="lichessTools-chat-url">` links with `_blank` target
- Also auto-inserts `<img>` elements for URLs ending in `.jpeg|jpg|gif|png|apng|tiff`

### 2. Image Paste Support (images)
- Targets chat input boxes: `.mchat__say` (team/game/study chat)
- On `paste` or `drop` events: extracts clipboard file, checks if it's an image type (`image/jpeg`, `image/jpg`, `image/gif`, `image/png`, `image/apng`, `image/tiff`)
- Converts image buffer to base64 via `btoa()`
- Sends to service worker via `lt.comm.send({ type: 'pasteBuffer', options: { buffer: base64 } })` (timeout 10s)
- Service worker returns a link; stores in `LiChessTools.imageData` (localStorage, zip-compressed) with key = link without extension
- Inserts the URL text into the chat input box
- On `dragover`: prevents default to allow drop

### 3. Unlimited Message Length (unlimited)
- Removes `maxlength` attribute from `.mchat__say` input (original limit: 138 chars)
- Rewrites keydown handler for Enter: splits long messages into chunks of maxLength (138) using `splitLength()` function
- `splitLength()` logic:
  - Handles prefix (e.g. `/w`)
  - Uses ellipsis icon (`lt.icon.Ellipsis`) between fragments
  - Word boundary detection: if last word boundary is too far (> l-20), cuts at word boundary; otherwise cuts at l-1
  - Sends each fragment via `lt.uiApi.chat.post()` with 500ms/100ms delays between chunks
- If message starts with `/w`, splits use prefix `/w ` for first chunk

### 4. Team Chat Notifications (teamChatNotifications)
- **WebSocket Sockets**: Creates WebSocket connections to lichess team chat sockets
  - URL: `wss://` + random baseUrl from `data.socketAlts` or `data.socketDomains` + `/team/` + teamId + `?v=1&sri=` + lt.sri nonce
  - Max 3 simultaneous sockets (announces "maximumThreeTeams" if limit reached)
  - Auto-reconnect on error/close (except code 1006 unless debug mode)
- **Message Reception**:
  - WebSocket messages parsed via `lt.jsonParse(e.data)`
  - Type `message`: receives chat message data `{u: user, t: text}` → stores in `teamsData` as `newMessage`, triggers notifications
  - Type `crowd`: receives watcher count `{users: length}` → updates team crowd count, displays on teams list page button with `data-count` attribute (>1 users)
- **Notifications**:
  - Uses `AddNotifications` system to add notification entries for new team messages
  - Notification entry: icon `lt.icon.Group`, href `/team/` + teamId (encoded), content with translated text "You have new messages in team chat for %s", title "New messages"
  - Debounced at 5000ms (`handleNotifications = debounce(handleNotificationsDirect, 5000)`)
- **Teams List Page Buttons**:
  - On `/team/me` or `/team/leader`: adds `<a class="lichessTools-notify">` buttons to team rows in `table.slist tr.paginated`
  - Button icon: `lt.icon.BellOutline`, title "Notifications for team chat message"
  - Click toggles notification on/off for that team (adds/removes from teamsData + sockets)
  - Debounced at 100ms (`notificationButtonInTeams = debounce(notificationButtonInTeamsDirect, 100)`)
- **Storage**: Teams data stored in `LichessTools.chatNotificationTeams` (localStorage)
  - Loads on refresh via storage listener for `lichessTools.refreshNotifications`
  - Cleans orphan sockets (teams no longer in userTeams list)

### 5. Auto Whisper Button (autoWhisper)
- Creates button container `.lichessTools-mchatOptions-extraButtons` before `.mchat__messages` anchor
- Button: `<button class="lichessTools-autoWhisper">` with text `/w`, title "LiChess Tools - auto whisper"
- Click toggles `_autoWhisper` state (stored in `LiChessTools.autoWhisper`) → refreshes buttons
- Button states: `lichessTools-buttonOn` (toggle based on _autoWhisper), `lichessTools-buttonActive` (toggle based on canWhisper())
- **canWhisper()**: requires autoWhisper option + isInGame(true, true) (has `.result-wrap` → false; no `aPp` → false; body not `.playing` → false)
- **doAutoWhisper(value)**: regex `/^(?<whisper>\s*\/w\s+)?(?<text>.*)$/i` → always adds `/w ` prefix to text

### 6. Auto Prepend Move Button (prependMove)
- Button: `<button class="lichessTools-prependMove">` with text `M`, title "LiChess Tools - auto prepend last move in the game"
- Click toggles `_prependMove` state (stored in `LiChessTools.prependMove`) → refreshes buttons
- Button states: `lichessTools-buttonOn` (toggle based on _prependMove), `lichessTools-buttonActive` (toggle based on canPrependMove())
- **canPrependMove()**: requires prependMove option + isInGame(true, false) (has `.result-wrap` → false; no `aPp` → false; body not `.playing` → false)
- **getMoveString(selected)**: extracts move from `main.round aPp Z7yx` (last element), index+1, side indicator (`...` if index%3==0 else `.`), move number = Math.round(index/3), returns `(moveNumber.sideIndicator.move)`
- **doPrependMove(value)**: regex `/^(?<whisper>\s*\/w\s+)?(?<text>.*)$/i` → if text doesn't already start with move pattern, prepends moveString + space before text

### 7. Insert Selected Move Button (insertSelectedMove)
- Button: `<button class="lichessTools-insertMove">` with text `+`, title "LiChess Tools - insert the selected move"
- Click inserts current move into chat input boxes `.mchat__content .mchat__say`:
  - Finds inputs where selectionStart == selectionEnd and <2 (cursor at start)
  - Regex `/^(?<whisper>\s*\/w\s+)?(?<text>.*)$/i` → only applies to whisper messages
  - If whisper doesn't end with space, adds space before moveString
  - Uses `insertText(moveString, true)` to insert at cursor position
- Button state: `lichessTools-buttonActive` (toggle based on canInsertMove())
- **canInsertMove()**: requires insertSelectedMove option + isInGame(false, false) (no `.result-wrap`; has `aPp`; body not `.playing`)

### Input Handling (handleInput)
- On `input` or `focus` events for chat input boxes:
  - Skips if inputType is `deleteContentForward` or `deleteContentBackward`
  - Gets current value, applies `_prependMove` → doPrependMove, then `_autoWhisper` → doAutoWhisper
  - If value changed, sets new value on input box

### Whisper Detection
- On `keyup Enter` for chat input boxes:
  - Regex `/^(?<whisper>\s*\/w\s+)?(?<text>.*)$/i` → only applies to whisper messages
  - Creates `<li class="me lichessTools-whisper">` with `<t>` text "You whispered: %s" appended to `.mchat__content .mchat__messages`

## Observer Bindings
- `$('body').observer()` binds/unbinds `.mchat__content,.result-wrap` → refreshChatButtons
- `lt.uiApi.events.on('ply', this.refreshChatButtons)` — on ply event (move played) → refresh buttons

## DOM Elements
| Element | Purpose |
|---------|---------|
| `section.mchat` | Chat container (team/game/study) |
| `.mchat__say` | Chat input box |
| `.mchat__messages` | Messages anchor for extraButtons insertion |
| `.lichessTools-chat-url` | Highlighted URL links |
| `.lichessTools-mchatOptions-extraButtons` | Container for auto buttons |
| `.lichessTools-autoWhisper` | Auto whisper toggle button |
| `.lichessTools-prependMove` | Auto prepend move button |
| `.lichessTools-insertMove` | Insert selected move button |
| `.lichessTools-whisper` | Whisper message glyph class |
| `.lichessTools-notify` | Notification bell buttons on teams list |
| `td.lichessTools-notify` | New column for notify buttons |

## Storage Keys
| Key | Content | Compression |
|-----|---------|-------------|
| `LiChessTools.imageData` | Array of [key, response] pairs from image uploads | zip:true |
| `LiChessTools.autoWhisper` | Boolean toggle state | — |
| `LiChessTools.prependMove` | Boolean toggle state | — |
| `LichessTools.chatNotificationTeams` | Array of team data objects (teamId) | — |
| `chat.input` | Session storage for chat input | session:true |

## Translation Keys (en-US / ro-RO)
- `options.comm`: "Chat, forums, blogs" / "Chat, forumuri, blog-uri"
- `options.mchatOptions`: "Team/Study chat options" / "Opțiuni chat echipă/studiu"
- Individual option labels for each 7 preferences
- `newTeamMessagesText`: "You have new messages in team chat for %s" / "Ai noi mesaje în chat-ul echipei %s"
- `whispered`: "You whispered: %s" / "Ai șoptit: %s"

## Service Worker Communication
- `lt.comm.send({ type: 'pasteBuffer', options: { buffer: base64 } })` → service worker handles image upload to imgur/imgbb, returns `{link}` or `{err}`

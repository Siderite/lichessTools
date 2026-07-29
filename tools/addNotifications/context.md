# AddNotifications Tool

## Purpose

Adds custom notifications to Lichess notification system. Allows other tools to push notifications into the `#notify-app` area with icons, content, hrefs, and click handlers.

## How It Works

### Notification Registry

`notifications` array stores notification objects that each have a `getEntries()` async method returning entry arrays with:
- id, isNew flag, icon, href, target, content (DOM element), title, handler (click callback)

### Processing Logic

1. Collects entries from all registered notifications via `getEntries()` calls
2. Merges into `totalEntries` map by ID to avoid duplicates
3. Creates/updates DOM elements in `div.notifications` inside `#notify-app`:
   - Each entry gets `<a class="site_notification lichessTools-addNotifications">` with icon, content span, data-id, href, title
   - Click handler attached if entry has one
4. Updates `#notify-toggle > span` count and title

### Notification Count Tracking

Listens to socket event `notifications` for unread count updates — when count changes, re-processes notifications.

### Read All Cleanup

Listens to storage event `notify-read-all` to trigger forced processing after read-all action.

## Dependencies

- EmitRedraw, EmitContentLoaded

## Preferences

- `addNotifications` — single type (false/true), default true, advanced/hidden, needsLogin: true

## Key Methods

- `addNotification(notification)` — adds notification object to registry
- `processNotifications(el)` — processes and renders notifications in DOM
- `forcedProcessNotifications()` — debounced forced processing
- `updateNotificationCount(ev)` — reacts to socket unread count update
- `async start()` — sets up event bindings, interval checks

## Exposed API

`lt.notifications = { add: ..., refresh: ... }` when enabled.

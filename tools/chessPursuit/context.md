# ChessPursuit Tool

## Purpose

Adds a "Chess Pursuit" button in the top navigation menu that opens a dialog containing the Chess Pursuit game (a chess puzzle chase game). Key events are proxied from dialog to Chess Pursuit container.

## How It Works

### Menu Button

On `#topnav section a[href="/"]+div[role="group"]`:
- Creates `<a class="lichessTools-chessPursuit">` with text "Chess Pursuit" and title
- Click → closes mobile menu (`#tn-tg`), opens dialog with header "Chess Pursuit", loads Chess Pursuit via `LiChessTools.loadChessPursuit(container)`

### Key Event Proxy

On dialog keyup/keydown events:
- Creates cloned KeyboardEvent with same properties, triggers on `.dialog-content` element
- If cloned event defaultPrevented → prevents original event

### Dispose on Close

On dialog close event:
- Calls dispose() function from Chess Pursuit load, removes key event proxy handlers

## Dependencies

None explicitly listed. Depends on `LiChessTools.loadChessPursuit`, Dialog tool.

## Preferences

- `chessPursuit` — single type (false/true), default true, category: play

## Key Methods

- `proxyKeyEvents(ev)` → clones keyboard event and triggers on dialog content
- `async start()` → creates menu button if enabled

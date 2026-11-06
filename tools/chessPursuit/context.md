# ChessPursuit Tool

## Purpose

Adds a "Chess Pursuit" button in the top navigation menu that opens a dialog containing the Chess Pursuit game (a chess puzzle chase game). Key events are proxied from dialog to Chess Pursuit container.

## How It Works

### Menu Button

On `#topnav section a[href="/"]+div[role="group"]`:
- Creates `<a class="lichessTools-chessPursuit">` with text "Chess Pursuit" and title
- Click -> closes mobile menu (`#tn-tg`), opens dialog with header "Chess Pursuit", loads Chess Pursuit via `LiChessTools.loadChessPursuit(container)`

### Key Event Proxy

On dialog keyup/keydown events:
- Creates cloned KeyboardEvent with same properties, triggers on `.dialog-content` element
- If cloned event defaultPrevented -> prevents original event

### Dispose on Close

On dialog close event:
- Calls dispose() function from Chess Pursuit load, removes key event proxy handlers

## Dependencies

- `Dialog`  -  **declared** dependency (`dependencies = ['Dialog']`); both dialogs are created with `await lt.dialog({ header: ... })`.
- `LiChessTools.loadChessPursuit` - loads the game into the dialog's `.dialog-content`.

## Preferences

- `chessPursuit` - single type (false/true), default true, category: play

## Key Methods

- `proxyKeyEvents(ev)` -> clones keyboard event and triggers on dialog content
- `async start()` -> creates menu button if enabled

## Engine Notes (game.js)

Level sounds are declared in the level file and played by script beats. Both live as
engine directives, and `site/chessPursuit/studio.js` mirrors their grammar so the
studio readout warns about the same lines the engine would skip.

### `@sound/<key>/<slot values>/<copies>` - SoundDirective

- Runs while parsing: `parse(ctx)` returns `null`, so the sound is built before any
  beat asks for it and the line position does not matter.
- Slot values sit on commas; blanks read as 0 the way `SoundParams` does. Over 24
  values the extra ones are dropped with a note, and a non-numeric value skips the
  line so the sound stays undefined.
- A trailing all-digit part is the copy count (`parseDirective` folds it into
  `state`); `ArgumentDirective.args(ctx)` puts it back so both subclasses still see
  three arguments. Count defaults to 1 and anything under 1 becomes 1.
- `ArcadeAudio.add` clears the key first, so the last declaration for a key wins -
  also over the shipped `check`, `move`, `capture`, `checkmate` and `win` sounds.

### `@play/<key>[,<key>...][/wait]` - PlayDirective

- An `action` beat like `@2d`: `advanceBeat()` runs straight away, so only the sound
  waits and the script never stalls.
- Comma keys chain in order, each starting when the previous one ends. A trailing
  `/wait` also holds the NEXT `@play` line back, which makes
  `@play/a/wait` plus `@play/b` behave as `@play/a,b`.
- Queued cues sit on the game as `soundQueue` and `soundWaitUntil` next to
  `blockWait`; `updateSoundChain(now)` drains them from `tic()` (so they still play
  while a dialog beat is up) and both fields reset in `restart()`.
- Cue length is known at build time: `ArcadeAudio.soundLengthMs(settings)` divides
  `getApproxLength()` samples by the 44100 Hz the wav header pins, stores the result
  as `ms` on the pool entry, and `ArcadeAudio.play(key)` returns it. The hold adds
  80 ms of slack for the wav decode the element does before audio starts.
- Muted `play` returns 0, so a muted run plays the whole chain in one frame.
- The game's own `move` / `capture` / `check` / `checkmate` / `win` calls do not join
  the chain, so they can overlap a queued cue.

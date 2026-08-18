# Feedback Tool

## Purpose

Provides haptic/audio feedback for chess actions: piece pick, piece drop, opponent move, game start/end. Uses vibration API and AudioContext beep patterns.

## How It Works

### Detection Methods

1. **Piece Pick**: MutationObserver on `.selected` nodes — when added to cg-board, triggers `onGrabPiece()`
2. **Piece Drop**: MutationObserver on `.selected` nodes — when removed from cg-board, triggers `onDropPiece()`
3. **Opponent Move**: MutationObserver on `.last-move` style attribute changes — detects opponent piece animation
4. **Game End**: Socket event `endData` listener — checks for result-wrap/result element, determines win/loss/draw outcome

### Feedback Provider Class

- **Vibration**: Uses `navigator.vibrate()` with pattern array (requires user activation)
- **Beeps**: Uses AudioContext oscillator/gainNode to play square wave beeps at 25Hz with configurable duration/pause patterns
- **Disabled flag**: Can disable feedback

### Beep Patterns

| Event | Pattern |
|-------|---------|
| Piece pick/grab | [50] |
| Piece drop | [100] |
| Opponent move | [75] |
| Game start | [100, 50, 100] |
| Win | [50, 50, 50, 50, 150] |
| Draw | [100, 100, 100] |
| Loss | [150, 100, 350] |

### Game End Detection Logic

- Checks `$('body').is('.playing')` — if not playing, resets retries
- Checks for `.result-wrap .result` or analysis button href
- If neither found and retries < 8, delays 500ms retry
- Determines winner from `.game__meta__players` player link, compares to userId

## Dependencies

None explicitly listed. Depends on `lt.uiApi.socket`, `lt.feedback`.

## Preferences

- `feedback` — multiple type, possibleValues: ['piecePick', 'pieceDrop', 'opponentMove', 'gameStart', 'gameEnd'], default: '' (empty)

## Key Methods

- `checkGameEnd(ev)` — detects game end via socket event
- `onGameEnd(outcome)` — triggers feedback for game outcome
- `checkMove(mutations)` — detects piece pick/drop/opponent move via mutations
- `async init()` — creates `lt.feedback = new FeedbackProvider(lt, false)`

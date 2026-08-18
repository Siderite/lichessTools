# Read Position Command Tool

## Purpose

Provides a CLI command `/readposition` that reads aloud the current board position piece by piece, using speech synthesis. Useful for setting up a physical board or accessibility.

## Functionality

- Depends on `CliCommands`.
- **readPosition(speed, voiceIndex, instrument)**: Reads the board from FEN of current analysis node:
  - For each color (white, black), iterates through pieces in order K, Q, R, B, N, P
  - For each square (i=0..8 rows, j=0..8 columns): if the square contains that piece, speaks "color + piece name" then speaks the square coordinate (A-i minus 56-j → A1, B1, etc.)
  - Speed parameter controls timing: `timeout(50000/speed)` between piece names and `timeout(200000/speed)` between coordinates. Speech rate = speed/100
  - VoiceIndex parameter selects voice; instrument parameter defaults to 0
  - Checks if node changed during reading → stops automatically
- **keyHandler**: Keyboard handler on body:
  - Escape key while reading → stops reading, resets paused state
  - Space key while reading → toggles paused state (while paused, waits 500ms each iteration)

## CLI Command

`/readposition [speed] [voice] [instrument]`:
- Default speed = 100, voice=0
- Help text: "/readposition [speed] [voice] — default speed = 100, voice=0. Esc to stop, Space to pause. Read position"

## Preference

- **name**: `readPositionCommand`
- **category**: command
- **type**: single (on/off)
- **defaultValue**: true
- **advanced**: true
- **hidden**: true
- **offValue**: false

## Dependencies

`CliCommands`

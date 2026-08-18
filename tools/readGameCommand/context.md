# Read Game Command Tool

## Purpose

Provides a CLI command `/readgame` that reads aloud game moves from the current position forward, including SAN text with piece names, square coordinates, glyphs descriptions, comments. Optionally plays instrument sounds based on evaluation.

## Functionality

- Depends on `EmitRedraw` and `CliCommands`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`). Hidden (`hidden: true`). offValue: false.
- **defaultSpeed**: 100
- **pieces**: N=knight, B=bishop, R=rook, Q=queen, K=king (also Unicode chess symbols)
- **glyphs**: !=good move, ?=mistake, !!=brilliant, ??=blunder, !?=interesting, ?!=inaccuracy
- **instruments**: [null, 'celesta', 'clav']

- **getReadText(node)**: Converts node SAN into readable speech text:
  - Starts with node.san or empty
  - Adds glyph description if present and not already in comments
  - Adds node comments (replaces "N.N" → "NpointN")
  - Replaces all r/n/periods with commas
  - Regex replacement converts SAN to spoken format: piece name + start square (a→a-) + "takes" if x + end square (a→a-) + "promotes to" if = + "check" if + + "mate" if # + "castles" if O-O/O-O+
  - Returns formatted text

- **readGame(speed, voiceIndex, instrument)**: Reads moves forward from current node:
  - Speed defaults to 0 (if not specified); instrument selects from instruments array
  - Sets reading=true; starts at analysis.node with path
  - Loop while reading and node exists:
    - userJump(path), analysisRedraw()
    - Gets readText via getReadText(node)
    - If instrument and eval exists: calculates centipawns, converts to sigmoid q (24/(1+exp(-0.004*cp*side)), side=-1 for black orientation), plays instrument MP3 file `instrument/celesta/clav/c{sndIndex}.mp3` at 0.05 volume
    - Speaks text via lt.speak with rate speed/100, voiceIndex
    - If node changed during reading → stops
    - Advances to next child (node.children.at(0), path += node.id)

- **keyHandler**: On body keyup: Escape key → stops reading.

## CLI Command

`/readgame [speed] [voice] [instrument]`:
- Default speed = 100, voice=0, instrument=0
- Help text: "/readgame [speed] [voice] [instrument] — default speed = 100, voice=0, instrument=0. Esc to stop. Read game moves from here"

## Hash Trigger

- If hash == `#readgame` on start → replaces history state, jumpsToIndex(), readsGame with defaults immediately.

## Preference

- **name**: `readGameCommand`
- **category**: command
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true
- **hidden**: true
- **offValue**: false

## Dependencies

`EmitRedraw`, `CliCommands`

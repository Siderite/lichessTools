# Read Game Command Tool

## Purpose

Provides a CLI command `/readgame` that reads aloud game moves from the current position forward, including SAN text with piece names, square coordinates, glyphs descriptions, comments. Optionally plays instrument sounds based on evaluation.

## Functionality

- Depends on `EmitRedraw` and `CliCommands`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`). Hidden (`hidden: true`). offValue: false.
- **defaultSpeed**: 100
- **instruments**: [null, 'celesta', 'clav']

- **No own pieces/glyphs maps**: the tool has no speech vocabulary of its own; conversion is done by the core `lt.getSpeakableText(text, options)` (scripts/lichessTools.js). The speech text for a node is built inline in readGame as `lt.getSpeakableText(san + ' ' + comments, options)` with:
  - `readAnnotations: true`, `glyphs: node.glyphs`, `isCheck`/`isMate` derived from the san's trailing + / #
  - `dotDecimalWord: true` ("N.N" → "NpointN"), `periodsToCommas: true` (all r/n/periods → commas), `fileAid: true` (a-file squares read as a-)
  - `pieceColors: false` (unicode piece symbols → bare piece names, no color), `briefMateWord: true` ("#" and isMate read as "mate"), `castlePhrase: false` ("castles" / "castles long")
  - `glyphsAfterMove: true` (rating words are inserted right after the first converted move, i.e. "move, rating, comment" like the old getReadText order), `glyphsAfter: true` (fallback: rating appended after the text when it contains no move)
  - Core converts SAN to spoken words (piece name + squares + "takes" if x + "promotes to" if = + "check"/"mate") and additionally sanitizes comments: urls → host + "URL", ratings "123-456" → "123, 456", "#-30" → "mate in 30 for black", "lichess" → "lee chess", optional cls:/bkm:/prc:/rnd: tag removal.

- **readGame(speed, voiceIndex, instrument)**: Reads moves forward from current node:
  - Speed defaults to 0 (if not specified); instrument selects from instruments array
  - Sets reading=true; starts at analysis.node with path
  - Loop while reading and node exists:
    - userJump(path), analysisRedraw()
    - Builds speakable text via lt.getSpeakableText(node.san + " " + lt.getNodeCommentsText(node), options above)
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

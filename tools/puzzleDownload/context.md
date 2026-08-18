# Puzzle Download Tool

## Purpose

Adds a button next to each puzzle link on the puzzles page that opens a dialog showing the PGN of the puzzle position + solution, with a copy-to-clipboard button. Shift-click includes the previous move before the puzzle start.

## Functionality

- Depends on `ChessOps`, `EmitRedraw`, and `Dialog`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`).
- **showPuzzlePgn(puzzleId, withPreviousMove)**: Generates PGN for a puzzle:
  - Fetches puzzle via API (puzzleId)
  - Uses ChessOps to parse puzzle game PGN SANs, reconstruct position from starting FEN
  - Plays moves up to initialPly (or initialPly-1 if withPreviousMove)
  - Sets new FEN header and SetUp=1
  - Adds previous move child node with "Previous move" comment if requested
  - For each puzzle solution UCI, parses and adds SAN child nodes
  - Sets headers: Event="Puzzle #puzzleId from game puzzle.game.id", Themes=puzzle.puzzle.themes joined, Site=https://lichess.org/training/puzzleId; deletes Date/Round/White/Black/Result
  - Creates dialog with textarea containing PGN and copy button (Clipboard icon)
  - Copy button: copies selected text or full PGN to clipboard, announces "PGN copied to clipboard" or "Clipboard access denied"

- **handlePuzzleLinks()**: On redraw event: finds puzzle links in `.infos.puzzle a[href^="/training/"]`:
  - For each link where next element doesn't already have puzzleDownload button: extracts href, matches `/training/id` regex, checks text == "#puzzleId"
  - Creates `<button>` with class `lichessTools-puzzleDownload`, ExternalArrow icon, title "Puzzle PGN", click handler that fetches puzzleId from previous link and calls showPuzzlePgn (shiftKey → withPreviousMove)
  - Inserts after the puzzle link

## Preference

- **name**: `puzzleDownload`
- **category**: puzzles
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true

## Dependencies

`ChessOps`, `EmitRedraw`, `Dialog`

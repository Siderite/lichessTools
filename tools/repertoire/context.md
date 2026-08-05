# Repertoire Tool — Context

## Overview

Compares moves on Lichess analysis pages with a user's White or Black opening repertoire. The user selects one PGN file for each color in LiChess Tools preferences. Matching moves receive a green book glyph in the move list. The tool also distinguishes the player's deviation, an opponent deviation, and the end of a repertoire line.

## Matching

- Uses the repertoire matching the analyzed player's color (`analysis.data.player.color`, with the initial analysis orientation as fallback).
- Parses every game and every variation in the selected PGN through Chessops.
- Stores normalized FEN positions (piece placement, side to move, castling rights, and en-passant square). Halfmove and fullmove counters are ignored.
- For every normalized position, stores its prepared child moves by UCI together with SAN display text.
- Position matching makes the feature transposition-aware: different move orders reaching the same position match.
- Marks every visible analysis-tree move whose resulting position occurs in the selected repertoire.

## Display preference

`repertoireDisplay` is an advanced multiple-choice preference:

- `book` — green book markers for repertoire positions.
- `deviations` — player deviation, opponent deviation, and repertoire-end markers.
- `arrows` — prepared moves on the board when viewing the position before a deviation.

The default is `book`, keeping the default presentation limited to the original repertoire-matching request. All optional prepared-move arrows use the same thin blue style.

## Move states

- **Green book**: the resulting position occurs in the repertoire, including a return by transposition.
- **Blue target**: the player made a different move even though the repertoire contains one or more prepared moves from the preceding position. The tooltip lists those moves.
- **Orange branching arrows**: the opponent chose an unprepared reply from a position where the repertoire contains other replies. The tooltip lists the prepared replies.
- **Gray flag**: the first move after a repertoire position with no prepared continuations, identifying the genuine end of the line.

Deviation and end markers are calculated independently for every branch in the analysis tree. This keeps markers attached to earlier attempts after the user navigates elsewhere and allows several blue targets to remain visible at once. When arrows are enabled and the board is on a position whose children include a deviation, prepared repertoire moves are drawn as blue arrows for either player's deviation. No later move is classified as a deviation while its branch remains outside the repertoire; classification resumes after the branch returns or transposes into a known repertoire position.

## Storage and lifecycle

The two files use the existing `file` preference and IndexedDB-backed file-handle storage. Files are read and parsed when the tool starts. If the browser requires renewed permission after navigation, the tool retries after the next user click. Markers are restored after Lichess redraws and removed when the files are cleared or the tool is unavailable. Before restoring markers, the tool rebuilds LiChess Tools' move-element cache because Lichess can reuse connected DOM elements for different paths when variations are promoted or reordered. A move-list MutationObserver also restores markers when Lichess replaces inactive variation DOM after its redraw has returned; mutations caused solely by repertoire glyphs are ignored.

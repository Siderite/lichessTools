# Mirror Board Tool

## Purpose

Adds a "Mirror" button to the Board Editor (study analysis mode) that mirrors the FEN position. Mirroring flips the board orientation — e.g., white pieces become black and vice versa, ranks reversed.

## Preference

- **name**: `mirrorBoard`
- **category**: `analysis`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: true
- **advanced**: true

## Dependencies

Requires `EmitRedraw` tool.

## Behavior

When enabled:
1. Creates a `<button class="lichessTools-mirrorBoard">` inserted before the study-as form in `.board-editor__tools .actions`
2. Button text: "Mirror" (translated), title: "LiChess Tools - mirror position", icon: `lt.icon.Mirror`
3. On click, reads the FEN from the Board Editor input (`div.copyables input[enterkeyhint="done"]`) and sets it to the reversed FEN via `lt.reverseFen(fen)`

When disabled: removes any existing mirror button from DOM.

## Effect

The mirror button allows users to quickly flip a position in the board editor (swap colors, reverse ranks/files).
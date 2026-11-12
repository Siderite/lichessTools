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

None declared. The board refresh is driven by the board editor's own `change` handler, reached through `input.trigger('change')`; this file never reads `lt.emitRedraw`, `lt.analysisRedraw` or the `lichessTools.redraw` event, so it declares no `dependencies` field.

## Behavior

When enabled:
1. Creates a `<button class="lichessTools-mirrorBoard">` inserted before the study-as form in `.board-editor__tools .actions`
2. Button text: "Mirror" (translated), title: "LiChess Tools - mirror position", icon: `lt.icon.Mirror`
3. On click (`mirrorBoard`), reads the FEN from the Board Editor input (`div.copyables input[enterkeyhint="done"]`), mirrors it via `LiChessTools.ChessMetrics.mirrorFen(fen)` (`scripts/lichessTools-chessMetrics-ChessMetrics.js:105` - reverses the ranks, flips piece letters through `'RNBQKPrnbqkp'` rotated by 6, swaps the active colour and flips/sorts the castling field) and writes it back with `input.val(mirrorFen).trigger('change')`

When disabled: removes any existing mirror button from DOM.

## Implementation notes

- `start()` removes any `button.lichessTools-mirrorBoard` under `.board-editor__tools .actions` before the `if (!value) return;` check, so re-entry never stacks buttons or click handlers.
- The button is rebuilt on every enabled `start()`: `attr('title', ...)`, `.on('click', this.mirrorBoard)`, `.insertBefore('.board-editor__tools .actions form[action="/study/as"]')`, then `.find('span.text').text(...).attr('data-icon', lt.icon.Mirror)`. `lt.icon.Mirror` is the mirror glyph `\uD83E\uDE9E` from the icon map in `scripts/lichessTools.js`.
- `mirrorBoard` is an arrow-function class field; `start()` and the handler each bind their own `const lt = this.lichessTools;`.
- The click path has no guard on the `$()` lookup. On a non-matching selector Cash returns an empty (truthy) cash array, so `input.val()` is `undefined`, `mirrorFen` returns it unchanged through its `if (!fen) return fen;` guard and `input.val(...)` iterates nothing - the click is a silent no-op.
- This tool owns no timers, no `pubsub` handlers, no storage keys and no wrapped lichess functions.
- Caveat in the helper (not in this file): `mirrorFen` tests the 4th FEN field with `/^([a-h])([1-8])$/.test(...)` and then indexes that boolean (`scripts/lichessTools-chessMetrics-ChessMetrics.js:129-131`), so a FEN carrying an en-passant square mirrors to `NaN` in that field.

## Internationalization (intl)

- `options.mirrorBoard` - "Mirror button in Board Editor" (the label shown under the Analysis category)
- `mirrorButtonText` - "Mirror" (button label), `mirrorButtonTitle` - "LiChess Tools - mirror position" (button title)
- `ro-RO` entries are `\uXXXX` escaped; both labels are read through `trans.noarg(...)`

## CSS

`tool.css` only aligns the icon glyph: `body.lichessTools .lichessTools-mirrorBoard span:before` sets `vertical-align: baseline`, `position: relative`, `top: -0.25em`, `left: -0.25em`, `margin-inline: 0 !important`.

## Effect

The mirror button allows users to quickly flip a position in the board editor (swap colors, reverse ranks/files).
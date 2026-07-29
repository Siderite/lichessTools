# Export PGN Tool — Context

## Overview

The **ExportPGN** tool provides functionality to export chess game/analysis PGN (Portable Game Notation) from lichess.org analysis trees. It copies the generated PGN to clipboard or returns it as text. The exported PGN can include various metadata: clock values, computer evaluations, tags, arrows/circles shapes, comments, and accuracy glyphs.

## Dependencies

None explicitly declared — relies on core infrastructure (lichessTools, $, translator, announce, writeToClipboard).

## Preferences

Two preferences:

1. **exportPGN**
   - name: `exportPGN`
   - category: `analysis`
   - type: single (radio toggle)
   - possibleValues: [false, true]
   - defaultValue: true
   - advanced: true
   - hidden: true

2. **exportPGNoptions**
   - name: `exportPGNoptions`
   - category: `analysis`
   - type: multiple (checkboxes)
   - possibleValues: ['exportClock', 'exportEval', 'exportTags', 'exportShapes']
   - defaultValue: 'exportClock,exportEval,exportTags,exportShapes' (all enabled)
   - advanced: true

## Upgrade History

Version 2.3.193 added `exportShapes` option to exportPGNoptions.

## UI Behavior

When enabled (`exportPGN=true`), the tool sets `lt.exportPgn = this.exportPgn`, making the export function available as a global method on the LiChessTools singleton object. When disabled, `lt.exportPgn = null`.

## Export Function (`exportPgn`)

The async function `exportPgn(path, options)` generates PGN from an analysis tree node path with configurable options.

### Default Options (merged with user-provided)

| Option | Default | Description |
|--------|---------|-------------|
| **copyToClipboard** | false | Copy result to clipboard instead of returning text |
| **fromPosition** | false | Export from a specific position (last node in path list) |
| **toPosition** | false | Export up to a specific position (not including last node) |
| **separateLines** | false | Separate variations into separate PGN lines |
| **unicode** | false | Use unicode chess piece symbols instead of SAN letters |
| **print** | false | Print format (HTML with images and breaks vs standard PGN) |
| **exportClock** | user preference | Include clock values per move |
| **exportEval** | user preference | Include computer evaluation per move |
| **exportTags** | user preference | Include PGN tags header |
| **exportShapes** | user preference | Include arrows and circles in comments |
| **exportComments** | true | Always include text comments |
| **exportGlyphs** | true | Always include accuracy glyphs (blunder/mistake/inaccuracy/etc) |
| **exportPly** | true | Always include ply numbering (1. / 2... etc) |
| **searchObj** | null | Optional search object with regex for node filtering |

### PGN Generation Process

1. Retrieves nodes from analysis tree at `path` via `analysis.tree.getNodeList(path)`
2. Clones selected nodes (from startIndex based on fromPosition/toPosition options) into a linear chain
3. Gets variation nodes via `getVarNodes(varNode, separateLines)` — if separateLines=true, splits variations into independent PGNs; otherwise keeps all in one tree
4. Builds tags header if exportTags enabled:
   - Study chapter tags (cloned from analysis.study.data.chapter.tags)
   - StartFlipped='1' and Orientation='Black' if board is flipped
   - FEN tag if not starting position, with SetUp='1'
   - Site = current location.href
   - UTCDate/UTCTime = current date ISO format
5. Renders each variation node into PGN text via `renderNodesTxt`
6. Joins all PGNs with double newline separator

### Node Rendering (`renderNodesTxt`)

Recursive function that renders a tree node into PGN text:

- **Root node (id='')**: renders glyphs and comments only, followed by newline
- **First child (mainline)**: ply prefix + SAN move (fixCrazySan for crazy chess where 'P' prefix removed) + glyphs + comments
- **Variations (children[1..n])**: rendered as parenthesized variations `(plyPrefix san glyphs comments variation)`
- **Mainline continuation**: appended after variations if multiple children exist

### Special Rendering Functions

| Function | Purpose |
|----------|---------|
| **fixCrazySan** | Removes 'P' prefix from crazy chess SAN moves |
| **plyPrefix** | Adds ply numbering: `1.`, `2...` etc based on node.ply (if exportPly enabled) |
| **centisecondsToClock** | Converts centisecond clock value to HH:MM:SS format |
| **evalToString** | Converts evaluation object to string: cp/100 or '#mate' |
| **renderGlyphs** | Adds accuracy glyphs symbols ($1-$6 for standard, $id for custom) per node (if exportGlyphs enabled) |
| **renderComments** | Text comments in `{comment}` format; print mode uses `<br/>` + HTML image of position |

### Shapes/Extra Metadata Rendering (in Comments)

When `exportShapes`, `exportClock`, or `exportEval` are enabled, extra metadata is rendered as percentage-tagged blocks inside comments: `[%type value1,value2,...]`. Types:
- **cal**: circle arrows (dest present → cal; no dest → csl) — brush uppercase + orig + dest codes
- **clk**: clock values in HH:MM:SS format
- **eval**: centipawn or mate string

Rank shapes and customSvg shapes are excluded.

### Unicode Translation

When `unicode` enabled, chess piece letters (N/B/R/Q/K) in SAN moves replaced with unicode icons (`lt.icon.WhiteChessKnight`, etc). Regex matches piece letter + destination + promotion letter.

### Search Object Support

Optional `searchObj` parameter with regex for filtering nodes:
- Tracks matched node paths in `searchObj.nodes` array
- Uses normalized string output and meta tokens ($white/$black/$leaf) for regex matching on FEN or text output
- lastIndex tracking for regex position

### Error Handling

If generation fails, console.warn logged + announcement "errorGeneratingPGN" via lt.announce.

### Clipboard Copy

When `copyToClipboard` enabled: uses `lt.writeToClipboard(result)` with success message "PGN copied to clipboard" and failure message "Clipboard access denied". Print mode affects clipboard behavior.
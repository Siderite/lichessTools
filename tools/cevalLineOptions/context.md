# CevalLineOptions Tool

## Purpose

Enhances computer evaluation line display in analysis/PV boxes with multiple options: highlight same moves across variations, color evaluations by quality, show more PV lines (10 instead of 5), depth chart on eval pearl, download engine analysis JSON, plot PV distribution, move cost visualization.

## How It Works

### Highlight Same Moves

MutationObserver on `div.pv_box span.pv-san`:
- Collects SAN moves into dict by key (SAN-turn)
- If count > 1 and highlight enabled: assigns unique CSS class `lichessTools-cevalHighlight-[index]` via hash-based index assignment
- Also respects `highlightOnlyMe` — only highlights for current orientation's turn

### Color Evaluation

MutationObserver on `div.pv[data-uci]`:
- Reads eval text from strong element (cp or mate)
- Calculates win percentage via `lt.winPerc()`
- Best PV gets `best` class; others get `good` (<1% diff), `mistake` (>10% and ≤20%), `blunder` (>20%)

### More Lines

Wraps `analysis.ceval.selectEngine`:
- After call: checks external engine status (limits to 5 lines if external)
- Creates `<switch class="lichessTools-cevalMoreLines">` button in multipv setting area
- Toggle between max=5 and max=10 via storage persistence

### Depth Chart

MutationObserver on `div.ceval`:
- Stores eval data per depth in `db[analysis.path]` Map
- Draws canvas chart inside eval pearl: sigmoid-clamped cp values plotted against depth
- Calculates deviation (average after vs average before) — displays on pearl with color gradient if significant (>50 centipawns)

### Download Ceval

MutationObserver on `lichessTools.redraw`:
- Creates `<button class="lichessTools-downloadCeval">` in ceval div.engine area
- Click: downloads JSON of all stored eval data (with PV panel text as comment header)

### Move Cost

MutationObserver on `div.pv[data-cost]`:
- Reads discoverDepth from db — depth at which UCI move was first discovered as candidate
- Colors via gradient: 1=gray, 2=green, 5=yellow, 15=red
- Shows cost in title text

### PV Plot (drawPvs)

MutationObserver on `lichessTools.redraw`:
- Creates `<div class="lichessTools-drawPvs">` in ceval area
- Plots previous node's PVS cp values as horizontal bars with count and quality classes (good/warn/bad)
- Also plots current node's eval

## Dependencies

- EmitRedraw, EmitCeval

## Preferences

- `cevalLineOptions` — multiple type: ['highlight', 'highlightOnlyMe', 'moreLines', 'colorEvaluation', 'depthChart', 'downloadCeval', 'pvs', 'cost'], default: 'moreLines'

## Key Methods

- `handlePvsDirect()` → highlights, colors evaluations, shows move costs
- `handleMoreLines()` → manages multipv max toggle button
- `handleExternalEngine()` → checks external engine status and limits lines
- `drawChart()` → draws depth chart canvas on eval pearl
- `downloadCevalData()` → downloads analysis JSON
- `drawPvs()` → plots PV distribution bars
- `handleCeval(args)` → stores eval data in db Map per path/depth

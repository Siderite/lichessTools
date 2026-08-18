# WikiFen Tool — Context

## Overview

The **WikiFenTool** provides chess opening wiki information from [Wikibooks](https://en.wikibooks.org) based on chess positions (FEN), rather than move sequences. It enhances the Lichess opening explorer and TV/mini-game wiki sections with more accurate opening theory content.

## Dependencies

- **EmitRedraw** — Required for redraw event handling

## Preferences

| name | category | type | possibleValues | defaultValue | advanced |
|------|----------|------|----------------|--------------|----------|
| `wikiFen` | analysis2 | single (radio) | [false, true] | true | yes |

When enabled, the tool injects Wikibooks opening theory content into Lichess UI elements. When disabled, no wiki content is added.

## Core Mechanism

### Position-to-Wiki Dictionary (`wikiUrls_dict`)

The tool loads a JSON file (`wikiUrls.json` from extension assets via `Comm.getData`) that maps chess positions (identified by FEN string) to Wikibooks page titles. Each position may have multiple possible wiki titles; the first one is used as primary match.

### Wiki API Fetching

When a position lookup succeeds, the tool fetches content from Wikibooks via its API:
- URL: `https://en.wikibooks.org/w/api.php`
- Parameters: `titles=<title>&redirects&origin=*&action=query&prop=extracts&formatversion=2&format=json&exchars=1200`
- Extracts up to 1200 characters of page content

### HTML Cleaning

The fetched HTML is cleaned by removing:
- `<h1>` headers
- Empty paragraphs (`<p>(<br />|s)*</p>`)
- "Theory table" section header (`<h2><span id="Theory_table">...</span></h2>`)
- Explanation text about theory tables and algebraic notation
- Contributing conventions text

A "Read more on WikiBooks" link is appended at the end.

## Two Main Functions

### `handlePly` — Explorer Tooltip Enhancement

Triggered on `ply` events (when the analysis node changes). When enabled:
1. Gets current node FEN → position string
2. Looks up position in `wikiUrls_dict` → wiki title
3. Fetches cleaned wiki HTML via API
4. Sets the tooltip (`attrSafe('title')`) on the explorer box title div (`div.opening__wiki__markup__placeholder`)

This adds a tooltip with opening theory text when browsing the explorer.

### `updateOpeningWiki` — Opening Intro Replacement

For Lichess opening intro pages (TV games, mini-games):
1. Checks if existing wiki placeholder text is short (<60 characters)
2. Gets position from board (`opening__intro`)
3. Looks up position in `wikiUrls_dict` → title
4. Fetches cleaned wiki HTML via API
5. Replaces the placeholder div content with full wiki HTML

This replaces brief Lichess opening descriptions with detailed Wikibooks content.

## Function Wrapping — Wiki Override

When `analysis.wiki` is called (Lichess native function that renders wiki based on move path):
- The tool **wraps** this function via `wrapFunction`
- In the **before** phase:
  - Computes the Lichess-derived title from move path (`Chess_Opening_Theory/<path>` where path = ply-prefix + SAN moves joined)
  - Gets current position FEN → alternative titles from `wikiUrls_dict`
  - If alternative titles exist AND none matches the path-derived title (after space→underscore conversion):
    - Creates newNodes array parsed from the Wikibooks title regex (`/\/\d+\.+[\s_]*([^\s_\/]+)/g`)
    - Calls original `analysis.wiki` with these newNodes instead
    - Returns **false** to prevent Lichess's original function execution
  - Otherwise, no override (original function proceeds)

This ensures the wiki content matches the actual position rather than the move sequence path, which may differ when transpositions exist.

## Constraints

- Path length must be ≤30 moves and ≤255 characters (minus 21 for prefix)
- Only works on pages with `analysis.wiki` present (opening intro, TV/mini games)
- Requires `wikiUrls_dict` loaded from extension assets

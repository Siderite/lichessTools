# Download All Studies Tool — Context

## Overview

The **DownloadAllStudiesTool** adds a link to download all PGN studies of a player on the study search page. When a user search query contains `owner:[username]`, it creates a link pointing to the API endpoint `/api/study/by/[userId]/export.pgn` for bulk downloading.

## Preferences

- **name**: `downloadAllStudies`
- **category**: `study`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Link Creation (`start`)

1. Removes existing `.lichessTools-downloadAllStudies` links.
2. If no preference value → returns (disabled).
3. Checks for `div.nostudies` — if present (no studies found), returns.
4. Checks for search form `form.search` — if not present, returns.
5. Extracts query text from `input[name="q"` in form.
6. If no query → returns.
7. Parses regex `/bowner:([^\s]+)/i` from query text to extract userId.
8. If no match → returns.
9. Creates link element:
   - Class: `lichessTools-downloadAllStudies`
   - href: `/api/study/by/[userId.toLowerCase()]/export.pgn`
   - Title: "LiChess Tools - all studies for this player"
   - Text: "Download all studies"
- Appended to `div.box__top`.

## Page Scope

- Only activates on study search pages with a query containing `owner:` parameter.

## Cleanup on Disable

When preference is off:
- Removes `.lichessTools-downloadAllStudies` links.
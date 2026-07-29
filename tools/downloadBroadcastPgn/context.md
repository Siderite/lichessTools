# Download Broadcast PGN Tool — Context

## Overview

The **DownloadBroadcastPgnTool** adds a download button for broadcast (relay/tour) PGN files on broadcast pages. When viewing a broadcast, it creates a link to the API endpoint `/api/broadcast/[broadcastId].pgn` that allows downloading the full PGN of the broadcast in a new tab.

## Preferences

- **name**: `downloadBroadcastPgn`
- **category**: `study`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Add Download Button (`addDownloadButton`)

1. Checks for study object in analysis — if not present, returns.
2. Finds container: `.study__side div[role=tablist]` OR `.relay-tour__side__header`.
3. If no container → returns.
4. If disabled AND button exists → removes button and returns.
5. If enabled AND broadcastId exists (`study.relay.data.tour.id`) AND no button present:
   - Creates link element:
     - Class: `lichessTools-downloadBroadcastPgn`
     - target="_blank", download attribute (triggers browser download).
     - Icon: `lt.icon.Download`.
     - Title: "LiChess Tools - download broadcast PGN".
     - href: `/api/broadcast/[broadcastId].pgn`.
   - Inserted after `.search` OR `.relay-tour__side__name` span in container.

## Page Scope

- Only activates on broadcast/relay tour pages where `study.relay.data.tour.id` exists.

## Cleanup on Disable

When preference is off:
- Removes `.lichessTools-downloadBroadcastPgn` buttons from containers.
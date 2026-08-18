# TournamentTopBoard Tool — Context

## Overview

The **TournamentTopBoardTool** automatically navigates to the featured/top board game of a tournament when that game ends. It follows the tournament's "featured" game and redirects the browser to the next featured game upon completion.

## Dependencies

- None explicitly listed

## Preferences

| name | category | type | possibleValues | defaultValue | advanced | needsLogin |
|------|----------|------|----------------|--------------|----------|--------|
| `tournamentTopBoard` | TV | single (radio) | [false, true] | true | yes | yes |

Requires logged-in user. When enabled: automatically follows tournament top board. When disabled: no behavior. Not logged in → feature silently disabled with console debug message.

## Tournament ID Extraction

- From location hash: regex `#tournament=(?<tourId>[\w]{8})` extracts tourId
- From DOM attribute: `$('body').attr('data-tournament-id')` gets tourId

## Featured Game Link Enhancement

When a tournament page is detected (`tourId` from body attribute):
1. Checks hash = `#tournament=+tourId`
2. Finds featured game anchor (`div.tour__featured > a.cg-wrap`)
3. If href doesn't include the tournament hash → appends it to href

This ensures the featured game link includes the tournament context hash.

## Next Board Navigation (`findNextBoard`)

Async function triggered on `endData` socket event:

1. Extracts current gameId from pathname regex `/(?<gameId>\w{8})(?:\/|$)`
2. Fetches tournament info via `lt.api.tournament.getInfo(this.tourId)`
3. If tournament is finished → exits
4. Gets featured game ID (`data.featured.id`)
5. If no featured gameId OR current gameId == featured gameId:
   - Sets timeout to retry in 3000ms, returns
6. Gets featured orientation (`data.featured.orientation` or defaults 'white')
7. Redirects browser to new location: `/${gameId}/${orientation}#tournament=+this.tourId`

## Event Binding

- When enabled AND tourId extracted: binds `lt.uiApi.socket.events.on('endData', this.findNextBoard)`
- Clears any existing timeout before binding
- Calls `findNextBoard()` immediately after start

When disabled OR no tourId: unbinds event, clears timeout.

<!-- tags: when reading context, these tags mark what to do:
TAG_INIT = you must init the tool when the condition says so (for example when you make a tool instance, or a new tool)
TAG_PREFS = you must consider the prefs of the tool, in the scope of the tag's when
-->

<!-- TAG_PREFS scope: when adding or using tool MarathonRankings -->
# Tool `MarathonRankings`

This is the page the user asks for in issue #1613: a board of the players who
keep a marathon tournament going. Lichess runs one marathon per season (spring,
summer, autumn, winter), and the season slug of a year names its tournament
directly - `spring26` is both the slug and the id you read on.

Lichess ranks a marathon by arena points, and records the hours a player spent
playing without publishing that figure, so the board ranks by the games played
instead: the sheet of a standing row carries one character per game. A marathon
is not a speed format, so the page never says "bullet" or "blitz" as the metric -
those words appear only on the badges marking the players who also hold one of
Lichess's own top 100 rating places.

The season page answers its standings ten rows a page and its field is 21k
players wide, so the page reads a bounded slice: rows per season event, walked
page by page with a gap between requests, and the season events indexed by
whole marathon years counted back from the current one.

## Prefs
`marathonRankings | community | [ false, true ] | defaultValue: true`
There is one preference and it is a plain toggle. The years and the rows the
board spends are class fields - `marathonRankingsYears` (3) and
`marathonRankingsRows` (25) - so the page reads always cost the same and there
is nothing to tune. Three years back index twelve season slugs; once the ones
that have not started yet are skipped, eleven season events go on the page.

## Page
The tool hijacks the community page `/player#marathon` - it does not own a
`/page/*` of its own. The tool takes over the community player page: it keeps
the subnav (the community menu Lichess already carries) and replaces the rest
of `div.page-menu__content` with the community__leaders layout of the player
page. The tool marks that container `lichessTools-marathonRankings` so the
sheet can scope the block, and re-marks the marathon subnav anchor `active`.

A slug whose season has not run under answers 404 and is simply left out. A
season event that has not started yet (its startsAt is in the future) is left
out too, since the field is empty.

Reads are cached by season slug and by rating list, the way the records pair
caches its harvests:
`LiChessTools.marathonRankings-{slug}` holds one season event read, and
`LiChessTools.marathonRankings-top-{perfKey}` holds one rating list.
A finished event answers the same rows forever, so it may stay cached for
`marathonRankingsStaleMs`; an ongoing one may only stay cached for
`marathonRankingsLiveMs`.

## Subnav
On the community pages whose subnav carries the "Tournament shields" entry
(`/player`, `/stat/rating/distribution/<control>`, `/tournament/leaderboard`,
`/tournament/shields`, `/player/bots`, `/fide?community=1`), the tool adds a
link to `/player#marathon` right after that anchor. It detects the shields
anchor in `nav.subnav__inner`, not the URLs, so the link appears on every page
carrying that subnav and on those pages only.

## Look
Each table names its columns in a head row, so a cell below carries only its
number: a season table has a column per figure, and the combined board adds the
rank it gave the row, the seasons a player showed up in and a last cell for the
rating places - there whether a player holds one or not, so the columns of the
board line up for every row.

Season cards and the board card sit side by side under the leaderboards block;
each is a `<section class="… user-top">` and inherits Lichess's own styling
for that shape, so no container of our own is needed and the cards flow like
the community page's leaders do.

The player link sits inside a `<div class="player">` cell rather than directly
in the row, so other tools can place siblings next to it without breaking the
row. The seasons and the combined board follow the community__leaders shape of
Lichess's own leaders block.

## Code
`seasonSlugs(years, year)` spells the season slugs of the indexed years.
`standingRow(player)` maps one standing row, taking games from the sheet.
`fetchSeason(slug, rows)` reads one season event and caches it.
`fetchRatingPlaces(perfKey)` reads one of Lichess's own top 100 lists.
`aggregateSeasons(rowsBySeason)` folds the season rows into one row per player.
`markRatingPlaces(board, placesByPerf)` stamps a board row with the rating places
the player holds, under a `topBullet`/`topBlitz` field named from the perf key.
`boardOrder(a, b)` orders the board by games, then points, then name, then
rating - never by any hidden figure.
`headRow(columns)` writes the head of a table: a label per column.
`rowElem(entry, rank)` writes the cells under it - a number per column, a `player`
cell wrapping the user link, and a `places` cell of their own that is always
there (hidden when empty), so a board keeps its columns lined up whether a
player holds a place or not.
`addSubnavLink` puts the link in the subnav of the community pages.
`processPage` takes the /player#marathon page over: keeps the subnav, empties
`div.page-menu__content`, reads the seasons inside a `try { } finally { spinner
remove }` so a thrown fetch never leaves the spinner behind, builds the board
and renders the community block.
`start` calls the two, so the subnav link is added on every community page and
the page takes over only on its own hash.

`marathonRankingsYears`, `marathonRankingsRows`, `marathonRankingsPageMs`,
`marathonRankingsSeasonMs`, `marathonRankingsStaleMs` and `marathonRankingsLiveMs`
are the numbers of the reads and caches, edited here the way the records pair
edits its own harvest numbers.

## Example: one standing row
```
{ "name": "GlasnostPerestroika", "rank": 1, "rating": 2100, "score": 1521,
  "sheet": { "scores": "3013055553300303233030331030023301053305" } }
=>
{ "id": "glasnostperestroika", "name": "GlasnostPerestroika", "rank": 1,
  "rating": 2100, "points": 1521, "games": 479 }
```
The sheet holds one digit per game and nothing else, so its length is the game
count exactly - it matches the `nb.game` the podium publishes for the same
player, which the standing rows themselves carry no field for.

## Notes
- The tool loads from `lichessTools-init.js` and the prefs menu shows its
  options; the marathon page only appears at the /player#marathon hash.
- When you add a locale, add the keys to every locale block; no other key may
  contain a dot.
- The board never says "bullet" or "blitz" as its metric, and never claims to
  know how long a player played.
<!-- TAG_INIT -->

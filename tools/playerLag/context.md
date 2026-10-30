# Player Lag Tool

## Purpose

Shows player lag indicators (ping/latency) on user links in the playing round page. Options: bars (4-level signal bars), chart (lag+latency history canvas). Requires logged-in user. Fetches opponent lag via lt.api.user.getUserStatus (API /api/users/status?ids= with withSignal) through the 5s cache.

## Functionality

- **playerLag preference**: single type with values `none`, `bars`, `chart`. Default: `none`. offValue: `none`. needsLogin: true.
- **opponentLagFrequency**: 5000ms — cache expiry for opponent lag data (API calls are heavy on server).

- **onLag(lag)**: Sets _lag value, refreshPlayers().
- **onLatency(latency)**: Sets _latency value.
- **getLag(username)**: Fetches opponent lag via lt.api.user.getUserStatus([username], withSignal=true):
  - Cache lookup if item exists and Date.now()-item.time <= opponentLagFrequency → returns cached value
  - Otherwise: returns null when the status response has no entry (deleted or hidden user, no such id), and that null is not cached
  - Otherwise: reads data[0].signal as the lagRating index, and maps it to the lag values [750,500,300,150,75] (index 0 = worst signal = 750ms, index 4 = best = 75ms)
  - Creates cache entry {time:Date.now(),value:lag}, sets in _lagCache Map, and returns lag
  - A present entry whose `signal` is missing or outside 0..4 maps to `undefined`, which is cached and reaches the renderers - the null guard above does not catch it

- **refreshPlayers()**: Only if document not hidden and body is `.playing`:
  - For each user-link in `round__app .ruser-top a.user-link` or `ruser-bottom`: reads href; extracts hrefUserId with `/\/([^\/\?]*?)$/.exec(href)?.[1]` lowercased, so the optional chain skips an href whose last slash segment carries a `?` instead of throwing
  - If isPlayer (hrefUserId equals userId, both lowercased): uses _lag; else: awaits getLag(hrefUserId), skipped when opponentLagFrequency is unset or the parent already holds a `good`/`bad` element
  - Returns early for the row when lag === null (strict compare, so a lag of 0 still renders the no-lag look)
  - Calls refreshLagChart when options.chart, then refreshLagBars when options.bars

- **refreshLagBars(container, lag, latency)**: Creates `<signal><i></i><i></i><i></i><i></i></signal>` with class `lichessTools-playerLag` inside the link when it has no descendant `signal`, else reuses that one. Hides the sibling `signal` elements (lichess's own bars) with cash `hide()`; cash caches the original display in `___cd` and `show()` would restore it, but nothing calls it yet, so a hidden native bar stays hidden until the page reloads. Calculates lagRating: 0 for falsy lag (no lag - all four bars lit, the intended best look), 4 under 150ms, 3 under 300ms, 2 under 500ms, 1 at 500ms or more. Drops q0..q4 then adds q{lagRating}, and sets title "LiChess Tools - ping %1ms/latency %2ms" with rounded values.
- **refreshLagChart(container, lag, latency)**: Creates `<canvas class="lichessTools-playerLag"` if not exists; stores chart {lag[],latency[]} on canvas[0]. Title same as bars. Converts lag via Math.round(Math.log(lag+1)/7*50), latency same formula. Pushes to chart arrays (truncates >100). Draws chart via drawChart().

- **drawChart(canvas, chart)**: Sets canvas width=chart.lag.length, height=50. ctx fills #A0A0A030 rectangle. Green (#008000) stroke for lag line (y = 50 - chart.lag[i]). Red (#A02020) stroke for latency line.

## Events

- On `lag` socket event → onLag
- On `mlat` socket event → onLatency
- Subscribes to move latency via lt.uiApi.socket.subscribeToMoveLatency()
- On every start() pass (options re-apply): events.off('lag')/events.off('mlat') first, then re-`on` only when bars or chart is set; the tool's own `.lichessTools-playerLag` nodes under the user links are removed, while native `signal` siblings it had hidden are not shown again

## Preference

- **name**: `playerLag`
- **category**: play
- **type**: single
- **possibleValues**: ['none', 'bars', 'chart']
- **defaultValue**: 'none'
- **offValue**: 'none'
- **needsLogin**: true

## Dependencies

None.

# Player Lag Tool

## Purpose

Shows player lag indicators (ping/latency) on user links in the playing round page. Options: bars (4-level signal bars), chart (lag+latency history canvas). Requires logged-in user. Fetches opponent lag via API `/mini` with caching.

## Functionality

- **playerLag preference**: single type with values `none`, `bars`, `chart`. Default: `none`. offValue: `none`. needsLogin: true.
- **opponentLagFrequency**: 5000ms — cache expiry for opponent lag data (API calls are heavy on server).

- **onLag(lag)**: Sets _lag value, refreshPlayers().
- **onLatency(latency)**: Sets _latency value.
- **getLag(username)**: Fetches opponent lag via lt.api.user.getUserStatus([username], withSignal=true):
  - Cache lookup if item exists and Date.now()-item.time <= opponentLagFrequency → returns cached value
  - Otherwise: gets signal from data[0], maps to lag values [750,500,300,150,75] by lagRating index
  - Creates cache entry {time:Date.now(),value:lag}, sets in _lagCache Map

- **refreshPlayers()**: Only if document not hidden and body is `.playing`:
  - For each user-link in `round__app .ruser-top a.user-link` or `ruser-bottom`: extracts hrefUserId from href regex `/([^\/\?]*?)$`, lowercase
  - If isPlayer (matches userId): uses _lag; else: fetches getLag(hrefUserId) if opponentLagFrequency exists and no existing good/bad elements
  - Calls refreshLagBars or refreshLagChart based on options

- **refreshLagBars(container, lag, latency)**: Creates `<signal><i><i><i><i></signal>` with class `lichessTools-playerLag` if not exists; hides sibling signals. Calculates lagRating (0=none, 1=750+, 2=500+, 3=300+, 4=150+). Adds q{lagRating} class, title "LiChess Tools - ping %1ms/latency %2ms" with rounded values.
- **refreshLagChart(container, lag, latency)**: Creates `<canvas class="lichessTools-playerLag"` if not exists; stores chart {lag[],latency[]} on canvas[0]. Title same as bars. Converts lag via Math.round(Math.log(lag+1)/7*50), latency same formula. Pushes to chart arrays (truncates >100). Draws chart via drawChart().

- **drawChart(canvas, chart)**: Sets canvas width=chart.lag.length, height=50. ctx fills #A0A0A030 rectangle. Green (#008000) stroke for lag line (y = 50 - chart.lag[i]). Red (#A02020) stroke for latency line.

## Events

- On `lag` socket event → onLag
- On `mlat` socket event → onLatency
- Subscribes to move latency via lt.uiApi.socket.subscribeToMoveLatency()

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

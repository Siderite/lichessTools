# Player Warning Tool

## Purpose

Shows warning indicators on opponent user links in the playing round page, detecting disconnect rate, time control discrepancies (sandbag suspicion), and highest rating past (sandbag detection). Requires logged-in user. Advanced preference.

## Functionality

- Depends on `EmitRedraw`.
- **playerWarning preference**: multiple type with values `disconnect` (disconnect rate warning), `timecontrol` (time control discrepancy score), `sandbag` (highest rating past warning). Default: false. needsLogin: true. advanced: true.

- **isPlayingGame()**: Checks body is `.playing`.
- **getTimeControl()**: Extracts time control from `div.game__meta div.setup` text via regex `(\d+)\+(\d+)`, converts via lt.getGameTime(m[0],true).

- **timeControlSuspicion(data, options)**: Calculates sandbag suspicion score based on rating differences between blitz and slower time controls:
  - Options defaults: minGames=50, maxRD=500, blitzWeight=1.0, rapidWeight=1.5, classicalWeight=2.0
  - Valid percs filtered by games>=minGames, rd<=maxRD, not prov → valid[tc] = rating
  - If no valid.blitz or (no valid.rapid AND no valid.classical) → score=0, explanation "Insufficient valid data"
  - slowRating = weighted sum of rapid/classical ratings; avgSlowRating = slowRating/totalWeight
  - Score = avgSlowRating - valid.blitz
  - Returns {score: parseFloat(score.toFixed(1)), explanation: lines joined}

- **refreshWarning()**: On redraw event (only if playing):
  - For each user-link in `round__app .ruser-top a.user-link` or `ruser-bottom`: checks e.checkedPlayerWarning flag (skip if already checked)
  - Extracts hrefUserId from href regex `/([^\/\?]*?)$`, lowercase
  - If isPlayer → skip; else: collects warnings

- **Disconnect warning**: If options.disconnect/sandbag enabled → gets timeControl (defaults to blitz if ultrabullet/none), fetches lt.api.user.getUserPerfStats(hrefUserId, timeControl):
  - statCount disconnects/all percentage ≥ 3 → pushes warning text "- %s% disconnect rate", score = disconnectPercentage*15

- **Sandbag rating**: If options.sandbag enabled → highest.rating difference >200 → pushes warning text "- used to be higher rated: %s", score = (highest-rating)/4

- **Time control suspicion**: If options.timecontrol enabled → fetches lt.api.user.getUsers([hrefUserId], checks timeControlSuspicion(data[0].perfs):
  - score ≥ 200 → pushes warning text "- time control suspicion score: %s", score = tcs.score/2-50

- **Warning display**: If warnings.length > 0 → maxScore = Math.min(100, max of all scores), gets gradientColor(maxScore) from [q=0:#808000, q=50:#CCCC00, q=75:#FFA500, q=100:#FF4040]. Creates `<span class="lichessTools-playerWarning"` data-icon WarningSign, CSS --lt-color=color, title "LiChess Tools + warnings text joined", appends to user-link element.

## Preference

- **name**: `playerWarning`
- **category**: play
- **type**: multiple
- **possibleValues**: ['disconnect', 'timecontrol', 'sandbag']
- **defaultValue**: false
- **advanced**: true
- **needsLogin**: true

## Dependencies

`EmitRedraw`

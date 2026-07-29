# Puzzle History Tool

## Purpose

Tracks puzzle start/end/fail timestamps per puzzle, saves history to storage (zip compressed, 90-day expiry). On puzzle dashboard page displays a history panel with categorized sections (today, yesterday, week, month, rest) showing each puzzle with thumbnail popup on hover.

## Functionality

- Depends on `EmitPuzzleChange`.
- Requires logged-in user (`needsLogin: true`). Advanced preference (`advanced: true`). Default disabled (`defaultValue: false`).
- **isTrainingPage()**: Path matches `/training` but NOT `/training/dashboard/themes`.
- **isPuzzleDashboardPage()**: Path matches `/training/dashboard/d+/dashboard`.

- **saveHistory()**: Saves `_history` filtered by now-start < 90*86400000 (90 days) to storage key `LiChessTools.puzzleHistory.log`, zip:true.
- **puzzleStart(puzzleId)**: If _history exists → if last item same puzzleId and no end → uses last as puzzleInfo; else → creates new {puzzleId} entry, pushes to _history, sets start=Date.now().
- **puzzleEnd(puzzleId)**: Sets puzzleInfo.end = Date.now().
- **puzzleFail(puzzleId)**: Sets puzzleInfo.fail = Date.now().

## Dashboard Display (populateDashboard)

- Creates `<section id="lichessTools-puzzleHistory"` after `.puzzle-dashboard__global >:last-child`.
- `<details` open=true with summary "Puzzle history" title "LiChess Tools - puzzles you started on this device".
- Panels categorized by days from today:
  - days<=0 → 'today' (open=true)
  - days<=1 → 'yesterday'
  - days<=7 → 'week'
  - days<=30 → 'month'
  - days>30 → 'rest'
- Each panel `<details class="lichessTools-history-{category"` with summary text (Today/Yesterday/This week/This month/The rest), onmouseleave clears puzzlePopup timeout and removes popup.

## renderItem(item)

- Creates container div:
  - `<div class="puzzle"` with `<a href="/training/puzzleId" target="_blank">#puzzleId` toggles fail/success classes (fail=item.fail, success=!item.fail && item.end), click opens /training/puzzleId, mouseover triggers popup timeout (500ms) showing `<img src="/training/export/gif/thumbnail/puzzleId.gif"` at anchor offset + width+16 left
  - `<div class="start"` with timeText = new Date(item.start).toLocaleString()
  - `<div class="duration"` with durationText = Math.round((item.fail||item.end - item.start)/1000) > 0 ? duration+'s' : ''

## Events

- On `lichessTools.puzzleStart` → puzzleStart
- On `lichessTools.puzzleEnd` → puzzleEnd
- On `lichessTools.puzzleFail` → puzzleFail
- beforeunload listener → saveHistory

## Preference

- **name**: `puzzleHistory`
- **category**: puzzles
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: false
- **advanced**: true
- **needsLogin**: true

## Dependencies

`EmitPuzzleChange`

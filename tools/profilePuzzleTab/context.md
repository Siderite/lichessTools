# Profile Puzzle Tab Tool

## Purpose

Enhances the puzzle dashboard page (`/training/dashboard/d+/dashboard`) with rating history chart, activity stats (rating gain, streaks count, max streak length), and a sortable table showing puzzle performance by theme (total, puzzle count, performance, replay). Requires logged-in user. Advanced preference.

## Functionality

- **profilePuzzleTab preference**: single type with values [false, true]. Default: true. needsLogin: true. advanced: true.
- **isPuzzleDashboardPage()**: Path matches `/training/dashboard/d+/dashboard`.

## Enhancement (enhancePuzzleDashboardPage)

- Waits for `.puzzle-dashboard__global` container to exist (100ms timeout loop).
- Fetches userId rating history via lt.api.user.getRatingHistory(userId); finds Puzzles perf data.
- Extracts days from pathname regex `/training/dashboard/d+/dashboard`. If days and puzzles exist:
  - Removes puzzle points before date (date.setDate(date.getDate()-days)
  - Creates `<div class="chart-container lichessTools-chart-container"` with `<canvas class="rating-history"` after `.puzzle-dashboard__radar`
  - Loads chart.ratingHistory Esm asset with init {data, singlePerfName: 'Puzzles'}

- Fetches activity via lt.api.user.getActivity(userId); if length exists → reverses array. Stats collected:
  - ratingStart = first item puzzles.score.rp.before; ratingEnd = last item puzzles.score.rp.after
  - streaks = sum of item.streak.runs; maxStreak = Math.max across item.streak.score

- If stats exist → creates `<label class="lichessTools-profilePuzzleTab header"` text "The last %s days" (daysStatsText pluralSame) after current afterEl.
  - If ratingStart/ratingEnd: label with "Puzzle rating gain: %s" (puzzleRatingWeekText)
  - If streaks/maxStreak: label with "Puzzle streaks: %s + Max streak length: %s"

- Creates `<section class="lichessTools-profilePuzzleTab"` after afterEl; calls updateData().

## Data Table (updateDataDirect)

- Checks section data-days == days and no sort → returns.
- Fetches lt.api.puzzle.getDashboard(days); if no data → debounce retry.
- Creates `<table` with thead/tbody. HTML template:
  - Header row: th empty, th puzzleCount nr (trans(dashboard.puzzleCount)), th performance nr (trans(dashboard.performance)), th replay nr (trans(dashboard.replay))
  - $trans() regex replacement → htmlEncode(value ? trans.pluralSame(name,value) : trans.noarg(name))

- Global row: th with href `/training`, mix.svg img, total text; td perc nr title firstWins+replayWins, style --win=winperc%--rep=repperc%, value global.nb; td performance; td replay with href `/training/replay/d+/mix`
  - winperc = Math.floor(100*firstWins/nb); repperc = Math.floor(100*replayWins/nb); replay = nb-firstWins-replayWins

- Theme rows: for each theme in data.themes → r.replay/r.winperc/repperc calculated; themeKeys sorted by sortColumn (nb default) with sortDirection (-1 default):
  - th with href `/training/theme`, theme.svg img, htmlEncode(d.theme); td perc nr title firstWins+replayWins, style --win/--rep; td nr + good/bad class if perf > global/perf < global; td replay with href `/training/replay/d+/theme`

- Table clicks on th.puzzleCount → sortTable('nb'); th.performance → sortTable('performance'); th.replay → sortTable('replay').
- Section attr(data-days=days), empty, append div containing table.

## Sorting (sortTable(column))

- If sortColumn == column → sortDirection = -sortDirection; else → sortDirection=-1, sortColumn=column; updateDataDirect(true).

## Preference

- **name**: `profilePuzzleTab`
- **category**: puzzles
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true
- **needsLogin**: true

## Dependencies

None.

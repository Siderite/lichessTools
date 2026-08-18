# LobbyCrosstable Tool — Context Summary

## Purpose

The **LobbyCrosstableTool** displays crosstable scores (wins vs opponents) on the main page lobby hooks list (`table.hooks__list`). Each user link td gets data-crosstable attribute with winrate percentage, a span showing `(wins/total)` text, title "LiChess Tools - crosstable", bad/good class toggles based on winrate thresholds.

## Dependencies

None explicitly listed.

## Preferences

- **name**: `lobbyCrosstable`
- **category**: `appearance`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **advanced**: true

When set to `true`, binds body observer + shows crosstables. When false, removes spans + unbinds.

## How It Works

### Crosstable Display (`showCrosstable`)
Async forEach on `table.hooks__list td:nth-child(1):not([data-crosstable])`: href from span[data-href] → regex /@/user[^?\/&#]+ → groups.user lowercase → userId. if !userId: returns. crossTable via `lt.api.user.getCrosstableJustCache(this.userId,userId)`. if !crossTable.nbGames: returns. winrate = 100*crossTable.users[this.userId]/crossTable.nbGames. td attr data-crosstable=winrate. `<span class="lichessTools-crossTable"` text `(crossTable.users[this.userId]/crossTable.users[userId])`, title "LiChess Tools - crosstable", toggled bad if winrate<34+nbGames>1, toggled good if winrate>66+nbGames>1 → appended to td.

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Logs option. userId = lt.getUserId(). Not logged in → disabled. Options = {enabled: !!value}. Removes existing lichessTools-crossTable spans. Unbinds body observer on .lobby__app,.hooks__list tbody. If !value: returns. Otherwise: binds body observer on .lobby__app,.hooks__list tbody → showCrosstable.
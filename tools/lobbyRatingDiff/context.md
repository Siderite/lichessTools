# LobbyRatingDiff Tool — Context Summary

## Purpose

The **LobbyRatingDiffTool** displays rating difference between current user and opponent on the main page lobby hooks list (`table.hooks__list td:nth-child(2)`). Each td gets data-diff attribute (+diff or diff), title "LiChess Tools - rating difference", plus/minus class toggles based on diff sign.

## Dependencies

None explicitly listed.

## Preferences

- **name**: `lobbyRatingDiff`
- **category**: `appearance`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **advanced**: true

When set to `true`, binds body observer + shows rating diffs. When false, removes data-diff/title attributes + unbinds.

## How It Works

### Perf Key Mapping (`getPerfKey(ch)`)
Icon → perf key: UltraBullet→ultraBullet, Bullet→bullet, FlameBlitz→blitz, Rabbit→rapid, Turtle→classical, PaperAirplane→correspondence, DieSix→chess960, Crazyhouse→crazyhouse, FlagKingHill→kingOfTheHill, ThreeCheckStack→threeCheck, Antichess→antichess, Atom→atomic, KeyPad→horde, FlagRacingKings→racingKings. Default: null.

### Rating Diff Display (`showDiff`)
Async forEach on `table.hooks__list td:nth-child(2):not([data-diff])`: rating = +e.textContent.replaceAll('?',''). if !rating: returns. icon from parent span[data-icon] attr data-icon → timeControl via getPerfKey(icon). if !timeControl: returns. myRating from this.perf.perfs[timeControl].rating. if !myRating: returns. diff = rating - myRating. td title "LiChess Tools - rating difference", data-diff=diff>0?+${diff}:${diff}, toggled lichessTools-plus if diff>0, toggled lichessTools-minus if diff<0.

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Logs option. userId = lt.getUserId(). Not logged in → disabled. Unbinds body observer on .lobby__app,.hooks__list tbody. Removes all [data-diff] attributes + title. If !value: returns. Otherwise: calls `lt.api.user.getUsers([userId])` then → this.perf=data[0]. binds body observer on .lobby__app,.hooks__list tbody → showDiff.
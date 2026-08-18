# Bot Filters Tool — Context

## Overview

The **BotFiltersTool** adds filter controls to the Lichess bot list page (`/player/bots`). It allows filtering bots by rating range, game count range, unrated status, and game type (time control/variant). Bots that don't match the filters are visually marked as filtered out.

## Preferences

- **name**: `botFilters`
- **category**: `general`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Is Bots Page (`isBotsPage`)

- Checks if current page path matches `/\/player\/bots/i`. Only activates on bot list pages.

### Filter Bots (`filterBots`)

1. Reads filter values from input elements:
   - **showUnrated**: `#chk_unrated` checkbox checked state.
   - **minRating**: `#chk_min_rating` number value (default 0).
   - **maxRating**: `#chk_max_rating` number value (default 3000).
   - **minGames**: `#chk_min_games` number value (default 0).
   - **maxGames**: `#chk_max_games` number value (default 10000000000).
   - **icons**: checked game type icons from `.types input[data-icon]`.
2. For each bot entry (`bots__list__entry`):
   - Extracts rating info from `.bots__list__entry__rating span`:
     - Rating = text with non-digits removed (numeric).
     - Games = title attribute with non-digits removed (numeric).
     - Icon = data-icon attribute (game type).
   - If no span (unrated bot): matches if showUnrated is checked.
   - If rated bot: matches if icon in icons list AND rating between min/max AND games between min/max.
   - Toggles class `filteredOut` on entry if no match found.

### Refresh All Types Button (`refreshAllTypesButton`)

- Updates the "toggle all" button icon based on type checkbox state:
  - If active types count < total types/2 → icon = `lt.icon.DiscBig` (filled disc).
  - Otherwise → icon = `lt.icon.DiscBigOutline` (outline disc).

### Filter Controls Creation (`start`)

Creates a div `lichessTools-botFilters` prepended to `.bots.page-menu__content`:

#### Rating Fieldset
- Legend: "Rating min/max" with title.
- Two number inputs: `chk_min_rating` and `chk_max_rating`.
- Label for `chk_unrated`: "Show unrated:" with title.
- Checkbox `chk_unrated`: default checked.

#### Games Fieldset
- Legend: "Games min/max" with title.
- Two number inputs: `chk_min_games` and `chk_max_games`.

#### Types Fieldset
- Legend: "Game types" with title.
- Button `lichessTools-allTypes`: "toggle all" — when clicked, checks/unchecks all type checkboxes based on whether less than half are currently checked.

### Game Type Icons

- Extracts unique icons from existing bot entries' rating spans.
- Sorts by predefined order: UltraBullet → Bullet → FlameBlitz → Rabbit → Turtle → PaperAirplane → Crazyhouse → DieSix (Chess960) → FlagKingHill → ThreeCheck → Antichess → Atom → KeyPad (Board Editor) → FlagRacingKings.
- Creates checkboxes for each icon, default checked.

### Input Event Handling

- All inputs in container listen to `input change` events → triggers `filterBots`.

## Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-botFilters` divs.
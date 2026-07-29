# Challenge Options Tool — Context

## Overview

The **ChallengeOptionsTool** adds extra features to the Lichess challenge menu (popup for starting new games). It shows the user's latest 5 games in the challenge menu and provides a random challenge button when multiple challenges are available. Optionally (commented out in code), it can generate a link from the game setup popup parameters.

## Dependencies

- `ChessOps` — dependency (chess operations library for PGN parsing)

## Preferences

- **name**: `challengeOptions`
- **category**: `general`
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[latestGames, randomChallenge]` (generateLink commented out)
- **defaultValue**: `''` (empty/off by default; generateLink was planned as default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)
- **needsLogin**: `true` (requires logged-in user)

## Behavior

### Process Challenge Menu (`processChallengeMenuDirect`)

Triggered when challenge menu (`#challenge-app`) appears:

#### Latest Games (`latestGames`)
1. Creates or finds div `lichessTools-challengeOptions` in challenge menu.
2. Gets user ID via `lt.getUserId()`.
3. Fetches user's PGNs via `lt.api.game.getUserPgns(userId, {moves:false, max:5})`.
4. Parses PGN via ChessOps (`co.pgn.parsePgn`).
5. For each game (up to 5):
   - Extracts White/Black headers and Result.
   - Creates div `.game` with:
     - White link: href = `#/` if user is white, `/@[white]` otherwise; text = White name.
     - Black link: same logic for Black name.
     - Result link: href = game Site header, class = win/loss based on result and user color, text = result (1-0/0-1/*).
   - Appends to container.
6. If games exist: links with non-# href get class `ulpt` (user link popup).
7. Adds container elements to Lichess powertip manual lists (`manualUserIn`, `manualGameIn`).

#### Random Challenge (`randomChallenge`)
1. Checks challenges in menu (`#challenge-app .challenges .challenge.in`).
2. If ≤ 1 challenge: removes random challenge div.
3. If > 1 challenge: creates div `lichessTools-randomChallenge` prepended to challenge menu:
   - Button with text "Accept random challenge" and title.
   - Click handler → `pickRandomChallenge`.

### Pick Random Challenge (`pickRandomChallenge`)

- Prevents default event.
- Gets all active challenges from challenge menu.
- Picks random index via `Math.floor(lt.random() * challenges.length)`.
- Calls `requestSubmit()` on the form of the selected challenge.

### Slider Times Conversion (`sliderTimes`)

Converts slider value to minutes per side:
- 0 → 0
- 1 → 0.25
- 2 → 0.5
- 3 → 0.75
- 4 → 1.0
- 5 → 1.5
- 6-24 → n - 4 (e.g., 6→2, 24→20)
- 25-29 → 5*n - 100 (e.g., 25→25, 29→45)
- 30-38 → 15*n - 390 (e.g., 30→150, 38→180)

### Extract User ID (`extractUserId`)

Extracts user name from challengeX translation string:
- Uses `lt.global.i18n.site.challengeX('XXX')` to get pattern.
- Replaces XXX with regex capture group `(?<userId>[^\\s]+)`.
- Executes regex on text, returns captured userId.

### Process Setup Popup (`processSetupPopup`) — commented out in code

When game setup dialog appears:
1. Creates link `lichessTools-generateLink` in game setup footer if not present.
2. Extracts all setup parameters from dialog elements:
   - user (from friend button text), variant, fen, time mode, minutesPerSide (via sliderTimes), increment, rated, color, sfLevel, ratingMin/ratingMax.
3. Determines hash type: friend (user present), ai (sfLevel present), hook (rating range present).
4. Constructs query string from non-undefined params URL-encoded.
5. Sets href = `/` + query + hash.

### Debounce

- `processChallengeMenu` debounced by 1000ms.

## Event Handling

When enabled:
- Observer on body watching for `#challenge-app` → triggers `processChallengeMenu`.
- Immediately calls `processChallengeMenu()`.

## Cleanup on Disable

When preference is off:
- Removes observer for challenge menu.
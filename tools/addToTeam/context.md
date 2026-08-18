# AddToTeam Tool

## Purpose

Promotes the "L1Chess Tools Users Team" (team ID: `l1chess-tools-users-team`) on Lichess. Adds a forum entry for the team, sends notification to join if user hasn't joined after visiting team page, and removes warning from team forum page.

## How It Works

### Team Management

- **joinLichessTeam()**: POST to `/team/l1chess-tools-users-team/join`, sets `inTeam=true`, stores joined timestamp in localStorage, announces welcome message
- **quitLichessTeam()**: POST to `/team/l1chess-tools-users-team/quit` (TotalNoob69 user bypasses fetch), sets `inTeam=false`, removes stored timestamp, announces goodbye
- **refreshTeam()**: Fetches user teams via API, checks if in team. If joined time exists and < 1 hour ago, assumes still in team

### Forum Page Integration

On `/forum` page:
- Creates/updates `<tr class="lichessTools-addToTeam">` row in `main.forum table.categs`
- Row contains team name link, subtitle text, join button (POST to join)
- Position: before last row normally; after last row if `forumBottom` option enabled
- If `hideForum` option enabled, removes row entirely

### Notification System

If user not in team and hasn't visited team page (`addToTeam-visitedTeamPage` storage):
- Creates notification object with icon Group, href to team, join text content, subtitle title
- Adds via `lt.notifications.add()`

### Team Forum Warning Removal

On `/forum/team-l1chess-tools-users-team/form`: removes `main.topic-form section.warning`, triggers resize.

## Dependencies

- AddNotifications

## Preferences

- `addToTeam` — multiple type, possibleValues: ['hideForum', 'forumBottom', 'noNotifications'], default: false, offValue: 'hideForum,noNotifications', needsLogin: true

## Key Methods

- `joinLichessTeam()`, `quitLichessTeam()` — team join/quit operations
- `refreshTeam(forced)` — checks team membership status
- `updateForumPage()` — manages forum page row
- `notifyToJoin()` — creates notification to encourage joining
- `removeWarningFromTeamForum()` — removes warning on team forum

# AddToTeam Tool

## Purpose

Promotes the "L1Chess Tools Users Team" (team ID: `l1chess-tools-users-team`) on Lichess. Adds a forum entry for the team, sends notification to join if user hasn't joined after visiting team page, and removes warning from team forum page. Notifies about new posts on the team forum while `noNotifications` is not set.

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

### Team Forum Notifications

Gated only by the `noNotifications` option, so it also runs for users who did not join.

- `notifyForumPosts()` registers a notification with id `addToTeamForumPosts`
- `getEntries` awaits the session-memoized `lt.api.team.latestForumPosts(teamId)`
- that api function fetches `/forum/team-<teamId>` and parses the `table.topics`
  rows found in the `tbody`, newest activity first, keeping the `td.subject` link,
  the `td.right` reply count and the `time.timeago` datetime of the last post cell
- topics with a last post datetime newer than `LiChessTools.forumLastRead` count as new
- the count reported is the number of topics updated, not the replies added to them
- with no stored timestamp the current state is adopted and nothing is notified
- `setForumRead()` runs when the forum list page opens, so visiting it marks it read
- the notification href is the team forum list page, never the newest topic URL

### Team Forum Read Timestamp

`LiChessTools.forumLastRead` holds the timestamp of the last team forum visit, kept in
local storage through `lt.storage`, while the api result lives only in session cache.

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
- `setForumRead()` — stores the read timestamp in `LiChessTools.forumLastRead`
- `notifyForumPosts()` — notification about new team forum activity

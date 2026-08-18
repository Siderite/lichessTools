# TimelineNotify Tool — Context

## Overview

The **TimelineNotifyTool** provides notifications about new entries on the Lichess timeline (recent activity page). It tracks unread timeline entries based on user-selected notification types and displays a notification badge when new relevant entries exist since last visit.

## Dependencies

- **AddNotifications** — Required for notification system integration

## Preferences

| name | category | type | possibleValues | defaultValue | advanced | needsLogin |
|------|----------|------|----------------|--------------|----------|--------|
| `timelineNotify` | general | multiple (checkboxes) | ['forum-post', 'ublog-post', 'simul-create', 'simul-join', 'team-create', 'team-join', 'tour-join', 'follow', 'study-like', 'ublog-post-like'] | 'forum-post,ublog-post' | yes | yes |

Requires logged-in user. When enabled: notification types selected from possibleValues list. When disabled (false): no notifications. When true: defaults to 'forum-post,ublog-post'.

## Notification Types Available

- **forum-post**: new forum posts
- **ublog-post**: new blog posts
- **simul-create**: new simul creations
- **simul-join**: simul joins
- **team-create**: team creations
- **team-join**: team joins
- **tour-join**: tournament joins
- **follow**: new followers/following events
- **study-like**: study likes
- **ublog-post-like**: blog post likes

(Additional types listed in intl but not in preferences: stream-start, game-end, plan-start, plan-renew)

## Last Read Tracking (`lastRead`)

- `prevRead`: stored value from localStorage `LiChessTools.lastRead` (as numeric timestamp)
- `lastRead`: current Date.now() timestamp
- Storage update via `lt.storage.set('LiChessTools.lastRead', lastRead)`
- Triggers `lt.notifications.refresh()` after storage update

## Set All Read (`setAllRead`)

When visiting `/timeline` page:
1. Updates `prevRead` from stored value, sets `lastRead = Date.now()`
2. Stores new timestamp in localStorage
3. Refreshes notifications system
4. If prevRead exists → fetches timeline entries from prevRead+1 via API
5. Counts unread entries (nr)
6. Marks table rows as unread: `tr:nth-child(-n+(nr+1))` toggles `lichessTools-unread` class

## Notification Registration

When enabled AND logged in:
- Creates notification object with:
  - **id**: 'timelineNotify'
  - **getEntries()**: async function that returns notification entries
    - Retrieves lastRead from storage (or 0 if none)
    - Fetches timeline via `lt.api.timeline.get(lastRead)`
    - If no lastRead → calls setAllRead()
    - Filters entries: date > lastRead AND type in selected types list
    - Checks against `just-notified` stored timestamp (prevents re-notification of same entries)
    - Returns empty if no new entries since just-notified
    - Creates entry object with: icon = lt.icon.Envelope, href = '/timeline', content = span "Timeline" + plural "You have [count] new entries", title = translated "LiChess Tools - go to Timeline"
- Adds notification via `lt.notifications.add(notification)`

When disabled OR not logged in: no registration. Console debug message if not logged in.

## DOM Marking on Timeline Page

When pathname matches `/timeline`: unread rows are marked with `lichessTools-unread` class for visual indication.

# Profile Timeline Tool

## Purpose

Adds a "Timeline" tab to the user's own profile page, showing their recent activity from lichess.org.

## Preference

- **name**: `profileTimeline`
- **category**: `appearance`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: true
- **advanced**: true
- **needsLogin**: true (requires logged-in user)

## Behavior

Only works on the user's own profile page (`/@/<userId>`).

When enabled and on my profile page:
1. Creates a new tab link `<a data-tab="timeline" class="lichessTools-profileTimeline">` in `div.angles` (the profile tabs section)
2. Tab text: "Timeline" / "Activitate recentă", title: "Timeline tab - LiChess Tools"
3. href: `/timeline?nb=30`
4. On click, prevents default/proagation and loads the timeline content

The `loadTimeline` method:
- Fetches HTML from `/timeline` via `lt.net.fetch`
- Sets `div.angles a[data-tab="timeline"` as active tab
- Loads CSS path `bits.slist`
- Empties `div.angle-content` and appends the table from fetched HTML (`table.slist`)

When disabled: removes the timeline tab from DOM.

## Effect

Users can view their recent lichess activity (games, puzzles, studies, etc.) via a dedicated timeline tab on their profile page.
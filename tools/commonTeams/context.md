# CommonTeams Tool

## Purpose

Shows common teams between two players in a crosstable page. Creates a link to the first common team with flair/icon, showing all common team names in title text.

## How It Works

### Team Cache

`teamsCache` Map stores user teams fetched via `lt.api.team.getUserTeams()` for each hrefUserId extracted from `.game__meta__players a.user-link`.

### Refresh Logic

On `lichessTools.redraw`:
- Checks if crosstable exists and hasn't been checked already (`crosstable.prop('checkedCommonTeams')`)
- Fetches teams for both player user links (via cache or API)
- Filters to common teams (teams that exist in both players' lists)
- If no common teams → returns
- Creates `<a class="lichessTools-commonTeams">` in crosstable with:
  - href to first common team's `/team/[id]` page
  - title showing prefix + all common team names
  - flair image if first team has flair, or Tools icon if it's L1Chess Tools Users Team, or Group icon otherwise

## Dependencies

- EmitRedraw

## Preferences

- `commonTeams` — single type (false/true), default false, advanced/true, category: play

## Key Methods

- `refreshTeams()` → fetches teams for both players, finds common teams, creates link
- `async start()` → sets up redraw listener

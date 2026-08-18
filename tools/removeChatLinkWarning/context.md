# Remove Chat Link Warning Tool

## Purpose

Removes the popup warning that lichess.org shows when a user pastes/inserts a link in chat. This prevents the "link-popup-ready" dialog from appearing on click.

## Preference

- **name**: `removeChatLinkWarning`
- **category**: `comm` (chat, forums, blogs)
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: true
- **advanced**: true (only visible in Advanced Preferences)
- **needsLogin**: true (requires logged-in user)

## Dependencies

Requires `InterceptEventHandlers` tool (for removing event handlers from DOM elements).

## Behavior

When enabled and user is logged in:
1. Immediately scans all `div.link-popup-ready` elements and removes their `click` event handlers via `lt.removeEventHandlers`
2. Sets a 1000ms interval to continuously scan for new `link-popup-ready` divs (since they may appear dynamically as new chat messages are posted)

When disabled or user not logged in: stops the interval, no action taken.

## Effect

Links pasted in lichess chat will no longer trigger the warning popup dialog.
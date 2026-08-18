# Blog History Tool — Context

## Overview

The **BlogHistoryTool** tracks and displays the user's visit history to Lichess blog posts. It shows visited indicators on blog post cards, records last visit dates and like status in storage, and optionally persists the last blog view location for quick navigation.

## Dependencies

- `EmitRedraw` — dependency
- `EmitContentLoaded` — dependency

## Preferences

- **name**: `blogHistory`
- **category**: `comm` ("Chat, forums, blogs")
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[showVisited, persistView]`
- **defaultValue**: `showVisited,persistView` (both enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Visit Logging (`logVisit`)

Records a blog post visit in storage:
1. Ensures logs Map exists (loaded from `LiChessTools.blogHistory` storage, zip=true).
2. Key = `[userId, slug, postId].join('/')` — unique identifier for each blog post.
3. If no existing entry: creates `{visits: 0}` and sets in Map.
4. On first time (after initial load): increments visits count.
5. Updates `lastVisit` to Date.now().
6. Records `isLiked` status if the post is currently liked.
7. Saves updated Map back to storage as array of entries, zip=true.

### Show Visited on Post (`processVisited`)

- When viewing a specific blog post page (path matching `/\/@\/(?<userId>[^\/]+)\/blog\/(?<slug>[^\/]+)\/(?<postId>[^\/]+)/`):
  - Logs the visit with like status detection: checks for `button.ublog-post__like.ublog-post__like--liked`.
  - Shows percentage of likes over views on `.ublog-post__views`: if views > 100, adds title attribute showing `Math.round(likes*10000/views)/100 + '%'`.

### Show Visited on Cards (`processBlogCards`)

- When blog post cards are present (`a.ublog-post-card`):
  - For each card (once per element via `_initVisit` marker):
    - Extracts href and parses userId/slug/postId from regex.
    - Ensures logs Map exists.
    - If entry found for this key:
      - Creates a `lichessTools-visited` div appended to the card element:
        - Title: "LiChess Tools - last visited on [date]" (formatted via `toLocaleDateString` with Lichess display locale)
        - Icon: `lt.icon.Eye` (default)
        - Data-count: visit count from entry
      - If entry has `isLiked`: changes icon to `lt.icon.Heart` and adds class `lichessTools-liked`.

### Persistent Blog View (`persistView`)

- When on a blog URL path (matching `/\/blog(?!\/search\b)(?:\/|$)?/i`):
  - Saves current full href to storage `LiChessTools.blogHistory-view`.
- On any page:
  - Retrieves stored blog view URL from storage.
  - If present: changes the "Blog community" link in topnav (`#topnav section a[href="/blog/community"]`) to point to the stored URL instead of `/blog/community`.

## Storage Format

- `LiChessTools.blogHistory`: Map entries serialized as array, zip-compressed. Each entry = `[key, {visits, lastVisit, isLiked}]`.
- `LiChessTools.blogHistory-view`: single string (full href of last blog view).

## Event Handling

When `showVisited` enabled:
- Observer on `.ublog-post__meta` watching for `.ublog-post__like` changes (subtree=true, attributes=true) → triggers `processVisited`.
- Immediately calls `processVisited()` if meta element exists.
- Listens to `lichessTools.contentLoaded` pubsub → triggers `processBlogCards`.
- Listens to `lichessTools.redraw` pubsub → triggers `processBlogCards`.
- Immediately calls `processBlogCards()`.

## Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-visited` elements.
- Off pubsub listeners for contentLoaded and redraw.
- Off observer for blog post like element.
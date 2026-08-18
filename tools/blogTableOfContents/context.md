# Blog Table Of Contents Tool — Context

## Overview

The **BlogTableOfContentsTool** adds a collapsible table of contents (TOC) sidebar to Lichess blog post pages. It extracts headings (h2, h3, h4) from the blog markup and creates clickable links that navigate to each heading anchor. The TOC auto-scrolls to highlight the currently visible heading as the user scrolls through the blog post.

## Preferences

- **name**: `blogTableOfContents`
- **category**: `comm` ("Chat, forums, blogs")
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Table Of Contents Creation (`addTableOfContents`)

1. Checks for existing TOC container (`nav.subnav__inner .lichessTools-blogTableOfContents`) — if present, returns (already created).
2. Creates new TOC div:
   - Class: `lichessTools-blogTableOfContents`
   - Contains toggle link:
     - Class: `lichessTools-toc`
     - Text: "Table of contents"
     - Title: "LiChess Tools - table of contents"
     - Click toggles `collapsed` class on container.
   - Contains entries div (`entries`).
3. Extracts headings from `.ublog-post__markup`: h2, h3, h4 elements.
4. For each heading with text AND child anchor with id/href:
   - Creates TOC entry link:
     - Class: `lichessTools-toc_[tagName]` (e.g., `lichessTools-toc_h2`, `lichessTools-toc_h3`)
     - Text: heading text
     - href: anchor href from heading's child a element.
   - Appends to entries div.
5. If any TOC entries created (`showToc=true`): appends container to body.

### Intersection Observer & Auto-Scroll

- Creates an `IntersectionObserver` with settings:
  - rootMargin: `"0px 0px -90% 0px"` (only considers elements near top of viewport)
  - threshold: 0
- Observes each heading element.
- When a heading becomes intersecting (visible):
  - Extracts href from heading's child anchor.
  - For each TOC entry link: checks if href matches → toggles `active` class on matching entry.
  - If active entry found: requestsAnimationFrame (`lt.requestAF`) to scroll the entries container into view via `scrollIntoView`.

### Scroll Into View (`scrollIntoView`)

- Calculates target scroll position for container based on item's position relative to container viewport:
  - If item top is above current scroll → scrolls to itemTopInContainer - 10.
  - If item bottom is below container bottom → scrolls to itemBottomInContainer - containerRect.height + 10.
- Uses `container.scrollTo({top: targetScroll, behavior: "smooth"})` for smooth scrolling.

## Page Scope

- Only activates on blog post URLs matching `/\/@\/[^\/]+\/blog\/[^\/]+\/[^\/]+/i`.

## Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-blogTableOfContents` containers.
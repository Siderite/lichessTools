# Video Search Tool — Context

## Overview

The **VideoSearchTool** adds a "Videos" button to the analysis board that searches videos (from ChessInsights.ai) matching the current board position, displayed in a modal dialog.

## Dependencies

- `EmitRedraw` — dependency
- `Dialog` — dependency (the videos modal is created with `await lt.dialog`)

## Preferences

- **name**: `videoSearch`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Get Video Search (`getVideoSearch`)

1. Prevents default action.
2. Gets the current FEN from `analysis.node.fen`.
3. Removes any existing `dialog.lichessTools-videoSearch`.
4. Loads the Lichess CSS path `bits.video` only — dialog CSS comes from the Dialog tool's `tools/dialog/tool.css`.
5. Creates the modal with `await lt.dialog({ header: <h2>, help: <user manual #videoSearch URL>, closedBy: 'none', noDrag: true })` and adds the `lichessTools-videoSearch` and `video` classes to the Lichess-owned `<dialog>` via `addClass`; Lichess's `domDialog` supplies the close button and the factory appends the help link into its `.close-button-anchor`.
6. Appends a header (`videoSearchHeader`), a spinner, and a "See more at ChessInsights.ai" blurb link (`https://chess-insights.app/`).
7. Calls `lt.api.chessinsights.getVideos(fen)` asynchronously:
   - If `data.matches` has items, builds a list of video cards (`a.card`), each with a YouTube thumbnail (`https://img.youtube.com/vi/{videoId}/0.jpg`), title, author, and channel link.
   - Otherwise shows the "No videos found" message.
8. Replaces the spinner with the result content (`$(content).replaceAll($dialog.find('.dialog-content .spinner'))`) and shows the modal via `dialog.showModal()` — the factory returns a DOM node, so DOM queries go through the Cash wrapper `$dialog`.

### Close Dialog (`closeDialog`)

- On Escape key (keyCode 27) → removes the video search dialog.

### Add Button (`addButtonDirect`)

- Adds a `a.lichessTools-videoSearch` link (text "Videos"):
  - Inserted after `main.analyse .copyables .lichessTools-boardImage`, else after the PGN div, else after the FEN/PGN panel div.
  - Or, if a study share downloads container exists (`main.analyse .study__share .downloads`), adds it as a `button text` inside that container.
- `addButton` is the 500ms-debounced version.

## Wrapping Mechanism

When enabled AND in study:
- **Wraps** `study.vm.toolTab` with an `after` hook that calls `addButton` via `setTimeout(100)`.
- On disable: unwraps `study.vm.toolTab`.

## Event Handling

When enabled:
- Listens to `lichessTools.redraw` pubsub → triggers `addButton`.
- Immediately calls `addButton()`.

## Cleanup on Disable

When preference is off: removes `.lichessTools-videoSearch` links from the analysis copyables, and removes the class/click handler from study share/board editor links.

## Internationalization (intl)

Translations provided for en-US and ro-RO: "Videos" button, button title, "Video search" header, "See more at ChessInsights.ai" link, "No videos found" message.

# Trophy Cabinet Tool - Context

## Overview

The **TrophyCabinetTool** folds the awards row of a profile page into a single
summary ("50 x" plus a gold cup icon) and opens the whole award collection as a
`lt.dialog` modal, where identical awards collapse into one chip written "N x
<trophy>". The pill shows at any viewport width - wide screens included - and the
cabinet box sizes itself for four chips on a line, falling back to 90vw x 90vh when the
viewport cannot give that width. Twelve chips therefore sit 4 x 3 on a desktop and 2 x 6
on a phone. The number of awards gates nothing: any row that holds at least one award
gets the pill, and only a row with no awards at all is left untouched.

## Preferences

- **name**: `trophyCabinet`
- **category**: `appearance`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless the Advanced Preferences toggle is on)

## Behavior

### Set Trophy Summary (`setTrophySummary`)

Runs for every `div.trophies.packed` on the page.

1. Counts the awards with `packed.find('.trophy,.shield-trophy')`, which covers
   plain awards, the shields and the awards the site already wrapped in a
   `div.stacked`.
   The row Lichess renders for a heavy winner is four unclassed perf anchors, each
   wrapping the classed span, then one `div.stacked` holding the marathon awards,
   then the shield, coach and streamer badges. Those elements are the count: the
   trophies the user API lists, plus the profile badges the API leaves out.
2. When the tool is off, or the row holds no awards at all, the
   `data-lt-trophies` attribute is dropped from the row and any summary
   element is removed, so the profile renders as Lichess wrote it. The count
   does not gate the pill - any number of awards gets one at any width.
3. Otherwise the row gets `data-lt-trophies=count`, and a
   `span.lichessTools-trophySummary` is created once inside the row, holding an
   `img.lichessTools-trophyCup` whose `src` comes from
   `lt.assetUrl('images/trophy/Gold-Cup.png')` - the hashed Lichess asset, so
   prod and testing both resolve the right file.
4. The summary keeps `data-lt-trophies=count` (the css writes the number out of it) and
   `title` = `trans.noarg('trophyCabinetTitle')`, a translated "LiChess Tools - Trophy
   cabinet" tooltip.
5. A click on the summary calls `openTrophyCabinet(packed)`; the element is created once,
   so the handler is attached once.
6. `this._applyingTrophySummary` guards the recursion the added element would otherwise
   cause through the observer, and the row attribute keeps that rewrite out of the
   callback.

### Get Cabinet Groups (`getCabinetGroups`)

Returns the award kinds in page order, each with the number of copies.

- The key is the award's `class`, its `img src` when the icon is an image and
  its `aria-label`/`title`; an award seen again only bumps `count`.
- The first DOM node of a kind is kept, so the chip can reuse the site element
  and its icon font.

### Open Trophy Cabinet (`openTrophyCabinet`)

1. Removes a cabinet dialog left open by an earlier click.
2. Builds the dialog with `lt.dialog({ header, help, noDrag: true })`, re-wraps it in cash and
   gives it `lichessTools-trophyCabinet`, which every css rule keys on.
3. An inline `width: 90vw` probe is set, then `dialog.showModal()` opens the real modal - the
   page behind it stops taking interaction and the sheet's `::backdrop` dims it. The probe is
   the widest the viewport allows, so the chips are flowed into the room the box can reach.
4. `button.close-button` closes and removes the dialog, following the shared
   dialog idiom.
5. `.dialog-content` is filled by `buildTrophyChips(groups,content)`, one chip per kind.
6. `getCabinetSizing(dialog,content,chip,header,groups.length)` reads that laid-out box back in
   px - one chip, one line of the content, the dialog border and the header - and works out how
   many chips fit on a line at that room: never more than four, never more than the kinds. The
   counts and the sizes go onto the dialog as `--lt-cols`, `--lt-rows`, `--lt-step`, `--lt-line`,
   `--lt-gapx`, `--lt-gapy`, `--lt-framex`, `--lt-framey` and `--lt-header` through
   `style.setProperty`, which takes a string only - cash hands the raw value on, so a number
   can be dropped by the engine and leave the css on its fallbacks.
7. The probe width is dropped, so the sheet's own width - now built from the grid it was
   handed - hugs the chips instead of filling the window.

### Build Trophy Chips (`buildTrophyChips`)

Appends one chip per group into the target it is given - in this tool the dialog's
`.dialog-content`. A chip is
`span.lichessTools-trophyChip` holding `span.lichessTools-trophyIcon` (the cloned site
award) and `span.lichessTools-trophyRing`, which holds one `<i class="lichessTools-trophyChar">`
per label character. The ring carries `--lt-n` (the character count) and each letter
`--lt-i` (its index), the only thing the ring geometry needs; a label over 24 characters
also gets `lichessTools-trophyWideRing`. The chip carries `title`, and only a kind with
several copies gets `data-lt-count`, which the css writes the "N x " prefix out of.

## Page Scope

- Only the profile awards row (`div.trophies.packed`) inside `body`.
- The dialog is the shared `dialog.lichessTools-dialog` element.

## Event Handling

When enabled:

- Observer on `body` watching `.trophies.packed` (no `characterData`) calls
  `setTrophySummary`.
- `setTrophySummary()` runs once immediately to catch rows already in the DOM.
- A click on the summary opens the cabinet dialog; the summary is visible at every width,
  so the cabinet is reachable from any viewport.

When disabled:

- The observer binding is removed and `setTrophySummary()` strips the
  `data-lt-trophies` attributes and any summary element.

## CSS Contract

Everything visual lives in `tools/trophyCabinet/tool.css`:

- `div.trophies.packed[data-lt-trophies]` becomes a pill and hides every child
  that is not the summary.
- The fold rules - the pill, hiding the awards, the enlarged summary and the cup - are plain
  rules, so the row reads the same at every viewport.
- The chip, the icon, the ring and the letters are styled off their class alone, so one set
  of rules dresses every chip; only the box around them is scoped to the dialog.
- The icon is a fixed square and the award node inside it is made a flex box stretched to that
  square, so a glyph, an image and a shield background all read the same size whatever the
  award kind: the site leaves the awards as inline spans and anchors, where width and height
  are ignored. The glyph host is sized off the icon square and its `::before` inherits that
  size; the shield is the one award the site draws over the whole box, so it is given a
  narrower one. The only `!important` in the sheet is the content height pin below.
- `.dialog-content` height is pinned to `auto` with `!important` and capped at 90vh less a little
  for the header: the dialog machinery writes a pixel height onto that box inline, and a
  stylesheet height cannot beat an inline one. With the pin the content is the stack of rows it
  lays out; only when those rows want more than the viewport does the cap bite and scroll the
  remainder inside.
- `.lichessTools-trophySummary::before` writes `attr(data-lt-trophies) ' x '`.
- The summary text is enlarged and the cup is sized against that enlarged text, so the
  cup stays at roughly the award size the site draws and the count reads proportionate to
  it; the pill's min-height grows to keep the taller cup unclipped inside the row slot.
- The tool measures after laying out: the box is opened at a `90vw` probe, the chips are flowed
  into `.dialog-content`, and `getCabinetSizing` reads one chip, one line, the content padding,
  the dialog border and the header back in px. That room is what a line can hold, so the line
  count is `floor((room + gap) / (chip + gap))` - never over four, never over the kinds - and the
  rows follow from it. Counting in css cannot do it (dividing one length by another is not
  allowed), and reading a font would not either: the chips are sized in the content's em, the
  content is a font step over the dialog, and the site's padding does not answer for the chip
  grid.
- The dialog box hugs that grid: the width is `cols` steps (a chip plus the column gap) less the
  last gap plus the frame and a hair, the height is `rows` lines (a chip plus the row gap) less the
  last gap plus the frame and the header and the same hair. The frame is the content padding inside
  the line room plus the dialog border, so the chips keep an inset and a wide window does not
  stretch into a band of three chips with empty space beside them. 12 kinds are 4 x 3 where the
  width allows, 1 x 11 on a phone, and a single award is a one-chip box.
- Both are capped at 90 percent of the viewport, and `min-width`/`min-height` are one chip inside
  the frame, the floor the sheet cannot go under; the sheet's fallbacks (4 x 3 at a 9.2em step and
  a 7em line) are what a bare preview shows.
- Placement is left to the dialog machinery: the sheet only sets the box limits, so the
  centring the machinery writes stays valid for a box of this size.
- `.dialog-content` is a wrapping flex line and `box-sizing: border-box`, so its 1em padding sits
  inside the line room and the frame the tool measured covers it; the chips break at the count the
  tool handed over, because the box is that many chips wide.
- A chip is 8em x 6em of `.dialog-content`, the box the chips are appended to, with a 1.2em column
  gap and a 1em row gap: the step and the line the tool measures in px once they are laid out. The
  content font is `min(1.25em,4.4vw)`, so chips keep their usual size on wide screens and a phone
  narrows them just enough to take two across.
- `.lichessTools-trophyChip[data-lt-count]::before` writes `attr(data-lt-count)
  ' x '`; every icon is a fixed square through `.lichessTools-trophyIcon`, so award kinds
  that the site draws at different sizes read the same on a chip.
- `.lichessTools-trophyRing` is tilted and spins 360 degrees around the icon, and the letters
  sit on it: each one turns by its index out of the count and is pushed out by `--lt-r`, so
  the label wraps around the icon like a torus and the browser depth-sorts the letters in
  front of and behind it. `--lt-r` is one fixed 2.5em band for every ring, because every icon
  is the same square - that is the widest band the 6em box can carry - and a long label keeps
  the band and only takes smaller letters, so 31 of them still fit around it without
  overlapping.
- The letters are bold and carry a dark keyline of offset shadows measured in em, so the
  outline scales with the letter size: the trophy art is bright and the letters are pale, and
  without the keyline they vanish over the art.
- `--lt-i` and `--lt-n` are registered properties typed as numbers, so a value that fails to
  parse falls back to the initial one instead of dropping the letters' transform, which would
  collapse every letter onto the centre of the chip behind the icon.
- The 3d context is rooted at the chip (`transform-style: preserve-3d`) and the perspective
  sits on `.dialog-content` in the cabinet; no tool sets a depth, so chips stay at z=0 and
  the letters pass around them. The chip keeps no overflow, since a clip would flatten that
  context - the fixed radius is what keeps the letters inside the box.
- Hovering a chip pauses its ring, and `prefers-reduced-motion` freezes the ring at its tilt.

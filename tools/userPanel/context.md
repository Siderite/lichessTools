# User Panel Tool - Context

Frozen record. The pass that reworked the card left the record below; each section names the file
that makes its claims checkable, and the last section says which claims the repo cannot settle yet.

## Overview

One card for one person. Lichess splits a person across three systems - follow edges (`/api/rel/
follow`), streamer subscriptions (`/streamer/subscribe`) and the crosstable (`/api/crosstable`) -
and LiChess Tools adds its own switches over the same people (the play alert of `friendsPlaying`,
personal notes). The panel puts one entry point on each page that names a person, and the entry
point opens a single dialog that answers the two questions a person page raises: what is true of
them right now, and what can this extension change for them.

Communication stays out of the card: the inbox, the forum and the blogs are another tool's pages,
and a person card that printed them would answer a question nobody asked there.

The tool is not a page: it is a button on three pages plus the dialog that button opens. One form
serves a phone and a desktop, which is why the sheet sizes the dialog and collapses sections
instead of offering edges to grab. Opening the card is a choice the reader made, so the open pays
its own reads and an open that runs again is the reader's problem - every read is cached where a
cache exists.

## Decision record

- Tool kind `ToolBase`, key `userPanel`, class `UserPanelTool`, `LiChessTools.Tools.UserPanel`.
- Hosts: `/@/{user}`, `/streamer/{user}`, `/coach/{user}` - one button, one dialog form on all
  three. A fourth host (a CLI command) is planned but not in this pass.
- Button label `Focus`; the tooltip is what spells out the contents. Each page names its own host,
  on a control the page already offers the person: the profile puts it among the utility links of
  the More dropdown (`div.dropdown-window` in the button rack), the streamer card beside its own
  online check form, the coach card in its side rack (`aside.coach-show__side coach-side`).
- Dialog: `await lt.dialog({header, help, noDrag: true})`, sized by the stylesheet, one column,
  sections collapsed by default, no resize strips. The header of the box is the words of the card
  (`User focus panel`); the line under it is the title and the name of the person and clicks to
  their profil, with a badge for every card that person has.
- Sections, in the order printed: now, actions, match, notes. All four open, so an open card gives
  everything; each head is still a fold, and a folded head shows a plus for the tap that reopens it.
- Roles are asserted by the cards that exist: the page you are on asserts its own card, a card page
  this panel has asked about with a head read asserts the others, and a name the live list holds has
  a streamer card whether or not the probe got to answer. The badges are those answers.
- A person is one identity with asserted roles; the extension never keeps a second per-person
  alert map where Lichess has a route for it.
- Subscribing stays a subscription: Lichess keeps it apart from a follow edge, so the panel writes
  no edge under a subscribe and takes none back on an unsubscribe. The chip is the subscription
  itself, so its words are subscribe words and the mic glyph is only the icon it wears.
- Blocking is out of this card. It has no json route to read back (see the pinned lines), so a card
  that offered it would sell a write it cannot state, and the blocklist page already owns it.
- No card on your own page: every band is a write on someone else, and a logged-in user is a
  precondition - `start()` returns with the other tools' line before it looks at the page.

## Hosts

| Page | Route in the cached routes table | The person it names |
|---|---|---|
| profile | `GET /@/:username` | the username in the path |
| streamer | `GET /streamer/:username` | the username in the path |
| coach | `GET /coach/:username` | the username in the path |

Reserved paths to keep out of the detectors: `GET /streamer/edit` (the owner's own card),
`GET /streamer/live` (a moved permanent), `GET /coach/edit`, and the four-segment coach search
`GET /coach/:lang/:country/:order`. `isProfilePageOf` matches a prefix and so admits the profile
sub pages (`/@/{u}/tv`, `/@/{u}/following`); the button host is the bare page.

## Sections, in tap order

now, actions, match, notes. An open card fills all four, so opening pays what the four need; each
head is a fold, and a folded head shows a plus for the tap that reopens it. A line is printed only
when there is something to say - a quiet card is a short card, and a read that failed prints why in
the dim small type.

`now` answers whether the person answers at all (online, offline, playing) and names the games they
are inside, as links to the games with the time control spelled in the site's own words. A game link
opens from the focused person's point of view, so it carries the colour they play beside it, and it
joins the site's own power tip list, where the mouse reads a game off a link.

`actions` is one chip per write, and the words on a chip say where that write stands: the follow
chip states the edge read off the name's mini page, and its taps walk the edge back and forth - the
chip remembers where it last said the edge stands. The stream chip is there only when a streamer
card exists, it states the subscription, and it glows while the live list holds the name; its tap is
the subscription. The alert chip is there only while the play alert runs, and a tap walks alerts
muted, alerts enabled, and the default for new friends.

`notes` prints every note this tool holds for the name, newest first, each in a rounded card with a
small bin in its corner. A click on the bin asks again and the same chip spells that ask in its
words; a shift click goes straight away. The box under the cards takes the next note, and it grows
with what you type up to the height the sheet caps.

## Pinned by the cached routes table (`test/_pr22258/conf__routes.txt`)

The edges the panel reads or writes, with the line that names them:

| Edge | Route | Line |
|---|---|---|
| follow / unfollow | `POST /api/rel/follow/:user`, `POST /api/rel/unfollow/:user` | 49, 50 |
| your following set | `GET /api/rel/following`, paged as `GET /@/:username/following?page=` | 48, 57 |
| block / unblock | `POST /api/rel/block/:userId`, `POST /api/rel/unblock/:userId` | 51, 52 |
| blocked list | `GET /rel/blocks` page only - no json route | 58 |
| streamer subscribe | `POST /streamer/subscribe/:streamer` with `set: Boolean ?= true` | 380 |
| streamer live set | `GET /api/streamer/live` | 372 |
| one streamer online | `POST /streamer/:username/check` | 383 |
| the card page | `GET /streamer/:username` with `redirect: Boolean ?= false`; the panel's own ask is `HEAD` on the same route | 382 |
| coach card | `GET /coach/:username` (the panel's own ask is `HEAD` on the same route); the list is `GET /coach`, search is 4 segments | 709, 705, 710 |
| batch users | `POST /api/users` (`Api.usersByIds`), status `GET /api/users/status` | 740, 785 |
| status with metas | `GET /api/users/status?ids=&withGameMetas=` | 785 |
| crosstable | `GET /api/crosstable/:u1/:u2` | 786 |
| pair search | `GET /games/search` with `page: Int ?= 1` and the players in the query | 20 |
| game page | `GET /game/:id` | - |
| the mini page | `GET /@/:username/mini` | 83 |

What that settles and why:

- Subscribe off is the documented shape of the write: the route parameter is `set: Boolean ?=
  true`, so `?set=false` is the same handler with the flag carried. That closes the old open item.
- Coach students do not exist as a route, so no section of the card may claim a student list. The
  coach card is what it is: a card, not a roster.
- Blocked people have no json route, so "blocked" is a claim the card cannot verify cheaply. The
  write is out of this card for that reason, and `friendsList` keeps the row it already owns.
- `POST /streamer/:username/check` is the per-card online check, and `GET /api/streamer/live` is
  one global read. The card takes the global one, because a second open of the card pays it from
  cache and one page of the live list is what the site itself holds as its shared answer.
- The pair search names the game to open for the rendered cross: the crosstable json answers only a
  count and two ids, while the search answers a paginator newest first.
- The bare profile page is `GET /@/:username` (line 85), one line below the catch-all
  `GET /@/:username/:filterName` (line 84). So the button host is an exact two-segment path, and
  `isProfilePageOf` is the wrong tool for it: it matches a prefix and admits `/@/{u}/tv`.
- The follow edge has one write route and no read route of its own: `GET /api/rel/following` answers
  the people you follow, while the mini page (line 83) carries the relation button for the one name
  the card is about. The card reads that page, because the card asks about one name and never about
  the set.

## Detectors

`scripts/lichessTools-location.js` answers the profile host (`isProfilePageOf`, `getUrlUser`) and
nothing about the other two. `tools/recordsDbUi/tool.js:1346-1349` carries the only two working
patterns, as private regexes, and both admit the owner's own card pages (`/streamer/edit`,
`/coach/edit`). `getUrlUser` reads only the `/@/{u}` spelling, so neither host hands back the
person it names.

The pass therefore adds members to `Location`: `isPersonCard(path)`, `isStreamerPage()`,
`isCoachPage()` and `getPersonPage()`. They keep the `recordsDbUi` character class
`[a-zA-Z0-9_.-]+` for the id, and they exclude the reserved one-segment paths `edit` and `live`,
which the records patterns let through because a filed card is not a browse.

## Cost policy

The dialog is what the button opens, so it is the place a request is allowed - but it is allowed to
spend a bounded set, once, and every read is cached where the cache already exists. `api.init()`
(`scripts/lichessTools-api.js:11-57`) owns those memoizes, and the card reads through the wrappers
so it inherits them instead of adding its own policy:

| Section | What it spends | Where it is cached | What the freshness line says |
|---|---|---|---|
| head line, now | `api.user.getUserStatus([id], {withGameMetas:true})` - one read answers the online claim, the name and the title | session 5 s, `api.init:25` | nothing for a fresh read; the read time when it is older than a minute |
| now (games) | the metas of that same read; the colour the focused person plays comes from the meta, and from the mini page the actions band reads when the meta stays silent | the session cache above | the same rule |
| actions (stream) | `api.streamer.getLiveStreamers()` - one global list, one read | session 60 s, `api.init:23` | the same rule |
| actions (follow) | `api.user.getMini(id)` then `api.relation.followingUser(id, page)` - the mini page carries the relation button, one small page per name | `LiChessTools.userPanelFollow`, this tool's key, held per name and re-read after `followFresh`, and paid again when a live meta names no players | the moment the edge was read |
| actions (stream, head badges) | `api.user.isStreamer(id)`, `api.user.isCoach(id)` - one head read of each card page the page you are on does not assert, so no body is pulled | `LiChessTools.userPanelProbe`, this tool's key, one day | the day of the probe |
| match | `api.user.getCrosstable(me, id)` | local 10 d, `api.init:39`, `minTime 5000` | the day of that read |
| match | `api.game.search(me, id)` (`api.init:38`) then `GET /game/{gameId}` for the rendered cross | the search session 10 min; the fragment `LiChessTools.userPanelStables`, this tool's key, ten days | the same rule |
| notes | nothing - the text lives in this tool's key | `LiChessTools.userPanelNotes`, this tool's key | the moment of each note, above its text |

Two rules follow from that table and are enforced in code, not in prose:

- One person, one page load: the card's reads are the ones `getUserStatus`, `getLiveStreamers` and
  `getCrosstable` already memoize (`api.init:25`, `:23`, `:39`), so a second open of the card on the
  same page answers from that cache and the freshness line moves forward without a request.
- Never automatic: `start()` inserts a chip and wires events only; the first request happens when
  the card opens, and the cross is the only band whose read reaches a second page.

## Vocabulary

Names are frozen here so the wording of a row and the key that stores it cannot drift apart.

| Word | Means | Never means |
|---|---|---|
| Following | a Lichess edge: the relation button on that name's mini page offers an unfollow | anything the extension decided, or a stream subscription |
| Subscribed | the subscription write this tool made: this person's stream is on your watch list | a timeline membership, or a follow edge |
| Alerts | the entry this name holds in `LiChessTools.friendsAlertStatus` - `muted` or `unmuted` as spelled there - and the `muteFriendsNotifications` default only where the key holds no entry | any Lichess notification |
| The cross | the marks the game page renders, held in this tool's key beside the crosstable read | a count the extension counted itself |
| Note | personal text this tool keeps for a name | anything about what the person wrote |

Reuse, do not redefine: `kindCoach` and `kindStreamer` (`tools/recordsDbUi/tool.js:159-160`), the
alert helpers `alertStatusMap`, `alertStatus`, `alertMuted`, `defaultAlertStatus`, `alertEntry`,
`setAlertEntry` and `cycleAlertEntry` (`tools/friendsPlaying/tool.js:95-125`, the site write being
`:202` `mutePlayer`), `followersText`
(`tools/friendsList/tool.js:37`), and `getTimeText(value)` (`scripts/lichessTools.js:244`) for
every freshness phrase. The time-control words of a live game come from the `gameType-<control>`
keys `friendsPlaying` ships inline (`tools/friendsPlaying/tool.js:31-37`), and this tool declares
that tool as a dependency, so the words are merged before the card builds. New keys carry the
`userPanel` prefix and obey the intl shape: `options.userPanel` for the preference, and no other
key with a dot.

## State keys

All five belong to this tool, each with a `userPanel` word so the reads cannot collide with another
owner. `LiChessTools.lastRead` stays untouched: `timelineNotify` (`:76-79`) and `addNotifications`
(`:45`) read that key for their own purpose, and a per-person card that reused it would silently
move a bell's cursor.

| Key | Shape | Owns |
|---|---|---|
| `LiChessTools.userPanelFollow` | `{userId: {at, following}}` | the last read of each follow edge, and the writes this tool made to it |
| `LiChessTools.userPanelProbe` | `{userId: {at, streamer, coach}}` | the card pages that exist for a name |
| `LiChessTools.userPanelSubscribe` | `{userId: at}` | the subscription writes this tool made |
| `LiChessTools.userPanelNotes` | `{userId: [{text, at}]}` | personal notes, oldest first in the key and newest first on the card |
| `LiChessTools.userPanelStables` | `{me:name: {at, html}}` | the rendered cross kept beside the crosstable read |

## Layout, touch and sizing

The phone is a first-class constraint, so the rules below name the code that already does the
same thing rather than a new mechanism.

| Concern | Rule | The precedent |
|---|---|---|
| detection | `lt.isTouchDevice()` and `lt.isMobile()` | `scripts/lichessTools.js:1749` and `:1753`; `tools/mobileExperience/tool.js:766` combines them |
| the phone class in css | `body.lichessTools.mobile` | `tools/dialog/tool.css:100-115` takes the same bands into tap-wide strips |
| dragging | `noDrag: true`, so no header drag is wired | `tools/dialog/tool.js:283` only attaches the drag when the option is absent |
| resizing | no `resizable`, so the five `.dialog-resize-*` strips are never appended | `tools/dialog/tool.js:5` names the edges, `:331-339` appends them |
| sizing | the sheet owns the box: `width: min(40rem, 88vw)` on a desktop, `min(94vw, 22rem)` under `body.lichessTools.mobile`, and `max-height: min(88vh, 92svh)` | `tools/dialog/tool.css:117-123` keeps the same ceiling for `.dialog-content`; nothing measures the content, because a column of wrapping rows only ever asked for the width of its longest unbreakable line |
| collapse | `data-lt-open` on the section, and `:not([data-lt-open=true]) > :not(h4)` hides what is under a head | `tools/recordsDbUi/tool.css:218-235` collapses the same way with `data-expanded` rows |
| the affordance | a closed head carries `::after` of `--icon-PlusButton`, an open head carries `--icon-MinusButton`, so the tap that pays is visible | `styles/icons.css` names the glyphs, `tools/dialog/tool.css` sets the icon font the same way |
| height | `Dialog` grows a non-`.scrollable` dialog's view to its content height | `tools/dialog/tool.js:344-361` |
| closing | bind `.close-button` explicitly, and keep Escape live | `tools/trophyCabinet/tool.js:285-290`; `tools/dialog/tool.js:363-392` is the opt-in Escape suppression this tool does not use |
| no hover-only affordance | a desktop hover read becomes a click read on touch, and the click is swallowed | `tools/friendsList/tool.js:148-158` |
| the glow | `--c-bad` colour with a breathing ring, wrapped in `@media (prefers-reduced-motion: no-preference)` | the site's own `.streaming` card class, which is what the stream chip borrows the look of |
| the note box | a textarea whose height the keystroke asks for, capped by `max-height: 14em` in the sheet, measured against a hidden twin | `tools/chapterEditing/tool.css:15` styles the same kind of box inside a dialog |
| a write with a confirm | the same chip re-spells itself, and a shift click goes straight through | `moveListOptions/tool.js:485` `const deleteMoves = ev.shiftKey;` is the shift-click precedent |

One column everywhere, but the writes band is the exception: the open sections stack, and the band
lays its chips side by side under its head so a thumb has one target per write, and the band reads
as a row of buttons. The collapse idiom keeps `data-lt-open` on the section and lets css hide
everything under the head; the records window does the same with `data-expanded` rows
(`tools/recordsDbUi/tool.css:218-235`). No chip reopens the column at once - a closed head carries
the plus that is the tap that reopens it, so the reader names the section they want back.

Tap rules that come from this: all four sections open, because an open is a manual action and it
should give everything; the heads are folds a reader can close, and the plus on a closed head is the
tap that reopens that one section. The cross opens too, and its read is the one that reaches a
second page. A chip is one pill with an icon and the words stating where the write stands, and its
tap is the write that moves it.

## Ownership and conflicts

The panel adds one thing per person page and borrows the rest. Left column: what another tool owns.
Right column: what this tool does instead.

| Already owned | Owner | The panel's rule |
|---|---|---|
| the mute row and the unblock row on the relation pages | `tools/friendsList/tool.js:409-437` (`lichessTools-mute`, `lichessTools-unblock`) | reads the same alert key, never re-adds a row chip, and does not offer the block write at all |
| play-alert state per person | `tools/friendsPlaying/tool.js:95-125` (`alertStatusMap`, `alertStatus`, `alertMuted`, `alertEntry`, `setAlertEntry`, `cycleAlertEntry`) | the cycle calls the tool's own entry helpers, which keep a spelled entry whatever the default is and erase only at the default step |
| the timeline bell and its cursor | `tools/timelineNotify/tool.js:76-79` (`LiChessTools.lastRead`) | the card holds no feed and keeps no timeline mark |
| the timeline tab in your own profile | `tools/profileTimeline/tool.js:64-77` (`div.angles`, `a[data-tab="timeline"]`) | adds no tab and no second timeline render |
| the tooltip button rack | `tools/playerExtraButtons/tool.js:35-48` (`#powerTip .upt__actions a.btn-rack__btn`) | its own button is not in that rack and does not wear `btn-rack__btn` |
| crosstable marks on game rows | `tools/lobbyCrosstable/tool.js:37-46` (`data-crosstable`, `lichessTools-crossTable`) | borrows the site's own rendered fragment in its own box, and claims nothing else |
| the records window button and the kind chips | `tools/recordsDbUi/tool.js` (the `a.overlay` menu, `kindCoach` / `kindStreamer`) | borrows nothing there; the badges are its own keys |

Two wiring facts a tool has to respect, both read rather than assumed:

- The preferences page keeps a hard-coded category order (`tools/preferences/tool.js:222`), warns
  when the categories used and that order disagree (`:224`), and renders only the categories in
  that list (`:227`). The tool keeps its one preference in `general`, which that list already holds,
  so the order list stays untouched and no `people` category is added anywhere.
- A dependency is checked twice: `loadTool` (`scripts/lichessTools.js:1784-1821`) rejects a tool
  whose dependency class was never loaded, and applying options (`:2056-2064`) rejects one whose
  dependency has not run its `start()`. So the `loadTool` line sits just after
  `LiChessTools.Tools.FriendsPlaying` (`lichessTools-init.js:51`), and the declared dependencies
  stay `Dialog`, `EmitContentLoaded`, `FriendsPlaying` - the alert chip reads `FriendsPlaying`'s
  `options.enabled`, which its `start()` writes (`tools/friendsPlaying/tool.js:218`).

Re-entrancy: `lichessTools-start.js` runs `start()` on every navigation, so removal precedes every
insert (`tools/trophyCabinet/tool.js:321-340`, `tools/commonTeams/tool.js:102` are the two models),
and the chip carries `lichessTools-userPanel` as its class so one sweep takes what this tool laid
down - a panel that survived a navigation is taken away the same way.

## A card for others, never for you

`getPersonPage()` answers the person the path names, and `lt.getUserId()` says whether that is you.
Every band of the card is a write on someone else - a follow edge, a stream subscription, a play
alert state - so a page whose person is you gets no chip at all: `start()` returns before any host
is looked at, and your own profil, streamer card and coach card keep the site's own forms, card
edit forms included. A logged-in user is a precondition too: `start()` answers with the
`... Disabled (not logged in)` line the other tools use - `tools/friendsPlaying/tool.js:243-245` -
and the preference declares `needsLogin: true`.

## Requirements

The list below is what the code has to satisfy. Each line traces to a section above.

1. One `ToolBase` tool, key `userPanel`, class `UserPanelTool`, exported as
   `LiChessTools.Tools.UserPanel`, loaded once in `lichessTools-init.js` after
   `FriendsPlaying`, and listed in all four manifests as both a script and a stylesheet
   (`## Ownership and conflicts`).
2. The preference sits in the `general` category, which the preferences order list already holds
   (`## Ownership and conflicts`).
3. Exactly one chip per person page - `/@/{u}`, `/streamer/{u}`, `/coach/{u}`, each an exact
   two-segment path - labelled `Focus` and put on the host that page offers the person (`## Hosts`
   and the placement line in `## Decision record`), guarded by the tool's own class, removed before
   any insert (`## Detectors`, and the re-entrancy paragraph in `## Ownership and conflicts`).
4. One dialog form on all three hosts, opened by `await lt.dialog(...)` with `noDrag: true`, sized
   by policy, never by a grab (`## Layout, touch and sizing`).
5. The dialog header is the words of the card, and the first line of the content is the title link:
   the title and the name of the person, clicking to their profil, with a badge for every card that
   person has (`## Decision record`, `## Sections`).
6. Sections in the order now, actions, match, notes, all four open, so an open gives everything;
   each head is a fold, a folded head shows a plus, and that plus is the tap that reopens the
   section it stands on (`## Sections`, `## Decision record`).
7. An open pays the reads the open sections need, once, and prints the moment a read ran only when
   that moment is older than a minute; every read is cached where a cache exists (`## Cost policy`).
8. `now` answers online, offline and playing, and prints the games they are inside as links with the
   time control in the site's words, each link opening from the focused person's point of view with
   the colour they play beside it and joining the site's power tip list; it prints no inbox, forum
   or blog line (`## Sections`).
9. `actions` carries one chip per write and the words on the chip state where that write stands: the
   follow chip states the edge read off the name's mini page and its tap is the write that moves it,
   the stream chip exists only with a streamer card, states the subscription, and glows while the
   live list holds the name, and its tap is the subscription; the alert chip exists only while the
   play alert runs, and a tap walks alerts muted - alerts enabled - the default for new friends,
   erasing the entry on the last step. A subscription writes only the subscription and no write
   makes a follow edge (`## Sections`, `## Vocabulary`).
10. The cross shows the marks the game page renders: only when the crosstable says games exist, via
    the first game of the pair search, and it is kept in this tool's key so a re-open pays nothing
    (`## Pinned by the cached routes table`, `## Cost policy`).
11. The follow edge is read, never guessed: the mini page says where it stands through its relation
    button, and a read that names no button states unknown and offers the follow write. The held
    copy only saves the page read, so it never answers with an older read (`## Cost policy`).
12. Notes print every note this tool holds for the name, newest first, each in a rounded card with a
    small bin chip in the corner; a click asks again through the same chip, a shift click goes
    straight away, and the box below grows with what you type up to the sheet's cap (`## Sections`).
13. A page whose person is you gets no chip, and no page gets one without a logged-in user -
    `start()` returns with the login line before it looks at the page (`## A card for others, never
    for you`).
14. Every state read or write goes through one accessor pair on one key, and the key carries the
    tool's word (`## State keys`).
15. Touch: no hover-only affordance, tap targets a thumb can hit, Escape stays live
    (`## Layout, touch and sizing`).

## Deviations accepted

Each is a deliberate cut in this pass, not an omission to be noticed later.

- The feed is out. It answers with the timeline of everyone you follow, counted from a mark this
  tool invented, and it said nothing about the person on the page. The bell that owns it is
  `timelineNotify`.
- The inbox line is out for the same reason: a person card that prints an unread count answers a
  question about communication, and the inbox has its own page and its own tool.
- Block and unblock are out. They have no json route to read back (line 58), so the card would
  state a write it cannot verify, and `friendsList` already carries the row on the relation pages.
- The cards-and-links band is out. What that band held is now carried where it is used: the card
  probe still decides whether the stream chip is there, and the badges on the head line carry the
  same answer. Links off a card page were words a reader clicks elsewhere, not a card's claim.
- The stream subscription is the tool's own record, not a read. Lichess has the write
  (`POST /streamer/subscribe`) and no route back, so the chip states what this tool last wrote and
  the tooltip says so. The alternative is a global list read on every tap, which the pinned policy
  forbids.
- The play alert cycle calls the entry helpers of `friendsPlaying` (`alertEntry`, `setAlertEntry`,
  `cycleAlertEntry`) rather than emitting `lichessTools.mutePlayer`, because that handler toggles
  and the cycle walks three states: no entry, a `muted` entry and an `unmuted` entry. Only the last
  step erases the entry, so an explicit `unmuted` stays apart from a name the preference answers for
  by default. The site handler still drops an entry that lands on its default, and that leaves the
  name at the same state the chip spells `Default alerts`.
- The follow edge is read one small page at a time, never as a set. `getMini` carries the relation
  button, and that button names the write it would make - an unfollow link means the edge stands.
  The held copy in `LiChessTools.userPanelFollow` spans `followFresh` and only saves the page read,
  and a write moves it at once. Reading the whole following set for one card asked a question the
  card never asks.
- `api.game.search` sends the players in the query, so the ids are in the cache key (`api.init:38`
  session 10 min). The rendered cross is held ten days beside the crosstable read - the freshness a
  reader of the cross expects.
- The ladders section is out. A ladder read is three requests to a third-party host
  (`lichessladders` at `scripts/lichessTools-api.js:979-1075`, all `addRetries(... ,3)`) for a card
  a phone has to scroll; the section would land as its own opt-in once the rest of the card is stable.
- The `/focus <user>` command host is out. It needs `CliCommands` as a dependency, a place in the
  load order after every command tool, and it adds no behaviour the button does not already cover.
- Per-person state lives in this tool's storage keys rather than in the records window's `player`
  leaf. `tools/recordsDbStore/context.md:146-152` shows the leaf keeps `meta` and an address beside
  it, and reading or writing that leaf means the store's blob and revision machinery. A person card
  that starts life outside the records window owns a small view first; the migration is a later pass.
- Only `en-US` and `ro-RO` strings ship inline. `tools/crowdin/tool.js` layers the rest of the
  locales from `data/crowdin.json`, and the translator falls back to `en-US`, so a locale that has
  not had the keys contributed shows English rather than nothing. Romanian keeps the words the last
  pass settled (`Urmire`, `Unfollow`, `Options`) and leaves the new phrases in English for Crowdin.

## Proven here, and where it is not proven

Proven from this repo: every route and parameter in the table, the memoize table in `api.init()`,
the intl keys this tool reuses, the preferences category order, the dependency checks, and the
sizing precedents.

Not proven, and why the card still tells the truth:

- The DOM of `/streamer/{u}` and `/coach/{u}`. There is no fixture for a card page in this repo, so
  the chip pass walks a host chain (the card's own online check, then `main`) and inserts nothing
  until it finds a host; the chip's absence is visible rather than a broken page. The existence ask
  is a head read, so it pulls no body and assumes no shape - the DOM only ever has to answer for the
  chip that stands on the page.
- The fields `GET /api/users/status?withGameMetas=1` carries for a person who is in a game. The
  card reads `playing` as a meta when it is not a boolean and a `games` list when it is an array,
  keeps the ids it can see, and spells a game's control from a speed word, a clock in seconds or a
  spelled control - in that order. A shape it cannot read prints the state line and nothing else.
- The keys `/api/streamer/live` entries carry. The match is tolerant and documented, and a name the
  list cannot place leaves the stream chip dark, never "offline".
- That `GET /games/search?players.a=&players.b=` answers json rather than a page. `lt.net.json`
  asks with the `Accept` and `x-requested-with` headers the site answers json to
  (`scripts/lichessTools-network.js:45-62`), and a search that answers nothing leaves the cross
  band printing the count line instead.
- The `div.crosstable` fragment. It is taken from the game page as it renders and kept in
  `LiChessTools.userPanelStables`, so the marks a reader counts are the site's own; the repo has no
  fixture to compare against, and a fragment the page does not carry falls back to the count line.

The cross holds the site's own fragment rather than its own marks. A style change to the site's
`.crosstable` is therefore a change this card takes for free, and the fragment is ten days old - a
re-read is a later pass.

## Follow-ups for the next pass

- The stream chip borrows the mic glyph (`--icon-Mic`) to spell a subscription. A glyph of its own -
  a bell with a ring from the site's own icon set - would separate it from the alert chip, whose
  glyph is already a bell outline.
- A follow edge that another surface changed stays in the words this tool last read until the
  `followFresh` window passes. The mini page is small enough to pay on every open, so tightening
  `followFresh` is the dial for a card that should never be a page behind.
- The colour words beside a live game link are read, never assumed: the meta answers when it names
  the players, and the mini page's own game link answers when it does not. Neither field shape is
  pinned in this repo, so the tolerant read drops the colour words rather than guess them - pinning
  the meta shape from a live read would let the link name the colour every time.







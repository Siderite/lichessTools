# LiChess Tools — Test Plan

Comprehensive manual test plan for the **LiChess Tools** extension (v2.5.0). If you work through
every item here and it passes, you can be confident the extension works end-to-end.

The plan is ordered **most important → least important**:
- **Tier 0** — Foundation (the extension loads, preferences work). Nothing else can pass without this.
- **Tier 1** — Headline analysis/metrics features (accuracy, explorer eval, K-MAPS, pawn structures…).
- **Tier 2** — Commands and keyboard shortcuts (core, cross-cutting).
- **Tier 3–4** — Move list / transpositions / highlights, then Study features.
- **Tier 5–6** — PGN/import, then Play / friends / social.
- **Tier 7–8** — Appearance / lobby / info, then Puzzles / TV / integrations.
- **Tier 9–10** — Mobile, then Community / misc.

## Prerequisites

1. A Chromium browser ≥ 111 (Chrome / Brave / Edge) **or** Firefox, with LiChess Tools loaded
   (unpacked from this repo, or installed from the store).
2. A lichess.org account — needed for any feature marked **Needs log in**. Keep a second
   private/incognito window ready for logged-out tests.
3. Open **DevTools → Console** and keep it visible. Watch for
   `Uncaught ReferenceError: LiChessTools is not defined` or similar — this is a known regression
   class and should be treated as a hard failure.
4. Open preferences: user menu (top-right) → **LiChess Tools**. Enable the **Advanced Preferences**
   toggle so every option below is visible.
5. Where a test changes a preference, note its default so you can restore it afterwards.

Legend: `[ ]` = not run yet · `[x]` = pass · `[!]` = failed (add a note).

---

## Tier 0 — Installation & Foundation (must pass first)

- [ ] **T0.1 Extension injects without errors.** Load lichess.org, then visit in turn: Home, Analysis
      board, a Study, a finished Game, Lobby, a Profile, Forum, Blog. Expected: no `LiChessTools`
      errors in the console on any page; no broken layout.
- [ ] **T0.2 Menu item appears.** Expected: a **LiChess Tools** entry exists in the user menu
      (top-right). Clicking it opens the preferences page.
- [ ] **T0.3 Preferences page renders.** Expected: categories are listed and each can be collapsed/
      expanded by clicking its header.
- [ ] **T0.4 Advanced toggle.** Expected: toggling **Advanced Preferences** reveals the options
      marked *Advanced* (and hides them again when off).
- [ ] **T0.5 Global enable/disable switch.** Expected: the first button on the preferences page
      turns the whole extension off/on. When off, features stop working immediately (e.g. no chart
      lines, no menu additions); when on, they come back.
- [ ] **T0.6 Disable-for-the-day quick toggle.** In the user menu → LiChess Tools, toggle
      "disable for today". Expected: extension disabled; a way to re-enable is present. (It should
      re-enable itself the next day — verify the re-enable control works manually.)
- [ ] **T0.7 Backup / restore / reset.** Expected: **Backup** downloads a preferences file;
      **Restore** applies a previously downloaded file; **Reset to defaults** restores defaults and
      **Turn all off** clears everything. Verify a value you changed is correctly saved/restored.
- [ ] **T0.8 Incognito persistence.** Enable *Also save options for browser private/incognito mode*,
      change a preference, reload an incognito window. Expected: preference is remembered there too.
- [ ] **T0.9 Default/WIP highlighting.** Expected: values that are part of the default config have
      a blueish border; "Work in progress" features show a sepia colour + `WIP` in the title.
- [ ] **T0.10 Preferences filter.** Expected: the preference list can be filtered between basic and
      advanced.

## Tier 1 — Core Analysis & Metrics (headline features)

Precondition: open a finished game's **Analysis** page (or Analysis board with a server/local eval).
The "Extra analysis charting" feature is under *Analysis/Study → Extra analysis charting*.

- [ ] **T1.1 Extra charting — Accuracy.** Enable *Accuracy*. Expected: an accuracy chart line
      appears for the main line, and an accuracy figure for White/Black.
- [ ] **T1.1a Accuracy formula correctness (regression check).** Accuracy must match Lichess's
      `AccuracyPercent.fromWinPercents`: a non-losing move (eval stays or improves) = **100**; a
      losing move = `clamp(103.1668100711649·exp(−0.04354415386753951·winDiff) − 3.166924740191411 + 1, 0, 100)`.
      Sanity check: lose 0 win% → 100; tiny loss → ≈99; a blunder-sized loss → a much lower number;
      enormous loss → 0. Compare with Lichess's own accuracy figure (within ~1 pt; Lichess slightly
      higher on losing moves).
- [ ] **T1.1b Game-average accuracy.** Overall accuracy = mean of a volatility-weighted mean and a
      harmonic mean over per-move accuracies (window ≈ moves/10, weights = std-dev of win%, clamped
      [0.5, 12]). A game with all "perfect" moves shows ~100%.
- [ ] **T1.2 Extra charting — Material.** Expected: a material-balance line.
- [ ] **T1.3 Extra charting — Principled.** Expected: a "principled play" line.
- [ ] **T1.4 Extra charting — Sharpness.** Expected: a sharpness line.
- [ ] **T1.5 Extra charting — Coordination.** Expected: a light-cyan dotted line (piece coordination).
- [ ] **T1.6 Extra charting — Critical / Max tension / Max potential.** *Critical* = thin red line
      (always ≥ center); *Max tension* / *Max potential* lines appear.
- [ ] **T1.7 Extra charting — Find interesting moves / …more moves.** Expected: interesting moves get
      highlighted/marked; "…more moves" adds an extra good/brilliant-move classification pass.
- [ ] **T1.8 Extra charting — Brilliance chart.** Expected: a chart line for the orientation side.
- [ ] **T1.9 Extra charting — Chart smoothing.** Expected: chart lines become smoother.
- [ ] **T1.10 Extra charting — on Eval gauge.** Expected: a green (material) and blue (principled)
      line appear on the eval gauge when visible.
- [ ] **T1.11 Extra charting — More info on Accuracy.** Hover the accuracy figure. Expected: per-glyph
      percentages, an estimated Lichess rating, and per-phase accuracies.
- [ ] **T1.12 Local eval (not logged in).** Expected: local analysis chart works logged out.
- [ ] **T1.13 Show evaluation of explorer moves.** Open the Explorer; enable each source in turn
      (*From computer eval*, *From ChessDb*, *From Lichess*, *From winning stats*, *Rows from eval*,
      *Bar precision*, *SPOA*, *Sharpness Column*) and *Highlight list moves*. Expected: rows show the
      configured eval / bars / columns.
- [ ] **T1.14 Show K-MAPS.** Expected: a K-MAPS analysis of the position is displayed.
- [ ] **T1.15 Show pawn structures.** Enable (+ *Only named structures* / *Fuzzy search*). Expected:
      the current pawn structure name appears.

- [ ] **T1.16 Move assistant.** Enable *Move assistant* and each sub-option (*Move destinations*,
      *Squares*, *Pawns*, *Moves*, *Pieces*). Expected: the matching hints appear when selecting/
      hovering a piece.
- [ ] **T1.17 Calculation trainer.** Expected: a trainer interface that lets you calculate lines and
      scores your move accuracy.
- [ ] **T1.18 Additional glyphs.** Enable (+ *Mate*, *Book*, *Miss*, *Slow*, *Novelty*). Expected:
      the extra glyphs are drawn on the board for matching moves.
- [ ] **T1.19 Piece value command.** Type `/piecevalue` (and `/piecevalue 20 c` for continuous,
      `/stop` to end). Expected: a piece-value breakdown for the position.
- [ ] **T1.20 Trap value command.** Type `/trapvalue`. Expected: a trap value for the position
      (needs explorer data; "No explorer data available" where applicable).
- [ ] **T1.21 Improved best move arrow.** Enable (+ *Use local evaluation*, *On all moves*,
      *Only moves for orientation side*). Expected: the best-move arrow reflects the configured
      source/scope.
- [ ] **T1.22 Remember local computer evaluation.** Run a local eval, navigate away and back.
      Expected: local eval is remembered.
- [ ] **T1.23 More decimals for computer evaluation.** Expected: eval numbers show the configured
      decimal count.
- [ ] **T1.24 Computer evaluation line options.** Verify in turn: *Highlight same moves*,
      *…only current orientation*, *More lines* (slider up to 10), *Color evaluation*, *Depth chart*
      (superscript ply), *Download engine analysis* (JSON, FEN in filename), *Plot PVs*, *Move cost*
      (`$` on engine moves; hover shows cost).
- [ ] **T1.25 Custom engine settings.** Verify *Custom analysis/practice engine depth*, *Custom
      analysis engine options*, *Analysis engine threads*, *Analysis engine hash*. Expected: the
      local engine respects the depth/threads/hash/options.
- [ ] **T1.26 Ceval cache.** Expected: repeat a position and local eval is served from cache faster.

## Tier 2 — Commands & Keyboard Shortcuts

Precondition: on the Analysis board (or study), with *Extra key shortcuts* and *CLI commands*
enabled. Type commands into the command bar (or the analysis input).

### Commands (type `/help` to list them)

- [ ] **T2.1 `/help` (or `/?`).** Expected: the command list/help appears.
- [ ] **T2.2 `/copypgn ["fen"] ["separate"] ["tohere"] ["unicode"]`.** Expected: copies moves to
      clipboard; each flag behaves as documented (fen = from current position, separate = branches,
      tohere = up to current position, unicode = unicode pieces).
- [ ] **T2.3 `/board`.** Expected: toggles the board hidden/shown.
- [ ] **T2.4 `/trapvalue`.** Expected: shows the trap value (see T1.20).
- [ ] **T2.5 `/piecevalue [depth] [c]` + `/stop`.** Expected: piece values; `c` = continuous; `/stop`
      halts it.
- [ ] **T2.6 `/readgame [speed] [voice] [instrument]`.** Expected: reads moves from the current
      position aloud; `Esc` stops.
- [ ] **T2.7 `/readposition [speed] [voice]`.** Expected: reads the position aloud; `Esc` stops,
      `Space` pauses.
- [ ] **T2.8 `/skipmove`.** Expected: moves the position so both players "skip" a move (or shows
      "Cannot skip move from this position!" when invalid).
- [ ] **T2.9 `/s <FEN | PGN | text>`.** Expected: searches the move list; `*` and `?` wildcards work.
- [ ] **T2.10 Commands options.** Toggle *Disable mouse over*. Expected: the command input no longer
      triggers the mouse-over side effect.

### Keyboard shortcuts

- [ ] **T2.11 `Ctrl-RightArrow`.** Expected: plays a random next move (from list).
- [ ] **T2.12 `Ctrl-Space`.** Expected: plays the best computer move (Space is reserved by Lichess).
- [ ] **T2.13 `i` / `m` / `b` and `Alt-i` / `Alt-m` / `Alt-b`.** Expected: cycles to the next
      inaccuracy / mistake / blunder across the whole variation tree (Lichess only does the mainline).
- [ ] **T2.14 `.` / `Ctrl-.` / `Shift-.` then a digit key.** Expected: selects a move from variations
      (`.`) / computer list (`Ctrl-.`) / explorer (`Shift-.`) by number.
- [ ] **T2.15 `Ctrl-C`.** Expected: copies the current FEN (toast "FEN copied to clipboard").
- [ ] **T2.16 `Ctrl-F`.** Expected: opens the move-list search.
- [ ] **T2.17 Quick actions.** Enable *Quick actions* (*Flip game board*, *Request server analysis*,
      *Chat emojis*, *Toggle practice*). Expected: the configured quick-action buttons appear and
      work.
- [ ] **T2.18 Read move comments.** Enable *Read move comments* (+ *Ignore emojis* / *Read
      annotations*). Expected: move comments are read aloud.

## Tier 3 — Move List, Transpositions & Highlights

- [ ] **T3.1 Highlight moves in analysis.** Enable *Highlight moves in analysis* and each sub-option
      in turn: *Last move in each variation*, *Not commented last moves*, *Transpositions to current
      move*, *Highlight board when out of main line*, *Highlight pieces when out of main line*,
      *Highlight variation depth*, *Highlight current line*, *Highlight branching positions*.
      Expected: the corresponding highlights appear on board / move list.
- [ ] **T3.2 Behavior of transpositions.** Test *exclude if same line*, *don't add identical next
      moves*, *play moves from transpositions*. Expected: transposition handling follows the setting.
- [ ] **T3.3 Show next moves from transpositions.** Expected: next moves reachable via transposition
      appear in the move list.
- [ ] **T3.4 Variation arrows from transpositions.** Expected: arrows drawn for variation moves that
      transpose.
- [ ] **T3.5 Next move probability depth.** Set to each value (equal/one/two/three/four/five moves).
      Expected: Ctrl-RightArrow's random pick honours the configured depth (default = 2 moves / 4 ply).
- [ ] **T3.6 Next move behavior for variations.** Test *Normal* / *Hybrid* / *Force choice*. Expected:
      the move-selection behavior matches the setting.
- [ ] **T3.7 Extra context menu options.** Right-click a move and verify each: *Copy branch as PGN*,
      *Engine evaluation for last moves* (and *previous moves*), *Highlight all transpositions*,
      *Remove superfluous* (the listed items disappear), *Show context menu when no moves*, *Reorder
      variations* (Bump up/down works per the manual's example), *Position info*.
- [ ] **T3.8 Position info + Study chapter coverage depth.** With *Position info* and a depth set,
      right-click a move in a study → *Position info*. Expected: move counts, branches, and coverage
      percentage are shown.
- [ ] **T3.9 Repertoire display.** Load a *White repertoire PGN* / *Black repertoire PGN*, enable
      *Mark moves in repertoire* / *Mark deviations* / *Show repertoire arrows after deviation*.
      Expected: repertoire moves/deviations are marked.
- [ ] **T3.10 Move list options.** Test *Indented variations*, *Bookmarks*, *Expanded move list*,
      *Hide left side*, *Open in new window*, *Eval button on the right*. Expected: each alters the
      move list as described.
- [ ] **T3.11 Show the order of arrows and circles.** Expected: arrows/circles show their drawing
      order (shapeRank).
- [ ] **T3.12 Show legal moves of pieces out of turn.** Expected: selecting a piece not to move still
      shows its legal moves.

## Tier 4 — Studies

Precondition: you own (or can contribute to) a study with multiple chapters and Interactive Lesson
chapters.

- [ ] **T4.1 Extended interactive lessons.** Enable *Extended interactive lessons* (*Play all
      variations*, *Show final score*, *Always show score*, *Play again from where you entered Preview
      mode*, *Fast interaction*, *Give up button*). Expected: Interactive lessons play through all
      variations in one chapter.
- [ ] **T4.1a Extended interactive lesson flow.** Test *Sequential*, *Spaced Repetition*, *Avoid lines
      marked as mistakes*, *Hint excluded moves*, *Retry on Space*. Expected: flow follows the setting.
- [ ] **T4.2 Sticky study Preview mode.** Expected: Preview mode persists across chapters and page
      reloads.
- [ ] **T4.3 Chapter navigation controls.** Test *Navigation controls* (first/prev/random/next/last),
      *Hide next chapter button*, *Subchapters* (chapters named with `|`/`\`/`-` become collapsible
      children), `rnd:N` weighting, and *Chapter overview panel* (6-circle window above the list; arrows,
      wheel/trackpad, and touch drag shift the window, circle click changes chapter). Expected: buttons
      work; subchapters nest one level; panel tracks the current chapter.
- [ ] **T4.4 Chapter editing.** Test *Chapter tags*, *Multiple chapters*, *Merge lines*. Also
      *Change chapter names from PGN tags* (set name from Event or White/Black tags, or suggested from
      mainline moves). Expected: bulk edit works and names update.
- [ ] **T4.5 Clear chapter artifacts.** Expected: can selectively remove comments, glyphs, or drawn
      shapes from the current chapter.
- [ ] **T4.6 Insert new chapter after current one.** Expected: a new chapter is inserted after the
      current chapter.
- [ ] **T4.7 Show PGN in studies.** Expected: a PGN view is available for the study.
- [ ] **T4.8 Persist study settings.** Test *New/edit chapter settings* and *Position/move in the
      study*. Expected: settings/position survive a reload.
- [ ] **T4.9 Study links options.** Test *Video popup* (YouTube/Vimeo/Twitch; `t`/`e` timestamps),
      *Open links to studies in same window*, *Ensure comment tab in studies*. Expected: links behave
      as described (note: video popup does not work in Firefox).
- [ ] **T4.10 Study topics options.** Test *Sortable* and *Expandable*. Expected: topics are sortable
      and expandable.
- [ ] **T4.11 Learn from your mistakes in Studies.** Expected: a "Learn from your mistakes" button
      appears for chapters with server analysis, like game analysis.
- [ ] **T4.12 Study flairs.** Test *Author flair*, *Member flairs*, *Flairs from study topics*.
      Expected: flairs appear next to authors/members.
- [ ] **T4.13 Last visited study menu.** Expected: a menu to reopen recently visited studies (up to
      the configured count).
- [ ] **T4.14 Styling & editing study comments.** Test *Styling for study comments* and *Improved
      editing for study comments*. Expected: custom styles apply and editing is improved.
- [ ] **T4.15 Download all studies of a player.** Expected: a link to download all studies of a
      player.
- [ ] **T4.16 Download broadcast PGN.** Expected: a broadcast can be downloaded as PGN.
- [ ] **T4.17 Pin broadcasts/studies to home page.** Expected: pinned broadcasts/studies appear on the
      home page.

## Tier 5 — PGN Editor, Import & Export

- [ ] **T5.1 PGN Editor.** Open it and exercise every control: *Merge*, *Normalize*, *Denormalize*,
      *Split*, *Search* (FEN/PGN/pawn-structure/`Tag=value`/`tag*=value`/`Index=n`/`Invalid`/`ply=`,
      `ply<`, `ply>`), *Cut*, *Select* (`select <start> [count]`), *Count*, *Cancel*, *Copy*, *Upload*
      (also drag-drop), *Download*, *Undo* (`Ctrl-z`), *Redo* (`Ctrl-y`), *Clear* (also clears undo
      history), and the `extractFen` / `splitForStudy` commands. Expected: each behaves as documented.
- [ ] **T5.2 Enhanced PGN import.** In the Analysis board, import multiple PGNs at once. Expected:
      they merge into a single analysis; `Esc` clears focus from the FEN/PGN inputs. Games with no
      moves/tags are dropped; moveless games with tags get an `Event = exported by LiChess Tools` tag.
- [ ] **T5.3 Options for PGN exports.** Toggle *Export clock values*, *Export computer evaluation*,
      *Export PGN tags*, *Export arrows and circles*. Expected: exports include only the enabled parts.
- [ ] **T5.4 Autosave analysis for reload.** Expected: analysis PGN is autosaved and can be reloaded
      after an accidental refresh.
- [ ] **T5.5 Better exported board image.** Expected: the board image export is improved (higher
      quality / correct).

## Tier 6 — Play, Friends & Social

- [ ] **T6.1 Friends list.** Test *Default* / *Menu* / *Hidden*. Expected: friends button vs menu vs
      hidden; online count updates; playing friends show a time-control icon.
- [ ] **T6.2 Live friends page.** Expected: real-time updates; filters (online/playing/active/muted);
      TV icon per friend; mute/unmute per friend; one-click unblock on Blocked page; total count in
      title; links to Followers and Favorite Opponents; crosstable score on Favorite Opponents.
- [ ] **T6.3 Sound/voice alert when friends start playing.** *Default alerts state for new friends
      playing* is **Muted** by default, and each friend can override it with a stored state. Expected:
      with no friend toggled, nothing fires and no game status is fetched; set it to **Unmuted** and a
      friend starting a game in a selected time control alerts; clicking a friend's bell on the live
      friends page stores the opposite of the default for that friend and makes it override the default
      (one friend alerts while the rest stay silent, and the other way round); clicking it again returns
      the friend to the default; the bell icon style and its title (*Unmute playing alert* / *Mute
      playing alert*) always show the friend's effective state, and the hide-muted filter hides exactly
      those friends.
- [ ] **T6.4 Go to Analysis on game end.** Test *loss* / *draw* / *win* / *Request analysis button*.
      Expected: the analysis page opens automatically for the selected outcome(s).
- [ ] **T6.5 Play layout (+ elements).** Test *Normal* / *Hide left side* / *Hide chat*; and
      *Non interactive crosstable*. Expected: the play page layout follows the setting; in "Hide chat"
      mode the game icon glows on unread chat and clicking toggles chat.
- [ ] **T6.6 Layout for game analysis (Fit page).** Expected: a "Review" tab appears (resolution
      >1260px) consolidating under-board content; a toggle link switches back/forth.
- [ ] **T6.7 Mouse wheel during play.** Expected: mouse wheel scrolls/moves as configured.
- [ ] **T6.8 One click move.** Test *Game play*, *Puzzles*, *Analysis/Study*, *Only orientation side*,
      *Move from PGN*. Expected: a single click performs the move in the configured context.
- [ ] **T6.9 Unselect piece after seconds.** Set a number. Expected: a selected piece auto-deselects
      after that many seconds.
- [ ] **T6.10 Quiet mode on all tabs.** Expected: notifications/sounds are silenced while a game runs
      on any tab; a manual toggle is available.
- [ ] **T6.11 Time alert.** Test the time thresholds + *Sound alert* + *Read seconds when less than 6*
      + *Alert when behind on time*. Expected: alerts fire at the configured times.
- [ ] **T6.12 Player lag indicators.** Test *bars* / *chart*. Expected: lag is shown for players.
- [ ] **T6.13 Player warning alert.** Test *Disconnect rate*, *Time control discrepancies*, *Highest
      rating*. Expected: a warning appears on opponents matching the criteria.
- [ ] **T6.14 Hide score tally crosstable.** Expected: the crosstable score tally is hidden during play.
- [ ] **T6.15 Common teams.** Expected: teams you share with an opponent are shown.
- [ ] **T6.16 Customize chat buttons.** Expected: the configured chat buttons appear (auto whisper,
      add/prepend move, etc.).
- [ ] **T6.17 Chat/forum options.** Test *Paste image support* (uploads via Imgur/ImgBB), *Large one
      emoji message*, *Refresh on new message*, *Reactions tooltip on mobile*. Expected: each works.
- [ ] **T6.18 Team/Study chat options.** Test *Highlight URLs*, *No length limit*, *Image support*,
      *Team chat notifications*, *Auto whisper button*, *Auto add move button*, *Insert move button*.
- [ ] **T6.19 Remove chat link warning.** Expected: the warning when posting a link in chat is removed.
- [ ] **T6.20 Feedback.** Enable haptic/piece feedback options (*Piece pick or select*, *Piece move*,
      *Opponent move*, *Start of game*, *End of game*). Expected: feedback fires for the configured
      events.
- [ ] **T6.21 Challenge options.** Test *Show latest games*, *Random challenge button*, *Generate link
      in popup*. Expected: challenge popup/menu shows the configured content.
- [ ] **T6.22 Player tooltip buttons.** Enable *Report and block*. Expected: quick report/block buttons
      appear on player tooltips.

## Tier 7 — Appearance, Lobby & Info Display

- [ ] **T7.1 Themes.** Enable each theme in turn and confirm it applies: *Performance*, *Just
      Explorer*, *Mobile*, *Slim arrows*, *Slimmer arrows*, *Fewer icons*, *No sticky header*, *Toggle
      study chat*, *Nicer piece drag*, *No Practice button*, *Flexible game move list*, *Thick analysis
      gauge*, *Larger analysis move font*, *Grid board squares*, *No game result popup*, *Fix third
      parties*, *Hover time controls*.
- [ ] **T7.2 Themes menu.** Expected: a themes menu appears for quick switching.
- [ ] **T7.3 Extra piece sets.** Expected: extra piece sets (chess.com, GitHub repos) appear in the
      piece-set list, with a search filter and tree/grid selection.
- [ ] **T7.4 Custom board image.** Set a public image URL. Expected: the board shows that image.
- [ ] **T7.5 Board saturation.** Expected: board colours are saturated as configured.
- [ ] **T7.6 Board styling.** Expected: the configured board styling is applied.
- [ ] **T7.7 Custom mini-game size.** Set a number. Expected: mini-games resize accordingly.
- [ ] **T7.8 Fix board coordinate position.** Test *Fix outside coordinates*, *Larger coordinate
      font*, *On each square*. Expected: coordinates move/resize as configured.
- [ ] **T7.9 Active title icon.** Test *Pawn* / *Knight* / *King* / *Circle*. Expected: the active
      tab/window title shows the chosen icon.
- [ ] **T7.10 Show game opening names.** Test *For large board*, *For minigames*, *In Explorer*,
      *In Analysis Board page title*. Expected: opening names appear in those places.
- [ ] **T7.11 Show player country flags.** Expected: flags appear next to player names.
- [ ] **T7.12 Show player total game count.** Expected: each player's total game count is shown.
- [ ] **T7.13 Show player score deviation.** Expected: player rating deviation is shown.
- [ ] **T7.14 Profile slider options.** Test *Show dates*, *Add 1W filter*, *Fix small intervals*,
      *Specify rating interval*. Expected: the rating graph slider behaves accordingly.
- [ ] **T7.15 Game list options.** Test *Filter aborted*, *Filter analysed*, *Filter titled
      opponents*, *Color by players*, *Go direct to analysis*, *Selection*, *More info button*,
      *Remove games*, *Text filter*, *Show scores*. Expected: game lists respond to each.
- [ ] **T7.16 Lobby page elements.** Toggle each element (Side streams/spotlights/timeline, Play
      grid/buttons, Play bullet/blitz/rapid/classical, TV, Blog, Daily puzzle, Support, Feed,
      Tournaments, Leaderboard, Winners, About, Extra counters, Recent games). Expected: the lobby
      shows/hides the configured elements.
- [ ] **T7.17 Correspondence lobby filters.** Expected: correspondence lobby filters appear.
- [ ] **T7.18 Lobby rating difference.** Expected: the rating difference between players is shown in
      lobby game rows.
- [ ] **T7.19 Lobby crosstable.** Expected: crosstable scores appear in lobby rows.
- [ ] **T7.20 Daily quote.** Test *On top* / *On the side*. Expected: a daily quote appears.
- [ ] **T7.21 Timeline in Profile.** Expected: the profile shows a timeline tab/section.
- [ ] **T7.22 Timeline notifications.** Enable one or more (Forum post, Blog post, Lichess
      announcement, Stream start, Simul create/join, Team create/join, Tournament join, Following,
      Study like, Blog post like). Expected: a notification appears for unread items; clicking opens
      Timeline; new items are highlighted. No notification during quiet mode.
- [ ] **T7.23 Show FPS.** Expected: an FPS counter is shown.
- [ ] **T7.24 Wiki pages based on FEN.** Expected: a wiki link relevant to the position is available.
- [ ] **T7.25 Mirror button in Board Editor.** Expected: a mirror button flips the board position.
- [ ] **T7.26 Link to current analysis.** Expected: a shareable link to the current analysis is
      available.
- [ ] **T7.27 Easy access full screen button.** Expected: a full-screen button is readily accessible.

## Tier 8 — Puzzles, TV, Bots & Integrations

- [ ] **T8.1 Options for puzzles.** Test *Prevent screen lock playing puzzles*, *Show completion
      time*, *Show session total*. Expected: puzzle page behaves accordingly.
- [ ] **T8.2 Enhanced Puzzle Dashboard.** Expected: the dashboard shows extra info.
- [ ] **T8.3 Puzzle history.** Expected: puzzle history is recorded and visible.
- [ ] **T8.4 Find position in Lichess puzzles.** Provide a NIF file. Expected: puzzles matching the
      position are found.
- [ ] **T8.5 Find position in puzzles from your games.** Expected: puzzles matching positions from your
      games are found.
- [ ] **T8.6 Download PGN for puzzles.** Expected: a puzzle can be downloaded as PGN.
- [ ] **T8.7 Various TV options.** Test *Link for current TV game*, *Bookmark for current TV game*,
      *Streamers current games*, *Friends current games*, *Previous two games in player TV*,
      *Persistent TV category*. Expected: TV page shows/links the configured content.
- [ ] **T8.8 Follow tournament top board.** Expected: the tournament top board can be followed.
- [ ] **T8.9 Previously viewed game menu item.** Expected: the Watch menu gains a "last viewed game"
      item, chaining to previously viewed games.
- [ ] **T8.10 Bot list filters.** Expected: filters appear on the bot list.
- [ ] **T8.11 Bots in menu.** Expected: bots are accessible from the menu.
- [ ] **T8.12 Chess Pursuit in menu.** Expected: a Chess Pursuit entry appears in the menu.
- [ ] **T8.13 Lichess Ladders integration.** Test *Menu item*, *Summary page*, *Challenge
      notifications*, *Message notifications*, and *Menu challenge items* (1–5). Expected: ladder
      integration works (requires lichessladders.com access).
- [ ] **T8.14 OBS Integration.** Expected: OBS WebSocket integration is available.
- [ ] **T8.15 Chessagine integration in Explorer.** Expected: Chessagine neural-network eval appears
      in the explorer (where supported).
- [ ] **T8.16 Video search.** Expected: a video search is available for positions/players.
- [ ] **T8.17 Show explorer moves leading to gambits.** Expected: gambit moves are highlighted in the
      explorer.

## Tier 9 — Mobile (Kiwi / Firefox Mobile)

- [ ] **T9.1 Mobile device features.** Test *Evaluation gauge*, *Hide the octopus mascot*, *Analysis
      arrows*, *Random move button*, *…only when variations*, *Scroll lock when playing*, *Extra
      buttons in interactive*, *Hide start/end navigation buttons*, *Slide move control*. Expected:
      each applies on mobile; the button layout reflows to two rows when shape/random buttons are on.
- [ ] **T9.2 Mobile game features.** Test *Game arrows*, *Standard buttons*, *Swap user and clock*,
      *Tap bottom clock to flip board*. Expected: each applies in-game (and in puzzles/TV).
- [ ] **T9.3 Colors for shapes on mobile.** Set 1–4. Expected: that many colour taps for shape
      drawing (1 = single-tap toggle).
- [ ] **T9.4 Screen lock.** Test *During play* / *During puzzles*. Expected: scrolling/zoom locks; a
      lock button toggles it and the state persists.
- [ ] **T9.5 Keep screen active.** Test *During puzzles* / *Watching TV*. Expected: the screen stays
      awake in those contexts.

## Tier 10 — Community, Sound & Misc

- [ ] **T10.1 Crowdin translation.** Toggle on/off. Expected: LiChess Tools strings use the community
      translation when on, English when off.
- [ ] **T10.2 LiChess Tools team.** Test *Hide forum entry* / *Forum entry last* / *No
      notifications*. Expected: the LiChess Tools team entry behaves accordingly.
- [ ] **T10.3 Team statistics.** Test *Member count*, *New members notification*. Expected: member
      count chart / new-member notification appear.
- [ ] **T10.4 LiChess Tools day.** Test *On May 10th* / *Never* / *Always*. Expected: the themed
      behaviour appears per the setting.
- [ ] **T10.5 Blog editing options.** Test *Auto save* / *Save button*. Expected: blog editing
      auto-saves or shows a save button as configured.
- [ ] **T10.6 Blog table of contents.** Expected: a table of contents appears on blog posts.
- [ ] **T10.7 Blog visit history.** Test *Show visited* / *Persistent blog view*. Expected: visited
      blogs are tracked and the view persists.
- [ ] **T10.8 Sound options / themes / volume / voice.** Test *No move sounds*, *Time flicker sound*,
      *Main menu volume bar*, sound themes, volume (0–100), and voice selection. Expected: sounds
      play/change per the settings.
- [ ] **T10.9 Voice input.** Enable *Study comments*. Expected: voice input is available in study
      comments.
- [ ] **T10.10 Practice against moves from Opening Explorer.** Expected: the computer practises using
      explorer moves (masters/lichess/player).
- [ ] **T10.11 Opening explorer player features (Me button).** Expected: a "Me" button switches the
      explorer to your games.
- [ ] **T10.12 Explorer settings snapshots / more games / resize.** Test *Toggle snapshots of Explorer
      settings*, *Show more Explorer games*, *Resize Explorer*. Expected: snapshots toggle, more games
      load, the explorer resizes.

## Headless harness checks (node, no browser needed)

These are gitignored scratch scripts under `test/` (`build.bat` excludes the folder). They assert
code behaviour without lichess.org, so they are the fastest regression signal after a change.

- [ ] **H.1 FEN repair (`MoveGen.fixFen`, issues #1202 + #1816).** `node test/fixFen.check.js`.
      Expected: only `PASS` lines, exit code 0. Covers rank-1/8 pawn promotion, one king per side,
      non-adjacent kings, bogus castling/en-passant fields, field-count preservation, `fixFen` being
      idempotent, the `MoveGen.boardFromFen`/`positionFromFen` repair fallbacks, the chessops
      castling-right and en-passant transforms (lifting the a1 rook → `Kkq`, the h1 rook → `Qkq`,
      a king off the e-file → `kq`, a push past an adjacent pawn → the jumped square, the en-passant
      capture → cleared), the piece-value tool's rebuilt FEN and the position identity key
      (`getFenPosition`, which used to drop the castling and en-passant fields for counterless FENs).
- [ ] **H.2 Friends alert tri-state (`friendsPlaying`, issue #1494).** `node test/friendsMute.check.js`.
      Expected: only `PASS` lines, exit code 0.
- [ ] **H.3 Comment styling button while typing (`commentStyling`, issue #1884).** `node test/commentStylingInputListener.check.js`.
      Expected: `passed: 13   failed: 0`, exit code 0. Instantiates the real `CommentStylingTool` against a
      mocked cash/browser layer and asserts that a textarea `input` event runs `debouncedAddCommentClasses`
      (so the styling button reappears while typing), that the listener is re-attached when lichess rebuilds
      the textarea, that rapid keystrokes collapse into one pass, and that disabling the preference removes
      both the observer and the listener.

---

## Quick smoke-test pass (run after any change)

1. Fresh page load on lichess.org → no `LiChessTools` console errors.
2. Open Analysis board → Accuracy/material/principled lines render.
3. `/help` lists commands; `/copypgn` copies; `/board` hides board.
4. `Ctrl-RightArrow`, `Ctrl-Space`, `i/m/b`, `.`+digit all work.
5. Open a Study → chapter nav + interactive lesson still work.
6. Lobby / profile / forum / blog pages render without layout breakage.









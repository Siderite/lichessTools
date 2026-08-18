
### Path enumeration (`getCurrentPath`)

- Traverse permanent visible children to leaves.
- Skip leaves whose node list fails `areBadGlyphNodes` when ignoreBadGlyphs is on.
- Sequential: first unfinished path.
- Spaced repetition: random among unfinished (not done by interval).
- Keep existing `currentPath` if still valid (exists, permanent, leaf, not bad-glyph, not done).

### Done criteria (`isDonePath`)

- Sequential-style: `item.success === true`
- Spaced repetition: `now < item.time + item.interval * 86400000`
- Default starting interval: 1 day; min interval 1/144 day (~10 minutes)

### Finish path (`markPathFinished`)

- success if `badMoves == 0 && !askedForSolution && goodMoves >= floor(pathLength/4)`
- successRate = good / (good + bad)
- Spaced: multiply interval by factor from successRate (above 0.7 stretches up to 1.5x; below shrinks toward 0.5x)
- Refresh chapter list progress UI

### Reset

- Chapter list icon (conic-gradient progress) and chapter edit modal Reset button call `resetDone(chapterId)` (clears that chapter's path map).
- Auto prompt when no unfinished paths remain but the tree still has playable lines.

## Chapter Progress UI

- Class `lichesstools-extendedInteractiveLessonFlow` on chapter list.
- Each chapter button gets `icon.act` with CSS `--perc` for done/total.
- Title/tooltip lists up to 10 variations with status icons and optional interval text.
- Reset control on the chapter row (and in chapter edit form when flow prefs apply).

## Authoring Helpers

Context menu on interactive chapters (writable studies):

- **Explain why other moves are wrong** - sets `node.gamebook.deviation` via `study.makeChange('setGamebook', ...)`
- **On-demand hint for the player** - sets `node.gamebook.hint` the same way

Hints live on the move **before** the player must move. Deviation text for a wrong move is taken from the first child of the parent when the played node has no comment (Lichess convention).

Collapsible header "Extended Interactive lesson" on `.gamebook-edit` reduces editor chrome while editing.

## UI / UX Extras

- Body class `lichessTools-extendedInteractiveLesson` when extended mode active on a gamebook chapter.
- Preview button restyled / titled.
- Give-up button in comment area (confirm dialog).
- Options strip under gamebook floor listing active prefs and variation count; link to user manual.
- Solution arrows for all accepted moves (not only one).
- Threat-mode arrow tinting (`findThreatArrow`) when engine threat view is on.
- Action-menu quick toggles for the main preference flags on interactive chapters.

## Interaction With Other Tools

- **RandomVariation / Next move probability depth**: opponent `next()` uses the same probability model (branch count at configured ply, optional `prc:N` comments).
- **Transposition behavior**: if "play moves from transpositions" is set, next-move lists can include transposing continuations; flow path filtering still applies when sequential/spaced is on.
- **Ctrl-right random move**: separate tool, same probability engine; not required for interactive play.
- Explorer is forced off during play to avoid Lichess background traffic; restored when leaving play if it was on.

## Important Implementation Notes

- Only works in studies with `chapter.gamebook` set (Interactive Lesson type). Practice mode is skipped (`analysis.study.practice`).
- Multi-branch interactive play requires this extension for the audience; authors should note that in chapter comments.
- Asking for the solution is scored as a failure.
- Path progress is client-local storage, not server-side.
- `returnToPreview` can conflict with flow completion goals if the entry path is not the root.
- Fast interactive skips comments after they have been seen a few times in the current page session only (`seen` Map is not persisted).
- Bad-glyph filter uses glyph ids 2, 4, 6 on the learner's side of the path only.
- Node versioning is essential: without it, temporary analysis nodes could be treated as valid lesson moves.
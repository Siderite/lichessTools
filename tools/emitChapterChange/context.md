# EmitChapterChange Tool

## Purpose

Broadcasts `lichessTools.chapterChange` pubsub events whenever a study chapter is changed (either by user navigation or page reload).

## How It Works

### Function Wrapping

Wraps `study.onReload()` function:
- After the original call, checks if the current chapter ID differs from the previous one
- If different, emits `lichessTools.chapterChange` with the new chapter ID as payload
- Tracks `previousChapterId` to detect changes

## Dependencies

None explicitly listed. Depends on `lichess.analysis.study` existing.

## Event Broadcasted

- `lichessTools.chapterChange` — payload: new chapter ID

## Key Methods

- `async start()` — wraps study.onReload and initializes tracking

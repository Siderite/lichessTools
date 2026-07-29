# GamebookPlayClass Tool — Context Summary

## Purpose

The **GamebookPlayClassTool** adds CSS classes to `<body>` based on interactive gamebook study mode state (play vs analyse). It flags the body with `lichessTools-gamebook-play` or `lichessTools-gamebook-analyse` depending on `study.vm.gamebookOverride`.

## Dependencies

- **EmitChapterChange**

## Preferences

- **name**: `gamebookPlayClass`
- **category**: `study`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **advanced**: true
- **hidden**: true (hidden from debug mode)

When set to `true`, wraps `setGamebookOverride` and binds chapterChange event. When false, removes wrapping + unbinds.

## How It Works

### CSS Class Setting (`setCssClass`)
Checks study exists + !study.relay (relay mode excluded). Gets override from `study.vm.gamebookOverride`. Class = `lichessTools-gamebook-` + override value. Removes all classes except the current one from body: filters out `['lichessTools-gamebook-play', 'lichessTools-gamebook-analyse']` excluding cls. Adds cls if override exists.

### Event Binding
- **pubsub**: listens to `lichessTools.chapterChange` → calls setCssClass
- **wrapFunction**: wraps `study.setGamebookOverride` with after hook = setCssClass

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Logs option. Unbinds chapterChange pubsub event. Unwraps existing setGamebookOverride wrapping. If value: wraps setGamebookOverride with after=setCssClass, binds chapterChange pubsub + calls setCssClass.
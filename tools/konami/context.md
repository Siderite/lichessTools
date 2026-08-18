# Konami Tool — Context Summary

## Purpose

The **KonamiTool** implements a Konami code cheat sequence (↑↑↓↓←→←→B+A) that triggers a visual "30 more lives!" announcement when the full sequence is entered. It's an Easter egg feature.

## Dependencies

None explicitly listed.

## Preferences

- **name**: `konami`
- **category**: `general`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **offValue**: `false`
- **advanced**: true
- **hidden**: true

When set to `true`, binds keydown event listener. When false, removes listener.

## How It Works

### Cheat Code Sequence (`code`)
['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'] — 10 keys in order.

### Key Check (`keyCheck(ev)`)
Checks ev.code against code[this.index]:
- Match → index++
- If index > 7 → ev.preventDefault()
- If ev.code == code[0] (ArrowUp) → index=1 (restart at second position)
- Else → index=0 (reset to start)
- If index == 10 → index=0 + enableCheat()

### EnableCheat (`enableCheat`)
Creates `<div class="konami">` appended to body with data-text = trans.noarg('30lives'). setTimeout 1ms → egg.addClass('flash'). setTimeout 5000ms → egg.remove().

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Removes keydown listener (capture=true) if exists. If !value: returns. Otherwise: adds keydown listener to lt.global.document with capture=true.
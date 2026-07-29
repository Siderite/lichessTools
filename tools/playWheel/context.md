# Play Wheel Tool

## Purpose

Allows scrolling through moves during a live game using the mouse wheel. Scrolling up jumps to the next move, scrolling down jumps to the previous move. Works on round (rated games) and puzzle pages.

## Preference

- **name**: `playWheel`
- **category**: `play`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: false
- **advanced**: true

## Behavior

When enabled on a round/puzzle page:
1. Overrides `Element.prototype.releasePointerCapture` to prevent chessground boards from capturing pointer state (this prevents wheel scroll from being blocked by touch/pointer interactions)
2. Adds a `wheel` event listener on `<body>` with `{ passive: false }`

The `wheel` handler:
- Only triggers when body is `.playing` and the target is a chessground board (`cg-board`) or closest to one
- Accumulates `deltaY` (scaled by deltaMode: 40 for lines, 1 for pixels) into `scrollTotal`
- When `|scrollTotal| >= 20`, triggers the jump-next/jump-prev button on `.round__app .buttons`:
  - Scroll up (`deltaY > 0`) → jump next move (icon `lt.icon.JumpNext`)
  - Scroll down (`deltaY < 0`) → jump prev move (icon `lt.icon.JumpPrev`)
- Resets `scrollTotal` to 0 after triggering
- Prevents the original wheel event (`ev.preventDefault()`)

When disabled: removes the wheel listener and restores original `releasePointerCapture`.

## Effect

Mouse wheel scrolling on the chessboard during a game automatically advances/reverses through moves.
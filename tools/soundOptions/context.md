# SoundOptions Tool

## Purpose

Controls Lichess sound behavior with multiple options: disable move sounds, time flicker sound, volume bar in menu, custom sound themes (Mortal Kombat, Chess Pursuit, Star Wars, Super Mario, Chess.com), configurable sound volume, speech voice selection, and time alerts at specific thresholds.

## How It Works

### Move Sound Disable

Wraps `lichess.sound.move`:
- Before call: returns false if `noMove` option enabled (prevents move sound)

### Time Flicker Sound

MutationObserver on `.rclock-bottom *, .rclock-top *` in `.playing .round__app`:
- When time decreases by more than 1 second from previous value, plays `other/failure2.mp3`

### Time Alerts

At specific thresholds (30s, 60s, 90s, 120s, 180s, 300s):
- When time crosses below threshold from above: adds `lichessTools-timeAlert` class to `.round__app`, plays `piano/LowTime.mp3` if `beep` enabled

### Speak Seconds

When time ≤ 5 seconds and `speak5` enabled: speaks the floor of seconds via speech synthesis (stops previous speaking first)

### Behind Time Alert

When user's clock time becomes less than opponent's clock time (`behind` enabled): alerts player with LowTime sound.

### Volume Bar

On `#dasher_app`: adds vertical `<input type="range" min="0" max="1" step="0.01">` that sets sound volume via debounce (100ms). Shows silent class when theme is 'silent'. Plays genericNotify or knight F 7 speech on change.

### Custom Sound Themes

Wraps `lichess.sound.changeSet` and `lichess.sound.resolvePath`:
- After changeSet: loads custom theme URLs from soundThemeUrls.json, stores current theme in localStorage
- Before resolvePath: checks if custom URL exists, returns cached dataUrl or loads new sound
- Adds theme buttons to `#dasher_app .sub.sound .content .selector` list

### Speech Voices

In init(): loads speechSynthesis.getVoices() into `soundVoice` preference possibleValues as `[index, name]` pairs. Sets onvoiceschanged listener for Chromium. Always calls getVoices once for Firefox initialization.

## Dependencies

None explicitly listed. Depends on `lichess.sound`, `lt.comm.getData`.

## Preferences

- `soundOptions` — multiple type: ['noMove', 'flickerSound', 'volumeBar'], default: false
- `soundThemes` — multiple type: ['mortalKombat', 'chessPursuit', 'starWars', 'superMario', 'chesscom'], default: true
- `soundVolume` — number type, default 70
- `soundVoice` — select type (voices loaded dynamically), default 0
- `timeAlert` — multiple type: ['s30','s60','s90','s120','s180','s300','beep','speak5', 'behind'], default: false

## Key Methods

- `alertPlayer(seconds)` — adds time alert class and plays LowTime sound
- `makeFlickerSound()` — plays failure2.mp3 for time flicker
- `checkClock()` — monitors clock elements for time changes, triggers alerts/flicker/speak
- `addVolumeBar()` — creates volume bar in dasher app
- `addThemes()` — adds custom theme buttons to sound selector list
- `loadSound(e)` — fetches dataUrl for custom theme sound file

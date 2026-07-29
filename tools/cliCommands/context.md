# CliCommands Tool

## Purpose

Provides a CLI command system for Lichess. When `/command` is typed in the `#clinput` CLI input box, commands are executed via registered handlers. Also provides help display when `/help` or `/?` is entered.

## How It Works

### Command Registry

`lt.registerCommand(key, command)` and `lt.unregisterCommand(key)` expose functions to register/unregister commands. Each command has a `handle(val)` async method that returns true if executed successfully, and optional `getHelp()` text for help display.

### CLI Input Handling

On `#clinput input keydown`:
- Escape → blur input, prevent/stop propagation
- Enter → trim value:
  - `/?` → converts to `/help`
  - `/help` → triggers updateHelp()
  - `/[command]` → executes via executeCommand(val.substr(1)) — iterates through all registered commands until one returns true

### Help Display

When `/help`:
- Creates dialog div.clinput-help with command entries:
  - Each command's getHelp() text split into lines, spaces preserved as &nbsp; repeats
  - `<div class="command">` with data-key attribute and title "LiChess Tools"

### Mouse Over Blocking

On `#clinput` element:
- If disableMouseOver option enabled: adds capture listener that stops propagation on mouseover

## Dependencies

None explicitly listed. Depends on `lt.uiApi`, `lt.$`.

## Preferences

- `cliCommands` — single type (false/true), default true, advanced/hidden, offValue: false
- `cliCommandsOptions` — multiple type: ['disableMouseOver'], default: false

## Key Methods

- `executeCommand(val)` → iterates through commands until one handles the value
- `updateHelp()` → creates help dialog with command descriptions
- `keydown(ev)` → handles CLI input keydown events
- `boot()` → sets up keydown listener on #clinput input
- `removeCommandFunctions()` → removes lt.registerCommand/unregisterCommand when disabled

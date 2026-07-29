# HideBoardCommand Tool — Context Summary

## Purpose

The **HideBoardCommandTool** registers a CLI command `/board` that toggles board visibility via body class `lichessTools-hideBoard`. It depends on the CliCommands system for command registration.

## Dependencies

- **CliCommands**

## Preferences

- **name**: `hideBoardCommand`
- **category**: `command`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **offValue**: `false`
- **advanced**: true
- **hidden**: true

When set to `true`, registers the command. When false, unregisters it.

## CLI Command Registration

### handle(val)
If val == 'board': toggles body class `lichessTools-hideBoard`. Returns true (command executed).

### getHelp()
Returns help text: `/board\r\nShow/Hide board` (translated via lt.translator.noarg).

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Logs option. If value && lichess.analysis exists: calls `lt.registerCommand('hideBoardCommand', {handle, getHelp})`. Else: calls `lt.unregisterCommand('hideBoardCommand')`.
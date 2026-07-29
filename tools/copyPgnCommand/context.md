# CopyPgnCommand Tool

## Purpose

Registers `/copypgn` CLI command that copies PGN moves to clipboard with various options: from current position, separate branches, to current position, unicode piece characters, print mode.

## How It Works

### Command Registration

When enabled and analysis exists:
- Registers via `lt.registerCommand('copyPgnCommand', { handle(val), getHelp() })`
- Handle: if val starts with 'copypgn' → calls copyPgn with options parsed from command text

### Options Parsing

From command text regex matches:
- `fen` → fromPosition (from current position)
- `separate` → separateLines (separate branches)
- `tohere` → toPosition (to current position)
- `unicode` → unicode (Unicode piece characters)
- `print` → print mode

### Copy Execution

Calls `lt.exportPgn(options.path, { copyToClipboard: true, ...options })` to copy PGN to clipboard.

## Dependencies

- ExportPGN, CliCommands

## Preferences

- `copyPgnCommand` — single type (false/true), default true, advanced/hidden, offValue: false

## Key Methods

- `copyPgn(commandText)` → parses options and copies PGN via exportPgn
- `async start()` → registers/unregisters CLI command based on preference value

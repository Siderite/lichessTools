# DailyQuote Tool

## Purpose

Displays a daily chess quote on the lobby page. Quote selection is based on CRC24 hash of text content, cycling through quotes.json array by day index. User can click author to see all quotes by that author in a dialog, or close button to hide today's quote permanently (until next day).

## How It Works

### Quote Selection

- Fetches `quotes.json` via comm getData
- Sorts quotes by CRC24 hash of text content
- Index = Math.round(today.getTime()/86400000) % quotes.length — deterministic daily selection
- Displays quote text and author name in the element

### Author Search Dialog

When author name is clicked:
- Creates dialog with header "All quotes by [author]"
- Shows all matching quotes from the array as text spans in dialog content
- Dialog is non-draggable

### Close Button

Clicking close button stores `LiChessTools.closedQuote` = today.toDateString() — quote won't appear again until a new day.

### Position Options

- `top`: inserted after header#top
- `side`: prepended to `.lobby__side`
- `true`/default treated as top

## Dependencies

- Dialog

## Preferences

- `dailyQuote` — single type, possibleValues: [false, 'top', 'side'], default: 'side'

## Key Methods

- `authorSearch(ev)` — creates dialog showing all quotes by clicked author
- `async start()` — sets up quote element on lobby page if enabled and not closed today

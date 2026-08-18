# Calculation Trainer Tool — Context

## Overview

The **CalculationTrainer** is a browser extension tool that trains chess calculation and visualization skills from the current position on lichess.org. It provides an interactive dialog where the user must find the best candidate move for each side, with accuracy scoring feedback.

## Dependencies

- **Stockfish**: Engine evaluation to get candidate moves
- **ChessOps**: Chess operations library (FEN parsing, SAN parsing/creation, UCI parsing/making, chess clone/play)
- **Dialog**: Dialog system for creating resizable dialogs

## Preference

- **name**: `calculationTrainer`
- **category**: `analysis`
- **type**: single (radio toggle)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true (only shown when Advanced Preferences toggle is on)

## UI Placement

The tool adds a button labeled "Calculation" in the top navigation bar (`#topnav section a[href="/learn"]+div[role="group"`), inserted after the training/coordinate link. The button has title "LiChess Tools - calculation trainer from current position".

## Dialog Behavior

When clicked, opens a resizable dialog with header "Calculation Trainer" and no scrollable content. The dialog:
- Can be placed at custom positions (left/right/top/bottom) via `lichessTools.setDialogPlacement` pubsub event
- On close: cancels any pending Stockfish evaluation request and resets board to current position

## Training Interface (`trainPosition`)

The core function `trainPosition(container, fen, uci, settings)` renders the trainer interface in a dialog content container. It maintains a `settings` object with:
- **history**: array of position records (fen, uci, score) tracking each move played and its accuracy score
- **started**: boolean indicating whether training has begun

### Start Phase (before first move)

When `settings.started` is false, the container shows:
1. A description text: "Train your calculation and visualization skills from the current position. Find the best candidate move for each side."
2. A "Go" button that starts the training

### After Starting (showing moves)

The container displays:
1. **Score display**: Shows number of moves played and accumulated points with color-coded accuracy gradient (red at 70%, yellow at 85%, green at 100%)
2. **Evaluation** (if `eval` option enabled): Computer evaluation text (+/- centipawns or mate #)
3. **Move buttons**: Candidate moves displayed as SAN buttons, shuffled/random order to prevent memorization

Each move button:
- Has a `data-hash` attribute for identification
- On pointerover: shows explorer arrows on hover (if `arrows` option enabled)
- On click: executes the move and advances to next position

### Click Behavior

When a move button is clicked:
1. Accuracy calculated based on win percentage of chosen move vs best move → score rounded to 0.1 precision added to history
2. Board updates with new FEN (if `board` option enabled) via chessground.set
3. Move spoken aloud (if `readAloud` option enabled) using rate 1.25
4. All buttons color-coded by accuracy (if `clickShow` option enabled): red/yellow/green gradient, then delay 2000ms before next evaluation
5. Training advances to new position with recursive call to `trainPosition`

### Manual Choice Mode

When `manualChoice` is enabled instead of random shuffled moves:
1. User prompted to enter candidate moves in UCI or SAN format via prompt dialog
2. Invalid entries shown and re-prompted until valid moves entered
3. Stockfish evaluates with the user-entered moves as pv options (depth + user moves count)
4. Best move stored from first evaluation

### Undo ("Back") Button

The "Back" button undo last move: removes last entry from history, returns to previous position (fen/uci), resets started=false if history empty. Title warns "Avoid abusing it".

### Configuration Toggle

A gear icon button toggles the `showSettings` class on container, revealing configuration options.

## Configuration Options (Toggles)

All toggles are stored in localStorage via `LiChessTools.calculationTrainer`:

| Option | Toggle Name | Description |
|--------|-------------|-------------|
| **arrows** | `abset-arrows` | Show arrows on hover (explorer hovering on pointerover/pointerout) |
| **board** | `abset-board` | Update board with new position - not recommended |
| **eval** | `showEvalText` | Show computer evaluation - not recommended |
| **clickShow** | Accuracy toggle | Show accuracy color on buttons after click (with 2000ms delay) |
| **readAloud** | Speak toggle | Read move aloud on click (speech rate 1.25) |
| **manualChoice** | Manual toggle | Manual move entry instead of random shuffled candidates |

## Depth Slider

A range input `#abset-depth` with min=1, max=30. Updates `options.depth`, label shows "Depth: %s". Stored in localStorage on change. Default is 16.

## Accuracy Calculation

- **winPerc**: Converts centipawns to win percentage
- **accuracy**: Calculates accuracy between best move and chosen move (0-1 range)
- Score = Math.round(moveAccuracy * 10) / 10 (precision 0.1)
- Gradient colors: 70% → #FF2020 (red), 85% → #FFFF00 (yellow), 100% → #00FF00 (green)

## UCI to Move Conversion

`uciToMove(uci)` converts 4-character UCI move to [from, to] pair (only works for length==4). Used for chessground.lastMove display.
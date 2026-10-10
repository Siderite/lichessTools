# Brilliant move detection

This folder holds a JavaScript class that scores one chess move on 16 "brilliancy principles", combines them with weight vectors, and checks the result against an interval. There is one weight vector and interval per type of brilliancy, and one method that runs all of them and returns a score from 0 to 100.

| File | What it is |
|---|---|
| `BrilliantMoveAnalyzer.js` | The class. Browser JavaScript, needs chessops as the global `co` (or `options.co`). |
| `calibration/` | The two samples with Stockfish evaluations, the labels, an evaluation script and tests. See section 8. |
| `brilliance.js` | The earlier function-based version. The class replaces it. |

## 1. What the GitHub projects use

Sources: the GitHub search for "chess brilliant move", the ICCC 2024 paper on brilliance prediction. I read the READMEs and, where reachable, the classifier source. Only MoveLens had its rules readable in full; the others are described from their README.

| Repository | Approach |
|---|---|
| SanjayMarathi/MoveLens | Win% rules. Brilliant = best or within 1% win, gives up at least 2 pawns, not a promotion, win% before below 97, win% after at least 48. Great = only move: gap to 2nd line above 10% win, 2nd line below 90% win, not a recapture. |
| WintrCat/brilliant-moves-search | Brilliancy score from the material sacrificed, the number of ways to capture it, a bonus when it can be captured with check, and a higher score when a cheap piece can capture an expensive one. |
| tetizz/Brilliant-move-finder | Eight conditions at once: engine best, non-pawn or apparent sacrifice, not just taking an undefended piece, not just rescuing a hanging piece, looks wrong at first, survives the best defense, position justifies the sacrifice, does not help the opponent. |
| H0NEYP0T-466/ChessReviewEngine | Centipawn loss buckets; brilliant = best move that involves a sacrifice. |
| sealldeveloper/lichess-detailed-moves | Evaluation thresholds found by trial and error (+0.6 great, +1.0 excellent, +2.0 brilliant). Ignores sacrifice. |
| arXiv 2406.11895 | Neural network on engine output and game tree shape. A move is more likely brilliant when a weaker engine rates it lower than a stronger one does. |

## 2. Using the class

Inputs are the ones you listed. `evalAfter` can be left out when the move gives checkmate.

```js
const a = new BrilliantMoveAnalyzer({
  fen: 'r3r1k1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3R1K1R b - - 3 17',   // Byrne - Fischer 1956
  san: 'Be6',
  evalBefore: { cp: -304 },          // Lichess convention: White's point of view
  evalAfter:  { cp: -303 },
  multiPv: [                         // optional
    { moves: 'g4e6 a3c3 b6c5 d4c5 g7c3 c4e6', cp: -304 },
    { moves: 'c3b5 c4f7 g8h8 c5b6 b5a3 b6c5', cp: 75 },
    { moves: 'c3b1 a3c1 b6d8 c1b1 g4f3 g2f3', cp: 164 },
  ],
  evalTwoBefore: { cp: -300 },       // optional
  book: false,                       // optional: true for opening theory
});

a.sacrifice();               // { value: 1, raw: { pawns: 4, ... } }   any single principle
a.principles();              // all 16 values;  a.details() adds the raw numbers
a.computeBrilliance();       // generic weighted sum, defaults to the "sacrifice" type
a.computeBrillianceQuiet();  // { score: 1, interval: [0.87, 1], inInterval: true, isBrilliant: true, ... }
a.computeUberBrilliance();   // { score: 100, isBrilliant: true, type: 'quiet', label: 'Quiet sacrifice',
                             //   inInterval: ['quiet', 'combination', 'sacrifice'], byType: {...} }
```

Other details:

- `computeBrilliance(weights, interval, required)` takes any weight vector. It runs all principles, takes the weighted average of the ones named in `weights`, leaves out principles that returned `null`, and checks `lo <= score <= hi`.
- Typed versions: `computeBrillianceSacrifice`, `Mating`, `Combination`, `Positional`, `Quiet`.
- Principles that need an input you did not supply return `null`. A type that lists such a principle under `requires` reports `applicable: false` instead of a verdict (combination and positional need an engine line or a mate score).
- `disqualifiers()` lists reasons a move can never count: only one legal move, a promotion, `book: true`.
- Weights, intervals and types can be replaced per instance: `new BrilliantMoveAnalyzer(input, { types: { quiet: { interval: [0.9, 1] }, great: { label: 'Great move', priority: 0, weights: { bestMove: 1, onlyMove: 1 }, interval: [0.9, 1], requires: ['onlyMove'] } } })`.
- `evalTwoBefore` is read as the position 2 plies before the move, so the same side is to move there. If your evaluation belongs to a position with the other side to move (an odd number of plies back), pass `twoBeforePlies: 1`; only the odd or even value matters.
- Speed on 1013 moves: median 1.4 ms, 95th percentile 8 ms, maximum 36 ms for all five types.

## 3. The principles

Every principle returns a value from 0 to 1 where 1 means "looks more brilliant", or `null` when its input is missing. Weights are never negative, so principles that are needed the other way round exist in that form (`notAlreadyWinning`, not "already winning").

| Principle | Value is 1 when | Needs |
|---|---|---|
| bestMove | The move loses at most 1 point of win% against the best line (0 at 6 points). Lichess win% curve. | evalBefore, evalAfter |
| notAlreadyWinning | The mover's win% before the move is at most 80 (0 at 97). | evalBefore |
| soundAfter | The mover's win% after the move is at least 48 (0 at 35). | evalAfter |
| sacrifice | Material given up, after the opponent's captures are resolved, is 2 pawns or more (0 at 1 pawn or less). | fen, san |
| heavySacrifice | The piece on offer is heavy: pawn 0, minor piece 0.25, rook 0.5, queen 1. | fen, san |
| compensation | The eval holds although material is down: (eval change in pawns + material given up) / material given up. | evals |
| regainsMaterial | The engine line wins the material back, or ends in mate. | multiPv with `moves`, or a mate score |
| lastingSacrifice | The engine line does not win it back (1 - regainsMaterial). | same |
| surprise | A greedy player would prefer other moves: regret in pawns / 4, scaled by 0.8, plus up to 0.1 each when the move is a retreat or goes onto an attacked square. 0 when there is no regret. | fen, san |
| quietMove | Not a capture and not a check (0.3 for a check, 0 for a capture or an answer to check). | fen, san |
| onlyMove | The move is the top line and the 2nd line is 20 win% points worse or more. | multiPv, 2 lines |
| independence | 0 when the move rescues a hanging piece, takes an undefended piece, is an even trade, or answers a check. | fen, san |
| matingAttack | Forced mate for the mover within 6 moves (fades to 0 at 14). | evalAfter |
| attackerValue | The sacrificed piece can be taken by a much cheaper piece (queen attacked by a pawn = 1). | fen, san |
| checkOffer | The sacrificed piece can be captured with check. | fen, san |
| comeback | Two plies earlier the mover had under 45% win and the move improves it (gain / 30). `null` otherwise. | evalTwoBefore |

Principles 5 to 8, 14 and 15 describe a sacrifice, so they are multiplied by the `sacrifice` value. Without that, a one-pawn gambit such as 1.d4 d5 2.c4 scored full marks for "lasting compensation".

"Material" is counted with a capture-only search (depth 8, pawn 1, minor 3, rook 5, queen 9). It sees recaptures. It does not see pins, forks or quiet threats, so every verdict relies on the evaluations you pass in for those.

## 4. Types of brilliancy

A weighted average cannot say "this AND this AND this". The weights give that effect: for each type the essential principles carry a weight larger than `1 - lower bound`, so a 0 on any of them leaves the sum below the lower bound. `BrilliantMoveAnalyzer.necessaryPrinciples(type)` lists them. All upper bounds are 1: the principles already keep the types apart, and a perfect sum is not a reason to reject a move. Lower the upper bound if you want mutually exclusive types.

Weights are out of 100.

| Principle | sacrifice | mating | combination | positional | quiet |
|---|---|---|---|---|---|
| bestMove | 20 | 18 | 18 | 18 | 16 |
| sacrifice | 20 | 22 | 18 | 18 | 18 |
| soundAfter | 15 | 6 | 15 | 15 | 14 |
| notAlreadyWinning | 13 | | 5 | 13 | 6 |
| independence | 13 | | 15 | 13 | 12 |
| compensation | 6 | | 3 | 5 | |
| surprise | 6 | 8 | 8 | | 6 |
| heavySacrifice | 3 | 8 | | | |
| attackerValue | 2 | 5 | | | |
| checkOffer | 1 | 5 | | | |
| comeback | 1 | | | | |
| matingAttack | | 28 | | | |
| regainsMaterial | | | 18 | | |
| lastingSacrifice | | | | 18 | |
| quietMove | | | | | 16 |
| onlyMove | | | | | 12 |
| Interval | 0.88 to 1 | 0.85 to 1 | 0.86 to 1 | 0.88 to 1 | 0.87 to 1 |
| Priority | 1 | 5 | 2 | 3 | 4 |
| Requires | | | regainsMaterial | lastingSacrifice | |

| Type | What it finds | Essential principles |
|---|---|---|
| sacrifice | The mainstream definition (chess.com, MoveLens): best move that gives up material, not already won, not worse after. A saving sacrifice also lands here, since its win% before and after are equal. | bestMove, sacrifice, soundAfter, notAlreadyWinning, independence |
| mating | Sacrifice followed by a short forced mate. Already winning is allowed, because the engine sees the mate before the move is played; the beauty is the sacrifice. Qb8+ in the Opera Game has win% 100 before the move. | matingAttack, sacrifice, bestMove |
| combination | Sacrifice that the engine line wins back or mates (deflection, decoy, clearance). | bestMove, sacrifice, regainsMaterial, soundAfter, independence |
| positional | Material given up for compensation that the engine line never converts back. | bestMove, sacrifice, lastingSacrifice, soundAfter, notAlreadyWinning, independence |
| quiet | A sacrifice that is not a capture or a check, so nothing forces the opponent's reply. | quietMove, bestMove, sacrifice, soundAfter |

A move can be inside several intervals. `computeUberBrilliance().type` is the most specific one (the highest priority). Other kinds of brilliancy that I considered were folded into these or left out:

- Queen sacrifice: not a separate type. `heavySacrifice` and `attackerValue` carry it inside mating and sacrifice.
- Saving or defensive sacrifice: after a best move the win% before and after are equal, so it is the sacrifice type. The engine already counts the saving resource in `evalBefore`.
- Quiet only-move with no material involved (a king walk such as Short's Kh5): `onlyMove` finds it, but it cannot be told apart from a "great" move with these inputs. The custom type in section 2 is how to add one.

## 5. The uber score

`computeUberBrilliance()` runs the five types and maps each weighted average to 0..100 so that the verdicts line up:

- The baseline of the type (the share of its weight on bestMove, soundAfter, notAlreadyWinning, independence and quietMove, which any good move earns) maps to 0.
- The lower edge of the interval maps to 70.
- 1 maps to 100.

The result is the best of the five. `isBrilliant` is `score >= 70`, which is the same as being inside at least one interval and not disqualified. Ordinary moves land near 0 (96% of the 1013 ordinary moves below 10).

## 6. How the weights and intervals were chosen

1. Essential principles come first, as in section 4: each essential weight is larger than `1 - lower bound`.
2. The rest of the weight goes to principles that make a move look better but that a real brilliancy only partly meets (surprise, attackerValue, checkOffer, compensation). The lower bound is then `1 - slack`, with slack large enough for those to be partly missing and small enough that each essential principle is necessary.
3. Mating drops notAlreadyWinning and independence. Combination drops most of notAlreadyWinning. Quiet adds onlyMove. These are the differences between the types.
4. Run on the samples in section 7, then fix what was wrong in the principles, not in the numbers:
   - The first version flagged moves of the losing side in lost positions (a forced knight loss scored 70). soundAfter weights were below the slack. They are now essential.
   - Answers to check were flagged. quietMove and independence now return 0 for them.
   - One-pawn gambits earned lasting-compensation credit (see section 3). Gating by the sacrifice value fixed it.
   - A line-based sacrifice measure (also count a sacrifice made on the next moves of the engine line) found no additional brilliancy and added 2 false positives in the famous games, so it was removed.
   - Ties between equally good captures made attackerValue depend on move generation order. A mirrored-position test found it (section 8). Fixed.
5. Sensitivity: every weight moved by up to 25% and every lower bound by up to 0.02, 400 random draws. Still 9 of 9 found, and 5 to 9 of 1403 other moves flagged (5 with the default weights). Moving all lower bounds up by 0.06 still finds 9 of 9, so the intervals are not set near the edge for the positives.

## 7. Results

Stockfish 19 (WASM, one thread), depth 18, 3 lines, run on every position.

Famous games (10 games, 494 moves). Labels are in `calibration/labels.mjs`.

| Move | Score | Type | Why |
|---|---|---|---|
| Morphy, Opera Game, 16.Qb8+ | 87.6 | mating | queen sacrifice, mate in 2 |
| Anderssen, Evergreen, 21.Qxd7+ | 87.6 | mating | |
| Anderssen, Immortal, 22.Qf6+ | 87.6 | mating | |
| Lasker - Thomas, 11.Qxh7+ | 87.6 | mating | |
| Reti - Tartakower, 9.Qd8+ | 87.6 | mating | |
| Byrne - Fischer, 17...Be6 | 100 | quiet | queen en prise, only move (gap 32% win) |
| Kasparov - Topalov, 24.Rxd4 | 89.6 | combination | |
| Rotlewi - Rubinstein, 22...Rxc3 | 88.5 | combination | |
| Legal's trap, 5.Nxe5 | 98.2 | combination | |

Moves that are famous but left out of the counts, with the reason:

| Move | Score | Reason |
|---|---|---|
| Evergreen 19.Rad1, 20.Rxe7+ | 10.4, 4.1 | Stockfish's best defense avoids the idea. It works only after Black's inferior reply, so the engine does not see a sacrifice. |
| Immortal 18.Bd6 | 25.5 | The engine does not rate it best. |
| Rotlewi - Rubinstein 23...Rd2 | 79.9 | Already completely winning (win% 97) and mate in 11. Flagged. |

Moves that should not be flagged:

| Sample | Moves | Flagged | Notes |
|---|---|---|---|
| Famous games, other moves | 390 | 2 | Both are Topalov's counter-sacrifices in the Kasparov game (29...Bb7 88.3, 30...Qc4 91). |
| Famous games, rest of each combination ("amb") | 91 | 9 | Not counted: moves of the winning side inside a famous combination. |
| 14 ordinary Lichess games, both players 2000+ | 1013 | 3 (0.30%) | 29...g5, an in-between move leaving the queen en prise; 10...Nbd7 and 12...Qb6, which keep a knight en prise in a gambit line. Book moves; pass `book: true` to skip them. |

Against other approaches on the same 9 + 1403 moves:

| Approach | Found | Other moves flagged |
|---|---|---|
| This class, all inputs | 9 of 9 | 5 of 1403 |
| This class, only fen, san, evalBefore, evalAfter | 8 of 9 | 7 of 1403 |
| MoveLens style hard rule | 3 of 9 | 3 of 1403 |

The hard rule misses the five mating sacrifices because the engine already sees the mate before the move (win% 100 is not below 97), and Kasparov's 24.Rxd4 because the position after it is rated 46.1%, under the 48 it requires. With only the four basic inputs the class finds 8 of 9: Rotlewi's 22...Rxc3 drops to 65.3, because the combination type, which tolerates a win% of 95 before the move, needs an engine line.

## 8. Reproducing and what to distrust

```
cd calibration
npm i chessops
node tests.mjs        # ranges, weighted sum, interval, colour symmetry, 9339 random moves, edge cases
node evaluate.mjs     # the tables above;  MINIMAL=1 node evaluate.mjs for the four basic inputs
```

The colour symmetry test mirrors every position (colours swapped, ranks flipped, evaluations negated) and requires all 24112 principle values to stay identical. It found the tie-breaking bug.

Things to distrust:

- The 9 brilliancies are the whole recall sample, and I looked at them while designing the principles. The recall figure is optimistic. The ordinary games were analysed after most of the design was fixed, so the 3 of 1013 figure is the cleaner one. I did adjust two things after seeing them: the onlyMove weight in the quiet type and the uber baseline.
- There is no famous positive for the positional type. Its weights follow from the definition, and it fired on none of the 9 brilliancies.
- Two sacrifices (Evergreen) and one in-between move were judged by me as not counting. A different labeling changes the percentages.
- Verdicts depend on the evaluations passed in. Lichess depth and Stockfish depth differ from the depth 18 used here, so scores near an interval edge can move.
- `comeback` is the only user of `evalTwoBefore`. It has weight 1 in the sacrifice type and never changed a verdict in the samples.
- Chess.com's real rules are not public. This class implements the published repository ideas plus the checks above.

import { Chess } from './chess.js';

// -------------------------------------------------------------
// Common Math Helpers
// -------------------------------------------------------------

/**
 * clamp(x)
 * -----------------------------------------
 * Restricts a numeric value to the range [0, 1].
 *
 * Useful for normalizing computed metrics or ensuring
 * values remain within valid percentage bounds.
 *
 * @param {number} x - Input value to be clamped.
 * @returns {number} The input value, limited to the [0, 1] range.
 *
 * Example:
 *   clamp(1.2) → 1
 *   clamp(-0.3) → 0
 *   clamp(0.5) → 0.5
 */
const clamp = (x) => Math.max(0, Math.min(1, x));

/**
 * -------------------------------------------------------------
 * getMaterialBoth(game)
 * -------------------------------------------------------------
 * Calculates the normalized Material metric for both sides.
 *
 * Material is based on the summed standard piece values:
 *   Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9, King = 0
 *
 * The resulting scores are normalized to the [0,1] range
 * relative to a total material scale of 78 points:
 *   - 39 points maximum per side (all pieces on board)
 *   - 78 total across both sides
 *
 * @param {Chess} game - A chess.js instance representing the position.
 * @returns {{ whiteMaterialScore: number, blackMaterialScore: number }}
 *          Normalized scores for both White and Black.
 */
function getMaterialBoth(game) {
  // Base piece values
  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  // Accumulators for total material of each side
  let w = 0,
    b = 0;

  // Traverse all board squares and sum piece values
  game
    .board()
    .flat()
    .forEach((sq) => {
      if (!sq) return;
      const v = pieceValues[sq.type] || 0;
      sq.color === "w" ? (w += v) : (b += v);
    });

  // Difference: positive if White leads, negative if Black leads
  const diff = w - b;

  // Normalize to [0,1] range:
  //   - Add 39 to center the difference on zero
  //   - Divide by total (78) to map full material range
  //   - Clamp ensures scores stay bounded
  return {
    whiteMaterialScore: clamp((diff + 39) / 78),
    blackMaterialScore: clamp((-diff + 39) / 78),
  };
}

/**
 * -------------------------------------------------------------
 * getKingSafety(game, color)
 * -------------------------------------------------------------
 * Evaluates King Safety for a given side by combining several
 * strategic subfactors into a normalized [0,1] score.
 *
 * Components:
 *   1. Pawn Shield      – protection from pawns directly in front
 *   2. Castling/Placement – rank safety and castled positioning
 *   3. Mobility         – number of safe adjacent squares
 *   4. Enemy Pressure   – nearby opposing pieces and their threat potential
 *
 * The final score is lightly smoothed toward higher values for stability,
 * and clamped to ensure it stays in [0,1].
 *
 * @param {Chess} game - A chess.js instance representing the position.
 * @param {"w"|"b"} color - The color whose king safety to evaluate.
 * @returns {number} Normalized safety score between 0 and 1.
 */
function getKingSafety(game, color) {
  const board = game.board();
  let king = null;

  // -------------------------------------------------------------
  // Locate the king’s coordinates (file 0–7, rank 1–8)
  // -------------------------------------------------------------
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = board[r][f];
      if (sq?.type === "k" && sq.color === color)
        king = { file: f, rank: 8 - r };
    }
  }

  // If the king cannot be found (invalid FEN), return a neutral score
  if (!king) return 0.5;

  let score = 0;

  // -------------------------------------------------------------
  // 1. Pawn Shield — number of pawns directly in front of the king
  // -------------------------------------------------------------
  const frontRank = color === "w" ? king.rank + 1 : king.rank - 1;
  let shield = 0;
  for (let df = -1; df <= 1; df++) {
    const file = Math.max(0, Math.min(7, king.file + df));
    const sq = `${String.fromCharCode(97 + file)}${frontRank}`;
    const p = game.get(sq);
    if (p?.type === "p" && p.color === color) shield++;
  }

  // Normalize shield (0–3 pawns) and weight contribution
  const shieldScore = shield / 3;
  score += shieldScore * 0.45;

  // -------------------------------------------------------------
  // 2. Castling / Placement — evaluates how exposed the king is
  // -------------------------------------------------------------
  const kingSquare = `${String.fromCharCode(97 + king.file)}${king.rank}`;
  const castledSquares = color === "w" ? ["g1", "c1"] : ["g8", "c8"];
  const isCastled = castledSquares.includes(kingSquare);

  // Rank safety: kings deeper in own territory score higher
  const rankSafety =
    color === "w" ? 1 - (king.rank - 1) / 7 : 1 - (8 - king.rank) / 7;

  // Default placement weight
  let placement = rankSafety * 0.3;

  // Bonus for being castled with an intact pawn shield
  if (isCastled && shieldScore >= 0.66) placement = 0.35;

  score += placement;

  // -------------------------------------------------------------
  // 3. Mobility — empty adjacent squares the king can move to
  // -------------------------------------------------------------
  let mobility = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let df = -1; df <= 1; df++) {
      if (dr === 0 && df === 0) continue;
      const nr = king.rank + dr;
      const nf = king.file + df;
      if (nr < 1 || nr > 8 || nf < 0 || nf > 7) continue;
      const sq = `${String.fromCharCode(97 + nf)}${nr}`;
      if (!game.get(sq)) mobility++;
    }
  }

  // Weight mobility modestly (at most +0.05)
  score += (mobility / 8) * 0.05;

  // -------------------------------------------------------------
  // 4. Enemy Pressure — detect nearby enemy pieces and estimate threat
  // -------------------------------------------------------------
  const enemy = color === "w" ? "b" : "w";
  let pressure = 0;

  // Look in a 7×7 zone around the king (3 squares in each direction)
  for (let dr = -3; dr <= 3; dr++) {
    for (let df = -3; df <= 3; df++) {
      if (dr === 0 && df === 0) continue;
      const nr = king.rank + dr;
      const nf = king.file + df;
      if (nr < 1 || nr > 8 || nf < 0 || nf > 7) continue;
      const sq = `${String.fromCharCode(97 + nf)}${nr}`;
      const p = game.get(sq);

      if (p?.color === enemy) {
        // Each piece contributes pressure inversely proportional to distance
        const val = { q: 3, r: 2, b: 1.5, n: 1.2, p: 0.8 }[p.type] || 1;
        pressure += val / (Math.abs(dr) + Math.abs(df));
      }
    }
  }

  // Reduce safety based on total nearby enemy activity
  // Cap reduction to a max of -0.25
  score -= Math.min(pressure / 10, 0.25);

  // -------------------------------------------------------------
  // Final normalization and smoothing
  // -------------------------------------------------------------
  const finalScore = clamp(score);

  // Blend linear and quadratic terms for smoother gradient
  // (slightly rewards strong safety, dampens extremes)
  return clamp(0.7 * finalScore + 0.3 * finalScore * finalScore);
}

/**
 * -------------------------------------------------------------
 * getPieceActivity(game, color)
 * -------------------------------------------------------------
 * Evaluates the "Activity" metric for a given color — a measure
 * of how freely that side’s pieces can move and how active
 * they are, particularly in central areas.
 *
 * Activity is based on:
 *   1. Number of available non-pawn moves.
 *   2. Small bonus for knights and bishops occupying central squares.
 *
 * The score is normalized to the [0,1] range using clamp().
 *
 * @param {Chess} game - A chess.js instance representing the position.
 * @param {"w"|"b"} color - The side to evaluate ("w" for White, "b" for Black).
 * @returns {number} Normalized activity score in [0,1].
 */
function getPieceActivity(game, color) {
  // Clone the position and set the side to move to the target color
  // so that generated moves reflect that color’s mobility.
  const fenParts = game.fen().split(" ");
  fenParts[1] = color;
  const temp = new Chess(fenParts.join(" "));

  // Generate all legal moves for this side
  const moves = temp.moves({ verbose: true });

  // Count only non-pawn moves (pawns are excluded from activity metric)
  const nonPawn = moves.filter((m) => m.piece !== "p").length;

  // Normalize raw mobility — 40 is a practical cap for open positions
  let score = Math.min(nonPawn / 40, 1);

  // -------------------------------------------------------------
  // Positional Bonus: Add small increments for knights and bishops
  // occupying central squares (d4, d5, e4, e5). This favors
  // active, well-placed minor pieces.
  // -------------------------------------------------------------
  game.board().forEach((row, r) =>
    row.forEach((sq, f) => {
      if (!sq || sq.color !== color || sq.type === "p") return;
      const square = `${String.fromCharCode(97 + f)}${8 - r}`;
      if (isCentralSquare(square) && ["n", "b"].includes(sq.type)) score += 0.1;
    })
  );

  // Clamp ensures final score stays within valid [0,1] range
  return clamp(score);
}

/**
 * -------------------------------------------------------------
 * isCentralSquare(sq)
 * -------------------------------------------------------------
 * Determines whether a given square (e.g., "d4") lies within the
 * central 4x4 region of the chessboard (c4–f5 area).
 *
 * @param {string} sq - Square in algebraic format (e.g., "e4").
 * @returns {boolean} True if square is one of the 16 central squares.
 */
function isCentralSquare(sq) {
  const f = sq.charCodeAt(0) - 97; // convert file letter to 0–7 index
  const r = parseInt(sq[1], 10) - 1; // convert rank to 0–7 index
  return f >= 3 && f <= 4 && r >= 3 && r <= 4;
}

/**
 * -------------------------------------------------------------
 * Pawn Structure Evaluation
 * -------------------------------------------------------------
 * Evaluates the overall quality of a given side’s pawn structure
 * using a broad set of positional heuristics (19 total features).
 *
 * The system detects both static and dynamic pawn features:
 *   - Weaknesses: isolated, doubled, backward, over-advanced pawns
 *   - Strengths: passed pawns, chains, levers, flank majorities
 *   - Board context: pawn islands, rams, weak squares, hanging pawns
 *
 * Each factor is weighted, aggregated, normalized to [0,1],
 * and cached for reuse to optimize performance.
 */

// =============================================================
// Core Board Utilities
// =============================================================

function squareFromRF(fileIdx, rank) {
  return `${String.fromCharCode(97 + fileIdx)}${rank}`;
}

function listPawns(game, color) {
  const pawns = [];
  game.board().forEach((row, rIdx) => {
    const rank = 8 - rIdx;
    row.forEach((sq, fIdx) => {
      if (sq?.type === "p" && sq.color === color) {
        pawns.push({ file: fIdx, rank, square: squareFromRF(fIdx, rank) });
      }
    });
  });
  return pawns;
}

function listEnemyPawns(game, color) {
  return listPawns(game, color === "w" ? "b" : "w");
}

function filesWithPawns(game, color) {
  return Array.from(new Set(listPawns(game, color).map((p) => p.file))).sort(
    (a, b) => a - b
  );
}

function forwardStep(color) {
  return color === "w" ? 1 : -1;
}

function enemy(color) {
  return color === "w" ? "b" : "w";
}

function pawnCaptureDeltas(color) {
  return color === "w"
    ? [1, -1].map((df) => ({ df, dr: 1 }))
    : [1, -1].map((df) => ({ df, dr: -1 }));
}

function isOnBoard(file, rank) {
  return file >= 0 && file <= 7 && rank >= 1 && rank <= 8;
}

function squareHasPawn(game, color, file, rank) {
  if (!isOnBoard(file, rank)) return false;
  const sq = squareFromRF(file, rank);
  const p = game.get(sq);
  return p?.type === "p" && p.color === color;
}

function countPawns(game, color) {
  return listPawns(game, color).length;
}

// =============================================================
// Pawn Structure Feature Detectors
// =============================================================

// 1) Isolated Pawns
function countIsolatedPawns(game, color) {
  const pawns = listPawns(game, color);
  const filesSet = new Set(filesWithPawns(game, color));
  let isolated = 0;
  for (const p of pawns) {
    const left = p.file - 1;
    const right = p.file + 1;
    const hasLeft = filesSet.has(left);
    const hasRight = filesSet.has(right);
    if (!hasLeft && !hasRight) isolated++;
  }
  return isolated;
}

// 2) Doubled Pawns
function countDoubledPawns(game, color) {
  const pawns = listPawns(game, color);
  const byFile = new Map();
  for (const p of pawns) {
    byFile.set(p.file, (byFile.get(p.file) || 0) + 1);
  }
  let doubled = 0;
  for (const [, n] of byFile) {
    if (n >= 2) doubled += n - 1;
  }
  return doubled;
}

// 3) Pawn Islands
function countPawnIslands(game, color) {
  const files = filesWithPawns(game, color);
  if (files.length === 0) return 0;
  let islands = 1;
  for (let i = 1; i < files.length; i++) {
    if (files[i] !== files[i - 1] + 1) islands++;
  }
  return islands;
}

// 4) Passed Pawns
function countPassedPawns(game, color) {
  const my = listPawns(game, color);
  const opp = listEnemyPawns(game, color);
  const oppByFile = new Map();
  for (const p of opp) {
    if (!oppByFile.has(p.file)) oppByFile.set(p.file, []);
    oppByFile.get(p.file).push(p.rank);
  }
  for (const ranks of oppByFile.values()) ranks.sort((a, b) => a - b);

  const myByFile = new Map();
  for (const p of my) {
    if (!myByFile.has(p.file)) myByFile.set(p.file, []);
    myByFile.get(p.file).push(p.rank);
  }
  for (const ranks of myByFile.values()) ranks.sort((a, b) => a - b);

  function enemyPawnAheadOnFile(file, fromRank) {
    const ranks = oppByFile.get(file);
    if (!ranks || ranks.length === 0) return false;
    if (color === "w") return ranks.some((r) => r > fromRank);
    return ranks.some((r) => r < fromRank);
  }

  function friendAheadOnFile(file, fromRank) {
    const ranks = myByFile.get(file);
    if (!ranks) return false;
    if (color === "w") return ranks.some((r) => r > fromRank);
    return ranks.some((r) => r < fromRank);
  }

  let passers = 0;
  for (const p of my) {
    const filesToCheck = [p.file, p.file - 1, p.file + 1].filter(
      (f) => f >= 0 && f <= 7
    );
    const hasEnemyAhead = filesToCheck.some((f) =>
      enemyPawnAheadOnFile(f, p.rank)
    );
    if (hasEnemyAhead) continue;
    if (friendAheadOnFile(p.file, p.rank)) continue;
    passers++;
  }
  return passers;
}

// 5) Candidate Passed Pawns
function countCandidatePassedPawns(game, color) {
  const my = listPawns(game, color);
  const filesHalfOpenForColor = classifyFiles(game).halfOpen[color];

  function isBlockedByEnemyAhead(file, rank) {
    const r1 = rank + forwardStep(color);
    if (!isOnBoard(file, r1)) return true;
    const sq = squareFromRF(file, r1);
    const piece = game.get(sq);
    return !!piece;
  }

  function hasFriendlyPotentialSupport(file, rank) {
    for (const df of [-1, 1]) {
      const f2 = file + df;
      if (f2 < 0 || f2 > 7) continue;
      if (color === "w") {
        for (let r = rank - 1; r >= 2; r--) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      } else {
        for (let r = rank + 1; r <= 7; r++) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      }
    }
    return false;
  }

  let count = 0;
  for (const p of my) {
    const isHalfOpen = filesHalfOpenForColor.has(p.file);
    if (!isHalfOpen) continue;
    if (isBlockedByEnemyAhead(p.file, p.rank)) continue;
    if (!hasFriendlyPotentialSupport(p.file, p.rank)) continue;
    count++;
  }
  return count;
}

// 6) Backward Pawns
function countBackwardPawns(game, color) {
  const my = listPawns(game, color);

  function pawnControls(colorToMap) {
    const ctr = new Set();
    for (const p of listPawns(game, colorToMap)) {
      const deltas = pawnCaptureDeltas(colorToMap);
      for (const { df, dr } of deltas) {
        const f = p.file + df;
        const r = p.rank + dr;
        if (isOnBoard(f, r)) ctr.add(squareFromRF(f, r));
      }
    }
    return ctr;
  }
  const myPawnCtrl = pawnControls(color);
  const oppPawnCtrl = pawnControls(enemy(color));

  function canBeSupportedFromBehind(file, rank) {
    for (const df of [-1, 1]) {
      const f2 = file + df;
      if (f2 < 0 || f2 > 7) continue;
      if (color === "w") {
        for (let r = rank - 1; r >= 2; r--) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      } else {
        for (let r = rank + 1; r <= 7; r++) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      }
    }
    return false;
  }

  let count = 0;
  for (const p of my) {
    const stopSq = squareFromRF(p.file, p.rank + forwardStep(color));
    if (!isOnBoard(p.file, p.rank + forwardStep(color))) continue;
    if (canBeSupportedFromBehind(p.file, p.rank)) continue;
    const stopDefendedByOwnPawn = myPawnCtrl.has(stopSq);
    if (stopDefendedByOwnPawn) continue;
    const stopControlledByEnemyPawn = oppPawnCtrl.has(stopSq);
    if (stopControlledByEnemyPawn) count++;
  }
  return count;
}

// 7) Hanging Pawns
function countHangingPawns(game, color) {
  const my = listPawns(game, color);
  const myByFile = new Map();
  for (const p of my) {
    if (!myByFile.has(p.file)) myByFile.set(p.file, []);
    myByFile.get(p.file).push(p.rank);
  }
  for (const arr of myByFile.values()) arr.sort((a, b) => a - b);

  const { halfOpen } = classifyFiles(game);
  const halfOpenForColor = halfOpen[color];

  let count = 0;
  for (let f = 0; f < 7; f++) {
    const f2 = f + 1;
    const hasOnF = !!myByFile.get(f);
    const hasOnF2 = !!myByFile.get(f2);
    if (!hasOnF || !hasOnF2) continue;
    const ranksF = myByFile.get(f);
    const ranksF2 = myByFile.get(f2);
    const advancedPair =
      color === "w"
        ? ranksF.some((r) => r >= 4) && ranksF2.some((r) => r >= 4)
        : ranksF.some((r) => r <= 5) && ranksF2.some((r) => r <= 5);
    if (!advancedPair) continue;
    const leftOpen = f - 1 >= 0 ? halfOpenForColor.has(f - 1) : true;
    const rightOpen = f2 + 1 <= 7 ? halfOpenForColor.has(f2 + 1) : true;
    if (leftOpen && rightOpen) count++;
  }
  return count;
}

// 8) Pawn Chains
function getPawnChains(game, color) {
  const my = listPawns(game, color);
  const visited = new Set();
  function defends(p, q) {
    const df1 = q.file - p.file;
    const dr1 = q.rank - p.rank;
    const drExpected = forwardStep(color);
    return Math.abs(df1) === 1 && dr1 === drExpected;
  }
  const chains = [];
  for (const p of my) {
    if (visited.has(p.square)) continue;
    const chain = [p];
    visited.add(p.square);
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (const r of my) {
        if (visited.has(r.square)) continue;
        if (defends(chain[chain.length - 1], r)) {
          chain.push(r);
          visited.add(r.square);
          expanded = true;
        }
      }
    }
    if (chain.length > 1) chains.push(chain);
  }
  return chains;
}

function countPawnChains(game, color) {
  return getPawnChains(game, color).length;
}

function detectChainBases(game, color) {
  const chains = getPawnChains(game, color);
  const bases = [];
  for (const chain of chains) {
    bases.push(chain[0]);
  }
  return bases;
}

// 9) Pawn Rams
function countPawnRams(game) {
  const white = listPawns(game, "w");
  const blackByFile = new Map();
  for (const p of listPawns(game, "b")) {
    if (!blackByFile.has(p.file)) blackByFile.set(p.file, new Set());
    blackByFile.get(p.file).add(p.rank);
  }
  let rams = 0;
  for (const w of white) {
    const bRanks = blackByFile.get(w.file);
    if (!bRanks) continue;
    if (bRanks.has(w.rank + 1)) rams++;
  }
  return rams;
}

// 10) Pawn Levers
function countPawnLevers(game, color) {
  const my = listPawns(game, color);
  let levers = 0;
  for (const p of my) {
    for (const { df, dr } of pawnCaptureDeltas(color)) {
      const f2 = p.file + df;
      const r2 = p.rank + dr;
      if (!isOnBoard(f2, r2)) continue;
      const sq = squareFromRF(f2, r2);
      const piece = game.get(sq);
      if (piece?.type === "p" && piece.color === enemy(color)) levers++;
    }
  }
  return levers;
}

// 11) File Classification
function classifyFiles(game) {
  const whiteFiles = new Set(filesWithPawns(game, "w"));
  const blackFiles = new Set(filesWithPawns(game, "b"));
  const open = new Set();
  const closed = new Set();
  const halfOpen = { w: new Set(), b: new Set() };
  for (let f = 0; f < 8; f++) {
    const hasW = whiteFiles.has(f);
    const hasB = blackFiles.has(f);
    if (!hasW && !hasB) open.add(f);
    else if (hasW && hasB) closed.add(f);
    else if (hasB && !hasW) halfOpen.w.add(f);
    else if (hasW && !hasB) halfOpen.b.add(f);
  }
  return { open, halfOpen, closed };
}

// 12) Pawn Majorities
function detectPawnMajority(game, color) {
  const my = listPawns(game, color);
  const opp = listEnemyPawns(game, color);
  const myQ = my.filter((p) => p.file <= 2).length;
  const myK = my.filter((p) => p.file >= 5).length;
  const opQ = opp.filter((p) => p.file <= 2).length;
  const opK = opp.filter((p) => p.file >= 5).length;
  return { queensideMajority: myQ > opQ, kingsideMajority: myK > opK };
}

function detectMinority(game, color) {
  const m = detectPawnMajority(game, color);
  return {
    queensideMinority: !m.queensideMajority,
    kingsideMinority: !m.kingsideMajority,
  };
}

// 13) Over-Advanced Pawns
function countOverAdvancedPawns(game, color) {
  const my = listPawns(game, color);
  let count = 0;
  for (const p of my) {
    const advanced = color === "w" ? p.rank >= 6 : p.rank <= 3;
    if (!advanced) continue;
    let support = false;
    for (const df of [-1, 1]) {
      const f2 = p.file + df;
      if (f2 < 0 || f2 > 7) continue;
      if (color === "w") {
        for (let r = p.rank - 1; r >= 2; r--) {
          if (squareHasPawn(game, color, f2, r)) {
            support = true;
            break;
          }
        }
      } else {
        for (let r = p.rank + 1; r <= 7; r++) {
          if (squareHasPawn(game, color, f2, r)) {
            support = true;
            break;
          }
        }
      }
      if (support) break;
    }
    if (!support) count++;
  }
  return count;
}

// 14) Weak Pawns (isolated + backward + over-advanced)
function countWeakPawns(game, color) {
  const isolated = countIsolatedPawns(game, color);
  const backward = countBackwardPawns(game, color);
  const overAdv = countOverAdvancedPawns(game, color);
  return isolated + backward + overAdv;
}

// 15) Central Doubled Pawns
function countCentralDoubledPawns(game, color) {
  const pawns = listPawns(game, color).filter(
    (p) => p.file === 3 || p.file === 4
  );
  const byFile = new Map();
  for (const p of pawns) byFile.set(p.file, (byFile.get(p.file) || 0) + 1);
  let doubled = 0;
  for (const [, n] of byFile) {
    if (n >= 2) doubled += n - 1;
  }
  return doubled;
}

// 16) Weak Squares
function detectWeakSquares(game, color) {
  const weak = new Set();
  function friendlyPawnCanGuardSquare(file, rank) {
    const step = forwardStep(color);
    for (const df of [-1, 1]) {
      const f2 = file - df;
      const r2 = rank - step;
      if (!isOnBoard(f2, r2)) continue;
      if (color === "w") {
        for (let r = r2; r >= 2; r--) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      } else {
        for (let r = r2; r <= 7; r++) {
          if (squareHasPawn(game, color, f2, r)) return true;
        }
      }
    }
    return false;
  }
  const ranksToScan = color === "w" ? [1, 2, 3, 4] : [8, 7, 6, 5];
  for (const r of ranksToScan) {
    for (let f = 0; f < 8; f++) {
      if (!friendlyPawnCanGuardSquare(f, r)) weak.add(squareFromRF(f, r));
    }
  }
  return weak;
}

// =============================================================
// Pawn Structure Cache
// =============================================================
const _pawnTT = new Map();

function computePawnKey(game) {
  const wp = listPawns(game, "w")
    .map((p) => p.square)
    .sort()
    .join(",");
  const bp = listPawns(game, "b")
    .map((p) => p.square)
    .sort()
    .join(",");
  return `P:${wp}|${bp}`;
}

function getCachedPawnStructure(game) {
  const k = computePawnKey(game);
  return _pawnTT.get(k);
}

function storePawnStructure(game, data) {
  const k = computePawnKey(game);
  _pawnTT.set(k, data);
}

// =============================================================
// Aggregator
// =============================================================
function getPawnStructureForColor(game, color) {
  const cached = getCachedPawnStructure(game);
  if (cached && typeof cached[color] === "number") {
    return clamp(cached[color]);
  }

  const total = countPawns(game, color) || 1;
  const isolated = countIsolatedPawns(game, color);
  const doubled = countDoubledPawns(game, color);
  const islands = countPawnIslands(game, color);
  const backward = countBackwardPawns(game, color);
  const overAdv = countOverAdvancedPawns(game, color);
  const centralD = countCentralDoubledPawns(game, color);
  const passed = countPassedPawns(game, color);
  const candPassed = countCandidatePassedPawns(game, color);
  const chains = countPawnChains(game, color);
  const bases = detectChainBases(game, color).length;
  const levers = countPawnLevers(game, color);
  const rams = countPawnRams(game);
  const hanging = countHangingPawns(game, color);
  const weakSq = detectWeakSquares(game, color).size;
  const { queensideMajority, kingsideMajority } = detectPawnMajority(
    game,
    color
  );
  const minorities = detectMinority(game, color);
  const weak = countWeakPawns(game, color);

  const flankBonus =
    (queensideMajority ? 0.02 : 0) +
    (kingsideMajority ? 0.02 : 0) -
    (minorities.queensideMinority ? 0.02 : 0) -
    (minorities.kingsideMinority ? 0.02 : 0);

  let score =
    1 -
    0.4 * (isolated / total) -
    0.55 * (doubled / total) -
    0.25 * (backward / total) -
    0.2 * (overAdv / total) -
    0.2 * (centralD / total) -
    0.1 * (Math.max(0, islands - 1) / 4) -
    0.05 * (bases / total) -
    0.1 * (weak / total) -
    0.1 * (weakSq / 8) -
    0.05 * (hanging / 4) -
    0.1 * (rams / 8) +
    0.4 * (passed / total) +
    0.15 * (candPassed / total) +
    0.1 * (chains / 4) +
    0.05 * (levers / total) +
    flankBonus;

  const result = clamp(score);
  const prev = getCachedPawnStructure(game) || {};
  storePawnStructure(game, { ...prev, [color]: result });
  return result;
}

// -------------------------------------------------------------
// Space Metric
// -------------------------------------------------------------
// Evaluates how much "space" a given side controls on the board.
// The metric combines three weighted components:
//   1. Reach Score   – number of reachable squares in the opponent’s half
//   2. Presence Score – how many of own pieces physically occupy that half
//   3. Foothold Score – control and occupation of central files in enemy half
//
// The result is normalized to [0,1] using clamp().
// -------------------------------------------------------------


/**
 * getSpaceForColor(game, color)
 * -----------------------------------------
 * Computes the normalized space control score for a given color.
 *
 * @param {Chess} game - A chess.js instance representing the current position.
 * @param {"w"|"b"} color - The color to evaluate.
 * @returns {number} A value between 0 and 1, representing relative space control.
 */
function getSpaceForColor(game, color) {
  // Clone the position but set the side to move to the target color
  // so move generation is done from that perspective
  const fenParts = game.fen().split(" ");
  fenParts[1] = color;
  const temp = new Chess(fenParts.join(" "));

  // Define opponent’s half of the board depending on color
  const oppHalfRankMin = color === "w" ? 5 : 1;
  const oppHalfRankMax = color === "w" ? 8 : 4;

  // -------------------------------------------------------------
  // 1. Reach Score — count how many unique squares this side’s
  // non-king pieces can reach in the opponent’s half.
  // -------------------------------------------------------------
  const moves = temp.moves({ verbose: true });
  const reachSquares = new Set(
    moves
      .filter((m) => m.piece !== "k") // ignore king moves
      .filter((m) => {
        const r = parseInt(m.to[1], 10);
        return r >= oppHalfRankMin && r <= oppHalfRankMax;
      })
      .map((m) => m.to)
  );
  // Max possible coverage of 28 squares (approx half board)
  const reachScore = Math.min(reachSquares.size / 28, 1);

  // -------------------------------------------------------------
  // 2. Presence Score — proportion of own piece weight
  // physically occupying the opponent’s half.
  // -------------------------------------------------------------
  let presence = 0,
    maxPresence = 0;
  const weights = { p: 1, n: 0.8, b: 0.8, r: 0.6, q: 0.5, k: 0.2 };
  game.board().forEach((row, rankIdx) =>
    row.forEach((sq, fileIdx) => {
      if (!sq || sq.color !== color) return;
      const rank = 8 - rankIdx;
      const inOppHalf = color === "w" ? rank >= 5 : rank <= 4;
      const w = weights[sq.type] || 0.5;
      maxPresence += w;
      if (inOppHalf) presence += w;
    })
  );
  const presenceScore = maxPresence > 0 ? presence / maxPresence : 0;

  // -------------------------------------------------------------
  // 3. Foothold Score — measures how many of the player’s pieces
  // occupy or control central files (c–f) in the opponent’s half.
  // -------------------------------------------------------------
  const centralFiles = new Set(["c", "d", "e", "f"]);
  let foothold = 0,
    footholdDen = 0;
  game.board().forEach((row, rankIdx) =>
    row.forEach((sq, fileIdx) => {
      if (!sq || sq.color !== color) return;
      const rank = 8 - rankIdx;
      const fileChar = String.fromCharCode(97 + fileIdx);
      const inOppHalf = color === "w" ? rank >= 5 : rank <= 4;
      if (inOppHalf && centralFiles.has(fileChar)) foothold++;
      if (centralFiles.has(fileChar)) footholdDen++;
    })
  );
  const footholdScore = footholdDen > 0 ? foothold / footholdDen : 0;

  // -------------------------------------------------------------
  // Combine all components with tuned weights:
  //   55% reach + 30% presence + 15% foothold
  // -------------------------------------------------------------
  return clamp(0.55 * reachScore + 0.3 * presenceScore + 0.15 * footholdScore);
}

// Import chess.js for FEN parsing and position validation

/**
 * -----------------------------------------
 * Function: computeKMAPS(fen)
 * -----------------------------------------
 * Computes the five K-MAPS metrics — Material, King Safety, Activity,
 * Pawn Structure, and Space — for both White and Black based on a given FEN.
 *
 * Each metric returns a normalized value between 0 and 1,
 * allowing easy comparison across different positions.
 *
 * @param {string} fen - A valid FEN string representing a chess position.
 * @returns {Array<Object>} A list of metric objects in the form:
 *   [
 *     { metric: "Material", White: 0.5, Black: 0.5 },
 *     { metric: "King Safety", White: 0.7, Black: 0.6 },
 *     ...
 *   ]
 *   Returns an empty array [] if the FEN is invalid.
 */
function computeKMAPS(fen) {
  // Validate input type
  if (!fen || typeof fen !== "string") return [];

  let game;
  try {
    // Attempt to load the position using chess.js
    // This ensures FEN validity and initializes piece data
    game = new Chess(fen);
  } catch {
    // If the FEN is invalid or unparsable, return an empty result set
    return [];
  }

  // --- Compute individual submetrics for both sides ---

  // Material balance
  const { whiteMaterialScore, blackMaterialScore } = getMaterialBoth(game);

  // King safety evaluation
  const kingW = getKingSafety(game, "w");
  const kingB = getKingSafety(game, "b");

  // Piece activity / mobility
  const actW = getPieceActivity(game, "w");
  const actB = getPieceActivity(game, "b");

  // Pawn structure quality
  const pawnW = getPawnStructureForColor(game, "w");
  const pawnB = getPawnStructureForColor(game, "b");

  // Spatial control (territory)
  const spaceW = getSpaceForColor(game, "w");
  const spaceB = getSpaceForColor(game, "b");

  // --- Aggregate and return normalized K-MAPS results ---
  return [
    {
      metric: "Material",
      White: whiteMaterialScore,
      Black: blackMaterialScore,
    },
    { metric: "King Safety", White: kingW, Black: kingB },
    { metric: "Activity", White: actW, Black: actB },
    { metric: "Pawn Structure", White: pawnW, Black: pawnB },
    { metric: "Space", White: spaceW, Black: spaceB },
  ];
}

export { computeKMAPS };

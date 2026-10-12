(() => {

  // One scoring utility (normalization, logistic, ramp, tapered interpolation).
  class Scoring {
    static normalize(score, min, max) {
      if (score >= max) return 1;
      if (score <= min) return -1;
      return (2 * (score - min)) / (max - min) - 1;
    }
    // raw logistic 1 / (1 + e^-x); the building block of the win%/sharpness/chart curves.
    // The Lichess win% curve uses k = 0.00368208; the chart/sound tools use k = 0.004 for
    // display scaling — intentionally different curves.
    static sigmoid(x) {
      return 1 / (1 + Math.exp(-x));
    }
    static centipawnsToWinPercentage(cp) {
      return 50 + 50 * (2 * Scoring.sigmoid(0.00368208 * cp) - 1);
    }
    // Lichess accuracy metric (AccuracyPercent.fromWinPercents): maps a win-percentage
    // drop to move accuracy. Exact fitted constants, plus the "+1" uncertainty bonus
    // for imperfect analysis, clamped to [0, 100]. Non-losing moves are exactly 100.
    static winDeltaToAccuracy(expected, played) {
      const winDiff = expected - (played || 0);
      if (winDiff <= 0) return 100;
      const raw = 103.1668100711649 * Math.exp(-0.04354415386753951 * winDiff) - 3.166924740191411;
      return Math.min(100, Math.max(0, raw + 1));
    }
    static wdlToSharpness(w, d, l) {
      return Math.round(Math.min(w, l) / 50 * 333 / d * Scoring.sigmoid((w + l) / 1000));
    }
    static ramp(x, zero, full) {
      return Math.min(1, Math.max(0, (x - zero) / (full - zero)));
    }
    static tapered(mg, eg, phase) {
      return mg + (eg - mg) * phase;
    }
  }

  LiChessTools.Scoring = Scoring;
})();

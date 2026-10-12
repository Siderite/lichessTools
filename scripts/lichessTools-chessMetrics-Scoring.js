(() => {

  // One scoring utility (normalization, logistic, ramp, tapered interpolation).
  class Scoring {
    static normalize(score, min, max) {
      if (score >= max) return 1;
      if (score <= min) return -1;
      return (2 * (score - min)) / (max - min) - 1;
    }
    static centipawnsToWinPercentage(cp) {
      return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
    }
    static winDeltaToAccuracy(expected, played) {
      return Math.max(0, 103.1668 * Math.exp(-0.04354 * Math.max(0, expected - (played || 0))) - 3.1669);
    }
    static wdlToSharpness(w, d, l) {
      return Math.round(Math.min(w, l) / 50 * 333 / d * 1 / (1 + Math.exp(-(w + l) / 1000)));
    }
    static ramp(x, zero, full) {
      if (x <= zero) return 0;
      if (x >= full) return 1;
      return (x - zero) / (full - zero);
    }
    static tapered(mg, eg, phase) {
      return mg + (eg - mg) * phase;
    }
  }

  LiChessTools.Scoring = Scoring;
})();

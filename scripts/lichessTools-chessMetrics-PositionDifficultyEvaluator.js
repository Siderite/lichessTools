(() => {
  // "Quantifying Depth and Complexity of Thinking and Knowledge" by Tamal T. Biswas and Kenneth W.
  // Regan (ICGA Journal 31(1) 2015), followed as written in the Chess Engine Lab post "Calculating
  // the Difficulty of a Position using Stockfish".
  // Input: for one position, the engine evaluation of each of its best moves at every search depth.
  // Values are centipawns as the engine reports them (from the side to move); mate scores are
  // converted by ChessMetrics.getCentipawnOnlyValue before they get here.
  // The paper's symbols keep their latin names: mu, md, tau, delta, nu, kappa (complexity), rho.
  class PositionDifficultyEvaluator {
    // mu(a,b) = (a-b)/(a^2+b^2), the difference the paper puts between two engine scores. Dividing by
    // the sum of squares is what dampens bad moves: when either score is large the pair contributes
    // at most about 1/|score|, so a clearly lost move cannot by itself make a position look complex.
    static mu = (a,b)=>{
      const denom = a*a + b*b;
      if (!denom) return 0;
      return (a-b)/denom;
    };

    // md(X) = sqrt(sum of mu(x_i,x_j)^2 over every pair) - the norm tau divides by. The paper sums
    // ordered pairs; counting i<j only is the same, and tau counts the products the same way.
    static normMu = (values)=>{
      let sum = 0;
      for (let i=0;i<values.length;i++)
        for (let j=i+1;j<values.length;j++) {
          const m = PositionDifficultyEvaluator.mu(values[i],values[j]);
          sum += m*m;
        }
      return Math.sqrt(sum);
    };

    /**
     * tau(X,Y) = sum of mu(x_i,x_j)*mu(y_i,y_j) / (md(X)*md(Y)), over the same moves in the same order
     * at two depths. It is 1 when the two evaluations rank the moves alike, -1 when they rank them the
     * other way round, and 0 when they are uncorrelated - or when one of them never differs, which is
     * no evidence of either sort.
     */
    static kendallTau = (x,y)=>{
      const normX = this.normMu(x);
      const normY = this.normMu(y);
      if (!normX || !normY) return 0;
      let sum = 0;
      for (let i=0;i<x.length;i++)
        for (let j=i+1;j<x.length;j++)
          sum += PositionDifficultyEvaluator.mu(x[i],x[j])*PositionDifficultyEvaluator.mu(y[i],y[j]);
      return sum/(normX*normY);
    };

    /**
     * delta(i,d) = integral from v to best of dx/(1+a*|x|), where best is the best evaluation of a depth
     * and v is the evaluation of one of its moves. So delta >= 0 and it is 0 for the best move; it grows
     * the further a move is from the best, with each extra pawn worth less than the previous one. The
     * |x| in the integrand makes the primitive cross zero in two pieces, and neither piece gets near
     * the singularity at |x| = 1/a.
     */
    static delta = (v,best,a=1)=>{
      const primitive = (x)=> x >= 0
        ? Math.log(1+a*x)/a
        : -Math.log(1-a*x)/a;
      return primitive(best) - primitive(v);
    };

    // the delta row of one depth: how far every move sits from the best move of that depth.
    static deltaList = (values,a=1)=>{
      const top = values.reduce((max,v)=>Math.max(max,v),-Infinity);
      return values.map(v=>PositionDifficultyEvaluator.delta(v,top,a));
    };

    /**
     * nu(d1,d2) = exp(-2*d1*d2/(c*(d1+d2))) = exp(-harmonicMean(d1,d2)/c), the damping factor of the
     * paper. It shrinks a swing only when both depths show a large gap - the evaluation was unsettled
     * at both - and never shrinks it when either gap is zero.
     */
    static nu = (d1,d2,c=1)=>{
      const sum = d1+d2;
      if (!sum) return 1;
      return Math.exp(-2*d1*d2/(c*sum));
    };

    // s* of a pair of neighbouring depths: sum over the moves of nu(d1,d2)*|d1-d2| - how much the
    // distance of each move to the best move changed, dampened by nu. Zero when the depths agree.
    static swing = (delta1,delta2,c=1)=>{
      let total = 0;
      for (let i=0;i<delta1.length;i++) {
        const d1 = delta1[i];
        const d2 = delta2[i];
        total += PositionDifficultyEvaluator.nu(d1,d2,c)*Math.abs(d1-d2);
      }
      return total;
    };

    /**
     * series: Map depth -> Map uci -> centipawn, built by the caller from the ceval db of an analysis
     * path. Returns null when the depths do not carry enough moves, otherwise the metric of the paper
     * and the parts it is made of:
     *  kappa = 1 - the mean tau over the pairs of neighbouring depths; 0 when the evaluations never
     *  change the rank order of the moves, 2 when a pair of depths reverses it.
     *  rho = the depth by which half of the swing has happened. The pair terms are weighted by w(d) =
     *  d/sum d so that shallow depths weigh less, a pair is labelled by its shallower depth, and the
     *  overshoot of the crossing term is spread linearly over it - the paper's "crossing depth minus
     *  psi". Without swing there is nothing to cross, and the first depth is the floor.
     *  difficulty = kappa times rho, the paper's Diff.
     * sw(m_i) is also reported per move: the sum over depths of delta(i,d) - delta(i,D), positive for
     * a move that looked bad early and turned out fine, negative for one that looks good early and
     * drops as the search settles - the trap pattern the paper points at.
     */
    static evaluate = (series,params={})=>{
      const a = params.a ?? 1;
      const c = params.c ?? 1;
      const minMoves = params.minMoves ?? 2;
      const depths = [...series.keys()]
        .filter(depth=>series.get(depth)?.size>=minMoves)
        .sort((x,y)=>x-y);
      if (depths.length<2) return null;
      // a move missing at some depth has no value to compare there.
      const moves = [...series.get(depths[0]).keys()]
        .filter(uci=>depths.every(depth=>series.get(depth).has(uci)));
      if (moves.length<minMoves) return null;
      const values = depths.map(depth=>moves.map(uci=>series.get(depth).get(uci)));
      const deltas = values.map(list=>PositionDifficultyEvaluator.deltaList(list,a));
      const tau = [];
      const swingPair = [];
      for (let i=0;i<depths.length-1;i++) {
        tau.push(PositionDifficultyEvaluator.kendallTau(values[i],values[i+1]));
        swingPair.push(PositionDifficultyEvaluator.swing(deltas[i],deltas[i+1],c));
      }
      // kappa = 1 - mean tau over the pairs.
      const complexity = 1 - tau.reduce((sum,t)=>sum+t,0)/tau.length;
      // w(d) = d/sum d, so shallow depths weigh less; a pair is labelled by its shallower depth.
      const lowerDepths = depths.slice(0,-1);
      const weightSum = lowerDepths.reduce((sum,d)=>sum+d,0);
      const terms = lowerDepths.map((d,i)=>d/weightSum*swingPair[i]);
      const totalSwing = terms.reduce((sum,t)=>sum+t,0);
      // rho = the depth where half of the weighted swing has happened.
      const half = totalSwing/2;
      let accumulated = 0;
      let effectiveDepth = depths[0];
      for (let i=0;i<terms.length;i++) {
        if (accumulated+terms[i] >= half) {
          effectiveDepth = lowerDepths[i] + (terms[i]?(half-accumulated)/terms[i]:0);
          break;
        }
        accumulated += terms[i];
      }
      const difficulty = complexity*effectiveDepth;
      // sw(m_i) - how much each move's distance to the best move changed over the depths.
      const lastDepth = deltas.length-1;
      const swingMove = deltas[0].map(()=>0);
      deltas.forEach((row,depthIndex)=>{
        row.forEach((value,moveIndex)=>{
          swingMove[moveIndex] += value - deltas[lastDepth][moveIndex];
        });
      });
      return {
        depths: depths,
        moves: moves.map((uci,index)=>({
          uci: uci,
          cp: values[lastDepth][index],
          swing: swingMove[index],
        })),
        parameters: { a: a, c: c, minMoves: minMoves },
        tau: tau,
        complexity: complexity,
        swingPair: swingPair,
        terms: terms,
        totalSwing: totalSwing,
        effectiveDepth: effectiveDepth,
        difficulty: difficulty,
      };
    };
  }
  LiChessTools.PositionDifficultyEvaluator = PositionDifficultyEvaluator;
})();

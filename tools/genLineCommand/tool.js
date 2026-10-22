(() => {
  class GenLineCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['CliCommands','ChessOps','ExportPGN','EmitRedraw','EmitCeval','ExplorerEval'];

    preferences = [
      {
        name: 'genLineCommand',
        category: 'command',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.genLineCommand': 'Command: generate lines',
        'genLineCommand.helpText': '/genline [w:<chain>[*n]] [b:<chain>[*n]] [min:N] [share:N%]\r\n  [new|tree] [depth:P] [lines:N] [retry:S] [pace:S|off]\r\n  [stop:mate,noexplorer,repeat,filterfail]\r\n  chain = common rare sharp win brilliant gambit eval\r\n  mate weighted random - the first metric with\r\n  candidates wins, then the engine line\r\n  defaults: w:brilliant,win,eval b:common*4 min:100 share:5%\r\n  depth:24 lines:200 retry:6 pace:2 new\r\n  stop:mate,noexplorer,repeat - bare /genline resumes\r\nGenerate lines automatically',
        'genLineCommand.stopTitle': 'LiChess Tools - stop generating lines',
        'genLineCommand.badTokenAnnounce': 'LiChess Tools - unknown /genline option:',
        'genLineCommand.doneAnnounce': 'LiChess Tools - generated %s lines'
      },

      'ro-RO': {
        'options.genLineCommand': 'Comand\u0103: genereaz\u0103 linii',
        'genLineCommand.helpText': '/genline [w:<chain>[*n]] [b:<chain>[*n]] [min:N] [share:N%]\r\n  [new|tree] [depth:P] [lines:N] [retry:S] [pace:S|off]\r\n  [stop:mate,noexplorer,repeat,filterfail]\r\n  chain = common rare sharp win brilliant gambit eval\r\n  mate weighted random - prima metric\u0103 cu\r\n  candida\u0163i c\u00e2\u015ftig\u0103, apoi linia din motor\r\n  implicit: w:brilliant,win,eval b:common*4 min:100 share:5%\r\n  depth:24 lines:200 retry:6 pace:2 new\r\n  stop:mate,noexplorer,repeat - doar /genline continu\u0103\r\nGenereaz\u0103 linii automat',
        'genLineCommand.stopTitle': 'LiChess Tools - opre\u015fte generarea de linii',
        'genLineCommand.badTokenAnnounce': 'LiChess Tools - op\u0163iune necunoscut\u0103 /genline:',
        'genLineCommand.doneAnnounce': 'LiChess Tools - %s linii generate'
      }
    };

    defaultStops = ['mate','noexplorer','repeat','transposition'];
    // a generated move never lands sooner than this after the previous generated move, so the
    // walk stays readable and does not hammer the Explorer / the page engine (pace: overrides it)
    minMoveMs = 2000;
    metricNames = ['common','rare','sharp','win','brilliant','gambit','eval','mate','weighted','random'];

    // The process lives only in memory on this instance - a page reload re-runs start() and drops it.
    frontier = [];
    done = [];
    generated = {};
    opts = null;
    running = false;
    paused = false;
    stopRequested = false;
    startPath = null;
    startPathFixed = null;
    startPly = null;
    originalPath = null;
    originalAutoDeeper = null;
    engineDepthSeen = 0;
    lastMoveAt = null;

    parseNumber = (value) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const m = /^(?<n>\d+(?:\.\d+)?)(?<k>k?)$/i.exec(String(value ?? '').trim());
      if (!m) return null;
      return Math.round(+m.groups.n * (m.groups.k.toLowerCase() == 'k' ? 1000 : 1));
    };

    rankClass = (rank) =>
      rank === null ? 'ceval' : rank == 5 ? 'cloud' : rank == -1 ? 'stats' : rank >= 2 ? 'best' : rank == 1 ? 'good' : 'bad';

    parseChain = (chain) => {
      const result = [];
      for (const part of chain.split(',')) {
        const m = /^(?<metric>[a-z]+)(?:\*(?<breadth>[1-9]\d*))?$/.exec(part);
        if (!m || !this.metricNames.includes(m.groups.metric)) return null;
        result.push({ metric: m.groups.metric, breadth: +(m.groups.breadth ?? 1) });
      }
      return result.length ? result : null;
    };


    applyToken = (opts, rawToken) => {
      const trans = this.lichessTools.translator;
      let token = rawToken;
      let scopes = ['w','b'];
      let m = /^(?<scope>[wb]):(?<rest>.+)$/.exec(token);
      if (m) {
        scopes = [m.groups.scope];
        token = m.groups.rest;
      }
      // by default only NEW variations count as generated moves, so the walk branches from the
      // node the user is on instead of diving down a line that is already in the tree
      const newOnlyToken = { new: true, '!tree': true, tree: false, '!new': false }[token.toLowerCase()];
      if (newOnlyToken != null) {
        for (const scope of scopes) opts.filter[scope].newOnly = newOnlyToken;
        return true;
      }
      token = token.toLowerCase();
      // only what the walk itself decides stays here - the Explorer tab, the Explorer columns and
      // filters, the engine and its depth are page settings the command never touches
      m = /^(?<key>min|share|depth|lines|retry|pace|stop|pause|resume|status|prune|tree)(?<colon>:)?(?<value>.*)$/.exec(token);
      if (!m) {
        const chain = this.parseChain(token);
        if (!chain) return false;
        for (const scope of scopes) opts.policy[scope] = chain;
        return true;
      }
      const key = m.groups.key;
      const value = m.groups.value;
      if (!m.groups.colon) {
        if (key == 'stop') { opts.halt = true; return true; }
        if (key == 'prune') { opts.prune = true; return true; }
        if (key == 'pause') { opts.pause = true; return true; }
        if (key == 'resume') { opts.resume = true; return true; }
        if (key == 'status') { opts.status = true; return true; }
        return false;
      }
      switch (key) {
        case 'min':
        case 'share': {
          // the % on share: is optional (share:5 and share:5% are the same gate)
          const num = key == 'share' ? this.parseNumber(value.replace(/%\s*$/, '')) : this.parseNumber(value);
          if (num === null) return false;
          for (const scope of scopes) opts.filter[scope][key] = num;
          return true;
        }
        case 'depth': {
          if (value.startsWith('>=')) {
            const num = +value.substr(2);
            if (!num) return false;
            for (const scope of scopes) opts.filter[scope].depthMin = num;
          } else {
            const num = this.parseNumber(value);
            if (!num) return false;
            opts.limit.depth = num;
          }
          return true;
        }
        case 'lines':
        case 'retry': {
          const num = this.parseNumber(value);
          if (!num) return false;
          opts.limit[key] = num;
          return true;
        }
        case 'tree': {
          // tree:on lets the walk reuse children already in the tree; tree:off keeps new only
          if (value == 'on') { for (const scope of scopes) opts.filter[scope].newOnly = false; return true; }
          if (value == 'off') { for (const scope of scopes) opts.filter[scope].newOnly = true; return true; }
          return false;
        }
        case 'pace': {
          // whole seconds between two generated moves; pace:off drops the cap for a fast run
          if (value == 'off' || value == 'none') { opts.limit.pace = 0; return true; }
          if (!/^\d+$/.test(value)) return false;
          opts.limit.pace = +value;
          return true;
        }
        case 'stop': {
          const allowed = ['mate','noexplorer','repeat','transposition','filterfail'];
          const list = value.split(',').filter(v=>v);
          if (!list.length || list.some(v => !allowed.includes(v))) return false;
          opts.stop = list;
          return true;
        }
        default:
          return false;
      }
    };

    parseTokens = (text) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const opts = {
        policy: { w: null, b: null },
        filter: { w: {}, b: {} },
        limit: {},
        stop: null,
        halt: false,
        prune: false,
        pause: false,
        resume: false,
        status: false
      };
      for (const token of (text || '').trim().split(/\s+/).filter(t=>t)) {
        if (!this.applyToken(opts, token)) {
          lt.announce(trans.noarg('genLineCommand.badTokenAnnounce') + ' ' + token);
          return null;
        }
      }
      if (!opts.policy.w) opts.policy.w = this.parseChain('brilliant,win,eval');
      if (!opts.policy.b) opts.policy.b = this.parseChain('common*4');
      // default: only new variations count, so generation branches at the node the user selected
      if (opts.filter.w.newOnly == null) opts.filter.w.newOnly = true;
      if (opts.filter.b.newOnly == null) opts.filter.b.newOnly = true;
      opts.limit.depth ??= 24;
      // lines is a cap, not a target: a whole repertoire walk needs a wide cap, and the depth and
      // stop reasons are what decide when a line ends
      opts.limit.lines ??= 200;
      opts.limit.retry ??= 6;
      opts.limit.pace ??= this.minMoveMs / 1000;
      opts.stop ||= [...this.defaultStops];
      return opts;
    };



    guardPasses = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess?.analysis;
      if (!analysis) return { ok:false, reason:'context' };
      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      if ($.cached('body').is('.playing') || lt.isGamePlaying()) return { ok:false, reason:'context' };
      if (showStaticAnalysis === false && !analysis?.cevalEnabled()) return { ok:false, reason:'context' };
      if (analysis.gamebookPlay?.() || analysis.practice?.running() || analysis.study?.practice || analysis.threatMode())
        return { ok:false, reason:'context' };
      if (!analysis.explorer?.allowed || !analysis.explorer?.enabled()
        || $('section.explorer-box').is('.lichessTools-hideExplorerData')) return { ok:false, reason:'explorer' };
      if (!analysis.isCevalAllowed()) return { ok:false, reason:'engine' };
      return { ok:true };
    };

    cfgDepth = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const ceval = analysis.ceval;
      if (ceval?.isInfinite || (ceval?.isDeeper?.() && !analysis.node.autoDeeper)) return 99;
      const pref = +lt.currentOptions.getValue('customEngineLevel');
      return +analysis.node.autoDeeper || pref || 0;
    };

    engineIdle = () => {
      const lt = this.lichessTools;
      const state = lt.lichess.analysis?.ceval?.state;
      return state === 0 || state === 2;
    };

    cevalAtNode = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const ceval = analysis.ceval?.curEval || analysis.ceval?.lastStarted?.steps?.at(-1)?.ceval || analysis.node.ceval;
      return ceval && ceval.fen == analysis.node.fen ? ceval : null;
    };

    teardown = async () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (analysis && this.originalPath) {
        if (analysis.path != this.originalPath) {
          analysis.userJumpIfCan(this.originalPath);
        }
        if (this.originalAutoDeeper !== undefined) {
          analysis.node.autoDeeper = this.originalAutoDeeper;
        }
      }
      this.running = false;
      this.stopRequested = false;
      this.paused = false;
      lt.emitRedraw();
    };

    readPosition = async () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const explorer = analysis.explorer;
      const opts = this.opts;
      const retryMs = (opts.limit.retry || 6) * 1000;
      const data = { fen: analysis.node.fen, current: null, total: 0, moves: [], evals: [], pvs: null, ceval: null, depth: 0, explorerOk: false, stale: false };
      let waited = 0;
      if (explorer?.enabled()) {
        await explorer.setNode();
        if (explorer.lastStream) {
          try { await explorer.lastStream.promise; } catch (err) { lt.global.console.debug('genLineCommand explorer stream', err); }
        }
        while (!this.stopRequested && explorer.loading() && waited < retryMs) {
          await lt.timeout(50);
          waited += 50;
        }
      }
      const cur = explorer?.current();
      if (cur) {
        data.current = cur;
        data.total = (cur.white || 0) + (cur.draws || 0) + (cur.black || 0);
        data.moves = (cur.moves || []).map(m => ({
          uci: m.uci,
          white: m.white || 0,
          draws: m.draws || 0,
          black: m.black || 0,
          total: (m.white || 0) + (m.draws || 0) + (m.black || 0)
        }));
      }
      data.explorerOk = !!cur;
      const cfgDepth = this.cfgDepth();
      data.depth = this.cevalAtNode()?.depth || 0;
      if (analysis.isCevalAllowed()) {
        waited = 0;
        while (!this.stopRequested && analysis.ceval?.state === 3 && waited < retryMs) {
          await lt.timeout(100);
          waited += 100;
        }
        let pushed = 0;
        while (!this.stopRequested && analysis.cevalEnabled() && cfgDepth
          && data.depth < cfgDepth && pushed < 3 && this.engineIdle()) {
          pushed++;
          if (analysis.ceval?.canGoDeeper) analysis.ceval.goDeeper();
          else analysis.ceval?.isDeeper(true);
          analysis.node.autoDeeper = cfgDepth;
          lt.analysisRedraw();
          waited = 0;
          while (!this.stopRequested && analysis.ceval?.state === 3 && waited < retryMs) {
            await lt.timeout(100);
            waited += 100;
          }
          data.depth = lt.global.Math.max(data.depth, this.cevalAtNode()?.depth || 0);
        }
      }
      const evalTool = lt.tools.ExplorerEvalTool;
      if (evalTool) {
        for (let tries = 0; tries < 2; tries++) {
          await evalTool.doEvaluation();
          if (evalTool?.cache?.[analysis.node.fen]?.moves?.length) break;
          await lt.timeout(300);
        }
        data.evals = evalTool?.cache?.[analysis.node.fen]?.moves || [];
      }
      const atNode = this.cevalAtNode();
      data.pvs = atNode?.pvs;
      data.ceval = atNode;
      this.engineDepthSeen = lt.global.Math.max(this.engineDepthSeen, data.depth || 0);
      // the reads above wait for the Explorer stream and for the engine to stop, and the page can
      // be moved meanwhile by a tab switch, an option reload or a manual jump - never rank data
      // that is not about the node we are on
      data.stale = analysis.node.fen != data.fen;
      return data;
    };

    wilson = (x, n, total) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const z = 1.96;
      return {
        center: (x+z*z/2)/(n+z*z),
        halfWidth: z/(total+z*z)*Math.sqrt(x*(n-x)/n+z*z/4)
      };
    };

    // the pacing gap between two generated moves, chunked so that /stop or pause takes effect
    // inside the gap instead of after it
    waitMs = async (ms) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      let waited = 0;
      while (waited < ms && this.running && !this.stopRequested && !this.paused) {
        const step = Math.min(100, ms - waited);
        await lt.timeout(step);
        waited += step;
      }
    };

    // only a real uci can be played: lichess has no null moves, so an entry that carries the
    // page's "--" marker, an empty field, or a fragment of a pv string would insert a broken
    // node in the tree and make every later read of that node wrong
    uciOk = (uci) => /^([a-h][1-8]){2}(p?[nqbrk])?$/.test(uci || '');

    // the first uci of an engine pv: the page engine keeps pv moves as an array, while the
    // evaluation api delivers them as one space separated string (explorerEval/tool.js:488 uses
    // .split(' ')[0] for the api and :546 uses .at(0) for ceval), and .at(0) on a string answers
    // with a single character - never a legal move
    firstUci = (pv) => {
      const moves = pv?.moves;
      if (!moves) return null;
      const uci = typeof moves == 'string' ? moves.split(' ')[0] : moves.at(0);
      return this.uciOk(uci) ? uci : null;
    };

    // userJumpIfCan moves analysis.path synchronously, but the Explorer stream and the rendered
    // node still need a few ticks. until they settle the walk would rank the node the page left
    // behind, and a move from there is not legal on the node we jumped to.
    awaitNodeRendered = async (item, jumped) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const explorer = analysis.explorer;
      if (jumped) lt.analysisRedraw();
      let waited = 0;
      while (waited < 2000 && !this.stopRequested && !this.paused) {
        const settled = analysis.path == item.path
          && analysis.node.fen == item.fen
          && analysis.node.ply == item.ply
          && (!explorer?.enabled() || !explorer.loading());
        if (settled) return true;
        await lt.timeout(50);
        waited += 50;
      }
      return analysis.path == item.path && analysis.node.fen == item.fen;
    };

    enrichMoves = async (data) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const trans = lt.translator;
      const evalTool = lt.tools.ExplorerEvalTool;
      const gambitsTool = lt.tools.ExplorerGambitsTool;
      for (const mv of data.moves) {
        if (!mv.total) continue;
        // the column's own interval: x over the position's total games (explorerEval/tool.js:232-238)
        const whiteWilly = this.wilson(mv.white, mv.total, mv.total);
        const blackWilly = this.wilson(mv.black, mv.total, mv.total);
        mv.halfWidth = whiteWilly.halfWidth + blackWilly.halfWidth;
        mv.confident = mv.halfWidth < 0.02;
        const q = 1000 / mv.total;
        mv.sharpness = LiChessTools.ChessMetrics.wdlToSharpness(mv.white*q, Math.max(mv.draws,1)*q, mv.black*q);
        mv.winMargin = Math.round(10000*(mv.white-mv.black)/mv.total)/100;
        const evalRow = data.evals.find(e => e.uci == mv.uci || (e.uci2 && e.uci2 == mv.uci));
        if (evalRow) {
          mv.cp = evalRow.cp;
          mv.mate = evalRow.mate;
          mv.rank = evalRow.rank;
          mv.evalDepth = evalRow.depth;
        }
      }
      if (this.metricsAvailable?.brilliancy && evalTool && data.current) {
        const evalBefore = evalTool.wdlToEval(data.current);
        if (evalBefore) {
          const co = await lt.chessops();
          const ch = co && LiChessTools.MoveGen.positionFromFen(data.fen, co);
          if (ch) {
            const started = lt.global.performance.now();
            for (const mv of data.moves) {
              if (lt.global.performance.now() - started > 60) continue;
              let san;
              try {
                san = co.san.makeSan(ch, co.parseUci(mv.uci));
              } catch (err) { continue; }
              if (!san || san == '--') continue;
              const evalAfter = evalTool.wdlToEval(mv);
              if (!evalAfter) continue;
              const brilliancy = evalTool.computeBrilliancy(data.fen, san, evalBefore, evalAfter, co);
              if (brilliancy?.isBrilliant) mv.brilliant = brilliancy.score ?? 1;
            }
          }
        }
      }
      if (this.metricsAvailable?.gambits && gambitsTool?.options?.enabled) {
        const dict = await gambitsTool.gambit_dict();
        const side = lt.lichess.analysis.getOrientation();
        for (const mv of data.moves) {
          const moveFen = await gambitsTool.computeFen(data.fen, mv.uci);
          if (!moveFen) continue;
          const pos = lt.getPositionFromFen(moveFen);
          const res = dict?.[side]?.get(pos);
          if (res) mv.gambit = res.total || 1;
        }
      }
    };

    rankPasses = (rank, wanted) => {
      const lt = this.lichessTools;
      if (rank === undefined) return false;
      const cls = this.rankClass(rank);
      switch (wanted) {
        case 'best': return cls == 'best' || cls == 'cloud';
        case 'good': return cls == 'good' || cls == 'best' || cls == 'cloud';
        case 'bad': return cls == 'bad' || cls == 'stats';
        default: return true;
      }
    };

    metricScore = (metric, mv, turn) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      switch (metric) {
        case 'common': return mv.total;
        case 'rare': return -mv.total;
        case 'weighted': return lt.random() * (mv.total || 1);
        case 'random': return lt.random();
        case 'sharp': return mv.confident ? mv.sharpness : null;
        case 'win': return mv.confident ? mv.winMargin * turn : null;
        case 'brilliant': return mv.brilliant;
        case 'gambit': return mv.gambit;
        case 'mate': return mv.mate ? 1000 - Math.abs(mv.mate) : null;
        case 'eval': {
          if (mv.mate) {
            const m = mv.mate * turn;
            return m > 0 ? 1e6 - Math.abs(m) : -(1e6 - Math.abs(m));
          }
          // no eval row at all is not the same as an even eval
          return mv.cp == null ? null : mv.cp * turn;
        }
        default: return null;
      }
    };


    rankMoves = (data, side, item) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const analysis = lt.lichess.analysis;
      const opts = this.opts;
      const filter = opts.filter[side] || {};
      const turn = data.fen.split(' ')[1] == 'b' ? -1 : 1;
      const inTree = analysis.visibleChildren(analysis.node).map(c=>c.uci);
      const nodeOk = !filter.min || data.total >= filter.min;
      if (nodeOk) {
        for (const entry of opts.policy[side]) {
          if (!this.metricsAvailable?.[entry.metric]) continue;
          const scored = [];
          for (const mv of data.moves) {
            if (!mv.total || !this.uciOk(mv.uci)) continue;
            if (filter.newOnly && inTree.includes(mv.uci)) continue;
            if (filter.share && 100*mv.total/(data.total||1) < filter.share) continue;
            if (filter.rank && !this.rankPasses(mv.rank, filter.rank)) continue;
            if (filter.depthMin && (mv.evalDepth ?? 0) < filter.depthMin) continue;
            const score = this.metricScore(entry.metric, mv, turn);
            if (score === null || score !== score) continue;
            scored.push({ uci: mv.uci, score, explorable: true });
          }
          if (scored.length) {
            scored.sort((a,b)=>b.score-a.score);
            return scored.slice(0, Math.max(1, entry.breadth));
          }
        }
      }
      if (opts.stop.includes('filterfail')) return [];
      const breadth = Math.max(1, opts.policy[side].at(-1)?.breadth ?? 1);
      const result = [];
      const seen = new Set();
      for (const pv of data.pvs || []) {
        const uci = this.firstUci(pv);
        if (!uci || seen.has(uci)) continue;
        seen.add(uci);
        if (filter.newOnly && inTree.includes(uci)) continue;
        result.push({ uci, score: -result.length, explorable: false });
        if (result.length >= breadth) break;
      }
      return result;
    };

    stopReason = (data, item) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const opts = this.opts;
      if (item.plyFromStart >= opts.limit.depth) return 'depth';
      if (this.done.length >= opts.limit.lines) return 'lines';
      if (opts.stop.includes('noexplorer') && !data.explorerOk) return 'noexplorer';
      if (opts.stop.includes('mate')) {
        const atNode = this.cevalAtNode();
        const mate = atNode?.mate ?? atNode?.pvs?.at(0)?.mate;
        if (mate) return 'mate';
      }
      if (opts.stop.includes('repeat')) {
        const nodes = analysis.tree.getNodeList(item.path) || [];
        const fen = analysis.node.fen;
        if (nodes.filter(n => n.fen == fen).length >= 2) return 'repeat';
      }
      if (opts.stop.includes('transposition')) {
        // LiChess Tools already knows every node that reaches this position by another
        // move order (node.transposition() answers the node itself plus every other node
        // on the same fen). When the node just reached is one of those other nodes, the
        // line is re-walking a position the tree already has, so it closes here rather
        // than duplicating it. A match on the current line is not a transposition: that
        // is just the same line seen from its own root, so a path that is a prefix of the
        // other (excludeSameLine) is ignored.
        const curnode = analysis.node;
        const samePos = curnode?.transposition?.();
        const currentPath = curnode?.path ?? analysis.path;
        if (samePos && currentPath) {
          const reachedElsewhere = samePos.some(n =>
            n !== curnode && n.path &&
            !n.path.startsWith(currentPath) && !currentPath.startsWith(n.path));
          if (reachedElsewhere) return 'transposition';
        }
      }
      return null;
    };


    // lichess does not refuse an illegal uci: it answers with the null move "--" and writes it
    // into the move list, which poisons every later read of that node. playUci also lands the
    // node asynchronously, so a move only counts once its node is in the list - and the fen is
    // re-checked at the play site, because the pacing gap or an Explorer reload can move the page
    // between ranking the candidates and playing one of them.
    playAndWait = async (mv, item) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const retryMs = (this.opts?.limit?.retry || 6) * 1000;
      // never play on a position other than the one the candidate was ranked from. a second
      // candidate of the same node means the previous move landed on the page, so the page has to
      // go back to the queued node; only a page that stayed on the same path but drifted to
      // another fen (an Explorer reload, an option auto-column) gets a short wait for it to settle.
      let waited = 0;
      if (analysis.path == item.path && analysis.node.fen != item.fen) {
        while (analysis.node.fen != item.fen && waited < 1000 && !this.stopRequested && !this.paused) {
          await lt.timeout(50);
          waited += 50;
        }
      }
      if (analysis.node.fen != item.fen) {
        analysis.userJumpIfCan(item.path);
        if (!await this.awaitNodeRendered(item, true) || analysis.node.fen != item.fen) return 'fen';
      }
      const before = analysis.node.fen;
      const beforePly = analysis.node.ply;
      if (mv.explorable && analysis.explorerMove) analysis.explorerMove(mv.uci);
      else analysis.playUci(mv.uci);
      // the node lands after the call: wait until the move list carries it
      waited = 0;
      let node = null;
      while (waited < retryMs && !this.stopRequested && !this.paused) {
        node = analysis.tree?.getNodeList?.(analysis.path)?.at(-1);
        if (node?.uci == mv.uci && node?.fen != before && (node?.ply ?? -1) > beforePly) break;
        await lt.timeout(50);
        waited += 50;
      }
      const nodeUci = analysis.node?.uci;
      if (node?.uci == mv.uci && nodeUci == mv.uci) return 'ok';
      if ((node && !this.uciOk(node.uci)) || (nodeUci && !this.uciOk(nodeUci))) return 'nullmove';
      if (analysis.node?.fen != before) return 'moved';
      return 'missing';
    };

    closeLine = (item, reason) => {
      const lt = this.lichessTools;
      if (!item.line.length) return;
      if (item.genStart >= item.line.length) return;
      const entry = {
        line: item.line,
        path: item.path,
        genStart: item.genStart,
        reason,
        index: this.done.length + 1
      };
      this.done.push(entry);
    };

    // the walk is a queue of pairs (node, move): expandNode queues the moves that apply at a node
    // - maximum the breadth of that side - without playing any of them, playQueued takes one pair,
    // brings the page to the node, makes the move, waits until the node lands, and queues that new
    // node with the same rule. A pair that fails never drops its siblings: it is queued again or
    // closed on its own, so the tree keeps every move the policy asked for.
    expandOne = async () => {
      if (!this.frontier.length) return false;
      // the queue stays in the order branches opened: expandNode puts the first ranked move at the
      // very front and the rest at the back, playQueued puts the node a move creates at the very
      // front, so the first move of a node is followed all the way to its end and only then does
      // the walk reopen the oldest open branch - the next move of the opening, not a variation
      // near the end of the line it just finished
      const item = this.frontier.shift();
      return item.uci == null ? await this.expandNode(item) : await this.playQueued(item);
    };

    // bring the page onto the queued node: userJumpIfCan moves analysis.path synchronously, but
    // the Explorer stream and the rendered node need a few ticks before the node can be read
    gotoNode = async (item) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (analysis.path != item.path || analysis.node.fen != item.fen) {
        analysis.userJumpIfCan(item.path);
        if (!await this.awaitNodeRendered(item, true)) return false;
      }
      return analysis.path == item.path && analysis.node.fen == item.fen;
    };

    // rank the queued node and queue the moves that apply there - maximum the side breadth
    expandNode = async (item) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      if (!await this.gotoNode(item)) {
        this.closeLine(item, 'jump');
        return true;
      }
      const data = await this.readPosition();
      if (data.stale) {
        item.staleRereads = (item.staleRereads || 0) + 1;
        if (item.staleRereads >= 3) {
          this.closeLine(item, 'stale');
          return true;
        }
        this.frontier.push(item);
        return true;
      }
      await this.enrichMoves(data);
      const side = analysis.node.ply % 2 ? 'b' : 'w';
      const reason = this.stopReason(data, item);
      if (reason) {
        this.closeLine(item, reason);
        return true;
      }
      const kept = this.rankMoves(data, side, item);
      if (!kept.length) {
        this.closeLine(item, 'nomoves');
        return true;
      }
      const inTree = analysis.visibleChildren(analysis.node).map(c=>c.uci);
      let head = true;
      for (const mv of kept) {
        if (!this.uciOk(mv.uci)) continue;
        const pair = {
          path: item.path,
          fen: item.fen,
          ply: item.ply,
          plyFromStart: item.plyFromStart,
          line: item.line,
          genStart: item.genStart,
          score: mv.score,
          uci: mv.uci,
          explorable: mv.explorable,
          already: inTree.includes(mv.uci)
        };
        // the first ranked move goes to the very front so its line is played to the end before
        // anything else; the remaining moves reopen as branches at the back once that line closes
        if (head) { this.frontier.unshift(pair); head = false; }
        else this.frontier.push(pair);
      }
      return true;
    };

    // play one queued pair: bring the page to the node, make the move, wait for the node to land
    playQueued = async (item) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      const paceMs = (this.opts.limit.pace ?? this.minMoveMs / 1000) * 1000;
      // a new variation never lands sooner than pace after the previous one; walking through a
      // child that is already in the tree stays free
      if (!item.already && paceMs > 0 && this.lastMoveAt != null) {
        const due = this.lastMoveAt + paceMs - lt.global.performance.now();
        if (due > 0) await this.waitMs(due);
      }
      if (this.stopRequested || this.paused || !this.running) {
        this.frontier.push(item);
        return false;
      }
      if (!await this.gotoNode(item)) {
        this.closeLine(item, 'jump');
        return true;
      }
      const outcome = await this.playAndWait({ uci: item.uci, explorable: item.explorable }, item);
      if (outcome == 'fen' || outcome == 'moved') {
        // the page is not on the node of this pair - playing here would write the null move "--"
        // into the tree, so the pair is queued again and only after three attempts the line closes
        item.playDrifts = (item.playDrifts || 0) + 1;
        if (item.playDrifts >= 3) {
          this.closeLine(item, 'fen');
          return true;
        }
        this.frontier.push(item);
        return true;
      }
      if (outcome != 'ok') {
        this.stopRequested = true;
        this.frontier.push(item);
        return false;
      }
      this.generated[analysis.path] = true;
      if (!item.already) this.lastMoveAt = lt.global.performance.now();
      // the node the move created goes to the very front so its own moves get queued and the line
      // keeps descending; the branches this node did not take are already queued at the back
      this.frontier.unshift({
        path: analysis.path,
        fen: analysis.node.fen,
        ply: analysis.node.ply,
        plyFromStart: item.plyFromStart + 1,
        line: [...item.line, item.uci],
        genStart: item.already ? item.line.length : item.genStart,
        score: item.score,
        uci: null
      });
      return true;
    };


    probeMetrics = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const evalValue = lt.currentOptions.getValue('explorerEval') || '';
      const hidden = lt.isOptionSet(evalValue,'hidden');
      const on = (name)=> !hidden && lt.isOptionSet(evalValue, name);
      const engineOn = lt.lichess.analysis?.cevalEnabled();
      const available = {
        common: true,
        rare: true,
        weighted: true,
        random: true,
        win: true,
        sharp: on('sharpness'),
        brilliant: on('brilliancy'),
        gambit: !!lt.tools.ExplorerGambitsTool?.options?.enabled,
        eval: on('ceval') || on('db') || on('lichess') || on('stats') || engineOn,
        mate: on('ceval') || on('db') || on('lichess') || on('stats') || engineOn
      };
      this.metricsAvailable = available;
    };

    // the run is pinned to the node the user selected: a tab switch or an auto-columns reload may
    // move the page, so the walk jumps back to the pinned node and refuses if it cannot get there
    seedFrontier = (startPath) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (startPath && analysis.path != startPath) {
        analysis.userJumpIfCan(startPath);
        if (analysis.path != startPath) {
          this.frontier = [];
          return false;
        }
      }
      this.startPath = analysis.path;
      this.startPly = analysis.node.ply;
      this.frontier = [{
        path: analysis.path,
        ply: analysis.node.ply,
        plyFromStart: 0,
        fen: analysis.node.fen,
        line: [],
        genStart: 0,
        score: 0,
        uci: null
      }];
      return true;
    };

    drain = async () => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const trans = lt.translator;
      const startedAt = lt.global.performance.now();
      // there is no wall-clock budget for a run any more: a slice only bounds the work one pump
      // turn does, so /stop and the stop button still take effect inside one batch
      const budgetMs = 2500;
      while (true) {
        if (this.restartRequested) {
          this.restartRequested = false;
          this.done = [];
          if (!this.seedFrontier(this.startPathFixed)) break;
        }
        if (!this.running || !this.frontier.length) break;
        const guard = this.guardPasses();
        if (!guard.ok) {
          this.running = false;
          break;
        }
        if (this.paused) {
          break;
        }
        if (this.stopRequested) {
          break;
        }
        let cont = true;
        do {
          cont = await this.expandOne();
        } while (cont && this.frontier.length && lt.global.performance.now() - startedAt < budgetMs);
        await lt.timeout(0);
        if (lt.global.performance.now() - startedAt >= budgetMs) continue;
      }
    };


    finish = async () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      lt.announce(trans.pluralSame('genLineCommand.doneAnnounce', this.done.length));
    };

    pruneLines = async () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      if (analysis?.study) return;
      if (!this.done.length) return;
      try {
        const rootPath = analysis.tree?.root?.path ?? '';
        const pgn = await lt.exportPgn(rootPath, { separateLines:true, print:true });
        if (!pgn) throw 'no pgn';
        const strip = (s) => s.replace(/\{[^}]*\}/g,'').replace(/\[[^\]]*\]/g,'').replace(/\d+\.(?:\.\.)?\s*/g,' ').replace(/\s+/g,' ').trim();
        const tails = this.done.map(e => {
          const nodes = analysis.tree.getNodeList(e.path) || [];
          return strip(nodes.slice(e.genStart).map(n => n.san).filter(s=>s).join(' '));
        }).filter(t=>t);
        const parts = pgn.split(/\r\n\r\n/);
        const keep = parts.filter(p => {
          const clean = strip(p);
          return !clean || !tails.some(t => clean.endsWith(t));
        });
        if (keep.length >= parts.length) {
          return;
        }
        analysis.changePgn(keep.join('\r\n\r\n'), false);
        analysis.explorer.reload();
        lt.analysisRedraw();
        this.done = [];
        this.frontier = [];
      } catch (err) {
        lt.global.console.warn('genLineCommand prune', err);
      }
    };


    pump = async () => {
      if (!this.running) return;
      await this.drain();
      await this.finish();
      await this.teardown();
    };

    process = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!this.options?.enabled) return;
      // the stop button lives in the analyse controls bar, not in the Explorer box: the Explorer may
      // be closed while lines are still generating (anchor pattern mobileExperience/tool.js:479-487)
      const container = $('div.analyse__controls:not(.lichessTools-liveStatus)').eq(0);
      if (!container.length) return;
      let button = $('button.lichessTools-genLineCommand', container);
      // the button is only the stop affordance, and only while a run is on the board: once the run
      // is stopped the button goes away, and the pending queue is resumed with bare /genline
      if (button.length) {
        if (this.running) button.toggleClassSafe('active', true);
        else button.remove();
        return;
      }
      if (!this.running) return;
      const anchor = container.children('button[data-act]:not([data-act="menu"])').last();
      button = $('<button class="fbt">')
        .addClass('lichessTools-genLineCommand')
        .attr('title', trans.noarg('genLineCommand.stopTitle'))
        .attr('data-icon', lt.icon.Cancel)
        .on('click', ev => {
          ev.preventDefault();
          this.stopRequested = true;
          lt.emitRedraw();
        });
      if (anchor.length) button.insertAfter(anchor);
      else button.appendTo(container);
    };
    processDebounced = this.lichessTools.debounce(this.process, 200);

    runCommand = async (text) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lt.lichess?.analysis;
      if (!analysis) return;
      const fullText = (text || '').trim();
      const opts = this.parseTokens(fullText);
      if (!opts) return;
      const userTokens = (text || '').trim().split(/\s+/).filter(t=>t).length;
      if (opts.status) {
        return;
      }
      if (opts.prune) {
        await this.pruneLines();
        return;
      }
      if (opts.halt) {
        if (this.running) {
          this.stopRequested = true;
          lt.emitRedraw();
        } else {
          this.paused = true;
        }
        return;
      }
      if (opts.pause) {
        if (this.running) {
          this.paused = true;
          lt.emitRedraw();
        }
        return;
      }
      if (opts.resume || !userTokens) {
        if (this.frontier.length) {
          this.paused = false;
          if (this.running) return;
          this.running = true;
          await this.pump();
          return;
        }
        this.opts = null;
      }
      if (this.running) {
        this.opts = opts;
        this.restartRequested = true;
        return;
      }
      const guard = this.guardPasses();
      if (!guard.ok) return;
      this.opts = opts;
      this.frontier = [];
      this.done = [];
      this.generated = {};
      this.engineDepthSeen = 0;
      this.lastMoveAt = null;
      this.originalPath = analysis.path;
      this.startPathFixed = analysis.path;
      this.originalAutoDeeper = analysis.node.autoDeeper;
      this.probeMetrics();
      this.startPly = analysis.node.ply;
      if (!this.seedFrontier(this.startPathFixed)) return;
      this.running = true;
      await this.pump();
    };


    metricsAvailable = null;
    restartRequested = false;

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('genLineCommand');
      this.options = { enabled: !!value };
      this.logOption('Command - generate lines', value);
      // the process is in memory only - a reload re-runs start() and forgets the queue
      this.frontier = [];
      this.done = [];
      this.generated = {};
      this.opts = null;
      this.running = false;
      this.paused = false;
      this.stopRequested = false;
      this.restartRequested = false;
      this.engineDepthSeen = 0;
      this.lastMoveAt = null;
      this.metricsAvailable = null;
      this.startPath = null;
      this.startPathFixed = null;
      this.startPly = null;
      this.originalPath = null;
      this.originalAutoDeeper = null;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      lt.pubsub.off('lichessTools.redraw', this.processDebounced);
      $('button.lichessTools-genLineCommand').remove();
      if (!value || !analysis) {
        lt.unregisterCommand && lt.unregisterCommand('genLineCommand');
        return;
      }
      lt.pubsub.on('lichessTools.redraw', this.processDebounced);
      lt.registerCommand && lt.registerCommand('genLineCommand', {
        handle: (val) => {
          let m = /^\s*genline\b/.exec(val);
          if (m) {
            const rest = val.substr(m[0].length);
            // the walk must not be awaited here: cliCommands awaits handle, and while it is
            // suspended the page's own Enter handler already answered the input with "unknown
            // command". defer like readGameCommand/tool.js:158 so handle stays synchronous.
            lt.global.setTimeout(()=>this.runCommand(rest), 0);
            return true;
          }
          // bare /stop - same shape pieceValueCommand/tool.js:264 uses; it must stay falsy so the
          // cliCommands/tool.js:44 chain keeps iterating to the other commands
          m = /^\s*stop\b/.exec(val);
          if (m) {
            if (this.running) {
              this.stopRequested = true;
            } else if (this.frontier.length) {
              this.paused = true;
            }
          }
        },
        getHelp: () => trans.noarg('genLineCommand.helpText')
      });
    }

  }
  LiChessTools.Tools.GenLineCommand = GenLineCommandTool;
})();



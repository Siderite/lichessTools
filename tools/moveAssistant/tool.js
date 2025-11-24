(() => {
  class MoveAssistantTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'Stockfish'];

    preferences = [
      {
        name: 'moveAssistant',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['dests', 'squares', 'pawns', 'moves'],
        defaultValue: 'dests,squares,pawns,moves'
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.moveAssistant': 'Move assistant',
        'assistantButtonTitle': 'LiChess Tools - move evaluation',
        'moveAssistant.dests': 'Move destinations',
        'moveAssistant.squares': 'Squares',
        'moveAssistant.pawns': 'Pawns',
        'moveAssistant.moves': 'Moves'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.moveAssistant': 'Asistent mut\u0103ri',
        'assistantButtonTitle': 'LiChess Tools - evaluarea mut\u0103rilor',
        'moveAssistant.dests': 'Destina\u0163ii mut\u0103ri',
        'moveAssistant.squares': 'P\u0103trate tabl\u0103',
        'moveAssistant.pawns': 'Pioni',
        'moveAssistant.moves': 'Mut\u0103ri'
      }
    }

    evaluate = async () => {
      if (this.inEvaluate) return;
      try {
        this.inEvaluate=true;
        await this.evaluateDests();
        await this.evaluatePawns();
        await this.evaluateSquares();
        await this.evaluateMoves();
      } finally {
        this.inEvaluate=false;
      };
    };

    getWeakSquares = (board,isWhite) => {
      const lt = this.lichessTools;
      const result = [];
      const pawn = isWhite ? 'P' : 'p';
      const opponentPawn = isWhite ? 'p' : 'P';
      const dy = isWhite ? -1 : 1;
      for (let x=0; x<8; x++) {
        const candidates = [];
        const ys = isWhite ? lt.range(5,0) : lt.range(2,7);
        for (const y of ys) {
          const p = board[y][x];
          if (!p) {
            if (board[y-dy][x] == pawn) {
              candidates.push(y);
            } else
            if (board[y+dy]?.[x+1] == opponentPawn || board[y+dy]?.[x-1] == opponentPawn) {
              candidates.push(y);
            }
          }
        }
        for (const c of candidates) {
          let weak = true;
          const ays = isWhite ? lt.range(c+1,6) : lt.range(c-1,1);
          for (const y of ays) {
            if (board[y][x-1] == pawn || board[y][x+1] == pawn) {
              weak = false;
              break;
            }
          }
          if (weak) result.push({ x:x, y:c });
        }
      }
      return result;
    };

    getPawns = (board,isWhite) => {
      const lt = this.lichessTools;
      const pawn = isWhite ? 'P' : 'p';
      const myPawns = [];
      const theirPawns = [];
      for (let x=0; x<8; x++) {
        let empty = true;
        for (let y=0; y<8; y++) {
          const p = board[y][x];
          if (p?.toLowerCase() == 'p') {
            if (p == pawn) {
              myPawns.push({x,y});
            } else {
              theirPawns.push({x,y});
            }
          }
        }
      }
      let files = lt.range(0,7).filter(x=>myPawns.find(p=>p.x==x));
      files.filter(f=>!files.includes(f-1) && !files.includes(f+1))
           .forEach(f=>myPawns.filter(p=>p.x==f).forEach(p=>p.isolated=true));

      myPawns
        .filter(p=>p.x>1 && p.x<6&& (isWhite||p.y<6) && (!isWhite||p.y>1))
        .forEach(p=>{
          let surroundingPawns=[];
          if (!files.includes(p.x-1) && !files.includes(p.x+2)) {
            surroundingPawns = myPawns.filter(mp=>mp!=p && mp.x==p.x+1);
          } else
          if (!files.includes(p.x+1) && !files.includes(p.x-2)) {
            surroundingPawns = myPawns.filter(mp=>mp!=p && mp.x==p.x-1);
          }
          if (surroundingPawns.length!=1) return;
          const op = surroundingPawns[0];
          if (op.x<=1 || op.x>=6 || op.y!=p.y) return;
          p.hanging = true;
        });

      myPawns.forEach(p=>{
        const dy = isWhite ? -1 : 1;
        if (board[p.y+dy][p.x]) return;
        const ys = isWhite ? lt.range(p.y,7) : lt.range(p.y,1);
        if (myPawns.find(mp=>ys.includes(mp.y) && ((mp.x==p.x+1)||(mp.x==p.x-1)))) return;
        if (theirPawns.find(mp=>mp.y==p.y+dy*2 && ((mp.x==p.x+1)||(mp.x==p.x-1)))) p.backward = true;
      });

      return myPawns;
    };

    getPawnBreaks = (board,isWhite) => {
      const lt = this.lichessTools;
      const pawn = isWhite ? 'P' : 'p';
      const myPawns = [];
      const theirPawns = [];
      for (let x=0; x<8; x++) {
        let empty = true;
        for (let y=0; y<8; y++) {
          const p = board[y][x];
          if (p?.toLowerCase() == 'p') {
            if (p == pawn) {
              myPawns.push({x,y});
            } else {
              theirPawns.push({x,y});
            }
          }
        }
      }
      myPawns.forEach(p=>{
        const dests = [];
        const dy = isWhite ? -1 : 1;
        if (!board[p.y+dy][p.x]) {
          dests.push({x:p.x, y:p.y+dy});
          if (p.y==(isWhite?6:1) && !board[p.y+dy*2][p.x]) dests.push({x:p.x, y:p.y+dy*2});
        }
        for (const dest of dests) {
          if ([-1,1].find(dx=>myPawns.find(mp=>mp.x==dest.x+dx && mp.y==dest.y) && theirPawns.find(tp=>tp.x==dest.x+dx && tp.y==dest.y+dy))) {
            (p.breaks||=[]).push(dest);
          }
        }
      });

      return myPawns.filter(p=>p.breaks?.length);
    };

    addArrow = (x1,y1,x2,y2, options) => {
      const lt = this.lichessTools;
      const cg = lt.lichess?.analysis?.chessground;
      if (!cg) return;

      const orig = this.getCgKey(x1,y1);
      const dest = this.getCgKey(x2,y2);
      const drawable = cg.state?.drawable;
      if (drawable?.shapes?.find(s=>s.orig==orig && s.dest == dest)) return;

      const shape = {
        orig: orig,
        dest: dest,
        brush: 'white',
        ...options
      };
      const shapes = (drawable.shapes ||= []);
      shapes.push(shape);
      this.processHighlights();
    };

    clearArrows = (source) => {
      const lt = this.lichessTools;
      const cg = lt.lichess?.analysis?.chessground;
      const shapes = cg?.state?.drawable?.shapes;
      if (!shapes?.length) return;
      lt.arrayRemoveAll(shapes,s=>s.source == source);
    };

    highlight = (x,y, className) => {
      const lt = this.lichessTools;
      const cg = lt.lichess?.analysis?.chessground;
      if (!cg) return;
      const squareMap = (cg.state.highlight.custom ||= new Map());
      const cgKey = this.getCgKey(x,y);
      if (className) {
        squareMap.set(cgKey,className);
      } else {
        squareMap.delete(cgKey);
      }
      this.processHighlights();
    };

    clearHighlight = (className) => {
      const lt = this.lichessTools;
      const cg = lt.lichess?.analysis?.chessground;
      if (!cg) return;
      const squareMap = (cg.state.highlight.custom ||= new Map());
      for (const [k,v] of squareMap.entries()) {
        if (v == className) squareMap.delete(k);
      }
      this.processHighlights();
    };

    processHighlightsDirect = ()=>{
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      const cg = analysis?.chessground;
      if (!cg) return;

      const checkSquares = ()=>{
        const squareMap = cg.state?.highlight?.custom;
        if (!squareMap) return;
        let json = null;
        if (analysis.node.fen == this._lastFen && squareMap.size == this._lastSize) {
          json = lt.global.JSON.stringify([...squareMap]);
          if (json == this._lastJson) return;
        }
        json ||= lt.global.JSON.stringify([...squareMap]);
        this._lastJson = json;
        this._lastSize = squareMap.size;
        this._lastFen = analysis.node.fen;
        return true;
      };

      const checkShapes = ()=>{
        const shapes = cg.state?.drawable?.shapes;
        if (!shapes) return;
        let json = null;
        if (analysis.node.fen == this._lastShapeFen && shapes.length == this._lastShapeSize) {
          json = lt.global.JSON.stringify(shapes);
          if (json == this._lastShapeJson) return;
        }
        json ||= lt.global.JSON.stringify(shapes);
        this._lastShapeJson = json;
        this._lastShapeSize = shapes.length;
        this._lastShapeFen = analysis.node.fen;
        return true;
      };

      if (checkSquares() || checkShapes()) {
        cg.redrawAll();
        this.evaluatePawns(); // remove the flicker
      }
    };
    processHighlights = this.lichessTools.debounce(this.processHighlightsDirect,50);

    getCgKey = (x,y) => String.fromCharCode(97 + x) + String.fromCharCode(56 - y);

    evaluateSquares = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!this.isEnabled) return;
      if (!this.options.squares) return;
      const isInteractiveOrPractice = !!(analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice);
      if (isInteractiveOrPractice) return;
      if (!analysis.isCevalAllowed()) return;
      if (lt.isGamePlaying()) return;

      const board = lt.getBoardFromFen(analysis.node.fen);
      const isWhite = analysis.getOrientation() != 'black';

      this.clearHighlight('lichessTools-weakSquare');
      this.getWeakSquares(board,isWhite)
        .forEach(r=>this.highlight(r.x,r.y,'lichessTools-weakSquare'));
      this.clearHighlight('lichessTools-weakSquareOpponent');
      this.getWeakSquares(board,!isWhite)
        .forEach(r=>this.highlight(r.x,r.y,'lichessTools-weakSquareOpponent'));
    };

    evaluatePawns = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;

      if (!this.isEnabled) return;
      if (!this.options.pawns) return;
      const isInteractiveOrPractice = !!(analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice);
      if (isInteractiveOrPractice) return;
      if (!analysis.isCevalAllowed()) return;
      if (lt.isGamePlaying()) return;

      const board = lt.getBoardFromFen(analysis.node.fen);
      let isWhite = analysis.getOrientation() != 'black';

      const pieces = $('.cg-wrap cg-board piece.pawn');
      this.getPawns(board,isWhite)
        .forEach(r=>{
          const cgKey = this.getCgKey(r.x,r.y);
          pieces
            .filter((i,e)=>e.cgKey == cgKey)
            .toggleClassSafe('lichessTools-backwardPawn',!!r.backward)
            .toggleClassSafe('lichessTools-isolatedPawn',!!r.isolated)
            .toggleClassSafe('lichessTools-hangingPawn',!!r.hanging);
        });
      this.getPawns(board,!isWhite)
        .forEach(r=>{
          const cgKey = this.getCgKey(r.x,r.y);
          pieces
            .filter((i,e)=>e.cgKey == cgKey)
            .toggleClassSafe('lichessTools-backwardPawnOpponent',!!r.backward)
            .toggleClassSafe('lichessTools-isolatedPawnOpponent',!!r.isolated)
            .toggleClassSafe('lichessTools-hangingPawnOpponent',!!r.hanging);
        });
    };

    evaluateMoves = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;

      if (!this.isEnabled) return;
      if (!this.options.moves) return;
      const isInteractiveOrPractice = !!(analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice);
      if (isInteractiveOrPractice) return;
      if (!analysis.isCevalAllowed()) return;
      if (lt.isGamePlaying()) return;

      const board = lt.getBoardFromFen(analysis.node.fen);

      this.clearArrows('moveAssistant');
      this.getPawnBreaks(board,true)
        .concat(this.getPawnBreaks(board,false))
        .forEach(r=>{
          r.breaks.forEach(b=>{
            this.addArrow(r.x,r.y,b.x,b.y,{
              brush: 'purple',
              modifiers: { lineWidth:5, hilite: '#ffff00' },
              below: true,
              source: 'moveAssistant'
            });
          });
        });
    };

    evaluateDests = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;

      const selected = analysis.chessground?.state?.selected;
      const dests = selected
        ? analysis.chessground?.state?.movable?.dests?.get(selected)
        : null;
      const isInteractiveOrPractice = !!(analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice);
      const isActive = !!(this.options.dests
        && lt.global.SharedArrayBuffer
        && this.isEnabled
        && selected
        && dests?.length
        && !isInteractiveOrPractice
      );
      $('main.analyse div.cg-wrap').toggleClassSafe('lichessTools-moveAssistant', isActive);
      $('div.ceval button.lichessTools-moveAssistant')
        .toggleClassSafe('lichessTools-enabled', !!this.isEnabled)
        .toggleClassSafe('lichessTools-hideMoveAssistant',!!isInteractiveOrPractice);
      if (!isActive) {
        if (this._evaluating) {
          this._evaluating = false;
          this._fen = null;
          this.clearSquares(true);
          await this._sf?.stop();
        }
        return;
      }
      if (!this._sf) {
        const sf = await lt.stockfish.load();
        if (!sf) return;
        sf.setMultiPv(256);
        sf.setTime(90000);
        sf.on('info', this.getInfo);
        this._sf = sf;
      }
      if (!this._evaluating) {
        this._eval = {};
        this._wdl = {};
        this._evaluating = true;
        this._fen = analysis.node.fen;
        this._sf.setPosition(this._fen);
        this._sf.start();
      }
      if (this._fen != analysis.node.fen) {
        this._eval = {};
        this._wdl = {};
        this._fen = analysis.node.fen;
        this._sf.setPosition(this._fen);
      }
      this.refreshSquares();
    };

    _squares = {};
    getSquare = (e, side, isBlack) => {
      if (e.cgKey) return e.cgKey;
      const lt = this.lichessTools;
      const $ = lt.$;
      const matrix = $(e).css('transform');
      if (!matrix) return;
      const key = (isBlack ? 'b' : 'w') + side + matrix;
      let dest = this._squares[key];
      if (dest) return dest;
      const m = /(?<x>\d+(\.\d+)?), (?<y>\d+(\.\d+)?)\)/.exec(matrix);
      if (!m) return;
      const x = Math.floor(+(m.groups.x) * 8 / side);
      const y = Math.floor(+(m.groups.y) * 8 / side);
      const rank = isBlack ? y : 7 - y;
      const file = isBlack ? 7 - x : x;
      dest = String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
      this._squares[key] = dest;
      return dest;
    };

    refreshSquares = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const selected = analysis.chessground?.state?.selected;

      let minCp = 100000;
      let maxCp = -100000;
      Object.keys(this._eval).forEach(k => {
        const cp = this._eval[k];
        if (cp > maxCp) maxCp = cp;
        if (cp < minCp) minCp = cp;
      });

      const side = $('main.analyse div.main-board cg-board').width();
      const isBlack = lichess.analysis.getOrientation() == 'black';
      $('square.move-dest').each((i, e) => {
        const dest = this.getSquare(e, side, isBlack);
        const uci = selected + dest;
        const cp = this._eval[uci];
        if (cp === undefined) {
          return;
        }
        const qPerc = minCp == maxCp ? 1 : (cp - minCp) / (maxCp - minCp);
        const delta = maxCp - cp;
        const deltaColor = lt.getGradientColor(delta, [{ q: 0, color: '#00FF00' }, { q: 100, color: '#FFFF00' }, { q: 200, color: '#FF8000' }, { q: 300, color: '#FF0000' }]);
        const percColor = lt.getGradientColor(qPerc, [{ q: 0, color: '#FF0000' }, { q: 0.5, color: '#FFFF00' }, { q: 1, color: '#00FF00' }]);
        const gradientColor = lt.getGradientColor(0.66, [{ q: 0, color: percColor }, { q: 1, color: '#20202040' }]);
        $(e)
          .css('background', 'radial-gradient(' + gradientColor + ' 19%, rgba(0, 0, 0, 0) 20%)')
          .css('border-color', deltaColor);
        const wdl = this._wdl[uci];
        if (wdl) {
          let bar = $(e).find('div.lichessTools-wdl');
          if (!bar.length) {
            bar = $('<div class="lichessTools-wdl">')
              .appendTo(e);
          }
          bar
            .css('--deg', analysis.turnColor() == analysis.getOrientation() ? '0deg' : '180deg')
            .css('--w', Math.round(100 * wdl.w / wdl.total) + '%')
            .css('--d', Math.round(100 * wdl.d / wdl.total) + '%')
            .css('--l', Math.round(100 * wdl.l / wdl.total) + '%');
        }
      });
    };

    _eval = {};
    _wdl = {};
    getInfo = (info) => {
      const lt = this.lichessTools;
      const uci = info.pv?.at(0);
      if (!uci || (info.cp===undefined && info.mate===undefined)) return;
      if (lt.debug) {
        const depth = +(info.depth?.at(0));
        const seldepth = +(info.seldepth?.at(0));
        if (depth == 1 && this._prevDepth > 1) this._prevDepth = null;
        if (!this._prevDepth || depth > this._prevDepth) {
          this._prevDepth = depth;
          lt.global.console.debug('Depth:', depth + '/' + seldepth);
        }
      }
      const cp = lt.getCentipawns(info);
      this._eval[uci] = cp;
      let wdl = info.wdl;
      if (wdl?.length == 3) {
        wdl = { w: +wdl[0], d: +wdl[1], l: +wdl[2] };
        wdl.total = wdl.w + wdl.d + wdl.l;
        this._wdl[uci] = wdl;
      }
    };

    clearSquares = (onlyStockfish) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('main.analyse div.cg-wrap').removeClass('lichessTools-moveAssistant');
      $('square.move-dest')
        .css('background', '')
        .css('border-color', '');
      $('div.lichessTools-wdl').remove();
      if (!onlyStockfish) {
        this._lastJson = null;
        this._lastSize = null;
        this._lastShapeJson = null;
        this._lastShapeSize = null;
        this.clearArrows('moveAssistant');
        this.processHighlights();
        ['weakSquare','backwardPawn','isolatedPawn','hangingPawn'].forEach(c=>{
          [c,c+'Opponent'].forEach(c2=>{
            $('.lichessTools-'+c2).removeClass('lichessTools-'+c2);
          });
        });
      }
    };

    setControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let container = $('div.analyse__tools div.ceval');
      if (container.length || $('.action-menu').length) {
        $('div.lichessTools-moveListOptions-header').remove();
      } else {
        container = $('div.lichessTools-moveListOptions-header');
        if (!container.length) {
          container = $('<div class="lichessTools-moveListOptions-header">')
            .prependTo('div.analyse__tools');
        }
      }
      let button = $('button.lichessTools-moveAssistant');
      if (!this.options.isSet || lt.isGamePlaying()) {
        button.remove();
        return;
      }
      if (!button.length) {
        button = $('<button type="button" class="lichessTools-moveAssistant">')
          .attr('title', trans.noarg('assistantButtonTitle'))
          .attr('data-icon', lt.icon.Eye)
          .on('click', ev => {
            ev.preventDefault();
            this.isEnabled = !this.isEnabled;
            button.toggleClass('lichessTools-enabled', !!this.isEnabled);
            if (!this.isEnabled) this.clearSquares();
          });
        const anchor = $('div.ceval button.settings-gear')[0];
        if (anchor) {
          button.insertBefore(anchor);
        } else {
          container.prepend(button);
        }
      }
    };

    get isEnabled() {
      if (this._isEnabled !== undefined) return this._isEnabled;
      const lt = this.lichessTools;
      this._isEnabled = lt.storage.get('LichessTools.moveAssistant');
      return this._isEnabled;
    }

    set isEnabled(value) {
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.moveAssistant', value);
      this._isEnabled = value;
      if (!value) this._sf?.destroy();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('moveAssistant');
      this.logOption('Move assistant', value);
      this.options = { 
        dests: lt.isOptionSet(value,'dests'),
        squares: lt.isOptionSet(value,'squares'),
        pawns: lt.isOptionSet(value,'pawns'),
        moves: lt.isOptionSet(value,'moves'),
        get isSet() { return this.dests || this.squares || this.pawns || this.moves }
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      this.clearSquares();
      lt.global.clearInterval(this.interval);
      this.setControls();
      lt.pubsub.off('lichessTools.redraw', this.setControls);
      if (!value) return;
      this.interval = lt.global.setInterval(this.evaluate, 1000);
      lt.pubsub.on('lichessTools.redraw', this.setControls);
    }

  }
  LiChessTools.Tools.MoveAssistant = MoveAssistantTool;
})();

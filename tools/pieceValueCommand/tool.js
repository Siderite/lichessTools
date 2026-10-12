(() => {
  class PieceValueCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'CliCommands', 'Stockfish'];

    preferences = [
      {
        name: 'pieceValueCommand',
        category: 'command',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.pieceValueCommand': 'Command: show piece values for position',
        'pieceValueCommand.helpText': '/piecevalue [depth=20] [c] ...ontinuous\r\n/stop Stop execution\r\nShow piece values for position'
      },
      'ro-RO': {
        'options.pieceValueCommand': 'Comand\u0103: arat\u0103 valorile pieselor pentru pozi\u0163ie',
        'pieceValueCommand.helpText': '/piecevalue [ad\u00e2ncime=20] [c] ...ontinuu\r\n/stop Opre\u015fte execu\u0163ia\r\nArat\u0103 valorile pieselor pentru pozi\u0163ie'
      }
    };

    getEngine = async ()=>{
      const lt = this.lichessTools;
      while (this.sfLoading) {
        await lt.timeout(100);
      }
      if (this.sf) return this.sf;
      try{
        this.sfLoading = true;
        const sf = await lt.stockfish.load(false);
        if (!sf) throw new Error('Could not load Stockfish!');
        sf.setMultiPv(1);
        sf.on('info', i => { 
          if (i.cp === undefined && i.mate === undefined) return;
          this.lastInfo = i;
          this.onInfo(i);
        });
        sf.on('bestmove', i => { this.info = this.lastInfo; });
        sf.on('error',e=>{ this.error = e||'error'; });
        this.sf=sf;
        return sf;
      } finally {
        this.sfLoading = false;
      }
    };

    getEval = async (fen, sf, depth)=>{
      const lt = this.lichessTools;
      await sf.stop();
      sf.setDepth(depth);
      sf.setPosition(fen);
      this.info=null;
      this.error=null;
      sf.start();
      while (!this.info) {
        if (this.error) {
          this.lastProcessedFen = null;
          throw this.error;
        }
        await lt.timeout(100);
      }
      await sf.stop();
      const turn = fen.includes(' b ') ? -1 : 1;
      const result = LiChessTools.ChessMetrics.getCentipawnOnlyValue(this.info) * turn;
      this.info=null;
      this.lastInfo=null;
      return result;
    };

    invalidBecauseCheck = (board, isBlackTurn) => {
      const turnColor = isBlackTurn ? 'black' : 'white';
      const targetKingColor = isBlackTurn ? 'white' : 'black';
      const rookDirections = [[-1,0],[1,0],[0,-1],[0,1]];
      const bishopDirections = [[-1,-1],[1,1],[1,-1],[-1,1]];
      for (let j=0; j<8; j++) {
        for (let i=0; i<8; i++) {
          const piece = board.get(i + (7 - j) * 8);
          if (!piece || piece.color !== turnColor) continue;
          let directions;
          switch(piece.role) {
            case 'queen': directions = rookDirections.concat(bishopDirections); break;
            case 'rook': directions = rookDirections; break;
            case 'bishop': directions = bishopDirections; break;
            default: continue;
          }
          for (const direction of directions) {
            let x = i, y = j;
            while (true) {
              x += direction[0];
              y += direction[1];
              if (x<0 || x>7 || y<0 || y>7) break;
              const other = board.get(LiChessTools.MoveGen.square(x, y));
              if (!other) continue;
              if (other.color !== targetKingColor || other.role !== 'king') break;
              return true;
            }
          }
        }
      }
    };

    showPieceValue = async (depth, continuous)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!$('.cg-wrap .spinner').length) {
        $('.cg-wrap').append(lt.spinnerHtml);
      }
      let clearValues = true;
      if (this.running) return;
      try {
        this.running = true;
        const sf=await this.getEngine();
        const fen = analysis.node.fen;
        const splits = fen.split(/\s+/);
        if (this.lastProcessedFen && this.lastProcessedFen != fen) {
          return;
        }
        this.lastProcessedFen = fen;
        const board = lt.getBoardFromFen(fen);
        if (!board) {
          clearValues = false;
          return;
        }
        const pieces = $('cg-container piece:not([data-eval]):not(.ghost)').get();
        if (!pieces.length) {
          clearValues = false;
          return;
        }
        lt.arrayShuffle(pieces);
        const depths = depth>25 ? [14,depth] : [depth];
        for (const currentDepth of depths) {
          const baseEval = await this.getEval(fen, sf, currentDepth);
          for (const e of pieces) {
            if (analysis.node.fen != fen || this.stopRequested) {
              return;
            }
            const key = e.cgKey;
            if (!key) continue;
            const x = key.charCodeAt(0)-97;
            const y = 56-key.charCodeAt(1);
            const sq = LiChessTools.MoveGen.square(x, y);
            const piece = board.get(sq);
            if (!piece || piece.role === 'king') {
              continue;
            }
            const roleLetter = LiChessTools.ChessMetrics.ROLE_LETTERS[piece.role];
            const ch = piece.color === 'white' ? roleLetter.toUpperCase() : roleLetter;
            board.take(sq);
            if (this.invalidBecauseCheck(board, fen.split(' ')[1]=='b')) {
              board.set(sq, piece);
              continue;
            }
            const psplits = lt.getFenFromBoard(board).split(/\s+/);
            const fenSplits = [];
            const isRook = (s, color) => {
              const r = board.get(s);
              return !!r && r.role === 'rook' && r.color === color;
            };
            for (let i=0; i<splits.length; i++) {
              if (i<psplits.length) {
                fenSplits.push(psplits[i]);
              } else {
                let val = splits[i];
                if (i==2) {
                  val = [...val].filter(c=>{
                    switch(c) {
                      case 'k': return isRook(63, 'black');
                      case 'q': return isRook(56, 'black');
                      case 'K': return isRook(7, 'white');
                      case 'Q': return isRook(7, 'white');
                    }
                    return false;
                  }).join('');
                  val ||='-';
                }
                fenSplits.push(val);
              }
            }
            const pfen = fenSplits.join(' ');
            board.set(sq, piece);
            this.current = { e, ch, baseEval, fen };
            const style = $(e).attr('style');
            const newStyle = style.replaceAll(/transform:([^;]+);/g,(...m)=>{
              if (m[1].includes('scale')) return m[0];
              return 'transform: '+m[1]+' scale(var(--lt-scale, 1));';
            });
            if (style!=newStyle) {
              $(e).attr('style',newStyle);
            }
            const val = await this.getEval(pfen, sf, currentDepth);
            this.displayValue(e, baseEval-val, ch);
            this.current = null;
          }
        }
        clearValues = false;
      } finally {
        $('.cg-wrap .spinner').remove();
        if (clearValues) {
          this.clearValues();
        }
        if (continuous && !this.stopRequested) {
          lt.global.setTimeout(()=>this.showPieceValue(depth, continuous),100);
        }
        this.stopRequested = false;
        this.running = false;
      }
    };

    displayValue = (e, val, ch, intermediate)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const pieceValues = { 'p':0.75, 'r':3.5, 'n':2.5, 'b':2.5, 'q':7.5 };
      const sgn = ch === ch.toLowerCase() ? -1 : 1;
      const pieceValue = sgn * Math.round(val/10)/10;
      const text = pieceValue.toFixed(1);
      const defaultValue = pieceValues[ch.toLowerCase()];
      const q = pieceValue / defaultValue;
      $(e)
        .toggleClassSafe('lichessTools-intermediateResult',!!intermediate)
        .toggleClassSafe('lichessTools-terriblePiece',q<=0.5)
        .toggleClassSafe('lichessTools-badPiece',q>0.5 && q<=0.75)
        .toggleClassSafe('lichessTools-goodPiece',q>1.25 && q<=1.5)
        .toggleClassSafe('lichessTools-greatPiece',q>1.5)
        .attrSafe('data-eval',text);
    };

    onInfo = async (info)=>{
      if (!this.current) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.current) return;
      const turn = this.current.fen.split(' ')[1]=='b' ? -1 : 1;
      const val = LiChessTools.ChessMetrics.getCentipawnOnlyValue(info) * turn;
      this.displayValue(this.current.e, this.current.baseEval - val, this.current.ch, true);
    };

    clearValues = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      this.current = null;
      this.lastProcessedFen = null;
      this.info = null;
      this.lastInfo = null;
      $('piece')
        .removeAttrSafe('data-eval')
        .toggleClassSafe('lichessTools-intermediateResult',false)
        .toggleClassSafe('lichessTools-terriblePiece',false)
        .toggleClassSafe('lichessTools-badPiece',false)
        .toggleClassSafe('lichessTools-goodPiece',false)
        .toggleClassSafe('lichessTools-greatPiece',false)
      $('.cg-wrap .spinner').remove();
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('pieceValueCommand');
      this.options = { enabled: value };
      this.logOption('Command - piece value', value);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (value) {
        lt.registerCommand && lt.registerCommand('pieceValueCommand', {
          handle: (val) => {
            let m = /^\s*piecevalue\b/.exec(val);
            if (m) {
              m = /(?<depth>\d+)/.exec(val);
              const depth = +m?.groups?.depth || 20;
              const continuous = /\bc/.test(val);
              this.showPieceValue(depth, continuous);
              return true;
            } else {
              m = /^\s*stop\b/.exec(val);
              if (m) {
                this.stopRequested = true;
              }
            }
          },
          getHelp: () => trans.noarg('pieceValueCommand.helpText')
        });
      } else {
        lt.unregisterCommand && lt.unregisterCommand('pieceValueCommand');
      }
    }
  }
  LiChessTools.Tools.PieceValueCommand = PieceValueCommandTool;
})();

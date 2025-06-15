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
        'pieceValueCommand.helpText': '/piecevalue\r\nShow piece values for position'
      },
      'ro-RO': {
        'options.pieceValueCommand': 'Comand\u0103: arat\u0103 valorile pieselor pentru pozi\u0163ie',
        'pieceValueCommand.helpText': '/piecevalue\r\nArat\u0103 valorile pieselor pentru pozi\u0163ie'
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
        this.sf=sf;
        return sf;
      } finally {
        this.sfLoading = false;
      }
    };

    getEval = async (fen, sf)=>{
      const lt = this.lichessTools;
      sf.setDepth(20);
      sf.setPosition(fen);
      this.info=null;
      sf.start();
      while (!this.info) {
        await lt.timeout(100);
      }
      await sf.stop();
      return lt.getCentipawns(this.info);
      this.info=null;
    };

    pieceValues = { 'p':1, 'r':5, 'n':3, 'b':3, 'q':9 };

    showPieceValue = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const fen = analysis.node.fen;
      const m = /^.*?\s+(.*)$/.exec(fen);
      const suffix = m ? ' '+m[1] : '';
      const sf=await this.getEngine();
      const baseEval = await this.getEval(fen, sf);
      const board = lt.getBoardFromFen(fen);
      const vals = [];
      for (let i = 0; i < 8; i++) vals.push(Array(8));
      if (this.currentFen == fen) return;
      this.currentFen = fen;
      const pieces = $('cg-container piece').get();
      lt.arrayShuffle(pieces);
      for (const e of pieces) {
        if (analysis.node.fen != fen) {
          this.clearValues();
          return;
        }
        const key = e.cgKey;
        if (!key) continue;
        const x = key.charCodeAt(0)-97;
        const y = 56-key.charCodeAt(1);
        const ch = board[y][x];
        if ([undefined,'k','K'].includes(ch)) continue;
        board[y][x]=undefined;
        const pfen = lt.getFenFromBoard(board)+suffix;
        board[y][x]=ch;
        this.current = { e, ch, baseEval };
        const style = $(e).attr('style');
        const newStyle = style.replaceAll(/transform:([^;]+);/g,(...m)=>{
          if (m[1].includes('scale')) return m[0];
          return 'transform: '+m[1]+' scale(var(--lt-scale, 1));';
        });
        if (style!=newStyle) {
          $(e).attr('style',newStyle);
        }
        const val = await this.getEval(pfen, sf);
        vals[y][x] = val-baseEval;
        const pieceValue = Math.round(2*Math.abs(val-baseEval)/100)/2;
        const text = String(pieceValue);
        const defaultValue = this.pieceValues[ch.toLowerCase()];
        const q = pieceValue / defaultValue;
        $(e)
          .toggleClassSafe('lichessTools-terriblePiece',q<=0.5)
          .toggleClassSafe('lichessTools-badPiece',q>0.5 && q<=0.75)
          .toggleClassSafe('lichessTools-goodPiece',q>1.25 && q<=1.5)
          .toggleClassSafe('lichessTools-greatPiece',q>1.5);
        $(e).attrSafe('data-eval',text);
      }
      console.debug(this.getTable(vals));
      this.current = null;
      this.sf.destroy();
      this.sf = null;
    };

    onInfo = async (info)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.current) return;
      const val = lt.getCentipawns(info)-this.current.baseEval;
      const pieceValue = Math.round(2*Math.abs(val)/100)/2;
      const text = String(pieceValue);
      const defaultValue = this.pieceValues[this.current.ch.toLowerCase()];
      const q = pieceValue / defaultValue;
      $(this.current.e)
        .toggleClassSafe('lichessTools-terriblePiece',q<=0.5)
        .toggleClassSafe('lichessTools-badPiece',q>0.5 && q<=0.75)
        .toggleClassSafe('lichessTools-goodPiece',q>1.25 && q<=1.5)
        .toggleClassSafe('lichessTools-greatPiece',q>1.5)
        .attrSafe('data-eval',text);
    };

    handleChange = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (this.currentFen == analysis.node.fen) return;
      this.clearValues();
    };

    clearValues = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      this.current = null;
      this.currentFen = null;
      this.info = null;
      this.lastInfo = null;
      $('piece')
        .removeAttrSafe('data-eval')
        .toggleClassSafe('lichessTools-terriblePiece',false)
        .toggleClassSafe('lichessTools-badPiece',false)
        .toggleClassSafe('lichessTools-goodPiece',false)
        .toggleClassSafe('lichessTools-greatPiece',false)
    };

    getTable = (arr) => {
      const lt = this.lichessTools;
      const invert = lt.lichess.analysis.getOrientation() == 'black';
      const maxLength = Math.max(...arr.flat().map(item => String(item).length));

      let table = '';
      table += '+' + '-'.repeat(maxLength*8+7) + '+\n';

      const rows = [...arr];
      if (invert) rows.reverse();    
      rows.forEach(row => {
        table += '|';
        const pieces = [...row];
        if (invert) pieces.reverse();
        pieces.forEach(item => {
          const str = item === undefined ? '' : String(item);
          const pre = Math.floor((maxLength-str.length)/2);
          table += (' '.repeat(pre)+str).padEnd(maxLength) + '|';
        });
        table += '\n';
        table += '+' + '-'.repeat(maxLength*8+7) + '+\n';
      });
    
      return table;
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
      lt.pubsub.on('lichessTools.redraw', this.handleChange);
      if (value) {
        lt.pubsub.on('lichessTools.redraw', this.handleChange);
        lt.registerCommand && lt.registerCommand('pieceValueCommand', {
          handle: (val) => {
            if (val == 'piecevalue') {
              this.showPieceValue();
              return true;
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

(() => {
  class StockfishTool extends LiChessTools.Tools.ToolBase {

    preferences = [{
        name: 'stockfish',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.stockfish': 'stockfish'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.stockfish': 'stockfish'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('stockfish');
      if (!value) {
        return;
      }
      const sf=new Stockfish(parent);
      parent.stockfish=sf;
    }
  }

  class Stockfish {
    constructor(lichessTools) {
      this.parent=lichessTools;
      this.origin=this.parent.global.location.origin;
      this.restartDebounced=this.parent.debounce(this.restart,500);
    }

    async load() {
      try{
        if (!this._module) {
          this._module=await import(this.origin+'/assets/npm/lila-stockfish-web/sf-nnue-40.js');
        }
        if (!this._stockfish) {
          this._stockfish=await this._module.default;
        }
        if (!this._instance) {
          const sf=await this._stockfish();
          await sf.ready;
          sf.listen=this.listen.bind(this);
          sf.postMessage('uci');
          while(!this._uciok) {
            await this.parent.timeout(100);
          }
          this._instance=sf;
        }
        return this;
      } catch(e) {
        console.log('Error instantiating Stockfish:',e);
      }
    }

    setOption(name,value) {
      const sf=this._instance;
      if (!sf) throw new Exception('await .load() to finish instantiating!');
      sf.postMessage('setoption name '+name+' value '+value);
    }

    setMultiPv(count) {
      this.setOption('MultiPV',count);
      this.restartDebounced();
    }

    setHash(mb) {
      this.setOption('Hash',mb);
      this.restartDebounced();
    }

    setSearchMoves(moves) {
      if (this._searchMoves==moves) return;
      this._searchMoves=moves;
      this.restartDebounced();
    }

    setDepth(depth) {
      if (this._depth==depth) return;
      this._depth=depth;
      this.restartDebounced();
    }

    _fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    setPosition(fen) {
      if (!fen) throw new Error('Empty FEN sent to setPosition');
      if (this._fen==fen) return;
      this._fen=fen;
      this.restartDebounced();
    }

    restart() {
      if (!this._isStarted) return;
      this.start();
    }

    start() {
      const sf=this._instance;
      if (!sf) throw new Exception('await .load() to finish instantiating!');
      sf.postMessage('stop');
      sf.postMessage('ucinewgame');
      sf.postMessage('position fen ' + this._fen);
      sf.postMessage('go '+(this._depth?'depth '+this._depth:'infinite')+(this._searchMoves?.length?' searchmoves '+this._searchMoves.join(' '):''));
      this._isStarted=true; 
    }

    stop() {
      const sf=this._instance;
      if (!sf) throw new Exception('await .load() to finish instantiating!');
      sf.postMessage('stop');
      this._isStarted=false; 
    }

    destroy() {
      const sf=this._instance;
      if (!sf) return;
      this.stop();
      sf.listen=null;
      sf.postMessage('quit');
      this._instance=null;
      this._stockfish=null;
      this._module=null;
    }

    listen(data) {
      if (!data) return;
      if (data=='uciok') {
        this._uciok=true;
        return;
      }
      if (data.startsWith('info')) {
        const splits=data.split(' ');
        let arr=null;
        const info={};
        const isString=false;
        for (const split of splits.slice(1)) {
          if (!isString && /^(depth|seldepth|time|nodes|pv|multipv|score|cp|mat|lowerbound|upperbound|currmove|currmovenumber|hashfull|nps|tbhits|sbhits|cpuload|string|refutation|currline)$/.test(split)) {
            arr=[];
            info[split]=arr;
            if (split=='string') isString=true;
            continue;
          }
          arr.push(split);
        }
        this.emit('info',info);
      }
    }

    _handlers={};
    on(name,handler) {
      let arr=this._handlers[name];
      if (!arr) {
        arr=new Set();
        this._handlers[name]=arr;
      }
      arr.add(handler);
    }
    off(name,handler) {
      let arr=this._handlers[name];
      if (!arr) return;
      arr.delete(handler);
    }
    emit(name,event) {
      for (const handler of this._handlers[name]||[]) {
        handler(event);
      }
    }
  }

  LiChessTools.Tools.Stockfish = StockfishTool;
})();

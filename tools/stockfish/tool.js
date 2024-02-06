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
      const sf=new Stockfish(parent.global);
      await sf.load();
      parent.stockfish=sf;
    }
  }

  class Stockfish {
    constructor(global) {
      this.global=global;
      this.origin=global.location.origin;
    }

    async load() {
      const timeout=(ms)=>{
        return new Promise(resolve => this.global.setTimeout(resolve, ms));
      };
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
          await timeout(100);
        }
        this._instance=sf;
      }
    }

    setOption(name,value) {
      const sf=this._instance;
      if (!sf) throw new Exception('await .load() to finish instantiating!');
      sf.postMessage('setoption name '+name+' value '+value);
    }

    setMultiPv(count) {
      this.setOption('MultiPV',count);
      this.restart();
    }

    setHash(mb) {
      this.setOption('Hash',mb);
      this.restart();
    }

    setDepth(depth) {
      if (this._depth==depth) return;
      this._depth=depth;
      this.restart();
    }

    _fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    setPosition(fen) {
      if (this._fen==fen) return;;
      this._fen=fen;
      this.restart();
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
      sf.postMessage('position fen ' + fenString);
      sf.postMessage('go '+(depth?'depth '+this._depth:'infinite')+(this._searchMoves?.length?' searchmoves '+this._searchMoves.join(' '):''));
      this._isStarted=true; 
    }

    stop() {
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
          if (!isString && /^()$/.test(split)) {
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
      for (const handler in this._handlers[name]||[]) {
        handler(event);
      }
    }
  }

  LiChessTools.Tools.Stockfish = StockfishTool;
})();

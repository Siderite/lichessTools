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
        'options.stockfish': 'Stockfish'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.stockfish': 'Stockfish'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('stockfish');
      if (!value) {
        parent.stockfish?.destroy();
        parent.stockfish=null;
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
          const lichess=this.parent.lichess;
          const engines=lichess?.analysis?.ceval?.engines;
          const engineId='__sf16nnue40'; //engines?.selectProp() || '__sf16nnue40';
          const engine=engines?.localEngines?.find(e=>e.id==engineId);
          const assetUrl=engine && engine.assets?.js
            ? engine.assets.root+'/'+engine.assets.js
            : 'npm/lila-stockfish-web/sf-nnue-40.js';
          this.parent.global.console.debug('SF','loading engine '+engineId+(engine?' ('+engine.name+')':'')+' from '+assetUrl);
          const url=this.origin+'/assets/'+assetUrl;
          this.parent.global.exports=this.parent.global.exports||{};
          this._module=await import(url);
        }
        if (!this._stockfish) {
          this._stockfish=(await this._module.default) || this.parent.global.exports.Stockfish;
          if (!this._stockfish) {
            this.parent.global.console.log(this._module);
            throw new Error('Could not load module');
          }
        }
        if (!this._instance) {
          const sf=await this._stockfish();
          await sf.ready;
          sf.listen=this.listen.bind(this);
          this._instance=sf;
          this.postMessage('uci');
          while(!this._uciok) {
            await this.parent.timeout(100);
          }
        }
        this.parent.global.console.debug('SF','Engine loaded');
        return this;
      } catch(e) {
        console.log('Error instantiating Stockfish:',e);
      }
    }

    postMessage(message) {
      const sf=this._instance;
      if (!sf) throw new Error('await .load() to finish instantiating!');
      this.parent.debug && this.parent.global.console.debug('Post SF:',message);
      sf.postMessage(message);
    }

    setOption(name,value) {
      const sf=this._instance;
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

    setThreads(count) {
      this.setOption('Threads',count);
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

    setTime(time) {
      if (this._time==time) return;
      this._time=time;
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
      if (!sf) {
        this.load().then(this.start);
        return;
      }
      this.postMessage('stop');
      //this.postMessage('ucinewgame');
      this.postMessage('position fen ' + this._fen);
      this.postMessage('go'+(this._depth?' depth '+this._depth:this._time?' movetime '+this._time:' infinite')+(this._searchMoves?.length?' searchmoves '+this._searchMoves.join(' '):''));
      this.postMessage('setoption name UCI_AnalyseMode value true');
      this.postMessage('setoption name UCI_Elo value 3190');
      this.postMessage('setoption name UCI_ShowWDL value true');
      this._isStarted=true; 
    }

    stop() {
      const sf=this._instance;
      sf?.postMessage('stop');
      this._isStarted=false; 
    }

    destroy() {
      const sf=this._instance;
      if (!sf) return;
      this.stop();
      sf.listen=null;
      this.postMessage('quit');
      this._instance=null;
      this._stockfish=null;
      this._module=null;
    }

    listen(data) {
      if (!data) return;
      if (this.parent.debug>1) {
        this.parent.global.console.debug('SF',data);
      }
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
          if (!isString && /^(depth|seldepth|time|nodes|pv|multipv|score|cp|wdl|mate|lowerbound|upperbound|currmove|currmovenumber|hashfull|nps|tbhits|sbhits|cpuload|string|refutation|currline)$/.test(split)) {
            arr=[];
            info[split]=arr;
            if (split=='string') isString=true;
            continue;
          }
          arr.push(split);
        }
        this.emit('info',info);
        return;
      }
      if (this.parent.debug>1) {
        this.parent.global.console.debug('SF','unhandled message');
      } else if (this.parent.debug) {
        this.parent.global.console.debug('SF',data);
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

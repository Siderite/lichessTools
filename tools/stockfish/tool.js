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
    },
    {
      name: 'stockfish-threads',
      category: 'analysis',
      type: 'number',
      defaultValue: 1,
      advanced: true
    },
    {
      name: 'stockfish-hash',
      category: 'analysis',
      type: 'number',
      defaultValue: 128,
      advanced: true
    }

    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.stockfish': 'Stockfish',
        'options.stockfish-threads': 'LiChess Tools analysis engine threads',
        'options.stockfish-hash': 'LiChess Tools analysis engine hash (MB)',
        'couldNotLoadStockfish': 'Could not load Stockfish!'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.stockfish': 'Stockfish',
        'options.stockfish-threads': 'Thread-uri pentru motorul de analiz\u0103 LiChess Tools',
        'options.stockfish-hash': 'Hash pentru motorul de analiz\u0103 LiChess Tools (MB)',
        'couldNotLoadStockfish': 'Nu am putut \u00eenc\u0103rca Stockfish!'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('stockfish');
      if (!value) {
        parent.stockfish?.destroy();
        parent.stockfish = null;
        return;
      }
      const threads = +(parent.currentOptions.getValue('stockfish-threads')) || 1;
      const hash = +(parent.currentOptions.getValue('stockfish-hash')) || 128;
      let sf = parent.stockfish;
      if (sf) {
        if (sf._instance) {
          sf.setOption('Threads', threads);
          sf.setOption('Hash', hash);
          sf.start();
        } else {
          sf._initialThreads = threads;
          sf._initialHash = hash;
        }
      } else {
        sf = new Stockfish(parent);
        sf._initialThreads = threads;
        sf._initialHash = hash;
        parent.stockfish = sf;
      }
    }
  }

  class Stockfish {
    constructor(lichessTools) {
      this.parent = lichessTools;
      this.origin = this.parent.global.location.origin;
      this.restartDebounced = this.parent.debounce(this.restart, 500);
    }

    async load() {
      const lichess = this.parent.lichess;
      const useSf17=this.parent.storage.supportsDb;
      try {
        if (!this._module) {
          this.parent.debug && this.parent.global.console.debug('SF', 'loading module...');
          const engines = lichess?.analysis?.ceval?.engines;
          const engineId = useSf17?'__sf17nnue79' : '__sf16nnue40';
          const engineRoot = useSf17?'sf17-79.js' : 'sf-nnue-40.js';
          const engine = engines?.localEngines?.find(e => e.id == engineId);
          const assetUrl = engine && engine.assets?.js
            ? engine.assets.root + '/' + engine.assets.js
            : 'npm/lila-stockfish-web/' + engineRoot;
          this.parent.global.console.debug('SF', 'loading engine ' + engineId + (engine ? ' (' + engine.name + ')' : '') + ' from ' + assetUrl);
          const url = this.origin + '/assets/' + assetUrl;
          this.parent.global.exports = this.parent.global.exports || {};
          this._module = await import(url);
        }
        if (!this._stockfish) {
          this.parent.debug && this.parent.global.console.debug('SF', 'loading Stockfish...');
          this._stockfish = (await this._module.default) || this.parent.global.exports.Stockfish;
          if (!this._stockfish) {
            this.parent.global.console.log(this._module);
            throw new Error('Could not load module');
          }
        }
        if (!this._instance) {
          this.parent.debug && this.parent.global.console.debug('SF', 'creating instance...');
          const sf = await this._stockfish();
          if (useSf17) {
            const getBuffer=async (i)=>{
              const nnueFilename = sf.getRecommendedNnue(i);
              let result = await this.parent.storage.get('nnue--db/nnue/'+nnueFilename, { db:true, raw:true });
              if (!result) {
                const nnueUrl = lichess.asset.url('lifat/nnue/'+nnueFilename, { version: false })
                const response = await fetch(nnueUrl);
                const buffer = await response.arrayBuffer();
                result = new Uint8Array(buffer);
                await this.parent.storage.set('nnue--db/nnue/'+nnueFilename, result, { db:true, raw:true });
              }
              return result;
            }
            sf.setNnueBuffer(await getBuffer(0),0);
            sf.setNnueBuffer(await getBuffer(1),1);
          }
          if (sf.uci && !sf.postMessage) sf.postMessage = sf.uci;
          await sf.ready;
          sf.listen = this.listen.bind(this);
          this._instance = sf;
          this.postMessage('uci');
          while (!this._uciok) {
            await this.parent.timeout(100);
          }
          if (this._initialThreads) this.setOption('Threads', this._initialThreads);
          if (this._initialHash) this.setOption('Hash', this._initialHash);
        }
        this.parent.global.console.debug('SF', 'Engine loaded');
        return this;
      } catch (e) {
        this.parent.announce(this.parent.translator.noarg('couldNotLoadStockfish'));
        console.log('Error instantiating Stockfish:', e);
      }
    }

    postMessage(message) {
      const sf = this._instance;
      if (!sf) throw new Error('await .load() to finish instantiating!');
      this.parent.debug && this.parent.global.console.debug('Post SF:', message);
      sf.postMessage(message);
    }

    setOption(name, value) {
      const sf = this._instance;
      sf.postMessage('setoption name ' + name + ' value ' + value);
    }

    setMultiPv(count) {
      this.setOption('MultiPV', count);
      this.restartDebounced();
    }

    setHash(mb) {
      this.setOption('Hash', mb);
      this.restartDebounced();
    }

    setThreads(count) {
      this.setOption('Threads', count);
      this.restartDebounced();
    }

    setSearchMoves(moves) {
      if (this._searchMoves == moves) return;
      this._searchMoves = moves;
      this.restartDebounced();
    }

    setDepth(depth) {
      if (this._depth == depth) return;
      this._depth = depth;
      this.restartDebounced();
    }

    setTime(time) {
      if (this._time == time) return;
      this._time = time;
      this.restartDebounced();
    }

    _fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    setPosition(fen) {
      if (!fen) throw new Error('Empty FEN sent to setPosition');
      if (this._fen == fen) return;
      this._fen = fen;
      this.restartDebounced();
    }

    restart() {
      if (!this._isStarted) return;
      this.start();
    }

    start() {
      const sf = this._instance;
      if (!sf) {
        this.load().then(this.start.bind(this));
        return;
      }
      this.postMessage('stop');
      //this.postMessage('ucinewgame');
      //this.postMessage('setoption name UCI_AnalyseMode value true');
      this.postMessage('setoption name UCI_Elo value 3190');
      this.postMessage('setoption name UCI_ShowWDL value true');
      this.postMessage('position fen ' + this._fen);
      this.postMessage('go' + (this._depth ? ' depth ' + this._depth : this._time ? ' movetime ' + this._time : ' infinite') + (this._searchMoves?.length ? ' searchmoves ' + this._searchMoves.join(' ') : ''));
      this._isStarted = true;
      this.parent.debug && this.parent.global.console.debug('SF', 'Engine started');
    }

    stop() {
      const sf = this._instance;
      sf?.postMessage('stop');
      this._isStarted = false;
    }

    destroy() {
      const sf = this._instance;
      if (!sf) return;
      this.stop();
      sf.listen = null;
      // TODO this freezes the page for SF17 (https://github.com/lichess-org/lila/issues/16053)
      //this.postMessage('quit');
      this._instance = null;
      this._stockfish = null;
      this._module = null;
    }

    listen(data) {
      if (!data) return;
      if (this.parent.debug > 1) {
        this.parent.global.console.debug('SF', data);
      }
      if (data == 'uciok') {
        this._uciok = true;
        return;
      }
      if (/^(info|bestmove)/.test(data)) {
        const splits = data.split(' ');
        let arr = null;
        const info = {};
        let isString = false;
        for (const split of splits.slice(1)) {
          if (!isString && /^(depth|seldepth|time|nodes|pv|multipv|score|cp|wdl|mate|lowerbound|upperbound|currmove|currmovenumber|hashfull|nps|tbhits|sbhits|cpuload|string|refutation|currline|ponder)$/.test(split)) {
            arr = [];
            info[split] = arr;
            if (split == 'string') isString = true;
            continue;
          }
          if (!arr) {
            arr = [];
            info[splits[0]] = arr;
          }
          arr.push(split);
        }
        this.emit(splits[0], info);
        if (this.parent.debug > 1) {
          this.parent.global.console.debug('SF', 'emitted', splits[0], info);
        }
        return;
      }
      if (this.parent.debug > 1) {
        this.parent.global.console.debug('SF', 'unhandled message');
      } else if (this.parent.debug) {
        this.parent.global.console.debug('SF', data);
      }
    }

    _handlers = {};
    on(name, handler) {
      if (!handler) throw new Error('handler cannot be empty');
      let arr = this._handlers[name];
      if (!arr) {
        arr = new Set();
        this._handlers[name] = arr;
      }
      arr.add(handler);
    }
    off(name, handler) {
      if (!handler) throw new Error('handler cannot be empty');
      let arr = this._handlers[name];
      if (!arr) return;
      arr.delete(handler);
    }
    emit(name, event) {
      for (const handler of this._handlers[name] || []) {
        handler(event);
      }
    }
  }

  LiChessTools.Tools.Stockfish = StockfishTool;
})();

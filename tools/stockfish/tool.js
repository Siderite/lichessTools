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
      category: 'analysis2',
      type: 'number',
      defaultValue: 1,
      advanced: true
    },
    {
      name: 'stockfish-hash',
      category: 'analysis2',
      type: 'number',
      defaultValue: 128,
      advanced: true
    }

    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.analysis2': 'Analysis - minor',
        'options.stockfish': 'Stockfish',
        'options.stockfish-threads': 'LiChess Tools analysis engine threads',
        'options.stockfish-hash': 'LiChess Tools analysis engine hash (MB)',
        'couldNotLoadStockfish': 'Could not load Stockfish!',
        'stockfishError': 'Error running StockFish!'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.stockfish': 'Stockfish',
        'options.stockfish-threads': 'Thread-uri pentru motorul de analiz\u0103 LiChess Tools',
        'options.stockfish-hash': 'Hash pentru motorul de analiz\u0103 LiChess Tools (MB)',
        'couldNotLoadStockfish': 'Nu am putut \u00eenc\u0103rca Stockfish!',
        'stockfishError': 'Eroare rul\u00e2nd StockFish!'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('stockfish');
      if (!value) {
        lt.stockfish?.destroy();
        lt.stockfish = null;
        return;
      }
      const threads = +(lt.currentOptions.getValue('stockfish-threads')) || 1;
      const hash = +(lt.currentOptions.getValue('stockfish-hash')) || 128;
      let sf = lt.stockfish;
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
        sf = new Stockfish(lt);
        sf._initialThreads = threads;
        sf._initialHash = hash;
        lt.stockfish = sf;
      }
    }
  }

  class Stockfish {
    constructor(lichessTools) {
      this.lt = lichessTools;
      this.origin = this.lt.global.location.origin;
      this.restartDebounced = this.lt.debounce(this.restart, 500, { defer:true });
    }

    async load(useBetterEngine) {
      this._lastUseBetterEngine = useBetterEngine;
      const lichess = this.lt.lichess;
      let engineId;
      let engineRoot;
      if (useBetterEngine === undefined) {
        useBetterEngine=this.lt.storage.supportsDb && (await this.lt.getMemorySize()) >= 4;
      }
      if (useBetterEngine) {
        engineId = '__sf17_1nnue79';
        engineRoot = 'sf171-79.js';
      } else {
        engineId = '__sf17_1nnue7';
        engineRoot = 'sf171-7.js';
      }
      try {
        if (!this._module) {
          this.lt.debug && this.lt.global.console.debug('SF', 'loading module...');
          const engines = lichess?.analysis?.ceval?.engines;
          const engine = engines?.localEngines?.find(e => e.id == engineId);
          const assetUrl = engine?.assets?.js
            ? engine.assets.root + '/' + engine.assets.js
            : 'npm/lila-stockfish-web/' + engineRoot;
          this.lt.global.console.debug('SF', 'loading engine ' + engineId + (engine ? ' (' + engine.name + ')' : '') + ' from ' + assetUrl);
          const url = this.origin + '/assets/' + assetUrl;
          this.lt.global.exports = this.lt.global.exports || {};
          this._module = await import(url);
        }
        if (!this._stockfish) {
          this.lt.debug && this.lt.global.console.debug('SF', 'loading Stockfish...');
          this._stockfish = (await this._module.default) || this.lt.global.exports.Stockfish;
          if (!this._stockfish) {
            this.lt.global.console.log(this._module);
            throw new Error('Could not load module');
          }
        }
        if (!this._instance) {
          this.lt.debug && this.lt.global.console.debug('SF', 'creating instance...');
          const sf = await this._stockfish();
          sf.onError = (e)=>{
            this.lt.global.console.debug('SF error: ',e);
            this.lt.announce(this.lt.translator.noarg('stockfishError'));
            this.emit('error',e);
          };
          if (useBetterEngine) {
            const getBuffer=async (i)=>{
              const nnueFilename = sf.getRecommendedNnue(i);
              let result = await this.lt.storage.get('nnue--db/nnue/'+nnueFilename, { db:true, raw:true });
              if (!result) {
                const nnueUrl = lichess.asset.url('lifat/nnue/'+nnueFilename, { version: false })
                const response = await fetch(nnueUrl);
                const buffer = await response.arrayBuffer();
                result = new Uint8Array(buffer);
                await this.lt.storage.set('nnue--db/nnue/'+nnueFilename, result, { db:true, raw:true });
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
            await this.lt.timeout(100);
          }
          if (this._initialThreads) this.setOption('Threads', this._initialThreads);
          if (this._initialHash) this.setOption('Hash', this._initialHash);
        }
        this.lt.global.console.debug('SF', 'Engine loaded');
        return this;
      } catch (e) {
        this.lt.announce(this.lt.translator.noarg('couldNotLoadStockfish'));
        console.log('Error instantiating Stockfish:', e);
      }
    }

    postMessage(message) {
      const sf = this._instance;
      if (!sf) throw new Error('await .load() to finish instantiating!');
      this.lt.debug && this.lt.global.console.debug('Post SF:', message);
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

    async restart() {
      if (this._isStarted) return;
      await this.start();
    }

    start() {
      const sf = this._instance;
      if (!sf) {
        this.load(this._lastUseBetterEngine).then(this.start.bind(this));
        return;
      }
      this.postMessage('stop');
      this._isStarted = false;
      //this.postMessage('ucinewgame');
      //this.postMessage('setoption name UCI_AnalyseMode value true');
      this.postMessage('setoption name UCI_Elo value 3190');
      this.postMessage('setoption name UCI_ShowWDL value true');
      this.postMessage('position fen ' + this._fen);
      this.postMessage('go' + (this._depth ? ' depth ' + this._depth : this._time ? ' movetime ' + this._time : ' infinite') + (this._searchMoves?.length ? ' searchmoves ' + this._searchMoves.join(' ') : ''));
      this._isStarted = true;
      this.lt.debug && this.lt.global.console.debug('SF', 'Engine started');
    }

    async stop() {
      const sf = this._instance;
      sf?.postMessage('stop');
      let k=0;
      while (this._isStarted && k++<6) {
        await this.lt.timeout(50);
      }
      this._isStarted = false;
    }

    destroy() {
      const sf = this._instance;
      if (!sf) return;
      this.stop();
      sf.listen = null;
      this.postMessage('quit');
      this._instance = null;
      this._stockfish = null;
      this._module = null;
    }

    listen(data) {
      if (!data) return;
      if (this.lt.debug > 1) {
        this.lt.global.console.debug('SF', data);
      }
      if (data == 'uciok') {
        this._uciok = true;
        return;
      }
      const m = /^(info|bestmove)/.exec(data);
      if (m) {
        if (m[1]=='bestmove') {
          this._isStarted = false;
        }
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
        if (this.lt.debug > 1) {
          this.lt.global.console.debug('SF', 'emitted', splits[0], info);
        }
        return;
      }
      if (this.lt.debug > 1) {
        this.lt.global.console.debug('SF', 'unhandled message');
      } else if (this.lt.debug) {
        this.lt.global.console.debug('SF', data);
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

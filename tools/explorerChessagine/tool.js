(() => {
  class ExplorerChessagineTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw','ChessOps'];

    preferences = [
      {
        name: 'explorerChessagine',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerChessagine': 'Chessagine integration in Explorer',
        'chessagineTabTitle': 'LiChess Tools - Chessagine API integration'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerChessagine': 'Integrare Chessagine \u00een Explorator',
        'chessagineTabTitle': 'LiChess Tools - integrate API Chessagine',
        'chessagineTabText': '%engine%rating'
      }
    };

    ENGINES = [
      { id: 'leela',       label: 'Leela T1-256' },
      { id: 'elite-leela', label: 'Elite Leela'  },
      { id: 'maia3',       label: 'Maia 3'       },
    ];

    populateExplorerCache = async (fen, engine, rating, background) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess.analysis;
      const explorer = analysis.explorer;
      const co = await lt.chessops();

      if (!explorer.enabled()) return;

      const result = await lt.api.chessagine.analyseFEN(fen, engine, rating);
      if (!result.success) return;

      const SCALE = 1000000;

      const explorerItem = {
        fen:fen, 
        isOpening: true, 
        moves:[],
        background: background
      };
      const wdl = result.data?.uciEval?.rawWdl || { win:0, draw:1, loss:0 };
      const turnColor = analysis.turnColor();
      explorerItem.white = Math.round(SCALE * (turnColor=='white' ? wdl.win : wdl.loss));
      explorerItem.draws = Math.round(SCALE * wdl.draw);
      explorerItem.black = Math.round(SCALE * (turnColor=='white' ? wdl.loss : wdl.win));
      
      const topMoves = result.data?.topMoves;
      if (topMoves?.length) {
      const fenInfo = co.fen.parseFen(fen).unwrap();
      const ch = co.Chess.fromSetup(fenInfo).unwrap();
        topMoves.forEach(move=>{
          const mv = co.san.parseSan(ch,move.move);
          const uci = co.makeUci(mv);
          const ch2 = ch.clone();
          ch2.play(mv);
          const newFen = co.fen.makeFen(ch2.toSetup());
          let moveExplorerItem = explorer.cache[newFen];
          if (!moveExplorerItem?.hasData && !background) {
            this.populateExplorerCache(newFen, engine, rating, true).then(()=>{
              moveExplorerItem = explorer.cache[newFen];
              if (moveExplorerItem) {
                item.white = moveExplorerItem.white * move.probability;
                item.draws = moveExplorerItem.draws * move.probability;
                item.black = moveExplorerItem.black * move.probability;
                item.hasData = true;
                if ([fen,newFen].includes(explorer.current()?.fen)) {
                  analysis.redraw();
                }
              }
            });
          }
          const item = {
            san: move.move,
            uci: uci,
            white: moveExplorerItem ? moveExplorerItem.white : 0,
            draws: moveExplorerItem ? moveExplorerItem.draws : Math.round(move.probability * SCALE),
            black: moveExplorerItem ? moveExplorerItem.black : 0,
            hasData: !!moveExplorerItem
          };
          explorerItem.moves.push(item);
        });
      }
      explorer.cache[fen]=explorerItem;
    };

    refreshUi = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const explorer = analysis.explorer;
      const player = explorer.config.data.playerName.value();

      const m = /^!lt_(?<engine>.*?)(?:_(?<rating>\d+))?$/.exec(player);
      if (!m) {
        return;
      }

      const { engine, rating } = m.groups;
      const title = trans.noarg('chessagineTabTitle');
      const engineName = this.ENGINES.find(e=>e.id==engine)?.label;
      const text = engineName+(rating?' ('+rating+')':'');
      lt.global.requestAnimationFrame(()=>{
        const tab = $('.explorer-title .player.active')
          .attrSafe('title',title);
        if (tab.text()!=text) {
          tab.replaceText(text);
          tab.find('strong').text('');
        }
      });

    };

    populateExplorer = async (player) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const explorer = analysis.explorer;

      const lastStream = { 
        sync: false,
        promise: new Promise((resolve)=>{
          (async ()=>{
          try {
            const m = /^!lt_(?<engine>.*?)(?:_(?<rating>\d+))?$/.exec(player);
            if (!m) return;

            const { engine, rating } = m.groups;
            const fen = analysis.node.fen;

            await this.populateExplorerCache(fen,engine,rating);
            const title = trans.noarg('chessagineTabTitle');
            const engineName = this.ENGINES.find(e=>e.id==engine)?.label;
            const text = engineName+(rating?' ('+rating+')':'');
            this.refreshUi();
          } finally {
            explorer.movesAway(0);
            explorer.loading(false);
            explorer.failing(null);
            resolve(true);
          }
          })();
        }
      )};
      lastStream.promise.then(()=>{
        analysis.redraw();
        lastStream.sync = true;
      });
      explorer.lastStream = lastStream;
    };


    refreshExplorer = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const explorer = lichess?.analysis?.explorer;
      if (!explorer) return;
      const db = explorer.db();
      if (!explorer.enabled()) return;
      const player = explorer.config.data.playerName.value();
      if (db=='player' && player?.startsWith('!lt_')) {
        this.populateExplorer(player);
        return false;
      }
    };

    refreshExplorerIfBackground = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const explorer = lichess?.analysis?.explorer;
      if (explorer?.current()?.background) {
        this.refreshExplorer();
      } else {
        this.refreshUi();
      }
    };

    setupChessagine = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const explorer = analysis?.explorer;
      if (!this.options.enabled || !explorer) return;

      let refresh = false;
      if (!lt.isWrappedFunction(explorer.config.toggleOpen,'explorerChessagine')) {
        refresh = true;
        explorer.config.toggleOpen = lt.wrapFunction(explorer.config.toggleOpen, {
          id: 'explorerChessagine',
          after: ($this, result) => {
            if (explorer.config.data.open()) {
              this.refreshUi();
            }
          }
        });
      }
      if (!lt.isWrappedFunction(explorer.enabled,'explorerChessagine')) {
        refresh = true;
        explorer.enabled = lt.wrapFunction(explorer.enabled, {
          id: 'explorerChessagine',
          after: ($this, result, value) => {
            if (value) {
              this.refreshUi();
            }
          }
        });
      }
      if (!lt.isWrappedFunction(explorer.fetch,'explorerChessagine')) {
        refresh = true;
        explorer.fetch = lt.wrapFunction(explorer.fetch,{
          id: 'explorerChessagine',
          before: this.refreshExplorer
        });
      }
      if (!lt.isWrappedFunction(explorer.setNode,'explorerChessagine')) {
        refresh = true;
        explorer.setNode = lt.wrapFunction(explorer.setNode,{
          id: 'explorerChessagine',
          before: ($this, ...args)=>{
            const db = explorer.db();
            if (!explorer.enabled()) return;
            const player = explorer.config.data.playerName.value();
            if (analysis.node.ply>=50 && db=='player' && player?.startsWith('!lt_')) {
              analysis.node.realPly = analysis.node.ply;
              analysis.node.ply = 49;
            }
          },
          after: ($this, result, ...args)=>{
            if (analysis.node.realPly) {
              analysis.node.ply = analysis.node.realPly;
              delete analysis.node.realPly;
            }
          }
        });
      }
      if (refresh) {
        this.refreshExplorer();
        lt.global.setTimeout(()=>explorer.reload(),1000);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('explorerChessagine');
      this.logOption('Explorer Chessagine', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const explorer = analysis?.explorer;
      if (!explorer) return;

      explorer.config.toggleOpen = lt.unwrapFunction(explorer.config.toggleOpen, 'explorerChessagine');
      explorer.enabled = lt.unwrapFunction(explorer.enabled, 'explorerChessagine');
      explorer.fetch = lt.unwrapFunction(explorer.fetch,'explorerChessagine');
      explorer.setNode = lt.unwrapFunction(explorer.setNode,'explorerChessagine');
      lt.pubsub.off('lichessTools.redraw', this.refreshExplorerIfBackground);
      lt.pubsub.off('lichessTools.redraw', this.setupChessagine);

      this.options = { enabled: value };
      if (!value) {
        const existing = explorer.config.data.playerName.value();
        if (existing?.startsWith('!lt_')) {
          explorer.config.removePlayer(existing);
          const userId = lt.getUserId();
          if (userId) {
            explorer.config.selectPlayer(userId);
            explorer.enabled(false);
            explorer.reload();
            explorer.enabled(true);
            explorer.reload();
          }
        }
        return;
      }

      lt.pubsub.on('lichessTools.redraw', this.refreshExplorerIfBackground);
      lt.pubsub.on('lichessTools.redraw', this.setupChessagine);
      this.setupChessagine();
    }

  }
  LiChessTools.Tools.ExplorerChessagine = ExplorerChessagineTool;
})();

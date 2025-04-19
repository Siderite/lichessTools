(() => {
  class CevalCacheTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cevalCache',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true,
        wip: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.cevalCache': 'Remember local computer evaluation'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.cevalCache': 'Re\u0163ine evaluarea local\u0103 a computerului'
      }
    }

    handlePly = async (ply) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const node = analysis.node;
      const key = analysis.ceval.engines.activeEngine.id+'|'+analysis.data.game.variant.key+'|'+lt.getPositionFromFen(node.fen, true);
      const dbKey = 'lichessTools/evalCache/'+key;
      const value = await lt.storage.get(dbKey,{ db: true, raw: true });
      if (!value || node.ceval?.depth > value.depth) return;
      const ceval = node.ceval || { 
                                    fen: node.fen,
                                    pvs: [ { moves:[],cp:value.cp,mate:value.mate } ]
                                  };
      node.ceval = { ...ceval, ... value };
      analysis.redraw();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('cevalCache');
      this.logOption('Ceval cache', value);
      this.options = { enabled: !!value };
      if (!lt.storage.supportsDb) {
        lt.global.console.debug(' ... indexed DB not supported');
        return;
      }
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      lt.uiApi.events.off('ply', this.handlePly);
      const ctrl = analysis.ceval.engines?.ctrl;
      if (ctrl) {
        ctrl.onEmit = lt.unwrapFunction(ctrl.onEmit,'cevalCache');
        if (this.options.enabled) {
          lt.uiApi.events.on('ply', this.handlePly);
          ctrl.onEmit = lt.wrapFunction(ctrl.onEmit,{
            id: 'cevalCache',
            after: async ($this, result, data, meta)=>{
              const key = analysis.ceval.storedPv()+'|'+analysis.ceval.engines.activeEngine.id+'|'+meta.variant+'|'+lt.getPositionFromFen(data.fen, true);
              const dbKey = 'lichessTools/evalCache/'+key;
              let value = await lt.storage.get(dbKey,{ db: true, raw: true });
              const node = analysis.tree.nodeAtPath(meta.path);
              if (data.depth <= 20 || data.depth <= value?.depth) return;
              value = { time: Date.now(), ...data };
              try {
                await lt.storage.set(dbKey,value,{ db: true, raw: true });
              } catch(e) {
                if (e.name === "QuotaExceededError") {
                  const dbStorage = lt.storage.getStore({ db: true, raw: true });
                  //dbStorage.clearStore(dbKey);
                  dbStorage.removeAllBy(dbKey,'time','upperBound',Date.now()-86400*1000*30);
                }
              };
            }
          });
        }
      }
    }

  }
  LiChessTools.Tools.CevalCache = CevalCacheTool;
})();

(() => {
  class CevalCacheTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitCeval'];

    preferences = [
      {
        name: 'cevalCache',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
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
      const key = analysis.ceval.engines.active()?.id+'|'+analysis.variantKey+'|'+lt.getPositionFromFen(node.fen, true);
      const dbKey = 'lichessTools/evalCache/'+key;
      const value = await lt.storage.get(dbKey,{ db: true, raw: true });
      if (!value || node.ceval?.depth > value.depth) return;
      const ceval = node.ceval || { 
                                    fen: node.fen,
                                    pvs: [ { moves:[],cp:value.cp,mate:value.mate } ]
                                  };
      const newVal = { ...ceval, ... value };
      if (lt.global.JSON.stringify(newVal)!=lt.global.JSON.stringify(node.ceval)) {
        node.ceval = newVal;
        lt.analysisRedraw();
      }
    }

    handleCeval = async (args)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const [data,meta] = args;
      const key = analysis.ceval.storedPv()+'|'+analysis.ceval.engines.active()?.id+'|'+analysis.variantKey+'|'+lt.getPositionFromFen(data.fen, true);
      const dbKey = 'lichessTools/evalCache/'+key;
      let value = await lt.storage.get(dbKey,{ db: true, raw: true });
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
    };

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
      lt.pubsub.off('lichessTools.ceval',this.handleCeval);
      if (this.options.enabled) {
        lt.uiApi.events.on('ply', this.handlePly);
        lt.pubsub.on('lichessTools.ceval',this.handleCeval);
      }
    }

  }
  LiChessTools.Tools.CevalCache = CevalCacheTool;
})();

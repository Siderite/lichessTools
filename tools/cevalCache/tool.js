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
      if (!analysis.ceval) return;
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
      const [data,meta] = args;
      data.time = Date.now();

      const { dbKey, data: existingData } = await this.getCeval(data.fen);
      if (data.depth <= 20 || data.depth <= existingData?.depth) return;
      try {
        await lt.storage.set(dbKey,data,{ db: true, raw: true });
      } catch(e) {
        if (e.name === "QuotaExceededError") {
          const dbStorage = lt.storage.getStore({ db: true, raw: true });
          dbStorage.removeAllBy(dbKey,'time','upperBound',Date.now()-86400*1000*30);
          await lt.storage.set(dbKey,data,{ db: true, raw: true });
        }
      };
    };

    getCeval = async (fen)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const key = analysis.ceval.storedPv()+'|'+analysis.ceval.engines.active()?.id+'|'+analysis.variantKey+'|'+lt.getPositionFromFen(fen, true);
      const dbKey = 'lichessTools/evalCache/'+key;
      const data = await lt.storage.get(dbKey,{ db: true, raw: true });
      return { dbKey, data };
    };

    clearCache = async (ev) => {
      const lt = this.lichessTools;
      const dbStorage = lt.storage.getStore({ db: true, raw: true });
      await dbStorage.clearStore('lichessTools/evalCache');
      lt.global.console.debug('Ceval cache cleared');
    };

    bindClearData = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const buttonText = lichessTools.translator.noarg('clearLocalData');
      if (!buttonText) {
        lt.global.console.warn('Could not determine clearLocalData translation string!');
      }
      const button = $(`.action-menu__tools [data-icon="${lt.icon.Trash}"]`)
                        .filter((i,e)=>$(e).text()==buttonText);
      if (button.prop('__initClearData')) return;
      button.prop('__initClearData',true)
            .each((i,el)=>{
              el.addEventListener('click', this.clearCache, { capture: true });
            });
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
      $('body').observer()
        .off('.action-menu__tools',this.bindClearData);
      if (this.options.enabled) {
        lt.uiApi.events.on('ply', this.handlePly);
        lt.pubsub.on('lichessTools.ceval',this.handleCeval);
        $('body').observer()
          .on('.action-menu__tools',this.bindClearData);
      }
    }

  }
  LiChessTools.Tools.CevalCache = CevalCacheTool;
})();

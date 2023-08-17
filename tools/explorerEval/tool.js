(()=>{
  class ExplorerEvalTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'explorerEval',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerEval': 'Show evaluation of explorer moves',
        'notAllowedByCSP': 'Lichess does not allow connection to chessdb'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator',
        'notAllowedByCSP': 'Lichess nu permite conexiunea la chessdb'
      }
    }

    showEvaluations(result) {
      const moves=result?.moves;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const container=$('section.explorer-box table.moves');
      if (!container.length) return;
      if ($('th',container).length==3) {
        $('<th>')
            .addClass('lichessTools-explorerEval')
            .insertAfter($('th:nth-child(1)',container));
      }
      $('tr[data-uci],tr.sum',container).each((i,e)=>{
        if ($('td',e).length==4) {
          $('<td>')
            .addClass('lichessTools-explorerEval')
            .insertAfter($('td:nth-child(1)',e));
        }
        const uci=$(e).attr('data-uci');
        const move=moves?.find(m=>m.uci==uci);
        if (!move) return;
        const explorerItem=(analysis.explorer.current()?.moves||[]).find(i=>i.uci==uci);
        if (explorerItem) {
          explorerItem.cp=move.cp;
          explorerItem.mate=move.mate;
        }
        const text=move.mate?('M'+move.mate):(Math.round(move.cp/10)/10);
        $('td.lichessTools-explorerEval',e)
          .text(text)
          .toggleClass('lichessTools-bad',move.rank===0)
          .toggleClass('lichessTools-good',move.rank===1)
          .toggleClass('lichessTools-best',move.rank===2);
      });
    }

    cache={};
    doEvaluation=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const fen=analysis.node.fen;
      const whosMove=analysis.node.ply%2?-1:1;
      let result = this.cache[fen];
      if (this.CSP) {
        const ceval=analysis.ceval?.curEval || analysis.ceval?.lastStarted?.steps?.at(-1)?.ceval;
        const pvs=ceval?.pvs;
        if (pvs) {
          const prevDepth=+(result?.depth);
          if (!(prevDepth>ceval.depth)) {
            result={
              depth: ceval.depth,
              moves: pvs.map(p=>{
                return {
                  uci: p.moves?.at(0),
                  cp: p.cp,
                  mate: p.mate,
                  rank: null
                };
              })
            };
            this.cache[fen]=result;
          }
        }
      } else {
        if (result) {
          this.showEvaluations(result);
          return;
        }
        const json=await parent.net.fetch({
          url:'https://www.chessdb.cn/cdb.php?action=queryall&board={fen}&json=1',
          args:{ fen: fen }
        });
        const obj=parent.global.JSON.parse(json);
        result={
          depth: 50, //assumed
          moves: obj.moves?.map(m=>{
            return {
              uci: m.uci,
              cp: m.winrate?whosMove*m.score:null,
              mate:m.winrate?null:whosMove*Math.sign(m.score)*(30000-Math.abs(m.score)),
              rank: m.rank
            };
          })
        };
        if (result) {
          this.cache[fen]=result;
        }
      }
      this.showEvaluations(result);
    };
    doEvaluationDebounced=this.lichessTools.debounce(this.doEvaluation,100);

    rebind=()=>{
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerEval');
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      if (!value) {
        explorer.setNode=parent.unwrapFunction(explorer.setNode,'explorerEval');
      } else {
        if (!parent.isWrappedFunction(explorer.setNode,'explorerEval')) {
          explorer.setNode=parent.wrapFunction(explorer.setNode,{
            id: 'explorerEval',
            after: async ($this, result, ...args)=>{
              if (!explorer.lastStream) return;
              await explorer.lastStream.promise;
              this.doEvaluationDebounced();
            }
          });
        }
        this.doEvaluationDebounced();
      }
    };

    CSP=true; // defaults to true until lichess allows chessdb.cn connections
    secCheck=e=>{
      if (this.CSP) return;
      if (!e.blockedURI?.includes('chessdb.cn')) {
        this.CSP=false;
        return;
      }
      this.CSP=true;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const text=trans.noarg('notAllowedByCSP');
      lichess.announce({ msg: text });
      this.doEvaluationDebounced();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerEval');
      this.logOption('Explorer eval', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      lichess.pubsub.off('redraw',this.rebind);
      $(parent.global.document).off('securitypolicyviolation',this.secCheck)
      if (!value) return;
      $(parent.global.document).on('securitypolicyviolation',this.secCheck);
      lichess.pubsub.on('redraw',this.rebind);
      this.rebind();
    }

  }
  LiChessTools.Tools.ExplorerEval=ExplorerEvalTool;
})();

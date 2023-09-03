(()=>{
  class ExplorerEvalTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'explorerEval',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['ceval','stats'],
        defaultValue: 'ceval',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerEval': 'Show evaluation of explorer moves',
        'notAllowedByCSP': 'Lichess does not allow connection to chessdb',
        'explorerEval.ceval': 'From computer eval',
        'explorerEval.stats': 'From winning stats',
        'fromCevalTitle': 'LiChess Tools - from computer eval',
        'fromStatsTitle': 'LiChess Tools - from winning stats',
        'evaluationTitle': 'LiChess Tools - move evaluation'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator',
        'notAllowedByCSP': 'Lichess nu permite conexiunea la chessdb',
        'explorerEval.ceval': 'Din evaluare computer',
        'explorerEval.stats': 'Din statistici',
        'fromCevalTitle': 'LiChess Tools - din evaluare computer',
        'fromStatsTitle': 'LiChess Tools - din statistici',
        'evaluationTitle': 'LiChess Tools - evaluare mutare'
      }
    }

    showEvaluations(result) {
      const moves=result?.moves;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      const container=$('section.explorer-box table.moves');
      if (!container.length) return;
      if ($('th',container).length==3) {
        $('<th>')
            .addClass('lichessTools-explorerEval')
            .text('E')
            .attr('title',trans.noarg('evaluationTitle'))
            .insertAfter($('th:nth-child(1)',container));
      }
      $('tr[data-uci],tr.sum',container).each((i,e)=>{
        if ($('td',e).length==4) {
          $('<td>')
            .addClass('lichessTools-explorerEval')
            .insertAfter($('td:nth-child(1)',e));
        }
        const uci=$(e).attr('data-uci');
        let move=moves?.find(m=>m.uci==uci);
        const explorerItem=(analysis.explorer.current()?.moves||[]).find(i=>i.uci==uci);
        if (!explorerItem) return;
        let text='';
        let rank=-1;
        let title=null;
        if (move) {
          text=move.mate?('M'+move.mate):(Math.round(move.cp/10)/10);
          title=trans.noarg('fromCevalTitle');
          rank=move.rank;
          explorerItem.cp=move.cp;
          explorerItem.mate=move.mate;
        } else if (this.options.stats) {
          const wr=(explorerItem.white+explorerItem.draws/2)/(explorerItem.white+explorerItem.draws+explorerItem.black);
          let cp = -Math.log(1/wr-1)*330
          if (Number.isFinite(cp)) {
            text=Math.round(cp/10)/10;
          } else {
            cp=Math.sign(cp)*10000;
          }
          title=trans.noarg('fromStatsTitle');
          explorerItem.cp=cp;
          explorerItem.mate=undefined;
        }
        $('td.lichessTools-explorerEval',e)
          .text(text)
          .attr('title',title)
          .toggleClass('lichessTools-stat',rank===-1)
          .toggleClass('lichessTools-bad',rank===0)
          .toggleClass('lichessTools-good',rank===1)
          .toggleClass('lichessTools-best',rank===2);
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
        const pvs=this.options.ceval
          ? ceval?.pvs
          : null;
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
      this.options={
        ceval: parent.isOptionSet(value,'ceval'),
        stats: parent.isOptionSet(value,'stats'),
        get isSet() { return this.ceval || this.stats; }
      };
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      lichess.pubsub.off('redraw',this.rebind);
      $(parent.global.document).off('securitypolicyviolation',this.secCheck)
      if (!this.options.isSet) return;
      $(parent.global.document).on('securitypolicyviolation',this.secCheck);
      lichess.pubsub.on('redraw',this.rebind);
      this.rebind();
    }

  }
  LiChessTools.Tools.ExplorerEval=ExplorerEvalTool;
})();

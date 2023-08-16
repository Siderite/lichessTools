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
        'options.explorerEval': 'Show evaluation of explorer moves'      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator'
      }
    }

    showEvaluations(moves) {
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
        const text=move.mate?('M'+move.mate):(Math.round(move.cp/10)/10);
        $('td.lichessTools-explorerEval',e)
          .text(text)
          .toggleClass('lichessTools-bad',move.rank==0)
          .toggleClass('lichessTools-good',move.rank==1)
          .toggleClass('lichessTools-best',move.rank==2);
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
      if (result) {
        this.showEvaluations(result);
        return;
      }
      const json=await parent.net.fetch({
        url:'https://www.chessdb.cn/cdb.php?action=queryall&board={fen}&json=1',
        args:{ fen: fen }
      });
      const obj=parent.global.JSON.parse(json);
      result=obj.moves?.map(m=>{
        return {
          uci: m.uci,
          san: m.san,
          cp: m.winrate?whosMove*m.score:null,
          mate:m.winrate?null:whosMove*Math.sign(m.score)*(30000-Math.abs(m.score)),
          rank: m.rank
        };
      });
      this.cache[fen]=result;
      this.showEvaluations(result);
    };

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
              this.doEvaluation();
            }
          });
        }
        this.doEvaluation();
      }
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
      if (!value) return;
      lichess.pubsub.on('redraw',this.rebind);
      this.rebind();
    }

  }
  LiChessTools.Tools.ExplorerEval=ExplorerEvalTool;
})();

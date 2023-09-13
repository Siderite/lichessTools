(()=>{
  class ExplorerEvalTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'explorerEval',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['ceval','db','stats'],
        defaultValue: 'ceval,db',
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
        'explorerEval.db': 'From cloud',
        'fromCevalTitle': 'LiChess Tools - from computer eval',
        'fromStatsTitle': 'LiChess Tools - from winning stats',
        'fromChessDbTitle': 'LiChess Tools - from ChessDb',
        'fromLichessTitle': 'LiChess Tools - from cloud',
        'evaluationTitle': 'LiChess Tools - move evaluation'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator',
        'notAllowedByCSP': 'Lichess nu permite conexiunea la chessdb',
        'explorerEval.ceval': 'Din evaluare computer',
        'explorerEval.stats': 'Din statistici',
        'explorerEval.db': 'Din cloud',
        'fromCevalTitle': 'LiChess Tools - din evaluare computer',
        'fromStatsTitle': 'LiChess Tools - din statistici',
        'fromChessDbTitle': 'LiChess Tools - de la ChessDb',
        'fromLichessTitle': 'LiChess Tools - din cloud',
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
          rank=move.rank;
          switch(rank) {
            case null: title=trans.noarg('fromCevalTitle'); break;
            case 1: 
            case 2: 
            case 3: 
              title=trans.noarg('fromChessDbTitle'); 
            break;
            case 5: title=trans.noarg('fromLichessTitle'); break;
          }
          
          explorerItem.cp=move.cp;
          explorerItem.mate=move.mate;
        } else if (this.options.stats) {
          const total=explorerItem.white+explorerItem.draws+explorerItem.black;
          const wr=(explorerItem.white+explorerItem.draws/2)/total;
          let cp = -Math.log(1/wr-1)*330
          if (Number.isFinite(cp)) {
            if (total>=100) {
              title=trans.noarg('fromStatsTitle');
              text=Math.round(cp/10)/10;
            }
          } else {
            cp=Math.sign(cp)*10000;
          }
          explorerItem.cp=cp;
          explorerItem.mate=undefined;
        }
        $('td.lichessTools-explorerEval',e)
          .text(text)
          .attr('title',title)
          .toggleClass('lichessTools-stat',rank===-1)
          .toggleClass('lichessTools-bad',rank===0)
          .toggleClass('lichessTools-good',rank===1)
          .toggleClass('lichessTools-best',rank===2)
          .toggleClass('lichessTools-cloud',rank===5);
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
          if (!result) {
            result={
              moves: []
            };
          }
          pvs.forEach(p=>{
            const uci=p.moves?.at(0);
            const existingMove=result.moves.find(m=>m.uci==uci);
            if (existingMove&&ceval.depth>existingMove.depth) {
              existingMove.depth=ceval.depth;
              existingMove.cp=p.cp;
              existingMove.mate=p.mate;
            } else {
              result.moves.push({
                depth: ceval.depth,
                uci: uci,
                cp: p.cp,
                mate: p.mate,
                rank: null
              });
            }
          });
          this.cache[fen]=result;
        } else if (this.options.db) {
          if (result) {
            this.showEvaluations(result);
            return;
          }
          const json=await parent.net.fetch({
            url:'/api/cloud-eval?fen={fen}&multiPv=5',
            args:{ fen: fen }
          },{
            ignoreStatuses:[404]
          }).catch(e=>console.debug('Error getting cloud eval',e));
          if (json) {
            const obj=parent.global.JSON.parse(json);
            result={
              moves: obj?.pvs?.map(m=>{
                return {
                  depth: obj.depth,
                  uci: m.moves?.split(' ')[0],
                  cp: m.cp,
                  mate: m.mate,
                  rank: 5
                };
              })
            };
            if (result.moves) {
              const json=await parent.net.fetch({
                url:'/api/cloud-eval?fen={fen}&multiPv=10',
                args:{ fen: fen }
              },{
                ignoreStatuses:[404]
              }).catch(e=>console.debug('Error getting cloud eval',e));
              if (json) {
                const obj=parent.global.JSON.parse(json);
                obj.pvs?.forEach(m=>{
                  const uci=m.moves?.split(' ')[0];
                  if (result.moves.find(rm=>rm.uci==uci)) return;
                  result.moves.push({
                    depth: obj.depth,
                    uci: uci,
                    cp: m.cp,
                    mate: m.mate,
                    rank: 5
                  });
                });
              }
            }
            if (result.moves) {
              this.cache[fen]=result;
            }
          }
        }
      } else if (this.options.db) {
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
          moves: obj.moves?.map(m=>{
            return {
              depth: 50, //assumed
              uci: m.uci,
              cp: m.winrate?whosMove*m.score:null,
              mate:m.winrate?null:whosMove*Math.sign(m.score)*(30000-Math.abs(m.score)),
              rank: m.rank
            };
          })
        };
        if (result.moves?.length) {
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
        db: parent.isOptionSet(value,'db'),
        get isSet() { return this.ceval || this.db || this.stats; }
      };
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      lichess.pubsub.off('redraw',this.rebind);
      $(parent.global.document).off('securitypolicyviolation',this.secCheck)
      if (!this.options.isSet) return;
      this.cache={};
      $(parent.global.document).on('securitypolicyviolation',this.secCheck);
      lichess.pubsub.on('redraw',this.rebind);
      this.rebind();
    }

  }
  LiChessTools.Tools.ExplorerEval=ExplorerEvalTool;
})();

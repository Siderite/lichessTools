(()=>{
  class ExplorerEvalTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','ChessOps'];

    preferences=[
      {
        name:'explorerEval',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['ceval','db','lichess','stats','evalRows','hidden'],
        defaultValue: 'ceval,db',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerEval': 'Show evaluation of explorer moves',
        'explorerEval.ceval': 'From computer eval',
        'explorerEval.stats': 'From winning stats',
        'explorerEval.db': 'From ChessDb',
        'explorerEval.lichess': 'From Lichess',
        'explorerEval.evalRows': 'Rows from eval',
        'explorerEval.hidden': 'Hidden',
        'fromCevalTitle': 'LiChess Tools - from computer eval, depth %s',
        'fromStatsTitle': 'LiChess Tools - from winning stats',
        'fromChessDbTitle': 'LiChess Tools - from ChessDb',
        'fromLichessTitle': 'LiChess Tools - from Lichess, depth %s',
        'evaluationTitle': 'LiChess Tools - move evaluation',
        'evalWarning': 'LiChess Tools - pay attention',
        'sharpnessTitle': 'Sharpness: %s'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator',
        'explorerEval.ceval': 'Din evaluare computer',
        'explorerEval.stats': 'Din statistici',
        'explorerEval.db': 'De la ChessDb',
        'explorerEval.lichess': 'De la Lichess',
        'explorerEval.evalRows': 'R\u00e2nduri din evaluare',
        'explorerEval.hidden': 'Ascunde',
        'fromCevalTitle': 'LiChess Tools - din evaluare computer, ad\u00e2ncime %s',
        'fromStatsTitle': 'LiChess Tools - din statistici',
        'fromChessDbTitle': 'LiChess Tools - de la ChessDb',
        'fromLichessTitle': 'LiChess Tools - de la Lichess, ad\u00e2ncime %s',
        'evaluationTitle': 'LiChess Tools - evaluare mutare',
        'evalWarning': 'LiChess Tools - aten\u0163ie',
        'sharpnessTitle': 'Periculozitate: %s'
      }
    }

    showEvaluations(result) {
      const moves=result?.moves;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      const orientation=analysis.getOrientation()=='black'?-1:1;
      $('section.explorer-box table.moves.lichessTools-evalTable').remove();
      let container=$('section.explorer-box table.moves');
      if (!container.length) {
        if (this.options.evalRows && moves?.length) {
          const dataElem=$('section.explorer-box div.data');
          $('div.message',dataElem).remove();
          container=$('<table class="moves lichessTools-evalTable">')
            .append(
              $('<tbody>')
                .attr('data-fen',analysis.node.fen)
                .on("mouseover", ev=>{
                  const uci=$(ev.target).parents("tr").attr("data-uci");
                  analysis.explorer.setHovering($(ev.currentTarget).attr("data-fen"), uci);
                })
                .on("mouseout", ev=>{
                  analysis.explorer.setHovering($(ev.currentTarget).attr("data-fen"), null);
                })
                .on("click", ev=>{
                  const uci=$(ev.target).parents("tr").attr("data-uci");
                  analysis.explorerMove(uci);
                })
            )
            .appendTo(dataElem);
          dataElem.removeClass('empty');
        } else {
          return;
        }
      }
      if (parent.isGamePlaying()) return;
      if (!$('th.lichessTools-explorerEval',container).length) {
        $('<th>')
            .addClass('lichessTools-explorerEval')
            .text('\u2924')
            .attr('title',trans.noarg('evaluationTitle'))
            .insertAfter($('th:nth-child(1)',container));
      }
      $('tr:has(.lichessTools-evalRow)',container).remove();
      if (this.options.evalRows && moves?.length) {
        const co=parent.chessops;
        const newRows=moves.filter(m=>!$('tr[data-uci="'+m.uci+'"]',container).length);
        const fen=co.fen.parseFen(analysis.node.fen).unwrap();
        const ch=co.Chess.fromSetup(fen).unwrap();
        const sumElem=$('tr.sum',container);
        for (const newRow of newRows) {
          const uci=newRow.uci;
          const move=co.parseUci(uci);
          const san=co.san.makeSan(ch,move);
          if ($('td',container).filter((i,e)=>$(e).text()==san).length) continue; //castling can be identified by multiple ucis (i.e. e1g1, e1h1)
          const newTr=$('<tr>')
            .attr('data-uci',uci)
            .append($('<td>').text(san))
            .append($('<td colspan="100" class="lichessTools-evalRow">'));
          if (sumElem.length) {
            newTr.insertBefore(sumElem);
          } else {
            newTr.appendTo($('tbody',container));
          }
        }
      }
      const decimals=+parent.currentOptions.getValue('cevalDecimals')||1;
      $('tr[data-uci],tr.sum',container).each((i,e)=>{
        if (!$('td.lichessTools-explorerEval',e).length) {
          $('<td>')
            .addClass('lichessTools-explorerEval')
            .insertAfter($('td:nth-child(1)',e));
        }
        const uci=$(e).attr('data-uci');
        let move=moves?.find(m=>m.uci==uci);
        let explorerItem=(analysis.explorer.current()?.moves||[]).find(i=>i.uci==uci);
        if (!explorerItem) {
          if (this.options.evalRows && moves?.length) {
            explorerItem={};
          } else {
            return;
          }
        }

        const total=explorerItem.white+explorerItem.draws+explorerItem.black;
        const wr=(explorerItem.white+explorerItem.draws/2)/total;
        let cp = -Math.log(1/wr-1)*330
        const isInfinite=!Number.isFinite(cp);
        if (isInfinite) {
          cp=Math.sign(cp)*10000;
        }

        const q=1000/total;        
        const sharpness = Math.round(Math.min(explorerItem.white,explorerItem.black)*q/50*333/(explorerItem.draws*q+1)*1/(1+Math.exp(-(explorerItem.white+explorerItem.black)*q/1000)));
        if (sharpness&&Number.isFinite(sharpness)) {
          const sharpnessTitle = trans.pluralSame('sharpnessTitle',sharpness);
          const tdBar=$('td:has(div.bar)',e);
          const tdTitle=tdBar.attr('title')?.split(' / ')?.at(0)+' / '+sharpnessTitle;
          tdBar.attr('title',tdTitle);
        }

        let text='';
        let rank=-1;
        let title=null;
        if (move) {
          text=move.mate?('M'+move.mate):(move.cp/100).toFixed(decimals);
          rank=move.rank;
          switch(rank) {
            case null: title=trans.pluralSame('fromCevalTitle',move.depth); break;
            case 0: 
            case 1: 
            case 2: 
            case 3: 
              title=trans.noarg('fromChessDbTitle'); 
            break;
            case 5: title=trans.pluralSame('fromLichessTitle',move.depth); break;
          }
          
          explorerItem.cp=move.cp;
          explorerItem.mate=move.mate;

          if (total>=100) {
            const moveCp=move.mate?Math.sign(move.mate)*(10000-Math.abs(move.mate)*100):move.cp;
            const sim=Math.round(Math.abs(moveCp-cp)/(Math.abs(moveCp)+Math.abs(cp))*100);
            if (sim>=20) {
              explorerItem.diff=Math.abs(moveCp-cp);
              explorerItem.signVal=orientation*(Math.abs(moveCp)>Math.abs(cp)
                ? moveCp
                : cp);
            }
          }
        } else if (this.options.stats) {
          if (!isInfinite&&total>=100) {
            title=trans.noarg('fromStatsTitle');
            text=(cp/100).toFixed(decimals);
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
        $('td.lichessTools-evalRow',e)
          .text(title);
        $(e)
          .removeClass('lichessTools-warning-red')
          .removeClass('lichessTools-warning-green')
          .removeClass('lichessTools-warning-blue')
          .removeAttr('title');
        if (explorerItem.diff>200) {
          $(e)
            .addClass(explorerItem.signVal<0?'lichessTools-warning-red':'lichessTools-warning-green')
            .attr('title',trans.noarg('evalWarning'));
        }
        if (sharpness>=100) {
          $(e)
            .addClass('lichessTools-warning-blue')
            .attr('title',trans.noarg('evalWarning'));
        }
      });
    }

    cache404={};
    setCached404= (path)=>path?this._setCached404(path,this.cache404):false;
    getCached404= (path)=>path?this._getCached404(path,this.cache404):false;
    _setCached404= (path,node)=>{
      if (node===true) return;
      const key=path?.slice(0,2);
      if (key) {
        let newNode=node[key];
        if (!newNode) {
          if (path==key) {
            node[key]=true;
            return;
          }
          newNode={};
          node[key]=newNode;
        }
        this._setCached404(path?.slice(2),newNode);
      }
    };
    _getCached404= (path,node)=>{
      const key=path?.slice(0,2);
      if (!key) {
        return false;
      }
      const newNode=node[key];
      if (newNode===true) return true;
      if (!newNode) {
        return false;
      }
      return this._getCached404(path?.slice(2),newNode);
    };

    cache={};
    doEvaluation=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis.explorer?.enabled()) return;
      if (parent.isGamePlaying()) return;
      const explorerMoves = analysis.explorer?.current()?.moves;
      if (!this.options.evalRows) {
        if (!explorerMoves?.length) return;
        if (!parent.inViewport($('section.explorer-box table.moves'))) {
          this.doEvaluationDebounced();
          return;
        }
      } else {
        if (!parent.inViewport($('section.explorer-box'))) {
          this.doEvaluationDebounced();
          return;
        }
      }
      $('table.moves tr.sum td.lichessTools-explorerEval').remove();
      const fen=analysis.node.fen;
      const whosMove=analysis.node.ply%2?-1:1;
      let result = this.cache[fen];
      if (this.getCached404(analysis.path)) {
        result={ moves:[] };
      }
      let newMoves=[];
      if ((this.options.db||this.options.lichess) && !parent.net.slowMode && result===undefined && (!this.options.ceval || !analysis.ceval.enabled())) {
        result={ moves: [] };
        if (this.options.db && !newMoves?.length) {
          const obj=await parent.api.evaluation.getChessDb(fen);
          newMoves=obj?.moves?.map(m=>{
            return {
              depth: 50, //assumed
              uci: m.uci,
              cp: m.winrate?whosMove*m.score:null,
              mate:m.winrate?null:whosMove*Math.sign(m.score)*(30000-Math.abs(m.score)),
              rank: m.rank
            };
          });
        }
        if (this.options.lichess && !newMoves?.length) {
          let obj=await parent.api.evaluation.getLichess(fen,5);
          if (obj) {
            newMoves=obj?.pvs?.map(m=>{
              return {
                depth: obj.depth,
                uci: m.moves?.split(' ')[0],
                cp: m.cp,
                mate: m.mate,
                rank: 5
              };
            });
            if (newMoves?.length && !parent.net.slowMode) {
              obj=await parent.api.evaluation.getLichess(fen,10);
              if (obj) {
                obj.pvs?.forEach(m=>{
                  const uci=m.moves?.split(' ')[0];
                  if (newMoves.find(nm=>nm.uci==uci)) return;
                  newMoves.push({
                    depth: obj.depth,
                    uci: uci,
                    cp: m.cp,
                    mate: m.mate,
                    rank: 5
                  });
                });
              }
            }
          }
        } 
        if (newMoves?.length) {
          newMoves.forEach(nm=>{
            const uci=nm.moves?.at(0);
            const existingMove=result.moves.find(m=>m.uci==uci);
            if (existingMove) {
              if (nm.depth>existingMove.depth) {
                existingMove.depth=nm.depth;
                existingMove.cp=nm.cp;
                existingMove.mate=nm.mate;
              }
            } else {
              result.moves.push(nm);
            }
          });
        } else {
          this.setCached404(analysis.path);
        }
      }
      result = result || { moves: [] };
      const ceval=analysis.ceval?.curEval || analysis.ceval?.lastStarted?.steps?.at(-1)?.ceval;
      const pvs=this.options.ceval && ceval?.fen==analysis.node.fen
        ? ceval?.pvs
        : null;
      if (pvs?.length) {
        pvs.forEach(p=>{
          const uci=p.moves?.at(0);
          const existingMove=result.moves.find(m=>m.uci==uci);
          if (existingMove) {
            if (ceval.depth>existingMove.depth) {
              existingMove.depth=ceval.depth;
              existingMove.cp=p.cp;
              existingMove.mate=p.mate;
              existingMove.rank=null;
            }
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
      }
      if (result.moves?.length) {
        this.cache[fen]=result;
      }
      this.showEvaluations(result);
    };
    doEvaluationDebounced=this.lichessTools.debounce(this.doEvaluation,100);

    rebind=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      if (!this.options.isSet) {
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
      if (!this.options.ceval) {
        analysis.onNewCeval=parent.unwrapFunction(analysis.onNewCeval,'explorerEval');
      } else {
        if (!parent.isWrappedFunction(analysis.onNewCeval,'explorerEval')) {
          analysis.onNewCeval=parent.wrapFunction(analysis.onNewCeval,{
            id: 'explorerEval',
            after: async ($this, result, ...args)=>{
              this.doEvaluationDebounced();
            }
          });
        }
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerEval');
      this.logOption('Explorer eval', value);
      this.options={
        ceval: parent.isOptionSet(value,'ceval'),
        stats: parent.isOptionSet(value,'stats'),
        db: parent.isOptionSet(value,'db') || parent.isOptionSet(value,'chessdb'),
        lichess: parent.isOptionSet(value,'lichess'),
        evalRows: parent.isOptionSet(value,'evalRows'),
        hidden: parent.isOptionSet(value,'hidden'),
        get isSet() { return !this.hidden && (this.ceval || this.db || this.lichess || this.stats || this.evalRows); }
      };
      const lichess=parent.lichess;
      const $=parent.$;
      const explorer=lichess?.analysis?.explorer;
      if (!explorer) return;
      lichess.pubsub.off('lichessTools.redraw',this.rebind);
      $('th.lichessTools-explorerEval,td.lichessTools-explorerEval').remove();
      explorer.setNode=parent.unwrapFunction(explorer.setNode,'explorerEval');
      if (!this.options.isSet) return;
      this.cache={};
      lichess.pubsub.on('lichessTools.redraw',this.rebind);
      this.rebind();
    }

  }
  LiChessTools.Tools.ExplorerEval=ExplorerEvalTool;
})();

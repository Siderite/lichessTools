(()=>{
  class ExplorerGambitsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','ChessOps'];

    preferences=[
      {
        name:'explorerGambits',
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
        'options.explorerGambits': 'Show explorer moves leading to gambits',
        'gambitTitle':'LiChessTools - Number of possible gambits',
        'gambitRowTitle':'%s gambits'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerGambits': 'Arat\u0103 mut\u0103ri \u00een Explorator care duc la gambituri',
        'gambitTitle':'LiChessTools - Num\u0103r de gambituri posibile',
        'gambitRowTitle':'%s gambituri'
      }
    }

    computeFen=(fen,uci)=>{
      const co=this.lichessTools.chessops;
      fen=co.fen.parseFen(fen).unwrap();
      const ch=co.Chess.fromSetup(fen).unwrap();
      ch.play(co.parseUci(uci));
      return co.fen.makeFen(ch.toSetup());
    };

    showGambits(result) {
      const moves=result?.moves;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      const container=$('section.explorer-box table.moves');
      if (!container.length) return;
      if (parent.isGamePlaying()) return;
      if (!result?.total) {
        $('.lichessTools-explorerGambits',container).remove();
        return;
      }
      if (!$('th.lichessTools-explorerGambits',container).length) {
        $('<th>')
          .addClass('lichessTools-explorerGambits')
          .text('\u2604')
          .attr('title',trans.noarg('gambitTitle'))
          .appendTo($('thead tr',container));
      }
      const side=analysis.getOrientation();
      const fen=analysis.node.fen;
      let sum=0;
      $('tr[data-uci]',container).each((i,e)=>{
        if ($('td:has(div.bar)',e).addClass('lichessTools-bar').length) {
          if (!$('td.lichessTools-explorerGambits',e).length) {
            $('<td>')
              .addClass('lichessTools-explorerGambits')
              .appendTo(e);
          }
        }
        const uci=$(e).attr('data-uci');
        let move=null;
        if (uci) {
          const moveFen=this.computeFen(fen,uci);
          const pos=moveFen.split(' ').slice(0,2).join('').replaceAll('/','');
          const moveResult=parent.gambit_dict[side].get(pos);
          move=moveResult
            ? {
                uci:uci,
                nr: moveResult.total||1
              }
            : moves?.find(m=>m.uci==uci);
        }
        const explorerItem=(analysis.explorer.current()?.moves||[]).find(i=>i.uci==uci);
        let text='';
        let title=undefined;
        if (!explorerItem) return;
        if (move) {
          const nr=move.nr||1;
          title=trans.pluralSame('gambitRowTitle',nr);
          text=nr;
          sum+=nr;
        }
        $('td.lichessTools-explorerGambits',e)
          .text(text)
          .attr('title',title);
      });
      $('tr.sum',container).each((i,e)=>{
        $('td:has(div.bar)',e).addClass('lichessTools-bar');
        if (!$('td.lichessTools-explorerGambits',e).length) {
          $('<td>')
            .addClass('lichessTools-explorerGambits')
            .appendTo(e);
        }
        const title=trans.pluralSame('gambitRowTitle',sum);
        const text=sum;
        $('td.lichessTools-explorerGambits',e)
          .text(text)
          .attr('title',title);
      });
    }

    cache={};
    findGambits=async ()=>{
      if (!this.options.enabled) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis.explorer?.enabled()) return;
      if (parent.isGamePlaying()) return;
      const explorerMoves = analysis.explorer?.current()?.moves;
      if (!explorerMoves?.length) return;
      if (!parent.inViewport($('section.explorer-box table.moves'))) return;
      const fen=analysis.node.fen;
      const side=analysis.getOrientation();
      const pos=analysis.node.fen.split(' ').slice(0,2).join('').replaceAll('/','');
      const result=parent.gambit_dict[side].get(pos);
      this.showGambits(result);
    };
    findGambitsDebounced=this.lichessTools.debounce(this.findGambits,100);

    checkGambits=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      if (!this.options.enabled) {
        explorer.setNode=parent.unwrapFunction(explorer.setNode,'explorerGambits');
      } else {
        if (!parent.isWrappedFunction(explorer.setNode,'explorerGambits')) {
          explorer.setNode=parent.wrapFunction(explorer.setNode,{
            id: 'explorerGambits',
            after: async ($this, result, ...args)=>{
              if (!explorer.lastStream) return;
              await explorer.lastStream.promise;
              this.findGambitsDebounced();
            }
          });
        }
        this.findGambitsDebounced();
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerGambits');
      this.logOption('Explorer gambits', value);
      this.options={ enabled: value };
      const lichess=parent.lichess;
      const $=parent.$;
      const explorer=lichess?.analysis?.explorer;
      if (!explorer) return;
      lichess.pubsub.off('redraw',this.checkGambits);
      $('th.lichessTools-explorerGambits,td.lichessTools-explorerGambits').remove();
      explorer.setNode=parent.unwrapFunction(explorer.setNode,'explorerGambits');
      if (!value) return;
      lichess.pubsub.on('redraw',this.checkGambits);
      this.checkGambits();
    }

  }
  LiChessTools.Tools.ExplorerGambits=ExplorerGambitsTool;
})();

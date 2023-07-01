(()=>{
  class StickyAnalysisTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'stickyAnalysis',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.stickyAnalysis': 'Autosave analysis for reload'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.stickyAnalysis': 'Salveaz\u0103 automat analiza pentru re\u00eencarcare'
      }
    }

    saveAnalysisPgn=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      let pgn=$('.analyse__underboard .pgn textarea').val();
      if (!pgn) return;
      if (lichess.analysis.getOrientation()!="white") {
        pgn='[Orientation "Black"]\r\n[StartFlipped "1"]\r\n'+pgn;
      }
      if (this.prevPgn===pgn) return;
      const savedPgn=parent.currentOptions.getValue('prevAnalysis');
      if (savedPgn!=pgn) {
        parent.currentOptions.prevAnalysis=pgn;
        parent.saveOptions(parent.currentOptions);
      }
      this.prevPgn=pgn;
      $('div.analyse__underboard .pgn .lichessTools-reloadPGN').toggle(!!pgn);
    }

    retrievePgn=()=> {
      const parent=this.lichessTools;
      const savedPgn=parent.currentOptions.getValue('prevAnalysis');
      if (!savedPgn) return;
      $('.analyse__underboard .pgn textarea').val(savedPgn);
      lichess.analysis.pgnInput=savedPgn;
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('stickyAnalysis');
      this.logOption('Sticky analysis', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      if (analysis.study) return;
      const trans=parent.translator;
      $('div.analyse__underboard .pgn .lichessTools-reloadPGN').remove();
      lichess.pubsub.off('redraw',this.saveAnalysisPgn);
      if (!value) return;
      lichess.pubsub.on('redraw',this.saveAnalysisPgn);
      const text=trans.noarg('reloadPgnText');
      const title=trans.noarg('reloadPgnTitle');
      const reloadPgnButton = $('<button class="button button-thin action text" data-icon="&#xE043;">')
        .hide()
        .addClass('lichessTools-reloadPGN')
        .text(text)
        .attr('title',title)
        .on('click',this.retrievePgn)
        .insertBefore('div.analyse__underboard .pgn button[data-icon="\uE03A"]');
      const savedPgn=parent.currentOptions.getValue('prevAnalysis');
      if (savedPgn) {
        if (analysis.tree.root.children?.length==0) this.retrievePgn();
        reloadPgnButton.show();
      }
    }

  }
  LiChessTools.Tools.StickyAnalysis=StickyAnalysisTool;
})();

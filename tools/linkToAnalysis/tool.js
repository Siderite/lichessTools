(() => {
  class LinkToAnalysisTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'linkToAnalysis',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.linkToAnalysis': 'Link to current analysis',
        'linkToAnalysisTitle': 'LiChess Tools - link to current analysis'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.linkToAnalysis': 'Link c\u0103tre analiza curent\u0103',
        'linkToAnalysisTitle': 'LiChess Tools - link c\u0103tre analiza curent\u0103'
      }
    }

    generateLink = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const trans = lt.translator;
      let button = $('.lichessTools-linkToAnalysis');
      if (!button.length) {
        button = $('<a class="lichessTools-linkToAnalysis">')
          .attr('data-icon','\uE016')
          .attr('title',trans.noarg('linkToAnalysisTitle'))
          .appendTo('.copyables .pgn .pair');
      }
      if (analysis.tree.root.children?.length == 0) {
        button.hide();
        return;
      }
      let pgn = $('.copyables .pgn textarea.copyable').val();
      if (!pgn?.trim()) {
        button.hide();
        return;
      }
      pgn = pgn.replaceAll(/\[\w+\s+"[^"]*"\]\s+/g,'');
      if (!lt.isStartFen(analysis.tree.root.fen)) {
        pgn = '[FEN "'+analysis.tree.root.fen+'"]'+pgn;
      }
      pgn = pgn.replaceAll(/(\d+\.)\s+/g,'$1');
      let url = lt.global.location.origin+'/analysis/pgn/'+lt.global.encodeURIComponent(pgn);
      if (analysis.getOrientation()=='black') url+='?color=black';
      if (analysis.node.ply) url += '#'+analysis.node.ply;
      url = url.replaceAll('%20','+');
      if (url.length>2048) {
        button.hide();
        return;
      }
      button.attr('href',url);
      button.show();
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('linkToAnalysis');
      this.logOption('Link to analysis', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (analysis.study) return;
      const trans = lt.translator;
      $('.lichessTools-linkToAnalysis').remove();
      lt.pubsub.off('lichessTools.redraw', this.generateLink);
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.generateLink);
    }

  }
  LiChessTools.Tools.LinkToAnalysis = LinkToAnalysisTool;
})();

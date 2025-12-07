(() => {
  class LinkToAnalysisTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'linkToAnalysis',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.linkToAnalysis': 'Link to current analysis',
        'linkToAnalysisTitle': 'LiChess Tools - link to current analysis'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.linkToAnalysis': 'Link c\u0103tre analiza curent\u0103',
        'linkToAnalysisTitle': 'LiChess Tools - link c\u0103tre analiza curent\u0103'
      }
    }

    generateLinkDirect = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const trans = lt.translator;
      let button = $('.lichessTools-linkToAnalysis');
      if (!button.length) {
        button = $('<a class="lichessTools-linkToAnalysis">')
          .attr('data-icon',lt.icon.Link)
          .attr('title',trans.noarg('linkToAnalysisTitle'))
          .appendTo('.copyables .pgn .pair');
      }
      if (analysis.tree.root.children?.length == 0 && lt.isStartFen(analysis.node.fen)) {
        button.remove();
        return;
      }
      const initialPgn = $('.copyables .pgn textarea.copyable').val()?.trim() || ' *';
      let url = (this._links||=new Map()).get(initialPgn);
      if (!url) {
        let pgn = initialPgn.replaceAll(/\[\w+\s+"[^"]*"\]\s+/g,'');
        if (!lt.isStartFen(analysis.tree.root.fen)) {
          pgn = '[FEN "'+analysis.tree.root.fen+'"]\r\n'+pgn;
        }
        pgn = pgn.replaceAll(/(\d+\.(?:\.\.)?)\s+/g,'$1');
        url = lt.global.location.origin+'/analysis/pgn/'+lt.global.encodeURIComponent(pgn);
        url+=' '; // Lichess removes trailing closing parentheses (https://github.com/lichess-org/lila/issues/17508)
        if (analysis.getOrientation()=='black') url+='?color=black';
        if (analysis.onMainline) {
          url += '#'+analysis.node.ply;
        } else {
          url += '#'+lt.global.encodeURIComponent(analysis.path);
        }
        url = url.replaceAll('%20','+');
        this._links.set(initialPgn,url);
      }
      if (url.length>2048) {
        button.remove();
        return;
      }
      button.attrSafe('href',url);
    };
    generateLink = lichessTools.debounce(this.generateLinkDirect,500);

    async init() {
      this.initialHash = location.hash;
    }

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
      if (this.initialHash) { // remove this if https://github.com/lichess-org/lila/issues/17507 is solved
        const path = lt.global.decodeURIComponent(this.initialHash.slice(1).replaceAll(/\+/g,' '));
        this.initialHash = null;
        const node = analysis.tree.nodeAtPath(path);
        if (node?.id) {
          analysis.jump(path);
        }
      }
    }

  }
  LiChessTools.Tools.LinkToAnalysis = LinkToAnalysisTool;
})();

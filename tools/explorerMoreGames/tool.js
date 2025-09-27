(() => {
  class ExplorerMoreGamesTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'explorerMoreGames',
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
        'options.explorerMoreGames': 'Show more Explorer games',
        'explorerMoreGamesTitle': 'LiChess Tools - more Explorer games'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerMoreGames': 'Arat\u0103 mai multe jocuri \u00een Explorator',
        'explorerMoreGamesTitle': 'LiChess Tools - mai multe jocuri \u00een Explorator'
      }
    }

    addGamesFromMoves = ()=>{
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const explorer = analysis?.explorer;
      if (!explorer?.enabled()) return;
      const current = explorer.current();
      if (!current) return;
      const existingGameIds = new Set((current.recentGames||[]).concat(current.topGames||[])
                                .map(g=>g.id));
      const moveGames = (current.moves||[])
        .map(m=>{
          if (!m.game) return m.game;
          return { ...m.game,uci:m.uci };
        })
        .filter(g=>g && !existingGameIds.has(g.id));
      if (moveGames.length) {
        moveGames.forEach(g=>g.source='lichessTools');
        current.recentGames = (current.recentGames||[]).concat(moveGames);
      }
    };

    styleGamesFromMoves = ()=>{
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const explorer = analysis?.explorer;
      if (!explorer?.enabled()) return;
      const current = explorer.current();
      if (!current) return;
      const extraGameIds = new Set(current.recentGames
                             .filter(g=>g.source=='lichessTools')
                             .map(g=>g.id));
      if (!extraGameIds.size) return;
      $('.explorer-box table.games tr[data-id]')
        .each((i,e)=>{
          const $e = $(e);
          const id=$e.attr('data-id');
          const isMore = extraGameIds.has(id);
          if (!isMore) return;
          $e.toggleClassSafe('lichessTools-explorerMoreGames',true);
          const title = trans.noarg('explorerMoreGamesTitle');
          if ($e.attr('title')!=title) {
            $e.attr('title',title);
          }
        });
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('explorerMoreGames');
      this.logOption('Explorer more games', value);
      this.options = { enabled: value };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const explorer = analysis?.explorer;
      if (!explorer) return;
      analysis.redraw = lt.unwrapFunction(analysis.redraw, 'explorerMoreGames');
      if (!value) return;
      analysis.redraw = lt.wrapFunction(analysis.redraw, {
        id: 'explorerSnaps',
        before: ($this, ...args) => {
          this.addGamesFromMoves();
        },
        after: ($this, result, ...args) => {
          this.styleGamesFromMoves();
        }
      });
    }

  }
  LiChessTools.Tools.ExplorerMoreGames = ExplorerMoreGamesTool;
})();

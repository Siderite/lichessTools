(() => {
  class LobbyCrosstableTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'lobbyCrosstable',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.lobbyCrosstable': 'Lobby crosstable',
        'lobbyCrosstableTitle': 'LiChess Tools - crosstable'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.lobbyCrosstable': 'Scor \u00eentre juc\u0103tori pe pagina principal\u0103',
        'lobbyCrosstableTitle': 'LiChess Tools - scor \u00eentre juc\u0103tori'
      }
    }

    showCrosstable = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      $('table.hooks__list td:nth-child(1):not([data-crosstable])')
        .each(async (i,e)=>{
          const href = $('span[data-href]',e).attr('data-href');
          const userId = /@\/(?<user>[^\?\/&#]+)/.exec(href)?.groups?.user?.toLowerCase();
          if (!userId) return;
          const crossTable = await lt.api.user.getCrosstableJustCache(this.userId,userId);
          if (!crossTable?.nbGames) return;
          const winrate=100*crossTable.users[this.userId]/crossTable.nbGames;
          $(e).attr('data-crosstable',winrate);
          $('<span class="lichessTools-crossTable">')
            .text('('+crossTable.users[this.userId]+'/'+crossTable.users[userId]+')')
            .attr('title',trans.noarg('lobbyCrosstableTitle'))
            .toggleClassSafe('bad',winrate<34 && crossTable.nbGames>1)
            .toggleClassSafe('good',winrate>66 && crossTable.nbGames>1)
            .appendTo(e);
        });
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('lobbyCrosstable');
      this.logOption('Lobby crosstable', value);
      this.userId = lt.getUserId();
      if (!this.userId) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = { enabled: !!value };
      const $ = lt.$;
      $('body').observer()
        .off('.lobby__app,.hooks__list tbody',this.showCrosstable);
      $('table.hooks__list .lichessTools-crossTable').remove();
      if (!value) return;
      $('body').observer()
        .on('.lobby__app,.hooks__list tbody',this.showCrosstable);
    }

  }
  LiChessTools.Tools.LobbyCrosstable = LobbyCrosstableTool;
})();

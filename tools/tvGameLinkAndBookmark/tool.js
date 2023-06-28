(()=>{
  class TvGameLinkAndBookmarkTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'tvGameLinkAndBookmark',
        category: 'TV',
        type:'multiple',
        possibleValues: ['link','bookmark'],
        defaultValue: 'link,bookmark'
      }
    ];

    intl={
      'en-US':{
        'options.TV': 'TV',
        'options.tvGameLinkAndBookmark': 'Link and bookmark for TV games',
        'tvGameLinkAndBookmark.link': 'Game title link',
        'tvGameLinkAndBookmark.bookmark': 'Ability to bookmark games',
        'bookmarkGame': 'LiChess Tools - Bookmark this game'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.tvGameLinkAndBookmark': 'Link \u015Fi marcare pentru partide TV',
        'tvGameLinkAndBookmark.link': 'Link \u00een titlul partidei',
        'tvGameLinkAndBookmark.bookmark': 'Op\u0163iune de a marca partide',
        'bookmarkGame': 'LiChess Tools - Marca\u0163i aceast\u0103 partid\u0103'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.tvGameLinkAndBookmark;
      this.logOption('Link and bookmark for TV games', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      const trans=parent.translator;
      const metaSection = $('div.game__meta section').eq(0);
      const header=$('div.header',metaSection);
      if (value) {
        const tvOptions=parent.getTvOptions();
        const gameId=tvOptions.gameId || lichess.analysis?.data.game?.id;
        if (!gameId||gameId=='synthetic') return;
        if (!header.parent().is('a')) {
          header.wrap($('<a>').attr('href','/'+gameId+(tvOptions.isBlack?'/black':'')));
        }
        if (!header.has('a.bookmark').length) {
          const title = trans.noarg('bookmarkGame');
          $('div.setup',header)
            .prepend(
              $('<a class="bookmark lichessTools-bookmark" href="/bookmark/'+gameId+'"><i data-icon="\uE067" class="on is3"></i><i data-icon="\uE066" class="off is3"></i><span></span></a>')
                .attr('title',title)
            );
        }
      } else {
        if (header.parent().is('a')) {
          header.unwrap();
        }
        $('a.bookmark.lichessTools',header).remove();
      }
    }

  }
  LiChessTools.Tools.TvGameLinkAndBookmark=TvGameLinkAndBookmarkTool;
})();

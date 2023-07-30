(()=>{
  class UserTvHistoryTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'userTvHistory',
        category: 'TV',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.TV': 'TV',
        'options.userTvHistory': 'Show the previous two games in player TV',
        'fromLiChessTools': 'from LiChess Tools',
        'previouslyOnTV': 'Previously on %s TV'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.userTvHistory': 'Arat\u0103 dou\u0103 partide precedente \u00een TVul juc\u0103torilor',
        'fromLiChessTools': 'de la LiChess Tools',
        'previouslyOnTV': 'Anterior la %s TV'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('userTvHistory');
      this.logOption('User TV history', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      const trans=parent.translator;
      const tvOptions=parent.getTvOptions();
      if (!tvOptions.isTv || !tvOptions.user) return;
      if (!value) {
        $('div.tv-history').remove();
        return;
      }
      if ($('div.tv-history').length) {
        return;
      }
      let text = await parent.net.fetch({url:'/api/games/user/{user}?max=2&tags=true&ongoing=false&finished=true',args:{user:tvOptions.user}});
      if (!text) return;
      const matches=[...text.matchAll(new RegExp('\\[Site.*?\\/([^"\\/]+)"\\][\\s\\S]*?\\[(Black|White)\\s+"'+parent.escapeRegex(tvOptions.user)+'"\\]','gi'))];
      if (!matches.length) return;
      const container=$('<div/>').addClass('now-playing');
      const translationText = trans.plural('previouslyOnTV',1,tvOptions.user);
      const translationTitle = trans.noarg('fromLiChessTools');
      $('.round__underboard')
        .append($('<div class="tv-history"></div>')
        .addClass('lichessTools-userHistory')
        .append($('<h2/>')
                  .text(translationText)
                  .attr('title',translationTitle))
        .append(container));
      for(const m of matches) {
        const gameId=m[1];
        const color=m[2];
        await parent.timeout(500);
        text=await parent.net.fetch({url:'/{gameId}'+(color=='White'?'':'/black')+'/mini',args:{gameId:gameId}});
        if (!text) continue;
        container.append(text);
      }
      lichess.contentLoaded(container[0]);
    }

  }
  LiChessTools.Tools.UserTvHistory=UserTvHistoryTool;
})();

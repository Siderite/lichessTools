(()=>{
  class StreamerTvTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'streamerTv',
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
        'options.streamerTv': 'TV with the games of live streamers',
        'streamersButtonTitle': 'LiChess Tools - games of live streamers',
        'streamers': 'Streamers',
        'noGames': 'No available games'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.streamerTv': 'TV cu jocurile streamerilor live',
        'streamersButtonTitle': 'LiChess Tools - jocurile streamerilor live',
        'streamers': 'Streameri',
        'noGames': 'Nu sunt jocuri disponibile'
      }
    }

    isGamesPage=()=>{
       return /^\/games(\/|$)?/i.test(this.lichessTools.global.location.pathname);
    };

    isStreamerTvPage=()=>{
       return /^\/games\/?$/i.test(this.lichessTools.global.location.pathname) && location.hash=='#streamers';
    };

    updateStreamerTvButton=()=>{
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('streamerTv');
      const $=parent.$;
      const trans=this.lichessTools.translator;

      if (!this.isGamesPage()) return;

      const container = $('main.tv-games div.tv-channels');
      if (!value) {
        $('a.lichessTools-streamers',container).remove();
        return;
      }
      const elem=$('a.lichessTools-streamers',container);
      if (this.isStreamerTvPage()) {
        parent.global.document.title=parent.global.document.title?.replace(/^.*?\u2022/,trans.noarg('streamers')+' \u2022');

        $('a.active:not(.lichessTools-streamers)',container).removeClass('active');
        parent.lichess.pubsub.emit=parent.unwrapFunction(parent.lichess.pubsub.emit,'streamerTv');
        parent.lichess.pubsub.emit=parent.wrapFunction(parent.lichess.pubsub.emit,{
          id:'streamerTv',
          before:($this,name,info)=>{
            if (name=='socket.in.finish') {
              const gameId=info.id;
              $('main.tv-games div.page-menu__content.now-playing a[data-live="'+gameId+'"]').remove();
              parent.global.clearTimeout(this.timeout);
              this.timeout=parent.global.setTimeout(this.updateStreamerTvPageDirect,1000);
              return false;
            }
          }
        });
      }
      if (elem.length) {
        elem.toggleClass('active',this.isStreamerTvPage());
        return;
      }
      $(`<a href="/games#streamers" class="tv-channel lichessTools-streamers"><span data-icon="&#xE025;"><span><strong></strong></span></span></a>`)
        .attr('title',trans.noarg('streamersButtonTitle'))
        .insertAfter($('a.lichessTools-friends',container)[0]||$('a.best',container)[0])
        .toggleClass('active',this.isStreamerTvPage())
        .find('strong').text(trans.noarg('streamers'));
    };

    getUserId=(user)=>user?.toLowerCase().replace(/^\w+\s/, '');

    getUsers=(el)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      return $('span.mini-game__user',el).get()
               .map(e=>{
                 const cl=$(e).clone();
                 cl.find('span').remove();
                 return this.getUserId(cl.text().trim());  
               });
    };

    updateStreamerTvPageDirect = async ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      if (!this.isStreamerTvPage()) return;
      if (parent.global.document.hidden) return;
      const container = $('main.tv-games div.page-menu__content.now-playing');
      if (!container.length) return;
      this.users_playing=(await parent.net.json('/api/streamer/live')).map(s=>s.id);
      const notFound=[...this.users_playing];
      $('a.mini-game',container).each((i,e)=>{
        const users=this.getUsers(e);
        const streamers=users.filter(u=>this.users_playing.includes(u));
        if (streamers.length) {
          parent.arrayRemoveAll(notFound,u=>streamers.includes(u));
        } else {
          $(e).remove();
        }
      });
      for (const userId of notFound) {
        try {
          /*const text = await parent.net.fetch({url:'/api/games/user/{username}?max=1&tags=true&ongoing=true&finished=false&opening=true&moves=false',args:{username:userId}});
          if (!text) continue;
          const url=parent.getPgnTag(text,'Site');
          const gameId=/\/([^\/]+)$/.exec(url)[1];
          if ($('a[data-live="'+gameId+'"]',container).length) continue;
          const black=parent.getPgnTag(text,'Black');
          const white=parent.getPgnTag(text,'White');
          const blackElo=parent.getPgnTag(text,'BlackElo');
          const whiteElo=parent.getPgnTag(text,'WhiteElo');
          const isBlack=userId===this.getUserId(black);
          const variant=parent.getPgnTag(text,'Variant')?.toLowerCase();
          let html=`<a href="/${gameId}" class="mini-game mini-game-${gameId} mini-game--init ${variant} is2d" data-live="${gameId}" data-state=",${isBlack?'black':'white'},">
<span class="mini-game__player">
  <span class="mini-game__user">
    ${!isBlack?black:white}    
    <span class="rating">${!isBlack?blackElo:whiteElo}</span>
  </span>
  <span class="mini-game__clock mini-game__clock--${!isBlack?'black':'white'}" data-time="0"></span>
</span>
<span class="cg-wrap">
  <cg-container>
    <cg-board></cg-board>
  </cg-container>
</span>
<span class="mini-game__player">
  <span class="mini-game__user">
    ${isBlack?black:white}    
    <span class="rating">${isBlack?blackElo:whiteElo}</span>
  </span>
  <span class="mini-game__clock mini-game__clock--${isBlack?'black':'white'}" data-time="0"></span>
</span></a>`;
          */
          const text = await parent.net.fetch({url:'https://lichess.org/@/{username}/mini',args:{username:userId}});
          if (!text) continue;
          const html=$('<x>'+text+'</x>').find('a.mini-game');
          if (!html.length) continue;

          $('label.lichessTools-noGames',container).remove();
          $(html).appendTo(container);
          parent.lichess.contentLoaded();
          await parent.timeout(500);
        } catch(e) {
          console.log('Getting TV game for ',userId,e);
        }
      }
      if ($('a.mini-game',container).length) {
        $('label.lichessTools-noGames',container).remove();
      } else if (!$('label.lichessTools-noGames',container).length) {
        $('<label class="lichessTools-noGames">')
          .text(trans.noarg('noGames'))
          .appendTo(container);
      }
      parent.global.clearTimeout(this.timeout);
      this.timeout=parent.global.setTimeout(this.updateStreamerTvPage,10000);
    };
    updateStreamerTvPage=this.lichessTools.debounce(this.updateStreamerTvPageDirect,500);

    users_playing=[];

    hashChange = ()=>{
      if (this.isStreamerTvPage()) {
        this.updateStreamerTvButton();
        this.updateStreamerTvPage();
      }
    };
    
    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('streamerTv');
      this.logOption('Streamers TV', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      $(parent.global).off('hashchange',this.hashChange);
      if (value) {
        $(parent.global).on('hashchange',this.hashChange);
      }

      this.updateStreamerTvButton();
      this.updateStreamerTvPage();
    }
  }
  LiChessTools.Tools.StreamerTv=StreamerTvTool;
})();

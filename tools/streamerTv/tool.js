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
        'noGames': 'No available games',
        'streamerLink': 'Watch the stream'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.streamerTv': 'TV cu jocurile streamerilor live',
        'streamersButtonTitle': 'LiChess Tools - jocurile streamerilor live',
        'streamers': 'Streameri',
        'noGames': 'Nu sunt jocuri disponibile',
        'streamerLink': 'Urm\u0103re\u015Fte stream-ul'
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
              this.timeout=parent.global.setTimeout(this.updateStreamerTvPage,500);
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
                 cl.find('span:not(.lichessTools-userText),img').remove();
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
      container.toggleClass('lichessTools-streamerTv',this.options.enabled);
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
          const text = await parent.net.fetch({url:'/@/{username}/mini',args:{username:userId}});
          if (!text) continue;
          const html=$('<x>'+text+'</x>').find('a.mini-game');
          if (!html.length) continue;
          $('<span class="lichessTools-streamerLink">')
            .append($('<a rel="noopener nofollow" target="_blank">')
                      .attr('href','/streamer/'+userId+'/redirect')
                      .text(trans.noarg('streamerLink')))
            .appendTo(html);

          $('label.lichessTools-noGames',container).remove();
          if (!$('a.mini-game[data-userId="'+userId+'"]',container).length) {
            $(html).attr('data-userId',userId).appendTo(container);
            parent.lichess.contentLoaded();
            await parent.timeout(500);
          }
        } catch(e) {
          console.warn('Error getting TV game for ',userId,e);
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
    
    reconnected = ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (!this.isStreamerTvPage()) return;
      const container = $('main.tv-games div.page-menu__content.now-playing');
      container.empty();
            
      this.hashChange();
    };
    
    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('streamerTv');
      this.logOption('Streamers TV', value);
      this.options={ enabled: !!value };
      const lichess=parent.lichess;
      if (!lichess) return;
      $(parent.global).off('hashchange',this.hashChange);
      lichess.pubsub.off('socket.open',this.reconnected);
      if (value) {
        $(parent.global).on('hashchange',this.hashChange);
        lichess.pubsub.on('socket.open',this.reconnected);
      }

      this.updateStreamerTvButton();
      this.updateStreamerTvPage();
    }
  }
  LiChessTools.Tools.StreamerTv=StreamerTvTool;
})();

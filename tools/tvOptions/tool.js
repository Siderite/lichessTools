(()=>{
  class TvOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'tvOptions',
        category: 'TV',
        type:'multiple',
        possibleValues: ['link','bookmark','streamerTv','friendsTv','userTvHistory'],
        defaultValue: 'link,bookmark,streamerTv,friendsTv,userTvHistory',
        advanced: false
      }
    ];

    intl={
      'en-US':{
        'options.TV': 'TV',
        'options.tvOptions': 'Various TV options',
        'tvOptions.link': 'Link for current TV game',
        'tvOptions.bookmark': 'Bookmark for current TV game',
        'tvOptions.streamerTv': 'Streamers current games',
        'tvOptions.friendsTv': 'Friends current games',
        'tvOptions.userTvHistory': 'Previous two games in player TV',
        'friendsButtonTitle': 'LiChess Tools - games of your friends',
        'streamersButtonTitle': 'LiChess Tools - games of live streamers',
        'streamers': 'Streamers',
        'friends': 'Friends',
        'noGames': 'No available games',
        'streamerLink': 'Watch the stream',
        'bookmarkGame': 'LiChess Tools - Bookmark this game',
        'fromLiChessTools': 'from LiChess Tools',
        'previouslyOnTV': 'Previously on %s TV'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.tvOptions': 'Diverse op\u0163iuni pentru TV',
        'tvOptions.link': 'Link pentru jocul TV curent',
        'tvOptions.bookmark': 'Marcaj pentru jocul TV curent',
        'tvOptions.streamerTv': 'Jocurile streamerilor live',
        'tvOptions.friendsTv': 'Jocurile prietenilor t\u0103i',
        'tvOptions.userTvHistory': 'Dou\u0103 partide precedente \u00een TVul juc\u0103torilor',
        'friendsButtonTitle': 'LiChess Tools - jocurile prietenilor t\u0103i',
        'streamersButtonTitle': 'LiChess Tools - jocurile streamerilor live',
        'streamers': 'Streameri',
        'friends': 'Prieteni',
        'noGames': 'Nu sunt jocuri disponibile',
        'streamerLink': 'Urm\u0103re\u015Fte stream-ul',
        'bookmarkGame': 'LiChess Tools - Marca\u0163i aceast\u0103 partid\u0103',
        'fromLiChessTools': 'de la LiChess Tools',
        'previouslyOnTV': 'Anterior la %s TV'

      }
    };

    isGamesPage=()=>{
       return /^\/games(\/|$)?/i.test(this.lichessTools.global.location.pathname);
    };

    isBestTvPage=()=>{
       return /^\/games(\/best)?\/?$/i.test(this.lichessTools.global.location.pathname) && !location.hash;
    };

    isStreamerTvPage=()=>{
       return /^\/games\/?$/i.test(this.lichessTools.global.location.pathname) && location.hash=='#streamers';
    };

    isFriendsTvPage=()=>{
       return /^\/games\/?$/i.test(this.lichessTools.global.location.pathname) && location.hash=='#friends';
    };

    updateTvOptionsButton=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;

      if (!this.isGamesPage()) return;

      if (this.options.streamerTv||this.options.friendsTv) {
        parent.lichess.pubsub.emit=parent.unwrapFunction(parent.lichess.pubsub.emit,'tvOptions');
        parent.lichess.pubsub.emit=parent.wrapFunction(parent.lichess.pubsub.emit,{
          id:'tvOptions',
          before:($this,name,info)=>{
            if (name=='socket.in.finish') {
              if (!this.isStreamerTvPage()&&!this.isFriendsTvPage()) return;
              const gameId=info.id;
              $('main.tv-games div.page-menu__content.now-playing a[data-live="'+gameId+'"]').remove();
              this.updateTvOptionsPage();
              return false;
            }
          }
        });
      }

      const container = $('main.tv-games div.tv-channels');

      if (this.options.streamerTv) {
        const elem=$('a.lichessTools-streamers',container);
        if (this.isStreamerTvPage()) {
          parent.global.document.title=parent.global.document.title?.replace(/^.*?\u2022/,trans.noarg('streamers')+' \u2022');

          $('a.active:not(.lichessTools-streamers)',container).removeClass('active');
        }
        if (elem.length) {
          elem.toggleClass('active',this.isStreamerTvPage());
        } else {
          $(`<a href="/games#streamers" class="tv-channel lichessTools-streamers"><span data-icon="&#xE025;"><span><strong></strong></span></span></a>`)
            .attr('title',trans.noarg('streamersButtonTitle'))
            .insertAfter($('a.lichessTools-friends',container)[0]||$('a.best',container)[0])
            .toggleClass('active',this.isStreamerTvPage())
            .find('strong').text(trans.noarg('streamers'));
        }
      } else {
        $('a.lichessTools-streamers',container).remove();
      }

      if (this.options.friendsTv && parent.getUserId()) {
        const elem=$('a.lichessTools-friends',container);
        if (this.isFriendsTvPage()) {
          parent.global.document.title=parent.global.document.title?.replace(/^.*?\u2022/,trans.noarg('friends')+' \u2022');

          $('a.active:not(.lichessTools-friends)',container).removeClass('active');
        }
        if (elem.length) {
          elem.toggleClass('active',this.isFriendsTvPage());
        } else {
          $(`<a href="/games#friends" class="tv-channel lichessTools-friends"><span data-icon="&#xE065;"><span><strong></strong></span></span></a>`)
            .attr('title',trans.noarg('friendsButtonTitle'))
            .insertAfter($('a.best',container))
            .toggleClass('active',this.isFriendsTvPage())
            .find('strong').text(trans.noarg('friends'));
        }
      } else {
        $('a.lichessTools-friends',container).remove();
      }
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

    refreshTimeControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('a.mini-game[data-tc]').each((i,e)=>{
        const timeControl=parent.getGameTime($(e).attr('data-tc'));
        if (timeControl) {
          $(e).addClass(timeControl);
        }
      });
    };

    refreshGames=async (playerIds,className,container,streamers)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;

      if (!playerIds?.length) return;
      const notFound=[...playerIds];
      $('a.mini-game',container).each((i,e)=>{
        const users=this.getUsers(e);
        const players=users.filter(u=>playerIds.includes(u));
        if (players.length) {
          parent.arrayRemoveAll(notFound,u=>players.includes(u));
        } else {
          $(e).remove()
        }
      });
      for (const userId of notFound) {
        try {
          const text = await parent.net.fetch({url:'/@/{username}/mini',args:{username:userId}});
          if (!text) continue;
          const html=$('<x>'+text+'</x>').find('a.mini-game');
          if (!html.length) continue;
          const timeControl=parent.getGameTime(html.attr('data-tc'));
          if (timeControl) {
            html.addClass(timeControl);
          }
          if (streamers) {
            $('<span>')
              .addClass(className)
              .append($('<a rel="noopener nofollow" target="_blank">')
                       .attr('href','/streamer/'+userId+'/redirect')
                        .text(trans.noarg('streamerLink')))
              .appendTo(html);
          }
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
    };

    updateTvOptionsPageDirect = async ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      if (parent.global.document.hidden) return;
      const container = $('main.tv-games div.page-menu__content.now-playing');
      if (!container.length) return;
      if (this.isBestTvPage()) {
        container.toggleClass('lichessTools-bestTv',this.options.streamerTv||this.options.friendsTv);
      } else {
        container.removeClass('lichessTools-bestTv');
      }
      if (this.isStreamerTvPage()) {
        container.toggleClass('lichessTools-streamerTv',this.options.streamerTv);
        const playerIds=(await parent.net.json('/api/streamer/live'))?.map(s=>s.id);
        await this.refreshGames(playerIds,'lichessTools-streamerTv',container,true);
      } else {
        container.removeClass('lichessTools-streamerTv');
      }
      if (this.isFriendsTvPage()) {
        container.toggleClass('lichessTools-friendsTv',this.options.streamerTv);
        const playerIds=this.users_playing;
        await this.refreshGames(playerIds,'lichessTools-friendsTv',container,false);
      } else {
        container.removeClass('lichessTools-friendsTv');
      }
      if ($('a.mini-game',container).length) {
        $('label.lichessTools-noGames',container).remove();
      } else if (!$('label.lichessTools-noGames',container).length) {
        $('<label class="lichessTools-noGames">')
          .text(trans.noarg('noGames'))
          .appendTo(container);
      }
      parent.global.clearTimeout(this.timeout);
      this.timeout=parent.global.setTimeout(this.updateTvOptionsPage,10000);
      this.refreshTimeControls();
    };
    updateTvOptionsPage=this.lichessTools.debounce(this.updateTvOptionsPageDirect,1000);

    users_playing=[];

    following_onlines=(friends,data)=>{
      if (this.onlinesInterval) {
        clearInterval(this.onlinesInterval);
        this.onlinesInterval=0;
      }
      const parent=this.lichessTools;
      const $=parent.$;
      this.users_playing=data?.playing?.map(this.getUserId)||[];
      this.updateTvOptionsPage();
    };
    enters=(userName,data)=>{
      const parent=this.lichessTools;
      const userId=this.getUserId(userName);
      const isPlaying=data?.playing;
      if (isPlaying) {
        this.users_playing.push(userId);
        this.updateTvOptionsPage();
      }
    };
    leaves=(user)=>{
      const parent=this.lichessTools;
      const userId=this.getUserId(user);
      parent.arrayRemoveAll(this.users_playing,u=>u===userId);
      this.updateTvOptionsPage();
    };
    playing=(user)=>{
      const userId=this.getUserId(user);
      this.users_playing.push(userId);
      this.updateTvOptionsPage();
    };
    stopped_playing=(user)=>{
      const parent=this.lichessTools;
      const userId=this.getUserId(user);
      parent.arrayRemoveAll(this.users_playing,u=>u===userId);
      this.updateTvOptionsPage();
    };

    requestOnlines=this.lichessTools.debounce(()=>{
      const parent=this.lichessTools;
      if (parent.global.document.hidden) return;
      parent.lichess.pubsub.emit("socket.send", "following_onlines");
    },250);

    hashChange = ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (this.isStreamerTvPage()||this.isFriendsTvPage()) {
        const container = $('main.tv-games div.page-menu__content.now-playing');
        container.empty();
        this.updateTvOptionsButton();
        this.updateTvOptionsPage();
      }
    };
    
    followingOnlinesRequests=0;
    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('tvOptions');
      this.logOption('TV Options', value);
      this.options={ 
        link: parent.isOptionSet(value,'link'),
        bookmark: parent.isOptionSet(value,'bookmark'),
        streamerTv: parent.isOptionSet(value,'streamerTv'),
        friendsTv: parent.isOptionSet(value,'friendsTv'),
        userTvHistory: parent.isOptionSet(value,'userTvHistory'),
      };
      const lichess=parent.lichess;
      if (!lichess) return;
      $(parent.global).off('hashchange',this.hashChange);
      lichess.pubsub.off('socket.close',this.hashChange);
      lichess.pubsub.off('content-loaded',this.refreshTimeControls);
      if (this.options.friendsTv || this.options.streamerTv) {
        $(parent.global).on('hashchange',this.hashChange);
        lichess.pubsub.on('socket.close',this.hashChange);
        lichess.pubsub.on('content-loaded',this.refreshTimeControls);
        parent.global.setTimeout(this.hashChange,100);
      }

      lichess.pubsub.off('socket.in.following_onlines', this.following_onlines);
      lichess.pubsub.off('socket.in.following_enters', this.enters);
      lichess.pubsub.off('socket.in.following_leaves', this.leaves);
      lichess.pubsub.off('socket.in.following_playing', this.playing);
      lichess.pubsub.off('socket.in.following_stopped_playing', this.stopped_playing);
      if (this.options.friendsTv) {
        lichess.pubsub.on('socket.in.following_onlines', this.following_onlines);
        lichess.pubsub.on('socket.in.following_enters', this.enters);
        lichess.pubsub.on('socket.in.following_leaves', this.leaves);
        lichess.pubsub.on('socket.in.following_playing', this.playing);
        lichess.pubsub.on('socket.in.following_stopped_playing', this.stopped_playing);

        this.followingOnlinesRequests=0;
        clearInterval(this.onlinesInterval);
        this.onlinesInterval=setInterval(()=>{
          if (!this.onlinesInterval) return;
          this.requestOnlines();
          this.followingOnlinesRequests++;
          if (this.followingOnlinesRequests>5) {
            clearInterval(this.onlinesInterval);
            parent.global.console.debug('Sent following-onlines too many times. Giving up.');
          }
        },1000);
      }

      if (this.isStreamerTvPage()) {
        $('a.mini-game:not(:has(.lichessTools-streamerTv))').remove();
      }
      this.updateTvOptionsButton();
      this.updateTvOptionsPage();

      const tvOptions = this.options.link||this.options.bookmark||this.options.userTvHistory
        ? parent.getTvOptions()
        : null;

      const metaSection = $('div.game__meta section').eq(0);
      const header=$('div.header',metaSection);
      if (this.options.link||this.options.bookmark) {
        const gameId=tvOptions.gameId || lichess.analysis?.data.game?.id;
        if (gameId&&gameId!=='synthetic') {
          if (this.options.link && !header.parent().is('a')) {
            const url='/'+gameId+(tvOptions.isBlack?'/black':'');
            header.wrap($('<a>').attr('href',url).attr('title','LiChess Tools - '+url));
          }
          if (this.options.bookmark && !header.has('a.bookmark').length) {
            const title = trans.noarg('bookmarkGame');
            $('div.setup',header)
              .prepend(
                $('<a class="bookmark lichessTools-bookmark" href="/bookmark/'+gameId+'"><i data-icon="\uE067" class="on is3"></i><i data-icon="\uE066" class="off is3"></i><span></span></a>')
                  .attr('title',title)
              );
          }
        }
      } else {
        if (header.parent().is('a')) {
          header.unwrap();
        }
        $('a.bookmark.lichessTools',header).remove();
      }

      if (this.options.userTvHistory && tvOptions.isTv && tvOptions.user) {
        if (!$('div.tv-history').length) {
          let text = await parent.net.fetch({url:'/api/games/user/{user}?max=2&tags=true&ongoing=false&finished=true',args:{user:tvOptions.user}});
          if (text) {
            const matches=[...text.matchAll(new RegExp('\\[Site.*?\\/([^"\\/]+)"\\][\\s\\S]*?\\[(Black|White)\\s+"'+parent.escapeRegex(tvOptions.user)+'"\\]','gi'))];
            if (matches.length) {
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
        }
      } else {
        $('div.tv-history.lichessTools-userHistory').remove();
      }
    }
  }
  LiChessTools.Tools.TvOptions=TvOptionsTool;
})();

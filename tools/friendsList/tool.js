(()=>{
  class FriendsListTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'openFriends',
        category: 'friends',
        type:'single',
        possibleValues: ['default','open','menu','button','hidden'],
        defaultValue: 'menu'
      },
      {
        name:'liveFriendsPage',
        category: 'friends',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'onlineFriends': '%s online friends',
        'onlineFriends:one': '%s online friend',
        'onlineFriends:zero': 'Friends',
        'friendsMenu': 'LiChess Tools - friends you follow',
        'options.friends': 'Friends',
        'options.openFriends': 'Friends box',
        'openFriends.default': 'Default',
        'openFriends.open': 'Open',
        'openFriends.hidden': 'Hidden',
        'openFriends.menu': 'Menu',
        'openFriends.button': 'Button',
        'watchGames':'Watch games',
        'enablePlayAlert':'Unmute playing alert',
        'mutePlayAlert':'Mute playing alert',
        'options.liveFriendsPage':'Live friends page',
        'hideOfflineTitle': 'Online players',
        'hideNotPlayingTitle': 'Playing players',
        'hideMutedTitle': 'Muted players'
      },
      'ro-RO':{
        'onlineFriends': '%s prieteni online',
        'onlineFriends:one': 'un prieten online',
        'onlineFriends:zero': 'Prieteni',
        'friendsMenu': 'LiChess Tools - prieteni pe care \u00eei urm\u0103re\u015Fti',
        'options.friends': 'Prieteni',
        'options.openFriends': 'Sec\u0163iunea prieteni',
        'openFriends.default': 'Normal',
        'openFriends.open': 'Deschis\u0103',
        'openFriends.hidden': 'Ascuns\u0103',
        'openFriends.menu': 'Meniu',
        'openFriends.button': 'Buton',
        'watchGames':'Vezi partide',
        'enablePlayAlert':'Permite alerte c\u00E2nd joac\u0103',
        'mutePlayAlert':'Nu permite alerte c\u00E2nd joac\u0103',
        'options.liveFriendsPage':'Pagin\u0103 prieteni live',
        'hideOfflineTitle': 'Juc\u0103tori online',
        'hideNotPlayingTitle': 'Juc\u0103tori care joac\u0103',
        'hideMutedTitle': 'Juc\u0103tori cu alert\u0103 nepermis\u0103'
      }
    }

    buttonStartIndex=0;
    hideNotPlaying=false;
    buttonPageSize=7;
    updateFriendsButton=()=>{
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('openFriends');
      if (value!=='menu'&&value!=='button') return;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      const myName=parent.getUserId();
      if (!myName) return;
      let container=$('div.lichessTools-onlineFriends',$('.site-buttons'));
      if (!container.length) {
        const title=trans.noarg('friendsMenu');
        container = $('<div class="lichessTools-onlineFriends"/>')
          .append($('<button class="toggle link">')
                      .attr('title',title)
                      .on('mouseover click',()=>{
                         this.requestOnlines();
                      })
                      .append($('<span class="data-count">')
                                .attr('data-icon','\uE059'))
          )
          .append($(`<div class="links dropdown">
                         <div class="pager prev" data-icon="&#xE046;"></div>
                         <button class="hideNotPlaying button button-empty" data-icon="&#xE025;"></button>
                         <div class="notifications"></div>
                         <div class="pager next" data-icon="&#xE045;"></div>
                       </div>`)
          )
          .insertBefore('.site-buttons div.dasher');
      const prev=$('div.pager.prev',container)
        .on('click',ev=>{
          ev.preventDefault();
          if (prev.is('disabled')) return;
          this.buttonStartIndex-=this.buttonPageSize;
          this.updateFriendsButton();
        });
      const next=$('div.pager.next',container)
        .on('click',ev=>{
          ev.preventDefault();
          if (next.is('disabled')) return;
          this.buttonStartIndex+=this.buttonPageSize;
          this.updateFriendsButton();
        });
      $('button.hideNotPlaying',container)
        .attr('title',trans.noarg('hideNotPlayingTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.hideNotPlaying=!this.hideNotPlaying;
          this.updateFriendsButton();
        });
      }
      const items=this.hideNotPlaying
                        ? this.user_data.playing
                        : this.user_data.online;
      let atEnd=false;
      if (this.buttonStartIndex+this.buttonPageSize>=items.length) {
        this.buttonStartIndex=items.length-this.buttonPageSize;
        atEnd=true;
      }
      let atStart=false;
      if (this.buttonStartIndex<=0) {
        this.buttonStartIndex=0;
        atStart=true;
      }
      container
        .toggleClass('lichessTools-on',value==='button')
        .toggleClass('lichessTools-somePlaying',!!this.user_data.playing.length);
      const span=$('button.toggle > span.data-count',container)
        .attr('data-count',this.user_data.online.length);
      $('div.pager.prev',container)
        .toggleClass('disabled',atStart);
      $('div.pager.next',container)
        .toggleClass('disabled',atEnd);
      const notifs=$('div.notifications',container).empty();
      const displayedItems=items.slice(this.buttonStartIndex,this.buttonStartIndex+this.buttonPageSize);
      for (const userId of displayedItems) {
        const isPlaying=this.user_data.playing.includes(userId);
        $('<a class="user-link ulpt">')
          .attr('data-pt-pos','w')
          .toggleClass('lichessTools-playing',isPlaying)
          .attr('href','/@/'+userId)
          .append($('<i>')
                    .attr('data-icon',isPlaying?'\uE025':'\uE012'))
          .append($('<span class="content">')
                    .text(this.user_data.names[userId]||userId))
          .on('click',ev=>{
            if (!$(ev.currentTarget).is('.lichessTools-playing')) return;
            ev.preventDefault();
            const tvUrl='/@/'+userId+'/tv';
            if (ev.ctrlKey) {
              parent.global.open(tvUrl,'_blank','noopener');
            } else {
              parent.global.location.href=tvUrl;
            }
          })
          .appendTo(notifs);
      }
    };

    updateFriendsMenu=()=>{
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('openFriends');
      if (value!=='menu') return;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      const myName=parent.getUserId();
      if (!myName) return;
      if (!$('section.lichessTools-onlineFriends',$(this.menuParent)).length) {
        const friendsUrl='/@/'+myName+'/following';
        const title=trans.noarg('friendsMenu');
        $(this.menuParent)
          .append($('<section class="lichessTools-onlineFriends"/>')
            .append($('<a/>').attr('href',friendsUrl)
                      .attr('title',title)
                      .attr('class','data-count')
                      .on('mouseover',()=>{
                         if (!$('body').is('.mobile')) {
                           this.requestOnlines();
                         }
                      })
                      .on('click',ev=>{
                         if ($('body').is('.mobile')) {
                           this.requestOnlines();
                           ev.preventDefault();
                         }
                      }))
            .append('<div role="group"/>')
            );
      }
      const section=$('section.lichessTools-onlineFriends',$(this.menuParent));
      const group=section.children('div').eq(0);
      const menu=section.children('a').eq(0);
      const friends = $('#friend_box a.user-link');
      const text=trans.pluralSame('onlineFriends',this.user_data.online.length);
      menu.text(text);
      menu.toggleClass('lichessTools-somePlaying',!!this.user_data.playing.length);
      $('section.lichessTools-onlineFriends > a')
        .attr('data-count',this.user_data.playing.length);
      const items=new Set($('a.user-link',group).get());
      friends.each((i,e)=>{
        const href=$(e).attr('href');
        const m=/\/@\/([^\/\?#]+)/.exec(href);
        const user=this.getUserId(m&&m[1]);
        const isPlaying=this.user_data.playing.includes(user);
        let friendMenu=group.find('a').filter((i,e2)=>$(e2).attr('href')==href);
        if (!friendMenu.length) {
          friendMenu=$(e).clone()
            .attr('data-pt-pos','e');
          group.append(friendMenu);
          friendMenu
            .on('click',ev=>{
              if (!$(ev.currentTarget).is('.lichessTools-playing')) return;
              ev.preventDefault();
              const tvUrl='/@/'+user+'/tv';
              if (ev.ctrlKey) {
                parent.global.open(tvUrl,'_blank','noopener');
              } else {
                parent.global.location.href=tvUrl;
              }
            });
        }
        friendMenu
          .toggleClass('lichessTools-playing',isPlaying);
        items.delete(friendMenu[0]);
      });
      items.forEach(e=>{
        $(e).remove();
      });
    };

    rows={};
    updateFriendsPage=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      const myName=parent.getUserId();
      if (!myName) return;
      if (!parent.isFriendsPage()) return;
      if (!$('.lichessTools-liveButtons').length) {
        $('<div>')
          .addClass('lichessTools-liveButtons')
          .append($('<i data-icon="&#xE012;" data-role="hideOffline">').attr('title',trans.noarg('hideOfflineTitle')).on('click',()=>{ $('body').toggleClass('lichessTools-hideOffline'); }))
          .append($('<i data-icon="&#xE025;" data-role="hideNotPlaying">').attr('title',trans.noarg('hideNotPlayingTitle')).on('click',()=>{ $('body').toggleClass('lichessTools-hideNotPlaying'); }))
          .append($('<i data-icon="&#xE00F;" data-role="hideMuted">').attr('title',trans.noarg('hideMutedTitle')).on('click',()=>{ $('body').toggleClass('lichessTools-hideMuted'); }))
          .insertAfter('main.box div.box__top');
      }
      const watchGamesTitle=trans.noarg('watchGames');
      const enablePlayingAlertTitle=trans.noarg('enablePlayAlert');
      const mutePlayingAlertTitle=trans.noarg('mutePlayAlert');
      const hasAlerts=parent.currentOptions.getValue('friendsPlaying');
      $('body').toggleClass('lichessTools-alerts',hasAlerts);
      this.rows={};
      const table=$('table.slist div.relation-actions').closest('table');
      $('tr',table).each((i,tr)=>{
        const row=$(tr);
        const actions=$('div.relation-actions',tr);
        const userLink=$('td:first-child a[href]',row).attr('href');
        if (!userLink) return;
        const m=/\/@\/([^\/\?#]+)/.exec(userLink);
        const user=this.getUserId(m&&m[1]);
        if (!user) return;
        this.rows[user]=row;
        if (!actions.find('a.lichessTools-tv')[0]) {
          $('<a class="btn-rack__btn lichessTools-tv" data-icon="&#xE025;"></a>')
            .attr('href','/@/'+user+'/tv')
            .attr('title',watchGamesTitle)
            .prependTo(actions);
        }
        if (hasAlerts && !actions.find('a.lichessTools-mute')[0]) {
          $('<a class="btn-rack__btn lichessTools-mute" data-icon="&#xE00F;"></a>')
            .attr('title',mutePlayingAlertTitle)
            .on('click',ev=>{
              ev.preventDefault();
              parent.lichess.pubsub.emit('mutePlayer',user);
              this.updateFriendsPage();
            })
            .appendTo(actions);
        }
      });
      let secondUpdate=false;
      for (const user of this.user_data.online) {
        let row=this.rows[user];
        if (row) continue;
        row=$(`<tr class="paginated">
    <td><a class="user-link ulpt" href="/@/`+user+`"><i class="line"></i>`+user+`</a></td>
    <td>?</td>
    <td>?</td>
    <td><div class="relation-actions btn-rack"></div></td>
</tr>`);
        $('tbody',table).append(row);
        this.rows[user]=row;
        secondUpdate=true;
      }
      if (secondUpdate) {
        this.updateFriendsPage();
        return;
      }
      const mutedPlayers=parent.currentOptions.getValue('mutedPlayers')||[];
      for (const user in this.rows) {
        const row=this.rows[user];
        if (!row) continue;
        const isMuted=mutedPlayers.includes(user);
        row.toggleClass('lichessTools-muted',isMuted);
        $('a.lichessTools-mute',row) 
           .attr('title',isMuted?enablePlayingAlertTitle:mutePlayingAlertTitle);
        const isOnline=this.user_data.online.includes(user);
        const isPlaying=this.user_data.playing.includes(user);
        row.toggleClass('lichessTools-online',isOnline)
           .toggleClass('lichessTools-playing',isPlaying);
        $('td:first-child>a',row)
           .toggleClass('online',isOnline)
           .toggleClass('offline',!isOnline);
      }
    };

    getUserId=(user)=>user?.toLowerCase().replace(/^\w+\s/, '');

    user_data={
      names:{},
      online:[],
      playing:[]
    };
    following_onlines=(friends,data)=>{
      if (this.onlinesInterval) {
        clearInterval(this.onlinesInterval);
        this.onlinesInterval=0;
        this.onFirstFollowingOnlines();
      }
      const parent=this.lichessTools;
      const $=parent.$;
      this.user_data.names={};
      data?.d?.forEach(name=>this.user_data.names[this.getUserId(name)]=name);
      this.user_data.online=data?.d?.map(this.getUserId)||[];
      this.user_data.playing=data?.playing?.map(this.getUserId)||[];
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    enters=(userName,data)=>{
      const parent=this.lichessTools;
      const userId=this.getUserId(userName);
      this.user_data.names[userId]=userName;
      if (!this.user_data.online.includes(userId)) this.user_data.online.push(userId);
      const isPlaying=data?.playing;
      if (isPlaying) {
        if (!this.user_data.playing.includes(userId)) this.user_data.playing.push(userId);
      } else {
        parent.arrayRemoveAll(this.user_data.playing,u=>u===userId);
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    leaves=(user)=>{
      const parent=this.lichessTools;
      user=this.getUserId(user);
      this.user_data.names[user]=undefined;
      parent.arrayRemoveAll(this.user_data.online,u=>u===user);
      parent.arrayRemoveAll(this.user_data.playing,u=>u===user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    playing=(user)=>{
      user=this.getUserId(user);
      if (!this.user_data.online.includes(user)) this.user_data.online.push(user);
      if (!this.user_data.playing.includes(user)) this.user_data.playing.push(user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    stopped_playing=(user)=>{
      const parent=this.lichessTools;
      user=this.getUserId(user);
      parent.arrayRemoveAll(this.user_data.playing,u=>u===user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };

    onFirstFollowingOnlines=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const friendsBoxMode=parent.currentOptions.getValue('openFriends');

      switch(friendsBoxMode) {
        case true:
        case 'true':
        case 'open':
        case 'button':
        case 'menu': {
          if ($('#friend_box .content_wrap').is('.none')) {
            $('.friend_box_title').trigger('click');
          }
        }
        break;
        case 'hidden':
        default: {
        }
        break;
      }           
    };

    requestOnlines=this.lichessTools.debounce(()=>this.lichessTools.lichess.pubsub.emit("socket.send", "following_onlines"),250);

    menuParent='#topnav';
    
    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const friendsBoxMode=parent.currentOptions.getValue('openFriends');
      const liveFriendsPage=parent.currentOptions.getValue('liveFriendsPage');
      this.logOption('Online friend list', friendsBoxMode);
      this.logOption('Live friends page', liveFriendsPage);
      const lichess=parent.lichess;
      if (!lichess) return;
      const setInterval=parent.global.setInterval;
      const clearInterval=parent.global.clearInterval;
      lichess.pubsub.off('socket.in.following_onlines', this.following_onlines);
      lichess.pubsub.off('socket.in.following_enters', this.enters);
      lichess.pubsub.off('socket.in.following_leaves', this.leaves);
      lichess.pubsub.off('socket.in.following_playing', this.playing);
      lichess.pubsub.off('socket.in.following_stopped_playing', this.stopped_playing);
      if (friendsBoxMode=='menu'||friendsBoxMode=='button'||(liveFriendsPage&&parent.isFriendsPage())) {
          lichess.pubsub.on('socket.in.following_onlines', this.following_onlines);
          lichess.pubsub.on('socket.in.following_enters', this.enters);
          lichess.pubsub.on('socket.in.following_leaves', this.leaves);
          lichess.pubsub.on('socket.in.following_playing', this.playing);
          lichess.pubsub.on('socket.in.following_stopped_playing', this.stopped_playing);
      }
      if (parent.isFriendsPage()) {
        if (!liveFriendsPage) {
          $('.lichessTools-online').removeClass('lichessTools-online');
          $('.lichessTools-playing').removeClass('lichessTools-playing');
        }
        this.updateFriendsPage();
      }

      this.onlinesInterval=setInterval(()=>{
        if (!this.onlinesInterval) return;
        this.requestOnlines();
      },1000);

      switch(friendsBoxMode) {
        case true:
        case 'true':
        case 'open': {
          $('#friend_box').show();
          $('section.lichessTools-onlineFriends',$(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
        break;
        case 'menu':
        {
          $('#friend_box').hide();
        }
        break;
        case 'button':
        {
          $('#friend_box').hide();
          $('section.lichessTools-onlineFriends',$(this.menuParent)).remove();
        }
        break;
        case 'hidden': {
          $('#friend_box .content_wrap').addClass('none');
          $('#friend_box').hide();
          $('section.lichessTools-onlineFriends',$(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
        break;
        default: {
          $('#friend_box').show();
          $('section.lichessTools-onlineFriends',$(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
        break;
      }
      this.updateFriendsMenu();
      this.updateFriendsButton();
    }
  }
  LiChessTools.Tools.FriendsList=FriendsListTool;
})();

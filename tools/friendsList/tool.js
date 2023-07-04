(()=>{
  class FriendsListTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'openFriends',
        category: 'friends',
        type:'single',
        possibleValues: ['default','open','menu','hidden'],
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
        'watchGames':'Watch games',
        'enablePlayAlert':'Unmute playing alert',
        'mutePlayAlert':'Mute playing alert',
        'options.liveFriendsPage':'Live friends page'
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
        'watchGames':'Vezi partide',
        'enablePlayAlert':'Permite alerte c\u00E2nd joac\u0103',
        'mutePlayAlert':'Nu permite alerte c\u00E2nd joac\u0103',
        'options.liveFriendsPage':'Pagin\u0103 prieteni live'
      }
    }

    updateFriendsMenu=()=>{
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('openFriends');
      if (value!=='menu') return;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      const myName=parent.getUserId();
      if (!myName) return;
      if (!$('#topnav section.lichessTools-onlineFriends').length) {
        const friendsUrl='/@/'+myName+'/following';
        const title=trans.noarg('friendsMenu');
        $('#topnav')
          .append($('<section class="lichessTools-onlineFriends"/>')
            .append($('<a/>').attr('href',friendsUrl)
                      .attr('title',title)
                      .on('mouseover',()=>{
                         lichess.pubsub.emit("socket.send", "following_onlines");
                      }))
            .append('<div role="group"/>'));
      }
      const section=$('#topnav section.lichessTools-onlineFriends');
      const group=$('#topnav section.lichessTools-onlineFriends > div',section);
      const menu=$('#topnav section.lichessTools-onlineFriends > a',section);
      const friends = $('#friend_box a.user-link');
      const text=trans.pluralSame('onlineFriends',friends.length);
      menu.text(text);
      const items=new Set($('a.user-link',group).get());
      let friendsPlaying=0;
      friends.each((i,e)=>{
        const href=$(e).attr('href');
        const isPlaying=!!$(e).nextAll('a.tv').length;
        let friendMenu=group.find('a').filter((i,e2)=>$(e2).attr('href')==href);
        if (!friendMenu.length) {
          friendMenu=$(e).clone()
            .attr('data-pt-pos','e');
          group.append(friendMenu);
          friendMenu.find('i').on('mousedown',function() {
            const item=$(this).closest('a');
            if (item.is('.lichessTools-playing')) {
              item.attr('href',item.attr('href')+'/tv');
            }
          });
        }
        if (isPlaying) {
          friendsPlaying++;
        }
        friendMenu
          .toggleClass('lichessTools-playing',isPlaying);
        items.delete(friendMenu[0]);
      });
      menu.toggleClass('lichessTools-somePlaying',!!friendsPlaying);
      items.forEach(e=>$(e).remove());
    };

    rows={};
    updateFriendsPage=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=this.lichessTools.translator;
      const myName=parent.getUserId();
      if (!myName) return;
      if (!parent.isFriendsPage()) return;
      const watchGamesTitle=trans.noarg('watchGames');
      const enablePlayingAlertTitle=trans.noarg('enablePlayAlert');
      const mutePlayingAlertTitle=trans.noarg('mutePlayAlert');
      const hasAlerts=parent.currentOptions.getValue('friendsPlaying');
      if (!hasAlerts) {
        $('table.slist div.relation-actions a.lichessTools-mute').remove();
      }
      this.rows={};
      $('table.slist div.relation-actions').each((i,e)=>{
        const row=$(e).closest('tr');
        const userLink=$('td:first-child a[href]',row).attr('href');
        if (!userLink) return;
        const m=/\/@\/([^\/\?#]+)/.exec(userLink);
        const user=(m&&m[1]).toLowerCase();
        if (!user) return;
        this.rows[user]=row;
        if (!$(e).find('a.lichessTools-tv')[0]) {
          $('<a class="btn-rack__btn lichessTools-tv" data-icon="&#xE025;"></a>')
            .attr('href','/@/'+user+'/tv')
            .attr('title',watchGamesTitle)
            .prependTo(e);
        }
        if (hasAlerts && !$(e).find('a.lichessTools-mute')[0]) {
          $('<a class="btn-rack__btn lichessTools-mute" data-icon="&#xE00F;"></a>')
            .attr('title',mutePlayingAlertTitle)
            .on('click',ev=>{
              ev.preventDefault();
              parent.lichess.pubsub.emit('mutePlayer',user);
            })
            .appendTo(e);
        }
      });
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
      online:[],
      playing:[]
    };
    following_onlines=(friends,data)=>{
      console.debug('following_onlines',data);
      if (this.onlinesInterval) {
        clearInterval(this.onlinesInterval);
        this.onlinesInterval=0;
        this.onFirstFollowingOnlines();
      }
      const parent=this.lichessTools;
      const $=parent.$;
      this.user_data.online=data?.d?.map(this.getUserId)||[];
      this.user_data.playing=data?.playing?.map(this.getUserId)||[];
      this.updateFriendsPage();
      this.updateFriendsMenu();
    };
    enters=(user,data)=>{
      console.debug('enters',user,data?.isPlaying);
      const parent=this.lichessTools;
      user=this.getUserId(user);
      if (!this.user_data.online.includes(user)) this.user_data.online.push(user);
      const isPlaying=data?.playing;
      if (isPlaying) {
        if (!this.user_data.playing.includes(user)) this.user_data.playing.push(user);
      } else {
        parent.arrayRemoveAll(this.user_data.playing,u=>u===user);
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
    };
    leaves=(user)=>{
      console.debug('leaves',user);
      const parent=this.lichessTools;
      user=this.getUserId(user);
      parent.arrayRemoveAll(this.user_data.online,u=>u===user);
      parent.arrayRemoveAll(this.user_data.playing,u=>u===user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
    };
    playing=(user)=>{
      console.debug('playing',user);
      user=this.getUserId(user);
      if (!this.user_data.playing.includes(user)) this.user_data.playing.push(user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
    };
    stopped_playing=(user)=>{
      console.debug('stopped_playing',user);
      const parent=this.lichessTools;
      user=this.getUserId(user);
      parent.arrayRemoveAll(this.user_data.playing,u=>u===user);
      this.updateFriendsPage();
      this.updateFriendsMenu();
    };

    onFirstFollowingOnlines=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const friendsBoxMode=parent.currentOptions.getValue('openFriends');

      switch(friendsBoxMode) {
        case true:
        case 'true':
        case 'open':
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
      if (friendsBoxMode=='menu'||(liveFriendsPage&&parent.isFriendsPage())) {
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
        lichess.pubsub.emit("socket.send", "following_onlines");
      },1000);

      switch(friendsBoxMode) {
        case true:
        case 'true':
        case 'open': {
          $('#friend_box').show();
          $('#topnav section.lichessTools-onlineFriends').remove();
        }
        break;
        case 'menu': {
          $('#friend_box').hide();
        }
        break;
        case 'hidden': {
          $('#friend_box .content_wrap').addClass('none');
          $('#friend_box').hide();
          $('#topnav section.lichessTools-onlineFriends').remove();
        }
        break;
        default: {
          $('#friend_box').show();
          $('#topnav section.lichessTools-onlineFriends').remove();
        }
        break;
      }           
    }
  }
  LiChessTools.Tools.FriendsList=FriendsListTool;
})();

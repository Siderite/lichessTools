(()=>{
  class FriendsListTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'openFriends',
        category: 'friends',
        type:'single',
        possibleValues: ['default','open','menu','hidden'],
        defaultValue: 'menu'
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
        'openFriends.menu': 'Menu'
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

      }
    }

    updateFriendsMenu=()=>{
      const $=this.lichessTools.$;
      const trans=this.lichessTools.translator;
      const myName=$('body').attr('data-user'); //TODO unify current user API
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
    
    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.openFriends;
      this.logOption('Online friend list', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const setInterval=parent.global.setInterval;
      const clearInterval=parent.global.clearInterval;
      lichess.pubsub.off('socket.in.following_onlines', this.updateFriendsMenu);

      const openFriendsBox=()=> {
        let interval;
        $('.friend_box_title')
          .on('click',()=>{
            this.lichessTools.global.clearInterval(interval);
          });
          interval = this.lichessTools.global.setInterval(()=> {
          if ($('#friend_box .content_wrap').is('.none')) {
            $('.friend_box_title').trigger('click');
            this.lichessTools.global.clearInterval(interval);
          }
        },2000);
      }

      switch(value) {
        case true:
        case 'true':
        case 'open': {
          $('#friend_box').show();
          openFriendsBox();
          $('#topnav section.lichessTools-onlineFriends').remove();
        }
        break;
        case 'menu': {
          $('#friend_box').hide();
          openFriendsBox();
          lichess.pubsub.on('socket.in.following_onlines', this.updateFriendsMenu);
          this.updateFriendsMenu();
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

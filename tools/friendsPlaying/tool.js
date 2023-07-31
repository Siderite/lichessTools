(()=>{
  class FriendsPlayingTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'friendsPlaying',
        category: 'friends',
        type:'multiple',
        possibleValues: ['ultrabullet','bullet','blitz','rapid','classical','standard'],
        valuePrefix:'gameType-',
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        playing:'%s playing',
        'gameType-unknown': '',
        'gameType-classical': 'Classical',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'gameType-standard': 'Standard only',
        'options.friendsPlaying': 'Sound and voice alert when friends start playing',
        'audioNotAllowedTitle': 'LiChess Tools - Audio allowed only after user action'
      },
      'ro-RO':{
      playing:'Joac\u0103 %s',
        'gameType-unknown': '',
        'gameType-classical': 'Classical',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'gameType-standard': 'Doar Standard',
        'options.friendsPlaying': 'Alert\u0103 sonor\u0103 \u015Fi vocal\u0103 c\u00E2nd joac\u0103 prieteni',
        'audioNotAllowedTitle': 'LiChess Tools - Sunete permise doar dup\u0103 ac\u0163iune utilizator'
      }
    }

  showAudioNotAllowed=()=>{
    const parent=this.lichessTools;
    const trans=parent.translator;
    const isAudioAllowed=parent.isAudioAllowed();
    const noAutoPlay=parent.$('#warn-no-autoplay')
      .toggleClass('shown',!isAudioAllowed);
    const title=trans.noarg('audioNotAllowedTitle');
    if (isAudioAllowed) {
      //parent.$('body').removeClass('lichessTools-audioNotAllowed');
      parent.global.clearInterval(this.audioCheckTimeout);
      if (noAutoPlay.attr('title')===title) {
        noAutoPlay.removeAttr('title');
      }
    } else {
      //parent.$('body').addClass('lichessTools-audioNotAllowed');
      if (!noAutoPlay.attr('title')) {
        noAutoPlay.attr('title',title);
      }
      if (!this.audioCheckTimeout) {
        this.audioCheckTimeout=parent.global.setInterval(this.showAudioNotAllowed,1000);
      }
    }
  };

  playFriendSound=async (username)=>{
    this.lichessTools.global.console.debug(username + ' playing');
    const now=new Date().getTime();
    const isMuted=(this.lichessTools.currentOptions.getValue('mutedPlayers')||[]).includes(username?.toLowerCase());
    let silent=isMuted?'muted':'';
    if (!silent && this.lichessTools.lichess.quietMode) {
      silent+='quietMode';
    }
    if (!silent && !this.lichessTools.isAudioAllowed()) {
      silent+='audioNotAllowed';
      this.showAudioNotAllowed();
    }
    if (!silent) {
      let friendSoundTime=this.lichessTools.lichess.storage.get('LiChessTools.friendSound');
      if (friendSoundTime) {
        friendSoundTime=this.lichessTools.global.JSON.parse(friendSoundTime).value.time;
        if (now-friendSoundTime<1000) silent+='tooSoon';
      }
    }
    let gameType='unknown';
    let eventType='';
    let variant='';
    let text='';
    try {
      text = await this.lichessTools.net.fetch({url:'/api/games/user/{username}?max=1&tags=true&ongoing=true&finished=false',args:{username:username}});
    } catch(e) {
      if (e.toString().includes('Failed to fetch')) {
        this.lichessTools.global.console.debug('Failed to fetch net error');
        return;
      }
      this.lichessTools.global.console.warn('playFriendSound game fetch error',e);
    }
    if (text) {
      gameType=this.lichessTools.getGameTime(this.lichessTools.getPgnTag(text,'TimeControl'));
      eventType=this.lichessTools.getPgnTag(text,'Event');
      variant=this.lichessTools.getPgnTag(text,'Variant');
      if (!silent && gameType && !this.lichessTools.isOptionSet(this.lichessTools.currentOptions.getValue('friendsPlaying'),gameType)) {
        silent+='wrongGameType';
      }
      if (!silent && this.lichessTools.isOptionSet(this.lichessTools.currentOptions.getValue('friendsPlaying'),'standard')) {
        if (!/^standard$/i.test(variant)) silent+='notStandard';
      }
    }
    if (!silent) {
      const id = (this.lichessTools.global.Math.random() + 1).toString(36).substring(8);
      this.lichessTools.lichess.storage.fire('LiChessTools.friendSound',{ time: now, id: id});
      await this.lichessTools.timeout(200);
      let item=lichess.storage.get('LiChessTools.friendSound');
      if (item) {
        item=this.lichessTools.global.JSON.parse(item).value;
        if (id!=item.id) silent+='lostBid';
      }
    }
    this.lichessTools.global.console.debug('  ... '+eventType+' ('+gameType+','+variant+') '+silent);
    if (silent) {
      return;
    }
    await this.lichessTools.timeout(500);
    this.beep.play();
    let translation=this.lichessTools.translator.plural('playing',1,username)+', '+this.lichessTools.translator.noarg('gameType-'+gameType);
    if (variant&&variant!='Standard') {
      translation+=' '+variant;
    }
    this.lichessTools.lichess.sound.say(translation, false, true, this.lichessTools.isTranslated);
    //this.lichessTools.lichess.sound.say(eventType, false, true, false); // Event name cannot be translated
  };

  mutePlayer=async user=>{
    user=user?.toLowerCase();
    const parent=this.lichessTools;
    const mutedPlayers=parent.currentOptions.getValue('mutedPlayers')||[];
    if (mutedPlayers.includes(user)) {
      parent.arrayRemoveAll(mutedPlayers,u=>u==user);
    } else {
      mutedPlayers.push(user);
    }
    parent.currentOptions.mutedPlayers=mutedPlayers;
    await parent.saveOptions(parent.currentOptions);
    parent.lichess.storage.fire('lichessTools.reloadOptions');
  };

    async start() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('friendsPlaying');
      this.logOption('Sound alert when friends start playing', value);
      if (parent.currentOptions.getValue('mutedPlayers')?.length) {
        this.logOption(' ... muted', parent.currentOptions.getValue('mutedPlayers').join(','));
      }
      const lichess=parent.lichess;
      if (!lichess) return;
      const setInterval=parent.global.setInterval;
      const clearInterval=parent.global.clearInterval;
      this.beep = await lichess.sound.load('friendPlaying', lichess.sound.baseUrl + '/piano/GenericNotify');
      lichess.pubsub.off('socket.in.following_playing', this.playFriendSound);
      lichess.pubsub.off('mutePlayer', this.mutePlayer);
      //parent.$('body').removeClass('lichessTools-audioNotAllowed');
      clearInterval(this.audioCheckTimeout);
      //$('div.lichessTools-audioNotAllowedIcon').remove();
      if (value!==false && value?.toString().replace(/,standard/i,'')) {
        lichess.pubsub.on('socket.in.following_playing', this.playFriendSound);
        lichess.pubsub.on('mutePlayer', this.mutePlayer);
        /*if (!$('div.lichessTools-audioNotAllowedIcon').length) {
          $('<div>')
            .addClass('lichessTools-audioNotAllowedIcon')
            .attr('title',trans.noarg('audioNotAllowedTitle'))
            .attr('data-icon','\uE073')
            .prependTo('#top > .site-buttons');
        }*/
      }
    }
  }
  LiChessTools.Tools.FriendsPlaying=FriendsPlayingTool;
})();

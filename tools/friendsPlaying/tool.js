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
        'options.friends': 'Friends',
        'playing':'%s playing',
        'gameType-unknown': ',',
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
        'options.friends': 'Prieteni',
        'playing':'Joac\u0103 %s',
        'gameType-unknown': ',',
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
      parent.global.clearInterval(this.audioCheckTimeout);
      if (noAutoPlay.attr('title')===title) {
        noAutoPlay.removeAttr('title');
      }
    } else {
      if (!noAutoPlay.attr('title')) {
        noAutoPlay.attr('title',title);
      }
      if (!this.audioCheckTimeout) {
        this.audioCheckTimeout=parent.global.setInterval(this.showAudioNotAllowed,1000);
      }
    }
  };

  _useUserApi=true;
  playFriendSound=async (username)=>{
    this.lichessTools.global.console.debug(username + ' playing');
    const now=Date.now();
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
      let friendSoundTime=+(this.lichessTools.jsonParse(_=>this.lichessTools.lichess.storage.get('LiChessTools.friendSound'))?.value?.time);
      if (friendSoundTime) {
        if (now-friendSoundTime<1000) silent+='tooSoon';
      }
    }
    let gameType='unknown';
    let eventType='';
    let variant='';
    let hasInfo=false;
    if (!silent && !this.lichessTools.net.slowMode) {
      try {
        if (this._useUserApi) {
          const arr = await this.lichessTools.net.json({url:'/api/users/status?ids={username}&withGameMetas=true',args:{username:username}});
          const data=arr.find(i=>i.id==username);
          if (data?.playing) {
            gameType=this.lichessTools.getGameTime(data.playing.clock,true);
            variant=data.playing.variant;
            hasInfo=true;
          }
        } else {
          const text = await this.lichessTools.net.fetch({url:'/api/games/user/{username}?max=1&tags=true&ongoing=true&finished=false',args:{username:username}});
          if (text) {
            gameType=this.lichessTools.getGameTime(this.lichessTools.getPgnTag(text,'TimeControl'));
            eventType=this.lichessTools.getPgnTag(text,'Event');
            variant=this.lichessTools.getPgnTag(text,'Variant');
            hasInfo=true;
          }
        }
      } catch(e) {
        if (e.toString().includes('Failed to fetch')) {
          this.lichessTools.global.console.debug('Failed to fetch net error');
        } else {
          this.lichessTools.global.console.warn('playFriendSound game fetch error',e);
        }
      }
    }
    const isStandard=!variant || /^standard$/i.test(variant);
    if (hasInfo) {
      if (!silent && gameType!='unknown' && !this.lichessTools.isOptionSet(this.lichessTools.currentOptions.getValue('friendsPlaying'),gameType)) {
        silent+='wrongGameType';
      }
      if (!silent && this.lichessTools.isOptionSet(this.lichessTools.currentOptions.getValue('friendsPlaying'),'standard')) {
        if (!isStandard) silent+='notStandard';
      }
    }
    if (!silent) {
      const id = (this.lichessTools.random() + 1).toString(36).substring(8);
      this.lichessTools.lichess.storage.fire('LiChessTools.friendSound',{ time: now, id: id});
      await this.lichessTools.timeout(200);
      const storedId=this.lichessTools.jsonParse(_=>this.lichessTools.lichess.storage.get('LiChessTools.friendSound'))?.value?.id;
      if (storedId && id!=storedId) silent+='lostBid';
    }
    this.lichessTools.global.console.debug('  ... '+eventType+' ('+gameType+','+variant+') '+silent);
    if (silent) {
      return;
    }
    await this.lichessTools.timeout(500);
    this.beep.play();
    let translation=this.lichessTools.translator.plural('playing',1,username?.replace(/[_\-]/g,' '))+', '+this.lichessTools.translator.noarg('gameType-'+gameType);
    if (!isStandard) {
      translation+=' '+variant;
    }
    this.lichessTools.speak(translation,{ translated: this.lichessTools.isTranslated });
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
    parent.fireReloadOptions();
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
      clearInterval(this.audioCheckTimeout);
      if (value!==false && value?.toString().replace(/,standard/i,'')) {
        lichess.pubsub.on('socket.in.following_playing', this.playFriendSound);
        lichess.pubsub.on('mutePlayer', this.mutePlayer);
      }
    }
  }
  LiChessTools.Tools.FriendsPlaying=FriendsPlayingTool;
})();

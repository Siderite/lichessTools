(()=>{
  class FriendsPlayingTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'friendsPlaying',
        category: 'friends',
        type:'multiple',
        possibleValues: ['ultrabullet','bullet','blitz','rapid','classical'],
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
        'options.friendsPlaying': 'Sound and voice alert when friends start playing',
      },
      'ro-RO':{
      playing:'Joac\u0103 %s',
        'gameType-unknown': '',
        'gameType-classical': 'Classical',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'options.friendsPlaying': 'Alert\u0103 sonor\u0103 \u015Fi vocal\u0103 c\u00E2nd joac\u0103 prieteni'
      }
    }

  silentWarning=()=>{
    const $=this.lichessTools.$;
    $('#top > .site-buttons').attr('data-icon','\uE073');
    setTimeout(()=>$('#top > .site-buttons').removeAttr('data-icon'),3000);
  };

  sayPlaying=async function(username, silent) {
    let gameType='unknown';
    let eventType='';
    let variant='';
    try {
      const text = await this.lichessTools.net.fetch({url:'/api/games/user/{username}?max=1&tags=true&ongoing=true&finished=false',args:{username:username}});
      if (text) {
        gameType=this.lichessTools.getGameTime(this.lichessTools.getPgnTag(text,'TimeControl'));
        eventType=this.lichessTools.getPgnTag(text,'Event');
        variant=this.lichessTools.getPgnTag(text,'Variant');
        this.lichessTools.global.console.log('  ... '+eventType+' ('+gameType+','+variant+')'+(silent?' silent':''));
      }
      if (silent) {
        this.silentWarning();
        return;
      }
      if (gameType && !this.lichessTools.isOptionSet(this.lichessTools.currentOptions.friendsPlaying,gameType)) return;
      await this.lichessTools.timeout(500);
      this.beep.play();
      let translation=this.lichessTools.translator.plural('playing',1,username)+', '+this.lichessTools.translator.noarg('gameType-'+gameType);
      if (variant&&variant!='Standard') {
        translation+=' '+variant;
      }
      this.lichessTools.lichess.sound.say(translation, false, true, this.lichessTools.isTranslated);
      //this.lichessTools.lichess.sound.say(eventType, false, true, false); // Event name cannot be translated
    } catch(e) {
      if (e.toString().includes('Failed to fetch')) {
        this.lichessTools.global.console.debug('Failed to fetch net error, retrying sayPlaying in 1s');
        this.lichessTools.global.setTimeout(()=>sayPlaying(username,silent),1000);
        return;
      }
      this.lichessTools.global.console.warn('sayPlaying error',e);
    }
  }

  playFriendSound=async (username)=>{
    this.lichessTools.global.console.log(username + ' playing');
    const now=new Date().getTime();
    const isMuted=(this.lichessTools.currentOptions.mutedPlayers||[]).includes(username?.toLowerCase());
    let silent=isMuted || !this.lichessTools.isAudioAllowed();
    if (!silent) {
      let friendSoundTime=this.lichessTools.lichess.storage.get('LiChessTools.friendSound');
      if (friendSoundTime) {
        friendSoundTime=this.lichessTools.global.JSON.parse(friendSoundTime).value.time;
        if (now-friendSoundTime<1000) silent=true;
      }
    }
    if (!silent) {
      const id = (this.lichessTools.global.Math.random() + 1).toString(36).substring(8);
      this.lichessTools.lichess.storage.fire('LiChessTools.friendSound',{ time: now, id: id});
      await this.lichessTools.timeout(200);
      let item=lichess.storage.get('LiChessTools.friendSound');
      if (item) {
        item=this.lichessTools.global.JSON.parse(item).value;
        if (id!=item.id) silent=true;
      }
    }
    this.sayPlaying(username, silent);
  };

  mutePlayer=async user=>{
    user=user?.toLowerCase();
    const parent=this.lichessTools;
    const mutedPlayers=parent.currentOptions.mutedPlayers||[];
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
      const value=parent.currentOptions.friendsPlaying;
      this.logOption('Sound alert when friends start playing', value);
      if (parent.currentOptions.mutedPlayers?.length) {
        this.logOption(' ... muted', parent.currentOptions.mutedPlayers.join(','));
      }
      const lichess=parent.lichess;
      if (!lichess) return;
      const setInterval=parent.global.setInterval;
      const clearInterval=parent.global.clearInterval;
      lichess.sound.loadOggOrMp3('friendPlaying', lichess.sound.baseUrl + '/piano/GenericNotify')
      this.beep = lichess.sound.soundSetSounds.get('friendPlaying')
      lichess.pubsub.off('socket.in.following_playing', this.playFriendSound);
      lichess.pubsub.off('mutePlayer', this.mutePlayer);
      if (value) {
        lichess.pubsub.on('socket.in.following_playing', this.playFriendSound);
        lichess.pubsub.on('mutePlayer', this.mutePlayer);
      }
    }
  }
  LiChessTools.Tools.FriendsPlaying=FriendsPlayingTool;
})();

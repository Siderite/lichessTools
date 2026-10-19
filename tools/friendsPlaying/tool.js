(() => {
  class FriendsPlayingTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['FriendsList'];

    preferences = [
      {
        name: 'friendsPlaying',
        category: 'friends',
        type: 'multiple',
        possibleValues: ['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical', 'standard'],
        valuePrefix: 'gameType-',
        defaultValue: false,
        needsLogin: true
      },
      {
        name: 'muteFriendsNotifications',
        category: 'friends',
        type: 'single',
        possibleValues: ['muted', 'unmuted'],
        defaultValue: 'unmuted',
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.friends': 'Friends',
        'options.muteFriendsNotifications': 'Default playing alerts state for newly added friends',
        'playing': '%s playing',
        'gameType-unknown': ',',
        'gameType-classical': 'Classical',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'gameType-standard': 'Standard only',
        'options.friendsPlaying': 'Sound and voice alert when friends start playing',
        'friendsPlaying.ultrabullet': 'Ultrabullet',
        'friendsPlaying.bullet': 'Bullet',
        'friendsPlaying.blitz': 'Blitz',
        'friendsPlaying.rapid': 'Rapid',
        'friendsPlaying.classical': 'Classical',
        'friendsPlaying.standard': 'Standard only',
        'audioNotAllowedTitle': 'LiChess Tools - Audio allowed only after user action',
        'muteFriendsNotifications.muted': 'Muted',
        'muteFriendsNotifications.unmuted': 'Unmuted'
      },
      'ro-RO': {
        'options.friends': 'Prieteni',
        'options.muteFriendsNotifications': 'Starea implicit\u0103 a alertelor pentru prietenii nou ad\u0103uga\u0163i',
        'playing': 'Joac\u0103 %s',
        'gameType-unknown': ',',
        'gameType-classical': 'Clasic',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'gameType-standard': 'Doar Standard',
        'options.friendsPlaying': 'Alert\u0103 sonor\u0103 \u015Fi vocal\u0103 c\u00E2nd joac\u0103 prieteni',
        'friendsPlaying.ultrabullet': 'Ultrabullet',
        'friendsPlaying.bullet': 'Bullet',
        'friendsPlaying.blitz': 'Blitz',
        'friendsPlaying.rapid': 'Rapid',
        'friendsPlaying.classical': 'Clasic',
        'friendsPlaying.standard': 'Doar Standard',
        'audioNotAllowedTitle': 'LiChess Tools - Sunete permise doar dup\u0103 ac\u0163iune utilizator',
        'muteFriendsNotifications.muted': 'Dezactivate',
        'muteFriendsNotifications.unmuted': 'Activate'
      }
    }

    showAudioNotAllowed = async () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const isAudioAllowed = await lt.isAudioAllowed();
      const noAutoPlay = lt.$('#warn-no-autoplay')
        .toggleClass('shown', !isAudioAllowed);
      const title = trans.noarg('audioNotAllowedTitle');
      if (isAudioAllowed) {
        lt.global.clearInterval(this.audioCheckTimeout);
        if (noAutoPlay.attr('title') === title) {
          noAutoPlay.removeAttr('title');
        }
      } else {
        if (!noAutoPlay.attr('title')) {
          noAutoPlay.attr('title', title);
        }
        if (!this.audioCheckTimeout) {
          this.audioCheckTimeout = lt.global.setInterval(this.showAudioNotAllowed, 1000);
        }
      }
    };

    defaultAlertStatus = ()=> this.lichessTools.currentOptions.getValue('muteFriendsNotifications') || 'muted';

    alertStatusMap = ()=> this.lichessTools.storage.get('LiChessTools.friendsAlertStatus') || {};

    alertStatus = (user, statusMap) => (statusMap ?? this.alertStatusMap())[user?.toLowerCase()] || this.defaultAlertStatus();

    alertMuted = (user, statusMap) => this.alertStatus(user, statusMap) == 'muted';

    playFriendSound = async (username) => {
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      lt.debug && lt.global.console.debug(username + ' playing');
      const now = Date.now();
      const status = this.alertStatus(username);
      let silent = status == 'muted' ? 'muted' : '';
      if (!silent && lt.lichess.quietMode) {
        silent += 'quietMode';
      }
      if (!silent) {
        const isAudioAllowed = await lt.isAudioAllowed();
        if (!isAudioAllowed) {
          silent += 'audioNotAllowed';
          this.showAudioNotAllowed();
        }
      }
      if (!silent) {
        let friendSoundTime = +(lt.storage.get('LiChessTools.friendSound')?.value?.time);
        if (friendSoundTime) {
          if (now - friendSoundTime < 1000) silent += 'tooSoon';
        }
      }
      let gameType = 'unknown';
      let eventType = '';
      let variant = '';
      let hasInfo = false;
      if (!silent && !lt.net.slowMode) {
        try {
          const arr = await lt.api.user.getUserStatus([username], { withGameMetas: true });
          const data = arr.find(i => i.id == username);
          if (data?.playing) {
            gameType = lt.getGameTime(data.playing.clock, true);
            variant = data.playing.variant;
            hasInfo = true;
          }
        } catch (e) {
          if (e.toString().includes('Failed to fetch')) {
            lt.global.console.debug('Failed to fetch net error');
          } else {
            lt.global.console.warn('playFriendSound game fetch error', e);
          }
        }
      }
      const isStandard = !variant || /^standard$/i.test(variant);
      if (hasInfo) {
        if (!silent && gameType != 'unknown' && !lt.isOptionSet(lt.currentOptions.getValue('friendsPlaying'), gameType)) {
          silent += 'wrongGameType';
        }
        if (!silent && lt.isOptionSet(lt.currentOptions.getValue('friendsPlaying'), 'standard')) {
          if (!isStandard) silent += 'notStandard';
        }
      }
      if (!silent) {
        const id = (lt.random() + 1).toString(36).substring(8);
        lt.storage.fire('LiChessTools.friendSound', { time: now, id: id });
        await lt.timeout(200);
        const storedId = lt.storage.get('LiChessTools.friendSound')?.value?.id;
        if (storedId && id != storedId) silent += 'lostBid';
      }
      lt.debug && lt.global.console.debug('  ... ' + eventType + ' (' + gameType + ',' + variant + ') ' + silent);
      if (silent) {
        return;
      }
      await lt.timeout(500);
      lt.play('piano/GenericNotify.mp3');
   
      let translation = lt.translator.plural('playing', 1, username?.replace(/[_\-]/g, ' ')) + ', ' + lt.translator.noarg('gameType-' + gameType);
      if (!isStandard) {
        translation += ' ' + variant;
      }
      lt.speak(translation, { translated: lt.isTranslated });
      //lt.lichess.sound.say(eventType, false, true, false); // Event name cannot be translated
    };

    mutePlayer = user => {
      user = user?.toLowerCase();
      const lt = this.lichessTools;
      const statusMap = this.alertStatusMap();
      const status = this.alertStatus(user, statusMap);
      const newStatus = status == 'muted' ? 'unmuted' : 'muted';
      if (newStatus == this.defaultAlertStatus()) {
        delete statusMap[user];
      } else {
        statusMap[user] = newStatus;
      }
      lt.storage.set('LiChessTools.friendsAlertStatus', statusMap);
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('friendsPlaying');
      const alerts = this.alertStatusMap();
      const legacyMutedPlayers = lt.currentOptions.getValue('mutedPlayers');
      if (legacyMutedPlayers?.length) {
        for (const legacyUser of legacyMutedPlayers) {
          if (!alerts[legacyUser]) {
            alerts[legacyUser] = 'muted';
          }
        }
        lt.storage.set('LiChessTools.friendsAlertStatus', alerts);
        delete lt.currentOptions.mutedPlayers;
        await lt.saveOptions(lt.currentOptions);
      }
      this.logOption('Friends playing alert', value);
      this.logOption(' ... default for new friends', this.defaultAlertStatus());
      for (const status of ['muted','unmuted']) {
        const users = Object.keys(alerts).filter(u=>alerts[u]==status);
        if (users.length) {
          this.logOption(' ... ' + status, users.join(','));
        }
      }
      this.options = { enabled: !!value, defaultAlertStatus: this.defaultAlertStatus() };
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const setInterval = lt.global.setInterval;
      const clearInterval = lt.global.clearInterval;
      lt.uiApi.onlineFriends.events.off('playing', this.playFriendSound);
      lt.pubsub.off('lichessTools.mutePlayer', this.mutePlayer);
      clearInterval(this.audioCheckTimeout);
      if (value !== false && value?.toString()?.replace(/,\s*standard/i, '')) {
        lt.uiApi.onlineFriends.events.on('playing', this.playFriendSound);
        lt.pubsub.on('lichessTools.mutePlayer', this.mutePlayer);
      }
    }
  }
  LiChessTools.Tools.FriendsPlaying = FriendsPlayingTool;
})();

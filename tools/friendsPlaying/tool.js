(() => {
  class FriendsPlayingTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'friendsPlaying',
        category: 'friends',
        type: 'multiple',
        possibleValues: ['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical', 'standard'],
        valuePrefix: 'gameType-',
        defaultValue: false,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.friends': 'Friends',
        'playing': '%s playing',
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
      'ro-RO': {
        'options.friends': 'Prieteni',
        'playing': 'Joac\u0103 %s',
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

    playFriendSound = async (username) => {
      const lt = this.lichessTools;
      lt.debug && lt.global.console.debug(username + ' playing');
      const now = Date.now();
      const isMuted = (lt.currentOptions.getValue('mutedPlayers') || []).includes(username?.toLowerCase());
      let silent = isMuted ? 'muted' : '';
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
      this.beep?.play();
      let translation = lt.translator.plural('playing', 1, username?.replace(/[_\-]/g, ' ')) + ', ' + lt.translator.noarg('gameType-' + gameType);
      if (!isStandard) {
        translation += ' ' + variant;
      }
      lt.speak(translation, { translated: lt.isTranslated });
      //lt.lichess.sound.say(eventType, false, true, false); // Event name cannot be translated
    };

    mutePlayer = async user => {
      user = user?.toLowerCase();
      const lt = this.lichessTools;
      const mutedPlayers = lt.currentOptions.getValue('mutedPlayers') || [];
      if (mutedPlayers.includes(user)) {
        lt.arrayRemoveAll(mutedPlayers, u => u == user);
      } else {
        mutedPlayers.push(user);
      }
      lt.currentOptions.mutedPlayers = mutedPlayers;
      await lt.saveOptions(lt.currentOptions);
      lt.fireReloadOptions();
    };

    async start() {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('friendsPlaying');
      this.logOption('Sound alert when friends start playing', value);
      if (lt.currentOptions.getValue('mutedPlayers')?.length) {
        this.logOption(' ... muted', lt.currentOptions.getValue('mutedPlayers').join(','));
      }
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = lt.lichess;
      if (!lichess) return;
      const setInterval = lt.global.setInterval;
      const clearInterval = lt.global.clearInterval;
      lt.uiApi.onlineFriends.events.off('playing', this.playFriendSound);
      lt.pubsub.off('lichessTools.mutePlayer', this.mutePlayer);
      clearInterval(this.audioCheckTimeout);
      if (value !== false && value?.toString()?.replace(/,\s*standard/i, '')) {
        this.beep = await lichess.sound.load('friendPlaying', lichess.sound.url('piano/GenericNotify.mp3'));
        lt.uiApi.onlineFriends.events.on('playing', this.playFriendSound);
        lt.pubsub.on('lichessTools.mutePlayer', this.mutePlayer);
      }
    }
  }
  LiChessTools.Tools.FriendsPlaying = FriendsPlayingTool;
})();

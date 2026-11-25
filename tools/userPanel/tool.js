(() => {
  class UserPanelTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Dialog', 'EmitContentLoaded', 'FriendsPlaying'];

    preferences = [
      {
        name: 'userPanel',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.userPanel': 'User focus panel',
        'userPanelButton': 'Focus',
        'userPanelTooltip': 'LiChess Tools - everything about this player',
        'userPanelTitle': 'User focus panel',
        'userPanelNow': 'Now',
        'userPanelActions': 'Actions',
        'userPanelMatch': 'Against you',
        'userPanelNotes': 'Notes',
        'userPanelOnline': 'Online',
        'userPanelOffline': 'Offline',
        'userPanelPlaying': 'Playing',
        'userPanelLiveGame': 'live game',
        'gameType-classical': 'Classical',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'userPanelRole-streamer': 'Streamer',
        'userPanelRole-coach': 'Coach',
        'userPanelFollowing': 'Following',
        'userPanelNotFollowing': 'Not following',
        'userPanelFollow': 'Follow',
        'userPanelTooltipFollow': 'Follows or unfollows them',
        'userPanelSubscribed': 'Subscribed',
        'userPanelNotSubscribed': 'Not subscribed',
        'userPanelTooltipSubscribe': 'Subscribes or unsubscribes you to their stream',
        'userPanelAlertMuted': 'Alerts muted',
        'userPanelAlertEnabled': 'Alerts enabled',
        'userPanelAlertDefault': 'Default alerts',
        'userPanelTooltipAlert': 'Cycles between alerts muted, alerts enabled and the default for new friends',
        'userPanelAs-white': 'as White',
        'userPanelAs-black': 'as Black',
        'userPanelNoGames': 'no games against you',
        'userPanelGamesCount': '%s games against you',
        'userPanelGamesCount:one': 'one game against you',
        'userPanelAddNote': 'Add',
        'userPanelTooltipAdd': 'Keeps what you typed in the box as a new note',
        'userPanelNoteHint': 'Anything worth remembering',
        'userPanelDelete': 'Delete',
        'userPanelConfirmDelete': 'Press again to delete',
        'userPanelTooltipDelete': 'Deletes this note - hold shift while clicking to delete it straight away',
        'userPanelNever': 'never read',
        'userPanelWhyFetch': 'the read failed',
        'userPanelWhyRate': 'Lichess slowed the read down',
        'userPanelWhy404': 'the page was not there',
        'userPanelWhyOther': 'error reading'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.userPanel': 'Panou focus utilizator',
        'userPanelButton': 'Focus',
        'userPanelTooltip': 'LiChess Tools - totul despre acest juc\u0103tor',
        'userPanelTitle': 'Panou focus pe user',
        'userPanelNow': 'Acum',
        'userPanelActions': 'Ac\u0163iuni',
        'userPanelMatch': '\u00cempotriva ta',
        'userPanelNotes': 'Note',
        'userPanelOnline': 'Online',
        'userPanelOffline': 'Offline',
        'userPanelPlaying': 'Joac\u0103',
        'userPanelLiveGame': 'joc activ',
        'gameType-classical': 'Clasic',
        'gameType-rapid': 'Rapid',
        'gameType-blitz': 'Blitz',
        'gameType-bullet': 'Bullet',
        'gameType-ultrabullet': 'Ultrabullet',
        'userPanelRole-streamer': 'Streamer',
        'userPanelRole-coach': 'Antrenor',
        'userPanelFollowing': 'Urm\u0103re\u015fti',
        'userPanelNotFollowing': 'Nu urm\u0103re\u015fti',
        'userPanelFollow': 'Urm\u0103re\u015fte',
        'userPanelTooltipFollow': 'Urm\u0103re\u015fte-i sau nu-i urm\u0103ri',
        'userPanelSubscribed': 'Abonat',
        'userPanelNotSubscribed': 'Neabonat',
        'userPanelTooltipSubscribe': 'Te aboneaz\u0103 sau dezaboneaz\u0103 de la stream-ul lor',
        'userPanelAlertMuted': 'Alerte deactivate',
        'userPanelAlertEnabled': 'Alerte activate',
        'userPanelAlertDefault': 'Alerte implicite',
        'userPanelTooltipAlert': 'Cicleaz\u0103 \u00eentre alerte permise, nepermise \u015fi valoarea implicit\u0103 pentru prieteni noi',
        'userPanelAs-white': 'cu albele',
        'userPanelAs-black': 'cu negrele',
        'userPanelNoGames': 'nici un joc \u00eempotriva ta',
        'userPanelGamesCount': '%s jocuri \u00eempotriva ta',
        'userPanelGamesCount:one': 'un joc \u00eempotriva ta',
        'userPanelAddNote': 'Adaug\u0103',
        'userPanelTooltipAdd': 'Pastreaz\u0103 ce ai introdus \u00een cutie ca o noti\u0163\u0103 nou\u0103',
        'userPanelNoteHint': 'Orice merit\u0103 re\u0163inut',
        'userPanelDelete': '\u015eterge',
        'userPanelConfirmDelete': 'Apas\u0103 din nou pentru a \u015fterge',
        'userPanelTooltipDelete': '\u015eterge aceast\u0103 noti\u0163\u0103 - \u0163ine ap\u0103sat shift pentru a \u015fterge direct',
        'userPanelNever': 'necitit',
        'userPanelWhyFetch': 'citirea a e\u0153uat',
        'userPanelWhyRate': 'Lichess a \u00eencetinit citirea',
        'userPanelWhy404': 'pagina nu era acolo',
        'userPanelWhyOther': 'eroare la citire'
      }
    }

    // the open card answers the two questions a person page raises; the cross is the one band that
    // costs a page of its own, and a note band is free because its text lives in this tool's key.
    // An open gives everything, so the cross opens too and pays from the caches this tool holds.
    panelOrder = [
      {key: 'now', open: true, label: 'userPanelNow'},
      {key: 'actions', open: true, label: 'userPanelActions'},
      {key: 'match', open: true, label: 'userPanelMatch'},
      {key: 'notes', open: true, label: 'userPanelNotes'}
    ];

    // the edge is held per name only to save the page read; a write moves it without waiting
    followFresh = 5 * 60 * 1000;
    probeDay = 24 * 3600 * 1000;
    // the cross is held beside the crosstable read it stands for, so a re-open pays nothing
    stableDay = 10 * 86400 * 1000;
    timeWords = ['ultrabullet','bullet','blitz','rapid','classical'];

    followKey = 'LiChessTools.userPanelFollow';
    probeKey = 'LiChessTools.userPanelProbe';
    subscribeKey = 'LiChessTools.userPanelSubscribe';
    notesKey = 'LiChessTools.userPanelNotes';
    stableKey = 'LiChessTools.userPanelStables';

    getUserId = (user) => user?.toLowerCase();

    // one accessor pair per key, so a key is named once and a read cannot invent a second spelling
    loadFollow = () => this.lichessTools.storage.get(this.followKey);
    saveFollow = (store) => this.lichessTools.storage.set(this.followKey, store);
    loadProbe = () => this.lichessTools.storage.get(this.probeKey);
    saveProbe = (probe) => this.lichessTools.storage.set(this.probeKey, probe);
    loadSubscribe = () => this.lichessTools.storage.get(this.subscribeKey);
    saveSubscribe = (list) => this.lichessTools.storage.set(this.subscribeKey, list);
    loadNotes = () => this.lichessTools.storage.get(this.notesKey);
    saveNotes = (notes) => this.lichessTools.storage.set(this.notesKey, notes);
    loadStables = () => this.lichessTools.storage.get(this.stableKey);
    saveStables = (stables) => this.lichessTools.storage.set(this.stableKey, stables);

    // the moment a read ran, spelled the way the site spells a time; a read that has only just run
    // says nothing, because a fresh stamp on every line is noise a reader never looks for
    atText = (at) => {
      const lt = this.lichessTools;
      if (!at) return lt.translator.noarg('userPanelNever');
      const age = lt.global.Date.now() - at;
      if (age < 60000) return '';
      return lt.getTimeText(age);
    };

    // one line of the card: the claim, and the reason a section cannot make one
    addRow = (node, key, text, opts = {}) => {
      const lt = this.lichessTools;
      const row = lt.$('<div class="lichessTools-userPanelRow">')
        .attr('data-lt-key', key)
        .appendTo(node);
      if (text) row.textSafe(text);
      if (opts.why) {
        lt.$('<span class="lichessTools-userPanel-why">').textSafe(opts.why).appendTo(row);
      }
      if (opts.at !== undefined) {
        const stamp = this.atText(opts.at);
        if (stamp) {
          lt.$('<span class="lichessTools-userPanel-at">').textSafe(stamp).appendTo(row);
        }
      }
      return row;
    };

    // a chip is a write you can make: the icon says which write, and the words say where things stand
    addChip = (node, key, label, title) => {
      const lt = this.lichessTools;
      return lt.$('<a class="lichessTools-userPanelChip" tabindex="0">')
        .attr('data-lt-act', key)
        .attr('title', title)
        .textSafe(label)
        .appendTo(node);
    };

    // a link row: the words are the click, and the address beside them is what the row says about it.
    // A game link also joins the site's own power tip list, so the mouse reads the game off the link
    addLink = (node, key, text, href, note = null, opts = {}) => {
      const lt = this.lichessTools;
      const row = this.addRow(node, key, null);
      const link = lt.$('<a class="lichessTools-userPanel-link" target="_blank" rel="noopener">')
        .attr('href', href)
        .attr('title', href)
        .textSafe(text)
        .appendTo(row);
      if (note) {
        lt.$('<span class="lichessTools-userPanel-note">').textSafe(note).appendTo(row);
      }
      if (opts.gameTip) {
        lt.lichess?.powertip?.manualGame(link[0]);
        link.one('mouseover',()=>$('#miniGame').attr('popover','auto').each((i,e)=>e.showPopover?.()));
      }
      return row;
    };

    // what a name answers from the batch, spelled the way the read spells it
    statusEntry = (panel) => panel.status?.find((s) => (s?.id || s?._id || s?.username)?.toLowerCase() == panel.userId);

    // everything but the head goes away, so a rebuild keeps the head and its affordance
    clearSection = (section) => {
      section.children().each((i,e) => {
        if (String(e?.tagName).toUpperCase() == 'H4') return;
        this.lichessTools.$(e).remove();
      });
    };

    // the badges are the cards this name has: the page you are on asserts its own card, a card page
    // this panel has fetched asserts the others, and a name on the live list has a streamer card
    // whether or not the probe got to answer
    buildBadges = (node, panel) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      node.empty();
      for (const role of ['streamer','coach']) {
        if (role == panel.route || panel.probe?.[role] || (role == 'streamer' && panel.liveEntry)) {
          lt.$('<span class="lichessTools-userPanel-badge" data-lt-badge="' + role + '">')
            .textSafe(trans.noarg('userPanelRole-' + role)).appendTo(node);
        }
      }
      return node;
    };

    // the line before the sections: the words a reader uses for this person, and the click that takes
    // them to the profil. The title and the name come off the status read, and the name alone is
    // enough when the read had nothing to say.
    buildTitle = (panel, content) => {
      const lt = this.lichessTools;
      const status = this.statusEntry(panel);
      const title = lt.$('<div class="lichessTools-userPanel-title">').appendTo(content);
      lt.$('<a class="lichessTools-userPanel-titlelink">')
        .attr('href', '/@/' + panel.userId)
        .textSafe((status?.title ? status.title + ' ' : '') + (status?.name || panel.userId))
        .appendTo(title);
      const badges = lt.$('<span class="lichessTools-userPanel-badges">').appendTo(title);
      panel.badges = badges;
      this.buildBadges(badges, panel);
    };

    // now: whether the person answers, and the games they are inside. A quiet card is a short card,
    // and a read that failed says which one failed.
    buildNow = (section, panel) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const status = this.statusEntry(panel);
      if (status) {
        const playing = status?.playing;
        const state = playing ? 'play' : status?.online ? 'on' : 'off';
        const row = this.addRow(section, 'now-status',
          trans.noarg(state == 'play' ? 'userPanelPlaying' : state == 'on' ? 'userPanelOnline' : 'userPanelOffline'),
          {at: panel.statusAt});
        lt.$('<i class="lichessTools-userPanel-dot">').attr('data-state', state).prependTo(row);
      } else if (panel.statusError) {
        this.addRow(section, 'now-why', null, {why: this.why(panel.statusError)});
      }
      for (const meta of this.gameMetas(status).slice(0, 3)) {
        const speed = this.gameSpeed(meta);
        const words = speed
          ? trans.noarg('gameType-' + speed)
          : trans.noarg('userPanelLiveGame');
        const key = 'now-game-' + (meta?.id || 'x');
        if (!meta?.id) {
          this.addRow(section, key, words);
          continue;
        }
        const orientation = this.gameOrientation(meta, panel);
        const href = '/game/' + meta.id + (orientation ? '/' + orientation : '');
        const note = orientation ? trans.noarg('userPanelAs-' + orientation) : null;
        this.addLink(section, key, words, href, note, {gameTip: true});
      }
    };

    // the metas the status carries while a person is inside a game: the read answers `playing` with
    // a meta when metas are asked for, and a `games` list can sit beside it
    gameMetas = (status) => {
      let metas = status?.playing && typeof(status.playing) != 'boolean' ? [status.playing] : [];
      if (Array.isArray(status?.games)) metas = metas.concat(status.games);
      const unique = [];
      for (const meta of metas) {
        if (meta?.id && unique.some((u) => u?.id == meta.id)) continue;
        unique.push(meta);
      }
      return unique;
    };

    // the time control of a game in the site's own words: a read may answer a speed word, a clock in
    // seconds, or a control spelled as minutes, and each spells the control in its own way
    gameSpeed = (meta) => {
      const lt = this.lichessTools;
      const speed = meta?.speed || meta?.perf;
      if (this.timeWords.includes(speed)) return speed;
      const clock = meta?.clock;
      if (clock?.initial != null) {
        const word = this.timeWordFromSeconds(clock.initial + 40 * (clock.increment || 0));
        if (word) return word;
      }
      const spelled = typeof(clock) == 'string' ? clock : meta?.timeControl;
      if (!spelled) return null;
      const word = lt.getGameTime(String(spelled), true);
      return this.timeWords.includes(word) ? word : null;
    };

    // the bands the site uses for a control measured in seconds, spelled the way the site spells them
    timeWordFromSeconds = (secs) =>
      secs >= 1500 ? 'classical'
      : secs >= 480 ? 'rapid'
      : secs >= 180 ? 'blitz'
      : secs >= 30 ? 'bullet'
      : secs > 0 ? 'ultrabullet' : null;

    // which colour the focused person plays in the game: the meta names the two players when it
    // names them at all, and a name that is not the focused person leaves the other colour
    metaColor = (meta, userId) => {
      const idOf = (v) => {
        if (typeof v == 'string') return v.toLowerCase();
        if (typeof v == 'object') return String(v?.id || v?._id || v?.username || '').toLowerCase();
        return '';
      };
      const white = idOf(meta?.white);
      const black = idOf(meta?.black);
      if (white == userId && white) return 'white';
      if (black == userId && black) return 'black';
      if (white) return 'black';
      if (black) return 'white';
      const spelled = String(meta?.color || meta?.side || '').toLowerCase();
      return spelled == 'white' || spelled == 'black' ? spelled : null;
    };

    // the link opens from the focused person's point of view: the meta answers when it can, and the
    // mini page carries the site's own link to the game in progress, orientation included
    gameOrientation = (meta, panel) => {
      const lt = this.lichessTools;
      const fromMeta = this.metaColor(meta, panel.userId);
      if (fromMeta) return fromMeta;
      if (!meta?.id || !panel.miniPage) return null;
      const link = new lt.global.RegExp('href="/game/' + lt.escapeRegex(meta.id) + '(?:/(?<orientation>white|black))?"')
        .exec(panel.miniPage);
      const spelled = link?.groups?.orientation;
      return spelled == 'white' || spelled == 'black' ? spelled : null;
    };

    // the words of an error, so a failed read says what failed rather than nothing
    why = (err) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const text = String(err || '');
      if (text.includes('Failed to fetch')) return trans.noarg('userPanelWhyFetch');
      if (text.includes('429')) return trans.noarg('userPanelWhyRate');
      if (text.includes('404')) return trans.noarg('userPanelWhy404');
      return trans.noarg('userPanelWhyOther');
    };

    // a name in the live list, read off whichever field the list carries
    liveMatch = (live, userId) => {
      const name = userId?.toLowerCase();
      for (const entry of live || []) {
        const id = entry?.id || entry?._id || entry?.username || entry?.user || entry?.name;
        if (id && String(id).toLowerCase() == name) return entry;
      }
      return null;
    };

    // the band of writes: one chip per write, and the words on it say where that write stands. A
    // write the page cannot speak for is not offered at all - no streamer card means no stream chip,
    // and no running play alert means no alert chip.
    buildActions = (section, panel) => {
      this.buildFollowChip(section, panel);
      if (panel.probe?.streamer || panel.liveEntry) this.buildStreamChip(section, panel);
      this.buildAlertChip(section, panel);
    };

    // the follow edge: the relation button on the mini page says where it stands, and the tap is the
    // write that moves it. The chip carries the state it last stated, so the tap after a write moves
    // the edge the other way rather than repeating the first. A read that named no button offers the
    // follow write and says why it could not read in the tip.
    buildFollowChip = (section, panel) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const userId = panel.userId;
      let following = panel.following === true;
      const tip = panel.followError ? this.why(panel.followError) : trans.noarg('userPanelTooltipFollow');
      const chip = this.addChip(section, 'follow',
        trans.noarg(panel.following == null ? 'userPanelFollow' : following ? 'userPanelFollowing' : 'userPanelNotFollowing'),
        tip);
      chip.on('click', (ev) => {
        ev.preventDefault();
        const on = !following;
        on ? this.actFollow(userId) : this.actUnfollow(userId);
        following = on;
        chip.replaceText(trans.noarg(on ? 'userPanelFollowing' : 'userPanelNotFollowing'));
      });
    };

    // the stream subscription: it waits on a card that exists, it glows while the live list holds the
    // name, and its tap is the subscription - Lichess keeps a subscription apart from a follow edge,
    // so the panel never writes one under the other
    buildStreamChip = (section, panel) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const userId = panel.userId;
      const chip = this.addChip(section, 'stream',
        trans.noarg((this.loadSubscribe() || {})[userId] ? 'userPanelSubscribed' : 'userPanelNotSubscribed'),
        trans.noarg('userPanelTooltipSubscribe'));
      if (panel.liveEntry) chip.attr('data-lt-live', 'true');
      chip.on('click', (ev) => {
        ev.preventDefault();
        const on = !((this.loadSubscribe() || {})[userId]);
        lt.api.streamer.subscribe(userId, on);
        this.setSubscribe(userId, on);
        chip.replaceText(trans.noarg(on ? 'userPanelSubscribed' : 'userPanelNotSubscribed'));
      });
    };

    // Lichess has no read route back for the watch list, so the chip reads back the writes this tool
    // made - a tap on an unsubscribed stream is a subscribe, and the words follow it
    setSubscribe = (userId, on) => {
      const store = this.loadSubscribe() || {};
      if (on) store[userId] = this.lichessTools.global.Date.now();
      else delete store[userId];
      this.saveSubscribe(store);
    };

    // the play alert: the chip waits on the alert running at all, and a tap walks the three states a
    // name can hold in the alert key - no entry, a muted entry, an unmuted entry - which the chip
    // spells Default alerts, Alerts muted and Alerts enabled
    buildAlertChip = (section, panel) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const alertsTool = lt.tools.FriendsPlayingTool;
      if (!alertsTool?.options?.enabled) return;
      const userId = panel.userId;
      const chip = this.addChip(section, 'alert',
        trans.noarg(this.alertWord(userId)), trans.noarg('userPanelTooltipAlert'));
      chip.on('click', (ev) => {
        ev.preventDefault();
        alertsTool.cycleAlertEntry(userId);
        chip.replaceText(trans.noarg(this.alertWord(userId)));
      });
    };

    // where the name stands in the alert key, read through the alert's own entry helpers: a spelled
    // entry says its own thing whatever the preference default is, and a name with no entry sits at
    // that default
    alertWord = (userId) => {
      const lt = this.lichessTools;
      const alertsTool = lt.tools.FriendsPlayingTool;
      const stored = alertsTool?.alertEntry?.(userId);
      return stored == 'muted' ? 'userPanelAlertMuted'
        : stored == 'unmuted' ? 'userPanelAlertEnabled' : 'userPanelAlertDefault';
    };

    // the follow edge both ways, kept beside the last read so a write moves the words at once
    actFollow = (userId) => {
      this.lichessTools.api.relation.follow(userId);
      this.markFollowing(userId, true);
    };

    actUnfollow = (userId) => {
      this.lichessTools.api.relation.unfollow(userId);
      this.markFollowing(userId, false);
    };

    markFollowing = (userId, on) => {
      const store = this.loadFollow() || {};
      store[userId] = {at: this.lichessTools.global.Date.now(), following: on};
      this.saveFollow(store);
    };

    // what an open card reads for itself: the status line, the two card pages the page you are on
    // does not assert, the live list for the glow, and the follow edge off that name's mini page. An
    // open is a choice the reader made, so the reads are paid there.
    panelReads = async (panel, userId) => {
      const lt = this.lichessTools;
      const now = lt.global.Date.now;
      try {
        panel.statusAt = now();
        panel.status = await lt.api.user.getUserStatus([userId], {withGameMetas: true});
      } catch (e) { panel.statusError = e; }
      try {
        panel.probe = await this.probeCards(userId);
      } catch (e) { panel.probeError = e; }
      try {
        panel.liveAt = now();
        panel.liveEntry = this.liveMatch(await lt.api.streamer.getLiveStreamers(), userId);
      } catch (e) { panel.liveError = e; }
      await this.readFollowEdge(panel, userId);
    };

    // the edge has no json route of its own: the mini page carries the relation button, and that
    // button names the write it would make - an unfollow link means the edge already stands. The
    // same page carries the site's own link to a game in progress, so it is kept for the now band.
    // The held edge only saves the page read, and the page is still paid when a live meta names no
    // players, because that page is what names the colour.
    readFollowEdge = async (panel, userId) => {
      const lt = this.lichessTools;
      const metas = this.gameMetas(this.statusEntry(panel));
      const metaSilent = metas.some((m) => m?.id && !this.metaColor(m, userId));
      const held = (this.loadFollow() || {})[userId];
      const fresh = held?.following != null && lt.global.Date.now() - (held.at || 0) < this.followFresh;
      if (!metaSilent) {
        panel.miniPage = null;
        if (fresh) {
          panel.following = held.following;
          return;
        }
      }
      try {
        panel.miniPage = await lt.api.user.getMini(userId);
        panel.following = await lt.api.relation.followingUser(userId, panel.miniPage);
      } catch (e) { panel.followError = e; }
    };

    // the two card pages the page you are on does not assert, asked once per name per day: the answer
    // decides whether the stream chip is there at all, and puts the role badges on the head line. The
    // api answers each ask with a head read, so the probe pays two headers and no body.
    probeCards = async (userId) => {
      const lt = this.lichessTools;
      const probe = this.loadProbe() || {};
      const entry = probe[userId];
      if (entry && lt.global.Date.now() - entry.at < this.probeDay) return entry;
      const fresh = {at: lt.global.Date.now()};
      const apiUser = lt.api.user;
      for (const route of ['streamer','coach']) {
        if (route == this.panelRouteOf(lt)) {
          fresh[route] = true;
          continue;
        }
        try {
          fresh[route] = await (route == 'streamer' ? apiUser.isStreamer(userId) : apiUser.isCoach(userId));
        } catch (e) {
          lt.global.console.warn('userPanel card probe ' + route, e);
          fresh[route] = false;
        }
      }
      probe[userId] = fresh;
      this.saveProbe(probe);
      return fresh;
    };

    // the page the browser is on, so probing it again buys nothing
    panelRouteOf = (lt) => lt.location.getPersonPage()?.route;

    // the cross is the one band that costs a page of its own: the json says whether the two have met,
    // the pair search names the game to open, and that game page answers with the marks a reader
    // counts - so the fragment goes in as it stands, and it is kept beside the crosstable read
    fillMatch = async (panel, section) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const me = lt.getUserId()?.toLowerCase();
      if (!me) return;
      try {
        const stables = this.loadStables() || {};
        const pair = me + ':' + panel.userId;
        const held = stables[pair];
        if (held?.html && lt.global.Date.now() - (held.at || 0) < this.stableDay) {
          $(held.html).appendTo(section);
          return;
        }
        const crosstable = await lt.api.user.getCrosstableJustCache(me, panel.userId) ||
          await lt.api.user.getCrosstable(me, panel.userId);
        if (!crosstable?.nbGames) {
          this.addRow(section, 'match-empty', trans.noarg('userPanelNoGames'));
          return;
        }
        const found = await lt.api.game.search(me, panel.userId);
        const gameId = found?.paginator?.currentPageResults?.[0]?.id;
        const page = gameId
          ? await lt.net.fetch({ url: '/game/{gameId}', args: { gameId }, ignoreStatuses: [ 404 ] })
          : null;
        const stable = page ? $(page).find('div.crosstable') : null;
        if (stable?.length) {
          const fragment = stable[0].outerHTML;
          stables[pair] = {at: lt.global.Date.now(), html: fragment};
          this.saveStables(stables);
          $(fragment).appendTo(section);
          return;
        }
        this.addRow(section, 'match-count',
          trans.pluralSame('userPanelGamesCount', crosstable.nbGames));
      } catch (e) {
        this.addRow(section, 'match-why', null, {why: this.why(e)});
      }
    };

    // the notes are this tool's own text, newest first, each in a rounded card with a small bin in
    // its corner: a click arms the delete and a second click keeps it, while a shift click goes
    // straight away. The box under the cards takes the next note.
    fillNotes = (panel, section) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const list = (this.loadNotes() || {})[panel.userId] || [];
      for (let i = list.length - 1; i >= 0; i--) this.buildNoteCard(section, panel, list, i);
      const input = lt.$('<textarea class="lichessTools-userPanel-input">')
        .attr('placeholder', trans.noarg('userPanelNoteHint'))
        .appendTo(section);
      this.panelMeasure = lt.$('<div class="lichessTools-userPanel-measure">').appendTo(section);
      input.on('keydown', (ev) => this.growTextarea(input));
      const add = this.addChip(section, 'noteAdd', trans.noarg('userPanelAddNote'),
        trans.noarg('userPanelTooltipAdd'));
      add.on('click', (ev) => {
        ev.preventDefault();
        this.addNote(panel, input);
      });
    };

    buildNoteCard = (section, panel, list, index) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const note = list[index];
      const card = lt.$('<div class="lichessTools-userPanel-note">')
        .attr('data-lt-note', index)
        .appendTo(section);
      const stamp = lt.global.Date.now() - (note?.at || lt.global.Date.now());
      if (stamp > 60000) {
        lt.$('<span class="lichessTools-userPanel-note-when">')
          .textSafe(lt.getTimeText(stamp))
          .appendTo(card);
      }
      lt.$('<span class="lichessTools-userPanel-note-text">')
        .textSafe(note?.text || '')
        .appendTo(card);
      const trash = this.addChip(card, 'noteDelete', trans.noarg('userPanelDelete'),
        trans.noarg('userPanelTooltipDelete'));
      trash.addClass('lichessTools-userPanel-trash');
      let armed = false;
      trash.on('click', (ev) => {
        ev.preventDefault();
        if (ev.shiftKey || armed) {
          this.deleteNote(panel, note);
          this.rebuildNotes(panel);
          return;
        }
        armed = true;
        trash.replaceText(trans.noarg('userPanelConfirmDelete'));
      });
    };

    addNote = (panel, input) => {
      const lt = this.lichessTools;
      const text = input.val()?.trim();
      if (!text) return;
      const notes = this.loadNotes() || {};
      const list = notes[panel.userId] || [];
      list.push({text: text, at: lt.global.Date.now()});
      notes[panel.userId] = list;
      this.saveNotes(notes);
      input.val('');
      this.rebuildNotes(panel);
    };

    deleteNote = (panel, note) => {
      const notes = this.loadNotes() || {};
      const list = notes[panel.userId] || [];
      const kept = list.filter((n) => !(n.text == note.text && n.at == note.at));
      if (kept.length) notes[panel.userId] = kept;
      else delete notes[panel.userId];
      this.saveNotes(notes);
    };

    rebuildNotes = (panel) => {
      const section = panel.notesSection;
      if (!section?.length) return;
      this.clearSection(section);
      this.fillNotes(panel, section);
    };

    // a textarea keeps its own height, so a keystroke measures the wrapped text in a hidden twin and
    // asks for that height; the sheet caps how tall the ask may get
    growTextarea = (input) => {
      const lt = this.lichessTools;
      const el = input[0];
      const measure = this.panelMeasure?.[0];
      if (!el || !measure) return;
      const style = lt.global.getComputedStyle(measure);
      const lineHeight = parseFloat(style?.lineHeight) || (parseFloat(style?.fontSize) || 14) * 1.3;
      const value = el.value ?? '';
      measure.textContent = /[\r\n]$/.test(value) ? value + '\u00a0' : value;
      const lines = Math.max(1, Math.ceil(measure.offsetHeight / lineHeight));
      el.style.height = Math.ceil((lines + 0.4) * lineHeight) + 'px';
    };

    fillSection = async (panel, section, key) => {
      if (section.attr('data-lt-filled') == 'true') return;
      section.attr('data-lt-filled', 'true');
      try {
        switch (key) {
          case 'now': this.buildNow(section, panel); break;
          case 'actions': this.buildActions(section, panel); break;
          case 'match': await this.fillMatch(panel, section); break;
          case 'notes': this.fillNotes(panel, section); break;
        }
      } catch (e) {
        this.lichessTools.global.console.warn('userPanel section ' + key, e);
      }
    };

    // opening a section is what pays for it, so the tap and the read stay one gesture
    openSection = (panel, section, key) => {
      section.attr('data-lt-open', 'true');
      if (section.attr('data-lt-filled') != 'true') {
        this.fillSection(panel, section, key);
      }
    };

    toggleSection = (panel, section, key) => {
      if (section.attr('data-lt-open') == 'true') section.attr('data-lt-open', 'false');
      else this.openSection(panel, section, key);
    };

    // one section of the card: the head is the affordance, and the rows under it are what an open
    // pays - the cross is the one band whose rows arrive after a read of their own
    buildSection = (panel, content, spec) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const section = lt.$('<section class="lichessTools-userPanel-section">')
        .attr('data-lt-key', spec.key)
        .attr('data-lt-open', spec.open ? 'true' : 'false')
        .appendTo(content);
      const head = lt.$('<h4 class="lichessTools-userPanel-head">')
        .textSafe(trans.noarg(spec.label))
        .appendTo(section);
      head.on('click', (ev) => {
        ev.preventDefault();
        this.toggleSection(panel, section, spec.key);
      });
      panel[spec.key + 'Section'] = section;
      if (spec.open) this.fillSection(panel, section, spec.key);
      return section;
    };

    openPanel = async (person) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!lt.dialog) return;
      const userId = this.getUserId(person.userId);
      const panel = {
        userId,
        route: person.route
      };
      await this.panelReads(panel, userId);
      const dialog = await lt.dialog({
        header: trans.noarg('userPanelTitle'),
        help: 'https://siderite.dev/blog/lichess-tools---user-manual#userPanel',
        noDrag: true
      });
      const $dialog = $(dialog)
        .addClass('lichessTools-userPanel');
      const content = $dialog.find('.dialog-content');
      dialog.showModal();
      this.buildTitle(panel, content);
      for (const spec of this.panelOrder) this.buildSection(panel, content, spec);
      $dialog.find('button.close-button').on('click', (ev) => {
        ev.preventDefault();
        this.closePanel($dialog);
      });
      this.panelDialog = $dialog;
    };

    closePanel = ($dialog) => {
      const lt = this.lichessTools;
      $dialog.each((i,e)=>e.close('cancel')).remove();
      this.panelDialog = null;
    };

    // where the chip goes on each page that names a person: the profile keeps it among the utility
    // links of the More dropdown, the streamer card beside its own online check, the coach card in
    // its side rack. The rest of a chain is what a card page that has not got the first host still
    // answers with, so the chip is never absent from a page that names a person.
    focusHosts = {
      profile: [['.menu-container.btn-rack .dropdown.btn-rack__btn .dropdown-window']],
      streamer: [['.overview div.ats','after']],
      coach: [['aside.coach-show__side']]
    };

    // the chip wears the idiom of the host it went into: a utility link in the dropdown, a button
    // on the streamer card, a function in the coach side
    focusClasses = {profile: 'text', streamer: 'button', coach: 'button button-empty text'};

    // one chip per page that names a person, on the first host the page really has
    addFocusChip = (person) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      for (const host of this.focusHosts[person.route] || []) {
        const target = $(host[0]).eq(0);
        if (!target.length) continue;
        const chip = $('<a class="lichessTools-userPanel">')
          .addClass(this.focusClasses[person.route])
          .attr('href', '#userPanel')
          .attr('data-icon', lt.icon.Bullseye)
          .attr('title', trans.noarg('userPanelTooltip'))
          .text(trans.noarg('userPanelButton'));
        chip.on('click', (ev) => {
          ev.preventDefault();
          this.openPanel(person);
        });
        if (host[1] == 'after') {
          chip.insertAfter(target);
        }
        else {
          chip.appendTo(target);
        }
        return chip;
      }
      return null;
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('userPanel');
      this.logOption('User panel', value);
      // what this tool laid down comes off first, so a start that runs again on the same page leaves
      // one chip - and a panel that survived a navigation is taken away the same way
      $('a.lichessTools-userPanel').remove();
      $('dialog.lichessTools-userPanel').each((i,e)=>e.close()).remove();
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (!value) return;
      const person = lt.location.getPersonPage();
      if (!person) return;
      // the writes this tool makes mean nothing on the page that names you, so no chip goes there
      if (this.getUserId(person.userId) == lt.getUserId()?.toLowerCase()) return;
      this.options = { enabled: true, route: person.route };
      lt.requestAF(()=>this.addFocusChip(person),'userPanel');
    }

  }

  LiChessTools.Tools.UserPanel = UserPanelTool;
})();









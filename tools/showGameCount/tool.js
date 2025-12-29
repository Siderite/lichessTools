(() => {
  class ShowGameCountTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitPuzzleChange', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'showGameCount',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showGameCount': 'Show player total game count'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showGameCount': 'Arat\u0103 totalul de partide al juc\u0103torului'
      }
    }

    getElementsForGameCount = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const dict = {};
      $.cached('.user-link,a[href^="/@/"]', 2000).each((i, e) => {
        if ($(e).closest('#friend_box,.lichessTools-onlineFriends,div.complete-list,.crosstable__users,div.chat__members,#dasher_app,.lichessTools-challengeOptions,#topnav,.ublog-post__meta').length) return;

        let textEl = $('.text', e);
        if (!textEl.length) textEl = $(e);
        if (textEl.is('.lichessTools-nogamecount,.lichessTools-gamecount')) return;
        const next = textEl.next();
        if (next.is('.lichessTools-gameCountBadge')) return;
        if (textEl.attr('data-icon')) return;
        if (textEl.attr('data-tab')) return;
        let url = textEl.attr('href') || textEl[0]?.dataset?.href;
        if (!url) return;

        if (!lt.inViewport(e)) return;

        const m = /\/@\/(?<userId>[^\/]+)\/?$/.exec(url);
        const userId = m?.groups?.userId?.toLowerCase();
        if (!userId) return;
        const list = dict[userId] || [];
        list.push(textEl);
        dict[userId] = list;
      });
      $.cached('span.mini-game__user', 2000).each((i, e) => {
        if ($(e).is('.lichessTools-nogamecount,.lichessTools-gamecount')) return;

        // Find the username text element
        let textEl = $(e).find('.lichessTools-userText');
        if (!textEl.length) {
          // Try to find the user link first
          const userLink = $(e).find('.ulink');
          if (userLink.length) {
            textEl = userLink;
          } else {
            const userNodeIndex = Array.from(e.childNodes).findIndex(n => n.nodeType == 3);
            if (userNodeIndex < 0) return;
            if (!lt.inViewport(e)) return;

            const userNode = e.childNodes[userNodeIndex];
            const username = userNode.textContent?.trim();
            if (!username) return;
            textEl = $('<span>').addClass('lichessTools-userText').text(' ' + username);
            e.insertBefore(textEl[0], userNode);
            e.removeChild(userNode);
          }
        }

        if (!lt.inViewport(e)) return;

        const userId = textEl.text()?.trim()?.toLowerCase();
        if (!userId) return;
        const list = dict[userId] || [];
        list.push(textEl);
        dict[userId] = list;
      });
      return dict;
    };

    cacheExpiration = 2 * 86400000; // 2 days
    get gameCountCache() {
      const lt = this.lichessTools;
      const global = lt.global;
      if (this._gameCountCache) return this._gameCountCache;
      try {
        const temp = lt.storage.get('LiChessTools.gameCountCache', { raw: true })
        if (temp) {
          lt.debug && global.console.debug('Size of game count cache:', temp.length);
          this._gameCountCache = new Map(lt.jsonParse(temp, {}));
        } else {
          this._gameCountCache = new Map();
        }
      } catch (e) {
        global.console.warn('Error parsing game count cache:', e);
        this._gameCountCache = new Map()
      }
      return this._gameCountCache;
    }

    saveCache = async () => {
      const lt = this.lichessTools;
      const cache = this.gameCountCache;
      for (const userId of cache.keys()) {
        const time = cache.get(userId).time;
        if (Date.now() - new Date(time) > this.cacheExpiration) cache.delete(userId);
      }
      lt.storage.set('LiChessTools.gameCountCache', [...this.gameCountCache]);
    };
    debouncedSaveCache = this.lichessTools.debounce(this.saveCache, 100, { defer: true });

    formatGameCount = (count) => {
      if (count === undefined || count === null) return null;
      // Use locale-aware formatting
      return count.toLocaleString();
    };

    processGameCounts = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.options.enabled) return;
      if (lt.global.document.hidden) return;
      const dict = this.getElementsForGameCount();
      const data = Object.keys(dict).map(userId => {
        const item = this.gameCountCache.get(userId);
        if (item) {
          item.time = Date.now()
          return item;
        }
        return { id: userId };
      });
      let toSaveCache = false;
      const userIds = data.filter(i => i.gameCount === undefined).map(i => i.id).slice(0, 200);
      if (userIds.length) {
        const users = await lt.api.user.getUsers(userIds);
        for (const user of users) {
          const item = data.find(i => i.id.toLowerCase() === user.id.toLowerCase())
          if (item) {
            // Sum games from all perfs since count.all isn't returned by this API
            let totalGames = 0;
            if (user.perfs) {
              for (const perf of Object.values(user.perfs)) {
                totalGames += perf.games || 0;
              }
            }
            item.gameCount = totalGames;
          }
        }
        for (const item of data) {
          if (item.gameCount === undefined) {
            if (userIds.includes(item.id) && !users.find(u => u.id.toLowerCase() == item.id.toLowerCase())) {
              item.gameCount = 0; // User not found, default to 0
            } else {
              continue;
            }
          }
          item.time = Date.now();
          this.gameCountCache.set(item.id, item);
          toSaveCache = true;
        }
      }
      if (toSaveCache) {
        this.debouncedSaveCache();
      }
      lt.global.requestAnimationFrame(() => {
        for (const item of data) {
          if (item.gameCount === undefined) continue;
          const elems = dict[item.id];
          for (const elem of elems.filter(e => !!e[0].parentNode && !!e[0].offsetParent)) {
            const next = elem.next();
            if (next.is('.lichessTools-gameCountBadge')) continue;
            elem.addClass('lichessTools-gamecount');
            const formattedCount = this.formatGameCount(item.gameCount);
            if (formattedCount !== null) {
              elem.after($('<span>')
                .addClass('lichessTools-gameCountBadge')
                .attr('title', item.gameCount + ' games played')
                .text('[' + formattedCount + ']')
              );
            }
          }
        }
      });
      this.debouncedProcessGameCounts();
    };
    debouncedProcessGameCounts = this.lichessTools.debounce(this.processGameCounts, 500, { defer: true });

    resetGameCounts = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.lichessTools-gameCountBadge').remove();
      $('.lichessTools-gamecount').removeClass('lichessTools-gamecount');
      $('.lichessTools-nogamecount').removeClass('lichessTools-nogamecount');
      this.processGameCounts();
    };

    clearCache = () => {
      const lt = this.lichessTools;
      this._gameCountCache = undefined;
      lt.storage.remove('LiChessTools.gameCountCache');
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showGameCount');
      this.logOption('Show player game counts', value);
      this.options = { enabled: value };
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      lt.pubsub.off('content-loaded', this.debouncedProcessGameCounts);
      lt.pubsub.off('lichessTools.puzzleStart', this.resetGameCounts);
      if (value) {
        this.debouncedProcessGameCounts();
        lt.pubsub.on('content-loaded', this.debouncedProcessGameCounts);
        lt.pubsub.on('lichessTools.puzzleStart', this.resetGameCounts);
      } else {
        $('.lichessTools-gameCountBadge').remove();
        $('.lichessTools-gamecount').removeClass('lichessTools-gamecount');
        $('.lichessTools-nogamecount').removeClass('lichessTools-nogamecount');
        this.clearCache();
      }
    }

  }
  LiChessTools.Tools.ShowGameCount = ShowGameCountTool;
})();

(() => {
  class ShowFlagsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitPuzzleChange', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'showFlags',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showFlags': 'Show player country flags'
      },
      'ro-RO': {
        'options.study': 'General',
        'options.showFlags': 'Arat\u0103 steagurile \u0163\u0103rilor juc\u0103torilor'
      }
    }

    getElementsForFlag = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const dict = {};
      $.cached('.user-link,a[href^="/@/"]', 2000).each((i, e) => {
        if ($(e).closest('#friend_box,.lichessTools-onlineFriends,div.complete-list,.crosstable__users,div.chat__members').length) return;
        if (!lt.inViewport(e)) return;

        let textEl = $('.text', e);
        if (!textEl.length) textEl = $(e);
        if (textEl.is('.lichessTools-noflag,.lichessTools-flag')) return;
        const next = textEl.next();
        if (next.is('img.flag')) return;
        if (next.has('img.flag').length) return;
        if (textEl.attr('data-icon')) return;
        if (textEl.attr('data-tab')) return;
        let url = textEl.attr('href') || textEl[0]?.dataset?.href;
        if (!url) return;
        const m = /\/@\/(?<userId>[^\/]+)\/?$/.exec(url);
        const userId = m?.groups?.userId?.toLowerCase();
        if (!userId) return;
        const list = dict[userId] || [];
        list.push(textEl);
        dict[userId] = list;
      });
      $.cached('span.mini-game__user', 2000).each((i, e) => {
        if ($(e).is('.lichessTools-noflag,.lichessTools-flag')) return;
        if (!lt.inViewport(e)) return;

        const userNodeIndex = Array.from(e.childNodes).findIndex(n => n.nodeType == 3);
        if (userNodeIndex < 0) return;
        const userNode = e.childNodes[userNodeIndex];
        const userId = userNode.textContent?.trim()?.toLowerCase();
        const textEl = $('<span>').addClass('lichessTools-userText').text(' ' + userId);
        e.insertBefore(textEl[0], userNode);
        e.removeChild(userNode);

        const list = dict[userId] || [];
        list.push(textEl);
        dict[userId] = list;
      });
      return dict;
    };

    cacheExpiration = 2 * 86400000; //2 days
    get flagCache() {
      const lt = this.lichessTools;
      const global = lt.global;
      const lichess = lt.lichess;
      if (this._flagCache) return this._flagCache;
      try {
        const temp = lt.storage.get('LiChessTools.flagCache', { raw: true })
        if (temp) {
          lt.debug && global.console.debug('Size of flag cache:', temp.length);
          this._flagCache = new Map(lt.jsonParse(temp, {}));
        } else {
          this._flagCache = new Map();
        }
      } catch (e) {
        global.console.warn('Error parsing flag cache:', e);
        this._flagCache = new Map()
      }
      return this._flagCache;
    }
    getCountryCache = async ()=>{
      const lt = this.lichessTools;
      const global = lt.global;
      const lichess = lt.lichess;
      if (this._countryCache) return this._countryCache;
      let countries;
      try {
        const temp = lt.storage.get('LiChessTools.countryCache', { raw: true })
        if (temp) {
          lt.debug && global.console.debug('Size of country cache:', temp.length);
          countries = lt.jsonParse(temp);
        }
      } catch (e) {
        global.console.warn('Error parsing country cache:', e);
      }
      if (!countries) {
        const data = await lt.comm.getData('countries.json');
        if (!data) {
          lt.global.console.warn('Could not load countries!');
        }
        countries = data?.countries || [];
      }
      this._countryCache = new Map(countries);
      return this._countryCache;
    }
    saveCache = async () => {
      const lt = this.lichessTools;
      const global = lt.global;
      const lichess = lt.lichess;
      const cache = this.flagCache;
      for (const userId of cache.keys()) {
        const time = cache.get(userId).time;
        if (Date.now() - new Date(time) > this.cacheExpiration) cache.delete(userId);
      }
      const countryCache = await this.getCountryCache();
      lt.storage.set('LiChessTools.countryCache', [...countryCache]);
      lt.storage.set('LiChessTools.flagCache', [...this.flagCache]);
    };
    debouncedSaveCache = this.lichessTools.debounce(this.saveCache, 100);

    processFlags = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.options.enabled) return;
      if (lt.global.document.hidden) return;
      const dict = this.getElementsForFlag();
      const data = Object.keys(dict).map(userId => {
        const item = this.flagCache.get(userId);
        if (item) {
          item.time = Date.now()
          return item;
        }
        return { id: userId };
      });
      let toSaveCache = false;
      const userIds = data.filter(i => !i.countryName).map(i => i.id).slice(0, 200);
      if (userIds.length) {
        const users = await lt.api.user.getUsers(userIds);
        for (const user of users) {
          const item = data.find(i => i.id === user.id)
          if (item) item.country = user.profile?.country || user.profile?.flag || 'noflag';
        }
        const countryCache = await this.getCountryCache();
        let firstToProcess = null;
        for (const item of data) {
          if (!item.country) {
            if (userIds.includes(item.id) && !users.find(u => u.id == item.id)) {
              item.country = 'noflag'; //no country name
            } else {
              continue;
            }
          }
          if (item.country === 'noflag') {
            item.countryName = 'noflag';
            item.time = Date.now();
            this.flagCache.set(item.id, item);
            toSaveCache = true;
            continue;
          }
          item.countryName = countryCache.get(item.country);
          if (item.countryName) {
            item.time = Date.now();
            this.flagCache.set(item.id, item);
            toSaveCache = true;
          }
          if (!item.countryName && !firstToProcess) {
            firstToProcess = item;
          }
        }
        if (firstToProcess) {
          const html = await lt.api.user.getMini(firstToProcess.id);
          const m = /<span class="(?:upt__info__top__country|upt__info__top__flag)".*?>(?:.|\r|\n)*?<\/span>/.exec(html);
          if (m) {
            const el = $(m[0]);
            firstToProcess.countryName = el.text() || el.attr('title');
          }
          if (firstToProcess.countryName) {
            countryCache.set(firstToProcess.country, firstToProcess.countryName);
            firstToProcess.time = Date.now();
            this.flagCache.set(firstToProcess.id, firstToProcess);
            toSaveCache = true;
          }
        }
      }
      if (toSaveCache) {
        this.debouncedSaveCache();
      }
      for (const item of data) {
        if (!item.countryName) continue;
        const elems = dict[item.id];
        for (const elem of elems) {
          if (!elem[0]?.offsetParent) return;
          const next = elem.next();
          if (next.is('img.flag')) return;
          if (next.has('img.flag').length) return;
          if (item.countryName == 'noflag') {
            elem.addClass('lichessTools-noflag');
          } else {
            elem.addClass('lichessTools-flag');
            const flagUrl = lt.assetUrl('images/flags/' + item.country + '.png');
            elem.after($('<img>')
              .addClass('flag')
              .attr('loading', 'lazy')
              .attr('title', item.countryName)
              .attr('src', flagUrl)
              .css('animation-duration', Math.round(5 + lt.random() * 15) + 's')
            );
            lt.net.logNetwork(flagUrl, 1000, 0); //approximate flag size in bytes
          }
        }
      }
      this.debouncedProcessFlags();
    };
    debouncedProcessFlags = this.lichessTools.debounce(this.processFlags, 500);

    resetFlags = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.lichessTools-flag+img.flag').remove();
      $('.lichessTools-flag').removeClass('lichessTools-flag');
      $('.lichessTools-noflag').removeClass('lichessTools-noflag');
      this.processFlags();
    };

    clearCache = () => {
      const lt = this.lichessTools;
      this._flagCache = undefined;
      this._countryCache = undefined;
      lt.storage.remove('LiChessTools.flagCache');
      lt.storage.remove('LiChessTools.countryCache');
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showFlags');
      this.logOption('Show player flags', value);
      this.options = { enabled: value };
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      lt.pubsub.off('content-loaded', this.debouncedProcessFlags);
      lt.pubsub.off('lichessTools.puzzleStart', this.resetFlags);
      $('#form3-flag').off('change', this.clearCache);
      if (value) {
        this.debouncedProcessFlags();
        lt.pubsub.on('content-loaded', this.debouncedProcessFlags);
        lt.pubsub.on('lichessTools.puzzleStart', this.resetFlags);

        $('#form3-flag').on('change', this.clearCache);
      } else {
        $('.lichessTools-flag+img.flag').remove();
        $('.lichessTools-flag').removeClass('lichessTools-flag');
        $('.lichessTools-noflag').removeClass('lichessTools-noflag');
        this.clearCache();
      }
    }

  }
  LiChessTools.Tools.ShowFlags = ShowFlagsTool;
})();

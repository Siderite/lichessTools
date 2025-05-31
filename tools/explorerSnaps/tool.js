(() => {
  class ExplorerSnapsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'DetectThirdParties'];

    preferences = [
      {
        name: 'explorerSnaps',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerSnaps': 'Toggle snapshots of Explorer settings',
        'addSnapPrompt': 'Title of new snap',
        'replaceSnapPrompt': 'Overwrite snap "%s" ?',
        'snapSettingsButtonText': 'Snap!',
        'snapSettingsButtonTitle': 'LiChess Tools - create a snap of current Explorer settings',
        'allText': 'all',
        'sinceText': 'since %s',
        'untilText': 'until %s',
        'snapTitle': 'Rating: %rating\r\nTime controls: %control\r\n%since\r\n%until'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerSnaps': 'Schimb\u0103 \u00eentre diferite set\u0103ri ale Exploratorului',
        'addSnapPrompt': 'Titlul noului snap',
        'replaceSnapPrompt': 'Suprascrie snapul "%s" ?',
        'snapSettingsButtonText': 'Snap!',
        'snapSettingsButtonTitle': 'LiChess Tools - creeaz\u0103 un snap al set\u0103rilor curente din Explorator',
        'allText': 'toate',
        'sinceText': 'de la %s',
        'untilText': 'p\u00e2n\u0103 la %s',
        'snapTitle': 'Rating: %rating\r\nControl timp: %control\r\n%since\r\n%until'
      }
    };

    getSettings = () => {
      const lt = this.lichessTools;
      const data = lt.lichess?.analysis?.explorer?.config?.data;
      if (!data) return;
      const settings = {
        timeControl: data.speed(),
        avgRating: data.rating(),
        since: data.byDb()?.since(),
        until: data.byDb()?.until(),
      };
      return settings;
    };

    setSnap = (snap) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      const data = analysis?.explorer?.config?.data;
      if (!data) return;
      data.speed(snap.settings.timeControl);
      data.rating(snap.settings.avgRating);
      data.byDb().since(snap.settings.since);
      data.byDb().until(snap.settings.until);
      analysis.explorer?.reload();
      this.showSnaps();
    };

    getSnapElement = (snap) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      return $('section.lichessTools-explorerSnaps button[data-act="shot"]').filter((i, e) => {
        const text = $(e).attr('data-act-title');
        return text == snap.text;
      }).parent();
    };

    highlightSnap = (snap) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const elem = this.getSnapElement(snap);
      elem.addClass('lichessTools-highlight');
      lt.global.setTimeout(() => elem.removeClass('lichessTools-highlight'), 1000);
    }

    removeSnap = (snap) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      lt.arrayRemoveAll(this.options.snaps, s => s.text == snap.text);
      this.saveSnaps();
    };

    getSnapBySettings = (settings) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const stringify = lt.global.JSON.stringify;
      let snap = this.options.snaps.find(s => stringify(s.settings) == stringify(settings));
      return snap;
    }

    toggleSnaps = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!this.options.enabled || this.options.snaps.length <= 1) return;
      const settings = this.getSettings();
      let snap = this.getSnapBySettings(settings);
      let index = 0;
      if (snap) {
        index = this.options.snaps.indexOf(snap);
        index = (index + 1) % this.options.snaps.length;
      }
      snap = this.options.snaps[index];
      this.setSnap(snap);
      if (!lichess.analysis?.explorer?.config?.data?.open()) {
        lichess.analysis?.explorer?.fetch();
      }
    };

    snapSettings = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const settings = this.getSettings();
      let snap = this.getSnapBySettings(settings);
      if (snap) {
        this.highlightSnap(snap);
        return;
      }
      const text = await lt.uiApi.dialog.prompt(trans.noarg('addSnapPrompt'));
      if (!text) return;
      if (this.options.snaps.find(s => s.text == text)) {
         const confirmation = await lt.uiApi.dialog.confirm(trans.pluralSame('replaceSnapPrompt', text));
         if (!confirmation) return;
         lt.arrayRemoveAll(this.options.snaps,(s => s.text == text));
      }
      snap = {
        text: text,
        settings: settings
      };
      this.options.snaps.push(snap);
      this.saveSnaps();
    };

    saveSnaps = () => {
      const lt = this.lichessTools;
      lt.storage.set('LiChessTools.explorerSnaps', this.options.snaps);
      lt.emitRedraw();
    };

    getTitle = (settings) => {
      if (!settings) return '';
      const lt = this.lichessTools;
      const trans = lt.translator;

      const compress = (allArr, arr) => {
        const resultArr = [];
        let start = '';
        let end = '';
        for (let i = 0; i < allArr.length; i++) {
          if (!arr.includes(allArr[i])) {
            if (start) {
              resultArr.push(end ? start + '-' + end : start + '+');
            }
            start = '';
            end = '';
            continue;
          }
          if (!start) {
            start = allArr[i];
          }
          end = allArr[i + 1];
        }
        if (!resultArr.length && start == allArr[0]) return trans.noarg('allText');
        if (start) {
          resultArr.push(end ? start + '-' + end : start + '+');
        }
        return resultArr.join(', ');
      };

      const timeString = (text) => {
        if (!text) return '';
        const date = new Date(text);
        return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
      }

      const allRatings = [400, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500];
      const ratingText = compress(allRatings, settings.avgRating);
      const allControls = ['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence'];
      const controlText = compress(allControls, settings.timeControl);
      const sinceText = settings.since ? trans.pluralSame('sinceText', timeString(settings.since)) : '';
      const untilText = settings.until ? trans.pluralSame('untilText', timeString(settings.until)) : '';
      return trans.noarg('snapTitle')
        .replace('%rating', ratingText)
        .replace('%control', controlText)
        .replace('%since', sinceText)
        .replace('%until', untilText)
        .trim();
    };

    lichessHandler = (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      this._origLichessHandler(ev);
      if (this._prevControls) {
        const data = analysis?.explorer?.config?.data;
        data.speed(this._prevControls);
        this._prevControls = null;
      }
    };

    playerHandler = (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      this._origPlayerHandler(ev);
      if (ev.ctrlKey) {
        const data = analysis?.explorer?.config?.data;
        this._prevControls = data.speed();
        const allControls = ['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence'];
        data.speed(allControls);
      } else {
        this._prevControls = null;
      }
    };

    showSnapsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const explorer = lichess.analysis?.explorer;
      if (!explorer?.enabled()) return;

      const titleElem = $('.explorer-title span.lichess');
      if (titleElem.length) {
        const settings = this.getSettings();
        const snap = this.getSnapBySettings(settings);
        if (!this._originalText) {
          this._originalText = titleElem.text();
        }
        if (!this._originalTitle) {
          this._originalTitle = titleElem.attr('title');
        }
        titleElem
          .text(snap?.text || this._originalText)
          .attr('title', this.getTitle(snap?.settings) || this._originalTitle)
          .off('click', this.toggleSnaps)
          .on('click', this.toggleSnaps);
        if (!titleElem.is('lichessTools-explorerSnaps')) {
          titleElem.addClass('lichessTools-explorerSnaps')
        }
      }

      const playerElem = $('.explorer-title button.player');
      if (playerElem.length && !playerElem.prop('_snapInit')) {
        playerElem.prop('_snapInit',true);
        const handler = lt.getEventHandlers(playerElem[0],'click')[0];
        this._origPlayerHandler = handler;
        lt.removeEventHandlers(playerElem[0],'click');
        playerElem.on('click',this.playerHandler);
      }

      const dbElems = $('.explorer-title button.button-link');
      if (dbElems.length>=2) {
        const lichessElem = dbElems[1];
        if (!lichessElem._snapInit) {
          lichessElem._snapInit=true;
          const handler = lt.getEventHandlers(lichessElem,'click')[0];
          this._origLichessHandler = handler;
          lt.removeEventHandlers(lichessElem,'click');
          $(lichessElem).on('click',this.lichessHandler);
        }
      }

      if (!lichess.analysis?.explorer?.config?.data?.open()) return;
      const container = $('section.explorer-box div.config >div:has(section.date)');
      if (!container.length) return;
      let section = $('section.lichessTools-explorerSnaps', container);
      if (!this.options.enabled || lichess.analysis.explorer.config.data.db() != 'lichess') {
        section.remove();
        return;
      };
      if (!section.length) {
        section = $('<section class="lichessTools-explorerSnaps">')
          .appendTo(container);
      }
      if (!$('button[data-act="snap"]', section).length) {
        $('<button>')
          .addClass('button button-green')
          .attr('data-act', "snap")
          .text(trans.noarg('snapSettingsButtonText'))
          .attr('title', trans.noarg('snapSettingsButtonTitle'))
          .on('click', this.snapSettings)
          .prependTo(section);
      }
      $('button[data-act="shot"]', section).each((i, e) => {
        const text = $(e).attr('data-act-title');
        if (!this.options.snaps.find(s => s.text == text)) {
          $(e).parent('div').remove();
        }
      });
      for (const snap of this.options.snaps) {
        const snapElem = this.getSnapElement(snap);
        if (snapElem.length) continue;
        $('<div>')
          .append($('<button>')
            .addClass('button')
            .attr('data-act', "shot")
            .attr('data-act-title', snap.text)
            .text(snap.text)
            .attr('title', this.getTitle(snap.settings))
            .on('click', () => this.setSnap(snap))
          )
          .append($('<button>')
            .addClass('remove')
            .attr('data-icon', lt.icon.X)
            .on('click', () => this.removeSnap(snap))
          )
          .appendTo(section);
      }
    };
    showSnaps = this.lichessTools.debounce(this.showSnapsDirect, 100);

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('explorerSnaps');
      this.logOption('Explorer snaps', value);
      const $ = lt.$;
      const explorer = lichess?.analysis?.explorer;
      if (!explorer) return;
      this.options = {
        enabled: value,
        snaps: lt.storage.get('LiChessTools.explorerSnaps') || []
      };
      for (const snap of this.options.snaps) {
        if (snap.title) {
          snap.text = snap.title;
          delete snap.title;
        }
      }
      explorer.config.toggleOpen = lt.unwrapFunction(explorer.config.toggleOpen, 'explorerSnaps');
      explorer.enabled = lt.unwrapFunction(explorer.enabled, 'explorerSnaps');
      explorer.fetch = lt.unwrapFunction(explorer.fetch, 'explorerSnaps');
      $('section.explorer-box section.lichessTools-explorerSnaps').remove();
      lt.pubsub.off('lichessTools.redraw', this.showSnaps);
      $('.explorer-title span.lichess')
        .removeClass('lichessTools-explorerSnaps')
        .off('click', this.toggleSnaps);
      if (!value) {
        if (this._originalText) {
          $('.explorer-title span.lichess')
            .text(this._originalText);
        }
        if (this._originalTitle) {
          $('.explorer-title span.lichess')
            .attr('title',this._originalTitle);
        }
        return;
      }
      explorer.config.toggleOpen = lt.wrapFunction(explorer.config.toggleOpen, {
        id: 'explorerSnaps',
        after: ($this, result) => {
          if (explorer.config.data.open()) {
            this.showSnaps();
          }
        }
      });
      explorer.enabled = lt.wrapFunction(explorer.enabled, {
        id: 'explorerSnaps',
        after: ($this, result, value) => {
          if (value) {
            this.showSnaps();
          }
        }
      });
      explorer.fetch = lt.wrapFunction(explorer.fetch, {
        id: 'explorerSnaps',
        after: ($this, result, ...args) => {
          this.showSnaps();
        }
      });
      lt.pubsub.on('lichessTools.redraw', this.showSnaps);
      this.showSnaps();
    }

  }
  LiChessTools.Tools.ExplorerSnaps = ExplorerSnapsTool;
})();

(() => {
  class ActiveIconTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'activeIcon',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, 'pawn', 'knight', 'king', 'circle'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.activeIcon': 'Active title icon',
        'activeIcon.pawn': 'Pawn',
        'activeIcon.knight': 'Knight',
        'activeIcon.king': 'King',
        'activeIcon.circle': 'Circle'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.activeIcon': 'Iconi\u0163\u0103 titlu activ\u0103',
        'activeIcon.pawn': 'Pion',
        'activeIcon.knight': 'Cal',
        'activeIcon.king': 'Rege',
        'activeIcon.circle': 'Cerc'
      }
    }

    _iconCache = {};
    getIcon = (isBlack, isPlaying) => {
      const lt = this.lichessTools;
      const asset = lt.lichess.asset;
      let key = this.options.icon || '';
      switch (isBlack) {
        case true: key += 'b'; break;
        case false: key += 'w'; break;
        default: key += ' '; break;
      }
      key += isPlaying ? 'p' : 'n';
      let icon = this._iconCache[key];
      if (!icon) {
        if (isPlaying) {
          if (this.options.icon == 'circle') {
            icon = asset.flairSrc(isBlack ? 'symbols.black-circle' : 'symbols.white-circle');
          } else {
            icon = asset.url(isBlack ? 'cursors/black-'+this.options.icon+'.cur' : 'cursors/white-'+this.options.icon+'.cur');
          }
        } else {
          icon = asset.flairSrc('activity.lichess');
        }
        this._iconCache[key] = icon;
      }
      return icon;
    }

    setIcon = (isBlack, isPlaying) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$('div.main-board').length) {
        isBlack = false;
        isPlaying = false;
      }
      if (isBlack === undefined) {
        const fen = lt.getPositionFromBoard($('div.main-board'), true);
        isBlack = / b\b/.test(fen);
      }
      if (isPlaying !== false) {
        isPlaying = !$('.result-wrap .result,.study__player .result,.game__meta .status').length;
      }
      const icon = this.getIcon(isBlack, isPlaying);
      const elem = $('link[rel=icon][source=lichessTools]');
      const href = elem.attr('href');
      if (href != icon) elem.attr('href', icon);
    };

    handlePly = (ply) => {
      this.setIcon(ply % 2 == 1, true);
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('activeIcon');
      this.logOption('Active icon', value);
      this.options = {
        icon: value
      };
      lt.global.clearInterval(this.interval);
      lt.uiApi.events.off('ply', this.handlePly);
      $('link[rel=icon][source=lichessTools]').remove();
      $('link[rel=xicon]').attr('rel', 'icon');

      if (!value) return;

      this.interval = lt.global.setInterval(this.setIcon, 1000);
      $('link[rel=icon]').attr('rel', 'xicon');
      $('<link rel="icon" source="lichessTools">').appendTo('head');
      this.setIcon();
      lt.uiApi.events.on('ply', this.handlePly);
    }

  }
  LiChessTools.Tools.ActiveIcon = ActiveIconTool;
})();

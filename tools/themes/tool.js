(() => {
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'themes',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['performance', 'justExplorer', 'mobile', 'slimArrows', 'slimmerArrows', 'flairX', 'lessIcons', 'nonStickyHeader', 'toggleStudyChat',
                         'pieceDrag','noPractice', 'gameMoveList', 'fatGauge', 'fatMove', 'gridBoard','adamisko','arcade','fixThirdParties','timeControls'],
        defaultValue: 'fixThirdParties',
        advanced: true
      },
      {
        name: 'themesMenu',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.themes': 'Apply a style theme',
        'options.themesMenu': 'Themes menu',
        'themesMenuText': 'Themes',
        'themesMenuTitle': 'LiChess Tools - visual themes',
        'themesMenuHeaderText': 'Themes',
        'userManualLinkTitle': 'User manual (EN)',
        'themes.default': 'None',
        'themes.performance': 'Performance theme',
        'themes.justExplorer': 'Just Explorer',
        'themes.mobile': 'Mobile theme',
        'themes.slimArrows': 'Slim arrows',
        'themes.flairX': 'Nicer flairs',
        'themes.lessIcons': 'Fewer icons',
        'themes.nonStickyHeader': 'No sticky header',
        'themes.toggleStudyChat': 'Toggle study chat',
        'themes.pieceDrag': 'Nicer piece drag',
        'themes.noPractice': 'No Practice button',
        'themes.gameMoveList': 'Flexible game move list',
        'themes.fatGauge': 'Thick analysis gauge',
        'themes.fatMove': 'Larger analysis move font',
        'themes.slimmerArrows': '... slimmer',
        'themes.gridBoard': 'Grid board squares',
        'themes.adamisko': 'Vintage Adamisko',
        'themes.arcade': 'Arcade',
        'themes.fixThirdParties': 'Fix third parties',
        'themes.timeControls': 'Hover time controls'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.themes': 'Aplic\u0103 o tem\u0103 de stil',
        'options.themesMenu': 'Menu teme',
        'themesMenuText': 'Teme',
        'themesMenuTitle': 'LiChess Tools - teme vizuale',
        'themesMenuHeaderText': 'Teme',
        'userManualLinkTitle': 'Manual utilizator (EN)',
        'themes.default': 'Nici una',
        'themes.performance': 'Tem\u0103 performan\u0163\u0103',
        'themes.justExplorer': 'Doar Explorator',
        'themes.mobile': 'Tem\u0103 mobil',
        'themes.slimArrows': 'S\u0103ge\u0163i sub\u0163iri',
        'themes.flairX': 'Flair-uri mai bune',
        'themes.lessIcons': 'Mai pu\u0163ine pictograme',
        'themes.nonStickyHeader': 'Antet fix \u00een pagin\u0103',
        'themes.toggleStudyChat': 'Comut\u0103 chat \u00een studii',
        'themes.pieceDrag': 'Apucat piese mai frumos',
        'themes.noPractice': 'F\u0103r\u0103 buton Antrenament cu calculatorul',
        'themes.gameMoveList': 'List\u0103 mut\u0103ri flexibil\u0103 \u00een joc',
        'themes.fatGauge': 'Bar\u0103 analiz\u0103 groas\u0103',
        'themes.fatMove': 'Text mai mare la mut\u0103ri',
        'themes.slimmerArrows': '... \u015fi mai sub\u0163iri',
        'themes.gridBoard': 'Grilaj pe p\u0103tratele tablei',
        'themes.fixThirdParties': 'Repar\u0103 ter\u0163e par\u0163i',
        'themes.timeControls': 'Controale timp la hover'
      }
    }

    checkBodyDirect = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const board = $('body #main-wrap div.cg-wrap cg-board')[0];
      const boardChanged = this.dataBoard != $('body').attr('data-board') || this.dataBoard3d != $('body').attr('data-board3d');
      if (boardChanged || this.board != board || (board && !$('html').css('--board-background'))) {
        await this.applyThemes(boardChanged);
        this.dataBoard = $('body').attr('data-board');
        this.dataBoard3d = $('body').attr('data-board3d');
        this.board = board;
      }
    };
    checkBody = lichessTools.debounce(this.checkBodyDirect,1000);

    setBoardVariables = async (boardChanged)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const board = $('body #main-wrap div.cg-wrap cg-board');
      const is3d = $('#main-wrap').is('.is3d');
      if (board.length) {
        let container = $('html');
        if (boardChanged) {
          const html = this.dgtHtml || (this.dgtHtml = await lt.net.fetch('/dgt'));
          container = $('<div>'+html+'</div>');
        }
        const boardImage = lt.currentOptions.getValue('customBoardImage');
        let backgroundImage = boardImage && !is3d
          ? boardImage
          : $('link[rel=preload][as=image]',container)
            .filter((i,e)=>/\.(png|jpg|jpeg|svg)$/i.test($(e).attr('href')))
            .eq(is3d?1:0)
            .attr('href');

        if (backgroundImage) {
          backgroundImage = 'url('+backgroundImage+')';
        } else {
          const styles = lt.global.getComputedStyle(board[0], '::before');
          backgroundImage = styles.getPropertyValue('background-image');
        }
        $('html').css('--board-background', backgroundImage||'unset');
      }
      $('body').toggleClassSafe('lichessTools-hasBoardBackground', !!board.length);
    }

    applyThemes = async (boardChanged)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const existingThemes = [...$('body').prop('classList')]
        .filter(c => c.startsWith('lichessTools-theme_'));
      const configuredThemes = (this.themes || '').split(',').map(t => 'lichessTools-theme_' + t);
      if (!boardChanged) {
        $('body')
          .removeClass(existingThemes.join(' '));
      }
      await this.setBoardVariables(boardChanged);
      if (!boardChanged) {
        $('body')
          .addClass(configuredThemes.join(' '));
      }
    };

    populateThemes = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#dasher_app .sub.sound');
      if (!container.length) return;
      container
        .toggleClassSafe('sound', false)
        .toggleClassSafe('lichessTools-themes', true);
      container.find('button.head')
        .text(trans.noarg('themesMenuHeaderText'))
        .append($('<a class="lichessTools-infoIcon" target="_blank">')
          .attr('title',trans.noarg('userManualLinkTitle'))
          .attr('data-icon',lt.icon.InfoCircle)
          .attr('href','https://siderite.dev/blog/lichess-tools---user-manual/#themes')
        );
      container.find('div.content input').remove();
      const selector = container.find('.selector')
        .empty();
      const { possibleValues: themes, defaultValue: defaultThemes } = this.preferences.find(p=>p.name=='themes');
      const isSet = (theme) => `,${this.themes},`.includes(`,${theme},`);
      for (const theme of themes) {
        const isDefault = `,${defaultThemes},`.includes(`,${theme},`);
        $('<button type="button" class="text">')
          .toggleClass('active',isSet(theme))
          .toggleClass('default',isDefault)
          .attr('data-icon',lt.icon.Checkmark)
          .text(trans.noarg(`themes.${theme}`))
          .on('click',ev=>{
            ev.preventDefault();
            const isThemeSet = isSet(theme);
            this.themes = themes.filter(t=>isThemeSet
              ? isSet(t) && t!=theme
              : isSet(t) || t==theme
            ).join(',');
            $(ev.target)
              .toggleClassSafe('active',!isThemeSet);
            lt.currentOptions[`themes`] = this.themes;
            lt.saveOptions(lt.currentOptions);
            this.applyThemes();
          })
          .appendTo(selector);
      }
    };
   
    addThemesMenu = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const subs = $('#dasher_app .subs');
      if (!subs.length) return;
      if (!this._soundHandler) {
        const soundButton = $('#dasher_app .subs > button').eq(1)[0];
        if (!soundButton) return;
        const handler = lt.getEventHandlers(soundButton,'click')[0];
        if (!handler) return;
        this._soundHandler = handler;
      }
      if (!$('#dasher_app .subs > button.lichessTools-themesMenu').length) {
        $('<button class="sub lichessTools-themesMenu"  type="button">')
          .attr('data-icon',lt.icon.GreaterThan)
          .text(trans.noarg('themesMenuText'))
          .attr('title',trans.noarg('themesMenuTitle'))
          .on('click',ev=>{
            ev.preventDefault();
            this._soundHandler();
            this.populateThemes();
          })
          .appendTo(subs);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('themes');
      const themesMenu = lt.currentOptions.getValue('themesMenu');
      this.logOption('Themes', value || 'none');
      this.themes = value;
      const $ = lt.$;
      $(lt.global).off('hashchange', this.applyThemes);
      $('body').observer()
        .off('body, #main-wrap, .main-board cg-board',this.checkBody);
      if (!lt.currentOptions.enableLichessTools) return;
      if (value) {
        $(lt.global).on('hashchange', this.applyThemes);
        $('body').observer()
          .on('body, #main-wrap, .main-board cg-board',this.checkBody,{
            childList: false,
            subtree: false,
            attributes: true,
            attributeFilter: ['data-board','data-board3d','class']
          });
      }
      await this.applyThemes();
      $('#dasher_app')
        .observer()
        .on('div',this.addThemesMenu);
      if (themesMenu) {
        $('#dasher_app')
          .observer()
          .on('div',this.addThemesMenu);
      }
    }

  }
  LiChessTools.Tools.Themes = ThemesTool;
})();

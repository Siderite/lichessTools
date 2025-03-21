(() => {
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'themes',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['performance', 'justExplorer', 'mobile', 'slimArrows', 'slimmerArrows', 'flairX', 'lessIcons', 'nonStickyHeader', 'noStudyChat', 'toggleStudyChat', 'pieceDrag','noPractice', 'gameMoveList', 'fatGauge', 'fatMove', 'gridBoard','noResultPopup','fixThirdParties'],
        defaultValue: 'fixThirdParties',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.themes': 'Apply a style theme',
        'themes.default': 'None',
        'themes.performance': 'Performance theme',
        'themes.justExplorer': 'Just Explorer',
        'themes.mobile': 'Mobile theme',
        'themes.slimArrows': 'Slim arrows',
        'themes.flairX': 'Nicer flairs',
        'themes.lessIcons': 'Less Icons',
        'themes.nonStickyHeader': 'No sticky header',
        'themes.noStudyChat': 'No study chat',
        'themes.toggleStudyChat': 'Toggle study chat',
        'themes.pieceDrag': 'Nicer piece drag',
        'themes.noPractice': 'No Practice button',
        'themes.gameMoveList': 'Flexible game move list',
        'themes.fatGauge': 'Thick analysis gauge',
        'themes.fatMove': 'Larger analysis move font',
        'themes.slimmerArrows': '... slimmer',
        'themes.gridBoard': 'Grid board squares',
        'themes.noResultPopup': 'No game result popup',
        'themes.fixThirdParties': 'Fix third parties'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.themes': 'Aplic\u0103 o tem\u0103 de stil',
        'themes.default': 'Nici una',
        'themes.performance': 'Tem\u0103 performan\u0163\u0103',
        'themes.justExplorer': 'Doar Explorator',
        'themes.mobile': 'Tem\u0103 mobil',
        'themes.slimArrows': 'S\u0103ge\u0163i sub\u0163iri',
        'themes.flairX': 'Flair-uri mai bune',
        'themes.lessIcons': 'Mai pu\u0163ine pictograme',
        'themes.nonStickyHeader': 'Antet fix \u00een pagin\u0103',
        'themes.noStudyChat': 'F\u0103r\u0103 chat \u00een studii',
        'themes.toggleStudyChat': 'Comut\u0103 chat \u00een studii',
        'themes.pieceDrag': 'Apucat piese mai frumos',
        'themes.noPractice': 'F\u0103r\u0103 buton Antrenament cu calculatorul',
        'themes.gameMoveList': 'List\u0103 mut\u0103ri flexibil\u0103 \u00een joc',
        'themes.fatGauge': 'Bar\u0103 analiz\u0103 groas\u0103',
        'themes.fatMove': 'Text mai mare la mut\u0103ri',
        'themes.slimmerArrows': '... \u015fi mai sub\u0163iri',
        'themes.gridBoard': 'Grilaj pe p\u0103tratele tablei',
        'themes.noResultPopup': 'F\u0103r\u0103 popup cu rezultat joc',
        'themes.fixThirdParties': 'Repar\u0103 ter\u0163e par\u0163i'
      }
    }

    

    checkBody = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const board = $('body .is2d div.cg-wrap cg-board')[0];
      if (this.dataBoard != $('body').attr('data-board') || this.board != board || (board && !lt.global.document.documentElement.style.getPropertyValue('--board-background'))) {
        this.applyThemes();
        this.dataBoard = $('body').attr('data-board');
        this.board = board;
      }
    };

    setBoardVariables = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const board = $('body .is2d div.cg-wrap cg-board');
      if (board.length) {
        let backgroundImage = $('link[rel=preload][href$=".png"],link[rel=preload][href$=".jpg"],link[rel=preload][href$=".svg"]').eq(0).attr('href');
        if (backgroundImage) {
          backgroundImage = 'url('+backgroundImage+')';
        } else {
          const styles = lt.global.getComputedStyle(board[0], '::before');
          backgroundImage = styles.getPropertyValue('background-image');
        }
        lt.global.document.documentElement.style.setProperty('--board-background', backgroundImage||'unset');
      }
      $('body').toggleClass('lichessTools-hasBoardBackground', !!board.length);
    }

    applyThemes = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const existingThemes = [...$('body').prop('classList')]
        .filter(c => c.startsWith('lichessTools-theme_'));
      const configuredThemes = (this.themes || '').split(',').map(t => 'lichessTools-theme_' + t);
      $('body')
        .removeClass(existingThemes.join(' '));
      this.setBoardVariables();
      $('body')
        .addClass(configuredThemes.join(' '));
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('themes');
      this.logOption('Themes', value || 'none');
      this.themes = value;
      const $ = lt.$;
      $(lt.global).off('hashchange', this.applyThemes);
      $(lt.global).on('hashchange', this.applyThemes);
      $('body').observer()
        .on('body, .main-board cg-board',this.checkBody,{
          childList: false,
          subtree: false,
          attributes: true,
          attributeFilter: ['data-board','class']
        });
      this.applyThemes();
    }

  }
  LiChessTools.Tools.Themes = ThemesTool;
})();

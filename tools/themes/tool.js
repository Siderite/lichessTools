(() => {
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'themes',
        category: 'general',
        type: 'multiple',
        possibleValues: ['performance', 'justExplorer', 'mobile', 'slimArrows', 'flairX', 'lessIcons', 'nonStickyHeader', 'noStudyChat', 'pieceDrag'/*, 'noGrab'*/],
        defaultValue: '',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
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
        'themes.pieceDrag': 'Nicer piece drag',
        'themes.noGrab': 'No grab cursor'
      },
      'ro-RO': {
        'options.general': 'General',
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
        'themes.pieceDrag': 'Apucat piese mai frumos',
        'themes.noGrab': 'F\u0103r\u0103 cursor care apuc\u0103'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('themes');
      this.logOption('Themes', value || 'none');
      const existingThemes = [...$('body').prop('classList')]
        .filter(c => c.startsWith('lichessTools-theme_'));
      const configuredThemes = (value || '').split(',').map(t => 'lichessTools-theme_' + t);
      $('body')
        .removeClass(existingThemes.join(' '))
        .addClass(configuredThemes.join(' '));
    }

  }
  LiChessTools.Tools.Themes = ThemesTool;
})();

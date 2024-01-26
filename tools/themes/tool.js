(()=>{
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    dependencies=['DetectThirdParties'];

    preferences=[
      {
        name:'themes',
        category: 'general',
        type:'multiple',
        possibleValues: ['performance','justExplorer','mobile','slimArrows','flairX'],
        defaultValue: '',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.themes': 'Apply a style theme',
        'themes.default':'None',
        'themes.performance':'Performance theme',
        'themes.justExplorer':'Just Explorer',
        'themes.mobile':'Mobile theme',
        'themes.slimArrows':'Slim arrows',
        'themes.flairX':'Nicer flairs'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.themes': 'Aplic\u0103 o tem\u0103 de stil',
        'themes.default':'Nici una',
        'themes.performance':'Tem\u0103 performan\u0163\u0103',
        'themes.justExplorer':'Doar Explorator',
        'themes.mobile':'Tem\u0103 mobil',
        'themes.slimArrows':'S\u0103ge\u0163i sub\u0163iri',
        'themes.flairX':'Flair-uri mai bune'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('themes');
      this.logOption('Themes', value||'none');
      const installedThemes=Array.from($('body')[0]?.classList)?.filter(c=>c.startsWith('lichessTools-theme_'));
      for (const theme of installedThemes) {
        $('body').removeClass(theme);
      }
      if (value) {
        value.split(',').forEach(theme=>{
          $('body').addClass('lichessTools-theme_'+theme.trim());
        });
      }
    }

  }
  LiChessTools.Tools.Themes=ThemesTool;
})();

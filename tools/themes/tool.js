(()=>{
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'themes',
        category: 'general',
        type:'single',
        possibleValues: ['default','demo'],
        defaultValue: 'default'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.themes': 'Apply a style theme',
        'themes.default':'None',
        'themes.demo':'Demo theme'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.themes': 'Aplic\u0103 o tem\u0103 de stil',
        'themes.default':'Nici una',
        'themes.demo':'Tem\u0103 demo'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('themes');
      this.logOption('Themes', value);
      const installedThemes=Array.from($('body')[0]?.classList)?.filter(c=>c.startsWith('lichessTools-theme_'));
      for (const theme of installedThemes) {
        $('body').removeClass(theme);
      }
      if (value!='default') {
        $('body').addClass('lichessTools-theme_'+value);
      }
    }

  }
  LiChessTools.Tools.Themes=ThemesTool;
})();

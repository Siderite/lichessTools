(()=>{
  class ThemesTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'themes',
        category: 'general',
        type:'single',
        possibleValues: ['default','transparent'],
        defaultValue: 'default'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.themes': 'Apply a style theme',
        'themes.default':'None',
        'themes.transparent':'Transparent background'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.themes': 'Aplic\u0103 o tema de stil',
        'themes.default':'Nici una',
        'themes.transparent':'Fundal transparent'
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

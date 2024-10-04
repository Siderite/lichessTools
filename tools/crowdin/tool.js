(() => {
  class CrowdinTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'crowdin',
        category: 'languages',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.languages': 'Languages',
        'options.crowdin': 'Crowdin translation'
      },
      'ro-RO': {
        'options.languages': 'Limbi',
        'options.crowdin': 'Traducere cu Crowdin'
      }
    }

    async loadTranslations() {
      const parent = this.lichessTools;
      const intl = await parent.comm.getData('crowdin.json');
      for (const lang in intl) {
        parent.intl[lang] = { ...parent.intl[lang], ...intl[lang] };
      }
      console.log(' Loaded '+Object.keys(intl).length+' language translations.');
    }

    async start() {
      const parent = this.lichessTools;
      const value = !!parent.currentOptions.getValue('crowdin');
      if (value) {
        await this.loadTranslations();
      }
    }

  }
  LiChessTools.Tools.Crowdin = CrowdinTool;
})();

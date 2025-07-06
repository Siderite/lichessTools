(() => {
  class CrowdinTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'crowdin',
        category: 'languages',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
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
      const lt = this.lichessTools;
      const $ = lt.$;
      if ($('html').attr('lang')?.startsWith('en')) return;
      const console = lt.global.console;
      const intl = await lt.comm.getData('crowdin.json');
      if (intl) {
        for (const lang in intl) {
          lt.intl[lang+'-crowdin'] = { ...intl[lang] };
        }
        console.log(' Loaded '+Object.keys(intl).length+' language translations.');
      } else {
        console.warn('Could not load translations!');
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = !!lt.currentOptions.getValue('crowdin');
      this.logOption('Crowdin', value);
      if (value) {
        await this.loadTranslations();
      }
    }

  }
  LiChessTools.Tools.Crowdin = CrowdinTool;
})();

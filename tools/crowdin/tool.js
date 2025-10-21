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
        'options.crowdin': 'Crowdin translation',
        'helpTranslateLiChessToolsText':'Translate LiChess Tools'
      },
      'ro-RO': {
        'options.languages': 'Limbi',
        'options.crowdin': 'Traducere cu Crowdin',
        'helpTranslateLiChessToolsText':'Tradu LiChess Tools'
      }
    }

    addHelpTranslateLink = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#dasher_app .sub.langs');
      if (!container.length) return;
      if (container.find('.lichessTools-helpTranslate').length) return;
      $('<a class="help text lichessTools-helpTranslate">')
        .attr('target','_blank')
        .attr('href','https://crowdin.com/project/lichess-tools')
        .attr('data-icon',lt.icon.Tools)
        .text(trans.noarg('helpTranslateLiChessToolsText'))
        .appendTo(container);
    };

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
      const $ = lt.$;
      const value = !!lt.currentOptions.getValue('crowdin');
      this.logOption('Crowdin', value);

      $('#dasher_app')
        .observer()
        .off('.sub.langs',this.addHelpTranslateLink);
      if (!value) return;

      await this.loadTranslations();

      $('#dasher_app')
        .observer()
        .on('.sub.langs',this.addHelpTranslateLink);
      this.addHelpTranslateLink();
    }

  }
  LiChessTools.Tools.Crowdin = CrowdinTool;
})();

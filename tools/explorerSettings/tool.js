(() => {
  class ExplorerSettingsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'explorerSettings',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerSettings': 'Add some preferences to Explorer settings',
        'lichessTools': 'LiChess Tools',
        'moveEvaluationSettingText': 'Evaluation',
        'moveEvaluationSettingTitle': 'Move evaluation column',
        'gambitsSettingText': 'Gambits',
        'gambitsSettingTitle': 'Number of gambits column',
        'explorerPracticeSettingText': 'Practice',
        'explorerPracticeSettingTitle': 'Button to practice against Explorer moves',
        'meButtonSettingText': 'Me button',
        'meButtonSettingTitle': 'Button to switch player with your user',
        'moreGamesButtonText': 'More games',
        'moreGamesButtonTitle': 'Show more games in Recent Games'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'lichessTools': 'LiChess Tools',
        'moveEvaluationSettingText': 'Evaluare',
        'moveEvaluationSettingTitle': 'Coloan\u0103 cu evaluare mut\u0103ri',
        'gambitsSettingText': 'Gambituri',
        'gambitsSettingTitle': 'Coloan\u0103 cu num\u0103r gambituri',
        'explorerPracticeSettingText': 'Antrenament',
        'explorerPracticeSettingTitle': 'Buton pentru antrenament contra mut\u0103ri din Explorator',
        'meButtonSettingText': 'Button Eu',
        'meButtonSettingTitle': 'Buton care schimb\u0103 juc\u0103torul cu tine',
        'moreGamesButtonText': 'Mai multe jocuri',
        'moreGamesButtonTitle': 'Arat\u0103 mai multe jocuri \u00een Jocuri Recente'
      }
    };

    setOption = async (optionName, value) => {
      const lt = this.lichessTools;
      lt.currentOptions[optionName] = value;
      await lt.applyOptions(lt.currentOptions);
      lt.fireReloadOptions();
    };

    showSettingsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      if (!lichess.analysis?.explorer?.config?.data?.open()) return;
      const container = $('section.explorer-box div.config >div:has(section.date)');
      if (!container.length) return;
      let section = $('section.lichessTools-explorerSettings', container);
      if (!section.length) {
        const choices = $('<div class="choices">');
        if (lt.tools.ExplorerEvalTool) {
          choices
            .append($('<button class="lichessTools-moveEvaluation">').text(trans.noarg('moveEvaluationSettingText')).attr('title', trans.noarg('moveEvaluationSettingTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const value = lt.currentOptions.getValue('explorerEval');
                const hidden = lt.isOptionSet(value, 'hidden');
                this.setOption('explorerEval', hidden ? value.split(',').filter(s => s != 'hidden').join(',') : value + ',hidden');
                this.showSettingsDirect();
              }))
        }
        if (lt.tools.ExplorerGambitsTool) {
          choices
            .append($('<button class="lichessTools-gambits">').text(trans.noarg('gambitsSettingText')).attr('title', trans.noarg('gambitsSettingTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const value = lt.currentOptions.getValue('explorerGambits');
                this.setOption('explorerGambits', !value);
                this.showSettingsDirect();
              }))
        }
        if (lt.tools.ExplorerPracticeTool) {
          choices
            .append($('<button class="lichessTools-explorerPractice">').text(trans.noarg('explorerPracticeSettingText')).attr('title', trans.noarg('explorerPracticeSettingTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const value = lt.currentOptions.getValue('explorerPractice');
                this.setOption('explorerPractice', !value);
                this.showSettingsDirect();
              }))
        }
        if (lt.tools.ExplorerMoreGamesTool) {
          choices
            .append($('<button class="lichessTools-moreGames">').text(trans.noarg('moreGamesButtonText')).attr('title', trans.noarg('moreGamesButtonTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const value = lt.currentOptions.getValue('explorerMoreGames');
                this.setOption('explorerMoreGames', !value);
                this.showSettingsDirect();
              }));
        }
        if (lt.tools.OpeningExplorerUsersTool) {
          choices
            .append($('<button class="lichessTools-meButton">').text(trans.noarg('meButtonSettingText')).attr('title', trans.noarg('meButtonSettingTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const value = lt.currentOptions.getValue('openingExplorerUsers');
                const meButton = lt.isOptionSet(value, 'switchWithMe');
                this.setOption('openingExplorerUsers', meButton ? value.split(',').filter(s => s != 'switchWithMe').join(',') : value + ',switchWithMe');
                this.showSettingsDirect();
              }));
        }

        section = $('<section class="lichessTools-explorerSettings">')
          .append($('<label>').text(trans.noarg('lichessTools')))
          .append(choices)
          .appendTo(container);
      }
      let value = lt.currentOptions.getValue('explorerEval');
      value = !lt.isOptionSet(value, 'hidden');
      $('button.lichessTools-moveEvaluation', section)
        .attr('aria-pressed', value.toString())
        .prop('disabled', lt.isGamePlaying());
      value = lt.currentOptions.getValue('explorerGambits');
      $('button.lichessTools-gambits', section)
        .attr('aria-pressed', value.toString())
        .prop('disabled', lt.isGamePlaying());
      value = lt.currentOptions.getValue('explorerPractice');
      $('button.lichessTools-explorerPractice', section)
        .attr('aria-pressed', value.toString())
        .prop('disabled', lt.isGamePlaying());

      value = lt.currentOptions.getValue('explorerMoreGames');
      $('button.lichessTools-moreGames', section)
        .attr('aria-pressed', value.toString());

      value = lt.currentOptions.getValue('openingExplorerUsers');
      value = lt.isOptionSet(value, 'switchWithMe');
      $('button.lichessTools-meButton', section)
        .attr('aria-pressed', value.toString());
    };
    showSettings = this.lichessTools.debounce(this.showSettingsDirect, 100);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('explorerSettings');
      this.logOption('Explorer settings', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const explorer = lichess?.analysis?.explorer;
      if (!explorer) return;
      explorer.config.toggleOpen = lt.unwrapFunction(explorer.config.toggleOpen, 'explorerSettings');
      $('section.explorer-box section.lichessTools-explorerSettings').remove();
      lt.pubsub.off('lichessTools.redraw', this.showSettings);
      if (!value) return;
      explorer.config.toggleOpen = lt.wrapFunction(explorer.config.toggleOpen, {
        id: 'explorerSettings',
        after: ($this, result) => {
          this.showSettings();
        }
      });
      lt.pubsub.on('lichessTools.redraw', this.showSettings);
      this.showSettings();
    }

  }
  LiChessTools.Tools.ExplorerSettings = ExplorerSettingsTool;
})();

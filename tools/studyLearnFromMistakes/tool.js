(() => {
  class StudyLearnFromMistakesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange'];

    preferences = [
      {
        name: 'studyLearnFromMistakes',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyLearnFromMistakes': 'Learn from your mistakes in Studies',
        "learnFromYourMistakes": "Learn from your mistakes"
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyLearnFromMistakes': '\u00CEnva\u0163\u0103 din gre\u015Feli \u00een Studii',
        "learnFromYourMistakes": "\u00CEnva\u0163\u0103 din gre\u015Felile tale"
      }
    };

    toggleRetro = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      let retro = analysis.retro;
      if (retro) {
        analysis.toggleRetro();
        analysis.redraw();
        return;
      }
      const firstNode = analysis.mainline[0];
      if (!firstNode) return;
      if (!firstNode.eval) firstNode.eval = { cp: 20 };
      analysis.mainline.forEach(n => {
        if (!n.children?.length) return;
        const comment = n.children.flatMap(ch => ch.comments || []).find(c => c.by == 'lichess')?.text;
        if (!comment) return;
        const compChild = n.children.find(ch => comment.includes(ch.san));
        if (compChild) compChild.comp = true;
      });
      analysis.toggleRetro();
      analysis.redraw();
    };

    handleButton = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('div.advice-summary');
      if (!container) return;
      let button = $('a.button', container);
      if (!button.length) {
        button = $('<a class="button text">')
          .attr('data-icon', lt.icon.PlayTriangle)
          .text(trans.noarg('learnFromYourMistakes'))
          .on('click', ev => {
            ev.preventDefault();
            this.toggleRetro();
          })
          .insertAfter($('div.advice-summary__side', container).eq(0));
      }
      button.toggleClassSafe('active', !!lichess.analysis.retro);
    };

    closeRetro = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (analysis.retro) {
        analysis.toggleRetro();
        analysis.redraw();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('studyLearnFromMistakes');
      this.logOption('Study learn from mistakes', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      lt.global.clearInterval(this.interval);
      lt.pubsub.off('lichessTools.chapterChange', this.closeRetro);
      if (!value) {
        $('div.advice-summary a.button').remove();
        this.closeRetro();
        return;
      }
      this.interval = lt.global.setInterval(this.handleButton, 1000);
      lt.pubsub.on('lichessTools.chapterChange', this.closeRetro);
    }

  }
  LiChessTools.Tools.StudyLearnFromMistakes = StudyLearnFromMistakesTool;
})();

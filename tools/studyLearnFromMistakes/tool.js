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
        "viewTheSolution": "View the solution",
        "anotherWasX": "Another was %s",
        "bestWasX": "Best was %s",
        "youBrowsedAway": "You browsed away",
        "evaluatingYourMove": "Evaluating your move ...",
        "learnFromYourMistakes": "Learn from your mistakes",
        "learnFromThisMistake": "Learn from this mistake",
        "skipThisMove": "Skip this move",
        "next": "Next",
        "xWasPlayed": "%s was played",
        "findBetterMoveForWhite": "Find a better move for White",
        "findBetterMoveForBlack": "Find a better move for Black",
        "resumeLearning": "Resume learning",
        "youCanDoBetter": "You can do better",
        "tryAnotherMoveForWhite": "Try another move for White",
        "tryAnotherMoveForBlack": "Try another move for Black",
        "solution": "Solution",
        "waitingForAnalysis": "Waiting for analysis",
        "noMistakesFoundForWhite": "No significant mistakes found for White",
        "noMistakesFoundForBlack": "No significant mistakes found for Black",
        "doneReviewingWhiteMistakes": "Done reviewing White mistakes",
        "doneReviewingBlackMistakes": "Done reviewing Black mistakes",
        "doItAgain": "Do it again",
        "reviewWhiteMistakes": "Review White mistakes",
        "reviewBlackMistakes": "Review Black mistakes",
        "goodMove": "Good move"
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyLearnFromMistakes': '\u00CEnva\u0163\u0103 din gre\u015Feli \u00een Studii',
        "viewTheSolution": "Vezi solu\u0163ia",
        "anotherWasX": "Alt\u0103 mutare bun\u0103 este: %s",
        "bestWasX": "Cea mai bun\u0103 mutare este: %s",
        "youBrowsedAway": "A\u0163i p\u0103r\u0103sit jocul cu computer-ul",
        "evaluatingYourMove": "Evalu\u00e2ndu-\u0163i mutarea ...",
        "learnFromYourMistakes": "\u00CEnva\u0163\u0103 din gre\u015Felile tale",
        "learnFromThisMistake": "\u00CEnva\u0163\u0103 din aceast\u0103 gre\u015Feal\u0103",
        "skipThisMove": "S\u0103ri peste aceast\u0103 mutare",
        "next": "Urm\u0103toarea",
        "xWasPlayed": "S-a mutat %s",
        "findBetterMoveForWhite": "G\u0103se\u015Fte o mutare mai bun\u0103 pentru albe",
        "findBetterMoveForBlack": "G\u0103se\u015Fte o mutare mai bun\u0103 pentru negre",
        "resumeLearning": "Reia \u00eenv\u0103\u0163atul",
        "youCanDoBetter": "Po\u0163i mai bine",
        "tryAnotherMoveForWhite": "\u00CEncearc\u0103 alt\u0103 mutare pentru albe",
        "tryAnotherMoveForBlack": "\u00CEncearc\u0103 alt\u0103 mutare pentru negre",
        "solution": "Solu\u0163ie",
        "waitingForAnalysis": "A\u015Ftept\u00e2nd analiza",
        "noMistakesFoundForWhite": "Nici o gre\u015Feal\u0103 g\u0103sit\u0103 din partea albelor",
        "noMistakesFoundForBlack": "Nici o gre\u015Feal\u0103 g\u0103sit\u0103 din partea negrelor",
        "doneReviewingWhiteMistakes": "Gata cu analiza gre\u015Felilor din partea albelor",
        "doneReviewingBlackMistakes": "Gata cu analiza gre\u015Felilor din partea negrelor",
        "doItAgain": "F\u0103-o din nou",
        "reviewWhiteMistakes": "Analizeaz\u0103 gre\u015Felile albelor",
        "reviewBlackMistakes": "Analizeaz\u0103 gre\u015Felile negrelor",
        "goodMove": "Mutare bun\u0103"
      }
    };

    translateRetro = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const retro = analysis.retro;
      if (!retro || retro.trans === trans) return;
      retro.trans = trans;
      retro.noarg = trans.noarg.bind(trans);
      analysis.redraw();
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
      this.translateRetro();
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
      button.toggleClass('active', !!lichess.analysis.retro);
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
      lt.pubsub.off('lichessTools.redraw', this.translateRetro);
      if (!value) {
        $('div.advice-summary a.button').remove();
        this.closeRetro();
        return;
      }
      this.interval = lt.global.setInterval(this.handleButton, 1000);
      lt.pubsub.on('lichessTools.chapterChange', this.closeRetro);
      lt.pubsub.on('lichessTools.redraw', this.translateRetro);

      // learnFromThisMistake translation uses the analysis.trans object (https://github.com/lichess-org/lila/issues/14324)
      if (analysis.trans?.noarg && !lt.isWrappedFunction(analysis.trans.noarg,'studyLearnFromMistakes')) {
        analysis.trans.noarg = lt.wrapFunction(analysis.trans.noarg,{
          id: 'studyLearnFromMistakes',
          after: ($this, result, ...args)=>{
            if (args[0]==='learnFromThisMistake') {
              return lt.translator.noarg(...args);
            }
          }
        })
      }
    }

  }
  LiChessTools.Tools.StudyLearnFromMistakes = StudyLearnFromMistakesTool;
})();

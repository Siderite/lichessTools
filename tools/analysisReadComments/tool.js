(() => {
  class AnalysisReadCommentsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'analysisReadComments',
        category: 'analysis2',
        type: 'multiple',
        possibleValues: ['enabled', 'stripEmoji', 'readAnnotations'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.analysisReadComments': 'Read move comments',
        'analysisReadComments.enabled': 'Enabled',
        'analysisReadComments.stripEmoji': 'Ignore emojis',
        'analysisReadComments.readAnnotations': 'Read annotations',
        'readCommentsButtonTitle': 'LiChess Tools - toggle comment reading'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.analysisReadComments': 'Cite\u015fte comentarii mut\u0103ri',
        'analysisReadComments.enabled': 'Activat',
        'analysisReadComments.stripEmoji': 'Ignor\u0103 emoji',
        'analysisReadComments.readAnnotations': 'Cite\u0157te adnot\u0103ri',
        'readCommentsButtonTitle': 'LiChess Tools - comut\u0103 citire comentarii'
      }
    }

    readComments = ()=>{
      const lt = this.lichessTools;
      if (!this.options.enabled || lt.storage.get('LiChessTools.dontReadComments')) return;
      const lichess = lt.lichess;

      lt.stopSpeaking();
      const node = lichess.analysis.node;
      if (!node) return;
      const comments = lt.getNodeCommentsText(node);
      let speakable = lt.getSpeakableText(comments,{ 
        stripEmoji: this.options.stripEmoji,
        isCheck: node.san?.endsWith('+'),
        isMate: node.san?.endsWith('#'),
        readAnnotations: this.options.readAnnotations,
        glyphs: node.glyphs
      });
      let shouldSpeak = speakable != this.prev?.speakable && (node.fen != this.prev?.fen || Date.now()-this.prev?.time > 2000);
      this.prev = {
        speakable: speakable,
        fen: node.fen
      }
      if (shouldSpeak && speakable?.trim()) {
        lt.speak(speakable, { rate: 1.25 });
        this.prev.time = Date.now();
      }
    }

    showInteractiveButton = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('.gamebook .comment');
      if (!container.length || $('.lichessTools-readComments', container).length) return;
      $('<button class="lichessTools-readComments">')
        .attr('data-icon',lt.icon.Voice)
        .attr('title', trans.noarg('readCommentsButtonTitle'))
        .on('click', (ev) => {
          ev.preventDefault();
          const val = this.toggleReadingComments();
          $(ev.target).toggleClass('dontReadComments',val);
        })
        .toggleClass('dontReadComments',!!lt.storage.get('LiChessTools.dontReadComments'))
        .appendTo(container);
    };

    toggleReadingComments = ()=>{
      const lt = this.lichessTools;
      const val = !lt.storage.get('LiChessTools.dontReadComments');
      lt.storage.set('LiChessTools.dontReadComments',val);
      if (val) {
        lt.stopSpeaking();
      } else {
        this.readComments();
      }
      return val;
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('analysisReadComments');
      this.logOption('Analysis read comments', value);
      this.options = {
        enabled: lt.isOptionSet(value, 'enabled'),
        stripEmoji: lt.isOptionSet(value, 'stripEmoji'),
        readAnnotations: lt.isOptionSet(value, 'readAnnotations')
      };

      if (!lichess?.analysis || !lt.uiApi) return;
      const isRelay = lichess.analysis.study?.relay;
      if (isRelay) return;
      
      lt.uiApi.events.off('ply', this.readComments);
      lt.global.removeEventListener('beforeunload', lt.stopSpeaking);
      $('.lichessTools-readComments').remove();
      $('main').observer()
        .off('.gamebook, .gamebook .comment',this.showInteractiveButton);
      if (!this.options.enabled) return;

      lt.uiApi.events.on('ply', this.readComments);
      this.readComments();
      lt.global.addEventListener('beforeunload', lt.stopSpeaking);
      $('main').observer()
        .on('.gamebook, .gamebook .comment',this.showInteractiveButton);
      this.showInteractiveButton();
    }

  }
  LiChessTools.Tools.AnalysisReadComments = AnalysisReadCommentsTool;
})();

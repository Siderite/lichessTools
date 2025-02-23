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

    urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    regChessMove = /(?<number>\d+\.\s?(\.\.)?\s*)?(?<move>\b((?<castle>[0O]-[0O](-[0O])?)|(?<piece>[NBRQK])?(?<p1>([a-h])?([1-8])?(x)?([a-h][1-8]))(=(?<promotion>[NBRQK]))?)(?<p2>\+|#)?)(?<glyph>[!\?]{1,2})?/g;
    pieces = {
      'p':'pawn',
      'n':'knight',
      'b':'bishop',
      'r':'rook',
      'q':'queen',
      'k':'king'
    };
    annotations = {
      '!':'good move',
      '?':'mistake',
      '!!':'brilliant',
      '??':'blunder',
      '?!':'dubious move',
      '!?':'interesting'
    };
    getSpeakableText = (text)=>{
      if (!text) return;
      text = text.replaceAll(/(cls|bkm|prc|rnd):([^\s]*)\s*/gi,'');
      if (this.options.stripEmoji) {
        text = text.replaceAll(/\p{Extended_Pictographic}+/ugi,' ');
      }
      text = text.replaceAll(/e\.\s*p\./gi,'un phsaant');
      text = text.replaceAll(this.urlRegex,(m)=>{
        const url = new URL(m);
        const host = url.host
                        .replaceAll(/youtu.be/gi,'youtube')
                        .replaceAll(/(^www\.|\.com$|\.org|\.net$|\.co\.\w+$)/gi,'');
        return host+' URL ';
      });
      text = text.replaceAll(this.regChessMove,(...arr)=>{
        const result = [];
        const g = arr.at(-1);
        let m;
        if (g.number) {
          const num = /\d+/.exec(g.number)[0];
          result.push(num);
          if ([...g.number.matchAll(/\./g)].length==3) result.push(', black moves');
        }
        if (g.move) {
          const sanWords = g.move
            .split('')
            .map(c => {
              if (c === 'x') return 'takes';
              if (c === '+') return 'check';
              if (c === '#') return 'checkmate';
              if (c === '=') return 'promotes to';
              if (c === '@') return 'at';
              if (c === '0') return 'O';
              const code = c.charCodeAt(0);
              if (code > 48 && code < 58) return c; // 1-8
              if (code > 96 && code < 105) return c.toUpperCase(); // a-h
              return this.pieces[c.toLowerCase()] ?? c;
            })
            .join(' ')
          result.push(sanWords);
        }
        if (g.glyph) {
          const ann = this.annotations[g.glyph];
          if (ann) result.push(', '+ann);
        }
        return result.join(' ')
            .replace('O - O - O', 'long castle')
            .replace('O - O', 'short castle')
            .replace(/^A /, '"A"') // "A takes" & "A 3" are mispronounced
            .replace(/(\d) E (\d)/, '$1,E $2') // Strings such as 1E5 are treated as scientific notation
            .replace(/C /, 'c ') // Capital C is pronounced as "degrees celsius" when it comes after a number (e.g. R8c3)
            .replace(/F /, 'f ') // Capital F is pronounced as "degrees fahrenheit" when it comes after a number (e.g. R8f3)
            .replace(/(\d) H (\d)/, '$1H$2') // "H" is pronounced as "hour" when it comes after a number with a space (e.g. Rook 5 H 3)
            .replace(/(\d) H (\d)/, '$1H$2')
            +', ';
      });
      text = text.replaceAll(/lichess/gi,'lee chess');
      return text;
    };

    readComments = ()=>{
      const lt = this.lichessTools;
      if (lt.storage.get('LiChessTools.dontReadComments')) return;
      const lichess = lt.lichess;

      lt.stopSpeaking();
      const node = lichess.analysis.node;
      if (!node) return;
      const comments = lt.getNodeCommentsText(node);
      this.prevComments = comments;
      let speakable = this.getSpeakableText(comments);
      if (this.options.readAnnotations && node.glyphs?.length) {
        speakable = node.glyphs
          .map(g=>g.name || this.annotations[g.symbol])
          .concat([speakable])
          .filter(g=>g)
          .join(', ');
      }
      if (speakable?.trim() && speakable != this.prevSpeakable) {
        lt.speak(speakable, { rate: 1.25 });
      }
      this.prevSpeakable = speakable;
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
      this.prevComments = false;
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

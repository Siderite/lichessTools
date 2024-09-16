(() => {
  class MirrorBoardTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'mirrorBoard',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.mirrorBoard': 'Mirror button in Board Editor',
        'mirrorButtonText': 'Mirror',
        'mirrorButtonTitle': 'LiChess Tools - mirror position'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.mirrorBoard': 'Button oglind\u0103 \u00een Editor Tabel\u0103',
        'mirrorButtonText': 'Oglind\u0103',
        'mirrorButtonTitle': 'LiChess Tools - pozi\u0163ia \u00een oglind\u0103'
      }
    }

    mirrorBoard = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const input = $('div.copyables input[enterkeyhint="done"]');
      const fen = input.val();
      const mirrorFen = parent.reverseFen(fen);
      input.val(mirrorFen).trigger('change');
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('mirrorBoard');
      this.logOption('Sticky analysis', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      $('.board-editor__tools .actions buttons.lichessTools-mirrorBoard').remove();
      if (!value) return;
      $('<button class="button button-empty lichessTools-mirrorBoard"><span class="text"></span></button>')
        .attr('title', trans.noarg('mirrorButtonTitle'))
        .on('click', this.mirrorBoard)
        .insertBefore('.board-editor__tools .actions form[action="/study/as"]')
        .find('span.text')
        .text(trans.noarg('mirrorButtonText'))
        .attr('data-icon', '\uD83E\uDE9E');
    }

  }
  LiChessTools.Tools.MirrorBoard = MirrorBoardTool;
})();

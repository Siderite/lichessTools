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
        'options.mirrorBoard': 'Buton oglind\u0103 \u00een Editor Tabl\u0103',
        'mirrorButtonText': 'Oglind\u0103',
        'mirrorButtonTitle': 'LiChess Tools - pozi\u0163ia \u00een oglind\u0103'
      }
    }

    mirrorBoard = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const input = $('div.copyables input[enterkeyhint="done"]');
      const fen = input.val();
      const mirrorFen = lt.reverseFen(fen);
      input.val(mirrorFen).trigger('change');
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('mirrorBoard');
      this.logOption('Sticky analysis', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      $('.board-editor__tools .actions buttons.lichessTools-mirrorBoard').remove();
      if (!value) return;
      $('<button class="button button-empty lichessTools-mirrorBoard"><span class="text"></span></button>')
        .attr('title', trans.noarg('mirrorButtonTitle'))
        .on('click', this.mirrorBoard)
        .insertBefore('.board-editor__tools .actions form[action="/study/as"]')
        .find('span.text')
        .text(trans.noarg('mirrorButtonText'))
        .attr('data-icon', lt.icon.Mirror);
    }

  }
  LiChessTools.Tools.MirrorBoard = MirrorBoardTool;
})();

(() => {
  class BoardSaturateTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'boardSaturate',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.boardSaturate': 'Board saturation',
        'boardSaturateText': 'Saturation',
        'boardSaturateTitle': 'LiChess Tools - board saturation'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.boardSaturate': 'Satura\u016fie tabl\u0103',
        'boardSaturateText': 'Satura\u016fie',
        'boardSaturateTitle': 'LiChess Tools - satura\u016fie tabl\u0103'
      }
    }

    addBoardSaturate = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#dasher_app .sub.board');
      if (!container.length) return;

      let div = container.find('.lichessTools-boardSaturate');
      if (!div.length) {
        div = $(`<div class="lichessTools-boardSaturate"><label></label><input class="range" min="0" max="200" step="1" type="range"></div>`)
          .attr('title',trans.noarg('boardSaturateTitle'))
          .insertAfter('.board-hue');
        div.find('label')
          .text(trans.noarg('boardSaturateText'));
        div.find('input')
          .on('input',(ev)=>{
            const value = +ev.currentTarget.value;
            $('body').css('--lt-board-saturate',value/100);
            if (value!=100 && !container.find('button.reset').length) {
              container.find('.board-hue input').trigger('input');
            }
            lt.storage.set('LiChessTools.boardSaturate',value);
          })
          .val(Math.round($('body').css('--lt-board-saturate')*100));
      }
      const resetButton = container.find('button.reset');
      if (!resetButton.prop('_initBoardSaturate')) {
        resetButton
          .prop('_initBoardSaturate', true)
          .on('click',()=>container.find('input')
                            .val(100)
                            .trigger('input'));
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('boardSaturate');
      this.logOption('Board saturate', value);
      this.options = { enabled : !!value };

      $('#dasher_app')
        .observer()
        .off('.sub.board.d2',this.addBoardSaturate);

      $('.lichessTools-boardSaturate').remove();
      let saturate = 100;
      if (this.options.enabled) {
        $('#dasher_app')
          .observer()
          .on('.sub.board.d2',this.addBoardSaturate);
        this.addBoardSaturate();
        saturate = lt.storage.get('LiChessTools.boardSaturate') || 100;
      }
      $('body').css('--lt-board-saturate',saturate/100);
    }

  }
  LiChessTools.Tools.BoardSaturate = BoardSaturateTool;
})();

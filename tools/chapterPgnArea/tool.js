(() => {
  class ChapterPgnAreaTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'ExportPGN'];

    preferences = [
      {
        name: 'chapterPgnArea',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chapterPgnArea': 'Show PGN in studies',
        'PGNText': 'PGN',
        'PGNTitle': 'LiChess Tools - show chapter PGN'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterPgnArea': 'Arat\u0103 PGN \u00een studii',
        'PGNText': 'PGN',
        'PGNTitle': 'LiChess Tools - arat\u0103 PGNul capitolului'
      },
      'zh-TW': {
        'options.study': '\u7814\u7A76',
        'options.chapterPgnArea': '\u5728\u7814\u7A76\u4E2D\u986F\u793A PGN',
        PGNText: 'PGN',
        PGNTitle: 'LiChess Tools - \u986F\u793A\u7AE0\u7BC0 PGN',
      }
    }

    setupAreaDirect = async () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      const container = $('div.study__share form.form3');
      if (!container.length) return;
      let group = $('div.form-group.lichessTools-chapterPgnArea', container);
      if (!group.length) {
        group = $(`<div class="form-group lichessTools-chapterPgnArea">
    <label class="form-label"></label>
    <div class="copy-me">
      <textarea spellcheck="false" readonly autoselect></textarea>
      <button class="copy-me__button button button-metal"></button>
    </div>
</div>`).appendTo(container);
        $('.form-label', group).text(trans.noarg('PGNText')).attr('title', trans.noarg('PGNTitle'));
        $('button.copy-me__button',group)
          .attr('data-icon','\uE070');
      }
      const pgn = await parent.exportPgn('');
      $('textarea', group).val(pgn);
    };
    setupArea = this.lichessTools.debounce(this.setupAreaDirect, 500);

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('chapterPgnArea');
      this.logOption('Chapter PGN area', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      $('div.study__share form.form3 div.form-group.lichessTools-chapterPgnArea').remove();
      lichess.pubsub.off('lichessTools.redraw', this.setupArea);
      study.vm.toolTab = lichessTools.unwrapFunction(study.vm.toolTab, 'chapterPgnArea');
      if (!value) return;
      lichess.pubsub.on('lichessTools.redraw', this.setupArea);
      study.vm.toolTab = lichessTools.wrapFunction(study.vm.toolTab, {
        id: 'chapterPgnArea',
        after: ($this, result, data) => {
          parent.global.setTimeout(this.setupArea, 200);
        }
      });
      this.setupArea();
    }

  }
  LiChessTools.Tools.ChapterPgnArea = ChapterPgnAreaTool;
})();

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
      }
    }

    setupAreaDirect = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
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
      const pgn = await lt.exportPgn('');
      $('textarea', group).val(pgn);
    };
    setupArea = this.lichessTools.debounce(this.setupAreaDirect, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('chapterPgnArea');
      this.logOption('Chapter PGN area', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      $('div.study__share form.form3 div.form-group.lichessTools-chapterPgnArea').remove();
      lt.pubsub.off('lichessTools.redraw', this.setupArea);
      study.vm.toolTab = lt.unwrapFunction(study.vm.toolTab, 'chapterPgnArea');
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.setupArea);
      study.vm.toolTab = lt.wrapFunction(study.vm.toolTab, {
        id: 'chapterPgnArea',
        after: ($this, result, data) => {
          lt.global.setTimeout(this.setupArea, 200);
        }
      });
      this.setupArea();
    }

  }
  LiChessTools.Tools.ChapterPgnArea = ChapterPgnAreaTool;
})();

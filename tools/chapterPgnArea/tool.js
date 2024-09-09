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
    <textarea spellcheck="false" readonly autoselect></textarea>
</div>`).appendTo(container);
        $('.form-label', group).text(trans.noarg('PGNText')).attr('title', trans.noarg('PGNTitle'));
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

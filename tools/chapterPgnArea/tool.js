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
      if (!this.options.enabled) return;
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
          .attr('data-icon',lt.icon.Clipboard)
          .on('click',async ev=>{
            ev.preventDefault();
            await this.copyAreaPgn(group);
          });
      }
      const pgn = await lt.exportPgn('', { exportTags: true });
      $('textarea', group).val(pgn);
    };
    setupArea = this.lichessTools.debounce(this.setupAreaDirect, 500);

    // Lichess's copy-me__button handler only reads input/anchor children, so the
    // textarea display needs its own copy handler and checkmark flash.
    copyAreaPgn = async (group) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const navigator = lt.global.navigator;
      const text = $('textarea', group).val();
      if (!text) return;
      const mime = await this.supportedClipboardMime();
      let written = false;
      for (const candidate of [ ...new Set([ mime, 'text/plain' ]) ]) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [candidate]: new lt.global.Blob([text], { type: candidate }) })
          ]);
          written = true;
          break;
        } catch (e) {
          lt.global.console.warn('Error copying chapter PGN to clipboard',e);
        }
      }
      if (!written) {
        lt.announce(trans.noarg('clipboardDenied'));
        return;
      }
      this.showCopyCheckmark($('button.copy-me__button', group));
    };

    // application/x-chess-pgn is only honoured by some browsers; fall back to plain
    // text so the PGN is always copied.
    supportedClipboardMime = async () => {
      const lt = this.lichessTools;
      const pgnMime = 'application/x-chess-pgn';
      try {
        if (ClipboardItem.supports(pgnMime)) return pgnMime;
      } catch (e) {
        lt.global.console.debug('ClipboardItem.supports rejected the PGN mime type',e);
      }
      return 'text/plain';
    };

    showCopyCheckmark = (button) => {
      const lt = this.lichessTools;
      button
        .attr('data-icon',lt.icon.Checkmark)
        .removeClass('button-metal');
      lt.global.setTimeout(()=>button.attr('data-icon',lt.icon.Clipboard).addClass('button-metal'),1000);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('chapterPgnArea');
      this.logOption('Chapter PGN area', value);
      this.options = { enabled: !!value };
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

(() => {
  class DownloadBroadcastPgnTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'downloadBroadcastPgn',
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
        'options.downloadBroadcastPgn': 'Download broadcast PGN',
        'downloadBroadcastTitle': 'LiChess Tools - download broadcast PGN'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.downloadBroadcastPgn': 'Descarc\u0103 PGN-ul transmisiunii',
        'downloadBroadcastTitle': 'LiChess Tools - descarc\u0103 PGN-ul transmisiunii'
      }
    };

    addDownloadButton = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      const container = $('.study__side div[role=tablist],.relay-tour__side__header');
      if (!container.length) return;
      let button = $('span.lichessTools-downloadBroadcastPgn', container);
      if (!this.options.enabled) {
        button.remove();
        return;
      }
      const broadcastId = study.relay?.data?.tour?.id;
      if (broadcastId && !button.length) {
        button = $('<a target="_blank" download class="lichessTools-downloadBroadcastPgn">')
          .attr('data-icon', lt.icon.Download)
          .attr('title', trans.noarg('downloadBroadcastTitle'))
          .attr('href', '/api/broadcast/'+broadcastId+'.pgn')
          .insertAfter($('span.search,.relay-tour__side__name', container));
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('downloadBroadcastPgn');
      this.logOption('Download broadcast PGN', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      this.options = {
        enabled: !!value
      };
      this.addDownloadButton();
    }

  }
  LiChessTools.Tools.DownloadBroadcastPgn = DownloadBroadcastPgnTool;
})();

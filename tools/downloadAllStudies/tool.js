(() => {
  class DownloadAllStudiesTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'downloadAllStudies',
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
        'options.downloadAllStudies': 'Link to download all studies of a player',
        'downloadAllText': 'Download all studies',
        'downloadAllTitle': 'LiChess Tools - all studies for this player'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.downloadAllStudies': 'Link pentru a desc\u0103rca toate studiile unui juc\u0103tor',
        'downloadAllText': 'Descarc\u0103 toate studiile',
        'downloadAllTitle': 'LiChess Tools - toate studiile acestui juc\u0103tor'
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('downloadAllStudies');
      this.logOption('Download all studies', value);
      const $ = lt.$;
      const trans = lt.translator;
      $('a.lichessTools-downloadAllStudies').remove();
      if (!value) return;
      if ($('div.nostudies').length) return;
      const form = $('form.search');
      if (!form.length) return;
      const queryText = form.find('input[name="q"]').val();
      if (!queryText) return;
      const m = /\bowner:(\w+)/i.exec(queryText);
      if (!m) return;
      const userId = m[1].toLowerCase();
      $('<a class="lichessTools-downloadAllStudies">')
        .attr('href', '/study/by/' + userId + '/export.pgn')
        .attr('title', trans.noarg('downloadAllTitle'))
        .text(trans.noarg('downloadAllText'))
        .appendTo('div.box__top');
    }

  }
  LiChessTools.Tools.DownloadAllStudies = DownloadAllStudiesTool;
})();

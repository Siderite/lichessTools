(() => {
  class DownloadGamesTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'downloadGames',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.downloadGames': 'Download games in Advanced Search',
        'downloadingText': 'Downloading... %s games so far',
        'downloadButtonText': 'Download',
        'downloadButtonTitle': 'LiChess Tools - Download'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.downloadGames': 'Descarc\u0103 jocuri \u00een C\u0103utare Avansat\u0103',
        'downloadingText': 'Am descarcat... %s jocuri p\u00e2n\u0103 acum',
        'downloadButtonText': 'Descarc\u0103',
        'downloadButtonTitle': 'LiChess Tools - Desc\u0103rcare'
      },
      'zh-TW': {
        'options.general': '\u4E00\u822C',
        'options.downloadGames': '\u5728\u9032\u968E\u641C\u5C0B\u4E2D\u4E0B\u8F09\u68CB\u5C40',
        downloadingText: '\u76EE\u524D\u5DF2\u4E0B\u8F09 %s \u500B\u68CB\u5C40',
        downloadButtonText: '\u4E0B\u8F09',
        downloadButtonTitle: 'LiChess Tools - \u4E0B\u8F09',
      }
    }

    downloadGames = async () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      let url = $('div.search__result a.permalink').attr('href');
      if (!url) return;
      let ids = [];
      try {
        $('td.action div.wait').remove();
        const waitDiv = $(`<div class="wait">
    <div class="spinner">
        <svg viewBox="-2 -2 54 54">
            <g mask="url(#mask)" fill="none">
                <path id="a" stroke-width="3.779" d="m21.78 12.64c-1.284 8.436 8.943 12.7 14.54 17.61 3 2.632 4.412 4.442 5.684 7.93"/>
                <path id="b" stroke-width="4.157" d="m43.19 36.32c2.817-1.203 6.659-5.482 5.441-7.623-2.251-3.957-8.883-14.69-11.89-19.73-0.4217-0.7079-0.2431-1.835 0.5931-3.3 1.358-2.38 1.956-5.628 1.956-5.628"/>
                <path id="c" stroke-width="4.535" d="m37.45 2.178s-3.946 0.6463-6.237 2.234c-0.5998 0.4156-2.696 0.7984-3.896 0.6388-17.64-2.345-29.61 14.08-25.23 27.34 4.377 13.26 22.54 25.36 39.74 8.666"/>
            </g>
        </svg>
    </div>
    <span class="lichessTools-downloading"></span>
</div>`)
          .appendTo($('td.action'))
          .css('display', 'inline');
        let page = 1;
        let budget = 40;
        while (page) {
          const cost = Math.floor(Math.sqrt(page))
          while (budget - cost <= 0) {
            await parent.timeout(6000);
            budget++;
          }
          const obj = await parent.net.json(url + '&page=' + page);
          const newIds = obj?.paginator?.currentPageResults?.map(x => x.id);
          page = obj?.paginator?.nextPage;
          if (newIds) {
            ids = ids.concat(newIds);
            $('.lichessTools-downloading', waitDiv).text(trans.pluralSame('downloadingText', ids.length));
            await parent.timeout(6000);
            budget++;
          }
        }
      } finally {
        $('td.action div.wait').remove();
        console.log(ids);
      }
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('downloadGames');
      this.logOption('Download Advanced Search games', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      if (!value) return;
      if (!$('main').is('.search')) return;
      const url = $('div.search__result a.permalink').attr('href');
      if (!url) return;
      $('td.action').addClass('lichessTools-download');
      const button = $('<button type="button" class="button">')
        .text(trans.noarg('downloadButtonText'))
        .attr('title', trans.noarg('downloadButtonTitle'))
        .on('click', this.downloadGames)
        .insertAfter($('td.action button[type=submit]'));
    }

  }
  LiChessTools.Tools.DownloadGames = DownloadGamesTool;
})();

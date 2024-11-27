(() => {
  class PinOnMainPageTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'pinOnMainPage',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.General': 'General',
        'options.pinOnMainPage': 'Pin broadcasts and studies to home page',
        'pinTitle': 'LiChess Tools - pin on home page',
        'unpinTitle': 'LiChess Tools - unpin from home page'
      },
      'ro-RO': {
        'options.General': 'General',
        'options.pinOnMainPage': 'Pune transmisiuni \u015fi studii pe pagina principal\u0103',
        'pinTitle': 'LiChess Tools - pune pe pagina principal\u0103',
        'unpinTitle': 'LiChess Tools - scoate de pe pagina principal\u0103'
      }
    };

    pinCurrentStudy = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      if (!study) return;
      const studyId = study.data.id;
      const tourName = study.relayData?.tour?.name;
      const studyName = (tourName ? tourName + ' ' : '') + study.data.name;
      const isPinned = !!this.options.pinned.find(p => p.studyId == studyId);
      if (isPinned) {
        lt.arrayRemoveAll(this.options.pinned, p => p.studyId == studyId);
      } else {
        this.options.pinned.push({ studyId, studyName });
      }
      lt.storage.set('LichessTools.pinnedStudies', this.options.pinned);
      this.addPin();
    };

    unpinStudy = (studyId) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      lt.arrayRemoveAll(this.options.pinned, p => p.studyId == studyId);
      lt.storage.set('LichessTools.pinnedStudies', this.options.pinned);
    };

    addPin = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      const container = $('.study__side div[role=tablist]');
      if (!container.length) return;
      let pin = $('span.lichessTools-pin', container);
      if (!this.options.enabled) {
        pin.remove();
        return;
      }
      const studyId = study.data.id;
      if (!pin.length) {
        pin = $('<span class="lichessTools-pin narrow">')
          .attr('data-icon', '\uD83D\uDCCC')
          .attr('title', trans.noarg('pinTitle'))
          .on('click', ev => {
            ev.preventDefault();
            this.pinCurrentStudy();
          })
          .insertAfter($('span.search', container));
      }
      const isPinned = !!this.options.pinned.find(p => p.studyId == studyId);
      pin.toggleClass('lichessTools-pinned', isPinned);
    };

    addToHomepage = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const container = $('div.lobby__spotlights');
      if (!container.length) return;
      if (!this.options.enabled) {
        $('.lichessTools-pin', container).remove();
        return;
      }
      this.options.pinned.forEach(p => {
        let elem = $('a.id_' + p.studyId, container);
        if (elem.length) return;
        const innerElem = $('<span class="content"><span class="name"></span><span class="lichessTools-unpin"></span></span>');
        innerElem.find('span.lichessTools-unpin')
          .attr('data-icon', lt.icon.Cancel)
          .attr('title', trans.noarg('unpinTitle'))
          .on('click', ev => {
            ev.preventDefault();
            ev.stopPropagation();
            this.unpinStudy(p.studyId);
            innerElem.closest('a.lichessTools-pin').remove();
          });
        elem = $('<a class="lichessTools-pin tour-spotlight">')
          .addClass('id_' + p.studyId)
          .attr('href', '/study/' + p.studyId)
          .attr('title', 'LiChess Tools - ' + p.studyName)
          .append($('<i class="img">').attr('data-icon', '\uD83D\uDCCC'))
          .append(innerElem)
          .appendTo(container);
        elem.find('.content .name').text(p.studyName);
      });
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('pinOnMainPage');
      this.logOption('Pin on main page', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      this.options = {
        enabled: value,
        pinned: lt.storage.get('LichessTools.pinnedStudies') || []
      };
      this.addPin();
      this.addToHomepage();
    }

  }
  LiChessTools.Tools.PinOnMainPage = PinOnMainPageTool;
})();

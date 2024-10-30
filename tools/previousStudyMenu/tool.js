(() => {
  class PreviousStudyMenuTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'DetectThirdParties'];

    preferences = [
      {
        name: 'previousStudyMenu',
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
        'options.previousStudyMenu': 'Last visited study menu',
        'previousStudyText': 'Previous study',
        'previousStudyTitle': 'LiChess Tools - "%s"'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.previousStudyMenu': 'Meniu pentru ultimul studiu vizitat',
        'previousStudyText': 'Studiul anterior',
        'previousStudyTitle': 'LiChess Tools - "%s"'
      }
    }

    updateStudy = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const study = lichess?.analysis?.study;
      const JSON = lt.global.JSON;
      let studyData = lt.currentOptions.getValue('previousStudyMenu.study');
      if (!studyData?.length) {
        studyData = [];
      }
      if (study) {
        const tourName = study.relayData?.tour?.name;
        const studyName = (tourName ? tourName + ' ' : '') + study.data.name;
        const data = {
          id: study.data.id,
          url: study.ctrl?.opts?.relay?.tour?.url,
          name: studyName
        };
        const existingIndex = studyData.findIndex(sd => sd.id == data.id);
        if (existingIndex < 0 || existingIndex > 0 || JSON.stringify(studyData[existingIndex]) != JSON.stringify(data)) {
          if (existingIndex >= 0) {
            studyData.splice(existingIndex, 1);
          }
          studyData.unshift(data);
          if (studyData.length > 6) studyData.length = 6;
          lt.currentOptions['previousStudyMenu.study'] = studyData;
          await lt.saveOptions(lt.currentOptions);
        }
      }
      const container = $('#topnav section a[href="/learn"]+div[role="group"]');
      let elem = $('a.lichessTools-previousStudy', container);
      if (this.options.enabled && studyData?.length) {
        if (!elem.length) {
          elem = $('<a/>')
            .addClass('lichessTools-previousStudy')
            .text(trans.noarg('previousStudyText'))
            .append('<span>')
            .append('<div role="group"></div>')
            .appendTo(container);
        }
        const data = studyData[0];
        const url = data.url || '/study/' + data.id;
        if (elem.attr('href') != url) {
          elem.attr('href', url)
        }
        const title = trans.pluralSame('previousStudyTitle', data.name);
        if (elem.attr('title') != title) {
          elem.attr('title', title);
        }
        if (elem.find('span').text() != data.name) {
          elem.find('span').text(data.name);
        }
        const group = elem.find('div[role="group"]');
        if (studyData.length < 2) {
          group.remove();
        } else {
          let refresh = false;
          for (let i = 1; i < studyData.length; i++) {
            const el = group.children('a').eq(i - 1);
            if (!el.length) {
              refresh = true;
              break;
            }
            const sd = studyData[i];
            if (el.text() != sd.name || el.attr('href') != '/study/' + sd.id) {
              refresh = true;
              break;
            }
          }
          if (refresh) {
            group.empty();
            for (let i = 1; i < studyData.length; i++) {
              const sd = studyData[i];
              const u = sd.url || '/study/' + sd.id;
              $('<a>')
                .attr('href', u)
                .attr('title', trans.pluralSame('previousStudyTitle', sd.name))
                .text(sd.name)
                .appendTo(group);
            }
          }
        }
      } else {
        elem.remove();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('previousStudyMenu');
      this.logOption('Last study menu', value);
      this.options = { enabled: value };
      const lichess = lt.lichess;
      $('a.lichessTools-previousStudy').remove();
      lt.pubsub.off('lichessTools.redraw', this.updateStudy);
      if (value) {
        lt.pubsub.on('lichessTools.redraw', this.updateStudy);
        await this.updateStudy();
      }
    }

  }
  LiChessTools.Tools.PreviousStudyMenu = PreviousStudyMenuTool;
})();

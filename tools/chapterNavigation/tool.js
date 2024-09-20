(() => {
  class ChapterNavigationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'DetectThirdParties'];

    preferences = [
      {
        name: 'chapterNavigation',
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
        'options.chapterNavigation': 'Study chapter navigation controls',
        'chapterControlsTitle': 'LiChess Tools - chapter navigation'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterNavigation': 'Butoane navigare pentru capitole de studiu',
        'chapterControlsTitle': 'LiChess Tools - navigare capitole'
      }
    }

    refreshChapterControls = () => {
      const parent = this.lichessTools;
      const Math = parent.global.Math;
      const $ = parent.$;
      const study = parent.lichess.analysis?.study;
      if (!study) return;
      $('div.lichessTools-chapterControls div[data-id] > h3').each((i,e) => {
        e = $(e);
        if (e.is('.lichessTools-chapterNavigation-perc')) return;
        const text = e.text();
        const reg = /\s*\brnd:(?<perc>\d+(?:\.\d+)?)/;
        const match = reg.exec(text);
        if (match) {
          const perc = Math.round(+(match.groups.perc)*100)/100;
          e.empty()
            .addClass('lichessTools-chapterNavigation-perc')
            .append($('<span>').text(text.replace(reg,'')))
            .append($('<span class="perc">').text(perc+'%'));
        }
      });
      const selector = [];
      if (!$('div.study__side .study__chapters,aside.relay-tour__side .relay-games').length) return;
      const trans = parent.translator;
      const list = study.chapters.list.all();
      let container = $('div.study__side div[role="footer"],aside.relay-tour__side div[role="footer"]');
      if (!container.length && list.length > 1) {
        container = $(`<div role="footer">
          <button class="fbt" data-act="first" data-icon="&#x219E;"/>
          <button class="fbt" data-act="prev" data-icon="&#x2190;"/>
          <button class="fbt" data-act="random" data-icon="&#x21AF;"/>
          <button class="fbt" data-act="next" data-icon="&#x2192;"/>
          <button class="fbt" data-act="last" data-icon="&#x21A0;"/>
        </div>`)
          .on('click', this.actionChapterControls)
          .attr('title', trans.noarg('chapterControlsTitle'))
          .insertAfter('div.study__side .study__chapters,aside.relay-tour__side .relay-games');
        $('div.study__side,aside.relay-tour__side').addClass('lichessTools-chapterControls');
      }
      const chapterId = study.currentChapter()?.id;
      const index = chapterId
        ? list.findIndex(c => c.id == chapterId)
        : 0;
      $('button[data-act="first"]', container).toggleClass('disabled', index == 0);
      $('button[data-act="prev"]', container).toggleClass('disabled', index == 0);
      $('button[data-act="random"]', container).toggleClass('disabled', list.length == 1);
      $('button[data-act="next"]', container).toggleClass('disabled', index == list.length - 1);
      $('button[data-act="last"]', container).toggleClass('disabled', index == list.length - 1);
    };

    debouncedRefreshChapterControls = this.lichessTools.debounce(this.refreshChapterControls, 100);

    actionChapterControls = (ev) => {
      ev.preventDefault();
      const parent = this.lichessTools;
      const Math = parent.global.Math;
      const $ = parent.$;
      const study = parent.lichess.analysis?.study;
      if (!study) return;
      const chapterId = study.currentChapter()?.id;
      if (!chapterId) {
        parent.global.console.warn('Could not determine chapterId');
        return;
      }
      const list = study.chapters.list.all();
      let index = list.findIndex(c => c.id == chapterId);
      const act = $(ev.target).attr('data-act');
      switch (act) {
        case 'first': index = 0; break;
        case 'prev': index--; break;
        case 'random':
          let total = 0;
          let noPerc = 0;
          for (const s of list) {
            const match = /\brnd:(?<perc>\d+(?:\.\d+)?)/.exec(s.name);
            if (match) {
              s.perc = +(match.groups.perc);
              total += s.perc;
            } else {
              s.perc = undefined;
              noPerc++;
            }
          }
          const q = total>100 ? 100/total : 1;
          if (noPerc) {
            const def = (100-total*q)/noPerc;
            list.forEach(s=>{ s.perc = s.perc === undefined ? def : s.perc*q; });
          }
          let newIndex = index;
          while (newIndex == index) {
            let perc = Math.random()*100;
            for (let i=0; i<list.length; i++) {
              perc -= list[i].perc;
              if (perc<=0) {
                newIndex = i;
                break;
              }
            }
            if (!noPerc) break;
          }
          index = newIndex;
          break;
        case 'next': index++; break;
        case 'last': index = list.length - 1; break;
      }
      const chapter = list[index];
      if (chapter) study.setChapter(chapter.id);
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('chapterNavigation');
      this.logOption('Study chapter navigation', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lichess.pubsub.off('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
      lichess.pubsub.off('lichessTools.redraw', this.debouncedRefreshChapterControls);
      lichess.pubsub.off('chat.resize', this.debouncedRefreshChapterControls);
      $('div.study__side.lichessTools-chapterControls,aside.relay-tour__side.lichessTools-chapterControls')
        .removeClass('lichessTools-chapterControls')
        .find('div[role="footer"]')
        .remove();
      if (!value) return;
      lichess.pubsub.on('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
      lichess.pubsub.on('lichessTools.redraw', this.debouncedRefreshChapterControls);
      lichess.pubsub.on('chat.resize', this.debouncedRefreshChapterControls);
      this.refreshChapterControls();
    }

  }
  LiChessTools.Tools.ChapterNavigation = ChapterNavigationTool;
})();

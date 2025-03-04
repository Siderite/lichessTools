(() => {
  class ChapterNavigationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'DetectThirdParties'];

    preferences = [
      {
        name: 'chapterNavigation',
        category: 'study',
        type: 'multiple',
        possibleValues: ['controls', 'hideNextButton', 'subChapters'],
        defaultValue: 'controls,hideNextButton',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chapterNavigation': 'Study chapter navigation controls',
        'chapterControlsTitle': 'LiChess Tools - chapter navigation',
        'firstChapterTitle': 'First chapter',
        'prevChapterTitle': 'Previous chapter',
        'randomChapterTitle': 'Random chapter',
        'nextChapterTitle': 'Next chapter',
        'lastChapterTitle': 'Last chapter',
        'chapterNavigation.controls': 'Navigation controls',
        'chapterNavigation.hideNextButton': 'Hide next chapter button',
        'chapterNavigation.subChapters': 'Subchapters'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterNavigation': 'Butoane navigare pentru capitole de studiu',
        'chapterControlsTitle': 'LiChess Tools - navigare capitole',
        'firstChapterTitle': 'Primul capitol',
        'prevChapterTitle': 'Capitolul precedent',
        'randomChapterTitle': 'Un capitol la \u00eent\u00e2mplare',
        'nextChapterTitle': 'Urm\u0103torul capitol',
        'lastChapterTitle': 'Ultimul capitol',
        'chapterNavigation.controls': 'Controale navigare',
        'chapterNavigation.hideNextButton': 'Ascunde butonul pentru capitolul urm\u0103tor',
        'chapterNavigation.subChapters': 'Subcapitole'
      }
    }

    refreshChapterControls = () => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const $ = lt.$;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      let list = null;
      if (this.options.controls) {
        $('div.lichessTools-chapterControls button[data-id] > h3').each((i,e) => {
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
        const trans = lt.translator;
        list = study.chapters.list.all();
        let container = $('div.study__side div[role="footer"],aside.relay-tour__side div[role="footer"]');
        if (!container.length && list.length > 1) {
          container = $(`<div role="footer">
            <button class="fbt" data-act="first" data-icon="${lt.icon.toEntity(lt.icon.LeftwardsDoubleHeadedArrow)}"/>
            <button class="fbt" data-act="prev" data-icon="${lt.icon.toEntity(lt.icon.LeftwardsArrow)}"/>
            <button class="fbt" data-act="random" data-icon="${lt.icon.toEntity(lt.icon.DownwardsZigzagArrow)}"/>
            <button class="fbt" data-act="next" data-icon="${lt.icon.toEntity(lt.icon.RightwardsArrow)}"/>
            <button class="fbt" data-act="last" data-icon="${lt.icon.toEntity(lt.icon.RightwardsDoubleHeadedArrow)}"/>
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
        $('button[data-act="first"]', container)
          .attr('title', trans.noarg('firstChapterTitle'))
          .toggleClass('disabled', index == 0);
        $('button[data-act="prev"]', container)
          .attr('title', trans.noarg('prevChapterTitle'))
          .toggleClass('disabled', index == 0);
        $('button[data-act="random"]', container)
          .attr('title', trans.noarg('randomChapterTitle'))
          .toggleClass('disabled', list.length == 1);
        $('button[data-act="next"]', container)
          .attr('title', trans.noarg('nextChapterTitle'))
          .toggleClass('disabled', index == list.length - 1);
        $('button[data-act="last"]', container)
          .attr('title', trans.noarg('lastChapterTitle'))
          .toggleClass('disabled', index == list.length - 1);
      }

      $('main').toggleClassSafe('lichessTools-hideNextButton',this.options.hideNextButton);

      if (this.options.subChapters) {
        list ||= study.chapters.list.all();
        for (let i=0; i<list.length; i++) {
          const chapter = list[i];
          const next = list[i+1];
          const hasSubchapters = this.isSubChapter(next) && !this.isSubChapter(chapter);
          const el = $('.study__chapters button[data-id]').get().find(e=>$(e).attr('data-id') == chapter.id);
          let expander = $('.lichessTools-expander',el);
          if (hasSubchapters) {
            if (!expander.length) {
              expander = $('<div class="lichessTools-expander">')
                           .on('click',(ev)=>{
                             ev.preventDefault();
                             ev.stopPropagation();
                             this.expandChapter(chapter.id);
                           })
                           .insertBefore($('h3',el));
            }
          } else {
            expander.remove();
          }
        } 
      } else {
        $('.lichessTools-expander').remove();
        $('.lichessTools-collapsedChapter').removeClass('lichessTools-collapsedChapter');
        $('button[data-id].collapsed').removeClass('collapsed');
      }
    };
    debouncedRefreshChapterControls = this.lichessTools.debounce(this.refreshChapterControls, 100);

    isSubChapter = (chapterOrName)=>{
      const name = chapterOrName?.name || chapterOrName?.toString();
      if (!name) return false;
      return /^[\|\-\\]/.test(name);
    };

    expandChapter = (chapterId)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const chapterElems = $('.study__chapters button[data-id]').get();
      const index = chapterElems.findIndex(e=>$(e).attr('data-id')==chapterId);
      if (index<0) return;
      const el = chapterElems[index];
      const expander = $('.lichessTools-expander',el);
      const isCollapsed = !expander.is('.collapsed');
      expander.toggleClass('collapsed',isCollapsed);
      for (let i = index+1; i<chapterElems.length; i++) {
        const next = chapterElems[i];
        if (!this.isSubChapter($('h3',next).text())) break;
        $(next).toggleClass('lichessTools-collapsedChapter',isCollapsed);
      }
    };

    actionChapterControls = (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const $ = lt.$;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      const chapterId = study.currentChapter()?.id;
      if (!chapterId) {
        lt.global.console.warn('Could not determine chapterId');
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
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('chapterNavigation');
      this.logOption('Study chapter navigation', value);
      this.options = {
        controls: lt.isOptionSet(value, 'controls'),
        hideNextButton: lt.isOptionSet(value, 'hideNextButton'),
        subChapters: lt.isOptionSet(value, 'subChapters')
      };
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lt.pubsub.off('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
      lt.pubsub.off('lichessTools.redraw', this.debouncedRefreshChapterControls);
      lt.uiApi.events.off('chat.resize', this.debouncedRefreshChapterControls);
      $('.study__chapters').observer()
        .off('button[data-id]',this.debouncedRefreshChapterControls);
      $('div.study__side.lichessTools-chapterControls,aside.relay-tour__side.lichessTools-chapterControls')
        .removeClass('lichessTools-chapterControls')
        .find('div[role="footer"]')
        .remove();
      study.chapters.sort = lt.unwrapFunction(study.chapters.sort,'chapterNavigation');
      if (this.options.controls) {
        lt.pubsub.on('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
        lt.pubsub.on('lichessTools.redraw', this.debouncedRefreshChapterControls);
        lt.uiApi.events.on('chat.resize', this.debouncedRefreshChapterControls);
        $('.study__chapters').observer()
          .on('button[data-id]',this.debouncedRefreshChapterControls);
        study.chapters.sort = lt.wrapFunction(study.chapters.sort,{
          id: 'chapterNavigation',
          before: ($this,data)=>{
            const orig = $this.sort.__originalFunction.bind($this);
            const list = $this.list.all();
            const chapterElems = $('.study__chapters button[data-id]').get();
            const subMap = new Map();
            const allSubChapters = new Set();
            for (const id of data) {
              const subChapters = [];
              subMap.set(id,subChapters);
              const el = chapterElems.find(e=>$(e).attr('data-id')==id);
              if (!$('.lichessTools-expander',el).is('.collapsed')) {
                continue;
              }
              const index = list.findIndex(c=>c.id == id);
              for (let i=index+1; i<list.length; i++) {
                const next = list[i];
                if (!this.isSubChapter(next)) break;
                subChapters.push(next.id);
                allSubChapters.add(next.id);
              }
            }
            if (!allSubChapters.size) return;
            const newOrder = [];
            for (const id of data) {
              if (allSubChapters.has(id)) continue;
              newOrder.push(id);
              const subChapters = subMap.get(id);
              newOrder.push(...subChapters);
            }
            orig(newOrder);
            return false;
          }
        });
        this.refreshChapterControls();
      }
    }

  }
  LiChessTools.Tools.ChapterNavigation = ChapterNavigationTool;
})();

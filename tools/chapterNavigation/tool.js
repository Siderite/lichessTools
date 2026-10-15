(() => {
  class ChapterNavigationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'DetectThirdParties'];

    preferences = [
      {
        name: 'chapterNavigation',
        category: 'study',
        type: 'multiple',
        possibleValues: ['controls', 'hideNextButton', 'subChapters', 'panel'],
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
        'chapterNavigation.subChapters': 'Subchapters',
        'chapterNavigation.panel': 'Chapter overview panel',
        'chapterOverviewPanelTitle': 'LiChess Tools - chapter overview',
        'chapterOverviewPrevTitle': 'Show previous chapters',
        'chapterOverviewNextTitle': 'Show next chapters',
        'nextChapterButtonTitle': 'Next chapter'
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
        'chapterNavigation.subChapters': 'Subcapitole',
        'chapterNavigation.panel': 'Panou navigare capitole',
        'chapterOverviewPanelTitle': 'LiChess Tools - panou navigare capitole',
        'chapterOverviewPrevTitle': 'Afi\u0219eaz\u0103 capitolele anterioare',
        'chapterOverviewNextTitle': 'Afi\u0219eaz\u0103 capitolele urm\u0103toare',
        'nextChapterButtonTitle': 'Urm\u0103torul capitol'
      }
    }

    elemCache = { all:[], map:new Map() };
    panelWindowStart = null;
    lastPanelChapterId = null;
    panelDragPointerId = null;
    panelDragStartX = 0;
    panelDragStartY = 0;
    panelDragLastX = 0;
    panelDragActive = false;
    panelDragAccum = 0;
    panelDragThreshold = 40;
    panelDragStartThreshold = 10;

    getChapterElements = (chapterId, forced)=>{
      const lt = this.lichessTools;
      const $ = lt.$;

      const recreateCache = ()=>{
        this.elemCache.map.clear();
        this.elemCache.all = $('.study__chapters button[data-id]').get();
        for (const elem of this.elemCache.all) this.elemCache.map.set($(elem).attr('data-id'),elem);
      };

      if (forced===undefined) forced = !this.elemCache.all.length;
      if (forced===false) {
        for (const elem of this.elemCache.all) {
          if (!elem.isConnected) {
            return this.getChapterElements(chapterId, true);
          }
        }
        if (chapterId) {
          let elem = this.elemCache.map.get(chapterId);
          if (!elem) {
            recreateCache();
            elem = this.elemCache.map.get(chapterId);
          }
          return elem;
        } else {
          return this.elemCache.all;
        }
      }
      recreateCache();
      return this.getChapterElements(chapterId, false);
    };

    refreshChapterControlsDirect = () => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const $ = lt.$;
      const trans = lt.translator;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      let list = null;
      if (this.options.controls) {
        const chapterElems = this.getChapterElements();
        $(chapterElems).children('h3').each((i,e) => {
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
        let anchor = $('div.study__side .study__chapters,aside.relay-tour__side .vertical-resize').eq(0);
        if (!anchor.length) {
          anchor = $('aside.relay-tour__side .relay-games');
        }
        if (!anchor.length) return;
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
            .insertAfter(anchor);
          $('div.study__side,aside.relay-tour__side').addClass('lichessTools-chapterControls');
        }
        const chapterId = study.currentChapter()?.id;
        const index = chapterId
          ? list.findIndex(c => c.id == chapterId)
          : 0;
        $('button[data-act="first"]', container)
          .attr('title', trans.noarg('firstChapterTitle'))
          .toggleClassSafe('disabled', index == 0);
        $('button[data-act="prev"]', container)
          .attr('title', trans.noarg('prevChapterTitle'))
          .toggleClassSafe('disabled', index == 0);
        $('button[data-act="random"]', container)
          .attr('title', trans.noarg('randomChapterTitle'))
          .toggleClassSafe('disabled', list.length == 1);
        $('button[data-act="next"]', container)
          .attr('title', trans.noarg('nextChapterTitle'))
          .toggleClassSafe('disabled', index == list.length - 1);
        $('button[data-act="last"]', container)
          .attr('title', trans.noarg('lastChapterTitle'))
          .toggleClassSafe('disabled', index == list.length - 1);
      }

      const hasButton = !!$('.feedback.end button.next').length;
      $('main')
        .toggleClassSafe('lichessTools-hideNextButton',this.options.hideNextButton)
        .toggleClassSafe('lichessTools-hasNextButton',hasButton);
      if (this.options.hideNextButton) {
        let button = $('.gamebook .comment .lichessTools-nextChapter');
        if (hasButton && !button.length) {
          button = $('<a class="lichessTools-nextChapter">')
            .attr('title',trans.noarg('nextChapterButtonTitle'))
            .attr('data-icon',lt.icon.Forward)
            .on('click',ev=>{
              const chapterId = button.attr('data-chapter-id');
              if (!chapterId) return;
              ev.preventDefault();
              study.setChapter(chapterId);
            })
            .appendTo('.gamebook .comment');
        }
        let href = '#';
        let nextChapter = null;
        const chapterId = study.currentChapter()?.id;
        if (chapterId) {
          const list = study.chapters.list.all();
          const index = list.findIndex(c => c.id == chapterId);
          nextChapter = list[index+1];
          if (nextChapter) {
            href = `/study/${study.data.id}/${nextChapter.id}`;
          }
        }
        button
          .attrSafe('href', href)
          .attrSafe('data-chapter-id', nextChapter?.id || null);
      }

      if (this.options.panel) {
        list ||= study.chapters.list.all();
        this.refreshPanelDirect(list);
      } else {
        $('.lichessTools-chapterNavigation-panel').remove();
      }

      if (this.options.subChapters) {
        list ||= study.chapters.list.all();
        for (let i=0; i<list.length; i++) {
          const chapter = list[i];
          const next = list[i+1];
          const hasSubchapters = this.isSubChapter(next) && !this.isSubChapter(chapter);
          const chapterElem = this.getChapterElements(chapter.id);
          if (!chapterElem) continue;
          let expander = $('.lichessTools-expander',chapterElem);
          if (hasSubchapters) {
            if (!expander.length) {
              expander = $('<div class="lichessTools-expander">')
                           .on('click',(ev)=>{
                             ev.preventDefault();
                             ev.stopPropagation();
                             this.expandChapter(chapter.id);
                           })
                           .insertBefore($('h3',chapterElem));
              if (this.collapsedChapters.includes(chapter.id)) expander.trigger('click');
            }
          } else {
            expander.remove();
          }
        } 
      }
    };
    refreshChapterControls = this.lichessTools.debounce(this.refreshChapterControlsDirect, 100);

    isSubChapter = (chapterOrName)=>{
      const name = chapterOrName?.name || chapterOrName?.toString();
      if (!name) return false;
      return /^[\|\-\\]/.test(name);
    };

    expandChapter = (chapterId)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const chapterElems = this.getChapterElements();
      const chapterElem = this.getChapterElements(chapterId);
      if (!chapterElem) return;
      const index = chapterElems.indexOf(chapterElem);
      if (index<0) return;
      const expander = $('.lichessTools-expander',chapterElem);
      const isCollapsed = !expander.is('.collapsed');
      expander.toggleClassSafe('collapsed',isCollapsed);
      if (isCollapsed) {
        this.collapsedChapters.push(chapterId);
      } else {
        lt.arrayRemoveAll(this.collapsedChapters,x=>x==chapterId);
      }
      lt.storage.set('LiChessTools.collapsedChapters',this.collapsedChapters);
      for (let i = index+1; i<chapterElems.length; i++) {
        const next = chapterElems[i];
        if (!this.isSubChapter($('h3',next).text())) break;
        $(next).toggleClassSafe('lichessTools-collapsedChapter',isCollapsed);
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
            let perc = lt.random()*100;
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

    refreshPanelDirect = (list) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const $ = lt.$;
      const trans = lt.translator;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      const anchor = $('div.study__side .study__chapters,aside.relay-tour__side .vertical-resize').eq(0);
      const anchorEl = anchor.length ? anchor : $('aside.relay-tour__side .relay-games');
      if (!anchorEl.length) return;

      if (list.length <= 1) {
        $('.lichessTools-chapterNavigation-panel').remove();
        return;
      }

      const chapterId = study.currentChapter()?.id;
      if (chapterId !== this.lastPanelChapterId) {
        this.panelWindowStart = null;
        this.lastPanelChapterId = chapterId;
      }
      let currentIndex = chapterId ? list.findIndex(c => c.id == chapterId) : 0;
      if (currentIndex < 0) currentIndex = 0;

      let panel = $('.lichessTools-chapterNavigation-panel');
      if (!panel.length) {
        panel = $(`<div class="lichessTools-chapterNavigation-panel">
          <button type="button" class="arrow prev" data-act="prev"></button>
          <div class="window"></div>
          <button type="button" class="arrow next" data-act="next"></button>
        </div>`)
          .attr('title', trans.noarg('chapterOverviewPanelTitle'))
          .on('click', this.actionPanelControls)
          .insertBefore(anchorEl);
        panel.find('.window')
          .on('wheel', this.onPanelWheel)
          .on('pointerdown', this.onPanelPointerDown)
          .on('pointermove', this.onPanelPointerMove)
          .on('pointerup pointercancel', this.onPanelPointerUp);
      }

      const windowSize = Math.min(list.length, 6);
      let start = this.panelWindowStart ?? (currentIndex - Math.floor(windowSize / 2));
      start = Math.max(0, Math.min(start, list.length - windowSize));

      const chapters = $('<div class="chapters">');
      const end = Math.min(start + windowSize, list.length);
      chapters.append($('<span class="link edge left">')
        .toggleClassSafe('empty', start == 0));
      for (let i = start; i < end; i++) {
        const chapter = list[i];
        const isCurrent = i === currentIndex;
        const btn = $('<button type="button" class="chapter">')
          .attr('data-chapter-id', chapter.id)
          .attr('title', chapter.name)
          .text(i + 1);
        if (isCurrent) {
          btn.addClass('current');
        }
        chapters.append(btn);
        if (i < end - 1) {
          const link = $('<span class="link">');
          if (i === currentIndex) link.addClass('from-current');
          if (i + 1 === currentIndex) link.addClass('to-current');
          chapters.append(link);
        }
      }
      chapters.append($('<span class="link edge right">')
        .toggleClassSafe('empty', end >= list.length));
      panel.find('.window').empty().append(chapters);

      const canScroll = list.length > windowSize;
      panel.find('.arrow.prev')
        .attr('title', trans.noarg('chapterOverviewPrevTitle'))
        .toggleClassSafe('disabled', !canScroll || start == 0);
      panel.find('.arrow.next')
        .attr('title', trans.noarg('chapterOverviewNextTitle'))
        .toggleClassSafe('disabled', !canScroll || start == list.length - windowSize);
    };

    actionPanelControls = (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      const target = $(ev.target).closest('[data-act],[data-chapter-id]');
      if (!target.length) return;
      const act = target.attr('data-act');
      if (act == 'prev') {
        this.shiftPanelWindow(-1);
        return;
      }
      if (act == 'next') {
        this.shiftPanelWindow(1);
        return;
      }
      const id = target.attr('data-chapter-id');
      if (!id) return;
      const chapterId = study.currentChapter()?.id;
      const chapter = study.chapters.list.all().find(c => c.id == id);
      if (chapter && chapter.id !== chapterId) {
        study.setChapter(chapter.id);
      }
    };

    shiftPanelWindow = (delta) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      const list = study.chapters.list.all();
      const windowSize = Math.min(list.length, 6);
      if (list.length <= windowSize) return;
      const chapterId = study.currentChapter()?.id;
      let currentIndex = chapterId ? list.findIndex(c => c.id == chapterId) : 0;
      if (currentIndex < 0) currentIndex = 0;
      let start = this.panelWindowStart ?? (currentIndex - Math.floor(windowSize / 2));
      start = Math.max(0, Math.min(start, list.length - windowSize));
      const newStart = Math.max(0, Math.min(start + delta, list.length - windowSize));
      if (newStart === start) return;
      this.panelWindowStart = newStart;
      this.refreshPanelDirect(list);
    };

    onPanelWheel = (ev) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      const list = study.chapters.list.all();
      const windowSize = Math.min(list.length, 6);
      if (list.length <= windowSize) return;
      const delta = ev.deltaX !== 0 ? ev.deltaX : ev.deltaY;
      if (!delta) return;
      ev.preventDefault();
      this.shiftPanelWindow(delta > 0 ? 1 : -1);
    };

    onPanelPointerDown = (ev) => {
      this.panelDragPointerId = ev.pointerId;
      this.panelDragStartX = ev.clientX;
      this.panelDragStartY = ev.clientY;
      this.panelDragLastX = ev.clientX;
      this.panelDragActive = false;
      this.panelDragAccum = 0;
    };

    onPanelPointerMove = (ev) => {
      if (this.panelDragPointerId === null || ev.pointerId !== this.panelDragPointerId) return;
      const Math = this.lichessTools.global.Math;
      if (this.panelDragActive) {
        ev.preventDefault();
        const dx = ev.clientX - this.panelDragLastX;
        this.panelDragLastX = ev.clientX;
        this.panelDragAccum += dx;
        while (this.panelDragAccum >= this.panelDragThreshold) {
          this.panelDragAccum -= this.panelDragThreshold;
          this.shiftPanelWindow(-1);
        }
        while (this.panelDragAccum <= -this.panelDragThreshold) {
          this.panelDragAccum += this.panelDragThreshold;
          this.shiftPanelWindow(1);
        }
        return;
      }
      const dx = ev.clientX - this.panelDragStartX;
      const dy = ev.clientY - this.panelDragStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.panelDragStartThreshold) {
        this.panelDragActive = true;
        this.panelDragLastX = ev.clientX;
        this.panelDragAccum = dx;
        ev.currentTarget.setPointerCapture(ev.pointerId);
        ev.preventDefault();
      }
    };

    onPanelPointerUp = (ev) => {
      if (this.panelDragPointerId === null || ev.pointerId !== this.panelDragPointerId) return;
      this.panelDragPointerId = null;
      this.panelDragActive = false;
      this.panelDragAccum = 0;
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
        subChapters: lt.isOptionSet(value, 'subChapters'),
        panel: lt.isOptionSet(value, 'panel')
      };
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lt.pubsub.off('lichessTools.chapterChange', this.refreshChapterControls);
      lt.pubsub.off('lichessTools.redraw', this.refreshChapterControls);
      lt.uiApi.events.off('chat.resize', this.refreshChapterControls);
      $('.study__chapters').observer()
        .off('button[data-id]',this.refreshChapterControls);
      $('div.study__side.lichessTools-chapterControls,aside.relay-tour__side.lichessTools-chapterControls')
        .removeClass('lichessTools-chapterControls')
        .find('div[role="footer"]')
        .remove();

      $('.lichessTools-expander').remove();
      $('.lichessTools-collapsedChapter').removeClass('lichessTools-collapsedChapter');
      $('button[data-id].collapsed').removeClass('collapsed');
      $('.lichessTools-chapterNavigation-panel').remove();
      this.panelWindowStart = null;
      this.lastPanelChapterId = null;
      this.panelDragPointerId = null;
      this.panelDragActive = false;

      if (this.options.controls || this.options.subChapters || this.options.panel) {
        lt.pubsub.on('lichessTools.chapterChange', this.refreshChapterControls);
        lt.pubsub.on('lichessTools.redraw', this.refreshChapterControls);
        lt.uiApi.events.on('chat.resize', this.refreshChapterControls);
        $('.study__chapters').observer()
          .on('button[data-id], button[data-id] h3',this.refreshChapterControls);

        this.collapsedChapters = lt.storage.get('LiChessTools.collapsedChapters')||[];
        this.refreshChapterControlsDirect();
      }

      study.chapters.sort = lt.unwrapFunction(study.chapters.sort,'chapterNavigation');

      if (this.options.subChapters) {
        study.chapters.sort = lt.wrapFunction(study.chapters.sort,{
          id: 'chapterNavigation',
          before: ($this,data)=>{
            const orig = $this.sort.__originalFunction.bind($this);
            const list = $this.list.all();
            const chapterElems = this.getChapterElements();
            const subMap = new Map();
            const allSubChapters = new Set();
            for (const id of data) {
              const subChapters = [];
              subMap.set(id,subChapters);
              const el = this.getChapterElements(id);
              if (!el) continue;
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
      }
    }

  }
  LiChessTools.Tools.ChapterNavigation = ChapterNavigationTool;
})();

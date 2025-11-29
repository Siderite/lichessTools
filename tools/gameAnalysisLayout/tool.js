(() => {
  class GameAnalysisLayoutTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'gameAnalysisLayout',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['fitPage'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.gameAnalysisLayout': 'Layout for game analysis',
        'gameAnalysisLayout.fitPage': 'Fit page',
        'reviewTabText': 'Review',
        'reviewTabTitle': 'LiChess Tools - game review'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.gameAnalysisLayout': 'Aspectul analizei partidei',
        'gameAnalysisLayout.fitPage': 'Acoper\u0103 pagina',
        'reviewTabText': 'Revizuire',
        'reviewTabTitle': 'LiChess Tools - revizuire partid\u0103'
      }
    }

    isGame = ()=> {
      const lt = this.lichessTools;
      const $ = lt.$;
      return !!$('.analyse__side .game__meta').length;
    };

    handleGamePlayers =(pos)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const mainOffset = $('main').offset();
      $('body').css('--crosstable-x',(pos.x+pos.width-mainOffset.left)+'px');
      $('body').css('--crosstable-y',(pos.y+pos.height/2-mainOffset.top)+'px');
      const reverse = $('.game__meta__players .player.white a.user-link').attr('href')!=$('.ctable .crosstable__users a.user-link').eq(0).attr('href');
      $('.analyse__underboard .ctable').toggleClass('lichessTools-reverse',reverse);
    };

    toggleCrossTable = (ev)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      ev.preventDefault();
      $('.analyse__underboard .ctable').toggleClass('lichessTools-show');
    }

    clearCrossTable = ()=>{
      $('.analyse__underboard .ctable').removeClass('lichessTools-show');
    };

    setReviewTab = (ev)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      lichess.analysis?.chatCtrl?.setTab({key:'review'});
      lichess.analysis?.chatCtrl?.redraw();
    }

    applyLayout = ()=> {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const chat = lichess.analysis?.chatCtrl;
      if (!chat) return;

      const tab = chat.allTabs.find(t=>t.key=='review');
      $('.analyse__underboard .ctable .current,.analyse__underboard .ctable .current a')
        .off('click',this.toggleCrossTable);
      const body = $('body')[0];
      body.removeEventListener('pointerup',this.clearCrossTable, { capture: true });
      $('.computer-analysis form').off('submit',this.setReviewTab);

      if (this.options.fitPage) {
        if (!tab) {
          chat.allTabs.push({ key: 'review' });
          chat.redraw();
          $('.mchat__tab.review')
            .attr('title',trans.noarg('reviewTabTitle'))
            .text(trans.noarg('reviewTabText'));
          $('span[data-panel="move-times"]').trigger('mousedown');
          $('span[data-panel="computer-analysis"]').trigger('mousedown');
          this.tracker ||= new ElementPositionTracker($('.analyse__side .game__meta__players')[0],this.handleGamePlayers);
        }
        $('.analyse__underboard .ctable .current,.analyse__underboard .ctable .current a')
          .on('click',this.toggleCrossTable);
        body.addEventListener('pointerup',this.clearCrossTable, { capture: true });
        $('.computer-analysis form').on('submit',this.setReviewTab);
      } else {
        this.tracker?.stop();
        lt.arrayRemoveAll(chat.allTabs,t=>t.key=='review');
        chat.redraw();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('gameAnalysisLayout');
      this.logOption('Game analysis layout', value);
      this.options = {
        fitPage: lt.isOptionSet(value,'fitPage')
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis || !this.isGame()) return;
      $('body').toggleClassSafe('lichessTools-gameAnalysisLayout',this.options.fitPage);
      this.applyLayout();
    }

  }

class ElementPositionTracker {
  constructor(element, callback) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Valid DOM element required');
    }

    this.element = element;
    this.callback = callback;
    this.lastKnown = { x: -1, y: -1 };

    // Use rAF to batch updates and avoid layout thrashing
    this.rafId = null;

    this.start();
  }

  getPosition() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,     // pageX
      y: rect.top + window.scrollY,      // pageY
      width: rect.width,
      height: rect.height
    };
  }

  update = () => {
    this.rafId = null;

    const pos = this.getPosition();
    
    if (JSON.stringify(this.lastKnown)!=JSON.stringify(pos)) {
      this.lastKnown = pos;
      this.callback(pos);
    }
  };

  scheduleUpdate = () => {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.update);
    }
  };

  start() {
    this.update();

    // 1. Resize of the element itself
    this.resizeObserver = new ResizeObserver(this.scheduleUpdate);
    this.resizeObserver.observe(this.element);

    // 2. Mutations that could affect layout (attributes, children, character data)
    this.mutationObserver = new MutationObserver(this.scheduleUpdate);
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeOldValue: true,
      // Only observe attributes that actually affect layout
      attributeFilter: ['style', 'class', 'width', 'height']
    });

    // 3. Scroll (anywhere in the document)
    window.addEventListener('scroll', this.scheduleUpdate, { passive: true });

    // 4. Window resize (affects getBoundingClientRect)
    window.addEventListener('resize', this.scheduleUpdate, { passive: true });
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    window.removeEventListener('scroll', this.scheduleUpdate);
    window.removeEventListener('resize', this.scheduleUpdate);
  }
}

  LiChessTools.Tools.GameAnalysisLayout = GameAnalysisLayoutTool;
})();

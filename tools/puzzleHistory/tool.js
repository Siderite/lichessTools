(() => {
  class PuzzleHistoryTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitPuzzleChange']

    preferences = [
      {
        name: 'puzzleHistory',
        category: 'puzzles',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleHistory': 'Puzzle history',
        'showHistoryText': 'Puzzle history',
        'showHistoryTitle': 'LiChess Tools - puzzles you started on this device',
        'panelHeader-today': 'Today',
        'panelHeader-yesterday': 'Yesterday',
        'panelHeader-week': 'This week',
        'panelHeader-month': 'This month',
        'panelHeader-rest': 'The rest'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleHistory': 'Istoric pentru probleme de \u015fah',
        'showHistoryText': 'Istoric',
        'showHistoryTitle': 'LiChess Tools - probleme de \u015fah \u00eencepute pe acest dispozitiv',
        'panelHeader-today': 'Azi',
        'panelHeader-yesterday': 'Ieri',
        'panelHeader-week': 'S\u0103pt\u0103m\u00e2na aceasta',
        'panelHeader-month': 'Luna aceasta',
        'panelHeader-rest': 'Restul'
      }
    }

    isTrainingPage = ()=>{
      const lt = this.lichessTools;
      return /^\/training/i.test(lt.global.location.pathname) && !/^\/training\/(?:dashboard|themes)/.test(lt.global.location.pathname);
    };

    isPuzzleDashboardPage = ()=>{
      const lt = this.lichessTools;
      return /^\/training\/dashboard\/\d+\/dashboard/i.test(lt.global.location.pathname);
    };

    saveHistory = ()=>{
      if (!this._history) return;
      const lt = this.lichessTools;
      const Date = lt.global.Date;
      const now = Date.now();
      lt.storage.set('LiChessTools.puzzleHistory.log', this._history.filter(i=>now-i.start<90*86400000), { zip: true });
    };

    puzzleStart = (puzzleId)=>{
      if (!this._history) return;
      const lt = this.lichessTools;
      const last = this._history.at(-1);
      if (last?.puzzleId == puzzleId && !last.end) {
        this.puzzleInfo = last;
      } else {
        this.puzzleInfo = { puzzleId: puzzleId };
        this._history.push(this.puzzleInfo);
      }
      this.puzzleInfo.start = lt.global.Date.now();
    };

    puzzleEnd = (puzzleId)=>{
      const lt = this.lichessTools;
      this.puzzleInfo.end = lt.global.Date.now();
    };

    puzzleFail = (puzzleId)=>{
      const lt = this.lichessTools;
      this.puzzleInfo.fail = lt.global.Date.now();
    };

    populateDashboard = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const Date = lt.global.Date;
      const Math = lt.global.Math;
      const section = $('<section id="lichessTools-puzzleHistory">')
        .insertAfter('.puzzle-dashboard__global >:last-child');
      const container = $('<details>')
        .prop('open',true)
        .append($('<summary>')
                  .text(trans.noarg('showHistoryText'))
                  .attr('title',trans.noarg('showHistoryTitle'))
        )
        .appendTo(section);
      const today = Date.parse(new Date().toDateString());
      const panels = [];

      const getOrCreatePanel = (category,open) => {
        let panel = panels.find(p=>$(p).is('.lichessTools-history-'+category));
        if (!panel) {
          panel = $('<details class="lichessTools-history-'+category+'">')
            .prop('open',!!open)
            .append($('<summary>')
                      .text(trans.noarg('panelHeader-'+category))
            )
            .on('mouseleave',ev=>{
              lt.global.clearTimeout(this.popupTimeout);
              $('#puzzlePopup')
                .remove();
            })
            .prependTo(container);
          panels.push(panel);
        }
        return panel; 
      };

      const renderItem = (item) => {
        const puzzleId = item.puzzleId;
        const container = $('<div>');

        $('<div class="puzzle"><a href="/training/'+puzzleId+'" target="_blank">#'+puzzleId+'</a></div>')
          .toggleClass('fail',!!item.fail)
          .toggleClass('success',!item.fail && !!item.end)
          .on('click',ev=>{
            ev.preventDefault();
            lt.global.open('/training/'+puzzleId);
          })
          .on('mouseover',ev=>{
            const anc = $('a',ev.currentTarget);
            const offset = anc.offset();
            offset.left += anc.width() + 16;
            lt.global.clearTimeout(this.popupTimeout);
            this.popupTimeout = lt.global.setTimeout(()=>{
              let popup = $('#puzzlePopup');
              if (!popup.length) {
                popup = $('<div id="puzzlePopup">').appendTo('body');
              }
              popup
                .html('<img src="/training/export/gif/thumbnail/'+puzzleId+'.gif"/>')
                .css(offset);
            },500);
          })
          .appendTo(container);

        const timeText = new Date(item.start).toLocaleString();
        $('<div class="start">')
          .text(timeText)
          .appendTo(container);

        const duration = Math.round(((item.fail || item.end) - item.start)/1000);
        const durationText = duration || '';
        $('<div class="duration">')
          .text(durationText)
          .appendTo(container);
   
        return container;
      };

      for (const item of this._history) {
        const days = Math.ceil((today-item.start)/86400000);
        let panel;
        if (days<=0) {
          panel = getOrCreatePanel('today',true);
        } else
        if (days<=1) {
          panel = getOrCreatePanel('yesterday');
        } else
        if (days<7) {
          panel == getOrCreatePanel('week');
        } else
        if (days<30) {
          panel = getOrCreatePanel('month');
        } else {
          panel = getOrCreatePanel('rest');
        } 
        renderItem(item).insertAfter(panel.find('summary'));
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('puzzleHistory');
      this.logOption('Puzzle history', value);
      this.options = {
        enabled: !!value
      };
      lt.pubsub.off('lichessTools.puzzleStart',this.puzzleStart);
      lt.pubsub.off('lichessTools.puzzleEnd',this.puzzleEnd);
      lt.pubsub.off('lichessTools.puzzleFail',this.puzzleFail);
      lt.global.removeEventListener('beforeunload', this.saveHistory);
      if (this.options.enabled && this.isTrainingPage()) {
        this._history = lt.storage.get('LiChessTools.puzzleHistory.log', { zip: true }) || [];
        lt.pubsub.on('lichessTools.puzzleStart',this.puzzleStart);
        lt.pubsub.on('lichessTools.puzzleEnd',this.puzzleEnd);
        lt.pubsub.on('lichessTools.puzzleFail',this.puzzleFail);
        lt.global.addEventListener('beforeunload', this.saveHistory);
        if (!this.puzzleInfo) {
          const puzzleId = lt.getPuzzleId();
          if (puzzleId) {
            this.puzzleStart(puzzleId);
          }
        }
      }
      $('#lichessTools-puzzleHistory').remove();
      if (this.options.enabled && this.isPuzzleDashboardPage()) {
        this._history = lt.storage.get('LiChessTools.puzzleHistory.log', { zip: true }) || [];
        this.populateDashboard();
      }
    }

  }
  LiChessTools.Tools.PuzzleHistory = PuzzleHistoryTool;
})();

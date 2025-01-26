(() => {
  class QuickActionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitChapterChange'];

    preferences = [
      {
        name: 'quickActions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['flipBoard', 'requestAnalysis','emoji'],
        defaultValue: 'flipBoard,requestAnalysis,emoji',
        advanced: true
      }
    ];

    upgrades = [
      { name:'quickActions', value:'emoji', version: '2.3.199' }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.quickActions': 'Quick actions',
        'quickActions.flipBoard': 'Flip game board',
        'quickActions.requestAnalysis': 'Request server analysis',
        'quickActions.emoji': 'Chat emojis',
        'flipBoardButtonTitle': 'LiChess Tools - flip game board',
        'requestAnalysisButtonTitle': 'LiChess Tools - request server analysis'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.quickActions': 'Ac\u0163iuni rapide',
        'quickActions.flipBoard': 'Rotire tabl\u0103',
        'quickActions.requestAnalysis': 'Cerere analiz\u0103 server',
        'quickActions.emoji': 'Emoji \u00een chat',
        'flipBoardButtonTitle': 'LiChess Tools - roti\u0163i tabla',
        'requestAnalysisButtonTitle': 'LiChess Tools - cere\u0163i analiz\u0103 server'
      }
    }

    refreshTooltip = (ev)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const button = $('button.fbt[data-act="menu"],button.board-menu-toggle,.msg-app__convo__post__submit')[0];
      if (!button) return;
      const tooltip = $('.lichessTools-quickActions-tooltip');
      tooltip.css({ left: button.offsetLeft, top: button.offsetTop, width: button.offsetWidth });

      if (this.canFlip()) {
        if (!$('.flipBoard',tooltip).length) {
          $('<button class="fbt flipBoard">')
            .attr('data-icon',lt.icon.ChasingArrows)
            .attr('title',trans.noarg('flipBoardButtonTitle'))
            .on('click',(ev)=>{
              const handler = lt.getKeyHandler('f');
              if (handler) handler();
            })
            .appendTo(tooltip);
        }
      } else {
        $('.flipBoard',tooltip).remove();
      }

      if (this.canRequestAnalysis()) {
        if (!$('.requestAnalysis',tooltip).length) {
          $('<button class="fbt requestAnalysis">')
            .attr('data-icon',lt.icon.BarGraph)
            .attr('title',trans.noarg('requestAnalysisButtonTitle'))
            .on('click',(ev)=>{
              const serverEval = lt.lichess?.analysis?.study?.serverEval;
              if (serverEval) {
                if (!serverEval.requested && !serverVal?.root?.data?.analysis) {
                  serverEval.request();
                }
                $(ev.currentTarget).remove();
                return;
              }
              $('form.future-game-analysis').each((i,e)=>{
                $(e).trigger('submit');
                $(ev.currentTarget).remove();
              });
            })
            .appendTo(tooltip);
        }
      } else {
        $('.requestAnalysis',tooltip).remove();
      }

      if (this.canEmoji()) {
        if (!$('.emoji',tooltip).length) {
          [
            lt.icon.ThumbsUpSign,
            lt.icon.ThumbsDownSign,
            lt.icon.SlightlySmilyingFace,
            lt.icon.SlightlyFrowningFace,
            lt.icon.PoutingFace,
            lt.icon.SmilingFaceWithHorns,
            lt.icon.SparklingHeart
          ].forEach(icon=>{
            $('<button class="fbt emoji">')
              .attr('data-icon',icon)
              .on('click',(ev)=>{
                const input = $('.msg-app__convo__post__text');
                input.val(input.val()+icon);
              })
              .appendTo(tooltip);
          });
        }
      } else {
        $('.emoji',tooltip).remove();
      }
    }

    canEmoji = ()=>{
      if (!this.options.emoji) return false;
      const lt = this.lichessTools;
      const $ = lt.$;
      return $('.msg-app__convo__post__text').length;
    }

    canFlip = ()=>{
      if (!this.options.flipBoard) return false;
      const lt = this.lichessTools;
      return !!lt.getKeyHandler('f');
    }

    canRequestAnalysis = ()=>{
      if (!this.options.requestAnalysis) return false;
      const lt = this.lichessTools;
      const $ = lt.$;
      const serverEval = lt.lichess?.analysis?.study?.serverEval;
      if (serverEval && !serverEval.requested && !serverEval?.root?.data?.analysis) {
        return true;
      }
      return !!$('form.future-game-analysis').length
    }

    initQuickActions = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      let button = $('button.fbt[data-act="menu"], button.board-menu-toggle, button.msg-app__convo__post__submit');
      if (!button.length) return;
      button.off('mouseenter',this.refreshTooltip);
      if (this.options.isSet) {
        button.on('mouseenter',this.refreshTooltip);
        let tooltip = $('.lichessTools-quickActions-tooltip');
        if (!tooltip.length) {
          tooltip = $('<div class="lichessTools-quickActions-tooltip">')
            .insertAfter(button);
        }
        this.refreshTooltip();
      } else {
        $('.lichessTools-quickActions-tooltip').remove();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('quickActions');
      this.logOption('Quick actions', value);
      this.options = {
        flipBoard: lt.isOptionSet(value, 'flipBoard'),
        requestAnalysis: lt.isOptionSet(value, 'requestAnalysis'),
        emoji: lt.isOptionSet(value, 'emoji'),
        get isSet() { return this.flipBoard || this.requestAnalysis || this.emoji; }
      };
      const $ = lt.$;
      $('body')
       .observer()
       .off('button.fbt[data-act="menu"],button.board-menu-toggle,button.msg-app__convo__post__submit,.main-board cg-board,.msg-app__convo',this.initQuickActions);
      lt.pubsub.off('lichessTools.chapterChange',this.initQuickActions);
      this.initQuickActions();
      if (!this.options.isSet) return;
      lt.pubsub.on('lichessTools.chapterChange',this.initQuickActions);
      $('body')
       .observer('quickActions')
       .on('button.fbt[data-act="menu"],button.board-menu-toggle,button.msg-app__convo__post__submit,.main-board cg-board,.msg-app__convo',this.initQuickActions);
    }

  }
  LiChessTools.Tools.QuickActions = QuickActionsTool;
})();

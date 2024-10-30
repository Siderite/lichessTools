(() => {
  class NoSpoilersTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'noSpoilers',
        category: 'study',
        type: 'multiple',
        possibleValues: ['broadcast'],
        defaultValue: '',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.noSpoilers': 'No spoilers',
        'noSpoilers.broadcast': 'In broadcasts',
        'noSpoilersText': 'No spoilers',
        'noSpoilersTitle': 'LiChess Tools - hide scores'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.noSpoilers': 'F\u0103r\u0103 spoilere',
        'noSpoilers.broadcast': '\u00CEn transmisiuni',
        'noSpoilersText': 'F\u0103r\u0103 spoilere',
        'noSpoilersTitle': 'LiChess Tools - ascunde scorurile'
      }
    };

    setNoSpoilers = async (ev)=>{
      const lt = this.lichessTools;
      const value = !!ev.target.checked;
      lt.currentOptions['noSpoilers'] = value ? 'broadcast' : '';
      await lt.applyOptions(lt.currentOptions);
      lt.fireReloadOptions();
    };

    spoilerUi = ()=>{
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      const container = $('div.study__multiboard__options');
      if (!container.length) return;
      let toggle=$('label.lichessTools-noSpoilers',container);
      if (!toggle.length) {
        toggle = $('<label class="lichessTools-noSpoilers"><input type="checkbox"/><span></span></label>');
        toggle.find('input')
          .prop('checked',this.options.broadcast)
          .on('change',ev=>this.setNoSpoilers(ev));
        toggle.find('span')
          .text(trans.noarg('noSpoilersText'))
          .attr('title',trans.noarg('noSpoilersTitle'));
        toggle.appendTo(container);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('noSpoilers');
      this.logOption('No spoilers', value || 'no');
      this.options = {
        broadcast: lt.isOptionSet(value, 'broadcast')
      };
      $('body').toggleClass('lichessTools-noSpoilers-showBroadcast',!this.options.broadcast);
      lt.pubsub.off('lichessTools.redraw',this.spoilerUi);
      lt.pubsub.on('lichessTools.redraw',this.spoilerUi);
      lt.global.clearInterval(this.interval);
      this.interval = lt.global.setInterval(this.spoilerUi,1000);
      this.spoilerUi();
    }

  }
  LiChessTools.Tools.NoSpoilers = NoSpoilersTool;
})();

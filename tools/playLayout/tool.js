(()=>{
  class PlayLayoutTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'playLayout',
        category: 'play',
        type:'single',
        possibleValues: ['normal','noSide','smallSide','smallSideable'],
        defaultValue: 'normal'
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.playLayout': 'Play layout',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Hide left side',
        'playLayout.smallSide': 'Hide chat',
        'playLayout.smallSideable': 'Option to hide chat',
        'toggleLayoutTitle': 'LiChess Tools - click on the icon to hide/show chat'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.playLayout': 'Aranjament vizual',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Ascunde partea st\u00e2ng\u0103',
        'playLayout.smallSide': 'Ascunde chat',
        'playLayout.smallSideable': 'Op\u0163iune s\u0103 ascunzi chat',
        'toggleLayoutTitle': 'LiChess Tools - apas\u0103 pictograma ca s\u0103 ascunzi/ar\u0103\u0163i chat'
      }
    }

    toggleLayout=(ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (!$(ev.target).is('.game__meta__infos')) return;
      ev.preventDefault();
      switch(this.options.value) {
        case 'noSide':
          $('body').toggleClass('lichessTools-noSide');
          break;
        case 'smallSide':
        case 'smallSideable':
          $('body').toggleClass('lichessTools-smallSide');
          if (!$('body').is('lichessTools-smallSide')) {
            $('ol.mchat__messages li').addClass('read');
          }
          break;
      }
    };

    applyLayout=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      $('.playing main.round .game__meta__infos')
        .removeClass('lichessTools-pointer')
        .removeAttr('title')
        .off('click',this.toggleLayout);
      if (this.options.value!='normal') {
        $('.playing main.round .game__meta__infos')
          .addClass('lichessTools-pointer')
          .attr('title',trans.noarg('toggleLayoutTitle'))
          .on('click',this.toggleLayout);
      }
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('playLayout');
      this.options={ value: value };
      this.logOption('Play layout', value);
      this._control = $('main.round .game__meta__infos')[0];
      if (!this._control) return;
      $('body')
        .toggleClass('lichessTools-noSide',value=='noSide')
        .toggleClass('lichessTools-smallSide',value=='smallSide');
      parent.global.clearInterval(this.interval);
      if (value!='normal') {
        this.interval = parent.global.setInterval(()=>{
          const control=$('main.round .game__meta__infos')[0];
          if (this._control != control) {
            this._control = control;
            this.applyLayout();
          }
        },1000);
      }
      this.applyLayout();
    }

  }
  LiChessTools.Tools.PlayLayout=PlayLayoutTool;
})();

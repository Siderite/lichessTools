(()=>{
  class PlayLayoutTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'playLayout',
        category: 'play',
        type:'single',
        possibleValues: ['normal','noSide','smallSide'],
        defaultValue: 'normal'
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.playLayout': 'Play layout',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Hide left side',
        'playLayout.smallSide': 'Hide chat'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.playLayout': 'Aranjament vizual',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Ascunde partea st\u00e2ng\u0103',
        'playLayout.smallSide': 'Ascunde chat'
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
          $('body').toggleClass('lichessTools-smallSide');
          break;
      }
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('playLayout');
      this.options={ value: value };
      this.logOption('Play layout', value);
      $('body').toggleClass('lichessTools-noSide',value=='noSide');
      $('body').toggleClass('lichessTools-smallSide',value=='smallSide');
      $('main.round .game__meta__infos')
        .removeClass('lichessTools-pointer')
        .off('click',this.toggleLayout);
      if (value!='normal') {
        $('main.round .game__meta__infos')
          .addClass('lichessTools-pointer')
          .on('click',this.toggleLayout);
      }
    }

  }
  LiChessTools.Tools.PlayLayout=PlayLayoutTool;
})();

(()=>{
  class FixCoordsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'fixCoords',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.fixCoords': 'Fix board coordinate position'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.fixCoords': 'Repar\u0103 pozi\u0163ia coordonatelor tablei'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('fixCoords');
      this.logOption('Fix coordinates', value);
      if (!value) return;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const pref=analysis.data?.pref?.coords;
      $('body')
        .toggleClass('coords-in',pref==1)
        .toggleClass('coords-out',pref==2);
    }

  }
  LiChessTools.Tools.FixCoords=FixCoordsTool;
})();

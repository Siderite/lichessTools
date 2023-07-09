(()=>{
  class MobileShowGaugeTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'mobileShowGauge',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.mobileShowGauge': 'Show evaluation gauge on small width screens'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.mobileShowGauge': 'Arat\u0103 banda de evaluare pe ecrane cu l\u0103\u0163ime redus\u0103'
      }
    }
    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('mobileShowGauge');
      this.logOption('Eval gauge on mobile', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      $('main.analyse').toggleClass('lichessTools-gaugeOnMobile',value);
    }

  }
  LiChessTools.Tools.MobileShowGauge=MobileShowGaugeTool;
})();

(()=>{
  class MobileExperienceTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'mobileExperience',
        category: 'general',
        type:'multiple',
        possibleValues: ['showGauge','hideOctopus'],
        defaultValue: 'showGauge'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'General',
        'options.mobileExperience': 'Mobile device features',
        'mobileExperience.showGauge':'Show evaluation gauge on small screens',
        'mobileExperience.hideOctopus':'Hide the octopus mascot'
      },
      'ro-RO':{
        'options.analysis': 'General',                                                                     
        'options.mobileExperience': 'Op\u0163iuni pentru aparate mobile',
        'mobileExperience.showGauge':'Arat\u0103 banda de evaluare pe ecrane \u00eenguste',
        'mobileExperience.hideOctopus':'Ascunde mascota caracati\u0163a'
      }
    }

    handleRedraw=()=>{
      const lichess=parent.lichess;
      const $=parent.$;
      $('main.analyse').toggleClass('lichessTools-gaugeOnMobile',this.options.showGauge);
      $('main.analyse').toggleClass('lichessTools-hideOctopus',this.options.hideOctopus);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('mobileExperience');
      this.logOption('Mobile experience', value);
      this.options={
        showGauge:parent.isOptionSet(value,'showGauge'),
        hideOctopus:parent.isOptionSet(value,'hideOctopus'),
      };
      const lichess=parent.lichess;
      lichess.pubsub.off('redraw',this.handleRedraw);
      lichess.pubsub.off('chapterChange',this.handleRedraw);
      if (this.options.showGauge || this.options.hideOctopus) {
        lichess.pubsub.on('redraw',this.handleRedraw);
        lichess.pubsub.on('chapterChange',this.handleRedraw);
      }
    }

  }
  LiChessTools.Tools.MobileExperience=MobileExperienceTool;
})();

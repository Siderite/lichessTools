(()=>{
  class ObsIntegrationTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitChapterChange','EmitRedraw'];

    preferences=[
      {
        name:'obsIntegration',
        category: 'integration',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: false,
        hidden: false
      }
    ];

    intl={
      'en-US':{
        'options.integration': 'Integration',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)'
      },
      'ro-RO':{
        'options.integration': 'Integrare',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)'
      }
    }

    chapterChange=async (chapterId)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const study=analysis.study;
      if (!this.isBroadcast(study)) return;
      if (!this.optionsSet) {
        await parent.comm.send({ 
          type: 'setOptions',
          url:'ws://127.0.0.1:4455',
          password:'123456'
        });
        this.optionsSet=true;
      }
      await parent.comm.send({ 
        type: 'sceneChange',
        sceneName:Math.random()>0.5?'Scene 2':'Scene test'
      });
    };

    isBroadcast=(study)=>{
      return !!study?.topics?.getTopics()?.includes('Broadcast');
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!this.isBroadcast(analysis?.study)) return;
      const value=parent.currentOptions.getValue('obsIntegration');
      this.logOption('OBS Integration', value);
      lichess.pubsub.off('chapterChange',this.chapterChange);
      if (!value) return;
      lichess.pubsub.on('chapterChange',this.chapterChange);
    }

  }
  LiChessTools.Tools.ObsIntegration=ObsIntegrationTool;
})();

(()=>{
  class QuietModeAllTabsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'quietModeAllTabs',
        category: 'play',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.quietModeAllTabs': 'Quiet mode on all tabs'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.quietModeAllTabs': 'Mod silen\u0163ios \u00een toate taburile'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('quietModeAllTabs');
      this.logOption('Quiet mode all tabs', value);
      const lichess=parent.lichess;
      let quietMode=lichess.quietMode;
      if (quietMode) {
        parent.global.setTimeout(()=>{
          console.debug('Firing quiet mode event'); 
          lichess.storage.fire('lichessTools.quietMode','true');
        },500);
      }
      delete lichess.quietMode;
      lichess.quietMode=!!quietMode;
      this.quietModeHandler?.remove();
      if (!value) {
        return;
      }
      this.quietModeHandler=lichess.storage.make('lichessTools.quietMode').listen((ev) => {
        console.debug('Event quiet mode to ',ev.value); 
        quietMode=ev.value=='true';
      });
      Object.defineProperty(lichess,'quietMode',{
        get: ()=>quietMode,
        set: val=>{ 
          console.debug('Setting quiet mode to ',val); 
          quietMode=val;
          lichess.storage.fire('lichessTools.quietMode',`${!!val}`);
        }
      });
    }

  }
  LiChessTools.Tools.QuietModeAllTabs=QuietModeAllTabsTool;
})();

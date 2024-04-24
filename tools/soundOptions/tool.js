(()=>{
  class SoundOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'soundOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['noMove'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.soundOptions': 'Sound options',
        'soundOptions.noMove': 'No move sounds'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.soundOptions': 'Op\u0163iuni sunet',
        'soundOptions.noMove': 'F\u0103r\u0103 sunet la mutare'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const value=parent.currentOptions.getValue('soundOptions');
      this.logOption('Sound options', value);
      this.options={ 
        noMove: parent.isOptionSet(value,'noMove')
      };
      if (lichess.sound?.move) lichess.sound.move=parent.unwrapFunction(lichess.sound.move,'soundOptions');
      if (this.options.noMove) {
         if (lichess.sound?.move) lichess.sound.move=parent.wrapFunction(lichess.sound.move,{
           id: 'soundOptions',
           before: ($this,...args)=>{
             if (this.options.noMove) return false;
           }
         });
      }
    }

  }
  LiChessTools.Tools.SoundOptions=SoundOptionsTool;
})();

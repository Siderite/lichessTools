(()=>{
  class FixCoordsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'fixCoords',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['fix','larger'],
        defaultValue: 'fix',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.fixCoords': 'Fix board coordinate position',
        'fixCoords.fix': 'Fix outside coordinates',
        'fixCoords.larger': 'Larger coordinate font'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.fixCoords': 'Repar\u0103 pozi\u0163ia coordonatelor tablei',
        'fixCoords.fix': 'Repar\u0103 coordonatele in exterior',
        'fixCoords.larger': 'Font mai mare pentru coordonate'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('fixCoords');
      this.logOption('Fix coordinates', value);
      this.options={ 
        fix: parent.isOptionSet(value,'fix'),
        larger: parent.isOptionSet(value,'larger')
      };
      const body=$.cached('body');
      body
        .toggleClass('lichessTools-fixCoords-fix',this.options.fix)
        .toggleClass('lichessTools-fixCoords-larger',this.options.larger);
      const analysis=lichess?.analysis;
      if (this._init_in===undefined) this._init_in=body.is('.coords-in');
      if (this._init_out===undefined) this._init_out=body.is('.coords-out');
      if (this.options.fix && analysis) {
        const pref=analysis.data?.pref?.coords;
        if (pref) {
          body
            .toggleClass('coords-in',pref==1)
            .toggleClass('coords-out',pref==2);
        }
      } else {
        body
          .toggleClass('coords-in',this._init_in)
          .toggleClass('coords-out',this._init_out);
      }
    }

  }
  LiChessTools.Tools.FixCoords=FixCoordsTool;
})();

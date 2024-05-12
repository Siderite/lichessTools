(()=>{
  class ForkBehaviorTool extends LiChessTools.Tools.ToolBase {

    dependencies=['RandomVariation','EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'forkBehavior',
        category: 'analysis',
        type:'single',
        possibleValues: ['normal','chessbase'],
        defaultValue: 'normal',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.forkBehavior': 'Next move behavior for variations',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.chessbase': 'Force choice'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.forkBehavior': 'Comportament la mutare urm\u0103toare pentru varia\u0163iuni',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.chessbase': 'For\u0163eaz\u0103 alegere'
      }
    }

    bindFork=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      if (this.options.value=='chessbase') {
        if (!parent.isWrappedFunction(analysis.fork.proceed,'forkBehavior')) {
          let nextResult;
          analysis.fork.proceed=parent.wrapFunction(analysis.fork.proceed,{
            id: 'forkBehavior',
            before:($this,...args)=>{
              const nextMoves=parent.getNextMoves(analysis.node);
              if (nextMoves.length>1) {
                if (this.variationSelect!=analysis.path) {
                  this.variationSelect=analysis.path;
                  $('.analyse__tools').addClass('lichessTools-forkBehavior-chessbase');
                  nextResult=true;
                  return false;
                }
              }
              nextResult=undefined;
            },
            after:($this,result,...args)=>{
              return nextResult||result;
            }
          });
        }
        if (!parent.isWrappedFunction(analysis.jump,'forkBehavior')) {
          analysis.jump=parent.wrapFunction(analysis.jump,{
            id:'forkBehavior',
            after:($this,result,...args)=>{
              this.clearVariationSelect();
            }
          });
        }
      }
    };

    clearVariationSelect=()=>{
      this.variationSelect='unset';
      $('.analyse__tools').removeClass('lichessTools-forkBehavior-chessbase');
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('forkBehavior');
      this.logOption('Fork behavior', value);
      this.options={ value: value };
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      analysis.fork.proceed=parent.unwrapFunction(analysis.fork.proceed,'forkBehavior');
      lichess.pubsub.off('redraw',this.bindFork);
      lichess.pubsub.off('chapterChange',this.clearVariationSelect);
      this.clearVariationSelect();
      if (value=='chessbase') {
        lichess.pubsub.on('redraw',this.bindFork);
        this.bindFork();
        lichess.pubsub.on('chapterChange',this.clearVariationSelect);
      }
    }

  }
  LiChessTools.Tools.ForkBehavior=ForkBehaviorTool;
})();

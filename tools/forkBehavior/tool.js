(()=>{
  class ForkBehaviorTool extends LiChessTools.Tools.ToolBase {

    dependencies=['RandomVariation','EmitRedraw','EmitChapterChange','TranspositionBehavior'];

    preferences=[
      {
        name:'forkBehavior',
        category: 'analysis',
        type:'single',
        possibleValues: ['normal','hybrid','chessbase'],
        defaultValue: 'normal',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.forkBehavior': 'Next move behavior for variations',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.hybrid': 'Hybrid',
        'forkBehavior.chessbase': 'Force choice',
        'movesGroupLabel': 'Moves',
        'transposGroupLabel': 'Transpositions'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.forkBehavior': 'Comportament la mutare urm\u0103toare pentru varia\u0163iuni',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.hybrid': 'Hibrid',
        'forkBehavior.chessbase': 'For\u0163eaz\u0103 alegere',
        'movesGroupLabel': 'Mut\u0103ri',
        'transposGroupLabel': 'Transpozi\u0163ii'
      }
    }

    getMoveText=(move,isTranspo,length)=>{
      length=length||0;
      let result=Math.floor((move.ply+1)/2);
      if (!length||move.ply%2==1) {
        result+=move.ply%2==1?'.':'...';
      }
      result+=move.san;
      if (length<5 && move.children.length==1) {
        result+=' '+this.getMoveText(move.children[0],false,length+1);
      } else if (move.children.length) {
        result+=' \u2026';
      }
      return result;
    };

    showPopup=async (nextMoves,nextTranspos)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const hasTranspos=!!nextTranspos.length;
      const size=nextMoves.length+nextTranspos.length+(hasTranspos?2:0);
      let dlg=null;
      let selectElem=null;
      if ($('body').is('.mobile')) {
        selectElem=$('<ul>');
        let container=hasTranspos
          ? $('<ul>').text(trans.noarg('movesGroupLabel')).appendTo(selectElem)
          : selectElem;
        for (const move of nextMoves) {
          $('<li>')
            .attr('value',move.uci)
            .attr('fen',move.fen)
            .text(this.getMoveText(move, false))
            .appendTo(container);
        }
        if (hasTranspos) {
          container=$('<ul>').text(trans.noarg('transposGroupLabel')).appendTo(selectElem);
          for (const move of nextTranspos) {
            $('<li>')
              .attr('value',move.uci+' '+move.path)
              .attr('fen',move.fen)
              .text(this.getMoveText(move, true))
              .appendTo(container);
          }
        }
        dlg=parent.dialog({
          html: selectElem[0].outerHTML
        });
      } else {
        selectElem=$('<select>')
                      .attr('size',size);
        let container=hasTranspos
          ? $('<optgroup>').attr('label',trans.noarg('movesGroupLabel')).appendTo(selectElem)
          : selectElem;
        for (const move of nextMoves) {
          $('<option>')
            .attr('value',move.uci)
            .attr('fen',move.fen)
            .text(this.getMoveText(move, false))
            .appendTo(container);
        }
        if (hasTranspos) {
          container=$('<optgroup>').attr('label',trans.noarg('transposGroupLabel')).appendTo(selectElem);
          for (const move of nextTranspos) {
            $('<option>')
              .attr('value',move.uci+' '+move.path)
              .attr('fen',move.fen)
              .text(this.getMoveText(move, true))
              .appendTo(container);
          }
        }
        dlg=parent.dialog({
          html: selectElem[0].outerHTML+'<span class="dialog-actions"><button class="button submit">'+trans.noarg('OK')+'</button></span>'
        });
      }
      dlg.showModal();

      $(dlg)
        .on('close',()=>lichess.analysis.explorer.setHovering(lichess.analysis.node.fen,null))
        .addClass('lichessTools-forkBehavior-chessbase');
      selectElem=$('select,ul',dlg).eq(0);
      const makeMove=(ev)=>{
        ev?.preventDefault();
        const val=selectElem.val() || $(ev?.target).attr('value');
        if (!val) {
          return;
        }
        dlg.close();
        const [uci,path]=val.split(' ');
        if (path) {
          lichess.analysis.userJumpIfCan(path);
        } else {
          lichess.analysis.playUci(uci);
        }
        lichess.analysis.redraw();
      }
      const highlight=(ev)=>{
        const val=selectElem.val() || $(ev?.target).attr('value');
        if (!val) return;
        const [uci,path]=val.split(' ');
        lichess.analysis.explorer.setHovering(lichess.analysis.node.fen,uci);
        const state=lichess.analysis.fork?.state();
        if (!state?.displayed) return;
        const index=state.node.children.findIndex(c=>c.uci==uci);
        if (index<0 || state.selected==index) return;
        for (let i=state.selected; i<index; i++) lichess.analysis.fork.next();
        for (let i=state.selected; i>index; i--) lichess.analysis.fork.prev();
        lichess.analysis.setAutoShapes();
        lichess.analysis.redraw();
      };
      const mobileMakeMove=(ev)=>{
        ev?.preventDefault();
        const elem=$(ev?.target);
        if (!elem.length) return;
        if (!elem.is('.selected')) {
          $('li',selectElem).removeClass('selected');
          elem.addClass('selected');
          highlight(ev);
          return;
        }
        makeMove(ev);
      };
      $('button.submit',dlg).on('click',(ev)=>{
        ev.preventDefault();
        makeMove();
      });
      selectElem.on('change',highlight);
      selectElem.find('option')
        .on('mousedown',(ev)=>{ if (ev.button==0 && ev.target?.selected) makeMove(); })
        .on('dblclick',makeMove)
        .on('contextmenu',makeMove);
      selectElem.find('li')
        .on('click',mobileMakeMove);
      
      selectElem.each((i,e)=>{
        e.selectedIndex=0;
        e.focus();
      });
      selectElem.on('keydown',(ev)=>{
        if (ev.shiftKey || ev.altKey || ev.ctrlKey) return;
        switch(ev.key) {
          case 'ArrowRight':
          case 'Enter':
            ev.preventDefault();
            makeMove();
            break;
          case 'ArrowLeft':
            ev.preventDefault();
            dlg.close();
            break;
        };
      });
      highlight();
    };

    nextResult=false;
    bindFork=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      if (analysis.gamebookPlay() || parent.isGamePlaying()) return;
      if (['hybrid','chessbase'].includes(this.options.value)) {
        $('div.analyse__fork').each((i,e)=>{
          if (e.lichessTools_forkBehavior_init) return;
          e.lichessTools_forkBehavior_init=true;
          e.addEventListener('click',()=>this.inForkClick=true,{ capture: true });
          e.addEventListener('click',()=>this.inForkClick=false,{ capture: false });
        });
        if (!parent.isWrappedFunction(analysis.fork.proceed,'forkBehavior')) {
          analysis.fork.proceed=parent.wrapFunction(analysis.fork.proceed,{
            id: 'forkBehavior',
            before:($this,...args)=>{
              const nextMoves=parent.getNextMoves(analysis.node,true,false);
              const nextTranspos=parent.getNextMoves(analysis.node,false,true);
              const nextSans=nextMoves.concat(nextTranspos).map(m=>m.san);
              const noDuplicates=parent.transpositionBehavior?.groupSameMove;
              const nextSansCount=noDuplicates
                ? new Set(nextSans).size
                : nextSans.length;
              if (!this.inForkClick && nextSansCount>1) {
                switch(this.options.value) {
                  case 'hybrid':
                    if (this.variationSelect!=analysis.path) {
                      this.variationSelect=analysis.path;
                      $('.analyse__tools').addClass('lichessTools-forkBehavior-hybrid');
                      this.nextResult=true;
                      return false;
                    }
                    break;
                  case 'chessbase':
                    this.showPopup(nextMoves,nextTranspos);
                    this.nextResult=true;
                    return false;
                }
              }
              this.nextResult=undefined;
            },
            after:($this,result,...args)=>{
              return this.nextResult||result;
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
      $('.analyse__tools').removeClass('lichessTools-forkBehavior-hybrid');
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
      lichess.pubsub.off('lichessTools.redraw',this.bindFork);
      lichess.pubsub.off('lichessTools.chapterChange',this.clearVariationSelect);
      this.clearVariationSelect();
      if (['hybrid','chessbase'].includes(value)) {
        lichess.pubsub.on('lichessTools.redraw',this.bindFork);
        this.bindFork();
        lichess.pubsub.on('lichessTools.chapterChange',this.clearVariationSelect);
      }
    }

  }
  LiChessTools.Tools.ForkBehavior=ForkBehaviorTool;
})();

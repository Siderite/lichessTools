(()=>{
  class ExtendedInteractiveLessonTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange','RandomVariation','DetectThirdParties'];

    preferences=[
      {
        name:'extendedInteractiveLesson',
        category: 'study',
        type:'multiple',
        possibleValues: ['extendedInteractive','showFinalScore'],
        defaultValue: 'extendedInteractive,showFinalScore'
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.extendedInteractiveLesson': 'Extended interactive lessons',
        'extendedInteractiveLesson.extendedInteractive':'Play all variations',
        'extendedInteractiveLesson.showFinalScore':'Show score',
        'extendedInteractiveLesson': 'Extended Interactive lesson',
        'extendedInteractiveLessonLong': 'Extended Interactive lesson - LiChess Tools',
        'finalScore': 'Final score: %s%',
        'nextMovesCount': 'Make one of %s accepted moves',
        'nextMovesCount:one': 'Only one accepted move to make',
        'interactiveLessonsText': 'Interactive lessons',
        'addDeviationText':'Explain why other moves are wrong',
        'addDeviationTitle':'LiChess Tools - explain why moves from here not in the PGN are wrong'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.extendedInteractiveLesson': 'Lec\u0163ii interactive extinse',
        'extendedInteractiveLesson.extendedInteractive':'Joac\u0103 toate varia\u0163iunile',
        'extendedInteractiveLesson.showFinalScore':'Arat\u0103 scorul',
        'extendedInteractiveLesson': 'Lectie Interactiv\u0103 extins\u0103',
        'extendedInteractiveLessonLong': 'Lectie Interactiv\u0103 extins\u0103 - LiChess Tools',
        'finalScore': 'Scor final: %s%',
        'nextMovesCount': 'F\u0103 una din %s mut\u0103ri acceptate',
        'nextMovesCount:one': 'O singur\u0103 mutare de f\u0103cut',
        'interactiveLessonsText': 'Lec\u0163ii interactive',
        'addDeviationText':'Explic\u0103 de ce alte mut\u0103ri sunt gre\u015Fite',
        'addDeviationTitle':'LiChess Tools - explic\u0103 de ce mut\u0103ri de aici lips\u0103 din PGN sunt gre\u015Fite'
      }
    }

    extendedGamebook={
      goodMoves:0,
      badMoves:0,
      makeState:()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const $=parent.$;
        const trans=parent.translator;
        const $this=analysis.gamebookPlay();
        const node = analysis.node;
        if (!node.gamebook && !analysis.tree.root.gamebook) {
          // weird behavior after finishing a lesson and switching to analysis and back
          this.addGameBookToAllNodes();
        }
        const nodeComment = (node.comments || [])[0];
        const state = {
            init: analysis.path === '',
            comment: nodeComment?.text,
            showHint: false
        };
        const parPath = analysis.path.slice(0,-2);
        const parNode = analysis.tree.nodeAtPath(parPath);
        const inPgn = !!node.gamebook;
        const nextMoves=parent.getNextMoves(node);
        if (!inPgn) {
          state.feedback = 'bad';
          if (!state.comment) {
            state.comment = parNode.children[0].gamebook?.deviation;
          }
        } else if (!nextMoves.length) {
          state.feedback = 'end';
        } else if ($this.isMyMove()) {
          state.feedback = 'play';
          state.hint = node.gamebook?.hint;
          if (!state.hint) {
            const hint=trans.pluralSame('nextMovesCount',nextMoves.filter(c=>c.gamebook).length);
            state.hint=hint;
          }
        } else {
          state.feedback = 'good';
        }
        $this.state = state;
        if (!state.comment) {
          if (state.feedback === 'good') {
            parent.global.setTimeout($this.next, analysis.path ? 1000 : 300);
          }
          else if (state.feedback === 'bad') {
            parent.global.setTimeout($this.retry, 800);
          }
        }
      },
      retry: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const $this=analysis.gamebookPlay();
        const parPath = analysis.path.slice(0,-2);
        analysis.userJump(parPath);
    	$this.redraw();
      },
      next: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const $this=analysis.gamebookPlay();
        if (!$this) return;
        if (!$this.isMyMove()) {
          const child=parent.getRandomVariation(analysis.node);
          if (child) analysis.userJump(child.path||(analysis.path+child.id));
        } 
        $this.redraw();
      },
      solution: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const child=parent.getRandomVariation(analysis.node);
        if (child) {
          const shapes=[{
            orig:child.uci.slice(0,2),
            dest:child.uci.slice(2),
            brush:'green'
          }];
          if (child.promotion) {
            shapes.push({
              orig:child.uci.slice(2),
              piece: {
                color:analysis.turnColor(),
                role:child.promotion,
                scale: 0.8
              },
              brush: 'green'
            });
          }
          analysis.chessground.setShapes(shapes);
        }
      }
    };

    showScore=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      const trans=parent.translator;
      const gp=analysis.gamebookPlay();
      if (!this.options.showFinalScore) return;
      gp.goodMoves=+(gp.goodMoves)||0;
      gp.badMoves=+(gp.badMoves)||0;
      if (gp.goodMoves+gp.badMoves==0) return;
      const score = gp.goodMoves/(gp.goodMoves+gp.badMoves);
      const finalScoreText = trans.pluralSame('finalScore',Math.round(100*score));
      const el=$('<span/>').addClass('lichessTools-score').text(finalScoreText).attr('title',gp.goodMoves+'/'+gp.badMoves);
      parent.global.setTimeout(()=>$('div.gamebook .comment .content').append(el),100);
      gp.goodMoves=0;
      gp.badMoves=0;
    };

    replaceFunction=(func,newFunc,id)=>{
      const parent=this.lichessTools;
      return parent.wrapFunction(func,{
        id: id,
        before: ()=>false,
        after:($this,result,...args)=>{
          return newFunc(...args);
        }
      });
    };

    originalUserJump=null;
    patchGamebook=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      if (this.options.extendedInteractive && !gp.isExtendedInteractiveLessons) {
        gp.makeState=this.replaceFunction(gp.makeState,this.extendedGamebook.makeState,'extendedInteractiveLessons');
        gp.retry=this.replaceFunction(gp.retry,this.extendedGamebook.retry,'extendedInteractiveLessons');
        gp.next=this.replaceFunction(gp.next,this.extendedGamebook.next,'extendedInteractiveLessons');
        gp.solution=this.replaceFunction(gp.solution,this.extendedGamebook.solution,'extendedInteractiveLessons');
        gp.isExtendedInteractiveLessons=true;
        // stop the original setTimeout gp.next()
        if (!this.originalUserJump) this.originalUserJump=analysis.userJump; 
        if (analysis.node.path==='') {
          analysis.userJump=function() {};
          parent.global.setTimeout(()=>{
            analysis.userJump=this.originalUserJump;
            if (!gp.state.comment) gp.next();
          },analysis.path==''?1100:400);
        }
      } else if (!this.options.extendedInteractive && gp.isExtendedInteractiveLessons) {
        gp.makeState=parent.unwrapFunction(gp.makeState,'extendedInteractiveLessons');
        gp.retry=parent.unwrapFunction(gp.retry,'extendedInteractiveLessons');
        gp.next=parent.unwrapFunction(gp.next,'extendedInteractiveLessons');
        gp.solution=parent.unwrapFunction(gp.solution,'extendedInteractiveLessons');
        gp.isExtendedInteractiveLessons=true;
      }
      if (this.options.showFinalScore && !gp.isShowScore) {
        gp.makeState=parent.wrapFunction(gp.makeState,{
          id:'showScore',
          after: ($this, result, ...args)=>{
            gp.goodMoves=+(gp.goodMoves)||0;
            gp.badMoves=+(gp.badMoves)||0;
            const state=$this.state;
            switch(state.feedback) {
              case 'good':
                if (gp.askedForSolution) {
                  gp.badMoves++;
                } else {
                  gp.goodMoves++;
                }
              break;
              case 'bad':
                gp.badMoves++;
              break;
              case 'end':
                if (gp.askedForSolution) {
                  gp.badMoves++;
                } else {
                  gp.goodMoves++;
                }
              this.showScore();
            break;
          }
          gp.askedForSolution=false;
          }
        });
        gp.next=parent.wrapFunction(gp.next,{
          id:'showScore',
          before: ($this, ...args)=>{
            if (gp.root.node.path=='') {
              gp.goodMoves=0;
              gp.badMoves=0;
            }
          }
        });
        gp.solution=parent.wrapFunction(gp.solution,{
          id:'showScore',
          after: ($this, result, ...args)=>{
            gp.askedForSolution=true;
          }
        });
        gp.isShowScore=true;
      } else if (!this.options.showFinalScore && gp.isShowScore) {
        gp.makeState=parent.unwrapFunction(gp.makeState,'showScore');
        gp.next=parent.unwrapFunction(gp.next,'showScore');
        gp.solution=parent.unwrapFunction(gp.solution,'showScore');
        gp.isShowScore=false;
      }
    };

    addDeviation=()=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;
      const text=trans.noarg('addDeviationText');
      const node=analysis.tree.nodeAtPath(analysis.contextMenuPath);
      let gamebook=node.gamebook;
      if (!gamebook) {
        gamebook={};
        node.gamebook=gamebook;
      }
      const deviation = parent.global.prompt(text,gamebook.deviation);
      if (!deviation) return;
      gamebook.deviation=deviation;
      const chapterId=analysis.study.currentChapter().id;
      analysis.study.makeChange('setGamebook',{
        ch: chapterId,
        path: node.path,
        gamebook: gamebook
      });
      if (analysis.node===node) {
        $('div.gamebook-edit div.deviation textarea').val(deviation);
      }
    };

    alterUI=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;
      let translation=trans.noarg('extendedInteractiveLesson');
      $('.gamebook-buttons').attr('data-label',translation);
      translation=trans.noarg('extendedInteractiveLessonLong')
      $('button.preview').attr('data-label',translation);

      if (!this.options.extendedInteractive) return;
      const menu=$('#analyse-cm');
      if (!menu.length) return;
      if (!analysis?.study?.data?.chapter?.gamebook) return;
      if (menu.has('a[data-role="addDeviation"]').length) return;
      const text=trans.noarg('addDeviationText');
      const title=trans.noarg('addDeviationTitle');
      $('<a>')
        .attr('data-icon','\uE05E')
        .attr('data-role','addDeviation')
        .text(text).attr('title',title)
        .on('click',this.addDeviation)
        .appendTo(menu);
    };

    addGameBookToAllNodes=(node)=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      if (!this.options.extendedInteractive) return;
      if (!node) node=analysis.tree.root;
      node.gamebook=node.gamebook||{};
      if (!node.children) return;
      for (const child of node.children) {
        this.addGameBookToAllNodes(child);
      }
    };

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis?.study?.data?.chapter?.gamebook) return;
      const container=$('div.analyse__tools div.action-menu');
      if (!container.length) return;
      if (!$('.lichessTools-actionMenu').length) {
        const html=`<h2 class="lichessTools-actionMenu">$trans(interactiveLessonsText)</h2>
    <div class="setting abset-extendedInteractive" title="LiChess Tools - $trans(extendedInteractiveLesson.extendedInteractive)">
      <div class="switch">
        <input id="abset-extendedInteractive" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-extendedInteractive"></label>
      </div>
      <label for="abset-extendedInteractive">$trans(extendedInteractiveLesson.extendedInteractive)</label>
    </div>
    <div class="setting abset-showScore" title="LiChess Tools - $trans(extendedInteractiveLesson.showFinalScore)">
      <div class="switch">
        <input id="abset-showScore" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-showScore"></label>
      </div>
      <label for="abset-showScore">$trans(extendedInteractiveLesson.showFinalScore)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertBefore($('h2',container).eq(0));
        $('#abset-extendedInteractive,#abset-showScore')
          .on('change',()=>{
            const arr=[];
            const options=parent.currentOptions
            if ($('#abset-extendedInteractive').is(':checked')) arr.push('extendedInteractive');
            if ($('#abset-showScore').is(':checked')) arr.push('showFinalScore');
            options.extendedInteractiveLesson=arr.join(',');
            parent.applyOptions(options).then(()=>{
              lichess.storage.fire('lichessTools.reloadOptions');
            }).catch(e=>{ throw e; });
          });
      }
      $('#abset-extendedInteractive')
        .prop('checked',this.options.extendedInteractive);
      $('#abset-showScore')
        .prop('checked',this.options.showFinalScore);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extendedInteractiveLesson');
      this.logOption('Extended interactive lessons', value);
      const $=parent.$;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;
      this.options={
        showFinalScore:parent.isOptionSet(value,'showFinalScore'),
        extendedInteractive:parent.isOptionSet(value,'extendedInteractive')
      };
      $('body').toggleClass('lichessTools-extendedInteractiveLesson',this.options.extendedInteractive);
      if (!parent.isWrappedFunction(study.setGamebookOverride,'extendedInteractive')) {
        study.setGamebookOverride=parent.wrapFunction(study.setGamebookOverride,{
          id:'extendedInteractive',
          before:($this,o)=> {
            if (!o && !study.members.canContribute()) {
              o='play';
            }
            if (o=='play') {
              // fix lichess bug where entering Preview mode with engine on keeps engine running
              if (analysis.ceval.enabled()) {
                analysis.ceval.stop();
                analysis.ceval.isDeeper(false);
              }
              if (this.options.extendedInteractive) this.addGameBookToAllNodes();
            }
            // fix lichess bug with going to analysis after lesson finishes and showing the bad moves, too
            if (o=='analyse' && study.members.canContribute()) {
              const oldSetGamebookOverride=study.setGamebookOverride.__originalFunction;
              oldSetGamebookOverride();
            }
          },
          after:($this,result,o)=> {
            this.patchGamebook();
            analysis.redraw();
          }
        });
      }
      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.unwrapFunction(lichess.analysis.actionMenu.toggle,'extendedInteractiveLesson');
      lichess.analysis.actionMenu.toggle=lichessTools.wrapFunction(lichess.analysis.actionMenu.toggle,{
        id:'extendedInteractiveLesson',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();
      lichess.pubsub.off('redraw',this.alterUI);
      lichess.pubsub.off('chapterChange',this.patchGamebook);
      if (this.options.extendedInteractive) {
        lichess.pubsub.on('redraw',this.alterUI);
      }
      if (this.options.extendedInteractive||this.options.showFinalScore) {
        lichess.pubsub.on('chapterChange',this.patchGamebook);
      }
      this.patchGamebook();
    }
  }

  LiChessTools.Tools.ExtendedInteractiveLesson=ExtendedInteractiveLessonTool;
})();

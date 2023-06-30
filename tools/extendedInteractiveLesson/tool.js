(()=>{
  class ExtendedInteractiveLessonTool extends LiChessTools.Tools.ToolBase {

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
        'nextMovesCount:one': 'Only one accepted move to make'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.extendedInteractiveLesson': 'Lec\u0163ii interactive extinse',
        'extendedInteractiveLesson.extendedInteractive':'Joac\u0103 toate varia\u0163iunile',
        'extendedInteractiveLesson.showFinalScore':'Arat\u0103 scorul',
        'extendedInteractiveLesson': 'Lectie Interactiva extins\u0103',
        'extendedInteractiveLessonLong': 'Lectie Interactiva extins\u0103 - LiChess Tools',
        'finalScore': 'Scor final: %s%',
        'nextMovesCount': 'F\u0103 una din %s mut\u0103ri acceptate',
        'nextMovesCount:one': 'O singur\u0103 mutare de f\u0103cut'
      }
    }


    extendedGamebook={
      goodMoves:0,
      badMoves:0,
      showScore: ()=>{
        const parent=this.lichessTools;
        const trans=parent.translator;
        if (!this.options.showFinalScore) return;
        if (this.extendedGamebook.goodMoves+this.extendedGamebook.badMoves==0) return;
        const score = this.extendedGamebook.goodMoves/(this.extendedGamebook.goodMoves+this.extendedGamebook.badMoves);
        const finalScoreText = trans.pluralSame('finalScore',Math.round(100*score));
        const el=$('<span/>').addClass('lichessTools-score').text(finalScoreText).attr('title',this.extendedGamebook.goodMoves+'/'+this.extendedGamebook.badMoves);
        parent.global.setTimeout(()=>$('div.gamebook .comment .content').append(el),100);
        this.extendedGamebook.goodMoves=0;
        this.extendedGamebook.badMoves=0;
      },
      makeState:()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const $=parent.$;
        const trans=parent.translator;
        const $this=analysis.gamebookPlay();
        const node = analysis.node;
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
            if (state.feedback === 'good') parent.global.setTimeout($this.next, analysis.path ? 1000 : 300);
          else if (state.feedback === 'bad') parent.global.setTimeout($this.retry, 800);
        }
        switch(state.feedback) {
          case 'good':
            if (this.extendedGamebook.askedForSolution) {
              this.extendedGamebook.badMoves++;
            } else {
              this.extendedGamebook.goodMoves++;
            }
            break;
          case 'bad':
            this.extendedGamebook.badMoves++;
            break;
          case 'end':
            if (this.extendedGamebook.askedForSolution) {
              this.extendedGamebook.badMoves++;
            } else {
              this.extendedGamebook.goodMoves++;
            }
            $('.gamebook-buttons .lichessTools-recreatedSolution').remove();
            this.extendedGamebook.showScore();
          break;
        }
        this.extendedGamebook.askedForSolution=false;
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
          if (child) analysis.userJump(analysis.path+child.id);
        } 
        $this.redraw();
      },
      solution: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        this.extendedGamebook.askedForSolution=true;
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

    patchGamebook=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      if (this.options.extendedInteractive && !gp.extendedInteractiveLessons) {
        if (!gp.oldMakeState) gp.oldMakeState=gp.makeState;
        if (!gp.oldRetry) gp.oldRetry=gp.retry;
        if (!gp.oldNext) gp.oldNext=gp.next;
        if (!gp.oldSolution) gp.oldSolution=gp.solution;
        gp.makeState=this.extendedGamebook.makeState;
        gp.retry=this.extendedGamebook.retry;
        gp.next=this.extendedGamebook.next;
        gp.solution=this.extendedGamebook.solution;
        gp.extendedInteractiveLessons=true;
        // stop the original setTimeout gp.next()
        if (parent.clearLastTimeout) {
          parent.clearLastTimeout();
          parent.global.setTimeout(function() {
            if (!gp.state.comment) gp.next();
          },analysis.path==''?1000:300);
        } else {
          const tempJump = analysis.userJump;
          analysis.userJump=function() {};
          parent.global.setTimeout(function() {
            analysis.userJump=tempJump;
            if (!gp.state.comment) gp.next();
          },analysis.path==''?1000:300);
        }
      } else if (!this.options.extendedInteractive && gp.extendedInteractiveLessons) {
        gp.makeState=gp.oldMakeState;
        gp.retry=gp.oldRetry;
        gp.next=gp.oldNext;
        gp.redraw=gp.oldRedraw;
        gp.extendedInteractiveLessons=false;
      }
    };

    addCssLabels=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;
      const gp=analysis.gamebookPlay();
      let translation=trans.noarg('extendedInteractiveLesson');
      $('.gamebook-buttons').attr('data-label',translation);
      translation=trans.noarg('extendedInteractiveLessonLong')
      $('button.preview').attr('data-label',translation);
      if (!gp) return;
      const solutionButton=$('.gamebook-buttons .solution');
      if (solutionButton.length && !$('.gamebook-buttons .lichessTools-recreatedSolution').length) {
        parent.removeEventHandlers(solutionButton[0],'click');
        solutionButton
          .on('click',gp.solution);
      }
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

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.extendedInteractiveLesson;
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
      if (!parent.isWrappedFunction(study.setGamebookOverride)) {
        study.setGamebookOverride=parent.wrapFunction(study.setGamebookOverride,{
          before:($this,o)=> {
            if (!o && !study.members.canContribute()) {
              o='play';
            }
            if (o=='play') {
              this.extendedGamebook.goodMoves=0;
              this.extendedGamebook.badMoves=0;
              // fix lichess bug where entering Preview mode with engine on keeps engine running
              if (analysis.ceval.enabled()) {
                analysis.ceval.stop();
                analysis.ceval.isDeeper(false);
              }
              this.addGameBookToAllNodes();
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
        this.patchGamebook();
        lichess.pubsub.off('redraw',this.addCssLabels);
        lichess.pubsub.off('chapterChange',this.patchGamebook);
        if (this.options.extendedInteractive) {
          lichess.pubsub.on('redraw',this.addCssLabels);
          lichess.pubsub.on('chapterChange',this.patchGamebook);
        }
      }
    }
  }

  LiChessTools.Tools.ExtendedInteractiveLesson=ExtendedInteractiveLessonTool;
})();

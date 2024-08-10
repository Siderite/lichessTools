(()=>{
  class ExtendedInteractiveLessonTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange','RandomVariation','DetectThirdParties'];

    preferences=[
      {
        name:'extendedInteractiveLesson',
        category: 'study',
        type:'multiple',
        possibleValues: ['extendedInteractive','showFinalScore','alwaysShowScore','returnToPreview','fastInteractive','giveUpButton'],
        defaultValue: 'extendedInteractive,showFinalScore'
      },
      {
        name:'extendedInteractiveLessonFlow',
        category: 'study',
        type:'multiple',
        possibleValues: ['sequential','spacedRepetition'],
        defaultValue: false,
        advanced: true,
        wip: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.extendedInteractiveLesson': 'Extended interactive lessons',
        'extendedInteractiveLesson.extendedInteractive':'Play all variations',
        'extendedInteractiveLesson.showFinalScore':'Show final score',
        'extendedInteractiveLesson.alwaysShowScore':'Always show score',
        'extendedInteractiveLesson.returnToPreview':'Play again from where you entered Preview',
        'extendedInteractiveLesson.fastInteractive':'Fast interaction',
        'extendedInteractiveLesson.giveUpButton':'Give up button',
        'extendedInteractiveLesson': 'Extended Interactive lesson',
        'extendedInteractiveLessonLong': 'Extended Interactive lesson - LiChess Tools',
        'finalScore': 'Score final: %s%',
        'currentScore': 'Score so far: %s%',
        'nextMovesCount': 'Make one of %s accepted moves',
        'nextMovesCount:one': 'Only one accepted move to make',
        'interactiveLessonsText': 'Interactive lessons',
        'addDeviationText':'Explain why other moves are wrong',
        'addDeviationTitle':'LiChess Tools - explain why moves from here not in the PGN are wrong',
        'options.extendedInteractiveLessonFlow': 'Extended interactive lesson flow',
        'extendedInteractiveLessonFlow.sequential': 'Sequential',
        'extendedInteractiveLessonFlow.spacedRepetition': 'Spaced Repetition',
        'resetQuestionNoVariations': 'No more variations. Reset?',
        'resetQuestion': 'Reset variation progress?',
        'resetButtonText': 'Reset',
        'resetButtonTitle': 'LiChess Tools - reset variation progress',
        'progressTitle': 'LiChess Tools - %s variations',
        'extendedInteractiveOptionsTitle': 'LiChess Tools - interactive lesson preferences',
        'giveUpButtonText':'Give up',
        'giveUpButtonTitle':'Abandons the interactive run',
        'giveUpConfirmation':'Are you sure you want to abandon the interactive run?'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.extendedInteractiveLesson': 'Lec\u0163ii interactive extinse',
        'extendedInteractiveLesson.extendedInteractive':'Joac\u0103 toate varia\u0163iunile',
        'extendedInteractiveLesson.showFinalScore':'Arat\u0103 scorul final',
        'extendedInteractiveLesson.alwaysShowScore':'Arat\u0103 scorul tot timpul',
        'extendedInteractiveLesson.returnToPreview':'Joac\u0103 din nou de unde ai intrat \u00een Preview',
        'extendedInteractiveLesson.fastInteractive':'Interac\u0163iune rapid\u0103',
        'extendedInteractiveLesson.giveUpButton':'Buton renun\u0163are',
        'extendedInteractiveLesson': 'Lec\u0163ie Interactiv\u0103 extins\u0103',
        'extendedInteractiveLessonLong': 'Lec\u0163ie Interactiv\u0103 extins\u0103 - LiChess Tools',
        'finalScore': 'Scor final: %s%',
        'currentScore': 'Scor p\u00e2n\u0103 acum: %s%',
        'nextMovesCount': 'F\u0103 una din %s mut\u0103ri acceptate',
        'nextMovesCount:one': 'O singur\u0103 mutare de f\u0103cut',
        'interactiveLessonsText': 'Lec\u0163ii interactive',
        'addDeviationText':'Explic\u0103 de ce alte mut\u0103ri sunt gre\u015Fite',
        'addDeviationTitle':'LiChess Tools - explic\u0103 de ce mut\u0103ri de aici lips\u0103 din PGN sunt gre\u015Fite',
        'options.extendedInteractiveLessonFlow': 'Cursul lec\u0163iilor interactive extinse',
        'extendedInteractiveLessonFlow.sequential': 'Secven\u0163ial',
        'extendedInteractiveLessonFlow.spacedRepetition': 'Repeti\u0163ie distan\u0163at\u0103',
        'resetQuestionNoVariations': 'Nu mai sunt varia\u0163uni. Resetez?',
        'resetQuestion': 'Resetez progresul \u00een varia\u0163uni?',
        'resetButtonText': 'Resetare',
        'resetButtonTitle': 'LiChess Tools - resetare progres \u00een varia\u0163uni',
        'progressTitle': 'LiChess Tools - %s varia\u0163uni',
        'extendedInteractiveOptionsTitle': 'LiChess Tools - preferin\u0163e lec\u0163ie interactiv\u0103',
        'giveUpButtonText':'Renun\u0163',
        'giveUpButtonTitle':'Abandoneaz\u0103 lec\u0163ia interactiv\u0103',
        'giveUpConfirmation':'E\u015Fti sigur ca vrei sa abandonezi lec\u0163ia interactiv\u0103?'
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
        const gp=analysis.gamebookPlay();
        const node = analysis.node;
        const nodeComment = (node.comments || [])[0];
        const state = {
            init: analysis.path === '',
            comment: nodeComment?.text,
            showHint: false,
            isNavigateBack: gp.path?.length>analysis.path?.length && gp.path.startsWith(analysis.path)
        };
        gp.path = analysis.path;

        if (state.init || gp.state?.init) {
          gp.resetStats();
          if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
            gp.currentPath=this.getCurrentPath();
            if (!gp.currentPath) {
              const nextMoves=parent.getNextMoves(node,gp.threeFoldRepetition)
                                    .filter(c=>this.isPermanentNode(c));
              if (nextMoves.length) {
                if (parent.global.confirm(trans.noarg('resetQuestionNoVariations'))) {
                  this.resetDone();
                  return gp.makeState();
                } else {
                  analysis.path='x'; // needed for Play again to work
                  state.feedback='end';
                  gp.state=state;
                  return;
                }
              }
            }
          }
        }
        const parPath = analysis.path.slice(0,-2);
        const parNode = analysis.tree.nodeAtPath(parPath);
        const isAcceptedMove = this.isPermanentNode(node) && (!(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(analysis.path));
        if (!isAcceptedMove) {
          const position=parent.getNodePosition(node);
          const candidate=parent.getNextMoves(parNode,gp.threeFoldRepetition)
                                .filter(c=>this.isPermanentNode(c))
                                .filter(c=>!(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(c.path))
                                .find(c=>parent.getNodePosition(c)==position);
          if (candidate) {
            if (candidate.path!==undefined) {
              analysis.userJump(candidate.path);
              return this.extendedGamebook.makeState();
            } else {
              parent.global.console.warn('Node has no path',candidate);
            }
          }
        }
        const nextMoves=parent.getNextMoves(node,gp.threeFoldRepetition)
                                     .filter(c=>this.isPermanentNode(c))
                                     .filter(c=>!(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(c.path));
        if (!isAcceptedMove) {
          state.feedback = 'bad';
          if (!state.comment) {
            state.comment = parNode.children[0].gamebook?.deviation;
          }
        } else if (!nextMoves.length) {
          state.feedback = 'end';
          this.markPathFinished(analysis.path,gp.goodMoves+(gp.isMyMove()?0:1),gp.badMoves,gp.askedForSolution);
        } else if (gp.isMyMove()) {
          state.feedback = 'play';
          state.hint = node.gamebook?.hint;
          const nextMovesCount=new Set(nextMoves.map(c=>c.uci)).size;
          if (!state.hint) {
            const hint=trans.pluralSame('nextMovesCount',nextMovesCount);
            state.hint=hint;
          }
          parent.global.setTimeout(()=>
            $('button.hint')
              .attr('data-count',nextMovesCount)
              .addClass('data-count')
          ,1);
        } else {
          state.feedback = 'good';
        }
        gp.state = state;
        if (!state.comment) {
          let func=null;
          let delay=0;
          switch (state.feedback) {
            case 'good': 
              func=gp.next; 
              delay=300;
              break;
            case 'bad': 
              func=gp.retry; 
              delay=analysis.path ? 1000 : 800;
              break;
          }
          if (!state.isNavigateBack && !gp.isMyMove() && func && this.options.fastInteractive) {
            delay=50;
            const oldFunc=func;
            func=()=> {
              oldFunc();
              $('div.gamebook .comment')
                .removeClass('good bad')
                .addClass(state.feedback);
            };
          }
          if (func) {
            parent.global.setTimeout(func, delay);
          }
        } else {
          $('div.gamebook .comment')
            .removeClass('good bad');
        }
      },
      retry: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const gp=analysis.gamebookPlay();
        if (analysis.path==='') {
          gp.makeState();
        } else {
          const parPath = analysis.path.slice(0,-2);
          const count=+gp.fens[analysis.node.fen]||0;
          if (count==3) {
            gp.threeFoldRepetition=false;
          }
          gp.fens[analysis.node.fen]=Math.max(0,count-1);
          analysis.userJump(parPath);
        }
    	gp.redraw();
      },
      next: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const gp=analysis.gamebookPlay();
        if (!gp) return;
        if (!gp.isMyMove()) {
          let child=null;
          if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
            const childPath=gp.currentPath.slice(0,analysis.path.length+2);
            if (childPath.length==analysis.path.length+2) child=analysis.tree.nodeAtPath(childPath);
          } else {
            child=parent.getRandomVariation(analysis.node,gp.threeFoldRepetition);
          }
          if (child) {
            analysis.userJump(child.path||(analysis.path+child.id));
            const count=(+gp.fens[analysis.node.fen]||0)+1;
            gp.fens[analysis.node.fen]=count;
            if (count>=3) {
              gp.threeFoldRepetition=true;
            }
          }
        } 
        gp.redraw();
      },
      solution: ()=>{
        const parent=this.lichessTools;
        const analysis=parent.lichess.analysis;
        const gp=analysis.gamebookPlay();
        let children=parent.getNextMoves(analysis.node,gp.threeFoldRepetition).filter(c=>this.isPermanentNode(c));
        if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
          children=children.filter(c=>this.inCurrentPath(c.path));
        }
        if (!children) return;
        const shapes=[];
        for (const child of children) {
          shapes.push({
            orig:child.uci.slice(0,2),
            dest:child.uci.slice(2,4),
            brush:'green'
          });
          if (child.promotion) {
            shapes.push({
              orig:child.uci.slice(2,4),
              piece: {
                color:analysis.turnColor(),
                role:child.promotion,
                scale: 0.8
              },
              brush: 'green'
            });
          }
        }
        analysis.chessground.setShapes(shapes);
      },
      resetStats: function() {
        const gp=this;
        gp.goodMoves=0;
        gp.badMoves=0;
        gp.threeFoldRepetition=false;
        gp.fens={};
      }
    };

    getCurrentPath=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,{});
      }
      const key=analysis.study.data.id+'/'+analysis.study.currentChapter()?.id;
      let paths=this._paths[key];
      if (!paths) {
        paths={};
        this._paths[key]=paths;
      }
      if (paths.currentPath && !this.isDonePath(paths.currentPath)) return paths.currentPath;
      if (!this.options.flow.sequential&&!this.options.flow.spacedRepetition) return;
      const currentPaths=[];
      const traverse=(node,path)=>{
        if (this.options.flow.sequential && currentPaths.length) return;
        const nextMoves=node.children
                              .filter(c=>this.isPermanentNode(c));
        if (!nextMoves.length && !this.isDonePath(path)) {
          currentPaths.push(path);
        }
        for (const child of nextMoves) traverse(child,path+child.id);
      };
      traverse(analysis.tree.root,'');
      const i = Math.floor(parent.random() * currentPaths.length);
      paths.currentPath=currentPaths[i];
      lichess.storage.set('LichessTools.chapterPaths',JSON.stringify(this._paths));
      return paths.currentPath;
    };

    inCurrentPath=(path)=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      return gp.currentPath?.startsWith(path);
    };

    markPathFinished=(path,goodMoves,badMoves,askedForSolution)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      const key=analysis.study.data.id+'/'+analysis.study.currentChapter()?.id;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,{});
      }
      const paths=this._paths[key] || {};
      const success = badMoves==0 && !askedForSolution && goodMoves>=Math.floor(path.length/4);
      const item=paths[path] || { path };
      item.time=Date.now();
      item.success=success;
      if (!item.interval) item.interval=1;
      if (success) {
        item.interval=2;
      } else {
        item.interval/=2;
      }
      paths[path]=item;

      const traverse=(node)=>{
        const nextMoves=node.children
                              .filter(c=>this.isPermanentNode(c));
        if (!nextMoves.length) {
          if (!paths[node.path]) {
            paths[node.path]={ path:node.path, interval:0, time:Date.now(), success: false };
          }
        }
        for (const child of nextMoves) traverse(child);
      };
      traverse(analysis.tree.root);

      this._paths[key]=paths;
      lichess.storage.set('LichessTools.chapterPaths',JSON.stringify(this._paths));
      this.refreshChapterProgress();
    };

    isDonePath=(path)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,null);
      }
      if (!this._paths) return false;
      const analysis=lichess.analysis;
      const key=analysis.study.data.id+'/'+analysis.study.currentChapter()?.id;
      const paths=this._paths[key];
      if (!paths) return;
      const item=paths[path];
      if (this.options.flow.spacedRepetition) {
        return item && Date.now()<item.time+item.interval*86400000;
      } else {
        return item?.success;
      }
    };

    resetDone=(chapterId)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,null);
      }
      if (!this._paths) return false;
      const analysis=lichess.analysis;
      chapterId=chapterId || analysis.study.currentChapter()?.id
      const key=analysis.study.data.id+'/'+chapterId;
      this._paths[key]=null;
      lichess.storage.set('LichessTools.chapterPaths',JSON.stringify(this._paths));
      this.refreshChapterProgress();
      return true;
    };

    showGiveUpButton=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const container = $('.gamebook .comment');
      if (!container.length || $('.lichessTools-giveUp',container).length) return;
      $('<button class="lichessTools-giveUp">')
        .text(trans.noarg('giveUpButtonText'))
        .attr('title',trans.noarg('giveUpButtonTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          parent.global.setTimeout(()=>{
            if (!parent.global.confirm(trans.noarg('giveUpConfirmation'))) return;
            const gp=parent.lichess.analysis.gamebookPlay();
            gp.state.feedback='end';
            gp.badMoves++;
            gp.redraw();
            gp.state.feedback=undefined;
          },1);
        })
        .appendTo(container);
    };

    showScore=(isFinal)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const Math=parent.global.Math;
      const analysis=parent.lichess.analysis;
      const trans=parent.translator;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      if (!this.options.showFinalScore && !this.options.alwaysShowScore) return;
      gp.goodMoves=+(gp.goodMoves)||0;
      gp.badMoves=+(gp.badMoves)||0;
      if (gp.goodMoves+gp.badMoves==0) return;
      const score = gp.goodMoves/(gp.goodMoves+gp.badMoves);
      const scoreText = trans.pluralSame(isFinal?'finalScore':'currentScore',Math.round(100*score));
      const scoreRating=score>0.90?4:score>0.75?3:score>0.50?2:1;
      const el=$('<span/>')
        .addClass('lichessTools-score')
        .addClass('lichessTools-score'+scoreRating)
        .text(scoreText)
        .attr('title',gp.goodMoves+' | '+gp.badMoves);
      const f=()=>{
        const container = $('div.gamebook .comment .content');
        if (!container.length) {
          parent.global.setTimeout(f,100);
          return;
        }
        container.find('.lichessTools-score').remove();
        container.append(el);
      };
      f();
      if (isFinal) gp.resetStats();
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
      if (analysis.study?.practice) return;
      const gp=analysis.gamebookPlay();
      if (!gp) return;
      if (this.options.extendedInteractive && !gp.isExtendedInteractiveLessons) {
        gp.makeState=this.replaceFunction(gp.makeState,this.extendedGamebook.makeState,'extendedInteractiveLessons');
        gp.retry=this.replaceFunction(gp.retry,this.extendedGamebook.retry,'extendedInteractiveLessons');
        gp.next=this.replaceFunction(gp.next,this.extendedGamebook.next,'extendedInteractiveLessons');
        gp.solution=this.replaceFunction(gp.solution,this.extendedGamebook.solution,'extendedInteractiveLessons');
        gp.isExtendedInteractiveLessons=true;
        gp.fens={};
        gp.resetStats=this.extendedGamebook.resetStats;
        // stop the original setTimeout gp.next()
        if (!this.originalUserJump) this.originalUserJump=analysis.userJump; 
        if (analysis.node.id==='') {
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
      if ((this.options.showFinalScore || this.options.alwaysShowScore) && !gp.isShowScore) {
        gp.fens={};
        gp.resetStats=this.extendedGamebook.resetStats;
        gp.makeState=parent.wrapFunction(gp.makeState,{
          id:'showScore',
          after: ($this, result, ...args)=>{
            // fix lichess bug where entering Preview mode keeps using Explorer endpoints in the background
            if (this.explorerEnabled===undefined) {
              this.explorerEnabled=analysis.explorer.enabled();
            }
            if (this.explorerEnabled) {
              analysis.explorer.enabled(false);
            }
            gp.goodMoves=+(gp.goodMoves)||0;
            gp.badMoves=+(gp.badMoves)||0;
            const state=$this.state;
            if (state.isNavigateBack) return;
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
              break;
            }
            gp.askedForSolution=false;
          }
        });
        gp.redraw=parent.wrapFunction(gp.redraw,{
          id:'showScore',
          after:($this,results,...args)=>{
            if (gp.state.feedback=='end' && this.options.showFinalScore) {
                this.showScore(true);
              } else 
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
            if (this.options.giveUpButton && gp.state.feedback!='end') {
              this.showGiveUpButton();
            }
          }
        });
        gp.next=parent.wrapFunction(gp.next,{
          id:'showScore',
          before: ($this, ...args)=>{
            if (gp.root.node.id=='') {
              gp.resetStats();
            }
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.retry=parent.wrapFunction(gp.retry,{
          id:'showScore',
          after: ($this, result, ...args)=>{
            if (gp.root.node.id=='') {
              gp.resetStats();
            }
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.solution=parent.wrapFunction(gp.solution,{
          id:'showScore',
          after: ($this, result, ...args)=>{
            gp.askedForSolution=true;
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.isShowScore=true;
        gp.redraw();
      } else if (!this.options.showFinalScore && gp.isShowScore) {
        gp.makeState=parent.unwrapFunction(gp.makeState,'showScore');
        gp.next=parent.unwrapFunction(gp.next,'showScore');
        gp.retry=parent.unwrapFunction(gp.retry,'showScore');
        gp.redraw=parent.unwrapFunction(gp.redraw,'showScore');
        gp.solution=parent.unwrapFunction(gp.solution,'showScore');
        gp.isShowScore=false;
      }
      if (analysis.path==='') {
        parent.traverse(undefined,undefined,true);
        gp.makeState();
      }
    };

    addDeviation=()=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;
      const nodePath=analysis.contextMenuPath;
      const node=analysis.tree.nodeAtPath(nodePath);
      let gamebook=node.gamebook;
      if (!gamebook) {
        gamebook={};
        node.gamebook=gamebook;
      }
      const text=trans.noarg('addDeviationText');
      const deviation = parent.global.prompt(text,gamebook.deviation);
      if (!deviation) return;
      gamebook.deviation=deviation;
      const chapterId=analysis.study.currentChapter()?.id;
      if (!chapterId) {
        parent.global.console.warn('Could not determine chapterId');
        return;
      }
      analysis.study.makeChange('setGamebook',{
        ch: chapterId,
        path: nodePath,
        gamebook: gamebook
      });
      if (analysis.node===node) {
        $('div.gamebook-edit div.deviation textarea').val(deviation);
      }
    };

    playAgain=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      analysis.userJump(this.options.returnToPreview && this._previewPath || '');
      analysis.redraw();
    };

    collapseGamebookEdit=(ev)=>{
      ev.preventDefault();
      const parent=this.lichessTools;
      const $=parent.$;
      const gamebookEdit=$('div.gamebook-edit');
      this._collapsed=!this._collapsed;
      gamebookEdit.toggleClass('lichessTools-collapsed',this._collapsed);
    };

    alterUI=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;

      $.cached('body').toggleClass('lichessTools-extendedInteractiveLesson',this.options.extendedInteractive && !!analysis?.study?.data?.chapter?.gamebook);
      let translation=trans.noarg('extendedInteractiveLessonLong')
      $('button.preview').attr('title',translation); //.attr('data-label',translation);

      if (this.options.returnToPreview) {
        $('button.retry, button.fbt.text.back').each((i,e)=>{
          let handlers=parent.getEventHandlers(e,'click');
          if (handlers.filter(h=>h!=this.playAgain).length) {
            parent.removeEventHandlers(e,'click');
            handlers=[];
          }
          if (!handlers.filter(h=>h!=this.playAgain).length) {
            $(e).on('click',this.playAgain);
          }
        });
      }

      const gamebookEdit=$('div.gamebook-edit');
      const header=$('.lichessTools-gamebookHeader',gamebookEdit);
      if (!this.options.extendedInteractive) {
        gamebookEdit.removeClass('lichessTools-collapsed');
        header.remove();
        return;
      }
      gamebookEdit.toggleClass('lichessTools-collapsed',!!this._collapsed);

      if (!header.length) {
        $('<div class="lichessTools-gamebookHeader">')
          .text(trans.noarg('extendedInteractiveLesson'))
          .attr('title',trans.noarg('extendedInteractiveLessonLong'))
          .on('click',this.collapseGamebookEdit)
          .prependTo(gamebookEdit);
      }

      const menu=$('#analyse-cm');
      if (menu.length && analysis?.study?.data?.chapter?.gamebook && !menu.has('a[data-role="addDeviation"]').length) {
        const text=trans.noarg('addDeviationText');
        const title=trans.noarg('addDeviationTitle');
        $('<a>')
          .attr('data-icon','\uE05E')
          .attr('data-role','addDeviation')
          .text(text).attr('title',title)
          .on('click',this.addDeviation)
          .appendTo(menu);
      }

      if (!analysis.study?.practice) {
        const gamebookElem=$('div.gamebook');
        let optionsElem=gamebookElem.find('.lichessTools-extendedInteractiveLesson-options');
        if (!optionsElem.length) {
          optionsElem=$('<div class="lichessTools-extendedInteractiveLesson-options">')
            .append($('<span>'))
            .append($('<a target="_blank">')
                 .attr('data-icon','\uE005')
                 .attr('href','https://siderite.dev/blog/lichess-tools---user-manual#extendedInteractiveLesson')
            )
            .attr('title',trans.noarg('extendedInteractiveOptionsTitle'))
            .insertAfter($('div.floor',gamebookElem));
        }
        const optionsArr=[];
        if (this.options.extendedInteractive) optionsArr.push(trans.noarg('extendedInteractiveLesson.extendedInteractive'));
        if (this.options.flow.sequential) optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.sequential'));
        if (this.options.flow.spacedRepetition) optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.spacedRepetition'));
        if (this.options.returnToPreview) optionsArr.push(trans.noarg('extendedInteractiveLesson.returnToPreview'));
        if (this.options.fastInteractive) optionsArr.push(trans.noarg('extendedInteractiveLesson.fastInteractive'));
        optionsElem.find('span').text(optionsArr.join(', '));
      }
    };

    isPermanentNode=(node)=>{
      return node?.version==this.currentVersion;
    };

    refreshNodeVersion=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      if (!this.options.extendedInteractive) return;
      this.currentVersion=analysis?.cgVersion?.js;
      parent.traverse(analysis.tree.root,(n,s)=>n.version=n.version||this.currentVersion,true);
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
    </div>
    <div class="setting abset-alwaysShowScore" title="LiChess Tools - $trans(extendedInteractiveLesson.alwaysShowScore)">
      <div class="switch">
        <input id="abset-alwaysShowScore" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-alwaysShowScore"></label>
      </div>
      <label for="abset-alwaysShowScore">$trans(extendedInteractiveLesson.alwaysShowScore)</label>
    </div>
    <div class="setting abset-returnToPreview" title="LiChess Tools - $trans(extendedInteractiveLesson.returnToPreview)">
      <div class="switch">
        <input id="abset-returnToPreview" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-returnToPreview"></label>
      </div>
      <label for="abset-returnToPreview">$trans(extendedInteractiveLesson.returnToPreview)</label>
    </div>
    <div class="setting abset-fastInteractive" title="LiChess Tools - $trans(extendedInteractiveLesson.fastInteractive)">
      <div class="switch">
        <input id="abset-fastInteractive" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-fastInteractive"></label>
      </div>
      <label for="abset-fastInteractive">$trans(extendedInteractiveLesson.fastInteractive)</label>
    </div>
`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertBefore($('h2',container).eq(0));
        $('#abset-extendedInteractive,#abset-showScore,#abset-alwaysShowScore,#abset-returnToPreview,#abset-fastInteractive')
          .on('change',async ()=>{
            const arr=[];
            const options=parent.currentOptions
            if ($('#abset-extendedInteractive').is(':checked')) arr.push('extendedInteractive');
            if ($('#abset-showScore').is(':checked')) arr.push('showFinalScore');
            if ($('#abset-alwaysShowScore').is(':checked')) arr.push('alwaysShowFinalScore');
            if ($('#abset-returnToPreview').is(':checked')) arr.push('returnToPreview');
            if ($('#abset-fastInteractive').is(':checked')) arr.push('fastInteractive');
            options.extendedInteractiveLesson=arr.join(',');
            await parent.applyOptions(options)
            await parent.saveOptions(options)
            parent.fireReloadOptions();
          });
      }
      $('#abset-extendedInteractive')
        .prop('checked',this.options.extendedInteractive);
      $('#abset-showScore')
        .prop('checked',this.options.showFinalScore);
      $('#abset-alwaysShowScore')
        .prop('checked',this.options.alwaysShowScore);
      $('#abset-returnToPreview')
        .prop('checked',this.options.returnToPreview);
      $('#abset-fastInteractive')
        .prop('checked',this.options.fastInteractive);
    };

    setupReset=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      this.state=parent.traverse(undefined,undefined,true);
      const analysis=lichess.analysis;
      const study=analysis?.study;
      if (!study) return;
      const trans=parent.translator;
      const modal=$('div.dialog-content');
      if (!modal.length) return;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,null);
      }
      if (!this._paths) return;
      const key=analysis.study.data.id+'/'+analysis.study.currentChapter()?.id;
      const paths=this._paths[key];
      const button = $('div.form-actions button.lichessTools-reset',modal);
      if (paths && (this.options.flow.sequential || this.options.flow.spacedRepetition)) {
        if (button.length) return;
        $('<button class="button button-red lichessTools-reset">')
          .attr('title',trans.noarg('resetButtonTitle'))
          .text(trans.noarg('resetButtonText'))
          .on('click',ev=>{
            ev.preventDefault();
            if (!parent.global.confirm(trans.noarg('resetQuestion'))) return;
            this.resetDone();
          })
          .insertBefore($('div.form-actions button[type="submit"]',modal));
      } else {
        button.remove();
      }
    };

    refreshChapterProgress=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      this.state=parent.traverse(undefined,undefined,true);
      const analysis=lichess.analysis;
      const study=analysis?.study;
      if (!study) return;
      const trans=parent.translator;
      if (!this._paths) {
        const json=lichess.storage.get('LichessTools.chapterPaths');
        this._paths=parent.jsonParse(json,null);
      }
      if (!this._paths) return;
      const list = study.chapters.list.all();
      $('div.study__chapters').addClass('lichesstools-extendedInteractiveLessonFlow');
      for (const chapter of list) {
        const container=$('div.study__chapters div[data-id="'+chapter.id+'"]');
        const key=study.data.id+'/'+chapter.id;
        const paths=this._paths[key];
        let perc='';
        if (!paths) continue;

        let total=0;
        let doneCount=0;
        for (const k in paths) {
          if (k=='currentPath') continue;
          const item=paths[k];
          const done=this.options.flow.spacedRepetition
            ? item && Date.now()<item.time+item.interval*86400000
            : item?.success
          total++;
          if (done) doneCount++;
        }
        if (total) {
          perc=(100*doneCount/total)+'%';
          container.attr('title',trans.pluralSame('progressTitle',doneCount+'/'+total));
        } else {
          container.removeAttr('title');
        }

        let act=container.children('i.act');
        if (!act.length) {
          act=$('<i class="act lichessTools-reset" data-icon="&#xE01A">')
            .attr('title',trans.noarg('resetButtonTitle'))
            .on('click',ev=>{
              ev.preventDefault();
              ev.stopPropagation();
              if (!parent.global.confirm(trans.noarg('resetQuestion'))) return;
              this.resetDone(chapter.id);
            })
            .appendTo(container);
        }
        act.css('--perc',perc);
      }
    };

    findThreatArrow=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis.threatMode()) return;
      let uci=analysis.ceval?.curEval?.pvs?.at(0)?.moves?.at(0);
      if (!uci) return;
      uci=uci.substr(0,2)+','+uci.substr(2,2);
      $('svg.cg-shapes g').each((i,e)=>{
        const cgHash=$(e).attr('cgHash');
        if (cgHash?.includes(uci)) {
          $(e).addClass('lichessTools-threat');
        }
      });
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extendedInteractiveLesson');
      const flow=parent.currentOptions.getValue('extendedInteractiveLessonFlow');
      this.logOption('Extended interactive lessons', value, 'flow',flow);
      const $=parent.$;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;
      this.options={
        showFinalScore:parent.isOptionSet(value,'showFinalScore'),
        alwaysShowScore:parent.isOptionSet(value,'alwaysShowScore'),
        extendedInteractive:parent.isOptionSet(value,'extendedInteractive'),
        returnToPreview:parent.isOptionSet(value,'returnToPreview'),
        fastInteractive:parent.isOptionSet(value,'fastInteractive'),
        giveUpButton:parent.isOptionSet(value,'giveUpButton'),
        flow: {
          'sequential':parent.isOptionSet(flow,'sequential'),
          'spacedRepetition':parent.isOptionSet(flow,'spacedRepetition')
        }
      };
      parent.isPermanentNode=this.isPermanentNode.bind(this);
      if (this.options.extendedInteractive && !parent.isWrappedFunction(study.setGamebookOverride,'extendedInteractive')) {
        study.setGamebookOverride=parent.wrapFunction(study.setGamebookOverride,{
          id:'extendedInteractive',
          before:($this,o)=> {
            if (!o && !study.members.canContribute()) {
              o='play';
            }
            if (o=='play') {
              this._previewPath=analysis.path;
              // fix lichess bug where entering Preview mode with engine on keeps engine running
              if (analysis.ceval.enabled()) {
                analysis.ceval.stop();
                analysis.ceval.isDeeper(false);
              }
              if (this.options.extendedInteractive) {
                this.refreshNodeVersion();
              }
            } else {
              if (this.explorerEnabled && !analysis.explorer.enabled()) {
                analysis.explorer.enabled(true);
              }
            }
            // fix lichess bug with going to analysis after lesson finishes and showing the bad moves, too
            if (o=='analyse' && study.members.canContribute()) {
              const oldSetGamebookOverride=study.setGamebookOverride.__originalFunction;
              oldSetGamebookOverride();
            }
          },
          after:($this,result,o)=> {
            this.patchGamebook();
            const gp=analysis.gamebookPlay();
            gp?.makeState();
            analysis.redraw();
            if (o=='play') {
              analysis.userJump(analysis.path);
            }
          }
        });
      } else {
        study.setGamebookOverride=parent.unwrapFunction(study.setGamebookOverride,'extendedInteractive');
      }
      if (this.options.extendedInteractive && !this.currentVersion) {
        this.refreshNodeVersion();
      }
      lichess.pubsub.off('lichessTools.redraw',this.analysisControls);
      lichess.pubsub.on('lichessTools.redraw',this.analysisControls);
      analysis.actionMenu.toggle=lichessTools.unwrapFunction(analysis.actionMenu.toggle,'extendedInteractiveLesson');
      analysis.actionMenu.toggle=lichessTools.wrapFunction(analysis.actionMenu.toggle,{
        id:'extendedInteractiveLesson',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();
      lichess.pubsub.off('lichessTools.redraw',this.alterUI);
      lichess.pubsub.off('lichessTools.chapterChange',this.patchGamebook);
      if (this.options.extendedInteractive) {
        lichess.pubsub.on('lichessTools.redraw',this.alterUI);
      }
      if (this.options.extendedInteractive||this.options.showFinalScore||this.options.alwaysShowScore) {
        lichess.pubsub.on('lichessTools.chapterChange',this.patchGamebook);
      }
      lichess.pubsub.off('lichessTools.redraw',this.showScore);
      if (this.options.showFinalScore||this.options.alwaysShowScore) {
        lichess.pubsub.on('lichessTools.redraw',this.showScore);
      }
      this.patchGamebook();

      if (analysis.study.onReload) {
        analysis.study.onReload=lichessTools.unwrapFunction(analysis.study.onReload,'extendedInteractiveLesson');
      }
      lichess.pubsub.off('lichessTools.redraw',this.findThreatArrow);
      if (this.options.extendedInteractive) {
        lichess.pubsub.on('lichessTools.redraw',this.findThreatArrow);
        analysis.study.onReload=lichessTools.wrapFunction(analysis.study.onReload,{
          id:'extendedInteractiveLesson',
          after:($this,result,...args)=>{
            this.refreshNodeVersion();
          }
        });
      }

      study.chapters.editForm.toggle=parent.unwrapFunction(study.chapters.editForm.toggle,'extendedInteractiveLessonFlow');
      $('div.study__chapters')
        .removeClass('lichesstools-extendedInteractiveLessonFlow')
        .find('i.act.lichessTools-reset')
        .remove();
      lichess.pubsub.off('chat.resize',this.refreshChapterProgress);
      if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
        lichess.pubsub.on('chat.resize',this.refreshChapterProgress);
        this.refreshChapterProgress();
        study.chapters.editForm.toggle=parent.wrapFunction(study.chapters.editForm.toggle,{
          id:'extendedInteractiveLessonFlow',
          after:($this,result,data)=>{
            const interval=parent.global.setInterval(()=>{
              const currentChapterId=study.currentChapter()?.id;
              if (!currentChapterId) return;
              if (!study.data.chapter.gamebook) return;
              const modal=$('div.dialog-content');
              if (!modal.length) return;
              parent.global.clearInterval(interval);
              this.setupReset();
            },100);
          }
        });
      }
    }
  }

  LiChessTools.Tools.ExtendedInteractiveLesson=ExtendedInteractiveLessonTool;
})();

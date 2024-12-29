(() => {
  class ExtendedInteractiveLessonTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'RandomVariation', 'DetectThirdParties'];

    preferences = [
      {
        name: 'extendedInteractiveLesson',
        category: 'study',
        type: 'multiple',
        possibleValues: ['extendedInteractive', 'showFinalScore', 'alwaysShowScore', 'returnToPreview', 'fastInteractive', 'giveUpButton'],
        defaultValue: 'extendedInteractive,showFinalScore'
      },
      {
        name: 'extendedInteractiveLessonFlow',
        category: 'study',
        type: 'multiple',
        possibleValues: ['sequential', 'spacedRepetition', 'ignoreBadGlyphs', 'negativeHint'],
        defaultValue: 'ignoreBadGlyphs',
        advanced: true,
        wip: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.extendedInteractiveLesson': 'Extended interactive lessons',
        'extendedInteractiveLesson.extendedInteractive': 'Play all variations',
        'extendedInteractiveLesson.showFinalScore': 'Show final score',
        'extendedInteractiveLesson.alwaysShowScore': 'Always show score',
        'extendedInteractiveLesson.returnToPreview': 'Play again from where you entered Preview',
        'extendedInteractiveLesson.fastInteractive': 'Fast interaction',
        'extendedInteractiveLesson.giveUpButton': 'Give up button',
        'extendedInteractiveLesson': 'Extended Interactive lesson',
        'extendedInteractiveLessonLong': 'Extended Interactive lesson - LiChess Tools',
        'finalScore': 'Score final: %s%',
        'currentScore': 'Score so far: %s%',
        'nextMovesCount': 'Make one of %s accepted moves',
        'nextMovesCount:one': 'Only one accepted move to make',
        'avoidMovesHint': 'Only one accepted move. Avoid %s',
        'interactiveLessonsText': 'Interactive lessons',
        'addDeviationText': 'Explain why other moves are wrong',
        'addDeviationTitle': 'LiChess Tools - explain why moves from here not in the PGN are wrong',
        'options.extendedInteractiveLessonFlow': 'Extended interactive lesson flow',
        'extendedInteractiveLessonFlow.sequential': 'Sequential',
        'extendedInteractiveLessonFlow.spacedRepetition': 'Spaced Repetition',
        'extendedInteractiveLessonFlow.ignoreBadGlyphs': 'Avoid lines marked as mistakes',
        'extendedInteractiveLessonFlow.negativeHint': 'Hint excluded moves',
        'resetQuestionNoVariations': 'No more variations. Reset?',
        'resetQuestion': 'Reset variation progress?',
        'resetButtonText': 'Reset',
        'resetButtonTitle': 'LiChess Tools - reset variation progress',
        'progressTitle': 'LiChess Tools - %s variations',
        'extendedInteractiveOptionsTitle': 'LiChess Tools - interactive lesson preferences',
        'giveUpButtonText': 'Give up',
        'giveUpButtonTitle': 'Abandons the interactive run',
        'giveUpConfirmation': 'Are you sure you want to abandon the interactive run?'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.extendedInteractiveLesson': 'Lec\u0163ii interactive extinse',
        'extendedInteractiveLesson.extendedInteractive': 'Joac\u0103 toate varia\u0163iunile',
        'extendedInteractiveLesson.showFinalScore': 'Arat\u0103 scorul final',
        'extendedInteractiveLesson.alwaysShowScore': 'Arat\u0103 scorul tot timpul',
        'extendedInteractiveLesson.returnToPreview': 'Joac\u0103 din nou de unde ai intrat \u00een Preview',
        'extendedInteractiveLesson.fastInteractive': 'Interac\u0163iune rapid\u0103',
        'extendedInteractiveLesson.giveUpButton': 'Buton renun\u0163are',
        'extendedInteractiveLesson': 'Lec\u0163ie Interactiv\u0103 extins\u0103',
        'extendedInteractiveLessonLong': 'Lec\u0163ie Interactiv\u0103 extins\u0103 - LiChess Tools',
        'finalScore': 'Scor final: %s%',
        'currentScore': 'Scor p\u00e2n\u0103 acum: %s%',
        'nextMovesCount': 'F\u0103 una din %s mut\u0103ri acceptate',
        'nextMovesCount:one': 'O singur\u0103 mutare de f\u0103cut',
        'avoidMovesHint': 'O singur\u0103 mutare. Evit\u0103 %s',
        'interactiveLessonsText': 'Lec\u0163ii interactive',
        'addDeviationText': 'Explic\u0103 de ce alte mut\u0103ri sunt gre\u015Fite',
        'addDeviationTitle': 'LiChess Tools - explic\u0103 de ce mut\u0103ri de aici lips\u0103 din PGN sunt gre\u015Fite',
        'options.extendedInteractiveLessonFlow': 'Cursul lec\u0163iilor interactive extinse',
        'extendedInteractiveLessonFlow.sequential': 'Secven\u0163ial',
        'extendedInteractiveLessonFlow.spacedRepetition': 'Repeti\u0163ie distan\u0163at\u0103',
        'extendedInteractiveLessonFlow.ignoreBadGlyphs': 'Evit\u0103 linii marcate ca gre\u015fite',
        'extendedInteractiveLessonFlow.negativeHint': 'Indiciu mut\u0103ri excluse',
        'resetQuestionNoVariations': 'Nu mai sunt varia\u0163uni. Resetez?',
        'resetQuestion': 'Resetez progresul \u00een varia\u0163uni?',
        'resetButtonText': 'Resetare',
        'resetButtonTitle': 'LiChess Tools - resetare progres \u00een varia\u0163uni',
        'progressTitle': 'LiChess Tools - %s varia\u0163uni',
        'extendedInteractiveOptionsTitle': 'LiChess Tools - preferin\u0163e lec\u0163ie interactiv\u0103',
        'giveUpButtonText': 'Renun\u0163',
        'giveUpButtonTitle': 'Abandoneaz\u0103 lec\u0163ia interactiv\u0103',
        'giveUpConfirmation': 'E\u015Fti sigur ca vrei sa abandonezi lec\u0163ia interactiv\u0103?'
      }
    }

    extendedGamebook = {
      goodMoves: 0,
      badMoves: 0,
      makeState: () => {
        const lt = this.lichessTools;
        const analysis = lt.lichess.analysis;
        const $ = lt.$;
        const trans = lt.translator;
        const gp = analysis.gamebookPlay();
        const node = analysis.node;
        const nodeComment = (node.comments || [])[0];
        const state = {
          init: analysis.path === '',
          comment: nodeComment?.text,
          showHint: false,
          isNavigateBack: gp.path?.length > analysis.path?.length && gp.path.startsWith(analysis.path)
        };
        gp.path = analysis.path;

        if (state.init || gp.state?.init) {
          gp.resetStats();
          if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
            gp.currentPath = this.getCurrentPath();
            if (!gp.currentPath) {
              const nextMoves = lt.getNextMoves(node, gp.threeFoldRepetition)
                .filter(c => this.isPermanentNode(c));
              if (nextMoves.length) {
                if (lt.global.confirm(trans.noarg('resetQuestionNoVariations'))) { //TODO can we make this await and use uiApi.dialog?
                  this.resetDone();
                  return gp.makeState();
                } else {
                  analysis.path = 'x'; // needed for Play again to work
                  state.feedback = 'end';
                  gp.state = state;
                  return;
                }
              }
            }
          }
        }
        const parPath = analysis.path.slice(0, -2);
        const parNode = analysis.tree.nodeAtPath(parPath);
        const isAcceptedMove = this.isPermanentNode(node) && (!(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(analysis.path));
        if (!isAcceptedMove) {
          const position = lt.getNodePosition(node);
          const candidate = lt.getNextMoves(parNode, gp.threeFoldRepetition)
            .filter(c => this.isPermanentNode(c))
            .filter(c => !(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(c.path))
            .find(c => lt.getNodePosition(c) == position);
          if (candidate) {
            if (candidate.path !== undefined) {
              analysis.userJump(candidate.path);
              return this.extendedGamebook.makeState();
            } else {
              lt.global.console.warn('Node has no path', candidate);
            }
          }
        }
        const allNextMoves = lt.getNextMoves(node, gp.threeFoldRepetition)
          .filter(c => this.isPermanentNode(c) && !this.areBadGlyphNodes([c]))
        const nextMoves = allNextMoves
          .filter(c => !(this.options.flow.sequential || this.options.flow.spacedRepetition) || this.inCurrentPath(c.path));
        if (!isAcceptedMove) {
          state.feedback = 'bad';
          if (!state.comment) {
            state.comment = parNode.children[0].gamebook?.deviation;
          }
        } else if (!nextMoves.length) {
          state.feedback = 'end';
          this.markPathFinished(analysis.path, gp.goodMoves + (gp.isMyMove() ? 0 : 1), gp.badMoves, gp.askedForSolution);
        } else if (gp.isMyMove()) {
          state.feedback = 'play';
          state.hint = node.gamebook?.hint;
          const nextMovesCount = new Set(nextMoves.map(c => c.uci)).size;
          if (!state.hint) {
            state.hint = trans.pluralSame('nextMovesCount', nextMovesCount);
            if ((this.options.flow.sequential || this.options.flow.spacedRepetition) && this.options.flow.negativeHint) {
              const avoidText = allNextMoves
                .filter(c=>!this.inCurrentPath(c.path))
                .map(c=>c.san)
                .join(', ');
              if (avoidText) {
                state.hint = trans.pluralSame('avoidMovesHint', avoidText);
              }
            }
          }
          const interval = lt.global.setInterval(() => {
            const hintEl = $('button.hint');
            if (!hintEl.length) return;
            lt.global.clearInterval(interval);
            hintEl
              .attr('data-count', nextMovesCount)
              .addClass('data-count');
            }, 100);
        } else {
          state.feedback = 'good';
        }
        gp.state = state;
        if (!state.comment) {
          let func = null;
          let delay = 0;
          switch (state.feedback) {
            case 'good':
              func = gp.next;
              delay = 300;
              break;
            case 'bad':
              func = gp.retry;
              delay = analysis.path ? 1000 : 800;
              break;
          }
          if (!state.isNavigateBack && !gp.isMyMove() && func && this.options.fastInteractive) {
            delay = 50;
            const oldFunc = func;
            func = () => {
              oldFunc();
              $('div.gamebook .comment')
                .removeClass('good bad')
                .addClass(state.feedback);
            };
          }
          if (func) {
            lt.global.setTimeout(func, delay);
          } else {
            $('div.gamebook .comment')
              .removeClass('good bad');
          }
        } else {
          $('div.gamebook .comment')
            .removeClass('good bad');
        }
      },
      retry: () => {
        const lt = this.lichessTools;
        const analysis = lt.lichess.analysis;
        const gp = analysis.gamebookPlay();
        if (analysis.path === '') {
          gp.makeState();
        } else {
          const parPath = analysis.path.slice(0, -2);
          const count = +gp.fens[analysis.node.fen] || 0;
          if (count == 3) {
            gp.threeFoldRepetition = false;
          }
          gp.fens[analysis.node.fen] = Math.max(0, count - 1);
          analysis.userJump(parPath);
        }
        gp.redraw();
      },
      next: () => {
        const lt = this.lichessTools;
        const analysis = lt.lichess.analysis;
        const gp = analysis.gamebookPlay();
        if (!gp) return;
        if (!gp.isMyMove()) {
          let child = null;
          if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
            gp.currentPath = this.getCurrentPath();
            if (!gp.currentPath) return;
            const childPath = gp.currentPath.slice(0, analysis.path.length + 2);
            if (childPath.length == analysis.path.length + 2) child = analysis.tree.nodeAtPath(childPath);
          } else {
            child = lt.getRandomVariation(analysis.node, gp.threeFoldRepetition);
          }
          if (child) {
            analysis.userJump(child.path || (analysis.path + child.id));
            const count = (+gp.fens[analysis.node.fen] || 0) + 1;
            gp.fens[analysis.node.fen] = count;
            if (count >= 3) {
              gp.threeFoldRepetition = true;
            }
          }
        }
        gp.redraw();
      },
      solution: () => {
        const lt = this.lichessTools;
        const analysis = lt.lichess.analysis;
        const gp = analysis.gamebookPlay();
        let children = lt.getNextMoves(analysis.node, gp.threeFoldRepetition).filter(c => this.isPermanentNode(c));
        if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
          children = children.filter(c => this.inCurrentPath(c.path));
        }
        if (!children) return;
        const shapes = [];
        for (const child of children) {
          shapes.push({
            orig: child.uci.slice(0, 2),
            dest: child.uci.slice(2, 4),
            brush: 'green'
          });
          if (child.promotion) {
            shapes.push({
              orig: child.uci.slice(2, 4),
              piece: {
                color: analysis.turnColor(),
                role: child.promotion,
                scale: 0.8
              },
              brush: 'green'
            });
          }
        }
        analysis.chessground.setShapes(shapes);
      },
      resetStats: function () {
        const gp = this;
        gp.goodMoves = 0;
        gp.badMoves = 0;
        gp.threeFoldRepetition = false;
        gp.fens = {};
      }
    };

    areBadGlyphNodes = (nodeList) => {
      if (!this.options.flow.ignoreBadGlyphs) return false;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const gp = analysis.gamebookPlay();
      if (!gp) return false;
      const yourSide = (analysis.turnColor()=='white') ^ gp.isMyMove()
           ? ' w '
           : ' b ';
      return !!nodeList
        .filter(n=>n.fen.includes(yourSide))
        .flatMap(n=>n.glyphs||[])
        .find(g=>[2,4,6].includes(g.id));
    };

    loadChapterPaths = (defaultValue) => {
      const lt = this.lichessTools;
      if (!this._paths) {
        this._paths = lt.storage.get('LichessTools.chapterPaths') || defaultValue;
      }
    };

    saveChapterPaths = ()=>{
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.chapterPaths', this._paths);
    };

    getCurrentPath = () => {
      if (!this.options.flow.sequential && !this.options.flow.spacedRepetition) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const gp = analysis.gamebookPlay();
      if (!gp) return;
      this.loadChapterPaths({});
      const key = analysis.study.data.id + '/' + analysis.study.currentChapter()?.id;
      const refreshChapterPaths = key != this.prevChapterKey;
      this.prevChapterKey = key;
      let paths = this._paths[key];
      if (!paths) {
        paths = {};
        this._paths[key] = paths;
      }
      let currentPath = null;
      if (paths.currentPath && !this.isDonePath(paths.currentPath)) {
        const nodeList = analysis.tree.getNodeList(paths.currentPath);
        if (nodeList.map(n=>n.id).join('') == paths.currentPath // line exists
          && !nodeList.find(n=>!this.isPermanentNode(n)) // it's not temporary
          && !nodeList.at(-1).children?.length // and the last node does not have kids
          && !this.areBadGlyphNodes(nodeList)) // and there are no mistake/bluders on your side and the setting is on
        {
          currentPath = paths.currentPath;
        }
      }
      if (!refreshChapterPaths && currentPath) return currentPath;
      const currentPaths = [];
      const allPaths = [];
      const traverse = (node, path, nodeList) => {
        if (!refreshChapterPaths && this.options.flow.sequential && currentPaths.length) return;
        const nextMoves = node.children
          .filter(c => this.isPermanentNode(c));
        if (!nextMoves.length && !this.areBadGlyphNodes(nodeList)) {
          allPaths.push(path);
          if (!this.isDonePath(path)) {
            currentPaths.push(path);
          }
        }
        for (const child of nextMoves) traverse(child, path + child.id, nodeList.concat([child]));
      };
      traverse(analysis.tree.root, '', []);
      if (refreshChapterPaths) {
        const toDelete = new Set(Object.keys(paths)).difference(new Set(allPaths));
        for (const path of toDelete) {
         delete paths[path];
        }
      }
      if (currentPath && refreshChapterPaths) {
        paths.currentPath = currentPath;
      } else {
        const i = this.options.flow.sequential
          ? 0
          : Math.floor(lt.random() * currentPaths.length);
        paths.currentPath = currentPaths[i];
      }
      this.saveChapterPaths();
      if (refreshChapterPaths) {
        this.refreshChapterProgress();
      }
      return paths.currentPath;
    };

    inCurrentPath = (path) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const gp = analysis.gamebookPlay();
      if (!gp) return;
      return gp.currentPath?.startsWith(path);
    };

    markPathFinished = (path, goodMoves, badMoves, askedForSolution) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const gp = analysis.gamebookPlay();
      if (!gp) return;
      const key = analysis.study.data.id + '/' + analysis.study.currentChapter()?.id;
      this.loadChapterPaths({});
      const paths = this._paths[key] || {};
      const success = badMoves == 0 && !askedForSolution && goodMoves >= Math.floor(path.length / 4);
      const item = paths[path] || { path };
      item.time = Date.now();
      item.success = success;
      if (!item.interval) item.interval = 1;
      if (success) {
        item.interval = 2;
      } else {
        item.interval /= 2;
      }
      paths[path] = item;

      const traverse = (node, nodeList) => {
        const nextMoves = node.children
          .filter(c => this.isPermanentNode(c));
        if (!nextMoves.length) {
          if (this.areBadGlyphNodes(nodeList)) {
            delete paths[node.path];
          } else {
            if (!paths[node.path]) {
              paths[node.path] = { path: node.path, interval: 0, time: Date.now(), success: false };
            }
          }
        }
        for (const child of nextMoves) traverse(child, nodeList.concat([child]));
      };
      traverse(analysis.tree.root,[]);

      this._paths[key] = paths;
      this.saveChapterPaths();
      this.refreshChapterProgress();
    };

    isDonePath = (path) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      this.loadChapterPaths(null);
      if (!this._paths) return false;
      const analysis = lichess.analysis;
      const key = analysis.study.data.id + '/' + analysis.study.currentChapter()?.id;
      const paths = this._paths[key];
      if (!paths) return;
      const item = paths[path];
      if (this.options.flow.spacedRepetition) {
        return item && Date.now() < item.time + item.interval * 86400000;
      } else {
        return item?.success;
      }
    };

    resetDone = (chapterId) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      this.loadChapterPaths(null);
      if (!this._paths) return false;
      const analysis = lichess.analysis;
      chapterId = chapterId || analysis.study.currentChapter()?.id
      const key = analysis.study.data.id + '/' + chapterId;
      this._paths[key] = null;
      this.saveChapterPaths();
      this.refreshChapterProgress();
      return true;
    };

    showGiveUpButton = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('.gamebook .comment');
      if (!container.length || $('.lichessTools-giveUp', container).length) return;
      $('<button class="lichessTools-giveUp">')
        .text(trans.noarg('giveUpButtonText'))
        .attr('title', trans.noarg('giveUpButtonTitle'))
        .on('click', (ev) => {
          ev.preventDefault();
          lt.global.setTimeout(async () => {
            if (!await lt.uiApi.dialog.confirm(trans.noarg('giveUpConfirmation'))) return;
            const gp = lt.lichess.analysis.gamebookPlay();
            gp.state.feedback = 'end';
            gp.badMoves++;
            gp.redraw();
            gp.state.feedback = undefined;
          }, 1);
        })
        .appendTo(container);
    };

    showScore = (isFinal) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const Math = lt.global.Math;
      const analysis = lt.lichess.analysis;
      const trans = lt.translator;
      const gp = analysis.gamebookPlay();
      if (!gp) return;
      if (!this.options.showFinalScore && !this.options.alwaysShowScore) return;
      gp.goodMoves = +(gp.goodMoves) || 0;
      gp.badMoves = +(gp.badMoves) || 0;
      if (gp.goodMoves + gp.badMoves == 0) return;
      const score = gp.goodMoves / (gp.goodMoves + gp.badMoves);
      const scoreText = trans.pluralSame(isFinal ? 'finalScore' : 'currentScore', Math.round(100 * score));
      const scoreRating = score > 0.90 ? 4 : score > 0.75 ? 3 : score > 0.50 ? 2 : 1;
      const el = $('<span/>')
        .addClass('lichessTools-score')
        .addClass('lichessTools-score' + scoreRating)
        .text(scoreText)
        .attr('title', gp.goodMoves + ' | ' + gp.badMoves);
      const f = () => {
        const container = $('div.gamebook .comment .content');
        if (!container.length) {
          lt.global.setTimeout(f, 100);
          return;
        }
        container.find('.lichessTools-score').remove();
        container.append(el);
      };
      f();
      if (isFinal) gp.resetStats();
    };

    replaceFunction = (func, newFunc, id) => {
      const lt = this.lichessTools;
      return lt.wrapFunction(func, {
        id: id,
        before: () => false,
        after: ($this, result, ...args) => {
          return newFunc(...args);
        }
      });
    };

    originalUserJump = null;
    patchGamebook = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (analysis.study?.practice) return;
      const gp = analysis.gamebookPlay();
      if (!gp) return;
      if (this.options.extendedInteractive && !gp.isExtendedInteractiveLessons) {
        gp.makeState = this.replaceFunction(gp.makeState, this.extendedGamebook.makeState, 'extendedInteractiveLessons');
        gp.retry = this.replaceFunction(gp.retry, this.extendedGamebook.retry, 'extendedInteractiveLessons');
        gp.next = this.replaceFunction(gp.next, this.extendedGamebook.next, 'extendedInteractiveLessons');
        gp.solution = this.replaceFunction(gp.solution, this.extendedGamebook.solution, 'extendedInteractiveLessons');
        gp.isExtendedInteractiveLessons = true;
        gp.fens = {};
        gp.resetStats = this.extendedGamebook.resetStats;
        // stop the original setTimeout gp.next()
        if (!this.originalUserJump) this.originalUserJump = analysis.userJump;
        if (analysis.node.id === '') {
          analysis.userJump = function () { };
          lt.global.setTimeout(() => {
            analysis.userJump = this.originalUserJump;
            if (!gp.state.comment) gp.next();
          }, analysis.path == '' ? 1100 : 400);
        }
      } else if (!this.options.extendedInteractive && gp.isExtendedInteractiveLessons) {
        gp.makeState = lt.unwrapFunction(gp.makeState, 'extendedInteractiveLessons');
        gp.retry = lt.unwrapFunction(gp.retry, 'extendedInteractiveLessons');
        gp.next = lt.unwrapFunction(gp.next, 'extendedInteractiveLessons');
        gp.solution = lt.unwrapFunction(gp.solution, 'extendedInteractiveLessons');
        gp.isExtendedInteractiveLessons = true;
      }
      if ((this.options.showFinalScore || this.options.alwaysShowScore) && !gp.isShowScore) {
        gp.fens = {};
        gp.resetStats = this.extendedGamebook.resetStats;
        gp.makeState = lt.wrapFunction(gp.makeState, {
          id: 'showScore',
          after: ($this, result, ...args) => {
            // fix lichess bug where entering Preview mode keeps using Explorer endpoints in the background
            if (this.explorerEnabled === undefined) {
              this.explorerEnabled = analysis.explorer.enabled();
            }
            if (this.explorerEnabled) {
              analysis.explorer.enabled(false);
            }
            gp.goodMoves = +(gp.goodMoves) || 0;
            gp.badMoves = +(gp.badMoves) || 0;
            const state = $this.state;
            if (state.isNavigateBack) return;
            switch (state.feedback) {
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
            gp.askedForSolution = false;
          }
        });
        gp.redraw = lt.wrapFunction(gp.redraw, {
          id: 'showScore',
          after: ($this, results, ...args) => {
            if (gp.state.feedback == 'end' && this.options.showFinalScore) {
              this.showScore(true);
            } else
              if (this.options.alwaysShowScore) {
                this.showScore();
              }
            if (this.options.giveUpButton && gp.state.feedback != 'end') {
              this.showGiveUpButton();
            }
          }
        });
        gp.next = lt.wrapFunction(gp.next, {
          id: 'showScore',
          before: ($this, ...args) => {
            if (gp.root.node.id == '') {
              gp.resetStats();
            }
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.retry = lt.wrapFunction(gp.retry, {
          id: 'showScore',
          after: ($this, result, ...args) => {
            if (gp.root.node.id == '') {
              gp.resetStats();
            }
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.solution = lt.wrapFunction(gp.solution, {
          id: 'showScore',
          after: ($this, result, ...args) => {
            gp.askedForSolution = true;
            if (this.options.alwaysShowScore) {
              this.showScore();
            }
          }
        });
        gp.isShowScore = true;
        gp.redraw();
      } else if (!this.options.showFinalScore && gp.isShowScore) {
        gp.makeState = lt.unwrapFunction(gp.makeState, 'showScore');
        gp.next = lt.unwrapFunction(gp.next, 'showScore');
        gp.retry = lt.unwrapFunction(gp.retry, 'showScore');
        gp.redraw = lt.unwrapFunction(gp.redraw, 'showScore');
        gp.solution = lt.unwrapFunction(gp.solution, 'showScore');
        gp.isShowScore = false;
      }
      if (analysis.path === '') {
        lt.traverse(undefined, undefined, true);
        gp.makeState();
      }
      const solutionButton = $('.gamebook-buttons .solution');
      if (solutionButton.length) {
        lt.removeEventHandlers(solutionButton[0],'click');
        solutionButton.on('click',gp.solution);
      }
    };

    addDeviation = async () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      const nodePath = analysis.contextMenuPath;
      const node = analysis.tree.nodeAtPath(nodePath);
      let gamebook = node.gamebook;
      if (!gamebook) {
        gamebook = {};
        node.gamebook = gamebook;
      }
      const text = trans.noarg('addDeviationText');
      const deviation = await lt.uiApi.dialog.prompt(text, gamebook.deviation);
      if (!deviation) return;
      gamebook.deviation = deviation;
      const chapterId = analysis.study.currentChapter()?.id;
      if (!chapterId) {
        lt.global.console.warn('Could not determine chapterId');
        return;
      }
      analysis.study.makeChange('setGamebook', {
        ch: chapterId,
        path: nodePath,
        gamebook: gamebook
      });
      if (analysis.node === node) {
        $('div.gamebook-edit div.deviation textarea').val(deviation);
      }
    };

    playAgain = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      analysis.userJump(this.options.returnToPreview && this._previewPath || '');
      analysis.redraw();
    };

    collapseGamebookEdit = (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const gamebookEdit = $('div.gamebook-edit');
      this._collapsed = !this._collapsed;
      gamebookEdit.toggleClass('lichessTools-collapsed', this._collapsed);
    };

    alterUI = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;

      $.cached('body').toggleClass('lichessTools-extendedInteractiveLesson', this.options.extendedInteractive && !!analysis?.study?.data?.chapter?.gamebook);
      let translation = trans.noarg('extendedInteractiveLessonLong')
      $('button.preview').attr('title', translation); //.attr('data-label',translation);

      if (this.options.returnToPreview) {
        $('button.retry, button.fbt.text.back').each((i, e) => {
          let handlers = lt.getEventHandlers(e, 'click');
          if (handlers.filter(h => h != this.playAgain).length) {
            lt.removeEventHandlers(e, 'click');
            handlers = [];
          }
          if (!handlers.filter(h => h != this.playAgain).length) {
            $(e).on('click', this.playAgain);
          }
        });
      }

      const gamebookEdit = $('div.gamebook-edit');
      const header = $('.lichessTools-gamebookHeader', gamebookEdit);
      if (!this.options.extendedInteractive) {
        gamebookEdit.removeClass('lichessTools-collapsed');
        header.remove();
        return;
      }
      gamebookEdit.toggleClass('lichessTools-collapsed', !!this._collapsed);

      if (!header.length) {
        $('<div class="lichessTools-gamebookHeader">')
          .text(trans.noarg('extendedInteractiveLesson'))
          .attr('title', trans.noarg('extendedInteractiveLessonLong'))
          .on('click', this.collapseGamebookEdit)
          .prependTo(gamebookEdit);
      }

      const menu = $('#analyse-cm');
      if (menu.length && analysis?.study?.data?.chapter?.gamebook && !menu.has('a[data-role="addDeviation"]').length) {
        const text = trans.noarg('addDeviationText');
        const title = trans.noarg('addDeviationTitle');
        $('<a>')
          .attr('data-icon', lt.icon.NotAllowed)
          .attr('data-role', 'addDeviation')
          .text(text).attr('title', title)
          .on('click', this.addDeviation)
          .appendTo(menu);
      }

      if (!analysis.study?.practice) {
        const gamebookElem = $('div.gamebook');
        let optionsElem = gamebookElem.find('.lichessTools-extendedInteractiveLesson-options');
        if (!optionsElem.length) {
          optionsElem = $('<div class="lichessTools-extendedInteractiveLesson-options">')
            .append($('<span>'))
            .append($('<a target="_blank">')
              .attr('data-icon', lt.icon.InfoCircle)
              .attr('href', 'https://siderite.dev/blog/lichess-tools---user-manual#extendedInteractiveLesson')
            )
            .attr('title', trans.noarg('extendedInteractiveOptionsTitle'))
            .insertAfter($('div.floor', gamebookElem));
        }
        const optionsArr = [];
        if (this.options.extendedInteractive) optionsArr.push(trans.noarg('extendedInteractiveLesson.extendedInteractive'));
        if (this.options.flow.sequential) optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.sequential'));
        if (this.options.flow.spacedRepetition) optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.spacedRepetition'));
        if (this.options.returnToPreview) optionsArr.push(trans.noarg('extendedInteractiveLesson.returnToPreview'));
        if (this.options.fastInteractive) optionsArr.push(trans.noarg('extendedInteractiveLesson.fastInteractive'));
        if (this.options.flow.sequential || this.options.flow.spacedRepetition) {
          if (this.options.flow.ignoreBadGlyphs) {
            optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.ignoreBadGlyphs'));
          }
          if (this.options.flow.negativeHint) {
            optionsArr.push(trans.noarg('extendedInteractiveLessonFlow.negativeHint'));
          }
        }
        optionsElem.find('span').text(optionsArr.join(', '));
      }
    };

    isPermanentNode = (node) => {
      return node?.version == this.currentVersion;
    };

    refreshNodeVersion = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (!this.options.extendedInteractive) return;
      this.currentVersion = analysis?.cgVersion?.js;
      lt.traverse(analysis.tree.root, (n, s) => n.version = n.version || this.currentVersion, true);
    };

    analysisControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis?.study?.data?.chapter?.gamebook) return;
      const container = $('div.analyse__tools div.action-menu');
      if (!container.length) return;
      if (!$('.lichessTools-actionMenu').length) {
        const html = `<h2 class="lichessTools-actionMenu">$trans(interactiveLessonsText)</h2>
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
`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertBefore($('h2', container).eq(0));
        $('#abset-extendedInteractive,#abset-showScore,#abset-alwaysShowScore,#abset-returnToPreview,#abset-fastInteractive')
          .on('change', async () => {
            const arr = [];
            const options = lt.currentOptions
            if ($('#abset-extendedInteractive').is(':checked')) arr.push('extendedInteractive');
            if ($('#abset-showScore').is(':checked')) arr.push('showFinalScore');
            if ($('#abset-alwaysShowScore').is(':checked')) arr.push('alwaysShowFinalScore');
            if ($('#abset-returnToPreview').is(':checked')) arr.push('returnToPreview');
            if ($('#abset-fastInteractive').is(':checked')) arr.push('fastInteractive');
            options.extendedInteractiveLesson = arr.join(',');
            await lt.applyOptions(options)
            await lt.saveOptions(options)
            lt.fireReloadOptions();
          });
      }
      $('#abset-extendedInteractive')
        .prop('checked', this.options.extendedInteractive);
      $('#abset-showScore')
        .prop('checked', this.options.showFinalScore);
      $('#abset-alwaysShowScore')
        .prop('checked', this.options.alwaysShowScore);
      $('#abset-returnToPreview')
        .prop('checked', this.options.returnToPreview);
      $('#abset-fastInteractive')
        .prop('checked', this.options.fastInteractive);
    };

    setupReset = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      this.state = lt.traverse(undefined, undefined, true);
      const analysis = lichess.analysis;
      const study = analysis?.study;
      if (!study) return;
      const trans = lt.translator;
      const modal = $('div.dialog-content');
      if (!modal.length) return;
      this.loadChapterPaths(null);
      if (!this._paths) return;
      const key = analysis.study.data.id + '/' + analysis.study.currentChapter()?.id;
      const paths = this._paths[key];
      const button = $('div.form-actions button.lichessTools-reset', modal);
      if (paths) {
        if (button.length) return;
        $('<button class="button button-red lichessTools-reset">')
          .attr('title', trans.noarg('resetButtonTitle'))
          .text(trans.noarg('resetButtonText'))
          .on('click', async (ev) => {
            ev.preventDefault();
            if (!await lt.uiApi.dialog.confirm(trans.noarg('resetQuestion'))) return;
            this.resetDone();
          })
          .insertBefore($('div.form-actions button[type="submit"]', modal));
      } else {
        button.remove();
      }
    };

    refreshChapterProgress = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      this.state = lt.traverse(undefined, undefined, true);
      const analysis = lichess.analysis;
      const study = analysis?.study;
      if (!study) return;
      const trans = lt.translator;
      this.loadChapterPaths(null);
      if (!this._paths) return;
      const list = study.chapters.list.all();
      $('div.study__chapters').addClass('lichesstools-extendedInteractiveLessonFlow');
      for (const chapter of list) {
        const container = $('div.study__chapters button[data-id="' + chapter.id + '"]');
        const key = study.data.id + '/' + chapter.id;
        const paths = this._paths[key];
        let perc = '';

        let total = 0;
        let doneCount = 0;
        if (paths) {
          for (const k in paths) {
            if (k == 'currentPath') continue;
            const item = paths[k];
            const done = this.options.flow.spacedRepetition
              ? item && Date.now() < item.time + item.interval * 86400000
              : item?.success
            total++;
            if (done) doneCount++;
          }
          if (total) {
            perc = (100 * doneCount / total) + '%';
            container.attr('title', trans.pluralSame('progressTitle', doneCount + '/' + total));
          } else {
            container.removeAttr('title');
          }
        }

        let act = container.children('i.act');
        if (!act.length) {
          act = $(`<i class="act lichessTools-reset" data-icon="${lt.icon.toEntity(lt.icon.Reload)}">`)
            .attr('title', trans.noarg('resetButtonTitle'))
            .on('click', async (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (!await lt.uiApi.dialog.confirm(trans.noarg('resetQuestion'))) return;
              this.resetDone(chapter.id);
            })
            .appendTo(container);
        }
        act.css('--perc', perc);
      }
    };

    findThreatArrow = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      if (!analysis.threatMode()) return;
      let uci = analysis.ceval?.curEval?.pvs?.at(0)?.moves?.at(0);
      if (!uci) return;
      uci = uci.substr(0, 2) + ',' + uci.substr(2, 2);
      $('svg.cg-shapes g').each((i, e) => {
        const cgHash = $(e).attr('cgHash');
        if (cgHash?.includes(uci)) {
          $(e).addClass('lichessTools-threat');
        }
      });
    };

    async start() {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('extendedInteractiveLesson');
      const flow = lt.currentOptions.getValue('extendedInteractiveLessonFlow');
      this.logOption('Extended interactive lessons', value, 'flow', flow);
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      this.options = {
        showFinalScore: lt.isOptionSet(value, 'showFinalScore'),
        alwaysShowScore: lt.isOptionSet(value, 'alwaysShowScore'),
        extendedInteractive: lt.isOptionSet(value, 'extendedInteractive'),
        returnToPreview: lt.isOptionSet(value, 'returnToPreview'),
        fastInteractive: lt.isOptionSet(value, 'fastInteractive'),
        giveUpButton: lt.isOptionSet(value, 'giveUpButton'),
        flow: {
          'sequential': lt.isOptionSet(flow, 'sequential'),
          'spacedRepetition': lt.isOptionSet(flow, 'spacedRepetition'),
          'ignoreBadGlyphs': lt.isOptionSet(flow, 'ignoreBadGlyphs'),
          'negativeHint': lt.isOptionSet(flow, 'negativeHint')
        }
      };
      lt.isPermanentNode = this.isPermanentNode.bind(this);
      if (this.options.extendedInteractive && !lt.isWrappedFunction(study.setGamebookOverride, 'extendedInteractive')) {
        study.setGamebookOverride = lt.wrapFunction(study.setGamebookOverride, {
          id: 'extendedInteractive',
          before: ($this, o) => {
            if (!o && !study.members.canContribute()) {
              o = 'play';
            }
            if (o == 'play') {
              this._previewPath = analysis.path;
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
            if (o == 'analyse' && study.members.canContribute()) {
              const oldSetGamebookOverride = study.setGamebookOverride.__originalFunction;
              oldSetGamebookOverride();
            }
          },
          after: ($this, result, o) => {
            this.patchGamebook();
            const gp = analysis.gamebookPlay();
            gp?.makeState();
            analysis.redraw();
            if (o == 'play') {
              analysis.userJump(analysis.path);
            }
          }
        });
      } else {
        study.setGamebookOverride = lt.unwrapFunction(study.setGamebookOverride, 'extendedInteractive');
      }
      if (this.options.extendedInteractive && !this.currentVersion) {
        this.refreshNodeVersion();
      }
      lt.pubsub.off('lichessTools.redraw', this.analysisControls);
      lt.pubsub.on('lichessTools.redraw', this.analysisControls);
      analysis.actionMenu.toggle = lt.unwrapFunction(analysis.actionMenu.toggle, 'extendedInteractiveLesson');
      analysis.actionMenu.toggle = lt.wrapFunction(analysis.actionMenu.toggle, {
        id: 'extendedInteractiveLesson',
        after: ($this, result, ...args) => {
          lt.global.setTimeout(this.analysisControls, 100);
        }
      });
      this.analysisControls();
      lt.pubsub.off('lichessTools.redraw', this.alterUI);
      lt.pubsub.off('lichessTools.chapterChange', this.patchGamebook);
      if (this.options.extendedInteractive) {
        lt.pubsub.on('lichessTools.redraw', this.alterUI);
      }
      if (this.options.extendedInteractive || this.options.showFinalScore || this.options.alwaysShowScore) {
        lt.pubsub.on('lichessTools.chapterChange', this.patchGamebook);
      }
      lt.pubsub.off('lichessTools.redraw', this.showScore);
      if (this.options.showFinalScore || this.options.alwaysShowScore) {
        lt.pubsub.on('lichessTools.redraw', this.showScore);
      }
      this.patchGamebook();

      if (analysis.study.onReload) {
        analysis.study.onReload = lt.unwrapFunction(analysis.study.onReload, 'extendedInteractiveLesson');
      }
      lt.pubsub.off('lichessTools.redraw', this.findThreatArrow);
      if (this.options.extendedInteractive) {
        lt.pubsub.on('lichessTools.redraw', this.findThreatArrow);
        analysis.study.onReload = lt.wrapFunction(analysis.study.onReload, {
          id: 'extendedInteractiveLesson',
          after: ($this, result, ...args) => {
            this.refreshNodeVersion();
          }
        });
      }

      study.chapters.editForm.toggle = lt.unwrapFunction(study.chapters.editForm.toggle, 'extendedInteractiveLessonFlow');
      $('div.study__chapters')
        .removeClass('lichesstools-extendedInteractiveLessonFlow')
        .find('i.act.lichessTools-reset')
        .remove();
      lt.uiApi.events.off('chat.resize', this.refreshChapterProgress);
      //if (this.options.flow.sequential || this.options.flow.spacedRepetition) 
      {
        lt.uiApi.events.on('chat.resize', this.refreshChapterProgress);
        this.refreshChapterProgress();
        study.chapters.editForm.toggle = lt.wrapFunction(study.chapters.editForm.toggle, {
          id: 'extendedInteractiveLessonFlow',
          after: ($this, result, data) => {
            const interval = lt.global.setInterval(() => {
              const currentChapterId = study.currentChapter()?.id;
              if (!currentChapterId) return;
              if (!study.data.chapter.gamebook) return;
              const modal = $('div.dialog-content');
              if (!modal.length) return;
              lt.global.clearInterval(interval);
              this.setupReset();
            }, 100);
          }
        });
      }
    }
  }

  LiChessTools.Tools.ExtendedInteractiveLesson = ExtendedInteractiveLessonTool;
})();

(() => {
  class MobileExperienceTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'RandomVariation', 'DetectThirdParties'];

    preferences = [{
        name: 'mobileExperience',
        category: 'mobile',
        type: 'multiple',
        possibleValues: ['showGauge', 'hideOctopus', 'shapeDrawing',/* 'tapDrag',*/ 'randomNextMove', 'selectiveRandom', 'inInteractive'],
        defaultValue: 'showGauge,randomNextMove,selectiveRandom' 
      }, {
        name: 'mobileExperienceRound',
        category: 'mobile',
        type: 'multiple',
        possibleValues: ['shapeDrawingRound',/* 'tapDragRound',*/ 'standardButtons', 'invert', 'flipBoard'],
        defaultValue: '',
        advanced: true
      }, {
        name: 'colorCount',
        category: 'mobile',
        type: 'single',
        possibleValues: [1, 2, 3, 4],
        defaultValue: 1,
        advanced: true
      }, {
        name: 'screenLock',
        category: 'mobile',
        type: 'multiple',
        possibleValues: ['play', 'puzzle'],
        defaultValue: false,
        advanced: true
      }, {
        name: 'wakeLock',
        category: 'mobile',
        type: 'multiple',
        possibleValues: ['puzzle', 'tv'],
        defaultValue: 'puzzle,tv',
        advanced: true
      }
    ];

    upgrades = [
      { name:'mobileExperience', value:'lockBoard', version: '2.4.0', type: 'obsolete' }
    ];

    intl = {
      'en-US': {
        'options.mobile': 'Mobile devices',
        'options.mobileExperience': 'Mobile device features',
        'options.mobileExperienceRound': 'Mobile device game features',
        'options.colorCount': 'Colors for shapes on mobile',
        'options.screenLock': 'Screen lock',
        'options.wakeLock': 'Keep screen active',
        'mobileExperience.showGauge': 'Evaluation gauge',
        'mobileExperience.hideOctopus': 'Hide the octopus mascot',
        'mobileExperience.shapeDrawing': 'Analysis arrows',
        'mobileExperience.tapDrag': 'Tap&Drag',
        'mobileExperience.randomNextMove': 'Random move button',
        'mobileExperience.selectiveRandom': '...only when variations',
        'mobileExperience.inInteractive': 'Extra buttons in interactive',
        'mobileExperienceRound.shapeDrawingRound': 'Game arrows',
        'mobileExperienceRound.tapDragRound': 'Tap&Drag',
        'mobileExperienceRound.standardButtons': 'Standard buttons',
        'mobileExperienceRound.invert': 'Swap user and clock',
        'mobileExperienceRound.flipBoard': 'Tap bottom clock to flip board',
        'shapeDrawingTitle': 'LiChess Tools - draw arrows and circles',
        'randomNextMoveTitle': 'LiChess Tools - random move',
        'colorCount.1': 'one',
        'colorCount.2': 'two',
        'colorCount.3': 'three',
        'colorCount.4': 'four',
        'screenLock.play': 'During play',
        'screenLock.puzzle': 'During puzzles',
        'wakeLock.puzzle': 'During puzzles',
        'wakeLock.tv': 'Watching TV',
        'lockBoardTitle': 'LiChess Tools - screen lock'
      },
      'ro-RO': {
        'options.mobile': 'Dispozitive mobile',
        'options.mobileExperience': 'Op\u0163iuni pentru aparate mobile',
        'options.mobileExperienceRound': 'Op\u0163iuni pentru joc pe aparate mobile',
        'options.colorCount': 'Culori pentru s\u0103ge\u0163i pe mobile',
        'options.screenLock': 'Fixarea ecranului pe mobil',
        'options.wakeLock': 'P\u0103streaz\u0103 ecranul activ',
        'mobileExperience.showGauge': 'Band\u0103 de evaluare',
        'mobileExperience.hideOctopus': 'Ascunde mascota caracati\u0163\u0103',
        'mobileExperience.shapeDrawing': 'S\u0103ge\u0163i \u00een analiz\u0103',
        'mobileExperience.tapDrag': 'Atinge \u015fi trage',
        'mobileExperience.randomNextMove': 'Buton mutare aleatoare',
        'mobileExperience.selectiveRandom': '...doar c\u00e2nd sunt varia\u0163ii',
        'mobileExperience.inInteractive': 'Butoane suplimentare \u00een lec\u0163ii interactive',
        'mobileExperienceRound.shapeDrawingRound': 'S\u0103ge\u0163i \u00een joc',
        'mobileExperienceRound.tapDragRound': 'Atinge \u015fi trage',
        'mobileExperienceRound.standardButtons': 'Butoane standard',
        'mobileExperienceRound.invert': 'Inverseaz\u0103 user \u015fi ceas',
        'mobileExperienceRound.flipBoard': 'Atinge ceasul de jos pentru a roti tabla',
        'shapeDrawingTitle': 'LiChess Tools - deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri',
        'randomNextMoveTitle': 'LiChess Tools - mutare aleatoare',
        'colorCount.1': 'una',
        'colorCount.2': 'dou\u0103',
        'colorCount.3': 'trei',
        'colorCount.4': 'patru',
        'screenLock.play': '\u00CEn timpul jocului',
        'screenLock.puzzle': '\u00CEn timpul problemelor \u015fah',
        'wakeLock.puzzle': '\u00CEn timpul problemelor \u015fah',
        'wakeLock.tv': 'Urm\u0103rind TV',
        'lockBoardTitle': 'LiChess Tools - fixare ecran'
      }
    }

    touchStart = e => {
      if (!this.chessground)
        return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      switch (e.targetTouches?.length) {
        case 1: {
            const ev = e.targetTouches?.[0] || e;
            const pos = [ev.clientX, ev.clientY];
            const square = this.chessground.getKeyAtDomPos(pos);
            if (this.drawingBrush) {
              e.preventDefault();
              e.stopPropagation();
              this.chessground.state.drawable.current = {
                orig: square,
                brush: this.drawingBrush,
                snapToValidMove: this.chessground.state.drawable.defaultSnapToValidMove,
                pos: pos
              };
              this.chessground.state.dom.redraw();
            } else 
            if (this.options.tapDrag && ev.identifier) {
              e.preventDefault();
              e.stopPropagation();
              this.holdingFinger = {
                id: ev.identifier,
                startX: ev.clientX,
                startY: ev.clientY
              };
            }
          }
          break;
        case 2: {
            if (this.options.tapDrag && !this.drawingBrush && this.holdingFinger) {
              const others = e.targetTouches?.filter(t=>t.identifier != this.holdingFinger.id);
              if (others.length==1 && others[0].identifier) {
                e.preventDefault();
                e.stopPropagation();
                const ev = others[0];
                this.drawingFinger = {
                  id: ev.identifier
                };
                $('button.lichessTools-shapeDrawing').toggleClassSafe('lichessTools-mobileExperience-tapDrag',true);
                const pos = [ev.clientX, ev.clientY];
                const square = this.chessground.getKeyAtDomPos(pos);
                this.chessground.state.drawable.current = {
                  orig: square,
                  brush: this.brushes[0],
                  snapToValidMove: this.chessground.state.drawable.defaultSnapToValidMove,
                  pos: pos
                };
                this.chessground.state.dom.redraw();
              }
            }
          }
          break;
      }
    };

    isStationary = (touch) => {
      if (!touch) return false;
      const holdThreshold = 10;
      return Math.abs(touch.clientX - this.holdingFinger.startX) < holdThreshold &&
             Math.abs(touch.clientY - this.holdingFinger.startY) < holdThreshold;
    };

    touchMove = e => {
      if (!this.chessground)
        return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.chessground.state.drawable.current)
        return;
      let ev = null;
      if (this.drawingBrush) {
        e.preventDefault();
        e.stopPropagation();
        ev = e.targetTouches?.[0] || e;
      } else
      if (this.holdingFinger && this.drawingFinger) {
        e.preventDefault();
        e.stopPropagation();
        const holding = e.targetTouches?.filter(t=>t.identifier == this.holdingFinger.id)[0];
        if (this.isStationary(holding)) {
          ev = e.targetTouches?.filter(t=>t.identifier == this.drawingFinger.id)[0];
        } else {
          this.holdingFinger = null;
          this.drawingFinger = null;
        }
      }
      if (ev) {
        const pos = [ev.clientX, ev.clientY];
        const square = this.chessground.getKeyAtDomPos(pos);
        const current = this.chessground.state.drawable.current;
        current.pos = pos;
        current.mouseSq = square;
        current.dest = square;
        this.chessground.state.dom.redraw();
      }
    };

    touchEnd = e => {
      if (!this.chessground)
        return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.chessground.state.drawable.current)
        return;
      e.preventDefault();
      e.stopPropagation();
      this.handleGesture(this.chessground.state.drawable.current);
      this.chessground.state.drawable.current = undefined;
      this.chessground.state.dom.redraw();
      lt.pubsub.emit('lichessTools.shapeRank');
      this.holdingFinger = null;
      this.drawingFinger = null;
      $('button.lichessTools-shapeDrawing').toggleClassSafe('lichessTools-mobileExperience-tapDrag',false);
    };

    handleGesture = (shape) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!this.chessground)
        return;
      const drawable = this.chessground.state.drawable;
      const existing = drawable.shapes.find(s => s.orig === shape.orig && s.dest === shape.dest && s.brush === shape.brush);
      lt.arrayRemoveAll(drawable.shapes, s => s.orig === shape.orig && s.dest === shape.dest);
      if (!existing)
        drawable.shapes.push(shape);
      if (drawable.onChange)
        drawable.onChange(drawable.shapes);
    };

    playRandomVariation = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis)
        return;
      const node = lichess.analysis.node;
      const child = lt.getRandomVariation(node);
      if (child) {
        lichess.analysis.userJump(child.path || (path + child.id));
        lichess.analysis.redraw();
      }
    };

    initializeOverlayWrap = async() => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const wrap = $('<div class="cg-wrap lichessTools-boardOverlay">')
        .appendTo('main div.main-board')
        .addClass('lichessTools-passthrough');
      const {
        Chessground
      } = await lichess.asset.embedChessground();
      if (!Chessground) {
        console.error('Could not create a Chessground!');
        return;
      }
      const snap = lt.storage.get('arrow.snap');
      const cg = Chessground(wrap[0], {
          fen: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
          draggable: {
            enabled: false
          },
          movable: {
            showDests: false
          },
          drawable: {
            enabled: false,
            defaultSnapToValidMove: snap === undefined ? true : !!snap
          },
          disableContextMenu: true
        });
      wrap[0].chessground = cg;
      return wrap;
    };

    brushes = ['green', 'red', 'blue', 'yellow'];
    toggleBrush = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.chessground)
        return;
      ev.preventDefault();
      let index = this.brushes.indexOf(this.drawingBrush) + 1;
      this.drawingBrush = index >= this.options.colorCount
         ? null
         : this.brushes[index];
      const state = this.chessground.state;
      state.drawable.enabled = !this.drawingBrush;
      state.movable.showDests = !this.drawingBrush;
      state.draggable.enabled = !this.drawingBrush;
      state.selectable.enabled = !this.drawingBrush;
      for (const brush of this.brushes) {
        $(ev.target).toggleClassSafe('lichessTools-' + brush + 'Brush', this.drawingBrush == brush);
      }
    };

    clickOrTapAnalysisControls = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if ($(ev.target).is('button.lichessTools-shapeDrawing')) {
        ev.preventDefault();
        this.toggleBrush(ev);
      }
      if ($(ev.target).is('button.lichessTools-randomNextMove')) {
        ev.preventDefault();
        this.playRandomVariation();
      }
    };

    handleRedraw = async() => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!lt.isMobile() && !lt.isTouchDevice())
        return;
      const trans = lt.translator;
      const isAnalyse = !!$('main.analyse').length;
      const isRound = !!$('main.round,main.puzzle').length;
      const isEnabled = !!(this.options.shapeDrawing || this.options.shapeDrawingRound || this.options.randomNextMove);
      $.cached('body').toggleClassSafe('lichessTools-mobileExperience', isEnabled);

      let wrap = null;
      this.chessground = null;
      if (isAnalyse) {
        $('main.analyse')
        .toggleClassSafe('lichessTools-gaugeOnMobile', this.options.showGauge)
        .toggleClassSafe('lichessTools-hideOctopus', this.options.hideOctopus);
        wrap = $('main.analyse div.cg-wrap');
        if (this.options.shapeDrawing) {
          this.chessground = lt.lichess.analysis?.chessground;
        }
      } else {
        if (isRound) {
          $('main')
          .toggleClassSafe('lichessTools-invert', this.options.invert)
          .toggleClassSafe('lichessTools-standardButtons', this.options.standardButtons);
          wrap = $('main div.cg-wrap.lichessTools-boardOverlay');
          if (this.options.shapeDrawingRound) {
            if (!wrap.length) {
              wrap = await this.initializeOverlayWrap();
            }
            this.chessground = wrap[0]?.chessground;
          }
        }
      }
      if (this.options.shapeDrawing || this.options.shapeDrawingRound) {
        if (wrap && !wrap.is('.lichessTools-shapeDrawing')) {
          wrap
          .addClass('lichessTools-shapeDrawing')
          .on('touchstart mousedown ', this.touchStart)
          .on('touchmove mousemove', this.touchMove)
          .on('touchend mouseup', this.touchEnd);
        }
      } else {
        if (wrap) {
          wrap
          .removeClass('lichessTools-shapeDrawing')
          .off('touchstart mousedown', this.touchStart)
          .off('touchmove mousemove', this.touchMove)
          .off('touchend mouseup', this.touchEnd);
        }
      }
      if (isAnalyse) {
        if (lichess.analysis.gamebookPlay()) {
          let container = $('.lichessTools-inInteractive');
          if (this.options.inInteractive) {
            if (!container.length) {
              container = $('<div class="lichessTools-inInteractive">')
                .insertBefore('.gamebook');
              $('<button class="fbt lichessTools-flipBoard">')
                .attr('data-icon',lt.icon.ChasingArrows)
                .on('click',(ev)=>{
                  const handler = lt.getKeyHandler('f');
                  if (handler) handler();
                })
                .appendTo(container);
              if (this.options.shapeDrawing) {
                if (!container.find('button.lichessTools-shapeDrawing').length) {
                  $('<button class="fbt">')
                  .attr('data-icon', lt.icon.NorthEastDoubleArrow)
                  .attr('title', trans.noarg('shapeDrawingTitle'))
                  .addClass('lichessTools-shapeDrawing')
                  .on('click',this.toggleBrush)
                  .appendTo(container);
                }
              } else {
                $('div.analyse__controls button.lichessTools-shapeDrawing').remove();
              }
            }
          } else {
            container.remove();
          }
        }
        let addHandler = false;
        if (this.options.shapeDrawing) {
          const container = $('div.analyse__controls:not(.lichessTools-liveStatus)');
          if (!container.find('button.lichessTools-shapeDrawing').length) {
            const anchor = container.children('button[data-act]:not([data-act="menu"])').last();
            $('<button class="fbt">')
            .attr('data-icon', lt.icon.NorthEastDoubleArrow)
            .attr('title', trans.noarg('shapeDrawingTitle'))
            .addClass('lichessTools-shapeDrawing')
            .insertAfter(anchor);
            addHandler = true;
          }
        } else {
          $('div.analyse__controls button.lichessTools-shapeDrawing').remove();
        }
        if (this.options.randomNextMove) {
          if (!$('div.analyse__controls div.jumps button.lichessTools-randomNextMove').length) {
            $('<button class="fbt">')
            .attr('data-icon', lt.icon.RightwardsPairedArrows)
            .attr('title', trans.noarg('randomNextMoveTitle'))
            .addClass('lichessTools-randomNextMove')
            .insertBefore($('div.analyse__controls div.jumps button[data-act="next"]'));
            addHandler = true;
          }
          const hasVariations = !this.options.selectiveRandom || lt.getNextMoves(lichess.analysis.node).length > 1;
          $('div.analyse__controls div.jumps button.lichessTools-randomNextMove').toggle(hasVariations);
        } else {
          $('div.analyse__controls div.jumps button.lichessTools-randomNextMove').remove();
        }
        if (addHandler) {
          const elem = $('.analyse__controls')[0];
          if (elem) {
            if (!this.originalHandler) {
              this.originalHandler = lt.getEventHandlers(elem, 'pointerdown')?.at(0)?.bind(elem);
            }
            lt.removeEventHandlers(elem, 'pointerdown');
            $('div.analyse__controls')
            .on('pointerdown', ev => {
              this.originalHandler(ev);
              this.clickOrTapAnalysisControls(ev);
            })
            .on('mousedown', this.clickOrTapAnalysisControls);
          }
        }
        if (!this.options.shapeDrawing && !this.options.randomNextMove) {
          if (this.originalHandler) {
            const elem = $('.analyse__controls')[0];
            if (elem && this.originalHandler) {
              lt.removeEventHandlers(elem, 'pointerdown');
              $('div.analyse__controls')
              .on('pointerdown', this.originalHandler)
              .off('mousedown', this.clickOrTapAnalysisControls);
            }
          }
        }
      } else {
        if (isRound) {
          if (this.options.shapeDrawingRound) {
            const container = $('div.rcontrols div.ricons');
            if (!$('button.lichessTools-shapeDrawing', container).length) {
              $('<button class="fbt lichessTools-shapeDrawing">')
              .attr('data-icon', lt.icon.NorthEastDoubleArrow)
              .attr('title', trans.noarg('shapeDrawingTitle'))
              .insertBefore($('button.board-menu-toggle', container))
              .on('touchstart mousedown ', ev => {
                this.toggleBrush(ev);
                wrap?.toggleClassSafe('lichessTools-passthrough', !this.drawingBrush);
              });
            }
          } else {
            wrap?.remove();
            $('div.rcontrols div.ricons button.lichessTools-shapeDrawing').remove();
          }
          const handler = lt.getKeyHandler('f');
          if (handler) {
            if (this.options.flipBoard) {
              $('body .round__app .rclock-bottom').each((i, e) => {
                if (e.__initFlipBoard)
                  return;
                e.__initFlipBoard = true;
                $(e).on('click', handler);
              });
            } else {
              $('body .round__app .rclock-bottom').each((i, e) => {
                e.__initFlipBoard = undefined;
                $(e).off('click', handler);
              });
            }
          }
        }
      }
    };

    clearShapes = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const isRound = !!$('main.round,main.puzzle').length;
      if (!isRound || !this.chessground)
        return;
      this.chessground.state.drawable.shapes = [];
      this.chessground.state.dom.redraw();
    };

    handleWakeLock = async () => {
      const lt = this.lichessTools;
      if (this.isPlaying()) {
        if (!this.wakelock) {
          await this.requestWakeLock();
        }
      } else {
        lt.global.clearTimeout(this.wakeLockTimeout);
        this.wakelock?.release();
        this.wakelock=null;
      }
    };

    requestWakeLock = async () => {
      const lt = this.lichessTools;
      if (lt.global.document.visibilityState !== 'visible') return;
      if (this.wakelock?.released === false) return;
      try {
        this.wakelock = await lt.global.navigator.wakeLock?.request('screen');
        if (this.wakelock) {
          console.debug('Wakelock not available or it was refused');
          return;
        }
      } catch (err) {
        console.debug('Wakelock failed:', err);
      }
      lt.global.clearTimeout(this.wakeLockTimeout);
      this.wakeLockTimeout = lt.global.setTimeout(this.requestWakeLock, 1000);
    };

    isTvPage = () => {
      const lt = this.lichessTools;
      return /\/tv\b/i.test(lt.global.location.pathname);
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const mobileExperience = lt.currentOptions.getValue('mobileExperience');
      const mobileExperienceRound = lt.currentOptions.getValue('mobileExperienceRound');
      const colorCount = lt.currentOptions.getValue('colorCount');
      const screenLock = lt.currentOptions.getValue('screenLock');
      const wakeLock = lt.currentOptions.getValue('wakeLock');
      const $ = lt.$;
      const trans = lt.translator;
      const analysis  = lichess.analysis;
      this.logOption('Mobile experience', mobileExperience);
      this.logOption('Mobile game experience', mobileExperienceRound);
      this.logOption('... color count', lt.currentOptions.getValue('colorCount'));
      this.logOption('Screen lock', screenLock);
      this.logOption('Wake lock', wakeLock);
      this.options = {
        showGauge : lt.isOptionSet(mobileExperience, 'showGauge'),
        hideOctopus : lt.isOptionSet(mobileExperience, 'hideOctopus'),
        shapeDrawing : lt.isOptionSet(mobileExperience, 'shapeDrawing'),
        randomNextMove : lt.isOptionSet(mobileExperience, 'randomNextMove'),
        selectiveRandom : lt.isOptionSet(mobileExperience, 'selectiveRandom'),
        inInteractive : lt.isOptionSet(mobileExperience, 'inInteractive'),
        shapeDrawingRound : lt.isOptionSet(mobileExperienceRound, 'shapeDrawingRound'),
        standardButtons : lt.isOptionSet(mobileExperienceRound, 'standardButtons'),
        invert : lt.isOptionSet(mobileExperienceRound, 'invert'),
        flipBoard: lt.isOptionSet(mobileExperienceRound, 'flipBoard'),
        lockBoardPlay : lt.isOptionSet(screenLock, 'play') || lt.isOptionSet(mobileExperience, 'lockBoard'),
        lockBoardPuzzle : lt.isOptionSet(screenLock, 'puzzle') || lt.isOptionSet(mobileExperience, 'lockBoard'),
        wakeBoardPuzzle : lt.isOptionSet(wakeLock, 'puzzle') || lt.isOptionSet(lt.currentOptions.getValue('puzzleOptions'), 'wakeLock'),
        wakeBoardTv : lt.isOptionSet(wakeLock, 'tv') || lt.isOptionSet(lt.currentOptions.getValue('tvOptions'), 'wakeLock'),
        colorCount: colorCount
      };
      lt.pubsub.off('lichessTools.redraw', this.handleRedraw);
      lt.pubsub.off('lichessTools.chapterChange', this.handleRedraw);
      if (analysis) {
        analysis.showEvalGauge = lt.unwrapFunction(analysis.showEvalGauge, 'mobileExperience');
        if (this.options.showGauge) {
          analysis.showEvalGauge = lt.wrapFunction(analysis.showEvalGauge, {
            id: 'mobileExperience',
            after: ($this, result, ...args) => {
              return $this.showGauge()
                     && $this.showAnalysis()
                     && $this.isCevalAllowed()
                     && !$this.outcome();
            }
          });
        }
        analysis.redraw();
      }
      if (this.options.showGauge || this.options.hideOctopus || this.options.standardButtons || this.options.shapeDrawing || this.options.shapeDrawingRound || this.options.randomNextMove) {
        lt.pubsub.on('lichessTools.redraw', this.handleRedraw);
        lt.pubsub.on('lichessTools.chapterChange', this.handleRedraw);
      }
      const isRoundPlay = !!$('main.round').length;
      const isRoundPuzzle = !!$('main.puzzle').length;
      const isTv = /\/tv\b/i.test(lt.global.location.pathname);
      if (isRoundPlay || isRoundPuzzle) {
        const lockBoardElem = $('#top div.site-buttons div.lichessTools-lockBoard');
        if (lt.isMobile() && $.cached('body').is('playing') && ((this.options.lockBoardPlay && isRoundPlay) || (this.options.lockBoardPuzzle && isRoundPuzzle)) ) {
          $.cached('body').toggleClassSafe('lichessTools-lockBoard',true);
          if (this.isBoardLocked === undefined) {
            this.isBoardLocked = lt.storage.get('LiChessTools.boardLocked');
            if (this.isBoardLocked === undefined)
              this.isBoardLocked = true;
          }
          if (!lockBoardElem.length) {
            $('<div></div>')
            .addClass('lichessTools-lockBoard')
            .attr('data-icon', lt.icon.Padlock)
            .attr('title', trans.noarg('lockBoardTitle'))
            .on('click', () => {
              this.isBoardLocked = !this.isBoardLocked;
              lt.storage.set('LiChessTools.boardLocked', this.isBoardLocked);
              $.cached('body').toggleClassSafe('lichessTools-lockBoard', this.isBoardLocked);
            })
            .prependTo($('#top div.site-buttons'));
          }
          $.cached('body').toggleClassSafe('lichessTools-lockBoard', this.isBoardLocked);
        } else {
          $.cached('body').toggleClassSafe('lichessTools-lockBoard',false);
          lockBoardElem.remove();
        }
      }

      if (isRoundPlay || isRoundPuzzle) {
        lt.uiApi.events.off('ply', this.clearShapes);
        $('main div.cg-wrap:not(.lichessTools-boardOverlay)').off('click', this.clearShapes);
        if (this.options.shapeDrawingRound) {
          lt.uiApi.events.on('ply', this.clearShapes);
          $('main div.cg-wrap:not(.lichessTools-boardOverlay)').on('click', this.clearShapes);
        }
      }

      lt.pubsub.off('lichessTools.redraw',this.handleWakeLock);
      lt.pubsub.off('lichessTools.puzzleStart',this.handleWakeLock);
      if (this.options.wakeLockPuzzle && this.isTrainingPage()) {
        lt.pubsub.on('lichessTools.redraw',this.handleWakeLock);
        lt.pubsub.on('lichessTools.puzzleStart',this.handleWakeLock);
        await this.handleWakeLock();
      } else {
        lt.global.clearTimeout(this.wakeLockTimeout);
        this.wakelock?.release();
        this.wakelock=null;
      }

      if (this.options.wakelockTv && this.isTvPage()) {
        this.requestWakeLock();
      } else {
        lt.global.clearTimeout(this.wakeLockTimeout);
        this.wakelock?.release();
      }


      this.handleRedraw();
    }

  }
  LiChessTools.Tools.MobileExperience = MobileExperienceTool;
})();
(() => {
  class MobileExperienceTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'RandomVariation', 'DetectThirdParties'];

    preferences = [
      {
        name: 'mobileExperience',
        category: 'general',
        type: 'multiple',
        possibleValues: ['showGauge', 'hideOctopus', 'shapeDrawing', 'randomNextMove', 'selectiveRandom', 'lockBoard'],
        defaultValue: 'showGauge,randomNextMove,selectiveRandom'
      },
      {
        name: 'mobileExperienceRound',
        category: 'general',
        type: 'multiple',
        possibleValues: ['shapeDrawingRound', 'standardButtons', 'invert'],
        defaultValue: '',
        advanced: true
      },
      {
        name: 'colorCount',
        category: 'general',
        type: 'single',
        possibleValues: [1, 2, 3, 4],
        defaultValue: 1,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'General',
        'options.mobileExperience': 'Mobile device features',
        'options.mobileExperienceRound': 'Mobile device game features',
        'options.colorCount': 'Colors for shapes on mobile',
        'mobileExperience.lockBoard': 'Screen lock when playing',
        'mobileExperience.showGauge': 'Evaluation gauge',
        'mobileExperience.hideOctopus': 'Hide the octopus mascot',
        'mobileExperience.shapeDrawing': 'Analysis arrows',
        'mobileExperience.randomNextMove': 'Random move button',
        'mobileExperience.selectiveRandom': '...only when variations',
        'mobileExperienceRound.shapeDrawingRound': 'Game arrows',
        'mobileExperienceRound.standardButtons': 'Standard buttons',
        'mobileExperienceRound.invert': 'Swap user and clock',
        'shapeDrawingTitle': 'LiChess Tools - draw arrows and circles',
        'randomNextMoveTitle': 'LiChess Tools - random move',
        'colorCount.1': 'one',
        'colorCount.2': 'two',
        'colorCount.3': 'three',
        'colorCount.4': 'four',
        'lockBoardTitle': 'LiChess Tools - screen lock'
      },
      'ro-RO': {
        'options.analysis': 'General',
        'options.mobileExperience': 'Op\u0163iuni pentru aparate mobile',
        'options.mobileExperienceRound': 'Op\u0163iuni pentru joc pe aparate mobile',
        'options.colorCount': 'Culori pentru s\u0103ge\u0163i pe mobile',
        'mobileExperience.lockBoard': 'Fixare ecran c\u00e2nd joci',
        'mobileExperience.showGauge': 'Band\u0103 de evaluare',
        'mobileExperience.hideOctopus': 'Ascunde mascota caracati\u0163\u0103',
        'mobileExperience.shapeDrawing': 'S\u0103ge\u0163i \u00een analiz\u0103',
        'mobileExperience.randomNextMove': 'Buton mutare aleatoare',
        'mobileExperience.selectiveRandom': '...doar c\u00e2nd sunt varia\u0163iuni',
        'mobileExperienceRound.shapeDrawingRound': 'S\u0103ge\u0163i \u00een joc',
        'mobileExperienceRound.standardButtons': 'Butoane standard',
        'mobileExperienceRound.invert': 'Inverseaz\u0103 user \u015fi ceas',
        'shapeDrawingTitle': 'LiChess Tools - deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri',
        'randomNextMoveTitle': 'LiChess Tools - mutare aleatoare',
        'colorCount.1': 'una',
        'colorCount.2': 'dou\u0103',
        'colorCount.3': 'trei',
        'colorCount.4': 'patru',
        'lockBoardTitle': 'LiChess Tools - fixare ecran'
      }
    }

    touchStart = e => {
      if (!this.drawingBrush || !this.chessground) return;
      e.preventDefault();
      e.stopPropagation();
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const ev = e.targetTouches?.[0] || e;
      const pos = [ev.clientX, ev.clientY];
      const square = this.chessground.getKeyAtDomPos(pos);
      this.chessground.state.drawable.current = {
        orig: square,
        brush: this.drawingBrush,
        snapToValidMove: this.chessground.state.drawable.defaultSnapToValidMove,
        pos: pos
      };
      this.chessground.state.dom.redraw();
    };
    touchMove = e => {
      if (!this.drawingBrush || !this.chessground) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.chessground.state.drawable.current) return;
      const ev = e.targetTouches?.[0] || e;
      const pos = [ev.clientX, ev.clientY];
      const square = this.chessground.getKeyAtDomPos(pos);
      const current = this.chessground.state.drawable.current;
      current.pos = pos;
      current.mouseSq = square;
      current.dest = square;
      this.chessground.state.dom.redraw();
    };
    touchEnd = e => {
      if (!this.drawingBrush || !this.chessground) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.chessground.state.drawable.current) return;
      e.preventDefault();
      e.stopPropagation();
      const ev = e.targetTouches?.[0] || e;
      const pos = [ev.clientX, ev.clientY];
      const square = this.chessground.getKeyAtDomPos(pos);
      this.handleGesture(this.chessground.state.drawable.current);
      this.chessground.state.drawable.current = undefined;
      this.chessground.state.dom.redraw();
      lt.pubsub.emit('lichessTools.shapeRank');
    };

    handleGesture = (shape) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!this.chessground) return;
      const drawable = this.chessground.state.drawable;
      const existing = drawable.shapes.find(s => s.orig === shape.orig && s.dest === shape.dest && s.brush === shape.brush);
      lt.arrayRemoveAll(drawable.shapes, s => s.orig === shape.orig && s.dest === shape.dest);
      if (!existing) drawable.shapes.push(shape);
      if (drawable.onChange) drawable.onChange(drawable.shapes);
    };

    playRandomVariation = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis) return;
      const node = lichess.analysis.node;
      const child = lt.getRandomVariation(node);
      if (child) {
        lichess.analysis.userJump(child.path || (path + child.id));
        lichess.analysis.redraw();
      }
    };

    initializeOverlayWrap = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const wrap = $('<div class="cg-wrap lichessTools-boardOverlay">')
        .appendTo('main div.main-board')
        .addClass('lichessTools-passthrough');
      const { Chessground } = await site.asset.embedChessground();
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
      if (!this.chessground) return;
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
        $(ev.target)
          .toggleClass('lichessTools-' + brush + 'Brush', this.drawingBrush == brush);
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

    handleRedraw = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!$.cached('body').is('.mobile')) return;
      const trans = lt.translator;
      const isAnalyse = !!$('main.analyse').length;
      const isRound = !!$('main.round,main.puzzle').length;
      const isEnabled = !!(this.options.shapeDrawing || this.options.shapeDrawingRound || this.options.randomNextMove);
      $.cached('body').toggleClass('lichessTools-mobileExperience', isEnabled);

      let wrap = null;
      this.chessground = null;
      if (isAnalyse) {
        $('main.analyse')
          .toggleClass('lichessTools-gaugeOnMobile', this.options.showGauge)
          .toggleClass('lichessTools-hideOctopus', this.options.hideOctopus);
        wrap = $('main.analyse div.cg-wrap');
        if (this.options.shapeDrawing) {
          this.chessground = lt.lichess.analysis?.chessground;
        }
      } else
        if (isRound) {
          $('main')
            .toggleClass('lichessTools-invert', this.options.invert)
            .toggleClass('lichessTools-standardButtons', this.options.standardButtons);
          wrap = $('main div.cg-wrap.lichessTools-boardOverlay');
          if (this.options.shapeDrawingRound) {
            if (!wrap.length) {
              wrap = await this.initializeOverlayWrap();
            }
            this.chessground = wrap[0]?.chessground;
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
        let addHandler = false;
        if (this.options.shapeDrawing) {
          if (!$('div.analyse__controls div.features button.lichessTools-shapeDrawing').length) {
            $('<button class="fbt">')
              .attr('data-icon', lt.icon.NorthEastDoubleArrow)
              .attr('title', trans.noarg('shapeDrawingTitle'))
              .addClass('lichessTools-shapeDrawing')
              .appendTo('div.analyse__controls div.features');
            addHandler = true;
          }
        } else {
          $('div.analyse__controls div.features button.lichessTools-shapeDrawing').remove();
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
              this.originalHandler = lt.getEventHandlers(elem, 'touchstart')?.at(0)?.bind(elem);
            }
            lt.removeEventHandlers(elem, 'touchstart');
            $('div.analyse__controls')
              .on('touchstart', ev => {
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
              lt.removeEventHandlers(elem, 'touchstart');
              $('div.analyse__controls')
                .on('touchstart', this.originalHandler)
                .off('mousedown', this.clickOrTapAnalysisControls);
            }
          }
        }
      } else
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
                  wrap?.toggleClass('lichessTools-passthrough', !this.drawingBrush);
                });
            }
          } else {
            wrap?.remove();
            $('div.rcontrols div.ricons button.lichessTools-shapeDrawing').remove();
          }
        }
    };

    clearShapes = () => {
      const isRound = !!$('main.round,main.puzzle').length;
      if (!isRound || !this.chessground) return;
      this.chessground.state.drawable.shapes = [];
      this.chessground.state.dom.redraw();
    };

    async start() {
      const lt = this.lichessTools;
      const mobileExperience = lt.currentOptions.getValue('mobileExperience');
      const mobileExperienceRound = lt.currentOptions.getValue('mobileExperienceRound');
      const colorCount = lt.currentOptions.getValue('colorCount');
      const $ = lt.$;
      const trans = lt.translator;
      this.logOption('Mobile experience', mobileExperience);
      this.logOption('... color count', lt.currentOptions.getValue('colorCount'));
      this.options = {
        showGauge: lt.isOptionSet(mobileExperience, 'showGauge'),
        lockBoard: lt.isOptionSet(mobileExperience, 'lockBoard'),
        hideOctopus: lt.isOptionSet(mobileExperience, 'hideOctopus'),
        shapeDrawing: lt.isOptionSet(mobileExperience, 'shapeDrawing'),
        randomNextMove: lt.isOptionSet(mobileExperience, 'randomNextMove'),
        selectiveRandom: lt.isOptionSet(mobileExperience, 'selectiveRandom'),
        shapeDrawingRound: lt.isOptionSet(mobileExperienceRound, 'shapeDrawingRound'),
        standardButtons: lt.isOptionSet(mobileExperienceRound, 'standardButtons'),
        invert: lt.isOptionSet(mobileExperienceRound, 'invert'),
        colorCount: colorCount
      };
      const lichess = lt.lichess;
      lt.pubsub.off('lichessTools.redraw', this.handleRedraw);
      lt.pubsub.off('lichessTools.chapterChange', this.handleRedraw);
      if (this.options.showGauge || this.options.hideOctopus || this.options.standardButtons || this.options.shapeDrawing || this.options.shapeDrawingRound || this.options.randomNextMove) {
        lt.pubsub.on('lichessTools.redraw', this.handleRedraw);
        lt.pubsub.on('lichessTools.chapterChange', this.handleRedraw);
      }
      const isRound = !!$('main.round,main.puzzle').length;
      if (isRound) {
        const lockBoardElem = $('#top div.site-buttons div.lichessTools-lockBoard');
        if (this.options.lockBoard && $.cached('body').is('.mobile.playing')) {
          $.cached('body').addClass('lichessTools-lockBoard');
          if (this.isBoardLocked === undefined) {
            this.isBoardLocked = lt.storage.get('LiChessTools.boardLocked');
            if (this.isBoardLocked === undefined) this.isBoardLocked=true;
          }
          if (!lockBoardElem.length) {
            $('<div></div>')
              .addClass('lichessTools-lockBoard')
              .attr('data-icon', lt.icon.Padlock)
              .attr('title', trans.noarg('lockBoardTitle'))
              .on('click', () => {
                this.isBoardLocked = !this.isBoardLocked;
                lt.storage.set('LiChessTools.boardLocked', this.isBoardLocked);
                $.cached('body').toggleClass('lichessTools-lockBoard',this.isBoardLocked);
              })
              .prependTo($('#top div.site-buttons'));
          }
          $.cached('body').toggleClass('lichessTools-lockBoard',this.isBoardLocked);
        } else {
          $.cached('body').removeClass('lichessTools-lockBoard');
          lockBoardElem.remove();
        }
        lt.uiApi.events.off('ply', this.clearShapes);
        $('main div.cg-wrap:not(.lichessTools-boardOverlay)').off('click', this.clearShapes);
        if (this.options.shapeDrawingRound) {
          lt.uiApi.events.on('ply', this.clearShapes);
          $('main div.cg-wrap:not(.lichessTools-boardOverlay)').on('click', this.clearShapes);
        }
      }
      this.handleRedraw();
    }

  }
  LiChessTools.Tools.MobileExperience = MobileExperienceTool;
})();

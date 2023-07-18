(()=>{
  class MobileExperienceTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange','RandomVariation'];

    preferences=[
      {
        name:'mobileExperience',
        category: 'general',
        type:'multiple',
        possibleValues: ['showGauge','hideOctopus','shapeDrawing','randomNextMove'],
        defaultValue: 'showGauge,randomNextMove'
      },
      {
        name:'colorCount',
        category: 'general',
        type:'single',
        possibleValues: [1,2,3,4],
        defaultValue: '4'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'General',
        'options.mobileExperience': 'Mobile device features',
        'options.colorCount': 'Colors for shapes on mobile',
        'mobileExperience.showGauge':'Evaluation gauge',
        'mobileExperience.hideOctopus':'Hide the octopus mascot',
        'mobileExperience.shapeDrawing':'Draw arrows and circles',
        'mobileExperience.randomNextMove':'Random move button',
        'shapeDrawingTitle': 'LiChess Tools - draw arrows and circles',
        'randomNextMoveTitle': 'LiChess Tools - random move',
        'colorCount.1': 'one',
        'colorCount.2': 'two',
        'colorCount.3': 'three',
        'colorCount.4': 'four',
      },
      'ro-RO':{
        'options.analysis': 'General',                                                                     
        'options.mobileExperience': 'Op\u0163iuni pentru aparate mobile',
        'options.colorCount': 'Culori pentru s\u0103ge\u0163i pe mobile',
        'mobileExperience.showGauge':'Band\u0103 de evaluare',
        'mobileExperience.hideOctopus':'Ascunde mascota caracati\u0163\u0103',
        'mobileExperience.shapeDrawing':'Deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri',
        'mobileExperience.randomNextMove':'Buton mutare aleatoare',
        'shapeDrawingTitle': 'LiChess Tools - deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri',
        'randomNextMoveTitle': 'LiChess Tools - mutare aleatoare',
        'colorCount.1': 'unu',
        'colorCount.2': 'doi',
        'colorCount.3': 'trei',
        'colorCount.4': 'patru',
      }
    }

    touchStart=e=>{
      if (!this.drawingBrush) return;
      e.preventDefault();
      e.stopPropagation();
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const pos=[e.targetTouches[0].clientX,e.targetTouches[0].clientY];
      const square=lichess.analysis.chessground.getKeyAtDomPos(pos);
      lichess.analysis.chessground.state.drawable.current={
        orig: square,
        brush: this.drawingBrush,
        snapToValidMove: lichess.analysis.chessground.state.drawable.defaultSnapToValidMove,
        pos: pos
      };
      lichess.analysis.chessground.state.dom.redraw();
    };
    touchMove=e=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      if (!lichess.analysis.chessground.state.drawable.current) return;
      const pos=[e.targetTouches[0].clientX,e.targetTouches[0].clientY];
      const square=lichess.analysis.chessground.getKeyAtDomPos(pos);
      const current=lichess.analysis.chessground.state.drawable.current;
      current.pos=pos;
      current.mouseSq=square;
      current.dest=square;
      lichess.analysis.chessground.state.dom.redraw();
    };
    touchEnd=e=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      if (!lichess.analysis.chessground.state.drawable.current) return;
      e.preventDefault();
      e.stopPropagation();
      const pos=[e.changedTouches[0].clientX,e.changedTouches[0].clientY];
      const square=lichess.analysis.chessground.getKeyAtDomPos(pos);
      this.handleGesture(lichess.analysis.chessground.state.drawable.current);
      lichess.analysis.chessground.state.drawable.current=undefined;
      lichess.analysis.chessground.state.dom.redraw();
    };

    handleGesture=(shape)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const drawable=lichess.analysis.chessground.state.drawable;
      const existing=drawable.shapes.find(s=>s.orig===shape.orig && s.dest===shape.dest && s.brush===shape.brush);
      parent.arrayRemoveAll(drawable.shapes,s=>s.orig===shape.orig && s.dest===shape.dest);
      if (!existing) drawable.shapes.push(shape);
      drawable.onChange(drawable.shapes);
    };

    playRandomVariation=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess.analysis) return;
      const node = lichess.analysis.node;
      const child = parent.getRandomVariation(node);
      if (child) {
        lichess.analysis.userJump(child.path||(path+child.id));
        lichess.analysis.redraw();
      }
    };

    brushes=['green','red','blue','yellow'];
    handleRedraw=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      $('body').toggleClass('lichessTools-mobileExperience',!!(this.options.shapeDrawing||this.options.randomNextMove));
      $('main.analyse').toggleClass('lichessTools-gaugeOnMobile',this.options.showGauge);
      $('main.analyse').toggleClass('lichessTools-hideOctopus',this.options.hideOctopus);
      if ($('body').is('.mobile')) {
        if (this.options.shapeDrawing) {
          $('div.cg-wrap:not(.lichessTools-shapeDrawing)')
            .addClass('lichessTools-shapeDrawing')
            .on('touchstart',this.touchStart)
            .on('touchmove',this.touchMove)
            .on('touchend',this.touchEnd);
        }
        let addHandler=false;
        if (this.options.shapeDrawing) {
          if (!$('div.analyse__controls div.features button.lichessTools-shapeDrawing').length) {
            $('<button class="fbt">')
              .attr('data-icon','\u21D7')
              .attr('title',trans.noarg('shapeDrawingTitle'))
              .addClass('lichessTools-shapeDrawing')
              .appendTo('div.analyse__controls div.features');
            addHandler=true;
          }
        } else {
          $('div.analyse__controls div.features button.lichessTools-shapeDrawing').remove();
        }
        if (this.options.randomNextMove) {
          if (!$('div.analyse__controls div.jumps button.lichessTools-randomNextMove').length) {
            $('<button class="fbt">')
              .attr('data-icon','\uE035')
              .attr('title',trans.noarg('randomNextMoveTitle'))
              .addClass('lichessTools-randomNextMove')
              .insertBefore($('div.analyse__controls div.jumps button[data-act="next"]'));
            addHandler=true;
          }
        } else {
          $('div.analyse__controls div.jumps button.lichessTools-randomNextMove').remove();
        }
        if (addHandler) {
          const elem=$('.analyse__controls')[0];
          if (elem) {
            if (!this.originalHandler) {
              this.originalHandler=parent.getEventHandlers(elem,'touchstart')?.at(0)?.bind(elem);
            }
            parent.removeEventHandlers(elem,'touchstart');
            $('div.analyse__controls').on('touchstart',ev=>{
              this.originalHandler(ev);
              if ($(ev.target).is('button.lichessTools-shapeDrawing')) {
                ev.preventDefault();
                let index=this.brushes.indexOf(this.drawingBrush)+1;
                this.drawingBrush=index>=this.options.colorCount
                  ? null
                  : this.brushes[index];
                parent.lichess.analysis.chessground.state.drawable.enabled=!this.drawingBrush;
                parent.lichess.analysis.chessground.state.movable.showDests=!this.drawingBrush;
                for (const brush of this.brushes) {
                  $(ev.target)
                    .toggleClass('lichessTools-'+brush+'Brush',this.drawingBrush==brush);
                }
              }
              if ($(ev.target).is('button.lichessTools-randomNextMove')) {
                ev.preventDefault();
                this.playRandomVariation();
              }
            });
          }
        }
      } else {
        $('div.cg-wrap.lichessTools-shapeDrawing')
          .removeClass('lichessTools-shapeDrawing')
          .off('touchstart',this.touchStart)
          .off('touchmove',this.touchMove)
          .off('touchend',this.touchEnd);
        $('div.analyse__controls div.features button.lichessTools-shapeDrawing').remove();
        $('div.analyse__controls div.jumps button.lichessTools-randomNextMove').remove();
        if (this.originalHandler) {
          const elem=$('.analyse__controls')[0];
          if (elem && this.originalHandler) {
            parent.removeEventHandlers(elem,'touchstart');
            $('div.analyse__controls').on('touchstart',this.originalHandler);
          }
        }
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('mobileExperience');
      this.logOption('Mobile experience', value);
      this.options={
        showGauge:parent.isOptionSet(value,'showGauge'),
        hideOctopus:parent.isOptionSet(value,'hideOctopus'),
        shapeDrawing:parent.isOptionSet(value,'shapeDrawing'),
        randomNextMove:parent.isOptionSet(value,'randomNextMove'),
        colorCount: parent.currentOptions.getValue('colorCount')
      };
      const lichess=parent.lichess;
      lichess.pubsub.off('redraw',this.handleRedraw);
      lichess.pubsub.off('chapterChange',this.handleRedraw);
      if (this.options.showGauge || this.options.hideOctopus || this.options.shapeDrawing || this.options.randomNextMove) {
        lichess.pubsub.on('redraw',this.handleRedraw);
        lichess.pubsub.on('chapterChange',this.handleRedraw);
        this.handleRedraw();
      }
    }

  }
  LiChessTools.Tools.MobileExperience=MobileExperienceTool;
})();

(()=>{
  class MobileExperienceTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'mobileExperience',
        category: 'general',
        type:'multiple',
        possibleValues: ['showGauge','hideOctopus','shapeDrawing'],
        defaultValue: 'showGauge'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'General',
        'options.mobileExperience': 'Mobile device features',
        'mobileExperience.showGauge':'Show evaluation gauge on small screens',
        'mobileExperience.hideOctopus':'Hide the octopus mascot',
        'mobileExperience.shapeDrawing':'Draw arrows and circles',
        'shapeDrawingTitle': 'LiChess Tools - draw arrows and circles'
      },
      'ro-RO':{
        'options.analysis': 'General',                                                                     
        'options.mobileExperience': 'Op\u0163iuni pentru aparate mobile',
        'mobileExperience.showGauge':'Arat\u0103 banda de evaluare pe ecrane \u00eenguste',
        'mobileExperience.hideOctopus':'Ascunde mascota caracati\u0163\u0103',
        'mobileExperience.shapeDrawing':'Deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri',
        'shapeDrawingTitle': 'LiChess Tools - deseneaz\u0103 s\u0103ge\u0163i \u015Fi cercuri'
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
      lichess.analysis.chessground.state.drawable.current.pos=pos;
      lichess.analysis.chessground.state.drawable.current.mouseSq=square;
      lichess.analysis.chessground.state.drawable.current.dest=square;
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
      lichess.analysis.chessground.state.drawable.shapes.push({...shape});
      lichess.analysis.chessground.state.drawable.onChange(lichess.analysis.chessground.state.drawable.shapes);
    };

    brushes=['green','red','blue','yellow'];
    handleRedraw=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      $('main.analyse').toggleClass('lichessTools-gaugeOnMobile',this.options.showGauge);
      $('main.analyse').toggleClass('lichessTools-hideOctopus',this.options.hideOctopus);
      if (this.options.shapeDrawing && $('body').is('.mobile')) {
        $('div.cg-wrap:not(.lichessTools-shapeDrawing)')
          .addClass('lichessTools-shapeDrawing')
          .on('touchstart',this.touchStart)
          .on('touchmove',this.touchMove)
          .on('touchend',this.touchEnd);
        if (!$('div.analyse__controls div.features button.lichessTools-shapeDrawing').length) {
          $('<button class="fbt">')
            .attr('data-icon','\u21D7')
            .attr('title',trans.noarg('shapeDrawingText'))
            .addClass('lichessTools-shapeDrawing')
            .appendTo('div.analyse__controls div.features');
          const elem=$('.analyse__controls')[0];
          if (elem) {
            if (!this.originalHandler) {
              this.originalHandler=parent.getEventHandlers(elem,'touchstart')?.at(0)?.bind(elem);
            }
            parent.removeEventHandlers(elem,'touchstart');
            $('div.analyse__controls').on('touchstart',ev=>{
              this.originalHandler(ev);
              if (!$(ev.target).is('button.lichessTools-shapeDrawing')) return;
              ev.preventDefault();
              let index=this.brushes.indexOf(this.drawingBrush)+1;
              this.drawingBrush=index>=this.brushes.length
                ? null
                : this.brushes[index];
              parent.lichess.analysis.chessground.state.drawable.enabled=!this.drawingBrush;
              for (const brush of this.brushes) {
                $(ev.target)
                  .toggleClass('lichessTools-'+brush+'Brush',this.drawingBrush==brush);
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
      };
      const lichess=parent.lichess;
      lichess.pubsub.off('redraw',this.handleRedraw);
      lichess.pubsub.off('chapterChange',this.handleRedraw);
      if (this.options.showGauge || this.options.hideOctopus || this.options.shapeDrawing) {
        lichess.pubsub.on('redraw',this.handleRedraw);
        lichess.pubsub.on('chapterChange',this.handleRedraw);
      }
    }

  }
  LiChessTools.Tools.MobileExperience=MobileExperienceTool;
})();

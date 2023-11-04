(()=>{
  class MovesFromTranspositionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=[];

    preferences=[
      {
        name:'movesFromTranspositions',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.movesFromTranspositions': 'Show next moves from transpositions',
        'transpositionBox': 'LiChess Tools - moves following transpositions'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.movesFromTranspositions': 'Prezint\u0103 mut\u0103ri urm\u0103toare transpozi\u0163iilor la pozi\u0163ia curent\u0103',
        'transpositionBox': 'LiChess Tools - mut\u0103ri din transpozi\u0163ii'
      }
    }

    findTranspositions=()=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis||!parent.isTreeviewVisible()) return;
      const currNode = analysis.node;
      if (!currNode) return;
      const tools=$('div.analyse__tools');
      let fork=$('div.lichessTools-transpositions',tools);
      this.state=parent.traverse();
      parent.assertPathSet(currNode);
      let transpositions=currNode.transposition;
      if (parent.transpositionBehavior?.excludeSameLine) {
        transpositions=transpositions?.filter(n=>n===currNode||(n.path&&!n.path.startsWith(currNode.path)&&!currNode.path.startsWith(n.path)));
      }  
      if (!transpositions||transpositions.length<=1) {
        fork.remove();
        return;
      }
      if (!fork.length) {
        fork=$('<div>')
          .addClass('analyse__fork lichessTools-transpositions')
          .attr('title',trans.noarg('transpositionBox'));
      }
      if (!fork.prev().is('.analyse__fork')) {
        fork.insertAfter($('.analyse__fork, .analyse__moves',tools).last());
      }
      transpositions=transpositions.filter(n=>n!=currNode);
      const noDuplicates=parent.transpositionBehavior?.groupSameMove;
      const transpoData=transpositions.map(n=>n.uci).join(',')+(noDuplicates?'ND':'D');
      if (fork.data('transpositions')==transpoData) return;
      fork.data('transpositions',transpoData);
      fork.empty();
      const sans=currNode.children.map(c=>c.san);
      for (const node of transpositions) {
        parent.assertPathSet(node);
        for (const child of node.children) {
          const path=node.path+child.id;
          let forkMove=$('move',fork).filter((i,e)=>$(e).attr('p')==path);
          if (forkMove.length) continue;
          if (noDuplicates && sans.includes(child.san)) continue;
          sans.push(child.san);
          let targetElem=parent.getElementForPath(path);
          forkMove=$('<move>')
            .attr('p',path)
            .append($('<index>').addClass('sbhint'+child.ply).text('T'+Math.ceil(child.ply/2)+(child.ply%2?'.':'...')))
            .append($('<san>').text(child.san))
            .on('mouseover',function() {
              $('.analyse__fork move').removeClass('selected');
              $(targetElem).addClass('lichessTools-highlight');
              analysis.explorer.setHovering(lichess.analysis.node.fen,child.uci);
            }).on('mouseout',function() {
              $(targetElem).removeClass('lichessTools-highlight');
              analysis.explorer.setHovering(null,null);
            }).on('click',function(ev) {
              ev.preventDefault();
              analysis.userJumpIfCan(path);
              analysis.redraw();
            }).appendTo(fork);
          const glyph=child.glyphs?.at(0);
          if (glyph) {
            forkMove.append($('<glyph>').attr('title',glyph.name).text(glyph.symbol));
          } 
        }
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('stickyAnalysis');
      this.logOption('Next moves from transpositions', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const tools=$('div.analyse__tools');
      const fork=$('div.lichessTools-transpositions',tools).remove();
      lichess.pubsub.off('redraw', this.findTranspositions);
      if (value) {
        lichess.pubsub.on('redraw', this.findTranspositions);
      }
      this.findTranspositions();
    }

  }
  LiChessTools.Tools.MovesFromTranspositions=MovesFromTranspositionsTool;
})();

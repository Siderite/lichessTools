(() => {
  class BoardStyleTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'boardStyle',
        category: 'appearance',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.boardStyle': 'Board styling'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.boardStyle': 'Stilare tabl\u0103'
      }
    }

    addLastMoveArrow = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('cg-container').each((i,e)=>{
        const container = $(e);
        const offset=container.offset();
        container.toggleClassSafe('lichessTools-boardStyle',true);

        const selectedKey = container.find('square.selected').prop('cgKey');
        container.find('piece')
          .each((i,e)=>{
            $(e).toggleClassSafe('selected',!!(selectedKey && e.cgKey==selectedKey));
          });

        const lastMoves = container.find('.last-move').get();
        let arrow = container.find('.lichessTools-lastMoveArrow');
        if (lastMoves.length==2) {
          $(lastMoves[0])
            .toggleClassSafe('dest',true)
            .toggleClassSafe('orig',false);
          $(lastMoves[1])
            .toggleClassSafe('dest',false)
            .toggleClassSafe('orig',true);

          const destKey = lastMoves[0]?.cgKey;
          container.find('piece.moved')
            .each((i,e)=>{
              $(e).toggleClassSafe('moved',e.cgKey==destKey);
            });
          const piece = container.find('piece')
                          .filter((i,e)=>e.cgKey===destKey)
                          .toggleClassSafe('moved',true)
                          .get()[0];
          const cgPiece = piece
            ? piece.cgPiece.split(' ')
            : [destKey?.endsWith('1')?'white':'black','king'];
          const isBlackTurn = cgPiece[0]=='white';
          const lastMovedPiece = cgPiece[1];

          const pos = lastMoves
                            .map(s=>s.getBoundingClientRect())
                            .map(r=>({ x:r.x+r.width/2-offset.left, y:r.y+r.height/2-offset.top }));
          const dest = pos[0];
          const orig = pos[1];
          if (!arrow.length) {
            arrow = $(`<svg class="lichessTools-lastMoveArrow">
      <defs>
        <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="3" refY="1.75" orient="auto" markerUnits="strokeWidth">
          <polygon points="0 0, 5 1.75, 0 3.5" class="arrowhead" />
        </marker>
      </defs>
      <line class="arrow-line" marker-end="url(#arrowhead)" />
    </svg>`).appendTo(container);
          }
          arrow.find('.arrow-line')
            .attrSafe('x1',orig.x)
            .attrSafe('y1',orig.y)
            .attrSafe('x2',dest.x)
            .attrSafe('y2',dest.y);
          const side = isBlackTurn ? 'black' : 'white';
          const prevSide = container.attr('sideToPlay');
          const prevDestKey = container.attr('lastMoveSquare');
          if (side!=prevSide) {
            const prevPiece = container.attr('lastMovedPiece');
            if (prevPiece && prevDestKey==destKey) {
              container.attrSafe('lastPieceCaptured',prevPiece);
            } else {
              container.removeAttrSafe('lastPieceCaptured');
            }
          }
          container
            .attrSafe('sideToPlay',side)
            .attrSafe('lastMovedPiece',lastMovedPiece)
            .attrSafe('lastMoveSquare',destKey);
            
        } else {
          arrow.remove();
          container
            .removeAttrSafe('sideToPlay')
            .removeAttrSafe('lastMovedPiece')
            .removeAttrSafe('lastMoveSquare')
            .removeAttrSafe('lastPieceCaptured');
        }
      });
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('boardStyle');
      this.logOption('Board style', value);
      const $ = lt.$;
      $('body').observer()
        .off('square.last-move,square.selected',this.addLastMoveArrow);
      $('.lichessTools-lastMoveArrow').remove();
      $('cg-container').toggleClassSafe('lichessTools-boardStyle',false);
      if (value) {
        $('body').observer()
          .on('square.last-move,square.selected',this.addLastMoveArrow, { attributes: true });
        this.addLastMoveArrow();
      }
    }

  }
  LiChessTools.Tools.BoardStyle = BoardStyleTool;
})();

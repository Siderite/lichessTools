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

    getSquarePosition = (square) => {
      const transform = square.style?.transform;
      const m = /translate\(\s*(?<x>\d+(?:\.\d+)?)px\s*,\s*(?<y>\d+(?:\.\d+)?)px\s*\)/.exec(transform);
      if (!m) return null;
      const position = { left: +m.groups.x, top: +m.groups.y };
      return position;
    };

    processBoards = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('cg-container').each((i,e)=>{
        const container = $(e);
        const containerWidth = e.clientWidth;
        if (!containerWidth) return;
        const q = 800/containerWidth;
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

          if (e.usesArrow !== false)
          {
            const halfSquare = containerWidth/16;
            const pos = lastMoves
                            .map(s=>this.getSquarePosition(s))
                            .filter(r=>r)
                            .map(r=>({ x:q*(r.left+halfSquare), y:q*(r.top+halfSquare) }));
            if (pos.length!=2) return;
            const dest = pos[0];
            const orig = pos[1];
            if (!arrow.length) {
              arrow = $(`<svg class="lichessTools-lastMoveArrow" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="arrowGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" class="stop-0" />
            <stop offset="100%" class="stop-100" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="3" refY="1.75" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 5 1.75, 0 3.5" class="arrowhead" />
          </marker>
        </defs>
        <line class="arrow-line" />
      </svg>`).appendTo(container);
            }
            arrow.find('.arrow-line')
              .attrSafe('x1',orig.x)
              .attrSafe('y1',orig.y)
              .attrSafe('x2',dest.x)
              .attrSafe('y2',dest.y);
            arrow.find('#arrowGradient')
              .attrSafe('x1',orig.x)
              .attrSafe('y1',orig.y)
              .attrSafe('x2',dest.x)
             .attrSafe('y2',dest.y);
          }
          if (e.usesArrow === undefined) {
            e.usesArrow = arrow.css('display') != 'none';
          }
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
            .attrSafe('sideToPlay','white')
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
        .off('square.last-move,square.selected',this.processBoards);
      $('.lichessTools-lastMoveArrow').remove();
      $('cg-container').toggleClassSafe('lichessTools-boardStyle',false);
      if (value) {
        $('body').observer()
          .on('square.last-move,square.selected',this.processBoards, { attributes: true });
        this.processBoards();
      }
    }

  }
  LiChessTools.Tools.BoardStyle = BoardStyleTool;
})();

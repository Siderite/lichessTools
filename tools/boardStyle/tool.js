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
      if (!transform) return null;
      let m = /translate(?:3d)?\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px/.exec(transform);
      if (m) return { left: +m[1], top: +m[2] };
      m = /matrix\(([^)]+)\)/.exec(transform);
      if (m) {
        const parts = m[1].split(',');
        if (parts.length>=6) return { left: +parts[4], top: +parts[5] };
      }
      m = /matrix3d\(([^)]+)\)/.exec(transform);
      if (m) {
        const parts = m[1].split(',');
        if (parts.length>=16) return { left: +parts[12], top: +parts[13] };
      }
      return null;
    };

    processBoardsDirect = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const bodyClass = $('body').attr('class') || '';
      $('cg-container').each((i,e)=>{
        const container = $(e);
        const containerWidth = e.clientWidth;
        if (!containerWidth) {
          container.find('.lichessTools-lastMoveArrow').remove();
          return;
        }
        const q = 800/containerWidth;
        container.toggleClassSafe('lichessTools-boardStyle',true);

        const selectedKey = container.find('square.selected').filter((i,s)=>{
          const square = $(s);
          return square.css('display') != 'none' && square.css('visibility') != 'hidden';
        }).prop('cgKey');
        container.find('piece')
          .each((i,e)=>{
            $(e).toggleClassSafe('selected',!!(selectedKey && e.cgKey==selectedKey));
          });

        const lastMoves = container.find('square.last-move').filter((i,s)=>{
          const square = $(s);
          return square.css('display') != 'none' && square.css('visibility') != 'hidden';
        }).get();
        let arrow = container.find('.lichessTools-lastMoveArrow');
        if (arrow.length > 1) {
          const keep = $(arrow[0]);
          arrow.filter((j,a)=>j).remove();
          arrow = keep;
        }
        if (e.__ltArrowClass != bodyClass) {
          e.__ltArrowClass = bodyClass;
          e.usesArrow = undefined;
        }
        const ensureArrow = () => {
          let existing = container.find('.lichessTools-lastMoveArrow');
          if (existing.length > 1) {
            const keep = $(existing[0]);
            existing.filter((j,a)=>j).remove();
            return keep;
          }
          if (existing.length) return existing;
          return $(`<svg class="lichessTools-lastMoveArrow" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="arrowGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" class="stop-0" />
            <stop offset="100%" class="stop-100" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="3" refY="1.75" orient="auto-start-reverse" markerUnits="strokeWidth">
            <polygon points="0 0, 5 1.75, 0 3.5" class="arrowhead" />
          </marker>
        </defs>
        <line class="arrow-line" />
      </svg>`).appendTo(container);
        };
        if (lastMoves.length==2) {
          let pieceAt = {};
          container.find('piece').each((i,p)=>{
            if (p.cgKey) pieceAt[p.cgKey] = p;
          });
          const lastKeys = [lastMoves[0]?.cgKey, lastMoves[1]?.cgKey];
          let destIndex = 0;
          const hasPiece = [!!(lastKeys[0] && pieceAt[lastKeys[0]]), !!(lastKeys[1] && pieceAt[lastKeys[1]])];
          if (hasPiece[1] && !hasPiece[0]) destIndex = 1;
          const movedPiece = container.find('piece.moved').get()[0];
          if (movedPiece?.cgKey) {
            if (lastKeys[1] == movedPiece.cgKey) destIndex = 1;
            else if (lastKeys[0] == movedPiece.cgKey) destIndex = 0;
          }
          const origIndex = destIndex ? 0 : 1;
          for (let index = 0; index < 2; index++) {
            const square = $(lastMoves[index]);
            square.attrSafe('dest', index == destIndex ? true : null);
            square.attrSafe('orig', index == origIndex ? true : null);
          }

          const destKey = lastKeys[destIndex];
          const origKey = lastKeys[origIndex];
          if (e.usesArrow === undefined) {
            const candidate = ensureArrow();
            const shown = candidate.css('display') != 'none';
            if (!shown) candidate.remove();
            e.usesArrow = shown;
            arrow = shown ? candidate : container.find('.lichessTools-lastMoveArrow');
          } else if (e.usesArrow === false) {
            if (arrow.length) arrow.remove();
            arrow = container.find('.lichessTools-lastMoveArrow');
          } else if (!arrow.length) {
            arrow = ensureArrow();
          }

          container.find('piece.moved')
            .each((i,p)=>{
              $(p).toggleClassSafe('moved',p.cgKey==destKey);
            });
          const destPiece = pieceAt[destKey];
          if (destPiece) $(destPiece).toggleClassSafe('moved',true);
          const cgPiece = destPiece?.cgPiece
            ? destPiece.cgPiece.split(' ')
            : [destKey?.endsWith('1') ? 'white' : 'black', 'king'];
          const isBlackTurn = cgPiece[0] == 'white';
          const lastMovedPiece = cgPiece[1];

          if (e.usesArrow !== false) {
            const halfSquare = containerWidth/16;
            const pos = [lastMoves[destIndex], lastMoves[origIndex]]
              .map(s=>this.getSquarePosition(s))
              .filter(r=>r)
              .map(r=>({ x:q*(r.left+halfSquare), y:q*(r.top+halfSquare) }));
            if (pos.length == 2) {
              if (!arrow.length) arrow = ensureArrow();
              const dest = pos[0];
              const orig = pos[1];
              const dist = Math.sqrt(Math.pow(dest.x-orig.x,2)+Math.pow(dest.y-orig.y,2));
              const shortener = dist == 0 ? 1 : (dist - 50/q)/dist;
              const shorterDest = {
                x: Math.round(orig.x+(dest.x-orig.x)*shortener),
                y: Math.round(orig.y+(dest.y-orig.y)*shortener)
              };
              arrow.find('.arrow-line')
                .attrSafe('x1',orig.x)
                .attrSafe('y1',orig.y)
                .attrSafe('x2',shorterDest.x)
                .attrSafe('y2',shorterDest.y);
              arrow.find('#arrowGradient')
                .attrSafe('x1',orig.x)
                .attrSafe('y1',orig.y)
                .attrSafe('x2',shorterDest.x)
                .attrSafe('y2',shorterDest.y);
              const fileDiff = destKey && origKey ? Math.abs(destKey[0].charCodeAt(0)-origKey[0].charCodeAt(0)) : 0;
              const isCastle = lastMovedPiece == 'king' && (fileDiff > 1 || Math.abs(dest.x-orig.x)>200);
              arrow.toggleClassSafe('castle',isCastle);
            } else if (arrow.length) {
              arrow.remove();
              arrow = container.find('.lichessTools-lastMoveArrow');
            }
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
          if (arrow.length) arrow.remove();
          container.find('square.last-move')
            .attrSafe('dest',null)
            .attrSafe('orig',null);
          container
            .attrSafe('sideToPlay','white')
            .removeAttrSafe('lastMovedPiece')
            .removeAttrSafe('lastMoveSquare')
            .removeAttrSafe('lastPieceCaptured');
        }
        const opening = container.closest('.lichessTools-withOpening').prop('openingData');
        container.attrSafe('opening',opening?.opening || null);
      });
    };
    processBoards = this.lichessTools.debounce(this.processBoardsDirect,100);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('boardStyle');
      this.logOption('Board style', value);
      const $ = lt.$;
      $('body').observer()
        .off('square.last-move,square.selected,body,cg-wrap',this.processBoards);
      $('.lichessTools-lastMoveArrow').remove();
      $('cg-container').toggleClassSafe('lichessTools-boardStyle',false);
      lt.uiApi.events.off('ply', this.processBoards);
      if (value) {
        $('body').observer()
          .on('square.last-move,square.selected,body,cg-wrap',this.processBoards, { attributes: true });
        lt.uiApi.events.on('ply', this.processBoards);
        this.processBoards();
      }
    }

  }
  LiChessTools.Tools.BoardStyle = BoardStyleTool;
})();

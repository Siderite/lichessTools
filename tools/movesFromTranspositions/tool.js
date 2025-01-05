(() => {
  class MovesFromTranspositionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['TranspositionBehavior'];

    preferences = [
      {
        name: 'movesFromTranspositions',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.movesFromTranspositions': 'Show next moves from transpositions',
        'transpositionBox': 'LiChess Tools - moves following transpositions'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.movesFromTranspositions': 'Prezint\u0103 mut\u0103ri urm\u0103toare transpozi\u0163iilor la pozi\u0163ia curent\u0103',
        'transpositionBox': 'LiChess Tools - mut\u0103ri din transpozi\u0163ii'
      }
    }

    findTranspositions = () => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis || !lt.isTreeviewVisible()) return;
      const currNode = analysis.node;
      if (!currNode) return;
      const nodePath = analysis.path;
      const tools = $('div.analyse__tools');
      let fork = $('div.lichessTools-transpositions', tools);
      this.state = lt.traverse();
      let transpositions = currNode.transposition;
      if (lt.transpositionBehavior?.excludeSameLine) {
        transpositions = transpositions?.filter(n => n === currNode || (n.path && !n.path.startsWith(nodePath) && !nodePath.startsWith(n.path)));
      }
      if (!transpositions || transpositions.length <= 1) {
        fork.remove();
        return;
      }
      if (!fork.length) {
        fork = $('<div>')
          .addClass('analyse__fork lichessTools-transpositions')
          .attr('title', trans.noarg('transpositionBox'));
      }
      if (!fork.prev().is('.analyse__fork')) {
        fork.insertAfter($('.analyse__fork, .analyse__moves', tools).last());
      }
      transpositions = transpositions.filter(n => n != currNode);
      const noDuplicates = lt.transpositionBehavior?.groupSameMove;
      const transpoData = transpositions.map(n => n.uci).join(',') + (noDuplicates ? 'ND' : 'D');
      if (fork[0]?.dataset?.transpositions == transpoData) return;
      fork.data('transpositions', transpoData);
      fork.empty();

      const addForkMove = (targetElem, path, child, isNextMove) => {
        const prefix = isNextMove ? '' : 'T';
        const forkMove = $('<move>')
          .attr('p', path)
          .append($('<index>').addClass('sbhint' + child.ply).text(prefix + Math.ceil(child.ply / 2) + (child.ply % 2 ? '.' : '...')))
          .append($('<san>').text(child.san))
          .on('mouseover', function () {
            $('.analyse__fork move').removeClass('selected');
            $(targetElem).addClass('lichessTools-highlight');
            analysis.explorer.setHovering(lichess.analysis.node.fen, child.uci);
          }).on('mouseout', function () {
            $(targetElem).removeClass('lichessTools-highlight');
            analysis.explorer.setHovering(null, null);
          }).on('click', function (ev) {
            ev.preventDefault();
            analysis.userJumpIfCan(path);
            analysis.redraw();
          });
        const glyph = child.glyphs?.at(0);
        if (glyph) {
          forkMove.append($('<glyph>').attr('title', glyph.name).text(glyph.symbol));
        }
        if (isNextMove) {
          forkMove.prependTo(fork);
        } else {
          forkMove.appendTo(fork);
        }
      };

      const sans = currNode.children.map(c => c.san);
      let onlyMoveAdded = false;
      for (const node of transpositions) {
        if (node.path === undefined) {
          continue;
        }
        for (const child of node.children) {
          const path = node.path + child.id;
          const forkMove = $('move', fork).filter((i, e) => $(e).attr('p') == path);
          if (forkMove.length) continue;
          const targetElem = lt.getElementForPath(path);
          if (currNode.children.length == 1 && child.san == currNode.children[0].san && !onlyMoveAdded) {
            addForkMove(targetElem, path, child, true);
            onlyMoveAdded = true;
          };
          if (noDuplicates && sans.includes(child.san)) {
            continue;
          }
          sans.push(child.san);
          addForkMove(targetElem, path, child, false);
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('movesFromTranspositions');
      this.logOption('Next moves from transpositions', value);
      this.options = { enabled: !!value };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const tools = $('div.analyse__tools');
      $('div.lichessTools-transpositions', tools).remove();
      lt.pubsub.off('lichessTools.redraw', this.findTranspositions);
      if (value) {
        lt.pubsub.on('lichessTools.redraw', this.findTranspositions);
        this.findTranspositions();
      }
    }

  }
  LiChessTools.Tools.MovesFromTranspositions = MovesFromTranspositionsTool;
})();

(() => {
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitEsmLoaded', 'EmitChapterChange'];

    preferences = [
      {
        name: 'extraChart',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['material', 'principled', 'tension', 'potential', 'brilliant', 'moreBrilliant', 'local', 'accuracy', 'sharpness', 'smooth', 'gauge', 'accuracyPlus'],
        defaultValue: 'material,principled,tension,brilliant,accuracy,smooth,gauge,accuracyPlus',
        defaultNotLoggedInValue: 'material,principled,tension,brilliant,accuracy,smooth,gauge,local,moreBrilliant,accuracyPlus',
        advanced: true
      },
      {
        name: 'christmas',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    upgrades = [
      { name:'extraChart', value:'accuracyPlus', version: '2.4.5', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.extraChart': 'Extra analysis charting',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principled',
        'extraChart.tension': 'Max tension',
        'extraChart.potential': 'Max potential',
        'extraChart.local': 'Local eval',
        'extraChart.accuracy': 'Accuracy',
        'extraChart.sharpness': 'Sharpness',
        'extraChart.brilliant': 'Find interesting moves',
        'extraChart.moreBrilliant': '... more moves',
        'extraChart.smooth': 'Chart smoothing',
        'extraChart.gauge': 'on Eval gauge',
        'extraChart.accuracyPlus': 'More info on Accuracy',
        'chartInfoTitle': 'LiChess Tools - extra charting',
        'tensionLineTitle': 'Max tension',
        'potentialLineTitle': 'Max potential',
        'goodMovesText': 'good/brilliant/interesting moves',
        'goodMovesTitle': 'LiChess Tools - good/brilliant/interesting moves',
        'merryChristmas': 'Merry Christmas from LiChess Tools!',
        'options.christmas': 'Show Christmas lights on chart on the 25th of December',
        'estimatedRating': 'Estimated rating: %s'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.extraChart': 'Grafice de analiz\u0103 \u00een plus',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principial',
        'extraChart.tension': 'Tensiune maxim\u0103',
        'extraChart.potential': 'Poten\u0163ial maxim',
        'extraChart.local': 'Evaluare local\u0103',
        'extraChart.accuracy': 'Acurate\u0163e',
        'extraChart.sharpness': 'Periculozitate',
        'extraChart.brilliant': 'G\u0103se\u015Fte mut\u0103ri interesante',
        'extraChart.moreBrilliant': '... mai multe mut\u0103ri',
        'extraChart.smooth': 'Netezire grafice',
        'extraChart.gauge': 'pe bara de evaluare',
        'extraChart.accuracyPlus': 'Informa\u0163ii \u00een plus pe Acurate\u0163e',
        'chartInfoTitle': 'LiChess Tools - grafice \u00een plus',
        'tensionLineTitle': 'Tensiune maxim\u0103',
        'potentialLineTitle': 'Poten\u0163ial maxim',
        'goodMovesText': 'mut\u0103ri bune/briliante/interesante',
        'goodMovesTitle': 'LiChess Tools - mut\u0103ri bune/briliante/interesante',
        'merryChristmas': 'Cr\u0103ciun fericit de la LiChess Tools!',
        'estimatedRating': 'Rating estimat: %s'
      }
    }

    thematic = (dark, light) => {
      const lt = this.lichessTools;
      return () => lt.isDark() ? dark : light;
    };

    colors = {
      originalChart: '#D85000',
      materialChart: '#258F0B',
      principledChart: '#250B8F',
      localChart: this.thematic('#EFEF00A0','#705800A0'),
      localChartHover: this.thematic('#FFFF00','#604800'),
      accuracyChart: this.thematic('#FF00FF','#700058'),
      sharpnessChart: this.thematic('#FFA0A0','#B09090'),
      maxTensionLine: '#FF0000',
      maxPotentialLine: '#008000',
      interestingMoves: this.thematic('#168226','#009914')
    };

    pieceMaterial = {
      'k': 0,
      'q': 900,
      'r': 500,
      'b': 310,
      'n': 300,
      'p': 100
    };

    getNodeTurn = (node) => {
      const isWhite = node.fen
        ? node.fen.includes(' w ')
        : node.ply % 2 == 0;
      return isWhite ? 1 : -1;
    };

    simpleMaterial = (node, isTotal, side) => {
      let result = 0;
      if (!node.fen) return result;
      const board = node.fen.split(' ')[0];
      for (const ch of board) {
        const p = this.pieceMaterial[ch.toLowerCase()];
        if (p) {
          const m = ch === ch.toUpperCase() ? 1 : -1;
          if (!side || side == m) {
            result += isTotal
              ? p
              : m * p;
          }
        }
      }
      return result;
    };

    evaluator = LiChessTools.Evaluator
                  ? new LiChessTools.Evaluator()
                  : { evaluate: (fen)=>0 };
    heuristic = node => {
      return this.evaluator.evaluate(node.fen);
    }

    onBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

    pieceTension = (x, y, board, withSupport) => {
      const underAttack = [];
      var ch = board[y][x];
      if (!ch) return underAttack;
      const m = ch === ch.toUpperCase() ? 1 : -1;
      switch (ch.toLowerCase()) {
        case 'k':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx && !dy) continue;
              if (!this.onBoard(x + dx, y + dy)) continue;
              const pc = board[y + dy][x + dx];
              if (!pc) continue;
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x + dx,
                  y: y + dy,
                  pc: pc
                });
              }
            }
          }
          break;
        case 'q':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx && !dy) continue;
              const isDiagonal = dx && dy;
              const isForward = dy === -m;
              for (let i = 1; i < 8; i++) {
                if (!this.onBoard(x + dx * i, y + dy * i)) break;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (isDiagonal && pc.toLowerCase() === 'b') continue;
                  if (!isDiagonal && pc.toLowerCase() === 'r') continue;
                  if ((isForward && pc.toLowerCase() === 'p') || pc.toLowerCase() === 'k') {
                    const ppc = this.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'r':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if ((dx && dy) || (!dx && !dy)) continue;
              for (let i = 1; i < 8; i++) {
                if (!this.onBoard(x + dx * i, y + dy * i)) break;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (pc.toLowerCase() === 'r') continue;
                  if (pc.toLowerCase() === 'k') {
                    const ppc = this.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'b':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx || !dy) continue;
              const isForward = dy === -m;
              for (let i = 1; i < 8; i++) {
                if (!this.onBoard(x + dx * i, y + dy * i)) break;;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (pc.toLowerCase() === 'b') continue;
                  if ((isForward && pc.toLowerCase() === 'p') || pc.toLowerCase() === 'k') {
                    const ppc = this.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'n':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx || !dy) continue;
              if (this.onBoard(x + dx * 1, y + dy * 2)) {
                const pc = board[y + dy * 2][x + dx * 1];
                if (pc) {
                  const pm = pc === pc.toUpperCase() ? 1 : -1;
                  if (m != pm) {
                    underAttack.push({
                      m: m,
                      sx: x,
                      sy: y,
                      spc: ch,
                      x: x + dx * 1,
                      y: y + dy * 2,
                      pc: pc
                    });
                  }
                }
              }
              if (this.onBoard(x + dx * 2, y + dy * 1)) {
                const pc = board[y + dy * 1][x + dx * 2];
                if (pc) {
                  const pm = pc === pc.toUpperCase() ? 1 : -1;
                  if (m != pm) {
                    underAttack.push({
                      m: m,
                      sx: x,
                      sy: y,
                      spc: ch,
                      x: x + dx * 2,
                      y: y + dy * 1,
                      pc: pc
                    });
                  }
                }
              }
            }
          }
          break;
        case 'p':
          if (this.onBoard(x - 1, y - m)) {
            const pc = board[y - m][x - 1];
            if (pc) {
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x - 1,
                  y: y - m,
                  pc: pc
                });
              }
            } else if (board.enpassant && board.enpassant.x == x - 1 && board.enpassant.y == y - m) {
              const pm = -m;
              underAttack.push({
                m: m,
                sx: x,
                sy: y,
                spc: ch,
                x: x - 1,
                y: y - m,
                pc: pm == 1 ? 'P' : 'p'
              });
            }
          }
          if (this.onBoard(x + 1, y - m)) {
            const pc = board[y - m][x + 1];
            if (pc) {
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x + 1,
                  y: y - m,
                  pc: pc
                });
              }
            } else if (board.enpassant && board.enpassant.x == x + 1 && board.enpassant.y == y - m) {
              const pm = -m;
              underAttack.push({
                m: m,
                sx: x,
                sy: y,
                spc: ch,
                x: x + 1,
                y: y - m,
                pc: pm == 1 ? 'P' : 'p'
              });
            }
          }
          break;
      }
      return underAttack;
    };

    tension = node => {
      const lt = this.lichessTools;
      const board = lt.getBoardFromFen(node.fen);
      const underAttack = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ua = this.pieceTension(x, y, board, true);
          underAttack.push.apply(underAttack, ua);
        }
      }
      const result = [...new Set(underAttack.map(i => i.x + ',' + i.y + '=' + i.pc))].map(i => i.split('=')[1].toLowerCase()).reduce((acc, val) => this.pieceMaterial[val] + acc, 0);
      return result;
    };

    getAllCapturingMoves = (board) => {
      const underAttack = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ua = this.pieceTension(x, y, board, false);
          underAttack.push.apply(underAttack, ua);
        }
      }
      return underAttack;
    };

    findPieces = (board, piece) => {
      const result = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (board[y][x] == piece) result.push({ x: x, y: y });
        }
      }
      return result;
    };

    isPromotion = (node) => {
      return node.san?.includes('=');
    };

    inCheck = (fen) => {
      const lt = this.lichessTools;
      const side = fen.split(' ')[1] == 'w' ? 1 : -1;
      const board = lt.getBoardFromFen(fen);
      const king = this.findPieces(board, side == 1 ? 'K' : 'k')[0];
      const moves = this.getAllCapturingMoves(board)
        .filter(m => m.m != side && m.x == king.x && m.y == king.y);
      return !!moves.length;
    };

    materialWon = (board, x, y) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      board = lt.clone(board);
      const ch = board[y][x];
      if (!ch) return 0;
      const side = ch === ch.toUpperCase() ? -1 : 1;
      const moves = this.getAllCapturingMoves(board)
        .filter(m => m.x == x && m.y == y && m.m == side)
        .sort((m1, m2) => this.pieceMaterial[m1.spc.toLowerCase()] - this.pieceMaterial[m2.spc.toLowerCase()]);
      const move = moves[0];
      if (!move) return 0;
      let result = this.pieceMaterial[ch.toLowerCase()] * side; //capture piece
      board[y][x] = move.spc;
      board[move.sy][move.sx] = null;
      result += this.materialWon(board, x, y);
      return Math.sign(result) != side ? 0 : result;
    };

    maxMaterialWon = (board, m) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      let mx = 0;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ch = board[y][x];
          if (!ch) continue; // no piece
          const pm = ch === ch.toUpperCase() ? 1 : -1;
          if (pm == m) continue; // wrong turn
          const mw = this.materialWon(board, x, y);
          if (Math.sign(mw) == m && Math.abs(mw) > mx) {
            mx = Math.abs(mw);
          }
        }
      }
      return mx * m;
    };

    smooth = (points) => {
      return points;
      /*const lt=this.lichessTools;
      const Math=lt.global.Math;
      if (!this.options.smooth) return points;
      const threshold=0.3;
      const toRemove=[];
      for (let i=0;i<points.length-2;i++) {
        const avg=(points[i].y+points[i+2].y)/2;
        if (Math.abs(points[i].y-avg)>threshold) continue;
        if (Math.abs(points[i+2].y-avg)>threshold) continue;

        if (Math.abs(points[i+1].y-avg)<=threshold) continue;
        toRemove.push(i+1);
      }
      for (let i=toRemove.length-1; i>=0; i--) {
        points.splice(toRemove[i],1);
      }
      return toRemove.length?this.smooth(points):points;*/
    }

    getMaterialData = (mainline) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      return mainline
        .map((node, x) => {
          const cp = this.simpleMaterial(node);
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: node.ply
          };
        });
    };

    getPrincipledData = (mainline) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      return mainline
        .map((node, x) => {
          const evl = this.heuristic(node);
          const mat = this.simpleMaterial(node)
          let val = evl - mat;
          const cp = val * 2;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: node.ply
          };
        })
        .filter(r => !!r);
    };

    getCp = (evl, side = 1) => {
      const lt = this.lichessTools;
      return lt.getCentipawns(evl) * side;
    };

    getLocalData = (mainline) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const Math = lt.global.Math;
      let path = '';
      return mainline
        .map((node, x) => {
          path += node.id;
          if (!node.ceval) return null;
          const cp = this.getCp(node.ceval);
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: node.ply,
            path: path
          };
        })
        .filter(r => !!r);
    };

    getNodeCeval = (node) => {
      if (!this.options.local) return node.eval;
      const ceval = node.ceval;
      return !ceval || (node.eval && (node.eval?.depth || 16) > ceval.depth)
        ? node.eval
        : ceval;
    };

    getAccuracyData = (mainline) => {
      const lt = this.lichessTools;
      const side = lt.lichess.analysis.getOrientation() == 'black' ? -1 : 1;
      const Math = lt.global.Math;
      let prevWinPerc = 50;
      let prevVal = 0;
      return mainline
        .map((node, x) => {
          const turn = this.getNodeTurn(node);
          if (-turn != side) return {
            y: prevVal,
            x: node.ply
          };
          const evl = this.getNodeCeval(node);
          if (!evl) return null;
          const cp = this.getCp(evl, side);
          const winPerc = lt.winPerc(cp);
          const accuracy = 103.1668 * Math.exp(-0.04354 * (prevWinPerc - winPerc)) - 3.1669;
          prevWinPerc = winPerc;
          const val = Math.max(Math.min(accuracy, 100), 0) / 50 - 1;
          prevVal = val;
          return {
            y: val,
            x: node.ply
          };
        })
        .filter(r => !!r);
    };

    getSharpnessData = (mainline) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const Math = lt.global.Math;
      return mainline
        .map((node, x) => {
          const explorerItem = analysis.explorer?.cache[node.fen];
          if (!explorerItem) return null;
          const total = explorerItem.white + explorerItem.draws + explorerItem.black;
          if (total == 0) return null;
          const q = 1000 / total;
          const [w, d, l] = [explorerItem.white * q, Math.max(explorerItem.draws, 1) * q, explorerItem.black * q];
          const sharpness = Math.round(Math.min(w, l) / 50 * 333 / d * 1 / (1 + Math.exp(-(w + l) / 1000)));
          const val = Math.min(sharpness / 100, 0.9);
          return {
            y: val,
            x: node.ply
          };
        })
        .filter(r => !!r);
    };

    computeGood = (side, node, prevNode) => {
      const lt = this.lichessTools;
      const cp1 = this.getCp(this.getNodeCeval(node));
      const cp2 = this.getCp(this.getNodeCeval(prevNode));
      if (cp1 === undefined || cp2 === undefined) return;
      const w1 = lt.winPerc(cp1);
      const w2 = lt.winPerc(cp2);
      return (w1 - w2) * side;
    }

    computeBrilliant = (side, node, prevNode, prev2Node) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const cp1 = this.getCp(this.getNodeCeval(node));
      const cp2 = this.getCp(this.getNodeCeval(prevNode));
      if (cp1 === undefined || cp2 === undefined) return 0;

      const threshold = Math.abs(cp1) > 200 || this.hasTacticalMotif(node, side, prevNode) ? -50 : -25;
      if ((cp1 - cp2) * side < threshold) return 0;

      if (Math.abs(cp1) > 75 && Math.sign(side) != Math.sign(cp1)) return 0;

      if (this.inCheck(prevNode.fen)) return 0;

      let bonus = 0;
      if (this.isPromotion(node)) {
        if (/q$/i.test(node.uci)) return 0;
        if (!this.hasTacticalMotif(node, side, prevNode) && (cp1 - cp2) * side < 50) return 0;
        bonus += 1; // a tactical underpromotion adds to brilliancy
      }

      const balancingBonus = Math.abs(cp1) < 100 ? 0 : (cp1 * side < -100 ? 0.5 : -0.5);
      bonus += balancingBonus;

      const move = {
        sx: 104 - node.uci.charCodeAt(0),
        sy: node.uci.charCodeAt(1) - 49,
        x: 104 - node.uci.charCodeAt(2),
        y: node.uci.charCodeAt(3) - 49
      };
      let board = lt.getBoardFromFen(prevNode.fen);
      const mwStartUci = this.materialWon(board, move.sx, move.sy) / 100;
      board = lt.getBoardFromFen(node.fen);
      const mwEndUci = this.materialWon(board, move.x, move.y) / 100;
      const mat3 = this.simpleMaterial(prev2Node, true, side) / 100;
      const mat1 = this.simpleMaterial(node, true, side) / 100;
      const delta = (mat3 - mat1);
      if (mwStartUci * side + 1 + delta < mwEndUci * side) {
        return 1 + bonus;
      }
      const mmw1 = this.maxMaterialWon(board, side) / 100;
      board = lt.getBoardFromFen(prev2Node.fen);
      const mmw3 = this.maxMaterialWon(board, side) / 100;
      const bril = ((mmw3 - mmw1) * side - delta)*0.7; // TODO thesis: brilliant if there is a lot of material loss but still a good move
      return bril + bonus;
    };

    getAttacks = (board, x, y, pieceType) => {
      const attacks = [];
      if (pieceType === 'n') { // Knight
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const [dx, dy] of knightMoves) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            attacks.push([nx, ny]);
          }
        }
      } else if (pieceType === 'b' || pieceType === 'q') {
        const bishopDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (const [dx, dy] of bishopDirs) {
          for (let i = 1; i < 8; i++) {
            const nx = x + dx * i, ny = y + dy * i;
            if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) break;
            attacks.push([nx, ny]);
            if (board[ny][nx]) break;
          }
        }
      }
      if (pieceType === 'r' || pieceType === 'q') {
        const rookDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dx, dy] of rookDirs) {
          for (let i = 1; i < 8; i++) {
            const nx = x + dx * i, ny = y + dy * i;
            if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) break;
            attacks.push([nx, ny]);
            if (board[ny][nx]) break;
          }
        }
      }
      return attacks;
    };

    hasTacticalMotif = (node, side, prevNode) => {
      const lt = this.lichessTools;

      const board = lt.getBoardFromFen(node.fen);
      if (!board) return false;

      const uci = node.uci;
      const toX = 104 - uci.charCodeAt(2);
      const toY = uci.charCodeAt(3) - 49;
      const piece = board[toY][toX];
      if (!piece) return false;

      const pieceSide = piece === piece.toUpperCase() ? -1 : 1;
      if (pieceSide !== side) return false;
      const pieceType = piece.toLowerCase();

      // Check for Fork
      const attacks = this.getAttacks(board, toX, toY, pieceType);
      let opponentPiecesAttacked = 0;
      for (const [nx, ny] of attacks) {
        const target = board[ny][nx];
        if (!target) continue;
        const targetSide = target === target.toUpperCase() ? -1 : 1;
        if (targetSide === side) continue;
        if (target.toLowerCase() !== 'k') {
          opponentPiecesAttacked++;
        }
      }
      if (opponentPiecesAttacked >= 2) {
        return true; // Fork detected
      }

      // Check for Pin (bishop, rook, queen only)
      if (['b', 'r', 'q'].includes(pieceType)) {
        const pinDirs = pieceType === 'b' ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] :
                        pieceType === 'r' ? [[-1, 0], [1, 0], [0, -1], [0, 1]] :
                        [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dx, dy] of pinDirs) {
          let firstPiece = null, secondPiece = null;
          for (let i = 1; i < 8; i++) {
            const nx = toX + dx * i, ny = toY + dy * i;
            if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) break;
            const target = board[ny][nx];
            if (!target) continue;
            const targetSide = target === target.toUpperCase() ? -1 : 1;
            if (targetSide === side) break;
            if (!firstPiece) {
              firstPiece = { x: nx, y: ny, piece: target };
            } else {
              secondPiece = { x: nx, y: ny, piece: target };
              break;
            }
          }
          if (firstPiece && secondPiece) {
            const firstValue = this.pieceMaterial[firstPiece.piece.toLowerCase()] || 0;
            const secondValue = this.pieceMaterial[secondPiece.piece.toLowerCase()] || (secondPiece.piece.toLowerCase() === 'k' ? 10000 : 0);
            if (firstValue < secondValue) {
              return true;
            }
          }
        }
      }

      // Check for Discovered Attack
      if (!prevNode) throw 'Need previous position';
      const prevBoard = lt.getBoardFromFen(prevNode.fen);
      const fromX = 104 - uci.charCodeAt(0);
      const fromY = uci.charCodeAt(1) - 49;

      // Find pieces that could attack through the moved piece s old position
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const otherPiece = prevBoard[y][x];
          if (!otherPiece || otherPiece === piece) continue;
          if ((otherPiece === otherPiece.toUpperCase() ? -1 : 1) !== side) continue;
          const otherType = otherPiece.toLowerCase();
          if (!['b', 'r', 'q'].includes(otherType)) continue;
          const otherAttacks = this.getAttacks(board, x, y, otherType);
          if (otherAttacks.some(([ax, ay]) => ax === fromX && ay === fromY)) {
            for (const [ax, ay] of otherAttacks) {
              if (ax === fromX && ay === fromY) continue;
              const target = board[ay][ax];
              if (!target) continue;
              if ((target === target.toUpperCase() ? -1 : 1) === side) continue;
              if (target.toLowerCase() !== 'k') {
                return true;
              }
            }
          }
        }
      }

      return false;
    };

    getChartContainerSelector = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      return lichess.analysis?.study
        ? 'div.study__server-eval.ready'
        : 'div.computer-analysis.active #acpl-chart-container';
    };

    setBrilliant = (mainline, forced) => {
      const initValue = this.options.moreBrilliant ? 2 : 1;
      if (!forced && mainline.at(-1)?.brilliantInit === initValue) return;
      const lt = this.lichessTools;
      const isLocalChart = $('#acpl-chart-container').is('.lichessTools-extraChart');
      const Math = lt.global.Math;
      const showBad = this.options.moreBrilliant && isLocalChart;
      let p2;
      let p3;
      mainline
        .map((node, x) => {
          try {
            let result = null;
            if (lt.isMate(node) || p2 === undefined) return result;
            const m = -this.getNodeTurn(node);
            const good = this.computeGood(m, node, p2);
            const bril = p3 === undefined
                           ? 0
                           : this.computeBrilliant(m, node, p2, p3);
            result = {
              //book: node.opening,
              blunder: showBad && good < -20,
              mistake: showBad && good < -10,
              inaccuracy: showBad && good < -5,
              good: this.options.moreBrilliant && good >= -1,
              best: this.options.moreBrilliant && good >= 0,
              bril: this.options.moreBrilliant ? bril >= 5 : bril >= 3
            };
            return result;
          } finally {
            p3 = p2;
            p2 = node;
          }
        })
        .forEach((v, x) => {
          if (!v) return;
          let symbol = null;
          let name = null;
          if (v.good) {
            if (v.book) {
              symbol = lt.icon.Book;
              name = 'Book';
            } else
            if (v.bril) {
              symbol = '!!';
              name = 'Brilliant';
            } else {
              if (v.best) {
                symbol = lt.icon.WhiteStar;
                name = 'Best';
              } else {
                symbol = '!';
                name = 'Good';
              }
            }
          } else {
            if (v.bril) {
              symbol = '!?';
              name = 'Interesting';
            } else
            if (v.blunder) {
              symbol = '??';
              name = 'Blunder';
            } else
            if (v.mistake) {
              symbol = '?';
              name = 'Mistake';
            } else
            if (v.inaccuracy) {
              symbol = '?!';
              name = 'Inaccuracy';
            }
          }
          const glyphs = mainline[x].glyphs || [];
          lt.arrayRemoveAll(glyphs, g => g.type == 'nonStandard' && (this.options.moreBrilliant || ['!', '!?', '!!', lt.icon.WhiteStar, lt.icon.OpenBook].includes(g.symbol)));
          if (symbol && !glyphs.length) {
            glyphs.push({
              symbol: symbol,
              name: name,
              type: 'nonStandard'
            });
          }
          mainline[x].glyphs = glyphs;
        });
      if (mainline.length) {
        mainline.at(-1).brilliantInit = initValue;
      }
    };

    getMaxTension = (mainline) => {
      let maxT = -1000;
      let maxM = -1000;
      let maxX = 0;
      mainline
        .forEach((node, x) => {
          const tension = this.tension(node);
          const totalMaterial = this.simpleMaterial(node, true);
          if (maxT < tension || (maxT == tension && maxM < totalMaterial)) {
            maxT = tension;
            maxX = node.ply;
            maxM = totalMaterial;
          }
        });
      return maxX;
    };

    getMaxPotential = (mainline) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      let maxM = -1000;
      let maxX = 0;
      mainline
        .forEach((node, x) => {
          const board = lt.getBoardFromFen(node.fen);
          const m = this.getNodeTurn(node);
          const maxMaterial = Math.abs(this.maxMaterialWon(board, m));
          if (maxM < maxMaterial) {
            maxM = maxMaterial;
            maxX = node.ply;
          }
        });
      return maxX;
    };

    getInterestingMoveElements = (orientation) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const side = orientation == 'black' ? -1 : 1;
      const mainline = analysis.mainline;
      const result = [];
      for (let i = 0; i < mainline.length; i++) {
        const move = mainline[i];
        const turn = this.getNodeTurn(move);
        if (-turn != side) continue;
        const glyph = move?.glyphs?.at(0);
        if (!glyph) continue;
        if (!['!', '!!', '!?', lt.icon.WhiteStar].includes(glyph.symbol)) continue;
        result.push({ datasetIndex: 0, index: i - 1 });
      }
      return result;
    };

    showGoodMoves = (forced) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      if (!this.options.brilliant) return;

      const hcElem = $('#acpl-chart-container.lichessTools-extraChart, div.computer-analysis.active #acpl-chart-container, div.study__server-eval.ready')[0];
      let state = hcElem?.traverseState;
      if (!state || forced) {
        state = lt.traverse();
        if (hcElem) hcElem.traverseState = state;
      }
      const arr = [].concat.apply([], ['!', '!?', '!!', lt.icon.WhiteStar].map(s => state?.glyphs[s]).filter(a => !!a?.length));
      if (!arr.length) return;
      const fill = (container, count, color) => {
        let elem = $('div.lichessTools-goodMoves', container);
        if (!elem.length) {
          const adviceSummary = $('div.advice-summary__player', container);
          if (adviceSummary.length) {
          elem = $('<div></div>')
            .addClass('lichessTools-goodMoves')
            .addClass('advice-summary__error')
            .text(' ' + trans.noarg('goodMovesText'))
            .prepend($('<strong></strong>'))
            .attr('title', trans.noarg('goodMovesTitle'))
            .on('click', (ev) => {
              ev.preventDefault();
              lt.jumpToGlyphSymbols(this.options.moreBrilliant ? ['!?', '!!'] : ['!', '!?', '!!', lt.icon.WhiteStar], color);
            })
            .on('mouseenter', (ev) => {
              const chart = this._chart;
              if (!chart) return;
              const dataset = chart.data.datasets.at(0);
              if (!dataset) return;
              const elems = this.getInterestingMoveElements(color);
              if (!this.colors.beforeInterestingMoves) this.colors.beforeInterestingMoves = dataset.hoverBackgroundColor || this.colors.originalChart;
              dataset.hoverBackgroundColor = this.colors.interestingMoves();
              dataset.pointHoverBackgroundColor = this.colors.interestingMoves();
              this.safeSetActiveElements(chart,elems,dataset);
              chart.update('none');
            })
            .on('mouseleave', (ev) => {
              const chart = this._chart;
              if (!chart) return;
              const dataset = chart.data.datasets.at(0);
              if (!dataset) return;
              const elems = [];
              dataset.hoverBackgroundColor = this.colors.beforeInterestingMoves;
              dataset.pointHoverBackgroundColor = this.colors.beforeInterestingMoves;
              this.safeSetActiveElements(chart,elems,dataset);
              chart.update('none');
            })
            .insertAfter(adviceSummary);
          }
        }
        if (elem.length) {
          elem.toggleClassSafe('symbol', !!count);
          const newText = (count || 0).toString();
          elem.find('strong').replaceText(newText);
        }
      };
      let container = $('div.advice-summary__side').get(0);
      const count = arr.filter(n => {
        const turn = this.getNodeTurn(n);
        return turn == -1;
      }).length;
      fill(container, count, 'white');
      container = $('div.advice-summary__side').get(1);
      fill(container, arr.length - count, 'black');
    };

    safeSetActiveElements = (chart, elems, dataset)=>{
      const arr = elems.filter(e=>e?.index<dataset?.data?.length);
      chart.setActiveElements(arr);
    };

    showChristmasTree = async () => {
      if (this._christmasTreePlayed) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#acpl-chart-container.lichessTools-extraChart, div.computer-analysis.active #acpl-chart-container, div.study__server-eval.ready');
      if (lt.inViewport(container) < 1) return;
      const chart = this._chart;
      if (!chart) return;
      const dataset = chart.data?.datasets[0];
      if (!dataset) return;
      const length = Math.max.apply(null, dataset.data.map(d => d.x)) || dataset.data.length;
      if (!length) return;

      this._christmasTreePlayed = true;
      const xElem = $('<span class="lichessTools-christmas">').text(trans.noarg('merryChristmas'));
      container.append(xElem);
      const initHoverBackgroundColor = dataset.hoverBackgroundColor;
      const initActiveElements = chart.getActiveElements()?.map(e => { return { datasetIndex: e.datasetIndex, index: e.index }; });
      const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'magenta', 'cyan', 'white'];
      for (let i = 0; i < 30; i++) {
        const elements = dataset.data.filter(d => lt.random() < 0.3).map(d => { return { datasetIndex: 0, index: d.x - 1 }; });
        const color = colors[Math.round(lt.random() * colors.length)];
        dataset.hoverBackgroundColor = color;
        dataset.pointHoverBackgroundColor = color;
        this.safeSetActiveElements(chart,elements,dataset);
        chart.update('none');
        xElem.css('color', color);
        await lt.timeout(150);
      }
      lt.global.setTimeout(() => xElem.remove(), 1000);
      dataset.hoverBackgroundColor = initHoverBackgroundColor;
      dataset.pointHoverBackgroundColor = initHoverBackgroundColor;
      this.safeSetActiveElements(chart,initActiveElements,dataset);
      chart.update('none');
    };

    getChartModule = async () => {
      if (!this._module) {
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        this._module = await lichess.asset.loadEsm('chart.game');
      }
      return this._module;
    };

    clearCharts = () => {
      const chart = this._chart;
      if (!chart) return;
      const lt = this.lichessTools;
      const removed = lt.arrayRemoveAll(chart.data.datasets, d => ['Material', 'Principled', 'Local', 'Max tension', 'Max potential'].includes(d.label));
      if (removed.length) {
        chart.options.scales.x.max = Math.max.apply(null, chart.data.datasets.map(ds => ds.data.map(p => p.x)).flat());
        chart.update('none');
        this.prevMainlineLength = null;
      }
    };

    chartClick = (_event, elements, _chart) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!this._chart) return;
      const index = this._chart.data.datasets.findIndex(s => s.label === 'Local');
      const data = elements[elements.findIndex(element => [0, index].includes(element.datasetIndex))];
      const path = data?.element?.$context?.raw?.path;
      if (path) {
        lichess.analysis.jump(path);
      } else if (data?.index !== undefined) {
        lichess.analysis.jumpToIndex(data.index);
        lichess.analysis.redraw();
      }
    };

    getLocalLine = ()=>{
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (analysis.onMainline) {
        return analysis.mainline;
      } else {
        const localLine = [...analysis.nodeList];
        let lastNode = localLine.at(-1)?.children[0];
        while (lastNode) {
          localLine.push(lastNode);
          lastNode = lastNode.children[0];
        }
        return localLine;
      }
    };

    prevBrilliant = null;
    generateCharts = async (forced) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      if (!forced && Math.random() > 0.95) forced = true; // hack to sometimes update this anyway

      if (!lichess.analysis) return;
      const currentBrilliant = [this.options.brilliant, this.options.moreBrilliant].join(',');
      if (!forced && this.prevBrilliant != currentBrilliant) {
        this.prevBrilliant = currentBrilliant;
        forced = true;
      }
      let localLine = null;
      if (this.options.local) {
        localLine = this.getLocalLine();
      }

      if (lichess.analysis.mainline.find(n => n.eval && n.eval._originator != 'lichessTools')) {
        $('#acpl-chart-container').removeClass('lichessTools-extraChart');
        $('form.future-game-analysis').remove();
      }
      if (!lichess.analysis.mainline.find(n => this.getNodeCeval(n))) {
        if (!localLine || !localLine.find(n => this.getNodeCeval(n))) {
          this.clearCharts();
          return;
        }
      }
      let container = $('#acpl-chart-container.lichessTools-extraChart, div.computer-analysis.active #acpl-chart-container, div.study__server-eval.ready');
      let chart = this._chart;
      if (!chart) {
        chart = lichess.analysis.study?.serverEval?.chart;
        if (!chart) {
          const canvas = $('canvas#acpl-chart', container)[0];
          if (canvas) {
            if (canvas.$chartjs) {
              const mod = await this.getChartModule();
              chart = await mod.acpl(canvas);
            } else {
              lt.global.setTimeout(() => this.generateCharts(forced), 100);
              return;
            }
          }
        }
        if (!chart && this.options.local && !lichess.analysis.study) {
          const underboard = $('.analyse__underboard div.computer-analysis')[0] || $('.analyse__underboard')[0];
          if (underboard) {
            container = $('<div id="acpl-chart-container" class="lichessTools-extraChart"><canvas id="acpl-chart"></canvas></div>');
            const message = $('.future-game-analysis', underboard);
            if (message.length) {
              container.insertBefore(message);
            } else {
              container.appendTo(underboard);
            }
            const mod = await this.getChartModule();
            const mainline = lichess.analysis.mainline;
            chart = await mod.acpl($("#acpl-chart")[0], lichess.analysis.data, mainline, lichess.analysis.trans);
          }
        }
        if (chart && !this._chart) {
          this.setChart(chart);
        }
      }
      if (!chart) return;
      if (chart.options.onClick != this.chartClick) {
        chart.options.onClick = this.chartClick;
      }
      if (!lt.inViewport(container)) return;
      if (!this.options.needsChart) {
        $('div.lichessTools-chartInfo', container).remove();
      } else {
        if (!$('div.lichessTools-chartInfo', container).length) {
          $('<div class="lichessTools-chartInfo">')
            .attr('title', trans.noarg('chartInfoTitle'))
            .append($('<a target="_blank">')
              .attr('data-icon', lt.icon.CautionCircle)
              .attr('href', 'https://siderite.dev/blog/lichess-tools---user-manual#extraChart'))
            .appendTo(container);
        }
      }

      let updateChart = false;

      let existingMaterial = chart.data.datasets.findIndex(s => s.label === 'Material');
      if (existingMaterial >= 0 && (this.prevSmooth != this.options.smooth || !this.options.material)) {
        chart.data.datasets.splice(existingMaterial, 1);
        existingMaterial = -1;
        updateChart = true;
      }
      if (this.options.material) {
        if (existingMaterial < 0) {
          chart.data.datasets.push({
            label: 'Material',
            type: 'line',
            data: this.smooth(this.getMaterialData(lichess.analysis.mainline)),
            borderWidth: 2,
            borderDash: [3, 3],
            cubicInterpolationMode: this.options.smooth ? 'monotone' : 'default',
            tension: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.materialChart,
            order: 1,
            datalabels: { display: false }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingMaterial];
          if (dataset.data?.length < lichess.analysis.mainline.length) {
            const newData = this.smooth(this.getMaterialData(lichess.analysis.mainline));
            dataset.data = newData;
            updateChart = true;
          }
        }
      }

      let existingPrincipled = chart.data.datasets.findIndex(s => s.label === 'Principled');
      if (existingPrincipled >= 0 && (this.prevSmooth != this.options.smooth || !this.options.principled)) {
        chart.data.datasets.splice(existingPrincipled, 1);
        existingPrincipled = -1;
        updateChart = true;
      }
      if (this.options.principled) {
        if (existingPrincipled < 0) {
          chart.data.datasets.push({
            label: 'Principled',
            type: 'line',
            data: this.smooth(this.getPrincipledData(lichess.analysis.mainline)),
            borderWidth: 2,
            borderDash: [4, 2],
            cubicInterpolationMode: this.options.smooth ? 'monotone' : 'default',
            tension: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.principledChart,
            order: 1,
            datalabels: { display: false }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingPrincipled];
          if (dataset.data?.length < lichess.analysis.mainline.length) {
            const newData = this.smooth(this.getPrincipledData(lichess.analysis.mainline));
            dataset.data = newData;
            updateChart = true;
          }
        }
      }

      let existingLocal = chart.data.datasets.findIndex(s => s.label === 'Local');
      if (existingLocal >= 0 && (this.prevSmooth != this.options.smooth || !this.options.local)) {
        chart.data.datasets.splice(existingLocal, 1);
        existingLocal = -1;
        updateChart = true;
      }
      if (this.options.local) {
        const mainline = localLine;
        if (existingLocal < 0) {
          chart.data.datasets.push({
            label: 'Local',
            type: 'line',
            data: this.smooth(this.getLocalData(mainline)),
            borderWidth: 2,
            cubicInterpolationMode: this.options.smooth ? 'monotone' : 'default',
            tension: 0,
            pointRadius: 0,
            pointHitRadius: 5,
            pointHoverRadius: 3,
            borderColor: this.colors.localChart,
            hoverBackgroundColor: this.colors.localChartHover,
            fill: {
              target: 'start',
              above: this.colors.localChart().substr(0, 7) + '18'
            },
            order: 1,
            datalabels: { display: false }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingLocal];
          const existingData = dataset.data;
          const newData = this.smooth(this.getLocalData(mainline));
          updateChart |= JSON.stringify(existingData) != JSON.stringify(newData);
          if (updateChart) dataset.data = newData;
        }
      }

      let existingAccuracy = chart.data.datasets.findIndex(s => s.label === 'Accuracy');
      if (existingAccuracy >= 0 && (this.prevSmooth != this.options.smooth || !this.options.accuracy)) {
        chart.data.datasets.splice(existingAccuracy, 1);
        existingAccuracy = -1;
        updateChart = true;
      }
      if (this.options.accuracy || this.tempAccuracyOn) {
        const mainline = lichess.analysis.mainline;
        if (existingAccuracy < 0) {
          chart.data.datasets.push({
            label: 'Accuracy',
            type: 'line',
            data: this.smooth(this.getAccuracyData(mainline)),
            borderWidth: 2,
            borderDash: [3, 2],
            cubicInterpolationMode: this.options.smooth ? 'monotone' : 'default',
            tension: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.accuracyChart,
            order: 1,
            datalabels: { display: false }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingAccuracy];
          const existingData = dataset.data;
          const newData = this.smooth(this.getAccuracyData(mainline));
          updateChart |= JSON.stringify(existingData) != JSON.stringify(newData);
          if (updateChart) dataset.data = newData;
        }
      }

      let existingSharpness = chart.data.datasets.findIndex(s => s.label === 'Sharpness');
      if (existingSharpness >= 0 && (this.prevSmooth != this.options.smooth || !this.options.sharpness)) {
        chart.data.datasets.splice(existingSharpness, 1);
        existingSharpness = -1;
        updateChart = true;
      }
      if (this.options.sharpness) {
        const mainline = lichess.analysis.mainline;
        if (existingSharpness < 0) {
          chart.data.datasets.push({
            label: 'Sharpness',
            type: 'line',
            data: this.smooth(this.getSharpnessData(mainline)),
            borderWidth: 2,
            borderDash: [3, 4],
            cubicInterpolationMode: this.options.smooth ? 'monotone' : 'default',
            tension: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.sharpnessChart,
            order: 1,
            datalabels: { display: false }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingSharpness];
          const existingData = dataset.data;
          const newData = this.smooth(this.getSharpnessData(mainline));
          updateChart |= JSON.stringify(existingData) != JSON.stringify(newData);
          if (updateChart) dataset.data = newData;
        }
      }

      let existingMaxTension = chart.data.datasets.findIndex(s => s.label === 'Max tension');
      if (existingMaxTension >= 0 && !this.options.tension) {
        chart.data.datasets.splice(existingMaxTension, 1);
        existingMaxTension = -1;
        updateChart = true;
      }
      if (this.options.tension) {
        if (existingMaxTension < 0) {
          const x = this.getMaxTension(lichess.analysis.mainline);
          chart.data.datasets.push({
            label: 'Max tension',
            type: 'line',
            data: [
              { x: x, y: -1.05 },
              { x: x, y: 1.05 }
            ],
            borderWidth: 1,
            borderDash: [4, 3],
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.maxTensionLine,
            order: 1,
            datalabels: {
              offset: -5,
              align: 45,
              rotation: 90,
              formatter: _ => trans.noarg('tensionLineTitle')
            }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingMaxTension];
          const existingData = dataset.data;
          if (this.prevMainlineLength != lichess.analysis.mainline.length) {
            const x = this.getMaxTension(lichess.analysis.mainline);
            dataset.data = [
              { x: x, y: -1.05 },
              { x: x, y: 1.05 }
            ];
            updateChart = true;
          }
        }
      }

      let existingMaxPotential = chart.data.datasets.findIndex(s => s.label === 'Max potential');
      if (existingMaxPotential >= 0 && !this.options.potential) {
        chart.data.datasets.splice(existingMaxPotential, 1);
        existingMaxPotential = -1;
        updateChart = true;
      }
      if (this.options.potential) {
        if (existingMaxPotential < 0) {
          const x = this.getMaxPotential(lichess.analysis.mainline);
          chart.data.datasets.push({
            label: 'Max potential',
            type: 'line',
            data: [
              { x: x, y: -1.05 },
              { x: x, y: 1.05 }
            ],
            borderWidth: 1,
            borderDash: [2, 4],
            pointRadius: 0,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            borderColor: this.colors.maxPotentialLine,
            order: 1,
            datalabels: {
              offset: -5,
              align: 45,
              rotation: 90,
              formatter: _ => trans.noarg('potentialLineTitle')
            }
          });
          updateChart = true;
        } else {
          const dataset = chart.data.datasets[existingMaxPotential];
          if (this.prevMainlineLength != lichess.analysis.mainline.length) {
            const x = this.getMaxPotential(lichess.analysis.mainline);
            dataset.data = [
              { x: x, y: -1.05 },
              { x: x, y: 1.05 }
            ];
            updateChart = true;
          }
        }
      }

      if (this.options.brilliant) {
        this.setBrilliant(lichess.analysis.mainline, forced);

        this.showGoodMoves(forced);
      }

      if (this.options.christmas && new Date().toISOString().includes('-12-25')) {
        await this.showChristmasTree();
      }

      const maxX = Math.max.apply(null, chart.data.datasets
        .filter(d => d.type == 'line')
        .map(d => d.data?.at(-1)?.x)
        .concat([lichess.analysis.mainline.at(-1)?.ply]));
      if (maxX != chart.options?.scales?.x?.max) {
        chart.options.scales.x.max = maxX;
        updateChart = true;
      }

      if (updateChart) {
        chart.update('none');
        this.prevMainlineLength = lichess.analysis.mainline.length;
      }
      this.prevSmooth = this.options.smooth;
    };

    generateTicks = () => {
      if (!this.options.gauge) return;
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const node = analysis.node;
      const container = $('div.eval-gauge');

      if (node.fen == this.prevFen) return;
      this.prevFen = node.fen;

      if (!lt.inViewport(container)) return;

      const mat = this.simpleMaterial(node);
      const material = 2 / (1 + Math.exp(-0.004 * mat)) - 1;
      const evl = this.heuristic(node);
      const val = (evl - mat) * 2;
      const principled = 2 / (1 + Math.exp(-0.004 * val)) - 1;
      let matElem = $('tick.lichessTools-material', container);
      if (!matElem.length) {
        matElem = $('<tick>')
          .addClass('lichessTools-material')
          .appendTo(container);
      }
      const matPerc = Math.round((1 - material * 0.95) * 50) + '%';
      matElem.css('top', matPerc);
      let priElem = $('tick.lichessTools-principled', container);
      if (!priElem.length) {
        priElem = $('<tick>')
          .addClass('lichessTools-principled')
          .appendTo(container);
      }
      const priPerc = Math.round((1 - principled * 0.95) * 50) + '%';
      priElem.css('top', priPerc);
    }

    setChart = chart => {
      this._chart = chart;
      chart.options.plugins.tooltip = { ...chart.options.plugins.tooltip, filter: t => t.datasetIndex === 0 };
      this.generateCharts();
    };

    handleEsmLoaded = (m) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!m?.acpl) return;
      if (lt.isWrappedFunction(m.acpl, 'extraChart')) return;
      m.acpl = lt.wrapFunction(m.acpl, {
        id: 'extraChart',
        after: ($this, res) => {
          res?.then(chart => {
            this.setChart(chart);
          });
        }
      });
    };

    forceGenerateCharts = () => this.generateCharts(true);

    clientGameAnalysis = () => {
      console.log('bingo!');
    };

    showAccuracy = (ev)=>{
      const el = ev.currentTarget;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      var isWhite = $(el).closest('.advice-summary__side').has('.is.white').length ? 1 : 0;
      var localLine = this.getLocalLine().filter(n=>n.ply && (n.ply % 2) == isWhite);
      if (!localLine.length) return;
      const dict = new Map();
      for (const node of localLine) {
        if (node.glyphs?.length) {
          for (const glyph of node.glyphs) {
            dict.set(glyph.symbol,(dict.get(glyph.symbol) || 0)+1);
          } 
        } else {
          dict.set(' ',(dict.get(' ') || 0)+1);
        }
      }
      const arr = [...dict.entries()];
      const order = ['!!',lt.icon.WhiteStar,'!',' ','?!','?','??'];
      const index = (x)=>{
        const i = order.indexOf(x);
        return i<0 ? 1000 : i;
      };
      arr.sort((a,b)=>index(a[0])-index(b[0]));
      const total = arr.reduce((a,v)=>a+v[1],0);
      const q = 100 / total;

      let tooltip = $(el).next('.lichessTools-extraChart-tooltip');
      if (!tooltip.length) {
        tooltip = $('<div class="lichessTools-extraChart-tooltip">')
          .insertAfter(el);
      }
      const offsetRight = el.offsetParent.offsetWidth - (el.offsetLeft + el.offsetWidth);
      tooltip
        .empty()
        .css({ right: offsetRight, top: el.offsetTop, width: el.offsetWidth });
      let rest = 100;
      for (let i=0; i<arr.length; i++) {
        const [symbol,count] = arr[i];
        const perc = i==arr.length - 1
          ? rest
          : Math.round(count*q);
        rest -= perc;
        const id = lt.crc24(symbol);
        $('<div>')
          .addClass('node-'+id)
          .css('flex-grow',count)
          .text(symbol+' '+perc+'%')
          .appendTo(tooltip);
      }
      const accuracy = +(/\d+/.exec($(el).text())[0]);
      const estimatedRating = Math.round(3800 / (1 + Math.exp(-0.07 * (accuracy - 76))));
      $('<div class="lichessTools-extraChart-estimatedRating">')
        .text(trans.pluralSame('estimatedRating',estimatedRating))
        .appendTo(tooltip);
      tooltip
        .removeClass('hide');
      this.tempAccuracyOn = lichess.analysis.getOrientation()=='black' 
        ? isWhite == 0
        : isWhite == 1;
    };

    hideAccuracy = (ev)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.lichessTools-extraChart-tooltip')
        .addClass('hide');
      this.tempAccuracyOn = false;
    };

    initAccuracyPlus = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.advice-summary__accuracy').each((i,e)=>{
        if (e._initAccuracyPlus) return;
        e._initAccuracyPlus = true;
        $(e)
          .on('mouseenter',this.showAccuracy)
          .on('mouseleave',this.hideAccuracy)
          .addClass('lichessTools-extraChart-accuracyPlus');
      });
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('extraChart');
      this.logOption('Extra charting', value);
      this.options = {
        material: lt.isOptionSet(value, 'material'),
        principled: lt.isOptionSet(value, 'principled'),
        tension: lt.isOptionSet(value, 'tension'),
        potential: lt.isOptionSet(value, 'potential'),
        brilliant: lt.isOptionSet(value, 'brilliant'),
        moreBrilliant: lt.isOptionSet(value, 'moreBrilliant'),
        local: lt.isOptionSet(value, 'local'),
        accuracy: lt.isOptionSet(value, 'accuracy'),
        sharpness: lt.isOptionSet(value, 'sharpness'),
        smooth: lt.isOptionSet(value, 'smooth'),
        get needsChart() { return this.material || this.principled || this.tension || this.brilliant || this.moreBrilliant || this.local || this.accuracy || this.sharpness; },
        accuracyPlus: lt.isOptionSet(value, 'accuracyPlus'),
        gauge: lt.isOptionSet(value, 'gauge'),
        christmas: !!lt.currentOptions.getValue('christmas')
      };
      lt.pubsub.off('lichessTools.esmLoaded', this.handleEsmLoaded);
      if (this.options.needsChart) {
        lt.pubsub.on('lichessTools.esmLoaded', this.handleEsmLoaded);
      }

      lt.global.clearInterval(this.interval);
      this.generateCharts();

      if (!this.options.gauge) {
        $('div.eval-gauge tick.lichessTools-material,div.eval-gauge tick.lichessTools-principled').remove();
        this.prevFen = null;
      }
      if (!this.options.local) {
        const container = $('#acpl-chart-container.lichessTools-extraChart');
        if (container.length) {
          container.remove();
          this._chart = null;
        }
      }
      this.interval = lt.global.setInterval(() => {
        this.generateCharts();
        this.generateTicks();
      }, 1000);
      lt.pubsub.off('lichessTools.chapterChange', this.forceGenerateCharts);
      if (this.options.brilliant) {
        lt.pubsub.on('lichessTools.chapterChange', this.forceGenerateCharts);
      }

      $('main.analyse').observer()
        .off('.advice-summary__accuracy,.analyse__underboard,.analyse__round-training',this.initAccuracyPlus);
      if (this.options.accuracyPlus) {
        $('main.analyse').observer()
          .on('.advice-summary__accuracy,.analyse__underboard,.analyse__round-training',this.initAccuracyPlus);
        this.initAccuracyPlus();
      }
    }

  }
  LiChessTools.Tools.ExtraChart = ExtraChartTool;
})();

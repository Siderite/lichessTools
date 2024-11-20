(() => {
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitEsmLoaded', 'EmitChapterChange'];

    preferences = [
      {
        name: 'extraChart',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['material', 'principled', 'tension', 'potential', 'brilliant', 'moreBrilliant', 'local', 'accuracy', 'sharpness', 'smooth', 'gauge'],
        defaultValue: 'material,principled,tension,brilliant,accuracy,smooth,gauge',
        defaultNotLoggedInValue: 'material,principled,tension,brilliant,accuracy,smooth,gauge,local,moreBrilliant',
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
        'chartInfoTitle': 'LiChess Tools - extra charting',
        'tensionLineTitle': 'Max tension',
        'potentialLineTitle': 'Max potential',
        'goodMovesText': 'good/brilliant/interesting moves',
        'goodMovesTitle': 'LiChess Tools - good/brilliant/interesting moves',
        'merryChristmas': 'Merry Christmas from LiChess Tools!',
        'options.christmas': 'Show Christmas lights on chart on the 25th of December'
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
        'extraChart.gauge': 'pe bara de Eval',
        'chartInfoTitle': 'LiChess Tools - grafice \u00een plus',
        'tensionLineTitle': 'Tensiune maxim\u0103',
        'potentialLineTitle': 'Poten\u0163ial maxim',
        'goodMovesText': 'mut\u0103ri bune/briliante/interesante',
        'goodMovesTitle': 'LiChess Tools - mut\u0103ri bune/briliante/interesante',
        'merryChristmas': 'Cr\u0103ciun fericit de la LiChess Tools!'
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


    simple_material = (node, isTotal, side) => {
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
          const cp = this.simple_material(node);
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        });
    };

    getPrincipledData = (mainline) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      return mainline
        .map((node, x) => {
          const evl = this.heuristic(node);
          const mat = this.simple_material(node)
          let val = evl - mat;
          const cp = val * 2;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        })
        .filter(r => !!r);
    };

    getCp = (evl, side = 1) => {
      let cp = undefined;
      if (evl?.cp !== undefined) {
        cp = evl.cp * side;
      }
      if (evl?.mate !== undefined) {
        cp = (Math.sign(evl.mate) * 10000 - evl.mate) * side;
      }
      return Number.isNaN(cp) ? undefined : cp;
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
            x: x,
            path: path
          };
        })
        .filter(r => !!r);
    };

    winPerc = (cp) => {
      return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
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
          if ((node.ply % 2) * 2 - 1 != side) return {
            y: prevVal,
            x: x
          };
          const evl = this.getNodeCeval(node);
          if (!evl) return null;
          const cp = this.getCp(evl, side);
          const winPerc = this.winPerc(cp);
          const accuracy = 103.1668 * Math.exp(-0.04354 * (prevWinPerc - winPerc)) - 3.1669;
          prevWinPerc = winPerc;
          const val = Math.max(Math.min(accuracy, 100), 0) / 50 - 1;
          prevVal = val;
          return {
            y: val,
            x: x
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
            x: x
          };
        })
        .filter(r => !!r);
    };

    computeGood = (side, node, prevNode) => {
      const cp1 = this.getCp(this.getNodeCeval(node));
      const cp2 = this.getCp(this.getNodeCeval(prevNode));
      if (cp1 === undefined || cp2 === undefined) return;
      const w1 = this.winPerc(cp1) * side;
      const w2 = this.winPerc(cp2) * side;
      return w1 - w2;
    }

    computeBrilliant = (side, node, prevNode, prev2Node) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const cp1 = this.getCp(this.getNodeCeval(node));
      const cp2 = this.getCp(this.getNodeCeval(prevNode));
      if (cp1 === undefined || cp2 === undefined) return 0;
      if ((cp1 - cp2) * side < -25) return 0;
      if (Math.abs(cp1) > 75 && Math.sign(side) != Math.sign(cp1)) return 0;
      if (this.inCheck(prevNode.fen)) return 0;
      if (this.isPromotion(node)) return 0;
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
      const mat3 = this.simple_material(prev2Node, true, side) / 100;
      const mat1 = this.simple_material(node, true, side) / 100;
      const delta = (mat3 - mat1);
      if (mwStartUci * side + 1 + delta < mwEndUci * side) {
        return 1;
      }
      board = lt.getBoardFromFen(prev2Node.fen);
      const mmw3 = this.maxMaterialWon(board, side) / 100;
      board = lt.getBoardFromFen(node.fen);
      const mmw1 = this.maxMaterialWon(board, side) / 100;
      const bril = (mmw1 - mmw3) * side - delta;
      return bril;
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
      mainline
        .map((node, x) => {
          if (x < 3) return null;
          if (lt.isMate(node)) return null;
          const m = node.ply % 2 ? 1 : -1;
          const p1 = node;
          const p2 = mainline[x - 1];
          const p3 = mainline[x - 2];
          const good = this.computeGood(m, p1, p2);
          const bril = this.computeBrilliant(m, p1, p2, p3);
          const result = {
            blunder: showBad && good < -20,
            mistake: showBad && good < -10,
            inaccuracy: showBad && good < -5,
            good: this.options.moreBrilliant && good >= -1,
            best: this.options.moreBrilliant && good >= 0,
            bril: this.options.moreBrilliant ? bril >= 5 : bril >= 3
          };
          return result;
        })
        .forEach((v, x) => {
          if (!v) return;
          let symbol = null;
          let name = null;
          if (v.good) {
            if (v.bril) {
              symbol = '!!';
              name = 'Brilliant';
            } else {
              if (v.best) {
                symbol = '\u2606';
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
          lt.arrayRemoveAll(glyphs, g => g.type == 'nonStandard' && ['!', '!?', '!!', '\u2606'].includes(g.symbol));
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
          const totalMaterial = this.simple_material(node, true);
          if (maxT < tension || (maxT == tension && maxM < totalMaterial)) {
            maxT = tension;
            maxX = x;
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
          const m = node.ply % 2 ? -1 : 1;
          const maxMaterial = Math.abs(this.maxMaterialWon(board, m));
          if (maxM < maxMaterial) {
            maxM = maxMaterial;
            maxX = x;
          }
        });
      return maxX;
    };

    getInterestingMoveElements = (orientation) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const side = orientation == 'black' ? 0 : 1;
      const mainline = analysis.mainline;
      const result = [];
      for (let i = 0; i < mainline.length; i++) {
        const move = mainline[i];
        if (move.ply % 2 != side) continue;
        const glyph = move?.glyphs?.at(0);
        if (!glyph) continue;
        if (!['!', '!!', '!?', '\u2606'].includes(glyph.symbol)) continue;
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
      const arr = [].concat.apply([], ['!', '!?', '!!', '\u2606'].map(s => state?.glyphs[s]).filter(a => !!a?.length));
      if (!arr.length) return;
      const fill = (container, count, color) => {
        let elem = $('div.lichessTools-goodMoves', container);
        if (!elem.length) {
          elem = $('<div></div>')
            .addClass('lichessTools-goodMoves')
            .addClass('advice-summary__error')
            .text(' ' + trans.noarg('goodMovesText'))
            .prepend($('<strong></strong>'))
            .attr('title', trans.noarg('goodMovesTitle'))
            .on('click', (ev) => {
              ev.preventDefault();
              lt.jumpToGlyphSymbols(this.options.moreBrilliant ? ['!?', '!!'] : ['!', '!?', '!!', '\u2606'], color);
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
              chart.setActiveElements(elems);
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
              chart.setActiveElements(elems);
              chart.update('none');
            })
            .insertAfter($('div.advice-summary__player', container));
        }
        elem.toggleClass('symbol', !!count);
        $('strong', elem).text(count || 0);
      };
      let container = $('div.advice-summary__side').get(0);
      let count = arr.filter(n => n.ply % 2 == 1).length;
      fill(container, count, 'white');
      container = $('div.advice-summary__side').get(1);
      count = arr.filter(n => n.ply % 2 == 0).length;
      fill(container, count, 'black');
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
        chart.setActiveElements(elements);
        chart.update('none');
        xElem.css('color', color);
        await lt.timeout(150);
      }
      lt.global.setTimeout(() => xElem.remove(), 1000);
      dataset.hoverBackgroundColor = initHoverBackgroundColor;
      dataset.pointHoverBackgroundColor = initHoverBackgroundColor;
      chart.setActiveElements(initActiveElements);
      chart.update('none');
    };

    getChartModule = async () => {
      if (!this._module) {
        this._module = await site.asset.loadEsm('chart.game');
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
        if (lichess.analysis.onMainline) {
          localLine = lichess.analysis.mainline;
        } else {
          localLine = [...lichess.analysis.nodeList];
          let lastNode = localLine.at(-1)?.children[0];
          while (lastNode) {
            localLine.push(lastNode);
            lastNode = lastNode.children[0];
          }
        }
      }

      if (lichess.analysis.mainline.find(n => n.eval)) {
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
              .attr('data-icon', '\uE05D')
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
      if (this.options.accuracy) {
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
      if (!lt.inViewport(container)) return;
      if (node.fen == this.prevFen) return;
      this.prevFen = node.fen;
      const mat = this.simple_material(node);
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
    }

  }
  LiChessTools.Tools.ExtraChart = ExtraChartTool;
})();

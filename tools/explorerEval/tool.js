(() => {
  class ExplorerEvalTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'ChessOps'];

    preferences = [
      {
        name: 'explorerEval',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['ceval', 'db', 'lichess', 'stats', 'evalRows', 'bardp', 'spoa', 'hidden'],
        defaultValue: 'ceval,db',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerEval': 'Show evaluation of explorer moves',
        'explorerEval.ceval': 'From computer eval',
        'explorerEval.stats': 'From winning stats',
        'explorerEval.db': 'From ChessDb',
        'explorerEval.lichess': 'From Lichess',
        'explorerEval.evalRows': 'Rows from eval',
        'explorerEval.bardp': 'Bar precision',
        'explorerEval.spoa': 'Stronger Player Outcome Average',
        'explorerEval.hidden': 'Hidden',
        'fromCevalTitle': 'LiChess Tools - from computer eval, depth %s',
        'fromStatsTitle': 'LiChess Tools - from winning stats',
        'fromChessDbTitle': 'LiChess Tools - from ChessDb',
        'fromLichessTitle': 'LiChess Tools - from Lichess, depth %s',
        'evaluationTitle': 'LiChess Tools - move evaluation',
        'evalWarning': 'LiChess Tools - pay attention',
        'sharpnessTitle': 'Sharpness: %s',
        'spoaTitle': 'LiChess Tools - Stronger Player Outcome Average'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerEval': 'Arat\u0103 evaluarea mut\u0103rilor \u00een Explorator',
        'explorerEval.ceval': 'Din evaluare computer',
        'explorerEval.stats': 'Din statistici',
        'explorerEval.db': 'De la ChessDb',
        'explorerEval.lichess': 'De la Lichess',
        'explorerEval.bardp': 'Precizie bar\u0103',
        'explorerEval.spoa': 'Media Rezultatelor Juc\u0103torilor mai Buni',
        'explorerEval.evalRows': 'R\u00e2nduri din evaluare',
        'explorerEval.hidden': 'Ascunde',
        'fromCevalTitle': 'LiChess Tools - din evaluare computer, ad\u00e2ncime %s',
        'fromStatsTitle': 'LiChess Tools - din statistici',
        'fromChessDbTitle': 'LiChess Tools - de la ChessDb',
        'fromLichessTitle': 'LiChess Tools - de la Lichess, ad\u00e2ncime %s',
        'evaluationTitle': 'LiChess Tools - evaluare mutare',
        'evalWarning': 'LiChess Tools - aten\u0163ie',
        'sharpnessTitle': 'Periculozitate: %s',
        'spoaTitle': 'LiChess Tools - Media Rezultatelor Juc\u0103torilor mai Buni'
      }
    }

    showEvaluations(result) {
      const moves = result?.moves;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess?.analysis;
      const orientation = analysis.getOrientation() == 'black' ? -1 : 1;
      $('section.explorer-box table.moves.lichessTools-evalTable').remove();
      let container = $('section.explorer-box table.moves');
      if (!container.length) {
        if (this.options.evalRows && moves?.length) {
          const dataElem = $('section.explorer-box div.data');
          $('div.message', dataElem).remove();
          container = $('<table class="moves lichessTools-evalTable">')
            .append(
              $('<tbody>')
                .attr('data-fen', analysis.node.fen)
                .on("mouseover", ev => {
                  const uci = $(ev.target).parents("tr").attr("data-uci");
                  analysis.explorer.setHovering($(ev.currentTarget).attr("data-fen"), uci);
                })
                .on("mouseout", ev => {
                  analysis.explorer.setHovering($(ev.currentTarget).attr("data-fen"), null);
                })
                .on("click", ev => {
                  const uci = $(ev.target).parents("tr").attr("data-uci");
                  analysis.explorerMove(uci);
                })
            )
            .appendTo(dataElem);
          dataElem.toggleClassSafe('empty',false);
        } else {
          return;
        }
      }
      if (lt.isGamePlaying()) return;
      if (!$('th.lichessTools-explorerEval', container).length) {
        $('<th>')
          .toggleClass('lichessTools-explorerEval')
          .text(lt.icon.NorthEastArrowWithHook)
          .attr('title', trans.noarg('evaluationTitle'))
          .insertAfter($('th:nth-child(1)', container));
      }
      $('tr:has(.lichessTools-evalRow)', container).remove();
      if (this.options.evalRows && moves?.length) {
        const co = lt.chessops;
        const newRows = moves.filter(m => !$('tr[data-uci="' + m.uci + '"]', container).length);
        const fen = co.fen.parseFen(analysis.node.fen).unwrap();
        const ch = co.Chess.fromSetup(fen).unwrap();
        const sumElem = $('tr.sum', container);
        for (const newRow of newRows) {
          const uci = newRow.uci;
          if (!uci) continue;
          const move = co.parseUci(uci);
          const san = co.san.makeSan(ch, move);
          if ($('td', container).filter((i, e) => $(e).text() == san).length) continue; //castling can be identified by multiple ucis (i.e. e1g1, e1h1)
          const newTr = $('<tr>')
            .attr('data-uci', uci)
            .append($('<td>').text(san))
            .append($('<td colspan="100" class="lichessTools-evalRow">'));
          if (sumElem.length) {
            newTr.insertBefore(sumElem);
          } else {
            newTr.appendTo($('tbody', container));
          }
        }
      }
      const decimals = lt.currentOptions.getValue('cevalDecimals') ? 2 : 1;
      $('tr[data-uci],tr.sum', container).each((i, e) => {
        if (!$('td.lichessTools-explorerEval', e).length) {
          $('<td>')
            .addClass('lichessTools-explorerEval')
            .insertAfter($('td:nth-child(1)', e));
        }
        const uci = $(e).attr('data-uci');
        let move = moves?.find(m => m.uci == uci);
        let explorerItem = uci
          ? (analysis.explorer.current()?.moves || []).find(i => i.uci == uci)
          : analysis.explorer.current();
        if (!explorerItem) {
          if (this.options.evalRows && moves?.length) {
            explorerItem = {};
          } else {
            return;
          }
        }

        const total = explorerItem.white + explorerItem.draws + explorerItem.black;
        const wr = (explorerItem.white + explorerItem.draws / 2) / total;
        let cp = -Math.log(1 / wr - 1) * 330
        const isInfinite = !Number.isFinite(cp);
        if (isInfinite) {
          cp = Math.sign(cp) * 10000;
        }

        const q = 1000 / total;
        const [w, d, l] = [explorerItem.white * q, Math.max(explorerItem.draws, 1) * q, explorerItem.black * q];
        const sharpness = Math.round(Math.min(w, l) / 50 * 333 / d * 1 / (1 + Math.exp(-(w + l) / 1000)));
        const tdBar = $('td:has(div.bar)', e);
        if (tdBar.length && !Number.isNaN(total)) {
          if (sharpness && Number.isFinite(sharpness)) {
            const sharpnessTitle = trans.pluralSame('sharpnessTitle', sharpness);
            const tdTitle = tdBar.attr('title')?.split(' / ')?.at(0) + ' / ' + sharpnessTitle;
            tdBar.attr('title', tdTitle);
          }
          if (this.options.bardp) {
            [
              ['white',w],
              ['draws',d],
              ['black',l]
            ].forEach(a=>{
              const el = tdBar.find('.'+a[0]);
              // using text breaks Explorer tabs (Lichess keeps reference to the text node)
              if (el.text()) el.replaceText(Math.round(a[1])/10+'%');
            });
          }
        }

        let text = '';
        let rank = -1;
        let title = null;
        if (move) {
          text = move.mate ? ('M' + move.mate) : (move.cp / 100).toFixed(decimals);
          rank = move.rank;
          switch (rank) {
            case null: title = trans.pluralSame('fromCevalTitle', move.depth); break;
            case 0:
            case 1:
            case 2:
            case 3:
              title = trans.noarg('fromChessDbTitle');
              break;
            case 5: title = trans.pluralSame('fromLichessTitle', move.depth); break;
          }

          explorerItem.cp = move.cp;
          explorerItem.mate = move.mate;

          if (total >= 100) {
            const moveCp = lt.getCentipawns(move);
            const sim = Math.round(Math.abs(moveCp - cp) / (Math.abs(moveCp) + Math.abs(cp)) * 100);
            if (sim >= 20) {
              explorerItem.diff = Math.abs(moveCp - cp);
              explorerItem.signVal = orientation * (Math.abs(moveCp) > Math.abs(cp)
                ? moveCp
                : cp);
            }
          }
        } else if (this.options.stats) {
          if (!isInfinite && total >= 100) {
            title = trans.noarg('fromStatsTitle');
            text = (cp / 100).toFixed(decimals);
          }
          explorerItem.cp = cp;
          explorerItem.mate = undefined;
        }

        $('td.lichessTools-explorerEval', e)
          .text(text)
          .attr('title', title)
          .toggleClassSafe('lichessTools-stat', rank === -1)
          .toggleClassSafe('lichessTools-bad', rank === 0)
          .toggleClassSafe('lichessTools-good', rank === 1)
          .toggleClassSafe('lichessTools-best', rank === 2)
          .toggleClassSafe('lichessTools-cloud', rank === 5);
        $('td.lichessTools-evalRow', e)
          .text(title);
        $(e)
          .toggleClassSafe('lichessTools-warning-red', false)
          .toggleClassSafe('lichessTools-warning-green', false)
          .toggleClassSafe('lichessTools-warning-blue', false)
          .removeAttrSafe('title');
        if (explorerItem.diff > 200) {
          $(e)
            .toggleClassSafe(explorerItem.signVal < 0 ? 'lichessTools-warning-red' : 'lichessTools-warning-green', true)
            .attr('title', trans.noarg('evalWarning'));
        } else
        if (sharpness >= 100) {
          $(e)
            .toggleClassSafe('lichessTools-warning-blue', true)
            .attr('title', trans.noarg('evalWarning'));
        }
      });
      this.showSPOA();
    }

    showSPOA = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      $('section.explorer-box span.spoa').empty();
      if (!this.options.spoa) return;
      const current = lichess.analysis?.explorer?.current();
      if (!current) return;

      const getSpoa = (games) => {
        let result = 0;
        if (!games?.length) return result;
        for (const game of games) {
          const key = game.black.rating > game.white.rating ? 'black' : 'white';
          if (!game.winner) {
            result += 0.5;
          } else {
            if (game.winner == key) result += 1;
          }
        }
        return Math.round(100*result/games.length)+'%';
      };

      const populateSpoa = (spoa, el) => {
        if (!el.length) return;
        if (el.find('div.lichessTools-spoa').length) {
          el.find('span.spoa').text(spoa);
        } else {
          const text = el.text();
          el.empty()
            .append($('<div class="lichessTools-spoa">')
                      .append($('<span>').text(text))
                      .append($('<span class="spoa">')
                                .attr('title',trans.noarg('spoaTitle'))
                                .text(text))
            );
        }
      };

      const tables = $('section.explorer-box .data table.games').get();

      if (current.topGames?.length) {
        const spoa = getSpoa(current.topGames);
        const el = $(tables.at(0)).find('thead th.title');
        populateSpoa(spoa, el);
      }

      if (current.recentGames?.length) {
        const spoa = getSpoa(current.recentGames);
        const el = $(tables.at(-1)).find('thead th.title');
        populateSpoa(spoa, el);
      }
    };

    cache404 = {};
    setCached404 = (path) => path ? this._setCached404(path, this.cache404) : false;
    getCached404 = (path) => path ? this._getCached404(path, this.cache404) : false;
    _setCached404 = (path, node) => {
      if (node === true) return;
      const key = path?.slice(0, 2);
      if (key) {
        let newNode = node[key];
        if (!newNode) {
          if (path == key) {
            node[key] = true;
            return;
          }
          newNode = {};
          node[key] = newNode;
        }
        this._setCached404(path?.slice(2), newNode);
      }
    };
    _getCached404 = (path, node) => {
      const key = path?.slice(0, 2);
      if (!key) {
        return false;
      }
      const newNode = node[key];
      if (newNode === true) return true;
      if (!newNode) {
        return false;
      }
      return this._getCached404(path?.slice(2), newNode);
    };

    cache = {};
    doEvaluation = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis.explorer?.enabled() || analysis.explorer?.loading()) return;
      if (lt.isGamePlaying()) return;
      const explorerMoves = analysis.explorer?.current()?.moves;
      if (!this.options.evalRows) {
        if (!explorerMoves?.length) return;
        if (!lt.inViewport($('section.explorer-box table.moves'))) {
          this.doEvaluationDebounced();
          return;
        }
      } else {
        if (!lt.inViewport($('section.explorer-box'))) {
          this.doEvaluationDebounced();
          return;
        }
      }
      $('table.moves tr.sum td.lichessTools-explorerEval').remove();
      const fen = analysis.node.fen;
      const whosMove = analysis.node.ply % 2 ? -1 : 1;
      let result = this.cache[fen];
      if (this.getCached404(analysis.path)) {
        result = { moves: [] };
      }
      let newMoves = [];
      if ((this.options.db || this.options.lichess) && !lt.net.slowMode && result === undefined && (!this.options.ceval || !analysis.ceval.enabled())) {
        result = { moves: [] };
        if (this.options.db && !newMoves?.length) {
          const obj = await lt.api.evaluation.getChessDb(fen);
          newMoves = obj?.moves?.map(m => {
            return {
              depth: 50, //assumed
              uci: m.uci,
              cp: m.winrate ? whosMove * m.score : null,
              mate: m.winrate ? null : whosMove * Math.sign(m.score) * (30000 - Math.abs(m.score)),
              rank: m.rank
            };
          });
        }
        if (this.options.lichess && !newMoves?.length) {
          let obj = await lt.api.evaluation.getLichess(fen, 5);
          if (obj) {
            newMoves = obj?.pvs?.map(m => {
              return {
                depth: obj.depth,
                uci: m.moves?.split(' ')[0],
                cp: m.cp,
                mate: m.mate,
                rank: 5
              };
            });
            if (newMoves?.length && !lt.net.slowMode) {
              obj = await lt.api.evaluation.getLichess(fen, 10);
              if (obj) {
                obj.pvs?.forEach(m => {
                  const uci = m.moves?.split(' ')[0];
                  if (newMoves.find(nm => nm.uci == uci)) return;
                  newMoves.push({
                    depth: obj.depth,
                    uci: uci,
                    cp: m.cp,
                    mate: m.mate,
                    rank: 5
                  });
                });
              }
            }
          }
        }
        if (newMoves?.length) {
          newMoves.forEach(nm => {
            const uci = nm.moves?.at(0);
            const existingMove = result.moves.find(m => m.uci == uci);
            if (existingMove) {
              if (nm.depth > existingMove.depth) {
                existingMove.depth = nm.depth;
                existingMove.cp = nm.cp;
                existingMove.mate = nm.mate;
              }
            } else {
              result.moves.push(nm);
            }
          });
        } else {
          this.setCached404(analysis.path);
        }
      }
      result = result || { moves: [] };
      const ceval = analysis.ceval?.curEval || analysis.ceval?.lastStarted?.steps?.at(-1)?.ceval || analysis.node.ceval;
      const pvs = this.options.ceval && ceval?.fen == analysis.node.fen
        ? ceval?.pvs
        : null;
      if (pvs?.length) {
        pvs.forEach(p => {
          const uci = p.moves?.at(0);
          const existingMove = result.moves.find(m => m.uci == uci);
          if (existingMove) {
            if (ceval.depth > existingMove.depth) {
              existingMove.depth = ceval.depth;
              existingMove.cp = p.cp;
              existingMove.mate = p.mate;
              existingMove.rank = null;
            }
          } else {
            result.moves.push({
              depth: ceval.depth,
              uci: uci,
              cp: p.cp,
              mate: p.mate,
              rank: null
            });
          }
        });
      }
      if (result.moves?.length) {
        this.cache[fen] = result;
        if (result.moves.find(m=>m.depth>15)) {
          lt.arrayRemoveAll(result.moves, m=>m.depth<12);
        }
      }
      this.showEvaluations(result);
    };
    doEvaluationDebounced = this.lichessTools.debounce(this.doEvaluation, 100);

    rebind = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      if (!this.options.isSet) {
        explorer.setNode = lt.unwrapFunction(explorer.setNode, 'explorerEval');
      } else {
        if (!lt.isWrappedFunction(explorer.setNode, 'explorerEval')) {
          explorer.setNode = lt.wrapFunction(explorer.setNode, {
            id: 'explorerEval',
            after: async ($this, result, ...args) => {
              if (!explorer.lastStream) return;
              await explorer.lastStream.promise;
              this.doEvaluationDebounced();
            }
          });
        }
        this.doEvaluationDebounced();
      }
      if (!this.options.ceval) {
        analysis.onNewCeval = lt.unwrapFunction(analysis.onNewCeval, 'explorerEval');
      } else {
        if (!lt.isWrappedFunction(analysis.onNewCeval, 'explorerEval')) {
          analysis.onNewCeval = lt.wrapFunction(analysis.onNewCeval, {
            id: 'explorerEval',
            after: async ($this, result, ...args) => {
              this.doEvaluationDebounced();
            }
          });
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('explorerEval');
      this.logOption('Explorer eval', value);
      const prevBardp = this.options?.bardp;
      this.options = {
        ceval: lt.isOptionSet(value, 'ceval'),
        stats: lt.isOptionSet(value, 'stats'),
        db: lt.isOptionSet(value, 'db') || lt.isOptionSet(value, 'chessdb'),
        lichess: lt.isOptionSet(value, 'lichess'),
        evalRows: lt.isOptionSet(value, 'evalRows'),
        bardp: lt.isOptionSet(value, 'bardp'),
        spoa: lt.isOptionSet(value, 'spoa'),
        hidden: lt.isOptionSet(value, 'hidden'),
        get isSet() { return !this.hidden && (this.ceval || this.db || this.lichess || this.stats || this.evalRows || this.bardp || this.spoa); }
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const explorer = lichess?.analysis?.explorer;
      if (!explorer) return;
      lt.pubsub.off('lichessTools.redraw', this.rebind);
      $('th.lichessTools-explorerEval,td.lichessTools-explorerEval').remove();
      explorer.setNode = lt.unwrapFunction(explorer.setNode, 'explorerEval');
      if (this.options.isSet) {
        this.cache = {};
        lt.pubsub.on('lichessTools.redraw', this.rebind);
      }
      this.rebind();
      if (!this.options.bardp && prevBardp && explorer.enabled()) {
        explorer.destroy();
        explorer.reload();
      }
    }

  }
  LiChessTools.Tools.ExplorerEval = ExplorerEvalTool;
})();

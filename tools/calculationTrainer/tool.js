(() => {
  class CalculationTrainerTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Stockfish', 'ChessOps'];

    preferences = [
      {
        name: 'calculationTrainer',
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
        'options.calculationTrainer': 'Calculation trainer',
        'calculationPoints': 'Points: %s',
        'calculationMoves': 'Moves: %s',
        'noAvailableMoves': 'No more moves',
        'calculationEval': 'Eval: %s',
        'calculationTrainerText': 'Calculation',
        'calculationTrainerTitle': 'LiChess Tools - calculation trainer from current position',
        'calculationTrainerHeader': 'Calculation Trainer',
        'showArrowsText': 'Arrows',
        'showArrowsTitle': 'Show arrows on hover',
        'showBoardText': 'Board',
        'showBoardTitle': 'Update board - not recommended',
        'showEvalText': 'Evaluation',
        'showEvalTitle': 'Show computer evaluation - not recommended'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.calculationTrainer': 'Antrenor de calcul',
        'calculationPoints': 'Puncte: %s',
        'calculationMoves': 'Mut\u0103ri: %s',
        'noAvailableMoves': 'Nu mai sunt mut\u0103ri',
        'calculationEval': 'Eval: %s',
        'calculationTrainerText': 'Calcul',
        'calculationTrainerTitle': 'LiChess Tools - antrenor de calcul din pozi\u0163ia curent\u0103',
        'calculationTrainerHeader': 'Antrenor de calcul',
        'showArrowsText': 'S\u0103ge\u0163i',
        'showArrowsTitle': 'Arat\u0103 s\u0103ge\u0163i la hover',
        'showBoardText': 'Tabl\u0103',
        'showBoardTitle': 'Actualizeaz\u0103 tabla - nerecomandat',
        'showEvalText': 'Evaluare',
        'showEvalTitle': 'Arat\u0103 evaluarea computerului - nerecomandat'
      }
    }

    trainPosition = async (container, fen, sfOptions, display={ points:0, moves:0 }, info) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;

      container = $(container);
      container.html(lt.spinnerHtml);

      info ||= await lt.stockfish.evaluate(fen,sfOptions);
      container.empty();

      const score = $('<div class="score">')
        .append($('<span>')
                  .text(trans.pluralSame('calculationMoves',display.moves))
        )
        .append($('<span>')
                  .toggleClass('good',display.points&&display.points==display.moves*100)
                  .toggleClass('bad',display.points!=display.moves*100)
                  .text(trans.pluralSame('calculationPoints',display.points+'/'+(display.moves*100)))
        )
        .appendTo(container);

      if (!info?.[0]?.pv?.[0]) {
        $('<span class="empty">')
          .text(trans.noarg('noAvailableMoves'))
          .appendTo(container);
      } else {
        if (this.options.eval) {
          const ceval = { mate: info[0].mate?.[0], cp: info[0].cp?.[0] };
          const decimals = lt.currentOptions.getValue('cevalDecimals') ? 2 : 1;
          const side = fen.split(' ')[1] == 'b' ? -1 : 1;
          const evalText = (ceval.mate!==undefined ? '#' + (side * ceval.mate) : ((side * ceval.cp) > 0 ? '+' : '') + (side * ceval.cp / 100).toFixed(decimals));
          score
            .append($('<span>')
                      .text(trans.pluralSame('calculationEval',evalText))
          );
        }

        const data = info.map(i=>({
          cp: lt.getCentipawns(i),
          uci: i.pv?.[0]
        }));
        const best = lt.winPerc(data[0].cp);

        lt.arrayShuffle(data);
        const co = await lt.chessops();
        const fenInfo = co.fen.parseFen(fen).unwrap();
        const ch = co.Chess.fromSetup(fenInfo).unwrap();

        const buttonContainer = $('<div class="choices">')
          .appendTo(container);
        for (const info of data) {
          const uci = info.uci;
          const move = co.parseUci(uci);
          const san = co.san.makeSan(ch, move).replaceAll('#','');
        
          $('<button type="button" class="button">')
            .text(san)
            .on('pointerover',ev=>{
              if (!this.options.arrows) return;
              analysis.explorer.setHovering(analysis.node.fen, uci);
            })
            .on('pointerout',ev=>{
              analysis.explorer.setHovering(analysis.node.fen, null);
            })
            .on('click',ev=>{
              ev.preventDefault();
              const winPerc = lt.winPerc(info.cp);
              const moveAccuracy = lt.accuracy(best, winPerc);
              display.moves++;
              display.points += Math.round(moveAccuracy*10)/10;
              const ch2 = ch.clone();
              ch2.play(move);
              const newFen = co.fen.makeFen(ch2.toSetup());
              if (this.options.board) {
                analysis.chessground.set({fen: newFen});
              }
              this.trainPosition(container, newFen, sfOptions, display);
            })
            .appendTo(buttonContainer);
        }
      }
      const toggleContainer = $('<div class="toggles">')
        .appendTo(container);
      
      $.createToggle('abset-arrows',trans.noarg('showArrowsText'),trans.noarg('showArrowsTitle'))
        .on('change', async () => {
            this.options.arrows = !this.options.arrows;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, sfOptions, display, info);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.arrows);
      
      $.createToggle('abset-board',trans.noarg('showBoardText'),trans.noarg('showBoardTitle'))
        .on('change', async () => {
            this.options.board = !this.options.board;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, sfOptions, display, info);
            analysis.chessground.set({fen: this.options.board ? fen : analysis.node.fen});
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.board);
      
      $.createToggle('abset-eval',trans.noarg('showEvalText'),trans.noarg('showEvalTitle'))
        .on('change', async () => {
            this.options.eval = !this.options.eval;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, sfOptions, display, info);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.eval);
    }

    updatePlacement = (data) => {
      const lt = this.lichessTools;
      this.options.placement = data;
      lt.storage.set('LiChessTools.calculationTrainer',this.options);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('calculationTrainer');
      this.logOption('Calculation trainer', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = lt.translator;
      const container = $('#topnav section a[href="/learn"]+div[role="group"]');
      container.find('.lichessTools-calculationTrainer').remove();
      lt.pubsub.off('lichessTools.setDialogPlacement', this.updatePlacement);
      if (!value) return;

      this.options = lt.storage.get('LiChessTools.calculationTrainer') || { arrows: true };
      lt.pubsub.on('lichessTools.setDialogPlacement', this.updatePlacement);

      $('<a>')
        .addClass('lichessTools-calculationTrainer')
        .text(trans.noarg('calculationTrainerText'))
        .attr('title', trans.noarg('calculationTrainerTitle'))
        .on('click',async (ev)=>{
          // TODO remember position and size
          ev.preventDefault();
          const dlg = await lt.dialog({
            header: trans.noarg('calculationTrainerHeader'),
            resizable: true
          });

          const sfOptions = {
            depth: 16,
            pv: 4
          };
          $(dlg)
            .on('close',()=>{ 
              sfOptions.cancelRequested = true;
              analysis.chessground.set({fen: analysis.node.fen});
             })
            .addClass('lichessTools-calculationTrainer');
          const dialogPlacement = this.options.placement;
          if (dialogPlacement) {
            $(dlg)
              .css('left', dialogPlacement.left || 'unset')
              .css('right', dialogPlacement.right || 'unset')
              .css('top', dialogPlacement.top || 'unset')
              .css('bottom', dialogPlacement.bottom || 'unset');
            $('.dialog-content', dlg)
              .css('width', dialogPlacement.width)
              .css('height', dialogPlacement.height);
          }

          lt.global.setTimeout(async ()=>{
            dlg.focus();
            const container = $(dlg).find('.dialog-content')[0];
            await this.trainPosition(container, analysis.node.fen,sfOptions);
          },100);
          dlg.showModal();          
        })
        .insertAfter(container.find('[href="/training/coordinate"]'));
    }

  }
  LiChessTools.Tools.CalculationTrainer = CalculationTrainerTool;
})();

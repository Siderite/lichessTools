(() => {
  class CalculationTrainerTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Stockfish', 'ChessOps', 'Dialog'];

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
        'showEvalTitle': 'Show computer evaluation - not recommended',
        'calculationDepthText': 'Depth: %s',
        'calculationDepthTitle': 'LiChess Tools - engine depth',
        'calculationClickShowText': 'Accuracy',
        'calculationClickShowTitle': 'LiChess Tools - show the accuracy of each choice on click',
        'calculationReadAloudText': 'Speak',
        'calculationReadAloudTitle': 'LiChess Tools - read the move aloud on click',
        'calculationBackText': 'Back',
        'calculationBackTitle': 'LiChess Tools - undo last move\r\nAvoid abusing it',
        'calculationConfigTitle': 'LiChess Tools - configure Calculation Trainer',
        'calculationTrainerDescription': 'Train your calculation and visualization skills from the current position. Find the best candidate move for each side. Configure and then press Go.',
        'calculationGoText': 'Go',
        'calculationManualChoiceText': 'Manual',
        'calculationManualChoiceTitle': 'LiChess Tools - manual move entry',
        'calculationManualChoicePrompt': 'Enter candidate moves in UCI or SAN format',
        'calculationManualChoiceError': 'Bad input: %s',
        'noMovesEntered': 'no moves entered'
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
        'showEvalTitle': 'Arat\u0103 evaluarea computerului - nerecomandat',
        'calculationDepthText': 'Nivel: %s',
        'calculationDepthTitle': 'LiChess Tools - nivel pentru motorul de analiz\u0103',
        'calculationClickShowText': 'Acurate\u0163e',
        'calculationClickShowTitle': 'LiChess Tools - arat\u0103 acurate\u0163ea la clic',
        'calculationReadAloudText': 'Vorbe\u015fte',
        'calculationReadAloudTitle': 'LiChess Tools - cite\u015fte mutarea cu voce tare la clic',
        'calculationBackText': '\u00CEnapoi',
        'calculationBackTitle': 'LiChess Tools - anuleaz\u0103 ultima mutare\r\nEvit\u0103 s\u0103 abuzezi de asta',
        'calculationConfigTitle': 'LiChess Tools - configureaz\u0103 Antrenor de calcul',
        'calculationTrainerDescription': 'Antreneaz\u0103-\u0163i abilit\u0103\u0163ile de calcul \u015Fi vizualizare din pozi\u0163ia curent\u0103. G\u0103se\u015Fte cea mai bun\u0103 mi\u015Fcare candidat pentru fiecare parte. Configureaz\u0103 \u015Fi apoi apas\u0103 Porne\u015fte.',
        'calculationGoText': 'Porne\u015fte',
        'calculationManualChoiceText': 'Manual',
        'calculationManualChoiceTitle': 'LiChess Tools - introducere manual\u0103 a mut\u0103rilor',
        'calculationManualChoicePrompt': 'Introdu mut\u0103ri candidat \u00een format UCI sau SAN',
        'calculationManualChoiceError': 'Introducere gre\u015fit\u0103: %s',
        'noMovesEntered': 'nicio mutare introdus\u0103'
      }
    }

    uciToMove = (uci)=>uci?.length==4?[uci.slice(0,2), uci.slice(2,4)]:undefined;

    trainPosition = async (container, fen, uci, settings={ history:[] }) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;

      let historyItem = settings.history.at(-1);
      if (fen != historyItem?.fen) {
        historyItem = {
          fen: fen,
          uci: uci,
          score: 0
        };
        settings.history.push(historyItem);
      }
      if (this.options.board) {
        analysis.chessground.set({
          fen: fen,
          lastMove: this.uciToMove(uci)
        });
      }

      $('#tn-tg').prop('checked',false); // close the mobile menu if opened
      const co = await lt.chessops();

      container = $(container)
        .toggleClassSafe('isStart showSettings',!settings.started);

      let info = historyItem.info;
      if (!info && settings.started) {
        const start = lt.global.performance.now();
        await lt.timeout(10);
        let moves;
        if (this.options.manualChoice) {
          let invalid = [];
          do {
            moves=[];
            const text = lt.global.prompt(invalid.length
              ? trans.pluralSame('calculationManualChoiceError',invalid.join(', '))
              : trans.noarg('calculationManualChoicePrompt')
            );
            invalid = [];
            const frags = text?.split(/[,\s+]/) || [];
            const fenInfo = co.fen.parseFen(fen).unwrap();
            const ch = co.Chess.fromSetup(fenInfo).unwrap();
            for (const frag of frags) {
              if (!frag) continue;
              let move = co.san.parseSan(ch,frag);
              if (move) {
                const uci = co.makeUci(move);
                moves.push(uci);
                continue;
              }
              move = co.parseUci(frag);
              if (move) {
                const uci = co.makeUci(move);
                moves.push(uci);
                continue;
              }
              invalid.push(frag);
            }
            if (!moves.length && !invalid.length) {
              invalid.push(trans.noarg('noMovesEntered'));
            }
          } while (invalid.length);
        }

        container
          .append(lt.spinnerHtml)
          .find('.empty')
          .css('visibility','hidden');
        if (this.options.manualChoice) {
          info = await lt.stockfish.evaluate(fen,{ depth: this.options.depth, pv: 1 });
          historyItem.best = info[0];
        }
        settings.sfOptions = {
          depth: this.options.depth,
          pv: moves?.length || 4,
          moves: moves?.length ? moves : undefined
        };
        info = await lt.stockfish.evaluate(fen,settings.sfOptions);
        const order = info.map((_,idx)=>idx);
        lt.arrayShuffle(order);
        for (let i=0; i<info.length; i++) info[i].order=order[i];
        historyItem.info = [...info];
        if (settings.delay) {
          const delay = Math.max(0,settings.delay-(lt.global.performance.now()-start));
          if (delay) await lt.timeout(delay);
          settings.delay = 0;
        }
      }
      container.empty();

      const startContainer = $('<div class="start">')
        .append($('<span>').text(trans.noarg('calculationTrainerDescription')))
        .append($('<button type="button" class="button">')
           .text(trans.noarg('calculationGoText'))
           .on('click',ev=>{
             settings.started = true;
             ev.preventDefault();
             this.trainPosition(container, fen, uci, settings);
           })
        )
        .appendTo(container);

      const points = settings.history.slice(0,-1).map(h=>h.score).reduce((a, b) => a + b, 0);
      const lastScore = settings.history.at(-2)?.score || 0;
      const color = lastScore
        ? lt.getGradientColor(lastScore, [{ q: 70, color: '#FF2020' }, { q: 85, color: '#FFFF00' }, { q: 100, color: '#00FF00' }])
        : null;

      const score = $('<div class="score">')
        .append($('<span>')
                  .text(trans.pluralSame('calculationMoves',settings.history.length-1))
        )
        .append($('<span class="points">')
                  .css('--accuracy-color',color)
                  .text(trans.pluralSame('calculationPoints',(lastScore?Math.round(lastScore)+'->':'')+Math.round(points)+'/'+((settings.history.length-1)*100)))
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
          uci: i.pv?.[0],
          hash: lt.hash(lt.global.JSON.stringify(i)),
          order: i.order
        }));
        const best = lt.winPerc(this.options.manualChoice && historyItem.best
          ? lt.getCentipawns(historyItem.best)
          : data[0].cp
        );

        data.sort((a,b)=>a.order-b.order);
        const fenInfo = co.fen.parseFen(fen).unwrap();
        const ch = co.Chess.fromSetup(fenInfo).unwrap();

        const buttonContainer = $('<div class="choices">')
          .appendTo(container);
        for (const moveData of data) {
          const uci = moveData.uci;
          const move = co.parseUci(uci);
          const san = co.san.makeSan(ch, move);
        
          $('<button type="button" class="button">')
            .text(san.replaceAll('#',''))
            .attr('data-hash',moveData.hash)
            .on('pointerover',ev=>{
              if (!this.options.arrows) return;
              analysis.explorer.setHovering(analysis.node.fen, uci);
            })
            .on('pointerout',ev=>{
              analysis.explorer.setHovering(analysis.node.fen, null);
            })
            .on('click',async ev=>{
              ev.preventDefault();
              const winPerc = lt.winPerc(moveData.cp);
              const moveAccuracy = lt.accuracy(best, winPerc);
              historyItem.score = Math.round(moveAccuracy*10)/10;
              const ch2 = ch.clone();
              ch2.play(move);
              const newFen = co.fen.makeFen(ch2.toSetup());
              if (this.options.readAloud) {
                lt.stopSpeaking();
                const speakable = lt.getSpeakableText(san);
                lt.speak(speakable, { rate: 1.25 });
              }
              if (this.options.clickShow) {
                buttonContainer.find('button')
                  .each((i,e)=>{
                    const btn = $(e);
                    const inf = data.find(d=>d.hash==btn.attr('data-hash'));
                    const wp = lt.winPerc(inf.cp);
                    const acc = lt.accuracy(best,wp);
                    const color = lt.getGradientColor(acc, [{ q: 70, color: '#FF2020' }, { q: 85, color: '#FFFF00' }, { q: 100, color: '#00FF00' }]);
                    btn
                      .css('background',color)
                      .attr('data-accuracy',Math.round(acc));
                  });
                settings.delay = 2000;
              }
              this.trainPosition(container, newFen, uci, settings);
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
            this.trainPosition(container, fen, uci, settings);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.arrows);
      
      $.createToggle('abset-board',trans.noarg('showBoardText'),trans.noarg('showBoardTitle'))
        .on('change', async () => {
            this.options.board = !this.options.board;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, uci, settings);
            analysis.chessground.set({
              fen: this.options.board ? fen : analysis.node.fen,
              lastMove: this.uciToMove(this.options.board ? uci : analysis.node.uci)
            });
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.board);
      
      $.createToggle('abset-eval',trans.noarg('showEvalText'),trans.noarg('showEvalTitle'))
        .on('change', async () => {
            this.options.eval = !this.options.eval;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, uci, settings);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.eval);
      
      $.createToggle('abset-clickShow',trans.noarg('calculationClickShowText'),trans.noarg('calculationClickShowTitle'))
        .on('change', async () => {
            this.options.clickShow = !this.options.clickShow;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, uci, settings);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.clickShow);
      
      $.createToggle('abset-readAloud',trans.noarg('calculationReadAloudText'),trans.noarg('calculationReadAloudTitle'))
        .on('change', async () => {
            this.options.readAloud = !this.options.readAloud;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, uci, settings);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.readAloud);
      
      $.createToggle('abset-manualChoice',trans.noarg('calculationManualChoiceText'),trans.noarg('calculationManualChoiceTitle'))
        .on('change', async () => {
            this.options.manualChoice = !this.options.manualChoice;
            lt.storage.set('LiChessTools.calculationTrainer',this.options);
            this.trainPosition(container, fen, uci, settings);
          })
        .appendTo(toggleContainer)
        .find('input')
        .prop('checked',this.options.manualChoice);

      const depthContainer = $('<div class="depth">')
        .attr('title',trans.noarg('calculationDepthTitle'))
        .appendTo(container);
      const label = $('<label for="abset-depth">')
        .appendTo(depthContainer);
      const input = $('<input id="abset-depth" type="range" class="range" min="1" max="30">');
      input
        .on('input',()=>{
          this.options.depth = +input.val() || 16;
          label
            .text(trans.pluralSame('calculationDepthText',this.options.depth));
          lt.storage.set('LiChessTools.calculationTrainer',this.options);
        })
        .val(this.options.depth)
        .trigger('input')
        .appendTo(depthContainer);

      const actionsContainer = $('<div class="actions">')
        .appendTo(container);

      $('<button type="button">')
        .attr('data-icon',lt.icon.Gear)
        .attr('title',trans.noarg('calculationConfigTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          container.toggleClass('showSettings');
        })
        .appendTo(actionsContainer);

      $('<button type="button" class="back">')
        .text(trans.noarg('calculationBackText'))
        .attr('title',trans.noarg('calculationBackTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          settings.history.length--;
          const { fen, uci } = settings.history.length
            ? settings.history.at(-1)
            : analysis.node;
          if (!settings.history.length) settings.started = false;
          this.trainPosition(container, fen, uci, settings);
        })
        .appendTo(actionsContainer);
      return settings;
    }

    updatePlacement = (data) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$('dialog.lichessTools-calculationTrainer').length) return;
      this.options.placement = data;
      lt.storage.set('LiChessTools.calculationTrainer',this.options);
    };

    ensureInViewport = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const dialog = $('dialog.lichessTools-calculationTrainer');
      if (lt.inViewport($('.dialog-header', dialog), true) < 0.5) {
        $(dialog).css({ left: '', top: '', right: '', bottom: '' });
        $('.dialog-content', dialog).css({ width: '', height: '' });
      }
    }

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

      this.options = lt.storage.get('LiChessTools.calculationTrainer') || { arrows: true, clickShow: true };
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
            resizable: true,
            noScrollable: true
          });

          let settings = {};
          $(dlg)
            .on('close',()=>{ 
              if (settings.sfOptions) {
                settings.sfOptions.cancelRequested = true;
              }
              analysis.chessground.set({
                fen: analysis.node.fen,
                lastMove: this.uciToMove(analysis.node.uci)
              });
             })
            .on('click',ev=>{
              if (ev.target!=dlg) return;
              $(dlg).addClass('clicked');
              setTimeout(()=>$(dlg).removeClass('clicked'),500);
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
            settings = await this.trainPosition(container, analysis.node.fen, analysis.node.uci);
            this.ensureInViewport();
          },100);
          dlg.showModal();          
        })
        .insertAfter(container.find('[href="/training/coordinate"]'));
    }

  }
  LiChessTools.Tools.CalculationTrainer = CalculationTrainerTool;
})();

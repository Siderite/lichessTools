(() => {
  class ExplorerPracticeTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'DetectThirdParties', 'Stockfish', 'AdditionalGlyphs'];

    preferences = [
      {
        name: 'explorerPractice',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      },
      {
        name: 'explorerPracticeOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['showSmileys', 'sumClick', 'showNames', 'showInfoStudy', 'showInfoAnalysis'],
        defaultValue: 'showSmileys,sumClick,showInfoStudy',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerPractice': 'Practice against moves from Opening Explorer',
        'options.explorerPracticeOptions': 'Explorer Practice options',
        'explorerPracticeTitle': 'LiChess Tools - practice against Explorer moves',
        'outOfMoves': 'Out of Explorer moves',
        'explorerPracticeOptions.showSmileys': 'Show emojis when out of moves',
        'explorerPracticeOptions.sumClick': 'Click Explorer \u03A3 to make a move',
        'explorerPracticeOptions.showNames': 'Show opponent name',
        'explorerPracticeOptions.showInfoStudy': 'Explorer data in Study',
        'explorerPracticeOptions.showInfoAnalysis': 'Explorer data in Analysis',
        'sumClickTitle': 'LiChess Tools - click to make a move'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerPractice': 'Antrenament contra mut\u0103ri din Explorator',
        'options.explorerPracticeOptions': 'Op\u0163iuni pentru Antrenament cu Exploratorul',
        'explorerPracticeTitle': 'LiChess Tools - antrenament contra mut\u0103ri din Explorator',
        'outOfMoves': 'Nu mai sunt mut\u0103ri \u00een Explorator',
        'explorerPracticeOptions.showSmileys': 'Arat\u0103 emoji c\u00E2nd nu mai sunt mut\u0103ri',
        'explorerPracticeOptions.sumClick': 'Click pe \u03A3 \u00een Explorator pentru a muta',
        'explorerPracticeOptions.showNames': 'Arat\u0103 numele adversarului',
        'explorerPracticeOptions.showInfoStudy': 'Date Explorer \u00een Studii',
        'explorerPracticeOptions.showInfoAnalysis': 'Date Explorer \u00een Analiz\u0103',
        'sumClickTitle': 'LiChess Tools - click pentru a muta'
      }
    }

    writePlayerName = async () => {
      if (!this.options.showNames) return;
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      const $ = parent.$;
      const board = $('div.main-board cg-board');
      let label = $('.lichessTools-explorerPractice', board);
      let turn = analysis.turnColor();
      if (!this.isRunning || turn != analysis.getOrientation()) {
        label.remove();
        return;
      }
      while (analysis.explorer?.loading()) {
        await parent.timeout(50);
      }
      const current = analysis.explorer?.current();
      const square = this._lastUci?.slice(2, 4);
      this._lastUci = null;
      if (!square || !current || !this.isRunning || turn != analysis.getOrientation()) {
        label.remove();
        return;
      }
      if (!label.length) {
        label = $('<label class="lichessTools-explorerPractice"><span></span></label>')
          .appendTo(board);
      }
      turn = turn == 'white' ? 'black' : 'white';
      const playerNames = [...current.recentGames || [], ...current.topGames || []]
        .map(m => m[turn].name);
      const playerIndex = Math.floor(parent.random() * playerNames.length);
      const playerName = playerNames[playerIndex] || '';
      const coords = analysis.getOrientation() == 'white'
        ? { x: square.charCodeAt(0) - 97, y: (+square[1]) - 1 }
        : { x: 104 - square.charCodeAt(0), y: 8 - (+square[1]) };
      const q = board.width() / 8;
      label
        .attr('data-fen', analysis.node.fen)
        .css({ left: coords.x * q, top: (7 - coords.y) * q })
        .find('span')
        .text(playerName);
      label.toggleClass('black', turn == 'black')
    };

    removePlayerName = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const board = $('div.main-board cg-board');
      const label = $('.lichessTools-explorerPractice', board);
      label.remove();
    };

    playMove = (ignoreSide) => {
      const parent = this.lichessTools;
      const Math = parent.global.Math;
      const lichess = parent.lichess;
      const trans = parent.translator;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      const turn = analysis.turnColor();
      if (!ignoreSide && turn === analysis.getOrientation()) {
        this.inPlayMove = false;
        this.stopCeval = true;
        return;
      }
      if (!analysis.explorer?.enabled()) return;
      if (this.inPlayMove === analysis.node.fen) {
        return;
      }
      if (analysis.explorer?.loading()) {
        parent.global.setTimeout(this.process, 500);
        return;
      }
      const current = analysis.explorer?.current();
      if (!current) return;
      const moves = [...current.moves];
      const total = moves.map(m => m.total = m.black + m.draws + m.white).reduce((acc, val) => acc + val, 0);
      const index = parent.random() * total;
      let acc = 0;
      for (const move of moves) {
        acc += move.total;
        if (index <= acc) {
          this._lastUci = move.uci;
          analysis.playUci(move.uci);
          this.inPlayMove = analysis.node.fen;
          return;
        }
      }
      if (!this.isRunning) return;
      parent.announce(trans.noarg('outOfMoves'));
      this.evaluatePosition();
    };

    getEngine = async ()=>{
      const parent = this.lichessTools;
      while (this.sfLoading) {
        await parent.timeout(100);
      }
      if (this.sf) return this.sf;
      try{
        this.sfLoading = true;
        const sf = await parent.stockfish.load();
        if (!sf) throw new Error('Could not load Stockfish!');
        sf.setMultiPv(1);
        sf.on('info', i => { this.lastInfo = i; });
        sf.on('bestmove', i => { this.info = this.lastInfo; });
        this.sf=sf;
        return sf;
      } finally {
        this.sfLoading = false;
      }
    };

    evaluatePosition = async ()=>{
      if (!this.options.showSmileys) return;
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const analysis = lichess?.analysis;
      const node = analysis.node;

      if (node.glyphs?.length) return;

      this.lastInfo=null;
      this.info=null;
      this.stopCeval = false;

      const sf=await this.getEngine();
      const depth = +(parent.currentOptions.getValue('customEngineLevel')) || 16;
      sf.setDepth(depth);
      sf.setPosition(node.fen);
      sf.start();
      while (!this.info && !this.stopCeval && analysis.node === node) {
        await parent.timeout(100);
      }
      sf.stop();
      const info={...this.info};
      if (!info) return;

      const boardSign = analysis.getOrientation() == 'black' ? -1 : 1;
      const side = node.fen.split(' ')[1] == 'b' ? -1 : 1;
      const winValue = (info.cp || Math.sign(info.mate) * 1000) * boardSign * side;
      let symbol = '\uD83D\uDE10';
      if (winValue < -200) symbol = '\uD83D\uDE22';
      else if (winValue < -20) symbol = '\uD83D\uDE41';
      else if (winValue < 20) symbol = '\uD83D\uDE10';
      else if (winValue < 200) symbol = '\uD83D\uDE42';
      else if (winValue >= 200) symbol = '\uD83D\uDE01';

      node.glyphs = [{
        symbol: symbol,
        name: 'Final evaluation',
        type: 'nonStandard'
      }];
      analysis.redraw();
    };

    makeRandomMove = () => {
      this.playMove(true);
    };

    setRunning = (value) => {
      this.isRunning = value;
      if (!value) this.removePlayerName();
    };

    process = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      const analysis = lichess?.analysis;
      if (lichess.analysis.gamebookPlay()) {
        this.setRunning(false);
        return;
      };
      if (parent.isGamePlaying()) {
        this.setRunning(false);
        return;
      }
      const explorerContainer = $('section.explorer-box').eq(0);
      if (!explorerContainer.length) {
        this.setRunning(false);
        return;
      }
      const sumRow = $('tr.sum', explorerContainer);
      sumRow.off('click', this.makeRandomMove);
      if (this.options.sumClick) {
        sumRow
          .addClass('lichessTools-sumClick')
          .attr('title', trans.noarg('sumClickTitle'))
          .on('click', this.makeRandomMove);
      } else {
        sumRow
          .removeClass('lichessTools-sumClick')
          .removeAttr('title');
      }
      const container = $('div.explorer-title', explorerContainer);
      if (!container.length) {
        this.setRunning(false);
        return;
      };
      let button = $('span.lichessTools-explorerPractice', container);
      if (!button.length) {
        button = $('<span>')
          .addClass('lichessTools-explorerPractice')
          .attr('title', trans.noarg('explorerPracticeTitle'))
          .attr('data-icon', '\uE021')
          .on('click', ev => {
            ev.preventDefault();
            this.setRunning(!this.isRunning);
            this.process();
            parent.emitRedraw();
          })
          .prependTo(container);
      }
      if (!analysis.explorer?.enabled()) {
        this.setRunning(false);
      }
      button.toggleClass('active', !!this.isRunning);
      const hideData = analysis.study
        ? !this.options.showInfoStudy
        : !this.options.showInfoAnalysis;
      explorerContainer.toggleClass('lichessTools-hideExplorerData', !!this.isRunning && hideData);
      if (this.isRunning) parent.global.setTimeout(this.playMove, 500);
    };
    processDebounced = this.lichessTools.debounce(this.process, 500);

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('explorerPractice');
      const options = parent.currentOptions.getValue('explorerPracticeOptions');
      this.options = {
        showSmileys: parent.isOptionSet(options, 'showSmileys'),
        showNames: parent.isOptionSet(options, 'showNames'),
        showInfoStudy: parent.isOptionSet(options, 'showInfoStudy'),
        showInfoAnalysis: parent.isOptionSet(options, 'showInfoAnalysis'),
        sumClick: parent.isOptionSet(options, 'sumClick')
      };
      this.logOption('Explorer practice', value);
      this.logOption(' ... options', options);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (analysis.gamebookPlay()) return;
      lichess.pubsub.off('lichessTools.redraw', this.processDebounced);
      lichess.pubsub.off('ply', this.writePlayerName);
      $('main.analyse div.analyse__controls').off('click touchend', this.process);
      parent.unbindKeyHandler('shift+l');
      analysis.userJump = parent.unwrapFunction(analysis.userJump, 'explorerPractice');
      if (!value) {
        $('section.explorer-box span.lichessTools-explorerPractice').remove();
        return;
      }
      parent.bindKeyHandler('shift+l', () => {
        this.setRunning(!this.isRunning);
        this.process();
        parent.emitRedraw();
      });
      lichess.pubsub.on('lichessTools.redraw', this.processDebounced);
      lichess.pubsub.on('ply', this.writePlayerName);
      $('main.analyse div.analyse__controls').on('click touchend', this.process);
      analysis.userJump = parent.wrapFunction(analysis.userJump, {
        id: 'explorerPractice',
        after: ($this, result, ...args) => {
          this.inPlayMove = false;
        }
      });
      this.removePlayerName();
      this.process();
    }

  }
  LiChessTools.Tools.ExplorerPractice = ExplorerPracticeTool;
})();

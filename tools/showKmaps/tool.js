(() => {
  class ShowKmapsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'showKmaps',
        category: 'general',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: false,
        wip: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showKmaps': 'Show K-MAPS',
        'kmapsTitle': `LiChess Tools - K-MAPS
  King safety: $K
  Material: $M
  Activity: $A
  Pawn structure: $P
  Space: $S`
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showKmaps': 'Arat\u0103 K-MAPS',
        'kmapsTitle': `LiChess Tools - K-MAPS
  Siguran\u0163\u0103 rege: $K
  Material: $M
  Activitate: $A
  Structur\u0103 pioni: $P
  Spa\u0163iu: $S`
      }
    }

    isGamesPage = () => {
      const lt = this.lichessTools;
      return /^\/games(\/|$)?/i.test(lt.global.location.pathname);
    };

    isBroadcastPage = () => {
      const lt = this.lichessTools;
      return /^\/broadcast\//i.test(lt.global.location.pathname);
    };

    getKmaps = (fen, isBlack) => {
      const evaluator = new ChessPositionEvaluator(fen);
      const kmaps = evaluator.evaluate();
      const q = isBlack ? -1 : 1;
      return { 
        K:q*kmaps.K,
        M:q*kmaps.M,
        A:q*kmaps.A,
        P:q*kmaps.P,
        S:q*kmaps.S,
      };
    };

    addKmapsAnchor = (el, kmaps) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!el.length) el = $(el);
      let kmapsElem = el.find('.lichessTools-kmaps');
      if (!kmapsElem.length) {
        const visibleEl = el.filter((i, e) => !!lt.inViewport(e)).eq(0);
        kmapsElem = $('<span>')
          .addClass('lichessTools-kmaps')
          .appendTo(visibleEl);
      }
      const render = (val)=>{
        const q = 0.6;
        let color;
        if (lt.isDark()) {
          color = val>0
            ? lt.getGradientColor(Math.pow(val, q), [{ q: 0, color: '#FFFFFF' }, { q: 1, color: '#00FF00' }])
            : lt.getGradientColor(Math.pow(-val, q), [{ q: 0, color: '#FFFFFF' }, { q: 1, color: '#FF0000' }]);
        } else {
          color = val>0
            ? lt.getGradientColor(Math.pow(val, q), [{ q: 0, color: '#404040' }, { q: 1, color: '#00FF00' }])
            : lt.getGradientColor(Math.pow(-val, q), [{ q: 0, color: '#404040' }, { q: 1, color: '#FF0000' }]);
        }
        return $('<span>')
         .css('--kmaps-color',color);
      }
      kmapsElem.empty()
        .attr('title',trans.noarg('kmapsTitle')
                        .replace('$K',Math.round(kmaps.K*100))
                        .replace('$M',Math.round(kmaps.M*100))
                        .replace('$A',Math.round(kmaps.A*100))
                        .replace('$P',Math.round(kmaps.P*100))
                        .replace('$S',Math.round(kmaps.S*100)))
        .append(render(kmaps.K).text('K'))
        .append($('<span>').text('-'))
        .append(render(kmaps.M).text('M'))
        .append(render(kmaps.A).text('A'))
        .append(render(kmaps.P).text('P'))
        .append(render(kmaps.S).text('S'));
    };

    miniGameKmaps = async (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      let fen = '';
      if (el?.id && el?.fen) {
        fen = el.fen;
        el = $('.mini-game-' + el.id);
        if (!el.length) return;
      };
      if (!$(el).length) el = $.cached('body');
      const elems = $(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      for (const el of elems) {
        if (!lt.inViewport(el)) continue;
        fen = fen || $(el).attr('data-state') || lt.getPositionFromBoard(el, true);
        if (!fen) {
          lt.global.console.warn('Could not get fen for element', el);
          continue;
        }
        const kmaps = this.getKmaps(fen, $(el).attr('data-state')?.includes('black'));
        this.addKmapsAnchor(el, kmaps);
        fen = '';
      }
    };
    miniGameKmapsDebounced = this.lichessTools.debounce(this.miniGameKmaps, 500, { defer:true });

    refreshKmaps = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing')) return;
      if (this.isGamesPage() || this.isBroadcastPage()) {
        return;
      }
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables', 10000);
      const fen = lichess.analysis?.node?.fen || lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const analysisOrientation = lichess.analysis?.getOrientation();
      const isBlackOrientation = (analysisOrientation && analysisOrientation == 'black') || $('.cg-wrap').eq(0).is('.orientation-black');
      const kmaps = await this.getKmaps(fen, isBlackOrientation);
      if (!kmaps) {
        metaSection.find('.lichessTools-kmaps').remove();
        return;
      }
      this.addKmapsAnchor(metaSection, kmaps);
      if (!ply) {
        await this.miniGameKmaps();
      }
    };
    refreshKmapsDebounced = this.lichessTools.debounce(this.refreshKmaps, 500, { defer:true });

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showKmaps');
      this.logOption('Show K-MAPS', value);
      this.options = {
        enabled: !!value
      };
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      lt.uiApi.socket.events.off('endData', this.refreshKmapsDebounced);
      lt.uiApi.socket.events.off('fen', this.miniGameKmaps);
      lt.uiApi.events.off('ply', this.refreshKmapsDebounced);
      lt.pubsub.off('lichessTools.redraw', this.refreshKmapsDebounced);
      lt.pubsub.off('content-loaded', this.miniGameKmapsDebounced);
      lt.global.clearInterval(this.interval);
      if (this.options.enabled) {
        lt.uiApi.socket.events.on('endData', this.refreshKmapsDebounced);
        lt.uiApi.socket.events.on('fen', this.miniGameKmaps);
        lt.uiApi.events.on('ply', this.refreshKmapsDebounced);
        lt.pubsub.on('lichessTools.redraw', this.refreshKmapsDebounced);
        lt.pubsub.on('content-loaded', this.miniGameKmapsDebounced);
        lt.global.setTimeout(this.refreshKmapsDebounced,1000); // this is not essential to loading
        if ($('main').is('#board-editor')) {
          this.interval = lt.global.setInterval(this.refreshKmapsDebounced, 1000);
        }
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-kmaps').remove();
      }
      if (this.isGamesPage() || this.isBroadcastPage()) {
        $.cached('body').toggleClass('lichessTools-kmapsMiniGames', this.options.enabled);
      }
    }

  }

  class ChessPositionEvaluator {
    constructor(fen) {
      this.board = this.parseFEN(fen);
      this.movesCache = new Map();
      this.pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      this.centralSquares = [27, 28, 35, 36]; // d4, d5, e4, e5
    }
  
    // Parse FEN string to 8x8 board array
    parseFEN(fen) {
      const board = Array(64).fill(null);
      const position = fen.split(' ')[0];
      let square = 0;
      for (const char of position) {
        if (square >= board.length) break;
        if (char === '/') continue;
        if (/\d/.test(char)) {
          square += parseInt(char);
        } else {
          board[square] = char;
          square++;
        }
      }
      return board;
    }
  
    // Normalize a score to [-1, 1]
    normalize(score, min, max, area) {
      if (score >= max) {
        //console.log(area,score+' larger than max '+max);
        return 1;
      }
      if (score <= min) {
        //console.log(area,score+' smaller than min '+min);
        return -1;
      }
      const normalized = (2 * (score - min)) / (max - min) - 1;
      //console.log(area,score+' normalized to '+normalized);
      return normalized;
    }
  
    // King Safety (K)
    evaluateKingSafety() {
      let whiteScore = 0, blackScore = 0;
      const whiteKingIdx = this.board.indexOf('K');
      const blackKingIdx = this.board.indexOf('k');
      if (whiteKingIdx === -1 || blackKingIdx === -1) return 0;
  
      // Pawn shield (pawns in front of king)
      const whitePawnShield = this.getPawnShield(whiteKingIdx, true);
      const blackPawnShield = this.getPawnShield(blackKingIdx, false);
      whiteScore += whitePawnShield * 2;
      blackScore += blackPawnShield * 2;
  
      // Open files near king
      const whiteOpenFiles = this.getOpenFilesNearKing(whiteKingIdx, true);
      const blackOpenFiles = this.getOpenFilesNearKing(blackKingIdx, false);
      whiteScore -= whiteOpenFiles * 1.5;
      blackScore -= blackOpenFiles * 1.5;
  
      // Enemy pieces near king
      const whiteThreats = this.getEnemyThreats(whiteKingIdx, true);
      const blackThreats = this.getEnemyThreats(blackKingIdx, false);
      whiteScore -= whiteThreats * 1;
      blackScore -= blackThreats * 1;

      // Hole detection: squares that can never be attacked by friendly pawns
      const whiteHoles = this.getKingHoles(whiteKingIdx, true);
      const blackHoles = this.getKingHoles(blackKingIdx, false);
      whiteScore -= whiteHoles * 0.5;  // Penalize 1 point per hole
      blackScore -= blackHoles * 0.5;
  
      const diff = whiteScore - blackScore;
      return this.normalize(diff, -20, 20,'K'); //max is ~-10, but it can go to -25
    }
  
    getPawnShield(kingIdx, isWhite) {
      const rank = Math.floor(kingIdx / 8);
      const file = kingIdx % 8;
      let score = 0;
      const offsets = isWhite ? [-9, -8, -7] : [7, 8, 9]; // Adjacent squares in front
      for (const offset of offsets) {
        const idx = kingIdx + offset;
        if (idx >= 0 && idx < 64 && Math.abs((idx % 8) - file) <= 1) {
          const piece = this.board[idx];
          if ((isWhite && piece === 'P') || (!isWhite && piece === 'p')) score += 1;
        }
      }
      return score;
    }
  
    getOpenFilesNearKing(kingIdx, isWhite) {
      const file = kingIdx % 8;
      let openFiles = 0;
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        let hasPawn = false;
        for (let r = 0; r < 8; r++) {
          const idx = r * 8 + f;
          if ((isWhite && this.board[idx] === 'P') || (!isWhite && this.board[idx] === 'p')) {
            hasPawn = true;
            break;
          }
        }
        if (!hasPawn) openFiles++;
      }
      return openFiles;
    }
  
    getEnemyThreats(kingIdx, isWhite) {
      const file = kingIdx % 8;
      const rank = Math.floor(kingIdx / 8);
      let threats = 0;
      for (let r = Math.max(0, rank - 2); r <= Math.min(7, rank + 2); r++) {
        for (let f = Math.max(0, file - 2); f <= Math.min(7, file + 2); f++) {
          const idx = r * 8 + f;
          const piece = this.board[idx];
          if (piece && piece !== 'K' && piece !== 'k') {
            const isEnemy = isWhite ? /[a-z]/.test(piece) : /[A-Z]/.test(piece);
            if (isEnemy) threats += this.pieceValues[piece.toLowerCase()] || 0;
          }
        }
      }
      return threats / 10;
    }

    getKingHoles(kingIdx, isWhite) {
      const file = kingIdx % 8;
      const rank = Math.floor(kingIdx / 8);
      let holes = 0;
      for (let r = Math.max(0, rank - 1); r <= Math.min(7, rank + 1); r++) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          if (r === rank && f === file) continue;
          if (isWhite && r <= 1) continue;
          if (!isWhite && r >= 6) continue;
          const idx = r * 8 + f;
          if (!this.canEverBeAttackedByPawn(idx, isWhite)) holes++;
        }
      }
      return holes;
    }

    canEverBeAttackedByPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const pawnRank = isWhite ? rank - 1 : rank + 1; // Rank where pawn would attack from

      if (pawnRank < 0 || pawnRank > 7) return false;

      const friendlyPawn = isWhite ? 'P' : 'p';
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        if (f === file) continue;
        const pawnIdx = pawnRank * 8 + f;
        if (this.board[pawnIdx] === friendlyPawn) return true;
      }
      return false;
    }

    // Material (M)
    evaluateMaterial() {
      let whiteMaterial = 0, blackMaterial = 0;
      let whiteBishops = 0, blackBishops = 0;
      for (const piece of this.board) {
        if (!piece) continue;
        if (piece == 'B') whiteBishops++;
        if (piece == 'b') blackBishops++;
        const value = this.pieceValues[piece.toLowerCase()] || 0;
        if (/[A-Z]/.test(piece)) whiteMaterial += value;
        else blackMaterial += value;
      }
      if (whiteBishops == 2) whiteMaterial+0.3;
      if (blackBishops == 2) blackMaterial+0.3;
      const diff = whiteMaterial - blackMaterial;
      return this.normalize(diff, -10, 10,'M'); // Max ~39, but 10 is decisive
    }
  
    // Piece Activity (A)
    evaluatePieceActivity() {
      let whiteScore = 0, blackScore = 0;
  
      // Mobility: Count pseudo-legal moves (simplified)
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isWhite = /[A-Z]/.test(piece);
        const moves = this.getPseudoLegalMoves(i, piece);
        if (isWhite) {
          whiteScore += moves.length * 0.1;
        } else {
          blackScore += moves.length * 0.1;
        }
      }

      // Bonus for rooks and queens on open files
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isWhite = /[A-Z]/.test(piece);
        const type = piece.toLowerCase();
        if (type === 'r' || type === 'q') {
          const file = i % 8;
          if (this.isOpenFile(file)) {
            if (isWhite) {
              whiteScore += 0.3;
            } else {
              blackScore += 0.3;
            }
          }
        }
      }

      // Central control
      for (const centerIdx of this.centralSquares) {
        let whiteAttacks = 0, blackAttacks = 0;
        for (let i = 0; i < 64; i++) {
          const piece = this.board[i];
          if (!piece) continue;
          const isWhitePiece = /[A-Z]/.test(piece);
          if (piece.toLowerCase() === 'p') {
            // Pawn attacks
            const attacks = this.getPawnAttacks(i, isWhitePiece);
            if (attacks.includes(centerIdx)) {
              if (isWhitePiece) {
                whiteAttacks++;
              } else {
                blackAttacks++;
              }
            }
          } else {
            // Other pieces use pseudo-legal moves
            const moves = this.getPseudoLegalMoves(i, piece);
            if (moves.includes(centerIdx)) {
              if (isWhitePiece) {
                whiteAttacks++;
              } else {
                blackAttacks++;
              }
            }
          }
        }
        // Award bonus if more attackers
        if (whiteAttacks > blackAttacks) {
          whiteScore += 0.5;
        } else if (blackAttacks > whiteAttacks) {
          blackScore += 0.5;
        }
      }  

      const diff = whiteScore - blackScore;
      return this.normalize(diff, -10, 10,'A'); // max is ~19, but decisive would be 10
    }

    getPawnAttacks(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const attacks = [];
      const dir = isWhite ? -1 : 1; // White attacks up, Black attacks down
      // Diagonal attacks
      const attackOffsets = [-1, 1]; // Left and right files
      for (const fOffset of attackOffsets) {
        const newFile = file + fOffset;
        const newRank = rank + dir;
        if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
          const attackIdx = newRank * 8 + newFile;
          attacks.push(attackIdx);
        }
      }
      return attacks;
    }
  
    getPseudoLegalMoves(idx, piece, control) {
      const cacheKey = `${piece}${idx}`;
      let result = this.movesCache.get(cacheKey);
      if (result) return result;

      const moves = [];
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const isWhite = /[A-Z]/.test(piece);
      const type = piece.toLowerCase();
  
      const directions = {
        r: [[0, 1], [0, -1], [1, 0], [-1, 0]],
        b: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        q: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        n: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
        k: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
      };
  
      if (type === 'p') {
        if (control) throw 'Should not use control=true for pawns';
        const dir = isWhite ? -1 : 1;
        const startRank = isWhite ? 6 : 1;
        // Forward move
        let newIdx = idx + dir * 8;
        if (newIdx >= 0 && newIdx < 64 && !this.board[newIdx]) {
          moves.push(newIdx);
          // Double move from starting rank
          if (rank === startRank) {
            newIdx += dir * 8;
            if (!this.board[newIdx]) moves.push(newIdx);
          }
        }
        // Captures
        for (const f of [-1, 1]) {
          newIdx = idx + dir * 8 + f;
          if (newIdx >= 0 && newIdx < 64 && Math.abs((newIdx % 8) - file) === 1) {
            if (this.board[newIdx] && (isWhite ? /[a-z]/.test(this.board[newIdx]) : /[A-Z]/.test(this.board[newIdx]))) {
              moves.push(newIdx);
            }
          }
        }
      } else if (directions[type]) {
        for (const [dr, df] of directions[type]) {
          let r = rank + dr;
          let f = file + df;
          let steps = type === 'n' || type === 'k' ? 1 : 7;
          while (steps-- && r >= 0 && r < 8 && f >= 0 && f < 8) {
            const newIdx = r * 8 + f;
            const target = this.board[newIdx];
            if (target) {
              const targetWhite = /[A-Z]/.test(target);
              if (targetWhite == isWhite && !control) break;
              moves.push(newIdx);
              break;
            }
            moves.push(newIdx);
            r += dr;
            f += df;
          }
        }
      }
  
      result = moves.filter(i => i >= 0 && i < 64);
      this.movesCache.set(cacheKey, result);
      return result;
    }

    isOpenFile(file) {
      for (let r = 0; r < 8; r++) {
        const idx = r * 8 + file;
        if (this.board[idx] === 'P' || this.board[idx] === 'p') return false;
      }
      return true;
    }
  
    // Pawn Structure (P)
    evaluatePawnStructure() {
      let whiteScore = 0, blackScore = 0;
  
      // Count pawns per file
      const whitePawns = Array(8).fill(0);
      const blackPawns = Array(8).fill(0);
      for (let i = 0; i < 64; i++) {
        if (this.board[i] === 'P') whitePawns[i % 8]++;
        if (this.board[i] === 'p') blackPawns[i % 8]++;
      }
  
      // Doubled pawns
      for (let f = 0; f < 8; f++) {
        if (whitePawns[f] > 1) whiteScore -= (whitePawns[f] - 1) * 0.5;
        if (blackPawns[f] > 1) blackScore -= (blackPawns[f] - 1) * 0.5;
      }
  
      // Isolated pawns
      for (let f = 0; f < 8; f++) {
        if (whitePawns[f]) {
          const isIsolated = !whitePawns[Math.max(0, f - 1)] && !whitePawns[Math.min(7, f + 1)];
          if (isIsolated) whiteScore -= 0.5;
        }
        if (blackPawns[f]) {
          const isIsolated = !blackPawns[Math.max(0, f - 1)] && !blackPawns[Math.min(7, f + 1)];
          if (isIsolated) blackScore -= 0.5;
        }
      }
  
      // Passed pawns
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (piece === 'P') { // White pawn
          if (this.isPassedPawn(i, true)) {
            const r = Math.floor(i / 8); // Row from 0 (rank 8) to 7 (rank 1)
            const advancedRows = 6 - r; // Rows advanced from starting row 6
            whiteScore += 0.2 * advancedRows;
          }
        } else if (piece === 'p') { // Black pawn
          if (this.isPassedPawn(i, false)) {
            const r = Math.floor(i / 8);
            const advancedRows = r - 1; // Rows advanced from starting row 1
            blackScore += 0.2 * advancedRows;
          }
        }
      }

      // Pawn islands
      const whiteIslands = this.countPawnIslands(whitePawns);
      const blackIslands = this.countPawnIslands(blackPawns);
      whiteScore -= (whiteIslands - 1) * 0.5;
      blackScore -= (blackIslands - 1) * 0.5;

      // Backward pawns
      const whites = [];
      const blacks = [];
      for (let i=0; i<64; i++) {
        const file = i % 8;
        const rank = Math.floor(i / 8);
        const piece = this.board[i];
        if (piece=='p') {
          blacks.push(i);
        } else
        if (piece=='P') {
          whites.push(i);
        }
      }
      const whiteBackward = whites
                              .filter(pawn=>{
                                const pf = pawn%8;
                                const pr = Math.floor(pawn/8);
                                let defenders = 0;
                                let defends = 0;
                                for (const def of whites) {
                                  if (def==pawn) continue;
                                  const df = def%8;
                                  const dr = Math.floor(def/8);
                                  if ([pf-1,pf+1].includes(df)) {
                                    if (dr>=pr) defenders++;
                                    else defends++;
                                  }
                                }
                                return defends && !defenders;
                              });
      const blackBackward = blacks
                              .filter(pawn=>{
                                const pf = pawn%8;
                                const pr = Math.floor(pawn/8);
                                let defenders = 0;
                                let defends = 0;
                                for (const def of blacks) {
                                  if (def==pawn) continue;
                                  const df = def%8;
                                  const dr = Math.floor(def/8);
                                  if ([pf-1,pf+1].includes(df)) {
                                    if (dr<=pr) defenders++;
                                    else defends++;
                                  }
                                }
                                return defends && !defenders;
                              });
      whiteScore -= whiteBackward.length * 0.3;
      blackScore -= blackBackward.length * 0.3;

      const diff = whiteScore - blackScore; //TODO should we take into account the number of the pawns?
      return this.normalize(diff, -7, 7,'P'); //max delta ~15.5, but average is ~7
    }
  
    isPassedPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const direction = isWhite ? -1 : 1;
      for (let r = rank + direction; isWhite ? r >= 0 : r < 8; r += direction) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          const checkIdx = r * 8 + f;
          if ((isWhite && this.board[checkIdx] === 'p') || (!isWhite && this.board[checkIdx] === 'P')) {
            return false;
          }
        }
      }
      return true;
    }

    countPawnIslands(pawns) {
      let islands = 0;
      let inIsland = false;
      for (let f = 0; f < 8; f++) {
        if (pawns[f] > 0) {
          if (!inIsland) {
            islands++;
            inIsland = true;
          }
        } else {
          inIsland = false;
        }
      }
      return islands;
    }
   
    isBackwardPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const dir = isWhite ? -1 : 1;
      const nextRank = rank + dir;
      if (nextRank < 0 || nextRank > 7) return false;
    
      const forwardIdx = nextRank * 8 + file;
      if (this.board[forwardIdx]) return false;
    
      const canBeCaptured = this.canBeCaptured(forwardIdx, isWhite);
      if (!canBeCaptured) return false;
    
      const hasSupport = (file > 0 && this.board[rank * 8 + file - 1] === (isWhite ? 'P' : 'p')) ||
                         (file < 7 && this.board[rank * 8 + file + 1] === (isWhite ? 'P' : 'p'));
      return !hasSupport;
    }
  
    // Space Advantage (S)
    evaluateSpace() {
      let whiteScore = 0, blackScore = 0;
  
      // Count controlled squares in opponent's half
      const whiteControlled = new Set();
      const blackControlled = new Set();
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isPawn = /p/i.test(piece);
        const isWhite = /[A-Z]/.test(piece);
        const moves = isPawn
                        ? this.getPawnAttacks(i, isWhite)
                        : this.getPseudoLegalMoves(i, piece, true);
        for (const move of moves) {
          const rank = Math.floor(move / 8);
          if (isWhite && rank <= 3) whiteControlled.add(move);
          if (!isWhite && rank >= 4) blackControlled.add(move);
        }
      }
      whiteScore += whiteControlled.size * 0.1;
      blackScore += blackControlled.size * 0.1;
  
      // Bonus for central pawns
      for (const idx of this.centralSquares) {
        if (this.board[idx] === 'P') whiteScore += 1;
        if (this.board[idx] === 'p') blackScore += 1;
      }
  
      const diff = whiteScore - blackScore;
      return this.normalize(diff, -7, 7,'S'); //max is ~11, 7 should be decisive
    }
  
    // Main evaluation function
    evaluate() {
      return {
        K: this.evaluateKingSafety(),
        M: this.evaluateMaterial(),
        A: this.evaluatePieceActivity(),
        P: this.evaluatePawnStructure(),
        S: this.evaluateSpace(),
      };
    }
  }


  LiChessTools.Tools.ShowKmaps = ShowKmapsTool;
})();

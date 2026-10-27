(() => {
  class AnalysisContextActionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'CustomEngineLevel', 'ExportPGN', 'DetectThirdParties', 'Dialog', 'Stockfish', 'ChessOps'];

    preferences = [
      {
        name: 'analysisContextActions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['copyPgn', 'moveEval', 'showTranspos', 'removeSuperfluous', 'showOnEmpty', 'reorderVariations', 'positionInfo', 'lineEval'],
        defaultValue: 'copyPgn,moveEval,removeSuperfluous,showOnEmpty,reorderVariations'
      },
      {
        name: 'analysisContextActionsCoverage',
        category: 'analysis',
        type: 'single',
        possibleValues: [0,1,2,3,4,5],
        defaultValue: 0,
        advanced: true
      },
      {
        name: 'analysisContextActionsEngineDepth',
        category: 'analysis',
        type: 'number',
        defaultValue: 12,
        advanced: true
      }
    ];

    upgrades = [
      { name:'analysisContextActions', value:'reorderVariations', version: '2.4.5', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.analysisContextActions': 'Extra context menu options',
        'options.analysisContextActionsCoverage': 'Study chapter coverage depth for position info',
        'options.analysisContextActionsEngineDepth': 'Engine depth for position info (0 = no engine)',
        'analysisContextActions.copyPgn': 'Copy branch as PGN',
        'analysisContextActions.moveEval': 'Engine evaluation for last moves',
        'analysisContextActions.lineEval': 'Engine evaluation for previous moves',
        'analysisContextActions.showTranspos': 'Highlight all transpositions',
        'analysisContextActions.removeSuperfluous': 'Remove superfluous entries',
        'analysisContextActions.showOnEmpty': 'Show context menu when no moves',
        'analysisContextActions.reorderVariations': 'Reorder variations',
        'analysisContextActions.positionInfo': 'Position info',
        'extractVariationText': 'Copy branch as PGN',
        'extractVariationText_f': 'Copy PGN (fen)',
        'extractVariationText_s': 'Copy PGN (separate)',
        'extractVariationText_t': 'Copy PGN (to position)',
        'extractVariationText_fs': 'Copy PGN (fen,separate)',
        'extractVariationText_ft': 'Copy PGN (FEN position)',
        'extractVariationText_st': 'Copy PGN (to position)',
        'extractVariationText_fst': 'Copy PGN (FEN position)',
        'extractVariationTitle': 'LiChess Tools - copy branch and continuations to clipboard\r\nShift/Ctrl/Alt-click for options',
        'errorGeneratingPGN': 'Error generating PGN',
        'setCustomEngineDepth': 'You need to set a custom engine depth for this feature!',
        'evaluateTerminationsText': 'Evaluate terminating moves',
        'evaluateTerminationsTitle': 'LiChess Tools - add evaluation comment to all branch terminating moves',
        'evaluateTerminationsStarted': 'Evaluation commenting started: %s',
        'evaluateLineText': 'Evaluate previous moves',
        'evaluateLineTitle': 'LiChess Tools - evaluate all previous moves',
        'showTransposText': 'Highlight all transpositions',
        'showTransposTitle': 'LiChess Tools - highlight all transpositions',
        'bumpUpVariationText': 'Bump up',
        'bumpUpVariationTitle': 'LiChess Tools - bump up variation',
        'bumpDownVariationText': 'Bump down',
        'bumpDownVariationTitle': 'LiChess Tools - bump down variation',
        'positionInfoText': 'Position info',
        'positionInfoTitle': 'LiChess Tools - show information about selected position',
        'positionInfoPly': 'Ply',
        'positionInfoMovesSoFar': 'Moves so far',
        'positionInfoFollowingMainMoves': 'Following main moves',
        'positionInfoFollowingTotalMoves': 'Following total moves',
        'positionInfoFollowingBranches': 'Following branches',
        'positionInfoCoverage': 'Coverage',
        'positionInfoOpening': 'Opening',
        'positionInfoGamePhase': 'Game phase',
        'positionInfoPhaseOpening': 'Opening',
        'positionInfoPhaseMiddleGame': 'Middlegame',
        'positionInfoPhaseEndGame': 'Endgame',
        'positionInfoLegalMoves': 'Legal moves',
        'positionInfoTension': 'Tension',
        'positionInfoPawnStructure': 'Pawn structure',
        'positionInfoEuweKramerFormation': 'Euwe-Kramer formation',
        'positionInfoWeakSquares': 'Weak squares',
        'positionInfoCoordination': 'Coordination',
        'positionInfoKmapsWhite': 'K-MAPS (White)',
        'positionInfoSharpness': 'Sharpness',
        'positionInfoSharpnessExplorer': 'Explorer',
        'positionInfoSharpnessEngine': 'engine',
        'positionInfoPositionDifficulty': 'Position difficulty',
        'positionInfoLastMoveBrilliancy': 'Last move brilliancy',
        'positionInfoLastMoveInteresting': 'Last move interestingness',
        'analysisContextActionsCoverage.0': 'disabled',
        'analysisContextActionsCoverage.1': '1',
        'analysisContextActionsCoverage.2': '2',
        'analysisContextActionsCoverage.3': '3',
        'analysisContextActionsCoverage.4': '4',
        'analysisContextActionsCoverage.5': '5'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.analysisContextActions': 'Op\u0163iuni \u00een plus \u00een meniul context',
        'options.analysisContextActionsCoverage': 'Ad\u00e2ncime acoperire capitole studiu pentru informa\u0163ii pozi\u0163ie',
        'options.analysisContextActionsEngineDepth': 'Ad\u00e2ncime analyses: nivel motorul pentru informa\u0163ii pozi\u0163ie (0 = nicio motorul)',
        'analysisContextActions.copyPgn': 'Copiaz\u0103 varia\u0163ia ca PGN',
        'analysisContextActions.moveEval': 'Evaluare mut\u0103ri finale',
        'analysisContextActions.lineEval': 'Evaluare mut\u0103ri precedente',
        'analysisContextActions.showTranspos': 'Arat\u0103 toate transpozi\u0163iile',
        'analysisContextActions.removeSuperfluous': 'Elimin\u0103 ce e \u00een plus',
        'analysisContextActions.showOnEmpty': 'Arat\u0103 meniul context c\u00E2nd nu sunt mut\u0103ri',
        'analysisContextActions.reorderVariations': 'Ordoneaz\u0103 varia\u0163ii',
        'analysisContextActions.positionInfo': 'Informa\u0163ii pozi\u0163ie',
        'extractVariationText': 'Copiaz\u0103 varia\u0163ia ca PGN',
        'extractVariationText_f': 'Copiaz\u0103 PGN (fen)',
        'extractVariationText_s': 'Copiaz\u0103 PGN (separate)',
        'extractVariationText_t': 'Copiaz\u0103 PGN (p\u00e2n\u0103 aici)',
        'extractVariationText_fs': 'Copiaz\u0103 PGN (fen,separate)',
        'extractVariationText_ft': 'Copiaz\u0103 PGN (pozi\u0163ie FEN)',
        'extractVariationText_st': 'Copiaz\u0103 PGN (p\u00e2n\u0103 aici)',
        'extractVariationText_fst': 'Copiaz\u0103 PGN (pozi\u0163ie FEN)',
        'extractVariationTitle': 'LiChess Tools - copiaz\u0103 varia\u0163ia \u015Fi continu\u0103rile ca PGN\r\nShift/Ctrl/Alt-click pentru op\u0163iuni',
        'errorGeneratingPGN': 'Eroare generare PGN',
        'setCustomEngineDepth': 'Trebuie s\u0103 setezi un nivel personalizat pentru motorul de analiz\u0103!',
        'evaluateTerminationsText': 'Evalueaz\u0103 mut\u0103rile finale',
        'evaluateTerminationsTitle': 'LiChess Tools - adaug\u0103 comentarii cu evaluarea mut\u0103rilor finale din fiecare ramur\u0103',
        'evaluateTerminationsStarted': 'Comentarea cu evalu\u0103ri pornit\u0103: %s',
        'evaluateLineText': 'Evalueaz\u0103 mut\u0103rile precedente',
        'evaluateLineTitle': 'LiChess Tools - evalueaz\u0103 toate mut\u0103rile precedente',
        'showTransposText': 'Arat\u0103 toate transpozi\u0163iile',
        'showTransposTitle': 'LiChess Tools - arat\u0103 toate transpozi\u0163iile',
        'bumpUpVariationText': 'Urc\u0103',
        'bumpUpVariationTitle': 'LiChess Tools - urc\u0103 varia\u0163ia',
        'bumpDownVariationText': 'Coboar\u0103',
        'bumpDownVariationTitle': 'LiChess Tools - coboar\u0103 varia\u0163ia',
        'positionInfoText': 'Informa\u0163ii pozi\u0163ie',
        'positionInfoTitle': 'LiChess Tools - afi\u015feaz\u0103 informa\u0163ii despre pozi\u0163ia selectat\u0103',
        'positionInfoPly': 'Jum\u0103t\u0103\u0163i mutare',
        'positionInfoMovesSoFar': 'Mut\u0103ri p\u00e2n\u0103 acum',
        'positionInfoFollowingMainMoves': 'Urm\u0103toare mut\u0103ri pe linia principal\u0103',
        'positionInfoFollowingTotalMoves': 'Urm\u0103toare mut\u0103ri nn total',
        'positionInfoFollowingBranches': 'Varia\u0163ii urm\u0103toare',
        'positionInfoCoverage': 'Acoperire',
        'positionInfoOpening': 'Deschidere',
        'positionInfoGamePhase': 'Faza jocului',
        'positionInfoPhaseOpening': 'Deschidere',
        'positionInfoPhaseMiddleGame': 'Mijlocul partidei',
        'positionInfoPhaseEndGame': 'Final de partid\u0103',
        'positionInfoLegalMoves': 'Mut\u0103ri legale',
        'positionInfoTension': 'Tensiune',
        'positionInfoPawnStructure': 'Structura pionilor',
        'positionInfoEuweKramerFormation': 'Forma\u0163ia Euwe-Kramer',
        'positionInfoWeakSquares': 'P\u0103trate slabe',
        'positionInfoCoordination': 'Coordonare',
        'positionInfoKmapsWhite': 'K-MAPS (Alb)',
        'positionInfoSharpness': 'Periculozitate',
        'positionInfoSharpnessExplorer': 'Explorator',
        'positionInfoSharpnessEngine': 'motor',
        'positionInfoPositionDifficulty': 'Dificultatea pozi\u0163iei',
        'positionInfoLastMoveBrilliancy': 'Str\u0103lucirea ultimei mut\u0103ri',
        'positionInfoLastMoveInteresting': 'C\u00e2t de interesant\u0103 ultima mutare',
        'analysisContextActionsCoverage.0': 'dezactivat',
        'analysisContextActionsCoverage.1': '1',
        'analysisContextActionsCoverage.2': '2',
        'analysisContextActionsCoverage.3': '3',
        'analysisContextActionsCoverage.4': '4',
        'analysisContextActionsCoverage.5': '5'
      }
    }

    showPositionInfo = async (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const path = analysis?.contextMenuPath;
      if (path === undefined) return;
      const node = analysis.tree.nodeAtPath(path);
      const movesSoFar = path.length/2;
      let movesMain = 0;
      let movesTotal = 0;
      let branches = 0;
      const f = (n)=>{
        const children = analysis.visibleChildren(n);
        if (!children?.length) return;
        for (let i = 0; i<children.length; i++) {
          if (i===0) movesMain++;
          movesTotal++;
          branches+=children.length-1;
          f(children[i]);
        }
      };
      f(node);
      if (movesTotal) branches++;
      const ply = node.ply;
      const fen = node?.fen;
      const co = LiChessTools.chessopsModule;
      const board = lt.getBoardFromFen(fen);
      const prevNode = path.length>=2 ? analysis.tree.nodeAtPath(path.slice(0,-2)) : null;
      const prev2Node = path.length>=4 ? analysis.tree.nodeAtPath(path.slice(0,-4)) : null;
      const engineDepth = this.options.engineDepth;
      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      const gameData = analysis?.data?.game;
      const gameStatusId = Number(gameData?.status?.id ?? 21);
      const gameOngoing = !!gameData && gameData.id != 'synthetic' && gameStatusId <= 20;
      const hidePositionMetrics = lt.isGamePlaying() || $.cached('body').is('.playing') || gameOngoing
        || (showStaticAnalysis === false && !analysis?.cevalEnabled());
      const allowPositionMetrics = !hidePositionMetrics;
      const signed = (v,dec)=> (v>0?'+':'') + v.toFixed(dec);
      const metric = (label,fn)=>{
        try { return fn(); } catch (e) { lt.global.console.warn('positionInfo '+label,e); return null; }
      };
      const metricAsync = async (label,fn)=>{
        try { return await fn(); } catch (e) { lt.global.console.warn('positionInfo '+label,e); return null; }
      };
      const moveNumber = lt.global.Math.floor((ply + 1) / 2);
      let header;
      if (moveNumber>0 && node.san) {
        header = moveNumber + (ply % 2 == 1 ? '. ' : '...');
        header += '<san>'+node.san+'</san>';
        if (node.glyphs?.length) {
          header += node.glyphs.map(g=>g.symbol).join('');
        }
      } else {
        header = '<span>'+trans.noarg('positionInfoText')+'</span>';
      }
      const dialog = await lt.dialog({
        header: $(header),
        noDrag: true
      });
      $(dialog).addClass('lichessTools-positionInfo');
      const content = $('.dialog-content', dialog);
      const link = (text,url)=> !!url
        ? $('<a>')
          .textSafe(String(text))
          .attrSafe('href',String(url))
          .attrSafe('target','_blank')
        : String(text);
      const isMissing = (value)=> value === undefined || value === null || value === '' || (typeof value === 'number' && value !== value);
      const renderValue = (span,value)=>{
        if (typeof value === 'object') span.append(value);
        else span.textSafe(String(value));
      };
      const addRow = (label,value)=>{
        if (isMissing(value)) return;
        const row = $('<div>').appendTo(content);
        $('<span>').textSafe(String(label)).appendTo(row);
        renderValue($('<span>').appendTo(row),value);
      };
      const spinnerRow = (label)=>{
        if (label === undefined || label === null) return null;
        const row = $('<div>').appendTo(content);
        $('<span>').textSafe(String(label)).appendTo(row);
        return [ row, $('<span>').appendTo(row).append(lt.spinnerHtml) ];
      };
      const fillRow = (pair,value)=>{
        if (!pair) return;
        const row = pair?.[0];
        const valueSpan = pair?.[1];
        if (!row || !valueSpan) return;
        if (isMissing(value)) { row.remove(); return; }
        valueSpan.empty();
        renderValue(valueSpan,value);
      };
      const setRow = (pair,value)=> fillRow(pair,value);
      const setRowLazy = async (pair,valueFn)=> !pair ? null : fillRow(pair,await valueFn());
      const structureTool = lt.tools?.ShowPawnStructureTool;
      const structure = metric('pawnStructureKey',()=> board ? LiChessTools.ChessMetrics.getStructure(board) : null);
      const euweKramer = metric('euweKramerFormation',()=> board ? LiChessTools.ChessMetrics.getEuweKramer(board) : null);
      const ekText = euweKramer?.code ? (euweKramer.name ? euweKramer.code + ' ' + euweKramer.name : euweKramer.code) : null;
      const ekUrl = euweKramer?.code ? structureTool?.getEuweKramerUrl?.(euweKramer.code) : null;
      const namedOpening = (n)=> n?.opening?.name && n.opening.name != '*' ? String(n.opening.name) : null;
      const pathNodes = analysis.tree?.getNodeList?.(path) || [];
      let openingName = namedOpening(node);
      const openingIsCurrent = !!openingName;
      for (let i = pathNodes.length - 1; i >= 0 && !openingName; i--) openingName = namedOpening(pathNodes[i]);
      const openingHref = openingIsCurrent ? $('section.explorer-box div.data div.title a').attr('href') : null;
      const openingUrl = openingHref && /^\/opening\//i.test(openingHref) ? openingHref : null;
      addRow(trans.noarg('positionInfoPly'),ply);
      addRow(trans.noarg('positionInfoMovesSoFar'),movesSoFar);
      addRow(trans.noarg('positionInfoFollowingMainMoves'),movesMain);
      addRow(trans.noarg('positionInfoFollowingTotalMoves'),movesTotal);
      addRow(trans.noarg('positionInfoFollowingBranches'),branches);
      const coverageOn = this.options.positionInfoCoverageDepth && analysis.study && analysis.explorer.enabled();
      const coverageRow = coverageOn ? spinnerRow(trans.noarg('positionInfoCoverage')) : null;
      addRow(trans.noarg('positionInfoOpening'),openingName ? link(openingName,openingUrl) : null);
      const phase = metric('gamePhase',()=> LiChessTools.ChessMetrics.getGamePhase(fen,lt));
      addRow(trans.noarg('positionInfoGamePhase'),
        phase == 'endGame' ? trans.noarg('positionInfoPhaseEndGame')
          : phase == 'middleGame' ? trans.noarg('positionInfoPhaseMiddleGame')
          : phase == 'opening' ? trans.noarg('positionInfoPhaseOpening')
          : null);
      const position = allowPositionMetrics ? metric('legalMoves',()=> co ? LiChessTools.MoveGen.positionFromFen(fen,co) : null) : null;
      if (allowPositionMetrics) addRow(trans.noarg('positionInfoLegalMoves'),position ? LiChessTools.MoveGen.legalMoves(position)?.length : null);
      const tensionCp = allowPositionMetrics ? metric('tension',()=> LiChessTools.ChessMetrics.tension(node,lt)) : null;
      if (allowPositionMetrics) addRow(trans.noarg('positionInfoTension'),tensionCp == null ? null : (tensionCp/100).toFixed(1));
      const pawnRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoPawnStructure')) : null;
      pawnRow?.[1]?.addClass('pawnStructure');
      if (allowPositionMetrics) addRow(trans.noarg('positionInfoEuweKramerFormation'),ekText ? link(ekText,ekUrl) : null);
      const weakRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoWeakSquares')) : null;
      const coordRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoCoordination')) : null;
      const kmapsRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoKmapsWhite')) : null;
      const engineOn = engineDepth > 0 && allowPositionMetrics;
      const sharpnessRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoSharpness')) : null;
      const difficultyRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoPositionDifficulty')) : null;
      const brilliancyRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoLastMoveBrilliancy')) : null;
      const interestingRow = allowPositionMetrics ? spinnerRow(trans.noarg('positionInfoLastMoveInteresting')) : null;
      dialog.showModal();
      if (coverageOn) {
        const coverage = await metricAsync('coverage',async ()=> await this.computeTreeCoverage(node,this.options.positionInfoCoverageDepth));
        setRow(coverageRow,coverage == null ? null : lt.global.Math.round(coverage*100) + '%');
      }
      await setRowLazy(pawnRow,()=> metricAsync('pawnStructure',async ()=>{
        if (!structure) return null;
        const named = structureTool?.options ? await structureTool.getStructureName(structure,true) : null;
        return named?.name
          ? (named.url
              ? $('<span>').textSafe(structure + '\n').append(link(named.name,named.url))
              : structure + '\n' + named.name)
          : structure;
      }));
      await setRowLazy(weakRow,()=> metricAsync('weakSquares',async ()=>{
        if (!board) return null;
        const whiteWeak = LiChessTools.ChessMetrics.getWeakSquares(board,true);
        const blackWeak = LiChessTools.ChessMetrics.getWeakSquares(board,false);
        return 'W ' + (whiteWeak?.length ?? 0) + ' / B ' + (blackWeak?.length ?? 0);
      }));
      await setRowLazy(coordRow,()=> metricAsync('coordination',async ()=>{
        if (!board) return null;
        this._positionInfoCoordination ||= new LiChessTools.CoordinationCalculator();
        const sides = this._positionInfoCoordination.computeConnectivityScoreCapped(fen);
        const score = (side)=> side?.pieces ? lt.global.Math.round(lt.global.Math.min(50,(5 - side.avg)*side.pieces)) : 0;
        return 'W ' + score(sides.white) + ' / B ' + score(sides.black);
      }));
      await setRowLazy(kmapsRow,()=> metricAsync('kmaps',async ()=>{
        if (!co) return null;
        const kmaps = await new LiChessTools.ChessKmapsEvaluator(fen,co).evaluate();
        if (!kmaps) return null;
        return [ 'K','M','A','P','S' ]
          .map(letter=> letter + signed(lt.global.Math.round((kmaps[letter] ?? 0)*100),0))
          .join(' ');
      }));
      let search = null;
      if (engineOn) search = await metricAsync('engineSearch',async ()=> await this.engineSearch(fen,engineDepth,4));
      const bestLine = search?.lines?.[0];
      let sharpness = null;
      let sharpnessSource = null;
      const explorerItem = allowPositionMetrics ? analysis.explorer?.cache?.[fen] : null;
      if (explorerItem) {
        const explorerTotal = (explorerItem.white || 0) + (explorerItem.draws || 0) + (explorerItem.black || 0);
        if (explorerTotal > 0) {
          const q = 1000/explorerTotal;
          sharpness = LiChessTools.ChessMetrics.wdlToSharpness(explorerItem.white*q, lt.global.Math.max(explorerItem.draws,1)*q, explorerItem.black*q);
          sharpnessSource = trans.noarg('positionInfoSharpnessExplorer');
        }
      }
      if (allowPositionMetrics && sharpness == null && bestLine?.wdl?.length == 3) {
        sharpness = LiChessTools.ChessMetrics.wdlToSharpness(...bestLine.wdl);
        sharpnessSource = trans.noarg('positionInfoSharpnessEngine');
      }
      setRow(sharpnessRow,sharpness == null || Number.isNaN(sharpness) ? null : lt.global.Math.round(sharpness) + ' (' + sharpnessSource + ')');
      await setRowLazy(difficultyRow,()=> metricAsync('positionDifficulty',async ()=>{
        if (!search?.series || search.series.size<2) return null;
        const difficulty = LiChessTools.PositionDifficultyEvaluator.evaluate(search.series);
        if (!difficulty) return null;
        return difficulty.difficulty.toFixed(1) + ' (c ' + difficulty.complexity.toFixed(2) + ' d ' + difficulty.effectiveDepth.toFixed(1) + ')';
      }));
      const brilliancy = allowPositionMetrics
        ? await metricAsync('brilliancy',async ()=> await this.lastMoveBrilliancy(node,prevNode,prev2Node,engineDepth,search))
        : null;
      const categoryList = (key)=>{
        const byType = brilliancy?.res?.byType;
        if (!byType) return null;
        const list = Object.keys(byType)
          .map((name)=>({ label: brilliancy.labels?.[name] ?? name, score: byType[name]?.[key] ?? 0 }))
          .filter((category)=> category.score > 0)
          .sort((x,y)=> y.score - x.score);
        return list.length ? list : null;
      };
      const brilliantList = categoryList('fit');
      const interestingList = categoryList('ifit');
      const categoryText = (list,prefix)=> !list
        ? null
        : list
          .map((category,i)=> (i === 0 && prefix ? '!! ' : '') + category.label + ' ' + category.score.toFixed(1))
          .join('\n');
      setRow(brilliancyRow,categoryText(brilliantList,brilliancy?.res?.isBrilliant));
      setRow(interestingRow,categoryText(interestingList,brilliancy?.res?.isInteresting));
    };

    engineSearch = async (fen, depth, multipv) => {
      const lt = this.lichessTools;
      if (!depth || !fen || !lt.stockfish) return null;
      const sf = await lt.stockfish.load();
      if (!sf) return null;
      let done = false;
      const raw = [];
      const onInfo = (i)=>{
        if (!i) return;
        if (i.cp === undefined && i.mate === undefined) return;
        raw.push(i);
      };
      const onBestmove = ()=>{ done = true; };
      const onError = (e)=>{ done = true; };
      try {
        sf.on('info', onInfo);
        sf.on('bestmove', onBestmove);
        sf.on('error', onError);
        sf.setDepth(depth);
        if (multipv) sf.setMultiPv(multipv);
        sf.setPosition(fen);
        sf.start();
        let guard = 0;
        while (!done && guard++ < 150) await lt.timeout(200);
        await sf.stop();
      } finally {
        try { sf.off('info', onInfo); } catch (e) {}
        try { sf.off('bestmove', onBestmove); } catch (e) {}
        try { sf.off('error', onError); } catch (e) {}
      }
      const series = new Map();
      const linesByPv = new Map();
      for (const info of raw) {
        const searchDepth = +(info.depth?.[0] ?? 0);
        if (!searchDepth) continue;
        const pv = info.pv || [];
        const uci = pv[0];
        const cp = LiChessTools.ChessMetrics.getCentipawnOnlyValue(info);
        if (uci && cp !== undefined) {
          let values = series.get(searchDepth);
          if (!values) {
            values = new Map();
            series.set(searchDepth, values);
          }
          if (!values.has(uci)) values.set(uci, cp);
        }
        const multipvNr = +(info.multipv?.[0] ?? 1);
        linesByPv.set(multipvNr, {
          multipv: multipvNr,
          depth: searchDepth,
          cp: info.cp?.[0] !== undefined ? +info.cp[0] : null,
          mate: info.mate?.[0] !== undefined ? +info.mate[0] : null,
          wdl: Array.isArray(info.wdl) && info.wdl.length == 3 ? info.wdl.map(v=> +v) : null,
          pv: pv
        });
      }
      const lines = [...linesByPv.values()].sort((x,y)=> x.multipv - y.multipv);
      return { fen, side: fen.split(/\s+/)?.[1] == 'b' ? -1 : 1, series, lines };
    };

    normalizeCeval = (ev)=>{
      if (!ev) return null;
      if (typeof ev.mate === 'number') return { mate: ev.mate };
      if (ev.mate != null && Number.isFinite(+ev.mate)) return { mate: +ev.mate };
      if (typeof ev.cp === 'number') return { cp: ev.cp };
      if (ev.cp != null && Number.isFinite(+ev.cp)) return { cp: +ev.cp };
      return null;
    };

    engineEval = (search)=>{
      const line = search?.lines?.[0];
      if (!line) return null;
      if (line.mate != null) return { mate: line.mate * search.side };
      if (line.cp != null) return { cp: line.cp * search.side };
      return null;
    };

    lastMoveBrilliancy = async (node, prevNode, prev2Node, engineDepth, search)=>{
      const lt = this.lichessTools;
      const co = LiChessTools.chessopsModule;
      if (!co || !node || !prevNode || !prevNode.fen || !node.san) return null;
      let evalBefore = this.normalizeCeval(lt.getNodeCeval(prevNode));
      let evalAfter = this.normalizeCeval(lt.getNodeCeval(node));
      let multiPv = prevNode?.ceval?.pvs?.map(p=>({ moves: p.moves?.join(' '), cp: p.cp, mate: p.mate }));
      if (engineDepth > 0 && (!multiPv || !evalBefore)) {
        const parentSearch = await this.engineSearch(prevNode.fen, engineDepth, 4);
        if (parentSearch) {
          const side = parentSearch.side;
          if (!multiPv) {
            multiPv = parentSearch.lines?.map((line)=>({
              moves: line.pv?.join(' '),
              cp: line.cp != null ? line.cp*side : undefined,
              mate: line.mate != null ? line.mate*side : undefined
            }))
              .filter((line)=> line.cp != null || line.mate != null);
          }
          if (!evalBefore) evalBefore = this.engineEval(parentSearch);
        }
      }
      if (!evalAfter) evalAfter = this.engineEval(search);
      const ctx = {
        fen: prevNode.fen,
        san: node.san,
        evalBefore,
        evalAfter,
        multiPv,
        evalTwoBefore: prev2Node ? this.normalizeCeval(lt.getNodeCeval(prev2Node)) : null,
        book: !!node.opening
      };
      if (!ctx.fen || !ctx.san || !ctx.evalBefore || !ctx.evalAfter) return null;
      try {
        const analyser = new LiChessTools.BrilliantMoveAnalyzer(ctx,{ co });
        const res = analyser.computeUberBrilliance();
        const labels = {};
        for (const name of Object.keys(analyser.types)) labels[name] = analyser.types[name]?.label ?? name;
        return { ctx, res, labels };
      } catch (e) {
        lt.global.console.warn('positionInfo brilliancy',e);
        return null;
      }
    };

    computeTreeCoverage = async (node, maxDepth) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const explorer = analysis?.explorer;
      const explorerCache = explorer?.cache;
      if (!explorerCache) return null;
      const side = analysis.getOrientation() == 'black' ? 1 : 0;

      const recurse = async (n, depth) => {
        if (depth <= 0) return 1.0;

        if (!n.children?.length) return 1.0;

        let expl = explorerCache[n.fen];
        if (!expl) {
          if (n.path === undefined) lt.traverse();
          if (n.path != analysis.path) {
            analysis.setPath(n.path);
          }
          await explorer.setNode();
          while (explorer.loading()) {
            await lt.timeout(10);
          }
          expl = explorer.current();
        }

        if (!expl?.moves?.length) {
          return 1.0;
        }

        let total = 0;

        const byUci = new Map();
        for (const m of expl.moves) {
          if ((n.ply % 2 == side) && !n.children.find(c=>c.uci==m.uci)) continue;
          const games = (m.white || 0) + (m.draws || 0) + (m.black || 0);
          if (games > 0) {
            byUci.set(m.uci, games);
            total += games;
          }
        }

        let coverage = 0.0;
        for (const child of n.children) {
          const games = byUci.get(child.uci);
          if (!games) continue;
    
          const childCoverage = await recurse(child, depth - 1);
          const q = total ? games / total : 1;
          coverage += q * childCoverage;
        }

        return coverage;
      };

      const initialPath = analysis.path;
      try {
        return await recurse(node, maxDepth);
      } finally {
        if (initialPath != analysis.path) {
          analysis.setPath(initialPath);
        }
      }
    };

    extractVariationAsPGN = (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (analysis?.contextMenuPath === undefined) return;
      lt.exportPgn(analysis.contextMenuPath, { copyToClipboard: true, fromPosition: ev.shiftKey, toPosition: ev.altKey, separateLines: ev.ctrlKey });
    };

    addEvalComment = (node, ceval) => {
      if (!this.evaluateTerminationsStarted && !this.evaluateLineStarted) return;
      if (!ceval) return;
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!node.id || node.isCommentedOrMate) return;
      const decimals = lt.currentOptions.getValue('cevalDecimals') ? 2 : 1;
      const evalText = "eval: " + (ceval.mate ? '#' + ceval.mate : (ceval.cp > 0 ? '+' : '') + (ceval.cp / 100).toFixed(decimals));
      const cur = analysis.study.currentChapter();
      lt.assertPathSet(node);
      lt.saveComment(evalText, node.path);
    };

    setTerminationsEvaluation = (value) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (this.evaluateLineStarted) {
        if (analysis.cevalEnabled()) {
          analysis.cevalEnabled(false);
        }
        this.setLineEvaluation(false);
        return;
      }
      if (!!this.evaluateTerminationsStarted == !!value) return;
      this.evaluateTerminationsStarted = value;
      $.cached('body').toggleClass('lichessTools-evaluationStarted', !!value);
      if (!value) {
        this.evaluatedNodesTotal = 0;
        $('.lichessTools-liveStatus label').textSafe('');
        this._analysedNode = null;
      }
    };

    setLineEvaluation = (value, path) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (this.evaluateTerminationsStarted) {
        if (analysis.cevalEnabled()) {
          analysis.cevalEnabled(false);
        }
        this.setTerminationsEvaluation(false);
        return;
      }
      if (!!this.evaluateLineStarted == !!value) return;
      this.evaluateLinePath = value ? path : null;
      this.evaluateLineStarted = value;
      $.cached('body').toggleClass('lichessTools-evaluationStarted', !!value);
      if (!value) {
        this.evaluatedNodesTotal = 0;
        $('.lichessTools-liveStatus label').textSafe('');
        this._analysedNode = null;
      }
    };

    doEvaluation = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      if (!this.evaluateTerminationsStarted && !this.evaluateLineStarted) return;
      if (!lt.isTreeviewVisible()) return;
      if (!study && this.evaluateTerminationsStarted) return;
      if (!analysis.cevalEnabled() || analysis.threatMode()) {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
        return;
      }
      this.state = lt.traverse();
      let nodes = this.evaluateLineStarted
        ? analysis.tree.getNodeList(this.evaluateLinePath)
        : this.state.lastMoves;
      nodes = nodes.filter(n => n.id && !n.isCommentedOrMate && !n.nodeEvaluated);
      if (!this.evaluatedNodesTotal || this.evaluatedNodesTotal < nodes.length) {
        this.evaluatedNodesTotal = nodes.length;
      }
      const percent = (this.evaluatedNodesTotal - nodes.length) + '/' + this.evaluatedNodesTotal;
      const liveStatus = trans.pluralSame('evaluateTerminationsStarted', percent);
      if (((this.options.moveEval && study) || this.options.lineEval) && !$('div.lichessTools-liveStatus').length) {
        $('main.analyse div.analyse__controls.analyse-controls')
          .after('<div class="lichessTools-liveStatus analyse__controls"><label></label></div>');
      }
      $('.lichessTools-liveStatus label').textSafe(liveStatus);
      const node = nodes[0];
      if (!node) {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
        if (analysis.cevalEnabled()) {
          analysis.cevalEnabled(false);
        }
        return;
      }
      lt.assertPathSet(node);
      this._analysedNode = node;
      analysis.userJumpIfCan(node.path);
      lt.analysisRedraw();
    };

    evaluateTerminations = async (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const announce = lt.announce;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      const customEngineDepth = lt.currentOptions.getValue('customEngineLevel');
      if (ev) ev.preventDefault();
      if (!study || !lt.isTreeviewVisible()) return;
      if (this.evaluateTerminationsStarted) {
        this.setTerminationsEvaluation(false);
        return;
      }
      if (analysis.threatMode()) {
        analysis.threatMode(false);
      }
      if (!customEngineDepth) {
        const dependsOnCustomEngineDepth = trans.noarg('setCustomEngineDepth');
        announce(dependsOnCustomEngineDepth);
        return;
      }
      this.setTerminationsEvaluation(true);
      await this.ensureCevalRunning()
      this.doEvaluation();
    };

    evaluateLine = async (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const announce = lt.announce;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const customEngineDepth = lt.currentOptions.getValue('customEngineLevel');
      if (ev) ev.preventDefault();
      if (!lt.isTreeviewVisible()) return;
      if (this.evaluateLineStarted) {
        this.setLineEvaluation(false);
        return;
      }
      if (analysis.threatMode()) {
        analysis.threatMode(false);
      }
      if (!customEngineDepth) {
        const dependsOnCustomEngineDepth = trans.noarg('setCustomEngineDepth');
        announce(dependsOnCustomEngineDepth);
        return;
      }
      this.setLineEvaluation(true, analysis.contextMenuPath);
      await this.ensureCevalRunning()
      this.doEvaluation();
    };

    ensureCevalRunning = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const setTimeout = lt.global.setTimeout;

      const checkState = (resolve) => {
        if (!this.evaluateTerminationsStarted && !this.evaluateLineStarted) return;
        if (!analysis?.isCevalAllowed()) {
          return;
        }
        if (!analysis.cevalEnabled()) {
          analysis.cevalEnabled(true);
          setTimeout(() => checkState(resolve), 1000);
          return;
        }
        const state = analysis.ceval?.state;
        if (state <= 1) {
          this.doEvaluation();
          setTimeout(() => checkState(resolve), 1000);
          return;
        }
        resolve();
      };

      return new Promise((resolve, reject) => {
        checkState(resolve);
      });
    };

    showTranspos = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const highlighted = $('move.lichessTools-transpositionAll');
      if (highlighted.length) {
        highlighted.removeClass('lichessTools-transpositionAll');
        return;
      }
      this.state = lt.traverse();
      const transpositions = [];
      for (const position in this.state.positions) {
        let pos = this.state.positions[position];
        if (pos?.length > 1) {
          if (lt.transpositionBehavior?.excludeSameLine) {
            pos = pos.filter((n,i,arr)=>{
              for (let j=0; j<arr.length; j++) {
                if (i==j) continue;
                const paths = [n.path,arr[j].path];
                paths.sort((a,b)=>a.length-b.length);
                if (paths[1].startsWith(paths[0])) return false;
              }
              return true;
            });
          }
          if (pos?.length > 1) {
            transpositions.push.apply(transpositions, pos);
          }
        }
      }
      for (const node of transpositions) {
        if (!node.path) continue;
        const elem = lt.getElementForNode(node);
        $(elem).addClass('lichessTools-transpositionAll');
      }
    };

    bump = async (parentNode, index) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const startPosition = analysis.path;
      const path = analysis.contextMenuPath.slice(0,-2);

      let arr;
      if (index == 1) {
        arr = [ index ];
      } else {
        arr=[ index-1, index ];
        for (let i=index-2; i>=0; i--) arr.push(i);
      }
      arr = arr.map(i=>path+parentNode.children[i].id);
      
      const forceVariation = [];
      for (let i=0; i<=path.length; i+=2) {
        const subPath = path.slice(0, i);
        const node = analysis.tree.nodeAtPath(subPath);
        if (node.children[0].forceVariation) {
          forceVariation.push(subPath);
        }
      }
      if (forceVariation.at(-1) == path) {
        analysis.forceVariation(path+parentNode.children[0].id,false);
      }
      for (const childPath of arr) {
        analysis.promote(childPath,false);
      }
      for (const subPath of forceVariation) {
        const node = analysis.tree.nodeAtPath(subPath);
        if (!node.children[0].forceVariation) {
          analysis.forceVariation(subPath+node.children[0].id,true);
        }
      }
      analysis.userJump(startPosition);      
    };

    analysisContextMenu = (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const announce = lt.announce;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;

      const tview = $('.tview2')[0];
      if (!tview) return;
      if (!tview._analysisContextMenuActions) {
        $('.tview2').on('contextmenu', this.analysisContextMenu);
        tview._analysisContextMenuActions = true;
      }

      if (ev && this.options.copyPgn) {
        this.alterModifierText(ev);
      }

      const menu = $('#analyse-cm');
      if (!menu.length) return;

      if (this.options.copyPgn && !menu.has('a[data-role="copyPgn"]').length) {
        const text = trans.noarg('extractVariationText' + (this.suffix || ''));
        const title = trans.noarg('extractVariationTitle');
        $('<a>')
          .attr('data-icon', lt.icon.ShareAndroid)
          .addClass('lichessTools-icon-rotate')
          .attr('data-role', 'copyPgn')
          .text(text).attr('title', title)
          .on('click', this.extractVariationAsPGN)
          .appendTo(menu);
      }

      const isWritableStudy = study?.isWriting();
      if (this.options.moveEval
        && isWritableStudy
        && analysis.isCevalAllowed()
        && !menu.has('a[data-role="evaluateTerminations"]').length) {
        const text = trans.noarg('evaluateTerminationsText');
        const title = trans.noarg('evaluateTerminationsTitle');
        $('<a>')
          .attr('data-icon', lt.icon.BarChart)
          .attr('data-role', 'evaluateTerminations')
          .text(text).attr('title', title)
          .on('click', this.evaluateTerminations)
          .appendTo(menu);
      }

      if (this.options.lineEval
        && analysis.isCevalAllowed()
        && !menu.has('a[data-role="evaluateLine"]').length) {
        const text = trans.noarg('evaluateLineText');
        const title = trans.noarg('evaluateLineTitle');
        $('<a>')
          .attr('data-icon', lt.icon.LineGraph)
          .attr('data-role', 'evaluateLine')
          .text(text).attr('title', title)
          .on('click', this.evaluateLine)
          .appendTo(menu);
      }

      if (this.options.showTranspos
        && !menu.has('a[data-role="showTranspos"]').length) {
        const text = trans.noarg('showTransposText');
        const title = trans.noarg('showTransposTitle');
        $('<a>')
          .attr('data-icon', lt.icon.ShowTranspositions)
          .attr('data-role', 'showTranspos')
          .text(text).attr('title', title)
          .on('click', this.showTranspos)
          .appendTo(menu);
      }

      menu.toggleClassSafe('lichessTools-removeSuperfluous',this.options.removeSuperfluous);
      if (this.options.removeSuperfluous) {
		$('a[data-icon="'+lt.icon.BubbleSpeech+'"],a.glyph-icon', menu).remove(); //TODO remove when font icons are removed from Lichess
        $('a:has(.icon-bubbleSpeech),a:has(.glyph-icon)', menu).remove();
        if (this.options.copyPgn) {
		  $('a[data-icon="'+lt.icon.Clipboard+'"]', menu).remove(); //TODO remove when font icons are removed from Lichess
          $('a:has(.icon-clipboard)', menu).remove();
        }
      }

      if (this.options.reorderVariations && (!study || isWritableStudy)) {
        const node = analysis?.contextMenuPath && analysis.tree.nodeAtPath(analysis.contextMenuPath);
        const parentNode = analysis?.contextMenuPath && analysis.tree.nodeAtPath(analysis.contextMenuPath.slice(0,-2));
        const index = parentNode?.children?.indexOf(node);
        const total = parentNode?.children?.length;

        if (total>1 && index>0
          && !menu.has('a[data-role="bumpUp"]').length) {
            const text = trans.noarg('bumpUpVariationText');
            const title = trans.noarg('bumpUpVariationTitle');
            $('<a>')
              .attr('data-icon', lt.icon.UpwardsWhiteArrow)
              .attr('data-role', 'bumpUp')
              .text(text).attr('title', title)
              .on('click', ()=>this.bump(parentNode,index))
              .appendTo(menu);
        }
        if (total>1 && index<total-1
          && !menu.has('a[data-role="bumpDown"]').length) {
            const text = trans.noarg('bumpDownVariationText');
            const title = trans.noarg('bumpDownVariationTitle');
            $('<a>')
              .attr('data-icon', lt.icon.DownwardsWhiteArrow)
              .attr('data-role', 'bumpDown')
              .text(text).attr('title', title)
              .on('click', ()=>this.bump(parentNode,index+1))
              .appendTo(menu);
        }
      }

      if (this.options.positionInfo && !menu.has('a[data-role="positionInfo"]').length) {
        const text = trans.noarg('positionInfoText');
        const title = trans.noarg('positionInfoTitle');
        $('<a>')
          .attr('data-icon', lt.icon.StudyBoard)
          .attr('data-role', 'positionInfo')
          .text(text).attr('title', title)
          .on('click', this.showPositionInfo)
          .appendTo(menu);
      }
    }

    ensureShowOnEmpty = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;

      if (this.options.showOnEmpty) {
        $('div.tview2')
          .toggleClassSafe('lichessTools-showOnEmpty',true)
          .attrSafe('p', '*'); //lichess checks this against empty so we must add something ...
        if (!lt.isWrappedFunction(analysis.jump, 'showOnEmpty')) {
          analysis.jump = lt.wrapFunction(analysis.jump, {
            id: 'showOnEmpty',
            before: ($this, path) => {
              if (path == '*') return false; // ... and then hack so it doesn't do anything
            }
          })
        }
      } else {
        $('div.tview2')
          .toggleClassSafe('lichessTools-showOnEmpty', false)
          .removeAttrSafe('p');
      }
    };

    checkEngineLevel = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const announce = lt.announce;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      if (!analysis) return;
      if (analysis.practice || analysis.study?.practice) return;
      const customEngineDepth = lt.currentOptions.getValue('customEngineLevel');
      const ceval = analysis.ceval;
      if (!ceval) return;
      if (!analysis.cevalEnabled() || analysis.threatMode()) {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
        return;
      }
      if (this._analysedNode && analysis.node != this._analysedNode) {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
        return;
      }
      const state = ceval.state;
      const isIdle = state == 0 || state == 2 || ceval.showingCloud;
      const isRunning = state == 3 && !ceval.showingCloud;
      if (this.evaluateTerminationsStarted || this.evaluateLineStarted) {
        const node = this._analysedNode;
        if (node?.ceval?.depth > customEngineDepth || (node?.ceval?.depth == customEngineDepth && isIdle)) {
          if (this.evaluateTerminationsStarted) {
            this.addEvalComment(node, node.ceval);
          }
          node.nodeEvaluated = Date.now();

          this.doEvaluation();
        }
      }
    };

    alterModifierText = (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      this.suffix = (ev.shiftKey ? 'f' : '') + (ev.ctrlKey ? 's' : '') + (ev.altKey ? 't' : '');
      if (this.suffix) this.suffix = '_' + this.suffix;

      if (this.options.copyPgn) {
        const menuItem = $('#analyse-cm a[data-role="copyPgn"]');
        if (menuItem.length) {
          if (ev.altKey) ev.preventDefault();
          const text = trans.noarg('extractVariationText' + this.suffix);
          menuItem.textSafe(text);
        }
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('analysisContextActions');
      this.logOption('Analysis context actions', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      this.options = {
        copyPgn: lt.isOptionSet(value, 'copyPgn'),
        moveEval: lt.isOptionSet(value, 'moveEval'),
        lineEval: lt.isOptionSet(value, 'lineEval'),
        showTranspos: lt.isOptionSet(value, 'showTranspos'),
        removeSuperfluous: lt.isOptionSet(value, 'removeSuperfluous'),
        showOnEmpty: lt.isOptionSet(value, 'showOnEmpty'),
        reorderVariations: lt.isOptionSet(value, 'reorderVariations'),
        positionInfo: lt.isOptionSet(value, 'positionInfo'),
        positionInfoCoverageDepth: +lt.currentOptions.getValue('analysisContextActionsCoverage') || 0,
        engineDepth: +lt.currentOptions.getValue('analysisContextActionsEngineDepth') || 0,
        get isSet() { return this.copyPgn || this.moveEval || this.lineEval || this.showTranspos || this.removeSuperfluous || this.showOnEmpty || this.reorderVariations; }
      };
      clearInterval(this.engineCheckInterval);
      lt.pubsub.off('lichessTools.redraw', this.analysisContextMenu);
      $('.tview2').off('contextmenu', this.analysisContextMenu);
      $.cached('body').off('keydown keyup', this.alterModifierText);
      if (this.options.copyPgn) {
        $.cached('body').on('keydown keyup', this.alterModifierText);
        $('.tview2').on('contextmenu', this.analysisContextMenu);
      }
      if (this.options.isSet) {
        lt.pubsub.on('lichessTools.redraw', this.analysisContextMenu);
        this.engineCheckInterval = setInterval(this.checkEngineLevel, 1000);
      } else {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
      }
      if (analysis.ceval) {
        analysis.ceval.available = lt.unwrapFunction(analysis.ceval.available,'analysisContextActions');
      }
      if ((this.options.moveEval && analysis.study) || this.options.lineEval) {
        if (!$('div.lichessTools-liveStatus').length) {
          $('main.analyse div.analyse__controls.analyse-controls')
            .after('<div class="lichessTools-liveStatus analyse__controls"><label></label></div>');
        }
        if (analysis.ceval) {
          analysis.ceval.available = lt.wrapFunction(analysis.ceval.available,{
            id: 'analysisContextActions',
            after: ($this,result,...args)=>{
              if (!this.evaluateTerminationsStarted && !this.evaluateLineStarted) return;
              return $this.analysable; 
            }
          });
        }
      }
      lt.pubsub.off('lichessTools.redraw', this.ensureShowOnEmpty);
      lt.pubsub.on('lichessTools.redraw', this.ensureShowOnEmpty);
      this.ensureShowOnEmpty();
    }

  }
  LiChessTools.Tools.AnalysisContextActions = AnalysisContextActionsTool;
})();

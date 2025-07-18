(() => {
  class AnalysisContextActionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'CustomEngineLevel', 'ExportPGN', 'DetectThirdParties', 'Dialog'];

    preferences = [
      {
        name: 'analysisContextActions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['copyPgn', 'moveEval', 'showTranspos', 'removeSuperfluous', 'showOnEmpty', 'reorderVariations', 'positionInfo', 'lineEval'],
        defaultValue: 'copyPgn,moveEval,removeSuperfluous,showOnEmpty,reorderVariations'
      }
    ];

    upgrades = [
      { name:'analysisContextActions', value:'reorderVariations', version: '2.4.5', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.analysisContextActions': 'Extra context menu options',
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
        'positionInfoOutputText': `Ply: $ply
Moves so far: $movesSoFar
Following main moves: $movesMain
Following total moves: $movesTotal
Following branches: $branches`
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.analysisContextActions': 'Op\u0163iuni \u00een plus \u00een meniul context',
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
        'positionInfoOutputText': `Ply: $ply
Mut\u0103ri p\u00e2na acum: $movesSoFar
Mut\u0103ri principale urm\u0103toare: $movesMain
Total mut\u0103ri urm\u0103toare: $movesTotal
Varia\u0163ii urm\u0103toare: $branches`
      }
    }

    showPositionInfo = async (ev) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
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
        if (!n.children?.length) return;
        for (let i = 0; i<n.children.length; i++) {
          if (i===0) movesMain++;
          movesTotal++;
          branches+=n.children.length-1;
          f(n.children[i]);
        }
      };
      f(node);
      if (movesTotal) branches++;
      const ply = node.ply;
      const text = trans.noarg('positionInfoOutputText')
        .replace('$ply',`${ply}`)
        .replace('$movesSoFar',`${movesSoFar}`)
        .replace('$movesMain',`${movesMain}`)
        .replace('$movesTotal',`${movesTotal}`)
        .replace('$branches',`${branches}`);
      const moveNumber = Math.floor((ply + 1) / 2);
      let header = moveNumber + (ply % 2 == 1 ? '. ' : '...');
      header += node.san;
      if (node.glyphs?.length) {
        header += node.glyphs.map(g=>g.symbol).join('');
      }
      const dialog = await lt.dialog({
        header: header,
        noDrag: true
      });
      for (const line of text.split(/[\r\n]+/)) {
        const [k,v] = line.split(/\s*:\s*/);
        $('<div>')
          .append($('<span>').text(k))
          .append($('<span>').text(v))
          .appendTo($('.dialog-content',dialog));
      }
      $(dialog).addClass('lichessTools-positionInfo');
      dialog.showModal();
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
      if (node.path === undefined) return;
      lt.saveComment(evalText, node.path);
    };

    setTerminationsEvaluation = (value) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (this.evaluateLineStarted) {
        if (analysis.ceval.enabled()) {
          analysis.toggleCeval();
        }
        this.setLineEvaluation(false);
        return;
      }
      if (!!this.evaluateTerminationsStarted == !!value) return;
      this.evaluateTerminationsStarted = value;
      $.cached('body').toggleClass('lichessTools-evaluationStarted', !!value);
      if (!value) {
        this.evaluatedNodesTotal = 0;
        $('.lichessTools-liveStatus label').text('');
        this._analysedNode = null;
      }
    };

    setLineEvaluation = (value, path) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (this.evaluateTerminationsStarted) {
        if (analysis.ceval.enabled()) {
          analysis.toggleCeval();
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
        $('.lichessTools-liveStatus label').text('');
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
      if (!analysis.ceval.enabled() || analysis.threatMode()) {
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
      $('.lichessTools-liveStatus label').text(liveStatus);
      const node = nodes[0];
      if (!node) {
        this.setTerminationsEvaluation(false);
        this.setLineEvaluation(false);
        if (analysis.ceval.enabled()) {
          analysis.toggleCeval();
        }
        return;
      }
      if (node.path === undefined) return;
      this._analysedNode = node;
      analysis.userJumpIfCan(node.path);
      analysis.redraw();
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
        if (!analysis?.ceval?.allowed()) {
          return;
        }
        if (!analysis.ceval.enabled()) {
          analysis.toggleCeval();
          setTimeout(() => checkState(resolve), 1000);
          return;
        }
        const state = analysis.ceval.state;
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
        if (node.path === undefined) continue;
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

      if (this.options.moveEval
        && study?.vm.mode.write
        && $('.analyse__tools > .ceval').length
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
        && $('.analyse__tools > .ceval').length
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
        $('a[data-icon="'+lt.icon.BubbleSpeech+'"],a.glyph-icon', menu).remove();
        if (this.options.copyPgn) {
          $('a[data-icon="'+lt.icon.Clipboard+'"]', menu).remove();
        }
        if (this.options.autoExpand) {
          $('a[data-icon="'+lt.icon.PlusButton+'"],a[data-icon="'+lt.icon.MinusButton+'"]', menu).remove();
        }
      }

      if (this.options.reorderVariations && (!study || study?.vm.mode.write)) {
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
        const text = trans.noarg('positionInfoText' + (this.suffix || ''));
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
      if (!ceval.enabled() || analysis.threatMode()) {
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
          menuItem.text(text);
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
        get isSet() { return this.copyPgn || this.moveEval || this.lineEval || this.showTranspos || this.removeSuperfluous || this.showOnEmpty || this.reorderVariations; },
        autoExpand: lt.isOptionSet(lt.currentOptions.getValue('expandAll'), 'autoExpand')
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
      if (((this.options.moveEval && analysis.study) || this.options.lineEval) && !$('div.lichessTools-liveStatus').length) {
        $('main.analyse div.analyse__controls.analyse-controls')
          .after('<div class="lichessTools-liveStatus analyse__controls"><label></label></div>');
      }
      lt.pubsub.off('lichessTools.redraw', this.ensureShowOnEmpty);
      lt.pubsub.on('lichessTools.redraw', this.ensureShowOnEmpty);
      this.ensureShowOnEmpty();
    }

  }
  LiChessTools.Tools.AnalysisContextActions = AnalysisContextActionsTool;
})();

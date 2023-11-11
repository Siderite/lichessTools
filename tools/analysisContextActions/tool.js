(()=>{
  class AnalysisContextActionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','CustomEngineLevel','ExportPGN','DetectThirdParties'];

    preferences=[
      {
        name:'analysisContextActions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['copyPgn','moveEval','showTranspos','removeSuperfluous'],
        defaultValue: 'copyPgn,moveEval,removeSuperfluous'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.analysisContextActions': 'Extra context menu options',
        'analysisContextActions.copyPgn': 'Copy branch as PGN',
        'analysisContextActions.moveEval': 'Engine evaluation for last moves',
        'analysisContextActions.showTranspos': 'Highlight all transpositions',
        'analysisContextActions.removeSuperfluous': 'Remove superfluous entries',
        'extractVariationText': 'Copy branch as PGN',
        'extractVariationTitle': 'LiChess Tools - copy branch and continuations to clipboard\r\nShift-click to copy from position',
        'errorGeneratingPGN': 'Error generating PGN',
        'errorCopyingPGN': 'Error copying PGN to clipboard',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'setCustomEngineDepth': 'You need to set a minimum engine depth for this feature!',
        'evaluateTerminationsText': 'Evaluate terminating moves',
        'evaluateTerminationsTitle': 'LiChess Tools - add evaluation comment to all branch terminating moves',
        'evaluateTerminationsStarted': 'Evaluation commenting started: %s',
        'showTransposText': 'Highlight all transpositions',
        'showTransposTitle': 'LiChess Tools - highlight all transpositions',
        'clipboardDenied':'Clipboard access denied'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.analysisContextActions': 'Op\u0163iuni \u00een plus \u00een meniul context',
        'analysisContextActions.copyPgn': 'Copiaz\u0103 varia\u0163iunea ca PGN',
        'analysisContextActions.moveEval': 'Evaluare mut\u0103ri finale',
        'analysisContextActions.showTranspos': 'Arat\u0103 toate transpozi\u0163iile',
        'analysisContextActions.removeSuperfluous': 'Elimin\u0103 ce e \u00een plus',
        'extractVariationText': 'Copiaz\u0103 varia\u0163iunea ca PGN',
        'extractVariationTitle': 'LiChess Tools - copiaz\u0103 varia\u0163iunea \u015Fi continu\u0163rile ca PGN\r\nShift-click ca s\u0103 copiezi de la pozi\u0163ie',
        'errorGeneratingPGN': 'Eroare generare PGN',
        'errorCopyingPGN': 'Eroare copiere PGN \u00een clipboard',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'setCustomEngineDepth': 'Trebuie s\u0103 setezi un nivel minim pentru motorul de analiz\u0103!',
        'evaluateTerminationsText': 'Evalueaz\u0103 mut\u0103rile finale',
        'evaluateTerminationsTitle': 'LiChess Tools - adaug\u0103 comentarii cu evaluarea mut\u0103rilor finale din fiecare ramur\u0103',
        'evaluateTerminationsStarted': 'Comentarea cu evalu\u0103ri pornit\u0103: %s',
        'showTransposText': 'Arat\u0103 toate transpozi\u0163iile',
        'showTransposTitle': 'LiChess Tools - arat\u0103 toate transpozi\u0163iile',
        'clipboardDenied':'Acces refuzat la clipboard'
      }
    }
   
    extractVariationAsPGN=(ev)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (analysis?.contextMenuPath===undefined) return;
      parent.exportPgn(analysis.contextMenuPath,{ copyToClipboard:true, fromPosition: ev.shiftKey, separateLines: ev.ctrlKey });
    };
    
    addEvalComment=(node,ceval)=>{
      if (!this.evaluateTerminationsStarted) return;
      if (!ceval) return;
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!node.id||node.isCommentedOrMate) return;
      const evalText="eval: "+(ceval.mate ?'#'+ceval.mate :Math.round(ceval.cp/10)/10);
      const cur=analysis.study.currentChapter();
      node.terminationEvaluated=new Date();
      if (node.path===undefined) return;
      parent.saveComment(evalText, node.path);
      this.doEvaluation();
    };

    setTerminationsEvaluation=(value)=>{
      if (this.evaluateTerminationsStarted==value) return;
      const parent=this.lichessTools;
      const $=parent.$;
      this.evaluateTerminationsStarted=value;
      $('body').toggleClass('lichessTools-evaluationStarted',!!value);
      if (!value) {
        this.evaluateTerminationsTotal=0;
        $('.lichessTools-liveStatus label').text('');
      }
    };
    
    doEvaluation=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;
      if (!this.evaluateTerminationsStarted) return;
      if (!study||!parent.isTreeviewVisible()) return;
      if (!analysis.ceval.enabled()||analysis.threatMode()) {
        this.setTerminationsEvaluation(false);
        return;
      }
      this.state=parent.traverse();
      const nodes=this.state.lastMoves.filter(n=>n.id&&!n.isCommentedOrMate&&(!n.terminationEvaluated||new Date()-n.terminationEvaluated>10000));
      if (!this.evaluateTerminationsTotal) this.evaluateTerminationsTotal=nodes.length;
      const percent=(this.evaluateTerminationsTotal-nodes.length)+'/'+this.evaluateTerminationsTotal;
      const liveStatus=trans.pluralSame('evaluateTerminationsStarted',percent);
      $('.lichessTools-liveStatus label').text(liveStatus);
      const node=nodes[0];
      if (!node) {
        this.setTerminationsEvaluation(false);
        if (analysis.ceval.enabled()) {
          analysis.toggleCeval();
        }
        return;
      }
      if (node.path===undefined) return;
      analysis.userJumpIfCan(node.path);
      analysis.redraw();
    };
    
    evaluateTerminations=async (ev)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;
      const customEngineDepth=parent.currentOptions.getValue('customEngineLevel');
      if (ev) ev.preventDefault();
      if (!study||!parent.isTreeviewVisible()) return;
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
    
    ensureCevalRunning=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const setTimeout=parent.global.setTimeout;

      function checkState(resolve) {
        if (!analysis?.ceval?.allowed()) {
          return;
        }
        if (!analysis.ceval.enabled()) {
          analysis.toggleCeval();
          setTimeout(()=>checkState(resolve),1000);
          return;
        }
        const state=analysis.ceval.getState();
        if (state<=1) {
          setTimeout(()=>checkState(resolve),1000);
          return;
        }
        resolve();
      }
    
      return new Promise((resolve,reject)=>{
        checkState(resolve);
      }); 
    };

    
    showTranspos=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const highlighted=$('move.lichessTools-transpositionAll');
      if (highlighted.length) {
        highlighted.removeClass('lichessTools-transpositionAll');
        return;
      }
      this.state=parent.traverse();
      const transpositions=[];
      for (const position in this.state.positions) {
        const pos=this.state.positions[position];
        if (pos?.length>1) {
          transpositions.push.apply(transpositions,pos);
        }
      }
      for (const node of transpositions) {
        if (node.path===undefined) continue;
        if (!node.path) continue;
        const elem=parent.getElementForNode(node);
        $(elem).addClass('lichessTools-transpositionAll');
      }
    };
    
    analysisContextMenu=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;

      const menu=$('#analyse-cm');
      if (!menu.length) return;
      
      if (this.options.copyPgn && !menu.has('a[data-role="copyPgn"]').length) {
        const text=trans.noarg('extractVariationText');
        const title=trans.noarg('extractVariationTitle');
        $('<a>')
          .attr('data-icon','\uE018')
          .addClass('lichessTools-icon-rotate')
          .attr('data-role','copyPgn')
          .text(text).attr('title',title)
          .on('click',this.extractVariationAsPGN)
          .appendTo(menu);
      }
    
      if (this.options.moveEval 
         && study?.vm.mode.write
         &&!menu.has('a[data-role="evaluateTerminations"]').length) {
        const text=trans.noarg('evaluateTerminationsText');
        const title=trans.noarg('evaluateTerminationsTitle');
        $('<a>')
          .attr('data-icon','\uE004')
          .attr('data-role','evaluateTerminations')
          .text(text).attr('title',title)
          .on('click',this.evaluateTerminations)
          .appendTo(menu);
      }
    
      if (this.options.showTranspos 
         &&!menu.has('a[data-role="showTranspos"]').length) {
        const text=trans.noarg('showTransposText');
        const title=trans.noarg('showTransposTitle');
        $('<a>')
          .attr('data-icon','T')
          .attr('data-role','showTranspos')
          .text(text).attr('title',title)
          .on('click',this.showTranspos)
          .appendTo(menu);
      }

      if (this.options.removeSuperfluous) {
        $('a[data-icon="\uE056"],a.glyph-icon',menu).remove();
      }
    }

    checkEngineLevel=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;
      if (!analysis) return;
      if (analysis.practice) return;
      const customEngineDepth=parent.currentOptions.getValue('customEngineLevel');
      const ceval = analysis.ceval;
      if (!ceval.enabled()||analysis.threatMode()) {
        this.setTerminationsEvaluation(false);
        return;
      }
      const state=ceval.getState();
      const isIdle = state==2 || ceval.showingCloud();
      const isRunning = state==3 && !ceval.showingCloud();
      const node = lichess.analysis.node;
      if (this.evaluateTerminationsStarted && node.ceval) {
        if (node.ceval.depth>customEngineDepth || (node.ceval.depth==customEngineDepth && isIdle)) {
          this.addEvalComment(node,node.ceval);
        }
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('analysisContextActions');
      this.logOption('Analysis context actions', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      this.options={
        copyPgn:parent.isOptionSet(value,'copyPgn'),
        moveEval:parent.isOptionSet(value,'moveEval'),
        showTranspos:parent.isOptionSet(value,'showTranspos'),
        removeSuperfluous:parent.isOptionSet(value,'removeSuperfluous'),
        get isSet() { return this.copyPgn || this.moveEval || this.showTranspos || this.removeSuperfluous; }
      };
      clearInterval(this.engineCheckInterval);
      lichess.pubsub.off('redraw',this.analysisContextMenu);
      if (this.options.isSet) {
        lichess.pubsub.on('redraw',this.analysisContextMenu);
        this.engineCheckInterval=setInterval(this.checkEngineLevel,1000);
      } else {
        this.setTerminationsEvaluation(false);
      }
      if (analysis.study&&!$('div.lichessTools-liveStatus').length) {
        $('main.analyse div.analyse__controls.analyse-controls').after('<div class="lichessTools-liveStatus analyse__controls"><label></label></div>');
      }
    }

  }
  LiChessTools.Tools.AnalysisContextActions=AnalysisContextActionsTool;
})();

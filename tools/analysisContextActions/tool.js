(()=>{
  class AnalysisContextActionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','CustomEngineLevel'];

    preferences=[
      {
        name:'analysisContextActions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['copyPgn','moveEval','showTranspos'],//,'mergePgn'],
        defaultValue: 'copyPgn,moveEval,mergePgn'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.analysisContextActions': 'Extra context menu options',
        'analysisContextActions.copyPgn': 'Copy branch as PGN',
        'analysisContextActions.moveEval': 'Engine evaluation for last moves',
        'analysisContextActions.showTranspos': 'Highlight all transpositions',
        'extractVariationText': 'Copy branch as PGN',
        'extractVariationTitle': 'LiChess Tools - copy branch and continuations to clipboard',
        'errorGeneratingPGN': 'Error generating PGN',
        'errorCopyingPGN': 'Error copying PGN to clipboard',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'setCustomEngineDepth': 'You need to set a minimum engine depth for this feature!',
        'evaluateTerminationsText': 'Evaluate terminating moves',
        'evaluateTerminationsTitle': 'LiChess Tools - add evaluation comment to all branch terminating moves',
        'evaluateTerminationsStarted': 'Evaluation commenting started: %s',
        'showTransposText': 'Highlight all transpositions',
        'showTransposTitle': 'LiChess Tools - highlight all transpositions',
        'noMergePoint':'No merge point found',
        'duplicateVariations':'Merging would duplicate variations',
        'readClipboardDenied':'Access to clipboard denied',
        'mergePgnText':'Merge PGN here',
        'mergePgnTitle':'LiChess Tools - merge PGN here'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.analysisContextActions': 'Op\u0163iuni \u00een plus \u00een meniul context',
        'analysisContextActions.copyPgn': 'Copiaz\u0103 varia\u0163iunea ca PGN',
        'analysisContextActions.moveEval': 'Evaluare mut\u0103ri finale',
        'analysisContextActions.showTranspos': 'Arat\u0103 toate transpozi\u0163iile',
        'extractVariationText': 'Copiaz\u0103 varia\u0163iunea ca PGN',
        'extractVariationTitle': 'LiChess Tools - copiaz\u0103 varia\u0163iunea \u015Fi continu\u0163rile ca PGN',
        'errorGeneratingPGN': 'Eroare generare PGN',
        'errorCopyingPGN': 'Eroare copiere PGN \u00een clipboard',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'setCustomEngineDepth': 'Trebuie s\u0103 setezi un nivel minim pentru motorul de analiz\u0103!',
        'evaluateTerminationsText': 'Evalueaz\u0103 mut\u0103rile finale',
        'evaluateTerminationsTitle': 'LiChess Tools - adaug\u0103 comentarii cu evaluarea mut\u0103rilor finale din fiecare ramur\u0103',
        'evaluateTerminationsStarted': 'Comentarea cu evalu\u0103ri pornit\u0103: %s',
        'showTransposText': 'Arat\u0103 toate transpozi\u0163iile',
        'showTransposTitle': 'LiChess Tools - arat\u0103 toate transpozi\u0163iile',
        'noMergePoint':'Nu am g\u0103sit punct de alipire',
        'duplicateVariations':'Alipirea ar duplica varia\u0163iuni',
        'readClipboardDenied':'Acces refuzat la clipboard',
        'mergePgnText':'Alipe\u015Fte PGN-ul aici',
        'mergePgnTitle':'LiChess Tools - alipe\u015Fte PGN-ul aici'
      }
    }


    exportPgn=(path)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const announce=parent.announce;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const Math=parent.global.Math;
      const navigator=parent.global.navigator;
      const trans=parent.translator;

      function fixCrazySan(san) {
        if (!san || san[0] !== 'P') return san;
        return san.slice(1);
      }
    
      function plyPrefix(node) {
        return `${Math.floor((node.ply + 1) / 2)}${node.ply % 2 === 1 ? '. ' : '... '}`;
      }
    
      function renderComments(node) {
        let s='';
        for (const glyph of node.glyphs||[]) {
          s+=glyph.symbol;
        }
        for (const comment of node.comments||[]) {
          s+='{'+comment.text+'}';
        }
        const groups=[];
        for(const shape of node.shapes||[]) {
          const type=shape.dest?'cal':'csl';
          let group=groups[groups.length-1];
          if (group?.type!=type) {
            group={
              type:type,
              shapes:[]
            };
            groups.push(group);
          }
          const code=shape.brush[0].toUpperCase()+shape.orig+(shape.dest||'');
          group.shapes.push(code);
        }
        if (groups.length) {
          s+='{';
          for (const group of groups) {
            s+='[%'+group.type+' '+group.shapes.join(',')+']';
          }
          s+='}';
        }
        return s;
      }
    
      function renderNodesTxt(node, forcePly) {
        if (node.children.length === 0) return '';
    
        let s = '';
    
        if (node.id=='') s+=renderComments(node);
        if (s) s+='\r\n'
    
        const first = node.children[0];
        if (forcePly || first.ply % 2 === 1) s += plyPrefix(first);
        s += fixCrazySan(first.san);
    
        s+=renderComments(first);
    
        for (let i = 1; i < node.children.length; i++) {
          const child = node.children[i];
          s += ` (${plyPrefix(child)}${fixCrazySan(child.san)}`;
          s += renderComments(child);
          const variation = renderNodesTxt(child, false);
          if (variation) s += ' ' + variation;
          s += ')';
        }
    
        const mainline = renderNodesTxt(first, node.children.length > 1);
        if (mainline) s += ' ' + mainline;
    
        return s;
      }
    
      function clone(n2, withoutChildren) {
        const n1={
          children: [],
          eval: n2.eval,
          comments: n2.comments?JSON.parse(JSON.stringify(n2.comments)):[],
          glyphs: n2.glyphs?JSON.parse(JSON.stringify(n2.glyphs)):[],
          shapes: n2.shapes?JSON.parse(JSON.stringify(n2.shapes)):[],
          ceval: n2.ceval?JSON.parse(JSON.stringify(n2.ceval)):null,
          opening: n2.opening?JSON.parse(JSON.stringify(n2.opening)):null,
          id: n2.id,
          ply: n2.ply,
          san:n2.san,
          uci:n2.uci,
          fen:n2.fen
        };
        if (!withoutChildren) {
          n2.children.forEach(function (c) {
            n1.children.push(clone(c));
          });
        }
        return n1;
      }
    
      try{
        const nodes=lichess.analysis.tree.getNodeList(path);
        const varNode=clone(nodes[0],true);
        let prevNode=varNode;
        for (let i=1; i<nodes.length-1; i++) {
          const node=clone(nodes[i],true);
          prevNode.children=[node];
          prevNode=node;
        }
        if (nodes.length>1) {
          const node=clone(nodes[nodes.length-1]);
          prevNode.children=[node]
        }
        let pgn=renderNodesTxt(varNode,false);
        if (analysis.getOrientation()!='white' && !/\[Orientation|\[StartFlipped/.test(pgn)) {
          pgn='[StartFlipped "1"]\r\n[Orientation "Black"]\r\n'+pgn;
        }
        if (varNode.fen && varNode.fen!='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
          pgn='[FEN "'+varNode.fen+'"]\r\n'+pgn;
        }
        parent.global.navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
          if (['granted','prompt'].includes(result.state)) {
            parent.global.navigator.clipboard.writeText(pgn).then(()=>{
              const announcement = trans.noarg('PGNCopiedToClipboard');
              announce(announcement);
            }).catch(e=>{
              const announcement = trans.noarg('errorCopyingPGN');
              announce(announcement);
            });
          } else {
            const announcement = trans.noarg('errorCopyingPGN');
            announce(announcement);
          }
        });
      } catch (e) {
        console.warn('Error generating PGN:',e);
        const announcement = trans.noarg('errorGeneratingPGN');
        announce(announcement);
      }
    }
    
    extractVariationAsPGN=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      this.exportPgn(analysis.contextMenuPath);
    };
    
    addEvalComment=(node,ceval)=>{
      if (!this.evaluateTerminationsStarted) return;
      if (!ceval) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!node.id||node.isCommentedOrMate) return;
      const evalText="eval: "+(ceval.mate ?'#'+ceval.mate :Math.round(ceval.cp/10)/10);
      const cur=analysis.study.currentChapter();
      node.terminationEvaluated=new Date();
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
      analysis.userJumpIfCan(node.path);
      analysis.redraw();
    };
    
    evaluateTerminations=(ev)=>{
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
      this.ensureCevalRunning().then(this.doEvaluation);
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
        if (!node.path) continue;
        const elem=parent.getElementForNode(node);
        $(elem).addClass('lichessTools-transpositionAll');
      }
    };

    isPgn=(text)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      return !!lichess.analysis.changePgn(text,false);
    };

    couldHaveClipboardPgn=()=>{
      const parent=this.lichessTools;
      return new Promise((resolve,reject)=>{
        parent.global.navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
          if (['granted'].includes(result.state)) {
            parent.global.navigator.clipboard.readText()
              .then(text=>{
                resolve(this.isPgn(text));
              })
              .catch(e=>resolve(null));
          } else {
            resolve(null);
          }
        });
      });
    };

    updatePly=(nodes,ply)=>{
      for (const node of nodes||[]) {
        node.ply=ply;
        this.updatePly(node.children,ply+1);
      }
    };

    mergePgnFromClipboard=()=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess.analysis;
      const announce=parent.announce;
      const menuNode=analysis.tree.nodeAtPath(analysis.contextMenuPath);
      return new Promise((resolve,reject)=>{
        parent.global.navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
          if (['granted','prompt'].includes(result.state)) {
            parent.global.navigator.clipboard.readText()
              .then(text=>{
                const pgn=analysis.changePgn(text,false);
                if (!pgn?.treeParts?.length) return;
                const nodePos=parent.getNodePosition(menuNode);
                let index=-1;
                for (let i=0; i<pgn.treeParts.length; i++) {
                  if (pgn.sidelines[i].length) {
                    const announcement = trans.noarg('noMergePoint');
                    announce(announcement);
                    return;
                  }
                  if (parent.getFenPosition(pgn.treeParts[i].fen)===nodePos) {
                    index=i;
                    break;
                  }
                }
                if (index<0) {
                  const announcement = trans.noarg('noMergePoint');
                  announce(announcement);
                  return;
                }
                if (pgn.treeParts[index+1]) {
                  const duplicates=[pgn.treeParts[index+1]].concat(pgn.sidelines[index+1]).filter(p=>!!menuNode.children.find(c=>c.uci===p.uci));
                  if (duplicates.length) {
                    const announcement = trans.noarg('duplicateVariations');
                    announce(announcement);
                    return;
                  }
                }
                const part=pgn.treeParts[index];
                index++;
                while (index<pgn.treeParts.length) {
                  pgn.treeParts[index-1].children=[pgn.treeParts[index]].concat(pgn.sidelines[index]);
                  index++;
                }
                this.updatePly(part.children,menuNode.ply+1);
                menuNode.children.push.apply(menuNode.children,part.children);
                analysis.redraw();
              })
              .catch(e=>resolve(null));
          } else {
            const announcement = trans.noarg('readClipboardDenied');
            announce(announcement);
          }
        });
      });
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

      if (this.options.mergePgn
         &&!menu.has('a[data-role="mergePgn"]').length) {
        this.couldHaveClipboardPgn().then(r=>{
          if (r===false) return;
          const text=trans.noarg('mergePgnText');
          const title=trans.noarg('mergePgnTitle');
          $('<a>')
            .attr('data-icon','\uE070')
            .attr('data-role','mergePgn')
            .text(text).attr('title',title)
            .on('click',this.mergePgnFromClipboard)
            .appendTo(menu);
        });
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
        mergePgn:parent.isOptionSet(value,'mergePgn'),
        get isSet() { return this.copyPgn || this.moveEval || this.showTranspos || this.mergePgn; }
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

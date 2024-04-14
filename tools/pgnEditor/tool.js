(()=>{
  class PgnEditorTool extends LiChessTools.Tools.ToolBase {

    dependencies=[ 'ChessOps','Stockfish','ExportPGN' ]

    preferences=[
      {
        name:'pgnEditor',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: false
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.pgnEditor': 'PGN Editor',
        'illegalMove': 'Illegal move in game %1, ply %3 (%2)',
        'pgnEditorText': 'PGN Editor',
        'pgnEditorTitle': 'LiChess Tools - PGN Editor',
        'btnMergeText': 'Merge',
        'btnMergeTitle': 'Merge PGNs (where possible)',
        'btnNormalizeText': 'Normalize',
        'btnNormalizeTitle': 'Group moves from the same board position',
        'btnSplitText': 'Split',
        'btnSplitTitle': 'Split into multiple one path PGNs',
        'btnCountText': 'Count',
        'btnCountTitle': 'PGN statistics',
        'btnEvaluateText': 'Evaluate',
        'btnEvaluateTitle': 'Evaluate last position',
        'btnSearchText': 'Search',
        'btnSearchTitle': 'Search on partial FEN, tags, index, invalid, ply',
        'btnKeepFoundText': 'Result',
        'btnKeepFoundTitle': 'Keep only the found results',
        'btnCutStuffText': 'Cut',
        'btnCutStuffTitle': 'Cut to ply number, remove annotations, comments, tags or found results',
        'btnCancelText': 'Cancel',
        'btnCancelTitle': 'Cancel currently running operation',
        'btnUploadText': 'Upload',
        'btnUploadTitle': 'Upload PGN',
        'btnDownloadText': 'Download',
        'btnDownloadTitle': 'Download PGN',
        'btnCopyText': 'Copy',
        'btnCopyTitle': 'Copy to clipboard',
        'btnUndoText': 'Undo',
        'btnUndoTitle': 'Undo text changes',
        'btnRedoText': 'Redo',
        'btnRedoTitle': 'Redo text changes',
        'btnClearText': 'Clear',
        'btnClearTitle': 'Clear text and history!',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied':'Clipboard access denied',
        'gameCount': '%s PGNs, %2 moves',
        'gameCount:one': 'one PGN, %2 moves',
        'mergingGames': 'Merging %s PGNs',
        'mergingGames:one': 'Merging one PGN',
        'normalizingGames': 'Normalizing %s PGNs',
        'normalizingGames:one': 'Normalizing one PGN',
        'splittingGames': 'Splitting %s PGNs',
        'splittingGames:one': 'Splitting one PGN',
        'searchingGames': 'Searching %s PGNs',
        'searchingGames:one': 'Searching one PGN',
        'evaluatingGames': 'Evaluating %s PGNs',
        'evaluatingGames:one': 'Evaluating one PGN',
        'preparingGames': 'Preparing %s PGNs',
        'preparingGames:one': 'Preparing one PGN',
        'cannotMerge': 'Cannot merge!\r\n(no common board positions)',
        'operationFailed': 'Operation failed!\r\n(invalid input)',
        'operationCancelled': 'Operation cancelled',
        'pastePGNs': 'drag/paste your PGNs here',
        'searchPattern': 'Enter partial FEN or PGN string (*,? wildcards supported) or Tag=Value or "Index"=Value or "Invalid" or "Ply"(>,=,<)Value',
        'foundGames': '%s games found',
        'foundGames:one': 'One game found',
        'cutStuffPrompt': '"Tags", "Annotations", "Comments", "Result", "Ply "Value in any combination (i.e. tags, ply 10)',
        'sendToPgnEditorText':'PGN Editor',
        'sendToPgnEditorTitle':'LiChess Tools - send to PGN Editor'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.pgnEditor': 'Editor PGN',
        'illegalMove': 'Mutare invalid\u0103 \u00een jocul %1, ply %3 (%2)',
        'pgnEditorText': 'Editor PGN',
        'pgnEditorTitle': 'LiChess Tools - Editor PGN',
        'btnMergeText': 'Combin\u0103',
        'btnMergeTitle': 'Combin\u0103 PGNuri (dac\u0103 se poate)',
        'btnNormalizeText': 'Normalizeaz\u0103',
        'btnNormalizeTitle': 'Grupeaz\u0103 mut\u0103ri f\u0103cute din aceea\u015fi pozi\u0163ie',
        'btnSplitText': 'Sparge',
        'btnSplitTitle': 'Sparge \u00een mai multe PGNuri f\u0103r\u0103 varia\u0163iuni',
        'btnCountText': 'Num\u0103r\u0103',
        'btnCountTitle': 'Statistici PGN',
        'btnEvaluateText': 'Evaluare',
        'btnEvaluateTitle': 'Evalueaz\u0103 ultima pozi\u0163ie',
        'btnSearchText': 'Caut\u0103',
        'btnSearchTitle': 'Caut\u0103 cu FEN par\u0163ial, etichete, index, invalid, jum\u0103t\u0103\u0163i de mutare',
        'btnKeepFoundText': 'Rezultat',
        'btnKeepFoundTitle': 'P\u0103streaz\u0103 doar rezultatele g\u0103site',
        'btnCutStuffText': 'Taie',
        'btnCutStuffTitle': 'Taie la un nu\u0103ar de jum\u0103t\u0103\u0163i de mutare, elimin\u0103 adnot\u0103ri, comentarii, etichete sau rezultatele g\u0103site',
        'btnCancelText': 'Anuleaz\u0103',
        'btnCancelTitle': 'Anuleaz\u0103 opera\u0163iunea curent\u0103',
        'btnUploadText': '\u00CEncarc\u0103',
        'btnUploadTitle': '\u00CEncarc\u0103 PGN',
        'btnDownloadText': 'Descarc\u0103',
        'btnDownloadTitle': 'Descarc\u0103 PGN',
        'btnCopyText': 'Copiaz\u0103',
        'btnCopyTitle': 'Copiaz\u0103 \u00een clipboard',
        'btnUndoText': '\u00CEnapoi',
        'btnUndoTitle': 'Anuleaz\u0103 schimb\u0103rile text',
        'btnRedoText': 'Ref\u0103',
        'btnRedoTitle': 'Ref\u0103 schimb\u0103rile text',
        'btnClearText': 'Sterge',
        'btnClearTitle': '\u015Eterge textul \u015Fi istoria!',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied':'Acces refuzat la clipboard',
        'gameCount': '%s PGNuri, %2 mut\u0103ri',
        'gameCount:one': 'un PGN, %2 mut\u0103ri',
        'mergingGames': 'Combin %s PGNuri',
        'mergingGames:one': 'Combin un PGN',
        'normalizingGames': 'Normalizez %s PGNuri',
        'normalizingGames:one': 'Normalizez un PGN',
        'splittingGames': 'Sparg %s PGNuri',
        'splittingGames:one': 'Sparg un PGN',
        'searchingGames': 'Caut \u00een %s PGNuri',
        'searchingGames:one': 'Caut \u00eentr-un PGN',
        'evaluatingGames': 'Evaluez %s PGNuri',
        'evaluatingGames:one': 'Evaluez un PGN',
        'preparingGames': 'Prepar %s PGNuri',
        'preparingGames:one': 'Prepar un PGN',
        'cannotMerge': 'Nu pot combina!\r\n(nu sunt pozi\u0163ii comune pe tabl\u0103)',
        'operationFailed': 'Opera\u0163iune e\u015Fuat\u0103!\r\n(con\u0163inut gre\u015Fit)',
        'operationCancelled': 'Opera\u0163iune anulat\u0103',
        'pastePGNs': 'trage/lipe\u015Fte PGNurile tale aici',
        'searchPattern': 'Introdu un text FEN sau PGN par\u0163ial (suport\u0103 \u00eenlocuitori *,?) sau Tag=Valoare sau "Index"=Valoare sau "Invalid" sau "Ply"(>,=,<)Valoare',
        'foundGames': '%s jocuri g\u0103site',
        'foundGames:one': 'Un joc g\u0103sit',
        'cutStuffPrompt': '"Tags", "Annotations", "Comments", "Result", "Ply "Valoare \u00een orice combina\u0163ie (ex: tags, ply 10)',
        'sendToPgnEditorText':'Editor PGN',
        'sendToPgnEditorTitle':'LiChess Tools - trimite la Editor PGN'
      }
    }

    historyIndex=-1;
    history=[];
    setText=(control,text)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $(control).val(text);
      this.addTextToHistory(text);
    };
    addTextToHistory=(text)=>{
      const parent=this.lichessTools;
      if (this.history[this.historyIndex]==text) return;
      this.setHistoryIndex(this.historyIndex+1);
      this.history[this.historyIndex]=text;
      if (this.history.length>this.historyIndex+1) {
        this.history.splice(this.historyIndex+1);
      }
      if (this.history.length>10) {
        this.history.splice(0,1);
      }
      if (this.historyIndex>=this.history.length) {
        this.historyIndex=this.history.length-1;
      }
      parent.global.sessionStorage.setItem('LichessTools.pgnEditor.history',JSON.stringify({ history: this.history, index: this.historyIndex }));
    };
    setHistoryIndex=async (val)=>{
      const hasChange=(this.historyIndex!=val);
      const parent=this.lichessTools;
      const $=parent.$;
      this.historyIndex=val;
      await parent.timeout(1);
      const undo=val>=0 && val<this.history.length;
      $('dialog.lichessTools-pgnEditor .buttons button[data-role="undo"]')
        .toggleClass('disabled',!undo)
        .prop('disabled',!undo);
      const redo=val+1<this.history.length;
      $('dialog.lichessTools-pgnEditor .buttons button[data-role="redo"]')
        .toggleClass('disabled',!redo)
        .prop('disabled',!redo);
      if (hasChange) {
        parent.global.sessionStorage.setItem('LichessTools.pgnEditor.history',JSON.stringify({ history: this.history, index: this.historyIndex }));
      }
    };

    copyToClipboard=async (text)=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const permission=await parent.global.navigator.permissions.query({ name: 'clipboard-write' });
      if (['granted','prompt'].includes(permission.state)) {
        try {
          await parent.global.navigator.clipboard.writeText(text);
          const announcement = trans.noarg('PGNCopiedToClipboard');
          parent.announce(announcement);
        } catch(e) {
          const announcement = trans.noarg('clipboardDenied');
          parent.announce(announcement);
        }
      } else {
        const announcement = trans.noarg('clipboardDenied');
        parent.announce(announcement);
      }
    };

    showPgnEditor=(showPgnText)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      $('dialog.lichessTools-pgnEditor').remove();
      const dialog=$('<dialog class="lichessTools-pgnEditor">')
        .append(`
    <div class="close-button-anchor">
        <a class="help-button" data-icon="&#xE005;" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#pgnEditor" target="_blank"></a>
        <button class="close-button" data-icon="&#xE03F;" aria-label="Close"/>
    </div>
    <div class="scrollable">
        <div class="dialog-content">
            <h2></h2>
            <div class="input-wrapper">
              <textarea autofocus></textarea>
              <div class="buttons">
                <button class="button" type="button" data-role="merge" data-icon="&#xE037;"><span></span></button>
                <button class="button" type="button" data-role="normalize" data-icon="&#xE05B;"><span></span></button>
                <button class="button" type="button" data-role="split" data-icon="&#xE018;"><span></span></button>
                <button class="button" type="button" data-role="search" data-icon="&#xE02F;"><span></span></button>
                <button class="button" type="button" data-role="keepFound" data-icon="&#xE02A;"><span></span></button>
                <button class="button" type="button" data-role="cutStuff" data-icon="&#x2702;"><span></span></button>
                <button class="button" type="button" data-role="evaluate" data-icon="&#xE02C;"><span></span></button>
                <button class="button" type="button" data-role="count" data-icon="&#xE004;"><span></span></button>
                <button class="button" type="button" data-role="cancel" data-icon="&#xE071;"><span></span></button>
                <hr></hr>
                <button class="button" type="button" data-role="copy" data-icon="&#xE070;"><span></span></button>
                <button class="button" type="button" data-role="upload" data-icon="&#xE039;"><span></span></button>
                <button class="button" type="button" data-role="download" data-icon="&#xE024;"><span></span></button>
                <button class="button" type="button" data-role="undo" data-icon="&#xE05C;"><span></span></button>
                <button class="button" type="button" data-role="redo" data-icon="&#xE06D;"><span></span></button>
                <button class="button" type="button" data-role="clear" data-icon="&#xE03F;"><span></span></button>
                <label></label>
              </div>
            </div>
        </div>
    </div>
`)
        .appendTo('body');
      $('div.dialog-content>h2').text(trans.noarg('pgnEditorText'));
      const textarea=$('textarea',dialog)
        .attr('placeholder',trans.noarg('pastePGNs'))
        .on('drop',ev=>{
          ev.preventDefault();
          const file=ev.dataTransfer.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e)=>{
            this.setText(textarea,e.target.result);
            this.countPgn();
          };
          reader.readAsText(file, "UTF-8");
        })
        .on('change',ev=>{
          this.addTextToHistory(textarea.val());
          this.writeNote('');
        })
        .on('keyup',ev=>{
          if (ev.ctrlKey && ev.key=='z') {
            ev.preventDefault();
            this.undo(textarea);
          }
          if (ev.ctrlKey && ev.key=='y') {
            ev.preventDefault();
            this.redo(textarea);
          }
          this.writeNote('');
        });
      $('[data-role="merge"]',dialog)
        .attr('title',trans.noarg('btnMergeTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('merge',()=>this.mergePgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnMergeText'));
      $('[data-role="normalize"]',dialog)
        .attr('title',trans.noarg('btnNormalizeTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('normalize',()=>this.normalizePgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnNormalizeText'));
      $('[data-role="split"]',dialog)
        .attr('title',trans.noarg('btnSplitTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('split',()=>this.splitPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnSplitText'));
      $('[data-role="search"]',dialog)
        .attr('title',trans.noarg('btnSearchTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('search',()=>this.searchPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnSearchText'));
      $('[data-role="keepFound"]',dialog)
        .attr('title',trans.noarg('btnKeepFoundTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('keepFound',()=>this.keepFound(textarea));
        })
        .find('span')
        .text(trans.noarg('btnKeepFoundText'));
      $('[data-role="cutStuff"]',dialog)
        .attr('title',trans.noarg('btnCutStuffTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('cutStuff',()=>this.cutStuff(textarea));
        })
        .find('span')
        .text(trans.noarg('btnCutStuffText'));
      $('[data-role="count"]',dialog)
        .attr('title',trans.noarg('btnCountTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('count',()=>this.countPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnCountText'));
      $('[data-role="evaluate"]',dialog)
        .attr('title',trans.noarg('btnEvaluateTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('evaluate',()=>this.evaluatePosition(textarea));
        })
        .find('span')
        .text(trans.noarg('btnEvaluateText'));
      $('[data-role="cancel"]',dialog)
        .attr('title',trans.noarg('btnCancelTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.stopOperations();
        })
        .find('span')
        .text(trans.noarg('btnCancelText'));
      $('[data-role="copy"]',dialog)
        .attr('title',trans.noarg('btnCopyTitle'))
        .on('click',async ev=>{
          ev.preventDefault();
          this.runOperation('copy',()=>{
            const text=textarea.val();
            if (!text) return;
            this.copyToClipboard(text);
          });
        })
        .find('span')
        .text(trans.noarg('btnCopyText'));
      $('[data-role="upload"]',dialog)
        .attr('title',trans.noarg('btnUploadTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          $('<input type="file">')
            .on('change',async e=>{
              if (this._runningOperation) return;
              const name='upload';
              const now=Date.now();
              try {
                const file = e.target.files[0];
                if (!file) return;
                this._cancelRequested=false;
                this._runningOperation=name;
                this.toggleCancel(true);
                await parent.timeout(0);
                const reader = new FileReader();
                reader.onload = (e)=>{
                  if (this._cancelRequested) {
                    this._cancelRequested=false;
                    this.writeNote(trans.noarg('operationCancelled'));
                  }
                  this.setText(textarea,e.target.result);
                  this._runningOperation=null;
                  this.toggleCancel(false);
                  parent.global.console.debug('Operation '+name+' took '+((Date.now()-now)/1000).toFixed(1)+' seconds');
                  this.countPgn();
                };
                reader.readAsText(file, "UTF-8");
              } catch(ex) {
                if (this._cancelRequested) {
                  this._cancelRequested=false;
                  this.writeNote(trans.noarg('operationCancelled'));
                }
                this._runningOperation=null;
                this.toggleCancel(false);
                throw ex;
              }
            })
            .trigger('click');
        })
        .find('span')
        .text(trans.noarg('btnUploadText'));
      $('[data-role="download"]',dialog)
        .attr('title',trans.noarg('btnDownloadTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          const text=textarea.val();
          if (!text) return;
          this.runOperation('download',()=>{
            const blob=new Blob([text],{type:'application/x-chess-pgn'});
            const url=URL.createObjectURL(blob);
            $('<a>')
              .attr('download','pgnEditor_'+(new Date().toISOString().replace(/[\-T:]/g,'').slice(0,14))+'.pgn')
              .attr('href',url)
              .trigger('click');
          });
        })
        .find('span')
        .text(trans.noarg('btnDownloadText'));
      $('[data-role="undo"]',dialog)
        .attr('title',trans.noarg('btnUndoTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('undo',()=>this.undo(textarea));
        })
        .find('span')
        .text(trans.noarg('btnUndoText'));
      $('[data-role="redo"]',dialog)
        .attr('title',trans.noarg('btnRedoTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('redo',()=>this.redo(textarea));
        })
        .find('span')
        .text(trans.noarg('btnRedoText'));
      $('[data-role="clear"]',dialog)
        .attr('title',trans.noarg('btnClearTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.runOperation('clear',()=>this.clear(textarea));
        })
        .find('span')
        .text(trans.noarg('btnClearText'));
      $('button.close-button',dialog)
        .on('click',ev=>{
          ev.preventDefault();
          this.stopOperations();
          dialog.remove();
          if (parent.global.location.hash='#pgnEditor') {
            parent.global.history.pushState(null, null, ' ');
          }
        });
      this._label=$('dialog.lichessTools-pgnEditor .buttons label');
      this.toggleCancel(false);
      if (parent.global.location.hash!='#pgnEditor') {
        parent.global.history.pushState(null, null, '#pgnEditor');
      }
      if (showPgnText) {
        this.setText(textarea,showPgnText);
      } else {
        const text=this.history[this.historyIndex]||'';
        $(textarea).val(text);
        this.setHistoryIndex(this.historyIndex);
      }
    };

    stopOperations=()=>{
      if (!this._runningOperation) return;
      this._cancelRequested=true;
    }

    runOperation=async (name,operation)=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      if (this._runningOperation) return;
      const now=Date.now();
      try {
        
        this._cancelRequested=false;
        this._runningOperation=name;
        this.toggleCancel(true);
        await parent.timeout(0);
        await operation();
      } finally {
        if (this._cancelRequested) {
          this._cancelRequested=false;
          this.writeNote(trans.noarg('operationCancelled'));
        }
        this._runningOperation=null;
        this.toggleCancel(false);
        parent.global.console.debug('Operation '+name+' took '+((Date.now()-now)/1000).toFixed(1)+' seconds');
      }
    };

    toggleCancel=(value)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('dialog.lichessTools-pgnEditor button:not([data-role="cancel"])')
        .toggleClass('disabled',!!value)
        .prop('disabled',!!value);
      $('dialog.lichessTools-pgnEditor button[data-role="cancel"]')
        .toggleClass('disabled',!value)
        .prop('disabled',!value);
    };

    writeNote=(text)=>{
      if (!this._label) return;
      this._label.text(text);
    };

    countPgn=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const text=$('dialog.lichessTools-pgnEditor textarea').val();
      const co=parent.chessops;
      const games=co.pgn.parsePgn(text).filter(g=>g.headers.get('FEN')||g.moves?.children?.length);

      let moveCount=0;
      const traverse=(node)=>{
        if (node.data?.san) moveCount++;
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child);
        }
      };
      for (const game of games) {
        traverse(game.moves);
      }
      this.writeNote(trans.pluralSame('gameCount',games.length).replace(/%2/g,moveCount));
    };

    enhanceGameWithFens=game=>{
      const parent=this.lichessTools;

      const co=parent.chessops;
      const { startingPosition,parsePgn } = co.pgn;
      const { makeFen }= co.fen;
      const { parseSan, makeSanAndPlay } = co.san;

      const pos = startingPosition(game.headers).unwrap();

      game.lastMoves=[];
      const traverse=(pos,node,ply=0)=>{
        const fen=makeFen(pos.toSetup());
        node.data={...node.data,fen:fen};
        if (!node.children?.length) {
          game.lastMoves.push(node);
          return;
        }
        for (const child of node.children) {
          const newPos=pos.clone();
          const move = parseSan(newPos, child.data.san);
          if (!move) {
            const err=new Error('Move '+child?.data?.san+' at ply '+ply+' is illegal!');
            err.san=child?.data?.san;
            err.ply=ply+1;
            throw err;
          }
          const san = makeSanAndPlay(newPos, move);
          traverse(newPos,child,ply+1);
        }
      };
      
      const node=game.moves;
      traverse(pos,node);
    };

    enhanceGameWithFenDict=game=>{
      const parent=this.lichessTools;

      game.fenDict=new Map();

      const traverse=(node,ply=0)=>{
        const fen=node.data?.fen;
        if (!fen) {
          const err = Error('Cannot find FEN for node '+node.data?.san+' at ply '+ply+'!');
          err.san=node?.data?.san;
          err.ply=ply+1;
          throw err;
        }
        const key=parent.getFenPosition(fen);
        let arr=game.fenDict.get(key);
        if (!arr) {
          arr=[];
          game.fenDict.set(key,arr);
        }
        arr.push(node);
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child,ply+1);
        }
      };
      
      const node=game.moves;
      traverse(node);
    };


    mergeNodes=(n1,n2)=>{
      n1.children=[...n1.children,...n2.children];
      const comments=(n1.data?.comments||[]).concat((n1.data?.comments||[]));
      if (comments.length) {
        n1.data.comments=[...new Set(comments)];
      }
      const nags=(n1.data?.nags||[]).concat((n1.data?.nags||[]));
      if (nags.length) {
        n1.data.nags=[...new Set(nags)];
      }
    };

    cleanGame=game=>{
      const parent=this.lichessTools;
      const traverse=(game,node)=>{
        if (!node.children?.length) return;
        for (let i=0; i<node.children.length; i++) {
          let j=i+1;
          while (j<node.children.length) {
            const childI=node.children[i];
            const childJ=node.children[j];
            if (childI.data.san==childJ.data.san) {
              this.mergeNodes(childI,childJ);
              if (game.fenDict) {
                const key=parent.getFenPosition(childJ.data.fen);
                parent.arrayRemoveAll(game.fenDict[key],n=>n==childJ);
              }
              parent.arrayRemoveAll(node.children,n=>n==childJ);
            } else j++;
          }
        };
        for (const child of node.children) {
          traverse(game, child);
        }
      };

      traverse(game,game.moves);
    };

    mergePgn=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { startingPosition,parsePgn,makePgn } = co.pgn;
      const { makeFen }= co.fen;
      const { parseSan, makeSanAndPlay } = co.san;
      const text=textarea.val();
      const games=parsePgn(text);
      this.writeNote(trans.pluralSame('mergingGames',games.length));
      await parent.timeout(0);
      let withErrors=false;
      let gameIndex=0;
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
        } catch(ex) {
          if (ex.ply) {
            const data=[gameIndex, ex.san, ex.ply]
            parent.announce(trans.noarg('illegalMove').replace(/%(\d)/g,m=>{
              return data[+m[1]-1];
            }));
            break;
          } else throw ex;
          withErrors=true;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const mergeGames=(dest,node,src)=>{
        node.children=[...node.children,...src.moves.children];
        if (dest.fenDict || src.fenDict) {
          if (!dest.fenDict || !src.fenDict) throw new Error('Cannot merge games that have different enhancement (fenDict)');
          for (const pair of src.fenDict) {
            const newArr=(dest.fenDict.get(pair[0])||[]).concat(pair[1]);
            dest.fenDict.set(pair[0],newArr);
          }
        }
      };

      const initialNumberOfGames=games.length;
      let i=games.length-1;
      let lastWrite=Date.now();
      while(i>=0 && !this._cancelRequested) {
        if (Date.now()-lastWrite>1000) { 
          this.writeNote(trans.pluralSame('mergingGames',games.length));
          lastWrite=Date.now();
          await parent.timeout(0);
        }
        const gameI=games[i];
        const fenI = gameI?.moves?.data?.fen;
        for (let j=i-1; j>=0; j--) {
          const gameJ=games[j];
          const fenJ = gameJ?.moves?.data?.fen;
          if (fenI && fenI==fenJ) {
            mergeGames(gameJ,gameJ.moves,gameI);
            parent.arrayRemoveAll(games,g=>g==gameI);
            break;
          }
        }
        i--;
      }
      for (const game of games) {
        try{
          this.enhanceGameWithFenDict(game);
        } catch(ex) {
          if (ex.ply) {
            const data=[gameIndex, ex.san, ex.ply]
            parent.announce(trans.noarg('illegalMove').replace(/%(\d)/g,m=>{
              return data[+m[1]-1];
            }));
            withErrors=true;
            break;
          } else throw ex;
          withErrors=true;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }
      while(i>=0 && !this._cancelRequested) {
        if (Date.now()-lastWrite>1000) { 
          this.writeNote(trans.pluralSame('mergingGames',games.length));
          lastWrite=Date.now();
          await parent.timeout(0);
        }
        let merged=false;
        const gameI=games[i];
        const keyI=parent.getFenPosition(gameI.moves.data.fen);
        for (let j=i-1; j>=0; j--) {
          const gameJ=games[j];
          const nodes=gameJ.fenDict.get(keyI);
          if (nodes) {
            mergeGames(gameJ,nodes[0],gameI);
            parent.arrayRemoveAll(games,g=>g==gameI);
            merged=true;
            break;
          }
        }
        if (!merged) {
          for (let j=i-1; j>=0; j--) {
            const gameJ=games[j];
            const keyJ=parent.getFenPosition(gameJ.moves.data.fen);
            const nodes=gameI.fenDict.get(keyJ);
            if (nodes) {
              mergeGames(gameI,nodes[0],gameJ);
              parent.arrayRemoveAll(games,g=>g==gameJ);
              merged=true;
              break;
            }
          }
        }
        i--;
      }
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        if (!game.fenDict) {
          throw new Error('Something went wrong! game doesn\'t have fenDict!');
        }
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      if (games.length<initialNumberOfGames) {
        this.countPgn();
      } else {
        this.writeNote(trans.noarg('cannotMerge'));
      }
    };

    evaluatePosition=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      const games=parsePgn(text);
      this.writeNote(trans.pluralSame('evaluatingGames',games.length));
      await parent.timeout(0);

      const depth=+(parent.currentOptions.getValue('customEngineLevel'))||16;
      console.debug('Evaluating with level ',depth);
      const decimals=+parent.currentOptions.getValue('cevalDecimals')||1;

      let info=null;
      let lastInfo=null;

      const sf=await parent.stockfish.load();
      if (!sf) throw new Error('Could not load Stockfish!');
      if ((parent.global.navigator.hardwareConcurrency||0)<=4) {
        sf.setThreads(1);
      } else {
        sf.setThreads(2);
      }
      if ((parent.global.navigator.deviceMemory||0)<=2) {
        sf.setHash(64);
      } else {
        sf.setHash(128);
      }
      sf.setMultiPv(1);
      sf.setDepth(depth);
      sf.on('info',i=>{ lastInfo=i; });
      sf.on('bestmove',i=>{ info=lastInfo; });

      let gameIndex=0; 
      let withErrors=false; 
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
          for (const node of game.lastMoves) {
            const comments=node.data.comments||[];
            if (comments.find(c=>/^eval: /.test(c))) continue;
            lastInfo=null;
            info=null;
            sf.setPosition(node.data.fen);
            sf.start();
            while (!info && !this._cancelRequested) {
              await parent.timeout(100);
            }
            if (this._cancelRequested) {
              break;
            }
            sf.stop();
            const side=node.data.fen.split(' ')[1]=='b'?-1:1;
            const evalText="eval: "+(info.mate ?'#'+(side*info.mate) : ((side*info.cp)>0?'+':'')+(side*info.cp/100).toFixed(decimals));
            node.data.comments=[...comments,evalText];
          }
        } catch(ex) {
          if (ex.ply) {
            const data=[gameIndex, ex.san, ex.ply]
            parent.announce(trans.noarg('illegalMove').replace(/%(\d)/g,m=>{
              return data[+m[1]-1];
            }));
            withErrors=true;
            break;
          } else throw ex;
        }
        this.writeNote(trans.pluralSame('evaluatingGames',games.length-gameIndex));
        await parent.timeout(0);
        if (this._cancelRequested) {
          break;
        }
      }
      sf.destroy();

      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      if (this._cancelRequested) {
        return;
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    normalizePgn=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      const games=parsePgn(text);
      this.writeNote(trans.pluralSame('normalizingGames',games.length));
      await parent.timeout(0);
      let withErrors=false;
      let gameIndex=0;
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
          this.enhanceGameWithFenDict(game);
        } catch(ex) {
          if (ex.ply) {
            const data=[gameIndex, ex.san, ex.ply]
            parent.announce(trans.noarg('illegalMove').replace(/%(\d)/g,m=>{
              return data[+m[1]-1];
            }));
            withErrors=true;
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const findDescendant=(node,predicate)=>{
        if (predicate(node)) return node;
        for (const child of node.children) {
          const result=findDescendant(child,predicate);
          if (result) return result;
        }
      };

      const onSameBranch=(n1,n2)=>{
        if (findDescendant(n1,n=>n==n2)) return true;
        if (findDescendant(n2,n=>n==n1)) return true;
        return false;
      };

      let i=games.length-1;
      let lastWrite=Date.now();
      while(i>=0 && !this._cancelRequested) {
        if (Date.now()-lastWrite>1000) { 
          this.writeNote(trans.pluralSame('normalizingGames',games.length));
          lastWrite=Date.now();
          await parent.timeout(0);
        }
        const game=games[i];
        for (const pair of game.fenDict) {
          const key=pair[0];
          const nodes=pair[1];
          if (nodes.length==1) continue;
          for (let i=1; i<nodes.length; i++) {
            for (let j=0; j<i; j++) {
              if (!nodes[j].children.length) continue;
              if (onSameBranch(nodes[i],nodes[j])) continue;
              this.mergeNodes(nodes[j],nodes[i]);
              nodes[i].children=[];
            }
          }
        }
        i--;
      }
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    splitPgn=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('splittingGames',games.length));
      await parent.timeout(0);

      const newGames=[];
      const traverse=(game,node,arr)=>{
        arr.push(node);
        if (this._cancelRequested) {
          return;
        }
        if (!node.children?.length) {
          let curr={...arr[0],children:[]};
          const newGame={...game, moves: curr};
          for (const node of arr.slice(1)) {
            const newNode={...node,children:[]};
            curr.children.push(newNode);
            curr=newNode;
          }
          newGames.push(newGame);
          return;
        }
        for (const child of node.children) {
          traverse(game,child,[...arr]);
        }
      }

      while (games.length && !this._cancelRequested) {
        const game=games[0];
        traverse(game,game.moves,[]);
        games.splice(0,1);
        this.writeNote(trans.pluralSame('splittingGames',(newGames.length+games.length)));
        await parent.timeout(0);
      }
      games=newGames;
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutStuff=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const text=parent.global.prompt(trans.noarg('cutStuffPrompt'));
      if (/result/i.test(text)) {
        await this.cutFound(textarea);
      }
      if (/tags/i.test(text)) {
        await this.cutTags(textarea);
      }
      if (/comments/i.test(text)) {
        await this.cutComments(textarea);
      }
      if (/annotations|nags/i.test(text)) {
        await this.cutAnnotations(textarea);
      }
      const m=/(?:^(\d+)$|ply\s*(\d+))/i.exec(text);
      if (m) {
        const ply=+(m[1]||m[2]);
        await this.cutPly(textarea,ply);
      }
    };

    cutFound=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames',games.length));
      await parent.timeout(0);

      parent.arrayRemoveAll(games,g=>g.headers.has('Found'));

      this.writeGames(textarea, games);

      this.countPgn();
    };

      
    cutTags=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);

      for (const game of games) {
        game.headers?.clear();
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutComments=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);

      const traverse=(node,ply=0)=>{
        if (node.data?.comments?.length) {
          node.data.comments.length=0;
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child,ply+1);
        }
      };
      
      for (const game of games) {
        traverse(game.moves);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutAnnotations=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);

      const traverse=(node,ply=0)=>{
        if (node.data?.nags?.length) {
          node.data.nags.length=0;
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child,ply+1);
        }
      };
      
      for (const game of games) {
        traverse(game.moves);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutPly=async (textarea,plyNumber)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      if (!plyNumber) return;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);

      const traverse=(node,ply=0)=>{
        if (!node.children?.length) return;
        if (node.data?.san && ply>=plyNumber) node.children=[];
        for (const child of node.children) {
          traverse(child,ply+1);
        }
      };
      
      for (const game of games) {
        traverse(game.moves);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    searchPgn=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const search = parent.global.prompt(trans.noarg('searchPattern'));
      if (!search) return;
      let searchMode='fenOrMoves';
      let plyNumberOperator;
      let plyNumber;
      let tagName;
      let tagValue;
      let reg;
      let m=/^ply\s*([\<\>=])\s*(\d+)/i.exec(search);
      if (m) {
        searchMode='plyNumber';
        plyNumberOperator=m[1];
        plyNumber=+m[2];
      } else if (/^invalid[s]?$/i.test(search)) {
        searchMode='invalid';
      } else {
        m=/^\s*(\w+)\s*=\s*["]?(.*?)["]?$/.exec(search);
        if (m) {
          searchMode='tag';
          tagName=m[1];
          tagValue=m[2];
        } else {
          reg=new RegExp(Array.from(search).map(c=>{
            switch(c) {
              case '*': return '.*';
              case '?': return '.';
              default: return c.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
            }
          }).join(''));
        }
      }

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames',games.length));
      await parent.timeout(0);

      const getMaxPly=(game)=>{
        let maxPly=0;
        const traverse=(node,ply=0)=>{
          if (node.data?.san && ply>maxPly) maxPly=ply;
          if (!node.children?.length) return;
          for (const child of node.children) {
            traverse(child,ply+1);
          }
        };
        traverse(game.moves);
        return maxPly;
      };


      let gameIndex=0;
      const foundGames=[];
      for (const game of games) {
        gameIndex++;
        try {
          game.headers.delete('Found');
          let found=false;
          switch(searchMode) {
            case 'invalid':
              try {
                this.enhanceGameWithFens(game);
              } catch(ex) {
                if (ex.ply) {
                  found=true;
                } else throw ex;
              }
              break;
            case 'fenOrMoves':
              const pgn=makePgn(game);
              if (reg.test(pgn)) {
                found=true;
                break;
              }
              this.enhanceGameWithFens(game);
              this.enhanceGameWithFenDict(game);
              found=Array.from(game.fenDict).find(pair=>reg.test(pair[0]));
              break;
            case 'tag':
              const val=tagName.toLowerCase()=='index'
                ? gameIndex.toString()
                : game.headers.get(tagName);
              found=(val?.replace(/\s+/g,'')==tagValue?.replace(/\s+/g,''));
              break;
            case 'plyNumber':
              const maxPly=getMaxPly(game);
              switch(plyNumberOperator) {
                case '>':
                  found=maxPly>plyNumber;
                  break;
                case '<':
                  found=maxPly<plyNumber;
                  break;
                case '=':
                  found=maxPly==plyNumber;
                  break;
              }
              break;
          }
          if (found){
            game.headers.set('Found',search.replaceAll('"',''));
            foundGames.push(game);
          }
        } catch(ex) {
          if (ex.ply) {
            const data=[gameIndex, ex.san, ex.ply]
            parent.announce(trans.noarg('illegalMove').replace(/%(\d)/g,m=>{
              return data[+m[1]-1];
            }));
            break;
          } else throw ex;
          withErrors=true;
        }
      }

      this.writeNote(trans.pluralSame('preparingGames',games.length));
      await parent.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      const foundText=foundGames.map(g=>{
        g.headers.delete('Found');
        return makePgn(g);
      }).join('\r\n\r\n')
        .replace(/\[[^\s]+\s+"[\?\.\*]*"\]\s*/g,'');
      this.copyToClipboard(foundText);

      this.writeNote(trans.pluralSame('foundGames',foundGames.length));
    };


    keepFound=async (textarea)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;

      const co=parent.chessops;
      const { parsePgn,makePgn } = co.pgn;
      const text=textarea.val();
      let games=parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames',games.length));
      await parent.timeout(0);

      parent.arrayRemoveAll(games,g=>!g.headers.has('Found'));
      for (const game of games) {
        game.headers.delete('Found');
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    writeGames=(textarea,games)=>{
      const parent=this.lichessTools;
      const co=parent.chessops;
      const { makePgn } = co.pgn;

      let newText=games.map(g=>makePgn(g)).join('\r\n\r\n')
        .replace(/\[[^\s]+\s+"[\?\.\*]*"\]\s*/g,'');

      const regChessMove=/(?<move>\b(?<piece>[NBRQK])?(?<p1>([a-h])?([1-8])?(x)?([a-h][1-8]))(=(?<promotion>[NBRQK]))?(?<p2>\+|#)?\b)(?<nags>(\s+\$\d+)+)/g;
      const annos=['!','?','!!','??','!?','?!'];
      newText = newText.replace(regChessMove,
        (...m)=>{
          const g=m.at(-1);
          let nags=g.nags;
          const m2=/\s+\$([1-6])\b/.exec(nags);
          if (m2) {
            nags=nags.substr(0,m2.index)+nags.substr(m2.index+m2[0].length);
            const anno=annos[+m2[1]-1];
            return g.move+anno+nags;
          }
          return m[0];
        });

      this.setText(textarea,newText);
    };

    undo=async (textarea)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const text=this.history[this.historyIndex-1]||'';
      $(textarea).val(text);
      this.setHistoryIndex(this.historyIndex-1);
      this.writeNote('');
    };

    redo=async (textarea)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (this.historyIndex+1>=this.history.length) return;
      const text=this.history[this.historyIndex+1];
      $(textarea).val(text);
      this.setHistoryIndex(this.historyIndex+1);
      this.writeNote('');
    };

    clear=async (textarea)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $(textarea).val('');
      this.history=[];
      this.setHistoryIndex(-1);
      parent.global.sessionStorage.removeItem('LichessTools.pgnEditor.history');
    };

    hashchange=(ev)=>{
      const parent=this.lichessTools;
      const location=parent.global.location;
      const dialog=$('dialog.lichessTools-pgnEditor');
      if (location.hash=='#pgnEditor') {
        if (!dialog.length) {
          this.showPgnEditor();
        }
      } else {
        $('dialog.lichessTools-pgnEditor').remove();
      }
    };

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const container=$('div.analyse__tools .action-menu__tools');
      if (!container.length) return;
      if (!this.options.enabled||!parent.exportPgn) {
        $('.lichessTools-pgnEditor',container).remove();
        return;
      }
      if ($('.lichessTools-pgnEditor',container).length) return;
      $('<a class="lichessTools-pgnEditor">')
        .attr('data-icon','\u2E0E')
        .attr('title',trans.noarg('sendToPgnEditorTitle'))
        .text(trans.noarg('sendToPgnEditorText'))
        .attr('href','/analysis#pgnEditor')
        .on('click',async ev=>{
          ev.preventDefault();
          const pgn=await parent.exportPgn('',{ copyToClipboard:false });
          this.showPgnEditor(pgn);
        })
        .appendTo(container);;
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('pgnEditor');
      this.logOption('PGN editor', value);
      this.options={ enabled: !!value };
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const container=$('#topnav section a[href="/analysis"]+div[role="group"]');
      $('a.lichessTools-pgnEditor',container).remove();

      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.unwrapFunction(lichess.analysis.actionMenu.toggle,'pgnEditor');
      lichess.analysis.actionMenu.toggle=lichessTools.wrapFunction(lichess.analysis.actionMenu.toggle,{
        id:'pgnEditor',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();

      if (!value) {
        $('dialog.lichessTools-pgnEditor').remove();
        return;
      }
      $('<a/>')
        .addClass('lichessTools-pgnEditor')
        .text(trans.noarg('pgnEditorText'))
        .attr('title',trans.noarg('pgnEditorTitle'))
        .on('click',ev=>{
          ev.preventDefault();
          this.showPgnEditor();
          $('nav#topnav').trigger('mouseout');
        })
        .appendTo(container);
      $(parent.global).on('hashchange',this.hashchange);
      let data=parent.global.sessionStorage.getItem('LichessTools.pgnEditor.history');
      if (data) {
        data=JSON.parse(data);
        this.history=data.history||[];
        const index=+(data.index);
        this.setHistoryIndex(index===0
          ? 0
          : index || -1);
      }
      this.hashchange();
    }

  }
  LiChessTools.Tools.PgnEditor=PgnEditorTool;
})();

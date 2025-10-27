(() => {
  class PgnEditorTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ChessOps', 'Stockfish', 'ExportPGN']

    preferences = [
      {
        name: 'pgnEditor',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: false
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.pgnEditor': 'PGN Editor',
        'illegalMove': 'Illegal move in game %1, ply %3 (%2)',
        'pgnEditorText': 'PGN Editor',
        'pgnEditorTitle': 'LiChess Tools - PGN Editor',
        'btnMergeText': 'Merge',
        'btnMergeTitle': 'Merge PGNs (where possible)',
        'btnNormalizeText': 'Normalize',
        'btnNormalizeTitle': 'Group moves from the same board position',
        'btnDenormalizeText': 'Denormalize',
        'btnDenormalizeTitle': 'Expand transpositions into moves',
        'btnSplitText': 'Split',
        'btnSplitTitle': 'Split into multiple one path PGNs',
        'btnCountText': 'Count',
        'btnCountTitle': 'PGN statistics',
        'btnEvaluateText': 'Evaluate',
        'btnEvaluateTitle': 'Evaluate end positions',
        'btnSearchText': 'Search',
        'btnSearchTitle': 'Search on partial FEN, tags, index, invalid, ply',
        'btnKeepFoundText': 'Result',
        'btnKeepFoundTitle': 'Keep only the found results',
        'btnExtractText': 'Extract',
        'btnExtractTitle': 'Extract information',
        'extractPrompt': '"fen"',
        'extractingFens': 'Extracting FENs',
        'btnCutStuffText': 'Cut',
        'btnCutStuffTitle': 'Cut to ply number, remove junk, annotations, comments, tags, found results or branches',
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
        'clipboardDenied': 'Clipboard access denied',
        'gameCount': '%s PGNs, %2 moves',
        'gameCount:one': 'one PGN, %2 moves',
        'mergingGames': 'Merging %s PGNs',
        'mergingGames:one': 'Merging one PGN',
        'normalizingGames': 'Normalizing %s PGNs',
        'normalizingGames:one': 'Normalizing one PGN',
        'denormalizingGames': 'Denormalizing %s PGNs',
        'denormalizingGames:one': 'Denormalizing one PGN',
        'splittingGames': 'Splitting %s PGNs',
        'splittingGames:one': 'Splitting one PGN',
        'searchingGames': 'Searching %s PGNs',
        'searchingGames:one': 'Searching one PGN',
        'evaluatingGames': 'Evaluating %s PGNs',
        'evaluatingGames:one': 'Evaluating one PGN',
        'evaluatingMoves': 'Evaluating %s moves',
        'evaluatingMoves:one': 'Evaluating move',
        'preparingGames': 'Preparing %s PGNs',
        'preparingGames:one': 'Preparing one PGN',
        'cannotMerge': 'Cannot merge!\r\n(no common board positions)',
        'operationFailed': 'Operation failed!\r\n(invalid input)',
        'operationCancelled': 'Operation cancelled',
        'pastePGNs': 'drag/paste your PGNs here',
        'searchPattern': 'Enter partial FEN or PGN string (*,? wildcards supported) or Tag(=,*=)Value, "Index"=Value, "Invalid", "Ply"(>,=,<)Value, "Eval"(>,=,<)Value", "Clock", "Shapes"',
        'foundGames': '%s games found',
        'foundGames:one': 'One game found',
        'cutStuffPrompt': '"Tags", "Annotations", "Comments", "Result", "Ply" Value, "Junk", "Eval"(>,=,<)Value, "Eval", "Clock", "Shapes" in any combination (i.e. eval, junk, tags, ply 10, eval<0)',
        'sendToPgnEditorText': 'PGN Editor',
        'sendToPgnEditorTitle': 'LiChess Tools - send to PGN Editor',
        'evaluateNeedsAnalysis': 'Evaluate can only be used on the analysis or study pages - Lichess limitation'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.pgnEditor': 'Editor PGN',
        'illegalMove': 'Mutare invalid\u0103 \u00een jocul %1, ply %3 (%2)',
        'pgnEditorText': 'Editor PGN',
        'pgnEditorTitle': 'LiChess Tools - Editor PGN',
        'btnMergeText': 'Combin\u0103',
        'btnMergeTitle': 'Combin\u0103 PGNuri (dac\u0103 se poate)',
        'btnNormalizeText': 'Normalizeaz\u0103',
        'btnNormalizeTitle': 'Grupeaz\u0103 mut\u0103ri f\u0103cute din aceea\u015fi pozi\u0163ie',
        'btnDenormalizeText': 'Denormalizeaz\u0103',
        'btnDenormalizeTitle': 'Extinde transpozi\u0163ii \u00een mut\u0103ri',
        'btnSplitText': 'Sparge',
        'btnSplitTitle': 'Sparge \u00een mai multe PGNuri f\u0103r\u0103 varia\u0163ii',
        'btnCountText': 'Num\u0103r\u0103',
        'btnCountTitle': 'Statistici PGN',
        'btnEvaluateText': 'Evaluare',
        'btnEvaluateTitle': 'Evalueaz\u0103 pozi\u0163ii finale',
        'btnSearchText': 'Caut\u0103',
        'btnSearchTitle': 'Caut\u0103 cu FEN par\u0163ial, etichete, index, invalid, jum\u0103t\u0103\u0163i de mutare',
        'btnKeepFoundText': 'Rezultat',
        'btnKeepFoundTitle': 'P\u0103streaz\u0103 doar rezultatele g\u0103site',
        'btnExtractText': 'Extrage',
        'btnExtractTitle': 'Extrage informa\u0163ie',
        'extractPrompt': '"fen"',
        'extractingFens': 'Extrag FENuri',
        'btnCutStuffText': 'Taie',
        'btnCutStuffTitle': 'Taie la un num\u0103r de jum\u0103t\u0103\u0163i de mutare, elimin\u0103 gunoi, adnot\u0103ri, comentarii, etichete sau rezultatele g\u0103site',
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
        'btnRedoTitle': 'Ref\u0103 schimb\u0103rile \u00een text',
        'btnClearText': '\u015Eterge',
        'btnClearTitle': '\u015Eterge textul \u015Fi istoricul!',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard',
        'gameCount': '%s PGNuri, %2 mut\u0103ri',
        'gameCount:one': 'un PGN, %2 mut\u0103ri',
        'mergingGames': 'Combin %s PGNuri',
        'mergingGames:one': 'Combin un PGN',
        'normalizingGames': 'Normalizez %s PGNuri',
        'normalizingGames:one': 'Normalizez un PGN',
        'denormalizingGames': 'Denormalizez %s PGNuri',
        'denormalizingGames:one': 'Denormalizez un PGN',
        'splittingGames': 'Sparg %s PGNuri',
        'splittingGames:one': 'Sparg un PGN',
        'searchingGames': 'Caut \u00een %s PGNuri',
        'searchingGames:one': 'Caut \u00eentr-un PGN',
        'evaluatingGames': 'Evaluez %s PGNuri',
        'evaluatingGames:one': 'Evaluez un PGN',
        'evaluatingMoves': 'Evaluez %s mut\u0103ri',
        'evaluatingMoves:one': 'Evaluez mutare',
        'preparingGames': 'Prepar %s PGNuri',
        'preparingGames:one': 'Prepar un PGN',
        'cannotMerge': 'Nu pot combina!\r\n(nu sunt pozi\u0163ii comune pe tabl\u0103)',
        'operationFailed': 'Opera\u0163iune e\u015Fuat\u0103!\r\n(con\u0163inut gre\u015Fit)',
        'operationCancelled': 'Opera\u0163iune anulat\u0103',
        'pastePGNs': 'trage/lipe\u015Fte PGNurile tale aici',
        'searchPattern': 'Introdu un text FEN sau PGN par\u0163ial (suport\u0103 \u00eenlocuitori *,?) sau Tag(=,*=)Valoare, "Index"=Valoare, "Invalid", "Ply"(>,=,<)Valoare, "Eval"(>,=,<)Valoare, "Clock", "Shapes"',
        'foundGames': '%s jocuri g\u0103site',
        'foundGames:one': 'Un joc g\u0103sit',
        'cutStuffPrompt': '"Tags", "Annotations", "Comments", "Result", "Ply" Valoare, "Junk", "Eval"(>,=,<)Valoare, "Eval", "Clock", "Shapes" \u00een orice combina\u0163ie (ex: eval, junk, tags, ply 10, eval<0)',
        'sendToPgnEditorText': 'Editor PGN',
        'sendToPgnEditorTitle': 'LiChess Tools - trimite la Editor PGN',
        'evaluateNeedsAnalysis': 'Evaluarea poate fi folosit\u0103 doar pe paginile de analiz\u0103 sau studiu - limitare Lichess'
      }
    }

    historyIndex = -1;
    history = null;
    setText = (control, text) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $(control).val(text);
      this.addTextToHistory(text);
    };
    addTextToHistory = (text) => {
      const lt = this.lichessTools;
      if (text?.length>10_000_000) {
        lt.global.console.warn('Text too large to add to history! (length:'+(text?.length||0)+')');
        return;
      }
      try {
        if (!this.history) this.history = [];
        if (this.history[this.historyIndex] == text) return;
        this.setHistoryIndex(this.historyIndex + 1);
        this.history[this.historyIndex] = text;
        if (this.history.length > this.historyIndex + 1) {
          this.history.splice(this.historyIndex + 1);
        }
        if (this.history.length > 10) {
          this.history.splice(0, 1);
        }
        if (this.historyIndex >= this.history.length) {
          this.historyIndex = this.history.length - 1;
        }
        lt.storage.set('LichessTools.pgnEditor.history', this.history, { session: true, zip: true });
        lt.storage.set('LichessTools.pgnEditor.historyIndex', this.historyIndex, { session: true });
      } catch(e) {
        lt.global.console.warn('Could not add text to history! (length:'+(text?.length||0)+')');
      }
    };
    setHistoryIndex = async (val) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.historyIndex = val;
      await lt.timeout(1);
      if (!this.history) this.history = [];
      const undo = val >= 0;
      $('dialog.lichessTools-pgnEditor .buttons button[data-role="undo"]')
        .toggleClass('disabled', !undo)
        .prop('disabled', !undo);
      const redo = val + 1 < this.history.length;
      $('dialog.lichessTools-pgnEditor .buttons button[data-role="redo"]')
        .toggleClass('disabled', !redo)
        .prop('disabled', !redo);
      lt.storage.set('LichessTools.pgnEditor.historyIndex', this.historyIndex, { session: true });
    };

    loadHistory = () => {
      const lt = this.lichessTools;
      this.history = lt.storage.get('LichessTools.pgnEditor.history', { session: true, zip: true }) || [];
      let index = lt.storage.get('LichessTools.pgnEditor.historyIndex', { session: true });
      if (!index && index !== 0) index = -1;
      this.setHistoryIndex(index);
    };

    mobileFirstTap = (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!lt.isMobile()) return;
      const isActive = $(el).is('.lichessTools-mobileActive');
      $('.lichessTools-mobileActive').removeClass('lichessTools-mobileActive');
      if (isActive) return false;
      $(el).addClass('lichessTools-mobileActive');
      return true;
    };

    showPgnEditor = async (showPgnText) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      $('body').toggleClassSafe('lichessTools-page',true);

      this._prevTitle ||= lt.global.document.title;
      lt.global.document.title = trans.noarg('pgnEditorTitle');

      $('dialog.lichessTools-pgnEditor').trigger('close').remove();
      const dialog = $('<dialog class="lichessTools-pgnEditor">')
        .on('close',()=>{
          lt.global.document.title = this._prevTitle;
          $('body').toggleClassSafe('lichessTools-page',false);
        })
        .append(`
    <div class="close-button-anchor">
        <a class="help-button" data-icon="${lt.icon.toEntity(lt.icon.InfoCircle)}" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#pgnEditor" target="_blank"></a>
        <button class="close-button" data-icon="${lt.icon.toEntity(lt.icon.X)}" aria-label="Close"/>
    </div>
    <div class="scrollable">
        <div class="dialog-content">
            <h2></h2>
            <div class="input-wrapper">
              <textarea autofocus spellcheck="false" autocomplete="false"></textarea>
              <div class="buttons">
                <button class="button" type="button" data-role="merge" data-icon="${lt.icon.toEntity(lt.icon.Funnel)}"><span></span></button>
                <button class="button" type="button" data-role="normalize" data-icon="${lt.icon.toEntity(lt.icon.ThumbsUp)}"><span></span></button>
                <button class="button" type="button" data-role="denormalize" data-icon="${lt.icon.toEntity(lt.icon.StarOutline)}"><span></span></button>
                <button class="button" type="button" data-role="split" data-icon="${lt.icon.toEntity(lt.icon.ShareAndroid)}"><span></span></button>
                <button class="button" type="button" data-role="search" data-icon="${lt.icon.toEntity(lt.icon.ZoomIn)}"><span></span></button>
                <button class="button" type="button" data-role="keepFound" data-icon="${lt.icon.toEntity(lt.icon.Target)}"><span></span></button>
                <button class="button" type="button" data-role="cutStuff" data-icon="${lt.icon.toEntity(lt.icon.BlackScissors)}"><span></span></button>
                <button class="button" type="button" data-role="evaluate" data-icon="${lt.icon.toEntity(lt.icon.LineGraph)}"><span></span></button>
                <button class="button" type="button" data-role="extract" data-icon="${lt.icon.toEntity(lt.icon.List)}"><span></span></button>
                <button class="button" type="button" data-role="count" data-icon="${lt.icon.toEntity(lt.icon.BarChart)}"><span></span></button>
                <button class="button" type="button" data-role="cancel" data-icon="${lt.icon.toEntity(lt.icon.Cancel)}"><span></span></button>
                <hr></hr>
                <button class="button" type="button" data-role="copy" data-icon="${lt.icon.toEntity(lt.icon.Clipboard)}"><span></span></button>
                <button class="button" type="button" data-role="upload" data-icon="${lt.icon.toEntity(lt.icon.InternalArrow)}"><span></span></button>
                <button class="button" type="button" data-role="download" data-icon="${lt.icon.toEntity(lt.icon.ExternalArrow)}"><span></span></button>
                <button class="button" type="button" data-role="undo" data-icon="${lt.icon.toEntity(lt.icon.Back)}"><span></span></button>
                <button class="button" type="button" data-role="redo" data-icon="${lt.icon.toEntity(lt.icon.Forward)}"><span></span></button>
                <button class="button" type="button" data-role="clear" data-icon="${lt.icon.toEntity(lt.icon.X)}"><span></span></button>
                <label></label>
              </div>
            </div>
        </div>
    </div>
`)
        .appendTo('body');

      $('div.dialog-content>h2').text(trans.noarg('pgnEditorText'));
      const textarea = $('textarea', dialog)
        .attr('placeholder', trans.noarg('pastePGNs'))
        .on('drop', ev => {
          ev.preventDefault();
          const file = ev.dataTransfer.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.setText(textarea, e.target.result);
            this.countPgn();
          };
          reader.readAsText(file, "UTF-8");
        })
        .on('paste', ev => {
          const text = ev.clipboardData.getData('text');
          if (!text?.trim()) return;
          const translatedText = this.translateToPgn(text);
          if (translatedText != text) {
            ev.preventDefault();
            textarea.insertText(translatedText);
            return;
          }
        })
        .on('change', ev => {
          this.addTextToHistory(textarea.val());
          this.writeNote('');
        })
        .on('keyup', ev => {
          if (ev.ctrlKey && ev.key == 'z') {
            ev.preventDefault();
            this.undo(textarea);
          }
          if (ev.ctrlKey && ev.key == 'y') {
            ev.preventDefault();
            this.redo(textarea);
          }
          this.writeNote('');
        })
        .on('focus', ev=> {
          $('.lichessTools-mobileActive').removeClass('lichessTools-mobileActive');
        });
      $('[data-role="merge"]', dialog)
        .attr('title', trans.noarg('btnMergeTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('merge', () => this.mergePgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnMergeText'));
      $('[data-role="normalize"]', dialog)
        .attr('title', trans.noarg('btnNormalizeTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('normalize', () => this.normalizePgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnNormalizeText'));
      $('[data-role="denormalize"]', dialog)
        .attr('title', trans.noarg('btnDenormalizeTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('denormalize', () => this.denormalizePgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnDenormalizeText'));
      $('[data-role="split"]', dialog)
        .attr('title', trans.noarg('btnSplitTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('split', () => this.splitPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnSplitText'));
      $('[data-role="search"]', dialog)
        .attr('title', trans.noarg('btnSearchTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('search', () => this.searchPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnSearchText'));
      $('[data-role="keepFound"]', dialog)
        .attr('title', trans.noarg('btnKeepFoundTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('keepFound', () => this.keepFound(textarea));
        })
        .find('span')
        .text(trans.noarg('btnKeepFoundText'));
      $('[data-role="cutStuff"]', dialog)
        .attr('title', trans.noarg('btnCutStuffTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('cutStuff', () => this.cutStuff(textarea));
        })
        .find('span')
        .text(trans.noarg('btnCutStuffText'));
      $('[data-role="count"]', dialog)
        .attr('title', trans.noarg('btnCountTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('count', () => this.countPgn(textarea));
        })
        .find('span')
        .text(trans.noarg('btnCountText'));
      $('[data-role="evaluate"]', dialog)
        .attr('title', trans.noarg('btnEvaluateTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('evaluate', () => this.evaluatePosition(textarea));
        })
        .find('span')
        .text(trans.noarg('btnEvaluateText'));
      $('[data-role="extract"]', dialog)
        .attr('title', trans.noarg('btnExtractTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('extract', () => this.extract(textarea));
        })
        .find('span')
        .text(trans.noarg('btnExtractText'));
      $('[data-role="cancel"]', dialog)
        .attr('title', trans.noarg('btnCancelTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.stopOperations();
        })
        .find('span')
        .text(trans.noarg('btnCancelText'));
      $('[data-role="copy"]', dialog)
        .attr('title', trans.noarg('btnCopyTitle'))
        .on('click', async ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('copy', async () => {
            const text = textarea.val();
            if (!text) return;
            await lt.writeToClipboard(text, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
          });
        })
        .find('span')
        .text(trans.noarg('btnCopyText'));
      $('[data-role="upload"]', dialog)
        .attr('title', trans.noarg('btnUploadTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          $('<input type="file">')
            .on('change', async e => {
              if (this._runningOperation) return;
              const name = 'upload';
              const now = Date.now();
              try {
                const file = e.target.files[0];
                if (!file) return;
                this._cancelRequested = false;
                this._runningOperation = name;
                this.toggleCancel(true);
                await lt.timeout(0);
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (this._cancelRequested) {
                    this._cancelRequested = false;
                    this.writeNote(trans.noarg('operationCancelled'));
                  }
                  this.setText(textarea, e.target.result);
                  this._runningOperation = null;
                  this.toggleCancel(false);
                  lt.global.console.debug('Operation ' + name + ' took ' + ((Date.now() - now) / 1000).toFixed(1) + ' seconds');
                  this.countPgn();
                };
                reader.readAsText(file, "UTF-8");
              } catch (ex) {
                if (this._cancelRequested) {
                  this._cancelRequested = false;
                  this.writeNote(trans.noarg('operationCancelled'));
                }
                this._runningOperation = null;
                this.toggleCancel(false);
                throw ex;
              }
            })
            .trigger('click');
        })
        .find('span')
        .text(trans.noarg('btnUploadText'));
      $('[data-role="download"]', dialog)
        .attr('title', trans.noarg('btnDownloadTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          const text = textarea.val();
          if (!text) return;
          this.runOperation('download', () => {
            lt.download(text,'pgnEditor_' + lt.toTimeString(new Date()) + '.pgn','application/x-chess-pgn');
          });
        })
        .find('span')
        .text(trans.noarg('btnDownloadText'));
      $('[data-role="undo"]', dialog)
        .attr('title', trans.noarg('btnUndoTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('undo', () => this.undo(textarea));
        })
        .find('span')
        .text(trans.noarg('btnUndoText'));
      $('[data-role="redo"]', dialog)
        .attr('title', trans.noarg('btnRedoTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('redo', () => this.redo(textarea));
        })
        .find('span')
        .text(trans.noarg('btnRedoText'));
      $('[data-role="clear"]', dialog)
        .attr('title', trans.noarg('btnClearTitle'))
        .on('click', ev => {
          ev.preventDefault();
          if (this.mobileFirstTap(ev.currentTarget)) return;
          this.runOperation('clear', () => this.clear(textarea));
        })
        .find('span')
        .text(trans.noarg('btnClearText'));
      $('button.close-button', dialog)
        .on('click', ev => {
          ev.preventDefault();
          this.stopOperations();
          dialog.trigger('close').remove();
          if (lt.global.location.hash = '#pgnEditor') {
            lt.global.history.pushState(null, null, ' ');
          }
        });
      this._label = $('dialog.lichessTools-pgnEditor .buttons label');
      this.toggleCancel(false);
      if (lt.global.location.hash != '#pgnEditor') {
        lt.global.history.pushState(null, null, '#pgnEditor');
      }
      if (!this.history) {
        await lt.timeout(1);
        this.loadHistory();
      }
      if (showPgnText) {
        this.addTextToHistory(showPgnText);
      }
      if (!lichess.analysis) {
        lt.global.location.href = '/analysis#pgnEditor';
        return;
      }
      const text = this.history[this.historyIndex] || '';
      $(textarea).val(text);
      this.setHistoryIndex(this.historyIndex);
    };

    getWriter = ()=>{
      const lt = this.lichessTools;
      const arr = [];
      arr.write = (text, condition)=> {
        if (condition === undefined || condition) arr.push(text||'');
        return arr;
      }
      arr.writeTags = (studyName, chapterName, fen, userId)=>{
        arr
          .write(`[Event "${studyName}: ${chapterName}"]`)
          .write(`[StudyName "${studyName}"]`)
          .write(`[ChapterName "${chapterName}"]`)
          .write(`[Annotator "https://lichess.org/@/${userId}"]`, !!userId)
          .write(`[FEN "${fen}"]`, fen && !lt.isStartFen(fen))
          .write('');
        return arr;
      };
      arr.append = (text) => {
        if (!arr.length) arr.push('');
        arr[arr.length-1]+=text;
        return arr;
      };
      arr.appendComment = (text) => {
        return arr.append(`{ ${text} } `);
      };
      arr.toString = ()=>arr.join('\r\n');
      return arr;
    };

    translateToPgn = (text)=>{
      if (!text) return text;
      const lt = this.lichessTools;
      let json = '';
      try {
        json = lt.global.JSON.parse(text);
      } catch(e) {
        return text;
      }
      if (json.book?.pgn_games) {
        const book = json.book;
        return this.translateChessMind(book);
      }
      if (json.list?.format == 'getList') {
        const list = json.list;
        return this.translateChessableList(list);
      }
      if (json.lesson.chapter) {
        const lesson = json.lesson;
        return this.translateChessableLesson(lesson);
      }
      return text;
    };

    translateChessableList = (list) =>{
      const lt = this.lichessTools;
      const userId = lt.getUserId();
      const arr = this.getWriter();

      const courseId = list.data?.[0]?.bid;
      arr
        .writeTags(list.name, 'Intro', '', userId)
        .write(`{ Study made from the Chessable lesson '${list.name}'
https://www.chessable.com/course/${courseId}/ } *`)
        .write('');

      arr.write('');
      for (const game of list.data) {
        const fen = game.initialFEN;
        arr
          .writeTags(list.name, game.name, fen, userId)
        for (const move of game.moves) {
          arr.append(`${move.san} `);
        }
        arr
          .append(' *')
          .write('');
      }
      return arr.toString();
    };

    translateChessableLesson = (lesson) =>{
      const lt = this.lichessTools;
      const userId = lt.getUserId();
      const arr = this.getWriter();

      const fen = lesson.moves?.[0].move_fen;
      const studyName = lesson.books[Object.keys(lesson.books)[0]].name;
      const chapterName = lesson.chapter.title;
      arr
        .writeTags(studyName, chapterName, fen, userId);
      let index = 0;
      arr
        .write('');
      for (const move of lesson.moves) {
        index++;
        const beforeComment = move.comment_before_white || move.comment_before_black;
        if (beforeComment) {
          const data = lt.global.JSON.parse(beforeComment);
          const comment = data.data?.find(i=>i.key=='C')?.val;
          if (comment) {
            arr.appendComment(lt.htmlDecode(`${comment.replaceAll(/@@[^@]+@@/g,'').trim()}`));
          }
        }
        const isBlack = !!move.move_black;
        const moveText = move.move_white || move.move_black;
        arr.append(`${index}${isBlack?'...':'.'}${moveText} `);
        const afterComment = move.comment_white || move.comment_black;
        if (afterComment) {
          const data = lt.global.JSON.parse(afterComment);
          const comment = data.data?.find(i=>i.key=='C')?.val;
          if (comment) {
            arr.appendComment(lt.htmlDecode(`${comment.replaceAll(/@@[^@]+@@/g,'').trim()}`));
          }
        }
      }
      arr
        .append(' *')
        .write('');
      // TODO arrows and squares
      return arr.toString();
    };

    translateChessMind = (book) =>{
      const lt = this.lichessTools;
      const userId = lt.getUserId();
      const arr = this.getWriter();

      arr
        .writeTags(book.title, 'Intro', '', userId);
      let index = 0;
      for (const game of book.pgn_games) {
        index++;
        const fen = game.pgn_json.headers.Fen;
        arr
          .writeTags(book.title, `Lesson ${index}`, fen, userId)
        arr.write('');
        if (game.pgn_json.headers.Comment) {
          const comment = $(game.pgn_json.headers.Comment).text();
          if (comment?.trim()) {
            arr.appendComment(`${comment.replaceAll('#NEW_FEN#','').trim()}`);
          }
        }
        for (const move of game.pgn_json.pgn) {
          arr.append(`${move.printable_move} `);
          if (move.comment) {
            const comment = $(move.comment).text();
            if (comment?.trim()) {
              arr.appendComment(`${comment.replaceAll('#NEW_FEN#','').trim()}`);
            }
          }
        }
        arr
          .append(' *')
          .write('');
      }
      return arr.toString();
    };

    stopOperations = () => {
      if (!this._runningOperation) return;
      this._cancelRequested = true;
    }

    runOperation = async (name, operation) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      if (this._runningOperation) return;
      const now = Date.now();
      try {
        this._cancelRequested = false;
        this._runningOperation = name;
        this.toggleCancel(true);
        await lt.timeout(0);
        await operation();
      } finally {
        if (this._cancelRequested) {
          this._cancelRequested = false;
          this.writeNote(trans.noarg('operationCancelled'));
        }
        this._runningOperation = null;
        this.toggleCancel(false);
        lt.global.console.debug('Operation ' + name + ' took ' + ((Date.now() - now) / 1000).toFixed(1) + ' seconds');
      }
    };

    toggleCancel = (value) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('dialog.lichessTools-pgnEditor button:not([data-role="cancel"])')
        .toggleClass('disabled', !!value)
        .prop('disabled', !!value);
      $('dialog.lichessTools-pgnEditor button[data-role="cancel"]')
        .toggleClass('disabled', !value)
        .prop('disabled', !value);
    };

    writeNote = (text) => {
      if (!this._label) return;
      this._label.text(text);
    };

    countPgn = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const text = $('dialog.lichessTools-pgnEditor textarea').val();
      const co = lt.chessops;
      const games = co.pgn.parsePgn(text).filter(g => g.headers.get('FEN') || g.moves?.children?.length);
      this.writeNote(trans.pluralSame('gameCount', games.length).replace(/%2/g, '...'));
      let moveCount = 0;
      const traverse = (node) => {
        if (node.data?.san) moveCount++;
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child);
        }
      };
      for (const game of games) {
        traverse(game.moves);
      }
      this.writeNote(trans.pluralSame('gameCount', games.length).replace(/%2/g, moveCount));
    };

    enhanceGameWithFens = game => {
      const lt = this.lichessTools;

      const co = lt.chessops;
      const { startingPosition } = co.pgn;
      const { makeFen } = co.fen;
      const { parseSan, makeSanAndPlay } = co.san;

      let pos = null;
      try {
        pos = startingPosition(game.headers).unwrap();
      } catch (e) {
        e.san = 'Starting position';
        e.ply = 0;
        throw e;
      }

      game.lastMoves = [];
      const traverse = (pos, node, ply = 0) => {
        const fen = makeFen(pos.toSetup());
        node.data = { ...node.data, fen: fen };
        if (!node.children?.length) {
          game.lastMoves.push(node);
          return;
        }
        for (const child of node.children) {
          child.lt = node;
          const newPos = pos.clone();
          const move = parseSan(newPos, child.data.san);
          if (!move) {
            const err = new Error('Move ' + child?.data?.san + ' at ply ' + ply + ' is illegal!');
            err.san = child?.data?.san;
            err.ply = ply + 1;
            throw err;
          }
          const san = makeSanAndPlay(newPos, move);
          traverse(newPos, child, ply + 1);
        }
      };

      const node = game.moves;
      traverse(pos, node);
    };

    enhanceGameWithFenDict = game => {
      const lt = this.lichessTools;

      game.fenDict = new Map();

      const traverse = (node, ply = 0) => {
        const fen = node.data?.fen;
        if (!fen) {
          const err = Error('Cannot find FEN for node ' + node.data?.san + ' at ply ' + ply + '!');
          err.san = node?.data?.san;
          err.ply = ply + 1;
          throw err;
        }
        const key = lt.getFenPosition(fen);
        let arr = game.fenDict.get(key);
        if (!arr) {
          arr = [];
          game.fenDict.set(key, arr);
        }
        arr.push(node);
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };

      const node = game.moves;
      traverse(node);
    };


    mergeNodes = (n1, n2) => {
      n1.children = [...n1.children, ...n2.children];
      const comments = [...new Set((n1.data?.comments || []).concat((n2.data?.comments || [])))];
      if (comments.length) {
        n1.data.comments = [...new Set(comments)];
      }
      const nags = (n1.data?.nags || []).concat((n2.data?.nags || []));
      if (nags.length) {
        n1.data.nags = [...new Set(nags)];
      }
    };

    cleanGame = game => {
      const lt = this.lichessTools;
      const traverse = (game, node) => {
        if (!node.children?.length) return;
        for (let i = 0; i < node.children.length; i++) {
          let j = i + 1;
          while (j < node.children.length) {
            const childI = node.children[i];
            const childJ = node.children[j];
            if (childI.data.san == childJ.data.san) {
              this.mergeNodes(childI, childJ);
              if (game.fenDict) {
                const key = lt.getFenPosition(childJ.data.fen);
                lt.arrayRemoveAll(game.fenDict[key], n => n == childJ);
              }
              lt.arrayRemoveAll(node.children, n => n == childJ);
            } else j++;
          }
        };
        for (const child of node.children) {
          traverse(game, child);
        }
      };

      traverse(game, game.moves);
    };

    mergePgn = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      const games = parsePgn(text);
      this.writeNote(trans.pluralSame('mergingGames', games.length));
      await lt.timeout(0);
      let withErrors = false;
      let gameIndex = 0;
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const mergeGames = (dest, node, src) => {
        const comments = [... new Set((dest.comments||[]).concat(src.comments||[]))];
        if (comments.length) {
          dest.comments = comments;
        }
        node.children = [...node.children, ...src.moves.children];
        if (dest.fenDict || src.fenDict) {
          if (!dest.fenDict || !src.fenDict) throw new Error('Cannot merge games that have different enhancement (fenDict)');
          for (const pair of src.fenDict) {
            const newArr = (dest.fenDict.get(pair[0]) || []).concat(pair[1]);
            dest.fenDict.set(pair[0], newArr);
          }
        }
      };

      const initialNumberOfGames = games.length;
      let i = games.length - 1;
      let lastWrite = Date.now();
      while (i >= 0 && !this._cancelRequested) {
        if (Date.now() - lastWrite > 1000) {
          this.writeNote(trans.pluralSame('mergingGames', games.length));
          lastWrite = Date.now();
          await lt.timeout(0);
        }
        const gameI = games[i];
        const fenI = gameI?.moves?.data?.fen;
        for (let j = i - 1; j >= 0; j--) {
          const gameJ = games[j];
          const fenJ = gameJ?.moves?.data?.fen;
          if (fenI && fenI == fenJ) {
            mergeGames(gameJ, gameJ.moves, gameI);
            lt.arrayRemoveAll(games, g => g == gameI);
            break;
          }
        }
        i--;
      }
      for (const game of games) {
        try {
          this.enhanceGameWithFenDict(game);
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      i = games.length - 1;
      while (i >= 0 && !this._cancelRequested) {
        if (Date.now() - lastWrite > 1000) {
          this.writeNote(trans.pluralSame('mergingGames', games.length));
          lastWrite = Date.now();
          await lt.timeout(0);
        }
        let merged = false;
        const gameI = games[i];
        const keyI = lt.getFenPosition(gameI.moves.data.fen);
        for (let j = i - 1; j >= 0; j--) {
          const gameJ = games[j];
          const nodes = gameJ.fenDict.get(keyI);
          if (nodes) {
            mergeGames(gameJ, nodes[0], gameI);
            lt.arrayRemoveAll(games, g => g == gameI);
            merged = true;
            break;
          }
        }
        if (!merged) {
          for (let j = i - 1; j >= 0; j--) {
            const gameJ = games[j];
            const keyJ = lt.getFenPosition(gameJ.moves.data.fen);
            const nodes = gameI.fenDict.get(keyJ);
            if (nodes) {
              mergeGames(gameI, nodes[0], gameJ);
              lt.arrayRemoveAll(games, g => g == gameJ);
              merged = true;
              break;
            }
          }
        }
        i--;
      }
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        if (!game.fenDict) {
          throw new Error('Something went wrong! game doesn\'t have fenDict!');
        }
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      if (games.length < initialNumberOfGames) {
        this.countPgn();
      } else {
        this.writeNote(trans.noarg('cannotMerge'));
      }
    };

    evaluatePosition = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      if (!lichess.analysis) {
        lt.announce(trans.noarg('evaluateNeedsAnalysis'));
        return;
      }

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      const games = parsePgn(text);
      this.writeNote(trans.pluralSame('evaluatingGames', games.length));
      await lt.timeout(0);

      const depth = +(lt.currentOptions.getValue('customEngineLevel')) || 20;
      console.debug('Evaluating with level ', depth);
      const decimals = lt.currentOptions.getValue('cevalDecimals') ? 2 : 1;

      let info = null;
      let lastInfo = null;

      const sf = await lt.stockfish.load();
      if (!sf) throw new Error('Could not load Stockfish!');
      sf.setMultiPv(1);
      sf.setDepth(depth);
      sf.on('info', i => { 
          if (i.cp === undefined && i.mate === undefined) return;
          lastInfo = i;
        });
      sf.on('bestmove', i => { info = lastInfo; });

      let gameIndex = 0;
      let withErrors = false;
      let totalMoves = 0;
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
          totalMoves += game.lastMoves?.length || 0;
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
        this.writeNote(trans.pluralSame('preparingGames', games.length - gameIndex));
        await lt.timeout(0);
        if (this._cancelRequested) {
          break;
        }
      }
      if (!withErrors) {
        for (const game of games) {
          for (const node of game.lastMoves) {
            totalMoves--;
            if (node.data?.san?.endsWith('#')) continue;
            const comments = node.data.comments || [];
            if (comments.find(c => /^eval: /.test(c))) continue;
            lastInfo = null;
            info = null;
            sf.setPosition(node.data.fen);
            sf.start();
            while (!info && !this._cancelRequested) {
              await lt.timeout(100);
            }
            if (this._cancelRequested) {
              break;
            }
            await sf.stop();
            const side = node.data.fen.split(' ')[1] == 'b' ? -1 : 1;
            const evalText = "eval: " + (info.mate!==undefined ? '#' + (side * info.mate) : ((side * info.cp) > 0 ? '+' : '') + (side * info.cp / 100).toFixed(decimals));
            node.data.comments = [...comments, evalText];
            this.writeNote(trans.pluralSame('evaluatingMoves', totalMoves));
            await lt.timeout(0);
          }
          this.writeNote(trans.pluralSame('evaluatingMoves', totalMoves));
          await lt.timeout(0);
          if (this._cancelRequested) {
            break;
          }
        }
      }
      sf.destroy();

      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    extract = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const text = await lt.uiApi.dialog.prompt(trans.noarg('extractPrompt'));
      if (/\bfen\b/i.test(text)) {
        await this.extractFen(textarea);
      }
    };

    extractFen = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      const games = parsePgn(text);
      this.writeNote(trans.pluralSame('extractingFens', games.length));
      await lt.timeout(0);
      let withErrors = false;
      let gameIndex = 0;
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const fenSet = new Set();
      const traverse = (node, ply = 0) => {
        const fen = node.data?.fen;
        if (!fen) {
          const err = Error('Cannot find FEN for node ' + node.data?.san + ' at ply ' + ply + '!');
          err.san = node?.data?.san;
          err.ply = ply + 1;
          throw err;
        }
        fenSet.add(fen);
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };

      let fenText = '';
      gameIndex = 0;
      for (const game of games) {
        gameIndex++;
        fenSet.clear();
        const node = game.moves;
        traverse(node);

        fenText += gameIndex + '\r\n' + [...fenSet].join('\r\n') + '\r\n\r\n';
      }
      lt.download(fenText,'pgnEditor_fens_' + lt.toTimeString(new Date()) + '.txt');
    };

    normalizePgn = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      const games = parsePgn(text);
      this.writeNote(trans.pluralSame('normalizingGames', games.length));
      await lt.timeout(0);
      let withErrors = false;
      let gameIndex = 0;
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
          this.enhanceGameWithFenDict(game);
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const findDescendant = (node, predicate) => {
        if (predicate(node)) return node;
        for (const child of node.children) {
          const result = findDescendant(child, predicate);
          if (result) return result;
        }
      };

      const onSameBranch = (n1, n2) => {
        if (findDescendant(n1, n => n == n2)) return true;
        if (findDescendant(n2, n => n == n1)) return true;
        return false;
      };

      let i = games.length - 1;
      let lastWrite = Date.now();
      while (i >= 0 && !this._cancelRequested) {
        if (Date.now() - lastWrite > 1000) {
          this.writeNote(trans.pluralSame('normalizingGames', games.length));
          lastWrite = Date.now();
          await lt.timeout(0);
        }
        const game = games[i];
        for (const pair of game.fenDict) {
          const key = pair[0];
          const nodes = pair[1];
          if (nodes.length == 1) continue;
          for (let i = 1; i < nodes.length; i++) {
            for (let j = 0; j < i; j++) {
              if (!nodes[j].children.length) continue;
              if (onSameBranch(nodes[i], nodes[j])) continue;
              this.mergeNodes(nodes[j], nodes[i]);
              nodes[i].children = [];
            }
          }
        }
        i--;
      }
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    denormalizePgn = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      const games = parsePgn(text);
      this.writeNote(trans.pluralSame('denormalizingGames', games.length));
      await lt.timeout(0);
      let withErrors = false;
      let gameIndex = 0;
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        gameIndex++;
        try {
          this.enhanceGameWithFens(game);
          this.enhanceGameWithFenDict(game);
        } catch (ex) {
          withErrors = true;
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }
      if (withErrors) {
        this.writeNote(trans.noarg('operationFailed'));
        return;
      }

      const circular = (n1, n2) => {
        const pos = lt.getFenPosition(n2.data.fen);
        let node = n1;
        while (node) {
          if (lt.getFenPosition(node.data.fen) == pos) return true;
          node = node.parent;
        }
        return false;
      };

      const clone = (node) => {
        const result = {
          ...node,
          children: node.children.map(clone)
        };
        return result;
      };

      let i = games.length - 1;
      let lastWrite = Date.now();
      while (i >= 0 && !this._cancelRequested) {
        if (Date.now() - lastWrite > 1000) {
          this.writeNote(trans.pluralSame('denormalizingGames', games.length));
          lastWrite = Date.now();
          await lt.timeout(0);
        }
        const game = games[i];
        for (const pair of game.fenDict) {
          const key = pair[0];
          const nodes = pair[1];
          if (nodes.length == 1) continue;
          for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];
            const dests = nodes.filter((n, j) => i != j).map(n => n.children).flat();
            for (let j = 0; j < dests.length; j++) {
              const n2 = dests[j];
              if (n1.children.find(c => c.data.san == n2.data.san)) continue;
              if (circular(n1, n2)) continue;
              const newNode = clone(n2);
              n1.children.push(newNode);
              newNode.lt = n1;
              const key2 = lt.getFenPosition(newNode.data.fen);
              const arr = game.fenDict.get(key2);
              arr.push(newNode);
            }
          }
        }
        i--;
      }
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    splitPgn = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('splittingGames', games.length));
      await lt.timeout(0);

      const newGames = [];
      const traverse = (game, node, arr) => {
        arr.push(node);
        if (this._cancelRequested) {
          return;
        }
        if (!node.children?.length) {
          let curr = { ...arr[0], children: [] };
          const newGame = { ...game, moves: curr };
          for (const node of arr.slice(1)) {
            const newNode = { ...node, children: [] };
            curr.children.push(newNode);
            curr = newNode;
          }
          newGames.push(newGame);
          return;
        }
        for (const child of node.children) {
          traverse(game, child, [...arr]);
        }
      }

      while (games.length && !this._cancelRequested) {
        const game = games[0];
        traverse(game, game.moves, []);
        games.splice(0, 1);
        this.writeNote(trans.pluralSame('splittingGames', (newGames.length + games.length)));
        await lt.timeout(0);
      }
      games = newGames;
      if (this._cancelRequested) {
        return;
      }

      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutStuff = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      let text = await lt.uiApi.dialog.prompt(trans.noarg('cutStuffPrompt'));
      if (/junk/i.test(text)) {
        await this.cutJunk(textarea);
      }
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
      let m = /(?:^(\d+)$|ply\s*(\d+))/i.exec(text);
      if (m) {
        const ply = +(m[1] || m[2]);
        await this.cutPly(textarea, ply);
      }
      m = /eval\s*(?<op>[\<\>=])\s*(?<val>[\-\+]?\d+(?:\.\d+)?)/i.exec(text);
      if (m) {
        const operator = m.groups.op;
        const value = +m.groups.val;
        await this.cutEval(textarea, operator, value);
        text = text.substr(0,m.index)+text.substr(m.index+m[0].length);
      }
      const cutClock = /clock/i.test(text);
      const cutEval = /eval/i.test(text);
      const cutShapes = /shapes/i.test(text);
      if (cutClock || cutEval || cutShapes) {
        await this.cutMeta(textarea, cutClock, cutEval, cutShapes);
      }
    };

    cutFound = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames', games.length));
      await lt.timeout(0);

      lt.arrayRemoveAll(games, g => g.headers.has('Found'));

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutMeta = async (textarea, cutClock, cutEval, cutShapes) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);

      for (const game of games) {
        this.cutMetaFromGame(game, cutClock, cutEval, cutShapes);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutMetaFromGame = (game, cutClock, cutEval, cutShapes) => {
      const lt = this.lichessTools;

      const cleanComments = (comments) => {
        const arr = [];
        if (cutClock) {
          arr.push('clk');
          arr.push('emt');
        }
        if (cutEval) arr.push('eval');
        if (cutShapes) {
          arr.push('csl');
          arr.push('cal');
        }
        const pattern = '\\[%(?:'+arr.join('|')+')[^\\]]+\\]';
        for (let i=0; i<comments.length; i++) {
          const comment = comments[i];
          const reg = new RegExp(pattern,'gi');
          comments[i] = comment.replace(reg,'');
        }
        lt.arrayRemoveAll(comments, c=>!c?.trim());
      };

      const traverse = (node, ply = 0) => {
        if (node.data?.comments?.length) {
          cleanComments(node.data.comments);
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };
      if (game.comments?.length) {
        cleanComments(game.comments);
      }
      traverse(game.moves);
    };

    cutJunk = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const text = textarea.val();
      const reg = /(\[\w+\s+\".*?\"\][\s\r\n]*)*({.*?}[\s\r\n]*)?\d{1,3}\s*\.\s*(\.\.)?(((?:[NBKRQ]?[a-h]?[1-8]?[-x]?[a-h][1-8](?:=?[nbrqkNBRQK])?|[pnbrqkPNBRQK]?@[a-h][1-8]|O-O-O|0-0-0|O-O|0-0)[+#]?|--|Z0|0000|@@@@|\d{1,3}\s*\.\s*(\.\.)?|{.*?}|;|\$\d{1,4}|[?!]{1,2}|\(|\)|\*|1-0|0-1|1\/2-1\/2)[\s\r\n]*)+/g;
      const pgns = [];
      let match = reg.exec(text);
      while (match) {
        pgns.push(match[0]);
        match = reg.exec(text)
      }
      this.setText(textarea, pgns.join('\r\n\r\n'));

      this.countPgn();
    };

    cutTags = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);

      for (const game of games) {
        const keys = game.headers.keys().filter(k => !['FEN', 'SetUp'].includes(k));
        for (const key of keys) game.headers.delete(key);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutCommentsFromGame = (game) => {
      const traverse = (node, ply = 0) => {
        if (node.data?.comments?.length) {
          node.data.comments.length = 0;
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };
      if (game.comments) {
        game.comments.length = 0;
      }
      traverse(game.moves);
    };

    cutComments = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);


      for (const game of games) {
        this.cutCommentsFromGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutAnnotationsFromGame = (game) => {
      const traverse = (node, ply = 0) => {
        if (node.data?.nags?.length) {
          node.data.nags.length = 0;
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };
      traverse(game.moves);
    };

    cutAnnotations = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);

      const traverse = (node, ply = 0) => {
        if (node.data?.nags?.length) {
          node.data.nags.length = 0;
        }
        if (!node.children?.length) return;
        for (const child of node.children) {
          traverse(child, ply + 1);
        }
      };

      for (const game of games) {
        this.cutAnnotationsFromGame(game);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    cutPly = async (textarea, plyNumber) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      if (!plyNumber && plyNumber !== 0) return;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);

      const traverse = (game, node, ply = 0, mainline = true) => {
        if (!node.children?.length) return;
        if (ply >= plyNumber) {
          node.children = [];
          if (mainline) game.headers.delete('Result');
          return;
        }
        for (const child of node.children) {
          traverse(game, child, ply + 1, mainline);
          mainline = false;
        }
      };

      for (const game of games) {
        traverse(game, game.moves);
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };


    cutEval = async (textarea, operator, value) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      if (!operator || Number.isNaN(value)) return;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);

      let removals;
      const traverse = (node, lastBranch = null, san = null) => {
        if (!lastBranch || node.children?.length > 1) {
          lastBranch = node;
          san = null;
        } else if (!san) {
          san = node.data?.san;
        }
        if (!node.children?.length) {
          if (!node.data?.san) return;
          const comments = node.data?.comments || [];
          const match = comments.map(c => /(?:\beval:|%eval) (?:#(?<mate>[\-\+]?\d+)|(?<cp>[\-\+]?\d+(?:\.\d+)?))/.exec(c)).find(m => !!m);
          if (!match) return;
          const evl = lt.getCentipawns(match.groups);
          let toRemove = false;
          switch (operator) {
            case '>':
              toRemove = evl > value;
              break;
            case '<':
              toRemove = evl < value;
              break;
            case '=':
              toRemove = evl == value;
              break;
          }
          if (toRemove) {
            let list = removals.get(lastBranch);
            if (!list) {
              list = [];
              removals.set(lastBranch, list);
            }
            list.push(san);
          }
          return;
        }
        for (const child of node.children) {
          traverse(child, lastBranch, san);
        }
      };

      for (const game of games) {
        removals = new Map();
        traverse(game.moves);
        for (const node of removals.keys()) {
          const list = removals.get(node);
          for (const san of list) {
            if (!san) {
              node.children = [];
              node.comments = null;
            } else {
              const index = node.children?.findIndex(c => c.data?.san == san);
              if (index < 0) throw new Error('This should not happen. San ' + san + ' not found in node ' + node.path);
              node.children.splice(index, 1);
            }
          }
        }
      }
      games = games.filter(g => g.moves.children.length);

      this.writeGames(textarea, games);

      this.countPgn();
    };

    searchPgn = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const search = await lt.uiApi.dialog.prompt(trans.noarg('searchPattern'));
      if (!search) return;
      let searchMode = 'fenOrMoves';
      let plyNumberOperator;
      let plyNumber;
      let tagName;
      let tagOperator;
      let tagValue;
      let evalOperator;
      let evalNumber;
      let reg;
      let m = /^ply\s*([\<\>=])\s*(\d+)/i.exec(search);
      if (m) {
        searchMode = 'plyNumber';
        plyNumberOperator = m[1];
        plyNumber = +m[2];
      } else {
        m = /^eval\s*(?<operator>[\<\>=])\s*(?<value>[\-\+]?\d+(?:\.\d+)?)/i.exec(search);
        if (m) {
          searchMode = 'eval';
          evalOperator = m.groups.operator;
          evalNumber = +m.groups.value;
        } else {
          if (/^invalid[s]?$/i.test(search)) {
            searchMode = 'invalid';
          } else
          if (/^clock[s]?$/i.test(search)) {
            searchMode = 'clock';
          } else
          if (/^shapes[s]?$/i.test(search)) {
            searchMode = 'shapes';
          } else {
            m = /^\s*(?<tag>\w+)\s*(?<operator>=|\*=)\s*["]?(?<value>.*?)["]?$/.exec(search);
            if (m) {
              searchMode = 'tag';
              tagOperator = m.groups.operator;
              tagName = m.groups.tag;
              tagValue = m.groups.value;
            } else {
              reg = new RegExp(Array.from(search.replaceAll(/\s+/g,'')).map(c => {
                switch (c) {
                  case '*': return '.*';
                  case '?': return '.';
                  default: return c.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
                }
              }).join(''));
            }
          }
        }
      }

      const co = lt.chessops;
      const { parsePgn, makePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames', games.length));
      await lt.timeout(0);

      const getMaxPly = (game) => {
        let maxPly = 0;
        const traverse = (node, ply = 0) => {
          if (node.data?.san && ply > maxPly) maxPly = ply;
          if (!node.children?.length) return;
          for (const child of node.children) {
            traverse(child, ply + 1);
          }
        };
        traverse(game.moves);
        return maxPly;
      };

      const isGameEval = (game, operator, value) => {
        let found = false;
        const traverse = (node, ply = 0) => {
          if (found) return;
          if (!node.children?.length) {
            const comments = node.data?.comments || [];
            const match = comments.map(c => /(?:\beval:|%eval) (?:#(?<mate>[\-\+]?\d+)|(?<cp>[\-\+]?\d+(?:\.\d+)?))/.exec(c)).find(m => !!m);
            if (!match) return;
            const evl = lt.getCentipawns(match.groups);
            switch (operator) {
              case '>':
                found = evl > value;
                break;
              case '<':
                found = evl < value;
                break;
              case '=':
                found = evl == value;
                break;
            }
            return;
          }
          for (const child of node.children) {
            traverse(child, ply + 1);
          }
        };
        traverse(game.moves);
        return found;
      };

      const hasGameClock = (game) => {
        let found = false;

        const haveClock = comments=>{
          return (comments||[]).find(c=>/\[%(?:clk|emt)[^\]]+\]/i.test(c));
        };

        if (haveClock(game.comments)) return true;
        const traverse = (node) => {
          if (found) return;
          if (haveClock(node.data?.comments)) {
            found = true;
            return;
          }
          for (const child of node.children) {
            traverse(child);
          }
        };
        traverse(game.moves);
        return found;
      };

      const hasGameShapes = (game) => {
        let found = false;

        const haveShapes = comments=>{
          return (comments||[]).find(c=>/\[%(?:csl|cal)[^\]]+\]/i.test(c));
        };

        if (haveShapes(game.comments)) return true;
        const traverse = (node) => {
          if (found) return;
          if (haveShapes(node.data?.comments)) {
            found = true;
            return;
          }
          for (const child of node.children) {
            traverse(child);
          }
        };
        traverse(game.moves);
        return found;
      };

      let gameIndex = 0;
      const foundGames = [];
      for (const game of games) {
        gameIndex++;
        try {
          game.headers.delete('Found');
          let found = false;
          switch (searchMode) {
            case 'invalid':
              try {
                this.enhanceGameWithFens(game);
              } catch (ex) {
                if (ex.ply !== undefined) {
                  found = true;
                } else throw ex;
              }
              break;
            case 'fenOrMoves':
              let pgn = makePgn(game).replaceAll(/\s+/g,'');
              if (reg.test(pgn)) {
                found = true;
                break;
              }
              const game2 = parsePgn(pgn)[0];
              this.cutCommentsFromGame(game2);
              this.cutAnnotationsFromGame(game2);
              pgn = makePgn(game2).replaceAll(/\s+/g,'');
              if (reg.test(pgn)) {
                found = true;
                break;
              }
              pgn = pgn.replaceAll(/\d+\./g, '');
              if (reg.test(pgn)) {
                found = true;
                break;
              }
              this.enhanceGameWithFens(game);
              this.enhanceGameWithFenDict(game);
              found = Array.from(game.fenDict).find(pair => reg.test(pair[0]));
              break;
            case 'tag':
              const val = tagName.toLowerCase() == 'index'
                ? gameIndex.toString()
                : [...game.headers.entries()].find(p => p[0]?.toLowerCase() == tagName?.toLowerCase())?.[1];
              switch (tagOperator) {
                case '=': found = (val?.replace(/\s+/g, '') == tagValue?.replace(/\s+/g, '')); break;
                case '*=': found = (val?.replace(/\s+/g, ''))?.includes(tagValue?.replace(/\s+/g, '')); break;
              }
              break;
            case 'plyNumber':
              const maxPly = getMaxPly(game);
              switch (plyNumberOperator) {
                case '>':
                  found = maxPly > plyNumber;
                  break;
                case '<':
                  found = maxPly < plyNumber;
                  break;
                case '=':
                  found = maxPly == plyNumber;
                  break;
              }
              break;
            case 'eval':
              found = isGameEval(game, evalOperator, evalNumber);
              break;
            case 'clock':
              found = hasGameClock(game);
              break;
            case 'shapes':
              found = hasGameShapes(game);
              break;
          }
          if (found) {
            game.headers.set('Found', search.replaceAll('"', ''));
            foundGames.push(game);
          }
        } catch (ex) {
          if (ex.ply !== undefined) {
            const data = [gameIndex, ex.san, ex.ply];
            const message = trans.noarg('illegalMove').replace(/%(\d)/g, m => {
              return data[+m[1] - 1];
            });
            lt.announce(message);
            break;
          } else throw ex;
        }
      }

      this.writeNote(trans.pluralSame('preparingGames', games.length));
      await lt.timeout(0);
      for (const game of games) {
        this.cleanGame(game);
      }

      this.writeGames(textarea, games);

      this.writeNote(trans.pluralSame('foundGames', foundGames.length));
    };


    keepFound = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const text = textarea.val();
      let games = parsePgn(text);
      this.writeNote(trans.pluralSame('searchingGames', games.length));
      await lt.timeout(0);

      lt.arrayRemoveAll(games, g => !g.headers.has('Found'));
      for (const game of games) {
        game.headers.delete('Found');
      }

      this.writeGames(textarea, games);

      this.countPgn();
    };

    writeGames = (textarea, games) => {
      const lt = this.lichessTools;
      const co = lt.chessops;
      const { makePgn } = co.pgn;

      games = games.filter(g => g.moves?.children?.length || g.headers?.size);
      games.forEach(game => {
        if (games.length > 1 && game.moves?.children?.length && ![...game.headers.entries()].find(e => !/^[\?\.\*\s]*$/.test(e[1]))) {
          game.headers.set('Event', 'exported by LiChess Tools');
        }
      });

      let newText = games
        .map(g => makePgn(g)).join('\r\n\r\n')
        .replace(/\[[^\s]+\s+"[\?\.\*\s]*"\]\s*/g, '');

      const regChessMove = /(?<move>\b(?<piece>[NBRQK])?(?<p1>([a-h])?([1-8])?(x)?([a-h][1-8]))(=(?<promotion>[NBRQK]))?(?<p2>\+|#)?\b)(?<nags>(\s+\$\d+)+)/g;
      const annos = ['!', '?', '!!', '??', '!?', '?!'];
      newText = newText.replace(regChessMove,
        (...m) => {
          const g = m.at(-1);
          let nags = g.nags;
          const m2 = /\s+\$([1-6])\b/.exec(nags);
          if (m2) {
            nags = nags.substr(0, m2.index) + nags.substr(m2.index + m2[0].length);
            const anno = annos[+m2[1] - 1];
            return g.move + anno + nags;
          }
          return m[0];
        });

      this.setText(textarea, newText);
    };

    undo = async (textarea) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const text = this.history?.[this.historyIndex - 1] || '';
      $(textarea).val(text);
      this.setHistoryIndex(this.historyIndex - 1);
      this.writeNote('');
    };

    redo = async (textarea) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (this.historyIndex + 1 >= this.history?.length) return;
      const text = this.history[this.historyIndex + 1];
      $(textarea).val(text);
      this.setHistoryIndex(this.historyIndex + 1);
      this.writeNote('');
    };

    clear = async (textarea) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $(textarea).val('');
      this.history = [];
      this.setHistoryIndex(-1);
      lt.storage.remove('LichessTools.pgnEditor.history', { session: true });
      lt.storage.remove('LichessTools.pgnEditor.historyIndex', { session: true });
    };

    hashchange = (ev) => {
      const lt = this.lichessTools;
      const location = lt.global.location;
      const dialog = $('dialog.lichessTools-pgnEditor');
      if (location.hash == '#pgnEditor') {
        if (!dialog.length) {
          this.showPgnEditor();
        }
      } else {
        $('dialog.lichessTools-pgnEditor').trigger('close').remove();
      }
    };

    analysisControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const container = $('div.analyse__tools .action-menu__tools');
      if (!container.length) return;
      if (!this.options.enabled || !lt.exportPgn || lt.isGamePlaying()) {
        $('.lichessTools-pgnEditor', container).trigger('close').remove();
        return;
      }
      if ($('.lichessTools-pgnEditor', container).length) return;
      $('<a class="lichessTools-pgnEditor">')
        .attr('data-icon', lt.icon.EditorialCoronis)
        .attr('title', trans.noarg('sendToPgnEditorTitle'))
        .text(trans.noarg('sendToPgnEditorText'))
        .attr('href', '/analysis#pgnEditor')
        .on('click', async ev => {
          ev.preventDefault();
          const pgn = await lt.exportPgn('', { copyToClipboard: false, exportClock: true, exportEval: true, exportTags: true });
          this.showPgnEditor(pgn);
        })
        .appendTo(container);
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('pgnEditor');
      this.logOption('PGN editor', value);
      this.options = { enabled: !!value };
      const $ = lt.$;
      const trans = lt.translator;

      if (lichess.analysis) {
        lt.pubsub.off('lichessTools.redraw', this.analysisControls);
        lt.pubsub.on('lichessTools.redraw', this.analysisControls);
        lichess.analysis.actionMenu.toggle = lt.unwrapFunction(lichess.analysis.actionMenu.toggle, 'pgnEditor');
        lichess.analysis.actionMenu.toggle = lt.wrapFunction(lichess.analysis.actionMenu.toggle, {
          id: 'pgnEditor',
          after: ($this, result, ...args) => {
            lt.global.setTimeout(this.analysisControls, 100);
          }
        });
        this.analysisControls();
      }

      $(lt.global).off('hashchange', this.hashchange);
      if (!value) {
        $('dialog.lichessTools-pgnEditor').trigger('close').remove();
        return;
      }

      const container = $('#topnav section a[href="/analysis"]+div[role="group"]');
      if (!container.find('.lichessTools-pgnEditor').length) {
        $('<a/>')
          .addClass('lichessTools-pgnEditor')
          .text(trans.noarg('pgnEditorText'))
          .attr('title', trans.noarg('pgnEditorTitle'))
          .on('click', ev => {
            ev.preventDefault();
            this.showPgnEditor();
            $('nav#topnav').trigger('mouseout');
          })
          .appendTo(container);
      }
      $(lt.global).on('hashchange', this.hashchange);
      this.hashchange();
    }

  }
  LiChessTools.Tools.PgnEditor = PgnEditorTool;
})();

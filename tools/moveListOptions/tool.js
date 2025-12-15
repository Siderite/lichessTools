(() => {
  class MoveListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange', 'EmitCommentChange', 'DetectThirdParties', 'GamebookPlayClass'];

    preferences = [
      {
        name: 'moveListOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['indentedVariations', 'bookmarks', 'fullWidthAnalysis', 'hideLeftSide', 'analysisPopup', 'fixCevalToggle'],
        defaultValue: 'bookmarks'
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.moveListOptions': 'Move list options',
        'moveListOptions.indentedVariations': 'Indented variations',
        'moveListOptions.bookmarks': 'Bookmarks',
        'moveListOptions.fullWidthAnalysis': 'Expanded move list',
        'moveListOptions.hideLeftSide': 'Hide left side',
        'moveListOptions.analysisPopup': 'Open in new window',
        'moveListOptions.fixCevalToggle': 'Eval button on the right',
        'addBookmarkText': 'Add/Remove bookmark',
        'addBookmarkTitle': 'LiChess Tools - Add/Remove bookmark',
        'addBookmarkPrompt': 'Add/Remove bookmark',
        'collapseExpandTitle': 'LiChess Tools - Collapse/Expand',
        'URLCopiedToClipboard': 'URL copied to clipboard',
        'clipboardDenied': 'Clipboard access denied',
        'getBookmarkUrlText': 'Get bookmark link',
        'getBookmarkUrlTitle': 'LiChess Tools - get bookmark link',
        'collapseAllBookmarksText': 'Collapse all bookmarks',
        'collapseAllBookmarksTitle': 'LiChess Tools - Collapse all bookmarks',
        'expandAllBookmarksText': 'Expand all bookmarks',
        'expandAllBookmarksTitle': 'LiChess Tools - Expand all bookmarks',
        'bookmarkSplitConfirmationText': 'Sure you want to split the chapter on this bookmark?',
        'bookmarkSplitConfirmationDeleteText': 'Sure you want to split the chapter on this bookmark?\r\nTHIS WILL DELETE FROM THIS CHAPTER THE MOVES THAT FOLLOW',
        'bookmarkSplitText': 'Split chapter here',
        'bookmarkSplitTitle': 'LiChess Tools - create a new chapter with following moves from here\r\nPress Shift to also delete them from here',
        'chapterLink': 'Continue here: %s',
        'analysisPopupButtonTitle': 'LiChess Tools - move list in another window (use SYNC button)',
        'bookmarkLabelForInteractive': 'Bookmark: '
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.moveListOptions': 'Op\u0163iuni pentru list\u0103 mut\u0103ri',
        'moveListOptions.indentedVariations': 'Varia\u0163ii indentate',
        'moveListOptions.bookmarks': 'Bookmarkuri',
        'moveListOptions.fullWidthAnalysis': 'List\u0103 mut\u0103ri l\u0103rgit\u0103',
        'moveListOptions.hideLeftSide': 'Ascunde partea st\u00e2ng\u0103',
        'moveListOptions.analysisPopup': 'Deschide \u00een alt\u0103 fereastr\u0103',
        'moveListOptions.fixCevalToggle': 'Buton evaluare \u00een dreapta',
        'addBookmarkText': 'Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkTitle': 'LiChess Tools - Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkPrompt': 'Adaug\u0103/Elimin\u0103 bookmark',
        'collapseExpandTitle': 'LiChess Tools - Colapseaz\u0103/Expandeaz\u0103',
        'URLCopiedToClipboard': 'URL copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard',
        'getBookmarkUrlText': 'Link la bookmark',
        'getBookmarkUrlTitle': 'LiChess Tools - link la bookmark',
        'collapseAllBookmarksText': 'Colapseaz\u0103 toate bookmarkurile',
        'collapseAllBookmarksTitle': 'LiChess Tools - Colapseaz\u0103 toate bookmarkurile',
        'expandAllBookmarksText': 'Expandeaz\u0103 toate bookmarkurile',
        'expandAllBookmarksTitle': 'LiChess Tools - Expandeaz\u0103 toate bookmarkurile',
        'bookmarkSplitConfirmationText': 'Sigur vrei s\u0103 tai un nou capitol de la acest bookmark?',
        'bookmarkSplitConfirmationDeleteText': 'Sigur vrei s\u0103 tai un nou capitol de la acest bookmark?\r\nASTA VA \u015ETERGE MUT\u0102RILE URM\u0102TOARE DIN ACEST CAPITOL',
        'bookmarkSplitText': 'Taie un nou capitol de aici',
        'bookmarkSplitTitle': 'LiChess Tools - creeaz\u0103 un nou capitol din mut\u0103rile urm\u0103toare\r\nApas\u0103 Shift ca s\u0103 le \u015Ftergi de aici',
        'chapterLink': 'Continu\u0103 aici: %s',
        'analysisPopupButtonTitle': 'LiChess Tools - list\u0103 mut\u0103ri \u00een alt\u0103 fereastr\u0103 (folose\u015Fte butonul SYNC)',
        'bookmarkLabelForInteractive': 'Bookmark: '
      }
    }


    getCommentNodes = (elem) => {
      const lt = this.lichessTools;
      const $ = lt.$;

      let commentNodes = [];
      $(elem).each((i, e) => {
        $(e).contents().each((i2, e2) => {
          if (!e2) return;
          if (e2.nodeType === 3) { //text
            commentNodes.push(e2);
          } else { //element
            const arr = this.getCommentNodes(e2);
            commentNodes.push.apply(commentNodes, arr);
          }
        });
      });
      return commentNodes;
    };

    getMoveElements = (elem, list) => {
      if (!list) list = [];
      const isMainline = $(elem).is('.mainline');
      let next = $(elem).next();
      if (next.is('move.empty')) next = next.next();
      if (next.is('comment')) {
        list.push(next);
        next = next.next();
      }
      if (next.is('lines')) {
        list.push(next);
        return list;
      }
      if (next.is('interrupt')) {
        if (isMainline) {
          const child = next.children().eq(0);
          if (child.is('comment')) {
            list.push(child);
          }
        } else {
          list.push(next);
        }
        next = next.next();
      }
      while (next.length) {
        list.push(next);
        next = next.next();
      }
      return list;
    };

    collapseMove = (elem, collapse) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const path = $(elem).attr('p');
      if (!path) return;
      const move = lichess.analysis.tree.nodeAtPath(path);
      if (!move) {
        console.warn('Move missing for', elem);
        return;
      }
      const bookmark = move.bookmark;
      if (collapse === undefined) {
        collapse = !bookmark?.collapsed;
      }
      if (bookmark) {
        bookmark.collapsed = collapse;
      }

      $(elem).toggleClass('lichessTools-collapsed', collapse);
      const elems = this.getMoveElements(elem);
      for (const child of elems) {
        child.toggleClass('lichessTools-childCollapsed', collapse);
      }
      if (bookmark) {
        const studyId = lichess.analysis.study.data.id;
        if (!this.bookmarks) {
          this.bookmarks = new Map();
        }
        this.bookmarks.set(`${studyId}/${bookmark.label}`, collapse);
        lt.storage.set('LichessTools.bookmarks', [...this.bookmarks]);
      }
    }

    toBookmarkName = (text) => {
      let result = text?.trim()?.replace(/\s+/g, '_');
      if (/^\d+$/.test(result)) result = '_' + result;
      return result;
    };

    fromBookmarkName = (text) => {
      let result = text?.replaceAll('_', ' ')?.trim();
      return result;
    }

    setBookmark = (elem, node, bookmark) => {
      if (!elem) return;
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      if (bookmark) {
        let bookmarkElem = $('bookmark', elem);
        if (!bookmarkElem.length) {
          bookmarkElem = $('<bookmark><button></button><label></label></bookmark>')
            .prependTo(elem);
          $('button', bookmarkElem)
            .attr('title', trans.noarg('collapseExpandTitle'))
            .on('click', (ev) => {
              ev.preventDefault();
              this.collapseMove(elem);
            });
          $(elem).addClass('lichessTools-bookmark');
        }
        $('button', bookmarkElem)
          .toggleClass('lichessTools-noChildren', !node.children?.length);
        $('label', bookmarkElem)
          .text(this.fromBookmarkName(bookmark.label))
          .attr('title', this.fromBookmarkName(bookmark.label));
        this.collapseMove(elem, !!bookmark.collapsed);
      } else {
        this.collapseMove(elem, false);
        $('bookmark', elem).remove();
        $(elem).removeClass('lichessTools-bookmark');
      }
    }

    setBookmarks = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      if (analysis.gamebookPlay()) return;
      const r = /bkm:([^\s]+)\s*/s;
      const thereAreBookmarks = !!lt.global.document.querySelector('bookmark');

      lt.traverse(null, (node, state) => {
        let bookmark = null;
        const comments = node.comments || [];
        for (const comment of comments) {
          const m = r.exec(comment.text);
          if (m) {
            bookmark = m[1];
            break;
          }
        }
        if (bookmark) {
          if (node.bookmark) {
            if (node.bookmark.label != bookmark) {
              node.bookmark.label = bookmark;
            }
          } else {
            node.bookmark = {
              label: bookmark,
              collapsed: node.children?.length && this.getCollapsed(bookmark)
            };
          }
          const elem = lt.getElementForNode(node);
          this.setBookmark(elem, node, node.bookmark);
        } else {
          if (node.bookmark) {
            node.bookmark = null;
            if (thereAreBookmarks) {
              const elem = lt.getElementForNode(node);
              this.setBookmark(elem, node, null);
            }
          }
        }
      }, true);
    };

    getCollapsed = (label) => {
      const lt = this.lichessTools;
      const study = lt.lichess?.analysis?.study;
      if (!study) return false;

      if (!this.bookmarks) {
        this.bookmarks = new Map(lt.storage.get('LichessTools.bookmarks') || []);
      }
      const studyId = study.data.id;
      return this.bookmarks.get(`${studyId}/${label}`) || false;
    };

    addCommentBookmarks = () => {
      if (!this.options.bookmarks) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;

      this.setBookmarks();

      const commentNodes = this.getCommentNodes($('div.analyse__moves comment, div.gamebook .comment .content'));
      for (const node of commentNodes) {
        const rep = [];
        const r = /bkm:([^\s]+)\s*/s;
        const text = node.textContent;
        let m = r.exec(text);
        if (!m) continue;
        const comment = $(node).closest('comment');
        const divComment = $(node).closest('div.comment');
        if (comment.length) {
          node.textContent = text.slice(0, m.index) + text.slice(m.index + m[0].length);
          const isEmpty = !Array.from(comment[0].childNodes || [])
                             .filter(n => (n.nodeType == 3) || (n.tagName?.toLowerCase() == 'span'))
                             .find(n => !!n.textContent?.trim());
          comment.toggleClass('lichessTools-empty', isEmpty);
        } else if (divComment.length) {
          node.textContent = text.replace(r, trans.noarg('bookmarkLabelForInteractive') + this.fromBookmarkName(m[1]));
        }
      }

      const nodes = analysis.tree.getNodeList(analysis.path);
      for (let i = nodes.length - 2; i >= 0; i--) {
        const move = nodes[i];
        if (move.bookmark?.collapsed) {
          const elem = lt.getElementForNode(move);
          this.collapseMove(elem, false);
        }
      }
    }

    debouncedAddCommentBookmarks = this.lichessTools.debounce(this.addCommentBookmarks, 200);


    analysisControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      $('.tview2').toggleClassSafe('lichessTools-indentedVariations', this.options.indentedVariations);
      const container = $('div.analyse__tools div.action-menu');
      if (!container.length) return;

      if (!$('.abset-indentedVariations', container).length) {
        const html = `<div class="setting abset-indentedVariations" title="LiChess Tools - $trans(moveListOptions.indentedVariations)">
      <div class="switch">
        <input id="abset-indentedVariations" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-indentedVariations"></label>
      </div>
      <label for="abset-indentedVariations">$trans(moveListOptions.indentedVariations)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-inline', container).eq(0));
        $('#abset-indentedVariations')
          .on('change', async () => {
            this.options.indentedVariations = $('#abset-indentedVariations').is(':checked');
            const options = lt.currentOptions;
            options.moveListOptions = this.options.getString();
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-indentedVariations')
        .prop('checked', this.options.indentedVariations);

      if (!$('.abset-fullWidthAnalysis', container).length) {
        const html = `<div class="setting abset-fullWidthAnalysis" title="LiChess Tools - $trans(moveListOptions.fullWidthAnalysis)">
      <div class="switch">
        <input id="abset-fullWidthAnalysis" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-fullWidthAnalysis"></label>
      </div>
      <label for="abset-fullWidthAnalysis">$trans(moveListOptions.fullWidthAnalysis)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-indentedVariations', container).eq(0));
        $('#abset-fullWidthAnalysis')
          .on('change', async () => {
            this.options.fullWidthAnalysis = $('#abset-fullWidthAnalysis').is(':checked');
            const options = lt.currentOptions;
            options.moveListOptions = this.options.getString();
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-fullWidthAnalysis')
        .prop('checked', this.options.fullWidthAnalysis);

      if (!$('.abset-hideLeftSide', container).length) {
        const html = `<div class="setting abset-hideLeftSide" title="LiChess Tools - $trans(moveListOptions.hideLeftSide)">
      <div class="switch">
        <input id="abset-hideLeftSide" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-hideLeftSide"></label>
      </div>
      <label for="abset-hideLeftSide">$trans(moveListOptions.hideLeftSide)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-fullWidthAnalysis', container).eq(0));
        $('#abset-hideLeftSide')
          .on('change', async () => {
            this.options.hideLeftSide = $('#abset-hideLeftSide').is(':checked');
            const options = lt.currentOptions;
            options.moveListOptions = this.options.getString();
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-hideLeftSide')
        .prop('checked', this.options.hideLeftSide);
    };

    hashChange = () => {
      if (!this.options.bookmarks) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      if (this.hash == lt.global.location.hash) return;
      this.hash = lt.global.location.hash;
      if (!this.hash) return;
      let destinationNode = null;
      const hash = lt.global.decodeURIComponent(this.hash?.slice(1)?.toLowerCase());
      lt.traverse(null, (node, state) => {
        if (node.bookmark?.label?.toLowerCase() == hash) {
          if (destinationNode) {
            lt.announce('You have multiple bookmarks with the same label: ' + node.bookmark.label);
          } else {
            destinationNode = node;
          }
        }
      }, true);
      if (destinationNode?.path) {
        lichess.analysis.jump(destinationNode.path);
        lt.analysisRedraw();
      }
    };

    addOrRemoveBookmark = async () => {
      const lt = this.lichessTools;
      const myName = lt.getUserId();
      if (!myName) return;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;

      const path = analysis.contextMenuPath;
      if (!path) return;
      const node = analysis.tree.nodeAtPath(path);
      if (!node) return;
      const elem = lt.getElementForNode(node);
      if (!elem) return;
      const oldLabel = this.fromBookmarkName(node.bookmark?.label) || '';
      const bookmarkName = await lt.uiApi.dialog.prompt(trans.noarg('addBookmarkPrompt'), oldLabel);
      const label = this.toBookmarkName(bookmarkName);
      if (label === undefined) return;
      node.bookmark = label
        ? {
          label: label,
          collapsed: node.bookmark?.collapsed || false
        }
        : null;
      this.setBookmark(elem, node, node.bookmark);

      const r = /bkm:([^\s]+)\s*/gs;
      const comments = (node.comments || [])
        .filter(c => c.by?.id == myName || r.test(c.text));
      let commentText = comments.map(c => c.text).join('\r\n\r\n');
      r.lastIndex = 0;
      commentText = (label ? 'bkm:' + label + ' ' : '') + commentText.replace(r, '').trim();
      const chapterId = study?.currentChapter()?.id;
      if (!chapterId) {
        lt.global.console.warn('Could not determine chapterId');
        return;
      }
      for (const comment of comments.filter(c => c.by?.id != myName)) {
        study.commentForm.delete(chapterId, node.path, comment.id)
      }
      lt.saveComment(commentText, path);
      if (node === analysis.node) {
        $('#comment-text').val(commentText);
      }
    };

    getBookmarkUrl = async (bookmark) => {
      const label = bookmark?.label;
      if (!label) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const announce = lt.announce;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      if (!study) return;

      const chapterId = study.currentChapter()?.id;
      if (!chapterId) {
        lt.global.console.warn('Could not determine chapterId');
        return;
      }
      const url = lt.global.location.origin + '/study/' + study.data.id + '/' + chapterId + '#' + lt.global.encodeURIComponent(label);
      await lt.writeToClipboard(url, trans.noarg('URLCopiedToClipboard'), trans.noarg('clipboardDenied'));
    };

    collapseExpandAll = () => {
      if (!this.options.bookmarks) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const anyCollapsed = $('move.lichessTools-collapsed').eq(0)[0];
      if (anyCollapsed) {
        $('move.lichessTools-bookmark.lichessTools-collapsed bookmark button').trigger('click');
      } else {
        $('move.lichessTools-bookmark:not(.lichessTools-collapsed) bookmark button').trigger('click');
      }
    };

    bookmarkSplit = async (ev) => {
      const deleteMoves = ev.shiftKey;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      const nodePath = analysis?.contextMenuPath;
      if (!study || nodePath === undefined) return;
      const pgn = await lt.exportPgn(nodePath, { fromPosition: true, exportClock: true, exportEval: true, exportTags: true });
      if (!pgn) return;
      let node = analysis.tree.nodeAtPath(nodePath);
      const label = node?.bookmark?.label;
      if (!label) return;
      const parentChapterId = study.currentChapter()?.id;
      if (!parentChapterId) throw 'Cannot find chapter id!';
      if (!await lt.uiApi.dialog.confirm(trans.noarg(deleteMoves ? 'bookmarkSplitConfirmationDeleteText' : 'bookmarkSplitConfirmationText'))) return;
      const setup = study.data?.chapter?.setup;
      study.chapters.newForm.submit({
        name: this.fromBookmarkName(label),
        pgn: pgn,
        variant: setup?.variant?.key || 'standard',
        orientation: setup?.orientation || 'white',
        mode: 'normal',
        isDefaultName: false
      })

      while (true) {
        const chapterId = study.currentChapter()?.id;
        if (chapterId && chapterId != parentChapterId && study.chapters.list.get(chapterId)) break;
        await lt.timeout(50);
      }
      const newChapterId = study.currentChapter().id;
      study.setChapter(parentChapterId);

      while (true) {
        const chapterId = study.currentChapter()?.id;
        if (chapterId && chapterId == parentChapterId && study.chapters.list.get(chapterId)) break;
        await lt.timeout(50);
      }

      const chapterUrl = lt.global.location.origin + '/study/' + study.data.id + '/' + newChapterId;
      let commentText = lt.getNodeComment(node) || '';
      if (commentText) commentText += '\r\n';
      commentText += trans.pluralSame('chapterLink', chapterUrl);
      lt.saveComment(commentText, nodePath, parentChapterId);

      if (analysis.path != nodePath) {
        analysis.jump(nodePath);
        analysis.redraw();
        while (analysis.path != nodePath) {
          await lt.timeout(50);
        }
      }
      if (deleteMoves) {
        node = analysis.tree.nodeAtPath(nodePath);
        for (const child of node.children || []) {
          const path = nodePath + child.id;
          study.deleteNode(path);
          analysis.tree.deleteNodeAt(path);
        }
      }
    };

    analysisContextMenu = () => {
      if (!this.options.bookmarks) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      const study = analysis?.study;

      const menu = $('#analyse-cm');
      if (!menu.length) return;

      if (!this.options.bookmarks) return;
      const isWritableStudy = study?.isWriting();
      if (isWritableStudy) {
        let menuItem = $('a[data-role="bookmark"]', menu);
        if (!menuItem.length) {
          const text = trans.noarg('addBookmarkText');
          const title = trans.noarg('addBookmarkTitle');
          menuItem = $('<a>')
            .attr('data-icon', lt.icon.Tag)
            .attr('data-role', 'bookmark')
            .text(text).attr('title', title)
            .on('click', this.addOrRemoveBookmark)
            .appendTo(menu);
        }
      }
      if (analysis.contextMenuPath) {
        const node = analysis.tree.nodeAtPath(analysis.contextMenuPath);
        if (node?.bookmark?.label) {
          let menuItem = $('a[data-role="bookmarkUrl"]', menu);
          if (!menuItem.length) {
            const text = trans.noarg('getBookmarkUrlText');
            const title = trans.noarg('getBookmarkUrlTitle');
            menuItem = $('<a>')
              .attr('data-icon', lt.icon.Link)
              .attr('data-role', 'bookmarkUrl')
              .text(text).attr('title', title)
              .on('click', () => this.getBookmarkUrl(node.bookmark))
              .appendTo(menu);
          }

          menuItem = $('a[data-role="collapseAll"]', menu);
          if (!menuItem.length) {
            menuItem = $('<a>')
              .attr('data-role', 'collapseAll')
              .on('click', () => this.collapseExpandAll())
              .appendTo(menu);
          }
          const anyCollapsed = $('move.lichessTools-collapsed').eq(0)[0];
          let text = undefined;
          let title = undefined;
          let icon = undefined;
          if (anyCollapsed) {
            text = trans.noarg('expandAllBookmarksText');
            title = trans.noarg('expandAllBookmarksTitle');
            icon = lt.icon.PlusButton;
          } else {
            text = trans.noarg('collapseAllBookmarksText');
            title = trans.noarg('collapseAllBookmarksTitle');
            icon = lt.icon.MinusButton;
          }
          menuItem
            .attr('data-icon', icon)
            .text(text).attr('title', title);

          if (isWritableStudy && node.children?.length) {
            let menuItem = $('a[data-role="bookmarkSplit"]', menu);
            if (!menuItem.length) {
              const text = trans.noarg('bookmarkSplitText');
              const title = trans.noarg('bookmarkSplitTitle');
              menuItem = $('<a>')
                .attr('data-icon', lt.icon.WhiteScissors)
                .attr('data-role', 'bookmarkSplit')
                .text(text).attr('title', title)
                .on('click', this.bookmarkSplit)
                .appendTo(menu);
            }
          }
        }
      }
    }

    setupAnalysisPopup = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const study = lt.lichess.analysis?.study;
      if (this.options.analysisPopup && study) {
        let container = $('div.analyse__tools div.ceval');
        if (container.length || $('.action-menu').length) {
          $('div.lichessTools-moveListOptions-header').remove();
        } else {
          container = $('div.lichessTools-moveListOptions-header');
          if (!container.length) {
            container = $('<div class="lichessTools-moveListOptions-header">')
              .prependTo('div.analyse__tools');
          }
        }
        let button = $('div.analyse__tools a.lichessTools-analysisPopup');
        if (!button.length) {
          button = $('<a class="lichessTools-analysisPopup">')
            .attr('data-icon', lt.icon.ExternalArrow)
            .attr('title', trans.noarg('analysisPopupButtonTitle'))
            .on('click', ev => {
              ev.preventDefault();
              this.popup?.close();
              this.popup = lt.global.open(lt.global.location.href, 'lichessTools-moves', 'fullscreen=yes,menubar=no,location=no,status=no,titlebar=no,toolbar=no,');
              this.popup.addEventListener('DOMContentLoaded', () => $('body', this.popup.document).addClass('lichessTools-analysisPopup'));
              lt.global.addEventListener('unload', () => {
                this.popup.close();
              });
            });
          const elem = $('help,div.engine', container);
          if (elem.length) {
            button
              .insertAfter(elem);
          } else {
            button
              .appendTo(container);
          }
        }
      } else {
        $('div.analyse__tools a.lichessTools-analysisPopup').remove();
        $('div.lichessTools-moveListOptions-header').remove();
      }
    };

    setupCevalToggle = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('main.puzzle, main.analyse').toggleClass('lichessTools-fixCevalToggle', this.options.fixCevalToggle);
    };

    addMissingIndexes = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $.cached('.tview2.lichessTools-indentedVariations inline+move', 2000).each((i, e) => {
        e = $(e);
        if (e.children('index').length) return;
        const elem = e.prev().prev('move:has(index)').children('index').clone();
        if (!elem.length) return;
        elem
          .addClass('lichessTools-index')
          .text(elem.text() + '..');
        $(e).prepend(elem);
      });
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('moveListOptions');
      this.logOption('Move list options', value);
      const $ = lt.$;
      const analysis = lichess?.analysis;
      //if (!analysis) return;
      this.options = {
        indentedVariations: lt.isOptionSet(value, 'indentedVariations'),
        bookmarks: lt.isOptionSet(value, 'bookmarks'),
        fullWidthAnalysis: lt.isOptionSet(value, 'fullWidthAnalysis'),
        hideLeftSide: lt.isOptionSet(value, 'hideLeftSide'),
        analysisPopup: lt.isOptionSet(value, 'analysisPopup'),
        fixCevalToggle: lt.isOptionSet(value, 'fixCevalToggle'),
        getString: function () {
          const arr = [];
          if (this.indentedVariations) arr.push('indentedVariations');
          if (this.bookmarks) arr.push('bookmarks');
          if (this.fullWidthAnalysis) arr.push('fullWidthAnalysis');
          if (this.hideLeftSide) arr.push('hideLeftSide');
          if (this.analysisPopup) arr.push('analysisPopup');
          if (this.fixCevalToggle) arr.push('fixCevalToggle');
          return arr.join(',');
        }
      };
      if (analysis) {
        lt.pubsub.off('lichessTools.redraw', this.analysisControls);
        lt.pubsub.on('lichessTools.redraw', this.analysisControls);
        analysis.actionMenu.toggle = lt.unwrapFunction(analysis.actionMenu.toggle, 'moveListOptions');
        analysis.actionMenu.toggle = lt.wrapFunction(analysis.actionMenu.toggle, {
          id: 'moveListOptions',
          after: ($this, result, ...args) => {
            lt.global.setTimeout(this.analysisControls, 100);
            lt.emitRedraw();
          }
        });
        this.analysisControls();

        lt.pubsub.off('lichessTools.redraw', this.debouncedAddCommentBookmarks);
        lt.pubsub.off('lichessTools.chapterChange', this.debouncedAddCommentBookmarks);
        lt.pubsub.off('lichessTools.commentChange', this.debouncedAddCommentBookmarks);
        $(lt.global).off('hashchange', this.hashChange);
        if (this.options.bookmarks) {
          lt.pubsub.on('lichessTools.redraw', this.debouncedAddCommentBookmarks);
          lt.pubsub.on('lichessTools.chapterChange', this.debouncedAddCommentBookmarks);
          lt.pubsub.on('lichessTools.commentChange', this.debouncedAddCommentBookmarks);
          this.addCommentBookmarks();
          $(lt.global).on('hashchange', this.hashChange);
          lt.global.setTimeout(this.hashChange, 100);
        }

        lt.pubsub.off('lichessTools.redraw', this.setupAnalysisPopup);
        if (analysis.study && this.options.analysisPopup) {
          lt.pubsub.on('lichessTools.redraw', this.setupAnalysisPopup);
        }
        this.setupAnalysisPopup();
      }
      $.cached('body')
        .toggleClass('lichessTools-fullWidthAnalysis', this.options.fullWidthAnalysis)
        .toggleClass('lichessTools-hideLeftSide', this.options.hideLeftSide);

      lt.pubsub.off('lichessTools.redraw', this.addMissingIndexes);
      if (this.options.indentedVariations) {
        lt.pubsub.on('lichessTools.redraw', this.addMissingIndexes);
      }

      lt.pubsub.off('lichessTools.redraw', this.analysisContextMenu);
      $('.tview2').off('contextmenu', this.analysisContextMenu);
      if (this.options.bookmarks) {
        lt.pubsub.on('lichessTools.redraw', this.analysisContextMenu);
        $('.tview2').on('contextmenu', this.analysisContextMenu);
      }

      $('.lichessTools-fixCevalToggle').removeClass('lichessTools-fixCevalToggle');
      lt.pubsub.off('lichessTools.redraw', this.setupCevalToggle);
      if (this.options.fixCevalToggle) {
        lt.pubsub.on('lichessTools.redraw', this.setupCevalToggle);
      }
      this.setupCevalToggle();
    }
  }

  LiChessTools.Tools.MoveListOptions = MoveListOptionsTool;
})();

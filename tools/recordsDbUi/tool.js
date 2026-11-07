(() => {

  let nextContentId = 0;
  const recordsDragType = 'application/x-lichess-records-db';

  // How many records the filter scores at most - the product owns this number, so it is edited
  // here rather than carried as a preference.
  const recordsDbMaxResults = 10000;

  // A leaf that opens something leaves this key behind for the page it lands on. It lives in
  // `sessionStorage`, so only the trip inside the same tab carries it, and only a trip younger
  // than `treeHandoffMs` is spent - see `openLeaf` and `RecordsDbCtrl.handoff`.
  const treeHandoffKey = 'LichessTools.collectionTree.openFromTree';
  const treeHandoffMs = 5000;
  // The back button carries no mark of its own, and the study hash already means a bookmark and a
  // ply, so it cannot spell "the window was open here". The pages that had the window open are kept
  // as a short url trail in `sessionStorage` instead: the next page whose url is in the trail is a
  // page the user came back to, and the window comes with it.
  const treeReturnKey = 'LichessTools.collectionTree.cameFrom';
  const treeReturnTrail = 3;
  const treeReturnMs = 5 * 60 * 1000;
  // Which page ran last: reloading the page you are on is not a way back, so the trail is only read
  // as a return when the page that ran had a different url.
  const treePageKey = 'LichessTools.collectionTree.page';
  // The shape and the wheel are state only this page can see, so they are written as the tree
  // changes - at most once every `windowStateSaveMs`, so dragging through a big tree cannot rewrite
  // the blob on every step. A page being left without another call gets one flush from `pagehide`
  // and `beforeunload`, the same channel `puzzleHistory` and `moveListOptions` flush on.
  const windowStateSaveMs = 10 * 1000;

  // A row the mirror has never seen spends one read on hover, so its tooltip answers from the
  // next hover on. The reads are spaced like the harvested pages and capped per page, so resting
  // the pointer on a 496-row tree cannot spend 496 requests.
  const recordsDbHoverReadLimit = 25;
  const recordsDbHoverReadDelayMs = 300;

  // Intl keys are flat camelCase, so a state or a kind spells its own capital.
  const camel = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  // The one tool instance the helpers below reach for their engine, their dialog and their window
  // handler - set in `init`, and the same instance every page keeps.
  let recordsDbInstance;

  class RecordsDbUiTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['RecordsDbStore', 'FixAbortController', 'PageInitData', 'Dialog'];

    preferences = [
      {
        name: 'recordsDbUi',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      },
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.recordsDbUi': 'Records database window',
        'recordsDbRetry': 'Retry',
        'recordsDbPublicStudy': 'Public study',
        'recordsDbSearchPlaceholder': 'Record filter',
        'recordsDbFolderNamePrompt': 'Name the new folder',
        'recordsDbNewFolder': 'New folder',
        'recordsDbRename': 'Rename',
        'recordsDbExpandFolder': 'Expand folder',
        'recordsDbCollapseFolder': 'Collapse folder',
        'recordsDbExpandAll': 'Expand all folders',
        'recordsDbCollapseAll': 'Collapse all folders',
        // The tree view: the header, the three chips, the actions and the backup ask for these.
        // Every one lives in this table - a string the view asks for but the table lacks would
        // render blank.
        'filtersAccess': 'Access',
        'filtersVisibility': 'Visibility',
        'filtersKind': 'Kind',
        'recordsDbAdd': 'Add',
        'recordsDbSelect': 'Select',
        'recordsDbSelectOn': 'Select on',
        'recordsDbSelectOff': 'Select off',
        'recordsDbDelete': 'Delete',
        'recordsDbChipNotApplicable': 'Nothing to choose',

        'recordsDbEmptyNote': 'The tree is empty',
        'recordsDbMissingStudy': 'Study missing from the database',
        'recordsDbStudyGone': 'That study no longer exists',
        'recordsDbItemsCount': 'Items: %s',
        'recordsDbCountStudy': 'Studies: %s',
        'recordsDbCountChapter': 'Chapters: %s',
        'recordsDbCountGame': 'Games: %s',
        'recordsDbCountPosition': 'Positions: %s',
        'recordsDbCountPuzzle': 'Puzzles: %s',
        'recordsDbCountBlog': 'Blogs: %s',
        'recordsDbCountBlogPost': 'Blog posts: %s',
        'recordsDbCountForumPost': 'Forum posts: %s',
        'recordsDbPressAgain': 'Press again to drop what is selected',
        'recordsDbDeleteQuestion': 'Delete selected?',
        'recordsDbRestoreQuestion': 'Replace the tree from file?',
        'recordsDbRestoreFailed': 'Not a tree file',
        'recordsDbRestoredTree': 'Restored from file',
        'recordsDbRemovedCount': 'Removed',
        'recordsDbAddedStudy': 'Filed the study',
        'recordsDbNothingToFile': 'Nothing left to file',
        'recordsDbAddHarvestFailed': 'The harvest found nothing to file',
        'recordsDbBackup': 'Backup',

        'recordsDbRestoreTree': 'Restore',
        'recordsDbDownloadedTree': 'Wrote the tree to file',
        'recordsDbOpenLink': 'Open this study',

        'accessAll': 'Any access',
        'accessWritable': 'Writable',
        'accessReadonly': 'Readonly',
        'visibilityAll': 'Any visibility',
        'visibilityPublic': 'Public',
        'visibilityUnlisted': 'Unlisted',
        'visibilityPrivate': 'Private',
        'kindAll': 'Every kind',
        'kindStudy': 'Study',
        'kindChapter': 'Chapter',
        'kindGame': 'Game',
        'kindPosition': 'Position',
        'kindPuzzle': 'Puzzle',
        'kindBlog': 'Blog',
        'kindBlogPost': 'Blog post',
        'kindForumPost': 'Forum post',
        'recordsDbButtonTitle': 'LiChess Tools - records database window'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.recordsDbUi': 'Fereastr\u0103 baz\u0103 de date',
        'recordsDbRetry': 'Re\u00eencearc\u0103',
        'recordsDbPublicStudy': 'Studiu public',
        'recordsDbSearchPlaceholder': 'Filtru \u00eenregistr\u0103ri',
        'recordsDbFolderNamePrompt': 'Nume\u015fte folderul nou',
        'recordsDbNewFolder': 'Folder nou',
        'recordsDbRename': 'Redenumire',
        'recordsDbExpandFolder': 'Expandeaz\u0103 folder',
        'recordsDbCollapseFolder': 'Colapseaz\u0103 folder',
        'recordsDbExpandAll': 'Expandeaz\u0103 toate folderele',
        'recordsDbCollapseAll': 'Colapseaz\u0103 toate folderele',

        'filtersAccess': 'Acces',
        'filtersVisibility': 'Vizibilitate',
        'filtersKind': 'Tip',
        'recordsDbAdd': 'Adaug\u0103',
        'recordsDbSelect': 'Selecteaz\u0103',
        'recordsDbSelectOn': 'Selectare activ\u0103',
        'recordsDbSelectOff': 'Selectare inactiv\u0103',
        'recordsDbDelete': '\u015eterge',
        'recordsDbChipNotApplicable': 'Nimic de ales',

        'recordsDbEmptyNote': 'Arborele este gol',
        'recordsDbMissingStudy': 'Studiul lipse\u015fte din baza de date',
        'recordsDbStudyGone': 'Acest studiu nu mai exist\u0103',
        'recordsDbItemsCount': 'Elem: %s',
        'recordsDbCountStudy': 'Studie: %s',
        'recordsDbCountChapter': 'Capitole: %s',
        'recordsDbCountGame': 'Partide: %s',
        'recordsDbCountPosition': 'Positie: %s',
        'recordsDbCountPuzzle': 'Probleme: %s',
        'recordsDbCountBlog': 'Bloghe: %s',
        'recordsDbCountBlogPost': 'Post blog: %s',
        'recordsDbCountForumPost': 'Post forum: %s',
        'recordsDbPressAgain': 'Apas\u0103 din nou pentru plasarea selec\u0163iei',
        'recordsDbDeleteQuestion': '\u015eterge cele selectate?',
        'recordsDbRestoreQuestion': '\u00cenlocuire arbore din fi\u015fier?',
        'recordsDbRestoreFailed': 'Nu este un fi\u015fier arbore',
        'recordsDbRestoredTree': 'Restaurat din fi\u015fier',
        'recordsDbRemovedCount': '\u015eters',
        'recordsDbAddedStudy': 'Studiul a fost \u00eenregistrat',
        'recordsDbNothingToFile': 'Nimic r\u0103mas de \u00eenregistrat',
        'recordsDbAddHarvestFailed': 'Recoltarea nu a g\u0103sit nimic de \u00eenregistrat',
        'recordsDbBackup': 'Backup',

        'recordsDbRestoreTree': 'Restaurare',
        'recordsDbDownloadedTree': 'Am salvat arborele \u00een fi\u015fier',
        'recordsDbOpenLink': 'Deschide acest studiu',

        'accessAll': 'Orice acces',
        'accessWritable': 'Modificabil',
        'accessReadonly': 'Doar citire',
        'visibilityAll': 'Orice vizibilitate',
        'visibilityPublic': 'Public',
        'visibilityUnlisted': 'Nelistat',
        'visibilityPrivate': 'Privat',
        'kindAll': 'Orice tip',
        'kindStudy': 'Studiu',
        'kindChapter': 'Capitol',
        'kindGame': 'Partid\u0103',
        'kindPosition': 'Pozi\u0163ie',
        'kindPuzzle': 'Problem\u0103',
        'kindBlog': 'Blog',
        'kindBlogPost': 'Postare pe blog',
        'kindForumPost': 'Postare pe forum',
        'recordsDbButtonTitle': 'LiChess Tools - fereastr\u0103 baz\u0103 de date \u00eenregistr\u0103ri'
      }
    };

    async init() {
      const lt = this.lichessTools;
      if (!lt.recordsDbHarvest) return;
      // The engines live on the tool itself: the classes below are not tools, so they reach their
      // search engine, their navigation and their window handler through this one instance.
      if (!recordsDbInstance) {
        recordsDbInstance = this;
        this.recordsDbCtrl = new RecordsDbCtrl(lt, lt.recordsDbHarvest);
        this.windowEventHandler = new WindowEventHandler(lt);
        this.navigation = new RecordsNavigation(lt);
        this.searchEngine = new RecordsSearchEngine(lt, lt.recordsDbHarvest);
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('recordsDbUi');
      this.logOption('Records database', value);
      const ctrl = recordsDbInstance?.recordsDbCtrl;
      // Close whatever the last page left open before deciding again.
      if (ctrl) {
        await ctrl.close();
        ctrl.removeToggle();
      }

      // The hand-off is spent on every page load, before anything else decides: a flag nobody
      // spends would otherwise reopen the window on the next visit of that study. The url trail is
      // spent the same way, for the same reason - it is the back button's only signal.
      const arrived = ctrl ? await ctrl.handoff() : false;
      const returned = ctrl ? await ctrl.returned() : false;
      if (value === false || !ctrl) return;
      if (!ctrl.canOpen()) {
        // The store already captured the study; only the window is short.
        this.logOption('Records database', 'cannot open here');
        return;
      }
      await ctrl.load();
      await ctrl.installToggle();
      // A row of the tree opened this study, or the user came back to a page that had the window
      // open on it, so the window comes with the trip - the user never hunts for the toggle on a
      // page they reached from the tree or from the back button.
      if (arrived || returned) {
        if (arrived) this.logOption('Opened from tree', true);
        if (returned) this.logOption('Came back to a page that had the window', true);
        await ctrl.open();
      }
    }

    canOpen() {
      return !!recordsDbInstance?.recordsDbCtrl?.canOpen();
    }

  }


  // The tree content reads the store's tree and owns the shape the window shows. It replaces the
  // tab base and its module holder: the page has exactly one content, and the engines it needs are
  // the tool's own fields.

  // The tree is one content, so it owns the read lifetime, the repaint hook and the shape write
  // that the tab base used to hand out to several.
  class BookmarkTabContent {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
      this.sync = store.syncCtrl;
      this.kind = 'treeTab';
      this.id = 'lichessTools-recordsDbUi-content-' + nextContentId++;
      // The tree is curated - empty is the normal first state, and the header makes it legible.
      this.entries = [];
      // The last snapshot of each branch: what the blobs held, so a load can merge it and a save
      // can split from the same shape.
      this.branches = new Map();
      this.selected = new Set();
      this.expanded = new Set();
      this.query = '';
      this.terms = [];
      // The two state chips plus the kind chip; string states so the blob reads without a mapping.
      this.filters = { access: 'all', visibility: 'all', kind: 'all' };
      this.selectMode = false;
      // The "press again" fallback for a page that offers no `dialog` service.
      this.confirmBar;
      this.hits;
      this.hitsQuery;
      this.haystackCache = new Map();
      this.hayRevision;
      // Leaves a read proved gone - the proof lives on the leaf, never on a missing record.
      this.goneNodes = new Set();
      // Studies this page already spent a hover read on, so one gesture cannot ask twice.
      this.hoverReads = new Set();
      this.recordCache = new Map();
      // The nodes the current paint put on the page: the tree host answers a pointer or a key by
      // looking the hit element up here, so the row handlers live on the host and a repaint over a
      // thousand rows registers nothing that could outlive the rows it replaces.
      this.rowIndex = new WeakMap();
      this.editing;
      this.anchor;
      this.message;
      this.revision = 0;
      this.writes = Promise.resolve();
    }

    // One lifetime per load: the abort signal it hands `load()` so a page that leaves mid-read
    // cannot finish a stale read and paint over the state the leaving page had saved.
    async init() {
      const lt = this.lichessTools;
      if (this.lifetime) return;
      const AbortControllerClass = (lt.global.AbortController || AbortController);
      this.lifetime = new AbortControllerClass();
      this.signal = this.lifetime.signal;
      if (this.loaded) return;
      const signal = this.signal;
      await this.load();
      if (!signal.aborted) this.loaded = true;
    }

    // The window is going away: the read that may still be running is stopped, and the repaint
    // hook is taken off the sync watch's hand so a late idb write cannot repaint a dead window.
    destroy() {
      this.lifetime?.abort();
      this.lifetime = undefined;
      this.onChange = () => {};
    }

    // The tree engine is not a tool, so it has no `logOption` of its own; the page's own console
    // line is what a live page is checked with, printed in the same colour the tools use.
    logState(label, value) {
      const lt = this.lichessTools;
      lt.global?.console?.log(label + ' %c' + value, 'color:#9980FF');
    }


    // The registry is the store's, so the tree never hardcodes what a kind means.
    get registry() {
      return this.store.kindRegistry;
    }

    get studies() {
      return this.sync.studies;
    }

    get error() {
      return this.loadError;
    }

    set error(value) {
      this.loadError = value;
    }

    folder(node) {
      return this.store.collectionFolder(node);
    }

    // A leaf is `{kind,id,label,meta?}`; the label is the fallback a cold store still draws.
    leafLabel(node) {
      const record = this.recordCache.get(node);
      return record?.studyName || record?.name || node?.label || '';
    }

    recordFor(node) {
      return this.recordCache.get(node);
    }

    // Which kinds are on the tree - the kind chip walks these, so a study tree never offers a
    // games state.
    presentKinds() {
      const present = new Set();
      const walk = (nodes) => {
        for (const node of nodes || []) {
          if (node?.kind) present.add(node.kind);
          walk(node.children || []);
        }
      };
      walk(this.entries);
      return this.store.collectionKinds.filter((kind) => present.has(kind));
    }

    // The scope a chip would answer for - the selected kind, or every kind on the tree.
    chipScope() {
      return this.filters.kind == 'all' ? this.presentKinds() : [this.filters.kind];
    }

    // "dim, never inert": a chip is live only if some kind in scope has an answer for it. The
    // chip names map onto the registry's row fields - the access chip is answered by `canWrite`,
    // the visibility chip by `visibility`, and the kind chip is live when the tree holds more
    // than one kind.
    chipApplicable(which) {
      if (which == 'kind') return this.chipScope().length > 1;
      const field = which == 'access' ? 'canWrite' : 'visibility';
      return this.chipScope().some((kind) => this.registry[kind]?.[field] !== undefined);
    }

    // A click cycles `(state + 1) % states.length`, `all` first and drawn dim.
    cycleFilter(which, states) {
      const at = states.indexOf(this.filters[which]);
      this.filters[which] = states[(at + 1) % states.length];
      this.store.collectionTree.saveFilters({ [which]: this.filters[which] });
      this.filterChanged();
      return this.filters[which];
    }

    async load() {
      const signal = this.signal;
      try {
        await this.writes;
        const branches = await this.store.collectionTree.loadAll();
        if (signal?.aborted) return;
        this.branches = new Map(branches);
        this.entries = this.mergeBranches(branches);
        // The mirror facts a row shows belong to the leaves that were just built, so a reload
        // re-reads them - an old cache would call a live leaf dead.
        this.refreshCaches();
        // The tree now names its studies, so the local db keeps a capture for each of them;
        // a prune failure only leaves an old capture, it does not break the load.
        await this.sync.setTreeIds(this.treeStudyIds()).catch(() => null);
        const filters = await this.store.collectionTree.loadFilters();
        this.filters = { ...this.filters, ...filters };
        // The shape a user left comes back the same way the chips do: the window blob carries it,
        // and a row the tree no longer has simply stays where it is.
        this.restoreView(await this.store.idbStudy.loadWindows());
        this.editing = undefined;
        this.anchor = undefined;
        this.confirmBar = undefined;
        this.error = undefined;
      } catch (failure) {
        if (!signal?.aborted) this.error = { message: 'Unable to load the tree', retry: () => this.load() };
      }
      if (!signal?.aborted) this.onChange();
    }

    mergeBranches(branches) {
      return this.sortTree(this.store.collectionTree.mergeTrees(branches));
    }

    // The split: a folder owns an entry in **every** branch it stands in, and a leaf travels
    // with the branch its kind belongs to.
    splitBranches() {
      this.branches = this.store.collectionTree.splitBranches(this.entries);
      return this.branches;
    }

    sortTree(nodes) {
      nodes.sort(
        (left, right) =>
          (this.folder(left) ? 0 : 1) - (this.folder(right) ? 0 : 1) ||
          String(this.folder(left) ? left.name : this.leafLabel(left) || left.label).localeCompare(
            String(this.folder(right) ? right.name : this.leafLabel(right) || right.label),
          ) ||
          String(left?.id ?? '').localeCompare(String(right?.id ?? '')),
      );
      for (const node of nodes) if (!this.folder(node)) this.sortTree(node.children || []);
      return nodes;
    }


    // Mirror facts are read at render time, so a cold store still draws the row and a chip with no
    // record stays dim; chapter leaves inherit their study's record. Gone is proof, not absence:
    // `goneNodes` mirrors the leaf stamps a read left behind.
    refreshCaches() {
      this.recordCache = new Map();
      this.haystackCache = new Map();
      this.goneNodes = new Set();
      const walk = (nodes, parentRecord, parentGone) => {
        for (const node of nodes || []) {
          if (this.folder(node)) {
            walk(node.children, parentRecord, parentGone);
            continue;
          }
          const gone = parentGone || node?.meta?.deadAt !== undefined;
          if (gone) this.goneNodes.add(node);
          const record = node.kind == 'chapter' ? parentRecord : this.studies.get(node.id);
          this.recordCache.set(node, record);
          this.haystackCache.set(node, this.haystackFor(node, record));
          walk(node.children || [], node.kind == 'study' ? record : parentRecord, gone);
        }
      };
      walk(this.entries, undefined, false);
      // What revision of the mirror these caches answer for. The mirror lands off the critical
      // path, so a view built before it does refreshes itself - see `bookmarkView`.
      this.hayRevision = this.sync.publishRevision;
    }

    // The haystack: name + topics + description + owner + members + chapter names + chapter tag
    // values, spelled by the registry row so each kind owns its own fields.
    haystackFor(node, record) {
      if (record) {
        if (node.kind == 'chapter') {
          const chapter = record.chapters?.find((chapter) => chapter.id === node.id);
          return (chapter ? this.store.chapterHaystack(chapter) : '') + ' ' + String(node.label ?? '');
        }
        return this.registry[node.kind]?.haystack?.(record) ?? '';
      }
      // A leaf the mirror has no record for: the label and whatever `meta` captured at add time
      // are all the tree may claim to know.
      return [node.label, node.meta?.title, node.meta?.author, node.meta?.line].filter(Boolean).join(' ').toLowerCase();
    }

    // Reuse `RecordsSearchEngine.run` rather than writing a matcher - the weights and
    // `matchingChapterFields` already exist, so the textbox is the old Search tab minus its
    // form. Cached per query + mirror revision.
    async searchQuery() {
      const query = this.query.trim();
      this.terms = query ? query.toLowerCase().split(/\s+/).filter((term) => term) : [];
      if (!query) {
        this.hits = undefined;
        this.hitsQuery = undefined;
        return;
      }
      const revision = this.sync.publishRevision;
      if (this.hitsQuery == query && this.hayRevision == revision) return;
      if (this.hayRevision != revision) {
        this.hayRevision = revision;
        this.refreshCaches();
        this.hits = undefined;
      }
      const engine = recordsDbInstance?.searchEngine;
      if (!engine) return;
      const page = await engine.run({ order: 'relevant', study: { text: query } }, { cursor: 0, size: recordsDbMaxResults });
      const hits = new Map();
      for (const item of page.items) hits.set(item.studyId, item.matchingChapterFields);
      this.hits = hits;
      this.hitsQuery = query;
    }

    // Chips and textbox are one filter model - a study a chip hides is not searched either.
    passes(node) {
      if (this.filters.kind != 'all' && node.kind != this.filters.kind) return false;
      const record = this.recordCache.get(node);
      const row = this.registry[node.kind];
      // Every writeable study is already readable, so the pair the chip offers is `Writable` vs
      // `Readonly` (a leaf that can be opened but not written - "no write"), not
      // readable-vs-writable.
      if (this.filters.access != 'all' && row?.canWrite !== undefined) {
        const writable = !!row.canWrite(record);
        if (this.filters.access == 'writable' && !writable) return false;
        if (this.filters.access == 'readonly' && writable) return false;
      }
      if (this.filters.visibility != 'all' && row?.visibility !== undefined) {
        if (row.visibility(record) != this.filters.visibility) return false;
      }
      if (this.terms.length) return this.matchesQuery(node);
      return true;
    }

    matchesQuery(node) {
      const terms = this.terms;
      if (node.kind == 'study' && this.hits?.has(node.id)) return true;
      // A chapter leaf hits when its study hit and the engine named that chapter, or when its own
      // label does.
      if (node.kind == 'chapter' && this.hits?.has(node?.meta?.studyId)) {
        const fields = this.hits.get(node.meta.studyId);
        if (fields?.[node.id]) return true;
      }
      const haystack = this.haystackCache.get(node) ?? '';
      if (terms.every((term) => haystack.includes(term))) return true;
      // A leaf whose record never arrived still answers by its label - the tree never depends on a
      // fresh harvest, and the fail-soft keeps an unknown kind renderable at all.
      const label = String(node.label ?? '') + ' ' + [node.meta?.title, node.meta?.author].filter(Boolean).join(' ');
      return terms.every((term) => label.toLowerCase().includes(term));
    }


    get rows() {
      const filtering = !!this.terms.length;
      const visit = (nodes, parent) =>
        nodes.flatMap((node, index) => {
          const path = [...parent, index];
          if (!this.folder(node)) {
            if (!this.passes(node)) return [];
            return [{ entry: node, path }, ...visit(node.children || [], path)];
          }
          const children = visit(node.children || [], path);
          const row = [{ entry: node, path, shown: children.length }];
          if (this.expanded.has(node) || (filtering && children.length)) return [...row, ...children];
          return row;
        });
      return visit(this.entries, []);
    }

    // The whole tree paints: a tree taller than the dialog only grows its scrollbar, so opening
    // a folder can never move rows out of reach below the fold.
    get results() {
      return this.rows;
    }

    // The header prints one line per kind present, plus `shown / total` and the filed/database
    // counts.
    kindCounts() {
      const counts = {};
      const walk = (nodes) => {
        for (const node of nodes) {
          if (!this.folder(node) && this.passes(node)) counts[node.kind] = (counts[node.kind] || 0) + 1;
          walk(node.children || []);
        }
      };
      walk(this.entries);
      return counts;
    }

    // Gone means a read proved it: the leaf carries the stamp, or the mirror record says so. An
    // unknown kind stays fail-soft gone - the tree keeps the row and marks it, nothing is dropped.
    isGone(node) {
      if (this.goneNodes.has(node)) return true;
      const row = this.registry[node.kind];
      return row ? !!row.isDead(this.recordCache.get(node)) : true;
    }

    missingCount() {
      let missing = 0;
      const walk = (nodes) => {
        for (const node of nodes || []) {
          if (!this.folder(node) && this.isGone(node)) missing++;
          walk(node.children || []);
        }
      };
      walk(this.entries);
      return missing;
    }

    // The studies the tree holds. The local db keeps a capture only for what this names, so
    // opening a study you do not own costs a record for a row that needs one, not an unbounded
    // file - and a leaf that leaves the tree loses its capture with it.
    treeStudyIds(nodes = this.entries, ids = new Set()) {
      for (const node of nodes || []) {
        if (this.folder(node)) this.treeStudyIds(node.children, ids);
        else if (node.kind == 'study') ids.add(node.id);
        else this.treeStudyIds(node.children || [], ids);
      }
      return ids;
    }

    // A row the mirror has never seen gets its facts on hover: one read per study per page,
    // capped and spaced like the harvested pages, and the read is persisted, so the tooltip that
    // follows answers on every later page as well. A row that stays uncaptured keeps its row.
    hoverRead(node) {
      const lt = this.lichessTools;
      if (!lt.currentOptions.getValue('recordsDbCapture')) return false;
      const row = this.registry[node.kind];
      if (!row?.serviced || !row.read) return false;
      if (this.hoverReads.has(node.id) || this.hoverReads.size >= recordsDbHoverReadLimit) return false;
      this.hoverReads.add(node.id);
      const harvest = async () => {
        try {
          if (lt.net.slowMode) await lt.timeout(1000);
          else if (this.hoverReads.size > 1) await lt.timeout(recordsDbHoverReadDelayMs);
          const record = await row.read(node.id, this.signal);
          if (this.signal?.aborted) return;
          if (record?.absent) {
            node.meta = { ...node.meta ?? {}, deadAt: Date.now() };
            this.refreshCaches();
            this.onChange();
            return;
          }
          if (!record) return;
          this.sync.store(record);
          this.sync.persist(node.id);
        } catch (failure) {
          // The row stays uncaptured, and a later hover is allowed to ask again.
          this.hoverReads.delete(node.id);
        }
      };
      harvest();
      return true;
    }

    filedCount() {
      let leaves = 0;
      const walk = (nodes) => {
        for (const node of nodes || []) {
          if (!this.folder(node)) leaves++;
          walk(node.children || []);
        }
      };
      walk(this.entries);
      return leaves;
    }

    // Every folder the tree holds, in paint order - what the fold-all chip counts and acts on.
    folderNodes(nodes = this.entries, found = []) {
      for (const node of nodes || []) {
        if (this.folder(node)) {
          found.push(node);
          this.folderNodes(node.children || [], found);
        } else this.folderNodes(node.children || [], found);
      }
      return found;
    }

    // The textbox a window types into: the frame builds it once and keeps it, because a paint that
    // replaced it would take it off the page for a moment - and an input that leaves the page loses
    // the keyboard on it, so the next letter lands at the wrong end of the word.
    newFilterBox() {
      const lt = this.lichessTools;
      return lt.$('<input class="tree-filter">')
        .attr('id', this.id + '-filter')
        .attr('type', 'text')
        .attr('placeholder', lt.translator.noarg('recordsDbSearchPlaceholder'))
        .attr('maxlength', '100')
        .attr('value', this.query)
        .on('input change', async (ev) => {
          this.query = String(ev.target?.value ?? '');
          await this.searchQuery();
          this.filterChanged();
        });
    }

    // The tree host a window paints into, carrying the listeners that belong to the tree itself.
    // One listener per event lives here and answers through `rowIndex`, so a repaint replaces a
    // thousand rows without registering anything on them: per-row listeners would leave their
    // entries behind in any page-wide listener table and pin the rows they sat on.
    viewHost() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const host = $('<div class="record-list">');
      // Two presses of the same row inside the double-click window are one open gesture. The
      // browser's own `dblclick` cannot be the only answer: the first press repaints the row, and
      // a browser keys a double click on the element under the pointer, so a press that hands over
      // a new row never fires the event. The pair is read here as well, and the gesture runs on the
      // press that closes it - a plain press only selects, so the pair is what opens the row.
      const pressWindowMs = 500;
      const rowPress = new Map();
      const rowOpened = new Map();
      const openGesture = async (info) => {
        if (info.folder) this.toggle(info.entry);
        else if (!info.dead) await this.openLeaf(info.entry);
      };
      // True when this press closes a pair; a closed pair leaves no press behind, so a third press
      // is a fresh single press rather than another pair.
      const closePress = (entry, at = Date.now()) => {
        const last = rowPress.get(entry);
        if (last !== undefined && at - last < pressWindowMs) {
          rowPress.delete(entry);
          rowOpened.set(entry, at);
          if (rowOpened.size > 64) rowOpened.clear();
          return true;
        }
        rowPress.set(entry, at);
        if (rowPress.size > 64) rowPress.clear();
        return false;
      };
      // A gesture a pair already ran: a browser that does fire `dblclick` must not run it twice.
      const openedPress = (entry, at = Date.now()) => {
        const opened = rowOpened.get(entry);
        return opened !== undefined && at - opened < pressWindowMs;
      };
      // A row click selects; the chips a row wears answer first, and a click that hits a link,
      // a control or the textbox belongs to whatever owns it.
      const rowClick = async (ev) => {
        const info = this.rowTarget(ev);
        if (!info) return;
        if (info.chip == 'toggle') return this.toggle(info.entry);
        if (info.chip == 'retry') return this.error?.retry?.();
        if (info.chip == 'open') {
          if (ev.button || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault?.();
          await this.openLeaf(info.entry);
          return;
        }
        if (!info.row || info.chip) return;
        const hit = $(ev.target);
        if (hit.closest('a').length || hit.closest('button').length || hit.closest('input').length || hit.closest('form').length) return;
        if (closePress(info.entry)) {
          await openGesture(info);
          return;
        }
        this.select(info.entry, ev);
      };
      const rowDoubleClick = async (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row || info.chip) return;
        if ($(ev.target).closest('button').length) return;
        ev.preventDefault?.();
        if (openedPress(info.entry)) return;
        await openGesture(info);
      };
      const rowKeyDown = async (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row || info.chip) return;
        if ($(ev.target).closest('a').length || $(ev.target).closest('button').length || $(ev.target).closest('input').length) return;
        if (ev.key === ' ') {
          ev.preventDefault?.();
          this.select(info.entry, ev);
        } else if (ev.key === 'Enter') {
          ev.preventDefault?.();
          await openGesture(info);
        }
      };
      const rowDragStart = (ev) => {
        const info = this.rowTarget(ev);
        if (!ev.dataTransfer || !info?.row || info.chip || info.dead) return;
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData(recordsDragType, JSON.stringify(this.drag(info.entry)));
      };
      const rowMouseOver = (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row || info.chip) return;
        if (info.preview) {
          // A row arriving spends a hide the pointer left on a nearby tooltip, then shows this
          // row's chapters - one gesture, one tooltip.
          cancelPopupHide();
          showStudyPopup(info.node);
        } else if (info.cold) this.hoverRead(info.entry);
      };
      const rowMouseOut = (ev) => {
        const info = this.rowTarget(ev);
        if (info?.row && info.preview && !info.chip) schedulePopupHide();
      };
      return host
        .on('dragend', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dropInto(ev, info.row, info.node);
        })
        .on('dragend', clearDrop)
        .on('dragleave', clearDrop)
        .on('dragover', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dragOver(ev, info.row, info.node);
        })
        .on('drop', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dropInto(ev, info.row, info.node);
        })
        .on('dragstart', rowDragStart)
        .on('click', rowClick)
        .on('dblclick', rowDoubleClick)
        .on('keydown', rowKeyDown)
        .on('keydown', async (ev) => {
          if ($(ev.target).closest('input').length) return;
          if (ev.key === 'Delete') {
            ev.preventDefault?.();
            await this.deleteSelected();
          } else if (ev.key === 'Home' || ev.key === 'End') {
            const rows = this.results.map((row) => row.entry);
            if (!rows.length) return;
            ev.preventDefault?.();
            this.select(rows[ev.key == 'Home' ? 0 : rows.length - 1], ev);
          } else if ((ev.ctrlKey || ev.metaKey) && ev.key === 'a') {
            ev.preventDefault?.();
            for (const row of this.results) this.selected.add(row.entry);
            this.onChange();
          }
        })
        .on('mouseover', rowMouseOver)
        .on('mouseout', rowMouseOut);
    }

    filterChanged() {
      this.revision++;
      this.onChange();
    }

    // The selection model stays: identity of the entry object is the key, a folder selects with
    // its branch.
    select(entry, event) {
      const additive = event?.ctrlKey || event?.metaKey;
      if (event?.shiftKey && this.anchor) {
        const entries = this.rows.map((row) => row.entry);
        const start = entries.indexOf(this.anchor);
        const end = entries.indexOf(entry);
        if (!additive) this.selected.clear();
        for (const selected of entries.slice(Math.min(start, end), Math.max(start, end) + 1)) this.selected.add(selected);
      } else {
        const selected = this.selected.has(entry);
        if (!additive) this.selected.clear();
        if (additive && selected) this.selected.delete(entry);
        else this.selected.add(entry);
        this.anchor = entry;
      }
      this.onChange();
    }

    clearSelection() {
      this.anchor = undefined;
      if (!this.selected.size) return;
      this.selected.clear();
      this.onChange();
    }

    toggle(folder) {
      if (this.expanded.has(folder)) this.expanded.delete(folder);
      else this.expanded.add(folder);
      this.onChange();
    }

    // One press for every folder, kept in the caret's reading: anything still closed means the
    // press opens the tree, everything open means the press folds it back.
    toggleAllExpanded() {
      const folders = this.folderNodes();
      if (!folders.length) return;
      if (folders.every((folder) => this.expanded.has(folder))) this.expanded.clear();
      else for (const folder of folders) this.expanded.add(folder);
      this.onChange();
    }

    // The shape the user left, written into the window blob at `freeze`: each row is the chain of
    // names and ids that leads to it, so the next page finds the same row whatever the tree did to
    // its order in the meantime - a drag or a rename re-sorts with the record names the previous
    // page had never seen, and a position would land the folder on the row that took its slot. A
    // row that names nothing falls back to its slot in its parent, so a chain always exists.
    shapeChains(nodes) {
      const chains = new Map();
      const walk = (list, chain) => list.forEach((node, index) => {
        const named = this.folder(node) ? node.name : node.id;
        const key = named === undefined || named === '' ? 'slot' + index : named;
        const full = chain.concat([key]);
        chains.set(node, full);
        walk(node.children || [], full);
      });
      walk(nodes, []);
      return chains;
    }

    // Only a tree that has been read has a shape to hand over. A page that opens the window
    // before its content is read has no opinion, so it must not answer with an empty shape -
    // that would spend the shape the page before left in the blob.
    frozenView() {
      if (!this.loaded) return undefined;
      const chains = this.shapeChains(this.entries);
      const expanded = [...this.expanded].map((node) => chains.get(node)).filter(Boolean);
      const selected = [...this.selected].map((node) => chains.get(node)).filter(Boolean);
      // A row of the shape that is not in the tree any more is dropped from the write: the next page
      // cannot name it, and a shape made only of such rows writes nothing at all. The line spells the
      // rows that went, so a live page can see whether its own state drifted or the write did.
      const missing = [...this.expanded, ...this.selected].filter((node) => !chains.has(node));
      if (missing.length)
        this.logState('Old shape rows dropped', [missing.length, this.expanded.size + this.selected.size].join('/') + ' ' + missing.map((node) => String(node?.name ?? node?.id ?? node?.kind ?? '?')).join(','));
      return { expanded, selected };
    }

    // The other half of the round trip: the walk names the rows the rebuilt tree has by the same
    // chains, and only the ones the blob still carries come back - a chain the tree no longer has
    // simply leaves that folder collapsed. The count goes to the log because a page can only be
    // checked where it ran: a short number here says the shape is being lost in the page, not in
    // this tool.
    restoreView(storedRows) {
      const view = (storedRows || []).find((row) => row?.kind === this.kind)?.view;
      const usable = (list) => Array.isArray(list) ? list.filter((chain) => Array.isArray(chain)) : [];
      const openFolders = usable(view?.expanded);
      const keptRows = usable(view?.selected);
      const rows = (storedRows || []).filter((row) => row?.kind === this.kind);
      // A row for this tab with no shape in it means the page that wrote it had no tree read yet,
      // so the shape it carried was never put down - the carry in `saveWindows` is what answers
      // for that page, and this line says when it did not.
      if (rows.length && !view)
        this.logState('Shape missing from the blob', [this.kind, rows.length].join(' '));
      const chains = this.shapeChains(this.entries);
      const expanded = new Set();
      const selected = new Set();
      chains.forEach((chain, node) => {
        const key = chain.join(' / ');
        if (openFolders.some((record) => record.join(' / ') === key)) expanded.add(node);
        if (keptRows.some((record) => record.join(' / ') === key)) selected.add(node);
      });
      if (openFolders.length && expanded.size < openFolders.length)
        this.logState('Tree folders lost', [openFolders.length - expanded.size, openFolders.length].join('/'));
      this.expanded = expanded;
      this.selected = selected;
    }

    setSelect(on) {
      this.selectMode = !!on;
      this.onChange();
      return this.selectMode;
    }


    at(path) {
      let nodes = this.entries;
      let entry;
      for (const index of path) {
        entry = nodes[index];
        nodes = entry?.children ?? [];
      }
      return entry;
    }

    contains(entry, target) {
      return entry === target || (entry?.children || []).some((child) => this.contains(child, target));
    }

    siblings(target, nodes = this.entries) {
      if (nodes.includes(target)) return nodes;
      for (const entry of nodes) {
        const nested = this.siblings(target, entry?.children || []);
        if (nested) return nested;
      }
      return undefined;
    }

    drag(entry) {
      if (!this.selected.has(entry)) this.select(entry);
      const paths = [];
      const visit = (nodes, parent) => {
        nodes.forEach((node, index) => {
          const path = [...parent, index];
          if (this.selected.has(node)) paths.push(path);
          else visit(node?.children || [], path);
        });
      };
      visit(this.entries, []);
      return { kind: 'tree', paths };
    }

    // The row a hit element falls on: the row itself, one of its children, or one of the chips a
    // row wears. A press lands on the icon inside a chip rather than on the chip, so the answer
    // climbs to the nearest button before it looks for the row.
    rowTarget(ev) {
      if (!ev || !ev.target) return undefined;
      const hit = this.lichessTools.$(ev.target);
      if (!hit.length) return undefined;
      const direct = this.rowIndex.get(hit[0]);
      if (direct) return direct;
      const button = hit.closest('button');
      if (button.length) {
        const chip = this.rowIndex.get(button[0]);
        if (chip) return chip;
      }
      const li = hit.closest('li');
      return li.length ? this.rowIndex.get(li[0]) : undefined;
    }

    // The drop half of a drag: the upper half of a row inserts before it, the lower half of a
    // folder drops inside it, otherwise after the row next sibling. The node is the element the
    // marker sits on - the row the pointer fell on, or the marker at the end of the tree.
    insertionTarget(ev, row, node) {
      if (!row) return { parent: undefined, before: undefined, position: 'before' };
      const { entry, path } = row;
      const parent = path.length > 1 ? this.at(path.slice(0, -1)) : undefined;
      const rect = node?.getBoundingClientRect?.() || { top: 0, height: 0 };
      if (ev.clientY < rect.top + rect.height / 2) return { parent, before: entry, position: 'before' };
      if (!this.folder(entry)) return { parent, before: entry, position: 'after' };
      // A folder with nothing in it has no first child to land before, so the drop appends inside
      // it - the half-rule is the same, only the marker it names is missing.
      return { parent: entry, before: entry.children?.[0], position: 'inside' };
    }

    carriedPayload(ev) {
      const lt = this.lichessTools;
      const transfer = ev?.dataTransfer;
      if (!transfer || !(transfer.types || []).includes(recordsDragType)) return undefined;
      const raw = transfer.getData(recordsDragType);
      return raw ? typeof raw == 'string' ? lt.jsonParse(raw) : raw : undefined;
    }

    dragOver(ev, row, node) {
      const transfer = ev?.dataTransfer;
      if (!transfer || !(transfer.types || []).includes(recordsDragType)) return;
      ev.preventDefault?.();
      ev.stopPropagation?.();
      clearDrop();
      const target = this.insertionTarget(ev, row, node);
      const marked = this.lichessTools.$(node);
      if (marked.length) marked.attr('data-bookmark-drop', target.position);
      transfer.dropEffect = transfer.effectAllowed === 'copy' ? 'copy' : 'move';
    }

    dropInto(ev, row, node) {
      const payload = this.carriedPayload(ev);
      if (!payload || ev._recordsDbDrop) return;
      ev.preventDefault?.();
      ev.stopPropagation?.();
      ev._recordsDbDrop = true;
      clearDrop();
      const target = this.insertionTarget(ev, row, node);
      this.drop(payload, target.parent, target.before);
    }

    // The containment rule, spelled once: only a leaf that names its parent may sit inside a
    // leaf, and only inside the leaf it names. Everything else may sit in a folder or at the
    // root, which is a destination too, and folders stay kind-agnostic.
    canAttach(node, parent) {
      if (this.folder(node) || !parent) return true;
      if (this.folder(parent)) return true;
      const parentId = node?.meta?.studyId || node?.meta?.blogId;
      return !!parentId && parent.id === parentId;
    }

    // The only outright rejection (a folder nested inside one of its own descendants) plus the
    // two containment checks above.
    canDrop(payload, parent) {
      if (payload?.paths)
        return payload.paths.every((path) => !this.contains(this.at(path), parent)) &&
          payload.paths.every((path) => this.canAttach(this.at(path), parent));
      return (payload?.nodes || []).every((node) => this.canAttach(node, parent));
    }

    drop(payload, parent, before) {
      if (!this.canDrop(payload, parent)) return;
      let incoming;
      if (payload?.paths) {
        incoming = payload.paths.map((path) => this.at(path));
        if (incoming.includes(before)) return;
        for (const entry of incoming) {
          const siblings = this.siblings(entry);
          const at = siblings ? siblings.indexOf(entry) : -1;
          if (at >= 0) siblings.splice(at, 1);
        }
      } else {
        incoming = payload?.nodes || [];
      }
      const siblings = parent?.children ?? this.entries;
      siblings.splice(before ? siblings.indexOf(before) : siblings.length, 0, ...incoming);
      if (parent) this.expanded.add(parent);
      this.selected.clear();
      for (const entry of incoming) this.selected.add(entry);
      this.sortTree(this.entries);
      this.save();
    }

    // One save per mutation, and it writes **each branch** through the store so filing a study
    // rewrites the study branch only - the lock the store holds is that branch's key, never the
    // whole tree.
    save() {
      this.onChange();
      // A save with nothing loaded yet would prune everything, so only name the tree when there
      // is a tree to name - every successful load prunes on its own anyway.
      if (this.entries?.length) this.sync.setTreeIds(this.treeStudyIds()).catch(() => null);
      this.writes = this.writes.then(async () => {
        const tree = this.store.collectionTree;
        const branches = this.splitBranches();
        try {
          for (const branch of tree.blobKinds) await tree.writeTree(branch, branches.get(branch) || []);
          this.error = undefined;
        } catch (failure) {
          this.error = { message: 'Unable to save the tree', retry: () => this.save() };
        }
        this.onChange();
      });
      return this.writes;
    }



    // Add is one flow - file the page object, harvest it so the new row is searchable, save once
    // - and it widens to "add whatever this page is", in resolver order: page-init first, then
    // the path parse.
    resolvePageLeaf() {
      const lt = this.lichessTools;
      const init = lt.pageInitData;
      const initStudy = init?.study;
      // `lt.pageInitData` is confirmed on study pages only, so the path parse is the fallback
      // rung.
      if (initStudy?.id)
        return { kind: 'study', id: initStudy.id, label: initStudy.name || '' };
      const studyMatch = /^\/study\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?/.exec(lt.location?.pathname || '');
      if (studyMatch) {
        const record = this.studies.get(studyMatch[1]);
        return { kind: 'study', id: studyMatch[1], label: record?.studyName || '' };
      }
      const analysis = lt.lichess?.analysis?.study;
      const analysisId = analysis?.data?.id;
      if (analysisId) return { kind: 'study', id: analysisId, label: analysis?.data?.name || '' };
      return undefined;
    }

    findLeaf(kind, id, nodes = this.entries) {
      for (const node of nodes) {
        if (node.kind == kind && node.id === id) return node;
        const found = this.findLeaf(kind, id, node.children || []);
        if (found) return found;
      }
      return undefined;
    }

    canAdd() {
      return !this.selectMode && !!this.resolvePageLeaf();
    }

    async addCurrentStudy() {
      const leaf = this.resolvePageLeaf();
      if (!leaf) {
        this.message = 'nothingToFile';
        return false;
      }
      const selected = [...this.selected];
      const parent = selected.length === 1 && this.folder(selected[0]) ? selected[0] : undefined;
      // Adding a study that is already in the tree **moves** the leaf - never a duplicate.
      const existing = this.findLeaf(leaf.kind, leaf.id);
      if (existing) {
        const siblings = this.siblings(existing);
        const at = siblings ? siblings.indexOf(existing) : -1;
        if (at >= 0) siblings.splice(at, 1);
        (parent?.children ?? this.entries).push(existing);
        this.selected.clear();
        this.selected.add(existing);
        this.sortTree(this.entries);
        this.save();
        return true;
      }
      (parent?.children ?? this.entries).push(leaf);
      if (parent) this.expanded.add(parent);
      this.sortTree(this.entries);
      this.selected.clear();
      this.selected.add(leaf);
      const row = this.registry[leaf.kind];
      let captured;
      if (row?.serviced && row?.read) {
        try {
          const record = await row.read(leaf.id);
          if (record?.absent) {
            leaf.meta = { ...leaf.meta ?? {}, deadAt: Date.now() };
            this.message = 'recordsDbStudyGone';
          } else if (record) {
            this.sync.store(record);
            captured = leaf;
          }
        } catch (failure) {
          this.message = 'addHarvestFailed';
        }
      }
      this.refreshCaches();
      // The save names the leaf in the tree first, only then is the read worth persisting - a
      // capture the tree does not name yet would be pruned straight away.
      this.save();
      if (captured) this.sync.persist(captured.id);
      this.message = 'addedStudy';
      return true;
    }

    // New folder asks the page for the name - `lt.uiApi.dialog.prompt` is the precedent other
    // tools use. A page with no dialog service (or a cancelled prompt) keeps the default name,
    // so the folder is still created rather than the gesture ending half-done.
    async folderName(fallback) {
      const lt = this.lichessTools;
      const dialog = lt.uiApi?.dialog;
      if (!dialog?.prompt) return fallback;
      try {
        const asked = await dialog.prompt(lt.translator.noarg('recordsDbFolderNamePrompt'), fallback);
        return String(asked ?? '').trim() || fallback;
      } catch (ignored) {
        return fallback;
      }
    }

    async createFolder(name) {
      const selected = [...this.selected];
      const parent = selected.length === 1 && this.folder(selected[0]) ? selected[0] : undefined;
      const named = String(name || '').trim() || await this.folderName('New folder');
      const folder = { name: named, children: [] };
      (parent?.children ?? this.entries).push(folder);
      if (parent) this.expanded.add(parent);
      this.selected.clear();
      this.selected.add(folder);
      this.sortTree(this.entries);
      this.save();
      return folder;
    }

    // One leaf drops that leaf; one folder drops the folder and its whole subtree. The prune
    // already did it top-down and rebuilt each folder children, so an emptied folder stays
    // empty.
    removeSelected() {
      const prune = (nodes) =>
        nodes
          .filter((node) => !this.selected.has(node))
          .map((node) => {
            if (this.folder(node)) node.children = prune(node.children || []);
            return node;
          });
      this.entries = prune(this.entries);
      this.selected.clear();
      this.save();
    }

    // The number handed to the confirm is the leaves + folders being unfiled.
    countSelected() {
      const subtree = (node) =>
        (this.folder(node) ? 1 : 0) + (node?.children || []).reduce((sum, child) => sum + subtree(child), 0);
      let leaves = 0;
      let folders = 0;
      for (const node of this.selected) {
        if (this.folder(node)) folders += subtree(node);
        else leaves++;
      }
      return { leaves, folders, total: leaves + folders };
    }

    // `dialog.confirm` is the mechanism other option tools use, and its reachability from a
    // study-page click handler is unverified - so when the page offers no dialog service the
    // fallback is "press again": the first press arms a one-shot 5s bar, the second commits.
    async confirmCount(which) {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const counts = this.countSelected();
      if (!counts.total) return false;
      const dialog = lt.uiApi?.dialog;
      if (dialog?.confirm) {
        try {
          return !!await dialog.confirm(trans.pluralSame('recordsDbDeleteQuestion', counts.total));
        } catch (ignored) {}
      }
      const now = Date.now();
      if (this.confirmBar?.at && now - this.confirmBar.at < 5000) {
        this.confirmBar = undefined;
        return true;
      }
      this.confirmBar = { at: now, count: counts.total };
      this.onChange();
      return false;
    }

    async deleteSelected() {
      if (!(await this.confirmCount('delete'))) return false;
      const counts = this.countSelected();
      this.removeSelected();
      this.message = 'removedCount';
      this.messageCount = counts.total;
      return true;
    }

    // Restore replaces **per branch** after one confirm that quotes the incoming counts. The
    // counts come from the same parse that writes the branches, so what the user saw is what
    // landed.
    previewRestore(text) {
      return this.store.collectionTree.parseTree(text);
    }

    // One flow feeds the entry path the backup rack offers - the `<input type="file">` picker -
    // so the IDB blob and the downloaded file read through one parser.
    async restoreFromText(text) {
      const preview = this.previewRestore(text);
      if (!preview) {
        this.message = 'restoreFailed';
        this.onChange();
        return false;
      }
      this.restorePreview = preview;
      this.onChange();
      if (!(await this.confirmRestore(text))) return false;
      return await this.applyRestore(text);
    }

    async confirmRestore(text) {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const dialog = lt.uiApi?.dialog;
      if (dialog?.confirm) {
        try {
          return !!await dialog.confirm(trans.noarg('recordsDbRestoreQuestion'));
        } catch (ignored) {}
      }
      const now = Date.now();
      if (this.restoreBar?.at && now - this.restoreBar.at < 5000) {
        this.restoreBar = undefined;
        return true;
      }
      this.restoreBar = { at: now };
      this.onChange();
      return false;
    }

    // The gesture, the open chip and Enter all go through the row `openUrl`. Before it navigates,
    // a study leaf leaves the one-shot hand-off naming the study it will land on; `RecordsDbCtrl.handoff`
    // spends it. A kind that is not a study has no study to name, so it leaves nothing.
    async openLeaf(node) {
      const row = this.registry[node.kind];
      const href = row?.openUrl?.(node.id, node.meta);
      if (!href) return false;
      const lt = this.lichessTools;
      const studyId = node.kind == 'study' ? node.id : node.meta?.studyId;
      if (studyId) lt.storage.set(treeHandoffKey, { studyId, at: Date.now() }, { session: true });
      if (node.kind == 'study' || node.kind == 'chapter') {
        // The honest degradation stays: same study switches chapter in place, another study
        // navigates.
        const navigation = recordsDbInstance?.navigation;
        if (!navigation) return false;
        await navigation.load(node.kind == 'study' ? node.id : node.meta?.studyId, node.kind == 'chapter' ? node.id : undefined);
      } else {
        try {
          lt.location.set(href);
        } catch (ignored) {
          return false;
        }
      }
      return true;
    }


    async downloadTree() {
      const lt = this.lichessTools;
      const userId = lt.getUserId();
      const text = this.store.collectionTree.serializeTree(this.entries);
      const filename = (userId ? userId + '_' : '') + 'lichessToolsRecordsDbTree_' + lt.toTimeString(new Date()) + '.json';
      try {
        await lt.download(text, filename, 'application/json');
        this.message = 'downloadedTree';
        return text;
      } catch (ignored) {
        return undefined;
      }
    }

    async applyRestore(text) {
      const parsed = await this.store.collectionTree.readTree(text);
      if (!parsed) {
        this.message = 'restoreFailed';
        return undefined;
      }
      this.branches = new Map(this.store.collectionTree.trees);
      this.entries = this.sortTree(parsed.tree);
      this.refreshCaches();
      this.selected.clear();
      this.expanded.clear();
      this.revision++;
      this.onChange();
      this.message = 'restoredTree';
      return parsed;
    }


    // Rename is a chip, not an inline edit - the name comes from the same dialog prompt New
    // folder asks through, defaulted to the name the folder already carries, so an accepted
    // prompt is the only thing that changes and a mis-click cannot eat a name.
    editName(node, name) {
      if (!this.folder(node)) return false;
      node.name = String(name || '').trim() || node.name;
      this.sortTree(this.entries);
      this.save();
      return true;
    }

    async renameFolder(folder) {
      if (!this.folder(folder)) return false;
      return this.editName(folder, await this.folderName(folder.name));
    }


  }



  class RecordsSearchEngine {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
    }

    // 10 000 studies score well inside the 250 ms budget - one lowercased substring test per
    // field, and the chapter scan only runs when the query can reach a chapter at all.
    hit(needle, haystack) {
      const term = String(needle ?? '').trim().toLowerCase();
      return term.length > 0 && String(haystack ?? '').toLowerCase().includes(term);
    }

    chapterTagValues(chapter) {
      const values = {};
      for (const entry of chapter.tags || []) {
        if (!Array.isArray(entry) || entry[1] === undefined) continue;
        values[String(entry[0] || '').toLowerCase()] = entry[1];
      }
      const players = chapter.players;
      if (players && players.length > 1 && values.white === undefined && values.black === undefined) {
        values.white = players[0]?.name;
        values.black = players[1]?.name;
      }
      return values;
    }

    // The fields a chapter matched, spelled the way `studyMatchView` looks chips up by: `name`,
    // `description`, `tags.<tagName>` - `tags.white`/`tags.black` carry the player that actually
    // matched, so the chip lands under the colour the chapter plays that player in.
    chapterFields(chapter, chapterQuery, studyText) {
      const fields = new Set();
      const chapterText = chapterQuery?.text;
      if (this.hit(chapterText, chapter.name) || this.hit(studyText, chapter.name) || this.hit(chapterQuery?.name, chapter.name)) fields.add('name');
      if (this.hit(chapterText, chapter.description) || this.hit(studyText, chapter.description) || this.hit(chapterQuery?.description, chapter.description)) fields.add('description');
      const tags = chapterQuery?.tags;
      if (tags) {
        const values = this.chapterTagValues(chapter);
        const colourOf = (slot) => tags['color' + slot] === 'white' ? ['white'] : tags['color' + slot] === 'black' ? ['black'] : ['white', 'black'];
        const pair = (name, slot, suffix) => {
          const wanted = tags[name];
          if (!wanted) return;
          for (const colour of colourOf(slot)) if (this.hit(wanted, values[colour + suffix])) fields.add('tags.' + (colour + suffix));
        };
        pair('player1', 1, '');
        pair('player2', 2, '');
        pair('fideId1', 1, 'fideid');
        pair('fideId2', 2, 'fideid');
        for (const name of ['variant', 'eco', 'opening', 'event']) if (this.hit(tags[name], values[name])) fields.add('tags.' + name);
        if (this.hit(tags.variant, chapter.setup?.variant?.name) || this.hit(tags.variant, chapter.setup?.variant?.key)) fields.add('tags.variant');
      }
      return [...fields];
    }

    // Weights: name 8, topics 4, description 2, each chapter 1.
    matchStudy(study, studyQuery, chapterQuery) {
      const studyText = studyQuery?.text;
      const topics = (study.topics || []).join(', ');
      let score = 0;
      const fields = {};
      if (this.hit(studyText, study.studyName) || this.hit(studyQuery?.name, study.studyName)) score += 8;
      if (this.hit(studyText, topics) || this.hit(studyQuery?.topics, topics)) score += 4;
      if (this.hit(studyText, study.description) || this.hit(studyQuery?.description, study.description)) score += 2;
      if (this.hit(studyQuery?.owner, study.owner?.name || study.owner?.id || study.ownerId)) score += 1;
      const members = (study.members || []).map((entry) => entry.user?.name || entry.user?.id || entry.name).join(', ');
      if (this.hit(studyQuery?.member, members)) score += 1;
      const chapterLevel = !!chapterQuery && (chapterQuery.text || chapterQuery.name || chapterQuery.description || chapterQuery.tags);
      if (chapterLevel || studyText) {
        for (const chapter of study.chapters || []) {
          const matched = this.chapterFields(chapter, chapterQuery, studyText);
          if (!matched.length) continue;
          score += 1;
          fields[chapter.id || chapter.name] = matched;
        }
      }
      if (!score) return undefined;
      return { score, fields };
    }
    async run(search, page, signal) {
      const lt = this.lichessTools;
      const cursor = Math.max(0, page?.cursor ?? 0);
      const size = Math.max(1, page?.size ?? 50);
      const ceiling = recordsDbMaxResults;
      if (signal?.aborted) return { items: [], nextCursor: cursor };
      const { order, study: studyQuery, chapter: chapterQuery } = search;
      const now = Date.now();
      const candidates = [];
      let visited = 0;
      for (const study of this.store.syncCtrl.studies.values()) {
        if (visited >= ceiling) break;
        visited++;
        if (study.recordsDbExcluded) continue;
        const matched = this.matchStudy(study, studyQuery, chapterQuery);
        if (!matched) continue;
        const ageHours = (now - (study.createdAt ?? study.updatedAt ?? now)) / 3600000;
        candidates.push({
          study,
          score: matched.score,
          hot: (study.likes ?? 0) / Math.max(1, ageHours + 2),
          createdAt: study.createdAt ?? 0,
          updatedAt: study.updatedAt ?? 0,
          likes: study.likes ?? 0,
          fields: matched.fields,
        });
      }
      const tie = (left, right) => (left.studyId < right.studyId ? 1 : left.studyId > right.studyId ? -1 : 0);
      const comparators = {
        hot: (left, right) => right.hot - left.hot || tie(left, right),
        newest: (left, right) => right.createdAt - left.createdAt || tie(left, right),
        oldest: (left, right) => left.createdAt - right.createdAt || tie(left, right),
        updated: (left, right) => right.updatedAt - left.updatedAt || tie(left, right),
        popular: (left, right) => right.likes - left.likes || tie(left, right),
        alphabetical: (left, right) => String(left.studyName).localeCompare(String(right.studyName)) || tie(left, right),
      };
      candidates.sort(comparators[order] ?? ((left, right) => right.score - left.score || right.hot - left.hot || tie(left, right)));
      const items = candidates.slice(cursor, cursor + size).map((candidate) => ({
        ...candidate.study,
        ...(Object.keys(candidate.fields).length ? { matchingChapterFields: candidate.fields } : {}),
      }));
      const done = cursor + items.length >= candidates.length;
      if (lt.sleep) await lt.sleep(0);
      if (signal?.aborted) return { items: [], nextCursor: cursor };
      return { items, nextCursor: done ? null : cursor + items.length };
    }
  }





  class RecordsNavigation {

    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.pending;
    }

    async load(studyId, chapterId, complete) {
      const lt = this.lichessTools;
      if (!/^[a-zA-Z0-9]{8}$/.test(studyId || '')) return;
      if (!/^[a-zA-Z0-9]{8}$/.test(chapterId || '')) chapterId = undefined;
      this.pending?.abort();
      const AbortControllerClass = (lt.global.AbortController || AbortController);
      const pending = this.pending = new AbortControllerClass();
      const analysis = lt.lichess?.analysis;
      const study = analysis?.study;
      const sameStudy = study && study.data?.id === studyId;
      try {
        if (sameStudy && chapterId) study.setChapter(chapterId);
        else if (!sameStudy) lt.location.set('/study/' + studyId + (chapterId ? '/' + chapterId : ''));
      } catch (e) {
        if (complete) complete(new Error('records navigation failed: ' + e));
        return;
      }
      if (pending.signal.aborted) return;
      this.pending = undefined;
      complete?.();
    }
  }


  function studyLink(study, position) {
    const href = '/study/' + study.studyId + (position?.chapterId ? '/' + position.chapterId : '');
    return {
      href,
      navigate: () => recordsDbInstance.navigation.load(study.studyId, position?.chapterId),
    };
  }



  const popupId = 'lichessTools-recordsContentPreview';
  const popupPreviews = new WeakMap();
  // The chapter links a tooltip shows: the tooltip answers a click through this, so a tooltip
  // rebuilt on every hover registers one handler for itself rather than one per chapter.
  const popupLinks = new WeakMap();
  // The pointer leaves a side for one pointer move before it enters the other, so a hide is
  // scheduled and cancelled rather than run. See `schedulePopupHide` below.
  const popupLeaveMs = 150;
  // The anchor whose tooltip is visible right now, and the hide a `mouseout` scheduled
  let popupShown = null;
  let hideTimeout = null;
  // The tree revision that owns a row tooltip - see the row anchor below
  let treePaint = null;

  function popupData(items, title) {
    if (!items?.length && !title) return undefined;
    return { items, title, attrs: { tabindex: '0', 'data-popup': popupId } };
  }

  function popupNode() {
    const lt = recordsDbInstance?.lichessTools;
    if (!lt) return undefined;
    const found = lt.$('#' + popupId);
    if (found.length) return found;
    const body = lt.$('body');
    if (!body.length) return undefined;
    const fresh = lt.$('<div id="' + popupId + '">');
    // The tooltip is a reading surface, not a decoration - while the pointer sits inside it the
    // tooltip stays up (that is what lets the wheel scroll a chapter list longer than the box),
    // and leaving the tooltip hides the tooltip the pointer just left.
    fresh
      .on('click', (ev) => {
        const link = popupLinks.get(ev.target);
        if (!link) return;
        const { entry, anchor } = link;
        if (ev.button || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || !entry.navigate) return;
        ev.preventDefault();
        hideStudyPopup(anchor);
        entry.navigate();
      })
      .on('mouseover mousemove', () => {
        // The row's `mouseout` fired first and scheduled the hide; arriving here spends it.
        cancelPopupHide();
        if (popupShown) showStudyPopup(popupShown);
      })
      .on('mouseout', () => schedulePopupHide());
    return fresh.appendTo(body);
  }

  function showStudyPopup(anchor, items, title) {
    const lt = recordsDbInstance?.lichessTools;
    if (!lt) return;
    const anchors = lt.$(anchor);
    if (!anchors.length) return;
    const node = anchors[0];
    const preview = popupPreviews.get(node);
    items ??= preview?.items;
    title ??= preview?.title;
    if (!items?.length && !title) return;
    const popup = popupNode();
    if (!popup) return;
    const bounds = node?.getBoundingClientRect?.();
    if (!bounds) return;
    popupShown = node;
    const innerHeight = lt.global.window?.innerHeight || 0;
    // The box is a body child, so these are viewport coordinates: it hangs under the row and is
    // clamped to the page. A floor of 8rem is what gives the wheel something to scroll - a box as
    // tall as the gap under a low row is a scrollbar over three lines.
    const boxHeight = Math.min(
      Math.max(160, innerHeight - bounds.bottom - 12),
      Math.max(160, innerHeight - 16),
    );
    const top = Math.min(bounds.bottom + 4, Math.max(8, innerHeight - boxHeight - 12));
    popup
      .attr('class', 'record-popup-show ' + (title ? 'popup-se' : 'popup-s'))
      .attr(
        'style',
        'max-height:' + boxHeight + 'px;top:' + top + 'px;left:' + (bounds.left + (bounds.width ?? 0) / 2) + 'px;',
      );
    popup.empty();
    if (title) popup.append(lt.$('<strong>').text(title)).append(lt.$('<hr>'));
    const list = lt.$('<ul>');
    for (const entry of items ?? []) {
      const item = lt.$('<li>');
      if (entry.href) {
        const link = lt.$('<a>').attr('href', entry.href).text(entry.name);
        popupLinks.set(link[0], { entry, anchor: node });
        item.append(link);
      } else item.text(entry.name);
      list.append(item);
    }
    popup.append(list);
  }

  // A tooltip does not hide on the first `mouseout`: the pointer crossing from a row into the
  // tooltip fires the row's `mouseout` and the tooltip's own `mouseover` in the same gesture, and
  // a hide that lands between them is what makes the chapter list unreachable - no pointer can get
  // to it, so nothing can scroll it. Either side schedules a hide instead, and a `mouseover` on
  // either side spends it. The window left is one pointer move, never a readable one.
  function schedulePopupHide() {
    const lt = recordsDbInstance?.lichessTools;
    if (!lt || !popupShown || hideTimeout) return;
    hideTimeout = lt.global.setTimeout(() => {
      hideTimeout = null;
      hideStudyPopup(popupShown);
    }, popupLeaveMs);
  }

  function cancelPopupHide() {
    if (!hideTimeout) return;
    const lt = recordsDbInstance?.lichessTools;
    if (lt) lt.global.clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  function hideStudyPopup(anchor) {
    cancelPopupHide();
    const lt = recordsDbInstance?.lichessTools;
    if (!lt || !popupShown) return;
    if (anchor) {
      // Only the anchor that owns the tooltip may take it away - a second row's focusout must not
      // hide the tooltip another row is still reading.
      const node = lt.$(anchor).eq(0)?.[0];
      if (!node || popupShown !== node) return;
    }
    popupShown = undefined;
    const popup = lt.$('#' + popupId).eq(0);
    if (popup) popup.attr('class', 'record-popup-hide');
  }



  function studyPublicIcon(entry) {
    if (!entry || entry.visibility !== 'public') return undefined;
    const lt = recordsDbInstance.lichessTools;
    const $ = lt.$;
    return $('<span class="record-public">')
      .attr('title', lt.translator.noarg('recordsDbPublicStudy'))
      .attr('data-icon', lt.icon.Meridians);
  }



  function matchRanges(text, terms, context = 0) {
    const lower = String(text ?? '').toLowerCase();
    const ranges = [];
    for (const term of terms) {
      const query = String(term ?? '').trim().toLowerCase();
      if (!query) continue;
      let index = lower.indexOf(query);
      while (index >= 0) {
        ranges.push([Math.max(0, index - context), Math.min(String(text ?? '').length, index + query.length + context)]);
        index = lower.indexOf(query, index + 1);
      }
    }
    const merged = [];
    for (const range of ranges.sort((left, right) => left[0] - right[0])) {
      const previous = merged[merged.length - 1];
      if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
      else merged.push(range);
    }
    return merged;
  }



  function highlightMatch(text, terms) {
    const $ = recordsDbInstance.lichessTools.$;
    const source = String(text ?? '');
    const parts = [];
    let offset = 0;
    for (const [start, end] of matchRanges(source, terms)) {
      if (start > offset) parts.push($('<span>').text(source.slice(offset, start)));
      parts.push($('<mark>').text(source.slice(start, end)));
      offset = end;
    }
    if (source.length > offset) parts.push($('<span>').text(source.slice(offset)));
    return parts;
  }





  // A drop marker is a claim one row makes for the moment it is dragged over; only one row may hold
  // it, so every marker on the page is cleared before a new one is set.
  function clearDrop() {
    const marked = recordsDbInstance.lichessTools.$('.lichessTools-recordsDbUi [data-bookmark-drop]');
    if (marked.length) marked.removeAttr('data-bookmark-drop');
  }

  function bookmarkView(content, host, box) {
    const lt = recordsDbInstance.lichessTools;
    const trans = lt.translator;
    const $ = lt.$;
    const registry = content.registry;

    // The local db feeds the mirror off the critical path - the member blob first, then the captures
    // the tree filed - so a row can be painted before the study it names has a record. The view
    // rebuilds on every publish, and this is what makes that rebuild answer the mirror it now sees
    // rather than the cache the first paint left behind.
    if (content.hayRevision !== content.sync.publishRevision) content.refreshCaches();

    const chipStates = {
      // Every writeable study is already readable, so the access pair is `Writable` vs `Readonly`
      // ("no write"), and the registry keeps `unlisted` apart from `public`.
      access: ['all', 'writable', 'readonly'],
      visibility: ['all', 'public', 'unlisted', 'private'],
    };
    const kindLabel = (kind) => kind == 'all' ? trans.noarg('kindAll') : trans.noarg('kind' + camel(kind));
    const stateLabel = (which, state) => trans.noarg(which + camel(state));
    const chipLive = (which) => which == 'kind' ? content.presentKinds().length > 1 : content.chipApplicable(which);
    const chipName = (which) => trans.noarg('filters' + (which == 'kind' ? 'Kind' : which == 'access' ? 'Access' : 'Visibility'));

    const chipButton = (which) => {
      const states = which == 'kind' ? ['all'].concat(content.presentKinds()) : chipStates[which];
      const current = content.filters[which];
      const live = chipLive(which);
      const button = $('<button class="btn-rack__btn chip">')
        .addClass(live ? 'chip-live' : 'chip-dim')
        .attr('type', 'button')
        .attr('tabindex', '0')
        .text(which == 'kind' ? kindLabel(current) : stateLabel(which, current));
      const reason =
        chipName(which) + ': ' + (which == 'kind' ? kindLabel(current) : stateLabel(which, current));
      button.attr(
        'title',
        live
          ? reason
          : reason + ' \u2014 ' + trans.noarg('recordsDbChipNotApplicable') + ' ' + content.presentKinds().map(kindLabel).join(' / '),
      );
      button.on('click', () => content.cycleFilter(which, states));
      return button;
    };

    // Rack 1: the filters rack - the three chips. A repaint reuses the rack the window keeps and
    // swaps only its chips: the textbox that sits in it is never taken off the page, which is what
    // keeps the keyboard on it while a user is still typing.
    const keptRack = host.find('.rack-filters');
    const filtersRack = keptRack.length ? keptRack : $('<div class="rack-filters">');
    const boxSlot = filtersRack.find('input.tree-filter');
    filtersRack.find('button').remove();
    // The box stays the rack's last child, so the chips go in ahead of it.
    const putChip = (chip) => { if (boxSlot.length) chip.insertBefore(boxSlot); else filtersRack.append(chip); };
    putChip(chipButton('access'));
    putChip(chipButton('visibility'));
    putChip(chipButton('kind'));
    if (!boxSlot.length) filtersRack.append(box);

    // Rack 2 / the flow: Add (hidden while Select is on or nothing on the page can be filed),
    // Select (the mode that grows the checkboxes), Delete (count + confirm), New folder.
    const actionsRack = $('<div class="rack-actions">');

    const addButton = $('<button class="btn-rack__btn btn-add">')
      .attr('type', 'button')
      .attr('title', trans.noarg('recordsDbAdd'))
      .text(trans.noarg('recordsDbAdd'));
    addButton.on('click', async (ev) => {
      await content.addCurrentStudy();
    });
    // Add hides while Select is on, and when the page has nothing to file.
    if (!content.canAdd()) addButton.attr('hidden', '');
    actionsRack.append(addButton);

    const selectButton = $('<button class="btn-rack__btn btn-select">')
      .attr('type', 'button')
      .attr('title', trans.noarg(content.selectMode ? 'recordsDbSelectOn' : 'recordsDbSelectOff'))
      .text(trans.noarg('recordsDbSelect'));
    if (content.selectMode) selectButton.addClass('active');
    selectButton.on('click', () => content.setSelect(!content.selectMode));
    actionsRack.append(selectButton);

    const deleteButton = $('<button class="btn-rack__btn btn-delete">')
      .attr('type', 'button')
      .attr('title', trans.noarg('recordsDbDelete'))
      .text(trans.noarg('recordsDbDelete'));
    // The first press of the fallback arms the bar, so the chip stays live while a bar is armed.
    if (!content.selected.size && !content.confirmBar) deleteButton.attr('disabled', 'disabled');
    deleteButton.on('click', async (ev) => {
      await content.deleteSelected();
    });
    actionsRack.append(deleteButton);

    const newFolderButton = $('<button class="btn-rack__btn btn-newfolder">')
      .attr('type', 'button')
      .attr('title', trans.noarg('recordsDbNewFolder'))
      .text(trans.noarg('recordsDbNewFolder'));
    if (lt.icon.NewFolder !== undefined) newFolderButton.attr('data-icon', lt.icon.NewFolder);
    // The name is asked by `createFolder` through the page's dialog prompt.
    newFolderButton.on('click', async (ev) => {
      await content.createFolder();
    });
    actionsRack.append(newFolderButton);

    // Rename sits beside New folder and is live only when exactly one folder is selected, so the
    // gesture cannot guess which folder the user meant.
    const selectedFolders = [...content.selected].filter((entry) => content.folder(entry));
    const renameButton = $('<button class="btn-rack__btn btn-rename" type="button">')
      .attr('type', 'button')
      .attr('title', trans.noarg('recordsDbRename'))
      .text(trans.noarg('recordsDbRename'));
    if (selectedFolders.length === 1)
      renameButton.on('click', async (ev) => {
        await content.renameFolder(selectedFolders[0]);
      });
    else renameButton.attr('disabled', 'disabled');
    actionsRack.append(renameButton);

    // One chip folds or unfolds every folder at once, so a deep tree is one gesture instead of one
    // caret each. It says which way it is going, the same reading the caret on a row carries.
    const foldTargets = content.folderNodes();
    const foldAll = foldTargets.length > 0 && foldTargets.every((folder) => content.expanded.has(folder));
    const foldKey = foldAll ? 'recordsDbCollapseAll' : 'recordsDbExpandAll';
    const foldButton = $('<button class="btn-rack__btn btn-fold" type="button">')
      .attr('title', trans.noarg(foldKey))
      .text(trans.noarg(foldKey));
    if (foldTargets.length) foldButton.on('click', (ev) => content.toggleAllExpanded());
    else foldButton.attr('disabled', 'disabled');
    actionsRack.append(foldButton);

    const rowOf = (row) => {
      const { entry, path, shown } = row;
      const folder = content.folder(entry);
      const record = content.recordFor(entry);
      const selected = content.selected.has(entry);
      const expanded = content.expanded.has(entry);
      const row0 = content.registry[entry?.kind];
      // A leaf wears red only when a read proved it gone; an unknown kind stays fail-soft gone.
      const dead = !folder && content.isGone(entry);
      const labelText = folder
        ? String(entry.name ?? '')
        : content.leafLabel(entry) || String(entry.label ?? '');
      const li = $('<li class="record-row bookmark-row">')
        .attr('data-path', path.join('/'))
        .attr('tabindex', '0')
        .attr('draggable', String(!dead && content.editing?.entry !== entry))
        .attr('style', '---bookmark-depth:' + (path.length - 1));
      if (!folder) li.attr('data-kind', entry.kind);
      if (selected) li.addClass('selected');
      if (dead) li.addClass('record-missing');
      // A folder is never dropped - it stays and goes dim when nothing in it is shown.
      if (folder && shown === 0) li.addClass('folder-empty');
      if (folder) li.attr('data-expanded', String(expanded));
      // The node this paint put on the page, keyed for the tree host's one listener per event. The
      // chips a row wears copy this answer with a chip marker, so a click on a caret or an open
      // link stays the row's own rather than a handler the row would have to carry.
      const indexed = { row, entry, folder, dead, node: li[0], preview: false, cold: false };
      content.rowIndex.set(li[0], indexed);

      // Select grows a plain `<input type="checkbox">` - a native control costs no markup budget
      // and takes no extra row width, which is what the styled `form-check` span did badly. Its
      // `change` feeds the same `select` the row click uses, so the selection keeps exactly one
      // owner.
      if (content.selectMode) {
        const check = $('<input class="tree-select" type="checkbox">');
        if (selected) check.attr('checked', '');
        check.on('change', () => content.select(entry));
        li.append(check);
      }

      if (folder) {
        const toggle = $('<button class="bookmark-toggle" type="button">')
          .attr('title', trans.noarg(expanded ? 'recordsDbCollapseFolder' : 'recordsDbExpandFolder'));
        toggle.append($('<svg focusable="false" viewBox="0 0 10 10"><path d="M2 1L8 5L2 9Z" fill="currentColor"></path></svg>'));
        content.rowIndex.set(toggle[0], { ...indexed, chip: 'toggle' });
        li.append(toggle);
      } else {
        // A leaf wears the page's own mark - the study's flair when the mirror has one, else the
        // kind icon - so a mixed tree reads at a glance without a second label.
        const mark = record?.flair || (row0?.icon && lt.icon[row0.icon] !== undefined ? lt.icon[row0.icon] : undefined);
        if (mark !== undefined)
          li.append($('<span class="record-icon">').attr('data-icon', mark));
      }
      const box = $('<div class="record-content">');
      const nameBox = $('<span class="bookmark-name">');
      const jumpHref = folder || dead ? undefined : row0?.openUrl?.(entry.id, entry.meta);
      nameBox.text(labelText);
      if (record && 'visibility' in record) nameBox.append(studyPublicIcon(record));
      box.append(nameBox);
      li.append(box);
      // The chapter tooltip survives on a study row, but anchored on the **row**: the count is one
      // glance and the list stays up while the pointer sits anywhere on the row, which is what
      // lets the same hover scroll the tree instead of losing the tooltip over a tiny label.
      if (record?.chapters) {
        const chapterPreview = record.chapters.map((chapter) => ({
          name: chapter.name,
          ...studyLink(record, { chapterId: chapter.id }),
        }));
        const count = record.chapterCount ?? chapterPreview.length;
        if (count) li.append($('<span class="record-chapter-count">').text(String(count)));
        const preview = popupData(chapterPreview, record.studyName);
        if (preview) {
          for (const [name, value] of Object.entries(preview.attrs)) li.attr(name, value);
          popupPreviews.set(li[0], { items: preview.items, title: preview.title });
          indexed.preview = true;
        }
      } else if (!folder && !dead && entry.kind == 'study') {
        // The mirror has never seen this row, so hover spends the read that gives it chapters -
        // the tooltip answers the moment the read lands, on this row and on every later page.
        indexed.cold = true;
      }

      // The row's own jump affordance sits at its right end as a link icon. Enter and double click
      // keep the keyboard path into openLeaf.
      if (jumpHref !== undefined) {
        const jump = $('<button class="btn-row-open" type="button">')
          .attr('title', trans.noarg('recordsDbOpenLink'));
        if (lt.icon.Link !== undefined) jump.attr('data-icon', lt.icon.Link);
        else jump.text(trans.noarg('recordsDbOpenLink'));
        content.rowIndex.set(jump[0], { ...indexed, chip: 'open' });
        li.append(jump);
      }

      return li;
    };


    const shownCounts = content.kindCounts();
    const treeTotal = content.filedCount();
    const shownTotal = Object.values(shownCounts).reduce((sum, count) => sum + count, 0);
    const header = $('<div class="tree-header">');
    // One count label for the whole tree: the total is the only number that always fits, and the
    // per-kind breakdown waits in its title, one kind per line, so eight kinds cannot push the
    // header open. The words carry the plural, so a big count reads `Studies: 496`.
    const countsLine = $('<span class="tree-counts">');
    const kindLines = content.presentKinds().map((kind) =>
      trans.pluralSame('recordsDbCount' + camel(kind), shownCounts[kind] ?? 0));
    countsLine.text(trans.pluralSame('recordsDbItemsCount', shownTotal));
    countsLine.attr('title', kindLines.join('\n'));
    header.append(countsLine);
    // What stays in the header is only what the tree cannot show by itself: an empty tree, a leaf
    // a read proved gone, a restore waiting, a confirm armed. The capture state is not the user's
    // decision - the tooltip answers as soon as the mirror lands.
    if (!treeTotal) {
      const emptyLine = $('<span class="tree-empty">');
      emptyLine.text(trans.noarg('recordsDbEmptyNote'));
      header.append(emptyLine);
    }
    if (content.missingCount()) {
      const missingLine = $('<span class="tree-missing">');
      missingLine.text(trans.pluralSame('recordsDbMissingStudy', content.missingCount()));
      header.append(missingLine);
    }
    if (content.restorePreview?.counts) {
      const preview = content.restorePreview.counts;
      for (const kind of Object.keys(preview)) {
        const line = $('<span class="tree-restore-count">').attr('data-kind', kind);
        line.text(preview[kind].leaves + ' / ' + preview[kind].folders + ' ' + kindLabel(kind));
        header.append(line);
      }
    }
    if (content.confirmBar?.count) {
      // The fallback bar: the first press armed it, this line says what the second press will do.
      const bar = $('<div class="confirm-bar">');
      bar.text(trans.pluralSame('recordsDbPressAgain', content.confirmBar.count));
      header.append(bar);
    }

    const body = $('<div class="body bookmarks-body">').attr('data-revision', String(content.revision));
    const tree = $('<ul class="studies">');
    if (treePaint !== content.revision) hideStudyPopup();
    treePaint = content.revision;
    for (const row of content.results) tree.append(rowOf(row));
    body.append(tree);
    if (content.error) {
      const error = $('<div class="error">');
      error.text(content.error.message);
      const retryButton = $('<button type="button">').text(trans.noarg('recordsDbRetry'));
      content.rowIndex.set(retryButton[0], { row: undefined, entry: undefined, folder: false, dead: false, node: retryButton[0], preview: false, cold: false, chip: 'retry' });
      error.append(retryButton);
      body.append(error);
    }
    // Nothing states an overflow: the tree paints every row it holds, so a tree taller than the
    // dialog only grows its scrollbar.
    // The marker at the end of the tree: a drop there is a root drop, so it carries the answer the
    // host dispatches with no row behind it.
    const end = $('<div class="bookmark-end">');
    content.rowIndex.set(end[0], { row: undefined, entry: undefined, folder: false, dead: false, node: end[0], preview: false, cold: false });
    if (!content.entries.length) end.append($('<span class="status">').text(trans.noarg('recordsDbEmptyNote')));
    body.append(end);



    // The backup rack, pinned to the bottom of the dialog. The file is one tree, so "Backup"
    // writes the tree the user sees and "Restore" replaces the whole tree with it - there is no
    // per-branch half-action left to explain.
    const backupRack = $('<div class="rack-backup">');
    const backupButton = $('<button class="btn-rack__btn btn-backup" type="button">')
      .attr('title', trans.noarg('recordsDbBackup'))
      .text(trans.noarg('recordsDbBackup'));
    backupButton.on('click', async (ev) => {
      await content.downloadTree();
    });
    const restoreButton = $('<button class="btn-rack__btn btn-restore" type="button">')
      .attr('title', trans.noarg('recordsDbRestoreTree'))
      .text(trans.noarg('recordsDbRestoreTree'));
    restoreButton.on('click', async (ev) => {
      try {
        const picker = $('<input class="tree-restore-file" type="file">')
          .on('change', async (e) => {
            const file = e.target?.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (loaded) => {
              await content.restoreFromText(String(loaded.target?.result ?? ''));
            };
            reader.readAsText(file, 'UTF-8');
          });
        picker.trigger?.('click');
      } catch (ignored) {}
    });

    backupRack.append(backupButton);
    backupRack.append(restoreButton);

    // The read order: header, filters rack, actions rack, the tree (header above it), backup rack.
    // Under a host that has been painted before, the pieces that carry no textbox are dropped and
    // the fresh ones take their place around the rack that stays - the header ahead of it, the rest
    // behind it.
    if (keptRack.length) {
      host.find('.tree-header').remove();
      host.find('.rack-actions').remove();
      host.find('.bookmarks-body').remove();
      host.find('.tree-note').remove();
      host.find('.rack-backup').remove();
      header.insertBefore(keptRack);
    } else {
      host.append(header);
      host.append(filtersRack);
    }
    host.append(actionsRack);
    host.append(body);
    if (content.message) {
      const note = $('<div class="tree-note">');
      note.text(
        content.messageCount === undefined
          ? trans.noarg('recordsDb' + camel(content.message))
          : trans.pluralSame('recordsDb' + camel(content.message), content.messageCount),
      );
      host.append(note);
    }
    host.append(backupRack);
    return host;
  }

  // The window geometry: min width, the five resize edges, the clamp ------------------------------
  const minWindowWidth = 280;
  const resizeEdges = ['e', 'se', 's', 'sw', 'w'];




  function clamp(value, bounds) {
    return Math.min(Math.max(value, bounds.min), bounds.max);
  }

  function displayColumns(lichessTools) {
    const width = lichessTools.global.window?.innerWidth || 0;
    if (lichessTools.isMobile()) return 1;
    if (width < 1019.3) return 2;
    if (width < 1319.3) return 3;
    return 4;
  }

  function windowViewport(lichessTools) {
    const global = lichessTools.global;
    const width = global.document?.documentElement?.clientWidth || global.window?.innerWidth || 0;
    const height = global.window?.innerHeight || 0;
    let top = 0;
    try {
      top = parseFloat(global.getComputedStyle?.(global.document?.body)?.getPropertyValue('---site-header-height')) || 0;
    } catch (ignored) {}
    return { width, height, left: 0, top };
  }

  function fitWindow(rect, viewport) {
    const inset = Math.min(8, viewport.width / 4, viewport.height / 4);
    const minTop = Math.max(inset, viewport.top);
    const availableHeight = Math.max(0, viewport.height - inset - minTop);
    const width = clamp(rect.width, { min: minWindowWidth, max: Math.max(minWindowWidth, viewport.width - 2 * inset) });
    const height = clamp(rect.height, { min: Math.min(160, availableHeight), max: availableHeight });
    return {
      left: clamp(rect.left, { min: inset, max: viewport.width - inset - width }),
      top: clamp(rect.top, { min: minTop, max: viewport.height - inset - height }),
      width,
      height,
    };
  }

  function moveWindow(rect, dx, dy, edge, viewport) {
    if (!edge) return fitWindow({ ...rect, left: rect.left + dx, top: rect.top + dy }, viewport);
    const inset = Math.min(8, viewport.width / 4, viewport.height / 4);
    const minTop = Math.max(inset, viewport.top);
    const minHeight = Math.min(160, Math.max(0, viewport.height - inset - minTop));
    let { left } = rect;
    let right = left + rect.width;
    let bottom = rect.top + rect.height;
    if (edge.includes('w')) left = clamp(left + dx, { min: inset, max: right - minWindowWidth });
    if (edge.includes('e')) right = clamp(right + dx, { min: left + minWindowWidth, max: viewport.width - inset });
    if (edge.includes('s')) bottom = clamp(bottom + dy, { min: rect.top + minHeight, max: viewport.height - inset });
    return { left, top: rect.top, width: right - left, height: bottom - rect.top };
  }


  class WindowEventHandler {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.gesture;
    }

    keyDown(ctrl, event) {
      if (!event || event.key !== 'Escape') return;
      // Cash reaches the frame and the inner content, so the memo keeps Escape one action - unwind
      // a gesture, otherwise close the window.
      if (event._recordsDbEscape) return;
      event._recordsDbEscape = true;
      event.preventDefault?.();
      event.stopPropagation?.();
      if (!this.cancel(ctrl)) ctrl.owner.close();
    }

    // The gate, trimmed to the resize strips: only a primary press begins a gesture, and a finger
    // counts as one - a touch contact reports no button (`-1`), so both it and a left press open
    // the gate while a right or middle click never does.
    start(source, event) {
      const lt = this.lichessTools;
      source.windowFrame?.setOrder(0);
      if (!event || !event.isPrimary || this.gesture) return;
      if (event.button !== 0 && event.button !== -1) return;
      const $ = lt.$;
      const capture = $(event.target);
      const edge = capture.attr('data-resize');
      if (!edge) return;
      const bounds = capture[0]?.getBoundingClientRect?.();
      event.preventDefault?.();
      this.gesture = {
        source,
        edge,
        rect: { ...source.geometry },
        moved: false,
        capture,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: event.clientX - (bounds?.left ?? event.clientX),
        offsetY: event.clientY - (bounds?.top ?? event.clientY),
      };
      capture[0]?.setPointerCapture?.(event.pointerId);
    }

    move(event) {
      const lt = this.lichessTools;
      const gesture = this.gesture;
      if (!gesture || !event || gesture.pointerId !== event.pointerId) return;
      if (!gesture.moved) {
        if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 6) return;
        gesture.moved = true;
        gesture.source.windowFrame?.frame?.dialog.addClass('dragging');
      }
      gesture.source.windowFrame?.apply(
        moveWindow(
          gesture.rect,
          event.clientX - gesture.x,
          event.clientY - gesture.y,
          gesture.edge,
          windowViewport(lt),
        ),
      );
    }

    // The release, minus the transfer branch: a resize that moved re-saves the geometry, so a
    // reload restores the size the user just set.
    async end(event) {
      const gesture = this.gesture;
      if (!gesture || !event || gesture.pointerId !== event.pointerId) return;
      this.move(event);
      this.clear();
      if (gesture.moved) gesture.source.owner.save();
    }

    pointerCancel(event) {
      if (event && event.pointerId === this.gesture?.pointerId) this.cancel();
    }

    // The unwind, so Escape mid-resize closes instead of committing the new size.
    cancel(ctrl) {
      if (!this.gesture || (ctrl && this.gesture.source !== ctrl)) return false;
      const gesture = this.gesture;
      this.clear();
      gesture.source.windowFrame?.apply(gesture.rect);
      return true;
    }

    clear() {
      const gesture = this.gesture;
      if (!gesture) return;
      this.gesture = undefined;
      gesture.capture[0]?.style?.removeProperty?.('cursor');
      gesture.source.windowFrame?.frame?.dialog?.removeClass('dragging');
      if (gesture.capture[0]?.hasPointerCapture?.(gesture.pointerId)) gesture.capture[0].releasePointerCapture(gesture.pointerId);
    }
  }



  class WindowCtrl {
    constructor(owner, content, geometry) {
      this.owner = owner;
      this.content = content;
      this.geometry = geometry;
      this.windowFrame;
      // A repaint means the tree changed, so the state is offered to the blob as it happens - the
      // throttle keeps a drag through a big tree from writing a branch-sized blob on every step.
      this.redraw = async () => {
        this.windowFrame?.redraw();
        await this.saveState();
      };
      this.unwatch = owner.store.syncCtrl.watch(this.redraw);
      this.stateSaved = 0;
    }

    // The state goes to the blob at most every `windowStateSaveMs`; a page being left flushes once
    // through the unload listeners instead, and `close` writes it whatever the clock says.
    async saveState() {
      if (Date.now() - this.stateSaved < windowStateSaveMs) return;
      this.stateSaved = Date.now();
      return this.owner.save();
    }

    // The window is the one the owner holds, so showing it is only building its frame once.
    async show() {
      if (this.windowFrame) return true;
      this.windowFrame = new WindowFrame(this);
      if (!await this.windowFrame.show()) {
        this.windowFrame = undefined;
        return false;
      }
      return true;
    }

    dispose() {
      const windowFrame = this.windowFrame;
      this.unwatch();
      // The offset is read before the frame is taken off the page - after the close there is
      // nothing left to read it from, and the next page would restore the top of the tree.
      this.scrollOffset = windowFrame?.scrolled() ?? this.scrollOffset;
      this.windowFrame = undefined;
      windowFrame?.close();
    }

    // The fail-soft shape: the blob keeps its `{kind, active, geometry, view, scroll}` rows, so an
    // older blob still parses and a newer one that names a kind this tool no longer has simply fails
    // the kind test in `load`. `view` is the shape the user left - the open folders and the selected
    // rows - and only a content that owns a shape fills it. `scroll` is where the wheel had stopped.
    // A part a page cannot see is left out of the row rather than written empty: `saveWindows`
    // carries the part the page before left, so a write that knows less never erases it.
    freeze() {
      const view = this.content.frozenView();
      const scroll = this.windowFrame?.scrolled() ?? this.scrollOffset;
      return [{
        kind: this.content.kind,
        active: true,
        geometry: { ...this.geometry },
        ...(view ? { view } : {}),
        ...(scroll ? { scroll } : {}),
      }];
    }

    setGeometry(rect) {
      this.geometry = rect;
      this.owner.save();
    }

    focusContent() {
      const panel = this.windowFrame?.frame?.view?.find('.content-frame');
      if (!panel?.length) return;
      const input = panel.find('.tree-filter');
      if (input.length) input[0]?.focus?.();
      else panel.find('input')?.eq(0)?.focus?.();
    }
  }

  class WindowFrame {
    constructor(ctrl) {
      this.ctrl = ctrl;
      this.frame;
      this.closed = false;
      // The hosts a paint keeps for the whole life of the window: `div.inner-content` carries the
      // gesture listeners, `div.content-frame` is the scroll host, the tree host under it carries
      // the tree's own listeners, and the filters rack under that carries the textbox. A repaint
      // may not take any of them off the page - an input that leaves the page loses the keyboard
      // that was on it, so the next letter lands at the wrong end of the word.
      this.inner;
      this.scrollHost;
      this.treeHost;
      this.typedBox;
      // The scrollers a paint rebuilds, and the offset a window comes back with from another page.
      // A fresh scroller starts at the top, so both have to be carried: the live offset across a
      // repaint, and the blob's offset onto the first paint.
      this.scrollerSelectors = ['.content-frame', '.body', 'ul.studies'];
      this.scrollRestore = ctrl.scrollRestore;
      // What the page calls when the viewport changes. The event hands the callback a receiver of
      // its own - the browser and cash's `trigger` both call it detached - so a class method
      // forwarded as `this.fit` would read `undefined.geometry` and throw on every resize. This
      // closure captures the frame instead, and one identity feeds add and remove.
      this.resizeHandler = () => this.fit();
    }

    async show() {
      const lt = this.ctrl.owner.lichessTools;
      const trans = lt.translator;
      const dialog = await lt.dialog({
        class: 'records-db',
        modal: false,
        noTabCycle: true,
        focus: '.content-frame input',
        closedBy: 'none',
        noEscClose: true,
        header: false,
      });
      if (!dialog) return false;
      const $ = lt.$;
      const root = $(dialog).addClass('lichessTools-recordsDbUi records-db');
      if (this.ctrl.windowFrame !== this) {
        root.remove();
        return false;
      }
      this.frame = { dialog: root, view: root.find('.dialog-content') };
      const handler = recordsDbInstance.windowEventHandler;
      root
        .on('close', () => {
          if (!this.closed && this.ctrl.windowFrame === this) this.ctrl.owner.close();
        })
        .on('keydown', (ev) => handler.keyDown(this.ctrl, ev));
      const handle = root.children('.dialog-header');
      if (handle.length)
        handle.on('pointerup', () => {
          if (!this.frame) return;
          const rect = this.frame.dialog[0]?.getBoundingClientRect?.();
          if (rect) this.apply({ left: rect.x, top: rect.y, width: rect.width, height: rect.height });
        });
      await this.ctrl.owner.mount();
      if (this.closed || this.ctrl.windowFrame !== this) return false;
      this.render();
      this.fit();
      try {
        dialog.show?.();
        lt.global.window.addEventListener('resize', this.resizeHandler);
      } catch (ignored) {}
      return true;
    }

    render() {
      if (this.closed || !this.frame) return;
      if (!this.inner) {
        this.inner = this.innerHost();
        this.inner.appendTo(this.frame.view);
        this.scrollHost = this.inner.find('.content-frame');
      }
      const content = this.ctrl.content;
      const host = this.treeHost || content?.viewHost();
      const box = this.typedBox || content?.newFilterBox();
      // The tree host, its filters rack and its textbox belong to the window, not to the paint: a
      // paint fills the host with the fresh header, racks, tree and backup rack, and the rack that
      // already carries the textbox keeps it. A rebuilt textbox is taken off the page for a moment,
      // and a moment off the page is enough to lose the keyboard on it - typing "Par" one keystroke
      // at a time then answered "raP".
      // The scroll offsets are read before the swap for the same reason: the fresh scrollers that
      // come back under the host have no memory of where the wheel had stopped, so a row click -
      // which repaints before it navigates - would jump the whole tree back to the top.
      const scrolled = this.scrollRestore ?? this.scrolled();
      const view = bookmarkView(content, host, box);
      if (!view?.length) return;
      if (!this.treeHost) host.appendTo(this.scrollHost);
      this.treeHost = host;
      this.typedBox = box;
      this.scrollRestore = undefined;
      this.restoreScroll(scrolled);
    }

    // Where the wheel had stopped inside the window. Only the scrollers this tool owns are read,
    // and the raw node is taken with `[0]` because the offset lives on the element.
    scrolled() {
      const dialog = this.frame?.dialog;
      if (!dialog?.length) return undefined;
      return this.scrollerSelectors.map((selector) => {
        const scroller = dialog.find(selector)?.[0];
        return scroller ? { selector, top: scroller.scrollTop || 0 } : undefined;
      }).filter(Boolean);
    }

    // The offsets go back on the scrollers that replaced them, clamped to what the fresh subtree
    // can actually show - a row the tree lost since leaves the wheel near the bottom rather than
    // throwing the window off the page.
    restoreScroll(offsets) {
      const dialog = this.frame?.dialog;
      if (!offsets?.length || !dialog?.length) return;
      for (const offset of offsets) {
        const scroller = dialog.find(offset.selector)?.[0];
        if (!scroller) continue;
        const room = (scroller.scrollHeight || 0) - (scroller.clientHeight || 0);
        scroller.scrollTop = room > 0 ? Math.min(offset.top, room) : offset.top;
      }
    }

    redraw() {
      this.render();
      this.apply(this.ctrl.geometry);
    }



    // The hosts the window keeps for its whole life: the gesture listeners hang on `div.inner-content`
    // under the page's own scroll host, and the five resize strips sit in the border box.
    innerHost() {
      const ctrl = this.ctrl;
      const handler = recordsDbInstance.windowEventHandler;
      const $ = ctrl.owner.lichessTools.$;
      const inner = $('<div class="inner-content">')
        .on('pointerdown', (ev) => handler.start(ctrl, ev))
        .on('pointermove', (ev) => handler.move(ev))
        .on('pointerup', (ev) => handler.end(ev))
        .on('pointercancel', (ev) => handler.pointerCancel(ev))
        .on('lostpointercapture', (ev) => handler.pointerCancel(ev))
        .on('keydown', (ev) => handler.keyDown(ctrl, ev));
      $('<div class="content-frame">').appendTo(inner);
      for (const edge of resizeEdges) {
        inner.append($('<span class="resize">')
          .addClass('resize-' + edge)
          .attr('data-resize', edge));
      }
      return inner;
    }

    close() {
      if (this.closed) return;
      this.closed = true;
      recordsDbInstance.windowEventHandler.cancel(this.ctrl);
      const lt = this.ctrl.owner.lichessTools;
      try {
        lt.global.window.removeEventListener('resize', this.resizeHandler);
      } catch (ignored) {}
      const dialogNode = this.frame?.dialog?.length ? this.frame.dialog[0] : undefined;
      if (dialogNode) {
        try {
          dialogNode.close();
        } catch (ignored) {}
      }
      this.frame?.dialog?.remove();
      this.frame = undefined;
    }

    fit() {
      if (this.closed || !this.frame) return;
      recordsDbInstance.windowEventHandler.cancel(this.ctrl);
      this.apply(fitWindow(this.ctrl.geometry, windowViewport(this.ctrl.owner.lichessTools)));
    }

    apply(rect) {
      if (!this.frame) return;
      const lt = this.ctrl.owner.lichessTools;
      rect = fitWindow(rect, windowViewport(lt));
      this.ctrl.setGeometry(rect);
      this.frame.dialog.css({
        left: rect.left + rect.width / 2 + 'px',
        top: rect.top + rect.height / 2 + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
      });
    }

    setOrder(order) {
      if (!this.frame) return;
      try {
        this.frame.dialog[0].style.setProperty('---records-db-frame-order', String(order));
      } catch (ignored) {}
      this.frame.dialog.css({ 'z-index': String(900 + order) });
    }
  }

  class RecordsDbCtrl {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
      // The page has one content, and it holds the one window the toggle opens.
      this.content = new BookmarkTabContent(lichessTools, store);
      this.window;
      this.toggleButton;
    }

    clearSelection() {
      this.content.clearSelection();
    }

    // A phone is not excluded: the store captured the study there too, and the window answers a
    // touch layout (one column, a thumb-high header, tap-wide strips). What still has to hold is a
    // user, a study page with a study open, and the database behind it.
    canOpen() {
      const lt = this.lichessTools;
      return !!this.store
        && !!lt.getUserId()
        && this.store.isRecordsDbAvailable(lt.location.pathname)
        && !!lt.lichess?.analysis?.study;
    }

    // The study this page carries - the open analysis first, the url as the fallback the store
    // already uses (plan 13).
    pageStudyId() {
      const lt = this.lichessTools;
      const analysisId = lt.lichess?.analysis?.study?.data?.id;
      if (analysisId) return analysisId;
      const studyMatch = /^\/study\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?/.exec(lt.location?.pathname || '');
      return studyMatch?.[1];
    }

    // The scroll offsets the blob carries for the row this tool still has.
    storedScroll(stored) {
      for (const row of stored || []) {
        if (row?.kind != this.content.kind) continue;
        return Array.isArray(row?.scroll) ? row.scroll : undefined;
      }
      return undefined;
    }

    // The back half of `rememberPage`: a page whose url is in the trail is a page the user came
    // back to. The page key spells which page ran last, so reloading the page you are on is not a
    // way back - only arriving from a different url is. The entry is spent, so a further visit of
    // that study is a manual call again.
    async returned() {
      const lt = this.lichessTools;
      const href = lt.location?.href;
      const left = await lt.storage.get(treePageKey, { session: true });
      await lt.storage.set(treePageKey, href || '', { session: true });
      if (!href || left === href) return false;
      const trail = await lt.storage.get(treeReturnKey, { session: true });
      if (!trail?.length) return false;
      const at = trail.findIndex(
        (entry) => entry?.href === href && Date.now() - (entry?.at ?? 0) < treeReturnMs,
      );
      if (at < 0) return false;
      const rest = [...trail];
      rest.splice(at, 1);
      await lt.storage.set(treeReturnKey, rest, { session: true });
      return true;
    }

    // The one-shot hand-off `openLeaf` leaves before it navigates: it is read and dropped in the
    // same breath, so a flag nobody spent cannot reopen the window on a later visit of that study.
    // Only a trip younger than `treeHandoffMs` that names the study this page carries is spent -
    // a study the user opens by hand, in another tab or from a bookmark stays a manual call.
    async handoff() {
      const lt = this.lichessTools;
      const flag = await lt.storage.get(treeHandoffKey, { session: true });
      if (!flag) return false;
      await lt.storage.remove(treeHandoffKey, { session: true });
      if (!flag.studyId) return false;
      if (Date.now() - (flag.at ?? 0) >= treeHandoffMs) return false;
      return flag.studyId === this.pageStudyId();
    }

    // The window's frame is up, so the content reads its tree and the window takes focus. The
    // frame's order is stamped here: the css keeps the single window under the analysis panels.
    async mount() {
      if (!this.window) return;
      if (!this.canOpen()) return this.close();
      this.window.windowFrame?.setOrder(0);
      await this.content.init();
      this.window.focusContent();
    }

    async open() {
      if (!this.canOpen()) return;
      if (this.window?.windowFrame) return;
      if (!this.window) await this.load();
      await this.window.show();
      await this.rememberPage();
      this.listenLeave();
    }

    // The page that now carries an open window hands its url to the trail: the back button brings a
    // page change, and the study hash is already spent on bookmark + ply, so the whole url (hash
    // included) is what gets compared later - nothing is spelled into it.
    async rememberPage() {
      const lt = this.lichessTools;
      const href = lt.location?.href;
      if (!href) return;
      const remembered = await lt.storage.get(treeReturnKey, { session: true });
      const trail = [...(remembered || [])].filter(
        (entry) => entry?.href !== href && Date.now() - (entry?.at ?? 0) < treeReturnMs,
      );
      trail.push({ href, at: Date.now() });
      await lt.storage.set(treeReturnKey, trail.slice(-treeReturnTrail), { session: true });
    }

    // The page that now carries an open window starts watching for its own end: a back button, a
    // tab switch or a reload never calls the tool again, so the shape and the wheel have to reach
    // the blob from the unload channel - the one channel that runs on the page being left.
    listenLeave() {
      const lt = this.lichessTools;
      if (this.leaveHandler) return;
      this.leaveHandler = () => {
        if (this.window?.windowFrame) void this.save();
      };
      lt.global.addEventListener('pagehide', this.leaveHandler);
      lt.global.addEventListener('beforeunload', this.leaveHandler);
    }

    stopLeave() {
      const lt = this.lichessTools;
      if (!this.leaveHandler) return;
      lt.global.removeEventListener('pagehide', this.leaveHandler);
      lt.global.removeEventListener('beforeunload', this.leaveHandler);
      this.leaveHandler = undefined;
    }

    async close() {
      if (!this.window) return;
      await this.save();
      this.window.dispose();
      this.content.destroy();
      this.window = undefined;
      this.stopLeave();
    }

    async toggle() {
      if (this.window?.windowFrame) await this.close();
      else await this.open();
    }

    // The fail-soft rule for the geometry blob: every number finite and positive, and a row
    // naming a kind this tool no longer renders is ignored - a blob an older version wrote with
    // four tabs then simply loads the default box rather than throwing on page load.
    storedGeometry(stored) {
      for (const row of stored || []) {
        const geometry = row?.geometry;
        if (row?.kind != this.content.kind) continue;
        if (!geometry || !['left', 'top', 'width', 'height'].every((key) => Number.isFinite(geometry[key]))) continue;
        if (geometry.width <= 0 || geometry.height <= 0) continue;
        return { ...geometry };
      }
      return undefined;
    }

    async load() {
      const lt = this.lichessTools;
      if (this.window) return;
      const stored = await this.store.idbStudy.loadWindows();
      const geometry = this.storedGeometry(stored) ?? this.initialGeometry();
      this.window = new WindowCtrl(this, this.content, fitWindow(geometry, windowViewport(lt)));
      this.window.scrollRestore = this.storedScroll(stored);
      this.content.onChange = this.window.redraw;
    }

    async save() {
      return this.store.idbStudy.saveWindows(this.window?.freeze() ?? []);
    }


    initialGeometry() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const viewport = windowViewport(lt);
      const columns = displayColumns(lt);
      const panel = $(columns > 2 ? 'aside.analyse__side' : 'div.analyse__tools');
      const board = $('.analyse__board');
      let gap = 8;
      try {
        const blockGap = lt.global.getComputedStyle?.(lt.global.document?.body)?.getPropertyValue('---block-gap');
        gap = (parseFloat(blockGap) || 16) / 2;
      } catch (ignored) {}
      // A phone has one column and no side panel to lean on, so the box takes the width the
      // viewport has and hangs under the header - `fitWindow` then never has to shrink it. A
      // desktop page that lost its study panel gets the same honest box rather than a fixed one.
      if (columns < 2 || !panel.length || !board.length) {
        return {
          left: gap,
          top: viewport.top + gap,
          width: Math.max(minWindowWidth, viewport.width - 2 * gap),
          height: Math.max(160, Math.min(560, viewport.height - viewport.top - 2 * gap)),
        };
      }
      const boardBounds = board[0].getBoundingClientRect?.() || { left: 0, top: 0, right: 0, bottom: 0 };
      const panelBounds = panel[0].getBoundingClientRect?.() || { left: 0, top: 0, right: 0, bottom: 0 };
      if (columns === 3) {
        const chapters = $('div.study__chapters');
        const chapterBottom = chapters.length ? chapters[0].getBoundingClientRect?.().bottom : undefined;
        const bottom = viewport.height - gap;
        const top = Math.max(viewport.top, Math.min(chapterBottom ?? panelBounds.top + 64, bottom - 480));
        return { left: gap, top, width: Math.max(0, boardBounds.left - 2 * gap), height: Math.max(0, bottom - top) };
      }
      const top = panelBounds.top + 64;
      const left = columns > 2 ? gap : boardBounds.right + gap;
      const right = columns > 2 ? boardBounds.left - gap : viewport.width - gap;
      return {
        left,
        top,
        width: Math.max(minWindowWidth, right - left),
        height: Math.min(Math.max(boardBounds.bottom - top, 480), viewport.height - gap - top),
      };
    }

    toggleHost() {
      const lt = this.lichessTools;
      const $ = lt.$;
      for (const selector of ['.study__side .tabs-horiz', 'div.tabs-horiz', '.study__side', 'div.analyse__tools', 'body']) {
        const found = $(selector);
        if (found.length) return found.eq(0);
      }
      return undefined;
    }

    async installToggle() {
      const host = this.toggleHost();
      if (!host?.length) return false;
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      const button = $('<button class="records-db-button" type="button">')
        .attr('title', trans.noarg('recordsDbButtonTitle'))
        .attr('tabindex', '0')
        .append($('<icon>').attr('data-icon', lt.icon.StudyBoard));
      button.on('click', (ev) => {
        if (ev.button) return;
        ev.preventDefault?.();
        this.toggle();
      });
      const firstChild = host.children().eq(0);
      if (firstChild.length) button.insertBefore(firstChild);
      else button.appendTo(host);
      this.toggleButton = button;
      return true;
    }

    removeToggle() {
      if (this.toggleButton) this.toggleButton.remove();
      this.toggleButton = undefined;
    }
  }

  LiChessTools.Tools.RecordsDbUi = RecordsDbUiTool;
})();




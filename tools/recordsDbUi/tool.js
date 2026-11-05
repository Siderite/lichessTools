(() => {

  let nextTabId = 0;
  const recordsDragType = 'application/x-lichess-records-db';

  // How many records the filter scores at most - the product owns this number, so it is edited
  // here rather than carried as a preference.
  const recordsDbMaxResults = 1000;

  // A leaf that opens something leaves this key behind for the page it lands on. It lives in
  // `sessionStorage`, so only the trip inside the same tab carries it, and only a trip younger
  // than `treeHandoffMs` is spent - see `openLeaf` and `RecordsDbCtrl.handoff`.
  const treeHandoffKey = 'LichessTools.collectionTree.openFromTree';
  const treeHandoffMs = 5000;

  // Intl keys are flat camelCase, so a state or a kind spells its own capital.
  const camel = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  let recordsDbModule;

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
        'recordsDbHiddenCount': 'Hidden by the filter',
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
        'recordsDbHiddenCount': 'Ascunse de filtru',
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
      if (!recordsDbModule) {
        recordsDbModule = new RecordsDbModule(lt);
        recordsDbModule.recordsDbCtrl = new RecordsDbCtrl(lt, lt.recordsDbHarvest);
        recordsDbModule.windowEventHandler = new WindowEventHandler(lt);
        recordsDbModule.navigation = new RecordsNavigation(lt);
        recordsDbModule.searchEngine = new RecordsSearchEngine(lt, lt.recordsDbHarvest);
        recordsDbModule.highlightMatch = highlightMatch;
      }
      this.module = recordsDbModule;
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('recordsDbUi');
      this.logOption('Records database', value);
      const ctrl = recordsDbModule?.recordsDbCtrl;
      // Close whatever the last page left open before deciding again.
      if (ctrl) {
        await ctrl.close();
        ctrl.removeToggle();
      }
      // The hand-off is spent on every page load, before anything else decides: a flag nobody
      // spends would otherwise reopen the window on the next visit of that study.
      const arrived = ctrl ? await ctrl.handoff() : false;
      if (value === false || !ctrl) return;
      if (!ctrl.canOpen()) {
        // The store already captured the study; only the window is short.
        this.logOption('Records database', 'cannot open here');
        return;
      }
      await ctrl.load();
      await ctrl.installToggle();
      // A row of the tree opened this study, so the window comes with the trip - the user never
      // hunts for the toggle on a page they reached by opening a row.
      if (arrived) {
        this.logOption('Opened from tree', true);
        await ctrl.open();
      }
    }

    canOpen() {
      return !!recordsDbModule?.recordsDbCtrl?.canOpen();
    }

  }


  class RecordsDbModule {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.maxResults = recordsDbMaxResults;
      this.recordsDbCtrl;
      this.windowEventHandler;
      this.navigation;
      this.searchEngine;
    }
  }

  // The tab base shared by every content ----------------------------------------------------------

  // `abstract` stays a doc comment: `kind`/`label` are set by every concrete tab.
  class TabContentCtrl {

    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
      this.sync = store.syncCtrl;
      this.kind = undefined;
      this.label = undefined;
      this.icon = undefined;
      this.id = 'lichessTools-recordsDbUi-tab-' + nextTabId++;
      this.closable = false;
      this.signal;
      this.lifetime;
      this.loaded = false;
      this.onChange = () => {};
    }

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

    destroy() {
      this.lifetime?.abort();
      this.lifetime = undefined;
      this.onChange = () => {};
    }

    async load() {}

    // The window blob asks every content for the shape a user left behind; only a tree has a
    // shape to hand over, so the base says nothing was left.
    frozenView() {
      return undefined;
    }

    get loading() {
      return false;
    }

    // `exhausted` is written by the paging path below (a result list pages, a static list never
    // does), so the stub needs a setter to accept the write and keep the default "nothing left
    // to load".
    get exhausted() {
      return this.exhaustedSlot ?? true;
    }

    set exhausted(value) {
      this.exhaustedSlot = value;
    }

    get error() {
      return undefined;
    }
  }



  class BookmarkTabContent extends TabContentCtrl {
    constructor(lichessTools, store) {
      super(lichessTools, store);
      this.kind = 'treeTab';
      this.icon = lichessTools.icon.Book;
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
      this.recordCache = new Map();
      this.editing;
      this.visible = 50;
      this.anchor;
      this.message;
      this.revision = 0;
      this.writes = Promise.resolve();
    }

    // The registry is the store's, so the tree never hardcodes what a kind means.
    get registry() {
      return this.store.kindRegistry;
    }

    get studies() {
      return this.sync.studies;
    }

    get error() {
      return this.tabError;
    }

    set error(value) {
      this.tabError = value;
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
      const engine = recordsDbModule?.searchEngine;
      if (!engine) return;
      const page = await engine.run({ order: 'relevant', study: { text: query } }, { cursor: 0, size: recordsDbModule.maxResults });
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

    get results() {
      return this.rows.slice(0, this.visible);
    }

    get hasMore() {
      return this.rows.length > this.visible;
    }

    // One visible page of results, so any overflow past it is stated.
    hiddenCount() {
      return Math.max(0, this.rows.length - this.visible);
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

    // The tree host a window paints into, carrying the listeners that belong to the tree itself. The
    // frame keeps it, so a paint only swaps the pieces under it and the filters rack that carries the
    // textbox stays whole.
    viewHost() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const host = $('<div class="record-list">');
      listData(host, this.id);
      return host
        .on('dragend', clearDrop)
        .on('dragleave', clearDrop)
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
        });
    }

    filterChanged() {
      this.visible = 50;
      this.revision++;
      this.onChange();
    }

    async loadMore() {
      const hidden = this.hiddenCount();
      if (!hidden) return;
      this.visible += Math.min(50, hidden);
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

    // The shape the user left, written into the window blob at `freeze`: each row is its path plus
    // its own name or id, so a tree that changed shape since the save cannot park an open folder
    // or a selected row on a row that merely happens to hold the same slot.
    frozenView() {
      const expanded = [];
      const selected = [];
      const walk = (nodes, path) => nodes.forEach((node, index) => {
        const at = path.concat([index]);
        const key = this.folder(node) ? node.name : node.id;
        if (key !== undefined && key !== '') {
          if (this.expanded.has(node)) expanded.push({ path: at, key });
          if (this.selected.has(node)) selected.push({ path: at, key });
        }
        walk(node.children || [], at);
      });
      walk(this.entries, []);
      return { expanded, selected };
    }

    // The other half of that round trip: a load walks the tree it just rebuilt and keeps only the
    // rows the blob still names, so a stale path leaves its folder collapsed rather than opening
    // the wrong one.
    restoreView(storedRows) {
      const view = (storedRows || []).find((row) => row?.kind === this.kind)?.view;
      const usable = (list) => Array.isArray(list) ? list : [];
      const openFolders = usable(view?.expanded);
      const keptRows = usable(view?.selected);
      const named = (node, at, record) => {
        const key = this.folder(node) ? node.name : node.id;
        if (key === undefined || key === '' || record?.key !== key) return false;
        return Array.isArray(record.path) && record.path.length === at.length &&
          at.every((step, depth) => record.path[depth] === step);
      };
      const expanded = new Set();
      const selected = new Set();
      const walk = (nodes, path) => nodes.forEach((node, index) => {
        const at = path.concat([index]);
        if (openFolders.some((record) => named(node, at, record))) expanded.add(node);
        if (keptRows.some((record) => named(node, at, record))) selected.add(node);
        walk(node.children || [], at);
      });
      walk(this.entries, []);
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
        const navigation = recordsDbModule?.navigation;
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
      const ceiling = Math.max(size, recordsDbModule?.maxResults ?? size);
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
      navigate: () => recordsDbModule.navigation.load(study.studyId, position?.chapterId),
    };
  }

  function listData(node, tabId) {
    return node.attr('data-key', tabId);
  }



  const popupId = 'lichessTools-recordsContentPreview';
  const popupPreviews = new WeakMap();
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
    const lt = recordsDbModule?.lichessTools;
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
      .on('mouseover mousemove', () => {
        // The row's `mouseout` fired first and scheduled the hide; arriving here spends it.
        cancelPopupHide();
        if (popupShown) showStudyPopup(popupShown);
      })
      .on('mouseout', () => schedulePopupHide());
    return fresh.appendTo(body);
  }

  function showStudyPopup(anchor, items, title) {
    const lt = recordsDbModule?.lichessTools;
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
        link.on('click', (ev) => {
          if (ev.button || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || !entry.navigate) return;
          ev.preventDefault();
          hideStudyPopup(node);
          entry.navigate();
        });
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
    const lt = recordsDbModule?.lichessTools;
    if (!lt || !popupShown || hideTimeout) return;
    hideTimeout = lt.global.setTimeout(() => {
      hideTimeout = null;
      hideStudyPopup(popupShown);
    }, popupLeaveMs);
  }

  function cancelPopupHide() {
    if (!hideTimeout) return;
    const lt = recordsDbModule?.lichessTools;
    if (lt) lt.global.clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  function hideStudyPopup(anchor) {
    cancelPopupHide();
    const lt = recordsDbModule?.lichessTools;
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
    const lt = recordsDbModule.lichessTools;
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
    const $ = recordsDbModule.lichessTools.$;
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
    const marked = recordsDbModule.lichessTools.$('.lichessTools-recordsDbUi [data-bookmark-drop]');
    if (marked.length) marked.removeAttr('data-bookmark-drop');
  }

  function bookmarkView(content, host, box) {
    const lt = recordsDbModule.lichessTools;
    const trans = lt.translator;
    const $ = lt.$;
    const registry = content.registry;

    // The local db feeds the mirror off the critical path - the member blob first, then the captures
    // the tree filed - so a row can be painted before the study it names has a record. The view
    // rebuilds on every publish, and this is what makes that rebuild answer the mirror it now sees
    // rather than the cache the first paint left behind.
    if (content.hayRevision !== content.sync.publishRevision) content.refreshCaches();

    // The `insertion` over the merged tree: upper half of a row inserts before it, the lower
    // half of a folder drops inside it, otherwise after the row next sibling.
    const insertion = (ev, row) => {
      if (!row) return { parent: undefined, before: undefined, position: 'before' };
      const { entry, path } = row;
      const parent = path.length > 1 ? content.at(path.slice(0, -1)) : undefined;
      const rect = ev.currentTarget?.getBoundingClientRect?.() || { top: 0, height: 0 };
      if (ev.clientY < rect.top + rect.height / 2) return { parent, before: entry, position: 'before' };
      if (!content.folder(entry)) return { parent, before: entry, position: 'after' };
      // A folder with nothing in it has no first child to land before, so the drop appends inside
      // it - the half-rule is the same, only the marker it names is missing.
      return { parent: entry, before: entry.children?.[0], position: 'inside' };
    };

    const carried = (ev) => {
      const transfer = ev?.dataTransfer;
      if (!transfer || !(transfer.types || []).includes(recordsDragType)) return undefined;
      const raw = transfer.getData(recordsDragType);
      return raw ? typeof raw == 'string' ? lt.jsonParse(raw) : raw : undefined;
    };

    const dragOver = (ev, row) => {
      const transfer = ev?.dataTransfer;
      if (!transfer || !(transfer.types || []).includes(recordsDragType)) return;
      ev.preventDefault?.();
      ev.stopPropagation?.();
      clearDrop();
      const target = insertion(ev, row);
      const node = $(ev.currentTarget);
      if (node.length) node.attr('data-bookmark-drop', target.position);
      transfer.dropEffect = transfer.effectAllowed === 'copy' ? 'copy' : 'move';
    };

    const dropInto = (ev, row) => {
      const payload = carried(ev);
      if (!payload || ev._recordsDbDrop) return;
      ev.preventDefault?.();
      ev.stopPropagation?.();
      ev._recordsDbDrop = true;
      clearDrop();
      const target = insertion(ev, row);
      content.drop(payload, target.parent, target.before);
    };

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
        toggle.on('click', (ev) => content.toggle(entry));
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
          li
            .on('mouseover', (ev) => {
              // A row arriving spends a hide the pointer left on a nearby tooltip, then shows
              // this row's chapters - one gesture, one tooltip.
              cancelPopupHide();
              showStudyPopup(ev.currentTarget);
            })
            .on('mouseout', () => schedulePopupHide());
        }
      }

      // The row's own jump affordance sits at its right end as a link icon. Enter and double click
      // keep the keyboard path into openLeaf.
      if (jumpHref !== undefined) {
        const jump = $('<button class="btn-row-open" type="button">')
          .attr('title', trans.noarg('recordsDbOpenLink'));
        if (lt.icon.Link !== undefined) jump.attr('data-icon', lt.icon.Link);
        else jump.text(trans.noarg('recordsDbOpenLink'));
        jump.on('click', async (ev) => {
          if (ev.button || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault?.();
          await content.openLeaf(entry);
        });
        li.append(jump);
      }

      li
        .on('click', (ev) => {
          const hit = $(ev.target);
          if (hit.closest('a').length || hit.closest('button').length || hit.closest('input').length || hit.closest('form').length) return;
          content.select(entry, ev);
        })
        .on('dblclick', async (ev) => {
          // Double click opens a study; on a folder it stays the disclosure.
          const hit = $(ev.target);
          if (hit.closest('button').length) return;
          ev.preventDefault?.();
          if (folder) content.toggle(entry);
          else if (!dead) await content.openLeaf(entry);
        })
        .on('keydown', async (ev) => {
          const hit = $(ev.target);
          if (hit.closest('a').length || hit.closest('button').length || hit.closest('input').length) return;
          if (ev.key === ' ') {
            ev.preventDefault?.();
            content.select(entry, ev);
          } else if (ev.key === 'Enter') {
            // Keyboard Enter keeps the behaviour, and Enter on a leaf is the open chip's path.
            ev.preventDefault?.();
            if (folder) content.toggle(entry);
            else if (!dead) await content.openLeaf(entry);
          }
        })
        .on('dragstart', (ev) => {
          if (!ev.dataTransfer) return;
          ev.dataTransfer.effectAllowed = 'move';
          ev.dataTransfer.setData(recordsDragType, JSON.stringify(content.drag(entry)));
        })
        .on('dragover', (ev) => dragOver(ev, row))
        .on('dragleave', clearDrop)
        .on('dragend drop', (ev) => dropInto(ev, row));
      return li;
    };


    const shownCounts = content.kindCounts();
    const treeTotal = content.filedCount();
    const header = $('<div class="tree-header">');
    for (const kind of content.presentKinds()) {
      const line = $('<span class="tree-kind">').attr('data-kind', kind);
      line.text(shownCounts[kind] + ' ' + kindLabel(kind));
      header.append(line);
    }
    // The per-kind lines already say how many rows are painted, so no second tally repeats them,
    // and the capture state is not the user's decision - the tooltip answers as soon as the
    // mirror lands. What stays in the header is only what the tree cannot show by itself: an
    // empty tree, a leaf a read proved gone, a restore waiting, a confirm armed.
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
      error.append($('<button type="button">').text(trans.noarg('recordsDbRetry')).on('click', () => content.error?.retry?.()));
      body.append(error);
    }
    if (content.hasMore) {
      // One visible page where the four-tab UI had hasMore/cursor paging - the overflow is stated.
      const more = $('<div class="tree-more">');
      more.text(trans.pluralSame('recordsDbHiddenCount', content.hiddenCount()));
      more.append($('<button type="button">').text(trans.noarg('recordsDbRetry')).on('click', () => content.loadMore()));
      body.append(more);
    }
    const end = $('<div class="bookmark-end">')
      .on('dragover', (ev) => dragOver(ev))
      .on('dragleave', clearDrop)
      .on('dragend drop', (ev) => dropInto(ev));
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
      if (!this.cancel(ctrl)) ctrl.owner.closeWindow(ctrl);
    }

    // The gate, trimmed to the resize strips: only a primary press begins a gesture, and a finger
    // counts as one - a touch contact reports no button (`-1`), so both it and a left press open
    // the gate while a right or middle click never does.
    start(source, event) {
      const lt = this.lichessTools;
      source.owner.bringToFront(source);
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
    constructor(owner, contents, geometry) {
      this.owner = owner;
      this.contents = contents;
      this.geometry = geometry;
      this.windowFrame;
      this.redraw = () => this.windowFrame?.redraw();
      this.unwatch = owner.store.syncCtrl.watch(this.redraw);
    }

    async show() {
      if (this.windowFrame) return true;
      if (!this.owner.hasWindow(this)) return false;
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
      this.windowFrame = undefined;
      windowFrame?.close();
    }

    // The fail-soft shape: the blob keeps its `{kind, active, geometry, view}` rows, so an older
    // blob still parses and a newer one that names a kind this tool no longer has simply fails the
    // kind test in `load`. `view` is the shape the user left - the open folders and the selected
    // rows - and only a content that owns a shape fills it.
    freeze() {
      return this.contents.map((content) => ({
        kind: content.kind,
        active: true,
        geometry: { ...this.geometry },
        view: content.frozenView(),
      }));
    }

    setGeometry(rect) {
      this.geometry = rect;
      this.owner.save();
    }

    get activeContentCtrl() {
      return this.contents[0];
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
      const handler = recordsDbModule.windowEventHandler;
      root
        .on('close', () => {
          if (!this.closed && this.ctrl.windowFrame === this) this.ctrl.owner.closeWindow(this.ctrl);
        })
        .on('keydown', (ev) => handler.keyDown(this.ctrl, ev));
      const handle = root.children('.dialog-header');
      if (handle.length)
        handle.on('pointerup', () => {
          if (!this.frame) return;
          const rect = this.frame.dialog[0]?.getBoundingClientRect?.();
          if (rect) this.apply({ left: rect.x, top: rect.y, width: rect.width, height: rect.height });
        });
      await this.ctrl.owner.mount(this.ctrl);
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
      const content = this.ctrl.activeContentCtrl;
      const host = this.treeHost || content?.viewHost();
      const box = this.typedBox || content?.newFilterBox();
      // The tree host, its filters rack and its textbox belong to the window, not to the paint: a
      // paint fills the host with the fresh header, racks, tree and backup rack, and the rack that
      // already carries the textbox keeps it. A rebuilt textbox is taken off the page for a moment,
      // and a moment off the page is enough to lose the keyboard on it - typing "Par" one keystroke
      // at a time then answered "raP".
      const view = contentView(content, host, box);
      if (!view?.length) return;
      if (!this.treeHost) host.appendTo(this.scrollHost);
      this.treeHost = host;
      this.typedBox = box;
    }

    redraw() {
      this.render();
      this.apply(this.ctrl.geometry);
    }



    // The hosts the window keeps for its whole life: the gesture listeners hang on `div.inner-content`
    // under the page's own scroll host, and the five resize strips sit in the border box.
    innerHost() {
      const ctrl = this.ctrl;
      const handler = recordsDbModule.windowEventHandler;
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
      recordsDbModule.windowEventHandler.cancel(this.ctrl);
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
      recordsDbModule.windowEventHandler.cancel(this.ctrl);
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

  function contentView(content, host, box) {
    return content?.kind == 'treeTab' ? bookmarkView(content, host, box) : undefined;
  }


  class RecordsDbCtrl {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
      this.contents = [new BookmarkTabContent(lichessTools, store)];
      this.windowContents = new Map();
      this.toggleButton;
    }

    get windows() {
      return [...this.windowContents.keys()];
    }

    hasWindow(ctrl) {
      return this.windowContents.has(ctrl);
    }

    clearSelection() {
      for (const contents of this.windowContents.values()) {
        for (const content of contents) content.clearSelection();
      }
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

    async mount(ctrl) {
      if (!this.hasWindow(ctrl)) return;
      if (!this.canOpen()) return this.closeWindow(ctrl);
      this.bringToFront(ctrl);
      const contents = this.windowContents.get(ctrl);
      await Promise.all(contents.map((content) => content.init()));
      ctrl.focusContent();
    }

    bringToFront(ctrl) {
      const contents = this.windowContents.get(ctrl);
      if (!contents) return;
      this.windowContents.delete(ctrl);
      this.windowContents.set(ctrl, contents);
      let order = 0;
      for (const studyWindow of this.windows) studyWindow.windowFrame?.setOrder(order++);
    }

    async open() {
      if (!this.canOpen()) return;
      if (this.windows.some((ctrl) => ctrl.windowFrame)) return;
      if (!this.windowContents.size) await this.load();
      for (const ctrl of this.windows) await ctrl.show();
    }

    async close() {
      if (!this.windowContents.size) return;
      await this.save();
      for (const ctrl of this.windows) {
        ctrl.dispose();
        for (const content of this.windowContents.get(ctrl)) content.destroy();
      }
      this.windowContents.clear();
    }

    async toggle() {
      if (this.windows.some((ctrl) => ctrl.windowFrame)) await this.close();
      else await this.open();
    }

    closeWindow(ctrl) {
      const contents = this.windowContents.get(ctrl);
      if (!contents) return;
      // `recordsDbWindowCount` is gone: there is one window and closing it closes the whole state.
      if (this.windowContents.size === 1) return this.close();
      ctrl.dispose();
      this.windowContents.delete(ctrl);
      this.save();
    }

    // The fail-soft rule for the geometry blob: every number finite and positive, and a row
    // naming a kind this tool no longer renders is ignored - a blob an older version wrote with
    // four tabs then simply loads the default box rather than throwing on page load.
    storedGeometry(stored) {
      for (const row of stored || []) {
        const geometry = row?.geometry;
        if (!this.contents.some((content) => content.kind === row?.kind)) continue;
        if (!geometry || !['left', 'top', 'width', 'height'].every((key) => Number.isFinite(geometry[key]))) continue;
        if (geometry.width <= 0 || geometry.height <= 0) continue;
        return { ...geometry };
      }
      return undefined;
    }

    async load() {
      const lt = this.lichessTools;
      if (this.windowContents.size) return;
      const contents = [...this.contents];
      const geometry = this.storedGeometry(await this.store.idbStudy.loadWindows()) ?? this.initialGeometry();
      const ctrl = new WindowCtrl(this, contents, fitWindow(geometry, windowViewport(lt)));
      this.windowContents.set(ctrl, contents);
      for (const content of contents) content.onChange = ctrl.redraw;
    }

    save() {
      const stored = this.windows.flatMap((ctrl) => ctrl.freeze());
      return this.store.idbStudy.saveWindows(stored);
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




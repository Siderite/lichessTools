(() => {

  let nextContentId = 0;
  const recordsDragType = 'application/x-lichess-records-db';

  const recordsDbMaxResults = 10000;

  const treeHandoffKey = 'LichessTools.collectionTree.openFromTree';
  const treeHandoffMs = 5000;
  const treeReturnKey = 'LichessTools.collectionTree.cameFrom';
  const treeReturnTrail = 3;
  const treeReturnMs = 5 * 60 * 1000;
  const treePageKey = 'LichessTools.collectionTree.page';
  const windowOpenKey = 'LichessTools.collectionTree.windowOpen';
  const windowStateSaveMs = 10 * 1000;

  const recordsDbHoverReadLimit = 25;
  const recordsDbHoverReadDelayMs = 300;

  const camel = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const variantIcons = { chess960: 'DieSix', kingofthehill: 'FlagKingHill', threecheck: 'ThreeCheckStack', antichess: 'Antichess', atomic: 'Atom', horde: 'Keypad', racingkings: 'FlagRacingKings', crazyhouse: 'Crazyhouse' };
  const speedIcons = { ultrabullet: 'UltraBullet', bullet: 'Bullet', blitz: 'FlameBlitz', rapid: 'Rabbit', classical: 'Turtle', correspondence: 'PaperAirplane' };
  const speedWords = { ultrabullet: 'Ultra bullet', bullet: 'Bullet', blitz: 'Blitz', rapid: 'Rapid', classical: 'Classical', correspondence: 'Correspondence' };
  const containedCarrier = { chapter: 'studyId', studyPosition: 'studyId', blogPost: 'userId', forumPost: 'board', broadcastGame: 'slug' };
  const gameIconName = (node) =>
    variantIcons[String(node?.meta?.variant ?? '')] || speedIcons[String(node?.meta?.speed ?? '')] || 'Crown';
  const gameKeyId = (raw) => {
    const id = String(raw ?? '');
    return id.length === 8 ? id : id.length === 12 ? id.slice(0, 8) : undefined;
  };
  const gameSpeedOf = (game) => {
    const raw = game?.speed ?? game?.perf;
    return typeof raw == 'string' ? raw : String(raw?.key ?? '');
  };
  const gameVariantOf = (game) => {
    const raw = game?.variant;
    return typeof raw == 'string' ? raw : String(raw?.key ?? '');
  };
  const boardStateFor = (entry) => {
    const fen = entry?.kind == 'position' ? entry.id : entry?.meta?.fen;
    if (!fen) return undefined;
    return fen + ',' + (entry.meta?.orientation == 'black' ? 'black' : 'white') + ',' + (entry.meta?.lastMove || '');
  };
  const hoverBoardPx = 15 * 13;
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
        'recordsDbUndo': 'Undo',
        'recordsDbExpandFolder': 'Expand folder',
        'recordsDbCollapseFolder': 'Collapse folder',
        'recordsDbExpandBranch': 'Expand',
        'recordsDbCollapseBranch': 'Collapse',
        'recordsDbExpandAll': 'Expand all folders',
        'recordsDbCollapseAll': 'Collapse all folders',
        'filtersAccess': 'Access',
        'filtersVisibility': 'Visibility',
        'filtersKind': 'Kind',
        'recordsDbAdd': 'Add',
        'recordsDbAddOptions': 'Choose what to add',
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
        'recordsDbCountForum': 'Forum boards: %s',
        'recordsDbCountForumPost': 'Forum posts: %s',
        'recordsDbCountStudyPosition': 'Study positions: %s',
        'recordsDbCountBroadcast': 'Broadcasts: %s',
        'recordsDbCountBroadcastGame': 'Broadcast games: %s',
        'recordsDbCountPlayer': 'Players: %s',
        'recordsDbCountCoach': 'Coaches: %s',
        'recordsDbCountStreamer': 'Streamers: %s',
        'recordsDbCountTeam': 'Teams: %s',
        'recordsDbCountTournament': 'Tournaments: %s',
        'recordsDbCountUrl': 'Links: %s',
        'recordsDbPressAgain': 'Press again to drop what is selected',
        'recordsDbDeleteQuestion': 'Delete selected?',
        'recordsDbRestoreQuestion': 'Replace the tree from file?',
        'recordsDbRestoreFailed': 'Not a tree file',
        'recordsDbRestoredTree': 'Restored from file',
        'recordsDbRemovedCount': 'Removed',
        'recordsDbAddedStudy': 'Filed the study',
        'recordsDbAddedItem': 'Filed the item',
        'recordsDbNothingToFile': 'Nothing left to file',
        'recordsDbAddHarvestFailed': 'The harvest found nothing to file',
        'recordsDbAddSelfParent': 'Cannot file an item inside itself',
        'recordsDbBackup': 'Backup',

        'recordsDbRestoreTree': 'Restore',
        'recordsDbDownloadedTree': 'Wrote the tree to file',
        'recordsDbOpenButton': 'Open',

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
        'kindForum': 'Forum',
        'kindForumPost': 'Forum post',
        'kindBroadcast': 'Broadcast',
        'kindBroadcastGame': 'Broadcast game',
        'kindStudyPosition': 'Study position',
        'kindPlayer': 'Player',
        'kindCoach': 'Coach',
        'kindStreamer': 'Streamer',
        'kindTeam': 'Team',
        'kindTournament': 'Tournament',
        'kindTournamentSwiss': 'Swiss tournament',
        'kindTournamentArena': 'Arena tournament',
        'kindUrl': 'Link',
        'recordsDbNodeMissing': 'That move is no longer in the chapter',
        'bySomeone': 'by %s',
        'popupControl': 'Time control',
        'popupVariant': 'Variant',
        'popupResult': 'Result',
        'popupPlayed': 'Played',
        'popupStarted': 'Started',
        'popupRound': 'Round',
        'popupStandings': 'Standings',
        'popupChapters': 'Chapters',
        'popupMembers': 'Members',
        'popupRatings': 'Ratings',
        'popupJoined': 'Joined',
        'popupAuthor': 'Author',
        'popupRated': 'Rated',
        'popupOwner': 'Owner',
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
        'recordsDbUndo': 'Anuleaz\u0103',
        'recordsDbExpandFolder': 'Expandeaz\u0103 folder',
        'recordsDbCollapseFolder': 'Colapseaz\u0103 folder',
        'recordsDbExpandBranch': 'Expandeaz\u0103',
        'recordsDbCollapseBranch': 'Colapseaz\u0103',
        'recordsDbExpandAll': 'Expandeaz\u0103 toate folderele',
        'recordsDbCollapseAll': 'Colapseaz\u0103 toate folderele',

        'filtersAccess': 'Acces',
        'filtersVisibility': 'Vizibilitate',
        'filtersKind': 'Tip',
        'recordsDbAdd': 'Adaug\u0103',
        'recordsDbAddOptions': 'Alege ce s\u0103 adaugi',
        'recordsDbSelect': 'Selecteaz\u0103',
        'recordsDbSelectOn': 'Selectare activ\u0103',
        'recordsDbSelectOff': 'Selectare inactiv\u0103',
        'recordsDbDelete': '\u015eterge',
        'recordsDbChipNotApplicable': 'Nimic de ales',

        'recordsDbEmptyNote': 'Arborele este gol',
        'recordsDbMissingStudy': 'Studiul lipse\u015fte din baza de date',
        'recordsDbStudyGone': 'Acest studiu nu mai exist\u0103',
        'recordsDbItemsCount': 'Elemente: %s',
        'recordsDbCountStudy': 'Studii: %s',
        'recordsDbCountChapter': 'Capitole: %s',
        'recordsDbCountGame': 'Partide: %s',
        'recordsDbCountPosition': 'Pozi\u0163ii: %s',
        'recordsDbCountPuzzle': 'Probleme: %s',
        'recordsDbCountBlog': 'Bloguri: %s',
        'recordsDbCountBlogPost': 'Post\u0103ri blog: %s',
        'recordsDbCountForum': 'Forumuri: %s',
        'recordsDbCountForumPost': 'Post\u0103ri forum: %s',
        'recordsDbCountStudyPosition': 'Pozi\u0163ii studiu: %s',
        'recordsDbCountBroadcast': 'Transmisiuni: %s',
        'recordsDbCountBroadcastGame': 'Jocuri transmisiuni: %s',
        'recordsDbCountPlayer': 'Juc\u0103tori: %s',
        'recordsDbCountCoach': 'Antrenori: %s',
        'recordsDbCountStreamer': 'Streameri: %s',
        'recordsDbCountTeam': 'Echipe: %s',
        'recordsDbCountTournament': 'Turnee: %s',
        'recordsDbCountUrl': 'Linkuri: %s',
        'recordsDbPressAgain': 'Apas\u0103 din nou pentru plasarea selec\u0163iei',
        'recordsDbDeleteQuestion': '\u015eterge cele selectate?',
        'recordsDbRestoreQuestion': '\u00cenlocuire arbore din fi\u015fier?',
        'recordsDbRestoreFailed': 'Nu este un fi\u015fier arbore',
        'recordsDbRestoredTree': 'Restaurat din fi\u015fier',
        'recordsDbRemovedCount': '\u015eters',
        'recordsDbAddedStudy': 'Studiul a fost \u00eenregistrat',
        'recordsDbAddedItem': 'Element \u00eenregistrat',
        'recordsDbNothingToFile': 'Nimic r\u0103mas de \u00eenregistrat',
        'recordsDbAddHarvestFailed': 'Recoltarea nu a g\u0103sit nimic de \u00eenregistrat',
        'recordsDbAddSelfParent': 'Nu po\u0163i \u00eenregistra un element \u00een el \u00eensu\u015fi',
        'recordsDbBackup': 'Backup',

        'recordsDbRestoreTree': 'Restaurare',
        'recordsDbDownloadedTree': 'Am salvat arborele \u00een fi\u015fier',
        'recordsDbOpenButton': 'Deschide',

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
        'kindBlogPost': 'Postare blog',
        'kindForum': 'Forum',
        'kindForumPost': 'Postare forum',
        'kindBroadcast': 'Transmisiune',
        'kindBroadcastGame': 'Joc transmisiune',
        'kindStudyPosition': 'Pozi\u0163ie studiu',
        'kindPlayer': 'Juc\u0103tor',
        'kindCoach': 'Antrenor',
        'kindStreamer': 'Streamer',
        'kindTeam': 'Echip\u0103',
        'kindTournament': 'Turneu',
        'kindTournamentSwiss': 'Turneu elve\u016fian',
        'kindTournamentArena': 'Turneu \u00een aren\u0103',
        'kindUrl': 'Link',
        'recordsDbNodeMissing': 'Mutarea nu mai exist\u0103 \u00een capitol',
        'bySomeone': 'de %s',
        'popupControl': 'Control tip',
        'popupVariant': 'Variant\u0103',
        'popupResult': 'Rezultat',
        'popupPlayed': 'Jucat',
        'popupStarted': '\u00cenceput',
        'popupRound': 'Runda',
        'popupStandings': 'Clasament',
        'popupChapters': 'Capitole',
        'popupMembers': 'Membri',
        'popupRatings': 'Rating-uri',
        'popupJoined': '\u00censcris',
        'popupAuthor': 'Autor',
        'popupRated': 'Oficial',
        'popupOwner': 'Creator',
        'recordsDbButtonTitle': 'LiChess Tools - fereastr\u0103 baz\u0103 de date \u00eenregistr\u0103ri'
      }
    };

    async init() {
      const lt = this.lichessTools;
      if (!lt.recordsDbHarvest) return;
      if (!recordsDbInstance) {
        recordsDbInstance = this;
        this.recordsDbCtrl = new RecordsDbCtrl(lt, lt.recordsDbHarvest);
        this.navigation = new RecordsNavigation(lt);
        this.searchEngine = new RecordsSearchEngine(lt, lt.recordsDbHarvest);
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('recordsDbUi');
      this.logOption('Records database', value);
      const ctrl = recordsDbInstance?.recordsDbCtrl;
      if (ctrl) {
        await ctrl.teardown();
        ctrl.removeToggle();
      }

      const arrived = ctrl ? await ctrl.handoff() : false;
      const returned = ctrl ? await ctrl.returned() : false;
      const stayed = ctrl ? await ctrl.stayOpen() : false;
      if (value === false || !ctrl) return;
      if (!ctrl.canPlace()) {
        this.logOption('Records database', 'cannot open here');
        return;
      }
      await ctrl.load();
      await ctrl.installToggle();
      if ((arrived || returned || stayed) && ctrl.canOpen()) {
        if (arrived) this.logOption('Opened from tree', true);
        if (returned) this.logOption('Came back to a page that had the window', true);
        if (stayed) this.logOption('Kept open since the window was left open', true);
        await ctrl.open();
        return;
      }
      await ctrl.content.init();
      ctrl.content.enrichFromPage();
    }

    canOpen() {
      return !!recordsDbInstance?.recordsDbCtrl?.canOpen();
    }

  }


  class BookmarkTabContent {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
      this.sync = store.syncCtrl;
      this.kind = 'treeTab';
      this.id = 'lichessTools-recordsDbUi-content-' + nextContentId++;
      this.entries = [];
      this.branches = new Map();
      this.selected = new Set();
      this.expanded = new Set();
      this.collapsed = new Set();
      this.undoStack = [];
      this.query = '';
      this.terms = [];
      this.filters = { access: 'all', visibility: 'all', kind: 'all' };
      this.selectMode = false;
      this.addChoice = 'study';
      this.addMenuOpen = false;
      this.confirmBar;
      this.hits;
      this.hitsQuery;
      this.haystackCache = new Map();
      this.hayRevision;
      this.goneNodes = new Set();
      this.hoverReads = new Set();
      this.recordCache = new Map();
      this.rowIndex = new WeakMap();
      this.popupNodes = new WeakSet();
      this.revision = 0;
      this.writes = Promise.resolve();
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
      if (!signal.aborted) this.armPageDrag();
    }

    destroy() {
      this.lifetime?.abort();
      this.lifetime = undefined;
      this.onChange = () => {};
    }

    logState(label, value) {
      const lt = this.lichessTools;
      lt.global?.console?.debug(label + ' %c' + value, 'color:#9980FF');
    }


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

    moveText(ply, san) {
      if (!san || !Number.isFinite(ply) || ply < 1) return '';
      return Math.ceil(ply / 2) + (ply % 2 ? '.' : '...') + ' ' + String(san);
    }

    leafLabel(node) {
      const record = this.recordCache.get(node);
      const owned = node?.label;
      const tempName = !!node?.meta?.nameTemp && node?.meta?.renamed === undefined;
      if (owned != null && String(owned).length && !tempName) return String(owned);
      if (node?.kind == 'chapter') {
        const own = (record?.chapters || []).find((chapter) => chapter?.id === node.id);
        if (own?.name) return String(own.name);
      }
      if (node?.kind == 'studyPosition') {
        const own = (record?.chapters || []).find((chapter) => chapter?.id === node?.meta?.chapterId);
        const where = [own?.name, this.moveText(node?.meta?.ply, node?.meta?.san)].filter((part) => part?.length).join(' | ');
        if (where.length) return where;
      }
      const recordName = record?.studyName || record?.name;
      if (recordName) return String(recordName);
      return owned != null && String(owned).length ? String(owned) : '';
    }

    recordFor(node) {
      return this.recordCache.get(node);
    }

    studyRecordFor(node) {
      return this.studies.get(String(node?.meta?.studyId ?? ''));
    }

    threadPoster() {
      const lt = this.lichessTools;
      const anchors = lt.$('a');
      for (let at = 0; at < anchors.length; at += 1) {
        const href = this.domAttr(anchors.eq(at), 'href');
        const at2 = /^\/@\/([^\/?#]+)$/.exec(href);
        if (at2?.[1]) return at2[1];
      }
      return undefined;
    }

    armPageDrag() {
      const lt = this.lichessTools;
      const anchors = lt.$('a');
      let armed = 0;
      for (let at = 0; at < anchors.length; at += 1) {
        const anchor = anchors.eq(at);
        if (this.domAttr(anchor, 'draggable') !== 'false') continue;
        if (!this.pageLeaf(anchor)) continue;
        anchor.attr('draggable', 'true');
        armed += 1;
      }
      if (armed) this.logState('Draggable links', armed);
    }

    lichessRoute(href) {
      const raw = String(href ?? '').trim();
      if (!raw || raw.startsWith('#')) return undefined;
      const at = /^(https?:\/\/[^/]+)?(\/[^#]*)$/.exec(raw);
      if (!at) return undefined;
      if (at[1] && !/lichess\.org$/i.test(at[1])) return undefined;
      const path = at[2].replace(/\/+$/, '');
      return path && path !== '/' ? path : undefined;
    }

    pageTitle() {
      const lt = this.lichessTools;
      const title = String(lt.global?.document?.title ?? '').trim();
      const cut = title.lastIndexOf(' \u2022 ');
      const name = cut > 0 ? title.slice(0, cut).trim() : title;
      return name.length ? name : undefined;
    }

    humaniseSlug(slug) {
      const text = String(slug || '').replace(/-/g, ' ').trim();
      return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    }

    puzzleName(id, data) {
      const rating = data?.rating;
      const key = '#' + String(id);
      return rating === undefined || rating === '' ? key : key + '/' + String(rating);
    }

    eachNode(nodes, visit) {
      for (const node of nodes || []) {
        visit(node);
        this.eachNode(node.children || [], visit);
      }
    }

    presentKinds() {
      const present = new Set();
      this.eachNode(this.entries, (node) => present.add(node?.kind));
      return this.store.collectionKinds.filter((kind) => present.has(kind));
    }

    chipScope() {
      return this.filters.kind == 'all' ? this.presentKinds() : [this.filters.kind];
    }

    chipApplicable(which) {
      if (which == 'kind') return this.chipScope().length > 1;
      const field = which == 'access' ? 'canWrite' : 'visibility';
      return this.chipScope().some((kind) => this.registry[kind]?.[field] !== undefined);
    }

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
        this.refreshCaches();
        await this.sync.setTreeIds(this.treeStudyIds()).catch(() => null);
        const filters = await this.store.collectionTree.loadFilters();
        this.filters = { ...this.filters, ...filters };
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
      this.hayRevision = this.sync.publishRevision;
    }

    haystackFor(node, record) {
      if (record) {
        if (node.kind == 'chapter') {
          const chapter = record.chapters?.find((chapter) => chapter.id === node.id);
          return (chapter ? this.store.chapterHaystack(chapter) : '') + ' ' + String(node.label ?? '');
        }
        return this.registry[node.kind]?.haystack?.(record) ?? '';
      }
      return [node.label, node.meta?.title, node.meta?.author, node.meta?.line].filter(Boolean).join(' ').toLowerCase();
    }

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

    passes(node) {
      if (this.filters.kind != 'all' && node.kind != this.filters.kind) return false;
      const record = this.recordCache.get(node);
      const row = this.registry[node.kind];
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
      if (node.kind == 'chapter' && this.hits?.has(node?.meta?.studyId)) {
        const fields = this.hits.get(node.meta.studyId);
        if (fields?.[node.id]) return true;
      }
      const haystack = this.haystackCache.get(node) ?? '';
      if (terms.every((term) => haystack.includes(term))) return true;
      const label = String(node.label ?? '') + ' ' + [node.meta?.title, node.meta?.author].filter(Boolean).join(' ');
      return terms.every((term) => label.toLowerCase().includes(term));
    }


    get rows() {
      const filtering = !!this.terms.length;
      const visit = (nodes, parent) =>
        nodes.flatMap((node, index) => {
          const path = [...parent, index];
          const isFolder = this.folder(node);
          if (!isFolder && !this.passes(node)) return [];
          const children = visit(node.children || [], path);
          if (!isFolder && !children.length) return [{ entry: node, path }];
          const open = isFolder
            ? this.expanded.has(node) || (filtering && children.length)
            : !this.collapsed.has(node) || (filtering && children.length);
          const row = [{ entry: node, path, shown: children.length }];
          if (open) return [...row, ...children];
          return row;
        });
      return visit(this.entries, []);
    }

    get results() {
      return this.rows;
    }

    kindCounts() {
      const counts = {};
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node) && this.passes(node)) counts[node.kind] = (counts[node.kind] || 0) + 1;
      });
      return counts;
    }

    isGone(node) {
      if (this.goneNodes.has(node)) return true;
      const row = this.registry[node.kind];
      return row ? !!row.isDead(this.recordCache.get(node)) : true;
    }

    missingCount() {
      let missing = 0;
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node) && this.isGone(node)) missing++;
      });
      return missing;
    }

    treeStudyIds(nodes = this.entries, ids = new Set()) {
      this.eachNode(nodes, (node) => {
        if (node.kind == 'study') ids.add(node.id);
      });
      return ids;
    }

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
          this.hoverReads.delete(node.id);
        }
      };
      harvest();
      return true;
    }

    filedCount() {
      let leaves = 0;
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node)) leaves++;
      });
      return leaves;
    }

    folderNodes(nodes = this.entries, found = []) {
      this.eachNode(nodes, (node) => {
        if (this.folder(node)) found.push(node);
      });
      return found;
    }

    parentNodes(nodes = this.entries, found = []) {
      this.eachNode(nodes, (node) => {
        if (this.folder(node) || (node?.children || []).length) found.push(node);
      });
      return found;
    }

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

    viewHost() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.undoStack = [];
      this.pendingDrag = undefined;
      this.pageDragAttached = false;
      const host = $('<div class="record-list">');
      const pressWindowMs = 500;
      const rowPress = new Map();
      const rowOpened = new Map();
      const openGesture = async (info) => {
        if (info.folder) this.toggle(info.entry);
        else if (!info.dead) await this.openLeaf(info.entry);
      };
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
      const openedPress = (entry, at = Date.now()) => {
        const opened = rowOpened.get(entry);
        return opened !== undefined && at - opened < pressWindowMs;
      };
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
        if (!ev.dataTransfer || !info?.row || info.chip || info.dead) {
          return;
        }
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData(recordsDragType, JSON.stringify(this.drag(info.entry)));
      };
      const hoverBoards = new Map();
      const hoverShow = (entry, node) => {
        const state = entry ? boardStateFor(entry) : undefined;
        if (!state) return;
        let board = hoverBoards.get(entry.id);
        if (!board) {
          const host = lt.$('main');
          if (!host.length) return;
          board = $('<div class="records-db-mini-board">')
            .append($('<span class="mini-board mini-board--init">').attr('data-state', state));
          host.append(board);
          lt.uiApi?.initializeDom?.(board[0]);
          hoverBoards.set(entry.id, board);
        }
        const rowEl = lt.$(node);
        const popupWrap = lt.$('#' + popupId);
        const slot = popupWrap.length ? popupWrap.find('li.popup-board') : undefined;
        const inReading = slot?.length > 0;
        const bounds = (inReading ? slot : rowEl)[0]?.getBoundingClientRect?.();
        if (!bounds) return;
        const own = board[0]?.getBoundingClientRect?.();
        const width = own?.width || hoverBoardPx;
        const height = own?.height || width;
        const viewport = lt.global?.window;
        const innerWidth = viewport?.innerWidth || 0;
        const innerHeight = viewport?.innerHeight || 0;
        const left = Math.round(inReading ? bounds.left : bounds.left + bounds.width - width - 4);
        const top = Math.round(inReading ? bounds.top : bounds.top + bounds.height / 2 - height / 2);
        board.css('left', String(Math.max(8, innerWidth ? Math.min(left, innerWidth - width - 8) : left)) + 'px');
        board.css('top', String(Math.max(8, innerHeight ? Math.min(top, innerHeight - height - 12) : top)) + 'px');
        board.css('opacity', '1');
      };
      const hoverHide = (entry) => {
        const board = entry ? hoverBoards.get(entry.id) : undefined;
        board?.css('opacity', '0');
      };
      const rowMouseOver = (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row || info.chip) return;
        if (info.preview && info.itemHover) {
          cancelPopupHide();
          showStudyPopup(info.popupAnchor);
        } else if (info.cold) this.hoverRead(info.entry);
        hoverShow(info.entry, info.node);
        if (info.profile) this.requestUserRead(info.entry);
      };
      const rowMouseOut = (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row) return;
        hoverHide(info.entry);
        if (info.preview && !info.chip) schedulePopupHide();
      };
      if (!this.pageDragAttached) {
        const doc = lt.global?.document;
        if (doc?.addEventListener) {
          this.pageDragAttached = true;
          doc.addEventListener('mousedown', (e) => this.dragArm(this.dragEv(e)), true);
          doc.addEventListener('mousemove', (e) => this.dragMove(this.dragEv(e)), true);
          doc.addEventListener('mouseup', (e) => this.dragRelease(this.dragEv(e)), true);
          doc.addEventListener('dragstart', (e) => this.dragStartGlobal(this.dragEv(e)), true);
          doc.addEventListener('dragover', (e) => this.dragOverGlobal(this.dragEv(e)), true);
          doc.addEventListener('dragend', (e) => this.dragEndGlobal(this.dragEv(e)), true);
        } else {
          const body = lt.$('body');
          if (body.length) {
            this.pageDragAttached = true;
            body
              .on('mousedown', (ev) => this.dragArm(ev))
              .on('mousemove', (ev) => this.dragMove(ev))
              .on('mouseup', (ev) => this.dragRelease(ev));
          }
        }
      }
      this.enrichFromPage();
      return host
        .on('dragend', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dropInto(ev, info.row, info.node);
          else this.externalDrop(ev);
        })
        .on('dragend', clearDrop)
        .on('dragleave', clearDrop)
        .on('dragover', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dragOver(ev, info.row, info.node);
          else if (ev.dataTransfer && this.pendingDrag) {
            ev.preventDefault?.();
            ev.dataTransfer.dropEffect = ev.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move';
          }
        })
        .on('drop', (ev) => {
          const info = this.rowTarget(ev);
          if (info) this.dropInto(ev, info.row, info.node);
          else this.externalDrop(ev);
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

    toggle(node) {
      if (this.folder(node)) {
        if (this.expanded.has(node)) this.expanded.delete(node);
        else this.expanded.add(node);
      } else {
        if (this.collapsed.has(node)) this.collapsed.delete(node);
        else this.collapsed.add(node);
      }
      this.onChange();
    }

    toggleAllExpanded() {
      const parents = this.parentNodes();
      if (!parents.length) return;
      const allOpen = parents.every((parent) => this.folder(parent)
        ? this.expanded.has(parent)
        : !this.collapsed.has(parent));
      if (allOpen) {
        this.expanded.clear();
        this.collapsed = new Set(parents.filter((parent) => !this.folder(parent)));
      } else {
        for (const parent of parents) {
          if (this.folder(parent)) this.expanded.add(parent);
          else this.collapsed.delete(parent);
        }
      }
      this.onChange();
    }

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

    frozenView() {
      if (!this.loaded) return undefined;
      const chains = this.shapeChains(this.entries);
      const expanded = [...this.expanded].map((node) => chains.get(node)).filter(Boolean);
      const collapsed = [...this.collapsed].map((node) => chains.get(node)).filter(Boolean);
      const selected = [...this.selected].map((node) => chains.get(node)).filter(Boolean);
      const missing = [...this.expanded, ...this.collapsed, ...this.selected].filter((node) => !chains.has(node));
      if (missing.length)
        this.logState('Old shape rows dropped', [missing.length, this.expanded.size + this.collapsed.size + this.selected.size].join('/') + ' ' + missing.map((node) => String(node?.name ?? node?.id ?? node?.kind ?? '?')).join(','));
      return { expanded, collapsed, selected };
    }

    restoreView(storedRows) {
      const rows = (storedRows || []).filter((row) => row?.kind === this.kind);
      const view = rows[0]?.view;
      const usable = (list) => Array.isArray(list) ? list.filter((chain) => Array.isArray(chain)) : [];
      const openFolders = usable(view?.expanded);
      const closedParents = usable(view?.collapsed);
      const keptRows = usable(view?.selected);
      if (rows.length && !view)
        this.logState('Shape missing from the blob', [this.kind, rows.length].join(' '));
      const chains = this.shapeChains(this.entries);
      const expanded = new Set();
      const collapsed = new Set();
      const selected = new Set();
      chains.forEach((chain, node) => {
        const key = chain.join(' / ');
        const isFolder = this.folder(node);
        if (isFolder && openFolders.some((record) => record.join(' / ') === key)) expanded.add(node);
        if (!isFolder && closedParents.some((record) => record.join(' / ') === key)) collapsed.add(node);
        if (keptRows.some((record) => record.join(' / ') === key)) selected.add(node);
      });
      if (openFolders.length && expanded.size < openFolders.length)
        this.logState('Tree folders lost', [openFolders.length - expanded.size, openFolders.length].join('/'));
      if (closedParents.length && collapsed.size < closedParents.length)
        this.logState('Tree leaf-parents lost', [closedParents.length - collapsed.size, closedParents.length].join('/'));
      this.expanded = expanded;
      this.collapsed = collapsed;
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
      const info = li.length ? this.rowIndex.get(li[0]) : undefined;
      if (info && this.popupNodes.has(hit[0])) return { ...info, itemHover: true };
      return info;
    }

    insertionTarget(ev, row, node) {
      if (!row) return { parent: undefined, before: undefined, position: 'before' };
      const { entry, path } = row;
      const parent = path.length > 1 ? this.at(path.slice(0, -1)) : undefined;
      const rect = node?.getBoundingClientRect?.() || { top: 0, height: 0 };
      if (ev.clientY < rect.top + rect.height / 2) return { parent, before: entry, position: 'before' };
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
      if (!transfer) return;
      if (!(transfer.types || []).includes(recordsDragType)) {
        if (!this.pendingDrag) return;
        ev.preventDefault?.();
        transfer.dropEffect = transfer.effectAllowed === 'copy' ? 'copy' : 'move';
        return;
      }
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

    pageLeaf(el) {
      const lt = this.lichessTools;
      const cls = this.domAttr(el, 'class');
      const href = this.domAttr(el, 'href');
      if (/(?:^|\s)draggable(?:\s|$)/.test(cls)) {
        const id = this.domAttr(el, 'data-id');
        if (id) {
          const heading = el.children('h3');
          const name = heading.length ? String(heading.text()).trim() : '';
          return {
            kind: 'chapter',
            id: String(id),
            label: name.length ? name : undefined,
            meta: { studyId: lt.lichess?.analysis?.study?.data?.id },
          };
        }
      }
      const player = /^\/@\/([^\/?]+)$/.exec(href) || /^\/'([^'\/]*)'$/.exec(href);
      if (player?.[1]) return this.playerEntry(player[1], el);
      const label = () => String(el.text()).trim();
      const path = String(href).split('#')[0];
      const study = /^\/study\/([a-zA-Z0-9]{8})$/.exec(path);
      if (study) return { kind: 'study', id: study[1], label: label() || undefined, meta: { nameTemp: 'page' } };
      const game = /^\/(?:game\/)?([a-zA-Z0-9]{8,12})(?:\/(?:white|black))?$/.exec(path);
      const draggedGame = gameKeyId(game?.[1]);
      if (draggedGame) return { kind: 'game', id: draggedGame, label: label() || undefined, meta: { nameTemp: 'page' } };
      const forumPost = /^\/forum\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)$/.exec(path);
      if (forumPost?.[2]) return { kind: 'forumPost', id: forumPost[2], label: this.humaniseSlug(forumPost[2]) || label() || undefined, meta: { board: forumPost[1], url: href, nameTemp: 'slug' } };
      const forum = /^\/forum\/([a-z0-9][a-z0-9-]*)$/.exec(path);
      if (forum) return { kind: 'forum', id: forum[1], label: this.humaniseSlug(forum[1]) || undefined, meta: { nameTemp: 'slug' } };
      const broadcastGame = /^\/broadcast\/([a-z0-9][a-z0-9-]*)\/([a-z0-9-]+)\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?(?:\/.*)?$/.exec(path);
      if (broadcastGame?.[3]) {
        const onPage = this.pageInitBlob();
        const boardGameId = gameKeyId(onPage?.data?.game?.id);
        const pageChapter = onPage?.chapter?.id ?? onPage?.study?.chapter?.id;
        return {
          kind: 'broadcastGame',
          id: broadcastGame[4] || broadcastGame[3],
          label: label() || this.humaniseSlug(broadcastGame[1]) || undefined,
          meta: {
            parentId: broadcastGame[1],
            slug: broadcastGame[1],
            round: broadcastGame[2],
            ...(broadcastGame[4] ? { chapterId: broadcastGame[4], roundId: broadcastGame[3] } : {}),
            ...(boardGameId && pageChapter === broadcastGame[4] ? { gameId: boardGameId } : {}),
          },
        };
      }
      const broadcast = /^\/broadcast\/([a-z0-9][a-z0-9-]*)(?:\/.*)?$/.exec(path);
      if (broadcast?.[1])
        return { kind: 'broadcast', id: broadcast[1], label: this.humaniseSlug(broadcast[1]) || label() || undefined, meta: { nameTemp: 'slug' } };
      const blogPost = /^\/'([^']+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})'?$/.exec(path) || /^\/@\/([^/]+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})$/.exec(path);
      if (blogPost?.[3]) return { kind: 'blogPost', id: blogPost[3], label: this.humaniseSlug(blogPost[2]) || label() || undefined, meta: { userId: blogPost[1], slug: blogPost[2], url: href, nameTemp: 'slug' } };
      const blog = /^\/'([^']+)\/blog'?$/.exec(path) || /^\/@\/([^/]+)\/blog$/.exec(path);
      if (blog?.[1]) return { kind: 'blog', id: blog[1], label: blog[1], meta: { userId: blog[1], url: href, nameTemp: 'slug' } };
      const coach = /^\/coach\/([a-zA-Z0-9_.-]+)$/.exec(path);
      if (coach?.[1]) return { kind: 'coach', id: coach[1], label: coach[1], meta: { nameTemp: 'slug' } };
      const streamer = /^\/streamer\/([a-zA-Z0-9_.-]+)$/.exec(path);
      if (streamer?.[1]) return { kind: 'streamer', id: streamer[1], label: streamer[1], meta: { nameTemp: 'slug' } };
      const team = /^\/team\/([^\/?#]+)$/.exec(path);
      if (team?.[1] && decodeURIComponent(team[1]).toLowerCase() !== 'me')
        return { kind: 'team', id: decodeURIComponent(team[1]), label: decodeURIComponent(team[1]), meta: { nameTemp: 'slug' } };
      const tournament = /^\/(tournament|swiss)\/([a-zA-Z0-9]{8})$/.exec(path);
      if (tournament?.[2])
        return {
          kind: 'tournament',
          id: tournament[2],
          label: label() || undefined,
          meta: { nameTemp: 'page', system: tournament[1] == 'swiss' ? 'swiss' : 'arena' },
        };
      const puzzle = /^\/training\/([a-zA-Z0-9_\/-]+)$/.exec(path);
      if (puzzle) return { kind: 'puzzle', id: puzzle[1], label: label() || undefined, meta: { nameTemp: 'page' } };
      const route = this.lichessRoute(href);
      if (route)
        return {
          kind: 'url',
          id: route,
          label: label() || route,
          meta: { url: route, ...(label().length ? { title: label(), nameTemp: 'page' } : {}) },
        };
      return undefined;
    }

    externalDrop(ev) {
      const lt = this.lichessTools;
      const src = lt.$(ev.target);
      if (!src.length) {
        return;
      }
      const entry = this.pageLeaf(src);
      if (!entry) {
        return;
      }
      const landed = this.rowTarget({ target: ev.currentTarget, currentTarget: ev.currentTarget });
      const held = this.findLeaf(entry.kind, entry.id);
      if (held) {
        if (!landed?.row) {
          return;
        }
        const target = this.insertionTarget(ev, landed.row, landed.node);
        if (this.siblings(held) === (target.parent?.children ?? this.entries)) {
          this.drop({ nodes: [held] }, target.parent, target.before);
          return;
        }
        this.drop({ nodes: [entry] }, target.parent, target.before);
        return;
      }
      if (landed?.row) {
        const target = this.insertionTarget(ev, landed.row, landed.node);
        this.drop({ nodes: [entry] }, this.stampParentOf(entry, target.parent), target.before);
      } else {
        this.drop({ nodes: [entry] }, this.stampParentOf(entry, undefined), undefined);
      }
    }

    stampParentOf(entry, parent) {
      if (parent) return parent;
      const stamp = this.parentStamp(entry);
      const parentKind = String(this.registry[entry?.kind]?.containment ?? '');
      if (!stamp || !parentKind) return undefined;
      const held = this.findLeaf(parentKind, stamp);
      if (!held || !this.canDrop({ nodes: [entry] }, held)) return undefined;
      return held;
    }

    parentStamp(node) {
      return node?.meta?.parentId ?? node?.meta?.studyId ?? node?.meta?.blogId;
    }

    dragArm(ev) {
      if (ev.button || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) {
        return;
      }
      if (this.rowTarget(ev)?.row) {
        this.pendingDrag = undefined;
        return;
      }
      const lt = this.lichessTools;
      const src = lt.$(ev.target);
      if (!src.length) {
        return;
      }
      const anchor = src.closest('a');
      const button = src.closest('button');
      const held = anchor.length ? anchor : button.length ? button : src;
      this.pendingDrag = { el: held[0], moves: 0, native: false };
    }

    dragEv(e) {
      return {
        target: e.target,
        currentTarget: e.target,
        button: e.button,
        buttons: e.buttons,
        ctrlKey: !!e.ctrlKey,
        metaKey: !!e.metaKey,
        shiftKey: !!e.shiftKey,
        altKey: !!e.altKey,
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }

    dragMove(ev) {
      if (!this.pendingDrag) return;
      if (ev.buttons !== undefined && !(ev.buttons & 1)) {
        return;
      }
      if (ev.ctrlKey || ev.metaKey || ev.button) return;
      this.pendingDrag.moves += 1;
      const dbgLanded = this.rowTarget(ev);
      this.showDropMark(dbgLanded, ev);
    }

    showDropMark(landed, ev) {
      clearDrop();
      if (!landed?.row) return;
      const target = this.insertionTarget(ev, landed.row, landed.node);
      const marked = this.lichessTools.$(landed.node);
      if (marked.length) marked.attr('data-bookmark-drop', target.position);
    }

    rowAtPoint(x, y) {
      if (x === undefined || y === undefined) {
        return undefined;
      }
      const rows = this.lichessTools.$('.record-row');
      for (let at = 0; at < rows.length; at += 1) {
        const box = rows[at]?.getBoundingClientRect?.() || {};
        if (box.left <= x && x < box.right && box.top <= y && y < box.bottom) {
          return this.rowIndex.get(rows[at]);
        }
      }
      return undefined;
    }

    treePointHit(x, y) {
      if (x === undefined || y === undefined) return false;
      const lt = this.lichessTools;
      for (const sel of ['ul.records', '.bookmark-end', '.record-list']) {
        const boxes = lt.$(sel);
        for (let at = 0; at < boxes.length; at += 1) {
          const box = boxes[at]?.getBoundingClientRect?.() || {};
          if (!box.width || !box.height) continue;
          if (box.left <= x && x < box.right && box.top <= y && y < box.bottom) return true;
        }
      }
      return false;
    }

    dragStartGlobal(ev) {
      if (!this.pendingDrag) {
        return;
      }
      this.pendingDrag.native = true;
      const dragged = this.lichessTools.$(ev.target);
      if (dragged.length && this.pageLeaf(dragged)) this.pendingDrag.el = ev.target;
    }

    dragOverGlobal(ev) {
      if (!this.pendingDrag) return;
      this.pendingDrag.native = true;
      this.pendingDrag.moves += 1;
      this.showDropMark(this.rowAtPoint(ev?.clientX, ev?.clientY), ev);
    }

    dragEndGlobal(ev) {
      const pending = this.pendingDrag;
      if (!pending || !pending.native || pending.moves < 1) {
        return;
      }
      this.pendingDrag = undefined;
      const landed = this.rowAtPoint(ev?.clientX, ev?.clientY);
      if (!landed?.row && !this.treePointHit(ev?.clientX, ev?.clientY)) {
        clearDrop();
        return;
      }
      this.externalDrop({
        target: pending.el,
        currentTarget: landed?.node,
        clientY: ev?.clientY,
      });
    }

    dragRelease(ev) {
      const pending = this.pendingDrag;
      this.pendingDrag = undefined;
      if (ev.button) return;
      if (!pending || pending.moves < (pending.native ? 1 : 2)) {
        return;
      }
      const landed = this.rowTarget(ev);
      if (!landed?.row && !this.treePointHit(ev?.clientX, ev?.clientY)) {
        clearDrop();
        return;
      }
      this.externalDrop({
        target: pending.el,
        currentTarget: ev.target,
        clientY: ev?.clientY,
      });
    }

    domAttr(el, name) {
      const raw = el?.[0];
      const viaDom = raw?.getAttribute?.(name);
      if (viaDom != null && viaDom !== '') return String(viaDom);
      const viaCash = el?.length ? el.prop(name) : undefined;
      if (typeof viaCash == 'string') return viaCash;
      return '';
    }

    playerEntry(name, src) {
      const lt = this.lichessTools;
      const entry = { kind: 'player', id: name, label: name, meta: {} };
      const meta = entry.meta;
      const title = src?.length ? this.domAttr(src, 'title') : '';
      if (title) meta.title = title;
      const anchors = lt.$('.upt__info a.user-link');
      if (!anchors.length) return entry;
      let matched = anchors.length === 1;
      for (let at = 0; at < anchors.length && !matched; at += 1) {
        const href = this.domAttr(lt.$(anchors[at]), 'href');
        if (href.includes('/@/' + name) || href.includes("'" + name + "'")) matched = true;
      }
      if (!matched) return entry;
      const flagImg = lt.$('.upt__info img.flag');
      if (flagImg.length) meta.flag = this.domAttr(flagImg, 'src');
      const flagSpan = lt.$('.upt__info .upt__info__top__flag');
      if (flagSpan.length) {
        const where = String(flagSpan.text()).trim();
        if (where) meta.flagName = where;
      }
      const flair = lt.$('.upt__info img.uflair');
      if (flair.length) meta.flair = this.domAttr(flair, 'src');
      const badge = lt.$('.lichessTools-gameCountBadge');
      if (badge.length) meta.gameCount = this.domAttr(badge, 'title');
      const joined = lt.$('.upt__info time');
      if (joined.length) meta.joined = this.domAttr(joined, 'datetime');
      const spans = lt.$('.upt__info__ratings span');
      if (spans.length) {
        meta.ratings = [];
        for (let at = 0; at < spans.length; at += 1) {
          const one = lt.$(spans[at]);
          const over = /^(\S+) rating over (\d+) games$/.exec(this.domAttr(one, 'title'));
          if (!over) continue;
          const raw = String(one.text()).replace(/[\s\u00a0]+/g, '');
          meta.ratings.push({ type: over[1], games: Number(over[2]), value: raw === '-' || raw === '?' ? undefined : raw || undefined });
        }
      }
      return entry;
    }

    canAttach(node, parent) {
      return !!node;
    }

    stampParent(node, parent) {
      if (!node || this.folder(node)) return;
      if (this.registry[node.kind]?.containment) return;
      const named = parent && !this.folder(parent) && parent.id ? String(parent.id) : undefined;
      if (node.meta?.parentId === named) return;
      if (!named) {
        if (node.meta?.parentId === undefined) return;
        node.meta = { ...node.meta };
        delete node.meta.parentId;
        return;
      }
      node.meta = { ...(node.meta ?? {}), parentId: named };
    }

    canDrop(payload, parent) {
      if (payload?.paths)
        return payload.paths.every((path) => !this.contains(this.at(path), parent)) &&
          payload.paths.every((path) => this.canAttach(this.at(path), parent));
      return (payload?.nodes || []).every((node) =>
        !this.contains(node, parent) && this.canAttach(node, parent));
    }

    drop(payload, parent, before) {
      if (!this.canDrop(payload, parent)) return;
      this.pushUndo();
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
        if (incoming.includes(before)) return;
        for (const entry of incoming) {
          const siblings = this.siblings(entry);
          const at = siblings ? siblings.indexOf(entry) : -1;
          if (at >= 0) siblings.splice(at, 1);
        }
      }
      if (parent && !parent.children) parent.children = [];
      const siblings = parent?.children ?? this.entries;
      siblings.splice(before ? siblings.indexOf(before) : siblings.length, 0, ...incoming);
      for (const entry of incoming) this.stampParent(entry, parent);
      if (parent) {
        if (this.folder(parent)) this.expanded.add(parent);
        else this.collapsed.delete(parent);
      }
      this.selected.clear();
      for (const entry of incoming) this.selected.add(entry);
      this.sortTree(this.entries);
      this.save();
      for (const entry of incoming) {
        if (entry?.kind === 'puzzle') this.requestPuzzleRead(entry);
        if (entry?.kind === 'game') this.requestGameName(entry);
        if (entry?.kind === 'team') this.requestTeamName(entry);
        if (userPageKind(entry?.kind) || entry?.kind == 'blog') this.requestUserRead(entry);
      }
    }

    requestPuzzleRead(entry) {
      const lt = this.lichessTools;
      const api = lt?.api?.puzzle;
      if (!api?.getPuzzle || !entry?.id) return;
      this.puzzleReads ??= new Set();
      if (this.puzzleReads.has(entry.id)) return;
      this.puzzleReads.add(entry.id);
      return (async () => {
        let data;
        try {
          data = await api.getPuzzle(entry.id);
        } catch (err) {
          this.puzzleReads.delete(entry.id);
          return;
        }
        const puzzle = data?.puzzle ?? data;
        if (!puzzle?.fen) {
          this.puzzleReads.delete(entry.id);
          return;
        }
        const copies = this.leavesWith('puzzle', entry.id);
        if (!copies.length) {
          this.puzzleReads.delete(entry.id);
          return;
        }
        for (const leaf of copies)
          this.hydrateLeaf(leaf, {
            label: this.puzzleName(leaf.id, puzzle),
            meta: {
              fen: String(puzzle.fen),
              ...(puzzle.lastMove ? { lastMove: String(puzzle.lastMove) } : {}),
              orientation: String(puzzle.fen).split(' ')[1] === 'b' ? 'black' : 'white',
            },
            dataName: true,
          });
        this.save();
        this.onChange();
      })();
    }

    async requestGameName(entry) {
      const lt = this.lichessTools;
      const api = lt?.api?.game;
      if (!api?.getGame) {
        return;
      }
      if (!entry?.id) return;
      this.gameNameReads ??= new Set();
      if (this.gameNameReads.has(entry.id)) return;
      this.gameNameReads.add(entry.id);
      return (async () => {
        let data;
        try {
          data = await api.getGame(entry.id);
        } catch (err) {
          this.gameNameReads.delete(entry.id);
          return;
        }
        const game = data?.game ?? data;
        const players = game?.players || {};
        const nameOf = (side) => String(side?.name ?? side?.l_user ?? side?.username ?? '');
        const white = nameOf(players.white);
        const black = nameOf(players.black);
        const name = white.length && black.length ? white + ' vs ' + black : (white || black);
        const copies = this.leavesWith('game', entry.id);
        if (!copies.length) {
          this.gameNameReads.delete(entry.id);
          return;
        }
        for (const leaf of copies)
          this.hydrateLeaf(leaf, {
            label: name || undefined,
            meta: {
              ...(game?.speed ? { speed: String(game.speed) } : {}),
              ...(game?.variant ? { variant: String(game.variant) } : {}),
            },
            dataName: true,
          });
        this.save();
        this.onChange();
      })();
    }

    async requestUserRead(entry) {
      const lt = this.lichessTools;
      const api = lt?.api?.user;
      if (!api?.getUsers) return;
      if (!entry?.id) return;
      this.userReads ??= new Set();
      if (this.userReads.has(entry.id)) return;
      this.userReads.add(entry.id);
      return (async () => {
        let users;
        try {
          users = await api.getUsers([String(entry.id)]);
        } catch (failure) {
          this.userReads.delete(entry.id);
          return;
        }
        const profile = (users ?? []).find((user) => user?.id === entry.id) ?? users?.[0];
        const copies = this.leavesWith(entry?.kind, entry?.id);
        if (!copies.length || !profile) {
          this.userReads.delete(entry.id);
          return;
        }
        const ownerOnly = copies[0].kind == 'blog';
        const ratings = ownerOnly ? [] : ['blitz', 'rapid', 'classical', 'bullet', 'ultrabullet', 'correspondence']
          .map((key) => {
            const perf = profile?.perfs?.[key];
            if (!perf?.rating || !Number(perf?.games)) return undefined;
            return { type: speedWords[key], games: Number(perf.games), value: String(perf.rating) };
          })
          .filter(Boolean);
        const flair = profile?.flair ?? profile?.profile?.flair;
        for (const leaf of copies)
          this.hydrateLeaf(leaf, {
            meta: {
              ...(profile?.title ? { title: String(profile.title) } : {}),
              ...(flair ? { flair: String(flair) } : {}),
              ...(ratings.length ? { ratings } : {}),
              ...(!ownerOnly && Number(profile?.createdAt) > 0 ? { joined: localTime(lt, profile.createdAt) } : {}),
            },
            dataName: true,
          });
        this.save();
        this.onChange();
      })();
    }

    save() {
      this.onChange();
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



    pageInitBlob() {
      const lt = this.lichessTools;
      if (lt.pageInitData) return lt.pageInitData;
      if (this.initPath === lt.location?.pathname) return this.initBlob;
      this.initPath = lt.location?.pathname;
      const text = lt.$('script#page-init-data').eq(0)?.text();
      try {
        this.initBlob = text ? lt.jsonParse(text) : undefined;
      } catch (unreadable) {
        this.initBlob = undefined;
      }
      return this.initBlob;
    }

    resolvePageLeaves() {
      const lt = this.lichessTools;
      const out = [];
      const init = this.pageInitBlob();
      const initStudy = init?.study;
      const initChapter = init?.chapter ?? initStudy?.chapter;
      const analysis = lt.lichess?.analysis;
      const analysisStudy = analysis?.study;
      const analysisPath = analysis?.path;
      const boardFen = analysis?.node?.fen;
      const broadcastMatch = /^\/broadcast\/([a-z0-9][a-z0-9-]*)(?:\/([a-z0-9-]+)(?:\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?)?)?(?:\/.*)?$/.exec(lt.location?.pathname || '');
      let studyId; let studyLabel = '';
      if (!broadcastMatch && initStudy?.id) {
        studyId = initStudy.id;
        studyLabel = initStudy.name || '';
      } else {
        const studyMatch = /^\/study\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?/.exec(lt.location?.pathname || '');
        if (studyMatch) {
          studyId = studyMatch[1];
          studyLabel = this.studies.get(studyMatch[1])?.studyName || '';
        }
      }
      if (!broadcastMatch && !studyId && analysisStudy?.data?.id) {
        studyId = analysisStudy.data.id;
        studyLabel = analysisStudy?.data?.name || '';
      }
      if (studyId)
        out.push({
          kind: 'study',
          id: studyId,
          label: studyLabel,
          meta: {
            ...(initStudy?.flair ? { flair: String(initStudy.flair) } : {}),
            ...(initStudy?.ownerId || initStudy?.userId
              ? { ownerId: String(initStudy.ownerId ?? initStudy.userId) }
              : {}),
          },
        });
      let chapterId; let chapterLabel = '';
      let chapterTrapped;
      if (!broadcastMatch && initChapter?.id) {
        chapterId = initChapter.id;
        chapterLabel = initChapter.name || '';
        chapterTrapped = initChapter.isTrapped;
      } else {
        const urlChapter = /^\/study\/[a-zA-Z0-9]{8}\/([a-zA-Z0-9]{8})/.exec(lt.location?.pathname || '');
        if (urlChapter) chapterId = urlChapter[1];
      }
      if (!chapterId && analysis && !broadcastMatch) {
        try {
          const current = analysis.study?.currentChapter?.();
          if (current?.id) {
            chapterId = current.id;
            chapterLabel = current.name || '';
            chapterTrapped = current.isTrapped;
          }
        } catch (ignored) {}
      }
      if (chapterId && !chapterLabel && studyId) {
        const own = (this.studies.get(studyId)?.chapters || []).find((chapter) => chapter?.id === chapterId);
        if (own?.name) chapterLabel = own.name;
      }
      if (chapterId && studyId)
        out.push({ kind: 'chapter', id: chapterId, label: chapterLabel, meta: { studyId, ...(chapterTrapped === true ? { playable: true } : {}) } });
      const route = lt.location?.pathname || '';
      const blogPost = /^\/'([^']+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})'?$/.exec(route) || /^\/@\/([^/]+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})$/.exec(route);
      if (blogPost?.[3]) {
        const foundHeading = lt.$('h1.ublog-post__title');
        const heading = foundHeading.length ? foundHeading : lt.$('.topic-import h1');
        const subhead = lt.$('strong.ublog-post__intro');
        const foundPicture = lt.$('img.ublog-post__image');
        const picture = foundPicture.length ? foundPicture : lt.$('.ublog-post__markup img');
        const headingText = heading.length ? String(heading.text() ?? '').trim() : '';
        const subheadText = subhead.length ? String(subhead.text() ?? '').trim() : '';
        const imageUrl = picture.length ? String(this.domAttr(picture, 'src') ?? '') : '';
        out.push({
          kind: 'blogPost',
          id: blogPost[3],
          label: headingText || this.humaniseSlug(blogPost[2]) || undefined,
          meta: {
            userId: blogPost[1],
            slug: blogPost[2],
            ...(headingText ? { title: headingText } : { nameTemp: 'slug' }),
            ...(subheadText ? { subtitle: subheadText } : {}),
            ...(imageUrl ? { image: imageUrl } : {}),
          },
          ...(headingText ? { dataName: true } : {}),
        });
      }
      const blog = /^\/'([^']+)\/blog'?$/.exec(route) || /^\/@\/([^/]+)\/blog$/.exec(route);
      if (blog?.[1]) out.push({ kind: 'blog', id: blog[1], label: blog[1], meta: { userId: blog[1], nameTemp: 'slug' } });
      const forumPost = /^\/forum\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)$/.exec(route);
      if (forumPost?.[2]) {
        const subject = this.pageTitle();
        const poster = this.threadPoster();
        out.push({
          kind: 'forumPost',
          id: forumPost[2],
          label: subject || this.humaniseSlug(forumPost[2]) || undefined,
          meta: {
            board: forumPost[1],
            ...(poster ? { author: poster } : {}),
            ...(subject ? {} : { nameTemp: 'slug' }),
          },
          ...(subject ? { dataName: true } : {}),
        });
      }
      const forum = /^\/forum\/([a-z0-9][a-z0-9-]*)$/.exec(route);
      if (forum?.[1]) out.push({ kind: 'forum', id: forum[1], label: this.humaniseSlug(forum[1]) || undefined, meta: { nameTemp: 'slug' } });
      const coach = /^\/coach\/([a-zA-Z0-9_.-]+)$/.exec(route);
      if (coach?.[1]) out.push({ kind: 'coach', id: coach[1], label: coach[1], meta: { nameTemp: 'slug' } });
      const streamer = /^\/streamer\/([a-zA-Z0-9_.-]+)$/.exec(route);
      if (streamer?.[1]) out.push({ kind: 'streamer', id: streamer[1], label: streamer[1], meta: { nameTemp: 'slug' } });
      const team = /^\/team\/([^\/?#]+)$/.exec(route);
      if (team?.[1] && decodeURIComponent(team[1]).toLowerCase() !== 'me') {
        const teamId = decodeURIComponent(team[1]);
        const title = lt.$('div.box__top h1.text').eq(0);
        const facts = title.length ? this.teamFacts(title) : { name: '', flair: '' };
        const count = lt.$('div.box__top div strong').eq(0);
        const parsed = Number(String(count.length ? count.text() : '').replace(/[^0-9]/g, ''));
        out.push({
          kind: 'team',
          id: teamId,
          label: facts.name || teamId,
          meta:
            {
              ...(facts.flair ? { flair: facts.flair } : {}),
              ...(Number.isFinite(parsed) ? { members: parsed } : {}),
              ...(facts.name ? {} : { nameTemp: 'slug' }),
            },
          ...(facts.name ? { dataName: true } : {}),
        });
      }
      const tournament = /^\/(tournament|swiss)\/([a-zA-Z0-9]{8})$/.exec(route);
      if (tournament?.[2]) {
        const tourneyData = init?.data;
        const tourneyTitle = this.pageTitle();
        const tourneyName = String(tourneyData?.fullName ?? '') ||
          String(tourneyData?.name ?? '') ||
          (tourneyTitle && !/lichess/i.test(tourneyTitle) ? tourneyTitle : '');
        const tourneyStarts = Number(tourneyData?.createdAt) > 0 ? Number(tourneyData.createdAt) :
          Date.parse(String(tourneyData?.startsAt ?? ''));
        const standing = [...(tourneyData?.standing?.players ?? tourneyData?.standings?.players ?? [])]
          .map((card) => {
            const owner = card?.user ?? card;
            return {
              ...(String(owner?.name ?? '').length ? { name: String(owner.name) } : {}),
              ...(owner?.flair ? { flair: String(owner.flair) } : {}),
              ...(Number(card?.rating) || card?.rating === 0 ? { rating: Number(card.rating) } : {}),
            };
          })
          .filter((card) => card?.name?.length)
          .slice(0, 20);
        out.push({
          kind: 'tournament',
          id: String(tourneyData?.id ?? tournament[2]),
          label: tourneyName || tournament[2],
          meta: {
            system: tournament[1] == 'swiss' ? 'swiss' : 'arena',
            ...(tourneyData?.perf?.key ? { perf: String(tourneyData.perf.key) } : {}),
            ...(tourneyData?.variant ? { variant: String(tourneyData.variant) } : {}),
            ...(tourneyData?.nbPlayers !== undefined ? { nbPlayers: Number(tourneyData.nbPlayers) } : {}),
            ...(Number.isFinite(tourneyStarts) && tourneyStarts > 0 ? { startsAt: tourneyStarts } : {}),
            ...(tourneyData?.isFinished === true ||
              String(tourneyData?.status ?? '').toLowerCase() == 'finished' ? { finished: true } : {}),
            ...(standing.length ? { standing } : {}),
            ...(tourneyName ? {} : { nameTemp: 'page' }),
          },
          ...(tourneyName ? { dataName: true } : {}),
        });
      }
      const profile = /^\/@\/([^\/?]+)\/?$/.exec(route) || /^\/'([^'\/]+)'?\/?$/.exec(route);
      if (profile?.[1]) out.push(this.playerEntry(profile[1]));
      const puzzleId = /^\/training\/([a-zA-Z0-9_\/-]+)$/.exec(lt.location?.pathname || '');
      if (puzzleId?.[1])
        out.push({ kind: 'puzzle', id: puzzleId[1], label: puzzleId[1], meta: {} });
      const urlGame = /^\/(?:game\/)?([a-zA-Z0-9]{8,12})(?:\/(?:white|black)(?:\/sides)?)?$/.exec(lt.location?.pathname || '');
      const gameKey = gameKeyId(urlGame?.[1]);
      if (gameKey)
        out.push({ kind: 'game', id: gameKey, label: gameKey, meta: {} });
      const boardOrientation = analysis?.getOrientation?.();
      const lastMove = Array.isArray(analysisPath) ? analysisPath[analysisPath.length - 1] : undefined;
      if (boardFen) {
        const variant = lt.lichess?.rulesType?.toLowerCase?.() || lt.lichess?.rules?.toLowerCase?.() || 'standard';
        const meta = { variant, orientation: boardOrientation };
        if (lastMove) meta.lastMove = lastMove;
        out.push({ kind: 'position', id: boardFen, label: boardFen, meta });
      }
      if (chapterId && studyId && analysisPath) {
        const node = analysis?.node;
        const where = [chapterLabel, this.moveText(node?.ply, node?.san)].filter((part) => part?.length).join(' | ');
        const meta = {
          studyId,
          chapterId,
          nodePath: analysisPath,
          orientation: analysis?.study?.data?.chapter?.setup?.orientation || boardOrientation,
          fen: node?.fen,
        };
        if (lastMove) meta.lastMove = lastMove;
        if (node?.san) {
          meta.ply = node.ply;
          meta.san = node.san;
        }
        out.push({
          kind: 'studyPosition',
          id: chapterId + '|' + analysisPath,
          label: where || analysisPath,
          meta,
        });
      }
      const pageGame = init?.mode == 'replay' ? init?.cfg?.data : (gameKey ? init?.data : undefined);
      if (broadcastMatch) {
        const roundSpelling = broadcastMatch[3] || (broadcastMatch[2] ? analysisStudy?.data?.id : undefined);
        const pageBoard = broadcastMatch[4] ||
          (!broadcastMatch[3] && broadcastMatch[2] ? initChapter?.id : undefined);
        const boardKey = pageBoard || roundSpelling;
        const boardChapterName = pageBoard && pageBoard === initChapter?.id
          ? String(initChapter?.name ?? '')
          : '';
        const relayName = this.humaniseSlug(broadcastMatch[1]);
        const relayWord = String(
          analysisStudy?.relay?.name ?? analysisStudy?.relay?.group ??
          analysisStudy?.data?.relay?.name ?? analysisStudy?.data?.relay?.group ?? '',
        ) || relayName;
        out.push({
          kind: 'broadcast',
          id: broadcastMatch[1],
          label: relayWord,
          meta: {},
        });
        if (boardKey)
          out.push({
            kind: 'broadcastGame',
            id: boardKey,
            label: boardChapterName || relayWord || undefined,
            meta: {
              slug: broadcastMatch[1],
              round: broadcastMatch[2],
              ...(pageBoard && pageBoard !== roundSpelling
                ? { chapterId: pageBoard, roundId: roundSpelling }
                : {}),
              ...(boardChapterName ? { chapterName: boardChapterName } : {}),
              ...(relayWord && relayWord !== relayName ? { relay: relayWord } : {}),
              ...(gameKeyId(init?.data?.game?.id) ? { gameId: gameKeyId(init?.data?.game?.id) } : {}),
              ...(broadcastMatch[2] ? { roundLabel: this.humaniseSlug(broadcastMatch[2]) } : {}),
              ...(Number(analysisStudy?.data?.createdAt) > 0 ? { playedAt: Number(analysisStudy.data.createdAt) } : {}),
            },
            ...(boardChapterName || relayWord ? { dataName: true } : {}),
          });
      }
      if (pageGame?.game?.id) {
        const pageNameOf = (side) => String(side?.user?.username ?? side?.name ?? '');
        const byColor = {};
        for (const side of [pageGame.player, pageGame.opponent]) {
          const color = String(side?.color ?? '');
          if (color?.length && !byColor[color]) byColor[color] = pageNameOf(side);
        }
        const white = byColor.white || '';
        const black = byColor.black || '';
        const pageKey = gameKeyId(pageGame.game.id) || gameKey;
        const speed = gameSpeedOf(pageGame.game);
        const variant = gameVariantOf(pageGame.game);
        const clock = pageGame.game?.clock;
        const timeControl = clock?.initial !== undefined && clock?.increment !== undefined
          ? clock.initial + '+' + clock.increment
          : undefined;
        const statusName = typeof pageGame.game?.status == 'string'
          ? String(pageGame.game.status)
          : typeof pageGame.game?.status?.name == 'string' ? String(pageGame.game.status.name) : '';
        if (pageKey)
          out.push({
            kind: 'game',
            id: pageKey,
            label: white.length && black.length ? white + ' vs ' + black : (white || black || pageKey),
            meta: {
              ...(speed ? { speed } : {}),
              ...(variant ? { variant } : {}),
              ...(timeControl ? { timeControl } : {}),
              ...(pageGame.game?.rated === true ? { rated: true } : {}),
              ...(statusName ? { result: statusName } : {}),
              ...(Number(pageGame.game?.createdAt) > 0 ? { playedAt: Number(pageGame.game.createdAt) } : {}),
              ...(String(pageGame.game?.fen ?? boardFen ?? '').length
                ? { fen: String(pageGame.game?.fen ?? boardFen) }
                : {}),
            },
            dataName: true,
          });
      }
      if (init?.data?.puzzle?.id) {
        const pagePuzzle = init.data.puzzle;
        out.push({
          kind: 'puzzle',
          id: String(pagePuzzle.id),
          label: this.puzzleName(String(pagePuzzle.id), pagePuzzle) || undefined,
          meta: {},
          dataName: true,
        });
      }
      const byShape = new Map();
      for (const leaf of out) byShape.set(leaf.kind + '|' + leaf.id, leaf);
      if (!byShape.size) {
        const route = this.lichessRoute(lt.location?.pathname || '');
        const title = this.pageTitle();
        if (route && !/^\/team\/(me|all|leader)$/.test(route))
          byShape.set('url|' + route, {
            kind: 'url',
            id: route,
            label: title || route,
            meta: { url: route, ...(title ? { title } : {}) },
            ...(title ? { dataName: true } : {}),
          });
      }
      return [...byShape.values()];
    }

    pageAddKinds() {
      return this.resolvePageLeaves().map((leaf) => leaf.kind);
    }

    pageMainKind() {
      const path = this.lichessTools.location?.pathname || '';
      const routes = [
        [/^\/study\/[a-zA-Z0-9]{8}\/[a-zA-Z0-9]{8}$/, 'chapter'],
        [/^\/study\/[a-zA-Z0-9]{8}$/, 'study'],
        [/^\/training\/.+$/, 'puzzle'],
        [/^\/broadcast\/[a-z0-9-]+\/[a-z0-9-]+\/[a-zA-Z0-9]{8}(?:\/[a-zA-Z0-9]{8})?(?:\/.*)?$/, 'broadcastGame'],
        [/^\/broadcast\/.+$/, 'broadcast'],
        [/^\/@\/[^\/?]+\/blog\/[^\/]+\/[a-zA-Z0-9]{8}$/, 'blogPost'],
        [/^\/'[^'\/]+\/blog\/[^\/]+\/[a-zA-Z0-9]{8}'?$/, 'blogPost'],
        [/^\/@\/[^\/?]+\/blog$/, 'blog'],
        [/^\/'[^'\/]+\/blog'?$/, 'blog'],
        [/^\/forum\/[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/, 'forumPost'],
        [/^\/forum\/[a-z0-9][a-z0-9-]*$/, 'forum'],
        [/^\/coach\/.+$/, 'coach'],
        [/^\/streamer\/.+$/, 'streamer'],
        [/^\/team\/(?!me\/?$).+$/, 'team'],
        [/^\/tournament\/[a-zA-Z0-9]{8}$/, 'tournament'],
        [/^\/swiss\/[a-zA-Z0-9]{8}$/, 'tournament'],
        [/^\/@\/[^\/?]+$/, 'player'],
        [/^\/'[^'\/]+'$/, 'player'],
        [/^\/analysis\//, 'position'],
        [/^\/(?:game\/)?[a-zA-Z0-9]{8,12}(?:\/(?:white|black)(?:\/sides)?)?$/, 'game'],
      ];
      for (const [pattern, kind] of routes) if (pattern.test(path)) return kind;
      return undefined;
    }

    hydrateLeaf(existing, incoming) {
      if (!existing || !incoming) return false;
      const renamed = existing.meta?.renamed !== undefined;
      let changed = false;
      if (incoming.label && incoming.label !== existing.label && !renamed) {
        existing.label = String(incoming.label);
        if (incoming.dataName === true && existing.meta) delete existing.meta.nameTemp;
        changed = true;
      }
      const sameFact = (left, right) =>
        left === right ||
        (typeof left == 'object' && typeof right == 'object' &&
          JSON.stringify(left) === JSON.stringify(right));
      const fresh = {};
      for (const key of Object.keys(incoming.meta ?? {}))
        if (incoming.meta[key] !== undefined && !sameFact(existing.meta?.[key], incoming.meta[key]))
          fresh[key] = incoming.meta[key];
      if (Object.keys(fresh).length) {
        existing.meta = { ...(existing.meta ?? {}), ...fresh };
        changed = true;
      }
      return changed;
    }

    teamFacts(el) {
      const lt = this.lichessTools;
      const kept = lt.$(el).clone();
      const marks = kept.children('em');
      if (marks.length) marks.remove();
      const name = String(kept.text() ?? '').replace(/\s+/g, ' ').trim();
      const src = lt.$(el).find('img.uflair').attr('src');
      return { name, flair: src ? String(src) : '' };
    }

    pageTeamRows() {
      const lt = this.lichessTools;
      const idOf = (href) => {
        const at = /^\/team\/([^\/?#]+)(?:\/.*)?/.exec(String(href || '').split('#')[0]);
        if (!at?.[1]) return undefined;
        const id = decodeURIComponent(at[1]);
        return id && id.toLowerCase() !== 'me' ? id : undefined;
      };
      const rows = [];
      const own = /^\/team\/([^\/?#]+)$/.exec(lt.location?.pathname || '');
      const title = lt.$('div.box__top h1.text').eq(0);
      if (own?.[1] && title.length) {
        const facts = this.teamFacts(title);
        const count = lt.$('div.box__top div strong').eq(0);
        const members = Number(String(count.length ? count.text() : '').replace(/[^0-9]/g, ''));
        rows.push({
          id: decodeURIComponent(own[1]),
          label: facts.name || undefined,
          meta: { ...(facts.flair ? { flair: facts.flair } : {}), ...(Number.isFinite(members) ? { members } : {}) },
          dataName: true,
        });
      }
      const list = lt.$('td.subject a.team-name, div.teams a');
      for (let i = 0; i < list.length; i++) {
        const at = list.eq(i);
        const id = idOf(this.domAttr(at, 'href'));
        if (!id) continue;
        const facts = this.teamFacts(at);
        if (!facts.name && !facts.flair) continue;
        rows.push({ id, label: facts.name || undefined, meta: { ...(facts.flair ? { flair: facts.flair } : {}) }, dataName: true });
      }
      return rows;
    }

    enrichFromPage() {
      let changed = false;
      const pageLeaves = this.resolvePageLeaves();
      for (const leaf of pageLeaves)
        for (const held of this.leavesWith(leaf.kind, leaf.id))
          if (this.hydrateLeaf(held, leaf)) changed = true;
      const gameLeaf = pageLeaves.find((leaf) => leaf.kind === 'game');
      if (gameLeaf?.id)
        for (const held of this.leavesCarrying('broadcastGame', 'gameId', gameLeaf.id))
          if (this.hydrateLeaf(held, { meta: gameLeaf.meta, dataName: true })) changed = true;
      for (const row of this.pageTeamRows())
        for (const held of this.leavesWith('team', row.id))
          if (this.hydrateLeaf(held, row)) changed = true;
      const lt = this.lichessTools;
      const pageName = this.pageTitle();
      for (const heldRoute of this.leavesWith('url', this.lichessRoute(lt.location?.pathname || '') ?? '')) {
        if (pageName && heldRoute.meta?.title !== pageName &&
          this.hydrateLeaf(heldRoute, { label: pageName, meta: { title: pageName }, dataName: true }))
          changed = true;
      }
      if (!changed) return false;
      this.save();
      this.onChange();
      return true;
    }

    requestTeamName(entry) {
      const lt = this.lichessTools;
      if (!entry?.id) return;
      this.teamReads ??= new Set();
      if (this.teamReads.has(entry.id)) return;
      this.teamReads.add(entry.id);
      return (async () => {
        let facts = { name: '', flair: '' };
        let members;
        try {
          const page = lt?.net?.fetch
            ? await lt.net.fetch({ url: '/team/{teamId}', args: { teamId: String(entry.id) } }, { ignoreStatuses: [404] })
            : undefined;
          if (page) {
            const title = lt.$(page).find('h1.text').eq(0);
            if (title.length) facts = this.teamFacts(title);
            const count = lt.$(page).find('div strong').eq(0);
            const parsed = Number(String(count.length ? count.text() : '').replace(/[^0-9]/g, ''));
            if (Number.isFinite(parsed)) members = parsed;
          }
        } catch (failure) {
          facts = { name: '', flair: '' };
        }
        if (!facts.name && lt?.api?.team?.getTeam) {
          try {
            const data = await lt.api.team.getTeam(String(entry.id));
            if (data?.name) {
              facts = { name: String(data.name), flair: String(data?.flair ?? '') };
              const rawMembers = data?.nbMembers ?? data?.count;
              if (Number.isFinite(Number(rawMembers))) members = Number(rawMembers);
            }
          } catch (failure) {}
        }
        const copies = this.leavesWith('team', entry.id);
        if (!copies.length || (!facts.name && !facts.flair)) {
          this.teamReads.delete(entry.id);
          return;
        }
        for (const leaf of copies)
          this.hydrateLeaf(leaf, {
            label: facts.name || undefined,
            meta: { ...(facts.flair ? { flair: facts.flair } : {}), ...(members !== undefined ? { members } : {}) },
            dataName: true,
          });
        this.save();
        this.onChange();
      })();
    }

    findLeaf(kind, id, nodes = this.entries) {
      for (const node of nodes) {
        if (node.kind == kind && node.id === id) return node;
        const found = this.findLeaf(kind, id, node.children || []);
        if (found) return found;
      }
      return undefined;
    }

    leavesWith(kind, id, nodes = this.entries, found = []) {
      for (const node of nodes) {
        if (node.kind == kind && node.id === id) found.push(node);
        this.leavesWith(kind, id, node.children || [], found);
      }
      return found;
    }

    leavesCarrying(kind, metaKey, value, nodes = this.entries, found = []) {
      for (const node of nodes) {
        if (node.kind == kind && node.meta?.[metaKey] === value) found.push(node);
        this.leavesCarrying(kind, metaKey, value, node.children || [], found);
      }
      return found;
    }

    canAdd() {
      return !this.selectMode && this.resolvePageLeaves().length > 0;
    }

    cycleAddChoice() {
      const kinds = this.pageAddKinds();
      if (!kinds.length) return this.addChoice;
      const at = kinds.indexOf(this.addChoice);
      this.addChoice = at < 0 ? kinds[0] : kinds[(at + 1) % kinds.length];
      this.onChange();
      return this.addChoice;
    }

    async addCurrentChoice() {
      const candidates = this.resolvePageLeaves();
      if (!candidates.length) {
        this.message = 'nothingToFile';
        return false;
      }
      let leaf = candidates.find((candidate) => candidate.kind === this.addChoice) ||
        candidates.find((candidate) => candidate.kind === this.pageMainKind()) ||
        candidates[0];
      return this.addLeaf(leaf);
    }

    async addLeaf(leaf) {
      if (leaf) delete leaf.dataName;
      const selected = [...this.selected];
      let parent = selected.length === 1 ? selected[0] : undefined;
      const parentIsLeafSelf =
        parent && !this.folder(parent) && parent.kind == leaf.kind && parent.id === leaf.id;
      if (parentIsLeafSelf) {
        this.message = 'addSelfParent';
        return false;
      }
      const carriedBy = this.registry[leaf.kind]?.containment;
      const carrierKey = carriedBy ? containedCarrier[leaf.kind] : undefined;
      const carrierId = carrierKey ? leaf?.meta?.[carrierKey] : undefined;
      const carrier = carriedBy && carrierId ? this.findLeaf(carriedBy, carrierId) : undefined;
      if (carrier && parent && parent !== carrier && !this.folder(parent) && parent.kind !== carriedBy)
        parent = this.contains(leaf, carrier) ? undefined : carrier;
      const existing = this.findLeaf(leaf.kind, leaf.id);
      if (existing && parent && this.contains(existing, parent)) {
        this.message = 'addSelfParent';
        return false;
      }
      this.pushUndo();
      if (existing &&
        (!parent || this.siblings(existing) === (parent?.children ?? this.entries))) {
        const siblings = this.siblings(existing);
        const at = siblings ? siblings.indexOf(existing) : -1;
        if (at >= 0) siblings.splice(at, 1);
        this.stampParent(existing, parent);
        if (parent && !parent.children) parent.children = [];
        (parent?.children ?? this.entries).push(existing);
        this.selected.clear();
        this.selected.add(existing);
        this.sortTree(this.entries);
        this.save();
        return true;
      }
      this.stampParent(leaf, parent);
      if (parent && !parent.children) parent.children = [];
      (parent?.children ?? this.entries).push(leaf);
      if (parent) {
        if (this.folder(parent)) this.expanded.add(parent);
        else this.collapsed.delete(parent);
      }
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
            this.message = 'studyGone';
          } else if (record) {
            this.sync.store(record);
            captured = leaf;
          }
        } catch (failure) {
          this.message = 'addHarvestFailed';
        }
      }
      this.refreshCaches();
      this.save();
      if (captured) this.sync.persist(captured.id);
      this.message = leaf.kind == 'study' ? 'addedStudy' : 'addedItem';
      return true;
    }

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
      this.pushUndo();
      const folder = { name: named, children: [] };
      (parent?.children ?? this.entries).push(folder);
      if (parent) this.expanded.add(parent);
      this.selected.clear();
      this.selected.add(folder);
      this.sortTree(this.entries);
      this.save();
      return folder;
    }

    removeSelected() {
      this.pushUndo();
      const prune = (nodes) =>
        nodes
          .filter((node) => !this.selected.has(node))
          .map((node) => {
            if (node.children) node.children = prune(node.children);
            return node;
          });
      this.entries = prune(this.entries);
      this.selected.clear();
      this.save();
    }

    pushUndo() {
      const chains = this.shapeChains(this.entries);
      this.undoStack.push({
        entries: JSON.parse(JSON.stringify(this.entries)),
        selected: [...this.selected].map((node) => chains.get(node)).filter(Boolean),
        expanded: [...this.expanded].map((node) => chains.get(node)).filter(Boolean),
        collapsed: [...this.collapsed].map((node) => chains.get(node)).filter(Boolean),
      });
      if (this.undoStack.length > 40) this.undoStack.shift();
    }

    undo() {
      if (!this.undoStack.length) return false;
      const state = this.undoStack.pop();
      this.entries = state.entries;
      const at = (paths) => {
        const set = new Set();
        for (const path of paths) {
          let nodes = this.entries;
          let node;
          for (const step of path) {
            node = (nodes ?? [])[step];
            nodes = node?.children;
          }
          if (node) set.add(node);
        }
        return set;
      };
      this.selected = at(state.selected);
      this.expanded = at(state.expanded);
      this.collapsed = at(state.collapsed);
      this.refreshCaches();
      this.save();
      return true;
    }

    countSelected() {
      const insideSelected = (node) => {
        const visit = (nodes, ancestors) => {
          for (const at of nodes || []) {
            if (at === node) return ancestors.some((anc) => this.selected.has(anc));
            if (visit(at.children || [], [...ancestors, at])) return true;
          }
          return false;
        };
        return visit(this.entries, []);
      };
      const tally = (node, acc) => {
        if (this.folder(node)) acc.folders++;
        else acc.leaves++;
        for (const child of node?.children || []) tally(child, acc);
      };
      const acc = { leaves: 0, folders: 0 };
      for (const node of this.selected) {
        if (insideSelected(node)) continue;
        tally(node, acc);
      }
      return { leaves: acc.leaves, folders: acc.folders, total: acc.leaves + acc.folders };
    }

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

    previewRestore(text) {
      return this.store.collectionTree.parseTree(text);
    }

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
      this.pushUndo();
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

    async openLeaf(node) {
      const row = this.registry[node.kind];
      const href = row?.openUrl?.(node.id, node.meta);
      if (!href) return false;
      if (node.kind == 'puzzle' && (String(node.meta?.nameTemp ?? '') == 'page' || !node.meta?.fen))
        await this.requestPuzzleRead(node);
      else if (
        node.kind == 'game' &&
        (String(node.meta?.nameTemp ?? '') == 'page' || !(node.meta?.speed || node.meta?.variant))
      ) await this.requestGameName(node);
      else if (profilePending(node)) await this.requestUserRead(node);
      const lt = this.lichessTools;
      const studyId = node.kind == 'study' ? node.id : node.meta?.studyId;
      if (studyId) lt.storage.set(treeHandoffKey, { studyId, at: Date.now() }, { session: true });
      if (node.kind == 'study' || node.kind == 'chapter' || node.kind == 'studyPosition') {
        const navigation = recordsDbInstance?.navigation;
        if (!navigation) return false;
        const chapterId = node.kind == 'chapter' ? node.id : node.meta?.chapterId;
        await navigation.load(node.kind == 'study' ? node.id : node.meta?.studyId, chapterId);
        if (node.kind == 'studyPosition') {
          const analysis = lt.lichess?.analysis;
          const nodePath = node.meta?.nodePath;
          if (analysis && nodePath && analysis.path != nodePath) {
            const target = analysis.tree?.nodeAtPath?.(nodePath);
            if (target) {
              analysis.userJump?.(target.path ?? nodePath);
              lt.analysisRedraw?.();
              if (node.meta?.nodeMissing !== undefined) {
                node.meta = { ...node.meta };
                delete node.meta.nodeMissing;
                this.save();
              }
            } else if (analysis.tree?.nodeAtPath) {
              node.meta = { ...node.meta ?? {}, nodeMissing: true };
              this.save();
            }
          }
        }
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
      this.collapsed.clear();
      this.revision++;
      this.onChange();
      this.message = 'restoredTree';
      return parsed;
    }


    editName(node, name) {
      if (!node) return false;
      const trimmed = String(name || '').trim();
      if (!trimmed) return false;
      this.pushUndo();
      if (this.folder(node)) node.name = trimmed;
      else node.label = trimmed;
      if (!this.folder(node)) {
        node.meta = { ...(node.meta ?? {}), renamed: Date.now() };
        delete node.meta.nameTemp;
      }
      this.sortTree(this.entries);
      this.save();
      return true;
    }

    async renameFolder(node) {
      if (!node) return false;
      const current = this.folder(node)
        ? String(node.name ?? '')
        : String(this.leafLabel(node) || (node.label ?? ''));
      return this.editName(node, await this.folderName(current));
    }


  }



  class RecordsSearchEngine {
    constructor(lichessTools, store) {
      this.lichessTools = lichessTools;
      this.store = store;
    }

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


  const popupId = 'lichessTools-recordsContentPreview';
  const popupPreviews = new WeakMap();
  const popupLeaveMs = 150;
  let popupShown = null;
  let hideTimeout = null;
  let treePaint = null;

  function popupData(items, title) {
    if (!items?.length && !title) return undefined;
    return { items, title, attrs: { 'data-popup': popupId } };
  }

  function popupTargets(node) {
    const found = [node];
    for (const kid of node?.children ?? []) found.push(...popupTargets(kid));
    return found;
  }

  function popupNode() {
    const lt = recordsDbInstance?.lichessTools;
    if (!lt) return undefined;
    const found = lt.$('#' + popupId);
    if (found.length) return found;
    const body = lt.$('body');
    if (!body.length) return undefined;
    const fresh = lt.$('<div id="' + popupId + '">');
    fresh
      .on('mouseover mousemove', () => {
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
    const boardItem = (items ?? []).some((data) => data?.board === true);
    const boxFloor = boardItem ? hoverBoardPx + 48 : 160;
    const boxHeight = Math.min(
      Math.max(boxFloor, innerHeight - bounds.bottom - 12),
      Math.max(boxFloor, innerHeight - 16),
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
    for (const data of items ?? []) {
      const item = lt.$('<li>');
      if (data.header) {
        item.attr('class', 'popup-header');
        item.text(data.header);
      } else if (data.board) {
        item.attr('class', 'popup-board');
      } else if (data.name != null) item.text(String(data.name));
      if (data.dim) item.addClass('popup-dim');
      const flair = data.flair ? lt.$('<img class="popup-flair">').attr('src', String(data.flair)) : undefined;
      if (flair) item.append(flair);
      const picture = data.image ? lt.$('<img class="popup-image">').attr('src', String(data.image)) : undefined;
      if (picture) item.append(picture);
      list.append(item);
    }
    popup.append(list);
  }

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



  function factLine(parts) {
    const kept = (parts ?? []).filter((part) => typeof part == 'string' && part.length);
    return kept.length ? kept.join(' \u2022 ') : undefined;
  }



  function localTime(lt, value) {
    const ms = Number(value);
    if (!Number.isFinite(ms) || ms <= 0) return undefined;
    return new Date(ms).toLocaleString(lt.intl?.lang);
  }



  function flairImage(lt, value) {
    const code = String(value ?? '');
    if (!code || /^[\uE000-\uF8FF]$/.test(code)) return undefined;
    if (code.startsWith('/') || /^https?:/i.test(code)) return code;
    return lt.lichess?.asset?.flairSrc?.(code);
  }

  const userPageKind = (kind) => kind == 'player' || kind == 'coach' || kind == 'streamer';
  const profilePending = (entry) => {
    if (userPageKind(entry?.kind))
      return !(entry?.meta?.title || entry?.meta?.flair || entry?.meta?.ratings);
    if (entry?.kind == 'blog') return !(entry?.meta?.title || entry?.meta?.flair);
    return false;
  };

  function localDate(lt, value) {
    const ms = Number(value);
    if (!Number.isFinite(ms) || ms <= 0) return undefined;
    return new Date(ms).toLocaleDateString(lt.intl?.lang);
  }

  function perfIcon(lt, key) {
    const name = speedIcons[String(key ?? '').toLowerCase()];
    return name && lt.icon[name] !== undefined ? lt.icon[name] : undefined;
  }

  function interactiveChapter(entry, record) {
    const own = (record?.chapters || []).find((chapter) => chapter?.id === entry?.id);
    return own ? own.isTrapped === true || own.trapped === true : false;
  }

  function roundWords(label) {
    const text = String(label ?? '').trim();
    if (!text.length) return undefined;
    const bare = text.replace(/^round\s+(?=\S)/i, '');
    return bare.length ? bare : text;
  }

  function chapterLines(chapters, currentId) {
    const lines = [];
    for (const chapter of chapters ?? []) {
      const name = String(chapter?.name ?? '').trim();
      if (!name.length) continue;
      lines.push({ name, ...(currentId !== undefined && chapter?.id === currentId ? { dim: true } : {}) });
    }
    return lines;
  }

  function popupFacts(content, trans, entry, labelText, record) {
    if (!entry || content.folder(entry)) return undefined;
    const lt = content.lichessTools;
    const meta = entry.meta ?? {};
    const facts = [];
    const say = (key) => String(trans.noarg(key));
    const line = (key, value) => {
      const text = value === undefined || value === null ? '' : String(value);
      if (!text.length) return;
      facts.push({ name: say(key) + ': ' + text });
    };
    switch (entry.kind) {
      case 'game': {
        const variantWord = meta.variant && String(meta.variant).toLowerCase() !== 'standard'
          ? camel(String(meta.variant))
          : undefined;
        const summary = factLine([
          meta.timeControl,
          meta.rated === true ? say('popupRated') : undefined,
          speedWords[String(meta.speed ?? '').toLowerCase()],
          variantWord,
          meta.result,
        ]);
        if (summary) facts.push({ name: summary });
        const played = localTime(lt, meta.playedAt);
        if (played) facts.push({ name: played });
        break;
      }
      case 'broadcastGame': {
        const relayTitle = String(meta.relay ?? '') || (meta.slug ? content.humaniseSlug(meta.slug) : '');
        if (relayTitle.length) facts.push({ name: relayTitle });
        line('popupRound', roundWords(meta.roundLabel));
        const chapterName = String(meta.chapterName ?? '') || labelText;
        if (chapterName.length) facts.push({ name: chapterName });
        line('popupPlayed', localTime(lt, meta.playedAt));
        break;
      }
      case 'tournament':
        if (String(meta.system ?? '').toLowerCase() == 'swiss') facts.push({ name: say('kindTournamentSwiss') });
        else if (String(meta.system ?? '').toLowerCase() == 'arena') facts.push({ name: say('kindTournamentArena') });
        if ((meta.standing ?? []).length) facts.push({ header: say('popupStandings') });
        for (const card of meta.standing ?? []) {
          const player = String(card?.name ?? '');
          if (!player.length) continue;
          const rating = card?.rating === undefined || card?.rating === null ? '' : ' ' + String(card.rating);
          facts.push({ name: player + rating, flair: flairImage(lt, card?.flair) });
        }
        if (meta.nbPlayers !== undefined)
          facts.push({ name: trans.pluralSame('recordsDbCountPlayer', Number(meta.nbPlayers)) });
        line('popupStarted', localDate(lt, meta.startsAt));
        line('popupVariant', meta.variant);
        break;
      case 'team':
        line('popupMembers', meta.members);
        break;
      case 'blogPost':
        if (meta.subtitle?.length) facts.push({ name: String(meta.subtitle) });
        if (meta.userId?.length) line('popupAuthor', meta.userId);
        if (meta.image?.length) facts.push({ image: String(meta.image) });
        break;
      case 'forumPost':
        if (meta.author?.length) facts.push({ name: trans.format(say('bySomeone'), [String(meta.author)]) });
        break;
      case 'blog':
        line('popupAuthor', meta.userId);
        break;
      case 'player':
        for (const card of meta.ratings ?? []) {
          const type = String(card?.type ?? '');
          if (!type) continue;
          const value = card?.value === undefined || card?.value === null ? '-' : String(card.value);
          facts.push({ name: say('popupRatings') + ' ' + type + ': ' + value });
        }
        line('popupJoined', meta.joined);
        break;
      case 'study':
        const studyOwner = String(record?.ownerId ?? meta.ownerId ?? '');
        if (studyOwner.length) facts.push({ name: trans.format(say('bySomeone'), [studyOwner]) });
        if (record?.chapters?.length) {
          facts.push({ header: say('popupChapters') });
          facts.push(...chapterLines(record.chapters));
        }
        break;
      case 'chapter':
        {
          const chapterStudy = String(record?.studyName ?? '');
          if (chapterStudy.length) facts.push({ name: chapterStudy });
          if (record?.chapters?.length) {
            facts.push({ header: say('popupChapters') });
            facts.push(...chapterLines(record.chapters, entry.id));
          }
        }
        break;
      case 'position':
        line('popupVariant', meta.variant);
        break;
      case 'studyPosition':
        const studyName = String(record?.studyName ?? '');
        if (studyName.length) facts.push({ name: studyName });
        const chapterLost = record?.chapters &&
          !record.chapters.some((chapter) => chapter?.id === meta.chapterId);
        if (chapterLost || meta.nodeMissing === true) facts.push({ name: say('recordsDbNodeMissing') });
        break;
      default:
        break;
    }
    if (!facts.length) return undefined;
    if (boardStateFor(entry)) facts.unshift({ board: true });
    const title = String(entry.kind == 'blogPost' ? meta.title || labelText : labelText);
    return { items: facts, title: title.length ? title : labelText };
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
    const lt = recordsDbInstance.lichessTools;
    const $ = lt.$;
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





  function clearDrop() {
    const lt = recordsDbInstance.lichessTools;
    const $ = lt.$;
    $('.lichessTools-recordsDbUi [data-bookmark-drop]')
      .removeAttr('data-bookmark-drop');
  }

  function bookmarkView(content, host, box) {
    const lt = recordsDbInstance.lichessTools;
    const trans = lt.translator;
    const $ = lt.$;
    const registry = content.registry;

    if (content.hayRevision !== content.sync.publishRevision) content.refreshCaches();

    content.armPageDrag();

    const chipStates = {
      access: ['all', 'writable', 'readonly'],
      visibility: ['all', 'public', 'unlisted', 'private'],
    };
    const kindLabel = (kind) => kind == 'all' ? trans.noarg('kindAll') : trans.noarg('kind' + camel(kind));
    const stateLabel = (which, state) => trans.noarg(which + camel(state));
    const chipLive = (which) => which == 'kind' ? content.presentKinds().length > 1 : content.chipApplicable(which);
    const chipName = (which) => trans.noarg('filters' + (which == 'kind' ? 'Kind' : which == 'access' ? 'Access' : 'Visibility'));

    const rackButton = (cls, label, title = label) =>
      $('<button class="btn-rack__btn ' + cls + '" type="button">')
        .attr('title', trans.noarg(title))
        .text(trans.noarg(label));

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

    const keptRack = host.find('.rack-filters');
    const filtersRack = keptRack.length ? keptRack : $('<div class="rack-filters">');
    const boxSlot = filtersRack.find('input.tree-filter');
    filtersRack.find('button').remove();
    const putChip = (chip) => { if (boxSlot.length) chip.insertBefore(boxSlot); else filtersRack.append(chip); };
    putChip(chipButton('access'));
    putChip(chipButton('visibility'));
    putChip(chipButton('kind'));
    if (!boxSlot.length) filtersRack.append(box);

    const actionsRack = $('<div class="rack-actions">');

    const addButton = rackButton('btn-add', 'recordsDbAdd');
    addButton.on('click', async (ev) => {
      content.addMenuOpen = false;
      await content.addCurrentChoice();
      await content.onChange();
    });
    if (!content.canAdd()) addButton.attr('hidden', '');
    actionsRack.append(addButton);
    const addKinds = content.pageAddKinds();
    if (addKinds.length > 1) {
      const addWrap = $('<div class="add-caret-wrap">');
      const addCaret = rackButton('btn-add-caret', 'recordsDbAddOptions');
      addCaret.text('\u25be');
      addCaret.on('click', async (ev) => {
        content.addMenuOpen = !content.addMenuOpen;
        await content.onChange();
      });
      addWrap.append(addCaret);
      if (content.addMenuOpen) {
        const menuBox = $('<div class="btn-add-menu-box">');
        for (const kind of addKinds) {
          const menuItem = $('<button class="btn-rack__btn btn-add-menu" type="button">')
            .attr('title', trans.noarg('recordsDbAddOptions'))
            .attr('data-add-kind', kind)
            .text(trans.noarg('kind' + camel(kind)));
          menuItem.on('click', async (ev) => {
            content.addChoice = kind;
            content.addMenuOpen = false;
            await content.addCurrentChoice();
            await content.onChange();
          });
          menuBox.append(menuItem);
        }
        addWrap.append(menuBox);
      }
      actionsRack.append(addWrap);
    }

    const selectButton = rackButton('btn-select', 'recordsDbSelect', content.selectMode ? 'recordsDbSelectOn' : 'recordsDbSelectOff');
    if (content.selectMode) selectButton.addClass('active');
    selectButton.on('click', () => content.setSelect(!content.selectMode));
    actionsRack.append(selectButton);

    const deleteButton = rackButton('btn-delete', 'recordsDbDelete');
    if (!content.selected.size && !content.confirmBar) deleteButton.attr('disabled', 'disabled');
    deleteButton.on('click', async (ev) => {
      await content.deleteSelected();
    });
    actionsRack.append(deleteButton);

    const newFolderButton = rackButton('btn-newfolder', 'recordsDbNewFolder');
    if (lt.icon.NewFolder !== undefined) newFolderButton.attr('data-icon', lt.icon.NewFolder);
    newFolderButton.on('click', async (ev) => {
      await content.createFolder();
    });
    actionsRack.append(newFolderButton);

    const selectedItems = [...content.selected];
    const renameButton = rackButton('btn-rename', 'recordsDbRename');
    if (selectedItems.length === 1)
      renameButton.on('click', async (ev) => {
        await content.renameFolder(selectedItems[0]);
      });
    else renameButton.attr('disabled', 'disabled');
    actionsRack.append(renameButton);

    const foldTargets = content.parentNodes();
    const foldAll = foldTargets.length > 0 && foldTargets.every((parent) => content.folder(parent)
      ? content.expanded.has(parent)
      : !content.collapsed.has(parent));
    const foldKey = foldAll ? 'recordsDbCollapseAll' : 'recordsDbExpandAll';
    const foldButton = rackButton('btn-fold', foldKey);
    if (foldTargets.length) foldButton.on('click', (ev) => content.toggleAllExpanded());
    else foldButton.attr('disabled', 'disabled');
    actionsRack.append(foldButton);

    const undoButton = rackButton('btn-undo', 'recordsDbUndo');
    if (lt.icon.Reload !== undefined) undoButton.attr('data-icon', lt.icon.Reload);
    if (content.undoStack.length)
      undoButton.on('click', async (ev) => {
        await content.undo();
      });
    else undoButton.attr('disabled', 'disabled');
    actionsRack.append(undoButton);

    const rowOf = (row) => {
      const { entry, path, shown } = row;
      const folder = content.folder(entry);
      const record = content.recordFor(entry);
      const selected = content.selected.has(entry);
      const row0 = content.registry[entry?.kind];
      const dead = !folder && content.isGone(entry);
      const labelText = folder
        ? String(entry.name ?? '')
        : content.leafLabel(entry) || String(entry.label ?? '');
      const hasChildren = (entry?.children || []).length > 0;
      const openable = folder || hasChildren;
      const open = folder ? content.expanded.has(entry) : !content.collapsed.has(entry);
      const li = $('<li class="record-row bookmark-row">')
        .attr('data-path', path.join('/'))
        .attr('tabindex', '0')
        .attr('draggable', String(!dead && content.editing?.entry !== entry))
        .attr('style', '---bookmark-depth:' + (path.length - 1));
      if (!folder) li.attr('data-kind', entry.kind);
      if (selected) li.addClass('selected');
      if (dead) li.addClass('record-missing');
      if (folder && shown === 0) li.addClass('folder-empty');
      if (openable) li.attr('data-expanded', String(open));
      const indexed = { row, entry, folder, dead, node: li[0], preview: false, cold: false, profile: false };
      content.rowIndex.set(li[0], indexed);

      if (content.selectMode) {
        const check = $('<input class="tree-select" type="checkbox">');
        if (selected) check.attr('checked', '');
        check.on('change', () => content.select(entry, { ctrlKey: true }));
        li.append(check);
      }

      if (openable) {
        const toggle = $('<button class="bookmark-toggle" type="button">')
          .attr('title', trans.noarg(open
            ? (folder ? 'recordsDbCollapseFolder' : 'recordsDbCollapseBranch')
            : (folder ? 'recordsDbExpandFolder' : 'recordsDbExpandBranch')));
        toggle.append($('<svg focusable="false" viewBox="0 0 10 10"><path d="M2 1L8 5L2 9Z" fill="currentColor"></path></svg>'));
        content.rowIndex.set(toggle[0], { ...indexed, chip: 'toggle' });
        li.append(toggle);
      }
      const parentFlair = entry?.kind == 'chapter' || entry?.kind == 'studyPosition' ? undefined : record?.flair;
      if (!folder) {
        const gameMark = entry?.kind == 'game'
          ? (() => {
            const name = gameIconName(entry);
            return lt.icon[name] !== undefined ? lt.icon[name] : lt.icon.Crown;
          })()
          : undefined;
        const mark = entry?.kind == 'player'
          ? lt.icon.User
          : gameMark || parentFlair || (row0?.icon && lt.icon[row0.icon] !== undefined ? lt.icon[row0.icon] : undefined);
        if (mark !== undefined)
          li.append($('<span class="record-icon">').attr('data-icon', mark));
      }
      const box = $('<div class="record-content">');
      if (userPageKind(entry?.kind)) box.attr('data-href', '/@/' + entry.id);
      const nameBox = $('<span class="bookmark-name">');
      const jumpHref = folder || dead ? undefined : row0?.openUrl?.(entry.id, entry.meta);
      nameBox.text(labelText);
      const ownFlair = flairImage(lt, entry?.meta?.flair);
      const titleMark =
        userPageKind(entry?.kind) || entry?.kind == 'team' || entry?.kind == 'blog' ? entry?.meta?.title : undefined;
      const titleSpan = titleMark ? $('<span class="bookmark-title">').text(String(titleMark)) : undefined;
      if (userPageKind(entry?.kind) || entry?.kind == 'team') {
        if (ownFlair !== undefined) nameBox.append($('<img class="record-flair">').attr('src', ownFlair));
      }
      else if (ownFlair !== undefined && !parentFlair)
        nameBox.append($('<img class="record-flair">').attr('src', ownFlair));
      if (entry?.kind == 'chapter' && (entry?.meta?.playable === true || interactiveChapter(entry, record))) {
        const eye = lt.icon.Eye;
        if (eye !== undefined) nameBox.append($('<span class="record-playable">').attr('data-icon', eye));
      }
      if (entry?.kind == 'tournament') {
        const variantMark = variantIcons[String(entry?.meta?.variant ?? '').toLowerCase()];
        const perf = perfIcon(lt, entry?.meta?.perf) ??
          (variantMark && lt.icon[variantMark] !== undefined ? lt.icon[variantMark] : undefined);
        if (perf !== undefined) nameBox.append($('<span class="record-perf">').attr('data-icon', perf));
        const started = entry?.meta?.finished === true ? undefined : localDate(lt, entry?.meta?.startsAt);
        if (started) {
          if (perf !== undefined) nameBox.append($('<span class="record-sep">').text(' - '));
          nameBox.append($('<span class="record-date">').text(started));
        }
      }
      if (record && 'visibility' in record) nameBox.append(studyPublicIcon(record));
      if (titleSpan) box.append(titleSpan);
      box.append(nameBox);
      li.append(box);
      const popupRecord = entry?.kind == 'studyPosition' ? content.studyRecordFor(entry) : record;
      const ownCount = popupRecord?.chapterCount ?? popupRecord?.chapters?.length;
      if (ownCount && entry?.kind != 'chapter' && entry?.kind != 'studyPosition')
        li.append($('<span class="record-chapter-count">').text(String(ownCount)));
      if (!folder && !dead && entry.kind == 'study' && !ownCount) {
        indexed.cold = true;
      } else if (!folder && !dead) {
        const built = popupFacts(content, trans, entry, labelText, popupRecord);
        if (built) {
          const preview = popupData(built.items, built.title);
          if (preview) {
            for (const [name, value] of Object.entries(preview.attrs)) box.attr(name, value);
            popupPreviews.set(box[0], { items: preview.items, title: preview.title });
            for (const target of popupTargets(box[0])) content.popupNodes.add(target);
            indexed.popupAnchor = box[0];
            indexed.preview = true;
          }
        }
      }

      if (!folder && !dead && profilePending(entry)) indexed.profile = true;

      let actions;
      const actionsOf = () => {
        if (!actions) {
          actions = $('<div class="record-actions">');
          li.append(actions);
        }
        return actions;
      };

      if (jumpHref !== undefined) {
        const jump = $('<button class="btn-row-open" type="button">')
          .attr('title', trans.noarg('recordsDbOpenButton'));
        if (lt.icon.Link !== undefined) jump.attr('data-icon', lt.icon.Link);
        else jump.text(trans.noarg('recordsDbOpenButton'));
        content.rowIndex.set(jump[0], { ...indexed, chip: 'open' });
        actionsOf().append(jump);
      }

      return li;
    };


    const shownCounts = content.kindCounts();
    const treeTotal = content.filedCount();
    const shownTotal = Object.values(shownCounts).reduce((sum, count) => sum + count, 0);
    const header = $('<div class="tree-header">');
    const countsLine = $('<span class="tree-counts">');
    const kindLines = content.presentKinds().map((kind) =>
      trans.pluralSame('recordsDbCount' + camel(kind), shownCounts[kind] ?? 0));
    countsLine.text(trans.pluralSame('recordsDbItemsCount', shownTotal));
    countsLine.attr('title', kindLines.join('\n'));
    header.append(countsLine);
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
      const bar = $('<div class="confirm-bar">');
      bar.text(trans.pluralSame('recordsDbPressAgain', content.confirmBar.count));
      header.append(bar);
    }

    const body = $('<div class="body bookmarks-body">').attr('data-revision', String(content.revision));
    const tree = $('<ul class="records">');
    if (treePaint !== content.revision) hideStudyPopup();
    treePaint = content.revision;
    for (const row of content.results) {
      const rowEl = rowOf(row);
      tree.append(rowEl);
      if (userPageKind(row?.entry?.kind)) {
        const tipBox = rowEl.find('.record-content');
        if (tipBox?.length) lt.lichess?.powertip?.manualUser?.(tipBox[0]);
      }
    }
    body.append(tree);
    if (content.error) {
      const error = $('<div class="error">');
      error.text(content.error.message);
      const retryButton = $('<button type="button">').text(trans.noarg('recordsDbRetry'));
      content.rowIndex.set(retryButton[0], { row: undefined, entry: undefined, folder: false, dead: false, node: retryButton[0], preview: false, cold: false, chip: 'retry' });
      error.append(retryButton);
      body.append(error);
    }
    const end = $('<div class="bookmark-end">');
    content.rowIndex.set(end[0], { row: undefined, entry: undefined, folder: false, dead: false, node: end[0], preview: false, cold: false });
    if (!content.entries.length) end.append($('<span class="status">').text(trans.noarg('recordsDbEmptyNote')));
    body.append(end);



    const backupRack = $('<div class="rack-backup">');
    const backupButton = rackButton('btn-backup', 'recordsDbBackup');
    backupButton.on('click', async (ev) => {
      await content.downloadTree();
    });
    const restoreButton = rackButton('btn-restore', 'recordsDbRestoreTree');
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
        content.message == 'removedCount' && content.messageCount !== undefined
          ? trans.pluralSame('recordsDb' + camel(content.message), content.messageCount)
          : trans.noarg('recordsDb' + camel(content.message)),
      );
      host.append(note);
    }
    host.append(backupRack);
    return host;
  }

  const minWindowWidth = 280;




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

  function moveWindow(rect, dx, dy, edge, viewport, floor) {
    if (!edge) return fitWindow({ ...rect, left: rect.left + dx, top: rect.top + dy }, viewport);
    const inset = Math.min(8, viewport.width / 4, viewport.height / 4);
    const minTop = Math.max(inset, viewport.top);
    const minWidth = Math.max(minWindowWidth, floor?.width ?? 0);
    const minHeight = Math.max(Math.min(160, Math.max(0, viewport.height - inset - minTop)), floor?.height ?? 0);
    let { left } = rect;
    let right = left + rect.width;
    let bottom = rect.top + rect.height;
    if (edge.includes('w')) left = clamp(left + dx, { min: inset, max: right - minWidth });
    if (edge.includes('e')) right = clamp(right + dx, { min: left + minWidth, max: viewport.width - inset });
    if (edge.includes('s')) bottom = clamp(bottom + dy, { min: rect.top + minHeight, max: viewport.height - inset });
    return { left, top: rect.top, width: right - left, height: bottom - rect.top };
  }






  function anchorBox(rect, viewport) {
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;
    const side = centreX < viewport.width / 2 ? 'l' : 'r';
    const edge = centreY < viewport.height / 2 ? 't' : 'b';
    return {
      corner: edge + side,
      dx: side == 'l' ? rect.left : viewport.width - rect.left - rect.width,
      dy: edge == 't' ? rect.top : viewport.height - rect.top - rect.height,
    };
  }

  function rememberedBox(row, viewport) {
    const { left, top, width, height } = row.geometry;
    const anchor = row.anchor;
    if (!anchor || !Number.isFinite(anchor.dx) || !Number.isFinite(anchor.dy)) return { left, top, width, height };
    const corner = anchor.corner;
    return {
      left: corner?.[1] == 'r' ? viewport.width - anchor.dx - width : left,
      top: corner?.[0] == 'b' ? viewport.height - anchor.dy - height : top,
      width,
      height,
    };
  }

  function windowCanHold(viewport) {
    const inset = Math.min(8, viewport.width / 4, viewport.height / 4);
    const availableHeight = Math.max(0, viewport.height - inset - Math.max(inset, viewport.top));
    return viewport.width - 2 * inset >= minWindowWidth && availableHeight >= 160;
  }

  class WindowCtrl {
    constructor(owner, content, geometry) {
      this.owner = owner;
      this.content = content;
      this.geometry = geometry;
      this.windowFrame;
      this.redraw = async () => {
        this.windowFrame?.redraw();
        await this.saveState();
      };
      this.unwatch = owner.store.syncCtrl.watch(this.redraw);
      this.stateSaved = 0;
    }

    async saveState() {
      if (Date.now() - this.stateSaved < windowStateSaveMs) return;
      this.stateSaved = Date.now();
      return this.owner.save();
    }

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
      this.scrollOffset = windowFrame?.scrolled() ?? this.scrollOffset;
      this.windowFrame = undefined;
      windowFrame?.close();
    }

    freeze() {
      const view = this.content.frozenView();
      const scroll = this.windowFrame?.scrolled() ?? this.scrollOffset;
      return [{
        kind: this.content.kind,
        active: true,
        geometry: { ...this.geometry },
        anchor: anchorBox(this.geometry, windowViewport(this.owner.lichessTools)),
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
      this.inner;
      this.scrollHost;
      this.treeHost;
      this.typedBox;
      this.scrollerSelectors = ['.content-frame', '.body', 'ul.records'];
      this.scrollRestore = ctrl.scrollRestore;
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
        resizable: {
          begin: () => this.setOrder(0),
          resize: (rect, edge, dx, dy, base) => this.resizeTo(rect, edge, dx, dy, base),
        },
      });
      if (!dialog) return false;
      const $ = lt.$;
      const root = $(dialog).addClass('lichessTools-recordsDbUi records-db');
      if (this.ctrl.windowFrame !== this) {
        root.remove();
        return false;
      }
      this.frame = { dialog: root, view: root.find('.dialog-content') };
      root
        .on('close', () => {
          if (!this.closed && this.ctrl.windowFrame === this) this.ctrl.owner.close();
        })
        .on('keydown', (ev) => this.escapeKey(ev));
      const handle = root.children('.dialog-header');
      if (handle.length)
        handle.on('pointerup', () => {
          if (!this.frame) return;
          const rect = this.frame.dialog[0]?.getBoundingClientRect?.();
          const kept = this.ctrl.geometry;
          if (!rect || !kept) return;
          this.apply({
            left: rect.x + rect.width / 2 - kept.width / 2,
            top: rect.y + rect.height / 2 - kept.height / 2,
            width: kept.width,
            height: kept.height,
          });
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
      const scrolled = this.scrollRestore ?? this.scrolled();
      const view = bookmarkView(content, host, box);
      if (!view?.length) return;
      if (!this.treeHost) host.appendTo(this.scrollHost);
      this.treeHost = host;
      this.typedBox = box;
      this.scrollRestore = undefined;
      this.restoreScroll(scrolled);
    }

    scrolled() {
      const dialog = this.frame?.dialog;
      if (!dialog?.length) return undefined;
      return this.scrollerSelectors.map((selector) => {
        const scroller = dialog.find(selector)?.[0];
        return scroller ? { selector, top: scroller.scrollTop || 0 } : undefined;
      }).filter(Boolean);
    }

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



    innerHost() {
      const $ = this.ctrl.owner.lichessTools.$;
      const inner = $('<div class="inner-content">');
      $('<div class="content-frame">').appendTo(inner);
      return inner;
    }

    close() {
      if (this.closed) return;
      this.closed = true;
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
      this.apply(fitWindow(this.ctrl.geometry, windowViewport(this.ctrl.owner.lichessTools)));
    }

    apply(rect) {
      if (!this.frame) return;
      const lt = this.ctrl.owner.lichessTools;
      rect = fitWindow(rect, windowViewport(lt));
      this.ctrl.setGeometry(rect);
      const node = this.frame.dialog[0];
      if (!node) return;
      const set = (name, value) => {
        if (node.style?.setProperty) node.style.setProperty(name, value);
        else node.style[name] = value;
      };
      set('left', rect.left + rect.width / 2 + 'px');
      set('top', rect.top + rect.height / 2 + 'px');
      set('width', rect.width + 'px');
      set('height', rect.height + 'px');
      set('right', 'unset');
      set('bottom', 'unset');
      set('min-width', 'auto');
      set('min-height', 'auto');
      set('max-width', 'none');
      set('max-height', 'none');
    }

    resizeTo(proposed, edge, dx, dy, base) {
      if (this.closed || !this.frame) return proposed;
      const viewport = windowViewport(this.ctrl.owner.lichessTools);
      const wanted = { width: proposed.width, height: proposed.height };
      const rect = fitWindow(moveWindow(base, dx, dy, edge, viewport, wanted), viewport);
      this.ctrl.setGeometry(rect);
      return rect;
    }

    escapeKey(event) {
      if (!event || event.key !== 'Escape') return;
      if (event._recordsDbEscape) return;
      event._recordsDbEscape = true;
      event.preventDefault?.();
      event.stopPropagation?.();
      this.ctrl.owner.close();
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
      this.content = new BookmarkTabContent(lichessTools, store);
      this.window;
      this.toggleButton;
    }

    clearSelection() {
      this.content.clearSelection();
    }

    canOpen() {
      return this.canPlace();
    }

    canPlace() {
      const lt = this.lichessTools;
      return !!this.store
        && !!lt.getUserId()
        && this.store.isRecordsDbAvailable(lt.location.pathname);
    }

    pageStudyId() {
      const lt = this.lichessTools;
      const analysisId = lt.lichess?.analysis?.study?.data?.id;
      if (analysisId) return analysisId;
      const studyMatch = /^\/study\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?/.exec(lt.location?.pathname || '');
      return studyMatch?.[1];
    }

    storedScroll(stored) {
      for (const row of stored || []) {
        if (row?.kind != this.content.kind) continue;
        return Array.isArray(row?.scroll) ? row.scroll : undefined;
      }
      return undefined;
    }

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

    async handoff() {
      const lt = this.lichessTools;
      const flag = await lt.storage.get(treeHandoffKey, { session: true });
      if (!flag) return false;
      await lt.storage.remove(treeHandoffKey, { session: true });
      if (!flag.studyId) return false;
      if (Date.now() - (flag.at ?? 0) >= treeHandoffMs) return false;
      return flag.studyId === this.pageStudyId();
    }

    async mount() {
      if (!this.window) return;
      if (!this.canOpen()) return this.teardown();
      this.window.windowFrame?.setOrder(0);
      await this.content.init();
      this.window.focusContent();
    }

    async open() {
      if (!this.canOpen()) return;
      if (this.window?.windowFrame) return;
      if (!this.window) await this.load();
      await this.window.show();
      await this.setStayOpen(true);
      await this.rememberPage();
      this.listenLeave();
    }

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

    async stayOpen() {
      const lt = this.lichessTools;
      return (await lt.storage.get(windowOpenKey, { session: true })) === true;
    }

    async setStayOpen(on) {
      const lt = this.lichessTools;
      await lt.storage.set(windowOpenKey, on === true ? true : undefined, { session: true });
    }

    async teardown() {
      if (!this.window) return;
      await this.save();
      this.window.dispose();
      this.content.destroy();
      this.window = undefined;
      this.stopLeave();
    }

    async close() {
      await this.setStayOpen(false);
      await this.teardown();
    }

    async toggle() {
      if (this.window?.windowFrame) await this.close();
      else await this.open();
    }

    storedGeometry(stored, viewport) {
      for (const row of stored || []) {
        const geometry = row?.geometry;
        if (row?.kind != this.content.kind) continue;
        if (!geometry || !['left', 'top', 'width', 'height'].every((key) => Number.isFinite(geometry[key]))) continue;
        if (geometry.width <= 0 || geometry.height <= 0) continue;
        if (!windowCanHold(viewport)) continue;
        return rememberedBox(row, viewport);
      }
      return undefined;
    }

    async load() {
      const lt = this.lichessTools;
      if (this.window) return;
      const stored = await this.store.idbStudy.loadWindows();
      const viewport = windowViewport(lt);
      const geometry = this.storedGeometry(stored, viewport) ?? this.initialGeometry();
      this.window = new WindowCtrl(this, this.content, fitWindow(geometry, viewport));
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
      for (const selector of ['div.site-buttons', 'header#top', 'body']) {
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
      const button = $('<button class="link records-db-button" type="button">')
        .attr('title', trans.noarg('recordsDbButtonTitle'))
        .attr('tabindex', '0')
        .append($('<icon>').attr('data-icon', lt.icon.CardDividers));
      button.on('click', (ev) => {
        if (ev.button) return;
        ev.preventDefault?.();
        this.toggle();
      });
      const div = $('<div class="lichessTools-recordsDb">').append(button);
      const dasher = $('div.site-buttons div.dasher');
      if (dasher.length) {
        div.insertBefore(dasher);
      } else {
        div.appendTo(host);
      }
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




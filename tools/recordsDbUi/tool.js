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
  // Whether the user left the window open. The window lives in one page's dom, so every page load
  // has to decide again: this session key says the user never closed it, so the next page lifts it
  // back. Only a manual close - the toggle press, or the dialog's own close - takes the key away.
  const windowOpenKey = 'LichessTools.collectionTree.windowOpen';
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

  // The mark a game row wears: variant chess takes the variant icon, standard games the
  // time-control icon - the same map the recent-games list dresses from its css - and an
  // unknown control answers Crown. Module scope so the paint and the class read one map.
  const variantIcons = { chess960: 'DieSix', kingofthehill: 'FlagKingHill', threecheck: 'ThreeCheckStack', antichess: 'Antichess', atomic: 'Atom', horde: 'Keypad', racingkings: 'FlagRacingKings', crazyhouse: 'Crazyhouse' };
  const speedIcons = { ultrabullet: 'UltraBullet', bullet: 'Bullet', blitz: 'FlameBlitz', rapid: 'Rabbit', classical: 'Turtle', correspondence: 'PaperAirplane' };
  // The word a popup spells for a control: the site's own vocabulary, kept as it prints it.
  const speedWords = { ultrabullet: 'Ultra bullet', bullet: 'Bullet', blitz: 'Blitz', rapid: 'Rapid', classical: 'Classical', correspondence: 'Correspondence' };
  // The key each contained kind uses to name the item that carries it: a chapter names its study,
  // a study position names its study, a blog post its blog, a forum post its board, a relay game
  // its broadcast. The registry's `containment` names the kind that carries it.
  const containedCarrier = { chapter: 'studyId', studyPosition: 'studyId', blogPost: 'userId', forumPost: 'board', broadcastGame: 'slug' };
  // The mark a game row wears: variant chess takes the variant icon, standard games the
  // time-control icon - the same map the recent-games list dresses from its css - and an
  // unknown control answers Crown. Module scope so the paint and the class read one map.
  const gameIconName = (node) =>
    variantIcons[String(node?.meta?.variant ?? '')] || speedIcons[String(node?.meta?.speed ?? '')] || 'Crown';
  // A game url carries the 8-char game id or the 12-char full id, whose tail names the player
  // whose page it is. The records key on the game alone, so no leaf ever holds the tail, and
  // every game shape below reads its id through this.
  const gameKeyId = (raw) => {
    const id = String(raw ?? '');
    return id.length === 8 ? id : id.length === 12 ? id.slice(0, 8) : undefined;
  };
  // The control and the variant a page names for a game, in the two spellings the blobs come
  // with: the plain game page spells speed and perf as words and keys the variant object, the
  // replay page words the speed and keys the variant, and the api read words both.
  const gameSpeedOf = (game) => {
    const raw = game?.speed ?? game?.perf;
    return typeof raw == 'string' ? raw : String(raw?.key ?? '');
  };
  const gameVariantOf = (game) => {
    const raw = game?.variant;
    return typeof raw == 'string' ? raw : String(raw?.key ?? '');
  };
  // The hover board's state in the shape lila's miniBoard.ts splits: "fen,orientation,lastMoveUci".
  // A bare position names its fen as its id; a study position and a puzzle read it from `meta.fen`
  // - the puzzle's arrives from one api read after the file - and a leaf filed before those
  // fields existed has no board to show.
  const boardStateFor = (entry) => {
    const fen = entry?.kind == 'position' ? entry.id : entry?.meta?.fen;
    if (!fen) return undefined;
    return fen + ',' + (entry.meta?.orientation == 'black' ? 'black' : 'white') + ',' + (entry.meta?.lastMove || '');
  };
  // The board square in page pixels: the sheet keeps the marker at 15em of the popup's own
  // reading size (13px), and a tooltip that carries a board reserves the same square for it.
  const hoverBoardPx = 15 * 13;
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
        'recordsDbUndo': 'Undo',
        'recordsDbExpandFolder': 'Expand folder',
        'recordsDbCollapseFolder': 'Collapse folder',
        'recordsDbExpandBranch': 'Expand',
        'recordsDbCollapseBranch': 'Collapse',
        'recordsDbExpandAll': 'Expand all folders',
        'recordsDbCollapseAll': 'Collapse all folders',
        // The tree view: the header, the three chips, the actions and the backup ask for these.
        // Every one lives in this table - a string the view asks for but the table lacks would
        // render blank.
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
      // The engines live on the tool itself: the classes below are not tools, so they reach their
      // search engine and their navigation through this one instance.
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
      // Take whatever the last page left open off this page's dom before deciding again. A page
      // being left is not a user closing the window, so the "left open" flag stays untouched.
      if (ctrl) {
        await ctrl.teardown();
        ctrl.removeToggle();
      }

      // The hand-off is spent on every page load, before anything else decides: a flag nobody
      // spends would otherwise reopen the window on the next visit of that study. The url trail is
      // spent the same way, for the same reason - it is the back button's only signal.
      const arrived = ctrl ? await ctrl.handoff() : false;
      const returned = ctrl ? await ctrl.returned() : false;
      const stayed = ctrl ? await ctrl.stayOpen() : false;
      if (value === false || !ctrl) return;
      if (!ctrl.canPlace()) {
        // The route the db never speaks for (broadcast, practice, learn) or no user behind the page
        // - nothing to place and nothing to enrich.
        this.logOption('Records database', 'cannot open here');
        return;
      }
      // The button belongs on every page the db knows, not only where a study is open: the tree
      // travels with the user, and opening a game or a replay enriches its row on that page.
      await ctrl.load();
      await ctrl.installToggle();
      // Once the user opened the window it travels with them: a trip from a row or a way back lift
      // it too, but they no longer gate it - the flag does, and only a manual close takes it away.
      if ((arrived || returned || stayed) && ctrl.canOpen()) {
        if (arrived) this.logOption('Opened from tree', true);
        if (returned) this.logOption('Came back to a page that had the window', true);
        if (stayed) this.logOption('Kept open since the window was left open', true);
        await ctrl.open();
        return;
      }
      // The page kept its window short, so the visit reads alone: what the page names still
      // dresses any filed leaf it finds - a game's players and control, a profile's panel - and
      // that reaches the tree the next time the window loads, pressed or not.
      await ctrl.content.init();
      ctrl.content.enrichFromPage();
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
      // Leaf-parents the user has collapsed - a study holding filed chapters, a filed game that
      // grew its own children. A leaf-parent is open by default; the caret adds it here.
      this.collapsed = new Set();
      // The gestures this window has done to the tree, newest last; the Undo chip walks them
      // back. A snapshot copies the shape: edits re-hang and rewrite nodes in place, so only
      // a copy lets an older state survive them.
      this.undoStack = [];
      this.query = '';
      this.terms = [];
      // The two state chips plus the kind chip; string states so the blob reads without a mapping.
      this.filters = { access: 'all', visibility: 'all', kind: 'all' };
      this.selectMode = false;
      // What the next Add press files. 'study' is the default; the dropdown caret opens the
      // menu (and a later press closes it). Opening the menu shows one chip per kind the page
      // can name; clicking a chip sets `addChoice` and files that kind.
      this.addChoice = 'study';
      this.addMenuOpen = false;
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
      // The nodes a reading waits on: the content box of a row that has facts, with every node under
      // it. A pointer over a row's padding or one of its chips lands on none of them and asks for
      // nothing.
      this.popupNodes = new WeakSet();
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
      // Chrome refuses to drag an element the page marked `draggable="false"`, and it fires no
      // drag event at all for such a press - so a gesture meant for one of lichess's own links
      // never reaches the tree. The links this table can name have the flag taken back.
      if (!signal.aborted) this.armPageDrag();
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

    // The move label lichess itself paints: the full-move number, '.' before White's SAN and '...'
    // before Black's. The root has no move, so it answers empty.
    moveText(ply, san) {
      if (!san || !Number.isFinite(ply) || ply < 1) return '';
      return Math.ceil(ply / 2) + (ply % 2 ? '.' : '...') + ' ' + String(san);
    }

    // A leaf is `{kind,id,label,meta?}`. The mirror record's own name is what a cold row shows,
    // but a rename writes a `label` with `meta.renamed`, and a title whose `meta.nameTemp` says
    // where it came from (link text, a slug, an id) waits for its data name: then the record name
    // wins and the text is only the fallback.
    leafLabel(node) {
      const record = this.recordCache.get(node);
      const owned = node?.label;
      const tempName = !!node?.meta?.nameTemp && node?.meta?.renamed === undefined;
      if (owned != null && String(owned).length && !tempName) return String(owned);
      // A chapter inherits its study's record - that is what dims or stamps it gone - so the
      // study's own name must not stand in for the chapter's. The chapter's entry under that
      // record answers first; a card that lists chapters without ids leaves the study name.
      if (node?.kind == 'chapter') {
        const own = (record?.chapters || []).find((chapter) => chapter?.id === node.id);
        if (own?.name) return String(own.name);
      }
      // A node path is not readable, so a cold study position says where it is: the chapter it
      // lives in and the move that reaches it. A renamed one keeps its own text above.
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

    // The record of the study a position sits in: the cache keys a record by row id, and a position
    // id spells its chapter and path - only the leaf's own meta names the study to look up.
    studyRecordFor(node) {
      return this.studies.get(String(node?.meta?.studyId ?? ''));
    }

    // The writer a thread names on its own page: lila spells each post's author as a profile
    // link, and the first one under the posts is the thread's own writer - a slug says nothing
    // about who wrote it.
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

    // The links a page carries that this table can name, and that the page marked
    // `draggable="false"`: Chrome shows a no-drop cursor and fires no drag event for such an
    // element, so the tree would never hear a gesture meant for one. Taking the flag back is what
    // lets the press arm a carry and land in `externalDrop`; a link the table cannot name keeps the
    // page's own refusal.
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

    // A lichess route as the path the registry opens: a root-relative path, or the path of an
    // absolute lichess url. A bare fragment, an off-site link and the main page name no item - the
    // extension controls no other page, so it never files one.
    lichessRoute(href) {
      const raw = String(href ?? '').trim();
      if (!raw || raw.startsWith('#')) return undefined;
      const at = /^(https?:\/\/[^/]+)?(\/[^#]*)$/.exec(raw);
      if (!at) return undefined;
      if (at[1] && !/lichess\.org$/i.test(at[1])) return undefined;
      const path = at[2].replace(/\/+$/, '');
      return path && path !== '/' ? path : undefined;
    }

    // The page's own title, as the tab spells it - with the site's own name cut off the tail,
    // which every lichess page hangs on its title.
    pageTitle() {
      const lt = this.lichessTools;
      const title = String(lt.global?.document?.title ?? '').trim();
      const cut = title.lastIndexOf(' \u2022 ');
      const name = cut > 0 ? title.slice(0, cut).trim() : title;
      return name.length ? name : undefined;
    }

    // A name generated from the item's own data: slugs read as words, and a puzzle answers
    // with its own theme (humanised) since the read carries no title of its own.
    humaniseSlug(slug) {
      const text = String(slug || '').replace(/-/g, ' ').trim();
      return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    }

    // The row says which puzzle it is and how hard it rates: the id the url carries and the
    // rating the page blob or the read brings. Themes never stand in for a name - they describe
    // the collection a puzzle sits in, so the same puzzle would answer with a different title.
    puzzleName(id, data) {
      const rating = data?.rating;
      const key = '#' + String(id);
      return rating === undefined || rating === '' ? key : key + '/' + String(rating);
    }

    // Every walk that only counts or collects rides here: one predicate for every node, in paint
    // order, and a folder is walked into whatever it holds. The walks that need a parent's record
    // or a row's path keep their own.
    eachNode(nodes, visit) {
      for (const node of nodes || []) {
        visit(node);
        this.eachNode(node.children || [], visit);
      }
    }

    // Which kinds are on the tree - the kind chip walks these, so a study tree never offers a
    // games state.
    presentKinds() {
      const present = new Set();
      this.eachNode(this.entries, (node) => present.add(node?.kind));
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
          const isFolder = this.folder(node);
          if (!isFolder && !this.passes(node)) return [];
          const children = visit(node.children || [], path);
          // A leaf that grew a `children` array (the tree lets any item parent any other) is a
          // parent too: its subtree is visible by default and the caret hides it, so the shape
          // reads naturally without a click. A folder keeps the old default - hidden until
          // opened - and the caret brings the branch out.
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

    // The whole tree paints: a tree taller than the dialog only grows its scrollbar, so opening
    // a folder can never move rows out of reach below the fold.
    get results() {
      return this.rows;
    }

    // The header prints one line per kind present, plus `shown / total` and the filed/database
    // counts.
    kindCounts() {
      const counts = {};
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node) && this.passes(node)) counts[node.kind] = (counts[node.kind] || 0) + 1;
      });
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
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node) && this.isGone(node)) missing++;
      });
      return missing;
    }

    // The studies the tree holds. The local db keeps a capture only for what this names, so
    // opening a study you do not own costs a record for a row that needs one, not an unbounded
    // file - and a leaf that leaves the tree loses its capture with it.
    treeStudyIds(nodes = this.entries, ids = new Set()) {
      this.eachNode(nodes, (node) => {
        if (node.kind == 'study') ids.add(node.id);
      });
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
      this.eachNode(this.entries, (node) => {
        if (!this.folder(node)) leaves++;
      });
      return leaves;
    }

    // Every folder the tree holds, in paint order - what the fold-all chip counts and acts on.
    folderNodes(nodes = this.entries, found = []) {
      this.eachNode(nodes, (node) => {
        if (this.folder(node)) found.push(node);
      });
      return found;
    }

    // Every node that can be opened - a folder or a leaf that grew a `children` array - in paint
    // order. A leaf with children is a parent for the caret, so expand-all and the fold-all chip
    // have to walk it the same way they walk a folder.
    parentNodes(nodes = this.entries, found = []) {
      this.eachNode(nodes, (node) => {
        if (this.folder(node) || (node?.children || []).length) found.push(node);
      });
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
      // A fresh window opens with a fresh gesture chain - undo is scoped to the dialog, not
      // to the tab's whole life.
      this.undoStack = [];
      // Press-move-release page drags (see `dragArm`): the pending source element and how
      // long the press has been travelling.
      this.pendingDrag = undefined;
      this.pageDragAttached = false;
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
        if (!ev.dataTransfer || !info?.row || info.chip || info.dead) {
          return;
        }
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData(recordsDragType, JSON.stringify(this.drag(info.entry)));
      };
      // The hover board cannot live inside the window: lichess styles boards and their
      // pieces from a sheet scoped under the page's `main`, and no rule in it can cross
      // into a dialog - inside the window a chessground would always come up blank. So
      // the chessground hangs off `main` itself, wearing lila's own mini-board contract
      // (`mini-board mini-board--init` + `data-state` "fen,orientation,lastMoveUci"),
      // which makes it look exactly like the page's boards with the current themes. Ours
      // is only the fixed container it sits in (`records-db-mini-board`): the row's first
      // hover births one under `main` and hands it to `initializeDom` - lila builds the
      // chessground inside and strips the marker class - and every enter re-pins the
      // container inside the row's tooltip when that reading carries a board slot, or over
      // the hovered row when it does not; the hover-out hides it. One chessground per
      // hovered row persists on the page, ready for the next enter.
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
        // The fixed slot wants viewport numbers, and cash's `offset()` answers in page
        // coordinates - which drift under a scrolled dialog - so the pin reads the raw rect of
        // the slot it parks in and of the container, the same source `showStudyPopup` places
        // from, and stays clamped inside the viewport.
        const rowEl = lt.$(node);
        // A reading that carries a board reserves the square for it (the `popup-board` item), so
        // the board lands inside the tooltip; a row with no reading floats the square over its
        // own right end.
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
        // The profile card is not asked for here: the paint hands every profile row's box to
        // `powertip.manualUser` as the row lands on the page (see `bookmarkView`), so the card is
        // already up before a pointer arrives and a repaint keeps it fresh.
        // Only a pointer over the item raises a reading: `popupNodes` holds the content box with
        // everything under it, so a hover over a row's padding or its chips asks for nothing.
        if (info.preview && info.itemHover) {
          // A row arriving spends a hide the pointer left on a nearby tooltip, then shows
          // this row's facts - one gesture, one tooltip.
          cancelPopupHide();
          showStudyPopup(info.popupAnchor);
        } else if (info.cold) this.hoverRead(info.entry);
        // The board pins after the tooltip so it can park inside the reading rather than float
        // over the row as a second box (see `hoverShow`).
        hoverShow(info.entry, info.node);
        // A profile row that carries none of its own facts grows them from one read; the row
        // repaints once the read lands.
        if (info.profile) this.requestUserRead(info.entry);
      };
      const rowMouseOut = (ev) => {
        const info = this.rowTarget(ev);
        if (!info?.row) return;
        hoverHide(info.entry);
        if (info.preview && !info.chip) schedulePopupHide();
      };
      // The tree host can never see a page drag's drag events (they bubble up the dragged
      // element's ancestors, not the drop point's), and Chrome may refuse the drag outright -
      // so the press-and-hold path listens on mouse events. This cash shim's `.on` attaches
      // to the wrapped element only, so a body handler never sees a press whose target lives
      // in the rest of the page: on the real page the listeners go on `document` in the
      // **capture** phase - fired top-down before any in-page handler, for every element.
      // (The harness mock has no real document; there the cash attach on the body stands.)
      if (!this.pageDragAttached) {
        const doc = lt.global?.document;
        if (doc?.addEventListener) {
          this.pageDragAttached = true;
          doc.addEventListener('mousedown', (e) => this.dragArm(this.dragEv(e)), true);
          doc.addEventListener('mousemove', (e) => this.dragMove(this.dragEv(e)), true);
          doc.addEventListener('mouseup', (e) => this.dragRelease(this.dragEv(e)), true);
          // Chrome promotes some page presses into real drags (their chapter list handler
          // allows it) and then swallows the mousemoves - so the same gesture reads the
          // drag family too, at the document where capture listeners answer rides no matter
          // which ancestors the dragged element lives under.
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
      // The page this window opens on may already know fresher facts than the tree kept -
      // a visit re-names a filed study from the mirror, a profile re-reads a filed player.
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

    // Flip the caret for a node that can be opened. Folders remember the open side; leaf-parents
    // remember the closed side, because a filed study that grew filed chapters reads more
    // naturally when it starts visible.
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

    // One press for every openable row, kept in the caret's reading: anything still closed means
    // the press opens the tree, everything open means the press folds it back. Leaf-parents are
    // walked with folders so the "all" gesture sees every row that carries a caret.
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
      const collapsed = [...this.collapsed].map((node) => chains.get(node)).filter(Boolean);
      const selected = [...this.selected].map((node) => chains.get(node)).filter(Boolean);
      // A row of the shape that is not in the tree any more is dropped from the write: the next page
      // cannot name it, and a shape made only of such rows writes nothing at all. The line spells the
      // rows that went, so a live page can see whether its own state drifted or the write did.
      const missing = [...this.expanded, ...this.collapsed, ...this.selected].filter((node) => !chains.has(node));
      if (missing.length)
        this.logState('Old shape rows dropped', [missing.length, this.expanded.size + this.collapsed.size + this.selected.size].join('/') + ' ' + missing.map((node) => String(node?.name ?? node?.id ?? node?.kind ?? '?')).join(','));
      return { expanded, collapsed, selected };
    }

    // The other half of the round trip: the walk names the rows the rebuilt tree has by the same
    // chains, and only the ones the blob still carries come back - a chain the tree no longer has
    // simply leaves that folder collapsed. The count goes to the log because a page can only be
    // checked where it ran: a short number here says the shape is being lost in the page, not in
    // this tool.
    restoreView(storedRows) {
      const rows = (storedRows || []).filter((row) => row?.kind === this.kind);
      const view = rows[0]?.view;
      const usable = (list) => Array.isArray(list) ? list.filter((chain) => Array.isArray(chain)) : [];
      const openFolders = usable(view?.expanded);
      const closedParents = usable(view?.collapsed);
      const keptRows = usable(view?.selected);
      // A row for this tab with no shape in it means the page that wrote it had no tree read yet,
      // so the shape it carried was never put down - the carry in `saveWindows` is what answers
      // for that page, and this line says when it did not.
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

    // The row a hit element falls on: the row itself, one of its children, or one of the chips a
    // row wears. A press lands on the icon inside a chip rather than on the chip, so the answer
    // climbs to the nearest button before it looks for the row. The answer also says whether the
    // pointer sat on the item itself, which is the only place a reading answers.
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

    // The drop half of a drag: the upper half of a row inserts before it, the lower half of a
    // folder drops inside it, otherwise after the row next sibling. The node is the element the
    // marker sits on - the row the pointer fell on, or the marker at the end of the tree.
    insertionTarget(ev, row, node) {
      if (!row) return { parent: undefined, before: undefined, position: 'before' };
      const { entry, path } = row;
      const parent = path.length > 1 ? this.at(path.slice(0, -1)) : undefined;
      const rect = node?.getBoundingClientRect?.() || { top: 0, height: 0 };
      if (ev.clientY < rect.top + rect.height / 2) return { parent, before: entry, position: 'before' };
      // Any item may parent any other item, so the lower half of a row - folder or leaf - nests
      // the payload inside that row. An empty leaf has no children yet; `drop` opens the array
      // on the first push.
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
      // A ride another source started - the study tool's draggable chapter buttons, a
      // default-draggable link - carries their payload type, never ours. Accepting it
      // here is what makes Chrome fire the `drop` over the tree; the commit reads the
      // dragged element, so we accept without ever reading their payload.
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

    // The shapes a page hands the tree, one flow for every kind: a study-page chapter button
    // carries its own `data-id` and wears its `<h3>` as the name; anchors carry the URL the
    // registry opens - study `/study/ID`, game `/game/ID`, a bare id, or the 12-char full id
    // whose tail names the player and keys the same game by its first 8, player `@/Name`
    // (the modern shape; the quoted `/'Name'` is the same leaf) with the power-tip fields,
    // puzzle `/training/theme/n`. A shape the table does not know names nothing: a tournament
    // page has no kind of its own, but its player links name players.
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
      // Names come from the item's data. Where the drag had only the link text (study, game,
      // puzzle), the text waits as `meta.nameTemp = 'page'` and the data name replaces it when
      // a read or an open lands. Slugs and handles are item data already, so those rows name
      // themselves from the url.
      const study = /^\/study\/([a-zA-Z0-9]{8})$/.exec(path);
      if (study) return { kind: 'study', id: study[1], label: label() || undefined, meta: { nameTemp: 'page' } };
      const game = /^\/(?:game\/)?([a-zA-Z0-9]{8,12})(?:\/(?:white|black))?$/.exec(path);
      const draggedGame = gameKeyId(game?.[1]);
      if (draggedGame) return { kind: 'game', id: draggedGame, label: label() || undefined, meta: { nameTemp: 'page' } };
      // A name read off the url waits for the item's own data, so it carries the `slug` marker.
      const forumPost = /^\/forum\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)$/.exec(path);
      if (forumPost?.[2]) return { kind: 'forumPost', id: forumPost[2], label: this.humaniseSlug(forumPost[2]) || label() || undefined, meta: { board: forumPost[1], url: href, nameTemp: 'slug' } };
      const forum = /^\/forum\/([a-z0-9][a-z0-9-]*)$/.exec(path);
      if (forum) return { kind: 'forum', id: forum[1], label: this.humaniseSlug(forum[1]) || undefined, meta: { nameTemp: 'slug' } };
      // Broadcast links: reaching the underlying study (or a round named) files the game of
      // the relay, otherwise the relay itself. Both carry the RadioTower mark and open on the
      // broadcast route. A round builds all of its boards from one study, so the board's own
      // chapter is what tells them apart: the leaf keys on the chapter when the link names one
      // and the round's study rides under `roundId`, which is the half the route rebuilds - two
      // boards of one round then file as two leaves. The link's own text names the board (the
      // chapter is usually the two players); the relay it belongs to answers in the tooltip.
      const broadcastGame = /^\/broadcast\/([a-z0-9][a-z0-9-]*)\/([a-z0-9-]+)\/([a-zA-Z0-9]{8})(?:\/([a-zA-Z0-9]{8}))?(?:\/.*)?$/.exec(path);
      if (broadcastGame?.[3]) {
        // A drag off the board's own page may record the game that page plays - the same fact a
        // visit records - so a later visit to that game page dresses the row. Another board's link
        // on the page names a different chapter, and its game is not this row's to keep.
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
      // The routes that hang off a page of their own: a coach and a streamer are user handles under
      // their route, a team is a free-text name, a tournament an id. `/team/me` is the list of the
      // current user's teams, so it names no team.
      const coach = /^\/coach\/([a-zA-Z0-9_.-]+)$/.exec(path);
      if (coach?.[1]) return { kind: 'coach', id: coach[1], label: coach[1], meta: { nameTemp: 'slug' } };
      const streamer = /^\/streamer\/([a-zA-Z0-9_.-]+)$/.exec(path);
      if (streamer?.[1]) return { kind: 'streamer', id: streamer[1], label: streamer[1], meta: { nameTemp: 'slug' } };
      const team = /^\/team\/([^\/?#]+)$/.exec(path);
      if (team?.[1] && decodeURIComponent(team[1]).toLowerCase() !== 'me')
        return { kind: 'team', id: decodeURIComponent(team[1]), label: decodeURIComponent(team[1]), meta: { nameTemp: 'slug' } };
      // A ladder is an id under its own route, and the route says which kind of ladder it is:
      // `/tournament/` runs an arena, `/swiss/` runs a Swiss - the pages answer the same way.
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
      // A lichess route the table has no kind for is still an item: the leaf **is** the url, the
      // link text is the name that waits, and the page gives the row its title when it opens.
      // Off-site links file nothing - the extension controls no other page.
      const route = this.lichessRoute(href);
      if (route)
        return {
          kind: 'url',
          id: route,
          // The link text names the row until the page it opens names the row itself, so the
          // title of the page - not the route - is what the row spells.
          label: label() || route,
          meta: { url: route, ...(label().length ? { title: label(), nameTemp: 'page' } : {}) },
        };
      return undefined;
    }

    // Drags that start on the page rather than on a row still land here: the source is any
    // element `pageLeaf` can name, and the tree answers by opening a fresh leaf under the
    // pointer. `dragend` fires with the dragged element in `target`, so the landing row is
    // read from `currentTarget` instead, and a leaf the tree already holds re-lands only when the
    // release is over a row - a bare re-drop (no row under the pointer) keeps it where it is.
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
        // A carry of a row the tree already holds lands as a move when it stays among the
        // siblings it has now - a twin beside its own copy would say nothing. Let go over a
        // **different** parent, the gesture files a copy there and leaves the original in place:
        // the same item can hang in two folders, and every visit later dresses each copy.
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

    // A page drag read the parent its url names - a round knows the relay it came from, a chapter
    // the study - and a pointer that landed where no parent answers would otherwise drop the leaf
    // at the root and lose that stamp. When the tree already holds that parent the fresh leaf hangs
    // under it, so a second board of a relay rides the board already filed there rather than the
    // row the press happened to hover on; a parent the tree does not hold stays as the pointer said,
    // since inventing a row for a link the user never meant to file would surprise the tree.
    stampParentOf(entry, parent) {
      if (parent) return parent;
      const stamp = this.parentStamp(entry);
      const parentKind = String(this.registry[entry?.kind]?.containment ?? '');
      if (!stamp || !parentKind) return undefined;
      const held = this.findLeaf(parentKind, stamp);
      if (!held || !this.canDrop({ nodes: [entry] }, held)) return undefined;
      return held;
    }

    // The stamp a leaf carries for the leaf-parent it belongs to: `parentId` is the current
    // spelling, `studyId`/`blogId` the older ones the store still reads.
    parentStamp(node) {
      return node?.meta?.parentId ?? node?.meta?.studyId ?? node?.meta?.blogId;
    }

    // A drag from the page is our own gesture, read from whatever events survive - never
    // the browser's drop. The page splits in two: lichess parks most sources inside
    // containers it marked `draggable="false"`, and Chrome answers those presses with its
    // no-drop cursor and **no drag event ever fires**; the study chapter list is the
    // opposite - its own handler lets the press start a real drag, and Chrome then
    // swallows the mousemoves and ends the ride with a `dragend` that bubbles only up the
    // dragged element's own ancestors. So the tree listens once, on `document` in the
    // capture phase, for **both** event families: any press outside the tree arms a
    // pending carry of the element under the finger (nothing is pre-selected from a list
    // of page kinds - the tree decides at the drop), travel counts from mousemove or
    // dragover, and the commit happens on `mouseup` for pure mouse gestures and on
    // `dragend` for the ones Chrome promoted. Drag events name the dragged element in
    // `target` and say the point under the finger only as `clientX`/`clientY`, so those
    // landings come from `rowAtPoint`. We never call preventDefault on dragstart:
    // lichess's own rides (chapter reordering inside its list) keep working, and a ride
    // that means our tree still commits because we own the drop. A press without travel
    // is a click; a release outside the tree and a source the table cannot name spend
    // nothing.
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

    // A raw DOM event is not cash-wrapped, and the gesture reads only these fields.
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
      // Only travel while the left button holds the source - `buttons` is the DOM bitmask.
      if (ev.buttons !== undefined && !(ev.buttons & 1)) {
        return;
      }
      if (ev.ctrlKey || ev.metaKey || ev.button) return;
      this.pendingDrag.moves += 1;
      // The marker answers the pointer while the travel rides over the tree, so the
      // release point is visible before the release happens.
      const dbgLanded = this.rowTarget(ev);
      this.showDropMark(dbgLanded, ev);
    }

    // The gesture's feedback: the half-row under the pointer wears the drop mark the
    // paint already draws for in-tree moves. Every move re-marks, so leaving the tree
    // clears it.
    showDropMark(landed, ev) {
      clearDrop();
      if (!landed?.row) return;
      const target = this.insertionTarget(ev, landed.row, landed.node);
      const marked = this.lichessTools.$(landed.node);
      if (marked.length) marked.attr('data-bookmark-drop', target.position);
    }

    // A drag event names the dragged element, never the place under the finger - the
    // landing row for a promoted ride has to come from the pointer's own coordinates.
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

    // An empty tree has no row to land on, yet the drop belongs to it: the tree list stretches to
    // fill the window body, so a point inside that box is a root drop - the same answer the end
    // marker gives. A point on the page outside the window names no tree.
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
      // Chrome's handler picks its own draggable to ride; trust it only when the tree
      // would name that element too.
      const dragged = this.lichessTools.$(ev.target);
      if (dragged.length && this.pageLeaf(dragged)) this.pendingDrag.el = ev.target;
    }

    dragOverGlobal(ev) {
      if (!this.pendingDrag) return;
      this.pendingDrag.native = true;
      this.pendingDrag.moves += 1;
      this.showDropMark(this.rowAtPoint(ev?.clientX, ev?.clientY), ev);
    }

    // Chrome's own ride ends on the page - its drop never happens over our tree. The
    // commit is ours: landing from the pointer's point, source from the held element.
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

    // The release lands in the tree only after real travel - a press without movement is a
    // click, and a release outside the tree spends the gesture with nothing to do. The
    // source is named here, not at the press: the tree decides what the held element
    // means, and anything the table cannot name files nothing.
    dragRelease(ev) {
      const pending = this.pendingDrag;
      this.pendingDrag = undefined;
      if (ev.button) return;
      // The ride Chrome promoted had its `dragend` turn already; a carry still alive at
      // the release answers the mouse instead, and one event of travel is enough there.
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

    // Event-wrapped page elements answer cash's `prop` with nothing when the event came
    // from outside the wrapped page - the raw DOM attribute always answers. Read the DOM
    // first, cash's `prop` second, and an empty string when neither has it.
    domAttr(el, name) {
      const raw = el?.[0];
      const viaDom = raw?.getAttribute?.(name);
      if (viaDom != null && viaDom !== '') return String(viaDom);
      const viaCash = el?.length ? el.prop(name) : undefined;
      if (typeof viaCash == 'string') return viaCash;
      return '';
    }

    // A player leaf made from a user link: the link names it, and the power tip the page parks
    // next to it fills the meta - flag, flair, ratings, game count, joined. Whatever the tip
    // does not show stays absent rather than guessed.
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

    // Any item may sit inside any other item, so the tree holds a study over its chapters and
    // positions, a game over a puzzle, and folders over anything. Only the containment loop
    // refuses - a parent that already lives under the branch being moved, which would eat rows.
    // `canDrop` checks that loop before asking, so a folder is never the answer.
    canAttach(node, parent) {
      return !!node;
    }

    // The only outright rejection (a folder nested inside one of its own descendants) plus the
    // two containment checks above.
    // A leaf that sits under a leaf parent names that parent in meta: the blob of the child's own
    // branch cannot keep a parent that belongs to a different branch, so the name is what rebuilds
    // the nesting on the next page. A folder parent needs nothing - folders join by name in every
    // branch - and moving a leaf to a folder or to the root takes the stamp away.
    stampParent(node, parent) {
      if (!node || this.folder(node)) return;
      // A contained kind (a chapter, a study position, a blog post, a forum thread, a relay game)
      // already names its real parent, and that name is what rides its blob - a drag inside the tree
      // may sit it somewhere else for now, but it must not rewrite that name.
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
        // A page drag carries the leaf itself rather than a path, so the same two rules the path
        // drop applies have to hold here too: a leaf the tree already holds leaves the slot it
        // leaves, and a drop that names the slot it already occupies spends nothing. Without the
        // first one a filed leaf re-filed from a page link lands in the tree twice.
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
      // Every payload root re-names its new parent, so the next page's merge hangs it back.
      for (const entry of incoming) this.stampParent(entry, parent);
      // Opening the parent keeps the drop visible on the page that made it. For a folder that
      // means putting it in `expanded`; for a leaf-parent the default is already open, so the
      // only thing to do is clear any collapse the user left on it.
      if (parent) {
        if (this.folder(parent)) this.expanded.add(parent);
        else this.collapsed.delete(parent);
      }
      this.selected.clear();
      for (const entry of incoming) this.selected.add(entry);
      this.sortTree(this.entries);
      this.save();
      // The page only ever named the puzzle or the game - its board, its players and a team's real
      // name with flair are one read away, so the leaf grows its meta right after joining.
      for (const entry of incoming) {
        if (entry?.kind === 'puzzle') this.requestPuzzleRead(entry);
        if (entry?.kind === 'game') this.requestGameName(entry);
        if (entry?.kind === 'team') this.requestTeamName(entry);
        if (userPageKind(entry?.kind) || entry?.kind == 'blog') this.requestUserRead(entry);
      }
    }

    // One read per id fills the leaf's meta with the fen the hover board paints from, the
    // side to move stored straight as the orientation - the board is shown from the side
    // that moves, so the solver sits closest - and the puzzle's own last move. The answer
    // arrives async: a hover before it shows no board, and the merge repaints once it lands.
    // A read that does not answer stays uncaptured, so the next open asks again.
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

    // The game sibling: one read per id names the leaf from the players and parks the control
    // and variant for the row's icon. A read that does not answer stays uncaptured, so the
    // next open asks again; a hand-renamed row keeps its title because the rename cleared the
    // waiting marker.
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

    // A profile the tree holds but no page named (a dragged user link, a coach or a streamer route)
    // asks the api for its own facts: the title the site puts on the handle, the flair it wears,
    // the ratings it holds and the day it joined. The row paints the title and the flair; the
    // ratings and the join date answer the tooltip, while the **card** the site itself shows is
    // asked for as the row renders (see `powertip.manualUser`).
    // The blog of such a user asks the same read for its author - the page spells the author as
    // "CM HandKnit", a title before the handle - and takes only the two facts a blog can wear,
    // since a blog holds no ratings of its own.
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
        // The six controls the site lists first, in the order it lists them, and only the ones it
        // really has a rating for - unless the row is a blog, which wears no ratings of its own.
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



    // The blob the page carries: the `PageInitData` tool exposes it as the lazy `lt.pageInitData`
    // once the page has dropped the script, and a page that has not dropped it yet still holds it
    // in the DOM - either way no request. The DOM half is read once per page and kept for the
    // calls that page makes, so a repaint does not re-parse it.
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

    // Add is one flow - file the page object, harvest it so the new row is searchable, save once
    // - and it widens to "add whatever this page is". The page can name up to four rows at once:
    // the study, its current chapter, a bare FEN position, and a study position (chapter + node
    // path). The list is the dropdown's menu and `addChoice` is what Add actually files.
    resolvePageLeaves() {
      const lt = this.lichessTools;
      const out = [];
      const init = this.pageInitBlob();
      const initStudy = init?.study;
      // The blob nests the chapter the page shows inside the study it belongs to, so a top-level
      // `chapter` is the older spelling kept for pages that still spell it there.
      const initChapter = init?.chapter ?? initStudy?.chapter;
      const analysis = lt.lichess?.analysis;
      const analysisStudy = analysis?.study;
      const analysisPath = analysis?.path;
      const boardFen = analysis?.node?.fen;
      // A relay page analyses a study under the hood - `study.relay` is the flag that says
      // broadcast, not study - but the url is what names the page, so the relay pair owns
      // these leaves and the study shapes below must not lean on the relay analysis.
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
          // The study page names its own flair and owner; both ride in meta for the popup and
          // the flair image, and a blob that shows neither leaves the row undressed.
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
      // The chapter the analysis is on lives on `analysis.study`, not on `analysis` itself - the
      // pattern every other tool in the project reaches for (`analysis.study.currentChapter()`).
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
      // A chapter read off the URL names no label, so the mirror of the study the page is on
      // supplies the chapter's own name - an empty label would make the row print its parent.
      if (chapterId && !chapterLabel && studyId) {
        const own = (this.studies.get(studyId)?.chapters || []).find((chapter) => chapter?.id === chapterId);
        if (own?.name) chapterLabel = own.name;
      }
      if (chapterId && studyId)
        out.push({ kind: 'chapter', id: chapterId, label: chapterLabel, meta: { studyId, ...(chapterTrapped === true ? { playable: true } : {}) } });
      // A page that is not a study still names its own object, so Add on any page files what
      // the page is about: a profile page names the player (`@/Name` is the modern shape and
      // the quoted `/'Name'` the legacy one), a training page names the puzzle, a game page
      // names the game. The shapes are the registry's own openUrl forms.
      // The page's own object also comes from the url where the blob misses it: blogs live under
      // the author (`@/Name/blog` now, the quoted `/'Name/blog'` the same route), forum boards and
      // threads under `/forum`, and a coach, a streamer, a team and a tournament under their own
      // routes. `/team/me` is the list of the current user's teams, so it names no team - and a
      // profile shape never swallows the routes that hang off a user.
      const route = lt.location?.pathname || '';
      const blogPost = /^\/'([^']+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})'?$/.exec(route) || /^\/@\/([^/]+)\/blog\/([^/]+)\/([a-zA-Z0-9]{8})$/.exec(route);
      if (blogPost?.[3]) {
        // The post names itself on its own page: the heading is the title, the standfirst under it
        // is the subtitle, and the picture the post opened with is its image - the classes lila
        // names on those three, with the older block shapes kept as fallbacks.
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
        // A thread names itself with its subject on its own page - the route's slug is only a
        // truncated echo of it - and the first profile link under the posts is the writer the
        // page shows, which no slug carries.
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
        // A team page carries the name and the flair a route can only spell: the title block
        // (`div.box__top h1.text`, the flair img inside it) names the team and says how many members
        // it has. The name it spells is the item's own, so it clears the waiting `slug` marker.
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
        // The two routes spell the same item differently: an arena names its ladder `fullName` and
        // opens it at a `createdAt` epoch, a swiss names it `name`, opens it at an ISO `startsAt`
        // and says how it ended under `status`. Both spellings are read, and a page whose blob
        // names no ladder at all falls back to the title its own tab spells - the site's own words
        // are never a name.
        const tourneyTitle = this.pageTitle();
        const tourneyName = String(tourneyData?.fullName ?? '') ||
          String(tourneyData?.name ?? '') ||
          (tourneyTitle && !/lichess/i.test(tourneyTitle) ? tourneyTitle : '');
        // A swiss start is an ISO date, an arena start an epoch; either way the row prints the day
        // the ladder opened.
        const tourneyStarts = Number(tourneyData?.createdAt) > 0 ? Number(tourneyData.createdAt) :
          Date.parse(String(tourneyData?.startsAt ?? ''));
        // The standing the page showed is the ladder's own one-page window; keeping it as the page
        // spelled it (name, flair, rating) is what the tooltip reads back. A swiss hangs the three
        // under the player's own `user`, an arena spells them on the card.
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
            // The route says how the ladder runs; the blob says nothing about it.
            system: tournament[1] == 'swiss' ? 'swiss' : 'arena',
            ...(tourneyData?.perf?.key ? { perf: String(tourneyData.perf.key) } : {}),
            ...(tourneyData?.variant ? { variant: String(tourneyData.variant) } : {}),
            ...(tourneyData?.nbPlayers !== undefined ? { nbPlayers: Number(tourneyData.nbPlayers) } : {}),
            ...(Number.isFinite(tourneyStarts) && tourneyStarts > 0 ? { startsAt: tourneyStarts } : {}),
            // A ladder that has already finished has no start left to show - the row keeps only
            // its name and its mark. A swiss says so under `status`, an arena with a flag.
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
      // The hover board redraws the page's own view: the orientation it showed the board in and
      // the UCI of the move that reached the node ride `meta`, so a restored leaf highlights the
      // move its label already names. The path is an array of UCI moves, so its tail is that move.
      const boardOrientation = analysis?.getOrientation?.();
      const lastMove = Array.isArray(analysisPath) ? analysisPath[analysisPath.length - 1] : undefined;
      if (boardFen) {
        const variant = lt.lichess?.rulesType?.toLowerCase?.() || lt.lichess?.rules?.toLowerCase?.() || 'standard';
        const meta = { variant, orientation: boardOrientation };
        if (lastMove) meta.lastMove = lastMove;
        out.push({ kind: 'position', id: boardFen, label: boardFen, meta });
      }
      // A node path is not readable, so a study position files where it is: the chapter it lives
      // in and the move that reaches it, in lichess's own move label. `ply`/`san` ride in `meta` so
      // a leaf that loads from a blob with no label can still say it, and `nodePath` stays the
      // path the open jump needs.
      if (chapterId && studyId && analysisPath) {
        const node = analysis?.node;
        const where = [chapterLabel, this.moveText(node?.ply, node?.san)].filter((part) => part?.length).join(' | ');
        const meta = {
          studyId,
          chapterId,
          nodePath: analysisPath,
          // The chapter says how its own board is set, and that outranks the view this
          // import happened to watch - importing from a flipped board must not flip the leaf.
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
      // What the page is about also arrives in `pageInitData`, where the url does not name it:
      // a replay page names its game under `cfg` and a plain game page names it under `data`, the
      // players feeding the row's title and the speed and variant its icon; the training page
      // names its puzzle in `data.puzzle`, the themes giving the type name straight away - the
      // same wording the api read uses when it answers. These are data names, so they also
      // clear a waiting page-text marker on the rows they rename. A 12-char game url carries only
      // the full id, so the blob's own 8-char one is what keys the leaf.
      const pageGame = init?.mode == 'replay' ? init?.cfg?.data : (gameKey ? init?.data : undefined);
      // A relay page names its pair instead: the relay itself comes from the slug, and the
      // url reaching the underlying study (or the relay analysis saying which study is on)
      // names the game of this round. The route rides in `meta` so the open stays on the
      // broadcast page. A relay's rounds all name themselves "Round <n>", and every board of a
      // round is one game of that round, so the row wears the chapter the round's study plays -
      // usually the two players - while the relay and the round answer in the tooltip.
      if (broadcastMatch) {
        const roundSpelling = broadcastMatch[3] || (broadcastMatch[2] ? analysisStudy?.data?.id : undefined);
        // A round builds every board of one round from a single study, so the study alone cannot
        // key the rows - it would fold the boards into one. The board's own chapter keys its leaf
        // (the route names it, or the page is reading it when the route stops short), and the study
        // the route opens with rides under `roundId` so the open jump spells the round's address.
        // A round page that names no board at all - the relay's own model game - keeps the study.
        const pageBoard = broadcastMatch[4] ||
          (!broadcastMatch[3] && broadcastMatch[2] ? initChapter?.id : undefined);
        const boardKey = pageBoard || roundSpelling;
        // The chapter the page is reading is the board this page is about, so its name is the
        // row's; a page that names no board has no chapter name to spend on the row.
        const boardChapterName = pageBoard && pageBoard === initChapter?.id
          ? String(initChapter?.name ?? '')
          : '';
        const relayName = this.humaniseSlug(broadcastMatch[1]);
        // The relay's own title answers in words; the slug humanised is what the route spells when
        // the page shows no title of its own. The flag saying "this study is a relay" rides beside
        // the study data, and so does the relay's own name.
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
            // A board is one game of the round, and the study chapter it plays names it - usually
            // the two players. The relay's own name would repeat on every board of every round, so
            // it answers in the tooltip instead (see `popupFacts`).
            label: boardChapterName || relayWord || undefined,
            meta: {
              slug: broadcastMatch[1],
              round: broadcastMatch[2],
              ...(pageBoard && pageBoard !== roundSpelling
                ? { chapterId: pageBoard, roundId: roundSpelling }
                : {}),
              ...(boardChapterName ? { chapterName: boardChapterName } : {}),
              ...(relayWord && relayWord !== relayName ? { relay: relayWord } : {}),
              // The game this board plays rides in meta: the row's key is the chapter, so a visit to
              // that game page reaches the row through this (see `enrichFromPage`). A playable
              // chapter the page made up itself spells "synthetic", which is no game id.
              ...(gameKeyId(init?.data?.game?.id) ? { gameId: gameKeyId(init?.data?.game?.id) } : {}),
              // A named round reads as words in the popup; the route's own slug stays the relay.
              ...(broadcastMatch[2] ? { roundLabel: this.humaniseSlug(broadcastMatch[2]) } : {}),
              // The relay builds each game from an underlying study, and that study says when it
              // opened - the round's own date.
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
        // The control the page shows is the PGN's own spelling: initial plus increment, the way
        // the export writes the TimeControl tag; a clock with a missing half has nothing to spell.
        const clock = pageGame.game?.clock;
        const timeControl = clock?.initial !== undefined && clock?.increment !== undefined
          ? clock.initial + '+' + clock.increment
          : undefined;
        // The page names the ending in its own words; a bare status id says nothing to a row.
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
              // The position the game ended on rides along so the hover can paint the mini-board
              // the row's facts are read from: the blob spells it when the page does, and while the
              // game sits under the analysis, the view names the node the board stopped on.
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
      // One leaf per kind and id: the same object can be named by url and by page data alike,
      // and the later page-data leaf replaces the earlier url one, so Add offers each row once.
      const byShape = new Map();
      for (const leaf of out) byShape.set(leaf.kind + '|' + leaf.id, leaf);
      // A page whose route the table knows nothing about is still a page the user can file: the
      // url leaf is named by the page's own title, and the row follows that title on every visit.
      // A route the table deliberately calls nameless (a list of the user's own teams) stays nameless.
      if (!byShape.size) {
        const route = this.lichessRoute(lt.location?.pathname || '');
        const title = this.pageTitle();
        if (route && !/^\/team\/(me|all|leader)$/.test(route))
          byShape.set('url|' + route, {
            kind: 'url',
            id: route,
            // The row wears the title its own page gave - a route is not a name. A page that
            // spells no title leaves the route standing, and every visit re-titles the row.
            label: title || route,
            meta: { url: route, ...(title ? { title } : {}) },
            ...(title ? { dataName: true } : {}),
          });
      }
      return [...byShape.values()];
    }

    // The dropdown's menu: the kinds the page can name right now.
    pageAddKinds() {
      return this.resolvePageLeaves().map((leaf) => leaf.kind);
    }

    // The object the page itself is about, from its route: what Add files when the dropdown has
    // not picked another kind, so a blog page files the blog, a blog post page the post, a forum
    // board the board and a forum thread the thread. A page that names no route of its own (an
    // open study, an analysis board) answers undefined and the first candidate stands in.
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

    // The one writer every source goes through. A title is temporary until the user chose one: a
    // name the item answered for itself replaces a page text or a slug, and a hand rename outranks
    // every pass - only the data keys grow there. A source that names nothing about a row leaves
    // it alone, and meta merges key by key, so a key the source does not show stays as it was.
    hydrateLeaf(existing, incoming) {
      if (!existing || !incoming) return false;
      const renamed = existing.meta?.renamed !== undefined;
      let changed = false;
      if (incoming.label && incoming.label !== existing.label && !renamed) {
        existing.label = String(incoming.label);
        // A name the item answered for itself is no longer a title that waits.
        if (incoming.dataName === true && existing.meta) delete existing.meta.nameTemp;
        changed = true;
      }
      // A fact that spells as a list (a standings block, a ratings set) is worth keeping whole, so
      // it is worth writing only when its **content** differs - comparing objects by identity would
      // rewrite the same block on every visit and make each visit look like a change.
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

    // What a team element spells: its own text with the list marker (`<em>leader</em>`) taken off,
    // and the flair img it carries. The name and the flair a team page title or a list row shows.
    teamFacts(el) {
      const lt = this.lichessTools;
      // The clone is what gets read: the marker is taken off the copy, so the row's own text keeps
      // whatever the page put around it.
      const kept = lt.$(el).clone();
      const marks = kept.children('em');
      if (marks.length) marks.remove();
      const name = String(kept.text() ?? '').replace(/\s+/g, ' ').trim();
      const src = lt.$(el).find('img.uflair').attr('src');
      return { name, flair: src ? String(src) : '' };
    }

    // What the page says about teams, in the shapes that carry a name no url can guess: the page's
    // own title block (`div.box__top h1.text`, member count under it) and every list row
    // (`td.subject a.team-name` on the leader and all lists, `div.teams a` on a profile). Each row
    // is keyed by its route so it can be matched to a leaf the tree already holds; these are data
    // names, so they may clear a waiting marker.
    pageTeamRows() {
      const lt = this.lichessTools;
      const idOf = (href) => {
        const at = /^\/team\/([^\/?#]+)(?:\/.*)?/.exec(String(href || '').split('#')[0]);
        if (!at?.[1]) return undefined;
        const id = decodeURIComponent(at[1]);
        // `/team/me` is the list of the current user's teams, never a team called `me`.
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

    // What the page shows about a leaf the tree already holds rides into that leaf, so visits
    // enrich instead of merely re-offering: a study visit renames the row from the mirror, a
    // profile visit re-reads the panel fields, a training visit names the puzzle, a team page or a
    // teams list brings the name and the flair the url never carried. Only fields the page actually
    // names overwrite; anything it does not show stays as it was.
    enrichFromPage() {
      let changed = false;
      const pageLeaves = this.resolvePageLeaves();
      for (const leaf of pageLeaves)
        for (const held of this.leavesWith(leaf.kind, leaf.id))
          if (this.hydrateLeaf(held, leaf)) changed = true;
      // A relay board keys on the chapter it plays, so a visit to the game it plays finds it through
      // the game id its board page recorded. The facts that game shows are the board's own; the row
      // keeps the chapter name, since that is what tells the boards of a round apart.
      const gameLeaf = pageLeaves.find((leaf) => leaf.kind === 'game');
      if (gameLeaf?.id)
        for (const held of this.leavesCarrying('broadcastGame', 'gameId', gameLeaf.id))
          if (this.hydrateLeaf(held, { meta: gameLeaf.meta, dataName: true })) changed = true;
      // A list page names rows without offering them to Add: a team on the list that the tree holds
      // gets its real name and flair, and a row the tree does not hold is left out - browsing a
      // list of teams files nothing.
      for (const row of this.pageTeamRows())
        for (const held of this.leavesWith('team', row.id))
          if (this.hydrateLeaf(held, row)) changed = true;
      // A url row **is** a route, so the page it opens names it again on every visit: whatever the
      // page turns out to be, its title is the name the row wears and the fact the row keeps fresh.
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

    // A team leaf that arrives with no page to name it (a drag of a team link) asks the item for its
    // own facts: the team page carries the name, the flair and the member count, and the api read
    // answers the name and the count when the page does not. A read that answers nothing leaves the
    // leaf waiting, so a later visit or open asks again.
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

    // Every copy the tree holds for one kind and id. A filing of an item the tree already has,
    // landed under a **different** parent, leaves that item in more than one place (the same game
    // in two folders), so a pass that reads the item itself - a visit, a list row, an api read the
    // row asked for - answers each copy rather than the first one the walk happens to meet.
    leavesWith(kind, id, nodes = this.entries, found = []) {
      for (const node of nodes) {
        if (node.kind == kind && node.id === id) found.push(node);
        this.leavesWith(kind, id, node.children || [], found);
      }
      return found;
    }

    // A leaf can name another item inside its own meta - a relay board keys on the chapter it plays
    // and keeps the game it plays under `gameId` - so a page about that other item finds the leaf by
    // the meta it carries rather than by its key. Every copy answers, like every other read.
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

    // The dropdown's cycle: the kinds the page can name right now, in order. The caret walks the
    // list, so a page that lost its chapter next press loses that option and the cycle shrinks.
    cycleAddChoice() {
      const kinds = this.pageAddKinds();
      if (!kinds.length) return this.addChoice;
      const at = kinds.indexOf(this.addChoice);
      this.addChoice = at < 0 ? kinds[0] : kinds[(at + 1) % kinds.length];
      this.onChange();
      return this.addChoice;
    }

    // Add files the current choice. If the page no names it, the first kind that is available is
    // used rather than refusing, so a page that lost a chapter mid-gesture still files something.
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

    // The one flow: file the leaf, harvest it so the new row is searchable, save once. `addLeaf`
    // also moves the leaf when the tree already holds it, so a re-Add never duplicates.
    async addLeaf(leaf) {
      // `dataName` is a flag the page read carries to say the name came from the item's own data;
      // it is spent on the way in and never belongs to the tree.
      if (leaf) delete leaf.dataName;
      const selected = [...this.selected];
      let parent = selected.length === 1 ? selected[0] : undefined;
      // Refuse a self-parent before the move: putting the study the page names inside itself
      // would leave a cycle the tree walk could never come out of.
      const parentIsLeafSelf =
        parent && !this.folder(parent) && parent.kind == leaf.kind && parent.id === leaf.id;
      if (parentIsLeafSelf) {
        this.message = 'addSelfParent';
        return false;
      }
      // A contained kind names the item that carries it, so filing one while a **different** row
      // is selected lands it beside its carrier rather than inside that row: two boards of the
      // same relay then join as siblings of the relay, instead of one hiding under the other.
      const carriedBy = this.registry[leaf.kind]?.containment;
      const carrierKey = carriedBy ? containedCarrier[leaf.kind] : undefined;
      const carrierId = carrierKey ? leaf?.meta?.[carrierKey] : undefined;
      const carrier = carriedBy && carrierId ? this.findLeaf(carriedBy, carrierId) : undefined;
      if (carrier && parent && parent !== carrier && !this.folder(parent) && parent.kind !== carriedBy)
        parent = this.contains(leaf, carrier) ? undefined : carrier;
      // A filing that would seat an item inside its own branch would eat the rows under it, so a
      // copy of something the tree already holds may not hang under a parent that lives inside it.
      const existing = this.findLeaf(leaf.kind, leaf.id);
      if (existing && parent && this.contains(existing, parent)) {
        this.message = 'addSelfParent';
        return false;
      }
      this.pushUndo();
      // A leaf that names a leaf parent carries `parentId` so a split and merge re-hang it under
      // that parent on the next page - `stampParent` writes it for both the moved leaf and the new
      // one. A folder parent needs nothing: folders join by name in every branch.
      // An item the tree already holds moves when the filing lands among the siblings it has now -
      // a twin beside its own copy would say nothing - and when nothing was selected at all, which
      // names no new home. Filed under an **explicit** parent that is not its current one it joins
      // as a copy there and leaves the original in place: the same game can sit in two folders, and
      // every visit later dresses each copy the tree holds.
      if (existing &&
        (!parent || this.siblings(existing) === (parent?.children ?? this.entries))) {
        const siblings = this.siblings(existing);
        const at = siblings ? siblings.indexOf(existing) : -1;
        if (at >= 0) siblings.splice(at, 1);
        this.stampParent(existing, parent);
        // A leaf parent starts without a `children` array, so open one before the first push -
        // otherwise `parent?.children ?? this.entries` reads as the root and the leaf lands at
        // the top of the tree instead of under its parent.
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
      // Opening the parent keeps the new leaf visible on the page that filed it. For a folder
      // that means putting it in `expanded`; a leaf-parent is open by default, so the only
      // state worth clearing is a collapse the user left on it.
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
      // The save names the leaf in the tree first, only then is the read worth persisting - a
      // capture the tree does not name yet would be pruned straight away.
      this.save();
      if (captured) this.sync.persist(captured.id);
      this.message = leaf.kind == 'study' ? 'addedStudy' : 'addedItem';
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
      this.pushUndo();
      const folder = { name: named, children: [] };
      (parent?.children ?? this.entries).push(folder);
      // Opening the parent keeps the new folder visible; parent is always a folder here.
      if (parent) this.expanded.add(parent);
      this.selected.clear();
      this.selected.add(folder);
      this.sortTree(this.entries);
      this.save();
      return folder;
    }

    // One leaf drops that leaf; one folder drops the folder and its whole subtree. A **leaf that
    // owns children** (a study over its chapters, a game over a puzzle) is pruned into as well -
    // only `folder` tells a kind-less node apart, so walking folders alone would leave a selected
    // child sitting inside its leaf parent.
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

    // The snapshot records paths (index chains) rather than handles: restoring puts fresh
    // objects back, so the three Sets have to name the restored ones again. The entries copy
    // is JSON because a drop re-hangs and a rename rewrites nodes in place - a handle would
    // follow the edit and show the newer state, not the older one.
    pushUndo() {
      const chains = this.shapeChains(this.entries);
      this.undoStack.push({
        entries: JSON.parse(JSON.stringify(this.entries)),
        selected: [...this.selected].map((node) => chains.get(node)).filter(Boolean),
        expanded: [...this.expanded].map((node) => chains.get(node)).filter(Boolean),
        collapsed: [...this.collapsed].map((node) => chains.get(node)).filter(Boolean),
      });
      // A window that performed a hundred gestures does not keep a hundred trees.
      if (this.undoStack.length > 40) this.undoStack.shift();
    }

    // The walk back: the newest snapshot becomes the tree, and the Sets point at the restored
    // objects. Undo is not itself recorded - undoing an undo is another gesture, not a way
    // back; pressing Undo with an empty chain answers nothing.
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

    // The number handed to the confirm is every item the press takes away: a folder carries its
    // branch, and a leaf that owns children carries them too. A node inside another selected node
    // is counted once, with that node.
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

    // The gesture, the open chip and Enter all go through the row `openUrl`. Before it navigates,
    // a study leaf leaves the one-shot hand-off naming the study it will land on; `RecordsDbCtrl.handoff`
    // spends it. A kind that is not a study has no study to name, so it leaves nothing.
    async openLeaf(node) {
      const row = this.registry[node.kind];
      const href = row?.openUrl?.(node.id, node.meta);
      if (!href) return false;
      // Opening is a second chance at the data: a waiting name gets its read, and so does a
      // row whose board facts are still missing - a renamed game still wants control and
      // variant for its icon, a renamed puzzle still wants the fen for its hover board. The
      // awaits run before the page moves, so the merge lands where the tree is saved.
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
        // The honest degradation stays: same study switches chapter in place, another study
        // navigates. A study position rides to its chapter and then jumps the analysis to the
        // lichess node the leaf names.
        const navigation = recordsDbInstance?.navigation;
        if (!navigation) return false;
        const chapterId = node.kind == 'chapter' ? node.id : node.meta?.chapterId;
        await navigation.load(node.kind == 'study' ? node.id : node.meta?.studyId, chapterId);
        if (node.kind == 'studyPosition') {
          const analysis = lt.lichess?.analysis;
          const nodePath = node.meta?.nodePath;
          // The page is on the chapter now, not on the node the leaf names. The tree
          // resolves that path into a node, and the user jump walks the analysis
          // across to it. A path the tree does not know (chapter rewritten, tree
          // not yet rebuilt) leaves the chapter open at its root; the caller still
          // sees a successful open because the study moved.
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
              // The chapter is on the page but the move the leaf names is not in it any more: the
              // stamp is what the tooltip reads, so the row says where the landing differs from
              // what it promised instead of landing silently at the chapter root.
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


    // Rename is a chip, not an inline edit - the name comes from the same dialog prompt New
    // folder asks through, defaulted to the name the folder already carries, so an accepted
    // prompt is the only thing that changes and a mis-click cannot eat a name.
    editName(node, name) {
      if (!node) return false;
      const trimmed = String(name || '').trim();
      if (!trimmed) return false;
      this.pushUndo();
      if (this.folder(node)) node.name = trimmed;
      else node.label = trimmed;
      // A hand-written name is remembered, not just un-marked: `meta.renamed` outranks every
      // hydration pass, so a later read can only grow the row's data - the chosen title stands.
      if (!this.folder(node)) {
        node.meta = { ...(node.meta ?? {}), renamed: Date.now() };
        // A renamed title waits for nothing, and `renamed` is what keeps it through hydration.
        delete node.meta.nameTemp;
      }
      this.sortTree(this.entries);
      this.save();
      return true;
    }

    // Rename any item. A folder renames its `name`; a leaf renames its `label` and the next paint
    // reads its name back from the mirror record. With no dialog to ask, the current name is kept.
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
    // Only the mark rides on the content box: the row already wears its own tab stop, so a keyboard
    // walk still steps row to row instead of stopping twice inside each one.
    return { items, title, attrs: { 'data-popup': popupId } };
  }

  // Every node under an element, itself included: the hover checks a content box as one target, so
  // a pointer over the name, a flair or a date counts as the item it sits on.
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
    // The tooltip is a reading surface, not a decoration - while the pointer sits inside it the
    // tooltip stays up, so a pointer can cross from the row into the reading without losing it,
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
    // tall as the gap under a low row is a scrollbar over three lines. A reading that carries a
    // board needs the square plus the lines under it, so its floor is raised to fit the square and
    // the row can sit near the page bottom without cutting the board in half.
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
        // The slot a hover board parks in: the item holds the square, and `hoverShow` pins the
        // container over it, so the reading and the board come up as one box.
        item.attr('class', 'popup-board');
      } else if (data.name != null) item.text(String(data.name));
      // One line of a list can be dimmed - the entry a chapter row stands on inside the list of
      // its study's chapters.
      if (data.dim) item.addClass('popup-dim');
      // A fact may wear a picture the item itself named: `flair` is the small mark a standings
      // card shows beside a rating, `image` the picture an item opened with.
      const flair = data.flair ? lt.$('<img class="popup-flair">').attr('src', String(data.flair)) : undefined;
      if (flair) item.append(flair);
      const picture = data.image ? lt.$('<img class="popup-image">').attr('src', String(data.image)) : undefined;
      if (picture) item.append(picture);
      list.append(item);
    }
    popup.append(list);
  }

  // A tooltip does not hide on the first `mouseout`: the pointer crossing from a row into the
  // tooltip fires the row's `mouseout` and the tooltip's own `mouseover` in the same gesture, and
  // a hide that lands between them is what buries the reading before the pointer can reach it.
  // Either side schedules a hide instead, and a `mouseover` on either side spends it. The window
  // left is one pointer move, never a readable one.
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



  // The facts a row prints on one line: what the page named, joined where it named something.
  function factLine(parts) {
    const kept = (parts ?? []).filter((part) => typeof part == 'string' && part.length);
    return kept.length ? kept.join(' \u2022 ') : undefined;
  }



  // A stored epoch prints in the page's own language, the same reading a visit card gives a date;
  // a zero or a junk epoch has nothing to print.
  function localTime(lt, value) {
    const ms = Number(value);
    if (!Number.isFinite(ms) || ms <= 0) return undefined;
    return new Date(ms).toLocaleString(lt.intl?.lang);
  }



  // A page parks the flair value its own data named, and the image url comes from
  // `lt.lichess.asset.flairSrc(flair)` of that value; a drag may have parked the url the page
  // already spelled, and a lone private-use glyph is the mark a card rendered, not an image.
  function flairImage(lt, value) {
    const code = String(value ?? '');
    if (!code || /^[\uE000-\uF8FF]$/.test(code)) return undefined;
    if (code.startsWith('/') || /^https?:/i.test(code)) return code;
    return lt.lichess?.asset?.flairSrc?.(code);
  }

  // The kinds whose page is a profile: a player, and the same page behind the coach and the
  // streamer route. The row of such a leaf wears its own mark but dresses and answers like the
  // profile did - the power tip the page shows over a user link is the card the row asks for.
  const userPageKind = (kind) => kind == 'player' || kind == 'coach' || kind == 'streamer';
  // A profile row (or the blog of one) that carries none of the facts its page shows is still
  // waiting: the one api read brings the title the site puts on the handle, the flair it wears,
  // the ratings it holds and the day it joined. Both the hover and the open spend that read.
  const profilePending = (entry) => {
    if (userPageKind(entry?.kind))
      return !(entry?.meta?.title || entry?.meta?.flair || entry?.meta?.ratings);
    if (entry?.kind == 'blog') return !(entry?.meta?.title || entry?.meta?.flair);
    return false;
  };

  // A stored epoch prints the day alone in the page's own language: a row has room for the day
  // a ladder opens on, not for the hour it opens at.
  function localDate(lt, value) {
    const ms = Number(value);
    if (!Number.isFinite(ms) || ms <= 0) return undefined;
    return new Date(ms).toLocaleDateString(lt.intl?.lang);
  }

  // A ladder wears the mark the site gives its run: the perf key the blob spells names the same
  // icon the game rows wear for a control, and a run the map has no mark for dresses nothing.
  function perfIcon(lt, key) {
    const name = speedIcons[String(key ?? '').toLowerCase()];
    return name && lt.icon[name] !== undefined ? lt.icon[name] : undefined;
  }

  // Whether the mirror's record says a chapter is one the reader plays inside: the flag the study
  // page names, kept as the blob spelled it. A record with no chapters, or a chapter it never
  // names, answers false - the row then wears nothing rather than a guessed mark.
  function interactiveChapter(entry, record) {
    const own = (record?.chapters || []).find((chapter) => chapter?.id === entry?.id);
    return own ? own.isTrapped === true || own.trapped === true : false;
  }

  // A named round reads as words in meta ("round 2" humanised), but a popup line already carries
  // the label, so only the number the round wears is worth printing. A round named by anything
  // else keeps its own words.
  function roundWords(label) {
    const text = String(label ?? '').trim();
    if (!text.length) return undefined;
    const bare = text.replace(/^round\s+(?=\S)/i, '');
    return bare.length ? bare : text;
  }

  // The chapter list a study or a chapter answers with: one line per chapter the record names,
  // in the order the study holds them. A chapter row dims its own entry so the reading says
  // where the row stands inside the list.
  function chapterLines(chapters, currentId) {
    const lines = [];
    for (const chapter of chapters ?? []) {
      const name = String(chapter?.name ?? '').trim();
      if (!name.length) continue;
      lines.push({ name, ...(currentId !== undefined && chapter?.id === currentId ? { dim: true } : {}) });
    }
    return lines;
  }

  // The facts a tooltip answers with are the item's own: every line says something about this
  // leaf - never the branch it sits in, never its siblings, never the item that holds it. The row's
  // own name is the popup's title, so a line repeats nothing the row already prints, and a kind
  // that knows nothing about itself gets no tooltip at all - its mark and its open jump carry it.
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
        // The row's one-line read of a game: control, rated, speed, variant (only when the game
        // is variant chess) and the ending, then the day it was played on its own line. The
        // board the game left behind rides the hover, not the tooltip - a dialog can never wear
        // the page's board sheet.
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
        // A board is one game of a relay round: the tooltip says the relay it belongs to, the
        // round it played in, and the chapter it plays. The relay and the chapter are bare lines -
        // they name things, they are not a fact with a label - and the row prints the chapter in a
        // row that can cut it, so the reading repeats it in full.
        const relayTitle = String(meta.relay ?? '') || (meta.slug ? content.humaniseSlug(meta.slug) : '');
        if (relayTitle.length) facts.push({ name: relayTitle });
        line('popupRound', roundWords(meta.roundLabel));
        const chapterName = String(meta.chapterName ?? '') || labelText;
        if (chapterName.length) facts.push({ name: chapterName });
        line('popupPlayed', localTime(lt, meta.playedAt));
        break;
      }
      case 'tournament':
        // The route says how the ladder runs, and the name of the run is the one thing a row
        // cannot show beside its own title.
        if (String(meta.system ?? '').toLowerCase() == 'swiss') facts.push({ name: say('kindTournamentSwiss') });
        else if (String(meta.system ?? '').toLowerCase() == 'arena') facts.push({ name: say('kindTournamentArena') });
        // The standings the page showed is the ladder's own fact: one line per player it names,
        // wearing the flair that page showed beside the rating. A ladder whose page showed none
        // prints no empty block.
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
        // The post names itself on its own page: the standfirst under its heading, the author whose
        // blog it sits in, and the picture it opened with are the post's own facts.
        if (meta.subtitle?.length) facts.push({ name: String(meta.subtitle) });
        if (meta.userId?.length) line('popupAuthor', meta.userId);
        if (meta.image?.length) facts.push({ image: String(meta.image) });
        break;
      case 'forumPost':
        // A thread page shows the writer beside the subject; the subject is the row's own name.
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
        // The page blob names the owner and the mirror carries the same fact; the line reads
        // `by <handle>` under the title rather than labelling a row the row never prints. The
        // chapters the study holds answer as a list - the row wears only their number.
        const studyOwner = String(record?.ownerId ?? meta.ownerId ?? '');
        if (studyOwner.length) facts.push({ name: trans.format(say('bySomeone'), [studyOwner]) });
        if (record?.chapters?.length) {
          facts.push({ header: say('popupChapters') });
          facts.push(...chapterLines(record.chapters));
        }
        break;
      case 'chapter':
        // A chapter answers with the study it belongs to and the list that study shows, with its
        // own entry dimmed so the reading says where the row stands in the list.
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
        // A position spells its study only as an id, so the study's own title is the one readable
        // fact it carries - it rides above the hover board. The chapter it was reached in leaving
        // the record, or an open proving the node it names is gone, is what makes the landing
        // differ from the row.
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
    // A row that has a board to show opens its reading with the square that board parks in, so
    // the words and the board come up as one tooltip instead of a box over the row and a box of
    // words under it.
    if (boardStateFor(entry)) facts.unshift({ board: true });
    // A post names itself on its own page, so the heading outranks the slug the row fell back to;
    // every other kind keeps the name its row already answers with.
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





  // A drop marker is a claim one row makes for the moment it is dragged over; only one row may hold
  // it, so every marker on the page is cleared before a new one is set.
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

    // The local db feeds the mirror off the critical path - the member blob first, then the captures
    // the tree filed - so a row can be painted before the study it names has a record. The view
    // rebuilds on every publish, and this is what makes that rebuild answer the mirror it now sees
    // rather than the cache the first paint left behind.
    if (content.hayRevision !== content.sync.publishRevision) content.refreshCaches();

    // The page locks its own links (`draggable="false"`) - a relay's game list among them - and
    // Chrome answers such an element with its no-drop cursor and fires no drag event at all, so
    // the tree never hears a gesture meant for one. Boot takes the lock back once, but a relay
    // drops its boards onto the page after that pass (and re-drops them as its rounds arrive), so
    // every paint takes the flag back for the links this table can name. Only links still locked
    // are touched, so a page that carries none costs a walk of its anchors and nothing more.
    content.armPageDrag();

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

    // Add is one press; it files `addChoice`. The caret next to it opens a menu of the kinds
    // the page can name; clicking a menu chip files that kind and closes the menu. A caret
    // press while the menu is open closes it without filing anything.
    const addButton = rackButton('btn-add', 'recordsDbAdd');
    addButton.on('click', async (ev) => {
      content.addMenuOpen = false;
      await content.addCurrentChoice();
      await content.onChange();
    });
    // Add hides while Select is on, and when the page has nothing to file.
    if (!content.canAdd()) addButton.attr('hidden', '');
    actionsRack.append(addButton);
    const addKinds = content.pageAddKinds();
    if (addKinds.length > 1) {
      // The caret and its dropdown share a `position: relative` wrapper so the menu box
      // hangs under the caret and reads as one control, not as a widening rack. Opening the
      // menu is a paint of one container; closing it takes that container off the page.
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
    // The first press of the fallback arms the bar, so the chip stays live while a bar is armed.
    if (!content.selected.size && !content.confirmBar) deleteButton.attr('disabled', 'disabled');
    deleteButton.on('click', async (ev) => {
      await content.deleteSelected();
    });
    actionsRack.append(deleteButton);

    const newFolderButton = rackButton('btn-newfolder', 'recordsDbNewFolder');
    if (lt.icon.NewFolder !== undefined) newFolderButton.attr('data-icon', lt.icon.NewFolder);
    // The name is asked by `createFolder` through the page's dialog prompt.
    newFolderButton.on('click', async (ev) => {
      await content.createFolder();
    });
    actionsRack.append(newFolderButton);

    // Rename sits beside New folder and is live only when exactly one item - folder or leaf - is
    // selected, so the gesture cannot guess which item the user meant.
    const selectedItems = [...content.selected];
    const renameButton = rackButton('btn-rename', 'recordsDbRename');
    if (selectedItems.length === 1)
      renameButton.on('click', async (ev) => {
        await content.renameFolder(selectedItems[0]);
      });
    else renameButton.attr('disabled', 'disabled');
    actionsRack.append(renameButton);

    // One chip folds or unfolds every openable row at once - folder or leaf-parent - so a deep
    // tree is one gesture instead of one caret each. It says which way it is going, the same
    // reading the caret on a row carries.
    const foldTargets = content.parentNodes();
    const foldAll = foldTargets.length > 0 && foldTargets.every((parent) => content.folder(parent)
      ? content.expanded.has(parent)
      : !content.collapsed.has(parent));
    const foldKey = foldAll ? 'recordsDbCollapseAll' : 'recordsDbExpandAll';
    const foldButton = rackButton('btn-fold', foldKey);
    if (foldTargets.length) foldButton.on('click', (ev) => content.toggleAllExpanded());
    else foldButton.attr('disabled', 'disabled');
    actionsRack.append(foldButton);

    // Undo walks the window's gestures back, newest first; the chip lives while anything the
    // window recorded is left to undo.
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
      // A leaf wears red only when a read proved it gone; an unknown kind stays fail-soft gone.
      const dead = !folder && content.isGone(entry);
      const labelText = folder
        ? String(entry.name ?? '')
        : content.leafLabel(entry) || String(entry.label ?? '');
      // Any node with a `children` array carries the expand/collapse caret, folder or leaf. Folders
      // are open when in `expanded`; leaf-parents are open when NOT in `collapsed`.
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
      // A folder is never dropped - it stays and goes dim when nothing in it is shown.
      if (folder && shown === 0) li.addClass('folder-empty');
      if (openable) li.attr('data-expanded', String(open));
      // The node this paint put on the page, keyed for the tree host's one listener per event. The
      // chips a row wears copy this answer with a chip marker, so a click on a caret or an open
      // link stays the row's own rather than a handler the row would have to carry.
      const indexed = { row, entry, folder, dead, node: li[0], preview: false, cold: false, profile: false };
      content.rowIndex.set(li[0], indexed);

      // Select grows a plain `<input type="checkbox">` - a native control costs no markup budget
      // and takes no extra row width, which is what the styled `form-check` span did badly. Its
      // `change` feeds the same `select` the row click uses, so the selection keeps exactly one
      // owner.
      if (content.selectMode) {
        const check = $('<input class="tree-select" type="checkbox">');
        if (selected) check.attr('checked', '');
        // A box belongs to the set: toggling joins or leaves without erasing the other rows,
        // the additive path a ctrl-click takes - a bare select would replace the whole set.
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
      // A leaf wears the page's own mark - the study's flair when the mirror has one, else the
      // kind icon - so a mixed tree reads at a glance without a second label. A containment kind
      // keeps its own mark: its record is the parent study's, so a filed chapter or study
      // position would otherwise dress up as the study it sits under.
      const parentFlair = entry?.kind == 'chapter' || entry?.kind == 'studyPosition' ? undefined : record?.flair;
      if (!folder) {
        // A player has no page record to wear a flair from, so it wears the site's own User
        // mark and its row is never bare. A game answers from its own data instead: control or
        // variant icon, Crown when the leaf knows neither.
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
      // A row whose page is a profile wears the site's own hook for the profile card: `data-href`
      // names the handle in the form the page spells on a user link (`@/<handle>`, the same route
      // the row opens), and the paint hands this box to `powertip.manualUser` once the row is on
      // the page, so the card it paints is the card the page paints - pinned to this box, the item,
      // and never waiting on a pointer.
      if (userPageKind(entry?.kind)) box.attr('data-href', '/@/' + entry.id);
      const nameBox = $('<span class="bookmark-name">');
      const jumpHref = folder || dead ? undefined : row0?.openUrl?.(entry.id, entry.meta);
      nameBox.text(labelText);
      // The value parked in meta is what the page had: the blob's own flair key, or the url the
      // page's `img.uflair` already gave. The image url is `lt.lichess.asset.flairSrc(flair)` of
      // that value, so a key spells through the site's asset map and a url rides through whole.
      const ownFlair = flairImage(lt, entry?.meta?.flair);
      // A profile row, a team row and the blog of an author keep the title the site puts on the
      // handle, and the page spells that title **before** the handle - an author reads as "CM
      // HandKnit". The span rides on the box, ahead of the name it belongs to.
      const titleMark =
        userPageKind(entry?.kind) || entry?.kind == 'team' || entry?.kind == 'blog' ? entry?.meta?.title : undefined;
      const titleSpan = titleMark ? $('<span class="bookmark-title">').text(String(titleMark)) : undefined;
      if (userPageKind(entry?.kind) || entry?.kind == 'team') {
        if (ownFlair !== undefined) nameBox.append($('<img class="record-flair">').attr('src', ownFlair));
      }
      // Any other kind that named a flair on its page prints it the same way: a study, a blog
      // post, a thread or a board carries the image in meta, and a row the mirror already dressed
      // from its own record keeps that mark rather than wearing the flair twice.
      else if (ownFlair !== undefined && !parentFlair)
        nameBox.append($('<img class="record-flair">').attr('src', ownFlair));
      // An interactive chapter - a lesson the reader plays inside the chapter - wears the site's
      // own Eye after its name. Only a page blob or a mirror record that names the flag says so;
      // a chapter nothing names wears nothing.
      if (entry?.kind == 'chapter' && (entry?.meta?.playable === true || interactiveChapter(entry, record))) {
        const eye = lt.icon.Eye;
        if (eye !== undefined) nameBox.append($('<span class="record-playable">').attr('data-icon', eye));
      }
      // A ladder dresses beside its name: the mark the site gives its run - the control's own icon,
      // or the variant's when the control map has none - and the day it opens, separated from that
      // mark by a dash. A ladder that already finished has no start left to print.
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
      // A position row wears no marker: lichess styles a board and its pieces from a sheet
      // scoped under the page's `main`, and no rule in it can cross into a dialog - a
      // chessground inside the window could never wear it. The hover board hangs off
      // `main` itself and floats over the row instead, on `hoverShow`.
      // The reading belongs to the **item**, not to the row: `data-popup` rides on the content box
      // and the hover checks that box with everything under it, so the words stay up over the name,
      // a flair or a date, and never answer over a row's padding or one of its chips.
      // A study position answers with the record of the study its own meta names: the row cache keys
      // a record by row id, and a position id spells the chapter and the path, never the study - so
      // without that lookup the one fact a position owns would never be checked.
      const popupRecord = entry?.kind == 'studyPosition' ? content.studyRecordFor(entry) : record;
      const ownCount = popupRecord?.chapterCount ?? popupRecord?.chapters?.length;
      // The chapter count belongs to the study row alone: a chapter or a position row wears its own
      // name, and a count on it would read as if the row itself held chapters.
      if (ownCount && entry?.kind != 'chapter' && entry?.kind != 'studyPosition')
        li.append($('<span class="record-chapter-count">').text(String(ownCount)));
      if (!folder && !dead && entry.kind == 'study' && !ownCount) {
        // The mirror has never seen this row, so hover spends the read that fills the picture in;
        // the facts that read brings back answers on this row and on every later page.
        indexed.cold = true;
      } else if (!folder && !dead) {
        // The tooltip answers from the item alone: its own facts, nothing about the branch it sits
        // in and nothing about its siblings. Nothing is asked of the page, so the hover costs no
        // request - and a row that knows nothing about itself carries no tooltip at all.
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

      // A profile row that carries none of the facts its page shows spends the same read `openLeaf`
      // takes, so a resting pointer grows the title and the flair onto the row - the read saves and
      // repaints, and a row that has them already spends nothing.
      if (!folder && !dead && profilePending(entry)) indexed.profile = true;

      // Row-end actions ride one container grown the first time a row wears one, so a row with
      // none carries no empty box. It trails the item box and the marks the row wears, claims
      // whatever width the row has left over and justifies its children to the inline end, which
      // leaves every action over its own box only: the strip beside it answers as the row, the
      // way the row's padding always did. The container is not a chip, so a press on it climbs to
      // the row through rowTarget, and it wears no tabindex, so the row keeps its one tab stop.
      let actions;
      const actionsOf = () => {
        if (!actions) {
          actions = $('<div class="record-actions">');
          li.append(actions);
        }
        return actions;
      };

      // The row's own jump affordance sits at its right end as a link icon, labelled with the plain
      // word "Open" (`recordsDbOpenButton`) so no kind is misnamed by it. Enter and double click
      // keep the keyboard path into openLeaf.
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
    const tree = $('<ul class="records">');
    if (treePaint !== content.revision) hideStudyPopup();
    treePaint = content.revision;
    for (const row of content.results) {
      const rowEl = rowOf(row);
      tree.append(rowEl);
      // A profile row asks the site for its own user card the moment its row is on the page: the
      // box carries the `data-href` the card reads, so a painted profile row wears its card right
      // away, and every repaint hands it the title and flair a read grew onto the row. The card
      // never waits for a pointer, and a kind whose page is not a profile asks for nothing.
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
        content.message == 'removedCount' && content.messageCount !== undefined
          ? trans.pluralSame('recordsDb' + camel(content.message), content.messageCount)
          : trans.noarg('recordsDb' + camel(content.message)),
      );
      host.append(note);
    }
    host.append(backupRack);
    return host;
  }

  // The window geometry: min width and the clamp ---------------------------------------------------
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

  // The box the window may sit in: the viewport, with the site header taken off its top. The
  // sheet anchors the window to the viewport, so these are the numbers a box write takes.
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






  // What the user left, kept by the screen corner it was nearest to: the two gaps to that corner
  // are what the page remembers, so a page whose viewport has since changed size puts the window
  // back the same distance from the corner the user was working to rather than at absolute
  // coordinates of a screen that is no longer there. The corner is named by its edge first: `br`
  // is bottom right, and `dx` is the gap to the left or right edge, `dy` the gap to top or bottom.
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

  // The remembered box put back where its anchor says it is on this page. A row an older version
  // wrote carries no anchor and is taken where it was written.
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

  // Whether a page can hold the window at its own minimum at all. Below this there is nothing of
  // the user's size to put back, and the page's own placement is the honest answer.
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
    // The corner the box was nearest to is written alongside it, which is what lets a page whose
    // viewport has since changed size put the window back at the same gaps from that corner.
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
      this.scrollerSelectors = ['.content-frame', '.body', 'ul.records'];
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
      // The window is resizable through the dialog factory's own machine: the viewport it sits in,
      // its minimum and where the size is remembered are this window's decisions, so they go over as
      // the machine's policy - `begin` lifts the window forward for the gesture, `resize` gets the box
      // the grabbed edge proposes and answers with the box that lands on the page.
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
          // A drag moves the window - it never resizes it. The box the drag left is taken by its
          // centre, so the size the window keeps is the size that stays on the page, and a
          // measured border box never feeds back into the written content box.
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



    // The hosts the window keeps for its whole life: `div.inner-content` sits under the page's own
    // scroll host and `div.content-frame` under it is the scroll host. The gesture listeners and the
    // resize strips belong to the dialog the factory built, so a paint never carries them.
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
      // The centre plus the size, written the way the dialog factory writes a box (`left`/`top` name
      // the centre, the opposite edges go to `unset`, the page's min/max go to their initial values) -
      // tools that re-apply a placement write the same way, and a priority write or a lone edge would
      // hold against their `unset` and leave the dialog over constrained. The sheet anchors the
      // window to the viewport, so the viewport numbers the geometry is kept in are the numbers the
      // write takes, and the page may scroll on underneath a held window.
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

    // The size policy the dialog machine hands over for an edge grab: the grabbed edge moves, the
    // window keeps its minimum and stays inside the page, and the size the user left is remembered
    // on the blob so a reload restores it. The box the machine grew to the content's floor comes in
    // as the window's own minimum, so the remembered size is the size that lands on the page.
    resizeTo(proposed, edge, dx, dy, base) {
      if (this.closed || !this.frame) return proposed;
      const viewport = windowViewport(this.ctrl.owner.lichessTools);
      const wanted = { width: proposed.width, height: proposed.height };
      const rect = fitWindow(moveWindow(base, dx, dy, edge, viewport, wanted), viewport);
      this.ctrl.setGeometry(rect);
      return rect;
    }

    // Escape closes the window. The dialog itself is kept from the Escape by `noEscClose`, so this
    // is the window's own decision, and the memo keeps one key press to one action.
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
      // The page has one content, and it holds the one window the toggle opens.
      this.content = new BookmarkTabContent(lichessTools, store);
      this.window;
      this.toggleButton;
    }

    clearSelection() {
      this.content.clearSelection();
    }

    // A phone is not excluded: the store captured the study there too, and the window answers a
    // touch layout (one column, a thumb-high header, tap-wide strips). What has to hold is a user,
    // the database, and a route the db speaks for - no study has to be open behind the page. The
    // frame is a dialog the factory hangs off the viewport, and `initialGeometry` answers a page
    // that lost its panels with an honest box, so a press on a game, a replay or a training page
    // lifts the same tree the study page shows.
    canOpen() {
      return this.canPlace();
    }

    // The page test both halves answer to: the db speaks for this route and a user is behind the
    // page. The button and the window keep separate names because they act separately - the
    // toggle is placed on every page this passes, the window opens there only on a trip or a
    // return - but the page rule they need is this one.
    canPlace() {
      const lt = this.lichessTools;
      return !!this.store
        && !!lt.getUserId()
        && this.store.isRecordsDbAvailable(lt.location.pathname);
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
      // The user left the window open, so the next page has to lift it again: a back button, a tab
      // switch or a reload never calls the tool, and only a manual close takes the flag away.
      await this.setStayOpen(true);
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

    // Whether the user left the window open. The window lives in one page's dom, so a page load
    // reads this key to decide again, and a page that cannot place the window leaves the key alone -
    // walking through a route the db never speaks for does not close the window for the user.
    async stayOpen() {
      const lt = this.lichessTools;
      return (await lt.storage.get(windowOpenKey, { session: true })) === true;
    }

    // Writing the flag: on when the window was lifted, away when a manual close said otherwise. An
    // `undefined` value is what the storage api takes as a removal.
    async setStayOpen(on) {
      const lt = this.lichessTools;
      await lt.storage.set(windowOpenKey, on === true ? true : undefined, { session: true });
    }

    // A page being left is not a user closing the window: the frame goes off this page's dom and the
    // flag that keeps the window coming back stays untouched.
    async teardown() {
      if (!this.window) return;
      await this.save();
      this.window.dispose();
      this.content.destroy();
      this.window = undefined;
      this.stopLeave();
    }

    // A manual close - the toggle press, the dialog's own close - is the user's decision, so it
    // takes the flag away and the next page keeps its window short.
    async close() {
      await this.setStayOpen(false);
      await this.teardown();
    }

    async toggle() {
      if (this.window?.windowFrame) await this.close();
      else await this.open();
    }

    // The fail-soft rule for the geometry blob: every number finite and positive, and a row
    // naming a kind this tool no longer renders is ignored - a blob an older version wrote with
    // four tabs then simply loads the default box rather than throwing on page load. The remembered
    // box is put back at the corner gaps it was saved with, so a page whose viewport has changed
    // size keeps the window the same distance from the corner the user had put it against; only a
    // page that cannot hold the window at its own minimum at all falls back to the page's own
    // placement, and a box that no longer fits is clamped back in by `fitWindow`.
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
      // `records-db-button` is the button's own hook: the toggle is the only affordance the tool
      // adds to the page's sidebar, so it spells itself rather than leaning on the site's `link`.
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




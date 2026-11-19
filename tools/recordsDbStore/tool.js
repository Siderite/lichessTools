(() => {

  // Tunables the product owns - not preferences, so they are edited here.
  const recordsDbHistoryLimit = 500;
  const recordsDbHarvestPageDelayMs = 300;

  class RecordsDbStoreTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['FixAbortController', 'PageInitData'];

    preferences = [
      {
        name: 'recordsDbHarvest',
        category: 'filesystem',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      },
      {
        name: 'recordsDbCapture',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.recordsDbHarvest': 'Records database',
        'options.recordsDbCapture': 'Automatically harvest records from opened items'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.recordsDbHarvest': 'Baz\u0103 \u00eenregistr\u0103ri',
        'options.recordsDbCapture': 'Colecteaz\u0103 date automat din articole deschise'
      }
    };

    async init() {
      const lt = this.lichessTools;
      if (lt.recordsDbHarvest) return;
      lt.recordsDbHarvest = new RecordsDbStore(lt);
      await lt.recordsDbHarvest.syncCtrl.attachEvents();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('recordsDbHarvest');
      this.logOption('Records database', value !== false && lt.storage.supportsDb);
      if (value === false || !lt.storage.supportsDb) return;
      const store = lt.recordsDbHarvest;
      if (!store) return;
      if (!lt.getUserId()) {
        this.logOption('Records database', 'not logged in');
        return;
      }
      // One switch covers both capture routes: the page's study and the study lists.
      if (lt.currentOptions.getValue('recordsDbCapture')) {
        const updated = await store.harvester.captureFromLivePage();
        if (updated) {
          store.syncCtrl.studyUpdated(updated);
          this.logOption('Captured record', updated.study?.studyId);
        }
      } else {
        this.logOption('Records capture', 'off');
      }
      // Off the critical path; the crawl runs only while the db holds no study.
      (async () => {
        try {
          await store.syncCtrl.load();
          if (lt.currentOptions.getValue('recordsDbCapture') && !store.syncCtrl.studies.size) {
            await store.syncCtrl.harvest();
          }
        } catch (e) {
          lt.global.console.debug('recordsDbHarvest load/harvest stopped:', e);
        }
      })();
    }

  }

  // Metadata merge: the cached record and a fresh capture -----------------------------------------


  function mergeStudyMetadata(cached, incoming) {
    return {
      ...cached || {},
      ...incoming,
      // The revision is ours, not the incoming payload's: a capture never invents a newer one.
      metadataRevision: cached?.metadataRevision,
      chapters: mergeChapters(cached, incoming),
    };
  }

  function mergeChapters(cached, incoming) {
    if (!incoming.chapters) return cached?.chapters;
    const cachedChapters = cached?.chapters || [];
    const match = (left, right) =>
      (left.id && right.id && left.id === right.id) || (left.name && right.name && left.name === right.name);
    const takenIncoming = incoming.chapters.map(() => false);
    const coverageComplete = !incoming.partialCoverage?.chapters;
    const merged = [];
    for (const existing of cachedChapters) {
      const index = incoming.chapters.findIndex((chapter, i) => !takenIncoming[i] && match(existing, chapter));
      if (index >= 0) {
        takenIncoming[index] = true;
        merged.push({ ...existing, ...incoming.chapters[index] });
      } else if (!coverageComplete) {
        merged.push(existing);
      }
    }
    for (let i = 0; i < incoming.chapters.length; i++) {
      if (!takenIncoming[i]) merged.push(incoming.chapters[i]);
    }
    return merged;
  }

  function matchesMetadata(value, query) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object')
      return Object.entries(value).some(([key, entry]) =>
        key === 'tags' && Array.isArray(entry)
          ? entry.some(([, tagValue]) => matchesMetadata(tagValue, query))
          : matchesMetadata(entry, query),
      );
    return String(value).toLowerCase().includes(query);
  }

  function isRecordsDbAvailable(pathname) {
    return !/^\/(?:practice|learn)(?:\/|$)/.test(pathname);
  }

  // A visit moves only for the chapter the leaf holds, and only when something changes.
  function visitMoves(visit, position, path) {
    return !!visit && visit.chapterId == position?.chapterId &&
      (visit.path !== path || visit.orientation !== position.orientation);
  }

  // One fold for every haystack; each kind spells only the fields it owns.
  function joinLower(parts) {
    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  function studyHaystack(record) {
    if (!record) return '';
    const members = (record.members || []).map((entry) => entry?.user?.name || entry?.name || (entry?.id ?? entry));
    const chapters = (record.chapters || []).flatMap((chapter) => [
      chapter?.name,
      chapter?.description,
      ...((chapter?.tags || []).map((tag) => tag?.[1])),
      ...((chapter?.players || []).map((player) => player?.name)),
    ]);
    return joinLower([
      record.studyName,
      record.description,
      ...(record.topics || []),
      record.owner?.name || record.ownerId,
      ...members,
      ...chapters,
    ]);
  }

  function chapterHaystack(chapter) {
    if (!chapter) return '';
    return joinLower([
      chapter.name,
      chapter.description,
      ...(chapter.tags || []).map((tag) => tag?.[1]),
      ...(chapter.players || []).map((player) => player?.name),
      chapter.setup?.variant?.name,
      chapter.setup?.variant?.key,
    ]);
  }


  const collectionKindOrder = ['study', 'chapter', 'studyPosition', 'game', 'position', 'puzzle', 'blog', 'blogPost', 'forum', 'forumPost', 'broadcast', 'broadcastGame', 'player', 'coach', 'streamer', 'team', 'tournament', 'url'];
  const collectionTreeFormatVersion = 4;
  // The halves of an address live beside the id, so deleting `meta` cannot lose the item. Each kind
  // names only what its route needs; `parentId` is the nesting stamp any leaf may carry.
  const addressKeys = {
    chapter: ['studyId'],
    studyPosition: ['studyId', 'chapterId', 'nodePath'],
    blog: ['userId', 'url'],
    blogPost: ['userId', 'slug', 'url'],
    forumPost: ['board', 'url'],
    broadcast: ['url'],
    broadcastGame: ['slug', 'round', 'roundId', 'chapterId', 'url'],
    tournament: ['system'],
    position: ['variant'],
    url: ['url'],
  };
  const everyAddress = ['parentId', 'blogId', ...new Set(Object.values(addressKeys).flat())];

  function collectionKindRegistry(harvester) {
    const writableRole = (record) => record?.role == 'owner' || record?.role == 'contributor';
    // The chip answer is the state the page reports: `unlisted` is not public.
    const visibilityState = (record) =>
      record?.visibility == 'private' || record?.visibility == 'unlisted' ? record.visibility : 'public';
    // Absence needs proof: a leaf the mirror never saw is uncaptured, not deleted.
    const absent = (record) => record?.absent === true;
    // What a kind owns only when it differs from this; see tools/recordsDbStore/context.md.
    const kindDefault = {
      canWrite: undefined,
      visibility: undefined,
      read: undefined,
      isDead: absent,
      serviced: false,
    };
    return {
      study: {
        ...kindDefault,
        icon: 'StudyBoard',
        openUrl: (id, leaf) => '/study/' + id,
        canWrite: writableRole,
        visibility: visibilityState,
        haystack: studyHaystack,
        read: (id, signal) => harvester.harvestOne(id, signal),
        serviced: true,
      },
      chapter: {
        ...kindDefault,
        icon: 'Shield',
        openUrl: (id, leaf) => '/study/' + (leaf?.studyId || '') + '/' + id,
        canWrite: writableRole,
        visibility: visibilityState,
        haystack: chapterHaystack,
        serviced: true,
        containment: 'study',
        branch: 'study',
      },
      game: {
        ...kindDefault,
        icon: 'Crown',
        openUrl: (id, leaf) => '/game/' + id,
        visibility: visibilityState,
        haystack: (record) => joinLower([record?.studyName, ...(record?.tags || [])]),
        read: 'game.getPgns(ids, { ndjson: true }) \u2014 batch, chunked like /round/minis?ids= (\u00a719.7)',
      },
      position: {
        ...kindDefault,
        icon: 'PositionIndicator',
        openUrl: (id, leaf) => '/analysis/' + (leaf?.variant || 'standard') + '/' + String(id).replace(' ', '_'),
        canWrite: () => true,
        haystack: (record) => joinLower([record?.san?.line, ...(record?.tags || [])]),
        isDead: () => false,
      },
      studyPosition: {
        ...kindDefault,
        icon: 'SquarePositionIndicator',
        openUrl: (id, leaf) => '/study/' + (leaf?.studyId || '') + '/' + (leaf?.chapterId || ''),
        canWrite: writableRole,
        haystack: (record) => joinLower([record?.san?.line, ...(record?.tags || [])]),
        isDead: () => false,
        branch: 'study',
      },
      puzzle: {
        ...kindDefault,
        icon: 'ArcheryTarget',
        openUrl: (id, leaf) => '/training/' + id,
        read: 'puzzle.getPuzzle(id) \u2014 one request per id, so the pass is capped and says so (\u00a719.7)',
        haystack: (record) => joinLower([record?.puzzle?.name, record?.name]),
      },
      blog: {
        ...kindDefault,
        icon: 'Book',
        openUrl: (id, leaf) => leaf?.url || '/@/' + (leaf?.userId || id) + '/blog',
        visibility: visibilityState,
        read: 'user.getMini(userId) \u2014 only for the author label',
        haystack: (record) => joinLower([record?.name, record?.publicName, record?.description]),
      },
      blogPost: {
        ...kindDefault,
        icon: 'Pencil',
        openUrl: (id, leaf) =>
          leaf?.url || '/@/' + (leaf?.userId || '') + '/blog/' + (leaf?.slug || '') + '/' + id,
        visibility: visibilityState,
        read: 'lt.net.fetch with ignoreStatuses:[404] \u2014 404 is the dead signal (\u00a719.7)',
        haystack: (record) => joinLower([record?.title, record?.name, record?.text]),
        containment: 'blog',
        branch: 'blog',
      },
      forum: {
        ...kindDefault,
        icon: 'BubbleConvo',
        openUrl: (id, leaf) => '/forum/' + id,
        haystack: (record) => joinLower([record?.name]),
      },
      forumPost: {
        ...kindDefault,
        icon: 'BubbleSpeech',
        openUrl: (id, leaf) => leaf?.url || '/forum/' + (leaf?.board || '') + '/' + id,
        haystack: (record) => joinLower([record?.title, record?.author]),
        containment: 'forum',
        branch: 'forum',
      },
      broadcast: {
        ...kindDefault,
        icon: 'RadioTower',
        openUrl: (id, leaf) => leaf?.url || '/broadcast/' + id,
        haystack: (record) => joinLower([record?.name, record?.title]),
      },
      broadcastGame: {
        ...kindDefault,
        icon: 'RadioTower',
        openUrl: (id, leaf) =>
          leaf?.url ||
          '/broadcast/' + (leaf?.slug || '') + '/' + (leaf?.round || '') + '/' + (leaf?.roundId || id) +
          (leaf?.chapterId && leaf.chapterId !== (leaf?.roundId || id) ? '/' + leaf.chapterId : ''),
        haystack: (record) => joinLower([record?.name, record?.studyName]),
        containment: 'broadcast',
        branch: 'broadcast',
      },
      player: {
        ...kindDefault,
        icon: 'User',
        openUrl: (id, leaf) => '/@/' + id,
        read: 'api.user.getUsers([id]) \u2014 read by the ui, never by the mirror',
        haystack: (record) => joinLower([record?.title, record?.name]),
      },
      coach: {
        ...kindDefault,
        icon: 'GraduateCap',
        openUrl: (id, leaf) => '/coach/' + id,
        haystack: (record) => joinLower([record?.name, record?.handle]),
      },
      streamer: {
        ...kindDefault,
        icon: 'Voice',
        openUrl: (id, leaf) => '/streamer/' + id,
        haystack: (record) => joinLower([record?.name, record?.handle]),
      },
      team: {
        ...kindDefault,
        icon: 'Group',
        openUrl: (id, leaf) => '/team/' + encodeURIComponent(String(id)),
        read: 'api.team.getTeam(id) \u2014 read by the ui, never by the mirror',
        haystack: (record) => joinLower([record?.name, record?.fullName]),
      },
      tournament: {
        ...kindDefault,
        icon: 'Trophy',
        openUrl: (id, leaf) => (leaf?.system == 'swiss' ? '/swiss/' : '/tournament/') + id,
        haystack: (record) => joinLower([record?.fullName, record?.name]),
      },
      url: {
        ...kindDefault,
        icon: 'Link',
        openUrl: (id, leaf) => leaf?.url || String(id),
        haystack: (record) => joinLower([record?.name, record?.fullName]),
        isDead: () => false,
      },
    };
  }

  // A folder is a node with no `kind`; a leaf may still carry children.
  function collectionFolder(node) {
    return !node?.kind;
  }

  // A copy decision the caller owns: a partial pass must never eat bookmarks.
  function pruneCollection(entries, drop) {
    const keep = [];
    for (const node of entries || []) {
      if (collectionFolder(node)) {
        // Folders go dim when empty, never drop.
        node.children = pruneCollection(node.children, drop);
        keep.push(node);
      } else {
        // A contained leaf travels with its carrier.
        if (node.children) node.children = pruneCollection(node.children, drop);
        if (!drop(node)) keep.push(node);
      }
    }
    return keep;
  }

  class CollectionTree {
    constructor(lichessTools, idbStudy, harvester) {
      this.lichessTools = lichessTools;
      this.idbStudy = idbStudy;
      this.registry = collectionKindRegistry(harvester);
      this.kinds = collectionKindOrder;
      this.blobKinds = collectionKindOrder.filter((kind) => !this.registry[kind]?.branch);
      this.trees = new Map();
      this.filters = { access: 'all', visibility: 'all', kind: 'all' };
      // Two drops in a row must not interleave a branch write.
      this.writes = Promise.resolve(null);
    }

    branchOf(kind) {
      return this.registry[kind]?.branch || kind;
    }

    // The blob key is composed per branch, so an unregistered kind still gets one.
    treeKey(kind) {
      const branch = this.branchOf(kind);
      const known = this.idbStudy.keys['tree-' + branch];
      if (known) return known;
      const composed = 'lichessTools/LT/recordsDb-tree-' + branch;
      this.idbStudy.keys['tree-' + branch] = composed;
      return composed;
    }

    // One kind's leaves and folders, counted in one pass.
    countKind(nodes, kind) {
      let leaves = 0;
      let folders = 0;
      const visit = (nodes) => {
        for (const node of nodes || []) {
          if (collectionFolder(node)) folders++;
          else if (node.kind == kind) leaves++;
          visit(node.children || []);
        }
      };
      visit(nodes);
      return { leaves, folders };
    }

    // Folders join by name across branches; a leaf re-nests under the leaf its blob named.
    mergeTrees(branches) {
      const pairs = branches?.constructor === Object ? Object.entries(branches) : branches;
      const merged = [];
      const branchOf = (kind) => this.registry[kind]?.branch || kind;
      const seen = new Map();
      const byId = new Map();
      const parentId = new Map();
      const nestedUnder = new Map();
      const home = [];
      const walk = (nodes, target, above, branch) => {
        for (const node of nodes || []) {
          if (collectionFolder(node)) {
            let bucket = target.find((existing) => collectionFolder(existing) && existing.name === node.name);
            if (!bucket) {
              bucket = { name: node.name ?? '', children: [] };
              target.push(bucket);
            }
            walk(node.children, bucket.children, undefined, branch);
            continue;
          }
          // A leaf of another branch is a path marker: it chains the walk, it never joins.
          if (branchOf(node.kind) !== branch) {
            walk(node.children || [], target, node, branch);
            continue;
          }
          if (!node.id || seen.has(node.kind + '|' + node.id)) continue;
          // The children array is the blob's path, not the merged row's own children.
          const copy = { ...node };
          delete copy.children;
          seen.set(node.kind + '|' + node.id, copy);
          byId.set(node.id, copy);
          const named = node?.parentId ?? node?.studyId ?? node?.blogId;
          if (named && named !== node.id) parentId.set(copy, named);
          home.push([copy, target]);
          nestedUnder.set(copy, above);
          walk(node.children || [], target, node, branch);
        }
      };
      for (const [branch, entries] of pairs) walk(entries, merged, undefined, branch ?? this.branchOf(entries?.[0]?.kind));
      const parentOf = new Map();
      // A parent already living under the leaf is refused, so a ring cannot loop the walk.
      const underPlaced = (node, maybeDescendant) => {
        let at = maybeDescendant;
        while (at) {
          if (at === node) return true;
          at = parentOf.get(at);
        }
        return false;
      };
      // The blob's own nesting wins; a stamp only covers a link no blob carried.
      for (const [node, target] of home) {
        const marker = nestedUnder.get(node);
        const named = parentId.get(node);
        for (const parent of [
          marker ? seen.get(marker.kind + '|' + marker.id) : undefined,
          named ? byId.get(named) : undefined,
        ]) {
          if (!parent || parent === node || underPlaced(node, parent)) continue;
          (parent.children ||= []).push(node);
          parentOf.set(node, parent);
          break;
        }
        if (!parentOf.has(node)) target.push(node);
      }
      return merged;
    }

    // The mirror of mergeTrees: a folder owns an entry in every branch it stands in, and a leaf
    // of another branch stays as a marker only while its subtree leads to a leaf here.
    splitBranches(nodes) {
      const branches = new Map();
      const filterBranch = (nodes, branch) =>
        (nodes || []).flatMap((node) => {
          if (collectionFolder(node)) return [{ name: node.name ?? '', children: filterBranch(node.children, branch) }];
          const nested = filterBranch(node.children ?? [], branch);
          if (this.branchOf(node.kind) == branch) {
            const copy = { ...node };
            if (nested.length) copy.children = nested;
            else delete copy.children;
            return [copy];
          }
          // A marker leaf keeps the path so a deeper leaf of this branch stays reachable.
          return nested.length ? [{ ...node, children: nested }] : [];
        });
      for (const branch of this.blobKinds) branches.set(branch, filterBranch(nodes || [], branch));
      return branches;
    }

    // The only entry point for a branch: a restored file, a paste and the blob land the same way.
    async load(kind) {
      const blob = await this.idbStudy.readBlob(this.treeKey(kind));
      if (blob?.entries) return this.normalizeEntries(blob.entries, kind);
      if (kind == 'study' && !blob) {
        const legacy = await this.idbStudy.readBlob(this.idbStudy.keys.bookmarks);
        if (legacy?.entries) {
          const migrated = this.migrateLegacy(legacy.entries);
          await this.save(kind, migrated);
          return migrated;
        }
      }
      return [];
    }

    async loadAll(kinds = this.blobKinds) {
      for (const kind of kinds) this.trees.set(kind, await this.load(kind));
      return this.trees;
    }

    save(kind, entries) {
      const branch = this.branchOf(kind);
      this.trees.set(branch, entries);
      return this.chain(async () => {
        await this.idbStudy.write(() =>
          this.idbStudy.writeBlob(this.treeKey(branch), { formatVersion: collectionTreeFormatVersion, kind: branch, entries }),
        );
        if (branch == 'study') await this.clearLegacy();
      });
    }

    // One serial chain: a write waits for the write that was queued before it.
    chain(operation) {
      const chained = this.writes.then(operation);
      this.writes = chained.catch(() => null);
      return chained;
    }

    async clearLegacy() {
      if (this.legacyCleared) return;
      this.legacyCleared = true;
      try {
        await this.idbStudy.write(() => this.idbStudy.removeBranch(this.idbStudy.keys.bookmarks));
      } catch (ignored) {}
    }

    // Legacy bookmarks `{name, studyId, studyName}` become leaves; a file node is a folder only
    // while it carries a `children` array.
    migrateLegacy(entries) {
      const migrate = (nodes) =>
        (nodes || []).flatMap((node) => {
          if (Array.isArray(node.children)) return [{ name: node.name ?? '', children: migrate(node.children) }];
          if (!node?.studyId) return [];
          return [{ kind: 'study', id: node.studyId, label: node.studyName || node.name || '' }];
        });
      return migrate(entries);
    }

    // The three chip states live here, so a chip click never rewrites a branch.
    filtersKey = 'lichessTools/LT/collectionTree-filters';

    async loadFilters() {
      const stored = await this.idbStudy.readBlob(this.filtersKey);
      if (stored) this.filters = { ...this.filters, ...stored };
      return this.filters;
    }

    saveFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      return this.chain(async () => {
        await this.idbStudy.write(() => this.idbStudy.writeBlob(this.filtersKey, this.filters));
      });
    }

    // One parse feeds the file path: a restored file and the blob are the same one tree - folders
    // once, every leaf naming its kind. Older files merge into that shape.
    parseTree(text) {
      const lt = this.lichessTools;
      let parsed;
      try {
        parsed = lt.jsonParse(text);
      } catch (ignored) {
        return undefined;
      }
      if (!parsed) return undefined;
      let tree;
      if (Array.isArray(parsed.tree)) tree = this.normalizeEntries(parsed.tree);
      else {
        const branches = parsed.trees ?? (parsed.entries ? { study: parsed.entries } : undefined);
        if (!branches) return undefined;
        const perBranch = {};
        for (const key of Object.keys(branches)) {
          if (!Array.isArray(branches[key])) continue;
          perBranch[key] = this.normalizeEntries(branches[key], key);
        }
        tree = this.normalizeEntries(this.mergeTrees(perBranch));
      }
      // An unknown kind stays in the tree but is named, so the restore dialog can report it.
      const found = new Set();
      const walk = (nodes) => {
        for (const node of nodes || []) {
          if (node?.kind) found.add(node.kind);
          walk(node.children || []);
        }
      };
      walk(tree);
      const counts = {};
      for (const kind of collectionKindOrder)
        if (found.has(kind)) counts[kind] = this.countKind(tree, kind);
      return { tree, counts, unknown: [...found].filter((kind) => !this.kinds.includes(kind)) };
    }

    // A file leaf of an unknown kind stays; only a node naming no kind anywhere is dropped.
    normalizeEntries(entries, kind) {
      const normalize = (nodes) =>
        (nodes || []).flatMap((node) => {
          if (!node) return [];
          // A kind-less node with a children array is a folder; a leaf may carry children.
          if (!node.kind && !node.leafKind && Array.isArray(node.children))
            return [{ name: String(node.name ?? ''), children: normalize(node.children) }];
          if (!node.kind && !node.leafKind && !kind) return [];
          const leaf = {
            kind: node.kind ?? node.leafKind ?? kind,
            id: node.id ?? node.studyId,
            label: node.label ?? node.studyName ?? node.name ?? '',
          };
          if (!leaf.id || !leaf.kind) return [];
          // The address halves sit beside the id; an older leaf still keeps them inside `meta`.
          const owned = node?.meta ? { ...node.meta } : undefined;
          for (const key of everyAddress) {
            const carried = (addressKeys[leaf.kind] || []).includes(key) || key == 'parentId' || key == 'blogId';
            const value = node?.[key] ?? (carried ? owned?.[key] : undefined);
            if (value === undefined) continue;
            leaf[key] = value;
            if (carried && owned) delete owned[key];
          }
          if (owned && Object.keys(owned).length) leaf.meta = owned;
          // An older relay leaf keyed its board with the round's study id; re-key on the way in so
          // re-filing finds the row it already has rather than opening a twin.
          if (leaf.kind == 'broadcastGame' && leaf.chapterId &&
            String(leaf.chapterId) !== String(leaf.id)) {
            const boardKey = String(leaf.chapterId);
            leaf.roundId = leaf.roundId || leaf.id;
            leaf.chapterId = boardKey;
            leaf.id = boardKey;
          }
          if (Array.isArray(node.children)) leaf.children = normalize(node.children);
          return [leaf];
        });
      return normalize(entries);
    }

    // Restore replaces the whole tree: a branch the file omits ends empty rather than keeping
    // leaves the user no longer has.
    async readTree(text) {
      const parsed = this.parseTree(text);
      if (!parsed) return undefined;
      for (const [branch, entries] of this.splitBranches(parsed.tree)) await this.save(branch, entries);
      return parsed;
    }

    writeTree(kind, entries) {
      return this.save(kind, entries);
    }

    // The download is the tree the user sees, not one blob per branch; readTree splits it back.
    serializeTree(nodes = this.mergeTrees(this.trees)) {
      return JSON.stringify(
        { formatVersion: collectionTreeFormatVersion, kind: 'collectionTree', tree: this.normalizeEntries(nodes) },
        null,
        2,
      );
    }

    prune(kind, isDead) {
      const branch = this.branchOf(kind);
      const entries = this.trees.get(branch);
      if (!entries) return;
      const pruned = pruneCollection(entries, isDead);
      this.trees.set(branch, pruned);
      return pruned;
    }
  }

  // Glue: one object holding the three singletons -------------------------------------------------

  class RecordsDbStore {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.idbStudy = new IdbStudy(lichessTools);
      this.harvester = new RecordsHarvester(lichessTools, this.idbStudy);
      this.syncCtrl = new SyncCtrl(lichessTools, this.idbStudy, this.harvester);
      // The tree engine lives here so the UI half reads branches through it and never touches a
      // blob key of its own.
      this.collectionTree = new CollectionTree(lichessTools, this.idbStudy, this.harvester);
      this.kindRegistry = this.collectionTree.registry;
      this.collectionKinds = collectionKindOrder;
      this.collectionBranches = this.collectionTree.blobKinds;
      this.addressKeys = addressKeys;
      this.everyAddress = everyAddress;
      this.mergeStudyMetadata = mergeStudyMetadata;
      this.matchesMetadata = matchesMetadata;
      this.isRecordsDbAvailable = isRecordsDbAvailable;
      this.chapterHaystack = chapterHaystack;
      this.collectionFolder = collectionFolder;
    }
  }


  class IdbStudy {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.historyLimit = recordsDbHistoryLimit;
      this.idbOptions = { db: true, raw: true };
      this.keys = {
        member: 'lichessTools/LT/recordsDb-member',
        history: 'lichessTools/LT/recordsDb-history',
        bookmarks: 'lichessTools/LT/recordsDb-bookmarks',
        windows: 'lichessTools/LT/recordsDb-windows',
        syncMeta: 'lichessTools/LT/recordsDb-syncMeta',
        // One blob per branch, so filing one kind never rewrites another's blob; `treeKey(branch)`
        // builds the branch key from the same prefix, and `chapter` has none of its own.
        filters: 'lichessTools/LT/collectionTree-filters',
        // What the tree filed that is not the user's own study, in its own blob so `member` stays
        // a faithful picture of the user's list.
        captures: 'lichessTools/LT/recordsDb-captures',
      };
      this.writes = Promise.resolve(null);
      // One live Map per study blob, read lazily and flushed onto the serial write chain: `member`
      // holds the user's own list plus a `complete` proof, `captures` what the tree filed, `history`
      // the visits the mirror carries.
      this.slots = { member: { state: null, write: null }, history: { state: null, write: null }, captures: { state: null, write: null } };
    }

    async readBlob(key) {
      const lt = this.lichessTools;
      const value = await lt.storage.get(key, this.idbOptions);
      if (value) return value;
      // The tools were renamed, so a database saved under the old naming is spent once and
      // rewritten under the new key. Only the old blob is left behind, never read again.
      const oldKey = key.indexOf('/recordsDb-') < 0 ? null : key.replace('/recordsDb-', '/studyDb-');
      if (!oldKey) return value;
      const moved = await lt.storage.get(oldKey, this.idbOptions);
      if (!moved) return value;
      await this.writeBlob(key, moved);
      return moved;
    }

    async writeBlob(key, value) {
      const lt = this.lichessTools;
      await lt.storage.set(key, value, this.idbOptions);
    }

    write(operation) {
      const result = this.writes.then(() => operation());
      this.writes = result.catch(() => null);
      return result;
    }

    // The three study blobs are one machine: a Map keyed by studyId, read once and kept until the
    // next flush, with a burst of updates collapsed onto the serial write chain so two tabs cannot
    // interleave a half-written store. Only the blob shape differs - `member` carries `complete`
    // beside the list, `captures` wraps its list and `history` is bare.
    async ensure(which) {
      const slot = this.slots[which];
      if (slot.state) return slot.state;
      const blob = await this.readBlob(this.keys[which]) || {};
      const entries = new Map((Array.isArray(blob) ? blob : blob.studies || []).map((study) => [study.studyId, study]));
      slot.state = which == 'member' ? { studies: entries, complete: !!blob.complete } : entries;
      return slot.state;
    }

    // The live Map, however the blob spells it.
    entries(which) {
      const state = this.slots[which].state;
      return which == 'member' ? state.studies : state;
    }

    flush(which) {
      const state = this.slots[which].state;
      if (!state) return;
      const studies = [...this.entries(which).values()];
      return this.writeBlob(this.keys[which], which == 'history' ? studies : { studies, ...(which == 'member' ? { complete: state.complete } : {}) });
    }

    async storeEntries(which, updates) {
      const state = await this.ensure(which);
      const entries = this.entries(which);
      for (const update of updates) {
        if (update?.type === 'delete') entries.delete(update.studyId);
        else if (update?.type === 'complete' && which == 'member') state.complete = true;
        else if (update?.type === 'upsert') entries.set(update.study?.studyId, update.study);
        else throw new Error('bad records db update: ' + which + ' ' + update?.type);
      }
      const slot = this.slots[which];
      // A burst that is not awaited collapses into the write that is already on the chain.
      if (slot.write) return slot.write;
      const chained = this.write(() => this.flush(which));
      slot.write = chained.catch(() => null).then(() => { slot.write = null; });
      return chained;
    }

    // The whole store newest first, fed 250 at a time so a long read can be dropped mid-blob.
    async page(which, onBatch, signal) {
      await this.ensure(which);
      const studies = [...this.entries(which).values()].sort((left, right) => right.updatedAt - left.updatedAt);
      if (onBatch) {
        for (let i = 0; i < studies.length; i += 250) {
          if (signal?.aborted) break;
          onBatch(studies.slice(i, i + 250));
        }
      }
      return studies;
    }




    async updatePosition(path, position) {
      const lt = this.lichessTools;
      if (!lt.getUserId() || !isRecordsDbAvailable(lt.location.pathname)) return;
      await this.write(async () => {
        await this.ensure('history');
        const entry = this.slots.history.state.get(position?.studyId);
        if (!entry || entry.recordsDbExcluded || !visitMoves(entry.visit, position, path)) return;
        entry.visit = { ...entry.visit, path, orientation: position.orientation };
        await this.flush('history');
      });
    }

    async storeMember(update) {
      await this.storeEntries('member', [update]);
    }

    // The blob's own proof of a complete list rides out with the member read.
    getMember = async (onBatch, signal) => ({
      studies: await this.page('member', onBatch, signal),
      complete: this.slots.member.state.complete,
    });
    getCaptures = async (onBatch, signal) => await this.page('captures', onBatch, signal);
    storeMemberAll = async (updates) => await this.storeEntries('member', updates);
    storeCapturesAll = async (updates) => await this.storeEntries('captures', updates);

    // A study the tree holds that is not the user's own still needs its whole picture: the tooltip
    // lists chapters, the access and visibility chips answer, the search haystack covers them. Those
    // facts live in the mirror only, so a page change would lose them. This blob holds them for the
    // leaves the tree names - `recordsDb-member` keeps its meaning (the user's own list) untouched.
    // A capture the tree no longer names has no row to serve, so it is dead weight.
    async pruneCaptures(keepIds) {
      await this.ensure('captures');
      const drops = [...this.entries('captures').keys()].filter((studyId) => !keepIds?.has(studyId)).map((studyId) => ({ type: 'delete', studyId }));
      if (!drops.length) return 0;
      await this.storeCapturesAll(drops);
      return drops.length;
    }


    // The migration leaves the blob behind only until the branch that absorbed it has been
    // written.
    async removeBranch(key) {
      const lt = this.lichessTools;
      await lt.storage.remove(key, this.idbOptions);
    }


    // The blob every reader wants, with the empty shape each key owns.
    blob = async (which, fallback = []) => (await this.readBlob(this.keys[which])) || fallback;
    loadWindows = () => this.blob('windows');
    ensureSyncMeta = () => this.blob('syncMeta', { revision: 0 });

    async saveWindows(storedTabs) {
      // The blob is rewritten whole, so a part the page cannot see has to come from the blob
      // itself: `view` is the shape the user left and `scroll` is where the wheel had stopped.
      const carriedParts = ['view', 'scroll'];
      const previous = await this.loadWindows();
      const last = {};
      for (const row of previous) {
        const kind = row?.kind;
        if (!kind) continue;
        for (const part of carriedParts)
          if (row[part] !== undefined) last[kind + ' ' + part] = row[part];
      }
      const rows = (storedTabs || []).map((row) => {
        const filled = { ...row };
        const kind = row?.kind;
        if (!kind) return filled;
        for (const part of carriedParts) {
          if (filled[part] === undefined && last[kind + ' ' + part] !== undefined)
            filled[part] = last[kind + ' ' + part];
        }
        return filled;
      });
      await this.write(() => this.writeBlob(this.keys.windows, rows));
    }

    async nextRevision(count = 1) {
      const meta = await this.ensureSyncMeta();
      meta.revision = (+meta.revision || 0) + count;
      await this.writeBlob(this.keys.syncMeta, meta);
      return meta.revision;
    }

    async rememberHarvest(manifest) {
      const meta = await this.ensureSyncMeta();
      meta.lastHarvestAt = Date.now();
      meta.manifest = manifest;
      meta.historyLimit = this.historyLimit;
      await this.writeBlob(this.keys.syncMeta, meta);
    }
  }

  // SyncCtrl: the mirror, its revision and the harvest that feeds it ------------------------------

  class SyncCtrl {
    constructor(lichessTools, idbStudy, harvester) {
      this.lichessTools = lichessTools;
      this.idbStudy = idbStudy;
      this.harvester = harvester;
      this.complete = false;
      this.error = undefined;
      this.studies = new Map();
      this.pendingUpdates = new Set();
      this.listeners = new Set();
      // What the tree names, set once its content has loaded the tree - a role-less capture is
      // persisted only for those ids, and the capture blob is pruned to exactly them.
      this.treeIds = null;
      // A capture that arrives before the tree has a name to answer waits here rather than being
      // dropped: a record that only lives in the mirror is gone on the next page reload, and the
      // row tooltip needs it the moment the tree loads and names that study.
      this.pendingCaptures = new Set();
      this.frame;
      this.request;
      this.updating = false;
      this.harvesting = false;
      // Bumped by `publish` - what the UI's haystack and scoring caches key on.
      this.publishRevision = 0;
    }

    get loading() {
      return !!this.request;
    }

    get history() {
      return [...this.studies.values()]
        .filter((study) => study.visit)
        .sort((left, right) => right.visit.at - left.visit.at || right.studyId.localeCompare(left.studyId))
        .slice(0, this.idbStudy.historyLimit);
    }

    watch(onChange) {
      this.listeners.add(onChange);
      return () => this.listeners.delete(onChange);
    }

    store(incoming, partial = false) {
      // A negative read marker is the tree's own proof - it never enters the mirror.
      if (incoming?.absent) return incoming;
      const cached = this.studies.get(incoming.studyId);
      const visit =
        (cached?.visit?.at ?? 0) > (incoming.visit?.at ?? 0)
          ? cached?.visit
          : incoming.visit ?? cached?.visit;
      const study = partial
        ? mergeStudyMetadata(cached, incoming)
        : cached && this.pendingUpdates.has(incoming.studyId)
          ? mergeStudyMetadata(incoming, cached)
          : { ...(cached && (cached.metadataRevision ?? -1) > (incoming.metadataRevision ?? -1) ? cached : incoming) };
      delete study.matchingChapterIds;
      delete study.matchingChapterFields;
      if (cached) for (const key of Object.keys(cached)) delete cached[key];
      const result = Object.assign(cached || {}, study, visit ? { visit } : {});
      this.studies.set(result.studyId, result);
      this.publish();
      return result;
    }


    async load(signal) {
      if (!this.lichessTools.getUserId() || signal?.aborted) return;
      this.request?.abort();
      const loaded = await this.runGuarded(signal, 'records db load failed: ', true, async (request, active) => {
        this.complete = false;
        this.error = undefined;
        this.publish();
        // Both blobs feed the mirror the same way: a batch lands, the revision moves.
        const feed = (batch) => {
          if (!active()) return;
          for (const study of batch) this.store(study);
          this.publish();
        };
        const cache = await this.idbStudy.getMember(feed, request.signal);
        // A capture the tree filed is not in the member blob, so the mirror feeds it the same way.
        const captures = active() ? await this.idbStudy.getCaptures(feed, request.signal) : [];
        if (!active()) {
          this.error = 'records db request aborted';
          return;
        }
        for (const study of cache.studies) this.store(study);
        for (const study of captures) this.store(study);
        this.complete = cache.complete;
      });
      if (loaded) {
        this.publish();
        this.integrateUpdates();
      }
    }

    async harvest(signal) {
      const lt = this.lichessTools;
      const lockKey = 'recordsDbHarvest.harvest';
      if (this.harvesting || !lt.getUserId() || lt.cache?.isLocked(lockKey)) return;
      lt.cache?.lock(lockKey);
      this.harvesting = true;
      this.request?.abort();
      const delay = recordsDbHarvestPageDelayMs;
      const manifest = {};
      let pages = 0;
      let harvested = 0;
      try {
        await this.runGuarded(signal, 'harvest failed: ', false, async (request, active) => {
          for (const group of this.harvester.groups()) {
            for (let page = 1; active(); page++) {
              const html = await this.harvester.fetchPage(group, page, 'updated', request.signal);
              if (!html) break;
              const rows = this.harvester.parseListPage(html);
              if (!rows.length) break;
              for (const row of rows) {
                if (!row.role && group.role) row.role = group.role;
                const study = this.store(row, true);
                manifest[study.studyId] = study.metadataRevision ?? manifest[study.studyId] ?? 0;
                harvested++;
              }
              pages++;
              this.publish();
              // Lt.net sets slowMode on a 429; honour it and the configured delay between pages.
              if (lt.net.slowMode) await lt.timeout(1000);
              else if (delay) await lt.timeout(delay);
            }
            if (!active()) break;
          }
          if (!active()) {
            this.error = 'harvest aborted';
            return;
          }
          await this.idbStudy.storeMember({ type: 'complete' });
          await this.idbStudy.rememberHarvest({ pages, harvested, groups: this.harvester.groups().length });
          this.complete = true;
        });
      } finally {
        lt.cache?.release(lockKey);
        this.harvesting = false;
        this.publish();
      }
    }

    // The scaffold both requests share: an abortable request, a body that may only run while it
    // still owns the mirror (harvest's body does not, since a load can replace it) and the abort
    // that a failed body leaves as the mirror's own error.
    async runGuarded(signal, errorLabel, ownsRequest, body) {
      const lt = this.lichessTools;
      const request = new (lt.global.AbortController || AbortController)();
      this.request = request;
      const stop = () => request.abort();
      signal?.addEventListener('abort', stop, { once: true });
      const active = () => (!ownsRequest || this.request === request) && !request.signal.aborted;
      try {
        await body(request, active);
      } catch (e) {
        this.error = errorLabel + e;
      }
      signal?.removeEventListener('abort', stop);
      const ours = this.request === request;
      if (this.request === request) this.request = undefined;
      return ours && !request.signal.aborted;
    }

    publish() {
      const lt = this.lichessTools;
      this.publishRevision = (this.publishRevision ?? 0) + 1;
      if (this.frame !== undefined || !this.listeners.size) return;
      this.frame = 1;
      lt.requestAF(() => {
        this.frame = undefined;
        for (const onChange of this.listeners) onChange();
      }, 'recordsDbHarvest');
    }

    // The handlers stay field arrows: an emitter may call them with no receiver.
    studyUpdated = (update) => {
      const study = update?.study;
      if (!study || study.recordsDbExcluded) return;
      const cached = this.store(study, true);
      cached.visit = {
        chapterId: update.chapterId,
        path: update.path,
        orientation: update.orientation,
        at: Date.now(),
      };
      this.pendingUpdates.add(study.studyId);
      this.publish();
      this.integrateUpdates();
    }

    // A record read on demand (the tree adding a leaf it does not own) is worth persisting
    // straight away: nothing else on that page publishes, so the update would sit in the mirror.
    persist(studyId) {
      if (!studyId || !this.studies.has(studyId)) return;
      this.pendingUpdates.add(studyId);
      this.integrateUpdates();
    }

    // The tree names the studies whose capture the local db must keep, so the blob stays exactly
    // what the rows need. Until the tree is known, a role-less capture waits in `pendingCaptures`
    // rather than being dropped, and this call writes the waiters the tree names.
    async setTreeIds(ids) {
      this.treeIds = ids instanceof Set ? ids : new Set(ids || []);
      // The tree now has a name for every waiting capture, so the ones it names are worth a file.
      for (const studyId of this.pendingCaptures) this.pendingUpdates.add(studyId);
      this.pendingCaptures.clear();
      if (this.pendingUpdates.size) await this.integrateUpdates();
      return await this.idbStudy.pruneCaptures(this.treeIds);
    }

    async integrateUpdates() {
      if (this.loading || this.updating || !this.pendingUpdates.size) return;
      this.updating = true;
      try {
        while (this.pendingUpdates.size) {
          const memberUpdates = [];
          const captureUpdates = [];
          while (memberUpdates.length < 250 && this.pendingUpdates.size) {
            const studyId = this.pendingUpdates.values().next()?.value;
            this.pendingUpdates.delete(studyId);
            const study = this.studies.get(studyId);
            if (!study) continue;
            if (study.role) memberUpdates.push({ type: 'upsert', study });
            else {
              memberUpdates.push({ type: 'delete', studyId });
              // The member blob stays the user's own list. A study the tree holds keeps its facts
              // in the capture blob instead - one it does not is mirror-only for that page.
              if (this.treeIds === null) this.pendingCaptures.add(studyId);
              else if (this.treeIds.has(studyId)) captureUpdates.push({ type: 'upsert', study });
            }
          }
          if (memberUpdates.length) await this.idbStudy.storeMemberAll(memberUpdates);
          if (captureUpdates.length) await this.idbStudy.storeCapturesAll(captureUpdates);
        }
      } catch (e) {
        this.error = 'Unable to update records cache';
      } finally {
        this.updating = false;
        this.publish();
        await this.integrateUpdates();
      }
    }

    analysisChanged = (_fen, path, position) => {
      if (!position) return;
      const study = this.studies.get(position.studyId);
      if (!study?.visit || study.recordsDbExcluded) return;
      if (!visitMoves(study.visit, position, path)) return;
      study.visit = { ...study.visit, path, orientation: position.orientation };
      this.publish();
      this.idbStudy.updatePosition(path, position).catch(() => {});
    }

    async captureVisit() {
      const lt = this.lichessTools;
      // `analysis.study` only exists once a study page is open, so every capture gets its chance
      // to install the setChapter wrapper (it is idempotent - the guard below keeps it a no-op
      // afterwards).
      this.wrapSetChapter();
      if (!lt.currentOptions.getValue('recordsDbCapture')) return;
      try {
        const update = await this.harvester.captureFromLivePage();
        if (!update) return;
        this.studyUpdated(update);
      } catch (e) {
        lt.global.console.debug('recordsDbUi live capture skipped:', e);
      }
    }

    chapterChanged = () => {
      this.captureVisit();
    };

    wrapSetChapter() {
      const lt = this.lichessTools;
      const study = lt.lichess?.analysis?.study;
      const setChapter = study?.setChapter;
      if (!setChapter || lt.isWrappedFunction?.(setChapter, 'recordsDbUi')) return false;
      study.setChapter = lt.wrapFunction(setChapter, {
        id: 'recordsDbUi',
        // `after` runs with the lt object as `$this`; the visit refresh is fire-and-forget and has
        // to hand the original result back, otherwise the study UI would see a Promise of nothing.
        after: ($this, result) => {
          this.captureVisit();
          return undefined;
        },
      });
      return true;
    }


    async attachEvents() {
      const lt = this.lichessTools;
      lt.pubsub.on('lichessTools.recordsDb.updated', this.studyUpdated);
      lt.uiApi?.events?.on('analysis.change', this.analysisChanged);
      lt.pubsub.on('lichessTools.chapterChange', this.chapterChanged);
      lt.pubsub.on('lichessTools.commentChange', this.chapterChanged);
      this.wrapSetChapter();
    }


  }


  class RecordsHarvester {
    constructor(lichessTools, idbStudy) {
      this.lichessTools = lichessTools;
      this.idbStudy = idbStudy;
      this.error = undefined;
    }

    // `by/<user>` and `search` are public views, not membership, so they are not groups of their
    // own.
    groups = () => [
      { key: 'mine', path: '/study/mine/', role: 'owner' },
      { key: 'member', path: '/study/member/', role: 'member' },
      { key: 'public', path: '/study/public/', role: 'owner' },
      { key: 'private', path: '/study/private/', role: 'owner', visibility: 'private' },
      { key: 'likes', path: '/study/likes/', liked: true },
    ];


    pageOf = (group, page, order) => group.path + order + (page > 1 ? '?page=' + page : '');

    async fetchPage(group, page, order, signal) {
      const lt = this.lichessTools;
      if (signal?.aborted) return null;
      const url = this.pageOf(group, page, order);
      try {
        return await lt.net.fetch(url);
      } catch (e) {
        // Lt.net sets slowMode on a 429; a missing page only ends the walk of this group.
        this.error = 'list page ' + url + ' failed: ' + e;
        return null;
      }
    }

    parseListPage(html) {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!html) return [];
      const doc = $(html);
      const rows = [];
      $('div.studies', doc).each((i, listEl) => {
        const list = $(listEl);
        list.find('div.study.paginated').each((j, cardEl) => {
          const card = $(cardEl);
          const link = card.find('a.overlay').eq(0);
          const idMatch = /^\/study\/([a-zA-Z0-9]{8})/.exec(link?.attr('href') || '');
          if (!idMatch) return;
          const row = {
            studyId: idMatch[1],
            studyName: card.find('h2.study-name').text() || link.attr('title') || '',
            // The card may miss chapters altogether, and its chapter names have no ids: nothing about
            // the chapter group may be trusted. Tags were never on a card at all.
            partialCoverage: { chapters: true, tags: true },
          };
          const time = card.find('time').eq(0);
          const datetime = time?.attr('datetime');
          if (datetime) {
            row.createdAt = Date.parse(datetime);
            row.updatedAt = row.createdAt;
          }
          const meta = card.find('span').text();
          if (meta) {
            // " 1 - ownerName - " - the icons contribute nothing to the text.
            const bits = meta.split('\u2022').map((bit) => bit.trim()).filter((bit) => bit.length);
            const likes = bits.map((bit) => Number(bit)).find((bit) => Number.isFinite(bit));
            if (likes !== undefined) row.likes = likes;
            const owner = bits.find((bit) => !Number.isFinite(Number(bit)));
            if (owner) row.owner = { name: owner };
          }
          const flair = card.find('icon.icon-flair').attr('data-icon');
          if (flair) row.flair = flair;
          card.find('icon').each((k, iconEl) => {
            const code = $(iconEl).attr('data-icon');
            if (code === lt.icon.Heart) row.liked = true;
            else if (code === lt.icon.Padlock) row.visibility = 'private';
          });
          const chapters = card.find('ol.chapters li');
          if (chapters.length) {
            row.chapters = [];
            chapters.each((k, liEl) => row.chapters.push({ name: $(liEl).text() }));
          }
          const members = card.find('ol.members li');
          if (members.length) {
            row.members = [];
            members.each((k, liEl) => {
              const li = $(liEl);
              row.members.push({
                user: { name: li.text() },
                role: li.attr('data-icon') === lt.icon.RadioTower ? 'w' : 'r',
              });
            });
          }
          rows.push(row);
        });
      });
      return rows;
    }

    studyInitJson(htmlText) {
      const m = /<script[^>]*id=["']?page-init-data["']?[^>]*>([\s\S]*?)<\/script>/i.exec(htmlText || '');
      return m?.[1];
    }

    // The page-init shape this reads lives in tools/recordsDbStore/context.md.
    async mapInitStudy(init) {
      const lt = this.lichessTools;
      const raw = init?.study;
      if (!raw?.id) return undefined;
      const displayed = raw.chapter;
      const chapters = raw.chapters?.map((chapter) => ({
        ...(displayed && displayed.id === chapter.id ? displayed : {}),
        ...chapter,
      }));
      const userId = lt.getUserId();
      const memberEntry = Object.entries(raw.members || {}).find((entry) => entry?.[1]?.user?.id === userId);
      const revision = await this.idbStudy.nextRevision();
      return {
        studyId: raw.id,
        studyName: raw.name || '',
        metadataRevision: revision,
        // Viewing a study does not make it a member's: role stays undefined unless it really is one,
        // And SyncCtrl only persists records that carry a role.
        role: raw.ownerId === userId ? 'owner' : memberEntry ? 'contributor' : undefined,
        visibility: raw.visibility || 'public',
        updatedAt: Date.now() - (+raw.secondsSinceUpdate || 0) * 1000,
        createdAt: raw.createdAt,
        ownerId: raw.ownerId,
        likes: raw.likes,
        liked: raw.liked,
        topics: raw.topics || [],
        settings: raw.settings,
        // `features` is the boolean twin of `settings` (which holds 'everyone'/'members'/'owners'
        // strings); keeping it separate keeps the visibility strings readable.
        features: raw.features,
        from: raw.from,
        chapterCount: chapters?.length,
        recordsDbExcluded: raw.from === 'relay',
        members: raw.members ? Object.values(raw.members).map((entry) => ({ user: entry?.user, role: entry?.role })) : undefined,
        chapters,
        // Page-init lists every chapter, but tags only for the displayed one.
        partialCoverage: { chapters: false, tags: true },
        tagTypes: init.tagTypes,
      };
    }

    async mapInitStudyJson(html, signal) {
      const lt = this.lichessTools;
      if (signal?.aborted) return undefined;
      const json = this.studyInitJson(html);
      if (!json) return undefined;
      const init = lt.jsonParse(json);
      if (!init) return undefined;
      return await this.mapInitStudy(init);
    }

    async harvestOne(studyId, signal) {
      const lt = this.lichessTools;
      if (signal?.aborted) return undefined;
      // 404 is the honest absence signal - `ignoreStatuses` makes it a null body, not a throw.
      const html = await lt.net.fetch('/study/' + studyId, { ignoreStatuses: [404] });
      if (html === null) return { studyId, absent: true };
      return await this.mapInitStudyJson(html, signal);
    }


    async captureFromLivePage() {
      const lt = this.lichessTools;
      // Exposes the blob as the lazy `lt.pageInitData`; if the script has not been dropped yet,
      // read it straight off the DOM - either way, no request.
      let init = lt.pageInitData;
      if (!init) {
        const el = lt.$('script#page-init-data').eq(0);
        const text = el?.text();
        if (text) {
          try {
            init = lt.jsonParse(text);
          } catch (e) {
            this.error = 'page-init-data unreadable: ' + e;
          }
        }
      }
      if (!init?.study) return undefined;
      const study = await this.mapInitStudy(init);
      if (!study) return undefined;
      const position = init.study.position;
      return {
        study,
        chapterId: position?.chapterId || init.study.chapter?.id,
        path: position?.path ?? '',
        orientation: position?.orientation || init.study.chapter?.setup?.orientation,
      };
    }

  }

  LiChessTools.Tools.RecordsDbStore = RecordsDbStoreTool;
})();

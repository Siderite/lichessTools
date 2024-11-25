(() => {
  class LiChessTools {
    constructor(global, cash) {
      if (!cash || !global) throw new Error('usage: new LiChessTools(window, cash)');
      this.$ = cash;
      this.global = global;
      this.comm.init();
      this.sri = this.randomToken();
    }

    $ = null;
    global = null;
    lichess = null;


    crc24 = (data) => {
      const polynomial = 0x864CFB;
      let crc = 0xFFFFFF;
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? polynomial : 0);
        }
      }
      return crc ^ 0xFFFFFF;
    };

    spinnerHtml = `<div class="spinner" aria-label="loading">
    <svg viewBox="-2 -2 54 54">
        <g mask="url(#mask)" fill="none">
            <path id="a" stroke-width="3.779" d="m21.78 12.64c-1.284 8.436 8.943 12.7 14.54 17.61 3 2.632 4.412 4.442 5.684 7.93"/>
            <path id="b" stroke-width="4.157" d="m43.19 36.32c2.817-1.203 6.659-5.482 5.441-7.623-2.251-3.957-8.883-14.69-11.89-19.73-0.4217-0.7079-0.2431-1.835 0.5931-3.3 1.358-2.38 1.956-5.628 1.956-5.628"/>
            <path id="c" stroke-width="4.535" d="m37.45 2.178s-3.946 0.6463-6.237 2.234c-0.5998 0.4156-2.696 0.7984-3.896 0.6388-17.64-2.345-29.61 14.08-25.23 27.34 4.377 13.26 22.54 25.36 39.74 8.666"/>
        </g>
    </svg>
</div>`;

    // TODO improve this
    translator = {
      lichessTools: this,
      format: function (str, args) {
        if (args.length) {
          if (str.includes('%s')) {
            str = str.replace('%s', args[0]);
          } else {
            for (let i = 0; i < args.length; i++) {
              str = str.replace('%' + (i + 1) + '$s', args[i]);
            }
          }
        }
        return str;
      },
      noarg: function (key) {
        const lt = this.lichessTools;
        const dict = lt.intl.siteI18n;
        const result =  dict[key] || lt.global?.i18n(key);
        if (result) return result;
        lt.global.console.debug('Translation not found for key ',key);
        return key;
      },
      plural: function (key, count, ...args) {
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        const quantity = (o) => 1 == o ? "one" : "other";
        const dict = lt.intl.siteI18n;
        const str =
          dict[`${key}:${quantity(count)}`] || dict[`${key}:other`] || dict[key] || dict[`${key}:one`]
          || this.format(`${key}:${quantity(count)}`) || this.format(`${key}:other`) || this.format(key) || this.format(`${key}:one`);
        const result = str ? this.format(str, args) : null;
        if (result) return result;
        lt.global.console.debug('Plural not found for key ',key);
        return key;
      },
      pluralSame: function (key, count, ...args) {
        return this.plural(key, count, count, ...args);
      },
      vdom: function(key, ...args) {
        const str = this.noarg(key);
        return str ? this.list(str,args) : [key];
      },
      list: function(str, args) {
        const segments = str.split(/(%(?:\d\$)?s)/g);
        if (!args?.length) return segments;
        const singlePlaceholder = segments.indexOf('%s');
        if (singlePlaceholder !== -1) {
          segments[singlePlaceholder] = args[0];
        } else {
          for (let i = 0; i < args.length; i++) {
            const placeholder = segments.indexOf('%' + (i + 1) + '$s');
            if (placeholder !== -1) segments[placeholder] = args[i];
          }
        }
        return segments;
      }
    };

    pubsub = {
      allSubs: new Map(),
      on: function (name, cb) {
        let subs = this.allSubs.get(name);
        if (!subs) {
          subs = new Set();
          this.allSubs.set(name, subs);
        }
        subs.add(cb);
      },
      off: function (name, cb) {
        this.allSubs.get(name)?.delete(cb);
      },
      emit: function (name, ...args) {
        for (const fn of this.allSubs.get(name) || []) fn.apply(null, args);
      }
    };

    get uiApi() {
      return this.global.lichess;
    }

    isDev = () => {
      return /lichess\.dev/.test(this.global.location.origin);
    };

    get debug() {
      if (this._debug === undefined) {
        const debug = this.global.localStorage.getItem('LiChessTools2.debug');
        this._debug = +debug
          ? +debug
          : debug === 'true';
      }
      return this._debug;
    }
    set debug(value) {
      value = +value
        ? +value
        : value == 'true';
      if (this._debug === value) return;
      this._debug = value;
      this.global.localStorage.setItem('LiChessTools2.debug', this._debug.toString());
      if (this._debug) {
        this.global.console.debug('%c Debug mode is reserved for developers. Might lead to undesired consequences.', 'color: red;');
      }
    }

    arrayRemoveAll(arr, predicate) {
      if (!arr?.length) return;
      let i = 0;
      let result = [];
      while (i < arr.length) {
        if (predicate(arr[i])) {
          result = result.concat(arr.splice(i, 1));
        } else {
          i++;
        }
      }
      return result;
    }

    isWrappedFunction(func, id) {
      if (!func) return false;
      if (!id || func.__wrapId === id) {
        return !!func.__originalFunction;
      }
      return this.isWrappedFunction(func.__originalFunction, id);
    }

    wrapFunction(func, options) {
      const console=this.global.console;
      if (!func) {
        console.warn('Trying to wrap no function', options);
      }
      const wrappedFunc = function () {
        let executeOriginal = true;
        if (options?.before) {
          const execute = options.before(this, ...arguments);
          if (execute === false) executeOriginal = false;
        }
        let result = null;
        if (executeOriginal && func) {
          if (options?.ignoreErrors) {
            (async () => { return func.apply(this, arguments); })()
              .then(r => { result = r; })
              .catch(e => console.log('Wrapped function error:', e))
          } else {
            result = func.apply(this, arguments);
          }
        }
        if (options?.after) {
          const newResult = options.after(this, result, ...arguments);
          if (newResult !== undefined) result = newResult;
        }
        return result;
      };
      wrappedFunc.__originalFunction = func;
      wrappedFunc.__wrapId = options.id;
      return wrappedFunc;
    }

    unwrapFunction(func, id) {
      if (!func) return;
      if (!id || func.__wrapId === id) {
        return func.__originalFunction || func;
      }
      func.__originalFunction = this.unwrapFunction(func.__originalFunction, id);
      return func;
    }

    getKeyHandler(combo, onlyMine) {
      const mousetrap = this.lichess.mousetrap;
      if (!mousetrap) return null;
      for (const key in mousetrap.bindings) {
        const arr = mousetrap.bindings[key];
        const index = arr.findIndex(b => b.combination == combo);
        if (index >= 0) {
          return !onlyMine || arr[index].lichessTools
            ? arr[index].callback
            : null;
        }
      }
    }

    unbindKeyHandler(combo, onlyMine) {
      const mousetrap = this.lichess.mousetrap;
      if (!mousetrap) return null;
      for (const key in mousetrap.bindings) {
        const arr = mousetrap.bindings[key];
        this.arrayRemoveAll(arr, b => (!onlyMine || b.lichessTools) && b.combination === combo);
      }
    }

    bindKeyHandler(combo, func, notMine) {
      const mousetrap = this.lichess.mousetrap;
      if (!mousetrap) return null;
      const handler = this.getKeyHandler(combo);
      if (handler) {
        this.global.console.warn('Key handler for ' + combo + ' already bound!');
        return false;
      }
      mousetrap.bind(combo, func);
      if (!notMine) {
        for (const key in mousetrap.bindings) {
          const arr = mousetrap.bindings[key];
          const item = arr.find(b => b.combination == combo);
          if (item) {
            item.lichessTools = true;
          }
        }
      }
      return true;
    }

    async writeToClipboard(value, successText, failText) {
      const navigator = this.global.navigator;
      const console = this.global.console;
      const announce = this.announce;
      const hasPermission = async ()=>{
        try {
          const permission = await navigator.permissions.query({ name: 'clipboard-write' });
          return ['granted', 'prompt'].includes(permission?.state);
        } catch (e) {
        }
      };
      let announcement = failText;
      const permission = await hasPermission();
      if (permission !== false) {
        try {
          await navigator.clipboard.writeText(value);
          announcement = successText;
        } catch(e) {
          console.warn('Error copying PGN to clipboard',e);
        }
      }
      announce(announcement);
    }

    htmlEncode = (text) => {
      const document = this.global.document;
      return document.createElement('a')
        .appendChild(document.createTextNode(text))
        .parentNode.innerHTML;
    };

    async getMemorySize() {
      return this.global.navigator?.deviceMemory || (await this.global.navigator?.storage?.estimate())?.quota/(1024*1024*1024);
    }

    debounce(fn, wait) {
      let timeout = null;
      let isRunning = false;
      const c = () => {
        this.global.clearTimeout(timeout);
        timeout = null;
      };
      const t = (f) => {
        timeout = this.global.setTimeout(f, wait);
      };
      return function () {
        const context = this;
        const args = arguments;
        const f = function () {
          if (isRunning) {
            t(f);
            return;
          };
          isRunning = true;
          const result = fn.apply(context, args);
          if (result?.then) {
            result.then(() => isRunning = false);
          } else {
            isRunning = false;
          }
        };
        timeout
          ? c() || t(f)
          : t(f);
      };
    }

    getPgnTag(text, tagName) {
      if (!text) return null;
      const m = new RegExp('\\[\s*' + this.escapeRegex(tagName) + '\\s+"([^"]+)"\s*\\]').exec(text);
      return m && m[1];
    }

    announce = this.debounce((text, duration, date) => {
      this.announceDirect({
        msg: text,
        duration: duration,
        date: date
      });
    }, 1000);

    announceDirect = (d) => {
      const $ = this.$;
      let timeout;
      const kill = () => {
        if (timeout) clearTimeout(timeout);
        timeout = undefined;
        $('#announce').remove();
      };
      kill();
      if (!d?.msg) return;
      $('<div id="announce" class="announce">')
        .append($('<span>').text(d.msg))
        .append(d.date ? $('<time class="timeago">').attr('datetime', d.date) : '')
        .append($('<div class="actions">').append($('<a class="close">').text('x').on('click', kill)))
        .appendTo('body');
      const duration = +d.duration || (d.date ? new Date(d.date).getTime() - Date.now() : 5000);
      timeout = this.global.setTimeout(kill, duration);
      if (d.date) {
        this.uiApi.initializeDom();
      }
    };

    timeout(ms) {
      return new Promise(resolve => this.global.setTimeout(resolve, ms));
    }

    escapeRegex = (text) => {
      if (text === undefined || text === null) return '';
      return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    isOptionSet = (optionValues, searchValue, defaultValue) => {
      if (optionValues === undefined || optionValues === null) return false;
      if (new RegExp(',' + this.escapeRegex(searchValue.toString()) + ',', 'i').test(',' + optionValues + ',')) return true;
      if (optionValues === true || optionValues === 'true') {
        if (searchValue === false || searchValue === 'false') return false;
        if (defaultValue) return new RegExp(',' + this.escapeRegex(searchValue.toString()) + ',', 'i').test(',' + defaultValue + ',');
        return true;
      }
      return false;
    };

    getGameTime(timeControl, notPgn) {
      if (!timeControl) return '';
      const m = /^([\d\u00bc\u00bd]+)(?:\+(\d+))?$/.exec(timeControl);
      if (!m) return timeControl;
      let initial;
      switch (m[1]) {
        case '\u00bd': initial = 0.5; break;
        case '\u00bc': initial = 0.25; break;
        default: initial = +m[1] * (notPgn ? 60 : 1); break;
      }
      const increment = m[2] ? +m[2] : 0;
      const time = initial + 40 * increment;
      if (!time) return timeControl;
      if (time >= 1500) return 'classical';
      if (time >= 480) return 'rapid';
      if (time >= 180) return 'blitz';
      if (time >= 30) return 'bullet';
      return 'ultrabullet';
    }

    async isAudioAllowed() {
      if (this.audioAllowed) return true;
      // TODO maybe readd when Chrome allows knowing if the 'sound' permission has been granted for the site
      //if (!navigator.userActivation.hasBeenActive) return false;
      const ac = new AudioContext();
      await this.timeout(10);
      const state = ac.state != 'suspended';
      this.audioAllowed = state;
      return state;
    }

    isMobile() {
      const $ = this.$;
      return $('body').is('.mobile');
    }

    getTvOptions = () => {
      const $ = this.$;
      const inAnalysisMode = !!this.lichess.analysis;
      const mTv = !inAnalysisMode && /\/tv(\/([^\/]+))?/.exec(this.global.location.pathname);
      const mUser = /\/@\/([^\/]+)/.exec(this.global.location.pathname);
      const analysisUrl = $('div.buttons .analysis').attr('href') || '';
      const mAnalysis = /^\/([^\/]+)\/?(black)?/.exec(analysisUrl);
      return {
        isTv: !!mTv,
        isUserTv: !!mTv && !!mUser,
        user: !!mTv && mUser && mUser[1],
        channel: mTv && !mUser && (mTv[2] || 'best'),
        gameId: !!mAnalysis && mAnalysis[1],
        isBlack: !!mAnalysis && mAnalysis[2]
      };
    };

    getNodeComment(node) {
      const userId = this.getUserId();
      const comment = (node?.comments || []).find(c => c?.by?.id.toLowerCase() == userId?.toLowerCase())?.text;
      return comment;
    }

    getNodeCommentsText(node) {
      const commentText = (node?.comments || []).map(c => c.text).join('\r\n');
      return commentText;
    }

    saveComment = (text, path, chapterId) => {
      const analysis = this.lichess?.analysis;
      if (!chapterId) chapterId = analysis.study.currentChapter().id;
      if (!path) path = analysis.path;
      analysis.study.makeChange('setComment',
        {
          ch: chapterId,
          path: path,
          text
        });
    };

    isCommented(node) {
      return !!node.comments?.length;
    }

    isLastInLine(node) {
      return !node.children?.length;
    }

    isMate(node) {
      return node.san?.endsWith('#');
    }

    isCheck(node) {
      return node.san?.includes('+');
    }

    getNodePosition(node) {
      return this.getFenPosition(node.fen);
    }

    getFenPosition(fen) {
      let index = fen.length - 1;
      let spaces = 0;
      while (index >= 0 && spaces < 2) {
        if (fen[index] === ' ') spaces++;
        index--;
      }
      return fen.slice(0, index + 1);
    }

    treeviewVisibleCache = {
      time: 0,
      value: true
    };
    isTreeviewVisible = (forced) => {
      const now = Date.now();
      if (forced || now - this.treeviewVisibleCache.time > 100) {
        this.treeviewVisibleCache.value = (this.$('div.tview2').length > 0);
        this.treeviewVisibleCache.time = now;
      }
      return this.treeviewVisibleCache.value;
    };

    rectIntersection = (r1, r2) => {
      const intersection = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x)) * Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y));
      const minArea = Math.min(r1.width * r1.height, r2.width * r2.height);
      return minArea ? intersection / minArea : 0;
    };

    inViewport = (element) => {
      if (element?.length === 0) return 0;
      if (element?.length) element = element[0];
      if (!element?.offsetParent && $(element).css('position') != 'fixed') return 0;
      if (this.global.document.visibilityState == 'hidden') return 0;
      if (element?.checkVisibility) {
        if (!element.checkVisibility({ visibilityProperty: true, opacityProperty:true })) return 0;
      }
      const rect = element.getBoundingClientRect();
      const port = new DOMRect(0, 0, $(window).width(), $(window).height());
      return this.rectIntersection(rect, port);
    };

    computeCollapsedRegex = () => {
      const $ = this.$;
      const lichess = this.lichess;
      const container = $('div.analyse__moves');

      const collapsedPaths = [];
      $('lines.collapsed', container).each((i, e) => {
        let interrupt = false;
        let $e = $(e);
        if ($e.parent().is('interrupt')) {
          $e = $e.parent();
          interrupt = true;
        }
        $e = $e.prev('move');
        if ($e.is('.empty')) $e = $e.prev('move');
        const p = $e.attr('p');
        if (p) {
          collapsedPaths.push(interrupt ? p.slice(0, -2) : p);
        }
      });
      const collapsedRegex = collapsedPaths.length
        ? new RegExp('^(' + collapsedPaths.map(p => this.escapeRegex(p)).join('|') + ')')
        : null;
      if (this.collapsedRegex != collapsedRegex) {
        this.collapsedRegex = collapsedRegex;
        this?.emitRedraw();
      }
      this.debug && this.global.console.debug('Computed collapsed regex');
    };
    computeCollapsedRegexDebounced = this.debounce(this.computeCollapsedRegex, 500);

    elementCache = new Map();
    resetCache = () => {
      const $ = this.$;
      const lichess = this.lichess;
      this.elementCache.clear();
      const container = $('div.analyse__moves');

      $('move', container).each((i, e) => {
        const $e = $(e);
        if ($e.is('.empty')) return;
        const p = $e.attr('p') || '';
        this.elementCache.set(p, e);
      });
      this.debug && this.global.console.debug('Element cache reset');
    };

    getElementForPath(path) {
      const $ = this.$;
      let elem = this.elementCache?.get(path);
      if (!elem?.offsetParent) {
        if (!elem) {
          if (this.collapsedRegex?.test(path)) {
            this.debug && this.global.console.debug(path + ' is collapsed');
            this.computeCollapsedRegexDebounced();
            return;
          }
          this.computeCollapsedRegex();
          if (this.collapsedRegex?.test(path)) {
            this.debug && this.global.console.debug(path + ' is collapsed');
            return;
          }
        }
        this.resetCache();
        elem = this.elementCache.get(path);
      } else {
        if (this.debug && this.collapsedRegex?.test(path)) {
          if (!this.lichess.analysis.tree.pathIsMainline(path)) {
            this.global.console.debug('Elem for non mainline path ' + path + ' exists, but is marked as collapsed!');
          }
        }
      }
      if (path && !elem) {
        if (this.isTreeviewVisible(true)) {
          this.debug && this.global.console.warn('Could not find elem for path ' + path, this.global.location.href);
        }
      }
      return elem;
    }

    assertPathSet(node) {
      if (!node) return;
      if (node.path === undefined) throw 'Path for node ' + node.ply + ' ' + node.id + '( ' + node.san + ') not set!';
    }

    getElementForNode(node) {
      this.assertPathSet(node);
      const path = node.path || '';
      return this.getElementForPath(path);
    }

    traverse = (snode, func, forced) => {
      if (!snode) {
        snode = this.lichess?.analysis?.tree.root;
        snode.depth = 0;
        this.isTreeviewVisible(true);
      }
      const state = {
        lastMoves: [],
        checks: [],
        positions: {},
        glyphs: {},
        nodeIndex: +(snode?.nodeIndex) || 0
      };
      if (!snode || snode.comp) {
        return state;
      }
      const nodes = [{
        node: snode,
        path: ''
      }];
      while (nodes.length) {
        let { node, path } = { ...nodes.shift() };
        if (!forced && !this.isTreeviewVisible()) return;
        if (!node || node.comp) {
          continue;
        }
        path = (path || '') + node.id;
        node.path = path;
        node.nodeIndex = state.nodeIndex;
        state.nodeIndex++;
        node.isCommentedOrMate = this.isCommented(node) || this.isMate(node);
        node.position = this.getNodePosition(node);
        let pos = state.positions[node.position];
        if (!pos) {
          pos = [];
          state.positions[node.position] = pos;
        }
        pos.push(node);
        if (pos.length > 1) {
          for (const transpoNode of pos) {
            transpoNode.transposition = pos;
          }
        } else {
          node.transposition = null;
        }
        if (node.glyphs) {
          for (const glyph of node.glyphs) {
            const arr = state.glyphs[glyph.symbol] || [];
            arr.push(node);
            state.glyphs[glyph.symbol] = arr;
          }
        }
        if (this.isLastInLine(node)) {
          state.lastMoves.push(node);
        }
        if (this.isCheck(node)) {
          state.checks.push(node);
        }
        if (func) func(node, state);
        let first = true;
        for (const child of node.children) {
          child.depth = first ? node.depth : node.depth + 1;
          first = false;
          nodes.push({ node: child, path: path });
        }
      }
      return state;
    };

    getUserId = () => {
      return this.global.document.body.dataset?.user;
    };

    isFriendsPage = () => {
      return /\/following([\?#].*)?$/.test(this.global.location.href);
    };

    isFavoriteOpponentsPage = () => {
      return /\/player\/opponents\b/.test(this.global.location.href);
    };

    findGlyphNode = (color, symbols) => {
      if (typeof symbols === 'string') symbols = [symbols];
      const analysis = this.lichess?.analysis;
      if (!analysis) return;
      const state = this.traverse();
      const arr = [].concat.apply([], symbols.map(s => state.glyphs[s]).filter(a => !!a?.length));
      if (!arr.length) return;
      arr.sort((n1, n2) => n1.nodeIndex - n2.nodeIndex);
      const index = analysis.node.nodeIndex;
      const plyColor = color === 'white' ? 1 : 0;
      return arr.find(n => n.ply % 2 === plyColor && n.nodeIndex > index) || arr.find(n => n.ply % 2 === plyColor);
    };

    jumpToGlyphSymbols = (symbols, side) => {
      const analysis = this.lichess?.analysis;
      if (!analysis) return;
      let color = 'white';
      if (['undefined', 'boolean'].includes(typeof side)) {
        color = analysis.getOrientation();
        if (side) {
          color = color == 'black' ? 'white' : 'black';
        }
      } else {
        color = side;
      }
      const node = this.findGlyphNode(color, symbols);
      if (!node?.path) return;
      analysis.userJumpIfCan(node.path);
      analysis.redraw();
    };

    getPositionFromFen = (fen, deep) => {
      if (!fen) return;
      let result = fen.split(' ').slice(0, (deep ? 4 : 2)).join('')
                      .replaceAll('/', '')
                      .replaceAll(/,.*$/g,'');
      
      return result;
    };

    getPositionFromBoard = (el, asFen) => {
      if (!el) return;
      const $ = this.$;
      const map = {
        'king': 'k',
        'queen': 'q',
        'rook': 'r',
        'bishop': 'b',
        'knight': 'n',
        'pawn': 'p'
      }
      const elem = $(el).is('cg-container')
        ? el
        : $('cg-container', el)[0]
      const container = $(elem);
      if (!container.length || !this.inViewport(container)) return;

      const orientation = container.closest('.cg-wrap').is('.orientation-black') ? 'black' : 'white';
      const getKey = orientation == 'white'
        ? res => res.x + ',' + res.y
        : res => (7 - res.x) + ',' + (7 - res.y);

      const lastMove = {};
      let width = null;
      let parentOffset = null;
      $('square.last-move', container).each((i, s) => {
        let res;
        let key;
        if (s.cgKey) {
          res = {
            x: 104 - s.cgKey.charCodeAt(0),
            y: s.cgKey.charCodeAt(1) - 49
          };
          key = (7 - res.x) + ',' + (7 - res.y);
        } else {
          width = container.width() / 8;
          parentOffset = container.offset();
          const offset = $(s).offset();
          res = {
            x: Math.round((offset.left - parentOffset.left) / width),
            y: Math.round((offset.top - parentOffset.top) / width)
          };
          key = getKey(res)
        }
        lastMove[key] = true;
      });

      let turn = '';
      const pieceDict = {};
      $('piece', container).each((i, p) => {
        const piece = $(p);
        let res;
        let key;
        if (p.cgKey) {
          res = {
            x: 104 - p.cgKey.charCodeAt(0),
            y: p.cgKey.charCodeAt(1) - 49
          };
          key = (7 - res.x) + ',' + (7 - res.y);
        } else {
          if (!width) width = container.width() / 8;
          if (!parentOffset) parentOffset = container.offset();
          const offset = piece.offset();
          res = {
            x: Math.round((offset.left - parentOffset.left) / width),
            y: Math.round((offset.top - parentOffset.top) / width)
          };
          key = getKey(res);
        }
        const type = Array.from(p.classList).find(c => !['black', 'white'].includes(c));
        res.p = map[type];
        if (piece.is('.white')) {
          res.p = res.p?.toUpperCase();
          if (lastMove[key]) turn = 'black';
        } else
          if (piece.is('.black')) {
            if (lastMove[key]) turn = 'white';
          }
        if (res.p) pieceDict[key] = res;
      });
      if (!turn) {
        if (lastMove['4,7'] && (lastMove['0,7'] || lastMove['7,7'])) {
          turn = 'black';
        } else
          if (lastMove['4,0'] && (lastMove['0,0'] || lastMove['7,0'])) {
            turn = 'white';
          }
      }

      let pos = '';
      let s = 0;
      const putEmpties = () => {
        if (!s) return;
        pos += s;
        s = 0;
      };
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const key = x + ',' + y;
          const p = pieceDict[key]?.p;
          if (p) {
            putEmpties();
            pos += p;
          } else {
            s++;
          }
        }
        putEmpties();
        if (asFen && y < 7) pos += '/';
      }
      if (asFen) pos += ' ';
      if (!turn) {
        const maybeTurn = Array.from($('.copyables input'))
          .map(el => {
            const text = $(el).val();
            const m = /^\s*[rnbqkpRNBQKP1-8\/]+ ([wb])/.exec(text);
            return m && m[1];
          })
          .find(t => t);
        if (maybeTurn) {
          turn = maybeTurn;
        } else {
          turn = 'white';
        }
      }
      pos += turn[0];
      return pos;
    };

    isStartFen = (fen) => {
      return fen?.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    };

    getBoardFromFen = fen => {
      if (!fen) return null;
      const result = [];
      for (let i = 0; i < 8; i++) result.push(Array(8));
      const splits = fen.split(' ');
      fen = splits[0];
      let enpassant = splits[3];
      if (enpassant && enpassant != '-') {
        result.enpassant = {
          x: 104 - enpassant.charCodeAt(0),
          y: enpassant.charCodeAt(1) - 49
        };
      }
      let x = 0;
      let y = 0;
      for (let i = 0; i < fen.length; i++) {
        const ch = fen[i];
        if ('kqrbnp'.indexOf(ch.toLowerCase()) >= 0) {
          result[y][x] = ch;
          x++;
          continue;
        }
        if (ch == '/') {
          x = 0;
          y++;
          continue;
        }
        x += (+ch);
      }
      return result;
    };

    reverseFen = (fen) => {
      if (!fen) return fen;

      const flipCapitalization = s => {
        const pieces = 'RNBQKPrnbqkp';
        return s.split('').map(ch => {
          const i = pieces.indexOf(ch);
          if (i < 0) return ch;
          return pieces[(i + 6) % 12];
        }).join('');
      };

      const splits = fen.split(' ');
      splits[0] = flipCapitalization(splits[0].split('/').reverse().join('/'));
      if (splits[1]) {
        splits[1] = splits[1] == 'w' ? 'b' : 'w';
      }
      if (splits[2]) {
        splits[2] = flipCapitalization(splits[2]);
        const arr = splits[2].split('');
        arr.sort();
        splits[2] = arr.join('');
      }
      if (splits[3]) {
        const m = /^([a-h])([1-8])$/.test(splits[3]);
        if (m) {
          splits[3] = m[1] + (9 - (+m[2]));
        }
      }
      return splits.join(' ');
    };

    makeSvg = (svgText, chessground) => {
      return {
        html: svgText
        //,center: 'orig'
      };
    }

    isIOS = () => {
      return /iPhone|iPod|iPad|Macintosh/.test(navigator.userAgent);
    };

    speechVolume = 0.7;
    speechRate = 1;
    speechVoiceIndex = undefined;
    speak = async (text, options) => {
      let volume = +options?.volume;
      if (Number.isNaN(volume)) {
        volume = this.soundVolume == undefined
                   ? this.speechVolume
                   : this.soundVolume/100;
      }
      options = {
        volume: volume,
        voiceIndex: options?.voiceIndex === undefined ? this.speechVoiceIndex : options.voiceIndex,
        translated: !!options?.translated,
        rate: options?.rate || this.speechRate
      };
      const console = this.global.console;
      try {
        const msg = new SpeechSynthesisUtterance(text);
        msg.volume = options.volume;
        msg.lang = options.translated ? document.documentElement.lang : 'en-US';
        msg.rate = options.rate;
        if (options.voiceIndex !== undefined) {
          const voices = this.global.speechSynthesis?.getVoices();
          if (voices) msg.voice = voices[options.voiceIndex];
        }
        if (!this.isIOS()) {
          // speech events are unreliable on iOS, but iphones do their own cancellation
          const sound = this.lichess?.sound;
          msg.onstart = () => sound?.listeners.forEach(l => l('start', text));
          msg.onend = msg.onerror = () => sound?.listeners.forEach(l => l('stop'));
        }
        this.global.speechSynthesis?.speak(msg);
        return new Promise(resolve => {
          msg.onend = msg.onerror = () => {
            resolve();
          }
        });
      } catch (e) {
        if (this.debug) console.debug('Speech error:', e);
      }
    };

    play = async (path, volume) => {
      const sound = await this.lichess.sound.load(path, this.lichess.sound.url(path));
      volume = +volume;
      if (Number.isNaN(volume)) {
        volume = this.soundVolume == undefined
                   ? 0.7
                   : this.soundVolume/100;
      }
      await sound.play(this.lichess.sound.getVolume() * volume);
    };

    isDark = () => {
      const $ = this.$;
      const html = $.cached('html');
      if (html.is('.light')) return false;
      if (html.is('.dark,.darkBoard,.transp')) return true;
      return this.global.matchMedia && this.global.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    random = () => {
      const arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      const mantissa = (arr[0] * Math.pow(2, 20)) + (arr[1] >>> 12);
      return mantissa * Math.pow(2, -52);
    };

    hash = (text) => {
      let hval = 0x811c9dc5;
      if (!text) return hval;
      for (let i = 0; i < text.length; i++) {
        hval = hval ^ (text.charCodeAt(i));
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
      }
      return (hval >>> 0).toString(16);
    }

    randomToken = () => {
      const crypto = this.global.crypto;
      if (crypto) {
        try {
          const data = crypto.getRandomValues(new Uint8Array(9));
          return btoa(String.fromCharCode(...data)).replace(/[/+]/g, '_');
        } catch (_) { };
      }
      return this.global.Math.random().toString(36).slice(2, 12);
    };


    jsonParse = (funcOrText, defaultValue) => {
      const console = this.global.console;
      let json = 'unknown';
      try {
        json = typeof funcOrText == 'function'
          ? funcOrText()
          : funcOrText;
        if (!json || json === 'undefined') return defaultValue;
        const result = this.global.JSON.parse(json);
        return result || defaultValue;
      } catch (ex) {
        console.warn('Error parsing JSON: ', json, ex);
        return defaultValue;
      }
    };

    ndjsonParse = (funcOrText, defaultValue) => {
      const console = this.global.console;
      let json = 'unknown';
      try {
        json = typeof funcOrText == 'function'
          ? funcOrText()
          : funcOrText;
        if (!json || json === 'undefined') return defaultValue;
        const result = json.split(/\r?\n/).filter(s => s?.trim()).map(s => this.global.JSON.parse(s));
        return result || defaultValue;
      } catch (ex) {
        console.warn('Error parsing JSON: ', json, ex);
        return defaultValue;
      }
    };

    getColor = (text) => {
      const m = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(text);
      const parseInt = this.global.parseInt;
      return {
        R: parseInt(m[1], 16),
        G: parseInt(m[2], 16),
        B: parseInt(m[3], 16),
        A: m[4] ? parseInt(m[4], 16) : 255
      };
    };

    getGradientColor = (q, gradient) => {
      let prev = null;
      for (const gr of gradient) {
        if (q >= prev?.q && q <= gr.q) {
          const c1 = this.getColor(prev.color);
          const c2 = this.getColor(gr.color);
          const localQ = (q - prev.q) / (gr.q - prev.q);
          const color = '#' + Math.round(c1.R + (c2.R - c1.R) * localQ).toString(16).padStart(2, '0')
            + Math.round(c1.G + (c2.G - c1.G) * localQ).toString(16).padStart(2, '0')
            + Math.round(c1.B + (c2.B - c1.B) * localQ).toString(16).padStart(2, '0')
            + Math.round(c1.A + (c2.A - c1.A) * localQ).toString(16).padStart(2, '0');
          return color;
        }
        prev = gr;
      }
      return prev?.color || '#808080';
    };

    clone = (obj) => {
      if (!obj) return obj;
      return this.global.JSON.parse(this.global.JSON.stringify(obj));
    };

    isGamePlaying() {
      return this.lichess.analysis?.ongoing || this.lichess.analysis?.studyPractice;
      /*const game = this.lichess.analysis?.data?.game;
      if (!game) return false;
      if (game.id=='synthetic') return false;
      if (game.status.id>20) return false;
      return true;*/
    }

    assetUrl(url) {
      const func = this.lichess.asset.url.bind(this.lichess);
      return func(url);
    }

    isTouchDevice() {
      return !this.global.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    getToolByName(name) {
      return this.tools.find(t => t.name == name);
    }

    intl = {
      lichessTools: this,
      defaultLanguage: 'en-US',
      'en-US': {
        'LiChess Tools': 'LiChess Tools',
        serverOverload: 'Lichess thinks we are overloading their system!'
      },
      'ro-RO': {
        serverOverload: 'Lichess crede c\u0103 le supra\u00eenc\u0103rc\u0103m sistemul!'
      },
      get lang() {
        const lt = this.lichessTools;
        let lang = lt.global.document.documentElement.lang || this.defaultLanguage;
        if (!this[lang] && !this[lang+'-crowdin']) lang = this.defaultLanguage;
        return lang;
      },
      get isTranslated() {
        return this.lang != this.defaultLanguage;
      },
      get siteI18n() {
        const lt = this.lichessTools;
        if (lt.debug) {
          const allKeys = Object.keys(this[this.defaultLanguage]);
          const langKeys = Object.keys({ ...this[this.lang], ...this[this.lang+'-crowdin'] });
          const missingKeys = new Set(allKeys);
          for (const key of langKeys) missingKeys.delete(key);
          const orphanKeys = new Set(langKeys);
          for (const key of allKeys) orphanKeys.delete(key);
          if (missingKeys.size) lt.global.console.debug(missingKeys.size+' missing keys for '+this.lang+': '+[...missingKeys].join(', '));
          if (orphanKeys.size) lt.global.console.debug(orphanKeys.size+' orphan keys in '+this.lang+': '+[...orphanKeys].join(', '));
        }
        return { ...this[this.defaultLanguage], ...this[this.lang], ...this[this.lang+'-crowdin'] };
      }
    }

    net = {
      lichessTools: this,
      slowMode: false,
      slowModeTimeout: null,
      logNetwork: function (url, size, status) {
        const lt = this.lichessTools;
        const now = Date.now();
        if (!this.networkLog) {
          this.networkLog = lt.jsonParse(_ => lt.global.localStorage.getItem('LiChessTools2.fetch'), { size: 0, count: 0, arr: [], minTime: now });
        }
        this.networkLog.size += size;
        this.networkLog.count++;
        this.networkLog.arr.push({
          time: now,
          url: url,
          size: size,
          status: status
        });
        if (this.networkLog.arr.length > 20000) {
          this.networkLog.arr.splice(0, 2000);
          this.storeLog();
        }
        if (lt.debug) {
          const rate = this.networkLog.size ? Math.round(8 * this.networkLog.size / (now - this.networkLog.minTime)) : 0;
          const avgSize = this.networkLog.size ? Math.round(8 * this.networkLog.size / this.networkLog.count) : 0;
          const logSize = lt.global.JSON.stringify(this.networkLog).length;
          lt.global.console.debug('Fetch log size:', logSize);
          lt.global.console.debug('  ... Bandwith logged:', this.networkLog.size, 'Rate:', rate, 'kbps', 'Avg call size:', avgSize, 'kbps');
        }
      },
      storeLog: function () {
        const lt = this.lichessTools;
        const text = lt.global.JSON.stringify(this.networkLog);
        lt.global.localStorage.setItem('LiChessTools2.fetch', text);
      },
      json: async function (url, options) {
        const lt = this.lichessTools;
        if (!options) options = {};
        if (!options.headers) options.headers = {};
        options.headers.Accept ||= 'application/json';
        options.headers['x-requested-with'] ||= 'XMLHttpRequest';
        const json = await this.fetch(url, options);
        if (!json) return null;
        if (options.ndjson) {
          return lt.ndjsonParse(json);
        } else {
          return lt.jsonParse(json);
        }
      },
      fetch: async function (url, options) {
        const lt = this.lichessTools;
        const console = lt.global.console;
        try {
          let args = null;
          if (typeof url != 'string') {
            args = url.args;
            url = url.url;
          }
          if (!url) throw new Error('URL has to be string or {url, args}');
          if (args) {
            for (const k in args) {
              url = url.replace('{' + k + '}', lt.global.encodeURIComponent(args[k]));
            }
          }
          if (this.slowMode) await lt.timeout(1000);
          const response = await lt.global.fetch(url, options);
          const status = +(response.status);
          if (options?.ignoreStatuses?.includes(status)) {
            this.logNetwork(url, (options?.body?.length || 0), status);
            return null;
          }
          if (!response.ok) {
            console.warn('fetch: ' + url + ': [' + response.type + '] ' + response.status + ' (' + response.statusText + ')');
          }
          if (status >= 400) {
            this.logNetwork(url, (options?.body?.length || 0), status);
            if (status == 429) {
              console.debug('429 received!');
              const translation = lt.translator.noarg('serverOverload');
              lt.announce(translation);
              this.slowMode = true;
              lt.global.clearTimeout(this.slowModeTimeout);
              this.slowModeTimeout = lt.global.setTimeout(() => this.slowMode = false, 60000);
            }
            const err = new Error('Response status: ' + status);
            err.response = response;
            err.url = url;
            err.options = options;
            throw err;
          }
          const text = await response.text();
          this.logNetwork(url, (options?.body?.length || 0) + (text?.length || 0), status);
          return text;
        } catch (e) {
          if (e.toString().includes('Failed to fetch')) {
            console.log('Fetch for ' + url + ' failed: ', e, status);
          } else {
            console.warn('Fetch for ' + url + ' failed: ', e, status);
          }
          throw e;
        };
      }
    };

    storage = {
      lichessTools: this,
      get supportsDb() { 
        const lt = this.lichessTools;
        return !!lt.global.indexedDB;
      },
      getStore: function (options) {
        const lt = this.lichessTools;
        if (options?.db) {
          if (!this.supportsDb) {
            throw new Error('System doesn\' support indexedDB');
          }
          return new IndexedDbStorage();
        }
        const store = options?.session
          ? lt.global.sessionStorage
          : lt.global.localStorage;
        return store;
      },
      get: function (key, options) {
        const lt = this.lichessTools;
        const store = this.getStore(options);
        let text = store.getItem(key);
        if (text && options?.zip) {
          try {
            const decompressed = LiChessTools.unzip(text);
            if (decompressed != null) text = decompressed;
          } catch (ex) {
            lt.global.console.debug('Cannot unzip text. Using raw', ex);
          }
        }
        if (text === undefined || options?.raw) return text;
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Error parsing JSON', e);
          return text;
        }
      },
      set: function (key, value, options) {
        const lt = this.lichessTools;
        const store = this.getStore(options);
        if (value === undefined) {
          store.removeItem(key);
          return;
        }
        let text = options?.raw ? value : JSON.stringify(value);
        if (options?.zip) {
          try {
            const compressed = LiChessTools.zip(text);
            if (compressed != null) text = compressed;
          } catch (ex) {
            lt.global.console.debug('Cannot zip text. Using raw', ex);
          }
        }
        store.setItem(key, text);
      },
      remove: function (key, options) {
        const store = this.getStore(options);
        store.removeItem(key);
      },
      listen: function (key, func, options) {
        const lt = this.lichessTools;
        if (options?.session) throw new Error('You cannot listen to events on session storage, only local');
        const $ = lt.$;
        $(lt.global).on('storage', e => {
          const store = this.getStore(options);
          if (e.key !== key || e.storageArea !== store || e.newValue === null) return;
          const parsed = lt.jsonParse(e.newValue);
          if (parsed?.sri && parsed.sri !== lt.sri) func(parsed);
        });
      },
      fire: function (key, value, options) {
        const lt = this.lichessTools;
        if (options?.session) throw new Error('You cannot fire events on session storage, only local');
        this.set(key, {
          sri: lt.sri,
          nonce: lt.global.Math.random(), // ensure item changes
          value: value,
        }, options);
      }
    };

    comm = {
      lichessTools: this,
      timeout: 5000,
      sendResponses: [],
      init: function () {
        const lt = this.lichessTools;
        lt.global.addEventListener('LichessTools.receive', (ev) => {
          const sendResponse = this.sendResponses[ev.detail.uid];
          if (sendResponse) {
            delete this.sendResponses[ev.detail.uid];
            sendResponse(ev.detail);
          }
        });
      },
      send: function (data, sendResponse, timeout) {
        const lt = this.lichessTools;
        const uid = crypto.randomUUID();
        return new Promise((resolve, reject) => {
          const pointer = setTimeout(() => reject(new Error('Send timeout')), timeout || this.timeout);
          const f = (data) => {
            clearTimeout(pointer);
            if (sendResponse) sendResponse(data);
            resolve(data);
          };
          this.sendResponses[uid] = f;
          const customEvent = new CustomEvent("LichessTools.send", {
            detail: { ...data, uid: uid },
            bubbles: true,
            cancelable: true,
            composed: false,
          });
          lt.global.dispatchEvent(customEvent);
        });
      },
      _files: new Map(),
      getData: async function(filename, retries=3) {
        const lt = this.lichessTools;
        let data = this._files.get(filename);
        let error = null;
        for (let i=0; i<retries && !data; i++) {
          data = await lt.comm.send({ type: 'getFile', options: { filename: 'data/'+filename } })
                                             .catch(e => { error = e; });
        }
        if (data) {
          this._files.set(filename,data);
        } else {
          if (error) lt.global.console.error(error);
        }
        return data;
      }
    };

    cache = {
      lichessTools: this,
      init: function () {
        const lt = this.lichessTools;
        const sessionData = lt.storage.get('LichessTools.GeneralCache', { session: true, zip: true }) || [];
        const localData = lt.storage.get('LichessTools.GeneralCache', { session: false, zip: true }) || [];
        this._cache = new Map(sessionData.concat(localData));
        this.save = lt.debounce(this.saveDirect, 1000);
      },
      saveDirect: function () {
        const lt = this.lichessTools;
        if (!this._cache) return;
        let data = [...this._cache.entries()].filter(e => e[1].persist == 'session');
        if (data.length) {
          lt.storage.set('LichessTools.GeneralCache', data, { session: true, zip: true });
        }
        data = [...this._cache.entries()].filter(e => e[1].persist == 'local');
        if (data.length) {
          lt.storage.set('LichessTools.GeneralCache', data, { session: false, zip: true });
        }
      },
      getCached: function (key) {
        if (!this._cache) {
          this.init();
        }
        const cached = this._cache.get(key);
        if (cached) {
          cached.isExpired = cached.expiry < Date.now();
        }
        return cached;
      },
      setCached: function (key, value, options) {
        if (!this._cache) {
          this.init();
        }
        const cached = {
          key: key,
          value: value,
          expiry: Date.now() + options.interval,
          persist: options.persist
        };
        this._cache.set(key, cached);
        this.save();
      },
      memoizeAsyncFunction: function (obj, funcName, options) {
        const cache = this;
        const lt = cache.lichessTools;
        const original = obj[funcName];
        obj[funcName] = async function (...args) {
          const key = options.keyFunction
            ? options.keyFunction(obj, funcName, args)
            : funcName + JSON.stringify(args);
          const cached = cache.getCached(key);
          if (cached && !cached.isExpired) {
            if (options.sliding) {
              cache.setCached(key, cached.value, options);
            }
            return cached.value;
          }
          lt.$('body').addClass('lichessTools-apiLoading');
          try {
            const result = await original.apply(obj, args);
            cache.setCached(key, result, options);
            return result;
          } finally {
            lt.$('body').removeClass('lichessTools-apiLoading');
          }
        }
      }
    };

    api = {
      lichessTools: this,
      init: function () {
        const lt = this.lichessTools;
        lt.cache.memoizeAsyncFunction(lt.api.team, 'getUserTeams', { persist: 'session', interval: 10 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.team, 'getTeamPlayers', { persist: 'session', interval: 10 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.evaluation, 'getChessDb', { persist: 'session', interval: 1 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.evaluation, 'getLichess', { persist: 'session', interval: 1 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.timeline, 'get', { persist: 'session', interval: 60 * 1000 });
      },
      blog: {
        lichessTools: this,
        save: async function (blogId, data) {
          const lt = this.lichessTools;
          const bodyContent = data.map(a => a.name + '=' + lt.global.encodeURIComponent(a.value)).join('&');
          await lt.net.fetch({
            url: '/ublog/{blogId}/edit',
            args: { blogId }
          },
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body: bodyContent,
              method: 'POST',
              mode: 'cors',
              credentials: 'include'
            });
        }
      },
      study: {
        lichessTools: this,
        getChapterPgn: async function (studyId, chapterId) {
          const lt = this.lichessTools;
          const pgn = await lt.net.fetch({
            url: '/study/{studyId}/{chapterId}.pgn',
            args: { studyId, chapterId }
          });
          return pgn;
        },
        getStudyListPage: async function (baseUrl, page) {
          const lt = this.lichessTools;
          const mm = /\/(hot|newest|updated|popular)$/.exec(lt.global.location.pathname);
          const mode = mm?.at(1) || 'hot';
          const p = baseUrl.includes('?') ? '&' : '?';
          const json = await lt.net.json(baseUrl + p + 'page=' + page);
          return json;
        }
      },
      puzzle: {
        lichessTools: this,
        getPuzzle: async function(puzzleId) {
          const lt = this.lichessTools;
          const data = await lt.net.json({
            url: '/api/puzzle/{id}',
            args: {
              id: puzzleId
            }
          });
          return data;
        },
        getDashboard: async function(days) {
          const lt = this.lichessTools;
          const data = await lt.net.json({
            url: '/api/puzzle/dashboard/{days}',
            args: {
              days: days
            }
          });
          return data;
        }
      },
      user: {
        lichessTools: this,
        getUsers: async function (userIds) {
          const lt = this.lichessTools;
          const users = await lt.net.json('/api/users', {
            method: 'POST',
            body: userIds.join(',')
          });
          return users || [];
        },
        getUserStatus: async function (userIds, options) {
          const lt = this.lichessTools;
          const query = options
            ? '&' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const arr = await lt.net.json({
            url: '/api/users/status?ids={ids}' + query,
            args: {
              ids: userIds.join(',')
            }
          });
          return arr;
        },
        getMini: async function (userId) {
          const lt = this.lichessTools;
          const html = await lt.net.fetch({
            url: '/@/{userId}/mini',
            args: { userId }
          });
          return html;
        },
        getUserPerfStats: async function (userId, timeControl) {
          const lt = this.lichessTools;
          const data = await lt.net.json({ url: '/@/{userId}/perf/{timeControl}', args: { userId, timeControl } });
          return data;
        }
      },
      game: {
        lichessTools: this,
        getPgns: async function (gameIds, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const pgn = await lt.net.fetch(
            '/api/games/export/_ids' + query,
            {
              method: 'POST',
              headers: {
                'Accept':'application/x-chess-pgn'
              },
              body: gameIds.join(','),
              cache: 'default'
            }
          );
          return pgn;
        },
        getUserPgns: async function (userId, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const pgn = await lt.net.fetch(
            {
              url: '/api/games/user/{userId}' + query,
              args: { userId }
            }
          );
          return pgn;
        },
        getMini: async function (gameId, color) {
          const lt = this.lichessTools;
          const html = await lt.net.fetch({
            url: '/{gameId}' + (color == 'White' ? '/white' : '/black') + '/mini',
            args: { gameId }
          });
          return html;
        }
      },
      team: {
        lichessTools: this,
        getUserTeams: async function (userId) {
          const lt = this.lichessTools;
          const teams = await lt.net.json({
            url: '/api/team/of/{userId}',
            args: { userId }
          });
          return teams;
        },
        getTeamPlayers: async function (teamId) {
          const lt = this.lichessTools;
          const players = await lt.net.json({
            url: '/api/team/{teamId}/users',
            args: { teamId }
          }, { ndjson: true });
          return players;
        }
      },
      streamer: {
        lichessTools: this,
        getLiveStreamers: async function () {
          const lt = this.lichessTools;
          const streamers = await lt.net.json('/api/streamer/live');
          return streamers;
        }
      },
      evaluation: {
        lichessTools: this,
        getChessDb: async function (fen) {
          const lt = this.lichessTools;
          const json = await lt.net.fetch({
            url: 'https://www.chessdb.cn/cdb.php?action=queryall&board={fen}&json=1',
            args: { fen }
          }, {
            ignoreStatuses: [404]
          });
          const data = lt.jsonParse(json);
          return data;
        },
        getLichess: async function (fen, multiPv) {
          const lt = this.lichessTools;
          const analysis = lt.lichess.analysis;
          let data = null;
          let cachedByLichess = null;
          if (analysis) {
            cachedByLichess = analysis.evalCache?.fetchedByFen?.get(fen);
            if (cachedByLichess?.pvs?.length == multiPv) {
              data = cachedByLichess;
            }
          }
          if (!data) {
            data = await lt.net.json({
              url: '/api/cloud-eval?fen={fen}&multiPv={multiPv}',
              args: { fen, multiPv }
            }, {
              ignoreStatuses: [404]
            });
          }
          return !data || cachedByLichess?.pvs?.length > data?.pvs?.length
            ? cachedByLichess
            : data;
        }
      },
      notification: {
        lichessTools: this,
        getUnread: async function () {
          const lt = this.lichessTools;
          const data = await lt.net.json('/notify?page=1');
          return +(data?.unread) || 0;
        }
      },
      flair: {
        lichessTools: this,
        getList: async function () {
          const lt = this.lichessTools;
          const text = await lt.net.fetch(lt.assetUrl('flair/list.txt'));
          return text;
        }
      },
      timeline: {
        lichessTools: this,
        get: async function (lastRead) {
          const lt = this.lichessTools;
          const timeline = await lt.net.json({ url: '/api/timeline?nb=100&since={lastRead}', args: { lastRead } });
          return timeline;
        }
      },
      relations: {
        lichessTools: this,
        getFriends: async function () {
          const lt = this.lichessTools;
          let result = [];
          let page = await lt.net.json({ url: '/@/{userId}/following', args: { userId: lt.getUserId() } });
          while (page) {
            result=result.concat(page.paginator.currentPageResults);
            page = page.paginator.nextPage
              ? await lt.net.json({ url: '/@/{userId}/following?page={page}', args: { userId: lt.getUserId(), page: page.paginator.nextPage } })
              : null;
          }
          return result;
        }
      }
    }

    tools = [];
    loadTool(toolClass) {
      const setTimeout = this.global.setTimeout;
      const console = this.global.console;
      if (!toolClass) {
        console.warn('No tool class to load.');
        return;
      }
      try {
        const tool = new toolClass(this);
        this.tools.push(tool);
        this.tools[toolClass.name] = tool;
        if (tool.intl) {
          for (const lang in tool.intl) {
            let existingLang = this.intl[lang];
            if (!existingLang) {
              existingLang = {};
              this.intl[lang] = existingLang;
            }
            const toolLang = tool.intl[lang];
            for (const key in toolLang) {
              if (existingLang[key] === undefined) {
                existingLang[key] = toolLang[key];
              }
            }
            //this.intl[lang] = { ...this.intl[lang], ...tool.intl[lang] };
          }
        }
        if (tool.dependencies) {
          for (const name of tool.dependencies) {
            if (!this.getToolByName(name)) throw new Error('Tool ' + tool.name + ' has a dependency on ' + name + ' which was not loaded');
          }
        }
      } catch (e) {
        setTimeout(() => { throw e; }, 100);
      }
    }

    async init() {
      this.api.init();
      const setTimeout = this.global.setTimeout;
      const console = this.global.console;
      this.global.addEventListener('pagehide', () => {
        this.net.storeLog();
      });
      for (const tool of this.tools) {
        if (!tool?.init) continue;
        try {
          await tool.init().catch(e => { setTimeout(() => { throw e; }, 100); });
        } catch (e) {
          setTimeout(() => { throw e; }, 100);
        }
      }
    }

    async start(lichess) {
      if (!lichess) return;
      this.lichess = lichess;
      await lichess.load;
      const age = lichess.info?.date
        ? (Date.now() - new Date(lichess.info.date).getTime()) / 86400000
        : 0;
      this.global.console.debug('%c site code age: ' + Math.round(age * 10) / 10 + ' days', age < 7 ? 'background: red; color:white;' : '');
      await this.applyOptions();
      const debouncedApplyOptions = this.debounce(this.applyOptions, 250);
      this.storage?.listen('lichessTools.reloadOptions', () => {
        debouncedApplyOptions();
      });
    }

    fireReloadOptions = (samePage) => {
      this.storage.fire('lichessTools.reloadOptions');
      if (samePage) {
        this.global.dispatchEvent( new Event('storage') );
      }
    };

    getDefaultOptions() {
      const options = {
        enableLichessTools: true,
        showOptionsTableInConsole: false
      };
      const isLoggedIn = !!this.getUserId();
      for (const tool of this.tools) {
        if (!tool.preferences) continue;
        for (const preference of tool.preferences) {
          const defaultValue = (!isLoggedIn && preference.defaultNotLoggedInValue !== undefined) ? preference.defaultNotLoggedInValue : preference.defaultValue;
          options[preference.name] = defaultValue;
        }
      }
      return options;
    }

    async getOptions() {
      let options = this.global.localStorage.getItem('LiChessTools2.options');
      options = this.jsonParse(options);
      const defaults = this.getDefaultOptions();
      options = {
        loaded: !!options,
        ...defaults,
        ...options
      };
      options.getValue = function (optionName, optionValue) {
        if (!this.enableLichessTools) return false;
        return this[optionName]
      };
      return options;
    }

    applyOptions = async (options) => {
      const setTimeout = this.global.setTimeout;
      const console = this.global.console;
      if (options) {
        await this.saveOptions(options);
      }
      options = await this.getOptions();
      if (this.prevOptions === this.global.JSON.stringify(options)) {
        return;
      }
      this.prevOptions = this.global.JSON.stringify(options);
      this.currentOptions = options;
      this.$.cached('body').toggleClass('lichessTools', options.enableLichessTools);
      const group = options.getValue('showOptionsTableInConsole')
        ? console.group
        : console.groupCollapsed;
      group('Applying LiChess Tools options...');
      for (const tool of this.tools) {
        if (!tool?.start) continue;
        try {
          await tool.start().catch(e => { setTimeout(() => { throw e; }, 100); });
        } catch (e) {
          setTimeout(() => { throw e; }, 100);
        }
      }
      console.groupEnd();
    }

    async saveOptions(options) {
      const optionsJson = this.global.JSON.stringify(options);
      this.global.localStorage.setItem('LiChessTools2.options', optionsJson);
    }
  }

  class ToolBase {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }
    get name() {
      return this.constructor.name.replace(/Tool$/, '');
    }

    logOption(label, value) {
      const lt = this.lichessTools;
      lt.global.console.log(label + ' %c' + (value === undefined ? '' : value), 'color:#9980FF');
    }

    async init() {
    }

    async start() {
    }
  }

  class IndexedDbStorage {
    async getItem(key) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction(dbInfo.storeName,'readonly').objectStore(dbInfo.storeName);
      const result = store.get(dbInfo.itemName);
      return await this.actionPromise(result);
    }

    async setItem(key, value) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction(dbInfo.storeName,'readwrite').objectStore(dbInfo.storeName);
      const result = store.put(value, dbInfo.itemName);
      return await this.actionPromise(result);
    }

    async removeItem(key) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction(dbInfo.storeName,'readwrite').objectStore(dbInfo.storeName);
      const result = store.delete(dbInfo.itemName);
      return await this.actionPromise(result);
    }

    getDbInfo(key) {
      const match=/^(?<dbName>[^\/]+?)(?::(?<version>\d+))?\/(?<storeName>[^\/]+?)\/(?<itemName>[^\/]+)$/.exec(key);
      if (!match) throw new Error('Invalid db storage key: '+key);
      const { dbName, version, storeName, itemName } = match.groups;
      return { dbName, version:+(version) || 1, storeName, itemName };
    }

    actionPromise(res) {
      return new Promise((resolve, reject) => {
        res.onsuccess = (e) => resolve(e.target.result);
        res.onerror = (e) => reject(e.target.result);
      });
    }

    async dbConnect(dbInfo) {
      return new Promise((resolve, reject) => {
        const result = globalThis.indexedDB.open(dbInfo.dbName, dbInfo.version);

        result.onsuccess = (e) => {
          const result = e.target.result;
          result.onversionchange = ()=>{
            result.close();
            throw new Error("Database is outdated, please reload the page.")
          };
          resolve(result);
        };
        result.onerror = (e) => reject(e.target.error ?? 'IndexedDB Unavailable');
        result.onupgradeneeded = (e) => {
          const db = e.target.result;
          const txn = e.target.transaction;
          const store = db.objectStoreNames.contains(dbInfo.storeName)
            ? txn.objectStore(dbInfo.storeName)
            : db.createObjectStore(dbInfo.storeName);

          dbInfo.upgrade?.(e, store);
        };
        result.onblocked = ()=>{
          throw new Error("Database is blocked, connection must be open elsewhere.")
        };
      });
    }
  }

  LiChessTools.Tools = {
    ToolBase: ToolBase
  };

  window.LiChessTools = LiChessTools;
})();
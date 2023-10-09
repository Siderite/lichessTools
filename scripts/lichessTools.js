(()=> {
  class LiChessTools {
    constructor(global, cash) {
      if (!cash || !global) throw new Error('usage: new LiChessTools(window, cash)');
      this.$=cash;
      this.global=global;
    }
  
    $=null;
    global=null;
    lichess=null;

    get debug() {
      const debug = this.global.localStorage.getItem('LiChessTools2.debug');
      return debug==='true';
    }
    set debug(value) {
      this.global.localStorage.setItem('LiChessTools2.debug',(!!value).toString());
    }
  
    arrayRemoveAll(arr,predicate) {
      if (!arr) return;
      let i=0;
      while (i<arr.length) {
        if (predicate(arr[i])) {
          arr.splice(i,1);
        } else {
          i++;
        }
      }
    }

    isWrappedFunction(func,id) {
      if (!func) return false;
      if (!id || func.__wrapId===id) {
        return !!func.__originalFunction;
      }
      return this.isWrappedFunction(func.__originalFunction,id);
    }
  
    wrapFunction(func,options) {
      const wrappedFunc = function() {
        let executeOriginal=true;
        if (options?.before) {
          const execute = options.before(this,...arguments);
          if (execute===false) executeOriginal=false;
        }
        let result=executeOriginal && func
          ? func.apply(this, arguments)
          : null;
        if (options?.after) {
          const newResult=options.after(this,result,...arguments);
          if (newResult!==undefined) result=newResult;
        }
        return result;
      };
      wrappedFunc.__originalFunction=func;
      wrappedFunc.__wrapId=options.id;
      return wrappedFunc;
    }

    unwrapFunction(func,id) {
      if (!func) return;
      if (!id || func.__wrapId===id) {
        return func.__originalFunction || func;
      }
      func.__originalFunction=this.unwrapFunction(func.__originalFunction,id);
      return func;
    }

    getKeyHandler(combo, onlyMine) {
      const mousetrap=this.lichess.mousetrap;
      if (!mousetrap) return null;
      for (const key in mousetrap.bindings) {
        const arr=mousetrap.bindings[key];
        const index=arr.findIndex(b=>b.combination==combo);
        if (index>=0) {
          return !onlyMine||arr[index].lichessTools
            ? arr[index].callback
            : null;
        }
      }
    }

    unbindKeyHandler(combo, onlyMine) {
      const mousetrap=this.lichess.mousetrap;
      if (!mousetrap) return null;
      for (const key in mousetrap.bindings) {
        const arr=mousetrap.bindings[key];
        this.arrayRemoveAll(arr,b=>(!onlyMine||b.lichessTools)&&b.combination===combo);
      }
    }

    bindKeyHandler(combo, func, notMine) {
      const mousetrap=this.lichess.mousetrap;
      if (!mousetrap) return null;
      const handler=this.getKeyHandler(combo);
      if (handler) {
        this.global.console.warn('Key handler for '+combo+' already bound!');
        return false;
      }
      mousetrap.bind(combo,func);
      if (!notMine) {
        for (const key in mousetrap.bindings) {
          const arr=mousetrap.bindings[key];
          const item=arr.find(b=>b.combination==combo);
          if (item) {
            item.lichessTools=true;
          }
        }
      }
      return true;
    }

    htmlEncode=(text)=>{
      const document=this.global.document;
      return document.createElement('a')
              .appendChild(document.createTextNode(text))
              .parentNode.innerHTML;
    };

    debounce(fn, wait) {
      let timeout = null;
      const c = () => {
        this.global.clearTimeout(timeout);
        timeout = null;
      };
      const t = (fn) => {
        timeout = this.global.setTimeout(fn, wait);
      };
      return function() {
        const context = this;
        const args = arguments;
        const f = function() {
          fn.apply(context, args);
        };
        timeout
          ? c() || t(f)
          : t(f);
      };
    }

    getPgnTag(text,tagName) {
      if (!text) return null;
      const m=new RegExp('\\[\s*'+tagName+'\\s+"([^"]+)"\s*\\]').exec(text);
      return m && m[1];
    }

    announce = this.debounce(text=>{
      this.lichess.announce({msg:text});
    },1000);

    timeout(ms) {
      return new Promise(resolve => this.global.setTimeout(resolve, ms));
    }

    escapeRegex=(text)=>{
      if (text===undefined || text===null) return '';
      return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    isOptionSet=(optionValues, searchValue, defaultValue)=>{
      if (optionValues===undefined || optionValues===null) return false;
      if (new RegExp(','+this.escapeRegex(searchValue)+',','i').test(','+optionValues+',')) return true;
      if (optionValues===true || optionValues==='true') {
        if (searchValue===false || searchValue==='false') return false;
        if (defaultValue) return new RegExp(','+this.escapeRegex(searchValue)+',','i').test(','+defaultValue+',');
        return true; 
      }
      return false;
    };  

    getGameTime(timeControl) {
      if (!timeControl) return '';
      const m=/^(\d+)(?:\+(\d+))?$/.exec(timeControl);
      if (!m) return timeControl;
      const initial=+m[1];
      const increment=m[2]?+m[2]:0;
      const time=initial+40*increment;
      if (!time) return timeControl;
      if (time>=1500) return 'classical';
      if (time>=480) return 'rapid';
      if (time>=180) return 'blitz';
      if (time>=30) return 'bullet';
      return 'ultrabullet';
    } 

    isAudioAllowed() {
      if (this.audioAllowed) return true;
      // TODO maybe readd when Chrome allows knowing if the 'sound' permission has been granted for the site
      //if (!navigator.userActivation.hasBeenActive) return false;
      const ac=new AudioContext();
      const state=ac.state!='suspended';
      this.audioAllowed=state;
      return state;
    }


    getTvOptions=()=>{
      const $=this.$;
      const inAnalysisMode = !!this.lichess.analysis;
      const mTv=!inAnalysisMode && /\/tv(\/([^\/]+))?/.exec(this.global.location.pathname);
      const mUser=/\/@\/([^\/]+)/.exec(this.global.location.pathname);
      const analysisUrl = $('div.buttons .analysis').attr('href')||'';
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

    saveComment=(text, path)=>{
      const analysis=this.lichess?.analysis;
      analysis.study.makeChange('setComment', 
        {
          ch: analysis.study.currentChapter().id,
          path: path || analysis.path,
          text
       });
    };

    isCommented(node) {
      return !!node.comments?.length;
    }

    isMate(node) {
      return node.san?.endsWith('#');
    }

    getNodePosition(node) {
      return this.getFenPosition(node.fen);
    }

    getFenPosition(fen) {
      let index=fen.length-1;
      let spaces=0;
      while (index>=0 && spaces<2) {
        if (fen[index]===' ') spaces++;
        index--;
      }
      return fen.slice(0,index+1); 
    }

    isTreeviewVisible=()=>{
      return this.$('div.tview2').length>0;
    };

    rectIntersection=(r1,r2)=>{
      const intersection = Math.max(0, Math.min(r1.x+r1.width, r2.x+r2.width) - Math.max(r1.x, r2.x)) * Math.max(0, Math.min(r1.y+r1.height, r2.y+r2.height) - Math.max(r1.y, r2.y));
      const minArea=Math.min(r1.width*r1.height,r2.width*r2.height);
      return minArea?intersection/minArea:0;
    };

    inViewport=(element) => {
      if (!element?.offsetParent) return false;
      const rect = element.getBoundingClientRect();
      const port = new DOMRect(0,0,$(window).width(),$(window).height());
      return this.rectIntersection(rect,port);
    };

    resetCache=()=>{
      const $=this.$;
      this.elementCache=new Map();
      const container=$('div.analyse__moves');
      $('move',container).each((i,e)=>this.elementCache.set($(e).attr('p')||'',e));
      container.data('cached',true);
      this.debug && this.global.console.debug('Element cache reset');
    };

    getElementForPath(path) {
      const $=this.$;
      const container=$('div.analyse__moves');
      const cached=container.data('cached');
      if (!cached) {
        this.resetCache();
      }
      let elem = this.elementCache?.get(path);
      if (!elem?.offsetParent) {
        this.resetCache();
        elem = this.elementCache.get(path);
      }
      if (path && !elem) {
        this.global.console.warn('Could not find elem for path '+path,this.global.location.href);
      }
      return elem;
    }

    getElementForNode(node) {
      const path=node.path||'';
      return this.getElementForPath(path);
    }

    traverse=(snode, func)=>{
      if (!snode) snode=this.lichess?.analysis?.tree.root;
      const state={
        lastMoves:[],
        positions:{},
        glyphs:{},
        nodeIndex:+(snode?.nodeIndex)||0
      };
      if (!snode || snode.comp) {
        return state;
      }
      const nodes=[{
        node: snode,
        path: ''
      }];
      while (nodes.length) {
        let {node,path}={...nodes.shift()};
        if (!this.isTreeviewVisible()) return;
        if (!node || node.comp) {
          continue;
        }
        path=(path||'')+node.id;
        node.path=path;
        node.nodeIndex=state.nodeIndex;
        state.nodeIndex++;
        node.isCommentedOrMate=this.isCommented(node)||this.isMate(node);
        node.position=this.getNodePosition(node);
        let pos=state.positions[node.position];
        if (!pos) {
          pos=[];
          state.positions[node.position]=pos;
        }
        pos.push(node);
        if (pos.length>1) {
          for (const transpoNode of pos) {
            transpoNode.transposition=pos;
          }
        } else {
          node.transposition=null;
        }
        if (node.glyphs) {
          for (const glyph of node.glyphs) {
            const arr=state.glyphs[glyph.symbol]||[];
            arr.push(node);
            state.glyphs[glyph.symbol]=arr;
          }
        }
        if (!node.children.length) {
          state.lastMoves.push(node);
        }
        if (func) func(node,state);
        for (const child of node.children) {
          nodes.push({node:child,path:path});
        }
      }
      return state;
    };

    getUserId=()=>{
      return this.lichess?.analysis?.opts.userId || this.$('body').attr('data-user');
    };

    isFriendsPage=()=>{
      return /\/following([\?#].*)?$/.test(this.global.location.href);
    };


    findGlyphNode=(color,symbol)=>{
      if (typeof symbol === 'string') symbol=[symbol];
      const analysis=this.lichess?.analysis;
      if (!analysis) return;
      const state=this.traverse();
      const arr=[].concat.apply([],symbol.map(s=>state.glyphs[s]).filter(a=>!!a?.length));
      if (!arr.length) return;
      arr.sort((n1,n2)=>n1.nodeIndex-n2.nodeIndex);
      const index=analysis.node.nodeIndex;
      const plyColor=color==='white'?1:0;
      return arr.find(n=>n.ply%2===plyColor && n.nodeIndex>index)||arr.find(n=>n.ply%2===plyColor);
    };

    jumpToGlyphSymbol=(color,symbol)=>{
      const analysis=this.lichess?.analysis;
      if (!analysis) return;
      const node=this.findGlyphNode(color,symbol);
      if (node) {
        analysis.userJumpIfCan(node.path);
        analysis.redraw();
      }
    };

    getPositionFromBoard=(el)=>{
      if (!el) return;
      const map={
        'king':'k',
        'queen':'q',
        'rook':'r',
        'bishop':'b',
        'knight':'n',
        'pawn':'p'
      }
      const elem=$(el).is('cg-container')
        ? el
        : $('cg-container',el)[0]
      const container=$(elem);
      const variantElem=container.closest('div.round__app, main, a.mini-game');
      const isStandard = variantElem.is('.standard,.variant-standard');
      if (!isStandard) return;

      const width=container.width()/8;
      const parentOffset=container.offset();
      const orientation=container.closest('.cg-wrap').is('.orientation-black')?'black':'white';
      const getKey=orientation=='white'
        ? res=>res.x+','+res.y
        : res=>(7-res.x)+','+(7-res.y);

      const lastMove={};
      $('square.last-move',container).each((i,s)=>{
        const square=$(s);
        const offset=square.offset();
        const res={
          x:Math.floor((offset.left-parentOffset.left)/width),
          y:Math.floor((offset.top-parentOffset.top)/width)
        };
        lastMove[getKey(res)]=true;
      });

      let turn='white';
      const pieceDict={};
      $('piece',container).each((i,p)=>{
        const piece=$(p);
        const offset=piece.offset();
        const res={
          type:Array.from(p.classList).find(c=>!['black','white'].includes(c)),
          x:Math.floor((offset.left-parentOffset.left)/width),
          y:Math.floor((offset.top-parentOffset.top)/width)
        };
        res.p=map[res.type];
        const key=getKey(res);
        if (piece.is('.white')) {
          res.p=res.p?.toUpperCase();
          if (lastMove[key]) turn='black'; 
        }
        if (res.p) pieceDict[key]=res;
      });

      let pos='';
      let s=0;
      const putEmpties=()=>{
        if (!s) return;
        pos+=s;
        s=0;
      };
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const key=x+','+y;
          const p=pieceDict[key]?.p;
          if (p) {
            putEmpties();
            pos+=p;
          } else {
            s++;
          }
        }
        putEmpties();
      }
      pos+=turn[0];
      return pos;
    };

    makeSvg=(svgText,chessground)=>{
      if (window.Chessground) return svgText; //ugly hack because you cannot know what chessground version you got
      return {
        html: svgText
        //,center: 'orig'
      };
    }
 
    intl={
      lichessTools:this,
      defaultLanguage:'en-US',
      'en-US': {
        'LiChess Tools': 'LiChess Tools',
        serverOverload: 'LiChess thinks we are overloading their system!'
      },
      'ro-RO': {
        serverOverload: 'LiChess crede c\u0103 le supra\u00eenc\u0103rc\u0103m sistemul!'
      },
      get lang() {
        let lang=lichessTools.global.document.documentElement.lang||this.defaultLanguage;
        if (!this[lang]) lang=this.defaultLanguage;
        return lang;
      },
      get isTranslated() {
        return this.lang!=this.defaultLanguage;
      },
      get siteI18n() {
        return {...this[this.defaultLanguage],...this[this.lang]};
      }
    }

  net={
    lichessTools:this,
    slowMode: false,
    slowModeTimeout: null,
    logNetwork: function(url,size,status) {
      const now=new Date().getTime();
      const obj=this.lichessTools.global.JSON.parse(this.lichessTools.global.localStorage.getItem('LiChessTools2.fetch')||'null')||{ size:0, arr:[], minTime:now };
      obj.size+=size;
      obj.arr.push({
        time: now,
        url:url,
        size:size,
        status:status
      });
      let index=obj.arr.findLastIndex(i=>now-(i.time||0)>60000);
      if (index<0) index=obj.arr.length;
      const stats=obj.arr
        .slice(0,index)
        .reduce((a,v)=>{
          return { 
            size: v.size+a.size,
            minTime:Math.min(v.time,a.minTime)
          }
        },{ size:0, minTime: 9999999999999 });
      if (now-obj.minTime>86400000*7) {
        obj.arr=obj.arr.filter(i=>now-i.time<86400000*6);
        obj.minTime=obj.arr[0].time;
        obj.size=obj.arr.reduce((a,v)=>a+v.size,0);
      }
      const text=this.lichessTools.global.JSON.stringify(obj);
      this.lichessTools.global.localStorage.setItem('LiChessTools2.fetch',text);
      const rate=stats.size?Math.round(8*stats.size/(now-stats.minTime)):0;
      this.lichessTools.debug && console.debug('Fetch log size:',text.length);
      this.lichessTools.debug && console.debug('  ... Bandwith logged:',obj.size,'Rate:',rate,'kbps');
    },
    json: async function(url,options) {
      if (!options) options={};
      if (!options.headers) options.headers={};
      options.headers.Accept||='application/json';
      options.headers['x-requested-with']||='XMLHttpRequest';
      const json=await this.fetch(url,options);
      return json&&JSON.parse(json);
    },
    fetch: async function(url,options) {
      try{
        let args=null;
        if (typeof url!='string') {
          args=url.args;
          url=url.url;
        }
        if (!url) throw new Error('URL has to be string or {url, args}');
        if (args) {
          for (const k in args) {
            url=url.replace('{'+k+'}',this.lichessTools.global.encodeURIComponent(args[k]));
          }
        }
        if (this.slowMode) await this.lichessTools.timeout(1000);
        const response=await this.lichessTools.global.fetch(url,options);
        const status=+(response.status);
        if (options?.ignoreStatuses?.includes(status)) {
          this.logNetwork(url,(options?.body?.length||0),status);
          return null;
        }
        if (!response.ok) {
          this.lichessTools.global.console.warn('fetch: '+url+': ['+response.type+'] '+response.status+' ('+response.statusText+')');
        }
        if (status>=400) {
          this.logNetwork(url,(options?.body?.length||0),status);
          if (status==429) {
            console.debug('429 received!');
            const translation=this.lichessTools.translator.noarg('serverOverload');
            this.lichessTools.announce(translation);
            this.slowMode=true;
            this.lichessTools.global.clearTimeout(this.slowModeTimeout);
            this.slowModeTimeout=this.lichessTools.global.setTimeout(()=>this.slowMode=false,60000);
          }
          const err = new Error('Response status: '+status);
          err.response=response;
          err.url=url;
          err.options=options;
          throw err;
        }
        const text=await response.text();
        this.logNetwork(url,(options?.body?.length||0)+(text?.length||0),status);
        return text;
      } catch(e) {
        if (e.toString().includes('Failed to fetch')) {
          this.lichessTools.global.console.log('Fetch for '+url+' failed: ',e);
        } else {
          this.lichessTools.global.console.warn('Fetch for '+url+' failed: ',e);
        }
        throw e;
      };
    }
  };

  
    tools=[];
    loadTool(toolClass) {
      try {
        const tool=new toolClass(this);
        this.tools.push(tool);
        if (tool.intl) {
          for (const lang in tool.intl) {
            this.intl[lang]={...this.intl[lang],...tool.intl[lang]};
          }
        }
        if (tool.dependencies) {
          for (const name of tool.dependencies) {
            if (!this.tools.find(t=>t.name===name)) throw new Error('Tool '+tool.name+' has a dependency on '+name+' which was not loaded');
          }
        }
      } catch(e) {
        console.error(e);
      }
    }

    async init() {
      for (const tool of this.tools) {
        await tool.init();
      }
    }
  
    async start(lichess) {
      if (!lichess) return;
      this.lichess=lichess;
      const age=lichess.info?.date
        ? (new Date().getTime()-new Date(lichess.info.date).getTime())/86400000
        : 0;
      console.debug('%c lichess.org code age: '+Math.round(age*10)/10+' days', age<7?'background: red;':'');
      this.translator = this.lichess.trans(this.intl.siteI18n);
      await this.applyOptions();
      const debouncedApplyOptions=this.debounce(this.applyOptions,250);
      this.lichess.storage.make('lichessTools.reloadOptions').listen(() => {
        debouncedApplyOptions();
      });
    }

    fireReloadOptions=()=> this.lichess.storage.fire('lichessTools.reloadOptions');

    getDefaultOptions() {
      const options={
        enableLichessTools: true,
        showOptionsTableInConsole: false
      };
      for (const tool of this.tools) {
        if (!tool.preferences) continue;
        for (const preference of tool.preferences) {
          options[preference.name]=preference.defaultValue;
        }
      }
      return options;
    }

    translateOldOptions() {
      const parent=this.lichessTools;
      let options=this.global.localStorage.getItem('LiChessTools.options');
      if (!options) return;
      try{
        options=JSON.parse(options);
      } catch {
        return;
      }
      return {
        "showOptionsTableInConsole": options.showOptionsTableInConsole,
        "fixWakeLock": options.fixWakeLock,
        "spaceDisabled": options.spaceDisabled,
        "openFriends": options.openFriends,
        "friendsPlaying": options.friendsPlaying,
        "highlight": [options.lastMoves?"lastMove,notCommented":"",options.transpositions?"transposition":""].join(','),
        "ctrlArrows": options.randomVariations,
        "customEngineLevel": options.minDepth,
        "keyShortcuts": options.shortcuts,
        "showFlags": options.flags,
        "shapeRank": options.shapeRank,
        "showOpening": options.showOpening,
        "previousGameMenu": options.addPreviousGame,
        "openingExplorerUsers": options.switchWithMe?"switchWithMe,deleteUser":false,
        "userTvHistory": options.historyInUserTV,
        "tvGameLinkAndBookmark": options.linkBookmarkTv?"link,bookmark":false,
        "chapterNavigation": options.chapterControls,
        "stickyPreview": options.stickyPreview,
        "stickyAnalysis": options.stickyAnalysis,
        "chapterNameFromTags": options.chapterNames,
        "enhancedImport": true,
        "commentStyling": options.commentClasses,
        "analysisContextActions": options.extraAnalysisContext,
        "movesFromTranspositions": options.forkTranspositions,
        "extendedInteractiveLesson": options.extendedInteractive?"extendedInteractive,showFinalScore":false,
        "prevAnalysis": options.prevAnalysis,
        "prevGames": options.prevGames
      };
    }

    async getOptions() {
      let options=this.global.localStorage.getItem('LiChessTools2.options');
      if (options) {
        try{
          options=JSON.parse(options);
        } catch {
          options=null;
        }
      } else {
        options=this.translateOldOptions();
      }
      const defaults=this.getDefaultOptions();
      options = {
        loaded:!!options,
        ...defaults,
        ...options
      };
      options.getValue=function(optionName, optionValue) {
        if (!this.enableLichessTools) return false;
        return this[optionName]
      };
      return options;
    }

    applyOptions=async (options)=>{
      if (options) {
        await this.saveOptions(options);
      } else {
        options = await this.getOptions();
      }
      if (this.prevOptions===JSON.stringify(options)) {
        return;
      }
      this.prevOptions=JSON.stringify(options);
      this.currentOptions=options;
      this.$('body').toggleClass('lichessTools',options.enableLichessTools);
      const console=this.global.console;
      const group=options.getValue('showOptionsTableInConsole')
        ? console.group
        : console.groupCollapsed;
      group('Applying LiChess Tools options...');
      for (const tool of this.tools) {
        await tool.start();
      }
      console.groupEnd();
    }

    async saveOptions(options) {
      const optionsJson=JSON.stringify(options);
      this.global.localStorage.setItem('LiChessTools2.options',optionsJson);
    }
  }

  class ToolBase {
    constructor(lichessTools) {
      this.lichessTools=lichessTools;
    }
    get name() {
      return this.constructor.name.replace(/Tool$/,'');
    }

    logOption(label,value) {
      this.lichessTools.global.console.log(label+' %c'+(value===undefined?'':value),'color:#9980FF');
    }

    async init() {
    }

    async start() {
    }
  }
  LiChessTools.Tools={
    ToolBase: ToolBase
  };

  window.LiChessTools=LiChessTools;
})();
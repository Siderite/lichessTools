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

    isWrappedFunction(func) {
      return !!func?.__originalFunction;
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
      return wrappedFunc;
    }

    unwrapFunction(func) {
      return func?.__originalFunction || func;
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

    isOptionSet=(optionValues, searchValue)=>{
      if (optionValues===undefined || optionValues===null) return false;
      if (new RegExp(','+this.escapeRegex(searchValue)+',','i').test(','+optionValues+',')) return true;
      if (optionValues===true || optionValues==='true') return searchValue!==false && searchValue!=='false';
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
      if (!navigator.userActivation.hasBeenActive) return false;
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
      return node.san&&/#$/.test(node.san);
    }

    getNodePosition(node) {
      return node.fen.split('-')[0].trim();
    }

    isTreeviewVisible=()=>{
      return this.$('div.tview2').length>0;
    };

    resetCache=()=>{
      const $=this.$;
      this.elementCache={};
      const container=$('div.analyse__moves');
      $('move',container).each((i,e)=>this.elementCache[$(e).attr('p')||'']=e);
      container.data('cached',true);
    };

    getElementForPath(path) {
      const $=this.$;
      const container=$('div.analyse__moves');
      var cached=container.data('cached');
      if (!cached) {
        this.resetCache();
      }
      let elem = this.elementCache&&this.elementCache[path];
      if (!elem?.parentNode) {
        this.resetCache();
        elem = this.elementCache[path];
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

    traverse=(node, state, path)=>{
      if (!node) node=this.lichess?.analysis?.tree.root;
      if (!state) {
        state={
          lastMoves:[],
          positions:{},
          glyphs:{},
          nodeIndex:+(node?.nodeIndex)||0
        };
        if (!this.isTreeviewVisible()) return state;
      }
      if (!node || node.comp) {
        return state;
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
      if (node.children.length) {
        for (const child of node.children) {
          this.traverse(child, state, path);
        }
      } else {
        state.lastMoves.push(node);
      }
      if (node.glyphs) {
        for (const glyph of node.glyphs) {
          const arr=state.glyphs[glyph.symbol]||[];
          arr.push(node);
          state.glyphs[glyph.symbol]=arr;
        }
      }
      return state;
    };

    populatePercent=(nodes, isInteractive, depth)=> {

      const getGamebookDescendants=(node,depth,currentDepth,isInteractive)=>{
        if (!depth) depth=0;
        if (!currentDepth) currentDepth=1;
        const arr=[];
        if (currentDepth<=depth&&node?.children) { 
          for (const child of node.children) {
            if (isInteractive && !child.gamebook) continue;
            arr.push(child);
            arr.push.apply(arr,getGamebookDescendants(child,depth,currentDepth+1,isInteractive));
          }
        }
        return arr;
      };

      const console=this.global.console;
      let total=0;
      const defaultPrc=[];
      for (const node of nodes) {
        if (isInteractive && !node.gamebook) {
          node.prc=0;
          continue;
        }
        let prcSet=false;
        if (node.comments) {
          for (const comment of node.comments) {
            const match=/prc:\s*(\d+(\.\d+)?)/i.exec(comment.text);
            if (match) {
		      node.prc=+match[1]
              total+=node.prc;
              prcSet=true;
            }
          }
        }
        if (!prcSet) {
          defaultPrc.push(node);
        }
      }
      if (total>100) {
        console.warn('Variations are marked with values of prc which total more than 100');
      }
      if (defaultPrc.length) {
        const list=[];
        let weightTotal=0;
        for (const node of defaultPrc) {
          const descendants=getGamebookDescendants(node,depth,1,isInteractive);
          const weight=1+descendants.filter(n=>n.children?.length>1).length;
          list.push({node:node,weight:weight});
          weightTotal+=weight;
        }
        const q=Math.max(0,100-total)/weightTotal;
        for (const item of list) {
          const prc=q*item.weight;
          item.node.prc=prc;
          total+=prc;
        }
      }
      return total;
    };

    getRandomVariation=(node, depth)=>{
      depth=+depth||8;
      const lichess=this.lichess;
      if (!node.children?.length) return;
      const isInteractive = !!lichess.analysis.study?.gamebookPlay();
      const arr=[...node.children];
      if (this.transpositionBehavior?.consideredVariations && node.transposition) {
        let transpositions=node.transposition.filter(n=>n!==node);
        if (this.transpositionBehavior?.excludeSameLine) {
          transpositions=transpositions?.filter(n=>n.path&&!n.path.startsWith(node.path)&&!node.path.startsWith(n.path));
        }
        for (const child of transpositions) {
          arr.push.apply(arr,child.children||[]);
        }
      }
      const total = this.populatePercent(arr, isInteractive, depth);
      const index=Math.random()*total;
      let acc=0;
      for (const child of arr) {
        acc+=child.prc;
        if (index<=acc) {
          return child;
        }
      }
    };

    getUserId=()=>{
      return this.lichess?.analysis?.opts.userId || this.$('body').attr('data-user');
    };

    isFriendsPage=()=>{
      return /\/following([\?#].*)?$/.test(this.global.location.href);
    };


    findGlyphNode=(color,symbol)=>{
      const analysis=this.lichess?.analysis;
      if (!analysis) return;
      const state=this.traverse();
      const arr=state.glyphs[symbol];
      if (!arr?.length) return;
      const index=analysis.node.nodeIndex;
      return arr.find(n=>n.ply%2===(color==='white'?1:0) && n.nodeIndex>index)||arr.find(n=>n.ply%2===(color==='white'?1:0));
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
        if (!response.ok) {
          this.lichessTools.global.console.warn('fetch: '+url+': ['+response.type+'] '+response.status+' ('+response.statusText+')');
        }
        const status=+(response.status);
        if (status>=400) {
          if (status==429) {
            const translation=this.lichessTools.translator.noarg('serverOverload');
            this.lichessTools.announce(translation);
            this.slowMode=true;
            this.lichessTools.global.clearTimeout(this.slowModeTimeout);
            this.slowModeTimeout=this.lichessTools.global.setTimeout(()=>this.slowMode=false,30000);
          }
          const err = new Error('Response status: '+status);
          err.response=response;
          err.url=url;
          err.options=options;
          throw err;
        }
        const text=await response.text();
        return text;
      } catch(e) {
        this.lichessTools.global.console.log('Fetch for '+url+' failed: ',e);
        throw e;
      };
    }
  };

  
    tools=[];
    loadTool(toolClass) {
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
    }

    async init() {
      for (const tool of this.tools) {
        await tool.init();
      }
    }
  
    async start(lichess) {
      this.$('body').addClass('lichessTools');
      this.lichess=lichess;
      this.translator = this.lichess.trans(this.intl.siteI18n);
      await this.applyOptions();
      const debouncedApplyOptions=this.debounce(this.applyOptions,250);
      this.lichess.storage.make('lichessTools.reloadOptions').listen(() => {
        debouncedApplyOptions();
      });
    }

    getDefaultOptions() {
      const options={
        showOptionsTableInConsole: false,
        fixWakeLock: true
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
      return {
        loaded:!!options,
        ...defaults,
        ...options
      };
    }

    applyOptions=async (options)=>{
      if (options) {
        await this.saveOptions(options);
      } else {
        options = await this.getOptions();
      }
      this.currentOptions=options;
      const console=this.global.console;
      const group=options.showOptionsTableInConsole
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
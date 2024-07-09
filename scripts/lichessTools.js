(()=> {
  class LiChessTools {
    constructor(global, cash) {
      if (!cash || !global) throw new Error('usage: new LiChessTools(window, cash)');
      this.$=cash;
      this.global=global;
      this.comm.init();
    }
  
    $=null;
    global=null;
    lichess=null;

    isDev=()=>{
      return /lichess\.dev/.test(this.global.location.origin);
    };

    get debug() {
      if (this._debug===undefined) {
        const debug = this.global.localStorage.getItem('LiChessTools2.debug');
        this._debug = +debug
          ? +debug
          : debug==='true';
      }
      return this._debug;
    }
    set debug(value) {
      value = +value
          ? +value
          : value=='true';
      if (this._debug===value) return;
      this._debug=value;
      this.global.localStorage.setItem('LiChessTools2.debug',this._debug.toString());
      if (this._debug) {
        this.global.console.debug('%c Debug mode is reserved for developers. Might lead to undesired consequences.', 'color: red;');
      }
    }
  
    arrayRemoveAll(arr,predicate) {
      if (!arr?.length) return;
      let i=0;
      let result=[];
      while (i<arr.length) {
        if (predicate(arr[i])) {
          result=result.concat(arr.splice(i,1));
        } else {
          i++;
        }
      }
      return result;
    }

    isWrappedFunction(func,id) {
      if (!func) return false;
      if (!id || func.__wrapId===id) {
        return !!func.__originalFunction;
      }
      return this.isWrappedFunction(func.__originalFunction,id);
    }
  
    wrapFunction(func,options) {
      if (!func) {
        this.global.console.warn('Trying to wrap no function',options);
      }
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
      let isRunning = false;
      const c = () => {
        this.global.clearTimeout(timeout);
        timeout = null;
      };
      const t = (f) => {
        timeout = this.global.setTimeout(f, wait);
      };
      return function() {
        const context = this;
        const args = arguments;
        const f = function() {
          if (isRunning) {
            t(f);
            return;
          };
          isRunning=true;
          const result = fn.apply(context, args);
          if (result?.then) {
            result.then(()=>isRunning=false);
          } else {
            isRunning=false;
          }
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
      if (new RegExp(','+this.escapeRegex(searchValue.toString())+',','i').test(','+optionValues+',')) return true;
      if (optionValues===true || optionValues==='true') {
        if (searchValue===false || searchValue==='false') return false;
        if (defaultValue) return new RegExp(','+this.escapeRegex(searchValue.toString())+',','i').test(','+defaultValue+',');
        return true; 
      }
      return false;
    };  

    getGameTime(timeControl,notPgn) {
      if (!timeControl) return '';
      const m=/^([\d\u00bc\u00bd]+)(?:\+(\d+))?$/.exec(timeControl);
      if (!m) return timeControl;
      let initial;
      switch(m[1]) {
        case '\u00bd': initial=0.5; break;
        case '\u00bc': initial=0.25; break;
        default: initial=+m[1]*(notPgn?60:1); break;
      }
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

    isMobile() {
      const $=this.$;
      return $('body').is('.mobile');
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

    getNodeComment(node) {
      const userId=this.getUserId();
      const comment=(node?.comments||[]).find(c=>c?.by?.id==userId)?.text;
      return comment;
    }

    getNodeCommentsText(node) {
      const userId=this.getUserId();
      const commentText=(node?.comments||[]).map(c=>c.text).join('\r\n');
      return commentText;
    }

    saveComment=(text, path, chapterId)=>{
      const analysis=this.lichess?.analysis;
      if (!chapterId) chapterId=analysis.study.currentChapter().id;
      if (!path) path=analysis.path;
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
      let index=fen.length-1;
      let spaces=0;
      while (index>=0 && spaces<2) {
        if (fen[index]===' ') spaces++;
        index--;
      }
      return fen.slice(0,index+1); 
    }

    treeviewVisibleCache={
      time:0,
      value:true
    };
    isTreeviewVisible=(forced)=>{
      const now=Date.now();
      if (forced || now-this.treeviewVisibleCache.time>100) {
        this.treeviewVisibleCache.value=(this.$('div.tview2').length>0);
        this.treeviewVisibleCache.time=now;
      }
      return this.treeviewVisibleCache.value;
    };

    rectIntersection=(r1,r2)=>{
      const intersection = Math.max(0, Math.min(r1.x+r1.width, r2.x+r2.width) - Math.max(r1.x, r2.x)) * Math.max(0, Math.min(r1.y+r1.height, r2.y+r2.height) - Math.max(r1.y, r2.y));
      const minArea=Math.min(r1.width*r1.height,r2.width*r2.height);
      return minArea?intersection/minArea:0;
    };

    inViewport=(element) => {
      if (element?.length===0) return false;
      if (element?.length) element=element[0];
      if (!element?.offsetParent) return false;
      const rect = element.getBoundingClientRect();
      const port = new DOMRect(0,0,$(window).width(),$(window).height());
      return this.rectIntersection(rect,port);
    };

    computeCollapsedRegex=()=>{
      const $=this.$;
      const lichess=this.lichess;
      const container=$('div.analyse__moves');
     
      const collapsedPaths=[];
      $('lines.collapsed',container).each((i,e)=>{
        let interrupt=false;
        let $e=$(e);
        if ($e.parent().is('interrupt')) {
          $e=$e.parent();
          interrupt=true;
        }
        $e=$e.prev('move');
        if ($e.is('.empty')) $e=$e.prev('move');
        const p=$e.attr('p')||'';
        collapsedPaths.push(interrupt?p.slice(0,-2):p);
      });
      const collapsedRegex=collapsedPaths.length
        ? new RegExp('^('+collapsedPaths.map(p=>this.escapeRegex(p)).join('|')+')')
        : null;
      if (this.collapsedRegex!=collapsedRegex) {
         this.collapsedRegex=collapsedRegex;
         this?.emitRedraw();
      }
      this.debug && this.global.console.debug('Computed collapsed regex');
    };
    computeCollapsedRegexDebounced=this.debounce(this.computeCollapsedRegex,500);

    elementCache=new Map();
    resetCache=()=>{
      const $=this.$;
      const lichess=this.lichess;
      this.elementCache.clear();
      const container=$('div.analyse__moves');
     
      $('move',container).each((i,e)=>{
        const $e=$(e);
        if ($e.is('.empty')) return;
        const p=$e.attr('p')||'';
        this.elementCache.set(p,e);
      });
      this.debug && this.global.console.debug('Element cache reset');
    };

    getElementForPath(path) {
      const $=this.$;
      let elem = this.elementCache?.get(path);
      if (!elem?.offsetParent) {
        if (!elem) {
          if (this.collapsedRegex?.test(path)) {
            this.debug && this.global.console.debug(path+' is collapsed');
            this.computeCollapsedRegexDebounced();
            return;
          }
          this.computeCollapsedRegex();
          if (this.collapsedRegex?.test(path)) {
            this.debug && this.global.console.debug(path+' is collapsed');
            return;
          }
        }
        this.resetCache();
        elem = this.elementCache.get(path);
      } else {
        if (this.debug && this.collapsedRegex?.test(path)) {
          if (!this.lichess.analysis.tree.pathIsMainline(path)) {
            this.global.console.debug('Elem for non mainline path '+path+' exists, but is marked as collapsed!');
          }
        }
      }
      if (path && !elem) {
        if (this.isTreeviewVisible(true)) {
          this.debug && this.global.console.warn('Could not find elem for path '+path,this.global.location.href);
        }
      }
      return elem;
    }

    assertPathSet(node) {
      if (!node) return;
      if (node.path===undefined) throw 'Path for node '+node.ply+' '+node.id+'( '+node.san+') not set!';
    }

    getElementForNode(node) {
      this.assertPathSet(node);
      const path=node.path||'';
      return this.getElementForPath(path);
    }

    traverse=(snode, func, forced)=>{
      if (!snode) {
        snode=this.lichess?.analysis?.tree.root;
        snode.depth=0;
        this.isTreeviewVisible(true);
      }
      const state={
        lastMoves:[],
        checks:[],
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
        if (!forced && !this.isTreeviewVisible()) return;
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
        if (this.isLastInLine(node)) {
          state.lastMoves.push(node);
        }
        if (this.isCheck(node)) {
          state.checks.push(node);
        }
        if (func) func(node,state);
        let first=true;
        for (const child of node.children) {
          child.depth=first?node.depth:node.depth+1;
          first=false;
          nodes.push({node:child,path:path});
        }
      }
      return state;
    };

    getUserId=()=>{
      return this.lichess?.analysis?.opts.userId || this.$.cached('body').attr('data-user');
    };

    userLoggedIn=()=>{
      return !!this.getUserId();
    };

    isFriendsPage=()=>{
      return /\/following([\?#].*)?$/.test(this.global.location.href);
    };

    findGlyphNode=(color,symbols)=>{
      if (typeof symbols === 'string') symbols=[symbols];
      const analysis=this.lichess?.analysis;
      if (!analysis) return;
      const state=this.traverse();
      const arr=[].concat.apply([],symbols.map(s=>state.glyphs[s]).filter(a=>!!a?.length));
      if (!arr.length) return;
      arr.sort((n1,n2)=>n1.nodeIndex-n2.nodeIndex);
      const index=analysis.node.nodeIndex;
      const plyColor=color==='white'?1:0;
      return arr.find(n=>n.ply%2===plyColor && n.nodeIndex>index)||arr.find(n=>n.ply%2===plyColor);
    };

    jumpToGlyphSymbols=(symbols,side)=>{
      const analysis=this.lichess?.analysis;
      if (!analysis) return;
      let color='white';
      if (['undefined','boolean'].includes(typeof side)) {
        color=analysis.getOrientation();
        if (side) {
          color=color=='black'?'white':'black';
        }
      } else {
        color=side;
      }
      const node=this.findGlyphNode(color,symbols);
      if (!node?.path) return;
      analysis.userJumpIfCan(node.path);
      analysis.redraw();
    };

    getPositionFromFen=(fen,deep)=>{
      if (!fen) return;
      return fen.split(' ').slice(0,(deep?4:2)).join('').replaceAll('/','');
    };

    getPositionFromBoard=(el,asFen)=>{
      if (!el) return;
      const $=this.$;
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
      if (!container.length) return;
      const variantElem=container.closest('div.round__app, main, a.mini-game');

      const width=container.width()/8;
      const parentOffset=container.offset();
      const orientation=container.closest('.cg-wrap').is('.orientation-black')?'black':'white';
      const getKey=orientation=='white'
        ? res=>res.x+','+res.y
        : res=>(7-res.x)+','+(7-res.y);

      const lastMove={};
      $('square.last-move',container).each((i,s)=>{
        const square=$(s);
        let res;
        let key;
        if (s.cgKey) {
          res={
                x:104-s.cgKey.charCodeAt(0), 
                y:s.cgKey.charCodeAt(1)-49
              };
          key=(7-res.x)+','+(7-res.y);
        } else {
          const offset=square.offset();
          res={
                x:Math.round((offset.left-parentOffset.left)/width),
                y:Math.round((offset.top-parentOffset.top)/width)
              };
          key=getKey(res)
        }
        lastMove[key]=true;
      });

      let turn='';
      const pieceDict={};
      $('piece',container).each((i,p)=>{
        const piece=$(p);
        const offset=piece.offset();
        let res;
        let key;
        if (p.cgKey) {
          res={
                x:104-p.cgKey.charCodeAt(0), 
                y:p.cgKey.charCodeAt(1)-49
              };
          key=(7-res.x)+','+(7-res.y);
        } else {
          const offset=piece.offset();
          res={
                x:Math.round((offset.left-parentOffset.left)/width),
                y:Math.round((offset.top-parentOffset.top)/width)
              };
          key=getKey(res);
        }
        const type=Array.from(p.classList).find(c=>!['black','white'].includes(c));
        res.p=map[type];
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
        if (asFen && y<7) pos+='/';
      }
      if (asFen) pos+=' ';
      if (!turn) {
        const maybeTurn=Array.from($('.copyables input'))
          .map(el=>{
            const text=$(el).val();
            const m = /^\s*[rnbqkpRNBQKP1-8\/]+ ([wb])/.exec(text);
            return m && m[1];
          })
          .find(t=>t);
        if (maybeTurn) {
          turn=maybeTurn;
        } else {
          turn='white';
        }
      }
      pos+=turn[0];
      return pos;
    };

    isStartFen=(fen)=>{
      return fen?.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    };

    getBoardFromFen=fen=>{
      if (!fen) return null;
      const result=[];
      for (let i=0; i<8; i++) result.push(Array(8));
      const splits=fen.split(' ');
      fen=splits[0];
      let enpassant=splits[3];
      if (enpassant && enpassant!='-') {
        result.enpassant={ 
          x: 104-enpassant.charCodeAt(0), 
          y: enpassant.charCodeAt(1)-49
        };
      }
      let x=0;
      let y=0;
      for (let i=0; i<fen.length; i++) {
        const ch=fen[i];
        if ('kqrbnp'.indexOf(ch.toLowerCase())>=0) {
          result[y][x]=ch;
          x++;
          continue;
        }
        if (ch=='/') {
          x=0;
          y++;
          continue;
        }
        x+=(+ch);
      }
      return result;
    };

    reverseFen=(fen)=>{
      if (!fen) return fen;

      const flipCapitalization=s=>{
        const pieces='RNBQKPrnbqkp';
        return s.split('').map(ch=>{
          const i=pieces.indexOf(ch);
          if (i<0) return ch;
          return pieces[(i+6)%12];
        }).join('');
      };

      const splits=fen.split(' ');
      splits[0]=flipCapitalization(splits[0].split('/').reverse().join('/'));
      if (splits[1]) {
        splits[1]=splits[1]=='w' ? 'b' : 'w';
      }
      if (splits[2]) {
        splits[2]=flipCapitalization(splits[2]);
        const arr=splits[2].split('');
        arr.sort();
        splits[2]=arr.join('');
      }
      if (splits[3]) {
        const m=/^([a-h])([1-8])$/.test(splits[3]);
        if (m) {
          splits[3]=m[1]+(9-(+m[2]));
        }
      }
      return splits.join(' ');
    };

    makeSvg=(svgText,chessground)=>{
      if (window.Chessground) return svgText; //ugly hack because you cannot know what chessground version you got
      return {
        html: svgText
        //,center: 'orig'
      };
    }

    isIOS = () => {
      return  /iPhone|iPod|iPad|Macintosh/.test(navigator.userAgent);
    };

    speechVolume=0.7;
    speechRate=1;
    speechVoiceIndex=undefined;
    get speechVoiceLength() {
      const voices=window?.speechSynthesis?.getVoices();
      return voices?.length;
    }
    speak=async (text,options)=>{
      options={
        volume:options?.volume || this.speechVolume,
        voiceIndex:options?.voiceIndex===undefined ? this.speechVoiceIndex : options.voiceIndex,
        translated:!!options?.translated,
        rate:options?.rate || this.speechRate
      };
      const console=this.global.console;
      try{
        const msg = new SpeechSynthesisUtterance(text);
        msg.volume = options.volume;
        msg.lang = options.translated ? document.documentElement.lang : 'en-US';
        msg.rate = options.rate;
        if (options.voiceIndex!==undefined) {
          const voices=window?.speechSynthesis?.getVoices();
          if (voices) msg.voice=voices[options.voiceIndex];
        }
        let resumeMic=false;
        if (!this.isIOS()) {
          // speech events are unreliable on iOS, but iphones do their own cancellation
          msg.onstart = _ => this.lichess.mic.pause();
          resumeMic=true;
        }
        window?.speechSynthesis?.speak(msg);
        return new Promise(resolve => {
          msg.onend = msg.onerror = ()=>{
            if (resumeMic) this.lichess.mic.resume();
            resolve();
          }
        });
      } catch(e) {
        if (this.debug) console.debug('Speech error:',e);
      }
    };

    play=async (path, volume)=>{
      const sound = await this.lichess.sound.load('sound', lichess.sound.baseUrl + path);
      await sound.play(this.lichess.sound.getVolume()*(+(volume)||0.7));
    };

    isDark=()=>{
      const $=this.$;
      const html=$.cached('html');
      if (html.is('.light')) return false;
      if (html.is('.dark,.darkBoard,.transp')) return true;
      return this.global.matchMedia && this.global.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    random=()=>{
      const arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      const mantissa = (arr[0] * Math.pow(2,20)) + (arr[1] >>> 12);
      return mantissa * Math.pow(2,-52);
    };

    hash=(text)=>{
      let hval = 0x811c9dc5;
      if (!text) return hval;
      for (let i = 0; i < text.length; i++) {
        hval = hval ^ (text.charCodeAt(i));
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
      }
      return (hval >>> 0).toString(16);
    }

    jsonParse=(funcOrText, defaultValue)=>{
      const console=this.global.console;
      let json='unknown';
      try {
        json=typeof funcOrText == 'function'
          ? funcOrText()
          : funcOrText;
        if (!json || json==='undefined') return defaultValue;
        const result = this.global.JSON.parse(json);
        return result || defaultValue;
      } catch(ex) {
        console.warn('Error parsing JSON: ',json,ex);
        return defaultValue;
      }
    };

    ndjsonParse=(funcOrText, defaultValue)=>{
      const console=this.global.console;
      let json='unknown';
      try {
        json=typeof funcOrText == 'function'
          ? funcOrText()
          : funcOrText;
        if (!json || json==='undefined') return defaultValue;
        const result = json.split(/\r?\n/).filter(s=>s?.trim()).map(s=>this.global.JSON.parse(s));
        return result || defaultValue;
      } catch(ex) {
        console.warn('Error parsing JSON: ',json,ex);
        return defaultValue;
      }
    };

    getColor=(text)=>{
      const m=/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(text);
      const parseInt=this.global.parseInt;
      return {
        R:parseInt(m[1],16),
        G:parseInt(m[2],16),
        B:parseInt(m[3],16),
        A:m[4]?parseInt(m[4],16):255
      };
    };

    getGradientColor=(q,gradient)=>{
      let prev=null;
      for (const gr of gradient) {
        if (q>=prev?.q && q<=gr.q) {
          const c1=this.getColor(prev.color);
          const c2=this.getColor(gr.color);
          const localQ=(q-prev.q)/(gr.q-prev.q);
          const color = '#'+Math.round(c1.R+(c2.R-c1.R)*localQ).toString(16).padStart(2,'0')
                    +Math.round(c1.G+(c2.G-c1.G)*localQ).toString(16).padStart(2,'0')
                    +Math.round(c1.B+(c2.B-c1.B)*localQ).toString(16).padStart(2,'0')
                    +Math.round(c1.A+(c2.A-c1.A)*localQ).toString(16).padStart(2,'0');
          return color;
        }
        prev=gr;
      }
      return prev?.color||'#808080';
    };

    clone=(obj)=>{
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
      const func=this.lichess.asset.url.bind(this.lichess);
      return func(url);
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
      const now=Date.now();
      if (!this.networkLog) {
        this.networkLog=this.lichessTools.jsonParse(_=>this.lichessTools.global.localStorage.getItem('LiChessTools2.fetch'),{ size:0, count:0, arr:[], minTime:now });
      }
      this.networkLog.size+=size;
      this.networkLog.count++;
      this.networkLog.arr.push({
        time: now,
        url:url,
        size:size,
        status:status
      });
      if (this.networkLog.arr.length>20000) {
        this.networkLog.arr.splice(0,2000);
        this.storeLog();
      }
      if (this.lichessTools.debug) {
        const rate=this.networkLog.size?Math.round(8*this.networkLog.size/(now-this.networkLog.minTime)):0;
        const avgSize=this.networkLog.size?Math.round(8*this.networkLog.size/this.networkLog.count):0;
        const logSize=this.lichessTools.global.JSON.stringify(this.networkLog).length;
        this.lichessTools.global.console.debug('Fetch log size:',logSize);
        this.lichessTools.global.console.debug('  ... Bandwith logged:',this.networkLog.size,'Rate:',rate,'kbps','Avg call size:',avgSize,'kbps');
      }
    },
    storeLog: function() {
      const text=this.lichessTools.global.JSON.stringify(this.networkLog);
      this.lichessTools.global.localStorage.setItem('LiChessTools2.fetch',text);
    },
    json: async function(url,options) {
      if (!options) options={};
      if (!options.headers) options.headers={};
      options.headers.Accept||='application/json';
      options.headers['x-requested-with']||='XMLHttpRequest';
      const json=await this.fetch(url,options);
      if (options.ndjson) {
        return this.lichessTools.ndjsonParse(json);
      } else {
        return this.lichessTools.jsonParse(json);
      }
    },
    fetch: async function(url,options) {
      const console=this.lichessTools.global.console;
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
          console.warn('fetch: '+url+': ['+response.type+'] '+response.status+' ('+response.statusText+')');
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
          console.log('Fetch for '+url+' failed: ',e,status);
        } else {
          console.warn('Fetch for '+url+' failed: ',e,status);
        }
        throw e;
      };
    }
  };

  storage={
    lichessTools:this,
    getStore: function(options) {
      const store=options?.session
        ? this.lichessTools.global.sessionStorage
        : this.lichessTools.global.localStorage;
      return store;
    },
    get: function(key, options) {
      const store=this.getStore(options);
      let text=store.getItem(key);
      if (text && options?.zip) {
        try {
          const decompressed=LiChessTools.unzip(text);
          if (decompressed!=null) text=decompressed;
        } catch(ex) {
          this.lichessTools.global.console.debug('Cannot unzip text. Using raw',ex);
        }
      }
      try {
        const obj=text===undefined?undefined:JSON.parse(text);
        return obj;
      } catch(e) {
        console.error('Error parsing JSON',e);
        return null;
      }
    },
    set: function(key, value, options) {
      const store=this.getStore(options);
      if (value===undefined) {
        store.removeItem(key);
        return;
      }
      let text=JSON.stringify(value);
      if (options?.zip) {
        try {
          const compressed=LiChessTools.zip(text);
          if (compressed!=null) text=compressed;
        } catch(ex) {
          this.lichessTools.global.console.debug('Cannot zip text. Using raw',ex);
        }
      }
      store.setItem(key,text);
    },
    remove: function(key,options) {
      const store=this.getStore(options);
      store.removeItem(key);
    }
  };

  comm={
    lichessTools: this,
    timeout: 2000,
    sendResponses:[],
    init: function() {
      this.lichessTools.global.addEventListener('LichessTools.receive',(ev)=>{
        const sendResponse=this.sendResponses[ev.detail.uid];
        if (sendResponse) {
          delete this.sendResponses[ev.detail.uid];
          sendResponse(ev.detail);
        }
      });
    },
    send: function(data,sendResponse,timeout) {
      const uid=crypto.randomUUID();
      return new Promise((resolve,reject)=>{
        const pointer=setTimeout(()=>reject(new Error('Send timeout')),timeout||this.timeout);
        const f=(data)=>{
          clearTimeout(pointer);
          if (sendResponse) sendResponse(data);
          resolve(data);
        };
        this.sendResponses[uid]=f;
        const customEvent = new CustomEvent("LichessTools.send", {
           detail: {...data,uid:uid},
           bubbles: true,
           cancelable: true,
           composed: false,
        });
        window.dispatchEvent(customEvent);
      });
    }
  };

    tools=[];
    loadTool(toolClass) {
      const setTimeout=this.global.setTimeout;
      const console=this.global.console;
      try {
        const tool=new toolClass(this);
        this.tools.push(tool);
        this.tools[toolClass.name]=tool;
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
        setTimeout(()=>{ throw e; },100);
      }
    }

    async init() {
      const setTimeout=this.global.setTimeout;
      const console=this.global.console;
      window.addEventListener('pagehide',()=>{
        this.net.storeLog();
      });
      for (const tool of this.tools) {
        if (!tool?.init) continue;
        try {
          await tool.init().catch(e=>{ setTimeout(()=>{ throw e; },100); });
        } catch(e) {
          setTimeout(()=>{ throw e; },100);
        }
      }
    }
  
    async start(lichess) {
      if (!lichess) return;
      this.lichess=lichess;
      const age=lichess.info?.date
        ? (Date.now()-new Date(lichess.info.date).getTime())/86400000
        : 0;
      this.global.console.debug('%c site code age: '+Math.round(age*10)/10+' days', age<7?'background: red; color:white;':'');
      if (this.lichess.trans) {
        this.translator = this.lichess.trans(this.intl.siteI18n);
      }
      await this.applyOptions();
      const debouncedApplyOptions=this.debounce(this.applyOptions,250);
      lichess.storage?.make('lichessTools.reloadOptions').listen(() => {
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

    async getOptions() {
      let options=this.global.localStorage.getItem('LiChessTools2.options');
      options=this.jsonParse(options);
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
      const setTimeout=this.global.setTimeout;
      const console=this.global.console;
      if (options) {
        await this.saveOptions(options);
      }
      options = await this.getOptions();
      if (this.prevOptions===this.global.JSON.stringify(options)) {
        return;
      }
      this.prevOptions=this.global.JSON.stringify(options);
      this.currentOptions=options;
      this.$.cached('body').toggleClass('lichessTools',options.enableLichessTools);
      const group=options.getValue('showOptionsTableInConsole')
        ? console.group
        : console.groupCollapsed;
      group('Applying LiChess Tools options...');
      for (const tool of this.tools) {
        if (!tool?.start) continue;
        try {
          await tool.start().catch(e=>{ setTimeout(()=>{ throw e; },100); });
        } catch(e) {
          setTimeout(()=>{ throw e; },100);
        }
      }
      console.groupEnd();
    }

    async saveOptions(options) {
      const optionsJson=this.global.JSON.stringify(options);
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
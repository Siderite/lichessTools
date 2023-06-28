(()=>{
  class ShowFlagsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'showFlags',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showFlags': 'Show player country flags'
      },
      'ro-RO':{
        'options.study': 'General',
        'options.showFlags': 'Arat\u0103 steagurile \u0163\u0103rilor juc\u0103torilor'
      }
    }

    getElementsForFlag=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const dict = {};
      $('.user-link,a[href^="/@/"]').each((i,e)=> {
        let textEl = $('a.text',e);
        if (!textEl.length) textEl=$(e);
        if (textEl.is('.lichessTools-noflag')) return;
        const next=textEl.next();
        if (next.is('img.flag')) return;
        if (next.has('img.flag').length) return;
        if (textEl.attr('data-icon')) return;
        if (textEl.attr('data-tab')) return;
        let url=textEl.attr('href')||textEl.data('href');
        if (!url) return;
        const m= /\/@\/([^\/]+)\/?$/.exec(url);
        const userId=m&&m[1];
        if (!userId) return;
        url='/@/'+userId;
        const list = dict[url]||[];
        list.push(textEl);
        dict[url]=list;
      });
      return dict;
    };

    get flagCache() {
       var global=this.lichessTools.global;
       if (this._flagCache) return this._flagCache;
       try {
         const temp=global.localStorage.getItem('LiChessTools.flagCache')
         if (temp) global.console.debug('Size of flag cache:',temp.length);
         this._flagCache=temp?JSON.parse(temp):{};
       } catch(e) {
         global.console.warn('Error parsing flag cache:',e);
         this._flagCache={}
       }
       return this._flagCache;
    }
    processFlags=()=> {
      const parent=this.lichessTools;
      const $=parent.$;
      const flagsEnabled=parent.currentOptions.showFlags;
      if (!flagsEnabled) return;
      const dict=this.getElementsForFlag();
      const firstUrl=Object.keys(dict)[0];
      if (!firstUrl) return;
      const textEl=$(dict[firstUrl]);
      const item=this.flagCache[firstUrl];
      const img=item?.time && new Date().getTime()-new Date(item.time)<10*86400000 && item.data;
      if (img) {
        textEl.each((i,e)=>{
          if ($(e).next().is('img.flag')) return;
          if (img==='noflag') {
            $(e).addClass('lichessTools-noflag');
          } else {
            $(e).after(img);
          }
        });
        this.processFlags();
        return;
      }
      parent.net.fetch(firstUrl+'/mini').then(html=>{
        const m=/<span class="upt__info__top__country".*?>(?:.|\r|\n)*?<\/span>/.exec(html);
        let img=null;
        if (m) {
          const el=$(m[0]);
          img=$('img',el);
          if (img.length) {
            img.attr('title',el.attr('title')||el.text());
            img.addClass('lichessTools-wave');
            img.addClass('lichessTools');
          } else {
            img=null;
          }
        }
        this.flagCache[firstUrl]={ 
          data:img?img[0].outerHTML:'noflag',
          time:new Date().getTime()
        };
		this.lichessTools.global.localStorage.setItem('LiChessTools.flagCache',JSON.stringify(this.flagCache));
      }).catch(e=>{ 
        console.warn('Failed fetching '+firstUrl);
        if (e.response?.status==404) {
          this.flagCache[firstUrl]={ 
            data:'noflag',
            time:new Date().getTime()
          };
        }
        this.debouncedProcessFlags();
      });
      this.debouncedProcessFlags();
    };
    debouncedProcessFlags=this.lichessTools.debounce(this.processFlags,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.showFlags;
      this.logOption('Show player flags', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      $('img.flag.lichessTools').remove();
      lichess.pubsub.off('content-loaded',this.debouncedProcessFlags);
      lichess.pubsub.off('socket.in.crowd',this.debouncedProcessFlags);
      if (!value) return;

      this.debouncedProcessFlags();
      lichess.pubsub.on('content-loaded',this.debouncedProcessFlags);
      lichess.pubsub.on('socket.in.crowd',this.debouncedProcessFlags);
    }

  }
  LiChessTools.Tools.ShowFlags=ShowFlagsTool;
})();

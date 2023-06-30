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
        const list = dict[userId]||[];
        list.push(textEl);
        dict[userId.toLowerCase()]=list;
      });
      return dict;
    };

    cacheExpiration=86400000;
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
    get countryCache() {
       var global=this.lichessTools.global;
       if (this._countryCache) return this._countryCache;
       try {
         const temp=global.localStorage.getItem('LiChessTools.countryCache')
         if (temp) global.console.debug('Size of country cache:',temp.length);
         this._countryCache=temp?JSON.parse(temp):{};
       } catch(e) {
         global.console.warn('Error parsing country cache:',e);
         this._countryCache={}
       }
       return this._countryCache;
    }
    saveCache=()=>{
      const cache=this.flagCache;
      for(const url of Object.keys(cache)) {
        const time=cache[url].time;
        if (new Date().getTime()-new Date(time)>this.cacheExpiration) delete cache[url];
      }
      this.lichessTools.global.localStorage.setItem('LiChessTools.countryCache',JSON.stringify(this.countryCache));
      this.lichessTools.global.localStorage.setItem('LiChessTools.flagCache',JSON.stringify(this.flagCache));
    };
    debouncedSaveCache=this.lichessTools.debounce(this.saveCache,100);
    processFlags=async ()=> {
      const parent=this.lichessTools;
      const $=parent.$;
      const flagsEnabled=parent.currentOptions.showFlags;
      if (!flagsEnabled) return;
      const dict=this.getElementsForFlag();
      const data=Object.keys(dict).map(userId=>{
        const item=this.flagCache[userId];
        return item || { id:userId };
      });
      let toSaveCache=false;
      const userIds=data.filter(i=>!i.countryName).map(i=>i.id).slice(0,200);
      if (userIds.length) {
        const json = await parent.net.fetch('/api/users',{ method:'POST',body:userIds.join(',') });
        const users=JSON.parse(json);
        for (const user of users) {
          const item = data.find(i=>i.id===user.id)
          if (item) item.country=user.profile?.country||'noflag';
        }
        let firstToProcess=null;
        for (const item of data) {
          if (!item.country) {
            continue;
          }
          if (item.country==='noflag') {
            item.countryName='noflag';
            item.time=new Date().getTime();
            this.flagCache[item.id]=item;
            toSaveCache=true;
            continue;
          }
          item.countryName=this.countryCache[item.country];
          if (item.countryName) {
            item.time=new Date().getTime();
            this.flagCache[item.id]=item;
            toSaveCache=true;
          }
          if (!item.countryName && !firstToProcess) {
            firstToProcess=item;
          }
        }
        if (firstToProcess) {
          const html=await parent.net.fetch('/@/'+firstToProcess.id+'/mini');
          const m=/<span class="upt__info__top__country".*?>(?:.|\r|\n)*?<\/span>/.exec(html);
          if (m) {
            const el=$(m[0]);
            firstToProcess.countryName=el.text()||el.attr('title');
          }
          if (firstToProcess.countryName) {
            this.countryCache[firstToProcess.country]=firstToProcess.countryName;
            firstToProcess.time=new Date().getTime();
            this.flagCache[firstToProcess.id]=firstToProcess;
            toSaveCache=true;
          }
        }
      }
      if (toSaveCache) {
		this.debouncedSaveCache();
      }
      for (const item of data) {
        if (!item.countryName) continue;
        const elems=dict[item.id];
        for (const elem of elems) {
          if (item.countryName=='noflag') {
            elem.addClass('lichessTools-noflag');
          } else {
            elem.after($('<img>')
              .addClass('flag')
              .addClass('lichessTools')
              .addClass('lichessTools-wave')
              .attr('title',item.countryName)
              .attr('src',parent.lichess.assetUrl('images/flags/'+item.country+'.png'))
            );
          }
        }
      }
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

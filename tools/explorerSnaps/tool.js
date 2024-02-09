(()=>{
  class ExplorerSnapsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'explorerSnaps',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerSnaps': 'Toggle snapshots of Explorer settings',
        'addSnapPrompt':'Title of new snap',
        'replaceSnapPrompt':'Overwrite snap "%s" ?',
        'snapSettingsButtonText':'Snap!',
        'snapSettingsButtonTitle':'LiChess Tools - create a snap of current Explorer settings',
        'snapButtonTitle':'LiChess Tools - use snap "%s"'
       },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerSnaps': 'Schimb\u0103 \u00eentre diferite set\u0103ri ale Exploratorului',
        'addSnapPrompt':'Titlul noului snap',
        'replaceSnapPrompt':'Suprascrie snapul "%s" ?',
        'snapSettingsButtonText':'Snap!',
        'snapSettingsButtonTitle':'LiChess Tools - creaz\u0103 un snap al set\u0103rilor curente din Explorator',
        'snapButtonTitle':'LiChess Tools - folose\u0163te snapul "%s"'
      }
    };

    getSettings=()=>{
      const parent=this.lichessTools;
      const data=parent.lichess?.analysis?.explorer?.config?.data;
      if (!data) return;
      const settings={
        timeControl:data.speed(),
        avgRating:data.rating(),
        since:data.byDb()?.since(),
        until:data.byDb()?.until(),
      };
      return settings;
    };

    setSnap=(snap)=>{
      const parent=this.lichessTools;
      const analysis=parent.lichess?.analysis;
      const data=analysis?.explorer?.config?.data;
      if (!data) return;
      data.speed(snap.settings.timeControl);
      data.rating(snap.settings.avgRating);
      data.byDb().since(snap.settings.since);
      data.byDb().until(snap.settings.until);
      analysis.explorer?.reload();
    };

    getSnapElement=(snap)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      return $('section.lichessTools-explorerSnaps button[data-act="shot"]').filter((i,e)=>{
        const title=$(e).attr('data-act-title');
        return title==snap.title;
      }).parent();
    };

    highlightSnap=(snap)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const elem=this.getSnapElement(snap);
      elem.addClass('lichessTools-highlight');
      parent.global.setTimeout(()=>elem.removeClass('lichessTools-highlight'),1000);
    }

    removeSnap=(snap)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      parent.arrayRemoveAll(this.options.snaps,s=>s.title==snap.title);
      this.saveSnaps();
    };

    getSnapBySettings=(settings)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const stringify=parent.global.JSON.stringify;
      let snap=this.options.snaps.find(s=>stringify(s.settings)==stringify(settings));
      return snap;
    }

    toggleSnaps=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!this.options.enabled || this.options.snaps.length<=1) return;
      const settings=this.getSettings();
      let snap=this.getSnapBySettings(settings);
      let index=0;
      if (snap) {
        index=this.options.snaps.indexOf(snap);
        index=(index+1)%this.options.snaps.length;
      }
      snap=this.options.snaps[index];
      this.setSnap(snap);
      if (!lichess.analysis?.explorer?.config?.data?.open()) {
        lichess.analysis?.explorer?.fetch();
      }
    };

    snapSettings=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const settings=this.getSettings();
      let snap=this.getSnapBySettings(settings);
      if (snap) {
        this.highlightSnap(snap);
        return;
      }
      const title=parent.global.prompt(trans.noarg('addSnapPrompt'));
      if (!title) return;
      if (this.options.snaps.find(s=>s.title==title) && !parent.global.confirm(trans.pluralSame('replaceSnapPrompt',title))) return;
      snap={
        title: title,
        settings: settings
      };
      this.options.snaps.push(snap);
      this.saveSnaps();
    };

    saveSnaps=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      lichess.storage.set('LiChessTools.explorerSnaps',parent.global.JSON.stringify(this.options.snaps));
      parent.emitRedraw();
    };

    showSnapsDirect=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const titleElem=$('.explorer-title span.lichess');
      if (titleElem.length) {
        const settings=this.getSettings();
        const snap=this.getSnapBySettings(settings);
        if (!this._originalTitle) {
          this._originalTitle=titleElem.text();
        }
        titleElem
          .text(snap?.title || this._originalTitle);
        titleElem.off('click',this.toggleSnaps);
        titleElem.on('click',this.toggleSnaps);
      }
      if (!lichess.analysis?.explorer?.config?.data?.open()) return;
      const container=$('section.explorer-box div.config >div:has(section.date)');
      if (!container.length) return;
      let section=$('section.lichessTools-explorerSnaps',container);
      if (!this.options.enabled || lichess.analysis.explorer.config.data.db()!='lichess') {
        section.remove();
        return;
      };
      if (!section.length) {
        section=$('<section class="lichessTools-explorerSnaps">')
          .appendTo(container);
      }
      if (!$('button[data-act="snap"]',section).length) {
        $('<button>')
          .addClass('button button-green')
          .attr('data-act',"snap")
          .text(trans.noarg('snapSettingsButtonText'))
          .attr('title',trans.noarg('snapSettingsButtonTitle'))
          .on('click',this.snapSettings)
          .prependTo(section);
      }
      $('button[data-act="shot"]',section).each((i,e)=>{
        const title=$(e).attr('data-act-title');
        if (!this.options.snaps.find(s=>s.title==title)) {
           $(e).parent('div').remove();
        }
      });
      for (const snap of this.options.snaps) {
        const snapElem=this.getSnapElement(snap);
        if (snapElem.length) continue;
        $('<div>')
         .append($('<button>')
           .addClass('button')
           .attr('data-act',"shot")
           .attr('data-act-title',snap.title)
           .text(snap.title)
           .attr('title',trans.pluralSame('snapButtonTitle',snap.title))
           .on('click',()=>this.setSnap(snap))
         )
         .append($('<button>')
           .addClass('remove')
           .attr('data-icon','\uE03F')
           .on('click',()=>this.removeSnap(snap))
         )
         .appendTo(section);
      }
    };
    showSnaps=this.lichessTools.debounce(this.showSnapsDirect,100);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerSnaps');
      this.logOption('Explorer snaps', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const explorer=lichess?.analysis?.explorer;
      if (!explorer) return;
      this.options={
        enabled:value,
        snaps:parent.jsonParse(_=>lichess.storage.get('LiChessTools.explorerSnaps'),[])
      };
      explorer.config.toggleOpen=parent.unwrapFunction(explorer.config.toggleOpen,'explorerSnaps');
      $('section.explorer-box section.lichessTools-explorerSnaps').remove();
      lichess.pubsub.off('redraw',this.showSnaps);
      $('.explorer-title span.lichess')
        .off('click',this.toggleSnaps);
      if (!value) {
        if (this._originalTitle) {
          $('.explorer-title span.lichess')
            .text(this._originalTitle)
            .off('click',this.toggleSnaps);
        }
        return;
      }
      explorer.config.toggleOpen=parent.wrapFunction(explorer.config.toggleOpen,{
        id:'explorerSnaps',
        after:($this,result)=>{
          this.showSnaps();
        }
      });
      lichess.pubsub.on('redraw',this.showSnaps);
      this.showSnaps();
    }

  }
  LiChessTools.Tools.ExplorerSnaps=ExplorerSnapsTool;
})();

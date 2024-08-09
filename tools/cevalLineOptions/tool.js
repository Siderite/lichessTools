(()=>{
  class CevalLineOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'cevalLineOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['highlight'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.cevalLineOptions': 'Computer evaluation line options',
        'cevalLineOptions.highlight': 'Highlight same moves'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.cevalLineOptions': 'Op\u0163iuni linii \uee00n evaluarea computerului',
        'cevalLineOptions.highlight': 'Eviden\u0163iaza acelea\u015Fi mut\u0103ri'
      }
    }

    getKey=(elem)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const e=$(elem);
      const san=e.text().replace(/[\+#\?!]/,'');
      const turn=+(e.attr('data-move-index'))%2;
      return `${san}-${turn}`;
    };

    dict=new Map();
    clsIndex=0;
    handlePvs=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      this.dict=new Map(this.dict.entries().filter(e=>e[1].cls));
      this.dict.values().forEach(v=>v.count=0);
      $('div.pv_box span.pv-san').each((i,e)=>{
        if (!parent.inViewport(e)) return;
        const key=this.getKey(e);
        const data=this.dict.get(key);
        if (data) {
          data.count++;
        } else {
          this.dict.set(key,{ count: 1, cls: '' });
        }
      });
      const arr=[...this.dict];
      arr.sort((a,b)=>b[1].count-a[1].count);
      const demotes=arr.map(entry=>entry[1]).filter(val=>val.count<=1 && val.cls);
      arr.forEach((entry)=>{
        const key=entry[0];
        const val=entry[1];
        if (val.count>1 && !val.cls) {
          if (demotes.length) {
            const demote=demotes.shift();
            val.cls=demote.cls;
            demote.cls='';
          } else {
            this.clsIndex++;
            if (this.clsIndex>30) {
              parent.global.console.debug('Ceval highlight class index: ',this.clsIndex);
            }
            val.cls='lichessTools-cevalHighlight-'+this.clsIndex;
          }
        }
      });
      $('div.pv_box span.pv-san')
        .each((i,e)=>{
          const key=this.getKey(e);
          const val=this.dict.get(key);
          const cls=val?.count>1
            ? ('pv-san '+val.cls).trim()
            : 'pv-san';
          if (e.className!=cls) e.className=cls;
        });
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('cevalLineOptions');
      this.logOption('Ceval line options', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      this.options={
        highlight:parent.isOptionSet(value,'highlight')
      }
      this.observer?.disconnect();
      this.observer=null;
      if (this.options.highlight) {
        const analysisTools=$('main .analyse__tools')[0];
        if (analysisTools) {
          this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if ($(mutation.target).is('.pv')) {
                this.handlePvs();
                return;
              }
            }
          });

          this.observer.observe(analysisTools, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
          });

          this.handlePvs();
       }
     }
   }

  }
  LiChessTools.Tools.CevalLineOptions=CevalLineOptionsTool;
})();

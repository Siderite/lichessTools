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

    dict=new Map();
    cls=[];
    clsIndex=0;
    handlePvs=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      this.dict.values().forEach(v=>v.count=0);
      $('div.pv_box span.pv-san').each((i,e)=>{
        const san=$(e).text().replace(/[\+#\?!]/,'');
        const turn=+($(e).attr('data-move-index'))%2;
        const key=`${san}-${turn}`;
        const data=this.dict.get(key);
        if (data) {
          data.count++;
        } else {
          this.dict.set(key,{ count: 1, cls: '' });
        }
      });
      const arr=[...this.dict];
      arr.sort((a,b)=>b[1].count-a[1].count);
      arr.forEach((entry)=>{
        const key=entry[0];
        const val=entry[1];
        if (val.count<=1) {
          if (val.cls) {
            this.cls.push(val.cls);
            val.cls='';
          }
        } else {
          if (!val.cls) {
            if (this.cls.length) {
              val.cls=this.cls.shift();
            } else {
              this.clsIndex++;
              val.cls='lichessTools-cevalHighlight-'+this.clsIndex;
            }
          }
        }
        $('div.pv_box span.pv-san')
          .filter((i,e)=>{
            const s=$(e).text().replace(/[\+#\?!]/,'');
            const t=+($(e).attr('data-move-index'))%2;
            const k=`${s}-${t}`;
            return key==k;
          })
          .each((i,e)=>{
            const cls=('pv-san '+val.cls).trim();
            if (e.className!=cls) e.className=cls;
          });
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
        this.observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if ($(mutation.target).is('.pv')) {
              this.handlePvs();
              return;
            }
          }
        });

        this.observer.observe(parent.global.document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class']
        });

        this.handlePvs();
     }
   }

  }
  LiChessTools.Tools.CevalLineOptions=CevalLineOptionsTool;
})();

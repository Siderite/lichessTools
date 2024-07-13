(()=>{
  class EnhancedPgnImportTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'enhancedImport',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.enhancedImport': 'Enhanced PGN import',
        'mergeSuccess': 'LiChess Tools - merged %s PGNs',
        'mergeSuccess:one': 'LiChess Tools - imported one PGN',
        'mergeError': 'LiChess Tools - merged %s PGNs. Error: ',
        'differentFensError': 'cannot merge PGNs with different starting positions'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.enhancedImport': 'Import PGN extins',
        'mergeSuccess': 'LiChess Tools - am combinat %s PGNuri',
        'mergeSuccess:one': 'LiChess Tools - am importat un PGN',
        'mergeError': 'LiChess Tools - am combinat %s PGNuri. Eroare: ',
        'differentFensError': 'nu pot combina PGNuri cu pozi\u0163ii de start diferite'
      }
    }

    regPgn=/(?:((?:\s*\[\s*\w+\s+"[^"]*"\s*\])+)|((?:^|\r?\n)\s*(?:\{[^\}]*\}\s*)?1\.[^\.]))/g;

    isEmpty=(data)=>{
      if (!data?.treeParts?.length) return true;
      if (data.treeParts.length==1 && data.treeParts[0].id=='') return true;
      return false;
    }

    splitPgn=(input)=>{
      if (!input) return [];
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      const console=parent.global.console;
      const oldChangePgn=analysis.changePgn.__originalFunction.bind(analysis);
      const importPgn=function(pgn,merge) {
        const result = oldChangePgn(pgn,merge);
        if (result && pgn) {
          const m=/\[Orientation\s*"Black"|StartFlipped\s*"1"\]/i.test(pgn);
          if (m) result.orientation="black";
        }
        return result;
      };
      const items=[];
      let m=this.regPgn.exec(input);
      while (m) {
        const item = {
          type: m[1]?1:2,
          index: m.index
        }
        items.push(item);
        m=this.regPgn.exec(input);
      }
      let pos;
      let prevItem=null;
      for (const item of items) {
        if (prevItem) {
          prevItem.value=input.substring(pos,item.index);
        }
        pos=item.index;
        prevItem=item;
      }
      if (prevItem) {
        prevItem.value=input.substring(pos);
      }
      const pgns=[];
      prevItem=null;
      for (const item of items) {
        if (item.type==1) {
          if (prevItem) {
            console.log('Empty PGN ignored',prevItem.value);
          }
          const result=importPgn(item.value,false);
          if (!this.isEmpty(result)) {
            pgns.push(result);
            prevItem=null;
          } else {
            prevItem=item;
          }
        } else {
          if (prevItem) {
            const result=importPgn(prevItem.value+item.value,false);
            if (this.isEmpty(result)) {
              console.warn('1: Error parsing PGN',prevItem.value+item.value);
            } else {
              pgns.push(result);
              prevItem=null;
              continue;
            }
          }
          const result=importPgn(item.value,false);
          if (this.isEmpty(result)) {
            console.warn('2: Error parsing PGN',item.value);
          } else {
            pgns.push(result);
          }
          prevItem=null;
        }
      }
      if (prevItem) {
        const result=importPgn(prevItem.value,false);
        if (!this.isEmpty(result)) {
          pgns.push(result);
        } else {
          console.warn('3: Error parsing PGN',prevItem.value);
        }
      }
      return pgns;
    }

    setupBlurOnEscape=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const input=$('div.pgn textarea,div.pair input');
      if (!input.length) return;
      input.off('keyup',this.blurOnEscape);
      if (!this.options.enabled) return;
      input.on('keyup',this.blurOnEscape);
    };

    blurOnEscape=ev=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (ev.key=='Escape') ev.target.blur();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('enhancedImport');
      this.logOption('Enhanced PGN import', value);
      this.options={ enabled: value };
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      this.setupBlurOnEscape();
      lichess.pubsub.off('redraw',this.setupBlurOnEscape);
      analysis.changePgn=parent.unwrapFunction(analysis.changePgn,'enhancedImport');
      if (!value) return;
      lichess.pubsub.on('redraw',this.setupBlurOnEscape);
      
      analysis.changePgn=parent.wrapFunction(analysis.changePgn,{
        id:'enhancedImport',
        before:($this,input,andReload)=>{
          return false;
        },
        after:($this,result,input,andReload)=>{
          const oldChangePgn=$this.changePgn.__originalFunction.bind($this);
          let data=null;
          let successfulPGNs=0;
          let lastError=null;
          try {
            let pgns=this.splitPgn(input);
            if (andReload) {
              parent.global.console.debug('...merging '+pgns.length+' PGNs');
              const pgnsByFen=[];
              let maxItem={ count:-1 };
              for (const pgn of pgns) {
                const fen=pgn?.game?.fen;
                if (!fen) continue;
                let item=pgnsByFen.find(i=>i.fen==fen);
                if (item) {
                  item.count++;
                } else {
                  item={fen:fen, count:1};
                  pgnsByFen.push(item);
                }
                if (item.count>maxItem.count) {
                  maxItem=item;
                }
              }
              if (pgnsByFen.length>1) {
                lastError=trans.noarg('differentFensError');
                console.warn('Error loading PGN',lastError);
                pgns=pgns.filter(pgn=>pgn?.game?.fen==maxItem.fen);
              }
              let merge=false;
              for (let i=pgns.length-1;i>=0; i--) {
                const pgn=pgns[i];
                try{
                  if (i>0) {
                    $this.initialize(pgn,merge);
                  } else {
                    $this.reloadData(pgn,merge);
                    $this.jump('');
                  }
                  merge=andReload;
                  successfulPGNs++;
                } catch(ex) {
                  lastError=ex;
                  console.warn('Error loading PGN',ex, pgns.length-i-1);
                }
              }
              const announcement = lastError
                ? trans.pluralSame('mergeError',successfulPGNs)+lastError
                : trans.pluralSame('mergeSuccess',successfulPGNs);
              parent.announce(announcement);
              const newPgn=$('div.pgn textarea').val();
              data=oldChangePgn(newPgn,false);
              $this.explorer.reload()
              $this.redraw();
            } else {
              data=pgns[0];
            }
          } catch(ex){
            parent.global.console.warn('Enhanced import failed',ex);
            data=oldChangePgn(input,andReload);
          }
          if (lastError) parent.global.console.debug('...merged only '+successfulPGNs+' PGNs');
          return data;
        }
      });
    }
  }
  LiChessTools.Tools.EnhancedPgnImport=EnhancedPgnImportTool;
})();

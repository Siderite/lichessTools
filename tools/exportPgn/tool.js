(()=>{
  class ExportPGNTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'exportPGN',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced:true,
        hidden:true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.exportPGN': 'Export PGN'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.exportPGN': 'Export\u0103 PGN'
      }
    }

    exportPgn=async (path,options)=>{
      options={
        copyToClipboard: false,
        fromPosition: false,
        separateLines: false,
        ...options
      };
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const announce=parent.announce;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const Math=parent.global.Math;
      const navigator=parent.global.navigator;
      const trans=parent.translator;

      function fixCrazySan(san) {
        if (!san || san[0] !== 'P') return san;
        return san.slice(1);
      }
    
      function plyPrefix(node) {
        return `${Math.floor((node.ply + 1) / 2)}${node.ply % 2 === 1 ? '. ' : '... '}`;
      }
    
      function renderComments(node) {
        let s='';
        for (const glyph of node.glyphs||[]) {
          if (glyph.id) { // tools like Explorer Practice don't set id
            s+=glyph.id>=1&&glyph.id<=6
                ? glyph.symbol
                : ' $'+glyph.id;
          }
        }
        for (const comment of node.comments||[]) {
          s+='{'+comment.text+'}';
        }
        const groups=[];
        for(const shape of node.shapes||[]) {
          const type=shape.dest?'cal':'csl';
          let group=groups[groups.length-1];
          if (group?.type!=type) {
            group={
              type:type,
              shapes:[]
            };
            groups.push(group);
          }
          const code=shape.brush[0].toUpperCase()+shape.orig+(shape.dest||'');
          group.shapes.push(code);
        }
        if (groups.length) {
          s+='{';
          for (const group of groups) {
            s+='[%'+group.type+' '+group.shapes.join(',')+']';
          }
          s+='}';
        }
        return s;
      }
    
      function renderNodesTxt(node, forcePly) {
        if (node.children.length === 0) return '';
    
        let s = '';
    
        if (node.id=='') s+=renderComments(node);
        if (s) s+='\r\n'
    
        const first = node.children[0];
        if (forcePly || first.ply % 2 === 1) s += plyPrefix(first);
        s += fixCrazySan(first.san);
    
        s+=renderComments(first);
    
        for (let i = 1; i < node.children.length; i++) {
          const child = node.children[i];
          s += ` (${plyPrefix(child)}${fixCrazySan(child.san)}`;
          s += renderComments(child);
          const variation = renderNodesTxt(child, false);
          if (variation) s += ' ' + variation;
          s += ')';
        }
    
        const mainline = renderNodesTxt(first, node.children.length > 1);
        if (mainline) s += ' ' + mainline;
    
        return s;
      }
    
      function clone(n2, withoutChildren) {
        const JSON=parent.global.JSON;
        const n1={
          children: [],
          eval: n2.eval,
          comments: n2.comments?JSON.parse(JSON.stringify(n2.comments)):[],
          glyphs: n2.glyphs?JSON.parse(JSON.stringify(n2.glyphs)):[],
          shapes: n2.shapes?JSON.parse(JSON.stringify(n2.shapes)):[],
          ceval: n2.ceval?JSON.parse(JSON.stringify(n2.ceval)):null,
          opening: n2.opening?JSON.parse(JSON.stringify(n2.opening)):null,
          id: n2.id,
          ply: n2.ply,
          san:n2.san,
          uci:n2.uci,
          fen:n2.fen
        };
        if (!withoutChildren) {
          n2.children.forEach(function (c) {
            n1.children.push(clone(c));
          });
        }
        return n1;
      }

      function getVarNodes(node, separateLines) {
        if (!separateLines) return [node];
        let arr=[{root: node, current: node}];
        let loop=true;
        while (loop) {
          loop=false;
          const newArr=[];
          for (const item of arr) {
            const nrChildren=item.current.children?.length||0;
            switch(nrChildren) {
              case 0:
                newArr.push(item);
                break;
              case 1:
                newArr.push({ root:item.root, current:item.current.children[0] });
                loop=true;
                break;
              default:
                for (let i=0; i<nrChildren; i++) {
                  const root=clone(item.root);
                  const res={ root: root, current: root };
                  while (res.current.children?.length==1) res.current=res.current.children[0];
                  res.current.children=[res.current.children[i]];
                  newArr.push(res);
                  loop=true;
                }
                break;
            }
          }
          arr=newArr;
        }
        return arr.map(x=>x.root);
      }
    
      try{
        const nodes=lichess.analysis.tree.getNodeList(path);
        const startIndex=options.fromPosition?Math.max(0,nodes.length-1):0;
        let prevNode=null;
        let varNode=null;
        for (let i=startIndex; i<nodes.length; i++) {
          const isLast=i==nodes.length-1;
          const node=clone(nodes[i],!isLast);
          if (prevNode) prevNode.children=[node];
          prevNode=node;
          if (!varNode) varNode=node;
        }
        const varNodes=getVarNodes(varNode,options.separateLines);
        const pgns=[];
        for (const node of varNodes) {
          let pgn=renderNodesTxt(node,options.fromPosition);
          if (analysis.getOrientation()!='white' && !/\[Orientation|\[StartFlipped/.test(pgn)) {
            pgn='[StartFlipped "1"]\r\n[Orientation "Black"]\r\n'+pgn;
          }
          if (node.fen && node.fen!='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
            pgn='[FEN "'+node.fen+'"]\r\n'+pgn;
          }
          pgns.push(pgn);
        }
        const result=pgns.join('\r\n\r\n');
        if (options.copyToClipboard) {
          const permission=await parent.global.navigator.permissions.query({ name: 'clipboard-write' });
          if (['granted','prompt'].includes(permission.state)) {
            try {
              await parent.global.navigator.clipboard.writeText(result);
              const announcement = trans.noarg('PGNCopiedToClipboard');
              announce(announcement);
            } catch(e) {
              const announcement = trans.noarg('clipboardDenied');
              announce(announcement);
            }
          } else {
            const announcement = trans.noarg('clipboardDenied');
            announce(announcement);
          }
        }
        return result;
      } catch (e) {
        console.warn('Error generating PGN:',e);
        const announcement = trans.noarg('errorGeneratingPGN');
        announce(announcement);
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('exportPGN');
      this.logOption('Export PGN', value);
      if (value) parent.exportPgn=this.exportPgn;
    }

  }
  LiChessTools.Tools.ExportPGN=ExportPGNTool;
})();

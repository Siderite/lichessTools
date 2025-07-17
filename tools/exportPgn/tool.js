(() => {
  class ExportPGNTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'exportPGN',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      },
      {
        name: 'exportPGNoptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['exportClock', 'exportEval', 'exportTags', 'exportShapes'],
        defaultValue: 'exportClock,exportEval,exportTags,exportShapes',
        advanced: true
      }
    ];

    upgrades = [
      { name:'exportPGNoptions', value:'exportShapes', version: '2.3.193' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.exportPGN': 'Export PGN',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied',
        'options.exportPGNoptions': 'Options for PGN exports',
        'exportPGNoptions.exportClock': 'Export clock values',
        'exportPGNoptions.exportEval': 'Export computer evaluation',
        'exportPGNoptions.exportTags': 'Export PGN tags',
        'exportPGNoptions.exportShapes': 'Export arrows and circles'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.exportPGN': 'Export\u0103 PGN',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard',
        'options.exportPGNoptions': 'Op\u0163iuni pentru exporturi PGN',
        'exportPGNoptions.exportClock': 'Export\u0103 timp pe mut\u0103ri',
        'exportPGNoptions.exportEval': 'Export\u0103 evalu\u0103ri computer',
        'exportPGNoptions.exportTags': 'Export\u0103 etichete PGN',
        'exportPGNoptions.exportShapes': 'Export\u0103 s\u0103ge\u0163i \u015fi cercuri'
      }
    }

    exportPgn = async (path, options) => {
      options = {
        copyToClipboard: false,
        fromPosition: false,
        toPosition: false,
        separateLines: false,
        unicode: false,
        print: false,
        exportClock: this.options.exportClock,
        exportEval: this.options.exportEval,
        exportTags: this.options.exportTags,
        exportShapes: this.options.exportShapes,
        ...options
      };
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const announce = lt.announce;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const Math = lt.global.Math;
      const navigator = lt.global.navigator;
      const trans = lt.translator;

      function fixCrazySan(san) {
        if (!san || san[0] !== 'P') return san;
        return san.slice(1);
      }

      function plyPrefix(node) {
        return `${Math.floor((node.ply + 1) / 2)}${node.ply % 2 === 1 ? '. ' : '... '}`;
      }

      function centisecondsToClock(cs) {
        const h=Math.floor(cs/360000);
        const m=Math.floor(cs%360000/6000);
        const s=Math.round(cs%6000/100);
        return h.toString().padStart(2,'0')+':'+m.toString().padStart(2,'0')+':'+s.toString().padStart(2,'0');
      }

      function evalToString(evl) {
        if (evl.cp !== undefined) return (evl.cp/100).toString();
        if (evl.mate !== undefined) return '#'+evl.mate;
      }

      function renderComments(node) {
        let s = '';
        for (const glyph of node.glyphs || []) {
          if (glyph.id) { // tools like Explorer Practice don't set id
            s += glyph.id >= 1 && glyph.id <= 6
              ? glyph.symbol
              : ' $' + glyph.id;
          }
        }
        if (node.comments?.length) {
          if (options.print) {
            s += '<br/>\r\n<br/>\r\n<img src="https://lichess.org/export/fen.gif?fen='+encodeURIComponent(node.fen)+'&color='+analysis.getOrientation()+'&lastMove='+node.uci+'" /><br/>\r\n';
          }
          for (const comment of node.comments) {
            if (options.print) {
              s += '<br/>\r\n' + comment.text;
            } else {
              s += ' {' + comment.text + '}';
            }
          }
          if (options.print) {
            s += '<br/>\r\n<br/>\r\n';
          }
        }
        const groups = [];
        if (options.exportShapes) {
          for (const shape of node.shapes || []) {
            if (shape.type == 'rank' || shape.customSvg) continue;
            const type = shape.dest ? 'cal' : 'csl';
            let group = groups.at(-1);
            if (group?.type != type) {
              group = {
                type: type,
                shapes: []
              };
              groups.push(group);
            }
            const code = shape.brush[0].toUpperCase() + shape.orig + (shape.dest || '');
            group.shapes.push(code);
          }
        }
        if (options.exportClock && node.clock) {
          const group = {
            type: 'clk',
            shapes: [ centisecondsToClock(node.clock) ]
          };
          groups.push(group);
        }
        const evl = node.ceval || node.eval;
        if (options.exportEval && evl) {
          const group = {
            type: 'eval',
            shapes: [ evalToString(evl) ]
          };
          groups.push(group);
        }
        if (!options.print && groups.length) {
          s += ' {';
          for (const group of groups) {
            s += '[%' + group.type + ' ' + group.shapes.join(',') + ']';
          }
          s += '}';
        }
        return s;
      }

      const regChessMove = /\b(?<piece>[NBRQK])?(?<p1>([a-h])?([1-8])?(x)?([a-h][1-8]))(=(?<promotion>[NBRQK]))?(?<p2>\+|#)?\b/g;
      const unicodePiece = {
        'N': lt.icon.WhiteChessKnight,
        'B': lt.icon.WhiteChessBishop,
        'R': lt.icon.WhiteChessRook,
        'Q': lt.icon.WhiteChessQueen,
        'K': lt.icon.WhiteChessKing
      };
      function translateUnicode(s) {
        if (!s) return s;
        return s.replace(regChessMove, (...m) => {
          const g = m.at(-1);
          if (!g.piece && !g.promotion) return m[0];
          return (unicodePiece[g.piece] || '') + (g.p1 || '') + (unicodePiece[g.promotion] || '') + (g.p2 || '');
        });
      }

      function renderNodesTxt(node, forcePly) {
        let s = '';

        if (node.id == '') s += renderComments(node);
        if (s) s += '\r\n'
        if (node.children.length === 0) return s;


        const first = node.children[0];
        if (forcePly || first.ply % 2 === 1) s += plyPrefix(first);
        s += fixCrazySan(first.san);

        s += renderComments(first);

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

        if (options.unicode) {
          s = translateUnicode(s);
        }
        return s;
      }

      function clone(n2, withoutChildren) {
        const JSON = lt.global.JSON;
        const n1 = {
          children: [],
          clock: n2.clock,
          eval: n2.eval,
          comments: lt.clone(n2.comments) || [],
          glyphs: lt.clone(n2.glyphs) || [],
          shapes: lt.clone(n2.shapes) || [],
          ceval: lt.clone(n2.ceval) || null,
          opening: lt.clone(n2.opening) || null,
          id: n2.id,
          ply: n2.ply,
          san: n2.san,
          uci: n2.uci,
          fen: n2.fen
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
        let arr = [{ root: node, current: node }];
        let loop = true;
        while (loop) {
          loop = false;
          const newArr = [];
          for (const item of arr) {
            const nrChildren = item.current.children?.length || 0;
            switch (nrChildren) {
              case 0:
                newArr.push(item);
                break;
              case 1:
                newArr.push({ root: item.root, current: item.current.children[0] });
                loop = true;
                break;
              default:
                for (let i = 0; i < nrChildren; i++) {
                  const root = clone(item.root);
                  const res = { root: root, current: root };
                  while (res.current.children?.length == 1) res.current = res.current.children[0];
                  res.current.children = [res.current.children[i]];
                  newArr.push(res);
                  loop = true;
                }
                break;
            }
          }
          arr = newArr;
        }
        return arr.map(x => x.root);
      }

      function addTag(tags, key, value, skipIfExists) {
        const index = tags.findIndex(([pkey, pvalue]) => pkey == key);
        if (index >= 0) {
          if (skipIfExists) return;
          tags[index][1] = value;
        } else {
          tags.push([key, value]);
        }
      }

      try {
        const nodes = analysis.tree.getNodeList(path);
        const startIndex = options.fromPosition ? Math.max(0, nodes.length - 1) : 0;
        let prevNode = null;
        let varNode = null;
        for (let i = startIndex; i < nodes.length; i++) {
          const isLast = i == nodes.length - 1 && !options.toPosition;
          const node = clone(nodes[i], !isLast);
          if (prevNode) prevNode.children = [node];
          prevNode = node;
          if (!varNode) varNode = node;
        }
        const varNodes = getVarNodes(varNode, options.separateLines);
        const pgns = [];
        const tags = (options.exportTags && lt.clone(analysis.study?.data?.chapter?.tags)) || [];
        if (options.exportTags && analysis.getOrientation() != 'white') {
          addTag(tags, 'StartFlipped', '1');
          addTag(tags, 'Orientation', 'Black');
        }
        if (varNode?.fen && !lt.isStartFen(varNode.fen)) {
          addTag(tags, 'FEN', varNode.fen);
          if (options.exportTags)addTag(tags, 'SetUp', '1');
        }
        if (options.exportTags) {
          addTag(tags, 'Site', lt.global.location.href, true);
          const now = new Date().toISOString();
          addTag(tags, 'UTCDate', now.substr(0, 10).replaceAll('-', '.'), true);
          addTag(tags, 'UTCTime', now.substr(11, 8), true);
        }
        const tagString = !options.print && tags.length 
          ? tags.map(tag => '[' + tag[0] + ' "' + tag[1] + '"]').join('\r\n') + '\r\n' 
          : '';
        for (const node of varNodes) {
          const pgn = tagString + renderNodesTxt(node, true);
          pgns.push(pgn);
        }
        const result = pgns.join('\r\n\r\n');
        if (options.copyToClipboard) {
          await lt.writeToClipboard(result, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'), !!options.print);
        }
        return result;
      } catch (e) {
        console.warn('Error generating PGN:', e);
        const announcement = trans.noarg('errorGeneratingPGN');
        announce(announcement);
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('exportPGN');
      const opts = lt.currentOptions.getValue('exportPGNoptions');
      this.logOption('Export PGN', value);
      this.logOption('Export PGN options', opts);
      this.options = {
        exportClock: lt.isOptionSet(opts, 'exportClock'),
        exportEval: lt.isOptionSet(opts, 'exportEval'),
        exportTags: lt.isOptionSet(opts, 'exportTags'),
        exportShapes: lt.isOptionSet(opts, 'exportShapes')
      };

      if (value) {
        lt.exportPgn = this.exportPgn;
      } else {
        lt.exportPgn = null;
      }
    }

  }
  LiChessTools.Tools.ExportPGN = ExportPGNTool;
})();

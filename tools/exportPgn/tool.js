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
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.exportPGN': 'Export PGN',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.exportPGN': 'Export\u0103 PGN',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard'
      }
    }

    exportPgn = async (path, options) => {
      options = {
        copyToClipboard: false,
        fromPosition: false,
        toPosition: false,
        separateLines: false,
        unicode: false,
        ...options
      };
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const announce = parent.announce;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const Math = parent.global.Math;
      const navigator = parent.global.navigator;
      const trans = parent.translator;

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
        for (const comment of node.comments || []) {
          s += ' {' + comment.text + '}';
        }
        const groups = [];
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
        if (node.clock) {
          const group = {
            type: 'clk',
            shapes: [ centisecondsToClock(node.clock) ]
          };
          groups.push(group);
        }
        const evl = node.ceval || node.eval;
        if (evl) {
          const group = {
            type: 'eval',
            shapes: [ evalToString(evl) ]
          };
          groups.push(group);
        }
        if (groups.length) {
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
        'N': '\u2658',
        'B': '\u2657',
        'R': '\u2656',
        'Q': '\u2655',
        'K': '\u2654',
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
        const JSON = parent.global.JSON;
        const n1 = {
          children: [],
          clock: n2.clock,
          eval: n2.eval,
          comments: parent.clone(n2.comments) || [],
          glyphs: parent.clone(n2.glyphs) || [],
          shapes: parent.clone(n2.shapes) || [],
          ceval: parent.clone(n2.ceval) || null,
          opening: parent.clone(n2.opening) || null,
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
        const tags = parent.clone(analysis.study?.data?.chapter?.tags) || [];
        if (analysis.getOrientation() != 'white') {
          addTag(tags, 'StartFlipped', '1');
          addTag(tags, 'Orientation', 'Black');
        }
        if (varNode?.fen && !parent.isStartFen(varNode.fen)) {
          addTag(tags, 'FEN', varNode.fen);
          addTag(tags, 'SetUp', '1');
        }
        addTag(tags, 'Site', parent.global.location.href, true);
        const now = new Date().toISOString();
        addTag(tags, 'UTCDate', now.substr(0, 10).replaceAll('-', '.'), true);
        addTag(tags, 'UTCTime', now.substr(11, 8), true);
        const tagString = tags.length ? tags.map(tag => '[' + tag[0] + ' "' + tag[1] + '"]').join('\r\n') + '\r\n' : '';
        for (const node of varNodes) {
          const pgn = tagString + renderNodesTxt(node, options.fromPosition);
          pgns.push(pgn);
        }
        const result = pgns.join('\r\n\r\n');
        if (options.copyToClipboard) {
          await parent.writeToClipboard(result, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
        }
        return result;
      } catch (e) {
        console.warn('Error generating PGN:', e);
        const announcement = trans.noarg('errorGeneratingPGN');
        announce(announcement);
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('exportPGN');
      this.logOption('Export PGN', value);
      if (value) {
        parent.exportPgn = this.exportPgn;
      } else {
        parent.exportPgn = null;
      }
    }

  }
  LiChessTools.Tools.ExportPGN = ExportPGNTool;
})();

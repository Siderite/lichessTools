(() => {
  class ExtraPieceSetsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'extraPieceSets',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['siderite','chesscom','hollowleaf','bend-n','comfysage','tage64','OwOHamper','DragurKnight','LichessHelper','basedpolymer'],
        defaultValue: 'siderite,chesscom,hollowleaf',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.extraPieceSets': 'Extra piece sets',
        'pieceSetTitle': 'LiChess Tools - %s',
        'userManualLinkTitle': 'User manual (EN)',

        'extraPieceSets.siderite': 'Siderite', // don't translate these
        'extraPieceSets.chesscom': 'chess.com',
        'extraPieceSets.hollowleaf': 'HollowLeaf',
        'extraPieceSets.bend-n': 'bend-n',
        'extraPieceSets.comfysage': 'comfysage',
        'extraPieceSets.tage64': 'tage64',
        'extraPieceSets.OwOHamper': 'OwOHamper',
        'extraPieceSets.DragurKnight': 'DragurKnight',
        'extraPieceSets.LichessHelper': 'LichessHelper',
        'extraPieceSets.basedpolymer': 'basedpolymer'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.extraPieceSets': 'Seturi suplimentare de piese',
        'pieceSetTitle': 'LiChess Tools - %s',
        'userManualLinkTitle': 'Manual utilizator (EN)'
      }
    }

    removePieceStyleAttributes = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const bodyStyle = $('body').attr('style');
      const newStyle = bodyStyle
                         .split(';')
                         .filter(s=>!/^\s*---(white|black)-(pawn|knight|bishop|rook|queen|king)/.test(s))
                         .join(';');
      if (newStyle != bodyStyle) {
        $('body').attr('style',newStyle);
      }
    };

    updatePieceSet = (forced)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const existingStyle = $('style#lichessTools-extraPieceSets');
      if (!this.pieceSets) {
        existingStyle.remove();
        return;
      }
      if (forced) {
        existingStyle.remove();
      } else
      if (existingStyle.length) {
        return;
      }
      lt.storage.remove('extraPieceSets-lastStyle');
      const setName = lt.storage.get('extraPieceSets-set');
      if (!setName) return;
      this.removePieceStyleAttributes();
      const pieceSet = this.pieceSets.find(ps=>ps.name == setName);
      if (!pieceSet) {
        lt.global.console.warn('Piece set '+setName+' not loaded!');
        return;
      }
      let styleStr = '<style id="lichessTools-extraPieceSets">:root body.lichessTools {';
      for (const piece of ['pawn','knight','bishop','rook','queen','king']) {
        for (const color of ['white','black']) {
          const url = this.getUrl(pieceSet,piece,color);
          styleStr += `---${color}-${piece}:  url(${url});`;
        }
      }
      styleStr+='}</style>';
      lt.storage.set('extraPieceSets-lastStyle',styleStr);
      $(styleStr).appendTo('head');
      this.addPieces();
    };

    setPieceSet = (name) =>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!name) {
        lt.storage.remove('extraPieceSets-set');
      } else {
        lt.storage.set('extraPieceSets-set',name);
      }
      this.updatePieceSet(true);
    };

    getUrl = (pieceSet,piece,color) => {
      switch(pieceSet.category) {
        case 'siderite':
        case 'hollowleaf':
        case 'bend-n':
        {
          const pieceLetter = piece == 'knight' ? 'N' : piece[0].toUpperCase();
          return pieceSet.url+color[0]+pieceLetter+'.'+pieceSet.type;
        }
        case 'chesscom':
        case 'tage64':
        case 'OwOHamper':
        case 'LichessHelper':
        {
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          return pieceSet.url+color[0]+pieceLetter+'.'+pieceSet.type
        }
        case 'basedpolymer':
        {
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          let key = color[0]+pieceLetter;
          if (pieceSet.name == 'ichess_basedpolymer') {
            const ring = {
              'bp':'j2WrNG',
              'br':'fzAmF1',
              'bn':'JAq5BZ',
              'bb':'ZxcpUI',
              'bq':'tgDj55',
              'bk':'Eu0v0L',
              'wp':'snAUn',
              'wr':'ZB0EnP',
              'wn':'AKcFJe',
              'wb':'IzedLx',
              'wq':'qfWM82',
              'wk':'3H6DG9'
            };
            key = ring[key];
          }
          return pieceSet.url+key+'.'+pieceSet.type
        }
        case 'comfysage':
        {
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          return pieceSet.url+color[0]+'/'+color[0]+pieceLetter+'.'+pieceSet.type
        }
        case 'DragurKnight':
        {
          return pieceSet.url+color[0]+'_'+piece+'.'+pieceSet.type
        }
        default:
          throw new Error('Unknown piece set type' + type);
      }
    };


    addPieces = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.piece.d2 .list');
      if (!list.length) return;
      const moreButton = list.parent().find('button.more');
      moreButton
        .off('click',this.addPieces)
        .on('click',this.addPieces);
      const isCollapsed = moreButton.text() != '-';
      if (isCollapsed) {
        list.find('button.lichessTools-extraPieceSets').remove();
      }
      list.find('button:not(.lichessTools-extraPieceSets)')
        .each((i,e)=>{
          if (e._initExtraPieceSets) return;
          e._initExtraPieceSets = true;
          $(e).on('click',()=>{
            this.setPieceSet(null);
            list.find('button.active').removeClass('active');
            $(e).addClass('active');
          });
        });
      const template = list.find('button').eq(0).clone().removeClass('active');
      if (!this.pieceSets) return;
      const head = $('#dasher_app .sub.piece.d2 button.head');
      if (!head.find('.lichessTools-infoIcon').length) {
        head.append($('<a class="lichessTools-infoIcon" target="_blank">')
          .attr('title',trans.noarg('userManualLinkTitle'))
          .attr('data-icon',lt.icon.InfoCircle)
          .attr('href','https://siderite.dev/blog/lichess-tools---user-manual/#extraPieceSets')
        );
      }
      const currentSetName = lt.storage.get('extraPieceSets-set');
      const categories = Object.keys(this.options);
      for (const category of categories) {
        if (!this.options[category]) {
          list.find('button.lichessTools-extraPieceSets.'+category).remove();
          continue;
        }
        const pieceSets = this.pieceSets.filter(ps=>ps.category==category);
        for (const pieceSet of pieceSets) {
          if (isCollapsed && pieceSet.name != currentSetName) continue;
          if (list
                .find('button.lichessTools-extraPieceSets')
                .filter((i,e)=>$(e).attr('data-setName')==pieceSet.name).length) continue;
          const url = this.getUrl(pieceSet,'knight','white');
          const title = category + ' ' + pieceSet.name.replace('_'+category,'');
          template.clone()
            .attr('title',trans.pluralSame('pieceSetTitle',title))
            .attr('data-setName',pieceSet.name)
            .addClass('lichessTools-extraPieceSets')
            .addClass(category)
            .on('click',()=>this.setPieceSet(pieceSet.name))
            .appendTo(list)
            .find('piece')
            .css('background-image','url('+url+')');
        }
      }
      if (currentSetName) {
        const activeElems = list.find('button.active');
        if (activeElems.get().find(e=>$(e).attr('data-setName') != currentSetName)) {
          activeElems.removeClass('active');
          list.find('button')
            .filter((i,e)=>$(e).attr('data-setName') == currentSetName)
            .addClass('active');
        }
      }
      lt.scrollIntoViewIfNeeded(list.find('button.active'));
    };

    async init() {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.currentOptions?.enableLichessTools === false) return;
      if (!lt.currentOptions?.getValue('extraPieceSets')) return;

      $('html').observer()
        .on('style',(mutations)=>{
          const ltRemovedStyle = mutations
                                 .flatMap(m=>m.removedNodes||[])
                                 .find(n=>n.tagName==='STYLE' && n.id == 'lichessTools-extraPieceSets');
          const lichessStyle = mutations
                                 .map(m=>m.target)
                                 .find(t=>t.tagName==='STYLE' && !t.id?.startsWith('lichessTools-') && t.innerHTML.includes('---white-king'));
          if (!ltRemovedStyle && !lichessStyle) return;
          const styleStr = lt.storage.get('extraPieceSets-lastStyle');
          if (!styleStr) return;
          if (lichessStyle) {
            let originalStyle = $('style#lichessTools-removedStyle');
            if (!originalStyle.length) {
              originalStyle = $(lichessStyle).clone()
                 .attr('id','lichessTools-removedStyle');
              lt.global.setTimeout(()=>originalStyle.prependTo('head'),2000);
            }
            lichessStyle.id = 'lichessTools-extraPieceSets';
            lichessStyle.innerHTML=styleStr;
          }
          if ($('style#lichessTools-extraPieceSets').length) return;
          $(styleStr).appendTo('head');
        },{ executeDirect: true });


      $('html').observer()
        .on('body',()=>{
          if ($('style#lichessTools-extraPieceSets').length) {
            this.removePieceStyleAttributes();
          }

        },{
          attributes: true,
          attributeFilter: ['style']
        });
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('extraPieceSets');
      this.logOption('Extra piece sets', value);
      if (lt.currentOptions?.enableLichessTools === false) return;
      this.options = {}
      const categories = this.preferences.find(p=>p.name=='extraPieceSets').possibleValues;
      for (const category of categories) {
        this.options[category] = lt.isOptionSet(value, category);
      }

      $('#dasher_app')
        .observer()
        .off('.sub.piece.d2',this.addPieces);
      $('style#lichessTools-extraPieceSets,button.lichessTools-extraPieceSets').remove();
      if (!value) return;

      if (!this.pieceSets) {
        const self = this;
        lt.comm.getData('pieceSets.json').then(data=>{
          if (!data) {
            lt.global.console.warn('Could not load piece sets!');
          }
          self.pieceSets = data?.pieceSets || [];
          for (const pieceSet of self.pieceSets) {
            if (pieceSet.category == 'chesscom') continue;
            pieceSet.name+='_'+pieceSet.category;
          }
          this.updatePieceSet();
        });
      }

      this.updatePieceSet();
      $('#dasher_app')
        .observer()
        .on('.sub.piece.d2',this.addPieces);
      this.addPieces();
    }

  }
  LiChessTools.Tools.ExtraPieceSets = ExtraPieceSetsTool;
})();

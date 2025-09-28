(() => {
  class ExtraPieceSetsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'extraPieceSets',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['chesscom','hollowleaf','bend-n','comfysage','tage64','OwOHamper'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.extraPieceSets': 'Extra piece sets',
        'extraPieceSets.chesscom': 'chess.com',
        'extraPieceSets.hollowleaf': 'HollowLeaf',
        'extraPieceSets.bend-n': 'bend-n',
        'extraPieceSets.comfysage': 'comfysage',
        'extraPieceSets.tage64': 'tage64',
        'extraPieceSets.OwOHamper': 'OwOHamper',
        'pieceSetTitle': 'LiChess Tools - %s'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.extraPieceSets': 'Seturi suplimentare de piese',
        'extraPieceSets.chesscom': 'chess.com',
        'extraPieceSets.hollowleaf': 'HollowLeaf',
        'extraPieceSets.bend-n': 'bend-n',
        'extraPieceSets.comfysage': 'comfysage',
        'extraPieceSets.tage64': 'tage64',
        'extraPieceSets.OwOHamper': 'OwOHamper',
        'pieceSetTitle': 'LiChess Tools - %s'
      }
    }

    updatePieceSet = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('style#lichessTools-extraPieceSets').remove();
      if (!this.pieceSets) return;
      const setName = lt.storage.get('extraPieceSets-set');
      if (!setName) return;
      const pieceSet = this.pieceSets.find(ps=>ps.name == setName);
      if (!pieceSet) {
        lt.global.console.warn('Piece set '+setName+' not loaded!');
        return;
      }
      let styleStr = '<style id="lichessTools-extraPieceSets">';
      for (const piece of ['pawn','knight','bishop','rook','queen','king']) {
        for (const color of ['white','black']) {
          const url = this.getUrl(pieceSet,piece,color);
          styleStr += `
body.lichessTools .is2d .${piece}.${color} {  background-image: url('${url}'); }
`;
        }
      }
      styleStr+='</style>';
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
      this.updatePieceSet();
    };

    getUrl = (pieceSet,piece,color) => {
      switch(pieceSet.category) {
        case 'chesscom':
        case 'tage64':
        case 'OwOHamper':
        {
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          return pieceSet.url+color[0]+pieceLetter+'.png';
        }
        case 'hollowleaf':
        case 'bend-n':
        {
          const pieceLetter = piece == 'knight' ? 'N' : piece[0].toUpperCase();
          return pieceSet.url+color[0]+pieceLetter+'.png';
        }
        case 'comfysage':
        {
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          return pieceSet.url+color[0]+'/'+color[0]+pieceLetter+'.png';
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

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('extraPieceSets');
      this.logOption('Extra piece sets', value);
      this.options = {}
      const categories = this.preferences.find(p=>p.name=='extraPieceSets').possibleValues;
      for (const category of categories) {
        this.options[category] =lt.isOptionSet(value, category);
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

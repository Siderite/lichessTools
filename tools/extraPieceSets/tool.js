(() => {
  class ExtraPieceSetsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'extraPieceSets',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['chesscom'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.extraPieceSets': 'Extra piece sets',
        'extraPieceSets.chesscom': 'chess.com',
        'pieceSetTitle': 'LiChess Tools - %s'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.extraPieceSets': 'Seturi suplimentare de piese',
        'extraPieceSets.chesscom': 'chess.com',
        'pieceSetTitle': 'LiChess Tools - %s'
      }
    }

    updatePieceSet = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('style#lichessTools-extraPieceSets').remove();
      const setName = lt.storage.get('extraPieceSets-set');
      if (!setName) return;
      const pieceSet = this.pieceSets.find(ps=>ps.name == setName);
      if (!pieceSet) {
        lt.global.console.warn('Piece set '+setName+' not loaded!');
        return;
      }
      let styleStr = '<style id="lichessTools-extraPieceSets">';
      for (const piece of ['pawn','knight','bishop','rook','queen','king']) {
        const pieceLetter = piece == 'knight' ? 'n' : piece[0];
        for (const color of ['white','black']) {
          const url = this.getUrl(pieceSet,piece,color);
          styleStr += `
body.lichessTools .is2d .${piece}.${color} {  background-image: url('${url}'); }
`;
        }
      }
      styleStr+='</style>';
      $(styleStr).insertAfter('#piece-sprite');
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
          const pieceLetter = piece == 'knight' ? 'n' : piece[0];
          return pieceSet.url+color[0]+pieceLetter+'.png';
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
      if (this.options.chesscom && !list.find('button.lichessTools-extraPieceSets.chesscom').length) {
        const pieceSets = this.pieceSets.filter(ps=>ps.category='chesscom');
        for (const pieceSet of pieceSets) {
          const url = this.getUrl(pieceSet,'knight','white');
          template.clone()
            .attr('title',trans.pluralSame('pieceSetTitle','chess.com ' + pieceSet.name))
            .attr('data-setName',pieceSet.name)
            .addClass('lichessTools-extraPieceSets')
            .addClass('chesscom')
            .on('click',()=>this.setPieceSet(pieceSet.name))
            .appendTo(list)
            .find('piece')
            .css('background-image','url('+url+')');
        }
      }
      const setName = lt.storage.get('extraPieceSets-set');
      if (setName) {
        const activeElems = list.find('button.active');
        if (activeElems.get().find(e=>$(e).attr('data-setName')!=setName)) {
          activeElems.removeClass('active');
          list.find('button')
            .filter((i,e)=>$(e).attr('data-setName')==setName)
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
      this.options = {
        chesscom: lt.isOptionSet(value, 'chesscom'),
      };
      $('#dasher_app')
        .observer()
        .off('.sub.piece.d2',this.addPieces);
      $('style#lichessTools-extraPieceSets,button.lichessTools-extraPieceSets').remove();
      if (!value) return;
      if (!this.pieceSets) {
        const data = await lt.comm.getData('pieceSets.json');
        if (!data) {
          lt.global.console.warn('Could not load piece sets!');
        }
        this.pieceSets = data?.pieceSets || [];
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

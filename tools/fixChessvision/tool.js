(() => {
  class FixChessvisionTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixChessvision',
        category: 'general',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.fixChessvision': 'Fix Chessvision in studies'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.fixChessvision': 'Repar\u0103 Chessvision \u00een studii'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('fixChessvision');
      this.logOption('Fix Chessvision', value);
      if (!value) return;

      lt.global.clearInterval(this.interval);
      this.interval = lt.global.setInterval(()=>{
        if (!$('#chessvision-videos-root').length) return;
        $('.study__buttons span.share').each((i,e)=>{
          if (e.__dispatchPatch) return;
          e.__dispatchPatch = true;
          e.dispatchEvent = ()=> {
            const fen = lt.lichess.analysis?.node?.fen
            let input = $('.study__share .form-label').filter((i,e)=>$(e).text()=='FEN').next().find('input');
            if (!input.length) {
              input = $('<div class="study__share" style="display:none"><label class="form-label">FEN</label><div><input></div></div>')
              .appendTo('body')
              .find('input');
            }
            input.val(fen);
          };
        });
        $('.study__buttons .left-buttons > span:not(.share)').each((i,e)=>{
          if (e.__dispatchPatch) return;
          e.__dispatchPatch = true;
          e.dispatchEvent = ()=> {
          };
        });
      },200);
    }

  }
  LiChessTools.Tools.FixChessvision = FixChessvisionTool;
})();

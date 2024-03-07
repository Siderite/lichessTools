(()=>{
  class BoardImageTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'boardImage',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.boardImage': 'Better exported board image',
        'screenshotButtonText': 'SCREENSHOT',
        'screenshotButtonTitle': 'LiChess Tools - get a screenshot of the board'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.boardImage': 'O imagine exportat\u0103 a tablei mai bun\u0103',
        'screenshotButtonText': 'CAPTUR\u0102 TABL\u0102',
        'screenshotButtonTitle': 'LiChess Tools - imagine a tablei'
      }
    }

    getImage=(url)=>{
      return new Promise((resolve,reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(img);
        img.src=url;
      });
    };
    drawSvg=async (svgElement)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      svgElement=$(svgElement).clone().css('opacity','0.6')[0];
      const svgURL = new parent.global.XMLSerializer().serializeToString(svgElement);
      const url = 'data:image/svg+xml; charset=utf8, ' + parent.global.encodeURIComponent(svgURL);
      return await this.getImage(url);
    };
    getBoardImage=async (ev)=>{
      ev.preventDefault();
      const parent=this.lichessTools;
      const $=parent.$;
      const canvas=$('<canvas>')[0];
      const ctx=canvas.getContext('2d');
      ctx.canvas.width=800;
      ctx.canvas.height=800;
      const board = $('div.main-board cg-board');
      let url=board.css('background-image')?.replace(/url\(["']?|["']?\)/g,'');
      let img=await this.getImage(url);
      ctx.drawImage(img,0,0,800,800);
      const q=800/board.width();
      board.find('piece').each(async (i,e)=>{
        url=$(e).css('background-image')?.replace(/url\(["']?|["']?\)/g,'');
        if (!url) return;
        const style=$(e).attr('style')||'';
        const m=/translate\((\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/.exec(style);
        if (!m) return;
        img=await this.getImage(url);
        const x=+m[1]*q;
        const y=+m[2]*q;
        ctx.drawImage(img,x,y,100,100);
      });
      board.parent().find('svg').each(async (i,e)=>{
        const img=await this.drawSvg(e);
        ctx.drawImage(img,0,0);
      });
      $('dialog.lichessTools-boardImage').remove();
      const dialog=$('<dialog class="lichessTools-boardImage">')
        .append(`<form>
    <div class="close-button-anchor">
        <a class="help-button" data-icon="&#xE005;" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#boardImage" target="_blank"></a>
        <button class="close-button" data-icon="&#xE03F;" aria-label="Close" formmethod="dialog" value="close"/>
    </div>
    <div class="scrollable">
        <div class="dialog-content">
        </div>
    </div>
</form>`)
        .appendTo('body');
      $('dialog .dialog-content').append(canvas);
      dialog[0].showModal();
    };

    closeDialog=(ev)=>{
      if (ev && ev.keyCode!=27) return;
      ev?.preventDefault();
      const parent=this.lichessTools;
      const $=parent.$;
      $('dialog.lichessTools-boardImage').remove();
    };

    enhanceButton=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const analysisPgn=$('main.analyse .copyables div.pgn');
      if (analysisPgn.length) {
        if (!analysisPgn.parent().find('a.lichessTools-boardImage').length) {
          const analysis=parent.lichess.analysis;
          const url='/export/fen.gif?fen='+parent.global.encodeURIComponent(analysis.node.fen)+'&color='+analysis.getOrientation();
          $('<a class="lichessTools-boardImage">')
            .text(trans.noarg('screenshotButtonText'))
            .attr('title',trans.noarg('screenshotButtonTitle'))
            .attr('href',url)
            .on('click',this.getBoardImage)
            .insertAfter(analysisPgn);
        }
      }
      $('div.study__share a[href*="fen.gif"],div.board-editor .copyables a[href*="fen.gif"]')
        .each((i,e)=>{
          if ($(e).is('.lichessTools-boardImage')) return;
          $(e)
            .addClass('lichessTools-boardImage')
            .on('click',this.getBoardImage);
        });
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('boardImage');
      this.logOption('Better board image', value);
      const lichess=parent.lichess;
      const study=lichess?.analysis?.study;
      if (study) {
        study.vm.toolTab=lichessTools.unwrapFunction(study.vm.toolTab,'boardImage');
      }
      lichess.pubsub.off('redraw',this.enhanceButton);
      if (!value) {
        $('main.analyse .copyables a.lichessTools-boardImage').remove();
        $('div.study__share a.lichessTools-boardImage,div.board-editor a.lichessTools-boardImage')
          .removeClass('lichessTools-boardImage')
          .off('click',this.getBoardImage);
        return;
      }
      if (study) {
        study.vm.toolTab=lichessTools.wrapFunction(study.vm.toolTab,{
          id:'boardImage',
          after: ($this, result, ...args)=>{
            parent.global.setTimeout(this.enhanceButton,100);
          }
        });
      }
      lichess.pubsub.on('redraw',this.enhanceButton);
      this.enhanceButton();
    }

  }
  LiChessTools.Tools.BoardImage=BoardImageTool;
})();

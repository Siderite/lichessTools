(() => {
  class BoardImageTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'boardImage',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.boardImage': 'Better exported board image',
        'screenshotButtonText': 'SCREENSHOT',
        'screenshotButtonTitle': 'LiChess Tools - get a screenshot of the board'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.boardImage': 'O imagine exportat\u0103 a tablei mai bun\u0103',
        'screenshotButtonText': 'CAPTUR\u0102 TABL\u0102',
        'screenshotButtonTitle': 'LiChess Tools - imagine a tablei'
      }
    }

    getImage = (url) => {
      return new Promise((resolve, reject) => {
        setTimeout(()=>resolve(null),5000);
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
      });
    };

    drawSvg = async (svgElement) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      svgElement = $(svgElement).clone()
        .css({
          opacity: 0.6,
          overflow: 'visible'
        });
      svgElement.find('svg').css('overflow', 'visible');
      const svgURL = new lt.global.XMLSerializer().serializeToString(svgElement[0]);
      const url = 'data:image/svg+xml; charset=utf8, ' + lt.global.encodeURIComponent(svgURL);
      return await this.getImage(url);
    };

    getBoardImage = async (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const canvas = $('<canvas>')[0];
      const ctx = canvas.getContext('2d');
      ctx.canvas.width = 800;
      ctx.canvas.height = 800;
      const board = $('div.main-board cg-board');
      const href = $(ev.target).attr('href');
      const backgroundText = lt.global.getComputedStyle(board[0], ':before').backgroundImage;
      const match = /"(.*?)"(?:[^"]*"(.*?)")*/.exec(backgroundText);
      let url = match?.[match.length-1];
      const assetsUrl = [...match].slice(1).find(m=>/\/assets\//.test(m));
      if (!url) {
        const theme = lt.global.document.dataset?.board || 'maple';
        url = lt.assetUrl('../images/board/' + theme + '.jpg');
      }
      let img = await this.getImage(url) || (assetsUrl && await this.getImage(assetsUrl));
      
      ctx.drawImage(img, 0, 0, 800, 800);
      const q = 800 / board.width();
      board.find('square.selected,square.last-move').each((i, e) => {
        const css = {
          background: $(e).css('background-color'),
        };
        const style = $(e).attr('style') || '';
        const m = /translate\((\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/.exec(style);
        if (!m) return;
        const x = +m[1] * q;
        const y = +m[2] * q;
        ctx.fillStyle = css.background;
        ctx.fillRect(x, y, 100, 100);
      });
      if (!ev.shiftKey) {
        const ranks = $('coords.ranks',board.parent());
        if (ranks.length) {
          const isBlack = ranks.is('.black');
          const fontSize = 20;
          ctx.font = fontSize+'px arial';
          for (let i=0; i<8; i++) {
            ctx.fillStyle = i%2==0 ? '#dddddd' : '#222222';
            const digit = isBlack ? i+1 : (8-i);
            ctx.fillText(digit,800-fontSize*0.75,100*i+fontSize);
            const letter = String.fromCharCode(97+(isBlack ? (7-i) : i));
            ctx.fillText(letter,100*i,800-fontSize*0.5);
          }
        }
      }
      board.find('square.move-dest').each((i, e) => {
        const css = {
          background: '#14551e80',
          borderColor: $(e).css('border-color'),
          borderRadius: $(e).css('border-radius')?.replace('%', ''),
        };
        const style = $(e).attr('style') || '';
        const m = /translate\((\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/.exec(style);
        if (!m) return;
        const x = +m[1] * q;
        const y = +m[2] * q;

        const gradient = ctx.createRadialGradient(x + 50, y + 50, 0, x + 50, y + 50, 100);
        gradient.addColorStop(0, css.background);
        gradient.addColorStop(0.149, css.background);
        gradient.addColorStop(0.15, "transparent");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, 100, 100);

        ctx.strokeStyle = css.borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, 100, 100, css.borderRadius);
        ctx.stroke();
      });
      board.find('piece').each(async (i, e) => {
        url = $(e).css('background-image')?.replace(/url\(["']?|["']?\)/g, '');
        if (!url) return;
        const style = $(e).attr('style') || '';
        const m = /translate\((\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)?/.exec(style);
        if (!m) return;
        img = await this.getImage(url);
        const x = +m[1] * q;
        const y = (+m[2]||0) * q;
        ctx.drawImage(img, x, y, 100, 100);
      });
      const svgs = board.parent().children('svg').get();
      svgs.forEach(async (e) => {
        const img = await this.drawSvg(e);
        ctx.drawImage(img, 0, 0, $(e).width()*q, $(e).height()*q);
      });
      $('dialog.lichessTools-boardImage').remove();
      const dialog = $('<dialog class="lichessTools-boardImage">')
        .append(`<form>
    <div class="close-button-anchor">
        <a class="help-button" data-icon="${lt.icon.toEntity(lt.icon.InfoCircle)}" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#boardImage" target="_blank"></a>
        <button class="close-button" data-icon="${lt.icon.toEntity(lt.icon.X)}" aria-label="Close" formmethod="dialog" value="close"/>
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

    closeDialog = (ev) => {
      if (ev && ev.keyCode != 27) return;
      ev?.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      $('dialog.lichessTools-boardImage').remove();
    };

    enhanceButtonDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let removeRedraw = false;
      const analysisPgn = $('main.analyse .copyables div.pgn');
      if (analysisPgn.length) {
        if (!analysisPgn.parent().find('a.lichessTools-boardImage').length) {
          const analysis = lt.lichess.analysis;
          const url = '/export/fen.gif?fen=' + lt.global.encodeURIComponent(analysis.node.fen) + '&color=' + analysis.getOrientation();
          $('<a class="lichessTools-boardImage">')
            .text(trans.noarg('screenshotButtonText'))
            .attr('title', trans.noarg('screenshotButtonTitle'))
            .attr('href', url)
            .on('click', this.getBoardImage)
            .insertAfter(analysisPgn);
          removeRedraw = true;
        }
      }
      $('div.study__share,div.board-editor .copyables, .position-gif')
        .find('a[href*="fen.gif"]')
        .each((i, e) => {
          if ($(e).is('.lichessTools-boardImage')) return;
          $(e)
            .addClass('lichessTools-boardImage')
            .attr('title', trans.noarg('screenshotButtonTitle'))
            .on('click', this.getBoardImage);
          removeRedraw = true;
        });
      if (removeRedraw) {
        const lichess = lt.lichess;
        lt.pubsub.off('lichessTools.redraw', this.enhanceButton);
      }
    };
    enhanceButton = this.lichessTools.debounce(this.enhanceButtonDirect, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('boardImage');
      this.logOption('Better board image', value);
      const lichess = lt.lichess;
      const study = lichess?.analysis?.study;
      if (study) {
        study.vm.toolTab = lt.unwrapFunction(study.vm.toolTab, 'boardImage');
      }
      lt.pubsub.off('lichessTools.redraw', this.enhanceButton);
      if (!value) {
        $('main.analyse .copyables a.lichessTools-boardImage').remove();
        $('div.study__share a.lichessTools-boardImage,div.board-editor a.lichessTools-boardImage')
          .removeClass('lichessTools-boardImage')
          .off('click', this.getBoardImage);
        return;
      }
      if (study) {
        study.vm.toolTab = lt.wrapFunction(study.vm.toolTab, {
          id: 'boardImage',
          after: ($this, result, ...args) => {
            lt.global.setTimeout(this.enhanceButton, 100);
          }
        });
      }
      lt.pubsub.on('lichessTools.redraw', this.enhanceButton);
      this.enhanceButton();
    }

  }
  LiChessTools.Tools.BoardImage = BoardImageTool;
})();

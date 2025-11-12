(() => {
  class PlayLayoutTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'playLayout',
        category: 'play',
        type: 'single',
        possibleValues: ['normal', 'noSide', 'smallSide', 'smallSideable'],
        defaultValue: 'normal'
      },
      {
        name: 'playLayoutElements',
        category: 'play',
        type: 'multiple',
        possibleValues: ['deadCrosstable','chessPursuit'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.playLayout': 'Play layout',
        'options.playLayoutElements': 'Play layout elements',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Hide left side',
        'playLayout.smallSide': 'Hide chat',
        'playLayout.smallSideable': 'Option to hide chat',
        'playLayoutElements.deadCrosstable': 'Non interactive crosstable',
        'playLayoutElements.chessPursuit': 'Chess Pursuit menu',
        'toggleLayoutTitle': 'LiChess Tools - click on the icon to hide/show chat',
        'chessPursuitText': 'Chess Pursuit',
        'chessPursuitTitle': 'Lichess Tools - play Chess Pursuit',
        'chessPursuitHeader': 'Chess Pursuit'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.playLayout': 'Aranjament vizual',
        'options.playLayoutElements': 'Elemente vizuale',
        'playLayout.normal': 'Normal',
        'playLayout.noSide': 'Ascunde partea st\u00e2ng\u0103',
        'playLayout.smallSide': 'Ascunde chat',
        'playLayout.smallSideable': 'Op\u0163iune s\u0103 ascunzi chat',
        'playLayoutElements.deadCrosstable': 'Tabel rezultate neinteractiv',
        'playLayoutElements.chessPursuit': 'Meniu Chess Pursuit',
        'toggleLayoutTitle': 'LiChess Tools - apas\u0103 pictograma ca s\u0103 ascunzi/ar\u0103\u0163i chat',
        'chessPursuitText': 'Urm\u0103rire \u00een \u015fah',
        'chessPursuitTitle': 'Lichess Tools - joac\u0103 Urm\u0103rire \u00een \u015fah',
        'chessPursuitHeader': 'Urm\u0103rire \u00een \u015fah'
      }
    }

    toggleLayout = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$(ev.target).is('.game__meta__infos')) return;
      ev.preventDefault();
      switch (this.options.playLayout) {
        case 'noSide':
          $('body').toggleClass('lichessTools-noSide');
          break;
        case 'smallSide':
        case 'smallSideable':
          $('body').toggleClass('lichessTools-smallSide');
          if (!$('body').is('lichessTools-smallSide')) {
            $('ol.mchat__messages li').addClass('read');
          }
          break;
      }
    };

    applyLayout = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      $('.playing main.round .game__meta__infos')
        .removeClass('lichessTools-pointer')
        .removeAttr('title')
        .off('click', this.toggleLayout);
      if (this.options.playLayout != 'normal') {
        $('.playing main.round .game__meta__infos')
          .addClass('lichessTools-pointer')
          .attr('title', trans.noarg('toggleLayoutTitle'))
          .on('click', this.toggleLayout);
      }
    };

    proxyKeyEvents = (ev)=>{
      ev.preventDefault();
      const clonedEvent = new KeyboardEvent(ev.type, {
        key: ev.key,
        code: ev.code,
        keyCode: ev.keyCode,
        ctrlKey: ev.ctrlKey,
        shiftKey: ev.shiftKey,
        altKey: ev.altKey,
        metaKey: ev.metaKey,
        repeat: ev.repeat,
        bubbles: false,
        cancelable: true
      });
      $(ev.target)
        .find('.dialog-content')
        .trigger(clonedEvent);
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const playLayout = lt.currentOptions.getValue('playLayout');
      const playLayoutElements = lt.currentOptions.getValue('playLayoutElements');
      this.options = { 
        playLayout: playLayout,
        deadCrosstable: lt.isOptionSet(playLayoutElements, 'deadCrosstable'),
        chessPursuit: lt.isOptionSet(playLayoutElements, 'chessPursuit')
      };
      this.logOption('Play layout', playLayout);
      this.logOption('Play layout elements', playLayoutElements);
      this._control = $('main.round .game__meta__infos')[0];
      if (this._control) {
        $('body')
          .toggleClass('lichessTools-noSide', this.options.playLayout == 'noSide')
          .toggleClass('lichessTools-smallSide', this.options.playLayout == 'smallSide')
          .toggleClass('lichessTools-deadCrosstable', this.options.deadCrosstable);
        lt.global.clearInterval(this.interval);
        if (this.options.playLayout != 'normal') {
          this.interval = lt.global.setInterval(() => {
            const control = $('main.round .game__meta__infos')[0];
            if (this._control != control) {
              this._control = control;
              this.applyLayout();
            }
          }, 1000);
        }
        this.applyLayout();
      }
      const container = $('#topnav section a[href="/"]+div[role="group"]');
      container.find('.lichessTools-chessPursuit').remove();
      if (this.options.chessPursuit) {
        $('<a>')
          .addClass('lichessTools-chessPursuit')
          .text(trans.noarg('chessPursuitText'))
          .attr('title', trans.noarg('chessPursuitTitle'))
          .on('click',async (ev)=>{
            ev.preventDefault();
            const dlg = await lt.dialog({
              header: trans.noarg('chessPursuitHeader')
            });
            $(dlg)
              .addClass('lichessTools-chessPursuit')

            lt.global.setTimeout(()=>{
              const container = $(dlg).find('.dialog-content')[0];
              const dispose = LiChessTools.loadChessPursuit(container);
              $(dlg).on('keyup keydown',this.proxyKeyEvents);
              $(dlg).on('close',()=>{
                dispose();
                $(dlg).off('keyup keydown',this.proxyKeyEvents);
              });
            },100);
            dlg.showModal();
          })
          .appendTo(container);
      }

    }

  }
  LiChessTools.Tools.PlayLayout = PlayLayoutTool;
})();

(() => {
  class ChessPursuitTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'chessPursuit',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.chessPursuit': 'Chess Pursuit in menu',
        'chessPursuitText': 'Chess Pursuit',
        'chessPursuitTitle': 'Lichess Tools - play Chess Pursuit',
        'chessPursuitHeader': 'Chess Pursuit'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.chessPursuit': 'Urm\u0103rire \u00een \u015fah \u00een meniu',
        'chessPursuitText': 'Urm\u0103rire \u00een \u015fah',
        'chessPursuitTitle': 'Lichess Tools - joac\u0103 Urm\u0103rire \u00een \u015fah',
        'chessPursuitHeader': 'Urm\u0103rire \u00een \u015fah'
      }
    }

    proxyKeyEvents = (ev)=>{
      const clonedEvent = new KeyboardEvent(ev.type, {
        key: ev.key,
        code: ev.code,
        keyCode: ev.keyCode,
        charCode: ev.charCode,
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
      if (clonedEvent.defaultPrevented) {
        ev.preventDefault();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const chessPursuit = lt.currentOptions.getValue('chessPursuit');
      this.options = { 
        enabled: !!chessPursuit
      };
      this.logOption('Chess Pursuit', chessPursuit);
      const container = $('#topnav section a[href="/"]+div[role="group"]');
      container.find('.lichessTools-chessPursuit').remove();
      if (this.options.enabled) {
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
              dlg.focus();
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
  LiChessTools.Tools.ChessPursuit = ChessPursuitTool;
})();

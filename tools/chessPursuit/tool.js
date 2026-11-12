(() => {
  class ChessPursuitTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Dialog'];

    preferences = [
      {
        name: 'chessPursuit',
        category: 'play',
        type: 'multiple',
        possibleValues: ['chapter1', 'chapter2'],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.chessPursuit': 'Chess Pursuit in menu',
        'chessPursuit.chapter1': 'Chess Pursuit',
        'chessPursuit.chapter2': 'Chess Pursuit 2',
        'chessPursuitText': 'Chess Pursuit',
        'chessPursuitTitle': 'Lichess Tools - play Chess Pursuit',
        'chessPursuitHeader': 'Chess Pursuit',
        'chessPursuit2Text': 'Chess Pursuit 2',
        'chessPursuit2Title': 'Lichess Tools - play Chess Pursuit 2',
        'chessPursuit2Header': 'Chess Pursuit 2'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.chessPursuit': 'Urm\u0103rire \u00een \u015fah \u00een meniu',
        'chessPursuit.chapter1': 'Urm\u0103rire \u00een \u015fah',
        'chessPursuit.chapter2': 'Urm\u0103rire \u00een \u015fah 2',
        'chessPursuitText': 'Urm\u0103rire \u00een \u015fah',
        'chessPursuitTitle': 'Lichess Tools - joac\u0103 Urm\u0103rire \u00een \u015fah',
        'chessPursuitHeader': 'Urm\u0103rire \u00een \u015fah',
        'chessPursuit2Text': 'Urm\u0103rire \u00een \u015fah 2',
        'chessPursuit2Title': 'Lichess Tools - joac\u0103 Urm\u0103rire \u00een \u015fah 2',
        'chessPursuit2Header': 'Urm\u0103rire \u00een \u015fah 2'
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
      this.logOption('Chess Pursuit', chessPursuit);
      this.options = {
        chapter1: lt.isOptionSet(chessPursuit, 'chapter1'),
        chapter2: lt.isOptionSet(chessPursuit, 'chapter2')
      };
      const container = $('#topnav section a[href="/"]+div[role="group"]');
      container.find('.lichessTools-chessPursuit').remove();
      container.find('.lichessTools-chessPursuit2').remove();
      if (this.options.chapter1) {
        $('<a>')
          .addClass('lichessTools-chessPursuit')
          .text(trans.noarg('chessPursuitText'))
          .attr('title', trans.noarg('chessPursuitTitle'))
          .on('click',async (ev)=>{
            ev.preventDefault();

            $('#tn-tg').prop('checked',false); // close the mobile menu if opened

            const dlg = await lt.dialog({
              header: trans.noarg('chessPursuitHeader')
            });
            $(dlg)
              .addClass('lichessTools-chessPursuit')

            const dataUrl = await lt.comm.getChromeUrl('tools/chessPursuit/ChessPursuit.dat');
            lt.global.setTimeout(()=>{
              dlg.focus();
              const container = $(dlg).find('.dialog-content')[0];
              const dispose = LiChessTools.loadChessPursuit(container, dataUrl);
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
      if (this.options.chapter2) {
        $('<a>')
          .addClass('lichessTools-chessPursuit2')
          .text(trans.noarg('chessPursuit2Text'))
          .attr('title', trans.noarg('chessPursuit2Title'))
          .on('click',async (ev)=>{
            ev.preventDefault();

            $('#tn-tg').prop('checked',false); // close the mobile menu if opened

            const dlg = await lt.dialog({
              header: trans.noarg('chessPursuit2Header')
            });
            $(dlg)
              .addClass('lichessTools-chessPursuit')

            const dataUrl = await lt.comm.getChromeUrl('tools/chessPursuit/ChessPursuit2.dat');
            lt.global.setTimeout(()=>{
              dlg.focus();
              const container = $(dlg).find('.dialog-content')[0];
              const dispose = LiChessTools.loadChessPursuit(container, dataUrl);
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

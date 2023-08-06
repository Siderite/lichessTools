(()=>{
  class KeyboardHelpTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'keyboardHelp',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.keyboardHelp': 'LiChess Tools section in keyboard help',
        'lichessTools': 'LiChess Tools',
        'nextBlunder': 'Next blunder (all lines)',
        'nextMistake': 'Next mistake (all lines)',
        'nextInaccuracy': 'Next inaccuracy (all lines)',
        'nextOpponentBlunder': 'Next opponent blunder',
        'nextOpponentMistake': 'Next opponent mistake',
        'nextOpponentInaccuracy': 'Next opponent inaccuracy',
        'variationLine': 'N-th variation',
        'cevalLine': 'N-th computer evaluation line',
        'explorerLine': 'N-th Explorer line',
        'randomMove': 'Random variation move',
        'previousPosition': 'Back to previous position',
        'bestCevalLine': 'Best computer line',
        'explorerPractice': 'Explorer practice',
        'seeLichessTools': 'see LiChess Tools section below'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.keyboardHelp': 'Sec\u0163iune LiChess Tools \u00een dialogul ajutor pentru taste',
        'lichessTools': 'LiChess Tools',
        'nextBlunder': 'Urm\u0103toarea gaf\u0103 (toate liniile)',
        'nextMistake': 'Urm\u0103toarea gre\u015Feal\u0103 (toate liniile)',
        'nextInaccuracy': 'Urm\u0103toarea inexactitate (toate liniile)',
        'nextOpponentBlunder': 'Urm\u0103toarea gaf\u0103 a adversarului',
        'nextOpponentMistake': 'Urm\u0103toarea gre\u015Feal\u0103 a adversarului',
        'nextOpponentInaccuracy': 'Urm\u0103toarea inexactitate a adversarului',
        'variationLine': 'A N-a varia\u0163iune',
        'cevalLine': 'A N-a mutare din evaluarea calculatorului',
        'explorerLine': 'A N-a mutare din Explorator',
        'randomMove': 'Mut\u0103 o varia\u0163iune la \u00eent\u00E2mplare',
        'previousPosition': '\u00CEnapoi la pozi\u0163ia precedent\u0103',
        'bestCevalLine': 'Cea mai bun\u0103 mutare din evaluarea calculatorului',
        'explorerPractice': 'Practic\u0103 contra mut\u0103ri din Explorator',
        'seeLichessTools': 'vezi sec\u0163iunea LiChess Tools de mai jos'
      }
    }

    processHelp=async ()=>{
      const parent=this.lichessTools;
      await parent.timeout(500);
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const table=$('#modal-wrap.keyboard-help div.scrollable > table tbody');
      if (!table.length) return;
      if (table[0].hasLichessTools) return;
      table[0].hasLichessTools=true;

      const title=(text,className)=>{
        const row=$('<tr><th colspan="2"><p></p></th></tr>')
          .addClass(className)
          .appendTo(table);
        $('p',row).text(trans.noarg(text));
      };
      const row=(keys,text)=>{
        const row=$('<tr><td class="keys"></td><td class="desc"></td></tr>').appendTo(table);
        const tdKeys=$('td.keys',row);
        for (const key of keys) {
          if (key.startsWith('!')) {
            tdKeys.append($('<then>').text(trans.noarg(key.substr(1))));
          } else {
            tdKeys.append($('<kbd>').html(key));
          }
        }
        $('td.desc',row).text(trans.noarg(text));
      };

      title('lichessTools','lichessTools-title');
      if (parent.currentOptions.getValue('keyShortcuts')) {
        $('td.keys kbd',table)
          .filter((i,e)=>['b','m','i'].includes($(e).text()))
          .parent()
            .filter((i,e)=>$('kbd',e).length==1)
            .closest('tr')
              .addClass('lichessTools-disabled')
              .attr('title',trans.noarg('seeLichessTools'));

        row(['b'],'nextBlunder');
        row(['m'],'nextMistake');
        row(['i'],'nextInaccuracy');
        row(['alt','b'],'nextOpponentBlunder');
        row(['alt','m'],'nextOpponentMistake');
        row(['alt','i'],'nextOpponentInaccuracy');
        row(['.','!then','1-9'],'variationLine');
        row(['ctrl','.','!then','1-9'],'cevalLine');
        row(['shift','.','!then','1-9'],'explorerLine');
      }
      if (parent.currentOptions.getValue('ctrlArrows')) {
        row(['ctrl','&rarr;'],'randomMove');
        row(['ctrl','&larr;'],'previousPosition');
      }
      if (parent.currentOptions.getValue('spaceDisabled')) {
        $('td.keys kbd',table)
          .filter((i,e)=>$(e).text()=='space')
          .parent()
            .filter((i,e)=>$('kbd',e).length==1)
            .closest('tr')
              .addClass('lichessTools-disabled')
              .attr('title',trans.noarg('seeLichessTools'));

        row(['ctrl','space'],'bestCevalLine');
      }
      if (parent.currentOptions.getValue('explorerPractice')) {
        row(['shift','l'],'explorerPractice');
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('keyboardHelp');
      this.logOption('Keyboard help', value);
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      lichess.pubsub.off('analyse.close-all',this.processHelp);
      if (!value) return;
      lichess.pubsub.on('analyse.close-all',this.processHelp);
    }

  }
  LiChessTools.Tools.KeyboardHelp=KeyboardHelpTool;
})();
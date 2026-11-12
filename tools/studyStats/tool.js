(() => {
  class StudyStatsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'Dialog', 'ChessOps'];

    preferences = [
      {
        name: 'studyStats',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyStats': 'Show study statistics',
        'studyStatsButtonText': 'Study stats',
        'studyStatsButtonTitle': 'LiChess Tools - show study statistics',
        'studyStatsHeader': 'Study statistics',
        'studyStatsName': 'Name',
        'studyStatsDescription': 'Description',
        'studyStatsChapters': 'Chapters',
        'studyStatsOwner': 'Owner',
        'studyStatsMembers': 'Members',
        'studyStatsUpdated': 'Updated',
        'studyStatsTopics': 'Topics',
        'studyStatsSettings': 'Settings',
        'studyStatsMoves': 'Moves / variations',
        'studyStatsError': 'Could not load the study PGN'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyStats': 'Arat\u0103 statisticile studiului',
        'studyStatsButtonText': 'Statistici studiu',
        'studyStatsButtonTitle': 'LiChess Tools - arat\u0103 statisticile studiului',
        'studyStatsHeader': 'Statisticile studiului',
        'studyStatsName': 'Nume',
        'studyStatsDescription': 'Descriere',
        'studyStatsChapters': 'Capitole',
        'studyStatsOwner': 'Proprietar',
        'studyStatsMembers': 'Membri',
        'studyStatsUpdated': 'Actualizat',
        'studyStatsTopics': 'Subiecte',
        'studyStatsSettings': 'Set\u0103ri',
        'studyStatsMoves': 'Mut\u0103ri / varia\u021bii',
        'studyStatsError': 'Nu s-a putut \u00eenc\u0103rca PGN-ul studiului'
      }
    }

    daysText = (days) => {
      const lt = this.lichessTools;
      if (!isFinite(days)) return '\u221e';
      const nbDays = lt.global.i18n?.site?.nbDays;
      if (!nbDays) {
        lt.global.console.warn('Could not find the nbDays function');
        return lt.translator.plural('daysText', Math.round(days), Math.round(days));
      }
      return nbDays(Math.round(days));
    };

    userName = (user) => user?.name || user?.id || '';

    ownerText = (data) => {
      const member = data.members?.[data.ownerId];
      return this.userName(member?.user) || data.ownerId || '';
    };

    membersText = (data) => {
      return Object.keys(data.members || {})
        .map(id => {
          const member = data.members[id];
          const name = this.userName(member.user) || id;
          return member.role ? name + ' (' + member.role + ')' : name;
        })
        .join(', ');
    };

    settingsText = (settings) => {
      return Object.keys(settings || {})
        .map(key => key + ': ' + settings[key])
        .join(', ');
    };

    countGameMoves = (game) => {
      let moves = 0;
      let variations = 0;
      const traverse = (node) => {
        if (node.data?.san) moves++;
        const children = node.children || [];
        if (!children.length) {
          if (node.data?.san) variations++;
          return;
        }
        for (const child of children) traverse(child);
      };
      traverse(game.moves);
      return { moves, variations };
    };

    countMovetext = (movetext) => {
      let moves = 0;
      let variations = 0;
      const tokens = [];
      let token = '';
      const flush = () => {
        token = token.trim();
        if (token) tokens.push(token);
        token = '';
      };
      for (let i = 0; i < movetext.length; i++) {
        const ch = movetext[i];
        if (ch === '{') {
          flush();
          while (i < movetext.length && movetext[i] !== '}') i++;
          continue;
        }
        if (ch === '(') { flush(); variations++; continue; }
        if (ch === ')') { flush(); continue; }
        if (/\s/.test(ch)) { flush(); continue; }
        token += ch;
      }
      flush();
      for (const t of tokens) {
        if (/^\d+\.(\.\.)?$/.test(t)) continue;
        if (/^\$\d+$/.test(t)) continue;
        if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)) continue;
        moves++;
      }
      variations = moves ? variations + 1 : 0;
      return { moves, variations };
    };

    countChapterMoves = async (pgn) => {
      const lt = this.lichessTools;
      if (!pgn) return [];
      const co = lt.chessops ? await lt.chessops() : null;
      if (co?.pgn?.parsePgn) {
        return co.pgn.parsePgn(pgn).map(this.countGameMoves);
      }
      return pgn
        .split(/\r?\n\s*\r?\n(?=\[)/)
        .map(gameText => this.countMovetext(gameText.replace(/^\s*(\[[^\]]*\]\s*)*/, '')));
    };

    showStudyStats = async (ev) => {
      ev?.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const data = lt.lichess.analysis?.study?.data;
      if (!data) return;

      const dialog = await lt.dialog({
        header: trans.noarg('studyStatsHeader'),
        noDrag: true
      });
      $(dialog).addClass('lichessTools-studyStats');
      const content = $('.dialog-content', dialog);

      const addRow = (label, value) => {
        $('<div>')
          .append($('<span>').text(label))
          .append($('<span>').text(value))
          .appendTo(content);
      };

      addRow(trans.noarg('studyStatsName'), data.name || '');
      if (data.description) addRow(trans.noarg('studyStatsDescription'), data.description);
      addRow(trans.noarg('studyStatsChapters'), data.chapters?.length || 0);
      addRow(trans.noarg('studyStatsOwner'), this.ownerText(data));
      addRow(trans.noarg('studyStatsMembers'), this.membersText(data));
      addRow(trans.noarg('studyStatsUpdated'), this.daysText((data.secondsSinceUpdate || 0) / 86400));
      if (data.topics?.length) addRow(trans.noarg('studyStatsTopics'), data.topics.join(', '));
      addRow(trans.noarg('studyStatsSettings'), this.settingsText(data.settings));

      const movesRow = $('<div>')
        .append($('<span>').text(trans.noarg('studyStatsMoves')))
        .appendTo(content);
      const countsSpan = $('<span>').append(lt.spinnerHtml).appendTo(movesRow);

      dialog.showModal();

      try {
        const pgn = await lt.api.study.getStudyPgn(data.id);
        const counts = await this.countChapterMoves(pgn);
        const text = counts.map((c, i) => (i + 1) + '. ' + c.moves + '/' + c.variations).join(' | ');
        countsSpan.empty().text(text || trans.noarg('studyStatsError'));
      } catch (e) {
        lt.global.console.warn('Could not load the study PGN', e);
        countsSpan.empty().text(trans.noarg('studyStatsError'));
      }
    };

    addButtonDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('main.analyse .study__share .downloads');
      if (!container.length) return;
      let link = $('a.lichessTools-studyStats', container);
      if (!link.length) {
        link = $('<a class="button text lichessTools-studyStats">')
          .text(trans.noarg('studyStatsButtonText'))
          .attr('title', trans.noarg('studyStatsButtonTitle'))
          .on('click', this.showStudyStats)
          .appendTo(container);
      }
    };
    addButton = this.lichessTools.debounce(this.addButtonDirect, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('studyStats');
      this.logOption('Study statistics', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (study) {
        study.vm.toolTab = lt.unwrapFunction(study.vm.toolTab, 'studyStats');
      }
      lt.pubsub.off('lichessTools.redraw', this.addButton);
      if (!value) {
        $('main.analyse .study__share a.lichessTools-studyStats').remove();
        return;
      }
      if (study) {
        study.vm.toolTab = lt.wrapFunction(study.vm.toolTab, {
          id: 'studyStats',
          after: ($this, result, ...args) => {
            lt.global.setTimeout(this.addButton, 100);
          }
        });
      }
      lt.pubsub.on('lichessTools.redraw', this.addButton);
      this.addButton();
    }

  }
  LiChessTools.Tools.StudyStats = StudyStatsTool;
})();


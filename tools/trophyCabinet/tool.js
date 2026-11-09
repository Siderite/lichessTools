(() => {
  class TrophyCabinetTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Dialog'];

    preferences = [
      {
        name: 'trophyCabinet',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.trophyCabinet': 'Trophy cabinet',
        'trophyCabinetTitle': 'LiChess Tools - Trophy cabinet',
        'trophyCabinetHeader': 'Trophy cabinet'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.trophyCabinet': 'Vitrin\u0103 trofee',
        'trophyCabinetTitle': 'LiChess Tools - vitrin\u0103 trofee',
        'trophyCabinetHeader': 'Vitrin\u0103 trofee'
      }
    }

    // count the css reads out into the summary; the cabinet itself is only built on click
    setTrophySummary = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (this._applyingTrophySummary) return;
      try {
        this._applyingTrophySummary = true;
        $('body div.trophies.packed').each((i,e)=>{
          const packed = $(e);
          const count = packed.find('.trophy,.shield-trophy').length;
          let summary = packed.find('.lichessTools-trophySummary');
          if (!this.options.enabled || !count) {
            packed.removeAttrSafe('data-lt-trophies');
            summary.remove();
            return;
          }
          packed.attrSafe('data-lt-trophies',count);
          if (!summary.length) {
            summary = $('<span class="lichessTools-trophySummary"><img class="lichessTools-trophyCup"/></span>')
              .appendTo(packed);
            summary.find('img').attrSafe('src',lt.assetUrl('images/trophy/Gold-Cup.png'));
            summary.on('click',(ev)=>{
              ev.preventDefault();
              ev.stopPropagation();
              this.openTrophyCabinet(packed);
            });
          }
          summary
            .attrSafe('data-lt-trophies',count)
            .attrSafe('title',trans.noarg('trophyCabinetTitle'));
        });
      } finally {
        this._applyingTrophySummary = false;
      }
    };

    // identical awards collapse into one chip, the dialog only ever shows one per kind
    getCabinetGroups = (packed) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const groups = [];
      const byIcon = new Map();
      packed.find('.trophy,.shield-trophy').each((i,e)=>{
        const node = $(e);
        const img = node.find('img');
        const key = node.attr('class') + '|' + (img.length ? img.attr('src') : '') + '|' + (node.attr('aria-label') || node.attr('title') || '');
        const group = byIcon.get(key);
        if (group) {
          group.count++;
          return;
        }
        const entry = { count: 1, node: e };
        byIcon.set(key,entry);
        groups.push(entry);
      });
      return groups;
    };

    // one chip per award kind; the cabinet shows one chip per kind
    buildTrophyChips = (groups,target) => {
      const $ = this.lichessTools.$;
      for (const group of groups) {
        const node = $(group.node);
        const label = node.attr('aria-label') || node.attr('title') || '';
        const chip = $('<span class="lichessTools-trophyChip">')
          .append($('<span class="lichessTools-trophyIcon">').append(node.clone()))
          .appendTo(target);
        chip
          .attrSafe('title',label);
        const ring = $('<span class="lichessTools-trophyRing">')
          .appendTo(chip)
          .attrSafe('aria-hidden','true');
        const chars = Array.from(label);
        chars.forEach((char,i)=>{
          const charEl = $('<i class="lichessTools-trophyChar">').text(char);
          charEl.appendTo(ring);
          charEl[0].style.setProperty('--lt-i',String(i));
        });
        ring[0].style.setProperty('--lt-n',String(chars.length));
        if (chars.length > 24) ring.addClass('lichessTools-trophyWideRing');
        if (group.count > 1) chip.attrSafe('data-lt-count',group.count);
      }
    };

    // the grid the chips take: how many chips fit on a line, and how many lines the kinds need.
    // The count happens here because css cannot divide one length by another, and it is read back
    // from where the chips actually sit rather than guessed from a font: the chips are 8em x 6em of
    // the content's em, the content is a font step over the dialog, and the sheet sizes the box in
    // px. So the box is opened at its widest, the chips are laid out, and one chip, one line and the
    // frame are measured in px and handed over.
    getCabinetSizing = (dialog,content,chip,header,kinds) => {
      const lt = this.lichessTools;
      if (!content||!chip) return;
      const st = lt.global.getComputedStyle(content);
      const chipSt = lt.global.getComputedStyle(chip);
      const dlgSt = lt.global.getComputedStyle(dialog);
      const em = parseFloat(st.fontSize)||16;
      const padX = parseFloat(st.paddingLeft)||0;
      const padY = parseFloat(st.paddingTop)||0;
      const gapX = parseFloat(st.columnGap)||1.2*em;
      const gapY = parseFloat(st.rowGap)||em;
      const room = (parseFloat(st.width)||0)-2*padX;
      const chipW = parseFloat(chipSt.width)||0;
      const chipH = parseFloat(chipSt.height)||0;
      const frameX = 2*(padX+(parseFloat(dlgSt.borderLeftWidth)||0));
      const frameY = 2*(padY+(parseFloat(dlgSt.borderTopWidth)||0));
      const headerH = header ? parseFloat(lt.global.getComputedStyle(header)?.height)||0 : 0;
      if (chipW<1||chipH<1||room<chipW||!kinds) return;
      // a hair of slack on the count: a line that fits to the last fraction of a pixel can wrap the
      // next chip in, and the box would then be sized for more chips than the line holds
      const cols = Math.max(1,Math.min(4,Math.floor((room+gapX-1)/(chipW+gapX)),kinds));
      return {
        cols,
        rows: Math.ceil(kinds/cols),
        step: chipW+gapX+10,
        line: chipH+gapY,
        gapX,
        gapY,
        frameX,
        frameY,
        header: headerH,
      };
    };

    openTrophyCabinet = async (packed) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      $('dialog.lichessTools-trophyCabinet').remove();
      const groups = this.getCabinetGroups(packed);
      if (!groups.length) return;
      const dialog = await lt.dialog({
        header: $('<h2>').textSafe(trans.noarg('trophyCabinetHeader')),
        help: 'https://siderite.dev/blog/lichess-tools---user-manual#trophyCabinet',
        noDrag: true
      });
      const $dialog = $(dialog)
        .addClass('lichessTools-trophyCabinet');
      const content = $dialog.find('.dialog-content');
      // the box is measured while it is at its widest, so the chips get the room the viewport really
      // allows: a width from the sheet would already have wrapped them by the time they could be
      // counted, and the wrap is what the box has to fit
      dialog.style?.setProperty('width','90vw');
      dialog.showModal();
      $dialog.find('button.close-button')
        .on('click',()=>{
          $dialog
            .each((i,e)=>e.close('cancel'))
            .remove();
        });
      this.buildTrophyChips(groups,content);
      const chips = content.find('.lichessTools-trophyChip');
      const header = $dialog.find('.dialog-header').get(0);
      const sizing = chips.length
        ? this.getCabinetSizing(dialog,content.get(0),chips.get(0),header,groups.length)
        : undefined;
      // custom properties go out through style.setProperty, which takes a string only: cash
      // hands the raw value on, so a number here can be dropped by the engine and leave the
      // css on its fallback counts. setProperty with strings keeps the hand-off typed.
      if (sizing) $dialog.each((i,dlg)=>{
        dlg.style.setProperty('--lt-cols',String(sizing.cols));
        dlg.style.setProperty('--lt-rows',String(sizing.rows));
        dlg.style.setProperty('--lt-step',sizing.step+'px');
        dlg.style.setProperty('--lt-line',sizing.line+'px');
        dlg.style.setProperty('--lt-gapx',sizing.gapX+'px');
        dlg.style.setProperty('--lt-gapy',sizing.gapY+'px');
        dlg.style.setProperty('--lt-framex',sizing.frameX+'px');
        dlg.style.setProperty('--lt-framey',sizing.frameY+'px');
        dlg.style.setProperty('--lt-header',sizing.header+'px');
      });
      // the probe is dropped once the sheet knows the grid, so the box hugs it instead of filling
      // the window
      dialog.style?.removeProperty('width');
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('trophyCabinet');
      this.logOption('Trophy cabinet', value);
      this.options = { enabled: !!value };

      $('body').observer().off('.trophies.packed',this.setTrophySummary);
      this.setTrophySummary();
      if (!value) return;
      $('body').observer().on('.trophies.packed',this.setTrophySummary,{ characterData: false });
    }

  }
  LiChessTools.Tools.TrophyCabinet = TrophyCabinetTool;
})();

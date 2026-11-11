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

    // the cup the pill draws and the icon a trophy that brings nothing of its own stands in for;
    // the hashed asset url answers the same path always, so it is worked out once and kept
    get defaultIconUrl() {
      if (this._defaultIconUrl === undefined) {
        const lt = this.lichessTools;
        this._defaultIconUrl = lt.assetUrl('images/trophy/Gold-Cup.png');
      }
      return this._defaultIconUrl;
    }

    // what the cabinet shows: the awards of the row that opened it, then the trophies another tool
    // handed over. The row pass runs on every click, so its list is rebuilt; the other one stays,
    // because a tool adds its trophies once.
    lichessTrophies = [];
    customTrophies = [];

    // count the css reads out into the summary; a trophy another tool added keeps the pill drawn
    // even on a row that holds no award
    setTrophySummary = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (this._applyingTrophySummary) return;
      try {
        this._applyingTrophySummary = true;
        $('body div.trophies.packed').each((i,e)=>{
          const packed = $(e);
          const count = packed.find('.trophy,.shield-trophy').length + this.getCustomTrophyCount();
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
            summary.find('img').attrSafe('src',this.defaultIconUrl);
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

    // the trophies of both sources, in the order the cabinet shows them
    getCabinetTrophies = () => this.lichessTrophies.concat(this.customTrophies);

    // how many copies the trophies another tool added stand for; the pill writes it out beside the
    // awards the row holds, so the number counts what the cabinet shows
    getCustomTrophyCount = () => this.customTrophies.reduce((sum,trophy)=>sum+trophy.count,0);

    // one trophy into the cabinet, and the door every trophy goes through. The lichess flag says the
    // icon is an award element the site drew, so the chip keeps that art and the icon font it comes
    // with; without the flag the caller brings a character (icon), an image (iconUrl), or neither,
    // and the gold cup stands in. text is the label that wraps around the icon on the ring, title
    // the tooltip (text when unset) and linkUrl where a click goes (no click when unset). A
    // disabled tool takes nothing, so a caller only needs lt.tools.TrophyCabinetTool?.addTrophy(...)
    addTrophy = (trophy,lichessTrophy) => {
      if (!this.options?.enabled || !trophy) return;
      const $ = this.lichessTools.$;
      const node = lichessTrophy ? $(trophy.node || trophy) : undefined;
      if (lichessTrophy && !node.length) return;
      const icon = lichessTrophy ? undefined : trophy.icon;
      const iconUrl = lichessTrophy
        ? undefined
        : (trophy.iconUrl || (icon ? undefined : this.defaultIconUrl));
      const list = lichessTrophy ? this.lichessTrophies : this.customTrophies;
      const text = lichessTrophy
        ? (trophy.text || (node.attr('aria-label') || node.attr('title') || ''))
        : String(trophy.text ?? '');
      const key = lichessTrophy ? undefined : (String(icon||'')+'|'+String(iconUrl||'')+'|'+text);
      if (!lichessTrophy) {
        for (const kept of list) {
          if (kept.key != key) continue;
          kept.count++;
          return;
        }
      }
      list.push({
        lichess: !!lichessTrophy,
        node,
        icon,
        iconUrl,
        text,
        title: lichessTrophy ? text : String(trophy.title ?? text),
        linkUrl: lichessTrophy ? undefined : (trophy.linkUrl || undefined),
        count: Math.max(1,Number(trophy.count)||1),
        key,
      });
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

    // one chip per trophy: a Lichess chip carries the site's own award element, a custom one the
    // character or the image the caller gave it. The label rides the ring around the icon, and a
    // trophy with a link becomes an anchor, which is what makes the whole chip answer a click.
    buildTrophyChips = (trophies,target) => {
      const $ = this.lichessTools.$;
      for (const trophy of trophies) {
        const chip = $(trophy.linkUrl ? '<a class="lichessTools-trophyChip">' : '<span class="lichessTools-trophyChip">')
          .appendTo(target);
        if (trophy.linkUrl) {
          chip
            .attrSafe('href',String(trophy.linkUrl))
            .attrSafe('target','_blank');
        }
        const icon = $('<span class="lichessTools-trophyIcon">').appendTo(chip);
        if (trophy.lichess) icon.append(trophy.node.clone());
        else if (trophy.iconUrl) icon.append(
          $('<img class="lichessTools-trophyImg"/>')
            .attrSafe('src',String(trophy.iconUrl))
            .attrSafe('alt',trophy.title)
        );
        else icon.append(
          $('<span class="lichessTools-trophyGlyph">').textSafe(String(trophy.icon||''))
        );
        if (trophy.title) chip.attrSafe('title',trophy.title);
        const chars = Array.from(trophy.text);
        if (chars.length) {
          const ring = $('<span class="lichessTools-trophyRing">')
            .appendTo(chip)
            .attrSafe('aria-hidden','true');
          chars.forEach((char,i)=>{
            const charEl = $('<i class="lichessTools-trophyChar">').text(char);
            charEl.appendTo(ring);
            charEl[0].style.setProperty('--lt-i',String(i));
          });
          ring[0].style.setProperty('--lt-n',String(chars.length));
          if (chars.length > 24) ring.addClass('lichessTools-trophyWideRing');
        }
        if (trophy.count > 1) chip.attrSafe('data-lt-count',trophy.count);
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
      // the row's awards come through the same door a custom trophy uses, flagged so each chip keeps
      // the art the site drew for it
      this.lichessTrophies = [];
      for (const group of this.getCabinetGroups(packed)) this.addTrophy(group,true);
      const trophies = this.getCabinetTrophies();
      if (!trophies.length) return;
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
      this.buildTrophyChips(trophies,content);
      const chips = content.find('.lichessTools-trophyChip');
      const header = $dialog.find('.dialog-header').get(0);
      const sizing = chips.length
        ? this.getCabinetSizing(dialog,content.get(0),chips.get(0),header,trophies.length)
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

(() => {
  class CorrespondenceLobbyFiltersTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'correspondenceLobbyFilters',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        author: 'Mitchellpkt'
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.correspondenceLobbyFilters': 'Correspondence lobby filters',
        'filterToggleTitle': 'LiChess Tools - filter correspondence games',
        'filterGames': 'Filter games',
        'close': 'Close',
        'variant': 'Variant',
        'daysPerTurn': 'Days per turn',
        'mode': 'Mode',
        'ratingFilter': 'Rating filter',
        'casual': 'Casual',
        'rated': 'Rated',
        'reset': 'Reset',
        'apply': 'Apply',
        'minCaption': 'min',
        'maxCaption': 'max',
        'nbDays': '%s days',
        'nbDays:one': '1 day'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.correspondenceLobbyFilters': 'Filtre pentru lobby-ul de coresponden\u0163\u0103',
        'filterToggleTitle': 'LiChess Tools - filtreaz\u0103 jocurile prin coresponden\u0163\u0103',
        'filterGames': 'Filtreaz\u0103 jocurile',
        'close': '\u00cenchide',
        'variant': 'Variant\u0103',
        'daysPerTurn': 'Zile pe mutare',
        'mode': 'Mod',
        'ratingFilter': 'Filtru rating',
        'casual': 'Amical',
        'rated': 'Cotat',
        'reset': 'Reseteaz\u0103',
        'apply': 'Aplic\u0103',
        'minCaption': 'min',
        'maxCaption': 'max',
        'nbDays': '%s zile',
        'nbDays:one': '1 zi'
      }
    }

    // same list and order as the main lobby filter (lila SetupUi.selectableVariants)
    variants = ['standard', 'crazyhouse', 'chess960', 'kingOfTheHill', 'threeCheck', 'antichess', 'atomic', 'horde', 'racingKings'];

    // correspondence seeks only allow these days per turn, plus unlimited (lila Mappings.daysChoices)
    dayStops = [1, 2, 3, 5, 7, 10, 14, Infinity];

    // gap: minimum distance between min and max, so a too-narrow band cannot hide every game & knobs stay separated
    ratingRange = { min: 400, max: 2900, step: 50, gap: 150 };

    // lila perf icon name (as in lichess-icons.js) -> variant key
    iconVariants = {
      PaperAirplane: 'standard',
      Crazyhouse: 'crazyhouse',
      DieSix: 'chess960',
      FlagKingHill: 'kingOfTheHill',
      ThreeCheckStack: 'threeCheck',
      Antichess: 'antichess',
      Atom: 'atomic',
      Keypad: 'horde',
      FlagRacingKings: 'racingKings'
    };

    storageKey = 'LiChessTools.correspondenceLobbyFilters.filter';

    isOpen = false;

    getDefaultFilter = () => ({
      variant: this.variants.slice(),
      days: [0, this.dayStops.length - 1],
      mode: ['casual', 'rated'],
      rating: [this.ratingRange.min, this.ratingRange.max]
    });

    isDefaultFilter = (f) => {
      const d = this.getDefaultFilter();
      return f.variant.length === d.variant.length
        && f.mode.length === d.mode.length
        && f.days.join() === d.days.join()
        && f.rating.join() === d.rating.join();
    };

    getFilter = () => {
      const lt = this.lichessTools;
      const d = this.getDefaultFilter();
      const stored = lt.storage.get(this.storageKey);
      if (!stored || typeof stored !== 'object') return d;
      const list = (values, allowed) => Array.isArray(values) ? values.filter(v => allowed.includes(v)) : allowed;
      const range = (values, [min, max], gap = 0) => {
        if (!Array.isArray(values) || values.length !== 2) return [min, max];
        const [lo, hi] = values.map(v => Math.min(Math.max(+v || 0, min), max));
        const start = Math.min(lo, max - gap);
        return hi - lo >= gap ? [lo, hi] : [start, start + gap];
      };
      return {
        variant: list(stored.variant, d.variant),
        days: range(stored.days, d.days),
        mode: list(stored.mode, d.mode),
        rating: range(stored.rating, d.rating, this.ratingRange.gap)
      };
    };

    setFilter = (f) => {
      const lt = this.lichessTools;
      lt.storage.set(this.storageKey, f && !this.isDefaultFilter(f) ? f : undefined);
    };

    siteText = (key) => {
      const lt = this.lichessTools;
      const value = lt.global.i18n?.site?.[key];
      return typeof value === 'string' ? value : lt.translator.noarg(key);
    };

    variantText = (key, fallback = key) => {
      const value = this.lichessTools.global.i18n?.variant?.[key];
      return typeof value === 'string' ? value : fallback;
    };

    daysText = (days) => {
      const lt = this.lichessTools;
      if (!isFinite(days)) return '∞';
      const nbDays = lt.global.i18n?.site?.nbDays;
      return typeof nbDays === 'function' ? nbDays(days) : lt.translator.pluralSame('nbDays', days);
    };

    dayIndex = (days) => {
      const index = this.dayStops.findIndex(stop => stop >= days);
      return index >= 0 ? index : this.dayStops.length - 1;
    };

    parseSeek = (tr) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const tds = $(tr).children('td');
      const icon = tds.eq(3).find('[data-icon],.svg-icon');
      const iconKey = icon.attr('data-icon') || (icon.attr('class') || '').match(/\bicon-(\w+)/)?.[1]?.toLowerCase();
      const modeText = tds.eq(3).text().trim();
      return {
        rating: +tds.eq(1).text().replace(/\D/g, ''),
        days: +(/\d+/.exec(tds.eq(2).text())?.[0]) || Infinity,
        variant: this.variantByIcon[iconKey],
        rated: modeText === this.siteText('rated') ? true : modeText === this.siteText('casual') ? false : undefined
      };
    };

    matchesFilter = (seek, f) => {
      if (seek.variant && !f.variant.includes(seek.variant)) return false;
      const dayIndex = this.dayIndex(seek.days);
      if (dayIndex < f.days[0] || dayIndex > f.days[1]) return false;
      if (seek.rated !== undefined && !f.mode.includes(seek.rated ? 'rated' : 'casual')) return false;
      if (seek.rating && (seek.rating < f.rating[0] || seek.rating > f.rating[1])) return false;
      return true;
    };

    applyFilter = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const f = this.getFilter();
      const isDefault = this.isDefaultFilter(f);
      let hidden = 0;
      $('.lobby__app-seeks .hooks__list tbody tr.seek').each((i, tr) => {
        // always show own seeks
        const show = isDefault || $(tr).hasClass('cancel') || this.matchesFilter(this.parseSeek(tr), f);
        $(tr)
          .toggleClassSafe('lichessTools-seekShown', show)
          .toggleClassSafe('lichessTools-filteredOut', !show);
        if (!show) hidden++;
      });
      // while a filter is active, CSS hides rows not yet checked, so we don't have rows flashing in and out briefly
      $('.lobby__app-seeks .lseeks').toggleClassSafe('lichessTools-filterActive', !isDefault);
      $('.lobby__app-seeks .lichessTools-filterToggle').toggleClassSafe('gamesFiltered', hidden > 0);
    };

    checkable = (group, index, value, text, title, checked) => {
      const $ = this.lichessTools.$;
      const id = `lichessTools-lobbyFilter-${group}-${index}`;
      return $('<div class="checkable">')
        .append($('<span class="form-check__input">')
          .append($('<input type="checkbox">').attr({ id, name: group, value }).prop('checked', checked))
          .append($('<label class="form-check__label">').attr('for', id)))
        .append($('<label>').attr({ for: id, title: title || null }).text(text));
    };

    // a min/max slider pair over one range, in one of two layouts (see the branch below)
    rangePair = ({ key, min, max, step, gap = 0, value, format, ticks, dual = false }) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const wrap = $('<div class="lichessTools-rangePair">')
        .attr('data-key', key)
        .toggleClassSafe('lichessTools-rangeDual', dual);
      const label = $('<label class="range">').appendTo(wrap);
      const makeInput = (cls, val) => $('<input type="range" class="range">').addClass(cls).attr({ min, max, step }).val(val);
      const minInput = makeInput('lichessTools-rangeMin', value[0]);
      const maxInput = makeInput('lichessTools-rangeMax', value[1]);
      const row = (...content) => $('<div class="lichessTools-rangeRow">').append(...content);
      const caption = (textKey) => $('<span class="lichessTools-rangeCaption">').text(trans.noarg(textKey));
      const ticksElem = $('<div class="lichessTools-rangeTicks">').append(...ticks.map(t => $('<span>').text(t)));
      if (dual) {
        // rating range slider: both knobs on a single track; the gap guarantees they never overlap
        wrap.append(row($('<div class="lichessTools-rangeTrack">'), minInput, maxInput), ticksElem);
      } else {
        // timeframe(s) slider: min above, max below; each track grays out the part the other knob makes impossible
        // (we also highlight the selected span)
        wrap.append(row(caption('minCaption'), minInput), ticksElem, row(caption('maxCaption'), maxInput));
      }

      const update = () => {
        const lo = +minInput.val();
        const hi = +maxInput.val();
        // knob centers as track positions (a knob travels half its width short of each end), snapped to the track ends at the extremes
        const pos = (v) => {
          const f = (v - min) / (max - min);
          return f <= 0 ? '0%' : f >= 1 ? '100%' : `calc(var(--lt-thumb) / 2 + (100% - var(--lt-thumb)) * ${f})`;
        };
        wrap[0].style.setProperty('--lt-lo-pos', pos(lo));
        wrap[0].style.setProperty('--lt-hi-pos', pos(hi));
        minInput.attr('aria-valuetext', format(lo));
        maxInput.attr('aria-valuetext', format(hi));
        label.empty().toggleClassSafe('lichessTools-single', lo === hi);
        if (lo === hi) label.appendSpan(format(lo));
        else label.appendSpan(format(lo)).appendSpan('–').appendSpan(format(hi));
      };
      minInput.on('input', () => {
        minInput.val(Math.min(+minInput.val(), +maxInput.val() - gap));
        update();
        this.saveForm();
      });
      maxInput.on('input', () => {
        maxInput.val(Math.max(+maxInput.val(), +minInput.val() + gap));
        update();
        this.saveForm();
      });
      update();
      return wrap;
    };

    readForm = () => {
      const $ = this.lichessTools.$;
      const form = $('.lichessTools-corrFilters form');
      if (!form.length) return null;
      const checked = (name) => form.find(`input[name="${name}"]:checked`).get().map(e => e.value);
      const range = (key) => ['Min', 'Max'].map(m => +form.find(`.lichessTools-rangePair[data-key="${key}"] .lichessTools-range${m}`).val());
      return {
        variant: checked('variant'),
        days: range('days'),
        mode: checked('mode'),
        rating: range('rating')
      };
    };

    saveForm = () => {
      const f = this.readForm();
      if (!f) return;
      this.setFilter(f);
      this.applyFilter();
    };

    buildPanel = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const f = this.getFilter();
      const panel = $('<div class="hook__filters lichessTools-corrFilters">');
      const form = $('<form novalidate>').appendTo(panel);
      const tbody = $('<tbody>').appendTo($('<table>').appendTo(form));
      const row = (cls, labelKey, ...content) => $('<tr>').addClass(cls)
        .append($('<td>').text(this.siteText(labelKey)))
        .append($('<td>').append(...content))
        .appendTo(tbody);

      row('filter-variant', 'variant', ...this.variants.map((v, i) =>
        this.checkable('variant', i, v, this.variantText(v), this.variantText(v + 'Title', ''), f.variant.includes(v))));

      row('', 'daysPerTurn', this.rangePair({
        key: 'days',
        min: 0,
        max: this.dayStops.length - 1,
        step: 1,
        value: f.days,
        format: i => this.daysText(this.dayStops[i]),
        ticks: this.dayStops.map(d => isFinite(d) ? d : '∞')
      }));

      row('inline', 'mode', ...['casual', 'rated'].map((m, i) =>
        this.checkable('mode', i, m, this.siteText(m), null, f.mode.includes(m))));

      const ratingTicks = [];
      for (let r = this.ratingRange.min; r <= this.ratingRange.max; r += 500) ratingTicks.push(r);
      row('', 'ratingFilter', this.rangePair({
        ...this.ratingRange,
        key: 'rating',
        value: f.rating,
        format: v => v,
        ticks: ratingTicks,
        dual: true
      }));

      $('<div class="actions">')
        .append($('<button type="reset" class="button button-empty button-red text reset">')
          .attr('data-icon', lt.icon.NotAllowed)
          .text(this.siteText('reset')))
        .append($('<button type="submit" class="button button-green text apply">')
          .attr('data-icon', lt.icon.Checkmark)
          .text(this.siteText('apply')))
        .appendTo(form);

      form
        .on('change', 'input[type="checkbox"]', this.saveForm)
        .on('reset', (ev) => {
          ev.preventDefault();
          this.setFilter(null);
          this.applyFilter();
          panel.replaceWith(this.buildPanel());
        })
        .on('submit', (ev) => {
          ev.preventDefault();
          this.isOpen = false;
          this.refresh();
        });

      return panel;
    };

    togglePanel = (ev) => {
      ev.preventDefault();
      this.isOpen = !this.isOpen;
      this.refresh();
    };

    refresh = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const content = $('.lobby__app-seeks .lseeks');
      if (!content.length) {
        this.isOpen = false;
        return;
      }
      let toggle = content.children('.lichessTools-filterToggle');
      if (!toggle.length) {
        toggle = $('<button class="toggle toggle-filter lichessTools-filterToggle">')
          .attr('title', trans.noarg('filterToggleTitle'))
          .on('click', this.togglePanel)
          .prependTo(content);
      }
      toggle
        .toggleClassSafe('active', this.isOpen)
        .attr('data-icon', this.isOpen ? lt.icon.X : lt.icon.Gear)
        .attr('aria-label', this.siteText(this.isOpen ? 'close' : 'filterGames'));
      const panel = content.children('.lichessTools-corrFilters');
      if (this.isOpen && !panel.length) {
        this.buildPanel().insertAfter(toggle);
      } else if (!this.isOpen) {
        panel.remove();
      }
      content.toggleClassSafe('lichessTools-filterOpen', this.isOpen);
      this.applyFilter();
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('correspondenceLobbyFilters');
      this.logOption('Correspondence lobby filters', value);
      $('body').observer()
        .off('.lobby__app,.hooks__list tbody', this.refresh);
      if (!value) {
        this.isOpen = false;
        $('.lichessTools-filterToggle,.lichessTools-corrFilters').remove();
        $('.lseeks').removeClass('lichessTools-filterOpen lichessTools-filterActive');
        $('.hooks__list tr.seek').removeClass('lichessTools-filteredOut lichessTools-seekShown');
        return;
      }
      if (!$('main.lobby').length) return;
      this.variantByIcon = {};
      for (const [name, variant] of Object.entries(this.iconVariants)) {
        this.variantByIcon[lt.icon[name]] = variant;
        this.variantByIcon[name.toLowerCase()] = variant;
      }
      // executeDirect: run inside the mutation callback, before the next paint, otherwise re-rendered rows show up unfiltered for a frame
      $('body').observer()
        .on('.lobby__app,.hooks__list tbody', this.refresh, { executeDirect: true });
      this.refresh();
    }

  }
  LiChessTools.Tools.CorrespondenceLobbyFilters = CorrespondenceLobbyFiltersTool;
})();

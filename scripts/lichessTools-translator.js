(() => {
  class Translator {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.init();
    }

    init() {
      const lt = this.lichessTools;
      lt.intl = {
        lichessTools: lt,
        defaultLanguage: 'en-US',
        'en-US': {
          'LiChess Tools': 'LiChess Tools',
          serverOverload: 'Lichess thinks we are overloading their system!',
          errorSavingPreferences: 'Error saving preferences! Reload the page.',
          'daysText:one': 'a day',
          'hoursText:one': 'an hr',
          'minutesText:one': 'a min',
          'daysText': '%s days',
          'hoursText': '%s hrs',
          'minutesText': '%s mins',
          'timeText': '%s ago'
        },
        'ro-RO': {
          serverOverload: 'Lichess crede c\u0103 le supra\u00eenc\u0103rc\u0103m sistemul!',
          errorSavingPreferences: 'Eroare salvare preferin\u0163e! Re\u00eencarc\u0103 pagina.',
          'daysText:one': 'o zi',
          'hoursText:one': 'o or\u0103',
          'minutesText:one': 'un minut',
          'daysText': '%s zile',
          'hoursText': '%s ore',
          'minutesText': '%s minute',
          'timeText': 'acum %s'
        },
        get lang() {
          const lt = this.lichessTools;
          let lang = lt.global.document.documentElement.lang || this.defaultLanguage;
          if (!this[lang] && !this[lang+'-crowdin']) lang = this.defaultLanguage;
          return lang;
        },
        get isTranslated() {
          return this.lang != this.defaultLanguage;
        },
        get siteI18n() {
          const lt = this.lichessTools;
          if (lt.debug) {
            const allKeys = Object.keys(this[this.defaultLanguage]);
            const langKeys = Object.keys({ ...this[this.lang], ...this[this.lang+'-crowdin'] });
            const missingKeys = new Set(allKeys);
            for (const key of langKeys) missingKeys.delete(key);
            const orphanKeys = new Set(langKeys);
            for (const key of allKeys) orphanKeys.delete(key);
            const logs = [];
            if (missingKeys.size) logs.push(missingKeys.size+' missing keys for '+this.lang+': '+[...missingKeys].join(', '));
            if (orphanKeys.size) logs.push(orphanKeys.size+' orphan keys in '+this.lang+': '+[...orphanKeys].join(', '));
            if  (this[this.lang+'-crowdin']) {
              const crowdinKeys = Object.keys(this[this.lang+'-crowdin']);
              const missingCrowdinKeys = new Set(allKeys);
              for (const key of crowdinKeys) missingCrowdinKeys.delete(key);
              if (missingCrowdinKeys.size) logs.push(missingCrowdinKeys.size+' missing Crowdin keys for '+this.lang+': '+[...missingCrowdinKeys].join(', '));
            }
            if (logs.length) {
              const text = logs.join('\r\n');
              if (this._lastLoggedText != text) {
                lt.global.setTimeout(()=>lt.global.console.warn(text),100);
                this._lastLoggedText = text;
              }
            }
          }
          if (!this._siteI18n) {
            this._siteI18n = { ...this[this.defaultLanguage], ...this[this.lang], ...this[this.lang+'-crowdin'] };
          }
          return this._siteI18n;
        }
      };
    }

      format(str, args) {
        if (args?.length) {
          if (str.includes('%s')) {
            str = str.replace('%s', args[0]);
          } else {
            for (let i = 0; i < args.length; i++) {
              str = str.replace('%' + (i + 1) + '$s', args[i]);
            }
          }
        }
        return str;
      }

      noarg(key) {
        const lt = this.lichessTools;
        const dict = lt.intl.siteI18n;
        const result =  dict[key] || lt.global?.i18n(key);
        if (result) return result;
        lt.global.console.warn('Translation not found for key ',key);
        return key;
      }

      plural(key, count, ...args) {
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        const quantity = (o) => 1 == o ? "one" : "other";
        const dict = lt.intl.siteI18n;
        const str =
          dict[`${key}:${quantity(count)}`] || dict[`${key}:other`] || dict[key] || dict[`${key}:one`]
          || this.format(`${key}:${quantity(count)}`) || this.format(`${key}:other`) || this.format(key) || this.format(`${key}:one`);
        const result = str ? this.format(str, args) : null;
        if (result) return result;
        lt.global.console.debug('Plural not found for key ',key);
        return key;
      }

      pluralSame(key, count, ...args) {
        return this.plural(key, count, count, ...args);
      }

      vdom(key, ...args) {
        const str = this.noarg(key);
        return str ? this.list(str,args) : [key];
      }

      list(str, args) {
        const segments = str.split(/(%(?:\d\$)?s)/g);
        if (!args?.length) return segments;
        const singlePlaceholder = segments.indexOf('%s');
        if (singlePlaceholder !== -1) {
          segments[singlePlaceholder] = args[0];
        } else {
          for (let i = 0; i < args.length; i++) {
            const placeholder = segments.indexOf('%' + (i + 1) + '$s');
            if (placeholder !== -1) segments[placeholder] = args[i];
          }
        }
        return segments;
      }

  }

  LiChessTools.Translator = Translator;
})();
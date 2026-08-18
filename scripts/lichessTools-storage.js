(() => {
  class Storage {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

      get supportsDb() { 
        const lt = this.lichessTools;
        return !!lt.global.indexedDB;
      }

      getStore(options) {
        const lt = this.lichessTools;
        if (options?.db) {
          if (!this.supportsDb) {
            throw new Error('System doesn\' support indexedDB');
          }
          return new LiChessTools.IndexedDbStorage();
        }
        const store = options?.session
          ? lt.global.sessionStorage
          : lt.global.localStorage;
        return store;
      }

      get(key, options) {
        const lt = this.lichessTools;
        const store = this.getStore(options);
        let text = store.getItem(key);
        if (typeof text === 'string' && text?.startsWith('LTPK')) {
          try {
            const decompressed = LiChessTools.unzip(text);
            if (decompressed != null) text = decompressed;
          } catch (ex) {
            lt.global.console.warn('Cannot unzip text. Using raw', ex);
          }
        }
        if (text === undefined || options?.raw || text?.then) return text;
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Error parsing JSON', e);
          return text;
        }
      }

      set(key, value, options) {
        const lt = this.lichessTools;
        const store = this.getStore(options);
        if (value === undefined) {
          store.removeItem(key);
          return;
        }
        let text = options?.raw ? value : JSON.stringify(value);
        const zip = options?.zip === true || (!!options?.zip && text?.length >= +options?.zip);
        if (zip) {
          try {
            const compressed = LiChessTools.zip(text);
            if (compressed != null) text = compressed;
          } catch (ex) {
            lt.global.console.warn('Cannot zip text. Using raw', ex);
          }
        }
        try {
          store.setItem(key, text);
        } catch(e) {
          if (e instanceof QuotaExceededError) {
            lt.global.console.warn(`Storage quota exceeded for ${key} (${text?.length}) Session: ${options?.session}`);
          }
          throw e;
        }
        store.setItem(key, text);
      }

      remove(key, options) {
        const store = this.getStore(options);
        store.removeItem(key);
      }

      listen(key, func, options) {
        const lt = this.lichessTools;
        if (options?.session) throw new Error('You cannot listen to events on session storage, only local');
        const $ = lt.$;
        const handler = e => {
          const store = this.getStore(options);
          if (e.key !== key || e.storageArea !== store || e.newValue === null) return;
          const parsed = lt.jsonParse(e.newValue);
          if (parsed?.sri && parsed.sri !== lt.sri) func(parsed);
        };
        $(lt.global).on('storage', handler);
        return ()=>$(lt.global).off('storage', handler);
      }

      fire(key, value, options) {
        const lt = this.lichessTools;
        if (options?.session) throw new Error('You cannot fire events on session storage, only local');
        this.set(key, {
          sri: lt.sri,
          nonce: lt.global.Math.random(), // ensure item changes
          value: value,
        }, options);
      }
    }

  LiChessTools.Storage = Storage;
})();
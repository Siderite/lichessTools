(() => {
  class Cache {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

      _lock = '__lock cache keys__';
      _keySuffix = 1;

      init() {
        const lt = this.lichessTools;
        const sessionData = lt.storage.get('LichessTools.GeneralCache', { session: true }) || [];
        const localData = lt.storage.get('LichessTools.GeneralCache', { session: false }) || [];
        this._cache = new Map(sessionData.concat(localData));
        this._semaphore = new LiChessTools.APISemaphore(lt);
      }

      save() {
        const lt = this.lichessTools;
        if (!this._initSave) {
          this._initSave = true;
          lt.global.addEventListener('beforeunload', this.saveDirect.bind(this));
        }
        if (!this._saveInterval) {
          this._saveInterval = lt.global.setInterval(this.saveDirect.bind(this),10000);
        }
      }

      saveDirect() {
        const lt = this.lichessTools;
        lt.global.clearInterval(this._saveInterval);
        this._saveInterval = undefined;
        if (!this._cache) return;

        const totalEntries = [...this._cache.entries()];
        const sessionEntries = [];
        const localEntries = [];
        totalEntries.forEach(e=>{
          switch(e[1].persist) {
            case 'session': sessionEntries.push(e); break;
            case 'local': localEntries.push(e); break;
          }
        });
        const minSizeForZip = 2000000;
        if (sessionEntries.length) {
          try {
            lt.storage.set('LichessTools.GeneralCache', sessionEntries, { session: true, zip: minSizeForZip });
          } catch(e) {
            if (e instanceof QuotaExceededError) {
              lt.storage.set('LichessTools.GeneralCache', sessionEntries, { session: true, zip: true });
            } else {
              throw e;
            }
          }
        }
        if (localEntries.length) {
          try {
            lt.storage.set('LichessTools.GeneralCache', localEntries, { session: false, zip: minSizeForZip });
          } catch(e) {
            if (e instanceof QuotaExceededError) {
              lt.storage.set('LichessTools.GeneralCache', localEntries, { session: false, zip: true });
            } else {
              throw e;
            }
          }
        }
      }

      getCached(key) {
        const lt = this.lichessTools;
        if (!this._cache) {
          this.init();
        }
        if (this.isLocked(key)) lt.global.console.debug('trying to get '+key+' when locked');
        const cached = this._cache.get(key);
        if (cached) {
          cached.isExpired = cached.expiry < Date.now();
        }
        return cached;
      }

      setCached(key, value, options) {
        if (!this._cache) {
          this.init();
        }
        const cached = {
          key: key,
          value: value,
          expiry: Date.now() + options.interval,
          persist: options.persist
        };
        this._cache.set(key, cached);
        this.save();
      }

      lock(key) {
        if (!this._cache) {
          this.init();
        }
        this._cache.set(key+this._lock,true);
      }

      isLocked(key) {
        return !!this._cache?.get(key+this._lock);
      }

      release(key) {
        this._cache?.delete(key+this._lock);
      }

      waitRelease(key, resolution = 50) {
        const lt = this.lichessTools;
        return new Promise(resolve=>{
          if (this.isLocked(key)) {
            const interval = lt.global.setInterval(()=>{
              if (!this.isLocked(key)) {
                lt.global.clearInterval(interval);
                resolve();
              }
            },resolution);
          } else {
            resolve();
          }
        });
      }

      memoizeAsyncFunction(obj, funcName, options) {
        if (!options) throw new Error('No options provided to memoizeAsyncFunction');
        const cache = this;
        const lt = cache.lichessTools;
        const $ = lt.$;

        const original = obj[funcName];
        if (!original) throw new Error('Could not find function '+funcName);
        obj[funcName] = async function (...args) {
          const funcKey = 'sema_'+ (options.keyPrefix||'') + funcName;
          let key = options.keyFunction
            ? options.keyFunction(obj, funcName, args)
            : (options.keyPrefix||'') + funcName + JSON.stringify(args);
          if (cache._keySuffix) key+='_'+cache._keySuffix;
          await cache.waitRelease(key);
          const cached = cache.getCached(key);
          if (cached?.value !== undefined && !cached.isExpired) {
            if (options.sliding) {
              cache.setCached(key, cached.value, options);
            }
            return cached.value;
          }
          let apiElem = $('body > .lichessTools-api');
          if (!apiElem.length) {
            apiElem = $('<div class="lichessTools-api">').appendTo('body');
          }
          lt.requestAF(()=>apiElem.toggleClassSafe('lichessTools-apiLoading',true), 'lichessTools-cache');
          try {
            cache.lock(key);
            const immediateResult = options.minTime
              ? cache._semaphore.execute(()=>original.apply(obj, args),funcKey,options.minTime)
              : original.apply(obj, args);
            if (!options.knownSyncFunction) {
              if (!immediateResult?.then) throw new Error('Memoize only works on async functions or known sync functions!');
            }
            const result = await immediateResult;
            if (!options.resultFilter || options.resultFilter(result)) {
              cache.setCached(key, result, options);
            }
            return result;
          } finally {
            cache.release(key);
            lt.requestAF(()=>apiElem.toggleClassSafe('lichessTools-apiLoading',false), 'lichessTools-cache');
          }
        };
        obj[funcName].__originalFunction = original;
      }

  }

  LiChessTools.Cache = Cache;
})();
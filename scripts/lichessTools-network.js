(() => {
  class Network {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

    slowMode = false;
    slowModeTimeout = null;

      logNetwork(url, size, status, duration) {
        const lt = this.lichessTools;
        const now = Date.now();
        if (!this.networkLog) {
          this.networkLog = lt.jsonParse(_ => lt.global.localStorage.getItem('LiChessTools2.fetch'), { size: 0, count: 0, arr: [], minTime: now });
        }
        this.networkLog.size += size;
        this.networkLog.count++;
        this.networkLog.arr.push({
          time: now,
          url: url,
          size: size,
          status: status,
          duration: duration
        });
        lt.debug > 1 && lt.global.console.debug(url,now,duration);
        if (this.networkLog.arr.length > 20000) {
          this.networkLog.arr.splice(0, 2000);
          this.storeLog();
        }
        if (lt.debug) {
          const rate = this.networkLog.size ? Math.round(8 * this.networkLog.size / (now - this.networkLog.minTime)) : 0;
          const avgSize = this.networkLog.size ? Math.round(8 * this.networkLog.size / this.networkLog.count) : 0;
          const logSize = lt.global.JSON.stringify(this.networkLog).length;
          lt.global.console.debug('Fetch log size:', logSize);
          lt.global.console.debug('  ... Bandwith logged:', this.networkLog.size, 'Rate:', rate, 'kbps', 'Avg call size:', avgSize, 'kbps');
        }
      }

      storeLog() {
        const lt = this.lichessTools;
        const text = lt.global.JSON.stringify(this.networkLog);
        lt.global.localStorage.setItem('LiChessTools2.fetch', text);
      }

      async json(url, options) {
        const lt = this.lichessTools;
        if (!options) options = {};
        if (!options.headers) options.headers = {};
        options.headers.Accept ||= (options.ndjson
                            ? 'application/x-ndjson'
                            : 'application/json');
        if (!options?.noRequestedWithHeader) {
          options.headers['x-requested-with'] ||= 'XMLHttpRequest';
        }
        const json = await this.fetch(url, options);
        if (!json) return null;
        if (options.ndjson) {
          return lt.ndjsonParse(json);
        } else {
          return lt.jsonParse(json);
        }
      }

      async postForm(url, data, options) {
        const params = new URLSearchParams();
        if (data) {
          for (const key in data) {
            params.append(key, data[key]);
          }
        }
        return await this.fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
          ...options
        });
      }

      async fetch(url, options) {
        const lt = this.lichessTools;
        const console = lt.global.console;
        try {
          let args = null;
          if (url instanceof URL) {
            url = url.href;
          }
          if (typeof url != 'string') {
            args = url.args;
            url = url.url;
          }
          if (!url) throw new Error('URL has to be string or {url, args}');
          if (args) {
            for (const k in args) {
              url = url.replace('{' + k + '}', lt.global.encodeURIComponent(args[k]));
            }
          }
          if (this.slowMode) await lt.timeout(1000);
          const ltHeader = `LiChessTools/${lt.currentOptions?.version}`;
          if (!options?.noUserAgent) {
            options = {...options,headers: { ...options?.headers,'X-UA': ltHeader } };
          }
          const startTime = performance.now();
          const response = await lt.global.fetch(url, options);
          const endTime = performance.now();
          const status = +(response.status);
          if (options?.ignoreStatuses?.includes(status)) {
            this.logNetwork(url, (options?.body?.length || 0), status);
            return null;
          }
          if (!response.ok) {
            console.warn('fetch: ' + url + ': [' + response.type + '] ' + response.status + ' (' + response.statusText + ')');
          }
          if (status >= 400) {
            this.logNetwork(url, (options?.body?.length || 0), status);
            if (status == 429) {
              console.debug('429 received!');
              const translation = lt.translator.noarg('serverOverload');
              lt.announce(translation);
              this.slowMode = true;
              lt.global.clearTimeout(this.slowModeTimeout);
              this.slowModeTimeout = lt.global.setTimeout(() => this.slowMode = false, 60000);
            }
            const err = new Error('Response status: ' + status);
            err.response = response;
            err.url = url;
            err.options = options;
            throw err;
          }
          const text = await response.text();
          this.logNetwork(url, (options?.body?.length || 0) + (text?.length || 0), status, endTime - startTime);
          return text;
        } catch (e) {
          if (e.toString().includes('Failed to fetch')) {
            console.log('Fetch for ' + url + ' failed: ', e, status);
          } else {
            console.warn('Fetch for ' + url + ' failed: ', e, status);
          }
          throw e;
        };
      }

  }

  LiChessTools.Network = Network;
})();
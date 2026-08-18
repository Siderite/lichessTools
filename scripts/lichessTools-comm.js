(() => {
  class Comm {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

      timeout = 10000;
      sendResponses = [];

      init() {
        const lt = this.lichessTools;
        lt.global.addEventListener('LichessTools.receive', (ev) => {
          let detail;
          try {
            detail = typeof ev.detail == 'string'
              ? JSON.parse(ev.detail)
              : ev.detail;
          } catch (e) {
            lt.global.console.warn('Could not parse extension response',e);
            return;
          }
          const sendResponse = this.sendResponses[detail?.uid];
          if (sendResponse) {
            delete this.sendResponses[detail.uid];
            sendResponse(detail);
          }
        });
        lt.cache.memoizeAsyncFunction(lt.comm, 'getDataUrl', { persist: 'session', interval: 1 * 86400 * 1000, resultFilter: (r)=>r?.dataUrl });
      }

      send(data, sendResponse, timeout) {
        const lt = this.lichessTools;
        const uid = crypto.randomUUID();
        return new Promise((resolve, reject) => {
          const pointer = setTimeout(() => {
            delete this.sendResponses[uid];
            reject(new Error('Send timeout'));
          }, timeout || this.timeout);
          const f = (rdata) => {
            clearTimeout(pointer);
            delete this.sendResponses[uid];
            if (sendResponse) sendResponse(rdata);
            resolve(rdata);
          };
          this.sendResponses[uid] = f;
          const customEvent = new CustomEvent("LichessTools.send", {
            // Strings can safely cross Firefox's page/content-script boundary.
            detail: JSON.stringify({ ...data, uid: uid }),
            bubbles: true,
            cancelable: true,
            composed: false,
          });
          lt.global.dispatchEvent(customEvent);
        });
      }

      _files = new Map();

      async getData(filename, retries=3) {
        const lt = this.lichessTools;
        let data = this._files.get(filename);
        let error = null;
        for (let i=0; i<retries && !data; i++) {
          data = await lt.comm.send({ type: 'getFile', options: { filename: 'data/'+filename } })
                                             .catch(e => { error = e; });
        }
        if (data) {
          this._files.set(filename,data);
        } else {
          if (error) lt.global.console.error(error);
        }
        return data;
      }

      _texts = new Map();

      async fetchText(url, options) {
        options = { retries: 3, url: url, ...options };
        const lt = this.lichessTools;
        let data = this._texts.get(url);
        let error = null;
        for (let i=0; i<options.retries && !data; i++) {
          data = await lt.comm.send({ type: 'fetchText', options: options })
                                             .catch(e => { error = e; });
        }
        if (data) {
          this._texts.set(url,data);
        } else {
          if (error) lt.global.console.error(error);
        }
        return data;
      }

      async getDataUrl(url, options) {
        options = { url: url, ...options };
        const lt = this.lichessTools;
        let error = null;
        const data = await lt.comm.send({ type: 'getDataUrl', options: options })
                                             .catch(e => { error = e; });
        if (data) {
          return data;
        } else {
          if (error) lt.global.console.error(error);
        }
      }

      async getChromeUrl(url) {
        const options = { url: url };
        const lt = this.lichessTools;
        let error = null;
        const data = await lt.comm.send({ type: 'getChromeUrl', options: options })
                                             .catch(e => { error = e; });
        if (data) {
          return data.url;
        } else {
          if (error) lt.global.console.error(error);
        }
      }

      async deleteImage(id, hash, service) {
        const options = { id: id, hash: hash, service: service };
        const lt = this.lichessTools;
        let error = null;
        const data = await lt.comm.send({ type: 'deleteImage', options: options })
                                             .catch(e => { error = e; });
        if (data) {
          return data.ok;
        } else {
          if (error) lt.global.console.error(error);
        }
      }

      async getHeadData(url, options) {
        options = { retries: 3, url: url, ...options };
        const lt = this.lichessTools;
        let error = null;
        let data = null;
        for (let i=0; i<options.retries && !data; i++) {
          data = await lt.comm.send({ type: 'getHeadData', options: options })
                                             .catch(e => { error = e; });
        }
        if (error) lt.global.console.error(error);
        return data;
      }

      async openWindow(url, options) {
        options = { retries: 3, url: url, ...options };
        const lt = this.lichessTools;
        let error = null;
        let data = null;
        for (let i=0; i<options.retries && !data; i++) {
          data = await lt.comm.send({ type: 'openWindow', options: options })
                                             .catch(e => { error = e; });
        }
        if (error) lt.global.console.error(error);
        return data;
      }

  }

  LiChessTools.Comm = Comm;
})();

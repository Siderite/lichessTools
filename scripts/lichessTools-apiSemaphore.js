(() => {
  class APISemaphore {

    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

    get(key) {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      try {
        const { expiresAt } = JSON.parse(raw);
        const remainingTime = expiresAt - Date.now();
        return remainingTime > 0 ? { expiresAt, remainingTime } : null;
      } catch {
        return null;
      }
    }

    tryCreateLock(key, ms) {
      try {
        if (this._inTryCreateLock) return false;
        this._inTryCreateLock = true;
        let lock = this.get(key);
        if (lock) return false;
        lock = { expiresAt: Date.now() + ms };
        localStorage.setItem(key, JSON.stringify(lock));
        return true;
      } finally {
        this._inTryCreateLock = false;
      }
    }

    createLock(key, ms) {
      const lock = { expiresAt: Date.now() + ms };
      localStorage.setItem(key, JSON.stringify(lock));
    }

    async execute(fn, key, ms) {
      const lt = this.lichessTools;
      let lock = this.get(key);

      while (lock?.remainingTime > 0) {
        await lt.timeout(lock.remainingTime);
        lock = this.get(key);
      }

      if (!this.tryCreateLock(key, ms)) {
        await lt.timeout(100);
        return await this.execute(fn,key,ms);
      }
      const result = await fn();
      this.createLock(key, ms);
      return result;
    }
  }

  LiChessTools.APISemaphore = APISemaphore;
})();
(() => {
  class MaxSizedMap extends Map {
    constructor(...args) {
      const maxSize = +args.at(-1);
      if (!maxSize) throw new Error('No size was specified');
      super(...args.slice(0,-1));
      this._maxSize = maxSize;
    }

    set(key, value) {
      const result = super.set(key, value);
      if (this.size >= this._maxSize) {
        this._halveSize();
      }
      return result;
    }

    _halveSize() {
      const keys = Array.from(this.keys());
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }

      const half = Math.floor((this._maxSize+1) / 2);
      for (let i = 0; i < half; i++) {
        this.delete(keys[i]);
      }
    }
  }

  LiChessTools.MaxSizedMap = MaxSizedMap;
})();
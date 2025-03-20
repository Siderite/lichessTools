(function () {
  const URL = this.URL;
  if (!URL) throw new Error('URL class was not found!');
  if (!URL.canParse) {
    URL.canParse = (url, base) => {
      try {
        return new URL(url, base) instanceof URL;
      } catch {
        return false;
      }
    };
  }
  if (!URL.parse) {
    URL.parse = (url, base) => {
      try {
        return new URL(url, base);
      } catch {
        return null;
      }
    };
  }
})();
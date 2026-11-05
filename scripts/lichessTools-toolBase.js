(() => {

  class ToolBase {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }
    get name() {
      return this.constructor.name.replace(/Tool$/, '');
    }

    logOption(label, value) {
      const lt = this.lichessTools;
      lt.global.console.log(label + ' %c' + (value === undefined ? '' : value), 'color:#9980FF');
    }

    async init() {
    }

    async start() {
    }
  }

  // Inheriting from the local ToolBase; tools outside this file see it as LiChessTools.Tools.PageToolBase.
  class PageToolBase extends ToolBase {

    constructor(lichessTools) {
      super(lichessTools);
    }

    // The path of the page the tool owns, e.g. '/page/lichessLadders'.
    // Lichess answers unknown paths with a 404 page whose shell we take over.
    pageUrl = null;
    // Legacy locations of the same tool, which must redirect to pageUrl.
    // Each entry: { url, test?: regex over the hash, convert?: hash -> hash }
    pageAliases = [];
    // Stylesheets owned by Lichess that the page needs; loaded through lt.loadCss().
    pageCss = [];
    // The element whose content belongs to the tool.
    pageContainer = '#main-wrap main';
    // The class the tool puts on its container, and the one its css keys off. This is the
    // tool key rather than a piece of the url, so a tool may rename its page freely.
    pageClass = null;
    // The spinner preparePage leaves in the container while the page is filled in; `initPageEvents`
    // takes it away when the tool is done.
    pageSpinner = null;
    // The translation key of the title the tab shows for the page. Lichess answers an
    // unknown path with a 404 shell that carries a title of its own; the tab is kept empty
    // of it until the render states the page title.
    pageTitle = null;
    // The observer guardPageTitle installs while the document loads; preparePage releases
    // it once the page has been taken over.
    pageTitleGuard = null;

    // A tool page has no subpaths and no parameters, so owning one is an exact path match.
    isPage(url = this.pageUrl) {
      return !!url && this.lichessTools.location.pathname === url;
    }

    // Navigate to this tool's page, using the given hash (the current one by default).
    gotoPage(hash) {
      const lt = this.lichessTools;
      if (hash === undefined) hash = lt.location.hash;
      lt.location.set(lt.location.origin + this.pageUrl + (hash || ''));
    }

    // Sends the browser from one of the legacy locations to the canonical page.
    // An alias without a url matches any page, which lets a tool leave a hash it
    // used to hijack. Returns true when the page was left, in which case the caller
    // must stop working.
    redirectPageAliases() {
      const lt = this.lichessTools;
      for (const alias of this.pageAliases) {
        if (alias.url) {
          if (!this.isPage(alias.url)) continue;
        } else if (this.isPage()) continue;
        if (alias.test && !alias.test.test(lt.location.hash)) continue;
        const hash = alias.convert ? alias.convert(lt.location.hash) : lt.location.hash;
        lt.location.set(lt.location.origin + this.pageUrl + (hash || ''));
        return true;
      }
      return false;
    }

    // The title of the page in the language the page declares so far. The guard runs
    // before the community translations are read, so the title may be the English one
    // until the render states it again, now with every dictionary in place.
    pageTitleText() {
      const lt = this.lichessTools;
      if (!this.pageTitle) return null;
      return lt.translator?.noarg?.(this.pageTitle) || this.pageTitle;
    }

    // A path Lichess does not know answers with a 404 shell that puts its own title in the
    // tab while the page is still parsing, long before the render states the real one. The
    // tab is kept empty while that is going on: a title that is not the one the tool renders
    // is emptied the moment it lands, so the tab shows the address rather than "Page not
    // found". The title the tool renders passes through, and one that landed before this
    // runs is emptied on the spot.
    guardPageTitle() {
      if (!this.pageTitle || !this.isPage()) return;
      const global = this.lichessTools.global;
      const document = global.document;
      if (!document) return;
      const keepTabEmpty = () => {
        if (!document.title || document.title == this.pageTitleText()) return;
        document.title = '';
      };
      keepTabEmpty();
      if (!global.MutationObserver) return;
      const observer = new global.MutationObserver(keepTabEmpty);
      observer.observe(document.documentElement || document, {childList: true, subtree: true, characterData: true});
      this.pageTitleGuard = observer;
    }

    // The render states the title itself, so the early guard has no reason to stay on.
    clearPageTitleGuard() {
      this.pageTitleGuard?.disconnect();
      this.pageTitleGuard = null;
    }

    loadPageCss = async () => {
      if (this.__pageCssLoaded) return;
      const lt = this.lichessTools;
      // The sheets are independent, so they load at once.
      await Promise.all(this.pageCss.map((key) => lt.loadCss(key)));
      this.__pageCssLoaded = true;
    };

    // Takes the page over for this tool: leaves when the url is a legacy one, loads the
    // styles the page needs, then hands over an empty container tagged with
    // 'lichessTools-<pageClass>' (and a spinner while the tool fills it in).
    // Returns null when the tool does not own the current page.
    async preparePage(spinner = true) {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.pageUrl || !this.pageClass) return null;
      if (this.redirectPageAliases()) return null;
      if (!this.isPage()) return null;
      // The shell has had its title emptied by now, and the render states the real one.
      this.clearPageTitleGuard();
      await this.loadPageCss();
      const container = $(this.pageContainer);
      if (!container.length) return null;
      container.empty().attr('class', 'lichessTools-' + this.pageClass);
      this.pageSpinner?.remove();
      this.pageSpinner = null;
      if (spinner) {
        this.pageSpinner = $(lt.spinnerHtml);
        container.append(this.pageSpinner);
      }
      return container;
    }

    // Lichess wires its events onto a page root; a tool page needs that wiring once
    // its content is in place, so tools call this at the end of their render. The
    // spinner that preparePage left behind is taken away there too.
    initPageEvents(container) {
      const lt = this.lichessTools;
      if (container.length) lt.uiApi?.initializeDom?.(container[0]);
      this.pageSpinner?.remove();
      this.pageSpinner = null;
    }
  }

  LiChessTools.Tools = {
    ToolBase: ToolBase,
    PageToolBase: PageToolBase
  };

  window.LiChessTools = LiChessTools;
})();
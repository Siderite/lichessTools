(() => {
  class BlogTableOfContentsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'blogTableOfContents',
        category: 'comm',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.comm': 'Chat, forums, blogs',
        'options.blogTableOfContents': 'Blog table of contents',
        'tableOfContentsText': 'Table of contents',
        'tableOfContentsTitle': 'LiChess Tools - table of contents'
      },
      'ro-RO': {
        'options.comm': 'Chat, forumuri, blog-uri',
        'options.blogTableOfContents': 'Cuprins pentru blog-uri',
        'tableOfContentsText': 'Cuprins',
        'tableOfContentsTitle': 'LiChess Tools - cuprins'
      }
    }

    scrollIntoView = (elem, container) => {
      if (!elem || !container) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = elem.getBoundingClientRect();

      const currentScroll = container.scrollTop;
      const itemTopInContainer = itemRect.top - containerRect.top + currentScroll;
      const itemBottomInContainer = itemTopInContainer + itemRect.height;

      let targetScroll = currentScroll;

      if (itemTopInContainer < currentScroll) {
        targetScroll = itemTopInContainer - 10;
      } else if (itemBottomInContainer > currentScroll + containerRect.height) {
        targetScroll = itemBottomInContainer - containerRect.height + 10;
      }

      if (targetScroll !== currentScroll) {
        container.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      }
    };

    addTableOfContents = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let container = $('nav.subnav__inner .lichessTools-blogTableOfContents');
      if (container.length) return;
      container = $('<div class="lichessTools-blogTableOfContents">')
        .append($('<a class="lichessTools-toc">')
          .attr('href','#')
          .text(trans.noarg('tableOfContentsText'))
          .attr('title',trans.noarg('tableOfContentsTitle'))
          .on('click',(ev)=>{
            ev.preventDefault();
            container.toggleClass('collapsed');
          })
        )
        .append($('<div class="entries">'));
      let showToc = false;
      const entryContainer = container.find('.entries');
      const headings = $('.ublog-post__markup').find('h2,h3,h4')
        .each((i,e)=>{
          const text = $(e).text();
          const href = $(e).children('a[id][href]').attr('href');
          if (!text || !href) return;
          $('<a>')
            .addClass('lichessTools-toc_'+e.tagName.toLowerCase())
            .text(text)
            .attr('href',href)
            .appendTo(entryContainer);
          showToc = true;
        });
      if (showToc) {
        container.appendTo('body');

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const href = $(entry.target)
                             .children('a[id][href]')
                             .attr('href');
              $('a[class^="lichessTools-toc_"]')
                .each((i,e)=>{
                  const isActive = $(e).attr('href')==href;
                  if (isActive) {
                    lt.requestAF(()=>this.scrollIntoView(e,entryContainer[0]),'TOCscroll');
                  }
                  $(e).toggleClassSafe('active',isActive);
                });
            });
          },
          {
            rootMargin: "0px 0px -90% 0px",
            threshold: 0
          }
        );

        headings.each((i,heading) => observer.observe(heading));
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('blogTableOfContents');
      this.logOption('Blog TOC', value);
      this.options = {
        enabled: !!value
      };
      $('.lichessTools-blogTableOfContents').remove();
      if (this.options.enabled) {
        const isBlogUrl = /^\/@\/[^\/]+\/blog\/[^\/]+\/[^\/]+/i.test(lt.global.location.pathname);
        if (isBlogUrl) {
          this.addTableOfContents();
        }
      }
    }

  }
  LiChessTools.Tools.BlogTableOfContents = BlogTableOfContentsTool;
})();

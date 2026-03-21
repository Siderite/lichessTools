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

    addTableOfContents = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let container = $('nav.subnav__inner .lichessTools-blogTableOfContents');
      if (container.length) return;
      container = $('<div class="lichessTools-blogTableOfContents">')
        .appendTo('body');
      let showToc = false;
      const headings = $('.ublog-post__markup').find('h2,h3,h4')
        .each((i,e)=>{
          const text = $(e).text();
          const href = $(e).children('a[id][href]').attr('href') || '#';
          $('<a>')
            .addClass('lichessTools-toc_'+e.tagName.toLowerCase())
            .text(text)
            .attr('href',href)
            .appendTo(container);
          showToc = true;
        });
      if (showToc) {
        $('<a class="lichessTools-toc">')
          .attr('href','#')
          .text(trans.noarg('tableOfContentsText'))
          .attr('title',trans.noarg('tableOfContentsTitle'))
          .prependTo(container);

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const href = $(entry.target)
                             .children('a[id][href]')
                             .attr('href');
              $('a[class^="lichessTools-toc_"]')
                .each((i,e)=>{
                  $(e).toggleClassSafe('active',$(e).attr('href')==href);
                });
            });
          },
          {
            rootMargin: "-20% 0px -20% 0px",
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

(() => {
  class DailyQuoteTool extends LiChessTools.Tools.ToolBase {

    dependencies = [ 'Dialog' ];

    preferences = [
      {
        name: 'dailyQuote',
        category: 'general',
        type: 'single',
        possibleValues: [false, 'top', 'side'],
        defaultValue: 'top',
        advanced: true
      }
    ];


    upgrades = [
      { name:'dailyQuote', value:'true', version: '2.4.2', type: 'obsolete' },
      { name:'dailyQuote', value:'top', version: '2.4.2', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.dailyQuote': 'Daily quote',
        'dailyQuoteTitle': 'LiChess Tools - daily quote',
        'quoteCloseButtonTitle': 'Hide today\'s quote',
        'dailyQuote.top': 'On top',
        'dailyQuote.side': 'On the side',
        'allQuotesByAuthorText': 'All quotes by %s'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.dailyQuote': 'Citatul zilei',
        'dailyQuoteTitle': 'LiChess Tools - citatul zilei',
        'quoteCloseButtonTitle': 'Ascunde citatul de azi',
        'dailyQuote.top': 'Deasupra',
        'dailyQuote.side': 'Pe lateral',
        'allQuotesByAuthorText': 'Toate citatele de la %s'
      }
    }

    authorSearch = async (ev) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      ev.preventDefault();
      const author = $(ev.currentTarget).text().replaceAll(/\(.*?\)/g,'').trim();
      const quotes = this.quotes.filter(q=>q.name.replaceAll(/\(.*?\)/g,'').trim() == author);
      const header = trans.pluralSame('allQuotesByAuthorText',author); 
      const dialog = await lt.dialog({
        header: header,
        noDrag: true
      });
      $(dialog).addClass('lichessTools-dailyQuote');
      for (const quote of quotes) {
        $('<div>')
          .append($('<span class="text">').text(quote.text))
          .appendTo($('.dialog-content',dialog));
      }
      dialog.showModal();
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('dailyQuote');
      this.logOption('Daily quote', value);
      if (!$('main').is('.lobby')) return;
      $('.lichessTools-dailyQuote').remove();
      if (!value) return;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const closedDate = lt.storage.get('LiChessTools.closedQuote');
      if (today.toDateString() == closedDate) {
        return; 
      }
      const elem = $('<div class="lichessTools-dailyQuote"><span class="quote"></span><span class="author"></span><button type="button" class="close"></button></div>')
        .attr('title',trans.noarg('dailyQuoteTitle'));
      if (value === true || value == 'top') {
        elem
          .addClass('top')
          .insertAfter('header#top');
      } else if (value == 'side') {
        elem
          .addClass('side')
          .prependTo('.lobby__side');
      }
      const quotes = (await lt.comm.getData('quotes.json'))?.quotes;
      if (quotes?.length) {
        lt.global.setTimeout(async ()=>{
          quotes.sort((a,b)=>lt.crc24(a.text)-lt.crc24(b.text));
          const index =  Math.round(today.getTime()/86400000) % quotes.length;
          const quote = quotes[index];
          $('.quote',elem).text(quote.text);
          $('.author',elem)
            .off('click',this.authorSearch)
            .on('click',this.authorSearch)
            .text(quote.name);
          $('.close',elem)
            .attr('title',trans.noarg('quoteCloseButtonTitle'))
            .on('click',(ev)=>{
              ev.preventDefault();
              lt.storage.set('LiChessTools.closedQuote',today.toDateString());
              elem.remove();
            })
        },100);
        this.quotes = quotes;
      }
    }

  }
  LiChessTools.Tools.DailyQuote = DailyQuoteTool;
})();

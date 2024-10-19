(() => {
  class DailyQuoteTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'dailyQuote',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.dailyQuote': 'Daily quote',
        'dailyQuoteTitle': 'LiChess Tools - daily quote',
        'quoteCloseButtonTitle': 'Hide today\'s quote'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.dailyQuote': 'Citatul zilei',
        'dailyQuoteTitle': 'LiChess Tools - citatul zilei',
        'quoteCloseButtonTitle': 'Ascunde citatul de azi'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      const value = parent.currentOptions.getValue('dailyQuote');
      this.logOption('Daily quote', value);
      if (!$('main').is('.lobby')) return;
      $('.lichessTools-dailyQuote').remove();
      if (!value) return;
      const now = new Date();
      const closedDate = parent.storage.get('LiChessTools.closedQuote');
      if (now.toDateString() == closedDate) {
        return; 
      }
      let quotes = (await parent.comm.getData('quotes.json'))?.quotes;
      if (quotes?.length) {
        const header = $('header#top');
        const elem = $('<div class="lichessTools-dailyQuote"><span class="quote"></span><span class="author"></span><button type="button" class="close"></button></div>')
          .attr('title',trans.noarg('dailyQuoteTitle'))
          .insertAfter(header);
        const index = Math.floor(now.getTime()/86400000) % quotes.length;
        const quote = quotes[index];
        $('.quote',elem).text(quote.text);
        $('.author',elem).text(quote.name);
        $('.close',elem)
          .attr('title',trans.noarg('quoteCloseButtonTitle'))
          .on('click',(ev)=>{
            ev.preventDefault();
            parent.storage.set('LiChessTools.closedQuote',now.toDateString());
            elem.remove();
          })
      }
    }

  }
  LiChessTools.Tools.DailyQuote = DailyQuoteTool;
})();

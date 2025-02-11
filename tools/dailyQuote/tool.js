(() => {
  class DailyQuoteTool extends LiChessTools.Tools.ToolBase {

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
        'dailyQuote.side': 'On the side'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.dailyQuote': 'Citatul zilei',
        'dailyQuoteTitle': 'LiChess Tools - citatul zilei',
        'quoteCloseButtonTitle': 'Ascunde citatul de azi',
        'dailyQuote.top': 'Deasupra',
        'dailyQuote.side': 'Pe lateral'
      }
    }

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
      let quotes = (await lt.comm.getData('quotes.json'))?.quotes;
      if (quotes?.length) {
        lt.global.setTimeout(async ()=>{
          quotes.sort((a,b)=>lt.crc24(a.text)-lt.crc24(b.text));
          const index =  Math.round(today.getTime()/86400000) % quotes.length;
          const quote = quotes[index];
          $('.quote',elem).text(quote.text);
          $('.author',elem).text(quote.name);
          $('.close',elem)
            .attr('title',trans.noarg('quoteCloseButtonTitle'))
            .on('click',(ev)=>{
              ev.preventDefault();
              lt.storage.set('LiChessTools.closedQuote',today.toDateString());
              elem.remove();
            })
        },100);
      }
    }

  }
  LiChessTools.Tools.DailyQuote = DailyQuoteTool;
})();

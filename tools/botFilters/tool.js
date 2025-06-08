(() => {
  class BotFiltersTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'botFilters',
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
        'options.botFilters': 'Bot list filters', 
        'ratingLabelText': 'Rating min/max', 
        'ratingLabelTitle': 'LiChess Tools - min/max rating', 
        'unratedLabelText': 'Show unrated:', 
        'gamesLabelText': 'Games min/max', 
        'gamesLabelTitle': 'LiChess Tools - min/max games', 
        'gameTypesLabelText': 'Game types', 
        'gameTypesLabelTitle': 'LiChess Tools - game types'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.botFilters': 'Filtre \u00een lista de bo\u0163i', 
        'ratingLabelText': 'Rating min/max', 
        'ratingLabelTitle': 'LiChess Tools - rating min/max', 
        'unratedLabelText': 'Arat\u0103 necotate:', 
        'gamesLabelText': 'Meciuri min/max', 
        'gamesLabelTitle': 'LiChess Tools - meciuri min/max', 
        'gameTypesLabelText': 'Tipuri de joc', 
        'gameTypesLabelTitle': 'LiChess Tools - tipuri de joc'
      }
    }

    isBotsPage = ()=>{
      const lt = this.lichessTools;
      return /^\/player\/bots/i.test(lt.global.location.pathname);
    };

    filterBots = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const showUnrated = $('#chk_unrated').prop('checked');
      const minRating = $('#chk_min_rating').val() || 0;
      const maxRating = $('#chk_max_rating').val() || 3000;
      const minGames = $('#chk_min_games').val() || 0;
      const maxGames = $('#chk_max_games').val() || 10000000000;
      const icons = $('.types input[data-icon]:checked').get().map(e=>$(e).attr('data-icon'));
      $('.bots__list__entry')
        .each((i,e)=>{
          const found = $('.bots__list__entry__rating',e).find('span')
            .filter((i2,e2)=>{
              const games = +($(e2).attr('title').replace(/[^\d]/g,''));
              const icon = $(e2).attr('data-icon');
              const rating = +($(e2).text().replace(/[^\d]/g,''));
              return icons.indexOf(icon)>=0 && (rating 
                                                  ? rating>=minRating && rating<=maxRating && games>=minGames && games<=maxGames
                                                  : showUnrated);
            });
          $(e).toggleClass('filteredOut',!found.length);
        });
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('botFilters');
      this.logOption('Bot filters', value);
      if (!this.isBotsPage()) return;
      $('.lichessTools-botFilters').remove();
      if (!value) return;
      const container = $(`<div class="lichessTools-botFilters">
           <fieldset class="rating">
             <legend></legend>
             <input type="number" id="chk_min_rating" /> - <input type="number" id="chk_max_rating" />
             <label for="chk_unrated"></label>
             <input type="checkbox" id="chk_unrated" checked/>
           </fieldset>
           <fieldset class="games">
             <legend></legend>
             <input type="number" id="chk_min_games"> - <input type="number" id="chk_max_games">
           </fieldset>
           <fieldset class="types">
             <legend></legend>
           </fieldset>
         </div>`)
        .prependTo('.bots.page-menu__content');
      $('label[for="chk_unrated"]',container)
        .text(trans.noarg('unratedLabelText'))
        .attr('title',trans.noarg('unratedLabelTitle'));
      $('.rating legend',container)
        .text(trans.noarg('ratingLabelText'))
        .attr('title',trans.noarg('ratingLabelTitle'));
      $('.games legend',container)
        .text(trans.noarg('gamesLabelText'))
        .attr('title',trans.noarg('gamesLabelTitle'));
      $('.types legend',container)
        .text(trans.noarg('gameTypesLabelText'))
        .attr('title',trans.noarg('gameTypesLabelTitle'));
      const order = [
        lt.icon.UltraBullet,
        lt.icon.Bullet,
        lt.icon.FlameBlitz,
        lt.icon.Rabbit,
        lt.icon.Turtle,
        lt.icon.PaperAirplane,
        lt.icon.Crazyhouse,
        lt.icon.DieSix,
        lt.icon.FlagKingHill,
        lt.icon.ThreeCheckStack,
        lt.icon.Antichess,
        lt.icon.Atom,
        lt.icon.KeyPad,
        lt.icon.FlagRacingKings
      ];
      const icons = [...new Set($('.bots__list__entry__rating')
        .find('span').get().map(e=>$(e).attr('data-icon')))];
      const findex = (x)=>{ const i=order.indexOf(x); return i<0?1000:i; };
      icons.sort((a,b)=>findex(a)-findex(b));
      const div = container.find('.types');
      for (const icon of icons) {
        div.append($('<input type="checkbox" checked>')
          .attr('data-icon',icon)
        );
      };
      $('input',container)
        .on('input change',this.filterBots);
      this.filterBots();
    }

  }
  LiChessTools.Tools.BotFilters = BotFiltersTool;
})();

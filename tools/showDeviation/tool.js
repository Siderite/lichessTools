(() => {
  class ShowDeviationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'showDeviation',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showDeviation': 'Show player score deviation',
        'predictedRatingChangeText': 'Predicted rating changes: %s'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showDeviation': 'Arat\u0103 devierea de scor la juc\u0103tori',
        'predictedRatingChangeText': 'Simulare schimbare rating: %s'
      }
    }

    getPerfKey = (ch)=>{
      const lt = this.lichessTools;
      switch(ch) {
        case lt.icon.UltraBullet: return 'ultraBullet';
        case lt.icon.Bullet: return 'bullet';
        case lt.icon.FlameBlitz: return 'blitz';
        case lt.icon.Rabbit: return 'rapid';
        case lt.icon.Turtle: return 'classical';
        case lt.icon.PaperAirplane: return 'correspondence';
        case lt.icon.DieSix: return 'chess960';
        default: return null;
      }
    };

    addDeviation = async (el)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const firstChild = $(el).children().first();
      if (!firstChild.is('.upt__info')) return;
      const url = $('.upt__info__top .user-link',el).attr('href');
      const m = /^\/@\/(?<userId>[^\/]+)/.exec(url||'');
      if (!m) return;
      const yourId = lt.getUserId();
      const userId = m.groups.userId.toLowerCase();
      const userIds = [userId, yourId].filter(v=>!!v);
      const data = await lt.api.user.getUsers(userIds);
      const user = data[0];
      if (!user) return;
      const you = data[1];
      const ratings = $('.upt__info__ratings>span',el);
      if (!ratings.length) return;
      ratings.each((i,e)=>{
        if (!/\d+/.test($(e).text())) return;
        const key = this.getPerfKey($(e).attr('data-icon'));
        if (!key) return;
        const perf = user.perfs[key];
        if (!perf) return;
        $('.lichessTools-showDeviation',e).remove();
        const deviation = $('<span class="lichessTools-showDeviation">')
          .text('\u00B1'+perf.rd)
          .appendTo(e);
        if (perf.prog) {
          deviation.addClass(perf.prog>0?'good':'bad');
        }
        if (you && !e.__initialTitle) {
          const yourPerf = you.perfs[key];
          if (yourPerf && !yourPerf.prov) {
            e.initialTitle = $(e).attr('title');
            const predicted = this.getGlickoOutcomes(yourPerf,perf);
            const newTitle = e.initialTitle + ' (' + trans.pluralSame('predictedRatingChangeText',predicted) + ')';
            $(e).attr('title',newTitle);
          }
        }
      });
    };

    getGlickoOutcomes = (player1,player2) => {
      const Glicko2 = {
        SCALE_FACTOR: 173.7178,
        BASE_RATING: 1500
      };

      const g = (phi) => {
        return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
      };

      const expectedScore = (rating1, rd1, rating2, rd2) => {
        const mu1 = (rating1 - Glicko2.BASE_RATING) / Glicko2.SCALE_FACTOR;
        const mu2 = (rating2 - Glicko2.BASE_RATING) / Glicko2.SCALE_FACTOR;
        const phi1 = rd1 / Glicko2.SCALE_FACTOR;
        const phi2 = rd2 / Glicko2.SCALE_FACTOR;
        const phiCombined = Math.sqrt(phi1 * phi1 + phi2 * phi2);
        const gValue = g(phiCombined);
        return 1 / (1 + Math.pow(10, (-gValue * (mu1 - mu2)) / 400));
      };

      const computeV = (expectedScore, phi1, phi2) => {
        const phiCombined = Math.sqrt(phi1 * phi1 + phi2 * phi2);
        const gValue = g(phiCombined);
        return 1 / (gValue * gValue * expectedScore * (1 - expectedScore));
      };

      const updatePlayerRating = (rating, rd, expectedScore, actualScore, v) => {
        const mu = (rating - Glicko2.BASE_RATING) / Glicko2.SCALE_FACTOR;
        const phi = rd / Glicko2.SCALE_FACTOR;
        const phiCombined = Math.sqrt(phi * phi);
        const gValue = g(phiCombined);

        const newMu = mu + (phi * phi * gValue * (actualScore - expectedScore)) / Math.sqrt(v);

        const newRating = Glicko2.SCALE_FACTOR * newMu + Glicko2.BASE_RATING;
        return newRating;
      };

      const calculateGlicko2RatingChange = (player1, player2, result) => {
        const expected = expectedScore(player1.rating, player1.rd, player2.rating, player2.rd);
        const v = computeV(expected, player1.rd / Glicko2.SCALE_FACTOR, player2.rd / Glicko2.SCALE_FACTOR);

        const newRating1 = updatePlayerRating(
          player1.rating,
          player1.rd,
          expected,
          result,
          v
        );

        const newRating2 = updatePlayerRating(
          player2.rating,
          player2.rd,
          1 - expected,
          1 - result,
          v
        );

        return {
          player1: {
            newRating: newRating1,
            ratingChange: newRating1 - player1.rating
          },
          player2: {
            newRating: newRating2,
            ratingChange: newRating2 - player2.rating
          }
        };
      };

      const arr = [1, 0.5, 0].map(result => Math.round(calculateGlicko2RatingChange(player1, player2, result).player1.ratingChange));
      return arr.join(' ');
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('showDeviation');
      this.logOption('Show deviation', value);
      lt.pubsub.off('content-loaded',this.addDeviation);
      if (!value) return;
      lt.pubsub.on('content-loaded',this.addDeviation);
    }
  }
  LiChessTools.Tools.ShowDeviation = ShowDeviationTool;
})();

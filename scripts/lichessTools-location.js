(() => {
  class Location {

    constructor(lichessTools) {
      const lt = lichessTools;
      this.lichessTools = lt;
      this.loc = lt.global.location;
    }

    // properties

    get href() {
      return this.loc.href;
    }

    get origin() {
      return this.loc.origin;
    }

    get hash() {
      return this.loc.hash;
    }

    get hostname() {
      return this.loc.hostname;
    }

    // page detection

    isDevPage() {
      return !!/\.dev\b/.test(this.loc.origin);
    }

    isTvPage() {
      const lt = this.lichessTools;
      const isAnalysis = !!lt.lichess?.analysis;
      return !isAnalysis && /\/tv\b/i.test(this.loc.pathname);
    }

    isFriendsPage() {
      return /\/following\b/i.test(this.loc.pathname) && this.hash != '#followers';
    };

    isFavoriteOpponentsPage() {
      return /\/player\/opponents\b/i.test(this.loc.pathname);
    };

    isFollowersPage() {
      return /\/following\b/i.test(this.loc.pathname) && this.hash == '#followers';
    };

    isBlockedPlayersPage() {
      return /\/rel\/blocks\b/.test(this.loc.pathname);
    };

    isForumPage() {
      const lt = this.lichessTools;
      return /^\/forum\/?$/i.test(this.loc.pathname);
    };

    isTeamPageOf(teamId) {
      if (!teamId) throw new Error('teamId not specified');
      const lt = this.lichessTools;
      return new lt.global.RegExp('^/team/' + lt.escapeRegex(teamId)+'\\b', 'i').test(this.loc.pathname);
    };

    isTeamPage(teamId) {
      const lt = this.lichessTools;
      return /^\/team\b/i.test(this.loc.pathname);
    };

    isTeamEdit() {
      const lt = this.lichessTools;
      return /^\/team\/[^\/]+\/edit\b/i.test(this.loc.pathname);
    };

    isTeamPageFormOf(teamId) {
      if (!teamId) throw new Error('teamId not specified');
      const lt = this.lichessTools;
      return new lt.global.RegExp('^/' + lt.escapeRegex(teamId)+'/form\\b', 'i').test(this.loc.pathname);
    };

    isAllTeamsListPage = () => {
      return /^\/team\/all\b/i.test(this.loc.pathname);
    };

    isMyTeamsListPage = () => {
      return /^\/team\/(me|leader)\b/i.test(this.loc.pathname);
    };

    isInboxPage() {
      const lt = this.lichessTools;
      return /^\/inbox\b/i.test(this.loc.pathname);
    };

    isProfileEdit() {
      const lt = this.lichessTools;
      return /^\/account\/profile\b/i.test(this.loc.pathname);
    };

    isProfilePageOf(userId) {
      if (!userId) throw new Error('userId not specified');
      const lt = this.lichessTools;
      return new lt.global.RegExp('^/@/' + lt.escapeRegex(userId)+'\\b', 'i').test(this.loc.pathname);
    };

    isBlogViewPage() {
      return /^\/blog(?!\/search\b)(?:\/|$)?/i.test(this.loc.pathname);
    }

    isBlogEdit() {
      return /^\/ublog\/[^\/]\/edit/i.test(this.loc.pathname);
    }

    isBotsPage() {
      return /^\/player\/bots/i.test(this.loc.pathname);
    };

    isImportedGamesOf(userId) {
      if (!userId) throw new Error('userId not specified');
      const lt = this.lichessTools;
      return new lt.global.RegExp('^/@/' + lt.escapeRegex(userId)+'/imported\\b', 'i').test(this.loc.pathname);
    };

    isBookmarksOf(userId) {
      if (!userId) throw new Error('userId not specified');
      const lt = this.lichessTools;
      return new lt.global.RegExp('^/@/' + lt.escapeRegex(userId)+'/bookmark\\b', 'i').test(this.loc.pathname);
    };

    isGamesPage() {
      return /^\/games\b/i.test(this.loc.pathname);
    };

    isGamesSearch() {
      return /^\/games\/search\b/i.test(this.loc.pathname);
    };

    isCurrentGamesPage() {
      return /^\/games\/?$/i.test(this.loc.pathname);
    };

    isLichessLaddersSummary() {
      return /^\/page\/lichessLadders\b/i.test(this.loc.pathname);
    };

    isPuzzlePage() {
      return /^\/(training|streak|storm|racer)\b/i.test(this.loc.pathname)
          && !/^\/training\/(?:dashboard|themes)\b/.test(this.loc.pathname);
    };

    isPuzzleTrainingPage() {
      return /^\/training\b/i.test(this.loc.pathname)
          && !/^\/training\/(?:dashboard|themes)\b/.test(this.loc.pathname);
    };

    isPuzzleDashboardPage() {
      return /^\/training\/dashboard\/\d+\/dashboard\b/i.test(this.loc.pathname);
    };

    isLearningPage() {
      return /^\/(practice|learn)\b/i.test(this.loc.pathname);
    };

    isAnalysisBoard() {
      return /^\/analysis\/?$/i.test(this.loc.pathname);
    };

    isStudyList() {
      const lt = this.lichessTools;
      const $ = lt.$;
      return /^\/study/i.test(this.loc.pathname) && $('.studies').length;
    };

    isTimelinePage() {
      return /^\/timeline\b/i.test(this.loc.pathname);
    };

    isBestTvPage = () => {
      const lt = this.lichessTools;
      return /^\/games(\/best)?\/?$/i.test(this.loc.pathname) && !this.loc.hash;
    };

    // get location information

    getTvChannel() {
      const m = /\/tv(\/(?<channel>[^\/]+))/i.exec(this.loc.pathname);
      return m?.groups?.channel;
    }

    getUrlUser() {
      const m = /\/@\/(?<user>[^\/]+)/i.exec(this.loc.pathname);
      return m?.groups?.user?.toLowerCase();
    }

    getBlogId() {
      const m = /^\/ublog\/(?<blogId>[^\/]+)/i.exec(this.loc.pathname);
      return m?.groups?.blogId;
    }

    getBlogPostInfo() {
      const m = /^\/@\/(?<userId>[^\/]+)\/blog\/(?<slug>[^\/]+)\/(?<postId>[^\/]+)/i.exec(this.loc.pathname);
      if (m) {
        const { userId, slug, postId } = m?.groups;
        return { userId, slug, postId };
      }
      return null;
    }

    getGamesSearchInfo() {
      if (!this.isGamesSearch()) return null;
      const m = /players.a=(?<userIdA>[^\/\?&#]*)(.*?&players.b=(?<userIdB>[^\/\?&#]*))?/i.exec(this.loc.search);
      if (m) {
        const { userIdA, userIdB } = m?.groups;
        return {
          userIdA: userIdA?.toLowerCase(),
          userIdB: userIdB?.toLowerCase()
        };
      }
      return null;
    }

    getUrlGameId() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const m = /^\/(?<possibleGameId>\w{8})\b/.exec(this.loc.pathname);
      const gameId = m?.groups?.possibleGameId;
      if (gameId && $('a.bookmark[href^="/bookmark/'+gameId+'"]').length) return gameId;
      return null;
    }

    getPuzzleDashboardDays() {
      const m = /^\/training\/dashboard\/(?<days>\d+)\/dashboard\b/i.exec(this.loc.pathname);
      return +m?.groups?.days || 0;
    };

    getStudyListMode() {
      const m = /\/(?<mode>hot|newest|oldest|updated|popular|alphabetical|mine)\b/i.exec(this.loc.pathname);
      const mode = m?.groups?.mode || 'hot';
    }

    getTeamInfo() {
      if (!this.isTeamPage()) return null;
      const m = /^\/team\/(?<teamId>[^\/]+)/i.exec(this.loc.pathname);
      if (m) {
        const { teamId } = m?.groups;
        return { teamId };
      }
      return null;
    }

    // actions

    set(value) {
      if (!value) return;
      this.loc.href = value;
    }

    reload() {
      this.loc.reload();
    }
  }

  LiChessTools.Location = Location;
})();
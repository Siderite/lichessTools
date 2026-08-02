(() => {
  class Api {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      for (const key in this) {
        if (['lichessTools'].includes(key)) continue;
        this[key].lichessTools = lichessTools;
      }
    }

      init() {
        const lt = this.lichessTools;
        lt.cache.memoizeAsyncFunction(lt.api.game, 'getUserPgns', { persist: 'session', interval: 10 * 1000, minTime: 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.game, 'getUserGamesJson', { persist: 'session', interval: 10 * 1000, minTime: 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.team, 'getUserTeams', { persist: 'session', interval: 10 * 86400 * 1000, minTime: 1 });
        lt.cache.memoizeAsyncFunction(lt.api.team, 'getTeamPlayers', { persist: 'session', interval: 10 * 86400 * 1000, minTime: 1 });
        lt.cache.memoizeAsyncFunction(lt.api.evaluation, 'getChessDb', { persist: 'session', interval: 1 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.evaluation, 'getLichess', { persist: 'session', interval: 1 * 86400 * 1000, minTime: 1 });
        lt.cache.memoizeAsyncFunction(lt.api.timeline, 'get', { persist: 'session', interval: 60 * 1000, keyPrefix: 'timeline_', minTime: 1 });
        lt.cache.memoizeAsyncFunction(lt.api.user, 'getUsers', { persist: 'session', interval: 10 * 1000, minTime: 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.user, 'getUserStatus', { persist: 'session', interval: 5 * 1000, minTime: 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.study, 'getChapterPgn', { persist: 'session', interval: 1000, minTime: 1000 });
        lt.api.puzzle.getPuzzlesOfPlayerPageMemoized = async (...args)=>{
          const result = await lt.api.puzzle.getPuzzlesOfPlayerPage(...args);
          await lt.timeout(500);
          return result;
        };
        lt.cache.memoizeAsyncFunction(lt.api.puzzle, 'getPuzzlesOfPlayerPageMemoized', { persist: 'local', interval: 30 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.game,'getLichessGameData', { persist: 'local', interval: 10 * 86400 * 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.user, 'getCrosstable', { persist: 'local', interval: 10 * 86400 * 1000, minTime: 5000 });
        lt.cache.memoizeAsyncFunction(lt.api.chessagine, 'analyseFen', { persist: 'local', interval: 10 * 86400 * 1000, minTime: 1100 });

        lt.addRetries(lt.api.lichessladders, 'getLaddersId', 3);
        lt.addRetries(lt.api.lichessladders, 'getLadders', 3);
        lt.addRetries(lt.api.lichessladders, 'getSummary', 3);
        lt.addRetries(lt.api.lichessladders, 'getUserLadder', 3);

        lt.cache.memoizeAsyncFunction(lt.api.lichessladders, 'getLaddersId', { persist: 'local', interval: 10 * 86400 * 1000, minTime: 1100, resultFilter: (r)=>!!r });
        lt.cache.memoizeAsyncFunction(lt.api.lichessladders, 'getLadders', { persist: 'local', interval: 1 * 86400 * 1000, minTime: 1100, resultFilter: (r)=>!!r?.length });
        lt.cache.memoizeAsyncFunction(lt.api.lichessladders, 'getSummary', { persist: 'session', interval: 60 * 1000, minTime: 1000 });
        lt.cache.memoizeAsyncFunction(lt.api.lichessladders, 'getUserLadder', { persist: 'session', interval: 60 * 1000, minTime: 1000 });

        lt.cache.memoizeAsyncFunction(lt.api.wikiBooks, 'getWiki', { persist: 'session', interval: 3600 * 1000 });
      }

      blog = {
        async save(blogId, data) {
          const lt = this.lichessTools;
          const bodyContent = data.map(a => a.name + '=' + lt.global.encodeURIComponent(a.value)).join('&');
          await lt.net.fetch({
            url: '/ublog/{blogId}/edit',
            args: { blogId }
          },
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body: bodyContent,
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              ignoreStatuses: [ 404 ]
            });
        }
      };

      study = {
        async getChapterPgn(studyId, chapterId, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const pgn = await lt.net.fetch({
            url: '/study/{studyId}/{chapterId}.pgn'+query,
            args: { studyId, chapterId }
          },{ ignoreStatuses: [404] });
          return pgn;
        },

        async getStudyListPage(baseUrl, page) {
          const lt = this.lichessTools;
          const mm = /\/(hot|newest|updated|popular)$/.exec(lt.global.location.pathname);
          const mode = mm?.at(1) || 'hot';
          const url = new URL(baseUrl);
          url.searchParams.set('page',page);
          const json = await lt.net.json(url.toString());
          return json;
        },

        async updateChapterPgn(studyId, chapterId, pgn) {
          const lt = this.lichessTools;
          await lt.net.postForm({
              url: '/api/study/{studyId}/{chapterId}/moves',
              args: { studyId, chapterId }
            },
            { pgn: pgn },
            {
              mode: 'cors',
              credentials: 'include'
            });
        },

        async updatePgnTags(studyId, chapterId, pgn) {
          const lt = this.lichessTools;
          await lt.net.postForm({
              url: '/api/study/{studyId}/{chapterId}/tags',
              args: { studyId, chapterId }
            },
            { pgn: pgn },
            {
              mode: 'cors',
              credentials: 'include'
            });
        },

        async setTopics(topics) {
          const lt = this.lichessTools;
          const json = lt.global.JSON.stringify(topics.map(t=>({ value: t })));
          const bodyContent = 'topics=' + lt.global.encodeURIComponent(json);
          await lt.net.fetch('/study/topic',
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              body: bodyContent,
              method: 'POST',
              mode: 'cors',
              credentials: 'include'
            });
        },

        async getTopicStudies(topic, startPage = 1, count = 1000) {
          const lt = this.lichessTools;
          let result = [];
          const userId = lt.getUserId();
          if (!userId) return result;
          let page = await lt.net.json({ url: '/study/topic/{topic}/mine?page={page}', args: { topic: topic, page: startPage } })
          while (page) {
            result=result.concat(page.paginator.currentPageResults);
            result.nextPage = page.paginator.nextPage;
            result.nbResults = page.paginator.nbResults;
            count--;
            page = count && result.nextPage
              ? await lt.net.json({ url: '/study/topic/{topic}/mine?page={page}', args: { topic: topic, page: page.paginator.nextPage } })
              : null;
          }
          return result;
        }
      };

      puzzle = {
        async getPuzzle(puzzleId) {
          const lt = this.lichessTools;
          const data = await lt.net.json({
            url: '/api/puzzle/{id}',
            args: {
              id: puzzleId
            }
          });
          return data;
        },

        async getDashboard(days) {
          const lt = this.lichessTools;
          const data = await lt.net.json({
            url: '/api/puzzle/dashboard/{days}',
            args: {
              days: days
            }
          });
          return data;
        },

        async getPuzzlesOfPlayerPage(userId='', page=1, count=0) {
          const lt = this.lichessTools;
          const $ = lt.$;
          const html = await lt.net.fetch({
            url: '/training/of-player?name={user}&page={page}',
            args: { user: userId, page: page }
          });
          const $html = $(html);
          const puzzleElems = $html.find('.puzzle-of-player__puzzle');
          const pagePuzzles = puzzleElems.get()
                           .map(e=>{
                             const $e = $(e);
                             return {
                               fen: $e.find('.puzzle-of-player__puzzle__board').attr('data-state')?.split(',')?.[0],
                               id: $e.find('.puzzle-of-player__puzzle__id').text(),
                               rating: +$e.find('.puzzle-of-player__puzzle__rating').text()
                             };
                           });
          const result = {
            userId: userId,
            puzzles: pagePuzzles
          };
          if (!count) {
            const title = $html.find('.puzzle-of-player__results strong:first-child')
                               .text()
                               .replaceAll(/[\.,]/g,'');
            const m = /^.*?(?<count>\d+)/.exec(title);
            count = +m?.groups?.count || pagePuzzles.length;
          }
          result.next = +/page=(?<page>\d+)/.exec($html.find('.pager a').attr('href'))?.groups?.page || null;
          result.count = count;
          return result;
        },

        async getPuzzlesOfPlayer(userId) {
          const lt = this.lichessTools;
          const puzzles = []
          let result = await this.getPuzzlesOfPlayerPage(userId,1,0);
          puzzles.push(...result.puzzles);

          while (result.next) {
            result = await this.getPuzzlesOfPlayerPageMemoized(result.userId, result.next, result.count);
            puzzles.push(...result.puzzles);
          }
          return puzzles;
        }
      };

      user = {
        async getUsers(userIds) {
          const lt = this.lichessTools;
          let users = null;
          if (userIds?.length) {
            users = await lt.net.json('/api/users', {
              method: 'POST',
              body: userIds.join(',')
            });
          }
          return users || [];
        },

        async getUserStatus(userIds, options) {
          const lt = this.lichessTools;
          const query = options
            ? '&' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const arr = await lt.net.json({
            url: '/api/users/status?ids={ids}' + query,
            args: {
              ids: userIds.join(',')
            }
          });
          return arr;
        },

        async getMini(userId) {
          const lt = this.lichessTools;
          const html = await lt.net.fetch({
            url: '/@/{userId}/mini',
            args: { userId }
          });
          return html;
        },

        async getUserPerfStats(userId, timeControl) {
          const lt = this.lichessTools;
          const data = await lt.net.json({ url: '/@/{userId}/perf/{timeControl}', args: { userId, timeControl } });
          return data;
        },

        async getRatingHistory(userId) {
          const lt = this.lichessTools;
          const data = await lt.net.json({ url: '/api/user/{userId}/rating-history', args: { userId } });
          return data;
        },

        async getActivity(userId) {
          const lt = this.lichessTools;
          const data = await lt.net.json({ url: '/api/user/{userId}/activity', args: { userId } });
          return data;
        },

        async getCrosstable(userId1, userId2) {
          const lt = this.lichessTools;
          const data = await lt.net.json({ url: '/api/crosstable/{userId1}/{userId2}', args: { userId1, userId2 } });
          return data;
        },

        async getCrosstableJustCache(...args) {
          const lt = this.lichessTools;
          const cache = lt.cache;
          const key = 'getCrosstable' + JSON.stringify(args);
          const cached = cache.getCached(key);
          return cached?.value;
        },

        async getCrosstableBulk(userPairs,processCrosstable) {
          const lt = this.lichessTools;
          const result = [];
          for (const [userId1, userId2] of userPairs) {
            const data = await lt.api.user.getCrosstable(userId1,userId2);
            result.push(data);
            processCrosstable(data);
          }
          return result;
        }
      };

      game = {
        async getPgns(gameIds, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const result = await lt.net.fetch(
            '/api/games/export/_ids' + query,
            {
              method: 'POST',
              headers: {
                'Accept': options.ndjson
                            ? 'application/x-ndjson'
                            : 'application/x-chess-pgn'
              },
              body: gameIds.join(','),
              cache: 'default'
            }
          );  
          return options.ndjson
            ? lt.ndjsonParse(result)
            : result;
        },

        async getUserPgns(userId, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const pgn = await lt.net.fetch(
            {
              url: '/api/games/user/{userId}' + query,
              args: { userId }
            }
          );
          return pgn;
        },

        async getUserGamesJson(userId, options) {
          const lt = this.lichessTools;
          const query = options
            ? '?' + Object.keys(options)
              .map(k => k + '=' + lt.global.encodeURIComponent(options[k]))
              .join('&')
            : '';
          const result = await lt.net.json(
            {
              url: '/api/games/user/{userId}' + query,
              args: { userId }
            },
            {
              ndjson: true
            }
          );
          return result;
        },

        async getMini(gameId, color) {
          const lt = this.lichessTools;
          const html = await lt.net.fetch({
            url: '/{gameId}' + (color?.toLowerCase() == 'white' ? '/white' : '/black') + '/mini',
            args: { gameId }
          });
          return html;
        },

        async getMinis(gameData) {
          const lt = this.lichessTools;
          const ids = gameData.map(d=>d.id);
          let url='';
          const result = [];
          while (ids.length) {
            url+=','+ids.splice(0,1)[0];
            if (url.length>1900) {
              const html = await lt.net.fetch('/round/minis?ids='+url.slice(1));
              $('<div>').append(html).find('a')
                .each((i,e)=>result.push(e));
              url='';
              await lt.timeout(500);
            }
          }
          if (!url.endsWith('=')) {
            const html = await lt.net.fetch('/round/minis?ids='+url.slice(1));
            $('<div>').append(html).find('a')
              .each((i,e)=>result.push(e));
          }

          const flip = (el)=>{
            const elem = $(el);
            const id = elem.attr('href').slice(1);
            const state = elem.attr('data-state');
            elem
              .attr('href','/'+id+'/black')
              .attr('data-state',state.replace(',white,',',black,'));
            const [blackPlayer,board,whitePlayer] = elem.children('span').get();
            $(blackPlayer).find('.mini-game__clock--black')
              .removeClass('mini-game__clock--black')
              .addClass('mini-game__clock--white');
            $(whitePlayer).find('.mini-game__clock--white')
              .removeClass('mini-game__clock--white')
              .addClass('mini-game__clock--black');
            elem.empty().append([whitePlayer,board,blackPlayer]);
          };

          for (const elem of result) {
            const id = $(elem).attr('href').slice(1);
            const color = gameData.find(d=>d.id==id).color;
            if (color?.toLowerCase()=='black') flip(elem);
            elem.gameId = id;
          }
          return result;
        },

        async deleteImported(gameId) {
          const lt = this.lichessTools;
          await lt.net.fetch({ url: '/{id}/delete', args: { id: gameId } },{ method: 'POST' });
        },

        async toggleBookmark(gameId) {
          const lt = this.lichessTools;
          await lt.net.fetch({ url: '/bookmark/{id}', args: { id: gameId } },{ method: 'POST' });
        },

        async getLichessGameData() {
          const lt = this.lichessTools;
          const startFen = encodeURIComponent('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
          let explorerInfo = {};
          try {
            let data = await lt.net.json(`https://explorer.lichess.org/lichess?fen=${startFen}&source=analysis`,{ noUserAgent:true, credentials: 'include', noRequestedWithHeader: true });
            if (!data) throw new Error('could not get Explorer total games');
            explorerInfo.totalGames = (+data.white || 0)+(+data.draws || 0)+(+data.black || 0);
            const monthText = data.recentGames?.[0]?.month;
            if (monthText) {
              const m = /^(?<year>\d+)-(?<month>\d+)$/.exec(monthText)
              explorerInfo.dbYear = +m.groups.year;
              explorerInfo.dbMonth = +m.groups.month;
              explorerInfo.monthText = monthText;
            } else {
              const date = new Date();
              date.setMonth(date.getMonth() - 1);
              const month = date.getMonth() + 1;
              explorerInfo.dbYear = year;
              explorerInfo.dbMonth = month;
              explorerInfo.monthText = `${year}-${month.padStart(2, '0')}`;
            }
            data = await lt.net.json(`https://explorer.lichess.org/lichess?fen=${startFen}&since=${explorerInfo.monthText}&until=${explorerInfo.monthText}&source=analysis`,{ noUserAgent:true, credentials: 'include', noRequestedWithHeader: true });
            if (!data) throw new Error('could not get Explorer last month games');
            explorerInfo.monthGames = (+data.white || 0)+(+data.draws || 0)+(+data.black || 0);
          } catch(e) {
            lt.global.console.warn('Error getting Lichess game data... estimating it anyway');
            explorerInfo = {
              "totalGames": 7473850577,
              "dbYear": 2026,
              "dbMonth": 1,
              "monthText": "2026-01",
              "monthGames": 93569988
            };
          }
          return explorerInfo;
        },

        async requestAnalysis(gameId) {
          const lt = this.lichessTools;
          await lt.net.fetch({ url: '/{id}/request-analysis', args: { id: gameId } },{ method: 'POST' });
        }
      };

      team = {
        async getUserTeamsApi(userId) { // needs OAuth token for some reason
          const lt = this.lichessTools;
          const teams = await lt.net.json({
            url: '/api/team/of/{userId}',
            args: { userId }
          });
          return teams;
        },

        async getUserTeams(userId) {
          const lt = this.lichessTools;
          const html = await lt.net.fetch({
            url: '/@/{userId}',
            args: { userId }
          },{
            ignoreStatuses: [ 404 ]
          });
          if (!html) return [];
          const result = $(html)
                          .find('div.teams a[href^="/team/"]')
                          .get()
                          .map(e=>({
                            id: /\/team\/(?<team>[^\/?#\s]*)/.exec($(e).attr('href'))?.groups?.team,
                            name: $(e).text()
                          }));
          return result;
        },

        async getTeamPlayers(teamId) {
          const lt = this.lichessTools;
          const players = await lt.net.json({
            url: '/api/team/{teamId}/users',
            args: { teamId }
          }, { ndjson: true });
          return players;
        },

        async getTeam(teamId) {
          const lt = this.lichessTools;
          const data = await lt.net.json({
            url: '/api/team/{teamId}',
            args: { teamId }
          },{
            ignoreStatuses: [ 404 ]
          });
          return data;
        },

        async getLeaderTeams() {
          const lt = this.lichessTools;
          let html='';
          let page=1;
          let url = '/team/leader';
          while (url) {
            const page = await lt.net.fetch(url);
            html += page;
            url = $(page).find('a[rel="next"]').attr('href');
            if (url) await lt.timeout(1000);
          }
          const result = $(html)
                          .find('td.subject a[href^="/team/"]')
                          .get()
                          .map(e=>({
                            id: /\/team\/(?<team>[^\/?#\s]*)/.exec($(e).attr('href'))?.groups?.team,
                            name: [...e.childNodes].find(n=>n.nodeType===3)?.textContent
                          }));
          return result;
        }
      };

      streamer = {
        async getLiveStreamers() {
          const lt = this.lichessTools;
          const streamers = await lt.net.json('/api/streamer/live');
          return streamers;
        }
      };

      evaluation = {
        async getChessDb(fen) {
          const lt = this.lichessTools;
          try {
            if (this.chessDbErrors > 5) {
              lt.global.console.debug('More than 5 Chess DB errors. Waiting for a page refresh');
              return null;
            }
            const json = await lt.net.fetch({
              url: 'https://www.chessdb.cn/cdb.php?action=queryall&board={fen}&json=1',
              args: { fen }
            }, {
              ignoreStatuses: [404],
              noUserAgent: true
            });
            const data = lt.jsonParse(json);
            return data;
          } catch(e) {
            lt.global.console.warn('Error getting chessdb.cn data',e);
            this.chessDbErrors = (this.chessDbErrors || 0)+1;
            return null;
          }
        },

        async getLichess(fen, multiPv, path) {
          const lt = this.lichessTools;
          const analysis = lt.lichess.analysis;
          let data = null;
          let cachedByLichess = undefined;
          const evalCache = analysis?.evalCache;
          if (evalCache) {
            cachedByLichess = evalCache.fetchedByFen?.get(fen);
            if (cachedByLichess?.pvs?.length !== multiPv) {
              evalCache.fetchedByFen?.delete(fen);
              cachedByLichess = undefined;
            }
            if (cachedByLichess) {
              data = cachedByLichess;
            }
            if (!data && path) {
              evalCache.fetchThrottled({
                fen: fen,
                mpv: multiPv,
                path: path
              });
              for (let i=0; i<40; i++) {
                await lt.timeout(50);
                cachedByLichess = evalCache.fetchedByFen?.get(fen);
                if (cachedByLichess?.pvs && cachedByLichess?.pvs?.length !== multiPv) {
                  evalCache.fetchedByFen?.delete(fen);
                  cachedByLichess = undefined;
                }
                if (cachedByLichess) {
                  data = cachedByLichess;
                  break;
                }
                if (cachedByLichess === null) break;
              }
            }
          }
          if (!data && cachedByLichess !== null) {
            try {
              data = await lt.net.json({
                url: '/api/cloud-eval?fen={fen}&multiPv={multiPv}',
                args: { fen, multiPv }
              }, {
                ignoreStatuses: [404]
              });
            } catch(e) {
              lt.global.console.warn('Error getting cloud-eval data',e);
            }
          }
          return !data || cachedByLichess?.pvs?.length > data?.pvs?.length
            ? cachedByLichess
            : data;
        }
      };

      notification = {
        async getUnread() {
          const lt = this.lichessTools;
          const data = await lt.net.json('/notify?page=1');
          return +(data?.unread) || 0;
        }
      };

      flair = {
        async getList() {
          const lt = this.lichessTools;
          /*const text = await lt.net.fetch(lt.assetUrl('flair/list.txt'));
          return text.split(/[\r\n]+/).filter(f=>!!f);*/
          const result = await lt.comm.getData('flairs.json');
          return result.flairs;
        }
      };

      timeline = {
        async get(lastRead) {
          const lt = this.lichessTools;
          const timeline = await lt.net.json({ url: '/api/timeline?nb=100&since={lastRead}', args: { lastRead } });
          return timeline;
        }
      };

      relation = {
        async getFriends(startPage = 1, count = 1000) {
          const lt = this.lichessTools;
          let result = [];
          const userId = lt.getUserId();
          if (!userId) return result;
          let page = await lt.net.json({ url: '/@/{userId}/following?page={page}', args: { userId: userId, page: startPage } })
          while (page) {
            result=result.concat(page.paginator.currentPageResults);
            result.nextPage = page.paginator.nextPage;
            result.nbResults = page.paginator.nbResults;
            count--;
            page = count && result.nextPage
              ? await lt.net.json({ url: '/@/{userId}/following?page={page}', args: { userId: userId, page: page.paginator.nextPage } })
              : null;
          }
          return result;
        },

        async getFollowers(startPage = 1, count = 1000) {
          const lt = this.lichessTools;
          let result = [];
          const userId = lt.getUserId();
          if (!userId) return result;
          let page = await lt.net.json({ url: '/@/{userId}/followers?page={page}', args: { userId: userId, page: startPage } })
          while (page) {
            result=result.concat(page.paginator.currentPageResults);
            result.nextPage = page.paginator.nextPage;
            result.nbResults = page.paginator.nbResults;
            count--;
            page = count && result.nextPage
              ? await lt.net.json({ url: '/@/{userId}/followers?page={page}', args: { userId: userId, page: page.paginator.nextPage } })
              : null;
          }
          return result;
        },

        async refreshFollowers() {
          const lt = this.lichessTools;
          let result = [];
          const userId = lt.getUserId();
          if (!userId) return result;
          let saveData = false;
          let entries = lt.storage.get('LiChessTools.followersData') || [];
          if (!Array.isArray(entries)) {
            entries = entries.lastActivity !== undefined
                        ? [ [userId, entries] ]
                        : [];
            saveData = true;
          }
          const map = new Map(entries);
          let data = map.get(userId);
          if (!data) {
            data = { lastActivity: 0, follows:[] };
            map.set(userId, data);
          }
          const now = Date.now();
          if (now-data.lastActivity > 86400000) {
            saveData = true;
            data.lastActivity = now;
            const activity = await lt.api.user.getActivity(userId);
            for (let i=activity.length-1; i>=0; i--) {
              const ac = activity[i];
              if (!ac?.follows?.in?.ids?.length) continue;
              const item = { interval: ac.interval, ids: ac?.follows?.in?.ids };
              const index = data.follows.findIndex(it=>it.interval.start==item.interval.start);
              if (index>=0) {
                data.follows[index]=item;
                continue;
              }
              data.follows.unshift(item);
            }
          }
          if (saveData) {
            lt.storage.set('LiChessTools.followersData',[...map.entries()]);
          }
          return data;
        },

        async getFollowersNew(startPage = 1, count = 1000) {
          const lt = this.lichessTools;
          const now = Date.now();
          const data = await this.refreshFollowers();
          const allIds = data.follows.flatMap(f=>f.ids.map(id=>({ time: f.interval.start, id: id })));
          const ids = allIds.slice((startPage-1)*30,(startPage-1+count)*30);
          const users = await lt.api.user.getUsers(ids.map(i=>i.id));
          const result = users.map(u=>({ user: { id:u.id, name: (u.title?u.title+' ':'')+u.username }, time: ids.find(i=>i.id==u.id).time }));
          //const result = ids.map(u=>({ user: { id:u.id, name: u.id }, time: u.time }));
          result.nbResults = allIds.length;
          result.nextPage = (startPage-1+count)*30 >= allIds.length ? undefined : startPage+count;
          return result;
        },

        async blockPlayer(userId) {
          const lt = this.lichessTools;
          await lt.net.fetch({ url: '/api/rel/block/{userId}', args: { userId: userId } },{ method: 'POST' });
        },

        async unblockPlayer(userId) {
          const lt = this.lichessTools;
          await lt.net.fetch({ url: '/api/rel/unblock/{userId}', args: { userId: userId } },{ method: 'POST' });
        }
      };

      tournament = {
        async getInfo(tourId) {
          const lt = this.lichessTools;
          const userId = lt.getUserId();
          if (!userId) return null;
          const data = await lt.net.json({ url: '/tournament/{tourId}?page=1&partial=true&me={userId}', args: { tourId: tourId, userId:userId } });
          return data;
        }
      };

      chessagine = {
        async analyseFen(fen,engine,rating) {
          const lt = this.lichessTools;
          const data = await lichessTools.comm.getDataUrl('https://www.chessagine.com/api/nn',{
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                endpoint: "analyze",
                fen: fen,
                engine: engine,
                rating: rating,
                rawWDL: true
              })
            });
          if (!data.dataUrl) {
            throw new Error('Could not get the data URL for '+fen+' '+engine+' rating:'+rating);
          }
          return lt.net.json(data.dataUrl);
        }
      };

      lichessladders = {
        async getLaddersId(userId) {
          if (!userId) throw new Error('userId cannot be empty');
          const lt = this.lichessTools;
          const result = await lt.comm.fetchText('https://api.lichessladders.com/users/search?lichessId='+lt.global.encodeURIComponent(userId));
          if (!result?.text) {
            throw new Error('Could not get the Ladders data for userId '+userId+' '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return +(data?.[0]?.id) || null;
        },

        async getSummary() {
          const lt = this.lichessTools;
          const userId = lt.getUserId();
          if (!userId) throw new Error('getSummary requires being logged in');
          const laddersId = await this.getLaddersId(userId);
          if (!laddersId) return null;

          const result = await lt.comm.fetchText('https://api.lichessladders.com/users/'+lt.global.encodeURIComponent(laddersId)+'/notifications/summary');
          if (!result?.text) {
            throw new Error('Could not get the summary data Ladders id '+laddersId+' '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getUserChallenges(laddersId) {
          const lt = this.lichessTools;
          if (!laddersId) throw new Error('laddersId cannot be empty');

          const result = await lt.comm.fetchText('https://api.lichessladders.com/users/'+lt.global.encodeURIComponent(laddersId)+'/challenges');
          if (!result?.text) {
            throw new Error('Could not get user challenges for Ladders id '+laddersId+' '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getLadders() {
          const lt = this.lichessTools;

          const result = await lt.comm.fetchText('https://api.lichessladders.com/ladders');
          if (!result?.text) {
            throw new Error('Could not get the ladders data '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getUserLadders(laddersId) {
          const lt = this.lichessTools;
          if (!laddersId) throw new Error('laddersId cannot be empty');

          const result = await lt.comm.fetchText('https://api.lichessladders.com/users/'+laddersId+'/ladders');
          if (!result?.text) {
            throw new Error('Could not get the ladders data for Ladders id '+laddersId+' '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getUpcomingChallenges() {
          const lt = this.lichessTools;

          const result = await lt.comm.fetchText('https://api.lichessladders.com/challenges/upcoming');
          if (!result?.text) {
            throw new Error('Could not get the upcoming challenges data '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getLiveChallenges() {
          const lt = this.lichessTools;

          const result = await lt.comm.fetchText('https://api.lichessladders.com/challenges/live');
          if (!result?.text) {
            throw new Error('Could not get the live challenges data '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        },

        async getUserLadder(laddersId,ladderId) {
          const lt = this.lichessTools;
          if (!laddersId) throw new Error('laddersId cannot be empty');
          if (!ladderId) throw new Error('ladderId cannot be empty');

          const result = await lt.comm.fetchText('https://api.lichessladders.com/ladders/'+ladderId+'/users/'+laddersId);
          if (!result?.text) {
            throw new Error('Could not get the ladders data for Ladders id '+laddersId+' and ladder id '+ladderId+' '+(result?.err||''));
          }
          const data = lt.global.JSON.parse(result.text);
          return data;
        }
      };

      wikiBooks = {
        baseUrl: 'https://en.wikibooks.org',
        async getWiki(title) {
          const lt = this.lichessTools;
          const apiArgs = 'redirects&origin=*&action=query&prop=extracts&formatversion=2&format=json&exchars=1200';
          const json = await lt.net.fetch(`${this.baseUrl}/w/api.php?titles=${title}&${apiArgs}`,{ noUserAgent: true });
          const result = lt.global.JSON.parse(json);
          return result || null;
        },
      };

  }

  LiChessTools.Api = Api;
})();
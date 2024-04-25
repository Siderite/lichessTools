(()=>{
  class ShowOpeningTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'showOpening',
        category: 'general',
        type:'multiple',
        possibleValues: ['showInBoard','showInMinigames','showInExplorer'],
        defaultValue: 'showInBoard,showInMinigames,showInExplorer'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showOpening': 'Show game opening names',
        'openingNameTitle': 'LiChess Tools - opening name',
        'showOpening.showInBoard':'For large board',
        'showOpening.showInMinigames':'For minigames',
        'showOpening.showInExplorer':'In Explorer'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.showOpening': 'Arat\u0103 numele deschiderii \u00een partide',
        'openingNameTitle': 'LiChess Tools - numele deschiderii',
        'showOpening.showInBoard':'Pentru tabla mare',
        'showOpening.showInMinigames':'Pentru table mici',
        'showOpening.showInExplorer':'\u00e2n Explorator'
      }
    }

    miniGameOpening=async (el)=>{
      if (!this.options.showInMinigames) return;
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      let fen='';
      let gameId='';
      if (el?.id && el?.fen) {
        fen=el.fen;
        gameId=el.id;
        el=$('.mini-game-'+el.id);
        if (!el.length) return;
      };
      if (!el) el=$.cached('body');
      const elems=$(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      for (const el of elems) {
        fen=fen || $(el).attr('data-state');
        if (!gameId) {
          gameId=$(el).attr('href');
          if (!gameId) {
            fen='';
            gameId='';
            continue;
          }
          const m=/\/([^\/]+)/.exec(gameId);
          gameId=m&&m[1];
          if (!gameId) {
            fen='';
            gameId='';
            continue;
          }
        }
        const result = await this.withOpening(gameId,el,undefined,fen, true);
        if (!result) {
          fen='';
          gameId='';
          continue;
        }
        const opening=result.opening;
        const container=result.el;
        let openingEl=$('.lichessTools-opening',container);
        if (!openingEl.length) {
          openingEl=$('<span class="lichessTools-opening"/>')
                      .appendTo(container);
        }
        openingEl
          .text(opening)
          .attr('title',opening);
        fen='';
        gameId='';
      }
    };
    miniGameOpeningDebounced=this.lichessTools.debounce(this.miniGameOpening,500);

    openingTime=0;
    withOpening=async (gameId,el,ply,fen,isMini)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      if (parent.opening_dict) {
        if (!fen) fen=parent.getPositionFromBoard(el,true);
        const pos=fen?.split(' ')?.slice(0,2)?.join('')?.replaceAll('/','');
        if (pos) {
          let opening=parent.opening_dict.get(pos);
          if (!opening) {
            const reversed=parent.reverseFen(fen).split(' ')?.slice(0,2)?.join('')?.replaceAll('/','');
            const op=parent.opening_dict.get(reversed);
            if (op && op!='*') opening=op+' (R)';
          }
          if (opening) {
            el.openingData={time:Date.now(), opening, el};
            return el.openingData;
          }
        }
      }

      if (!gameId || gameId=='synthetic'|| gameId=='broadcast') return;

      const data=el?.openingData;
      if (data) {
        const now=Date.now();
        if (el.maxPly>14 || now-data.time<2000) return {time:now, opening:data.opening, el};
        if (isMini) return; // don't get the opening for minigames from API once retrieved
      }

      if (Date.now()-this.openingTime<1000) return; // not more often than 1 second
      this.openingTime=Date.now();

      const url='/api/games/export/_ids?tags=true&opening=true&moves=false&clocks=false&evals=false';
      const pgn = await parent.net.fetch(url, {
        method: 'POST',
        body: gameId,
        cache: 'default'
      });
      const m=/\[Opening "([^"]+)"\]/.exec(pgn);
      const opening = m&&m[1];
      if (!opening || opening=='?') {
        return;
      }
      if (el) {
        let time=Date.now();
        const m2=/\[Termination "([^"]+)"\]/.exec(pgn);
        if (m2 && m2[1]!='Unterminated') time+=86400;
        el.openingData={ time:time, opening:opening, el };
        if (ply) {
          el.maxPly=Math.max(ply,+el.maxPly||0);
        }
        return el.openingData;
      }
    };

    showOpeningInExplorer=(opening)=>{
      if (!this.options.showInExplorer) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const elem=$('section.explorer-box div.data div.title a');
      if (!elem.length) return;
      const existing=elem.text();
      opening=opening||'';
      const reg=/[\w\(\)\.\/]+/ig;
      let m=reg.exec(opening);
      let index=0;
      const words=[];
      while (m) {
        const newIndex=existing.indexOf(m[0],index);
        if (newIndex<0) {
          words.push(m[0]);
        } else {
          index=newIndex+m[0].length;
        }
        m=reg.exec(opening);
      }
      let openingElem=elem.next('.lichessTools-opening');
      if (!words.length) {
        openingElem.remove();
        return;
      }
      if (!openingElem.length) {
        openingElem=$('<span class="lichessTools-opening">')
                      .attr('title',trans.noarg('openingNameTitle'))
                      .insertAfter(elem);
      }
      const suffix=' '+words.join(' ');
      openingElem.text(suffix);
    };

    refreshOpening=async (ply)=>{
      if (!this.options.showInBoard) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      if ($.cached('body').is('.playing')) return;
      const trans=parent.translator;
      const tvOptions=parent.getTvOptions();
      const gameId=tvOptions.gameId || lichess.analysis?.data?.game?.id;
      const fen=lichess.analysis?.node?.fen || lichess.analysis?.data?.game?.fen;
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables',10000);
      const result = await this.withOpening(gameId,$.cached('main.round, main.analyse, main#board-editor',10000)[0],ply,fen,false);
      if (!result) {
        metaSection.find('.lichessTools-opening').remove();
        this.showOpeningInExplorer(null);
        return;
      }
      metaSection.find('span.lichessTools-opening').filter((i,e)=>!lichessTools.inViewport(e)).remove();
      if (!metaSection.find('span.lichessTools-opening').length) {
        const visibleEl=metaSection.filter((i,e)=>lichessTools.inViewport(e)).eq(0);
        visibleEl
          .append($('<span/>').addClass('lichessTools-opening').attr('title',trans.noarg('openingNameTitle')));
      }
      metaSection.find('span.lichessTools-opening').text(result.opening);
      this.showOpeningInExplorer(result.opening);
      if (!ply) {
        await this.miniGameOpening();
      }
    };
    refreshOpeningDebounced=this.lichessTools.debounce(this.refreshOpening,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showOpening');
      this.logOption('Show game opening names', value);
      this.logOption(' ... cached openings', parent.opening_dict?.size);
      this.options={
        showInBoard: parent.isOptionSet(value,'showInBoard'),
        showInMinigames: parent.isOptionSet(value,'showInMinigames'),
        showInExplorer: parent.isOptionSet(value,'showInExplorer'),
      };
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      lichess.pubsub.off('socket.in.fen',this.miniGameOpening);
      lichess.pubsub.off('ply',this.refreshOpeningDebounced);
      lichess.pubsub.off('content-loaded',this.miniGameOpening);
      if (lichess.socket?.settings?.events?.endData) {
        lichess.socket.settings.events.endData=parent.unwrapFunction(lichess.socket.settings.events.endData,'showOpening');
      }
      parent.global.clearInterval(this.interval);
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables');
      metaSection.find('.lichessTools-opening').remove();
      $('a.mini-game .lichessTools-opening').remove();
      $('div.title .lichessTools-opening').remove();
      if (this.options.showInBoard) {
        if (lichess.socket?.settings?.events?.endData) {
          lichess.socket.settings.events.endData=parent.wrapFunction(lichess.socket.settings.events.endData,{
            id:'showOpening',
            after: ($this,result,...args)=>{
              this.refreshOpeningDebounced();
            }
          });
        }
        lichess.pubsub.on('ply',this.refreshOpeningDebounced);
        const intervalTime=$('main').is('#board-editor')
          ? 1000
          : 3500;
        this.interval=parent.global.setInterval(this.refreshOpeningDebounced,intervalTime);
        this.refreshOpeningDebounced();
      }
      if (this.options.showInMinigames) {
        lichess.pubsub.on('socket.in.fen',this.miniGameOpening);
        lichess.pubsub.on('content-loaded',this.miniGameOpening);
        this.miniGameOpeningDebounced();
      }
    }

  }
  LiChessTools.Tools.ShowOpening=ShowOpeningTool;
})();

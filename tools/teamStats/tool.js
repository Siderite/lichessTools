(() => {
  class TeamStatsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'teamStats',
        category: 'community',
        type: 'multiple',
        possibleValues: ['memberCount'],
        defaultValue: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.community': 'Community',
        'options.teamStats': 'Team statistics',
        'teamStats.memberCount': 'Member count',
        'teamMemberCountTitle': 'LiChess Tools - member count chart'
      },
      'ro-RO': {
        'options.community': 'Comunitate',
        'options.teamStats': 'Statistici echipe',
        'teamStats.memberCount': 'Num\u0103r membri',
        'teamMemberCountTitle': 'LiChess Tools - grafic cu num\u0103rul de membri'
      }
    }

    drawTeamChart = (teamMap, width) => {
      if (!teamMap.size) return;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.floor(width/1.75);

      // Convert dates to real Date objects and sort
      const entries = Array.from(teamMap.entries())
        .map(([dateStr, data]) => ({
          date: new Date(dateStr),
          value: data.nbMembers
        }))
        .sort((a, b) => a.date - b.date);
      const dates = entries.map(e => e.date);
      const values = entries.map(e => e.value);

      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const valRange = maxVal - minVal || 1;

      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      const timeRange = maxDate - minDate || 86400000; // at least 1 day

      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, w, h);

      const padLeft = 50;
      const padRight = 20;
      const padTop = 20;
      const padBottom = 45;
      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      // background
      ctx.fillStyle = "#f8f8f8";
      ctx.fillRect(0, 0, w, h);

      // horizontal grid lines
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padTop + (plotH * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - padRight, y);
        ctx.stroke();
      }

      // line
      ctx.strokeStyle = "#4499EE";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();

      entries.forEach((entry, i) => {
        const x = padLeft + ((entry.date - minDate) / timeRange) * plotW;
        const normalized = (entry.value - minVal) / valRange;
        const y = padTop + plotH * (1 - normalized);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // points
      ctx.fillStyle = "#0066cc";
      entries.forEach(entry => {
        const x = padLeft + ((entry.date - minDate) / timeRange) * plotW;
        const normalized = (entry.value - minVal) / valRange;
        const y = padTop + plotH * (1 - normalized);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // x-axis labels (dates)
      ctx.fillStyle = "#333";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const labelStep = Math.max(1, Math.floor(entries.length / 6));
      entries.forEach((entry, i) => {
        if (i % labelStep !== 0 && i !== entries.length - 1) return;

        const x = padLeft + ((entry.date - minDate) / timeRange) * plotW;
        const label = entry.date.toISOString().slice(5, 10); // MM-DD
        ctx.fillText(label, x, h - padBottom + 8);
      });

      // y-axis labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let i = 0; i <= 5; i++) {
        const val = Math.round(minVal + (valRange * (5 - i)) / 5);
        const y = padTop + (plotH * i) / 5;
        ctx.fillText(val.toLocaleString(), padLeft - 8, y);
      }

      // axis lines
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, padTop);
      ctx.lineTo(padLeft, h - padBottom);
      ctx.lineTo(w - padRight, h - padBottom);
      ctx.stroke();

      return canvas;
    }

    handleTeamPage = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;

      const m = /^\/team\/(?<team>[^\/\?&#]+)/.exec(lt.global.location.pathname);
      const teamName = m?.groups?.team;
      if (!teamName || teamName=='me') return;

      const userId = lt.getUserId().toLowerCase();
      const isLeader = !!$('section.team-show__meta a').filter((i,e)=>$(e).attr('href')?.toLowerCase().includes(userId)).length;
      if (!isLeader) return;

      await this.ensureLeaderTeams();
      const teamData = this.leaderTeams.get(teamName);
      if (teamData) {
        const container = $('.team-show__content__col2');
        if (container.length) {
          const canvas = this.drawTeamChart(teamData, container.width());
          if (canvas) {
            $(canvas)
              .addClass('lichessTools-memberCount')
              .attr('title',trans.noarg('teamMemberCountTitle'))
              .appendTo(container);
          }
        }
      } else {
        this.leaderTeams.set(teamName,new Map());
        this.saveLeaderTeams();
      }
    };

    updateStats = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      await this.ensureLeaderTeams();
      if (!this.leaderTeams.size) return;

      const timeKey = new Date().toISOString().slice(0, 10);
      let save = false;
      for (const team of this.leaderTeams.keys()) {
        const existingData = this.leaderTeams.get(team);
        if (existingData.get(timeKey)) continue;
        const teamData = await lt.api.team.getTeam(team);
        existingData.set(timeKey,{ nbMembers: teamData.nbMembers });
        save = true;
      }
      if (save) {
        await this.saveLeaderTeams();
      }
    };

    ensureLeaderTeams = async ()=>{
      const lt = this.lichessTools;
      if (!this.leaderTeams) {
        const dbKey = 'lichessTools/LT/teamData';
        let data = await lt.storage.get(dbKey,{ db: true });
        data = data ? lt.global.JSON.parse(data) : [];
        this.leaderTeams=new Map();
        for (const [k,v] of data) {
          this.leaderTeams.set(k,new Map(v));
        }
      }
    };

    saveLeaderTeams = async ()=>{
      const lt = this.lichessTools;
      if (!this.leaderTeams) return;
      const dbKey = 'lichessTools/LT/teamData';
      const data = [];
      for (const [k,v] of this.leaderTeams) {
        data.push([k,[...v.entries()]]);
      }
      await lt.storage.set(dbKey,data,{ db: true });
    };

    async start() {
      const lt = this.lichessTools;
      if (lt.isDev()) return;
      const value = lt.currentOptions.getValue('teamStats');
      this.logOption('Team stats', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (lt.currentOptions.enableLichessTools === false) return;
      this.options = {
        memberCount: lt.isOptionSet(value, 'memberCount')
      };
      if (this.options.memberCount) {
        await this.handleTeamPage();
        await this.updateStats();
      }
    }

  }
  LiChessTools.Tools.TeamStats = TeamStatsTool;
})();

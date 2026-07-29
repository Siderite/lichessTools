# Team Stats Tool

## Purpose

For team leaders, displays a member count chart on the team page and optionally notifies when new members join. Fetches team data per day, stores in indexedDB Map per team name.

## Functionality

- Depends on `AddNotifications`.
- **teamStats preference**: multiple type with values `memberCount` (member count chart display) and `notification` (new members notification). Default: 'memberCount'. needsLogin: true.
- Disabled on dev environment (`lt.isDev()`), disabled if enableLichessTools=false.

## Leader Teams Management

- **ensureLeaderTeams()**: If leaderTeams not exists → loads from indexedDB key `lichessTools/LT/teamData` (JSON.parse array of [k,v] pairs → Map per team with inner Map); if empty → fetches lt.api.team.getLeaderTeams(), adds each team.id to leaderTeams with empty inner Map.
- **saveLeaderTeams()**: Saves leaderTeams entries as array [k,[...v.entries()]] to indexedDB key `lichessTools/LT/teamData`.

## Chart Drawing (drawTeamChart(teamMap, width))

- If teamMap.size=0 → returns nothing. Creates canvas: width=width, height=Math.floor(width/1.75).
- Converts entries dateStr→Date objects, sorts by date ascending. dates/values arrays extracted. minVal/maxVal calculated; valRange=maxVal-minVal||1; timeRange=maxDate-minDate||86400000 (at least 1 day).
- Pads: left=50, right=20, top=20, bottom=45; plotW=w-padLeft-padRight; plotH=h-padTop-padBottom.
- Background #f8f8f8 rectangle. Horizontal grid lines #eee (5 lines at padTop+plotH*i/5). Line #4499EE lineWidth=2 round join/cap: x=padLeft+(entry.date-minDate)/timeRange*plotW; normalized=(entry.value-minVal)/valRange; y=padTop+plotH*(1-normalized); moveTo first, lineTo rest. Points #0066cc arc(x,y,3). X-axis labels MM-DD (toISOString.slice(5,10)) at labelStep=Math.max(1,floor(entries.length/6) intervals. Y-axis labels rounded values at padLeft-8. Axis lines #999. Returns canvas.

## Team Page Handling (handleTeamPage)

- Extracts teamName from pathname `/team/team` regex; if no or 'me' → skip. userId lowercase. isLeader = section.team-show__meta a href includes userId length > 0.
- ensureLeaderTeams(); teamData=leaderTeams.get(teamName). If NOT leader: if teamData exists → delete, saveLeaderTeams(); return. If leader and teamData exists: container=.team-show__content__col2; canvas=drawTeamChart(teamData,container.width); if canvas: adds lichessTools-memberCount class, title "LiChess Tools - member count chart", appends to container. If no teamData → set new Map, saveLeaderTeams().

## Stats Update (updateStats)

- ensureLeaderTeams(); if leaderTeams.size=0 → return. timeKey=new Date().toISOString().slice(0,10). For each team: existingData.get(timeKey) not exists → fetches lt.api.team.getTeam(team); if no data → delete team, save=true; else → set(timeKey,{nbMembers:teamData.nbMembers},save=true). If notification enabled: prev/curr from slice(-2) of existingData entries; if prev+curr+!curr.notifSeen and currMembers>prevMembers → fetches lt.api.team.getTeam(team), creates notification with entry id='teamStats_'+team, isNew:true, icon Group, href `/team/encodedTeam`, content strong teamData.name + span newMembersText(currMembers-prevMembers), handler sets curr.notifSeen=true savesLeaderTeams; adds via lt.notifications.add(notification). If save → saveLeaderTeams().

## Preference

- **name**: `teamStats`
- **category**: community
- **type**: multiple
- **possibleValues**: ['memberCount','notification']
- **defaultValue**: 'memberCount'
- **needsLogin**: true

## Dependencies

`AddNotifications`

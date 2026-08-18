# Study Links Tool

## Purpose

Enhances study comment links: video popup (YouTube/Twitch/Vimeo via credentialless iframe dialog), opens study links in same window (internal navigation to chapter), ensures comments tab button with count indicator in study buttons. Advanced preference.

## Functionality

- Depends on `EmitChapterChange`, `EmitCommentChange`, `EmitRedraw`, and `Dialog`.
- **studyLinks preference**: multiple type with values `video` (video popup), `studyLinksSameWindow` (open links to studies in same window), `commentTab` (ensure comment tab in studies). Default: 'video,studyLinksSameWindow,commentTab'. Advanced. Upgrades: commentTab added version 2.4.13 type new.

## Video ID Extraction

- **getYoutubeId(e)**: href via URL.parse; regex `(youtube|youtu.be)(watch|embed|shorts|live|v|e)(.*?v=|/)(id)` → {id, time=searchParams.t, end=searchParams.e}.
- **getTwitchId(e)**: href via URL.parse; regex `twitch.tv.*(video=|/videos/)(id)` → {id, time=searchParams.t}.
- **getVimeoId(e)**: href via URL.parse; regex `vimeo(/[^/]+)*/(id)[#t=(time)` → {id, time}.

## Video Handling (handleVideoLinks)

- On redraw/commentChange event: `.study__comment a`, `comment a`, `div.comment` each: if e.handleVideoLink already → skip; if getYoutubeId/getTwitchId/getVimeoId exists → on('click') handleVideoClick, on('contextmenu') ev.stopPropagation(); e.handleVideoLink=true.

## Video URL (getVideoUrl(e, forWindow))

- YouTube: forWindow→`https://www.youtube.com/video/id?state=1&autoplay=1&autohide=0&showinfo=0&rel=0&t=time&e=end`; else→`https://www.youtube.com/embed/id?state=1&autoplay=1&autohide=0&showinfo=0&rel=0&start=time&end=end`.
- Vimeo: `https://player.vimeo.com/video/id?autoplay=1#t=time`.
- Twitch: `https://player.twitch.tv/?video=id&parent=location.hostname&autoplay=true&muted=false&t=time`.

## Video Click (handleVideoClick)

- shiftKey/ctrlKey → skip. url=getVideoUrl(ev.target). If exists: prevents default; removes lichessTools-video dialog. supportsCredentialless = HTMLIFrameElement.prototype.hasOwnProperty('credentialless'). If not supported → console.warn, url=getVideoUrl(ev.target,true), lt.comm.openWindow(url); return. Dialog via lt.dialog header='', noClickAway:true, resizable:true, htmlText `<iframe width/height 100% frameborder=0 sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" src=url credentialless=""`. dialog.addClass lichessTools-video, on('close') remove. dialogPlacement from storage LichessTools.dialogPlacement → css left/right/top/bottom/width/height. dialog.show(); ensureInViewport().

## Ensure InViewport

- dialog=dialog.lichessTools-video; if lt.inViewport(dialog-header,true) < 0.5 → css left/top/right/bottom unset, dialog-content width/height unset.

## SetDialogPlacement (data)

- If no dialog.lichessTools-video → return; storage.set LichessTools.dialogPlacement data; ensureInViewport().

## Study Links Alteration (alterStudyLinksDirect)

- If options.studyLinksSameWindow not true → skip. study=analysis.study exists. `.study__comment a[target`, `comment a[target`, `div.comment a[target` each: if no _contextMenuEnabled → prop=true, on('contextmenu') ev.stopPropagation; href via URL.parse (or new URL(href, location) catch); m=/study/studyId(/chapterId)? regex in uri.pathname; if no match → skip. removeAttr target; if origin==location AND !searchParams.size AND !uri.hash AND studyId==study.data.id AND chapterId exists → on('click') ev.preventDefault, study.setChapter(chapterId).

## alterStudyLinks = debounce(alterStudyLinksDirect, 100)

## Comments Tab (ensureCommentTab)

- If options.commentTab enabled: anchorElem=button.tags:not(:has(+button.comments)) if no length → skip. commentThisPositionText from lt.global.i18n.study.commentThisPosition (warn if not exists). `<button class="lichessTools-comments comments"` role="tab", title commentThisPositionText, append `<count class="data-count`, icon BubbleSpeech, click→study.vm.toolTab('comments'), analysisRedraw(); insertAfter anchorElem; analysisRedraw(); countComments().

## countComments()

- study exists → count=analysis.node.comments.length||0; button.comments count attrSafe(data-count=count||null).

## Events

- On `lichessTools.redraw`: handleVideoLinks, alterStudyLinks
- On `lichessTools.chapterChange`: alterStudyLinks
- On `lichessTools.commentChange`: handleVideoLinks, alterStudyLinks
- On `lichessTools.setDialogPlacement`: setDialogPlacement
- Body observer on `.study__buttons`: ensureCommentTab
- lt.uiApi events on `analysis.change`: countComments

## Preference

- **name**: `studyLinks`
- **category**: study
- **type**: multiple
- **possibleValues**: ['video', 'studyLinksSameWindow', 'commentTab']
- **defaultValue**: 'video,studyLinksSameWindow,commentTab'
- **advanced**: true

## Dependencies

`EmitChapterChange`, `EmitCommentChange`, `EmitRedraw`, `Dialog`

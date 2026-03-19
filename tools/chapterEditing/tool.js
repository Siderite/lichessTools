(() => {
  class ChapterEditingTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'chapterEditing',
        category: 'study',
        type: 'multiple',
        possibleValues: ['tags', 'bulk'],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chapterEditing': 'Study chapter editing',
        'chapterEditing.tags': 'Chapter tags',
        'chapterEditing.bulk': 'Multiple chapters',
        'bulkPgnTagEditHeader': 'PGN tags editor',
        'updatePgnTagsText': 'Update PGN tags',
        'bulkPgnTagsEditText': 'Edit PGN tags',
        'bulkPgnTagsEditTitle': 'LiChess Tools - Edit PGN tags',
        'deletedNChaptersMessage': 'Deleted %s chapters',
        'errorDeletingChaptersMessage': 'Error deleting chapters!',
        'editedNChaptersMessage': 'Edited %s chapters',
        'errorEditingChaptersMessage': 'Error editing chapters!',
        'editChaptersButtonText': 'Edit',
        'editChaptersButtonTitle': 'LiChess Tools - edit selected chapters',
        'cancelEditChaptersButtonText': 'Cancel',
        'cancelEditChaptersButtonTitle': 'LiChess Tools - cancel chapter selection',
        'bulkEditUnchanged': '-- Unchanged --'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterEditing': 'Editare capitole de studiu',
        'chapterEditing.tags': 'Etichete de capitol',
        'chapterEditing.bulk': 'Mai multe capitole',
        'bulkPgnTagEditHeader': 'Editor etichete PGN',
        'updatePgnTagsText': 'Salveaz\u0103 etichete PGN',
        'bulkPgnTagsEditText': 'Modific\u0103 etichetele PGN',
        'bulkPgnTagsEditTitle': 'LiChess Tools - modific\u0103 etichete PGN',
        'deletedNChaptersMessage': 'Am \u015fters %s capitole',
        'errorDeletingChaptersMessage': 'Eroare la \u015ftergerea capitolelor!',
        'editedNChaptersMessage': 'Am modificat %s capitole',
        'errorEditingChaptersMessage': 'Eroare la modificarea capitolelor!',
        'editChaptersButtonText': 'Modific\u0103',
        'editChaptersButtonTitle': 'LiChess Tools - modific\u0103 capitolele selectate',
        'cancelEditChaptersButtonText': 'Anuleaz\u0103',
        'cancelEditChaptersButtonTitle': 'LiChess Tools - anuleaz\u0103 selec\u0163ia de capitole',
        'bulkEditUnchanged': '-- Neschimbat --'
      }
    }

    popupPgnTagsEdit = async (studyId, chapterId, tags)=>{
      const lt = this.lichessTools;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const $ = lt.$;
      const dialog = await lt.dialog({
        header: trans.noarg('bulkPgnTagEditHeader')
      });
      $(dialog).addClass('lichessTools-bulkPgnTagsEdit');
      $('.dialog-content',dialog)
        .append('<textarea autofocus>')
        .append($('<button type="button" class="button">')
                  .text(trans.noarg('updatePgnTagsText'))
                  .on('click',async ()=>{
                    const textarea = $(dialog).find('textarea');
                    textarea.removeClass('lichessTools-error');
                    $(dialog).find('.lichessTools-errorText').text('');
                    const pgn = textarea.val();

                    const useApi = false;

                    try {
                      if (!/^\s*(\[\s*[^\s]+\s+\"[^\"]*\"\s*\][\s\r\n]*)*\s*$/.test(pgn)) {
                        throw new Error('Restrict your input to PGN tags only');
                      }
                      const tagsArray = [];
                      const tagsMap = new Map();
                      const newTagsMap = new Map();
                      tags.forEach(t=>{
                        tagsMap.set(t[0],t[1]);
                        newTagsMap.set(t[0],'');
                      });
                      const study = lichess.analysis.study;
                      const types = new Map(study.tags.types.map(t=>[t.toLowerCase(),t]));
                      const regex = /\[\s*(?<tagName>[^\s]+)\s+\"(?<tagValue>[^\"]*)\"\s*\]/g;
                      pgn.matchAll(regex)
                        .forEach(t=>{
                          const name = types.get(t.groups.tagName.toLowerCase());
                          if (!name) {
                            throw new Error(`Tag name ${t.groups.tagName} is not valid`);
                          }
                          const value = t.groups.tagValue;
                          newTagsMap.set(name, value);
                        });
                      for (const entry of newTagsMap) {
                        const name = entry[0];
                        const value = entry[1];
                        const existing = tagsMap.get(name);
                        if (value !== existing) {
                          if (useApi) {
                            tagsArray.push(`[${name} "${value}"]`);
                          } else {
                            study.makeChange('setTag',
                            {
                              chapterId: chapterId,
                              name: name,
                              value: value
                            });
                            await lt.timeout(50);
                          }
                        }
                      }    
                      if (tagsArray.length) {
                        await lt.api.study.updatePgnTags(studyId, chapterId, tagsArray.join('\r\n'));
                      }
                      dialog.close();
                    } catch(e) {
                      textarea.addClass('lichessTools-error');
                      $(dialog).find('.lichessTools-errorText').text(e.message);
                      return;
                    }
                  })
        )
        .append('<span class="lichessTools-errorText">');
      $(dialog).find('textarea')
        .removeClass('lichessTools-error')
        .val(tags.map(t=>`[${t[0]} "${t[1]}"]`).join('\r\n'));
      dialog.showModal();
    };

    setupBulkPgnTagEdit = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      const isWritableStudy = study?.isWriting();
      const button = $('.study__topics a.lichessTools-bulkPgnTagsEdit');
      if (!isWritableStudy || !this.options.tags) {
        button.remove();
        return;
      }
      const studyId = study.data?.id;
      const chapterId = study.data?.chapter?.id;
      if (!studyId || !chapterId) return;
      if (!button.length) {
        $('<a class="lichessTools-bulkPgnTagsEdit">')
          .text(trans.noarg('bulkPgnTagsEditText'))
          .attr('title',trans.noarg('bulkPgnTagsEditTitle'))
          .on('click',async (ev)=>{
            ev.preventDefault();
            const tags = lichess.analysis.study.data?.chapter?.tags;
            this.popupPgnTagsEdit(studyId, chapterId, tags);
          })
          .appendTo('.study__topics');
      }
    };

    setupExtraControlsDirect = ()=>{
      this.setupBulkPgnTagEdit();
    };
    setupExtraControls = this.lichessTools.debounce(this.setupExtraControlsDirect, 100);

    editSelectedChapters = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const ids = $('button[data-id]:has(.lichessTools-selectChapter:checked)').map((i,e)=>$(e).attr('data-id')).get();
      if (!ids?.length) return;
   
      const editForm = lt.lichess.analysis.study.chapters.editForm;
      editForm.current({
       "id": ids,
       "name": "Bulk Edit",
       "orientation": "white"
      });
      editForm.redraw();
      lt.global.setTimeout(()=>{
        $('#chapter-name')
          .prop('readonly',true)
          .each((i,e)=>e.blur());
        lt.global.document.getSelection  && lt.global.document.getSelection().empty();
        
        $('<option value="" selected>')
          .text(trans.noarg('bulkEditUnchanged'))
          .prependTo('#chapter-orientation');

        $('<option value="" selected>')
          .text(trans.noarg('bulkEditUnchanged'))
          .prependTo('#chapter-mode');
      },50);
    };

    handleSendEvent = async (ev,rest)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const studyChapters = lt.lichess.analysis.study.chapters;
      const editForm = studyChapters.editForm;
      switch(ev) {
        case 'deleteChapter':
          try {
            const ids = rest;
            for (const id of ids) {
              await editForm.send(ev,id);
              await lt.timeout(500);
            }
            lt.announce(trans.pluralSame('deletedNChaptersMessage',ids.length));
          } catch(e) {
            lt.global.console.warn('Error deleting chapters',e);
            lt.announce(trans.noarg('errorDeletingChaptersMessage'));
          } finally {
            site.analysis.study.chapters.sort([]);
            this.cancelEditChapters();
          }
          break;
        case 'editChapter':
          try {
            const chapters = studyChapters.list.all();
            const ids=rest.id;
            for (const id of ids) {
              const existingData = await editForm.chapterConfig(id);
              if (!existingData) continue;
              existingData.mode = 'normal';
              ['gamebook','practice','conceal']
                .forEach(p=>{ if (p in existingData) existingData.mode=p });
              const data = { 
                id: existingData.id,
                name: existingData.name,
                orientation: rest.orientation || existingData.orientation,
                mode: rest.mode || existingData.mode,
                description: existingData.description || ''
              };
              await editForm.send(ev,data);
              await lt.timeout(500);
            }
            lt.announce(trans.pluralSame('editedNChaptersMessage',ids.length));
          } catch(e) {
            lt.global.console.warn('Error editing chapters',e);
            lt.announce(trans.noarg('errorEditingChaptersMessage'));
          } finally {
            studyChapters.sort([]);
            this.cancelEditChapters();
          }
          break;
      };
    };

    cancelEditChapters =()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.lichessTools-selectChapter').prop('checked',false);
      this.inBulkEdit = false;
      this.refreshChapterControls();
    };

    refreshChapterControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const study = lt.lichess.analysis?.study;
      if (!study) return;
      $('.study__chapters').toggleClassSafe('lichessTools-bulkEdit',!!this.options.bulk && !!this.inBulkEdit);
      if (this.options.bulk) {

        let container = $('.lichessTools-bulkEditButtons');
        if (!container.length) {
          container = $('<div class="lichessTools-bulkEditButtons">')
                        .insertBefore('.study__chapters');
          $('<button type="button" data-act="editChapters" class="button text">')
            .text(trans.noarg('editChaptersButtonText'))
            .attr('title',trans.noarg('editChaptersButtonTitle'))
            .attr('data-icon',lt.icon.Gear)
            .on('click',ev=>{
              ev.preventDefault();
              this.editSelectedChapters();
            })
            .appendTo(container);
          $('<button type="button" data-act="cancelEditChapters" class="button text">')
            .text(trans.noarg('cancelEditChaptersButtonText'))
            .attr('title',trans.noarg('cancelEditChaptersButtonTitle'))
            .attr('data-icon',lt.icon.Cancel)
            .on('click',ev=>{
              ev.preventDefault();
              this.cancelEditChapters();
            })
            .appendTo(container);
        }

        $('.study__chapters button[data-id]').each((i,e)=>{
          if (e.__initChapterEditing) return;

          $('<input type="checkbox" class="lichessTools-selectChapter">')
            .on('click',ev=>{
              ev.stopPropagation();
            })
            .prependTo(e);

          $(e).on('contextmenu',(ev)=>{
              this.inBulkEdit = true;
              this.refreshChapterControls();
              $('.lichessTools-selectChapter',e).prop('checked',true);
              ev.preventDefault();
            });

          e.__initChapterEditing=true;
        });
      }
    };
    debouncedRefreshChapterControls = this.lichessTools.debounce(this.refreshChapterControls, 100);


    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('chapterEditing');
      this.logOption('Chapter editing', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        tags: lt.isOptionSet(value, 'tags'),
        bulk: lt.isOptionSet(value, 'bulk')
      };
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      this.setupExtraControls();

      lt.pubsub.off('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
      lt.pubsub.off('lichessTools.redraw', this.debouncedRefreshChapterControls);
      lt.uiApi.events.off('chat.resize', this.debouncedRefreshChapterControls);
      $('.study__chapters').observer()
        .off('button[data-id]',this.debouncedRefreshChapterControls);
      $('div.study__side.lichessTools-chapterControls,aside.relay-tour__side.lichessTools-chapterControls')
        .removeClass('lichessTools-chapterControls')
        .find('div[role="footer"]')
        .remove();

      study.chapters.editForm.send = lt.unwrapFunction(study.chapters.editForm.send, 'chapterEditing');
      if (this.options.bulk) {
        study.chapters.editForm.send = lt.wrapFunction(study.chapters.editForm.send, {
          id: 'chapterEditing',
          before: ($this,ev,...rest) => {
            if (!this.options.bulk) return;
            switch (ev) {
              case 'deleteChapter':
                if (Array.isArray(rest?.[0])) {
                  this.handleSendEvent(ev,...rest);
                  return false;
                }
                break;
              case 'editChapter':
                if (Array.isArray(rest?.[0]?.id)) {
                  this.handleSendEvent(ev,...rest);
                  return false;
                }
                break;
            }
          }
        });
        lt.pubsub.on('lichessTools.chapterChange', this.debouncedRefreshChapterControls);
        lt.pubsub.on('lichessTools.redraw', this.debouncedRefreshChapterControls);
        lt.uiApi.events.on('chat.resize', this.debouncedRefreshChapterControls);
        $('.study__chapters').observer()
          .on('button[data-id], button[data-id] h3',this.debouncedRefreshChapterControls);
        this.refreshChapterControls();
      }
    }

  }
  LiChessTools.Tools.ChapterEditing = ChapterEditingTool;
})();

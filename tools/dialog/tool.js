(() => {
  class DialogTool extends LiChessTools.Tools.ToolBase {

    async createDialog(options) {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const document = lt.global.document;

      const dialogWrapper = await lt.uiApi.dialog.domDialog(options);
      const dialog = $(dialogWrapper.dialog)
        .addClass('lichessTools-dialog');
      const view = dialog.find('.dialog-content');

      // Extras layered on top of the Lichess-owned <dialog>.
      if (options.closedBy) {
        dialog.attr('closedby', options.closedBy);
      }
      if (options.noCloseButton) {
        dialog.find('button.close-button').remove();
      }
      if (options.help) {
        $('<a class="help-button" aria-label="Help" target="_blank">')
          .attr('href', options.help)
          .attr('data-icon', lt.icon.InfoCircle)
          .appendTo(dialog.find('.close-button-anchor'));
      }

      const emitPlacement = lt.debounce(() => {
        const { left, top, width, height } = dialog[0].getBoundingClientRect();
        const windowHeight = $(window).height();
        const windowWidth = $(window).width();
        const content = dialog.find('.dialog-content');
        const data = { height: content.height(), width: content.width() };
        if (left + width / 2 < windowWidth / 2) {
          data.left = left + width / 2;
        } else {
          data.right = windowWidth - left - width - width / 2;
        }
        if (top + height / 2 < windowHeight / 2) {
          data.top = top + height / 2;
        } else {
          data.bottom = windowHeight - top - height - height / 2;
        }
        lt.pubsub.emit('lichessTools.setDialogPlacement', data);
      },50);

      if (options.header !== undefined) {
        const header = $('<div class="dialog-header">')
          .insertBefore(dialog.find('.scrollable,.not-scrollable'));
        if (typeof(options.header) == 'string') {
          header.text(options.header);
        } else 
        if (options.header){
          header
            .empty()
            .append($(options.header));
        }
        if (!options.noDrag) {
          header
            .addClass('draggable')
            .on('pointerdown', ev => {
              const rect = dialog[0].getBoundingClientRect();
              const shiftX = ev.pageX - rect.x - rect.width/2;
              const shiftY = ev.pageY - rect.y - rect.height/2;
              let left = 0;
              let top = 0;

              const onMouseMove = (ev) => {
                left = ev.pageX - shiftX;
                top = ev.pageY - shiftY;
                dialog
                  .addClass('dragged')
                  .css({
                    left: left,
                    top: top
                  });
              };

              $(document).on('pointermove', onMouseMove);

              $(document).one('pointerup', () => {
                $(document).off('pointermove', onMouseMove);
                dialog
                  .removeClass('dragged');
                emitPlacement();
              });
            });

          header.on('dragstart', () => false);
        }
      }

      if (options.resizable) {
        const resize = $('<div class="dialog-resize">')
          .appendTo(dialog);
        resize
          .on('pointerdown', ev => {
            let rect = dialog[0].getBoundingClientRect();
            dialog
              .css({
                left: rect.x+rect.width/2,
                top: rect.y+rect.height/2,
                right: 'unset',
                bottom: 'unset'
              });
            rect = view[0].getBoundingClientRect();

            const onMouseMove = (ev) => {
              dialog
                .addClass('resizing');
              const width = ev.pageX - rect.x;
              const height = ev.pageY - rect.y;
              view
                .css({
                  width: width,
                  height: height
                });
            };

            $(document).on('pointermove', onMouseMove);

            $(document).one('pointerup', () => {
              // Consume the next click
              const consumeClick = (ev) => {
                ev.stopImmediatePropagation();
                ev.preventDefault();
                document.removeEventListener("click", consumeClick, true);
              };
              document.addEventListener("click", consumeClick, true);

              $(document).off('pointermove', onMouseMove);
              dialog
                .removeClass('resizing');
              emitPlacement();
            });
          });

        resize.on('dragstart', () => false);
      }
      dialog
        .on('close',()=>{
          lt.global.setTimeout(()=>dialog.remove(),100)
        });
      // FIX get around the Firefox fit-content problem
      let resizeInterval;
      dialog
        .on('toggle',(ev)=>{
          lt.global.clearInterval(resizeInterval);
          if (ev.newState=='open') {
            resizeInterval = lt.global.setInterval(()=>{
              if (dialog.is('.resizing')) return;
              const scrollHeight = view.prop('scrollHeight')||0;
              if (scrollHeight) {
                const diff = scrollHeight-view.outerHeight();
                if (diff > 5) {
                  view.height(scrollHeight);
                }
              }
            },100);
          }
        });

      // Escape-close suppression (opt-in): Lichess's page-level Escape handler closes any open
      // <dialog>, so while this dialog is open we swallow Escape at capture phase - ahead of
      // listener order, so neither Lichess nor LiChess Tools key handlers see it.
      if (options.noEscClose) {
        const escBlocker = (ev) => {
          if (!dialog[0]?.open) {
            detachEsc();
            return;
          }
          if (ev.key == 'Escape' || ev.keyCode == 27) {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
          }
        };
        const attachEsc = () => {
          document.addEventListener('keydown', escBlocker, true);
          document.addEventListener('keyup', escBlocker, true);
        };
        const detachEsc = () => {
          document.removeEventListener('keydown', escBlocker, true);
          document.removeEventListener('keyup', escBlocker, true);
        };
        dialog
          .on('toggle', (ev) => {
            if (ev.newState == 'open') attachEsc();
          })
          .on('close', () => detachEsc());
      }

      return dialog[0];
    }

    async init() {
      const lt = this.lichessTools;
      lt.dialog = this.createDialog.bind(this);
    }
  }
  LiChessTools.Tools.Dialog = DialogTool;
})();

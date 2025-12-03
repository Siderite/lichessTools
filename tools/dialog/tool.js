(() => {
  class DialogTool extends LiChessTools.Tools.ToolBase {

    async createDialog(options) {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;

      let dialog;
      let view;
      if (!options.useLT) {
        const dialogWrapper = await lt.uiApi.dialog.domDialog(options);
        dialog = $(dialogWrapper.dialog)
          .addClass('lichessTools-dialog');
        view = dialog.find('.dialog-content');
      } else {
        dialog = $('<dialog class="lichessTools-dialog">')
          .toggleClass('touch-scroll', lt.isTouchDevice());
        if (options.parent) dialog.css('position', 'absolute');

        if (!options.noCloseButton) {
          $('<div class="close-button-anchor">')
            .append($('<button class="close-button" aria-label="Close">')
              .attr('data-icon', lt.icon.X)
              .on('click', () => dialog[0]?.close())
            )
            .appendTo(dialog);
        }

        view = $('<div class="dialog-content">');
        if (options.class) {
          options.class.split(/[\. ]/).filter(x => x).forEach(cls => view.addClass(cls));
        }
        if (options.htmlText) view.html(options.htmlText);

        const scrollable = $(`<div class="${options.noScrollable ? 'not-' : ''}scrollable">`)
          .append(view)
          .appendTo(dialog);
      }

      const emitPlacement = () => {
        const { left, top, width, height } = dialog[0].getBoundingClientRect();
        const windowHeight = $(window).height();
        const windowWidth = $(window).width();
        const content = dialog.find('.dialog-content');
        const data = { height: content.height(), width: content.width() };
        if (left + width / 2 < windowWidth / 2) {
          data.left = left;
        } else {
          data.right = windowWidth - left - width;
        }
        if (top + height / 2 < windowHeight / 2) {
          data.top = top;
        } else {
          data.bottom = windowHeight - top - height;
        }
        lt.pubsub.emit('lichessTools.setDialogPlacement', data);
      };

      if (options.header !== undefined) {
        const header = $('<div class="dialog-header">')
          .text(options.header)
          .insertBefore(dialog.find('.scrollable,.not-scrollable'));
        if (!options.noDrag) {
          header
            .addClass('draggable')
            .on('mousedown pointerdown', ev => {
              const rect = dialog[0].getBoundingClientRect();
              const shiftX = ev.pageX - rect.x;
              const shiftY = ev.pageY - rect.y;
              let left = 0;
              let top = 0;

              const onMouseMove = (ev) => {
                left = ev.pageX - shiftX;
                top = ev.pageY - shiftY;
                dialog
                  .addClass('dragged')
                  .css({
                    transform: 'none',
                    left: left,
                    top: top
                  });
              };

              $(lt.global.document).on('mousemove', onMouseMove);

              $(lt.global.document).one('mouseup pointerup', () => {
                $(lt.global.document).off('mousemove', onMouseMove);
                dialog
                  .removeClass('dragged');
                emitPlacement();
              });
            });

          header.on('dragstart', () => false);
        }
      }

      if (options.resizeable) {
        const resize = $('<div class="dialog-resize">')
          .appendTo(dialog);
        resize
          .on('mousedown pointerdown', ev => {
            let rect = dialog[0].getBoundingClientRect();
            dialog
              .css({
                left: rect.x,
                top: rect.y,
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

            $(lt.global.document).on('mousemove', onMouseMove);

            $(lt.global.document).one('mouseup pointerup', () => {
              $(lt.global.document).off('mousemove', onMouseMove);
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

      if (options.useLT) {
        dialog.appendTo(options.parent || 'body');
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
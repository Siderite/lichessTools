(() => {
  // The five edges a dialog can be grabbed by: the top and left edges stay where the page put the
  // dialog, so a grab only ever moves the edge the user took - a north-west handle would mean
  // moving a dialog that the placement already chose.
  const resizeEdges = ['e', 'se', 's', 'sw', 'w'];

  // The one way a dialog's box is written - a centre plus a size, which is how the page places a
  // dialog (it centres one with `transform: translate(-50%,-50%)`, so a `left`/`top` number names a
  // centre, and a `right`/`bottom` number names the same centre from the other edge). The writes stay
  // plain inline ones, and the opposite edge of each axis is set to `unset` rather than left alone:
  // other tools re-apply a placement they stored (`studyLinks` puts `left`/`right`/`top`/`bottom`
  // back onto the dialog, `calculationTrainer` keeps the same shape), and they write the same way, so
  // a priority write or a lone edge would win over their `unset` and leave the dialog over
  // constrained - both a `left` and a `right` - where the browser then ignores the `right` and the
  // corner the user left comes back as a centre. The page's min/max are reset to their initial values
  // so a page rule cannot clamp a size the tool asked for.
  const placeDialog = (dialog, rect) => {
    const node = dialog.length ? dialog[0] : dialog;
    if (!node || !rect) return;
    const set = (name, value) => {
      if (node.style?.setProperty) node.style.setProperty(name, value);
      else node.style[name] = value;
    };
    set('left', rect.left + rect.width / 2 + 'px');
    set('top', rect.top + rect.height / 2 + 'px');
    set('width', rect.width + 'px');
    set('height', rect.height + 'px');
    set('right', 'unset');
    set('bottom', 'unset');
    set('min-width', 'auto');
    set('min-height', 'auto');
    set('max-width', 'none');
    set('max-height', 'none');
  };

  // The resize machine a dialog carries when it is made resizable: the strips, the gate that opens a
  // gesture, and the box the gesture leaves on the page. A tool that wants a say about the size - the
  // viewport it lives in, a minimum, where the size is remembered - hands those decisions over as
  // `resizable: {begin, resize}`: `begin` runs when a gesture opens, and `resize` gets the box the
  // pointer proposes together with the edge, the deltas and the box the gesture started from, and
  // answers with the box that goes on the page. With neither the dialog simply takes the box. The
  // content always keeps its own floor: a box never goes under the width the content cannot wrap,
  // nor under the full height of a dialog the page cannot scroll.
  class DialogResize {
    constructor(dialog, policy, lichessTools) {
      this.dialog = dialog;
      this.policy = policy;
      this.lichessTools = lichessTools;
      this.gesture;
    }

    // The content the page lays out inside the dialog - the dialog's box is built around it, and a
    // content sized as a percentage (a video iframe at 100%, a trainer board) only follows a content
    // that has a size of its own, which is why the machine sizes both.
    content() {
      return this.dialog.find('.dialog-content');
    }

    // The gate: one primary press on a strip opens a gesture, and that press is swallowed so the
    // strip never reaches whatever sits under it. A touch contact reports no button (`-1`), so a
    // finger opens the gate as a left press does, and a right or middle press never does.
    start(event) {
      const lt = this.lichessTools;
      if (!event || !event.isPrimary || this.gesture) return;
      if (event.button !== 0 && event.button !== -1) return;
      const capture = lt.$(event.target);
      const edge = capture.attr('data-resize');
      if (!edge) return;
      const bounds = this.dialog[0]?.getBoundingClientRect?.();
      if (!bounds) return;
      const contentBox = this.content()[0]?.getBoundingClientRect?.();
      event.preventDefault?.();
      this.gesture = {
        edge,
        base: { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height },
        floor: this.floor(),
        // The room the dialog keeps around its content: the box the gesture sizes is the dialog's,
        // and the content gets what is left inside it.
        pad: {
          x: Math.max(0, bounds.width - (contentBox?.width || bounds.width)),
          y: Math.max(0, bounds.height - (contentBox?.height || bounds.height)),
        },
        moved: false,
        capture,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      this.policy?.begin?.();
      capture[0]?.setPointerCapture?.(event.pointerId);
    }

    // The size the content forces the box to keep: the width it cannot be made narrower than, and,
    // for a dialog the page cannot scroll, the content's full height as well. A box asked for at
    // zero width reports its own scroll extent - the widest line, image or control that will not
    // break - which is the width the content needs; the read is synchronous, so the page never
    // paints at the probe width. Measured when a gesture opens, before the gesture sizes anything.
    floor() {
      const content = this.content()[0];
      if (!content) return;
      const dialogBounds = this.dialog[0]?.getBoundingClientRect?.() || { width: 0, height: 0 };
      const contentBounds = content.getBoundingClientRect?.() || { width: 0, height: 0 };
      const padX = Math.max(0, dialogBounds.width - contentBounds.width);
      const padY = Math.max(0, dialogBounds.height - contentBounds.height);
      let required = 0;
      if (content.style) {
        const previous = content.style.width;
        content.style.width = '0px';
        required = content.scrollWidth || 0;
        content.style.width = previous || '';
      }
      const overflowX = (content.scrollWidth || 0) - (content.clientWidth || 0);
      const width = Math.max(required, overflowX > 0 ? content.scrollWidth || 0 : 0) + padX;
      const scrollable = this.dialog.find('.scrollable').length > 0;
      return { width, height: scrollable ? 0 : contentBounds.height + padY };
    }

    // A box under that floor is grown back on the axis the grab moves, so the edge the user let go
    // of still holds where it was and the far edge takes the extra room.
    grow(rect, edge, floor) {
      if (!floor || !rect) return rect;
      const width = Math.max(rect.width, floor.width);
      const height = Math.max(rect.height, floor.height);
      return {
        left: edge?.includes('w') ? rect.left + rect.width - width : rect.left,
        top: rect.top,
        width,
        height,
      };
    }

    // The box the grabbed edge moves to - the other edges hold still, which is what keeps a west
    // grab from sliding the whole dialog.
    propose(base, dx, dy, edge) {
      let left = base.left;
      let right = base.left + base.width;
      let bottom = base.top + base.height;
      if (edge.includes('w')) left += dx;
      if (edge.includes('e')) right += dx;
      if (edge.includes('s')) bottom += dy;
      return { left, top: base.top, width: right - left, height: bottom - base.top };
    }

    // The box rides on the dialog as a centre plus a size, and the content is given the room left
    // inside it. Sizing the dialog alone leaves the content at its own size, and a content sized as a
    // percentage of its parent - a video iframe at 100%, a trainer board - keeps that size, so the
    // box grows around it and the content reads as cropped rather than resized.
    apply(rect) {
      placeDialog(this.dialog, rect);
      const content = this.content();
      const pad = this.gesture?.pad;
      if (!content.length || !pad) return;
      content.css({
        width: Math.max(0, rect.width - pad.x),
        height: Math.max(0, rect.height - pad.y),
      });
    }

    // The drag half: six pixels of travel opens the gesture (a press that never moved stays a press
    // on the strip), the dialog is marked `resizing` while it moves, and the proposed box goes
    // through the tool's policy before it is put on the page.
    move(event) {
      const gesture = this.gesture;
      if (!gesture || !event || gesture.pointerId !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.moved) {
        if (Math.hypot(dx, dy) < 6) return;
        gesture.moved = true;
        this.dialog.addClass('resizing');
      }
      let rect = this.grow(this.propose(gesture.base, dx, dy, gesture.edge), gesture.edge, gesture.floor);
      if (this.policy?.resize)
        rect = this.grow(this.policy.resize(rect, gesture.edge, dx, dy, gesture.base), gesture.edge, gesture.floor);
      if (!Number.isFinite(rect?.left) || !Number.isFinite(rect?.top) || !Number.isFinite(rect?.width) || !Number.isFinite(rect?.height)) return;
      this.apply(rect);
    }

    // The release: the last position lands, the gesture closes, and the two things the old handle
    // raised still go out - the placement event, so whatever follows the dialog's box sees the new
    // size, and the click the browser fires under the pointer when a press ends, which would
    // otherwise press whatever the strip was sitting over.
    async end(event, emitPlacement) {
      if (!this.gesture || !event || this.gesture.pointerId !== event.pointerId) return;
      this.move(event);
      const gesture = this.gesture;
      this.clear();
      if (!gesture.moved) return;
      emitPlacement?.();
      const document = this.lichessTools.global.document;
      const consumeClick = (ev) => {
        ev.preventDefault?.();
        ev.stopImmediatePropagation?.();
        document.removeEventListener('click', consumeClick, true);
      };
      document.addEventListener('click', consumeClick, true);
    }

    // A pointer the page takes away (a touch lifted, a capture lost) ends the gesture the same way,
    // minus the release signals - nothing was resized to a new size.
    stop(event) {
      if (event && event.pointerId === this.gesture?.pointerId) this.clear();
    }

    clear() {
      const gesture = this.gesture;
      if (!gesture) return;
      this.gesture = undefined;
      this.dialog.removeClass('resizing');
      if (gesture.capture[0]?.hasPointerCapture?.(gesture.pointerId)) gesture.capture[0].releasePointerCapture(gesture.pointerId);
    }
  }

  class DialogTool extends LiChessTools.Tools.ToolBase {

    async createDialog(options) {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const document = lt.global.document;
      options = { closeButton: !options.noCloseButton, ...options };

      const dialogWrapper = await lt.uiApi.dialog.domDialog(options);
      const dialog = $(dialogWrapper.dialog)
        .addClass('lichessTools-dialog');
      const view = dialog.find('.dialog-content');

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
        // Cash's `$(window)` answers the viewport; the global's own numbers are the same measure, read
        // where the factory already has the global.
        const windowHeight = lt.global.window?.innerHeight || 0;
        const windowWidth = lt.global.window?.innerWidth || 0;
        // The box the machine sized: the dialog's own border box, and the room the content was given
        // inside it. A content sized as a percentage of its parent only follows a parent that has a
        // size of its own, so a tool that re-opens a dialog needs both to put the size back.
        const content = dialog.find('.dialog-content');
        const contentBox = content.length ? content[0].getBoundingClientRect?.() : undefined;
        const data = { width: width + 'px', height: height + 'px' };
        if (contentBox) {
          data.contentWidth = contentBox.width + 'px';
          data.contentHeight = contentBox.height + 'px';
        }
        // The centre the dialog is placed by, from the edge the page put it on: Lichess centres a
        // dialog with left/top, so a dialog right of centre hands back the distance its centre sits
        // in from the right edge, which is where a `right` rule puts a centre the same way.
        const centreX = left + width / 2;
        const centreY = top + height / 2;
        if (centreX < windowWidth / 2) {
          data.left = centreX + 'px';
        } else {
          data.right = (windowWidth - centreX) + 'px';
        }
        if (centreY < windowHeight / 2) {
          data.top = centreY + 'px';
        } else {
          data.bottom = (windowHeight - centreY) + 'px';
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
                dialog.addClass('dragged');
                // A drag moves the dialog - it never resizes it - so the size the press found is the
                // size the move keeps, and the box is written the one way it is written everywhere.
                placeDialog(dialog, { left: left - rect.width / 2, top: top - rect.height / 2, width: rect.width, height: rect.height });
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
        const gesture = new DialogResize(dialog, options.resizable === true ? {} : options.resizable, lt);
        dialog
          .on('pointerdown', (ev) => gesture.start(ev))
          .on('pointermove', (ev) => gesture.move(ev))
          .on('pointerup', (ev) => gesture.end(ev, emitPlacement))
          .on('pointercancel', (ev) => gesture.stop(ev))
          .on('lostpointercapture', (ev) => gesture.stop(ev));
        for (const edge of resizeEdges) {
          dialog.append(
            $('<span class="dialog-resize">')
              .addClass('dialog-resize-' + edge)
              .attr('data-resize', edge)
              .on('dragstart', () => false)
          );
        }
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
        dialog.attr('closedby', 'none');
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

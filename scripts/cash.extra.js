(function(cash) {

cash.cached = function (selector, duration = 10000) {
  if (typeof (selector) !== 'string' || !(+duration)) {
    throw new Error('Selector can only be a string and duration must be specified');
  }
  const cache = cash.__cache || (cash.__cache = new Map());
  let item = cache.get(selector);
  if (!item?.time || Date.now() - item.time > item.duration) {
    item = { value: cash(selector), time: Date.now(), duration: duration }
    cache.set(selector, item);
  } else if (window.lichessTools?.debug > 1) {
    console.debug('Getting ' + selector + ' from $ cache');
  }
  return item.value;
};

cash.fn.toggleDisplay = function (value, important) {
  this.each((i, e) => {
    const curr = this.css('display');
    e.initDisplay = e.initDisplay || curr;
    const isHidden = curr == 'none';
    const isInitHidden = e.initDisplay == 'none';
    const show = value === undefined
      ? isHidden
      : !!value;
    if (show == !isHidden) return;
    let style = cash(e).attr('style') || '';
    let newDisplay = show
      ? (isInitHidden ? 'initial' : e.initDisplay)
      : (isInitHidden ? '' : 'none');
    if (important) newDisplay += ' !important';
    style = [
      style.replace(/\bdisplay\s*:\s*[^;]+;?/g, ''),
      'display: ' + newDisplay + ';'
    ].filter(x => !!x).join(';');
    cash(e).attr('style', style);
  });
  return this;
}

cash.single = function (selector, context) {
  const parent = context === undefined
    ? document
    : cash(context)[0];
  const elem = parent?.querySelector(selector);
  return cash(elem);
};

cash.fn.attrSafe = function(attr,value) {
  this.each((i,e)=>{
    const $e = cash(e);
    if ($e.attr(attr)!==value) {
      $e.attr(attr,value);
    }
  });
  return this;
}

cash.fn.textSafe = function(value) {
  this.each((i,e)=>{
    const $e = cash(e);
    if ($e.text()!==value) {
      $e.text(value);
    }
  });
  return this;
}

cash.fn.insertText = function(value, focus) {
  if (!value) return;
  this.each((i,e)=>{
    const start = e.selectionStart;
    const end = e.selectionEnd;
    const text = e.value;
    e.value = text.substring(0, start) + value + text.substring(end);

    const newCursorPos = start + value.length;
    e.setSelectionRange(newCursorPos, newCursorPos);
    if (focus) e.focus();
  });
  return this;
}

cash.fn.removeAttrSafe = function(attr) {
  this.each((i,e)=>{
    const $e = cash(e);
    if ($e.attr(attr)) {
      $e.removeAttr(attr);
    }
  });
  return this;
}

cash.fn.toggleClassSafe = function(className, value) {
  if (value === undefined && this.length>2)  {
    throw new Error('Cannot use toggleClassSafe with undefined value for multiple elements');
  }
  this.each((i,e)=>{
    const existing = cash(e).hasClass(className);
    if (value === undefined) value = !existing;
    if (existing !== value) {
      cash(e).toggleClass(className, value);
    }
  });
  return this;
}

cash.fn.appendSpan = function(text) {
  if (text===undefined) text='';
  $('<span>').text(text).appendTo(this);
  return this;
}

class Observer {
  constructor(context) {
    this.context = context;
  }

  getOrSetObserver(elem,selector,func,options) {
    let observers = elem.__mutationObservers;
    if (!observers) {
      observers = [];
      elem.__mutationObservers = observers;
    }
    let observer = observers.find(o=>o.__selector===selector && o.__func===func && JSON.stringify(o.__options)==JSON.stringify(options));
    if (!observer) {
      const matchFunc = el => {
        if (!options.useCash) {
          if (el.nodeType == 1) return el.matches(selector);
          if (el.nodeType == 3) return el.parentElement?.matches(selector);
        }
        return cash(el).is(selector);
      };
      let timeout = 0;
      const execFunc = options.executeDirect
        ? func
        : (mutations) => {
            clearTimeout(timeout);
            timeout = setTimeout(()=>func(mutations),50);
          };
      observer = new MutationObserver((mutations)=>{
        const matches = mutations.filter(m=>{
          if (matchFunc(m.target)) return true;
          if (!options.withNodes) return false;
          for (const node of m.addedNodes || []) {
            if (matchFunc(node)) return true;
          }
          for (const node of m.removedNodes || []) {
            if (matchFunc(node)) return true;
          }
        });
        if (matches.length) {
          execFunc(matches);
        }
      });
      observer.__selector = selector;
      observer.__func = func;
      observer.__option = options;
      observer.dispose = function() {
        observer.disconnect();
        const index = observers.indexOf(observer);
        if (index>=0) observers.splice(index,1);
      };

      observer.observe(elem,options);

      observers.push(observer);
    }
    return observer;
  }

  getObservers(elem,selector,func) {
    const observers = elem.__mutationObservers;
    if (!observers) return [];
    const result = observers.filter(o=>o.__selector===selector && (!func || o.__func===func));
    return result;
  }
  
  on(selector,func,options) {
    options =  { 
      subtree: true,
      childList: true, 
      attributes: false, 
      attributeFilter: undefined,
      characterData: true,
      withNodes: true,
      useCash: false,
      executeDirect: false,
      ...options
    };
    this.context.each((i,e)=>{
      const observer = this.getOrSetObserver(e,selector,func,options);
    });
    return this;
  }
  
  off(selector,func) {
    this.context.each((i,e)=>{
      const observers = this.getObservers(e,selector,func);
      observers.forEach(o=>o.dispose());
    });
    return this;
  }
}
Observer.cache = new Map();

cash.fn.observer = function () {
  const observer = new Observer(this);
  return observer;
}

cash.fn.replaceText = function(replacement, onlyIfExisting) {
  this.each((i,elem)=>{
    const textNodes = Array.from(elem.childNodes).filter(n => n.nodeType == 3);
    if (!textNodes.length && !onlyIfExisting) {
      const newText = typeof replacement === 'function'
        ? replacement('')
        : replacement;
      if (elem.textContent != newText) {
        elem.textContent = newText;
      }
      return;
    }
    for (const textNode of textNodes) {
      const infoText = textNode.textContent;
      const newText = typeof replacement === 'function'
        ? replacement(infoText)
        : replacement;
      if (infoText != newText) {
        textNode.textContent = newText;
      }
    }
  });
  return this;
}

cash.fn.makeCombo = function (options) {

  const $ = cash;
  return this.each(function () {

    const input = $(this);
    input.prop('combo',options);
    let open = false;

    let wrapper = $('<div class="lichessTools-combo">');
    input.wrap(wrapper);
    wrapper = input.parent();

    const list = $('<div class="combo-list">').insertAfter(input);

    const updateList = (e) => {
      const query = input.val().toLowerCase();
      list.empty();

      const data = input.prop('combo').data;
      const filtered = data.filter(o => {
        if (options.noFilter) return true;
        return (o?.text || o?.value || o?.toString() || '').toLowerCase().includes(query);
      });

      filtered.forEach(o => {
        $('<div class="combo-item">')
          .text(o?.text || o?.value || o || '')
          .toggleClass('highlight',(o?.value || o) == input.val())
          .appendTo(list)
          .on('click', () => {
            input.val(o?.value || o);
            list.toggleDisplay(false);
            open = false;
          });
        });
      list.find('.combo-item.highlight')
          .each((i,el)=>{
            const s = (el.scrollIntoViewIfNeeded || el.scrollIntoView).bind(el);
            s && s();
          });

      open = filtered.length > 0;
      list.toggleDisplay(open);
    };

    input.on('focus input', updateList);

    input[0].addEventListener('keydown', (e) => {
      const items = list.children('.combo-item');
      let index = items.index(list.find('.highlight'));

      switch (e.key) {
        case 'ArrowDown':
          if (!open) {
            updateList();
          } else {
            index = (index + 1) % items.length;
            items.removeClass('highlight').eq(index).addClass('highlight')
              .each((i,el)=>{
                const s = (el.scrollIntoViewIfNeeded || el.scrollIntoView).bind(el);
                s && s();
              });
            const o = input.prop('combo')?.data[index];
            input.prop('comboSelected',o);
            input.trigger('comboSelect');
          }
          e.preventDefault();
          break;
        case 'ArrowUp':
          if (!open) {
            updateList();
          } else {
            index = (index - 1 + items.length) % items.length;
            items.removeClass('highlight').eq(index).addClass('highlight')
              .each((i,el)=>{
                const s = (el.scrollIntoViewIfNeeded || el.scrollIntoView).bind(el);
                s && s();
              });
            const o = input.prop('combo')?.data[index];
            input.prop('comboSelected',o);
            input.trigger('comboSelect');
          }
          e.preventDefault();
          break;
        case 'Enter':
          if (open && index>=0) {
            const o = input.prop('combo')?.data[index];
            const value = o?.value || o || '';
            input.val(value);
            input.trigger('change');
            list.toggleDisplay(false);
            open = false;
            e.preventDefault();
            e.stopPropagation();
          }
          break;
      }
    }, { capture: true });

    $(document).on('click', e => {
      if (!$(e.target).closest(wrapper).length) {
        list.toggleDisplay(false);
        open = false;
      }
    });

    if (!$('#lichessTools-combo').length) {
      $(`<style id="lichessTools-combo">
.lichessTools-combo {
  position: relative;
}

.lichessTools-combo .combo-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--c-bg-box);
  border: 1px solid var(--c-border);
  max-height: 200px;
  overflow-y: auto;
  display: none;
  z-index: 999;
  text-align: left;
}

.lichessTools-combo .combo-item {
  padding: .6em 1em;
  cursor: pointer;
  color: var(--c-font-clear);
}

.lichessTools-combo .combo-item:hover,
.lichessTools-combo .combo-item.highlight {
  background-color: color-mix(in lab, currentcolor 10%, transparent);
}
</style>`).appendTo('head');
        
    }
  });
};

})(cash);
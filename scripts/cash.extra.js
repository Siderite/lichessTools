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
  if (this.attr(attr)!==value) {
    this.attr(attr,value);
  }
  return this;
}


class Observer {
  constructor(context) {
    this.context = context;
    this.handlers = new Map();
  }
  
  on(selector,func,options) {
    if (!options) {
      options =  { 
        subtree: true,
        childList: true, 
        attributes: false, 
        characterData: true
      };
    }
    this.off(selector,func);
    const observer = new MutationObserver((mutations)=>{
      const matches = mutations.filter(m=>$(m.target).is(selector));
      if (matches.length) {
        func(matches);
      }
    });
    let list = this.handlers.get(selector);
    if (!list) {
      list = []
      this.handlers.set(selector,list);
    }
    list.push({
      func: func,
      observer: observer
    });
    this.context.each((i, e) => {
      observer.observe(e,options);
    });
    return this;
  }
  
  off(selector,func) {
    let list = this.handlers.get(selector);
    if (!list) return;
    if (func) {
      list.forEach(o=>{
        if (o.func===func) { o.observer?.disconnect(); }
      });
      this.handlers.set(selector,list.filter(o=>o.func!==func));
    } else {
      list.forEach(o=>o.observer?.disconnect());
      this.handlers.delete(selector);
    }
    return this;
  }
  
  clear() {
    for (const selector of this.handlers.keys()) {
      this.off(selector);
    }
    this.handlers=new Map();
    return this;
  }
}

cash.fn.observer = function () {
  if (this.length!=1) {
    throw new Error('Cannot find element to observe from');
  }
  let observer = this.prop('__observer');
  if (!observer) {
    observer = new Observer(this,ctx=>ctx.prop('__observer',null));
    this.prop('__observer',observer);
  }
  return observer;
}

cash.fn.hasObserver = function () {
  const observer = this.prop('__observer');
  return !!observer;
}

cash.fn.removeObserver = function () {
  const observer = this.prop('__observer');
  observer?.clear();
  this.removeProp('__observer');
}

cash.fn.replaceText = function(replacement) {
  this.each((i,elem)=>{
    const textNodes = Array.from(elem.childNodes).filter(n => n.nodeType == 3);
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
}

})(cash);
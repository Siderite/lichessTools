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
    if (cash(e).attr(attr)!==value) {
      cash(e).attr(attr,value);
    }
  });
  return this;
}

cash.fn.removeAttrSafe = function(attr) {
  this.each((i,e)=>{
    if (cash(e).attr(attr)) {
      cash(e).removeAttr(attr);
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
      const matchFunc = options.useCash
        ? el=>cash(el).is(selector)
        : el=>(el.nodeType == 1
                 ? el.matches(selector)
                 : cash(el).is(selector));
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
          func(matches);
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

cash.fn.replaceText = function(replacement) {
  this.each((i,elem)=>{
    const textNodes = Array.from(elem.childNodes).filter(n => n.nodeType == 3);
    if (!textNodes.length) {
      const newText = typeof replacement === 'function'
        ? replacement('')
        : replacement;
      elem.textContent = newText;
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

})(cash);
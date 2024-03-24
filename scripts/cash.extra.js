cash.cached=function(selector, duration=10000) {
  if (typeof(selector)!=='string' || !(+duration)) {
    throw new Error('Selector can only be a string and duration must be specified');
  }
  const cache=cash.__cache||(cash.__cache=new Map());
  let item=cache.get(selector);
  if (!item?.time || Date.now()-item.time>item.duration) {
    item={ value: cash(selector), time: Date.now(), duration: duration }
    cache.set(selector,item);
  } else if (window.lichessTools?.debug>1) {
    console.debug('Getting '+selector+' from $ cache');
  }
  return item.value;
};

cash.fn.toggleDisplay=function(value, important) {
  this.each((i,e)=>{
    const curr=this.css('display');
    e.initDisplay=e.initDisplay||curr;
    const isHidden=curr=='none';
    const isInitHidden=e.initDisplay=='none';
    const show=value===undefined
      ? isHidden
      : !!value;
    if (show==!isHidden) return;
    let style=cash(e).attr('style')||'';
    let newDisplay=show
      ? (isInitHidden?'initial':e.initDisplay)
      : (isInitHidden?'':'none');
    if (important) newDisplay+=' !important';
    style= [ 
            style.replace(/\bdisplay\s*:\s*[^;]+;?/g,''),
            'display: '+newDisplay+';'
    ].filter(x=>!!x).join(';');
    cash(e).attr('style',style);
  });
  return this;
}
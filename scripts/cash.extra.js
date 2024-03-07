cash.cached=function(selector, duration=10000) {
  if (typeof(selector)!=='string' || !(+duration)) {
    throw new Error('Selector can only be a string and duration must be specified');
  }
  const cache=cash.__cache||(cash.__cache=new Map());
  let item=cache.get(selector);
  if (!item?.time || Date.now()-item.time>item.duration) {
    item={ value: cash(selector), time: Date.now(), duration: duration }
    cache.set(selector,item);
  } else if (window.lichessTools?.debug) {
    console.debug('Getting '+selector+' from $ cache');
  }
  return item.value;
};
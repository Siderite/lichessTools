const handleLocally = async (detail) => {
  switch (detail?.type) {
    case 'getFile': {
      const filename = detail.options?.filename;
      if (!filename) return;
      const response = await fetch(chrome.runtime.getURL(filename));
      if (!response.ok) return;
      return await response.json();
    }
    case 'fetchText': {
      const { url, retries: rawRetries, ...options } = detail.options || {};
      const retries = Math.max(1, +rawRetries || 1);
      if (!url) return;
      let text = null;
      let delay = 0;
      for (let i=0; i<retries; i++) {
        if (delay) await new Promise(resolve => this.global.setTimeout(resolve, delay));
        delay += 500;
        try {
          const response = await fetch(url,options);
          if (response?.ok) {
            text = await response.text();
            break;
          }
        } catch(e) {
          console.warn('Error trying to fetch',url,e);
        }
      }
      if (text === null) return;
      return { text };
    }
    case 'getVersion': {
      return { version: chrome.runtime.getManifest().version };
    }
    case 'getChromeUrl': {
      return { url: chrome.runtime.getURL(detail.options?.url) };
    }
  }
};

const sendToBackground = (detail) => {
  return new Promise((resolve,reject) => {
    const pointer = globalThis.setTimeout(()=>reject(new Error('Background response timeout')),10000);
    Promise.resolve(chrome.runtime.sendMessage(detail)).then(response=>{
      globalThis.clearTimeout(pointer);
      resolve(response);
    },e=>{
      globalThis.clearTimeout(pointer);
      reject(e);
    });
  });
};

window.addEventListener('LichessTools.send', async (ev) => {
  const extensionId = chrome?.runtime?.id;
  if (!extensionId) return;
  let detail;
  try {
    detail = typeof ev.detail == 'string'
      ? JSON.parse(ev.detail)
      : ev.detail;
  } catch (e) {
    globalThis.console.warn('Could not parse extension request:',e);
    return;
  }
  const uid = detail?.uid;
  if (!uid) return;
  let response;
  try {
    response = await sendToBackground(detail);
    if (!response || response.err) {
      response = await handleLocally(detail) || response;
    }
  } catch (e) {
    globalThis.console.warn('Error sending message:',e);
    try {
      response = await handleLocally(detail);
    } catch (localError) {
      globalThis.console.warn('Error handling message locally:',localError);
      response = { err: localError.toString() };
    }
  }
  const newDetail=JSON.stringify(Array.isArray(response) ? { result: response, uid: uid } : { ...response, uid: uid });
  const customEvent = new CustomEvent('LichessTools.receive', {
    detail: newDetail,
    bubbles: true,
    cancelable: true,
    composed: false,
  });
  window.dispatchEvent(customEvent);
});

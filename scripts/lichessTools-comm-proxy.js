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
      const { url, retries, ...options } = detail.options || {};
      if (!url) return;
      const response = await fetch(url,options);
      if (!response.ok) return;
      return { text: await response.text() };
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
  return new Promise((resolve, reject) => {
    const pointer = globalThis.setTimeout(() => reject(new Error('Background response timeout')), 3000);
    try {
      chrome.runtime.sendMessage(detail, (response) => {
        globalThis.clearTimeout(pointer);
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(response);
      });
    } catch (e) {
      globalThis.clearTimeout(pointer);
      reject(e);
    }
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
  const newDetail=JSON.stringify({ ...response, uid: uid });
  const customEvent = new CustomEvent("LichessTools.receive", {
    detail: newDetail,
    bubbles: true,
    cancelable: true,
    composed: false,
  });
  window.dispatchEvent(customEvent);
});

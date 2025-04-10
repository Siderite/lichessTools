window.addEventListener('LichessTools.send', async (ev) => {
  const extensionId = chrome?.runtime?.id;
  if (!extensionId) return;
  const uid = ev.detail.uid;
  const response = await chrome.runtime.sendMessage(ev.detail);
  if (chrome.runtime.lastError) globalThis.console.warn('Error sending message:', chrome.runtime.lastError);
  let newDetail={ ...response, uid: uid };
  if (globalThis.cloneInto) {
    newDetail=cloneInto(newDetail,document.defaultView);
  }
  const customEvent = new CustomEvent("LichessTools.receive", {
    detail: newDetail,
    bubbles: true,
    cancelable: true,
    composed: false,
  });
  window.dispatchEvent(customEvent);
});

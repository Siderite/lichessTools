  window.addEventListener('LichessTools.send',async (ev)=>{
    const uid=ev.detail.uid;
    const response=await chrome.runtime.sendMessage(ev.detail);
    const customEvent = new CustomEvent("LichessTools.receive", {
      detail: { ...response,uid:uid },
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    window.dispatchEvent(customEvent);
  });

window.addEventListener("LichessTools.send", async (ev) => {
	const extensionId = chrome?.runtime?.id;
	if (!extensionId) return;
	const uid = ev.detail.uid;
	const response = await chrome.runtime.sendMessage(ev.detail);
	const customEvent = new CustomEvent("LichessTools.receive", {
		detail: { ...response, uid: uid },
		bubbles: true,
		cancelable: true,
		composed: false,
	});
	window.dispatchEvent(customEvent);
});

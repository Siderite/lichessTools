function handleUpdate(result) {
  const hasUpdate = result?.status == 'update_available';
  if (!hasUpdate) return;
  const a = document.querySelector('div.link a.update');
  a.addEventListener('click', ev => {
    ev.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions' });
  });
  a.classList.add('needsIt');
}

if (window.chrome) {
  const manifest = chrome.runtime.getManifest();
  const mainTitle = document.querySelector('#mainTitle');
  mainTitle.setAttribute('title', manifest.description);
  mainTitle.innerText = manifest.name.replace(',', ',\r\n') + '\r\nv' + manifest.version;
  chrome?.runtime?.requestUpdateCheck && chrome.runtime.requestUpdateCheck(handleUpdate);
}

const rateLink = window.browser
  ? 'https://addons.mozilla.org/en-US/firefox/addon/lichess-tools-by-siderite/'
  : 'https://chromewebstore.google.com/detail/lichess-tools-by-siderite/langlhlcknngldkeliapahbhbcmlcbcj';
//  : 'https://chromewebstore.google.com/detail/lichess-tools-by-siderite/'+chrome.runtime.id;

document.querySelector('div.link a.rate').setAttribute('href',rateLink);
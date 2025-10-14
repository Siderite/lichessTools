if (globalThis.importScripts) importScripts('obs-websocket.js');

let obs = null;

const getObs = async (options) => {
  if (!options) throw new Error('Options not defined');
  if (!options.url) return;
  if (!obs) {
    obs = new OBSWebSocket();
  }
  if (!obs.socket) {
    let connectOptions = undefined;
    try {
      connectionOptions = options.connectOptions ? JSON.parse(options.connectOptions) : undefined;
    } catch { }
    try {
      await obs.connect(options.url, options.password, connectOptions);
    } catch (e) {
      console.debug('Error connecting to OBS', e, options);
    }
  }
  return obs;
}

const handlers = {
  disconnect: async (data) => {
    obs?.disconnect();
  },
  sceneChange: async (data) => {
    const { options, sceneName } = data;
    const obs = await getObs(options);
    if (!obs) return;
    await obs.call('SetCurrentProgramScene', { sceneName }).catch(e => { console.debug('Could not set scene', data); });
  },
  getScenes: async (data) => {
    const { options } = data;
    const obs = await getObs(options);
    if (!obs) return;
    const response = await obs.call('GetSceneList').catch(e => { console.debug('Could not get scenes', data); });
    return { sceneNames: response.scenes.map(s => s.sceneName) };
  },
  pasteBuffer: async(data) => {
    const buffer = data?.options?.buffer;
    if (!buffer)
      return;
    const hostingService = 'imgbb';
    switch (hostingService) {
      case 'imgur': {
        const formData = new FormData();
        formData.append('image', buffer);
        formData.append('type', 'base64');
        formData.append('title', 'LiChess Tools image');
        formData.append('description', 'from Inbox chat paste in Lichess.org');
        const response = await fetch(
            'https://api.imgur.com/3/image', {
            method: 'POST',
            headers: new Headers({
              Authorization: 'Client-ID dd38da6dc32098d',
            }),
            body: formData
          });
        if (!response.ok)
          throw new Error('Imgur upload failed with status ' + response.status);
        const responseData = await response.json();
        return {
          link: responseData.data?.link
        };
      }
      break;
      case 'imgbb': { 
        const formData = new FormData();
        formData.append('image', buffer);
        formData.append('type', 'base64');
        formData.append('title', 'LiChess Tools image');
        formData.append('description', 'from Inbox chat paste in Lichess.org');
        let url = 'https://api.imgbb.com/1/upload?expiration={expiration}&key={key}';
        const args = { expiration:86400*100, key:'370e6c2c08e7773fc0960160e36f535c' };
        for (const k in args) {
          url = url.replace('{' + k + '}', encodeURIComponent(args[k]));
        }
        const response = await fetch(url, {
            method: 'POST',
            body: formData
          });
        if (!response.ok)
          throw new Error('Imgbb upload failed with status ' + response.status);
        const responseData = await response.json();
        return {
          link : responseData.data?.url
        };
      }
      break;
      default:
        throw new Error('Image hosting service ' + hostingService + ' not supported!');
    }
  },
  getFile: async (data) => {
    const filename = data?.options?.filename;
    if (!filename) return;
    const url = chrome.runtime.getURL(filename);
    const response = await fetch(url);
    if (!response.ok) return;
    const obj = await response.json();
    return obj;
  },
  fetchText: async (data) => {
    const url = data?.options?.url;
    if (!url) return;
    const response = await fetch(url, data.options);
    if (!response.ok) return;
    const text = await response.text();
    return { text: text };
  },
  getVersion: async (data)=>{
    const manifest = chrome.runtime.getManifest();
    return { version: manifest.version };
  },
  getDataUrl: async (data) =>{
    let url = data?.options?.url;
    if (!url) return;
    if (data?.options.useProxy) {
      url = 'https://proxy.site/proxy/'+url;
    }
    const response = await fetch(url,data.options);
    if (!response.ok) return;
    const blob = await response.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return { dataUrl: dataUrl };
  }
};

const handleRequest = async (request) => {
  console.debug('Handle request', request);
  const { type, ...data } = request;
  const handler = handlers[type];
  if (handler) {
    try {
      return await handler(data);
    } catch (e) {
      return { err: e.toString() };
    }
  }
};

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const { uid, ...data } = request;
    const tabId = sender.tab?.id;
    if (!tabId || !uid) return;
    handleRequest(data).then(response => sendResponse({ ...response, uid: uid }));
    return true;
  }
);

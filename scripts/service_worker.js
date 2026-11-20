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
      connectOptions = options.connectOptions ? JSON.parse(options.connectOptions) : undefined;
    } catch { }
    try {
      await obs.connect(options.url, options.password, connectOptions);
    } catch (e) {
      console.debug('Error connecting to OBS', e, options);
      obs = null;
    }
  }
  return obs;
}

const getCenteredPosition = async (width, height) => {
  return new Promise((resolve) => {
    chrome.windows.getCurrent({ populate: false }, (win) => {
      const left = Math.round((win.width - width) / 2) + win.left;
      const top = Math.round((win.height - height) / 2) + win.top;
      resolve({ left, top });
    });
  });
};

globalThis.hostingService ||= 'imgur'; // imgbb went paid, imgur is blocked in some regions

const hostingFallback = { imgur: 'lichess', imgbb: 'lichess', lichess: 'imgbb' };

const bytesFromBase64 = (buffer) => {
  const text = atob(buffer);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++)
    bytes[i] = text.charCodeAt(i);
  return bytes;
};

// Best effort sniffing of the image format, so the multipart upload can name the
// file and, when the header carries it, give the server the image dimensions.
const imageInfo = (bytes) => {
  const read16 = (i) => (bytes[i] << 8) | bytes[i + 1];
  const read32 = (i) => ((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]) >>> 0;
  if (bytes.length > 24 && read32(0) === 0x89504e47)
    return { type: 'image/png', width: read32(16), height: read32(20) };
  if (bytes.length > 10 && read32(0) === 0x52494f46 && read32(8) === 0x57454250)
    return { type: 'image/webp' };
  if (bytes.length > 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[6] && bytes[8])
    return { type: 'image/gif', width: bytes[6] | (bytes[7] << 8), height: bytes[8] | (bytes[9] << 8) };
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let i = 2; i + 8 < bytes.length; i++) {
      if (bytes[i] !== 0xff) continue;
      const marker = bytes[i + 1];
      if (marker === 0xda) break;
      if (marker >= 0xc0 && marker <= 0xcf && marker != 0xc4 && marker != 0xc7) {
        const height = read16(i + 5);
        const width = read16(i + 7);
        if (height && width)
          return { type: 'image/jpeg', width: width, height: height };
      }
    }
    return { type: 'image/jpeg' };
  }
  return null;
};

// One upload per hosting backend. Each of them throws on a rejected upload so
// pasteBuffer can move on to the next provider instead of failing the paste.
const uploadProviders = {
  imgur: async (options, buffer) => {
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
      link: responseData.data?.link,
      id: responseData.data?.id,
      deleteHash: responseData.data?.deletehash,
    };
  },
  imgbb: async (options, buffer) => {
    const formData = new FormData();
    formData.append('image', buffer);
    formData.append('type', 'base64');
    formData.append('title', 'LiChess Tools image');
    formData.append('description', 'from Inbox chat paste in Lichess.org');
    let url = 'https://api.imgbb.com/1/upload?expiration={expiration}&key={key}';
    const args = { 
      key:'370e6c2c08e7773fc0960160e36f535c',
      expiration: '' //86400*100
    }; 
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
      link: responseData.data?.url,
      id: responseData.data?.id,
      deleteHash: responseData.data?.delete_url?.match(/\/(?<hash>[^\/]+)$/)?.groups?.hash,
    };
  },
  lichess: async (options, buffer) => {
    // Same multipart form Lichess' own client posts to, so the server sees the
    // image exactly as if it had been pasted into a forum post.
    const bytes = bytesFromBase64(buffer);
    const info = imageInfo(bytes);
    const type = options?.type || info?.type || 'image/png';
    const formData = new FormData();
    formData.append('context', options?.context || 'https://lichess.org/forum');
    if (info?.width) {
      formData.append('dim.width', info.width);
      formData.append('dim.height', info.height);
    }
    formData.append('image', new File([bytes], options?.filename || 'image.' + type.split('/')[1], { type: type }));
    const response = await fetch(
        options?.endpoint || 'https://lichess.org/upload/image/user/forum', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: new Headers({
          accept: 'application/web.lichess+json',
          'x-requested-with': 'XMLHttpRequest',
        }),
        body: formData
      });
    if (!response.ok)
      throw new Error('Lichess upload failed with status ' + response.status);
    const responseData = await response.json();
    if (!responseData?.imageUrl)
      throw new Error('Lichess upload returned no imageUrl');
    return {
      link: responseData.imageUrl,
      imageUrl: responseData.imageUrl,
    };
  },
};

// The chain to walk before giving up on a paste: the requested backend first,
// then every link of hostingFallback, then whatever backend is left over.
const hostingChain = (start) => {
  const chain = [ start ];
  let next = hostingFallback[start];
  while (next && !chain.includes(next)) {
    chain.push(next);
    next = hostingFallback[next];
  }
  for (const service of Object.keys(uploadProviders))
    if (!chain.includes(service))
      chain.push(service);
  return chain;
};

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
    const requested = data.options?.service || globalThis.hostingService;
    if (!uploadProviders[requested])
      throw new Error('Image hosting service ' + requested + ' not supported!');
    const chain = hostingChain(requested);
    const failures = [];
    for (const service of chain) {
      try {
        const uploaded = await uploadProviders[service](data.options, buffer);
        return { ...uploaded, service };
      } catch (e) {
        console.debug('Host provider ' + service + ' failed', e);
        failures.push(service + ': ' + (e?.message ?? e));
      }
    }
    globalThis.hostingService = hostingFallback[requested] || requested;
    throw new Error('Image hosting failed through the whole chain (' + chain.join(', ') + '): ' + failures.join('; '));
  },
  deleteImage: async (data) => {
    const id = data?.options?.id;
    const hash = data?.options?.hash;
    if (!hash) return;
    const service = data?.options?.service || globalThis.hostingService;
    switch (service) {
      case 'lichess': {
        // Lichess offers no delete endpoint, so there is nothing to revoke here.
        return { ok: false };
      }
      case 'imgur': {
        const response = await fetch('https://api.imgur.com/3/image/'+hash,{ method: 'DELETE' });
        if (!response.ok)
          throw new Error('Imgur delete failed with status ' + response.status);
        }
        break;
      case 'imgbb': {
        const url = 'https://ibb.co/json';
        const formData = new FormData();
        formData.append('pathname', `/${id}/${hash}`);
        formData.append('action', 'delete');
        formData.append('delete', 'image');
        formData.append('from', 'resource');
        formData.append('deleting[id]', id);
        formData.append('deleting[hash]', hash);

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          cors: true
        });
        if (!response.ok)
          throw new Error('Imgbb delete failed with status ' + response.status);
        }
        break;
    }
    return { ok: true };
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
  getChromeUrl: async (data)=>{
    const url = chrome.runtime.getURL(data.options.url);
    return { url: url };
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
  },
  getHeadData: async (data) => {
    const url = data?.options?.url;
    if (!url) return;
    const options = { method: 'HEAD', ...data.options };
    const response = await fetch(url, options);
    if (!response.ok) return;
    const headers = {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      cacheControl: response.headers.get('cache-control'),
      server: response.headers.get('server'),
    };

    return {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers
    };
  },
  openWindow: async (data) => {
    const url = data?.options?.url;
    if (!url) return { ok: false };
    const width = 800;
    const height = 600;

    const { left, top } = await getCenteredPosition(width, height);

    try {
      const win = await chrome.windows.create({
        url: url,
        type: 'popup',
        width,
        height,
         left,
        top,
        focused: true
      });
      return { ok: true };
    } catch(e) {
      return { ok: false, error: e.message };
    }
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
    handleRequest(data).then(response => sendResponse(Array.isArray(response) ? { result: response, uid: uid } : { ...response, uid: uid }));
    return true;
  }
);

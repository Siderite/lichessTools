importScripts('obs-websocket.js')

  let obs=null;

  const getObs=async (options)=>{
    if (!options) throw new Error('Options not defined');
    if (!options.url) return;
    if (!obs) {
      obs=new OBSWebSocket();
    }
    if (!obs.socket) {
      let connectOptions=undefined;
      try { 
        connectionOptions=options.connectOptions?JSON.parse(options.connectOptions):undefined;
      } catch{}
      try {
        await obs.connect(options.url, options.password, connectOptions);
      } catch(e) {
        console.debug('Error connecting to OBS',e,options);
      }
    }
    return obs;
  }

  const handlers={
    disconnect:async (data)=>{
      obs?.disconnect();
    },
    sceneChange:async (data)=>{
      const { options, sceneName } = data;
      const obs=await getObs(options);
      if (!obs) return;
      await obs.call('SetCurrentProgramScene',{ sceneName }).catch(e=>{ console.debug('Could not set scene',data); });
    },
    getScenes:async (data)=>{
      const { options } = data;
      const obs=await getObs(options);
      if (!obs) return;
      const response = await obs.call('GetSceneList').catch(e=>{ console.debug('Could not get scenes',data); });
      return { sceneNames: response.scenes.map(s=>s.sceneName) };
    }
  };

  const handleRequest=async (request)=>{
    console.debug('Handle request',request);
    const {type,...data}=request;
    const handler=handlers[type];
    if (handler) {
      try {
        return await handler(data);
      } catch(e) {
        return { err: JSON.stringify(e) };
      }
    }
  };

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      const {uid,...data}=request;
      const tabId=sender.tab?.id;
      if (!tabId || !uid) return;
      handleRequest(data).then(response=>sendResponse({...response,uid:uid}));
      return true;
    }
  );

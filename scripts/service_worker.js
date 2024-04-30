importScripts('obs-websocket.js')

  let options=null;
  let obs=null;

  const getObs=async ()=>{
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
      const obs=await getObs();
      if (!obs) return;
      await obs.call('SetCurrentProgramScene',data).catch(e=>{ console.debug('Could not set scene',data); });
    },
    getScenes:async ()=>{
      const obs=await getObs();
      if (!obs) return;
      const response = await obs.call('GetSceneList');
      return { sceneNames: response.scenes.map(s=>s.sceneName) };
    },
    setOptions:async (newOptions)=>{
      if (JSON.stringify(newOptions)==JSON.stringify(options)) return;
      obs?.disconnect();
      options=newOptions;
    }
  };

  const handleRequest=async (request)=>{
    console.debug('Handle request',request);
    const {type,...data}=request;
    const handler=handlers[type];
    if (handler) {
      return await handler(data);
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

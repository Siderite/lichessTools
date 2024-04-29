importScripts('obs-websocket.js')

  let options=null;
  let obs=null;

  const getObs=async ()=>{
    if (!options) throw new Error('Options not defined');
    if (!obs) {
      obs=new OBSWebSocket();
    }
    if (!obs.socket) {
      await obs.connect(options.url, options.password, options.connectOptions);
    }
    return obs;
  }

  const handlers={
    sceneChange:async (data)=>{
      const obs=await getObs();
      await obs.call('SetCurrentProgramScene',data);
    },
    getScenes:async ()=>{
      const obs=await getObs();
      const response = await obs.call('GetSceneList');
      return response.scenes.map(s=>s.sceneName);
    },
    setOptions:async (newOptions)=>{
      if (JSON.stringify(newOptions)==JSON.stringify(options)) return;
      obs?.disconnect();
      options=newOptions;
    }
  };

  const handleRequest=async (request)=>{
    console.log('Handle request',request);
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

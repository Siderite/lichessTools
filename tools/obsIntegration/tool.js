(()=>{
  class ObsIntegrationTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'obsIntegration',
        category: 'integration',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: false,
        hidden: true
      },
      {
        name:'obsIntegration.url',
        category: 'integration',
        type:'text',
        defaultValue: 'ws://127.0.0.1:4455',
        advanced: true,
        hidden: true
      },
      {
        name:'obsIntegration.password',
        category: 'integration',
        type:'text',
        defaultValue: undefined,
        advanced: true,
        hidden: true
      },
      {
        name:'obsIntegration.options',
        category: 'integration',
        type:'text',
        defaultValue: '{ "rpcVersion": 1 }',
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.integration': 'Integration',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)',
        'options.obsIntegration.url': 'OBS URL',
        'options.obsIntegration.password': 'OBS password',
        'options.obsIntegration.options': 'OBS connection options',
        'obsIntegration.csp': 'Lichess is blocking communication with OBS'
      },
      'ro-RO':{
        'options.integration': 'Integrare',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)',
        'options.obsIntegration.url': 'URL OBS',
        'options.obsIntegration.password': 'Parola OBS',
        'options.obsIntegration.options': 'Op\u0163iuni conectare OBS',
        'obsIntegration.csp': 'Lichess blocheaz\u0103 comunicarea cu OBS'
      }
    }

    connect=async ()=>{
      if (this.CSP) return;
      try {
        const obs = new OBSWebSocket();
        this.data = await obs.connect(this.options.url, this.options.password, this.options.connectOptions);
        this.data.obs=obs;
        console.log(`Connected to server ${this.data.obsWebSocketVersion} (using RPC ${this.data.negotiatedRpcVersion})`)
      } catch (error) {
        this.data=null;
        console.error('Failed to connect', error.code, error.message);
      }
    };

    CSP=false;
    securityPolicyViolation=(ev)=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      if (ev.blockedURI.replace(/\/+$/g,'')===this.options.url?.replace(/\/+$/g,'')) {
        parent.announce(trans.noarg('obsIntegration.csp'));
        this.CSP=true;
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('obsIntegration');
      this.logOption('OBS Integration', value);
      this.options={
        url:parent.currentOptions.getValue('obsIntegration.url'),
        password:parent.currentOptions.getValue('obsIntegration.password'),
        connectOptions:parent.jsonParse(parent.currentOptions.getValue('obsIntegration.options'))
      }
      this.logOption(' ... options', this.options);
      parent.global.document.removeEventListener("securitypolicyviolation", this.securityPolicyViolation);
      if (!value) {
        this.data?.obs?.disconnect();
        return;
      }
      parent.global.document.addEventListener("securitypolicyviolation", this.securityPolicyViolation);
      if (!this.data?.obs) {
        parent.global.setTimeout(this.connect,1);
      }
    }

  }
  LiChessTools.Tools.ObsIntegration=ObsIntegrationTool;
})();

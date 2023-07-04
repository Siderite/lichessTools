(()=>{
  class ShowFlagsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'showFlags',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showFlags': 'Show player country flags'
      },
      'ro-RO':{
        'options.study': 'General',
        'options.showFlags': 'Arat\u0103 steagurile \u0163\u0103rilor juc\u0103torilor'
      }
    }

    countries = [
      ['AD', 'Andorra'],
      ['AE', 'United Arab Emirates'],
      ['AF', 'Afghanistan'],
      ['AG', 'Antigua and Barbuda'],
      ['AI', 'Anguilla'],
      ['AL', 'Albania'],
      ['AM', 'Armenia'],
      ['AM-RA', 'Artsakh'],
      ['AO', 'Angola'],
      ['AQ', 'Antarctica'],
      ['AR', 'Argentina'],
      ['AS', 'American Samoa'],
      ['AT', 'Austria'],
      ['AU', 'Australia'],
      ['AW', 'Aruba'],
      ['AX', 'Aland Islands'],
      ['AZ', 'Azerbaijan'],
      ['BA', 'Bosnia-Herzegovina'],
      ['BB', 'Barbados'],
      ['BD', 'Bangladesh'],
      ['BE', 'Belgium'],
      ['BF', 'Burkina Faso'],
      ['BG', 'Bulgaria'],
      ['BH', 'Bahrain'],
      ['BI', 'Burundi'],
      ['BJ', 'Benin'],
      ['BL', 'Saint Barthelemy'],
      ['BM', 'Bermuda'],
      ['BN', 'Brunei'],
      ['BO', 'Bolivia'],
      ['BQ', 'Bonaire, Sint Eustatius and Saba'],
      ['BR', 'Brazil'],
      ['BS', 'Bahamas'],
      ['BT', 'Bhutan'],
      ['BV', 'Bouvet Island'],
      ['BW', 'Botswana'],
      ['BY', 'Belarus'],
      ['BZ', 'Belize'],
      ['CA', 'Canada'],
      ['CA-QC', 'Quebec'],
      ['CC', 'Cocos (Keeling) Islands'],
      ['CD', 'Congo (Democratic Rep.)'],
      ['CF', 'Central African Republic'],
      ['CG', 'Congo (Brazzaville)'],
      ['CH', 'Switzerland'],
      ['CI', 'Cote d\'Ivoire'],
      ['CK', 'Cook Islands'],
      ['CL', 'Chile'],
      ['CM', 'Cameroon'],
      ['CN', 'China'],
      ['CO', 'Colombia'],
      ['CR', 'Costa Rica'],
      ['CU', 'Cuba'],
      ['CV', 'Cape Verde'],
      ['CW', 'Cura\u00E7ao'],
      ['CX', 'Christmas Island'],
      ['CY', 'Cyprus'],
      ['CZ', 'Czechia'],
      ['DE', 'Germany'],
      ['DJ', 'Djibouti'],
      ['DK', 'Denmark'],
      ['DM', 'Dominica'],
      ['DO', 'Dominican Republic'],
      ['DZ', 'Algeria'],
      ['EC', 'Ecuador'],
      ['EE', 'Estonia'],
      ['EG', 'Egypt'],
      ['EH', 'Western Sahara'],
      ['ER', 'Eritrea'],
      ['ES', 'Spain'],
      ['ES-AN', 'Andalusia'],
      ['ES-CT', 'Catalonia'],
      ['ES-EU', 'Basque Country'],
      ['ES-GA', 'Galicia'],
      ['ET', 'Ethiopia'],
      ['FI', 'Finland'],
      ['FJ', 'Fiji'],
      ['FK', 'Falkland Islands'],
      ['FM', 'Micronesia'],
      ['FO', 'Faroe Islands'],
      ['FR', 'France'],
      ['GA', 'Gabon'],
      ['GB', 'United Kingdom'],
      ['GB-ENG', 'England'],
      ['GB-NIR', 'Northern Ireland'],
      ['GB-SCT', 'Scotland'],
      ['GB-WLS', 'Wales'],
      ['GD', 'Grenada'],
      ['GE', 'Georgia'],
      ['GF', 'French Guiana'],
      ['GG', 'Guernsey'],
      ['GH', 'Ghana'],
      ['GI', 'Gibraltar'],
      ['GL', 'Greenland'],
      ['GM', 'Gambia'],
      ['GN', 'Guinea'],
      ['GP', 'Guadeloupe'],
      ['GQ', 'Equatorial Guinea'],
      ['GR', 'Greece'],
      ['GS', 'South Georgia and the South Sandwich Islands'],
      ['GT', 'Guatemala'],
      ['GU', 'Guam'],
      ['GW', 'Guinea-Bissau'],
      ['GY', 'Guyana'],
      ['HK', 'Hong Kong'],
      ['HM', 'Heard Island and McDonald Islands'],
      ['HN', 'Honduras'],
      ['HR', 'Croatia'],
      ['HT', 'Haiti'],
      ['HU', 'Hungary'],
      ['ID', 'Indonesia'],
      ['IE', 'Ireland'],
      ['IL', 'Israel'],
      ['IM', 'Isle of Man'],
      ['IN', 'India'],
      ['IO', 'British Indian Ocean Territory'],
      ['IQ', 'Iraq'],
      ['IR', 'Iran'],
      ['IS', 'Iceland'],
      ['IT', 'Italy'],
      ['JE', 'Jersey'],
      ['JM', 'Jamaica'],
      ['JO', 'Jordan'],
      ['JP', 'Japan'],
      ['KE', 'Kenya'],
      ['KG', 'Kyrgyzstan'],
      ['KH', 'Cambodia'],
      ['KI', 'Kiribati'],
      ['KM', 'Comoros'],
      ['KN', 'Saint Kitts and Nevis'],
      ['KP', 'North Korea'],
      ['KR', 'South Korea'],
      ['KW', 'Kuwait'],
      ['KY', 'Cayman Islands'],
      ['KZ', 'Kazakhstan'],
      ['LA', 'Laos'],
      ['LB', 'Lebanon'],
      ['LC', 'Saint Lucia'],
      ['LI', 'Liechtenstein'],
      ['LK', 'Sri Lanka'],
      ['LR', 'Liberia'],
      ['LS', 'Lesotho'],
      ['LT', 'Lithuania'],
      ['LU', 'Luxembourg'],
      ['LV', 'Latvia'],
      ['LY', 'Libya'],
      ['MA', 'Morocco'],
      ['MC', 'Monaco'],
      ['MD', 'Moldova'],
      ['ME', 'Montenegro'],
      ['MF', 'Saint Martin'],
      ['MG', 'Madagascar'],
      ['MH', 'Marshall Islands'],
      ['MK', 'North Macedonia'],
      ['ML', 'Mali'],
      ['MM', 'Myanmar'],
      ['MN', 'Mongolia'],
      ['MO', 'Macao'],
      ['MP', 'Northern Mariana Islands'],
      ['MQ', 'Martinique'],
      ['MR', 'Mauritania'],
      ['MS', 'Montserrat'],
      ['MT', 'Malta'],
      ['MU', 'Mauritius'],
      ['MV', 'Maldives'],
      ['MW', 'Malawi'],
      ['MX', 'Mexico'],
      ['MY', 'Malaysia'],
      ['MZ', 'Mozambique'],
      ['NA', 'Namibia'],
      ['NC', 'New Caledonia'],
      ['NE', 'Niger'],
      ['NF', 'Norfolk Island'],
      ['NG', 'Nigeria'],
      ['NI', 'Nicaragua'],
      ['NL', 'Netherlands'],
      ['NO', 'Norway'],
      ['NP', 'Nepal'],
      ['NR', 'Nauru'],
      ['NU', 'Niue'],
      ['NZ', 'New Zealand'],
      ['OM', 'Oman'],
      ['PA', 'Panama'],
      ['PE', 'Peru'],
      ['PF', 'French Polynesia'],
      ['PG', 'Papua New Guinea'],
      ['PH', 'Philippines'],
      ['PK', 'Pakistan'],
      ['PL', 'Poland'],
      ['PM', 'Saint Pierre and Miquelon'],
      ['PN', 'Pitcairn'],
      ['PR', 'Puerto Rico'],
      ['PS', 'Palestine'],
      ['PT', 'Portugal'],
      ['PW', 'Palau'],
      ['PY', 'Paraguay'],
      ['QA', 'Qatar'],
      ['RE', 'Reunion'],
      ['RO', 'Romania'],
      ['RS', 'Serbia'],
      ['RU', 'Russia'],
      ['RU-TAT', 'Tatarstan'],
      ['RW', 'Rwanda'],
      ['SA', 'Saudi Arabia'],
      ['SB', 'Solomon Islands'],
      ['SC', 'Seychelles'],
      ['SD', 'Sudan'],
      ['SE', 'Sweden'],
      ['SG', 'Singapore'],
      ['SH', 'Saint Helena'],
      ['SI', 'Slovenia'],
      ['SJ', 'Svalbard and Jan Mayen'],
      ['SK', 'Slovakia'],
      ['SL', 'Sierra Leone'],
      ['SM', 'San Marino'],
      ['SN', 'Senegal'],
      ['SO', 'Somalia'],
      ['SR', 'Suriname'],
      ['SS', 'South Sudan'],
      ['ST', 'Sao Tome and Principe'],
      ['SV', 'El Salvador'],
      ['SX', 'Sint Maarten'],
      ['SY', 'Syria'],
      ['SZ', 'Eswatini'],
      ['TC', 'Turks and Caicos'],
      ['TD', 'Chad'],
      ['TF', 'French Southern Territories'],
      ['TG', 'Togo'],
      ['TH', 'Thailand'],
      ['TJ', 'Tajikistan'],
      ['TK', 'Tokelau'],
      ['TL', 'Timor-Leste'],
      ['TM', 'Turkmenistan'],
      ['TN', 'Tunisia'],
      ['TO', 'Tonga'],
      ['TR', 'Turkey'],
      ['TT', 'Trinidad and Tobago'],
      ['TV', 'Tuvalu'],
      ['TW', 'Taiwan'],
      ['TZ', 'Tanzania'],
      ['UA', 'Ukraine'],
      ['UG', 'Uganda'],
      ['UM', 'United States Minor Outlying Islands'],
      ['US', 'United States'],
      ['UY', 'Uruguay'],
      ['UZ', 'Uzbekistan'],
      ['VA', 'Holy See'],
      ['VC', 'Saint Vincent and the Grenadines'],
      ['VE', 'Venezuela'],
      ['VG', 'British Virgin Islands'],
      ['VI', 'U.S. Virgin Islands'],
      ['VN', 'Vietnam'],
      ['VU', 'Vanuatu'],
      ['WF', 'Wallis and Futuna'],
      ['WS', 'Samoa'],
      ['XK', 'Kosovo'],
      ['YE', 'Yemen'],
      ['YT', 'Mayotte'],
      ['ZA', 'South Africa'],
      ['ZM', 'Zambia'],
      ['ZW', 'Zimbabwe'],
      ['EU', 'European Union'],
      ['_adygea', 'Adygea'],
      ['_belarus-wrw', 'Belarus White-red-white'],
      ['_east-turkestan', 'East Turkestan'],
      ['_lichess', 'Lichess'],
      ['_pirate', 'Pirate'],
      ['_rainbow', 'Rainbow'],
      ['_russia-wbw', 'Russia White-blue-white'],
      ['_united-nations', 'United Nations'],
      ['_earth', 'Earth'],
      ['_transgender', 'Transgender']
    ];
    getElementsForFlag=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const dict = {};
      $('.user-link,a[href^="/@/"]').each((i,e)=> {
        let textEl = $('a.text',e);
        if (!textEl.length) textEl=$(e);
        if (textEl.is('.lichessTools-noflag')) return;
        const next=textEl.next();
        if (next.is('img.flag')) return;
        if (next.has('img.flag').length) return;
        if (textEl.attr('data-icon')) return;
        if (textEl.attr('data-tab')) return;
        let url=textEl.attr('href')||textEl.data('href');
        if (!url) return;
        const m= /\/@\/([^\/]+)\/?$/.exec(url);
        const userId=m&&m[1];
        if (!userId) return;
        const list = dict[userId]||[];
        list.push(textEl);
        dict[userId.toLowerCase()]=list;
      });
      return dict;
    };

    cacheExpiration=86400000; //1 day
    get flagCache() {
       const global=this.lichessTools.global;
       if (this._flagCache) return this._flagCache;
       try {
         const temp=global.localStorage.getItem('LiChessTools.flagCache')
         if (temp) global.console.debug('Size of flag cache:',temp.length);
         this._flagCache=new Map(temp?JSON.parse(temp):{});
       } catch(e) {
         global.console.warn('Error parsing flag cache:',e);
         this._flagCache=new Map()
       }
       return this._flagCache;
    }
    get countryCache() {
       const global=this.lichessTools.global;
       if (this._countryCache) return this._countryCache;
       try {
         const temp=global.localStorage.getItem('LiChessTools.countryCache')
         if (temp) global.console.debug('Size of country cache:',temp.length);
         this._countryCache=new Map(temp?JSON.parse(temp):this.countries);
       } catch(e) {
         global.console.warn('Error parsing country cache:',e);
         this._countryCache=new Map(this.countries);
       }
       return this._countryCache;
    }
    saveCache=()=>{
      const cache=this.flagCache;
      for(const userId of cache.keys()) {
        const time=cache.get(userId).time;
        if (new Date().getTime()-new Date(time)>this.cacheExpiration) cache.delete(userId);
      }
      this.lichessTools.global.localStorage.setItem('LiChessTools.countryCache',JSON.stringify([...this.countryCache]));
      this.lichessTools.global.localStorage.setItem('LiChessTools.flagCache',JSON.stringify([...this.flagCache]));
    };
    debouncedSaveCache=this.lichessTools.debounce(this.saveCache,100);
    processFlags=async ()=> {
      const parent=this.lichessTools;
      const $=parent.$;
      const flagsEnabled=parent.currentOptions.getValue('showFlags');
      if (!flagsEnabled) return;
      const dict=this.getElementsForFlag();
      const data=Object.keys(dict).map(userId=>{
        const item=this.flagCache.get(userId);
        return item || { id:userId };
      });
      let toSaveCache=false;
      const userIds=data.filter(i=>!i.countryName).map(i=>i.id).slice(0,200);
      if (userIds.length) {
        const json = await parent.net.fetch('/api/users',{ method:'POST',body:userIds.join(',') });
        const users=JSON.parse(json);
        for (const user of users) {
          const item = data.find(i=>i.id===user.id)
          if (item) item.country=user.profile?.country||'noflag';
        }
        let firstToProcess=null;
        for (const item of data) {
          if (!item.country) {
            continue;
          }
          if (item.country==='noflag') {
            item.countryName='noflag';
            item.time=new Date().getTime();
            this.flagCache.set(item.id,item);
            toSaveCache=true;
            continue;
          }
          item.countryName=this.countryCache.get(item.country);
          if (item.countryName) {
            item.time=new Date().getTime();
            this.flagCache.set(item.id,item);
            toSaveCache=true;
          }
          if (!item.countryName && !firstToProcess) {
            firstToProcess=item;
          }
        }
        if (firstToProcess) {
          const html=await parent.net.fetch('/@/'+firstToProcess.id+'/mini');
          const m=/<span class="upt__info__top__country".*?>(?:.|\r|\n)*?<\/span>/.exec(html);
          if (m) {
            const el=$(m[0]);
            firstToProcess.countryName=el.text()||el.attr('title');
          }
          if (firstToProcess.countryName) {
            this.countryCache.set(firstToProcess.country,firstToProcess.countryName);
            firstToProcess.time=new Date().getTime();
            this.flagCache.set(firstToProcess.id,firstToProcess);
            toSaveCache=true;
          }
        }
      }
      if (toSaveCache) {
		this.debouncedSaveCache();
      }
      for (const item of data) {
        if (!item.countryName) continue;
        const elems=dict[item.id];
        for (const elem of elems) {
          if (!elem[0]?.parentNode) return;
          const next=elem.next();
          if (next.is('img.flag')) return;
          if (next.has('img.flag').length) return;
          if (item.countryName=='noflag') {
            elem.addClass('lichessTools-noflag');
          } else {
            elem.after($('<img>')
              .addClass('flag')
              .addClass('lichessTools')
              .addClass('lichessTools-wave')
              .attr('title',item.countryName)
              .attr('src',parent.lichess.assetUrl('images/flags/'+item.country+'.png'))
            );
          }
        }
      }
      this.debouncedProcessFlags();
    };
    debouncedProcessFlags=this.lichessTools.debounce(this.processFlags,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showFlags');
      this.logOption('Show player flags', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      $('img.flag.lichessTools').remove();
      lichess.pubsub.off('content-loaded',this.debouncedProcessFlags);
      lichess.pubsub.off('socket.in.crowd',this.debouncedProcessFlags);
      if (!value) return;

      this.debouncedProcessFlags();
      lichess.pubsub.on('content-loaded',this.debouncedProcessFlags);
      lichess.pubsub.on('socket.in.crowd',this.debouncedProcessFlags);
    }

  }
  LiChessTools.Tools.ShowFlags=ShowFlagsTool;
})();

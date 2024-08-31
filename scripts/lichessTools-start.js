const start = ()=>setTimeout(()=>lichessTools.start(window.site));
const load = window.site?.load;
load?.then(start);

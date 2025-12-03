const start = () => window.setTimeout(() => {
  lichessTools.start(window.site);
},100);

const trueLoad = new Promise((resolve) => {
  const f = ()=>{
    if (window.site?.info) {
      resolve(window.site);
    } else {
      setTimeout(f,100);
    }
  };
  f();
});

//const load = window.site?.load;
const load = trueLoad;
if (load) {
  load.then(start);
} else {
  start();
}


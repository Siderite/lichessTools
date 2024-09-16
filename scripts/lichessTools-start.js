const start = () => window.setTimeout(() => lichessTools.start(window.site),100);
const load = window.site?.load;
if (load) {
  load.then(start);
} else {
  start();
}


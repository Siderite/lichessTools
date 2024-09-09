const start = () => setTimeout(() => lichessTools.start(window.site));
const load = window.site?.load;
if (load) {
  load.then(start);
} else {
  window.setTimeout(start, 100);
}

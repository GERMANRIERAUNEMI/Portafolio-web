(function () {
  "use strict";
  var guardado = null;
  try {
    guardado = localStorage.getItem("tema");
  } catch (error) {
  }
  var prefiereOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var tema = guardado === "dark" || guardado === "light" ? guardado : prefiereOscuro ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", tema);
})();

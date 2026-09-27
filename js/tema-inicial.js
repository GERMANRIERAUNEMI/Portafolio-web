/**
 * tema-inicial.js
 * Se carga en el <head> SIN defer para aplicar el tema antes de dibujar la
 * página. Así no hay un "parpadeo" blanco cuando el tema guardado es oscuro.
 */
(function () {
  "use strict";
  var guardado = null;
  try {
    guardado = localStorage.getItem("tema");
  } catch (error) {
    // Sin acceso a localStorage (modo privado estricto): se usa el del sistema
  }
  var prefiereOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var tema = guardado === "dark" || guardado === "light" ? guardado : prefiereOscuro ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", tema);
})();

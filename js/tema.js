/**
 * tema.js — Funcionalidad 1: cambio entre tema claro y oscuro.
 * La preferencia se guarda en localStorage para la próxima visita.
 */
(function () {
  "use strict";

  const raiz = document.documentElement;
  const botones = document.querySelectorAll("[data-theme-toggle]");

  function temaActual() {
    return raiz.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function actualizarBotones() {
    const siguiente = temaActual() === "dark" ? "claro" : "oscuro";
    botones.forEach((boton) => boton.setAttribute("aria-label", `Cambiar a tema ${siguiente}`));
  }

  function cambiarTema() {
    const nuevo = temaActual() === "dark" ? "light" : "dark";
    raiz.setAttribute("data-theme", nuevo);
    try {
      localStorage.setItem("tema", nuevo);
    } catch (error) {
      // Si no se puede guardar, el tema igual cambia en esta visita
    }
    actualizarBotones();
    // Aviso para otras partes del sitio (el Design System actualiza sus colores)
    document.dispatchEvent(new CustomEvent("tema:cambiado", { detail: { tema: nuevo } }));
  }

  botones.forEach((boton) => boton.addEventListener("click", cambiarTema));
  actualizarBotones();
})();

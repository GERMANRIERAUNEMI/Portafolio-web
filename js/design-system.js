/**
 * design-system.js
 * Lee el valor real de cada color desde las variables CSS y lo muestra en
 * su muestra. Se actualiza al cambiar entre tema claro y oscuro.
 */
(function () {
  "use strict";

  const etiquetas = document.querySelectorAll("[data-token]");

  /** Convierte "rgb(51, 70, 211)" en "#3346d3". Si ya es hex, lo deja igual. */
  function aHex(valor) {
    const partes = valor.match(/\d+(\.\d+)?/g);
    if (!valor.startsWith("rgb") || !partes) return valor;
    return "#" + partes.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  }

  function mostrarValores() {
    const estilos = getComputedStyle(document.documentElement);
    etiquetas.forEach((etiqueta) => {
      const valor = estilos.getPropertyValue(etiqueta.dataset.token).trim();
      if (valor) etiqueta.textContent = aHex(valor).toLowerCase();
    });
  }

  mostrarValores();
  document.addEventListener("tema:cambiado", mostrarValores);
})();

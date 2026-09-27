(function () {
  "use strict";

  const etiquetas = document.querySelectorAll("[data-token]");

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

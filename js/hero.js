/**
 * hero.js — Animación de entrada del nombre.
 * Las letras aparecen en desorden sobre sus guiones, como en el juego
 * del ahorcado (uno de mis proyectos). Solo ocurre una vez al cargar.
 */
(function () {
  "use strict";

  const titulo = document.querySelector("[data-reveal-name]");
  if (!titulo) return;

  const nombre = titulo.textContent.trim();
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // El texto real queda para lectores de pantalla; las letras sueltas se ocultan
  titulo.setAttribute("aria-label", nombre);
  titulo.textContent = "";

  const casillas = [];
  nombre.split(/\s+/).forEach((palabra) => {
    const bloque = document.createElement("span");
    bloque.className = "name-word";
    bloque.setAttribute("aria-hidden", "true");

    [...palabra].forEach((letra) => {
      const casilla = document.createElement("span");
      casilla.className = "name-slot";
      const texto = document.createElement("span");
      texto.className = "name-slot__letter";
      texto.textContent = letra;
      casilla.appendChild(texto);
      bloque.appendChild(casilla);
      casillas.push(casilla);
    });

    titulo.appendChild(bloque);
  });

  if (sinMovimiento) {
    casillas.forEach((c) => c.classList.add("is-revealed"));
    return;
  }

  // Orden aleatorio, como cuando alguien va adivinando letras
  const orden = casillas.map((_, i) => i).sort(() => Math.random() - 0.5);
  orden.forEach((indice, paso) => {
    setTimeout(() => casillas[indice].classList.add("is-revealed"), 350 + paso * 90);
  });
})();

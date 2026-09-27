/**
 * navegacion.js
 * Funcionalidad 2: menú responsive para teléfonos.
 * Funcionalidad 3: navegación dinámica que marca la sección visible.
 * Funcionalidad 4: botón para volver al inicio.
 */
(function () {
  "use strict";

  /* ---------------- Menú responsive ---------------- */
  const botonMenu = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("menu-principal");

  function abrirMenu(abrir) {
    menu.classList.toggle("is-open", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
    botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => abrirMenu(!menu.classList.contains("is-open")));

    // Al elegir un enlace, el menú se cierra
    menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) abrirMenu(false);
    });

    // Escape cierra el menú y devuelve el foco al botón
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menu.classList.contains("is-open")) {
        abrirMenu(false);
        botonMenu.focus();
      }
    });

    // Si la pantalla se agranda, se limpia el estado del menú móvil
    window.matchMedia("(min-width: 52.01rem)").addEventListener("change", (e) => {
      if (e.matches) abrirMenu(false);
    });
  }

  /* ---------------- Sección actual en el menú ---------------- */
  const enlacesInternos = [...document.querySelectorAll('.navbar__link[href^="#"]')];
  const secciones = enlacesInternos
    .map((enlace) => document.querySelector(enlace.getAttribute("href")))
    .filter(Boolean);

  function marcarActual(id) {
    enlacesInternos.forEach((enlace) => {
      if (enlace.getAttribute("href") === `#${id}`) enlace.setAttribute("aria-current", "true");
      else enlace.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && secciones.length) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) marcarActual(entrada.target.id);
        });
      },
      // La sección cuenta como "actual" cuando cruza la franja central de la pantalla
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secciones.forEach((seccion) => observador.observe(seccion));
  }

  /* ---------------- Volver al inicio ---------------- */
  const botonArriba = document.querySelector("[data-back-to-top]");
  if (botonArriba) {
    const actualizar = () => botonArriba.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", actualizar, { passive: true });
    actualizar();

    botonArriba.addEventListener("click", () => {
      window.scrollTo({ top: 0 });
      // Lleva el foco al inicio para quien navega con teclado
      document.querySelector(".navbar__brand")?.focus({ preventScroll: true });
    });
  }

  /* ---------------- Año actual en el pie de página ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

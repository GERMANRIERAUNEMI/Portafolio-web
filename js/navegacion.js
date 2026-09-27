(function () {
  "use strict";

  const botonMenu = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("menu-principal");

  function abrirMenu(abrir) {
    menu.classList.toggle("is-open", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
    botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => abrirMenu(!menu.classList.contains("is-open")));

    menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) abrirMenu(false);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menu.classList.contains("is-open")) {
        abrirMenu(false);
        botonMenu.focus();
      }
    });

    window.matchMedia("(min-width: 52.01rem)").addEventListener("change", (e) => {
      if (e.matches) abrirMenu(false);
    });
  }

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
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secciones.forEach((seccion) => observador.observe(seccion));
  }

  const botonArriba = document.querySelector("[data-back-to-top]");
  if (botonArriba) {
    const actualizar = () => botonArriba.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", actualizar, { passive: true });
    actualizar();

    botonArriba.addEventListener("click", () => {
      window.scrollTo({ top: 0 });
      document.querySelector(".navbar__brand")?.focus({ preventScroll: true });
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

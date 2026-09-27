(function () {
  "use strict";

  const botones = document.querySelectorAll("[data-filter]");
  const tarjetas = document.querySelectorAll(".card[data-tech]");
  const aviso = document.querySelector("[data-filter-status]");
  const vacio = document.querySelector("[data-projects-empty]");

  function filtrar(tecnologia) {
    let visibles = 0;
    tarjetas.forEach((tarjeta) => {
      const tecnologias = tarjeta.dataset.tech.split(" ");
      const mostrar = tecnologia === "todos" || tecnologias.includes(tecnologia);
      tarjeta.hidden = !mostrar;
      if (mostrar) visibles += 1;
    });

    botones.forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.filter === tecnologia));
    });

    if (vacio) vacio.hidden = visibles > 0;
    if (aviso) aviso.textContent = `${visibles} ${visibles === 1 ? "proyecto" : "proyectos"} visibles`;
  }

  botones.forEach((boton) => boton.addEventListener("click", () => filtrar(boton.dataset.filter)));

  const modal = document.querySelector("[data-project-modal]");
  if (!modal) return;

  const tituloModal = modal.querySelector(".modal__title");
  const cuerpoModal = modal.querySelector("[data-modal-body]");
  let botonQueAbrio = null;

  function abrirProyecto(tarjeta, boton) {
    const titulo = tarjeta.querySelector(".card__title").textContent;
    const imagen = tarjeta.querySelector(".card__media img");
    const detalle = tarjeta.querySelector("template.card__detail");
    const tecnologias = tarjeta.querySelector(".badge-list");
    const enlaces = tarjeta.querySelectorAll(".card__actions a");

    tituloModal.textContent = titulo;
    cuerpoModal.replaceChildren();

    if (imagen) {
      const copia = imagen.cloneNode();
      copia.loading = "eager";
      cuerpoModal.appendChild(copia);
    }
    if (detalle) cuerpoModal.appendChild(detalle.content.cloneNode(true));

    if (tecnologias) {
      const subtitulo = document.createElement("h4");
      subtitulo.textContent = "Tecnologías";
      cuerpoModal.append(subtitulo, tecnologias.cloneNode(true));
    }

    if (enlaces.length) {
      const acciones = document.createElement("div");
      acciones.className = "card__actions";
      enlaces.forEach((enlace) => acciones.appendChild(enlace.cloneNode(true)));
      cuerpoModal.appendChild(acciones);
    }

    botonQueAbrio = boton;
    modal.showModal();
  }

  document.querySelectorAll("[data-open-project]").forEach((boton) => {
    boton.addEventListener("click", () => abrirProyecto(boton.closest(".card"), boton));
  });

  modal.querySelector("[data-close-modal]").addEventListener("click", () => modal.close());

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });

  modal.addEventListener("close", () => botonQueAbrio?.focus());
})();

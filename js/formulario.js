/**
 * formulario.js — Funcionalidad 7: validación del formulario de contacto.
 * Muestra mensajes claros junto a cada campo. Como GitHub Pages no tiene
 * servidor, el mensaje se envía al correo de data-email mediante FormSubmit.
 */
(function () {
  "use strict";

  const formulario = document.querySelector("[data-contact-form]");
  if (!formulario) return;

  const estado = formulario.querySelector("[data-form-status]");
  const campos = formulario.querySelectorAll(".input, .textarea");

  /** Devuelve el mensaje de error de un campo, o "" si es válido. */
  function mensajeDeError(campo) {
    const valor = campo.value.trim();
    const etiqueta = formulario.querySelector(`label[for="${campo.id}"]`).textContent.toLowerCase();

    if (campo.required && !valor) return `Escribe tu ${etiqueta}.`;
    if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      return "Escribe un correo válido, por ejemplo nombre@dominio.com.";
    }
    if (campo.minLength > 0 && valor.length < campo.minLength) {
      return `Usa al menos ${campo.minLength} caracteres (llevas ${valor.length}).`;
    }
    if (campo.maxLength > 0 && valor.length > campo.maxLength) {
      return `Usa como máximo ${campo.maxLength} caracteres (llevas ${valor.length}).`;
    }
    return "";
  }

  // Contador de caracteres del mensaje
  const mensaje = formulario.querySelector("#mensaje");
  const contador = formulario.querySelector("[data-char-count]");
  function actualizarContador() {
    if (contador) contador.textContent = `${mensaje.value.trim().length} / ${mensaje.maxLength}`;
  }
  if (mensaje) {
    mensaje.addEventListener("input", actualizarContador);
    formulario.addEventListener("reset", () => setTimeout(actualizarContador));
  }

  function validar(campo) {
    const error = mensajeDeError(campo);
    const contenedor = campo.closest(".field");
    const salida = document.getElementById(`error-${campo.id}`);
    contenedor.classList.toggle("field--error", Boolean(error));
    campo.setAttribute("aria-invalid", String(Boolean(error)));
    if (salida) salida.textContent = error;
    return !error;
  }

  // Valida al salir de cada campo, y mientras escribe si ya tenía error
  campos.forEach((campo) => {
    campo.addEventListener("blur", () => validar(campo));
    campo.addEventListener("input", () => {
      if (campo.closest(".field").classList.contains("field--error")) validar(campo);
    });
  });

  const boton = formulario.querySelector('button[type="submit"]');

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const resultados = [...campos].map(validar);
    const primeroConError = [...campos].find((_, i) => !resultados[i]);

    if (primeroConError) {
      estado.textContent = "Revisa los campos marcados.";
      estado.className = "form-status form-status--error";
      primeroConError.focus();
      return;
    }

    // Envío real con FormSubmit (formsubmit.co): reenvía el mensaje a data-email
    const datos = new FormData(formulario);
    const destino = formulario.dataset.email;

    boton.disabled = true;
    estado.textContent = "Enviando…";
    estado.className = "form-status";

    try {
      const respuesta = await fetch(`https://formsubmit.co/ajax/${destino}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre").trim(),
          email: datos.get("email").trim(),
          mensaje: datos.get("mensaje").trim(),
          _subject: `Contacto desde el portafolio: ${datos.get("nombre").trim()}`,
          _replyto: datos.get("email").trim(),
          _template: "table",
          _honey: datos.get("_honey") || "",
        }),
      });
      const resultado = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || String(resultado.success) === "false") throw new Error(resultado.message);

      estado.textContent = "¡Gracias! Tu mensaje fue enviado. Te responderé pronto.";
      estado.className = "form-status form-status--success";
      formulario.reset();
    } catch (error) {
      estado.textContent = explicarError(error, destino);
      estado.className = "form-status form-status--error";
    } finally {
      boton.disabled = false;
    }
  });

  /** Traduce los fallos más comunes de FormSubmit a un mensaje claro. */
  function explicarError(error, destino) {
    const detalle = String(error && error.message).toLowerCase();
    if (detalle.includes("activat")) {
      return `El formulario todavía no está activado. Revisa la bandeja de ${destino} (y spam) y pulsa "Activate Form".`;
    }
    if (location.protocol === "file:" || detalle.includes("web server")) {
      return "El envío solo funciona con la página publicada (GitHub Pages) o con Live Server, no abriendo el archivo con doble clic.";
    }
    return `No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme a ${destino}.`;
  }

  // Copiar el correo de "Otras formas de contacto" sin abrir otra pestaña
  const copiar = document.querySelector("[data-copy-email]");
  const avisoCopia = document.querySelector("[data-copy-status]");
  if (copiar) {
    copiar.addEventListener("click", async () => {
      const correo = copiar.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(correo);
        avisoCopia.textContent = "¡Correo copiado! Pégalo en tu programa de correo.";
      } catch {
        avisoCopia.textContent = `Copia este correo: ${correo}`;
      }
      clearTimeout(copiar.temporizador);
      copiar.temporizador = setTimeout(() => { avisoCopia.textContent = ""; }, 4000);
    });
  }
})();

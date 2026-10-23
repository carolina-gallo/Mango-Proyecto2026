
let usuarios = [];
let recetas = [];

const scrolleo = document.querySelector(".scrolleo");

fetch('http://localhost:3000/mango/feedRecetas')
  .then(response => response.json())
  .then(data => {
    recetas = data;
    mostrarRecetas(recetas);
    activarRecorteDescripciones();
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
    scrolleo.innerHTML = "<p>No se pudieron cargar las recetas</p>";
  });

function mostrarRecetas(recetas) {
  scrolleo.innerHTML = "";

  recetas.forEach(receta => {
    const section = document.createElement("section");
    section.className = "publicacion";
    section.dataset.id = receta.id;
    section.innerHTML = `
        <figure class="imagen">
            <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.nombre}">
            <p class="nombredeusuario">${receta.id_usuario}</p>
        </figure>
        <div class="contenido">
            <h2 class="titulo">${receta.nombre}</h2>
            <p class="descripcion">${receta.descripcion}</p>
        </div>
        <div class="interacciones">
            <span><img class="guardado" src="guardado.png" alt="guardar"></span>
            <span><img class="comentarios" src="comentariosr.png" alt="comentar"></span>
            <span><img class="hipervinculo" src="link.png" alt="hipervinculo"></span>
        </div>
        <div class="filtros">
            <span class="filtro"></span>
            <span class="filtro"></span>
            <span class="filtro"></span>
        </div>`;
        
    scrolleo.appendChild(section);
  });
}

function activarRecorteDescripciones() {
  const descripciones = document.querySelectorAll(".descripcion");

  descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;

    if (completo.length > 47) {
      descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas" style="cursor: pointer; font-weight: bold;">... más</span>';

      descripcion.querySelector(".mas").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "recetas-informacion.html";
      });
    }
  });
}

// Delegación de clic: detecta clics en cualquier receta generada
scrolleo.addEventListener("click", (e) => {
  const objetivo = e.target;
  const esClickeable = objetivo.classList.contains("titulo") || 
                       objetivo.classList.contains("fotoReceta") || 
                       objetivo.classList.contains("descripcion");

  if (!esClickeable) return;

  const publicacion = objetivo.closest(".publicacion");
  if (!publicacion) return;

  const receta = {
    titulo: publicacion.querySelector(".titulo").textContent,
    foto: publicacion.querySelector(".fotoReceta").src,
    descripcion: publicacion.querySelector(".descripcion").textContent,
    username: publicacion.querySelector(".nombredeusuario").textContent
  };

  localStorage.setItem("recetaSeleccionada", JSON.stringify(receta));
  window.location.href = "recetas-informacion.html";
});

/* A CHEQUEAR
// ===== POPUP DE BANDEJAS =====
const bandejaPopup = document.getElementById("bandejaPopup");
const vistas = document.querySelectorAll(".bandeja-vista");
const inputBandeja = document.getElementById("input-bandeja");
const vistaLista = document.getElementById("vista-lista");
const idUsuario = Number(localStorage.getItem("id"));

let recetaGuardando = null; // { id, icono } de la receta que se está guardando

function mostrarVista(id) {
    vistas.forEach((vista) => {
        vista.hidden = vista.id !== id;
    });
}

// Delegación de eventos: funciona con las recetas que se crean con el fetch
scrolleo.addEventListener("click", (e) => {
    const icono = e.target.closest(".guardado");
    if (!icono) return;

    recetaGuardando = {
        id: icono.closest(".publicacion").dataset.id,
        icono: icono
    };
    inputBandeja.value = "";
    mostrarVista("vista-opciones");
    bandejaPopup.showModal();
});

// Cerrar tocando el fondo
bandejaPopup.addEventListener("click", (e) => {
    if (e.target === bandejaPopup) bandejaPopup.close();
});

// Guarda la receta en la bandeja y pone el ícono amarillo
async function guardarEnBandeja(idBandeja) {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/guardarRec", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idBandeja: idBandeja, idRec: recetaGuardando.id })
        });

        if (respuesta.ok) {
            recetaGuardando.icono.src = "guardado-amariillo.png";
            bandejaPopup.close();
        }
    } catch (error) {
        console.error("No se pudo guardar la receta:", error);
    }
}

// Opción 1: crear bandeja
document.getElementById("opcion-crear").addEventListener("click", () => {
    mostrarVista("vista-crear");
    inputBandeja.focus();
});

document.getElementById("boton-crear-bandeja").addEventListener("click", async () => {
    const nombre = inputBandeja.value.trim();
    if (nombre === "") return;

    try {
        const respuesta = await fetch("http://localhost:3000/mango/crearBandeja", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: idUsuario,
                imagen_bandeja: "default.jpg",
                nombre_bandeja: nombre,
                filtros: {}
            })
        });
        const bandeja = await respuesta.json();
        guardarEnBandeja(bandeja.id);
    } catch (error) {
        console.error("No se pudo crear la bandeja:", error);
    }
});

// Opción 2: agregar a una bandeja ya existente
document.getElementById("opcion-existente").addEventListener("click", async () => {
    mostrarVista("vista-lista");
    vistaLista.innerHTML = "";

    try {
        // OJO: esta ruta todavía no existe en el back (ver abajo)
        const respuesta = await fetch(`http://localhost:3000/mango/bandejasUsuario/${idUsuario}`);
        const bandejas = await respuesta.json();

        bandejas.forEach((bandeja) => {
            const boton = document.createElement("button");
            boton.className = "bandeja-opcion";
            boton.textContent = bandeja.nombre_bandeja;
            boton.addEventListener("click", () => guardarEnBandeja(bandeja.id));
            vistaLista.appendChild(boton);
        });
    } catch (error) {
        vistaLista.innerHTML = "<p>No se pudieron cargar tus bandejas</p>";
    }
});*/
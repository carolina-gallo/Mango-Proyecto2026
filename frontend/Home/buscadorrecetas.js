
const botonesFiltro = document.querySelectorAll(".filtro-circular, .filtros-random");
const panel = document.querySelector(".filtros-header");
const objetosFiltrados = document.getElementById("objetosfiltrados");
const flechaCerrarpopup = document.getElementById("flecha-cerrar");
const flechaImg = document.querySelector(".cerrar");
const header = document.querySelector("header");

const etiquetasFiltros = {
    celiacx: "Sin TACC",
    diabeticx: "Bajo en azúcares",
    veganx: "Vegano",
    vegetarianx: "Vegetariano",
    kosher: "Kosher",
    hipertensx: "Bajo en sodio",
    "bajo colesterol": "Bajo en colesterol",
    keto: "Keto",
    "intolerancia a la lactosa": "Sin lactosa",
    "alergia a los frutos secos": "Sin frutos secos"
};

function leerFiltros() {
    const filtros = {};
    document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado").forEach(boton => {
        filtros[boton.dataset.filtro] = true;
    });
    return filtros;
}


function buscarConFiltros() {
    const inputBuscar = document.getElementById("inputBuscar");
    const texto = inputBuscar ? inputBuscar.value.trim() : "";

    fetch("http://localhost:3000/mango/busquedaporTexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            texto: texto,           
            filtros: leerFiltros()     
        })
    })
        .then(response => response.json())
        .then(datos => {
            console.log("Resultados:", datos);
            cargarRecetas(datos.recetas, datos.usuarios);
        })
        .catch(error => console.error("Error al buscar:", error));
}


const inputBuscar = document.getElementById("inputBuscar");
if (inputBuscar) {
    let esperar;
    inputBuscar.addEventListener("input", () => {
        clearTimeout(esperar);
        esperar = setTimeout(buscarConFiltros, 300);
    });

    inputBuscar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            clearTimeout(esperar);
            buscarConFiltros();
        }
    });
}


botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        boton.classList.toggle("seleccionado");
        buscarConFiltros();
        if (panel && !panel.hidden) {
            mostrarObjetosFiltrados();
        }
    });
});

function cargarRecetas(recetas, listaUsuarios = []) {
    const lista = document.getElementById("recetas");
    if (!lista) return;

    lista.innerHTML = "";

    if (!recetas || recetas.length === 0) {
        lista.innerHTML = "<p>No se encontraron recetas con los criterios seleccionados.</p>";
        return;
    }

    const usuariosMap = new Map(listaUsuarios.map(u => [u.id || u.id_usuario, u]));

    lista.innerHTML = recetas.map(receta => {
        const autor = usuariosMap.get(receta.id_usuario) || {};
        const nombreAMostrar = autor.nombre_usuario || autor.username || autor.nombre || "Usuario";
    

        let filtrosHTML = "";
        for (let clave in receta.filtros) {
            if (receta.filtros[clave] === true) {
                let nombreLindo = etiquetasFiltros[clave] || clave;
                filtrosHTML += `<span class="filtro">${nombreLindo}</span>`;
            }
        }

        return `<section class="publicacion" data-id="${receta.id}">
                <figure class="imagen">
                    <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.nombre}">
                    <div class="usuario-info">
                        <p class="nombredeusuario">${nombreAMostrar}</p>
                    </div>
                </figure>
                <div class="contenido">
                    <h2 class="titulo">${receta.nombre}</h2>
                    <p class="descripcion">${receta.descripcion}</p>
                </div>
                <div class="interacciones">
                    <span class="icono"><img class="guardado" src="guardado.png" alt="guardar"></span>
                    <span class="icono"><img class="comentarios" src="comentariosr.png" alt="comentar"></span>
                    <span class="icono"><img class="hipervinculo" src="link.png" alt="hipervinculo"></span>
                </div>
                <div class="filtros">
                    ${filtrosHTML}
                </div>
            </section> `;
    }).join("");
}

function mostrarObjetosFiltrados() {
    if (!objetosFiltrados) return;
    const elegidos = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");
    objetosFiltrados.innerHTML = "";

    elegidos.forEach(boton => {
        const clave = boton.dataset.filtro;
        const nombreVisible = etiquetasFiltros[clave] || clave;

        objetosFiltrados.innerHTML += `
            <span class="objetofiltrado">
                ${nombreVisible}
                <span class="eliminarFiltro" data-filtro="${clave}"> ✕</span>
            </span> `;
    });
}


if (objetosFiltrados) {
    objetosFiltrados.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminarFiltro")) {
            const filtroAEliminar = e.target.dataset.filtro;
            const botonOriginal = document.querySelector(`[data-filtro="${filtroAEliminar}"]`);
            if (botonOriginal) {
                botonOriginal.classList.remove("seleccionado");
            }

            mostrarObjetosFiltrados();

            const restantes = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");
            if (restantes.length === 0) {
                objetosFiltrados.hidden = true;
            }

            buscarConFiltros();
        }
    });
}

if (flechaCerrarpopup) {
    flechaCerrarpopup.addEventListener("click", () => {
        const elegidos = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");
        const listaRecetas = document.getElementById("recetas");

        if (panel.hidden) {
            panel.hidden = false;
            if (objetosFiltrados) objetosFiltrados.hidden = true;
            if (header) header.classList.remove("omg");
            if (listaRecetas) listaRecetas.classList.remove("omg");
            if (flechaImg) flechaImg.src = "flecha-abajo.png";
        } else {
            panel.hidden = true;
            if (header) header.classList.add("omg");
            if (listaRecetas) listaRecetas.classList.add("omg");
            if (flechaImg) flechaImg.src = "flecha-arriba.png";

            if (elegidos.length === 0) {
                if (objetosFiltrados) objetosFiltrados.hidden = true;
            } else {
                if (objetosFiltrados) {
                    objetosFiltrados.hidden = false;
                    mostrarObjetosFiltrados();
                }
            }

            buscarConFiltros();
        }
    });
}


buscarConFiltros();
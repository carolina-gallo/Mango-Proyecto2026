
const botonesFiltro = document.querySelectorAll(".filtro-circular, .filtros-random");
const panel = document.querySelector(".filtros-header");
const objetosFiltrados = document.getElementById("objetosfiltrados");
const flechaCerrarpopup = document.getElementById("flecha-cerrar");
const flechaImg = document.querySelector(".cerrar");
const header = document.querySelector("header");
const lista = document.getElementById("recetas");

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

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        boton.classList.toggle("seleccionado");
        buscarConFiltros();
        if (!panel.hidden) {
            mostrarObjetosFiltrados();
        }
    });
});

function leerFiltros() {
    const filtros = {};
    document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado").forEach(boton => {
        filtros[boton.dataset.filtro] = true;
    });
    return filtros;
}
function cargarRecetas(recetas, listaUsuarios = []) {
    lista.innerHTML = "";

    if (!recetas || recetas.length === 0) {
        lista.innerHTML = "<p>No se encontraron recetas con los filtros seleccionados.</p>";
        return;
    }

    const usuariosMap = new Map(listaUsuarios.map(u => [u.id || u.id_usuario, u]));

    lista.innerHTML = recetas.map(receta => {
        const autor = usuariosMap.get(receta.id_usuario) || {};
        const nombreAMostrar = autor.nombre_usuario || autor.username || autor.nombre || "Usuario";
        const fotoPerfil = autor.foto_perfil || "avatar-default.png";

        // Creamos todos los span de filtros que estén en true
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
                        <img class="avatarUsuario" src="${fotoPerfil}" alt="${nombreAMostrar}">
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
function activarVerMas() {
  const descripciones = document.querySelectorAll(".descripcion");

  descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;
    if (completo.length > 47) {
      descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas" style="cursor: pointer; font-weight: bold;">... más</span>';
    }
    });
    };


function buscarConFiltros() {
    fetch("http://localhost:3000/mango/busqueda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filtros: leerFiltros() })
    })
        .then(response => response.json())
        .then(datos => {
            console.log("Recetas:", datos.recetas);
            cargarRecetas(datos.recetas)
            activarVerMas()
        })
        .catch(error => console.error("Error al buscar:", error));
    }
function mostrarObjetosFiltrados() {
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

// Eliminar filtros individuales desde las etiquetas
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

flechaCerrarpopup.addEventListener("click", () => {
    const elegidos = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");

    if (panel.hidden) {
        panel.hidden = false;
        objetosFiltrados.hidden = true;
        header.classList.remove("colapsado");
        lista.classList.remove("colapsado");
        flechaImg.src = "flecha-abajo.png";
    } else {
        panel.hidden = true;
        header.classList.add("colapsado");
        lista.classList.add("colapsado");
        flechaImg.src = "flecha-arriba.png";

        if (elegidos.length === 0) {
            objetosFiltrados.hidden = true;
        } else {
            objetosFiltrados.hidden = false;
            mostrarObjetosFiltrados();
        }

        buscarConFiltros();
    }
})

buscarConFiltros();
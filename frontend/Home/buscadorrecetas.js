
const botonesFiltro = document.querySelectorAll(".filtro-circular, .filtros-random");
const panel = document.querySelector(".filtros-header");
const objetosFiltrados = document.getElementById("objetosfiltrados");
const flechaCerrarpopup = document.getElementById("flecha-cerrar");
const flechaImg = document.querySelector(".cerrar");
const header = document.querySelector("header");

const nombresFiltros = {
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
}
function mostrarObjetosFiltrados() {
    if (!objetosFiltrados) return;
    const elegidos = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");
    objetosFiltrados.innerHTML = "";

    elegidos.forEach(boton => {
        const clave = boton.dataset.filtro;
        const nombreVisible = nombresFiltros[clave] || clave;

        objetosFiltrados.innerHTML += `
            <span class="objetofiltrado">
                ${nombreVisible}
                <span class="eliminarFiltro" data-filtro="${clave}"> ✕</span>
            </span> `;
    });
}


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
        flechaImg.src = "flecha-abajo.png";
    } else {
        panel.hidden = true;
        header.classList.add("colapsado");
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
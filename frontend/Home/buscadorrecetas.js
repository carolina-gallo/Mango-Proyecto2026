
const botonesFiltro = document.querySelectorAll(".filtro-circular, .filtros-random");
const panel = document.querySelector(".filtros-header");
const objetosFiltrados = document.getElementById("objetosfiltrados");
const flechaCerrarpopup = document.getElementById("flecha-cerrar");
const flechaImg = document.querySelector(".cerrar");
const header = document.querySelector("header");
const lista = document.getElementById("recetas");

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        boton.classList.toggle("seleccionado");
        buscarConFiltros();
    });
});

function leerFiltros() {
    const filtros = {};
    document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado").forEach(boton => {
        filtros[boton.dataset.filtro] = true;
    });
    return filtros;
}

function buscarConFiltros() {
    fetch("http://localhost:3000/mango/busqueda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filtros: leerFiltros() })
    })
        .then(response => response.json())
        .then(datos => {
            console.log("recetas:", datos.recetas);
        })
        .catch(error => {
            console.error("Error al buscar:", error);
        });
}
function mostrarObjetosFiltrados() {
    const elegidos = document.querySelectorAll(".seleccionado");
    objetosFiltrados.innerHTML = "";
    elegidos.forEach(boton => {
        objetosFiltrados.innerHTML += `<span class="objetofiltrado">${boton.dataset.filtro} ✕</span>`;
    });
}

flechaCerrarpopup.addEventListener("click", () => {
    const elegidos = document.querySelectorAll(".filtro-circular.seleccionado, .filtros-random.seleccionado");

    if (panel.hidden) {
        panel.hidden = false;
        objetosFiltrados.hidden = true;
        header.classList.remove("colapsado");
        lista.classList.remove("colapsado");
        flechaImg.src = "flecha-arriba.png";
    } else {
        panel.hidden = true;
        header.classList.add("colapsado");
        lista.classList.add("colapsado");
        flechaImg.src = "flecha-abajo.png";

        if (elegidos.length === 0) {
            objetosFiltrados.hidden = true;
        } else {
            objetosFiltrados.hidden = false;
            mostrarObjetosFiltrados();
        }

        buscarConFiltros();
    }
});
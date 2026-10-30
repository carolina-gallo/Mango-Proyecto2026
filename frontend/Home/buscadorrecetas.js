
const botonesFiltro = document.querySelectorAll(".filtro-circular, .filtros-random");
const panel = document.querySelector(".filtros-header");
const objetosFiltrados = document.getElementById("objetosfiltrados");
const flechaCerrarpopup = document.getElementById("flecha-cerrar");
const flechaImg = document.querySelector(".cerrar");

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
    objetosFiltrados.innerHTML = "";
    const elegidos = document.querySelectorAll(".seleccionado");
    elegidos.forEach(boton => {
        objetosFiltrados.innerHTML += `<span class="objetofiltrado">${boton.dataset.filtro} ✕</span>`;
    });
}

flechaCerrarpopup.addEventListener("click", () => {
if (panel.hidden) {
        panel.hidden = false;
        objetosFiltrados.hidden = true;
        flechaImg.src = "flecha-abajo.png"; 
    } else {
        panel.hidden = true;
        objetosFiltrados.hidden = false;
        flechaImg.src = "flecha-arriba.png";
        mostrarObjetosFiltrados();
        buscarConFiltros();
    }
});
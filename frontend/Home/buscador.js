const inputBuscar = document.getElementById("inputBuscar");
const contenedorResultados = document.getElementById("resultados");

let esperar;

function obtenerFiltros() {
    const filtros = {};

    const inputsFiltros = document.querySelectorAll(".filtro-input");
    inputsFiltros.forEach(input => {
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) filtros[input.name] = input.value;
        } else if (input.value) {
            filtros[input.name] = input.value;
        }
    });

    return filtros;
}

async function buscar(texto, filtros) {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/busquedaporTexto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto,
                filtros: filtros
            })
        });

        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

        return await respuesta.json();
    } catch (error) {
        console.error("Error al buscar:", error);
        return { usuarios: [], recetas: [], posts: [] };
    }
}

function borrarResultados() {
    if (contenedorResultados) contenedorResultados.innerHTML = "";
}


function cargarRecetas(recetas) {
    const contenedor = document.getElementById("resultados") || contenedorResultados;

    contenedor.innerHTML = "";

    if (!recetas || recetas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron recetas.</p>";
        return;
    }

    recetas.forEach((receta) => {
        const div = document.createElement("div");
        div.className = "resultado-card receta";
        div.innerHTML = `
            <h3>📖 ${receta.nombre}</h3>
            <p>${receta.descripcion || ''}</p>
        `;
        contenedor.appendChild(div);
    });
}


function mostrarResultados(datos) {
    borrarResultados();
    if (!contenedorResultados) return;

    const { recetas, usuarios, posts } = datos;

    if ((!recetas || recetas.length === 0) && 
        (!usuarios || usuarios.length === 0) && 
        (!posts || posts.length === 0)) {
        contenedorResultados.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    if (recetas) {
        cargarRecetas(recetas);
    }

    if (usuarios) {
        usuarios.forEach((usuario) => {
            const div = document.createElement("div");
            div.className = "resultado-card usuario";
            div.innerHTML = `<h3>👤 @${usuario.username}</h3>`;
            contenedorResultados.appendChild(div);
        });
    }
}


async function ejecutarBusqueda() {
    if (!inputBuscar) return;

    const texto = inputBuscar.value.trim();
    const filtros = obtenerFiltros();

    console.log("Texto:", texto);
    console.log("Filtros a enviar:", filtros);

    const resultados = await buscar(texto, filtros);
    mostrarResultados(resultados);
}


if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        clearTimeout(esperar);
        esperar = setTimeout(ejecutarBusqueda, 300);
    });
}

const elementosFiltro = document.querySelectorAll(".filtro-input");
elementosFiltro.forEach(elemento => {
    elemento.addEventListener("change", ejecutarBusqueda);
});


/*
const inputBuscar = document.getElementById("inputBuscar")
let recetas_encontrada = buscar(input_usuario);

receta_encontrada.descripcion
receta_encontrada.nombre


async function buscarRecetas(texto) {
    // Funcionalidad en comun
    const inputBuscar = document.getElementById("inputBuscar")
    const resultado = await fetch("http://localhost:3000/mango/busqueda/:{inputBuscar.value}").json();
    return await resultado;

}

resultado == [
    {
        nombre: "ñoquis con tuco",
        descripcion: "ñoquis con tuco",
        ingredientes: ["ñoquis", "tuco"],
        pasos_receta: ["cocinar los ñoquis", "hacer el tuco", "mezclar todo"],
    },
    {
        nombre: "ñoquis con crema",
        descripcion: "ñoquis con crema",
        ingredientes: ["ñoquis", "crema"],
        pasos_receta: ["cocinar los ñoquis", "hacer la crema", "mezclar todo"],
    }

]


// Script particular de cada pagina

from buscador.js import buscarReceta, buscarPosts, buscarUsuarios

recetas = buscarRecetas(input_usuario);

borrarFeedActual();
mostrarRecetas(recetas);

*/
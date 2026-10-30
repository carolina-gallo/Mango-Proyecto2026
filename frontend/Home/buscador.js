export async function buscar(texto) {
    const respuesta = await fetch(`http://localhost:3000/mango/busqueda/${texto}`);
    return await respuesta.json();
}

export function activarBuscador(mostrarResultado, volverAlInicio) {
    const inputBuscar = document.getElementById("inputBuscar");
    let esperar;

    inputBuscar.addEventListener("input", () => {
        clearTimeout(esperar);

        esperar = setTimeout(async () => {
            const texto = inputBuscar.value.trim();

            if (texto === "") {
                if (volverAlInicio) volverAlInicio();
                return;
            }

            const resultado = await buscar(texto);
            mostrarResultado(resultado);
        }, 300);
    });
}

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
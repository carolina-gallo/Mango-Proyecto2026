let timeoutBusqueda;

async function buscarPosts(texto) {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/busquedaporTexto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto,
                filtros: {}
            })
        });

        if (!respuesta.ok) throw new Error("Error en la respuesta del backend");

        return await respuesta.json();
    } catch (error) {
        console.error("Error al buscar posts:", error);
        return { posts: [], usuarios: [] };
    }
}

async function ejecutarBusqueda() {
    const texto = inputBuscar ? inputBuscar.value.trim() : "";
    const datos = await buscarPosts(texto);

    mostrarPosts(datos.posts, usuarios);
    activarVerMas();
}

if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(ejecutarBusqueda, 300);
    });

    inputBuscar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            clearTimeout(timeoutBusqueda);
            ejecutarBusqueda();
        }
    });
}
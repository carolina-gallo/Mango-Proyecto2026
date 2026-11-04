let usuarios = [];
const containerPerfiles = document.getElementById("perfiles");
const inputBuscar = document.getElementById("inputBuscar");

let timeoutBusqueda;

function mostrarPerfiles(lista) {
    containerPerfiles.innerHTML = "";
    lista.forEach(usuario => {
        containerPerfiles.innerHTML += `
        <section class="perfil" data-id="${usuario.id}">
            <figure>
                <img src="../avatares/${usuario.foto_perfil}.png" alt="${usuario.username}" class="foto">
            </figure>
            <div class="columna">
                <h2 class="nombreusuario">${usuario.username}</h2>
                <p class="descripcion">${usuario.descripcion || ""}</p>
            </div>
        </section>`;
    });
}

fetch("http://localhost:3000/listaUsuarios")
    .then(response => response.json())
    .then(data => {
        usuarios = data;
        mostrarPerfiles(usuarios);
    })
    .catch(error => {                   
        console.error('Error al encontrar perfiles:', error);
    });

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
        return { usuarios: [] };
    }
}

async function ejecutarBusqueda() {
    const texto = inputBuscar ? inputBuscar.value.trim() : "";
    if (texto === "") {
        mostrarPerfiles(usuarios);
        return;
    }
    const datos = await buscarPosts(texto);
    const usuariosEncontrados = Array.isArray(datos) ? datos : (datos.usuarios || []);
    mostrarPerfiles(usuariosEncontrados);
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

containerPerfiles.addEventListener("click", (e) => {
    // Busca la tarjeta del perfil donde se hizo clic
    const tarjeta = e.target.closest(".perfil");
    
    if (tarjeta && tarjeta.dataset.id) {
        const idAjeno = Number(tarjeta.dataset.id);
        
        // Guardamos explícitamente en el localStorage
        localStorage.setItem("idPerfilAjeno", idAjeno);
        
        // Redirigimos
        irAPerfil(idAjeno);
    }
});